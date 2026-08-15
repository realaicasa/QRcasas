# QRcasas Project Manifest

## Status
- Current goal: Restore and verify the production homepage, then complete the advertiser property-listing flow.
- Last session date: 2026-08-14.
- Current branch: `main`.
- Current commit: `d364987e`.
- Working tree: clean; `main` is pushed to `origin/main`.

## System State
- Project root: `F:\Mike d drive\Mike Webs\mAIstermind.com\projects\QRCasas\QRcasas-github`.
- Production URLs: `https://qrcasas.com/`, `https://qrcasas.vercel.app/`.
- GitHub: `https://github.com/realaicasa/QRcasas.git`.
- Deployment source: GitHub `main` branch via Vercel.
- Teable base: `bseR9OOCC0f7fvY1d0z`.
- Teable API endpoint used by the client: `https://app.teable.ai/api`.
- Required Vercel variables: `TEABLE_API_URL`, `TEABLE_API_TOKEN`.
- Do not store the token in this file or in Git.

## Implemented
- Real Teable client with SQL translation, reads, writes, link helpers, and field mapping.
- Auth, registration, login, and forgot-password routes.
- Canonical advertiser routes: `/account/properties`, `/account/properties/new`, `/directory/register`.
- Property pricing flow with 500 MXN, 3,000 MXN, and 6,900 MXN tiers.
- Property creation, ownership-gated editing, and advertiser dashboard.
- 13-week status calculation: active, expiring soon, and archived.
- Prominent footer CTAs: `Add property` and `real-estate-agents`.
- Header labels: `Properties (directory)` and `Agents (directory)`.
- Legacy Teable URL normalization in `src/lib/request.ts`.

## Known Production Issue
- The production homepage has returned a Server Components 500 at `/en/properties`.
- The browser `tabs:outgoing.message.ready` error is unrelated browser-extension noise.
- The supplied legacy Teable URL is normalized by commit `d364987e` to `https://app.teable.ai/api`.
- If the 500 remains after deployment, inspect Vercel function logs for the first server exception; do not guess from the browser digest.

## Pending / Next
- [ ] Confirm Vercel deployed commit `d364987e` from `main`.
- [ ] Confirm `TEABLE_API_URL` is set for Production and equals `https://app.teable.ai/api` (the compatibility code also accepts the supplied legacy format).
- [ ] Confirm `TEABLE_API_TOKEN` is set for Production without exposing it in logs.
- [ ] Re-test `/en/properties` and `/en/login` after deployment.
- [ ] Add a proper Enquiries table and contact-modal open tracking.
- [ ] Implement Stripe checkout after property details are confirmed.
- [ ] Implement week-12 renewal reminders and 12-month archive removal automation.
- [ ] Add explicit legacy 308 redirects if still absent: `/list-property` and `/realtors/join`.
