# QRcasas System Protocol

## 1. Role & Efficiency
- Act as a senior infrastructure and application engineer for QRcasas.
- Keep communication concise and factual.
- Inspect the repository before changing code.
- Make the smallest correct change and verify it.
- Ask when requirements or production evidence are insufficient.

## 2. Standing Orders
- Project root: `F:\Mike d drive\Mike Webs\mAIstermind.com\projects\QRCasas\QRcasas-github`.
- Never create repositories or write outside the project root without approval.
- Do not use browser automation or Antigravity.
- Use environment variables for credentials; never commit tokens or secrets.
- Use the existing Next.js 16, TypeScript, Tailwind, and Teable patterns.
- Preserve the established QRcasas visual language.
- Treat "keyword" as "keyword phrase" when relevant.
- Push using the `realaicasa` PAT when the default git credential (`dynamicmike-dashboard`) is denied:
  `git push "https://realaicasa:<PAT>@github.com/realaicasa/QRcasas.git" main`

## 3. Data Integrity
- Read existing state before PATCH or other writes.
- Verify `PROJECT_MANIFEST.md` before execution.
- Confirm the current branch, status, and recent commits before pushing.
- Run `npm run typecheck`, `npm test`, and `npm run build` after material changes.
- Do not claim production behavior without checking deployment state or logs.

## 4. Payment Authority
- The Stripe webhook (`/api/stripe/webhook`) is the **sole payment authority**.
- The success URL (`/account/properties?paid=1&session_id=…`) is **read-only** — it displays banners but never writes entitlements.
- The webhook verifies: signature, `payment_status=paid`, `currency=mxn`, `amount_total === expectedTotal * 100` (minor units), metadata matches the live renewal record, renewal `Stripe_Checkout_Session_ID` matches.
- Only after all checks pass: mark renewal `Status=Paid` + `Paid_At`, set `Properties.Photo_Package=Paid` on the exact upgraded properties.

## 5. Stripe Configuration (LIVE)
- `STRIPE_SECRET_KEY` = `rk_live_51MvrBt…` (restricted key — **must be rotated**)
- `STRIPE_PRICE_SINGLE_PROPERTY` = `price_1U5Wy6Ge9hhLYer6Yrs9Joal` (500 MXN one-time)
- `STRIPE_PRICE_UP_TO_10` = `price_1U5XNJGe9hhLYer6uIsCWO08` (3,000 MXN one-time)
- `STRIPE_PRICE_UP_TO_25` = `price_1U5XPLGe9hhLYer6dMypHsFt` (6,900 MXN one-time)
- `STRIPE_WEBHOOK_SECRET` = `whsec_3E9jO58qNbAsdC9K0Bg4cZSeBszezZ3D`
- Webhook endpoint: `https://qrcasas.com/api/stripe/webhook` (ID: `we_1U5ZAkGe9hhLYer61iUulLAw`)
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`
- Photo add-on: 200 MXN per property, inline `price_data` line item — no separate Price ID
- All 5 env vars are set in Vercel Production

## 6. Agent Upsell Pricing (NOT yet wired to Stripe)
- Verified Agent: 300 MXN/month recurring — blue tick + proof of ID
- Featured Agent: 300 MXN/month recurring — featured in directory horizontal scroll
- These need Stripe recurring subscription integration (not yet implemented in this checkout)

## 7. Canonical Workspace Divergence
- Commits `5e8bb9e`, `e5922a2`, `d94058f`, `a58c60a`, `5a94793`, `7c3a788` exist ONLY in the Teable agent's workspace — NOT on `origin/main`.
- This checkout has parallel implementations created from scratch.
- The Teable agent's workspace has: auto-advancing featured rails, QR downloads, contact analytics, agent portfolios, recurring Stripe subscriptions, Stripe Customer Portal.
- This checkout has: static featured scroll with arrows, Stripe one-time checkout + webhook, agent upsell checkboxes (UI only, not yet linked to Stripe recurring).
