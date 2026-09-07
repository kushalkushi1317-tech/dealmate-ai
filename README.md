# DealMate AI

DEALMATE — AI SHOPPING NEGOTIATOR

You are a senior product designer, UX engineer, frontend engineer, backend engineer, database architect, and security engineer.

Build DEALMATE, a production-quality AI-powered conversational shopping and price-negotiation web application.

Tagline:
“Shop smarter. Negotiate better.”

The final product must feel like a real premium startup product suitable for a hackathon, portfolio, startup demo, investor presentation, or production MVP.

1. CORE PRODUCT

DealMate is an AI shopping agent that allows users to:

Describe what they want.

Answer a maximum of 3 preference questions.

Discover relevant products.

Compare current prices and live seller offers.

Ask DealMate to negotiate.

Push back on the proposed price.

Receive a server-validated negotiated price.

Accept the deal.

Place a real order without leaving the experience.

View order and negotiation history.

The experience should feel like:

“Talking to a smart personal shopping agent that can actually make a deal.”

Conversational commerce is the core experience.

2. TECHNOLOGY

Use:

React

TypeScript

Vite

Tailwind CSS

Supabase PostgreSQL

Supabase Auth

Supabase Realtime

Supabase Edge Functions

Recommended libraries where useful:

Motion / Framer Motion

Lucide React

shadcn/ui

React Router

Zod

TanStack Query

Sonner

Do NOT replace React + TypeScript with another frontend framework.

Keep the architecture modular and developer-friendly.

Do not create one giant component.

Avoid unnecessary dependencies and abstractions.

3. DESIGN DIRECTION

The UI must feel:

Premium

Modern

Sophisticated

Warm

Trustworthy

Interactive

Slightly futuristic

Retail-focused

Human

High-end but practical

Do NOT make it look like:

A generic SaaS dashboard

A banking dashboard

A generic chatbot

Excessive glassmorphism

Generic blue/purple AI branding

Excessive gradients

Excessive rounded cards

Excessive shadows

Emoji-heavy UI

A template

The negotiation interaction must be the visual centerpiece.

The interface should communicate trust and transparency.

4. VISUAL SYSTEM

Use this dark premium dealmaking palette:

Background: #15120E
Secondary: #1A1610
Panel: #1F1B15
Elevated surface: #28221A
Border: #3A3226
Negotiation Gold: #E8A33D
Agent Sage: #7FA88A
Negotiation Coral: #E88C6B
Primary text: #F4EFE6
Muted text: #9C9284

Typography:

Modern display sans-serif for headings

Clean grotesk/system sans-serif for body

Monospace selectively for prices, discounts, order IDs, agent/status labels and live-offer data

Use the colors consistently throughout the application.

5. LOGO

Use the provided/uploaded DealMate logo image as the official application logo.

Use the same logo consistently across:

Landing page

Navigation

Authentication

Chat experience

Seller/Admin interface

Loading states

Appropriate mobile layouts

Do not replace the provided logo with a generic icon.

Keep the logo easy to change later through a centralized asset/configuration.

6. LANDING PAGE

Create a highly polished marketing landing page.

Hero:

Eyebrow:

AI-POWERED SHOPPING NEGOTIATION

Headline:

“Don't just shop. Make a deal.”

Supporting text should explain that DealMate understands user preferences, finds products, checks active offers, negotiates within seller-defined limits, and allows immediate ordering.

Primary CTA:

Start Deal Hunting

Secondary CTA:

See How It Works

Interactive hero preview

Show a realistic animated DealMate conversation.

Example:

User:
“I need wireless earbuds under ₹3,000 with strong battery life.”

Preference Agent:
“Got it. Any must-have features?”

User:
“Good microphone and low latency.”

Deal-Hunter:
“Found 3 strong matches.”

Product appears.

Negotiation Agent:
“I can get these to ₹2,549.”

Show:

Original: ₹2,999
Negotiated: ₹2,549

Animate the transition subtly.

Use Motion for:

Message entrance

Product appearance

Price transformation

Discount badge

Negotiation state

CTA interactions

Keep animations restrained and believable.

7. LANDING PAGE SECTIONS

After hero:

Trust/value strip

Show:

REAL PRODUCTS

LIVE OFFERS

BOUNDED NEGOTIATION

REAL ORDERS

Three-agent section

Heading:

“Three agents. One shopping experience.”

Agent 01 — Preference Agent
“Understands what actually matters to you.”

Agent 02 — Deal-Hunter
“Finds the strongest products and active offers.”

Agent 03 — Negotiation Agent
“Pushes for a better deal without breaking seller rules.”

Agent identities:

Preference = Gold
Deal-Hunter = Sage
Negotiation = Coral

Use visual elements rather than relying only on icons.

Price section

Heading:

“Watch the price move.”

Create an interactive before/after negotiation visualization.

Process section

Heading:

“From conversation to checkout.”

Show:

Tell us what you need
→ Find your matches
→ Negotiate
→ Order

Finish with a strong CTA.

8. AUTHENTICATION

Create a premium authentication experience.

Do not use a generic form.

Use a split or asymmetric layout.

Support:

Signup

Login

Email/password

Logout

Persistent sessions

Validation

Loading states

Error states

Success feedback

Protected routes

Authentication must use real Supabase Auth.

Never fake authentication.

9. MAIN SHOPPING EXPERIENCE

Create:

ChatSessionView

Desktop layout:

Approximately:

55% conversation

45% product/deal workspace

But avoid making it look like two rigid dashboard columns.

Top navigation:

DealMate logo

Session indicator

Orders

Account

Logout

The overall experience should feel like an AI shopping workspace.

10. CHAT

Messages must feel premium, compact, and readable.

Agents:

PREFERENCE AGENT — Gold
DEAL-HUNTER — Sage
NEGOTIATION AGENT — Coral

Do not rely only on avatars.

Use:

Agent labels

Accent lines

Typography

Subtle visual identity

Typing indicators should appear quickly after user input.

Use natural message entrance animations.

Avoid excessive chat bubbles.

The experience should feel more premium than a normal messaging app.

11. PREFERENCE FLOW

Preference Agent asks no more than 3 short questions.

Question 1:

“What are you shopping for?”

Categories must be restricted to products actually available in the database.

Initial categories:

Running Shoes

Earbuds

Question 2:

“What budget are you working with?”

Collect:

Minimum budget

Maximum budget

Currency = INR

Question 3:

“What matters most?”

Allow 1–2 preferences.

Examples:

Comfort

Battery life

Low latency

Lightweight

Durability

Return structured validated data.

Do not ask unnecessary questions.

12. PRODUCT DISCOVERY

Deal-Hunter is NOT an LLM.

Use deterministic database querying and ranking.

Filter products by:

Category

Budget ±15%

Active live offers

Rank by:

Category relevance

Budget fit

Tag relevance

Effective price

Active offer availability

Return the top 3 products.

13. PRODUCT CARDS

Create premium interactive product cards.

Each card includes:

Product image

Product name

Category

Tags

Original price

Effective price

Discount

Stock status

Negotiation state

Live offer status

Interactions:

Subtle elevation

Image movement

Border emphasis

Price emphasis

Use Motion layout animations when products appear or reorder.

Do not over-animate.

14. PRODUCTS / SEED DATA

Seed at least 8 products.

Use exactly two categories:

Running Shoes

Earbuds

Every product must contain:

ID

Name

Category

Price

Tags

Image URL

Stock count

Created timestamp

Use believable product names and royalty-free/generated product imagery.

Do not depend on unclear copyrighted brand imagery.

Create 2–3 active live offers with realistic expiry times.

15. NEGOTIATION

Negotiation is the signature DealMate feature.

Example:

Product:

Running Shoes X

Original:

₹4,999

DealMate:

“I found room to improve this one.”

Then:

₹4,999 → ₹4,399

User:

“Can you do ₹4,000?”

Negotiation Agent:

“I can't go that far, but I can do ₹4,249.”

Clearly communicate that negotiation operates within seller-defined limits.

Display:

SELLER LIMIT PROTECTED

or:

WITHIN SELLER DEAL RULES

Never expose the actual internal seller limit.

The user must understand that DealMate cannot negotiate infinitely.

16. NEGOTIATION SECURITY

Server-side rules:

Maximum single-item discount: 15%

Maximum bundle discount: 20%

Bundle minimum: 2 items

These rules MUST be enforced server-side.

Never trust frontend calculations.

Never trust raw LLM output.

The browser must never contain:

LLM API keys

Seller secret limits

Negotiation authority

Service-role keys

Private server logic

The server must validate every negotiated price.

The frontend only displays the validated result.

17. NEGOTIATION UI

When negotiation succeeds:

Original:

₹4,999

Negotiated:

₹4,249

Make the new price visually dominant.

Use one satisfying scale-in transition.

Add:

DEAL SECURED

Do not repeatedly animate the price.

18. ORDER FLOW

Clicking a negotiated product opens:

OrderModal

Create a premium checkout confirmation.

Include:

Product

Quantity stepper

Negotiated unit price

Delivery address

Subtotal

Total

Confirm Order button

Do not integrate a payment gateway unless explicitly requested later.

The order must be a real Supabase database record.

When confirming:

Validate authenticated user.

Validate negotiated price server-side.

Validate product.

Validate stock.

Atomically decrement stock.

Insert order.

Return real order ID.

Never simulate these operations.

19. ORDER SUCCESS

After successful order:

Show:

“Deal locked in.”

Then display:

Order ID

Product

Quantity

Total

Delivery address

Use subtle celebration animation.

Do not use excessive confetti.

Allow the user to copy the order ID.

20. REALTIME

Use Supabase Realtime.

Do not use polling.

Do not use setInterval to fake realtime.

Changes must appear without page refresh.

Realtime events:

Live offer changes

Stock changes

If a seller changes an active offer in another browser, the shopper must see the update automatically.

If stock changes, product availability must update automatically.

Target approximately 2-second visible update latency.

21. ORDER HISTORY

Create:

OrdersHistoryPage

Display:

Order ID

Product

Quantity

Negotiated price

Total

Date

Status

Also show previous negotiation sessions where useful.

Include:

Loading state

Empty state

Error state

Responsive layout

Users can only access their own records.

22. SELLER / ADMIN VIEW

Create:

AdminView

Keep it lightweight and focused.

Seller can:

View products

Change stock

Create offers

Update offers

Activate/deactivate offers

See offer expiry

View basic order information

This interface exists primarily to demonstrate that shopper data is connected to real seller-controlled data.

Do not build an unnecessarily large admin dashboard.

Protect admin functionality properly.

23. DATABASE

Use Supabase PostgreSQL.

Tables:

products

id

name

category

price

tags

image_url

stock_count

created_at

live_offers

id

product_id

discount_pct

expires_at

active

created_at

negotiation_sessions

id

user_id

created_at

category

budget_min

budget_max

preferences

stage

product_id

final_price

conversation_messages

id

session_id

role

agent

content

created_at

orders

id

user_id

product_id

quantity

negotiated_price

delivery_address

created_at

status

Use:

Foreign keys

Indexes

Constraints

Appropriate enums

Timestamps

24. SECURITY / RLS

Implement Supabase Row Level Security.

Users can only access their own:

Negotiation sessions

Conversation messages

Orders

Seller/admin operations must be appropriately protected.

Never expose:

Service-role key

LLM API keys

Seller negotiation limits

Private server logic

Use environment variables correctly.

25. BACKEND AI

Use Supabase Edge Functions.

Functions:

preference-agent

negotiation-agent

place-order

LLM calls must happen server-side.

Support an architecture where the LLM provider can later be switched between:

OpenAI

Anthropic Claude

Keep provider-specific code isolated.

26. LLM VALIDATION

All LLM prompts must require strict JSON.

Server flow:

Call LLM.

Parse JSON.

Validate schema with Zod.

Retry malformed output once.

Return a graceful error if validation still fails.

Never trust raw LLM output.

27. FRONTEND ARCHITECTURE

Use a maintainable structure such as:

src/

components/

MessageBubble.tsx

ProductCard.tsx

ProductGrid.tsx

AgentSidebar.tsx

OrderModal.tsx

...

pages/

LandingPage.tsx

AuthPage.tsx

ChatSessionView.tsx

OrdersHistoryPage.tsx

AdminView.tsx

hooks/

lib/

services/

types/

utils/

routes/

styles/

Separate business logic from UI.

Use strong TypeScript types.

Avoid any.

28. RESPONSIVE DESIGN

Support:

360px mobile → large desktop

Desktop:

Conversation + product workspace.

Tablet:

Adaptive layout.

Mobile:

Conversation-first experience.

Products should appear below the conversation or through a compact deal panel.

Do not simply shrink the desktop interface.

Optimize:

Touch targets

Typography

Navigation

Modals

Product cards

Chat input

29. MOTION

Use Motion/Framer Motion where it adds value.

Use animations for:

Page transitions

Message entrance

Typing indicators

Product appearance

Product ranking

Price transformation

Modal entrance

Success states

Hover interactions

Respect:

prefers-reduced-motion

When reduced motion is enabled, remove non-essential movement.

Avoid:

Infinite decorative animations

Excessive bouncing

Constant floating elements

Slow transitions

30. MICRO-INTERACTIONS

Polish:

Button hover

Button press

Input focus

Loading

Disabled states

Success

Error

Copy order ID

Quantity changes

Offer expiry

Stock updates

Negotiation acceptance

Product hover

Every important interaction should have meaningful visual feedback.

31. LIVE OFFER EXPIRY

Show live offer status such as:

LIVE DEAL

Ends in 04:21

The database/server is the source of truth.

The frontend may display a countdown using expires_at.

Never use fake validity timers.

Handle expired offers gracefully.

32. STATES

Every important screen must handle:

Loading

Empty

Error

Success

Examples:

No products found

No previous orders

Negotiation unavailable

Offer expired

Product out of stock

Network error

Authentication error

Order failed

Never show blank screens.

33. ACCESSIBILITY

Implement:

Semantic HTML

Keyboard navigation

Visible focus states

ARIA labels where necessary

Good contrast

Accessible modals

Accessible buttons

Accessible form validation

Reduced-motion support

Do not sacrifice accessibility for visual design.

34. PERFORMANCE

Optimize for real-world performance.

Avoid unnecessary re-renders

Lazy-load pages where useful

Optimize product images

Avoid unnecessary dependencies

Avoid expensive animations

Keep UI responsive during AI requests

Use appropriate caching/query strategies

35. NO FAKE FUNCTIONALITY

This is a critical requirement.

Do NOT fake:

Authentication

Database operations

Orders

Stock

Negotiation validation

Realtime

Seller limits

Production LLM responses

Only the landing-page marketing preview may use controlled demo data.

The authenticated application must use real backend functionality.

36. END-TO-END DEMO

The complete working flow must be:

User enters DealMate.

User:

“I need running shoes under ₹5,000.”

Preference Agent:

“What matters most?”

User:

“Comfort and lightweight.”

Deal-Hunter:

Finds 3 relevant products.

Products appear with animated ranking.

Negotiation Agent proactively presents the strongest option.

User pushes back.

DealMate negotiates within server-side seller rules.

Validated price changes.

User accepts.

Order modal opens.

User selects quantity and delivery address.

Order is created in Supabase.

Stock decreases atomically.

Real order ID appears.

Open Seller/Admin view in another browser.

Change stock or live offer.

Shopper receives the update without refreshing.

This entire flow must work end-to-end.

37. CODE QUALITY

Production-quality code only.

Use:

TypeScript

Clear naming

Small reusable components

Proper error handling

Proper loading states

Strong types

Clean imports

Separation of concerns

Do NOT leave:

Dead code

Unused dependencies

Placeholder components

TODOs for core functionality

“Coming soon” sections

Fake implementations

38. DEVELOPMENT PROCESS

IMPORTANT:

Do NOT immediately generate the entire application.

First analyze the specification.

Then create a detailed implementation plan divided into:

PHASE 1

Project setup + design system

PHASE 2

Supabase database + RLS

PHASE 3

Authentication

PHASE 4

Landing page

PHASE 5

Chat experience

PHASE 6

Preference Agent

PHASE 7

Deal-Hunter

PHASE 8

Negotiation Agent

PHASE 9

Realtime

PHASE 10

Atomic order placement

PHASE 11

Orders history

PHASE 12

Seller/Admin view

PHASE 13

Responsive polish + animations

PHASE 14

Testing

PHASE 15

Deployment

For every phase specify:

Files created/modified

Dependencies

Database changes

Security implications

Implementation steps

Tests

Prerequisites

Acceptance criteria

STOP after presenting the plan.

Wait for approval before starting Phase 1.

39. ARCHITECTURAL TRANSPARENCY

Do not make major architectural decisions silently.

If a decision materially affects:

Security

Database structure

Frontend architecture

Performance

Maintainability

Deployment

Briefly explain the decision before implementing it.

Never replace an explicit requirement with a simpler mock.

40. FRONTEND + BACKEND ACCESSIBILITY

The project must be easy for developers to access and modify.

Provide clear separation between:

Frontend

Supabase database

Edge Functions

Authentication

Configuration

Environment variables

Shared types

Services

Document required environment variables.

Provide clear local development instructions.

Provide clear deployment instructions.

Do not hard-code secrets.

The developer should be able to understand where each major feature lives without searching through the entire codebase.

41. FINAL QUALITY BAR

The final product should create the immediate impression:

“Wow, this actually feels like a real AI shopping product.”

Prioritize:

Exceptional shopping UX

Beautiful negotiation interaction

Real backend functionality

Trustworthy price/offer presentation

Responsive design

Security

Accessibility

Maintainability

Performance

Production-quality polish

Build the experience, not merely the feature list.

Start by analyzing this specification and producing the complete phased implementation plan.

Do not implement Phase 1 until I explicitly approve the plan.                                                            42. BUYER–SELLER DIRECT DEAL COMMUNICATION

Add a real-time communication system between the buyer and seller for cart-level and bulk negotiations.

This is an important extension of DealMate.

The buyer should not only negotiate with the AI. When the buyer has multiple products/items in the cart, the system should allow the buyer to send a bulk discount request directly to the seller.

The seller can review the cart, communicate with the buyer, and provide a custom discount within the seller's allowed limits.

42.1 CART-BASED NEGOTIATION

When a user adds products to the cart:

Show:

Product

Quantity

Individual price

Current offer

Subtotal

Current discount

Cart total

Seller

Available stock

If the cart contains multiple items or the quantity reaches the bulk-negotiation threshold, show:

“Ask Seller for a Better Deal”

Example:

Cart:

3 × Running Shoes
2 × Earbuds

Current total:

₹15,000

Button:

REQUEST BULK DEAL

42.2 BULK DEAL REQUEST

When the buyer clicks Request Bulk Deal, open a negotiation panel.

Show:

Your Cart

List all products and quantities.

Then allow the buyer to send a message:

Example:

“I'm buying 5 items. Can you give me a better price?”

Allow an optional target price or target discount.

Example:

Current total: ₹15,000

My target: ₹13,000

The buyer submits the request.

Create a real database negotiation session.

Do NOT simulate this.

42.3 SELLER NOTIFICATION

The seller should immediately receive the request in the Seller/Admin interface.

Show:

NEW BULK DEAL REQUEST

Include:

Buyer/session ID

Products

Quantities

Current cart value

Current offers

Requested target price

Requested discount

Buyer message

Request timestamp

Negotiation status

Seller actions:

Accept

Counter Offer

Reject

Send Message

42.4 BUYER ↔ SELLER CHAT

Create a dedicated real-time negotiation conversation.

Example:

BUYER:

“I’m taking 5 items. Can you give me a better price?”

SELLER:

“I can offer 10% off for the full cart.”

BUYER:

“Can you do 13%?”

SELLER:

“13% works if you confirm all 5 items.”

BUYER:

“Deal.”

The communication must happen in real time using Supabase Realtime.

Do not use polling.

Messages must appear without refreshing the page.

42.5 NEGOTIATION STATES

Use clear states:

REQUESTED

SELLER_VIEWED

NEGOTIATING

COUNTER_OFFER

OFFER_SENT

ACCEPTED

REJECTED

EXPIRED

CANCELLED

ORDERED

The buyer and seller should always understand the current state.

42.6 SELLER DISCOUNT

The seller can create a custom bulk discount.

For example:

Cart value:

₹15,000

Seller offer:

10% OFF

New total:

₹13,500

Show the calculation clearly.

The seller can also provide a fixed negotiated total if allowed by the backend rules.

Example:

Original: ₹15,000
Seller Deal: ₹13,200
Savings: ₹1,800

42.7 COUNTER-OFFER SYSTEM

The buyer can counter the seller's offer.

Example:

Seller:

“10% off.”

Buyer:

“Can you do 13%?”

Seller:

“Best I can do is 12%.”

Buyer:

“Accepted.”

Every offer/counter-offer must be stored in the database.

Never rely on frontend state alone.

42.8 SERVER-SIDE DISCOUNT VALIDATION

All seller discounts must be validated on the server.

Never trust:

Buyer-provided discount

Seller-provided discount

Frontend-calculated total

Client-side negotiation state

The server must verify:

Product prices

Current offers

Product stock

Seller permissions

Maximum permitted discount

Cart quantity

Cart value

Negotiation expiration

Final negotiated price

The final price must be calculated and validated server-side.

42.9 BULK DISCOUNT RULES

Maintain separate rules for individual and bulk negotiations.

Individual product:

Maximum discount = 15%

Bulk/cart negotiation:

Maximum discount = 20%

Bulk negotiation requires:

Minimum quantity = 2 items

The seller must never be able to exceed the configured maximum discount.

Do not expose the internal maximum discount configuration to buyers.

The UI may show:

Within seller deal rules

or:

Seller-approved bulk deal

42.10 NEGOTIATION EXPIRATION

Every seller offer should have an expiration timestamp.

Example:

SELLER OFFER

12% OFF

Expires in 09:42

The server/database remains the source of truth.

If the offer expires:

Show:

This seller offer has expired.

The buyer can request a new deal.

Never use fake timers as the source of truth.

42.11 DEAL ACCEPTANCE

When either side accepts the final offer:

Lock the negotiated cart price.

Create a server-validated negotiated deal record.

Prevent the price from silently changing before checkout.

The final deal should contain:

Buyer

Seller

Products

Quantities

Original total

Original offers

Negotiated discount

Negotiated total

Created timestamp

Expiry timestamp

Accepted timestamp

Negotiation session ID

Status

42.12 CHECKOUT AFTER DEAL

After the buyer accepts the seller's offer:

Show:

DEAL LOCKED

Example:

Original:

₹15,000

Seller discount:

12%

You save:

₹1,800

Final:

₹13,200

Button:

Proceed to Checkout

The checkout must use the server-validated negotiated amount.

The client must never be able to modify the final negotiated price.

42.13 MULTI-SELLER CART SUPPORT

Design the architecture so that products can belong to different sellers.

If a cart contains products from multiple sellers:

Group the cart by seller.

Example:

SELLER A

3 products

Subtotal: ₹8,000

Request Bulk Deal

SELLER B

2 products

Subtotal: ₹7,000

Request Bulk Deal

Each seller gets a separate negotiation session.

Do not allow one seller to discount another seller's products.

42.14 SELLER DASHBOARD

Add a new section:

Deal Requests

Seller can see:

New requests

Active negotiations

Counter-offers

Accepted deals

Expired deals

Rejected deals

Each request should open the real-time buyer ↔ seller conversation.

Show the cart contents beside the conversation.

Desktop:

Conversation | Cart / Deal Details

Mobile:

Conversation first, deal details accessible through a drawer/panel.

42.15 REALTIME EVENTS

Use Supabase Realtime for:

New negotiation request

New message

Seller offer

Buyer counter-offer

Offer acceptance

Offer rejection

Offer expiration

Stock changes

Deal status changes

No polling.

No fake realtime.

42.16 DATABASE ADDITIONS

Add appropriate tables.

carts

id

user_id

created_at

updated_at

cart_items

id

cart_id

product_id

seller_id

quantity

created_at

updated_at

seller_deal_sessions

id

buyer_id

seller_id

cart_id

status

original_total

negotiated_total

discount_pct

expires_at

created_at

updated_at

seller_deal_messages

id

session_id

sender_id

sender_role

message

created_at

seller_deal_offers

id

session_id

offered_by

discount_pct

total_price

status

expires_at

created_at

Use proper:

Foreign keys

Indexes

Constraints

RLS policies

Timestamps

42.17 SECURITY

Buyers can only access their own:

Carts

Cart items

Deal sessions

Deal messages

Deal offers

Sellers can only access negotiations involving their own products.

A seller must never be able to:

Modify another seller's products

Change another seller's prices

Access unrelated buyer conversations

Modify another seller's deal

Override server-side discount limits

All sensitive operations must happen server-side.

42.18 AI + SELLER NEGOTIATION

DealMate should intelligently decide when to involve the seller.

For normal single-product negotiations:

AI Negotiation Agent

For qualifying bulk/cart negotiations:

AI detects bulk opportunity → Seller communication becomes available

The AI can suggest:

“You're buying multiple items. I can ask the seller for a better bundle price.”

The buyer then chooses:

ASK SELLER FOR BULK DEAL

The AI should assist the conversation where appropriate, but the seller remains in control of seller-authorized discounts.

Do not allow the AI to invent seller approvals.

42.19 COMPLETE BULK NEGOTIATION FLOW

The final demo should support this exact flow:

Buyer logs in.

Buyer searches for products.

Buyer adds multiple products to cart.

Cart detects bulk purchase opportunity.

UI displays Ask Seller for a Better Deal.

Buyer clicks the button.

Buyer enters an optional target price/message.

Real deal session is created.

Seller receives a realtime notification.

Seller opens the request.

Seller sees products, quantities and cart total.

Buyer and seller communicate in real time.

Seller proposes a discount.

Buyer sees the offer immediately.

Buyer can accept or counter.

Seller can accept/reject/counter.

Server validates every offer.

Final negotiated price is locked.

Buyer proceeds to checkout.

Server validates the locked deal.

Stock is atomically checked/decremented.

Order is created.

Real order ID is returned.

Both buyer and seller see the completed deal.

This must be a real end-to-end implementation, not a mock.

42.20 UX PRINCIPLE

The buyer should feel:

“The more I buy, the more negotiating power I have.”

The seller should feel:

“I control the deal and can reward serious bulk buyers.”

DealMate's role is to connect both sides and make negotiation fast, transparent and trustworthy.

The bulk seller negotiation should become one of the major signature features of DealMate.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/135cc0f6-3dc2-429c-b5ce-11e3d5879326).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
