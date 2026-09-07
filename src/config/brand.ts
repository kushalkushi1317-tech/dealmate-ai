import logo from "@/assets/dealmate-logo.png";

/**
 * Single place to change DealMate branding. Swap `logoSrc` to replace the logo
 * everywhere (landing, nav, auth, chat, seller view, loading states).
 */
export const brand = {
  name: "DealMate",
  tagline: "Shop smarter. Negotiate better.",
  logoSrc: logo,
  logoAlt: "DealMate logo",
  currency: "INR" as const,
} as const;
