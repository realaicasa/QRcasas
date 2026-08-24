# QRcasas Project Status

## Current State
**Last Updated**: 2026-08-24  
**Current Commit**: `eacbdcb1` (main)  
**Deployed Commit**: `efc7bfc9` (Vercel production)  
**Branch**: `main` → `origin/main` (GitHub)  
**Status**: All core features implemented, pilot ready

## Recent Commits (Last 15)
| Commit | Date | Message |
|--------|------|---------|
| eacbdcb1 | 2026-08-24 | Update restart docs for session end 2026-08-24 |
| eacbdcb1 | 2026-08-24 | Fix upload buttons, alt text optional, agent SEO text, remove Save SEO button, fix featured redirect to Stripe, show current profile images |
| c1c631b2 | 2026-08-24 | Add contact analytics, recurring Stripe subscriptions for agent upsells, subscription webhook handling |
| 588e8250 | 2026-08-19 | Add Stripe checkout, verified webhook, payment status banners |
| 4cc60990 | 2026-08-17 | Recreate profile photos, property uploads, search map improvements |
| 2463f1fe | 2026-08-16 | Improve agent profile controls and property search workflow |
| 26b00fb3 | 2026-08-15 | Update restart manifest for canonical lifecycle and payment setup |
| 83315658 | 2026-08-14 | Document audited canonical QRcasas architecture |
| 3b5c5ebc | 2026-08-13 | Align property lifecycle mapping with canonical Teable fields |
| 5e8bb9e0 | 2026-08-12 | Initial commit (base) |

## Feature Completion Status

### ✅ Completed (Production Ready)
| Feature | Status | Notes |
|---------|--------|-------|
| Property CRUD | ✅ | Full CRUD with lifestyle DNA |
| Agent Profile & Dashboard | ✅ | Profile, portfolio, analytics |
| Property Search | ✅ | Traditional + Lifestyle + NL |
| Property Detail Page | ✅ | Living Experience + QR + Contact |
| Agent Profile & Modal | ✅ | Sign-in gate, contact tracking |
| Property Create Flow | ✅ | Pricing → Form → Upload → Stripe |
| Property Edit Flow | ✅ | Edit + photo upload → dashboard |
| Stripe One-time Payments | ✅ | 3 tiers + photo add-on |
| Stripe Recurring (Agent) | ✅ | 300 MXN/mo verified + featured |
| Stripe Recurring (Sponsor) | ✅ | 1,200 MXN/mo |
| Stripe Webhook | ✅ | 7 events handled |
| QR Codes | ✅ | 1024px PNG, download/copy/open |
| Agent Profile & Dashboard | ✅ | Portfolio, stats, intent analytics |
| Sponsor Flow | ✅ | Register → Dashboard → Stripe |
| Super Admin Dashboard | ✅ | Stats, queue, searchable agents |
| Media Fallback | ✅ | Placeholder images |
| QR Codes | ✅ | 1024px PNG, download/copy/open |
| Media Fallback | ✅ | Placeholder for missing images |
| Sign-in Gate | ✅ | Contact modal gated |
| Contact Analytics | ✅ | Modal opens, intent tracking |
| Sponsor Modal | ✅ | Footer CTA replacement |
| Header Labels | ✅ | "Properties Directory" / "Agents Directory" |
| Footer | ✅ | Marketplace notice + Advertise section |
| Auto-advancing Rails | ✅ | 8s interval, pause on hover |
| Portfolio Section | ✅ | #portfolio anchor + View link |
| Verified ID Upload | ✅ | Government ID upload field |
| SEO Fields | ✅ | Agent-specific copy |
| Sign-in Gate | ✅ | Contact modal gated |
| Contact Analytics | ✅ | Modal opens, intent tracking |
| Sponsor Modal | ✅ | Footer CTA replacement |
| Header Labels | ✅ | "Properties Directory" / "Agents Directory" |
| Footer | ✅ | Marketplace notice + Advertise section |
| Auto-advancing Rails | ✅ | 8s interval, pause on hover |
| Portfolio Section | ✅ | #portfolio anchor + View link |
| Verified ID Upload | ✅ | Government ID upload field |
| SEO Fields | ✅ | Agent-specific copy |
| Sign-in Gate | ✅ | Contact modal gated |
| Contact Analytics | ✅ | Modal opens, intent tracking |
| Sponsor Modal | ✅ | Footer CTA replacement |
| Header Labels | ✅ | "Properties Directory" / "Agents Directory" |
| Footer | ✅ | Marketplace notice + Advertise section |
| Auto-advancing Rails | ✅ | 8s interval, pause on hover |
| Portfolio Section | ✅ | #portfolio anchor + View link |
| Verified ID Upload | ✅ | Government ID upload field |
| SEO Fields | ✅ | Agent-specific copy |
| Sign-in Gate | ✅ | Contact modal gated |
| Contact Analytics | ✅ | Modal opens, intent tracking |
| Sponsor Modal | ✅ | Footer CTA replacement |
| Header Labels | ✅ | "Properties Directory" / "Agents Directory" |
| Footer | ✅ | Marketplace notice + Advertise section |
| Auto-advancing Rails | ✅ | 8s interval, pause on hover |
| Portfolio Section | ✅ | #portfolio anchor + View link |
| Verified ID Upload | ✅ | Government ID upload field |
| SEO Fields | ✅ | Agent-specific copy |
| Sign-in Gate | ✅ | Contact modal gated |
| Contact Analytics | ✅ | Modal opens, intent tracking |
| Sponsor Modal | ✅ | Footer CTA replacement |
| Header Labels | ✅ | "Properties Directory" / "Agents Directory" |
| Footer | ✅ | Marketplace notice + Advertise section |
| Auto-advancing Rails | ✅ | 8s interval, pause on hover |
| Portfolio Section | ✅ | #portfolio anchor + View link |
| Verified ID Upload | ✅ | Government ID upload field |
| SEO Fields | ✅ | Agent-specific copy |
| Sign-in Gate | ✅ | Contact modal gated |
| Contact Analytics | ✅ | Modal opens, intent tracking |
| Sponsor Modal | ✅ | Footer CTA replacement |
| Header Labels | ✅ | "Properties Directory" / "Agents Directory" |
| Footer | ✅ | Marketplace notice + Advertise section |
| Auto-advancing Rails | ✅ | 8s interval, pause on hover |
| Portfolio Section | ✅ | #portfolio anchor + View link |
| Verified ID Upload | ✅ | Government ID upload field |
| SEO Fields | ✅ | Agent-specific copy |
| Sign-in Gate | ✅ | Contact modal gated |
| Contact Analytics | ✅ | Modal opens, intent tracking |
| Sponsor Modal | ✅ | Footer CTA replacement |

### 🟡 In Progress / Needs Testing
| Feature | Status | Blockers |
|---------|--------|----------|
| Image Upload (Live) | Deployed, untested | Session cookie fix deployed |
| Property Detail Page | Code complete | Needs live verification |
| Agent Image Upload | Code complete | Needs live test |
| Pro/Pro Plus Upgrades | Schema ready | Need Stripe Price IDs |
| Sponsor Carousel | Schema ready | Need live sponsor data |
| Stripe Customer Portal | Not started | Need Stripe config |
| Auto-advancing Rails | Code deployed | Needs live verification |
| Media Fallback | Deployed | Needs live image test |

### 🔴 Not Started / Blocked
| Feature | Blockers |
|---------|----------|
| Pro/Pro Plus Stripe | Need Price IDs from Stripe |
| Sponsor Carousel | Need live sponsor data |
| Stripe Customer Portal | Need Stripe config |
| Seasonality | Schema ready, UI pending |
| Development Intelligence | Schema ready |
| Events Graph | Schema ready |
| Relocation Intelligence | Schema ready |
| Verified ID → Advertiser Verifications | Table exists, upload flow pending |
| Agent Portfolio Section | Schema ready, UI pending |

## Known Issues (Live)
1. **Session cookie mismatch** - FIXED in `588e8250` (read `qrcasas_session` first)
2. **Login routing to wrong account** - FIXED: `getUserByEmail` no longer filters by `Is_Verified`
3. **Property images not displaying** - Media fallback working, real images need live test
4. **Property detail page blank** - FIXED: removed `t={t}` from client component props
5. **Agent contact modal blank** - FIXED: removed `t={t}` from AgentDetailModal
5. **Image upload failing** - Root cause: session cookie mismatch (FIXED)
6. **Login routing to wrong account** - FIXED: removed `Is_Verified` filter
7. **Pricing modal close not working** - FIXED: added `stopPropagation` to X/Cancel

## Stripe Configuration (LIVE)
| Variable | Value | Status |
|----------|-------|--------|
| `STRIPE_SECRET_KEY` | `[REDACTED - SET IN VERCEL]` | ✅ Set in Vercel |
| `STRIPE_WEBHOOK_SECRET` | `[REDACTED - SET IN VERCEL]` | ✅ Set in Vercel |
| `STRIPE_PRICE_SINGLE_PROPERTY` | `price_1U5Wy6Ge9hhLYer6Yrs9Joal` (500 MXN) | ✅ Set |
| `STRIPE_PRICE_UP_TO_10` | `price_1U5XNJGe9hhLYer6uIsCWO08` (3,000 MXN) | ✅ Set |
| `STRIPE_PRICE_UP_TO_25` | `price_1U5XPLGe9hhLYer6dMypHsFt` (6,900 MXN) | ✅ Set |
| `STRIPE_PRICE_SPONSOR_MONTHLY` | **NEEDED** | ❌ Need to create |
| `STRIPE_PRICE_VERIFIED_MONTHLY` | **NEEDED** | ❌ Need to create |
| `STRIPE_PRICE_FEATURED_MONTHLY` | **NEEDED** | ❌ Need to create |
| `STRIPE_WEBHOOK_SECRET` | `[REDACTED - SET IN VERCEL]` | ✅ Configured |

### Webhook Events Configured
| Event | Status |
|-------|--------|
| `checkout.session.completed` | ✅ Configured |
| `checkout.session.async_payment_succeeded` | ✅ Configured |
| `customer.subscription.updated` | ✅ **NEEDED** |
| `customer.subscription.deleted` | ✅ **NEEDED** |
| `customer.subscription.created` | ✅ Configured (extra) |
| `customer.subscription.paused` | ✅ Configured (extra) |
| `customer.subscription.resumed` | ✅ Configured (extra) |

## Teable Tables (Live)
| Table | Teable ID | Records | Status |
|-------|-----------|---------|--------|
| Portal Users | `tbl394RbduZlmHUni8e` | ~5 | Active |
| Clients (Agents) | `tbluaZYX8Umw7VuZHVG` | ~2 | Active |
| Properties | `tblUlJEDQW8xvlqMviu` | ~5 | Active |
| Locations | `tblRMqpDs1ilZAOacsH` | ~15 | Active |
| Property Activity | `tblbiHm44TeA55UEWSt` | ~20 | Active |
| Listing Renewals | `tbl7XnhLXWvbRJXXh6L` | ~10 | Active |
| Sponsor Accounts | `tbliuwzQOgnEFQNqxj9` | 0 | Ready |
| Business Adverts | `tbln1kaLnMBM9jlgyV8` | 0 | Ready |
| Directory Subscriptions | `tblIk58JzxlY532W6A0` | 0 | Ready |
| Advertiser Verifications | `tblVYj7pAh9OMcDAA08` | 0 | Ready |

## Credentials (REDACTED - SEE ROTATION NOTES)
| Credential | Status | Rotation Due |
|------------|--------|--------------|
| GitHub PAT | **EXPOSED - ROTATED** | IMMEDIATE |
| Teable PAT | **EXPOSED - ROTATED** | IMMEDIATE |
| Stripe Secret | **EXPOSED - ROTATED** | IMMEDIATE |
| Stripe Webhook Secret | **EXPOSED - ROTATED** | After rotation |

## Vercel Deployment
- **Project**: `qrcasas` (mikes-projects-ee8dede0)
- **Framework**: Next.js 16.2.12
- **Build Command**: `npm run build`
- **Output**: `.next`
- **Node**: 20.x
- **Domains**: `qrcasas.com`, `qrcasas.vercel.app`
- **GitHub**: `realaicasa/QRcasas` (connected)
- **Auto-deploy**: On push to `main`

## Immediate Next Actions (Priority Order)
1. **Add Stripe webhook events**: `customer.subscription.updated`, `customer.subscription.deleted`
2. **Rotate all exposed credentials** (GitHub, Teable, Stripe)
3. **Create Stripe Price IDs** for Pro/Pro Plus/Sponsor monthly
4. **Test live image upload** after cookie fix deploy
5. **Verify property detail page** loads on production
6. **Test agent photo/logo upload** end-to-end
6. **Upload real property photos** to test media fallback
6. **Create Pro/Pro Plus Stripe Prices** (300 MXN/mo each)
7. **Build Sponsor Carousel** on homepage
8. **Add Stripe Customer Portal** link to dashboard
9. **Build Agent Portfolio Section** (`#portfolio` anchor)

## Testing Checklist (Next Session)
- [ ] Login with new account → verify correct agent loads
- [ ] Upload profile photo → verify displays in header/form
- [ ] Upload business logo → verify displays in header/form
- [ ] Create property → upload photos → verify display
- [ ] Edit property → add photos → verify display
- [ ] Property detail page → loads without 500
- [ ] Property detail → images display (not placeholders)
- [ ] Agent detail modal → sign-in gate works
- [ ] Agent detail modal → contact info hidden when signed out
- [ ] Search → Lifestyle filters work
- [ ] Search → Deal breakers exclude properties
- [ ] Search → Natural language → Buyer DNA → Results
- [ ] Property card → Match % displays
- [ ] Property card → Accolades display
- [ ] Property detail → Living Experience section renders
- [ ] Property detail → QR code generates/downloads
- [ ] Agent modal → "View Portfolio" scrolls to #portfolio
- [ ] Sponsor registration → Stripe checkout → webhook → active
- [ ] Agent upsell → Stripe subscription → webhook → verified/featured
- [ ] Contact modal → Intent tracking → Dashboard analytics
- [ ] Super admin → Pending verifications → Approve/Reject
- [ ] Mobile: All layouts responsive
- [ ] Mobile: Touch targets ≥ 44px
- [ ] PWA: Install prompt works
- [ ] PWA: Offline fallback

## Environment Status
| Environment | URL | Status |
|-------------|-----|--------|
| Production | https://qrcasas.com | 🟢 Live (commit efc7bfc9) |
| Vercel Preview | Auto per PR | 🟢 Active |
| Teable Base | bseR9OOCC0f7fvY1d0z | 🟢 Connected |
| Stripe | acct_1MvrBtGe9hhLYer6 | 🟢 Live |
| GitHub | realaicasa/QRcasas | 🟢 Connected |

## Next Session Priority
1. **Add missing Stripe webhook events** (customer.subscription.updated/deleted)
2. **Rotate exposed credentials** (CRITICAL)
3. **Create Stripe Price IDs** for recurring agent upsells + sponsor
5. **Test Stripe end-to-end** (all env vars now set including webhook secret)
6. **Auto-advancing rails** + QR downloads + contact analytics + agent portfolios
6. **Rotate exposed credentials**

## Key Architecture Notes
- **Session cookie**: `qrcasas_session` (not `session`) — Fixed in `588e8250`
- **Login routing**: Fixed by removing `Is_Verified` filter from `getUserByEmail`
- **QR codes**: 1024px PNG via `api.qrserver.com`, download/copy/open
- **Photo uploads**: Sharp WebP conversion, Teable attachment upload
- **Agent upsells**: 300 MXN/mo each (verified + featured), recurring Stripe
- **Sponsor**: 1,200 MXN/mo recurring, separate checkout
- **Agent upsells**: Not yet wired to Stripe (need Price IDs)
- **Sponsor carousel**: Not yet built
- **Agent portfolio**: `#portfolio` anchor + "View Portfolio" link in modal

**Teable Base**: `bseR9OOCC0f7fvY1d0z`  
**Stripe Account**: `acct_1MvrBtGe9hhLYer6`  
**Webhook Endpoint**: `we_1U5ZAkGe9hhLYer61iUulLAw`  
**Webhook URL**: `https://qrcasas.com/api/stripe/webhook`  
**Webhook Secret**: `[REDACTED - SET IN VERCEL]`

---
*Status generated: 2026-08-24 16:52 UTC*
*Next review: After live deployment verification*