# QRcasas Project Manifest

## Status
- Current goal: Complete UI/UX redesign + Stripe payment integration + agent upsells.
- Last session date: 2026-08-18.
- Current branch: `main`.
- Current commit: `1dbac40e` (Add marketplace notice, advertise sections, super-admin search).
- Working tree: clean; `main` is pushed to `origin/main`.

## System State
- Project root: `F:\Mike d drive\Mike Webs\mAIstermind.com\projects\QRCasas\QRcasas-github`.
- Production URLs: `https://qrcasas.com/`, `https://qrcasas.vercel.app/`.
- GitHub: `https://github.com/realaicasa/QRcasas.git` (push via `realaicasa` PAT).
- Deployment source: GitHub `main` branch via Vercel.
- Teable base: `bseR9OOCC0f7fvY1d0z`.
- Teable API endpoint: `https://app.teable.ai/api`.
- Required Vercel variables: `TEABLE_API_URL`, `TEABLE_API_TOKEN`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_SINGLE_PROPERTY`, `STRIPE_PRICE_UP_TO_10`, `STRIPE_PRICE_UP_TO_25`.
- Super-admin access: `realai.agency@gmail.com` or `mike@dynamicmike.com`.

## Teable Tables
- Portal Users: `tbl394RbduZlmHUni8e`
- Clients (agents): `tbluaZYX8Umw7VuZHVG`
- Properties: `tblUlJEDQW8xvlqMviu`
- Locations: `tblRMqpDs1ilZAOacsH`
- Property Activity: `tblbiHm44TeA55UEWSt`
- Listing Renewals: `tbl7XnhLXWvbRJXXh6L`
- Field maps in `src/lib/data/teable/fields.generated.ts`, table IDs in `tables.ts`.

## Implemented This Session (commits c175737e → 1dbac40e)
- Brand logo, favicon, PWA manifest icons updated to CDN URLs.
- Listing Renewals table + field map synced to live Teable (Photo_Add_on, Photo_Add_on_Amount, Package, Property_Count, Stripe session fields).
- Stripe integration from scratch: `src/lib/stripe.ts` (raw-fetch, no npm package), `src/lib/data/renewals.ts`, `/api/stripe/checkout`, `/api/stripe/webhook` (sole payment authority, strict verification, 503 if whsec unset).
- Payment banners on `/account/properties` (verified/verifying/cancelled — read-only).
- Property create flow: uploads first photo, calls checkout, redirects to Stripe.
- Properties page redesigned: Search/Latest toggle buttons, filters hidden by default, featured properties horizontal scroll with arrow nav.
- Directory page redesigned: simplified agent cards (name/photo/business only), Search/Latest toggle, featured agents horizontal scroll.
- Fixed blank agent page (`/directory/[agentId]`) — Next.js 16 Promise params fix + AgentDetailModal with contact info, bio, specialist, agent reference, verified tick.
- Agent schema expanded: Agent_Reference, Featured_Agent, Identity_Verification_Status, Verification_Fee_Active, Specialist_Vocation, Public_WhatsApp, Public_Email, Display_Name, Tagline.
- Agent form: display name, tagline, specialism dropdown, public contact fields, agent ID reference (read-only), verified upsell checkbox + proof-of-ID upload, featured upsell checkbox.
- Auto-generated agent reference (`QRC-XXXXXX`) on `createAgent`.
- Super-admin dashboard rewritten: stats (total/verified/pending/featured), pending verification queue, searchable agent table.
- Bottom sections on both directories: Marketplace notice (shield icon) + Advertise with QRcasas (blue Real Estate Agents + teal Add Property buttons).

## Agent Upsell Pricing (UI done, Stripe recurring NOT yet wired)
- Verified Agent: 300 MXN/month recurring — blue tick + proof of ID upload
- Featured Agent: 300 MXN/month recurring — featured in directory horizontal scroll
- Teable fields exist: `Featured_Agent`, `Identity_Verification_Status`, `Verification_Fee_Active`, `Agent_Reference`
- Need: Stripe recurring subscription checkout + webhook handling for `customer.subscription.updated` / `customer.subscription.deleted`

## Security Status
- GitHub PAT (`ghp_…`), Teable PAT (`teable_…`), and Stripe restricted key (`rk_live_…`) all exposed in chat — **must be rotated**.
- Do not merge application-owned password hashing or password-reset code.
- Do not store tokens in this manifest or Git.

## Pending / Next
- [ ] Wire agent upsell checkboxes to Stripe recurring subscriptions (300 MXN/mo each)
- [ ] Create Stripe Price IDs for recurring verified + featured subscriptions
- [ ] Add webhook events: `customer.subscription.updated`, `customer.subscription.deleted`
- [ ] Stripe Customer Portal for subscribers to manage/cancel billing
- [ ] Auto-advancing featured rails (8-second scroll, pause on hover) — Teable workspace has this, this checkout has static arrows only
- [ ] QR code downloads for properties and agent profiles
- [ ] Contact analytics (Agent Contact Modal Opened event)
- [ ] Agent portfolio section with #portfolio anchor
- [ ] Test Stripe end-to-end: create property → checkout → pay → webhook → Paid → Photo_Package=Paid
- [ ] Rotate exposed credentials: GitHub PAT, Teable PAT, Stripe restricted key
- [ ] Do not recreate the five removed duplicate lifecycle fields.
- [ ] Consider merging Teable workspace commits (5a94793, 7c3a788) if they push to origin/main

## Key Architecture Notes
- Properties page: `PropertiesExplorer` client component, mode state: "featured" | "search" | "latest"
- Directory page: `DirectoryExplorer` client component, same mode pattern
- AgentDetailModal: client component, auto-opens on page load, shows contact info only (no sign-in gate yet — Teable workspace gates contact behind sign-in)
- lucide-react v1.28.0 does NOT have brand icons (Instagram, Facebook, Linkedin) — use Globe instead
- Push via realaicasa PAT: `git push "https://realaicasa:ghp_...@github.com/realaicasa/QRcasas.git" main`
- npm commands (not pnpm): `npm run typecheck`, `npm test`, `npm run build`
