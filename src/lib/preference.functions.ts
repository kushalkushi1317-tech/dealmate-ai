import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const categorySchema = z.enum(["running_shoes", "earbuds"]);

const extractionSchema = z.object({
  category: categorySchema.nullable(),
  budget_min: z.number().nullable(),
  budget_max: z.number().nullable(),
  preferences: z.array(z.string()).default([]),
  reply: z.string(),
});

export type PreferenceExtraction = z.infer<typeof extractionSchema>;

const inputSchema = z.object({
  sessionId: z.string().uuid(),
  message: z.string().min(1).max(600),
  known: z.object({
    category: categorySchema.nullable(),
    budget_min: z.number().nullable(),
    budget_max: z.number().nullable(),
    preferences: z.array(z.string()),
  }),
});

/**
 * Preference Agent — the only LLM step in the shopping flow. It turns free text
 * into structured, validated preferences. It never prices or negotiates.
 */
export const interpretShopperMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: session, error: sessionError } = await supabase
      .from("negotiation_sessions")
      .select("id, user_id")
      .eq("id", data.sessionId)
      .maybeSingle();
    if (sessionError) throw new Error(sessionError.message);
    if (!session || session.user_id !== userId) throw new Error("session_not_found");

    const { generateJson } = await import("./ai.server");

    const result = await generateJson({
      schema: extractionSchema,
      system: [
        "You are DealMate's Preference Agent for an Indian online store.",
        "Only two categories exist: running_shoes and earbuds. Never invent others.",
        "Extract: category, budget_min and budget_max in INR, and 1-2 short preference keywords",
        "such as comfort, battery life, low latency, lightweight, durability, microphone.",
        "If the shopper gives only one budget number, treat it as budget_max and set budget_min to 0.",
        "Ask at most one short question at a time, and only about a field that is still unknown.",
        "When category, budget and preferences are all known, reply with a single confirming sentence and no question.",
        'JSON shape: {"category":string|null,"budget_min":number|null,"budget_max":number|null,"preferences":string[],"reply":string}',
      ].join(" "),
      user: [
        `Known so far: ${JSON.stringify(data.known)}`,
        `Shopper says: ${data.message}`,
      ].join("\n"),
    });

    const merged = {
      category: result.category ?? data.known.category,
      budget_min: result.budget_min ?? data.known.budget_min,
      budget_max: result.budget_max ?? data.known.budget_max,
      preferences: (result.preferences.length ? result.preferences : data.known.preferences)
        .map((p) => p.toLowerCase().trim())
        .filter(Boolean)
        .slice(0, 2),
    };

    const complete =
      merged.category !== null && merged.budget_max !== null && merged.preferences.length > 0;

    if (complete) {
      const { error: updateError } = await supabase
        .from("negotiation_sessions")
        .update({
          category: merged.category,
          budget_min: merged.budget_min ?? 0,
          budget_max: merged.budget_max,
          preferences: merged.preferences,
          stage: "matching",
        })
        .eq("id", data.sessionId);
      if (updateError) throw new Error(updateError.message);
    }

    return { reply: result.reply.trim(), preferences: merged, complete };
  });
