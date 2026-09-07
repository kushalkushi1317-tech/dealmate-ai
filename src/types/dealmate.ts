export type ProductCategory = "running_shoes" | "earbuds";

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  running_shoes: "Running Shoes",
  earbuds: "Earbuds",
};

export const PREFERENCE_OPTIONS = [
  "comfort",
  "battery life",
  "low latency",
  "lightweight",
  "durability",
  "microphone",
] as const;

export type AgentId = "preference" | "hunter" | "negotiation";

export const AGENTS: Record<AgentId, { label: string; accent: "gold" | "sage" | "coral" }> = {
  preference: { label: "Preference Agent", accent: "gold" },
  hunter: { label: "Deal-Hunter", accent: "sage" },
  negotiation: { label: "Negotiation Agent", accent: "coral" },
};

export type DealStatus =
  | "REQUESTED"
  | "SELLER_VIEWED"
  | "NEGOTIATING"
  | "COUNTER_OFFER"
  | "OFFER_SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED"
  | "ORDERED";

export interface LiveOffer {
  id: string;
  product_id: string;
  discount_pct: number;
  expires_at: string;
  active: boolean;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  category: ProductCategory;
  price: number;
  tags: string[];
  image_url: string;
  stock_count: number;
  created_at: string;
}

export interface RankedProduct extends Product {
  seller_name: string;
  effective_price: number;
  discount_pct: number;
  offer: LiveOffer | null;
  score: number;
}

export interface ShopperPreferences {
  category: ProductCategory;
  budget_min: number;
  budget_max: number;
  preferences: string[];
}

export interface DealItem {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  list_price: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent" | "system";
  agent: AgentId | null;
  content: string;
  createdAt: string;
}
