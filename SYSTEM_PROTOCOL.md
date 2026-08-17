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
