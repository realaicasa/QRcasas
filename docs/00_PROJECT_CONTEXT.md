# QRcasas Build Phase Documentation

## Project Overview
**Project**: QRcasas - Quintana Roo Real Estate Platform with Lifestyle-Based Matching
**Location**: `F:\Mike d drive\Mike Webs\mAIstermind.com\projects\QRCasas\QRcasas-github`
**Current Commit**: `eacbdcb1` (main branch)
**Repository**: `https://github.com/realaicasa/QRcasas.git`

## Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Database**: Teable (Airtable-like) with REST API
- **Auth**: Custom session-based (qrcasas_session cookie)
- **Payments**: Stripe (one-time + recurring subscriptions)
- **Deployment**: Vercel (auto-deploy from GitHub main)
- **Source Control**: GitHub (realaicasa/QRcasas)
- **Development**: Antigravity/OpenCode agents, Google AI Studio
- **PWA**: Service worker, manifest, icons

## Key Architecture Decisions
1. **No exact property addresses** - Uses area/community hierarchy instead
2. **Session cookie**: `qrcasas_session` (not `session`)
3. **Client/Server boundary**: NEVER pass functions (`t`) to client components
4. **Teable as source of truth** - No local DB, all data via Teable API
5. **Stripe webhook** is sole payment authority
6. **Media fallback**: `lib/media.ts` provides placeholder images
7. **Area DNA inheritance** - properties inherit area defaults, can override
8. **Teable API** base: `https://app.teable.ai/api` (normalizes legacy URLs)

## Current Teable Tables
| Table | ID | Purpose |
|-------|-----|---------|
| Portal Users | `tbl394RbduZlmHUni8e` | User accounts |
| Agents | `tbluaZYX8Umw7VuZHVG` | Realtor profiles |
| Properties | `tblUlJEDQW8xvlqMviu` | Property listings |
| Locations | `tblRMqpDs1ilZAOacsH` | Cities/Areas/Developments |
| Property Activity | `tblbiHm44TeA55UEWSt` | Contact analytics |
| Listing Renewals | `tbl7XnhLXWvbRJXXh6L` | Subscription tracking |
| Sponsor Accounts | `tbliuwzQOgnEFQNqxj9` | Sponsor profiles |
| Business Adverts | `tbln1kaLnMBM9jlgyV8` | Sponsor adverts |
| Directory Subscriptions | `tblIk58JzxlY532W6A0` | Agent subscriptions |

## Key Files Structure
```
src/
├── app/
│   ├── [locale]/
│   │   ├── properties/
│   │   │   ├── page.tsx          # Main search with lifestyle filters
│   │   │   ├── [slug]/page.tsx   # Property detail with QR, gallery
│   │   │   └── components/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-form.tsx
│   │   │   ├── filter-bar.tsx
│   │   │   ├── properties-explorer.tsx
│   │   │   └── property-edit-flow.tsx
│   │   ├── directory/
│   │   │   ├── page.tsx          # Agent directory with lifestyle cards
│   │   │   ├── [agentId]/page.tsx # Agent detail with modal
│   │   │   ├── [agentId]/edit/page.tsx # Edit profile + upsells
│   │   │   ├── register/page.tsx
│   │   │   └── components/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-detail-modal.tsx
│   │   │   └── directory-explorer.tsx
│   │   ├── account/
│   │   │   ├── properties/page.tsx      # Agent dashboard
│   │   │   ├── properties/new/page.tsx  # Create property flow
│   │   │   └── properties/[id]/edit/    # Edit with photo uploads
│   │   ├── sponsors/
│   │   │   ├── register/page.tsx
│   │   │   └── dashboard/page.tsx
│   │   ├── super-admin/dashboard/page.tsx
│   │   ├── api/
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/route.ts      # One-time listing payments
│   │   │   │   ├── subscription/route.ts  # Agent recurring upsells
│   │   │   │   ├── sponsor-checkout/route.ts # Sponsor subscriptions
│   │   │   │   └── webhook/route.ts       # Stripe webhook handler
│   │   │   ├── uploads/attachment/route.ts # Photo uploads to Teable
│   │   │   ├── activity/route.ts          # Contact tracking
│   │   │   └── sponsors/create/route.ts
│   │   └── layout.tsx
│   ├── components/
│   ├── components/
│   │   ├── shared/
│   │   │   ├── qr-code-display.tsx      # QR code generator + download
│   │   │   └── install-prompt.tsx
│   │   ├── layout/
│   │   │   ├── site-header.tsx          # Header with QR links
│   │   │   └── site-footer.tsx          # Marketplace notice + CTA
│   │   ├── properties/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-form.tsx
│   │   │   ├── property-create-flow.tsx # Wizard: price → form → upload → Stripe
│   │   │   ├── property-edit-flow.tsx   # Edit + photo upload → dashboard
│   │   │   ├── filter-bar.tsx           # Search + lifestyle filters
│   │   │   ├── properties-explorer.tsx  # Client wrapper for search modes
│   │   │   ├── contact-details-modal.tsx
│   │   │   └── enquiry-form.tsx
│   │   ├── directory/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-detail-modal.tsx
│   │   │   ├── directory-explorer.tsx
│   │   │   └── sponsor-modal.tsx
│   │   ├── layout/
│   │   │   ├── site-header.tsx          # Header with QR links
│   │   │   └── site-footer.tsx          # Marketplace notice + CTA
│   │   ├── properties/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-form.tsx
│   │   │   ├── property-create-flow.tsx # Wizard: price → form → upload → Stripe
│   │   │   ├── property-edit-flow.tsx   # Edit + photo upload → dashboard
│   │   │   ├── filter-bar.tsx           # Search + lifestyle filters
│   │   │   ├── properties-explorer.tsx  # Client wrapper for search modes
│   │   │   ├── contact-details-modal.tsx
│   │   │   └── enquiry-form.tsx
│   │   ├── directory/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-detail-modal.tsx
│   │   │   ├── directory-explorer.tsx
│   │   │   └── sponsor-modal.tsx
│   │   ├── layout/
│   │   │   ├── site-header.tsx          # Header with QR links
│   │   │   └── site-footer.tsx          # Marketplace notice + CTA
│   │   ├── properties/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-form.tsx
│   │   │   ├── property-create-flow.tsx # Wizard: price → form → upload → Stripe
│   │   │   ├── property-edit-flow.tsx   # Edit + photo upload → dashboard
│   │   │   ├── filter-bar.tsx           # Search + lifestyle filters
│   │   │   ├── properties-explorer.tsx  # Client wrapper for search modes
│   │   │   ├── contact-details-modal.tsx
│   │   │   └── enquiry-form.tsx
│   │   ├── directory/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-detail-modal.tsx
│   │   │   ├── directory-explorer.tsx
│   │   │   └── sponsor-modal.tsx
│   │   ├── layout/
│   │   │   ├── site-header.tsx          # Header with QR links
│   │   │   └── site-footer.tsx          # Marketplace notice + CTA
│   │   ├── properties/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-form.tsx
│   │   │   ├── property-create-flow.tsx # Wizard: price → form → upload → Stripe
│   │   │   ├── property-edit-flow.tsx   # Edit + photo upload → dashboard
│   │   │   ├── filter-bar.tsx           # Search + lifestyle filters
│   │   │   ├── properties-explorer.tsx  # Client wrapper for search modes
│   │   │   ├── contact-details-modal.tsx
│   │   │   └── enquiry-form.tsx
│   │   ├── directory/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-detail-modal.tsx
│   │   │   ├── directory-explorer.tsx
│   │   │   └── sponsor-modal.tsx
│   │   ├── layout/
│   │   │   ├── site-header.tsx          # Header with QR links
│   │   │   └── site-footer.tsx          # Marketplace notice + CTA
│   │   ├── properties/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-form.tsx
│   │   │   ├── property-create-flow.tsx # Wizard: price → form → upload → Stripe
│   │   │   ├── property-edit-flow.tsx   # Edit + photo upload → dashboard
│   │   │   ├── filter-bar.tsx           # Search + lifestyle filters
│   │   │   ├── properties-explorer.tsx  # Client wrapper for search modes
│   │   │   ├── contact-details-modal.tsx
│   │   │   └── enquiry-form.tsx
│   │   ├── directory/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-detail-modal.tsx
│   │   │   ├── directory-explorer.tsx
│   │   │   └── sponsor-modal.tsx
│   │   ├── layout/
│   │   │   ├── site-header.tsx          # Header with QR links
│   │   │   └── site-footer.tsx          # Marketplace notice + CTA
│   │   ├── properties/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-form.tsx
│   │   │   ├── property-create-flow.tsx # Wizard: price → form → upload → Stripe
│   │   │   ├── property-edit-flow.tsx   # Edit + photo upload → dashboard
│   │   │   ├── filter-bar.tsx           # Search + lifestyle filters
│   │   │   ├── properties-explorer.tsx  # Client wrapper for search modes
│   │   │   ├── contact-details-modal.tsx
│   │   │   └── enquiry-form.tsx
│   │   ├── directory/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-detail-modal.tsx
│   │   │   ├── directory-explorer.tsx
│   │   │   └── sponsor-modal.tsx
│   │   ├── layout/
│   │   │   ├── site-header.tsx          # Header with QR links
│   │   │   └── site-footer.tsx          # Marketplace notice + CTA
│   │   ├── properties/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-form.tsx
│   │   │   ├── property-create-flow.tsx # Wizard: price → form → upload → Stripe
│   │   │   ├── property-edit-flow.tsx   # Edit + photo upload → dashboard
│   │   │   ├── filter-bar.tsx           # Search + lifestyle filters
│   │   │   ├── properties-explorer.tsx  # Client wrapper for search modes
│   │   │   ├── contact-details-modal.tsx
│   │   │   └── enquiry-form.tsx
│   │   ├── directory/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-detail-modal.tsx
│   │   │   ├── directory-explorer.tsx
│   │   │   └── sponsor-modal.tsx
│   │   ├── layout/
│   │   │   ├── site-header.tsx          # Header with QR links
│   │   │   └── site-footer.tsx          # Marketplace notice + CTA
│   │   ├── properties/
│   │   │   ├── property-card.tsx
│   │   │   ├── property-form.tsx
│   │   │   ├── property-create-flow.tsx # Wizard: price → form → upload → Stripe
│   │   │   ├── property-edit-flow.tsx   # Edit + photo upload → dashboard
│   │   │   ├── filter-bar.tsx           # Search + lifestyle filters
│   │   │   ├── properties-explorer.tsx  # Client wrapper for search modes
│   │   │   ├── contact-details-modal.tsx
│   │   │   └── enquiry-form.tsx
│   │   ├── directory/
│   │   │   ├── agent-form.tsx
│   │   │   ├── agent-detail-modal.tsx
│   │   │   ├── directory-explorer.tsx
│   │   │   └── sponsor-modal.tsx
│   │   ├── layout/
│   │   │   ├── site-header.tsx          # Header with QR links
│   │   │   └── site-footer.tsx          # Marketplace notice + CTA
│   ├── lib/
│   ├── lib/
│   │   ├── data/
│   │   │   ├── property.ts           # Core property CRUD + search
│   │   │   ├── agents.ts             # Agent CRUD + lifestyle fields
│   │   │   ├── agents.ts             # Agent profile + upsells
│   │   │   ├── renewals.ts           # Renewal CRUD + Stripe sync
│   │   │   ├── sponsors.ts           # Sponsor CRUD
│   │   │   ├── renewals.ts           # Contact tracking
│   │   │   ├── activity.ts           # Contact analytics
│   │   │   ├── locations.ts          # Location hierarchy
│   │   │   ├── renewals.ts           # Sponsor data layer
│   │   │   ├── teable/
│   │   │   │   ├── client.ts         # TeableClient with SQL dialect
│   │   │   │   ├── tables.ts         # Table ID mappings
│   │   │   │   ├── fields.generated.ts # Field ID mappings
│   │   │   │   └── sql.ts            # SQL helpers
134: │   │   │   ├── cache.ts              # Next.js cache tags
135: │   │   │   ├── eligibility.ts        # Public listing filters
136: │   │   │   └── media.ts              # Safe image URL helpers
137: │   │   ├── stripe.ts                 # Stripe checkout/retrieve/verify
137: │   │   ├── request.ts                # Teable fetch + URL normalization
138: │   │   ├── customer-auth.ts          # Session validation
│   │   ├── i18n.ts                   # EN/ES translations
│   │   ├── stripe.ts                 # Stripe helpers
138: │   │   └── request.ts                # Teable fetch wrapper
139: └── app/layout.tsx                # Root layout with manifest/icons
```

## Current Stripe Configuration (LIVE)
- `STRIPE_SECRET_KEY`: `[REDACTED - SET IN VERCEL]`
- `STRIPE_WEBHOOK_SECRET`: `[REDACTED - SET IN VERCEL]`
- Webhook endpoint: `https://qrcasas.com/api/stripe/webhook`
- Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`
- Prices: Single (500 MXN), 10-pack (3,000 MXN), 25-pack (6,900 MXN), Photo add-on (200 MXN inline)

## Known Issues to Fix Next Session
1. **Image upload still failing** - Session cookie fix deployed, needs live test
2. **Property detail page** - May still be blank on some properties
3. **Agent image upload** - Save failed reported
4. **Property images not showing** - Placeholder fallback working but real images not appearing
5. **Pro/Pro Plus tier upgrades** - Not yet wired to Stripe (need Price IDs)
7. **Sponsor dashboard** - Basic structure exists, needs full CRUD
8. **Media fallback** - Placeholder working but real images not loading

## Architecture Decision Records (ADRs)
- ADR-001: No functions passed to client components
- ADR-002: `qrcasas_session` cookie primary, `session` fallback
- ADR-003: Teable as single source of truth
- ADR-004: Stripe webhook = sole payment authority
- ADR-005: Media fallback for broken images
- ADR-006: Area DNA inheritance with realtor overrides
- ADR-007: `qrcasas_session` cookie primary, `session` fallback

## Next Steps
- [ ] Document all Teable field mappings
- [ ] Create migration scripts for new schema fields
- [ ] Set up automated testing for critical paths
- [ ] Configure CI/CD for preview deployments

---
*Last Updated: 2026-08-19*
*Commit: efc7bfc9*