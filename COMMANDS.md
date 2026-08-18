# QRcasas Restart Commands

## Initialize
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Check git status, current branch, recent commits, and the Vercel deployment commit before changing code."

## Stripe End-to-End Test
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. All Stripe env vars are configured in Vercel (including STRIPE_WEBHOOK_SECRET). Test a live-mode purchase: log in as agent, create a property, select a tier, complete Stripe checkout, confirm the webhook fires and marks the renewal Paid and sets Photo_Package=Paid. Report any failures."

## Agent Upsell Stripe Wiring
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Wire the Verified Agent (300 MXN/mo) and Featured Agent (300 MXN/mo) checkboxes in agent-form.tsx to Stripe recurring subscriptions. Create checkout route for subscriptions, add webhook events customer.subscription.updated and customer.subscription.deleted, add Stripe Customer Portal for billing management. The UI checkboxes already exist."

## Auto-Advancing Featured Rails
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Upgrade the featured horizontal scroll sections on properties and directory pages to auto-advance every 8 seconds, pause on hover/focus, with compact section search above each rail. Arrow controls move one visible batch."

## QR Code Downloads
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Add downloadable QR codes for each property (encoding /properties/{slug}?source=qr) and each agent profile (encoding /realtors/{slug}?source=qr&contact=1). QR should be 1024x1024 PNG, high error correction. Display on public property page, property edit dialog, and agent profile settings."

## Contact Analytics
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Track Agent Contact Modal Opened events in the Property Activity table with an Advertiser link for aggregation. Show all-time and current-month contact opens on the agent dashboard. Only count signed-in contact reveals."

## Agent Portfolio
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Add a portfolio section to the agent profile page with a stable #portfolio anchor. Property contact modals and directory agent modals should include 'View portfolio' links."

## Super-admin Dashboard
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify the super-admin dashboard at /super-admin/dashboard shows agent stats, pending verification queue, and searchable agent table (by name, business, agent ID, specialty). Add ability to approve/reject identity verifications."

## Logo / PWA Icon Verification
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify the deployed site shows the new brand logo in header and footer, the favicon in browser tabs, and the PWA icons in the manifest. Confirm all icon URLs point to the assets.cdn.filesafe.space CDN."

## Security Rotation
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Rotate the exposed GitHub PAT, Teable PAT, and Stripe restricted key. Update Vercel Production variables without printing secrets. Verify the deployed commit and confirm the working tree is clean."

## Teable Verification
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify Teable reads using environment variables only. Confirm TEABLE_API_URL resolves to https://app.teable.ai/api, never print TEABLE_API_TOKEN, and do not perform writes without reading the existing record first."

## PR / Deployment Check
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Inspect git status, git diff, git log --oneline -10, and origin tracking. Run npm run typecheck, npm test, and npm run build. Push only the intended changes to main (using realaicasa PAT if dynamicmike-dashboard is denied) and report the commit hash."

## Merge Canonical Workspace
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. The Teable agent's workspace has commits 5a94793 and 7c3a788 with QR downloads, contact analytics, agent portfolios, auto-advancing rails, and recurring Stripe subscriptions. If they push to origin/main, pull and reconcile with our parallel implementations. If not, build those features here from scratch."
