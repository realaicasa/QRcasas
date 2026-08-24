# PHASE 8: QA, SECURITY, DEPLOYMENT & HANDOFF

## Objective
Validate production readiness, ensure security, and create complete handoff documentation.

## Pre-Deployment Checklist

### Functional QA
- [ ] **Realtor Flow**
  - [ ] Registration & email verification
  - [ ] Profile creation (photo, bio, areas, specialties)
  - [ ] Property creation (basic + enhanced)
  - [ ] Photo upload (profile, logo, property photos)
  - [ ] AI lifestyle suggestions + review/edit
  - [ ] Property edit & photo management
  - [ ] Dashboard stats & intent analytics
  - [ ] Profile QR code generation & sharing

- [ ] **Buyer Flow**
  - [ ] Traditional search (price, beds, baths, location)
  - [ ] Lifestyle filter search (sliders, weights)
  - [ ] Natural language search ("Describe your dream")
  - [ ] Deal Breakers panel (hard exclusions work)
  - [ ] Property cards show match % & accolades
  - [ ] Property detail: Living Experience section
  - [ ] Property detail: QR code display/download
  - [ ] Contact modal: intent capture + anti-scraping
  - [ ] Agent modal: sign-in gate for contact info
  - [ ] Portfolio page: match % + "Why this matches"
  - [ ] Saved properties / watchlist

- [ ] **Agent/Realtor Pages**
  - [ ] Agent profile page (/en/agent/{id})
  - [ ] Agent QR code generation
  - [ ] Agent portfolio grid
  - [ ] Agent QR code download/share

- [ ] **Sponsor Flow**
  - [ ] Sponsor registration form
  - [ ] Sponsor dashboard
  - [ ] Stripe subscription checkout (1,200 MXN/mo)
  - [ ] Webhook handling for subscription events

- [ ] **Super Admin**
  - [ ] Agent verification queue
  - [ ] Sponsor approval queue
  - [ ] Analytics dashboard

- [ ] **Super Admin Dashboard**
  - [ ] Stats cards (total agents, verified, pending, featured)
  - [ ] Pending verification queue with approve/reject
  - [ ] Agent search & filter
  - [ ] Property audit log

### Mobile Responsiveness
- [ ] Homepage hero & search modes
- [ ] Property cards grid (1 col mobile, 2 tablet, 3 desktop)
- [ ] Filter bar: collapsible on mobile
- [ ] Property detail: gallery swipe, sticky contact button
- [ ] Contact modal: full-screen on mobile
- [ ] Realtor dashboard: horizontal scroll tables
- [ ] Filter bar: bottom sheet on mobile
- [ ] QR code display: full width on mobile
- [ ] Agent modal: full-screen on mobile

### Accessibility
- [ ] Semantic HTML5 landmarks
- [ ] ARIA labels on all interactive elements
- [ ] Focus visible states
- [ ] Color contrast AA (4.5:1 minimum)
- [ ] Keyboard navigation (tab order, focus trap in modals)
- [ ] Screen reader announcements for live regions
- [ ] Alt text on all images
- [ ] Focus trap in modals
- [ ] Skip to main content link

### Performance
- [ ] LCP < 2.5s on 3G
- [ ] CLS < 0.1
- [ ] FID < 100ms
- [ ] Images: next/image with blur placeholder
- [ ] Code splitting by route
- [ ] Static generation where possible
- [ ] Font optimization (next/font)
- [ ] Bundle analysis (<200KB JS initial)

### SEO & Social
- [ ] Dynamic OG tags per property/agent
- [ ] JSON-LD structured data (RealEstateListing, Person)
- [ ] Sitemap.xml generation
- [ ] Robots.txt
- [ ] Canonical URLs
- [ ] hreflang for en/es

## Data QA

### Data Integrity
- [ ] Area defaults populate correctly
- [ ] Community defaults inherit from area
- [ ] Property overrides preserve area defaults
- [ ] Effective values calculate correctly
- [ ] Provenance tracked on all scored fields
- [ ] No duplicate properties
- [ ] No orphaned records (properties without agents)
- [ ] Agent references valid
- [ ] Location hierarchy intact (City → Area → Community)
- [ ] Sponsor adverts link to valid sponsors

### Contact Analytics
- [ ] `contact_modal_open` fires on modal open
- [ ] Intent type captured (question/viewing/info/whatsapp/call)
- [ ] Deduplication: same session/property within 5s = 1 event
- [ ] Agent dashboard shows accurate counts
- [ ] Events persist across sessions

### Media Handling
- [ ] Sharp processes images → WebP, 2400px max, 82% quality
- [ ] Uploads to Teable attachment endpoint
- [ ] Alt text stored & displayed
- [ ] Featured image = first uploaded
- [ ] Signed URLs for private images
- [ ] Fallback placeholder for missing images
- [ ] Max 15MB per image
- [ ] Max 10 photos (upgrade) / 1 standard

## Security Review

### Authentication & Authorization
- [ ] Session cookie: `qrcasas_session` (HttpOnly, Secure, SameSite=Lax)
- [ ] Password hashing: bcrypt (cost 12)
- [ ] CSRF protection on all mutations
- [ ] Rate limiting: 10 req/min on auth, 100 req/min general
- [ ] Session expiry: 30 days
- [ ] Password reset: time-limited token, single use

### Data Protection
- [ ] No exact property addresses in public API
- [ ] Agent contact info never in public API/HTML
- [ ] Contact modal: server-side contact delivery
- [ ] PII encrypted at rest (Teable handles)
- [ ] No PII in client-side logs/analytics
- [ ] GDPR/privacy policy links in footer

### API Security
- [ ] Rate limiting: 60 req/min authenticated, 20 anon
- [ ] Input validation on all endpoints (Zod schemas)
- [ ] SQL injection prevention (parameterized queries via Teable)
- [ ] XSS prevention (React auto-escaping + DOMPurify for rich text)
- [ ] CORS: restrict to qrcasas.com domains
- [ ] CSP headers configured

### Stripe Security
- [ ] Webhook signature verification on all events
- [ ] Idempotency keys on checkout creation
- [ ] Metadata validation (no user-controlled critical fields)
- [ ] Subscription status synced to Teable
- [ ] Customer Portal integration for self-service

### Secrets Management
- [ ] NO secrets in code/repo
- [ ] All secrets in Vercel Environment Variables
- [ ] Rotation schedule documented
- [ ] Separate dev/staging/prod credentials

## Deployment Checklist

### Vercel Configuration
- [ ] Production branch: `main`
- [ ] Preview deployments for PRs
- [ ] Environment variables set in Vercel dashboard
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Node.js version: 20.x
- [ ] Edge runtime for middleware

### Environment Variables (Vercel)
```
TEABLE_API_URL=https://app.teable.ai/api
TEABLE_API_TOKEN=***
STRIPE_SECRET_KEY=***
STRIPE_WEBHOOK_SECRET=***
STRIPE_PRICE_SINGLE_PROPERTY=price_...
STRIPE_PRICE_UP_TO_10=price_...
STRIPE_PRICE_UP_TO_25=price_...
STRIPE_PRICE_SPONSOR_MONTHLY=price_...  # 1200 MXN
NEXT_PUBLIC_SITE_URL=https://qrcasas.com
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://qrcasas.com
```

### GitHub
- [ ] Branch protection on `main`
- [ ] Required reviews: 1
- [ ] Status checks required: typecheck, test, build
- [ ] Auto-delete merged branches
- [ ] Dependabot alerts enabled
- [ ] Code scanning (CodeQL) enabled

### Monitoring & Alerting
- [ ] Vercel Analytics enabled
- [ ] Error tracking (Sentry or similar)
- [ ] Uptime monitoring (cron job / external)
- [ ] Webhook failure alerts (Stripe, Teable)
- [ ] Build failure notifications

## Rollback Plan
- [ ] Vercel instant rollback tested
- [ ] Database migration rollback scripts ready
- [ ] Feature flags for risky features
- [ ] Database backup schedule verified

## Handoff Documentation

### `docs/QRcasas_STATUS.md`
- [ ] Current commit hash
- [ ] Deployed commit hash
- [ ] Open issues / known bugs
- [ ] Pending features
- [ ] Credentials rotation schedule
- [ ] Key architectural decisions
- [ ] Team contacts & escalation paths

### `docs/QRcasas_ARCHITECTURE.md`
- [ ] System diagram
- [ ] Data flow diagrams
- [ ] API contracts
- [ ] Database schema
- [ ] Component hierarchy
- [ ] Authentication flow
- [ ] Payment flow
- [ ] Deployment topology

### `docs/QRcasas_STATUS.md`
- [ ] Current sprint status
- [ ] Open issues (GitHub issue #s)
- [ ] Technical debt items
- [ ] Performance benchmarks
- [ ] Upcoming milestones

## Exit Criteria
- [ ] All functional QA pass
- [ ] Security review pass
- [ ] Performance budgets met
- [ ] Accessibility audit pass
- [ ] Build passes in CI
- [ ] Preview deployment verified
- [ ] Stakeholder demo completed
- [ ] Documentation updated
- [ ] Rollback tested
- [ ] On-call rotation defined

---
*Phase 8 complete = Production Ready*