# QRcasas Project Manifest

## Status
- Current goal: Production launch — all monetization paths wired, testing + credential rotation remaining.
- Last session date: 2026-08-18.
- Current branch: `main`.
- Current commit: `774748ac` (Add agent portfolio section with #portfolio anchor).
- Working tree: clean; `main` is pushed to `origin/main`.

## System State
- Project root: `F:\Mike d drive\Mike Webs\mAIstermind.com\projects\QRCasas\QRcasas-github`.
- Production URLs: `https://qrcasas.com/`, `https://qrcasas.vercel.app/`.
- GitHub: `https://github.com/realaicasa/QRcasas.git` (push via `realaicasa` PAT).
- Deployment source: GitHub `main` branch via Vercel.
- Teable base: `bseR9OOCC0f7fvY1d0z`.
- Teable API endpoint: `https://app.teable.ai/api`.
- Super-admin access: `realai.agency@gmail.com` or `mike@dynamicmike.com`.

## Vercel Environment Variables (all configured)
- `TEABLE_API_URL`, `TEABLE_API_TOKEN`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_SINGLE_PROPERTY`, `STRIPE_PRICE_UP_TO_10`, `STRIPE_PRICE_UP_TO_25`

## Teable Tables (live)
- Portal Users: `tbl394RbduZlmHUni8e`
- Clients (agents): `tbluaZYX8Umw7VuZHVG`
- Properties: `tblUlJEDQW8xvlqMviu`
- Locations: `tblRMqpDs1ilZAOacsH`
- Property Activity: `tblbiHm44TeA55UEWSt`
- Listing Renewals: `tbl7XnhLXWvbRJXXh6L`
- Sponsor Accounts: `tbliuwzQOgnEFQNqxj9`
- Business Adverts: `tbln1kaLnMBM9jlgyV8`
- Directory Subscriptions: `tblIk58JzxlY532W6A0`
- Advertiser Verifications: `tblVYj7pAh9OMcDAA08`
- Field maps in `src/lib/data/teable/fields.generated.ts`, table IDs in `tables.ts`.

## Implemented (full session — commits c175737e → 774748ac)

### Branding & PWA
- Logo, favicon, PWA manifest icons updated to CDN URLs (header, footer, manifest, layout)

### Stripe Payment Integration (one-time listings)
- `src/lib/stripe.ts` — raw-fetch Stripe API helpers (no npm package), HMAC webhook verify
- `src/lib/data/renewals.ts` — renewal data layer
- `/api/stripe/checkout` — auth-gated, creates Pending renewal + Checkout Session with metadata
- `/api/stripe/webhook` — sole payment authority, strict verification (signature, paid, mxn, amount_total in minor units, metadata cross-check)
- Payment banners on `/account/properties` (verified/verifying/cancelled — read-only)
- Property create flow: uploads first photo, calls checkout, redirects to Stripe

### Stripe Recurring Subscriptions (agent upsells + sponsors)
- `/api/stripe/subscription` — 300 MXN/mo recurring for Verified + Featured agent upsells
- `/api/stripe/sponsor-checkout` — 1,200 MXN/mo recurring for sponsor adverts
- Webhook handles: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Agent upsell: Verified → `Identity_Verification_Status=Pending Review, Verification_Fee_Active=true`; Featured → `Featured_Agent=true`
- Sponsor: Active subscription → `Billing_Status=Active, Approved=true`; Cancelled → `Billing_Status=Cancelled, Approved=false`

### Properties Page
- Search/Latest toggle buttons (filters hidden by default)
- Featured properties horizontal scroll with auto-advance (8s, pause on hover/focus, section search, arrow nav)
- Marketplace notice (shield icon) + "Advertise with QRcasas" sections at bottom
- Sponsor modal (purple button) replaces "Real Estate Agents" button

### Directory Page
- Simplified agent cards (display name, business name, profile photo, verified tick, specialty)
- Search/Latest toggle, featured agents horizontal scroll with auto-advance
- Same bottom sections as properties page

### Agent Detail
- Fixed blank page (Next.js 16 Promise params + non-serializable `t` function removed)
- `AgentDetailModal` — auto-opens, shows photo, name, business, bio, specialist, agent reference, verified tick
- Sign-in gate: contact info hidden for signed-out visitors, shows "Sign In" CTA
- "View Portfolio" link scrolls to `#portfolio` section
- Portfolio section: grid of published properties with safe image fallback

### Agent Profile
- `AgentProfile` expanded: displayName, tagline, agentReference, featuredAgent, identityVerificationStatus, verificationFeeActive, specialistVocation, publicWhatsApp, publicEmail
- Agent form: display name, tagline, specialism dropdown, public contact fields, agent ID reference (read-only), verified upsell (300 MXN/mo + proof-of-ID upload), featured upsell (300 MXN/mo)
- Auto-generated agent reference (`QRC-XXXXXX`) on `createAgent`

### Super-admin Dashboard
- Stats: total agents, verified, pending review, featured
- Pending verification queue
- Searchable agent table (by name, business, agent ID, specialty) with photo, tier badge, status

### QR Codes
- `QrCodeDisplay` component — 1024x1024 PNG, high error correction, download/copy/open
- Property QR: `/properties/{slug}?source=qr`
- Agent QR: `/realtors/{slug}?source=qr&contact=1`

### Contact Analytics
- `Agent Contact Modal Opened` event in Property Activity table with Advertiser link
- 5-second deduplication
- Dashboard shows all-time + current-month contact opens
- Only signed-in reveals are counted

### Sponsor Flow
- `/sponsors/register` — form (personal name, business, address, contact, advert title/description, link)
- `/sponsors/dashboard` — status, create new advert
- `/api/sponsors/create` — creates Sponsor Account + Business Advert (Inactive/Draft)
- `/api/stripe/sponsor-checkout` — 1,200 MXN/mo recurring checkout
- Webhook activates/pauses advert based on subscription status
- `getActiveSponsorAdverts()` — requires `Billing_Status=Active AND Approved=true`

### Media Safety
- `src/lib/media.ts` — `getSafeImageUrl`, `getSafeImageList`, `getFirstSafeImage`
- Bad/stale Teable attachments render placeholder, no page crashes

### Header/Footer
- Header: "Properties Directory" / "Agents Directory"
- Footer: single "Add Property" CTA (removed redundant "Agent Login")

## Security Status
- GitHub PAT (`ghp_…`), Teable PAT (`teable_…`), Stripe restricted key (`rk_live_…`) all exposed in chat — **must be rotated**.
- Do not merge application-owned password hashing or password-reset code.

## Pending / Next
- [ ] **Add `customer.subscription.updated` + `customer.subscription.deleted` to Stripe webhook endpoint** (dashboard action)
- [ ] **Rotate exposed credentials**: GitHub PAT, Teable PAT, Stripe rk_live key
- [ ] Test Stripe end-to-end: one-time listing payment → webhook → Paid → Photo_Package=Paid
- [ ] Test sponsor flow: register → upload creative → start subscription → webhook → advert live
- [ ] Test agent upsell: check verified/featured → subscription checkout → webhook → entitlements
- [ ] Upload real property inventory with photos (current test properties have no photos)
- [ ] Sponsor carousel on homepage (display active sponsor adverts)
- [ ] Stripe Customer Portal for subscribers to manage/cancel billing
- [ ] Onboard first test sponsor
- [ ] Do not recreate the five removed duplicate lifecycle fields
