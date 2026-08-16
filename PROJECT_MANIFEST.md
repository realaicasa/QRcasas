# QRcasas Project Manifest

## Status
- Current goal: Operate the canonical Teable OTP/Google OAuth, Stripe, and lifecycle implementation safely.
- Last session date: 2026-08-16.
- Current branch: `main`.
- Current commit: `3b5c5ebc`.
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
- Teable OTP and Google OAuth are authoritative for authentication.
- Canonical advertiser routes: `/account/properties`, `/account/properties/new`, `/directory/register`.
- Property pricing flow with 500 MXN, 3,000 MXN, and 6,900 MXN tiers.
- Property creation, ownership-gated editing, and advertiser dashboard.
- Canonical lifecycle fields: `Listing Starts At`, `Paid Through`, `Renewal Reminder Sent At`, `Purge Eligible At`, and `Lifecycle Status`.
- Existing lifecycle automation is authoritative and must not be replaced with duplicate fields.
- Prominent footer CTAs: `Add property` and `real-estate-agents`.
- Header labels: `Properties (directory)` and `Agents (directory)`.
- Legacy Teable URL normalization in `src/lib/request.ts`.

## Security Status
- GitHub and Teable PATs previously exposed in chat are compromised and must be rotated.
- Do not merge application-owned password hashing or password-reset code; QRcasas uses Teable OTP and Google OAuth.
- Do not store tokens in this manifest or Git.

## Pending / Next
- [ ] Rotate the GitHub PAT and Teable PAT, then update Vercel securely.
- [ ] Configure Stripe credentials and canonical Price IDs in Vercel.
- [ ] Verify the existing Stripe webhook and lifecycle automation in production.
- [ ] Confirm the audited commit `e5922a2` is available in the authoritative workspace/history.
- [ ] Do not recreate the five removed duplicate lifecycle fields.
- [ ] Add Resend only if the existing Teable automation requires an external email provider.
