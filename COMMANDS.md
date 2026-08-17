# QRcasas Restart Commands

## Initialize
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Check git status, current branch, recent commits, and the Vercel deployment commit before changing code."

## Stripe Webhook Setup (user action required)
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Remind the user to create the Stripe webhook endpoint at https://qrcasas.com/api/stripe/webhook with events checkout.session.completed and checkout.session.async_payment_succeeded, then copy the whsec_ signing secret into Vercel as STRIPE_WEBHOOK_SECRET. Without this, the webhook returns 503 and no payment is verified."

## Stripe End-to-End Test
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify STRIPE_WEBHOOK_SECRET is set in Vercel. Test a live-mode purchase: log in as agent, create a property, select a tier, complete Stripe checkout, confirm the webhook fires and marks the renewal Paid and sets Photo_Package=Paid. Report any failures."

## Payment Flow Debug
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Inspect the Stripe checkout route and webhook route for errors. Check Vercel logs for /api/stripe/webhook. Verify the webhook signature verification, amount_total check (minor units), and renewal cross-check logic. Fix the smallest root cause."

## Logo / PWA Icon Verification
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify the deployed site shows the new brand logo in header and footer, the favicon in browser tabs, and the PWA icons in the manifest. Confirm all icon URLs point to the assets.cdn.filesafe.space CDN."

## Security Rotation
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Rotate the exposed GitHub PAT, Teable PAT, and Stripe restricted key. Update Vercel Production variables without printing secrets. Verify the deployed commit and confirm the working tree is clean."

## Teable Verification
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify Teable reads using environment variables only. Confirm TEABLE_API_URL resolves to https://app.teable.ai/api, never print TEABLE_API_TOKEN, and do not perform writes without reading the existing record first."

## Advertiser Dashboard
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Continue the advertiser flow: protected /account/properties dashboard, property creation at /account/properties/new, ownership-gated editing, active/expiring/archived status, renewal selection, enquiry statistics, and payment banners. Verify all routes and tests."

## PR / Deployment Check
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Inspect git status, git diff, git log --oneline -10, and origin tracking. Run npm run typecheck, npm test, and npm run build. Push only the intended changes to main (using realaicasa PAT if dynamicmike-dashboard is denied) and report the commit hash."
