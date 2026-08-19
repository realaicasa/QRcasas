# QRcasas Restart Commands

## Initialize
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Check git status, current branch, recent commits, and the Vercel deployment commit before changing code."

## Stripe Webhook Events (user action required)
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Remind the user to add customer.subscription.updated and customer.subscription.deleted events to the Stripe webhook endpoint at https://qrcasas.com/api/stripe/webhook. Without these, recurring subscription status changes (agent upsells + sponsors) won't update Teable."

## Stripe End-to-End Test
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. All Stripe env vars are configured in Vercel. Test a live-mode purchase: log in as agent, create a property, select a tier, complete Stripe checkout, confirm the webhook fires and marks the renewal Paid and sets Photo_Package=Paid. Then test a sponsor registration and subscription. Report any failures."

## Sponsor Carousel
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Add a sponsor carousel section to the homepage that displays active sponsor adverts (Billing_Status=Active, Approved=true) from the Business Adverts table. Use the getActiveSponsorAdverts function. Show advert image, title, and clickable link to destination URL. Match the featured rails styling."

## Stripe Customer Portal
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Add a Stripe Customer Portal integration so subscribers (agents with verified/featured upsells and sponsors) can manage their billing, update payment methods, and cancel subscriptions. Create a billing portal route that redirects to Stripe's hosted portal."

## Upload Real Inventory
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. The current test properties have no photo attachments. Upload real property photos to the existing test properties in Teable so the property cards, detail pages, and QR codes display correctly. Verify the media fallback helper handles any remaining gaps."

## Property Image Debug
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Investigate why property images show placeholders in search results. Check the getPublicProperties SQL query includes Photos field, check Teable attachment signed URL response, verify getFirstSafeImage extracts URLs correctly. Fix the root cause."

## Security Rotation
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Rotate the exposed GitHub PAT, Teable PAT, and Stripe restricted key. Update Vercel Production variables without printing secrets. Verify the deployed commit and confirm the working tree is clean."

## Teable Verification
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify Teable reads using environment variables only. Confirm TEABLE_API_URL resolves to https://app.teable.ai/api, never print TEABLE_API_TOKEN, and do not perform writes without reading the existing record first."

## Agent Upsell Debug
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Test the agent upsell flow: edit profile, check Verified or Featured checkbox, save, verify redirect to Stripe subscription checkout, complete payment, confirm webhook sets Verification_Fee_Active=true or Featured_Agent=true. Report any failures."

## PR / Deployment Check
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Inspect git status, git diff, git log --oneline -10, and origin tracking. Run npm run typecheck, npm test, and npm run build. Push only the intended changes to main (using realaicasa PAT if dynamicmike-dashboard is denied) and report the commit hash."

## Super-admin Dashboard Enhancement
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Add the ability to approve or reject identity verifications from the super-admin dashboard pending review queue. Include a button to set Identity_Verification_Status to Verified or Rejected, and a button to toggle Featured_Agent manually."
