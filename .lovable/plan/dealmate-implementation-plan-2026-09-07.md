# DealMate — implementation plan

"Shop smarter. Negotiate better." An AI shopping agent that finds products, negotiates within seller-set limits, and places real orders — plus real-time buyer↔seller bulk deal chat.

## Two decisions worth flagging up front

1. **Routing / server code.** This project runs on React + TypeScript + Vite with TanStack Router and built-in server functions. That satisfies your React/TS/Vite/Tailwind requirement, but the server-side AI and order logic will live in typed server functions in this app rather than separate Edge Function folders. Same security boundary (keys and seller limits stay server-only, nothing sensitive in the browser), fewer moving parts. React Router would have to be swapped out and is not supported here.
2. **Logo.** No logo file came through with the message. I'll generate a DealMate mark and wire it through one central asset config so swapping in your real logo later is a one-file change. Send the image whenever you like.

Everything else follows your spec: real accounts, real database rows, real stock decrements, server-validated prices, live updates without refresh, no mocks outside the landing-page demo.

## Phases

### Phase 1 — Design system
Dark dealmaking palette (#15120E backgrounds through gold #E8A33D, sage #7FA88A, coral #E88C6B) as semantic tokens in `src/styles.css`; display + grotesk + mono type pairing loaded in the root layout; button/badge/card variants; agent identity tokens; reduced-motion support. Files: `src/styles.css`, `src/routes/__root.tsx`, `src/config/brand.ts`, shadcn variants.
Accept: no hardcoded colors anywhere later; tokens render correctly at 360px and desktop.

### Phase 2 — Backend + database
Enable the built-in cloud backend, then one migration creating: `products`, `live_offers`, `negotiation_sessions`, `conversation_messages`, `orders`, `carts`, `cart_items`, `seller_deal_sessions`, `seller_deal_messages`, `seller_deal_offers`, `user_roles` (roles in their own table — never on a profile row), plus enums for stages and deal statuses, foreign keys, indexes, timestamps, and grants. RLS: buyers reach only their own carts, sessions, messages, offers, orders; sellers reach only negotiations touching their own products; seller discount ceilings and product cost floors live in a server-only table buyers can never read. Seed 8 products across Running Shoes and Earbuds with generated imagery, and 3 live offers with real expiry times.
Accept: cross-user reads return nothing; seeded catalog renders.

### Phase 3 — Authentication
Split asymmetric sign-up/sign-in page, email + password, validation, loading/error/success states, persistent sessions, logout, protected areas, seller role gate.
Accept: refresh keeps you signed in; protected pages bounce signed-out visitors.

### Phase 4 — Landing page
Hero with the animated three-agent conversation ending in ₹2,999 → ₹2,549, trust strip, three-agent section, "Watch the price move" interactive before/after, four-step process, closing CTA. Demo data only here.
Accept: restrained motion, correct copy, unique page title/description.

### Phase 5 — Chat experience
`ChatSessionView`: ~55/45 conversation and deal workspace on desktop, adaptive on tablet, conversation-first on mobile with a compact deal panel. Agent-labelled messages with accent lines, fast typing indicators, top nav with logo, session state, Cart, Orders, Account, Logout.
Accept: keyboard usable, no blank states.

### Phase 6 — Preference Agent
Max three questions: category (restricted to what exists in the catalog), min/max budget in INR, one or two priorities. Model call server-side, strict JSON, schema-validated, one retry, graceful failure. Provider layer isolated so the model vendor can change later.
Accept: structured validated preferences persist to the session.

### Phase 7 — Deal-Hunter
Deterministic, no model: filter by category, budget ±15%, active offers; rank by relevance, budget fit, tag match, effective price, offer availability; top 3. Premium product cards with image, tags, original vs effective price, discount, stock, offer countdown, negotiation state; layout animation on appearance/reorder.
Accept: same input gives same ranking; empty state when nothing matches.

### Phase 8 — Negotiation Agent
Server function proposes and re-prices on push-back, capped at 15% single-item; the response is recalculated and validated server-side before it reaches the browser. UI shows original struck through, negotiated price dominant with one scale-in, "DEAL SECURED" and "WITHIN SELLER DEAL RULES" — the internal limit is never sent to the client.
Accept: a crafted client request for 40% off is rejected server-side.

### Phase 9 — Live updates
Realtime subscriptions on offers, stock, deal sessions, deal messages and offers. No polling, no fake timers.
Accept: a seller edit in a second browser shows up for the shopper in about two seconds.

### Phase 10 — Cart + bulk deal request
Cart grouped by seller with quantities, per-item offers, subtotals, totals, stock. At 2+ items the "Ask Seller for a Better Deal" / REQUEST BULK DEAL action appears, with optional target price and message, creating a real deal session per seller.
Accept: multi-seller cart creates separate sessions; no seller can touch another's items.

### Phase 11 — Buyer ↔ seller negotiation
Real-time conversation with offers and counter-offers, every offer stored, states REQUESTED through ORDERED, server-side validation of prices, offers, stock, seller permission, cart value, expiry and the 20% bulk ceiling (min 2 items). Seller offers expire on a server timestamp with a visible countdown and an expired state that lets the buyer ask again. Acceptance locks a validated deal record; DEAL LOCKED panel shows original, discount, savings, final, then Proceed to Checkout.
Accept: an edited client-side total is refused; expired offers cannot be accepted.

### Phase 12 — Orders
`OrderModal` with quantity stepper, negotiated unit price, delivery address, subtotal, total. Server function re-validates user, price, product, stock, then atomically decrements stock and inserts the order in one transaction. Success shows "Deal locked in.", real order ID with copy, product, quantity, total, address, subtle celebration. Same path for locked bulk deals. No payment gateway.
Accept: concurrent orders can't oversell stock.

### Phase 13 — Orders history
`OrdersHistoryPage` with order ID, product, quantity, negotiated price, total, date, status, plus past negotiation sessions; loading, empty, error states; own records only.

### Phase 14 — Seller/Admin view
Lightweight `AdminView`: products, stock edits, create/update/activate offers with expiry, basic orders, and a Deal Requests section (new, active, counter-offers, accepted, expired, rejected) opening the live buyer conversation beside cart details — drawer on mobile. Role-gated on the server, not the client.

### Phase 15 — Polish, accessibility, verification
Responsive pass 360px→desktop, motion review, focus states, ARIA, contrast, accessible modals and form errors, lazy-loaded pages, image optimisation, per-page titles and descriptions. Then I drive the full flow in a real browser: sign in, converse, negotiate, push back, add multiple items, bulk-negotiate as buyer and seller in two sessions, accept, order, confirm stock dropped and the order row exists, and confirm live updates. Plus a short README covering environment variables, local development and deployment.

## What I need from you
- The DealMate logo image (optional — I'll generate a placeholder mark otherwise).
- Approval to start Phase 1.
