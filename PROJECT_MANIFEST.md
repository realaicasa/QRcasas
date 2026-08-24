# QRcasas Project Manifest

## Status
- Current goal: Production launch — fix remaining image upload/display issues, wire Pro/Pro Plus upgrades, test end-to-end.
- Last session date: 2026-08-19.
- Current branch: `main`.
- Current commit: `588e8250` (Fix session cookie, login verification, property edit photo upload).
- Working tree: clean; `main` is pushed to `origin/main`.

## System State
- Project root: `F:\Mike d drive\Mike Webs\mAIstermind.com\projects\QRCasas\QRcasas-github`.
- Production URLs: `https://qrcasas.com/`, `https://qrcasas.vercel.app/`.
- GitHub: `https://github.com/realaicasa/QRcasas.git` (push via `realaicasa` PAT).
- Teable base: `bseR9OOCC0f7fvY1d0z`.
- Teable API endpoint: `https://app.teable.ai/api`.
- Super-admin access: `realai.agency@gmail.com` or `mike@dynamicmike.com`.

## Vercel Environment Variables (all configured)
- `TEABLE_API_URL`, `TEABLE_API_TOKEN`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_SINGLE_PROPERTY`, `STRIPE_PRICE_UP_TO_10`, `STRIPE_PRICE_UP_TO_25`
- `SITE_URL=https://qrcasas.com`

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

## Key Fixes Applied This Session
- **Session cookie mismatch**: `getCustomerAuth()` now reads `qrcasas_session` first, then `session` fallback. This was breaking all upload authentication.
- **Login user verification**: login form now checks if user exists in Teable before setting cookie. Removed `Is_Verified IS TRUE` filter from `getUserByEmail`.
- **Property edit photo upload**: created `PropertyEditFlow` client component that uploads photos after save (same pattern as create flow).
- **Upload buttons styled**: profile photo, logo, property photos now use styled "Choose Photo" buttons with upload icon.
- **Alt text optional**: removed `required` from alt text input.
- **Agent SEO text**: changed placeholders from property examples to agent examples.
- **Removed "Save SEO Settings" button**: SEO fields feed into main "Update Profile" button.
- **Featured redirect to Stripe**: server action returns checkout flag, client-side handles Stripe redirect.
- **Current profile images shown**: agent form displays existing photo/logo with green label.
- **Upload error display**: red error / green success messages.
- **Redundant footer CTA removed**: large "Add Property" button removed from footer.
- **Pricing modal close fixed**: stopPropagation on X and Cancel buttons.

## Still Broken / Needs Investigation
- **Images not displaying after upload**: Upload may still be failing. The session cookie fix should help, but needs live testing. Check Vercel function logs for `/api/uploads/attachment` errors.
- **Property detail page may still be blank**: Previous `t={t}` fix should have resolved this, but needs verification on live deploy.
- **Login still routing to wrong account**: The `getUserByEmail` fix removes `Is_Verified` filter, but the second account may not exist in Teable at all (register flow needed).

## Implemented (full session — all commits)
### Branding & PWA
- Logo, favicon, PWA manifest icons (CDN URLs)

### Stripe Payments
- One-time listing payments (checkout + webhook + renewal records)
- Recurring agent upsells (300 MXN/mo verified + featured)
- Recurring sponsor subscriptions (1,200 MXN/mo)
- Payment banners on dashboard (read-only)
- Webhook handles: checkout.session.completed, async_payment_succeeded, customer.subscription.updated, customer.subscription.deleted

### Properties Page
- Search/Latest toggle, filters hidden by default
- Featured auto-scroll rails (8s, pause on hover, section search, arrow nav)
- Marketplace notice + "Advertise with QRcasas" sections
- Sponsor modal (purple button)

### Directory Page
- Simplified cards (display name, business name, photo, verified tick, specialty)
- Search/Latest toggle, featured auto-scroll rails
- Same bottom sections

### Agent Detail
- Modal with sign-in gate on contact info
- Portfolio section with #portfolio anchor
- "View Portfolio" link in modal

### Agent Profile
- Expanded fields: displayName, tagline, agentReference, featuredAgent, identityVerificationStatus, specialistVocation, publicWhatsApp, publicEmail
- Upsell checkboxes: Verified (300 MXN/mo + proof-of-ID upload), Featured (300 MXN/mo)
- Auto-generated agent reference (QRC-XXXXXX) on creation
- Upload buttons styled, current images shown
- SEO text corrected for agent context

### Super-admin Dashboard
- Stats, pending verifications, searchable agent table

### QR Codes
- 1024px PNG downloads for properties and agents

### Contact Analytics
- Agent Contact Modal Opened event, 5s dedup, dashboard metrics

### Sponsor Flow
- Registration, dashboard, Stripe 1,200 MXN/mo checkout, webhook activation

### Media Safety
- `src/lib/media.ts` — placeholder fallback, no crashes

## Pro / Pro Plus Tier Upgrades (NOT yet wired)
- Free: Basic profile, 1 property, no SEO
- Pro: Custom SEO, more properties — no Stripe Price ID exists
- Pro Plus: Full SEO, max properties, featured eligibility — no Stripe Price ID exists
- User needs to create Stripe Prices for Pro and Pro Plus monthly subscriptions before I can wire the checkout

## Security Status
- GitHub PAT, Teable PAT, Stripe restricted key all exposed in chat — **must be rotated**.

## Pending / Next
- [ ] **Test image upload on live deploy** — session cookie fix should resolve, needs verification
- [ ] **Test property detail page** — should no longer be blank after `t={t}` fix
- [ ] **Create Pro/Pro Plus Stripe Price IDs** — user needs to create these in Stripe dashboard
- [ ] **Wire Pro/Pro Plus upgrade checkout** — once Price IDs exist
- [ ] **Save verified ID upload to Advertiser Verifications table** — currently uploads to agent record, should go to separate table + notify super-admin
- [ ] **Test Stripe end-to-end** — one-time listing payment, recurring agent upsell, recurring sponsor
- [ ] **Upload real property photos** — current test properties have no photos
- [ ] **Sponsor carousel on homepage** — display active sponsor adverts
- [ ] **Stripe Customer Portal** — for subscribers to manage/cancel billing
- [ ] **Rotate exposed credentials** — GitHub PAT, Teable PAT, Stripe rk_live key
- [ ] **Onboard first test sponsor**
