# QRcasas Project Manifest

## Status
- Current goal: Complete UI/UX redesign + Stripe payment integration.
- Last session date: 2026-08-18.
- Current branch: `main`.
- Current commit: `d3ee11d1` (Redesign properties and directory pages).
- Working tree: clean; `main` is pushed to `origin/main`.

## System State
- Project root: `F:\Mike d drive\Mike Webs\mAIstermind.com\projects\QRCasas\QRcasas-github`.
- Production URLs: `https://qrcasas.com/`, `https://qrcasas.vercel.app/`.
- GitHub: `https://github.com/realaicasa/QRcasas.git` (push via `realaicasa` PAT, not `dynamicmike-dashboard`).
- Deployment source: GitHub `main` branch via Vercel.
- Teable base: `bseR9OOCC0f7fvY1d0z`.
- Teable API endpoint: `https://app.teable.ai/api` (legacy `api.teable.io` normalized in `request.ts`).
- Required Vercel variables: `TEABLE_API_URL`, `TEABLE_API_TOKEN`.

## Teable Tables
- Portal Users: `tbl394RbduZlmHUni8e`
- Clients (agents): `tbluaZYX8Umw7VuZHVG`
- Properties: `tblUlJEDQW8xvlqMviu`
- Locations: `tblRMqpDs1ilZAOacsH`
- Property Activity: `tblbiHm44TeA55UEWSt`
- Listing Renewals: `tbl7XnhLXWvbRJXXh6L` (added this session)
- Field maps in `src/lib/data/teable/fields.generated.ts`, table IDs in `tables.ts`.

## Implemented
- Real Teable client with SQL translation, reads, writes, link helpers, and field mapping.
- Teable OTP and Google OAuth are authoritative for authentication.
- Advertiser routes: `/account/properties`, `/account/properties/new`, `/directory/register`.
- Property pricing flow: 500 MXN (single), 3,000 MXN (10), 6,900 MXN (25) — 13-week listings.
- Property creation, ownership-gated editing, advertiser dashboard with status badges.
- Canonical lifecycle fields: `Listing Starts At`, `Paid Through`, `Renewal Reminder Sent At`, `Purge Eligible At`, `Lifecycle Status`.
- Photo system: sharp WebP conversion, profile/business logo uploads, property photo upload with alt text, `Photo_Package` field (Standard/Pending Payment/Paid).
- Photo upgrade: optional 200 MXN per property for up to 10 photos (first photo = featured). Standard = 1 photo. Webhook sets `Photo_Package=Paid` after verified payment.
- Brand logo + favicon + PWA manifest icons updated to CDN URLs (commit `c175737e`).
- Listing Renewals table + full field map synced to live Teable (commit `c175737e`).

## Stripe Integration (created from scratch this session, commit `142dd7de`)
- `src/lib/stripe.ts` — raw-fetch Stripe API helpers (no npm `stripe` package). Creates Checkout Sessions, retrieves sessions, verifies webhook HMAC-SHA256 with `node:crypto`.
- `src/lib/data/renewals.ts` — renewal data layer: `createPendingRenewal`, `getRenewalById`, `getRenewalByStripeSessionId`, `markRenewalPaid`, `setPropertiesPhotoPackagePaid`, `verifyPropertiesOwnership`.
- `src/app/api/stripe/checkout/route.ts` — POST: auth-gated, verifies ownership, creates Pending renewal, creates Stripe Checkout Session with metadata (`renewalId`, `photoProps`, `packageTotal`, `photoTotal`), returns `{ url }`.
- `src/app/api/stripe/webhook/route.ts` — POST: sole payment authority. Verifies signature + strict cross-checks. Returns 503 if `STRIPE_WEBHOOK_SECRET` unset.
- `/account/properties` page: bilingual payment banners (verified/verifying/cancelled). Read-only.
- `property-create-flow.tsx`: uploads first photo (featured), calls checkout, redirects to Stripe. Falls back to dashboard on error.

## Stripe Configuration
- Mode: **live** (not test).
- Restricted key: `rk_live_51MvrBt…` (exposed in chat — **must be rotated**).
- Price IDs (live, MXN one-time):
  - `STRIPE_PRICE_SINGLE_PROPERTY` = `price_1U5Wy6Ge9hhLYer6Yrs9Joal` (500 MXN)
  - `STRIPE_PRICE_UP_TO_10` = `price_1U5XNJGe9hhLYer6uIsCWO08` (3,000 MXN)
  - `STRIPE_PRICE_UP_TO_25` = `price_1U5XPLGe9hhLYer6dMypHsFt` (6,900 MXN)
- Photo add-on: 200 MXN per property, created as inline `price_data` line item — **no separate Price ID needed**.
- Webhook endpoint: `https://qrcasas.com/api/stripe/webhook` (events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`).

## Vercel Environment Variables
Already set by user this session:
- `STRIPE_SECRET_KEY` = `rk_live_…`
- `STRIPE_PRICE_SINGLE_PROPERTY` = `price_…`
- `STRIPE_PRICE_UP_TO_10` = `price_…`
- `STRIPE_PRICE_UP_TO_25` = `price_…`
Still needed:
- `STRIPE_WEBHOOK_SECRET` = `whsec_…` (user must create webhook endpoint in Stripe dashboard first)

## Security Status
- GitHub PAT (`ghp_…`) and Teable PAT (`teable_…`) exposed in chat — must be rotated.
- Stripe restricted key (`rk_live_…`) exposed in chat — must be rotated after testing.
- Do not merge application-owned password hashing or password-reset code; QRcasas uses Teable OTP and Google OAuth.
- Do not store tokens in this manifest or Git.

## Pending / Next
- [ ] Agent upsell checkboxes in edit profile: Verified (300 MXN/mo recurring) + Featured Agent (300 MXN/mo recurring) — linked to Stripe
- [ ] Verified agent: blue tick, proof of ID image upload field, Identity Verification Status workflow
- [ ] Featured agent: appears in directory homepage horizontal scroll
- [ ] Super-admin dashboard: search by name, business, agent ID reference
- [ ] Auto-generate agent ID reference (Agent_Reference field) on profile creation
- [ ] Test Stripe end-to-end: create property → checkout → pay → webhook → Paid
- [ ] Rotate exposed credentials: GitHub PAT, Teable PAT, Stripe restricted key
- [ ] Do not recreate the five removed duplicate lifecycle fields.
