# QRcasas Architecture Document

## System Overview

QRcasas is a Quintana Roo real estate platform that differentiates through **Lifestyle Intelligence** — matching buyers to properties based on how they want to live, not just bedrooms and price.

```
┌─────────────────────────────────────────────────────────────────┐
│                        QRcasas Platform                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐       │
│   │    BUYER    │    │   REALTOR   │    │   SPONSOR   │       │
│   │  EXPERIENCE │    │  EXPERIENCE │    │  EXPERIENCE │       │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘       │
│          │                  │                  │               │
│          ▼                  ▼                  ▼               │
│   ┌─────────────────────────────────────────────────────┐     │
│   │           QRcasas Core Platform                     │     │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │     │
│   │  │ Search  │ │ Match   │ │ Profile │ │ Dashboard│  │     │
│   │  │ Engine  │ │ Engine  │ │ Builder │ │ & Analytics│ │
│   │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘  │     │
│   └───────┼────────────┼───────────┼────────────┼──────┘     │
│           │            │           │            │            │
└───────────┼────────────┼───────────┼────────────┼────────────┘
            │            │           │            │
            ▼            ▼           ▼            ▼
    ┌─────────────────────────────────────────────────────────┐
    │              QRcasas Core Services                      │
    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
    │  │ Property │ │  Agent   │ │ Lifestyle│ │  Match   │  │
    │  │ Service  │ │ Service  │ │ Engine   │ │ Engine   │  │
    │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
    └─────────────────────────────────────────────────────────┘
            │            │           │            │
            ▼            ▼           ▼            ▼
    ┌─────────────────────────────────────────────────────────┐
    │                    DATA LAYER                            │
    │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
    │  │  Teable  │ │  Stripe  │ │  OpenAI  │ │  Higgsfield│  │
    │  │  (DB)    │ │ (Payments)│ │ (AI/ML)  │ │ (Creative) │  │
    │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
    └─────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | Next.js | 16 (App Router) | React framework |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| UI Components | Lucide React | Latest | Icon system |
| Database | Teable | Cloud | Structured data |
| Auth | Custom | Cookie-based | `qrcasas_session` |
| Payments | Stripe | Latest | Payments & subscriptions |
| AI/ML | OpenAI | GPT-4o-mini | Natural language → structured data |
| Creative | Higgsfield | Marketing Studio | AI video/image generation |
| Auth | Custom | Cookie-based | `qrcasas_session` |
| Deployment | Vercel | Latest | Edge + Serverless |
| Source Control | GitHub | - | Version control |
| CI/CD | Vercel | GitHub integration | Auto-deploy |
| Analytics | Vercel Analytics | Built-in | Web vitals |
| Error Tracking | Console/Server logs | - | Debugging |

## Data Architecture

### Core Entities & Relationships

```
CITY (1) ──< AREA (1) ──< COMMUNITY (1) ──< BUILDING (1) ──< PROPERTY
     │                              │
     ▼                              ▼
  AREA_DNA                    COMMUNITY_DNA
 (20 attrs)                   (15 attrs)
                                  │
                                  ▼
                          BUILDING_DNA
                          
PROPERTY ──< PROPERTY_DNA (20 attrs)
       └── PROPERTY_LIVING_EXPERIENCE (25 attrs)
            │
            ├── PROPERTY_DNA (20 attrs)
            ├── PROPERTY_LIVING_EXPERIENCE (25 attrs)
            ├── PROPERTY_LIFESTYLE_SOURCES (provenance)
            ├── PROPERTY_ACCOLADES (computed badges)
            └── PROPERTY_LIFESTYLE_SOURCES (provenance)
```

### Key Tables (Teable)

| Table | Teable ID | Key Fields |
|-------|-----------|------------|
| Portal Users | `tbl394RbduZlmHUni8e` | Email, language, verified |
| Agents | `tbluaZYX8Umw7VuZHVG` | Profile, tier, lifestyle |
| Properties | `tblUlJEDQW8xvlqMviu` | Listings + Lifestyle DNA |
| Locations | `tblRMqpDs1ilZAOacsH` | City/Area/Community hierarchy |
| Property Activity | `tblbiHm44TeA55UEWSt` | Contact events, analytics |
| Listing Renewals | `tbl7XnhLXWvbRJXXh6L` | Subscription lifecycle |
| Sponsor Accounts | `tbliuwzQOgnEFQNqxj9` | Sponsor profiles |
| Business Adverts | `tbln1kaLnMBM9jlgyV8` | Sponsor adverts |
| Directory Subscriptions | `tblIk58JzxlY532W6A0` | Agent tier subscriptions |
| Advertiser Verifications | `tblVYj7pAh9OMcDAA08` | ID verification |

## Component Architecture

### Frontend Component Hierarchy

```
app/
├── layout.tsx                    # Root layout + providers
├── page.tsx                      # Redirect to /en/properties
├── [locale]/
│   ├── layout.tsx                # Locale layout + header/footer
│   ├── page.tsx                  # Redirect to /en/properties
│   ├── properties/
│   │   ├── page.tsx              # Search + results (server) + sponsor carousel
│   │   ├── [slug]/page.tsx       # Property detail with QR, gallery, Living Experience, compare dock, closing-cost button
│   │   ├── components/
│   │   │   ├── PropertiesExplorer.tsx    # Client: search modes
│   │   │   ├── PropertyCard.tsx          # Card with match % + accolades
│   │   │   ├── FilterBar.tsx             # Lifestyle filters
│   │   │   ├── PropertyForm.tsx          # Create/edit form + Lifestyle DNA tab
│   │   │   ├── PropertyCreateFlow.tsx    # Wizard: price → form → upload → Stripe
│   │   │   ├── PropertyEditFlow.tsx      # Edit + photo upload
│   │   │   ├── PropertiesExplorer.tsx    # Client wrapper
│   │   │   ├── contact-details-modal.tsx
│   │   │   └── enquiry-form.tsx
│   ├── directory/
│   │   ├── page.tsx                  # Agent directory
│   │   ├── [agentId]/page.tsx        # Agent profile + modal
│   │   ├── [agentId]/edit/page.tsx   # Edit profile + upsells
│   │   ├── register/page.tsx
│   │   └── components/
│   │       ├── agent-form.tsx
│   │       ├── agent-detail-modal.tsx
│   │       ├── directory-explorer.tsx
│   │       └── sponsor-modal.tsx
│   ├── account/
│   │   ├── properties/page.tsx       # Agent dashboard
│   │   ├── properties/new/page.tsx   # Create property flow
│   │   └── properties/[id]/edit/     # Edit + photo upload
│   ├── sponsors/
│   │   ├── register/page.tsx
│   │   └── dashboard/page.tsx
│   ├── super-admin/dashboard/page.tsx
│   ├── api/
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts     # One-time payments
│   │   │   ├── subscription/route.ts # Agent recurring
│   │   │   ├── sponsor-checkout/     # Sponsor subscriptions
│   │   │   └── webhook/route.ts      # Stripe webhooks
│   │   ├── uploads/attachment/route.ts # Photo uploads
│   │   ├── activity/route.ts         # Contact tracking
│   │   └── sponsors/create/route.ts
│   └── layout.tsx
```

### Component Data Flow

```
PropertyCreateFlow (Client)
    │
    ├─► PricingModal → selects tier
    │
    ├─► PropertyForm (Client)
    │     ├─► Basic Info
    │     ├─► Location (City/Area/Community)
    │     ├─► Features & Amenities
    │     ├─► Photos (drag-drop, preview, alt text)
    │     ├─► Lifestyle DNA (auto-filled from area)
    │     ├─► SEO Fields (tier-gated)
    │     └─► Submit → onSubmit(data, tier)
    │
    └─► handleSubmit (Server Action)
          │
          ├─► createProperty() → Teable
          │
          ├─► Upload photos sequentially
          │     └─► /api/uploads/attachment → Teable
          │
          ├─► createPendingRenewal() → Teable
          │
          ├─► createCheckoutSession() → Stripe
          │     ├─ Line items: package + photo add-ons
          │     ├─ Metadata: renewalId, propertyRefs, totals
          │     └─ Success URL: /account/properties?paid=1&session_id={id}
          │
          ├─► updateRenewalStripeSession()
          │
          └─► Return { url } → Client redirect
```

## Data Flow Patterns

### Server Components (Default)
- Fetch data directly from Teable
- Render static content
- Pass serializable data to Client Components

### Client Components (`"use client"`)
- Interactive UI (forms, modals, sliders)
- State management (useState, useReducer)
- Browser APIs (clipboard, download, share)
- Event handlers (onClick, onChange, onSubmit)

### Server Actions (`"use server"`)
- Mutations (create, update, delete)
- Authenticated operations
- Teable writes
- Stripe checkout creation
- Redirects after mutation

### API Routes (`/api/*`)
- Webhooks (Stripe, external)
- File uploads (multipart/form-data)
- Search/autocomplete (debounced)
- Long-running operations

## Security Architecture

### Authentication Flow
```
User → Login Page → Email/Password → getUserByEmail()
                                    ↓
                              Set qrcasas_session cookie
                              (HttpOnly, Secure, SameSite=Lax, 30 days)
                                    ↓
                              Middleware reads cookie
                              → getUserByEmail(email)
                                    ↓
                              Returns { userId, email, preferredLanguage }
                                    ↓
                              Page checks session → redirect if null
```

### Authorization Matrix
| Resource | Public | Buyer | Agent | Sponsor | Super Admin |
|----------|--------|-------|-------|---------|-------------|
| Property Search | ✅ | ✅ | ✅ | ✅ | ✅ |
| Property Detail | ✅ | ✅ | ✅ | ✅ | ✅ |
| Agent Profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Property Create | ❌ | ❌ | ✅ | ❌ | ✅ |
| Property Edit | ❌ | ❌ | Owner | ❌ | ✅ |
| Agent Profile | ❌ | ❌ | Self | ❌ | ✅ |
| Agent Edit | ❌ | ❌ | Self | ❌ | ✅ |
| Dashboard | ❌ | ❌ | ✅ | ✅ | ✅ |
| Super Admin | ❌ | ❌ | ❌ | ❌ | ✅ |
| Sponsor Dashboard | ❌ | ❌ | ❌ | ✅ | ✅ |
| Webhook | ❌ | ❌ | ❌ | ❌ | ✅ |

### Data Protection
- **Exact addresses never public** — Area/Community only
- **Contact info** — Behind modal, not in HTML
- **Exact addresses** — Never in public API responses
- **Session cookies** — HttpOnly, Secure, SameSite=Lax
- **PII** — Never in client logs/analytics

## API Contracts

### Property Search
```typescript
GET /api/properties/search
Query: {
  locale: "en" | "es",
  filters: PropertyListFilters,
  sort: "newest" | "price_asc" | "price_desc",
  view: "list" | "map" | "split",
  page: number,
  pageSize: number
}

Response: {
  properties: PropertyListItem[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}
```

### Natural Language Search
```typescript
POST /api/search/natural-language
Body: { query: string, locale: "en"|"es" }
Response: {
  buyerDNA: BuyerDNA,
  results: PropertyListItem[],
  total: number
}
```

### Stripe Webhook
```typescript
POST /api/stripe/webhook
Headers: stripe-signature
Events handled:
- checkout.session.completed
- checkout.session.async_payment_succeeded
- customer.subscription.updated
- customer.subscription.deleted
```

## Deployment Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │────▶│   Vercel    │────▶│  Production │
│   (main)    │     │   Build     │     │  (Vercel)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   GitHub    │     │  Preview    │     │  Production │
│   Actions   │     │  Deploy     │     │  (qrcasas)  │
│  (CI/CD)    │     │  (PRs)      │     │  + Custom   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Teable    │
                    │  (Database) │
                    └─────────────┘
```

### Environment Variables
```bash
# Vercel Production (all via env, never committed)
TEABLE_API_URL=https://app.teable.ai/api
TEABLE_API_TOKEN=***
STRIPE_SECRET_KEY=***
STRIPE_WEBHOOK_SECRET=***  # we_1U5ZAkGe9hhLYer61iUulLAw
STRIPE_PRICE_SINGLE_PROPERTY=price_...  # 500 MXN one-time
STRIPE_PRICE_UP_TO_10=price_...         # 3000 MXN
STRIPE_PRICE_UP_TO_25=price_...         # 6900 MXN
STRIPE_PRICE_SPONSOR_MONTHLY=price_...  # 1200 MXN (or inline fallback)
SITE_URL=https://qrcasas.com
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://qrcasas.com
```

### Modal System (UX Standard)
All modals use `fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs p-3 sm:p-6 flex min-h-full items-center justify-center` with backdrop `onClick` close + `stopPropagation` on card + sticky header + Escape key. Applies to: PlatformGuideModal (open-book), Disclaimer, Legal, Install App, User Manual, BecomeSponsorModal, ClosingCostCalculator, Property Detail/Compare, BilingualSeoOpportunityModal. Ensures top visible on mobile and click-outside dismiss.

### Sponsor Portal Enhancement (Latest)
`BecomeSponsorModal.tsx` now supports featured banner + logo upload (FileReader or URL presets), headline + description (offer), external URL + WhatsApp CTA, live preview card before 1,200 MXN/mo Stripe subscription. Carousel `SponsorsAndFeaturedSection.tsx` renders banner, logo, verified badge, headline badge, description, action buttons. WebP 1600×800.

### Super Admin Analytics
`SuperAdminDashboardView.tsx`: Executive KPIs (active properties, realtors, QR scans, buyer views, intent leads, sponsor MRR), Realtor table (listings, scans, leads, AMPI status), Properties table (acoustic, beach walk, scans, views, price USD/MXN), Sponsor pipeline, Stripe catalog + webhook status, Teable sync station, header Super Admin button.

## Scaling Considerations

### Current Bottlenecks
1. **Teable API latency** — Mitigated by `signedUrl: true`, caching
2. **Image upload** — Sharp processing adds latency
3. **Search latency** — Multiple Teable queries per request
4. **AI calls** — OpenAI latency on natural language search

### Optimization Strategies
1. **Caching**: `next/cache` with `revalidate: 60` for listings
2. **Precomputed scores**: Store effective lifestyle scores
3. **Image optimization**: `next/image` with `sharp` preprocessing
4. **Batch API calls**: Combine Teable queries
4. **Edge caching**: Vercel Edge for static assets
5. **Database indexes**: Teable handles automatically

### Scaling Triggers
| Metric | Threshold | Action |
|--------|-----------|--------|
| API latency p95 | > 2s | Add caching layer |
| Teable rate limits | > 80% | Implement request queue |
| Image upload queue | > 30s | Background job queue |
| Build time | > 5 min | Optimize bundles |
| Bundle size | > 250KB | Code splitting |

## Disaster Recovery

### Backup Strategy
- Teable: Automatic daily backups (Teable managed)
- GitHub: Full repo history
- Vercel: Deployment rollback (instant)
- Stripe: Dashboard export

### RTO/RPO Targets
| Scenario | RTO | RPO |
|----------|-----|-----|
| Vercel outage | 5 min | 0 |
| Teable outage | 30 min | 24h |
| Stripe outage | N/A | N/A |
| Data corruption | 1 hour | 1 hour |

### Rollback Procedure
1. Vercel: `vercel rollback [deployment-url]`
2. Git: `git revert <commit> && git push`
3. Teable: Manual restore from backup (contact support)
4. Stripe: Dashboard > Webhooks > Resend events

## Monitoring & Observability

### Key Metrics
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| LCP (mobile) | < 2.5s | > 4s |
| API p95 | < 500ms | > 2s |
| Error rate | < 0.1% | > 1% |
| Webhook success | 100% | < 99% |
| Build time | < 3 min | > 5 min |
| Deploy frequency | Daily | < Weekly |

### Logging Strategy
- **Server**: `console.log` → Vercel Logs
- **Client**: `console.log` → Browser DevTools
- **Errors**: `console.error` → Vercel Logs + Sentry (future)
- **Audit**: `console.log` with `[AUDIT]` prefix

---
*Architecture Version: 1.0*
*Last Updated: 2026-08-19*
*Commit: efc7bfc9*