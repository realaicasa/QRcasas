# QRcasas Restart Commands

## Initialize
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Check git status, current branch, recent commits, and the Vercel deployment commit before changing code."

## Image Upload Debug
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. The session cookie mismatch was fixed (getCustomerAuth now reads qrcasas_session first). Test image upload on live deploy: log in, edit profile, upload photo/logo, verify it appears. If still failing, check Vercel function logs for /api/uploads/attachment errors. The upload route uses sharp for WebP conversion and posts to Teable uploadAttachment endpoint."

## Property Detail Page Debug
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. The non-serializable t function was removed from all client component props. Test the property detail page on live deploy — visit /en/properties/mike-test-property and verify it renders. If still blank, check Vercel logs for Server Components render errors."

## Login Session Debug
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. getUserByEmail no longer filters by Is_Verified IS TRUE. Test login with a different account — verify the correct agent profile loads. If the second account doesn't exist in Teable, the user needs to register first at /directory/register."

## Pro/Pro Plus Upgrade Setup
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. The user needs to create Stripe Price IDs for Pro and Pro Plus monthly subscriptions. Once provided, wire the checkout flow: agent clicks upgrade → Stripe subscription checkout → webhook sets Directory_Tier to Pro or Pro Plus. Pro tier: custom SEO, more properties. Pro Plus: full SEO, max properties, featured eligibility."

## Verified ID Upload to Advertiser Verifications
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. When an agent requests verification and uploads proof of ID, the file should be saved to the Advertiser Verifications table (tblVYj7pAh9OMcDAA08), not the agent record. Also notify super-admin. Check the live Teable fields for Advertiser Verifications and wire the upload accordingly."

## Sponsor Carousel
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Add a sponsor carousel section to the homepage that displays active sponsor adverts (Billing_Status=Active, Approved=true) from the Business Adverts table. Use getActiveSponsorAdverts. Show advert image, title, and clickable link. Match the featured rails styling."

## Stripe Customer Portal
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Add Stripe Customer Portal integration so subscribers can manage billing, update payment methods, and cancel subscriptions. Create a billing portal route that redirects to Stripe's hosted portal."

## Stripe End-to-End Test
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. All Stripe env vars are configured. Test: (1) one-time listing payment, (2) recurring agent upsell, (3) recurring sponsor subscription. Verify webhooks fire and update Teable correctly."

## Security Rotation
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Rotate the exposed GitHub PAT, Teable PAT, and Stripe restricted key. Update Vercel Production variables without printing secrets. Verify the deployed commit and confirm the working tree is clean."

## Teable Verification
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Verify Teable reads using environment variables only. Confirm TEABLE_API_URL resolves to https://app.teable.ai/api, never print TEABLE_API_TOKEN."

## PR / Deployment Check
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Inspect git status, git diff, git log --oneline -10, and origin tracking. Run npm run typecheck, npm test, and npm run build. Push only intended changes to main (using realaicasa PAT if denied) and report the commit hash."

## Super-admin Enhancement
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Add ability to approve/reject identity verifications from the super-admin dashboard. Include buttons to set Identity_Verification_Status to Verified or Rejected, and toggle Featured_Agent manually."

## Upload Real Inventory
"Read SYSTEM_PROTOCOL.md and PROJECT_MANIFEST.md. Upload real property photos to test properties in Teable so cards, detail pages, and QR codes display correctly. Verify the media fallback helper handles gaps."
