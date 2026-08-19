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

## 4. Client/Server Component Boundary
- **NEVER** pass non-serializable values (functions, class instances) from Server Components to Client Components.
- The `t` translation function must NOT be passed as a prop. Instead, pass `locale` (string) and create `t` inside the client component:
  `const t = (en: string, es: string) => (locale === "es" ? es : en);`
- This was the root cause of multiple production 500 errors (blank pages).

## 5. Payment Authority
- The Stripe webhook (`/api/stripe/webhook`) is the **sole payment authority**.
- The success URL is **read-only** — displays banners but never writes entitlements.
- Webhook verifies: signature, `payment_status=paid`, `currency=mxn`, `amount_total === expectedTotal * 100` (minor units), metadata matches live renewal record.
- After verification: marks renewal `Status=Paid`, sets `Photo_Package=Paid`.
- For sponsor subscriptions: `customer.subscription.updated` (active) → `Billing_Status=Active, Approved=true`; (past_due/canceled) → `Billing_Status=Past Due/Cancelled, Approved=false`.

## 6. Stripe Configuration (LIVE — all env vars set in Vercel)
- `STRIPE_SECRET_KEY` = `rk_live_51MvrBt…` (restricted key — **must be rotated**)
- `STRIPE_PRICE_SINGLE_PROPERTY` = `price_1U5Wy6Ge9hhLYer6Yrs9Joal` (500 MXN one-time)
- `STRIPE_PRICE_UP_TO_10` = `price_1U5XNJGe9hhLYer6uIsCWO08` (3,000 MXN one-time)
- `STRIPE_PRICE_UP_TO_25` = `price_1U5XPLGe9hhLYer6dMypHsFt` (6,900 MXN one-time)
- `STRIPE_WEBHOOK_SECRET` = `whsec_3E9jO58qNbAsdC9K0Bg4cZSeBszezZ3D`
- Webhook endpoint: `https://qrcasas.com/api/stripe/webhook` (ID: `we_1U5ZAkGe9hhLYer61iUulLAw`)
- Events configured: `checkout.session.completed`, `checkout.session.async_payment_succeeded`
- Events **still needed**: `customer.subscription.updated`, `customer.subscription.deleted`
- Photo add-on: 200 MXN per property, inline `price_data` — no separate Price ID
- Agent upsells: 300 MXN/mo each (verified + featured) — recurring subscription
- Sponsor: 1,200 MXN/mo recurring — inline `price_data`

## 7. Architecture Notes
- lucide-react v1.28.0 has NO brand icons (Instagram, Facebook, Linkedin) — use Globe
- `src/lib/media.ts` provides safe image extraction with placeholder fallback
- QR codes use `api.qrserver.com` external API (1024x1024 PNG, high error correction)
- npm commands (not pnpm): `npm run typecheck`, `npm test`, `npm run build`
- Super-admin access: `realai.agency@gmail.com` or `mike@dynamicmike.com`
