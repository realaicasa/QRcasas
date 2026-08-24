# PHASE 1: AUDIT & ARCHITECTURE REVIEW

## Objective
Complete comprehensive audit of existing codebase, identify all current functionality, document architecture decisions, and create baseline for future development.

## Deliverables
- [ ] `docs/architecture/ARCHITECTURE.md` - Complete architecture document
- [ ] `docs/architecture/DATABASE_SCHEMA.md` - Current Teable schema documentation
- [ ] `docs/architecture/API_CONTRACTS.md` - All API endpoints documented
- [ ] `docs/architecture/COMPONENT_INVENTORY.md` - All React components cataloged
- [ ] `docs/architecture/DEPENDENCY_GRAPH.md` - Component dependency tree
13: - [ ] `docs/architecture/STATE_MANAGEMENT.md` - State management patterns
14: - [ ] `docs/architecture/SECURITY_AUDIT.md` - Security review findings

## Audit Checklist

### Core Application
- [ ] Next.js 16 App Router structure
- [ ] Middleware & authentication flow
21: - [ ] Internationalization (i18n) setup
22: - [ ] PWA configuration (manifest, service worker)
23: - [ ] Error boundaries & error handling

### Database Layer
- [ ] Teable client implementation (`src/lib/data/teable/client.ts`)
26: - [ ] SQL dialect parser (`src/lib/data/teable/sql.ts`)
27: - [ ] Table definitions (`src/lib/data/teable/tables.ts`)
28: - [ ] Field mappings (`src/lib/data/teable/fields.generated.ts`)
30: - [ ] Request wrapper (`src/lib/request.ts`)
31: - [ ] Cache strategy (`src/lib/data/cache.ts`)

### API Endpoints
- [ ] `/api/uploads/attachment` - Photo uploads
- [ ] `/api/activity` - Contact tracking
- [ ] `/api/stripe/checkout` - One-time payments
- [ ] `/api/stripe/subscription` - Agent recurring upsells
- [ ] `/api/stripe/sponsor-checkout` - Sponsor subscriptions
- [ ] `/api/stripe/webhook` - Stripe webhook handler
- [ ] `/api/activity` - Contact analytics
- [ ] `/api/sponsors/create` - Sponsor creation

### Component Architecture
- [ ] Property components (card, form, create flow, edit flow, filter bar)
- [ ] Directory components (agent form, detail modal, directory explorer)
- [ ] Shared components (QR code display, SEO fields, install prompt)
- [ ] Layout components (header, footer, modal, forms)

### Data Layer
- [ ] Property CRUD (`src/lib/data/property.ts`)
- [ ] Agent CRUD (`src/lib/data/agents.ts`)
- [ ] Renewals (`src/lib/data/renewals.ts`)
- [ ] Sponsors (`src/lib/data/sponsors.ts`)
- [ ] Activity tracking (`src/lib/data/activity.ts`)
- [ ] Locations (`src/lib/data/locations.ts`)

### Stripe Integration
- [ ] `src/lib/stripe.ts` - Core Stripe helpers
- [ ] Checkout routes (one-time, subscription, sponsor)
- [ ] Webhook handler with signature verification
- [ ] Subscription management (agent upsells, sponsor subscriptions)

## Current Pain Points (Documented)
1. **Session cookie mismatch** - Fixed: `getCustomerAuth()` now reads `qrcasas_session` first
2. **Login routing wrong account** - Fixed: `getUserByEmail` no longer filters by `Is_Verified`
3. **Property detail page blank** - Fixed: Removed `t` function prop from client components
4. **Image upload failing** - Session cookie mismatch was root cause
5. **Images not displaying** - Media fallback working but real images not loading
5. **Agent photo upload failing** - Upload error handling added
6. **Property images not showing** - Media fallback working but real images not displaying

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
- [ ] Document Teable field mappings completely

## Critical Rule
Do not rebuild functioning systems simply because a different architecture might be cleaner.

Extend where practical.

## Exit Criteria
The next developer can understand the existing application without reading the original chat.