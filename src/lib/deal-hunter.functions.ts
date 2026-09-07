import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import type { LiveOffer, RankedProduct } from "@/types/dealmate";

const inputSchema = z.object({
  category: z.enum(["running_shoes", "earbuds"]),
  budgetMin: z.number().min(0),
  budgetMax: z.number().min(1),
  preferences: z.array(z.string()).max(4),
});

/**
 * Deal-Hunter — fully deterministic. No LLM: database filtering plus a fixed
 * ranking function, so the same request always returns the same top 3.
 */
export const discoverProducts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data, context }): Promise<RankedProduct[]> => {
    const { supabase } = context;
    const min = data.budgetMin * 0.85;
    const max = data.budgetMax * 1.15;

    const { data: products, error } = await supabase
      .from("products")
      .select("*, seller_accounts(name), live_offers(*)")
      .eq("category", data.category)
      .gte("price", min)
      .lte("price", max);
    if (error) throw new Error(error.message);

    const wanted = data.preferences.map((p) => p.toLowerCase());
    const now = Date.now();

    const ranked = (products ?? []).map((row) => {
      const offers = ((row.live_offers ?? []) as LiveOffer[]).filter(
        (offer) => offer.active && new Date(offer.expires_at).getTime() > now,
      );
      const best = offers.sort((a, b) => Number(b.discount_pct) - Number(a.discount_pct))[0] ?? null;
      const price = Number(row.price);
      const offerPct = best ? Number(best.discount_pct) : 0;
      const effective = Math.round(price * (1 - offerPct / 100));

      const tags = (row.tags ?? []).map((t: string) => t.toLowerCase());
      const tagHits = wanted.filter((w) => tags.some((t) => t.includes(w) || w.includes(t))).length;

      const budgetFit =
        effective <= data.budgetMax
          ? 1 - Math.abs(data.budgetMax - effective) / Math.max(data.budgetMax, 1)
          : 0.2;

      const score =
        40 + // category already matched by the query
        tagHits * 18 +
        budgetFit * 22 +
        (best ? 12 : 0) +
        (row.stock_count > 0 ? 6 : -40);

      return {
        ...row,
        price,
        seller_name: (row.seller_accounts as { name: string } | null)?.name ?? "DealMate Seller",
        effective_price: effective,
        discount_pct: offerPct,
        offer: best,
        score: Math.round(score * 100) / 100,
      } as RankedProduct;
    });

    return ranked
      .sort((a, b) => b.score - a.score || a.effective_price - b.effective_price)
      .slice(0, 3);
  });
