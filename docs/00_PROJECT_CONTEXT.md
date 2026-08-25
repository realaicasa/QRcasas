# QRcasas — Master Project Context
> **Read this first in every session.** This file is the persistent memory for QRcasas.

## 1. Product Vision
**QRcasas.com** — Quintana Roo Living Intelligence Platform  
**Tagline:** *Don't just search for a property. Search for the life you want to live.*  
**Domain:** https://qrcasas.com (primary), https://qrcasas.vercel.app  
**Type:** Bilingual EN/ES PWA with interactive map, QR identity for every property & agent

QRcasas is **not** a traditional portal. It matches buyers to properties by **how they want to live** — walkability, community, privacy, beach, noise, etc. — not just bedrooms/price. Structured Living Experience data is the moat.

## 2. Core Design Principles
- **Lifestyle-first:** Lifestyle filters ABOVE price/beds/baths
- **Progressive disclosure:** SIMPLE BY DEFAULT, POWERFUL WHEN REQUESTED. Filters hidden until Search icon clicked. Deal Breakers behind secondary panel.
- **Area-inherited DNA:** Realtor selects City → Area → Community, system auto-fills Area DNA. Realtor can override; source provenance preserved (`area_default` vs `realtor_override` vs `system_verified`)
- **Privacy by design:** Exact property addresses NEVER public. Approximate: City → Area → Community. Gated/24hr security toggles, not coordinates.
- **Bilingual EN/ES throughout:** Content, SEO/AEO/GEO fields, modals, dashboards
- **PWA:** Installable, offline fallback, manifest icons

## 3. Homepage Search Flow (Current)
```
Search icon (hidden filters) → Traditional filters (price, beds, baths, type, city/area)
Latest button → Last 12 properties (thumbnail grid, latest first)
Below Latest → Horizontal scrolling Sponsors (own search) → Horizontal scrolling Featured Properties (own search)
Then → Interactive Map → Marketplace notice (shield) → Advertise section (Become a Sponsor + Add Property)
```
Sponsors & Featured rails: 8s auto-advance, pause on hover/focus, arrow batch controls, compact search above each rail. Sponsor requires Billing_Status=Active && Approved.

## 4. Property & Agent Model
- **Properties:** 1 free image, up to 10 with 200 MXN upgrade (first = featured). Each has page `/properties/{slug}?source=qr`, QR (1024px PNG), uneditable reference (e.g., QRP-XXXX). Includes bilingual SEO/AEO/GEO fields, Lifestyle DNA sliders (1-10), Building/Property/Living Experience layers.
- **Agents:** Profile = mini-site (photo/logo, bio, specialty, portfolio, active count, social). Page `/directory/{agentId}` also shareable as `/realtors/{slug}?source=qr&contact=1`. QR, uneditable Agent Reference (QRA-XXXXXXXXXX / QRC-XXXXXX), specialist vocation, tagline. Contact info HIDDEN until contact modal opened (anti-scrape, counts opens). Trains AI chatbot (Phase 2, no hallucination).
- **Living Experience section on property page:** Around You (beach, walkability, community, street), At The Building (scale, mix, elevator, pool), In Your Home (outlook, balcony privacy, AC, acoustic), Verified Acoustic Reality Check, Accolades (badges from data), Strengths/Compromises.
- **Accolades:** Computed from data: Car-Free Friendly, Beach Access, Gated Community, etc.

## 5. User Roles & Access
- **Visitor:** Browse, search, view property/agent pages, QR scans
- **Registered User (Buyer):** Save watchlist/favourites (heart), my profile (photo/contact optional, wishlist), MUST login to open contact modal
- **Agent (Realtor):** Create/edit properties, manage portfolio, dashboard analytics (views, matches, contact intents), QR downloads, upsells
- **Sponsor:** Separate Sponsor Accounts + Business Adverts tables, /sponsors/register → dashboard, 1,200 MXN/mo, manage creative/headline/description/link, billing status
- **Super Admin:** Analytics dashboard (KPIs, realtor/property/sponsor tables, Stripe catalog, Teable sync), verification queue

## 6. Technology Stack
- **Frontend:** Next.js 16 App Router, React 19, TypeScript, Tailwind CDN, Lucide icons
- **Backend/DB:** Teable (base bseR9OOCC0f7fvY1d0z, API https://app.teable.ai/api), GitHub source truth, Vercel deploy
- **AI:** Google AI Studio (product/arch), Antigravity/OpenCode (build), OpenAI (NL → structured), Higgsfield (creative)
- **Payments:** Stripe (one-time listings + recurring upsells/sponsors), webhooks sole authority
- **Media:** sharp (WebP 1600×800 for sponsors, 2400px for properties), safe fallback `src/lib/media.ts`

## 7. Teable Tables (Live)
Portal Users `tbl394RbduZlmHUni8e` | Agents `tbluaZYX8Umw7VuZHVG` | Properties `tblUlJEDQW8xvlqMviu` | Locations `tblRMqpDs1ilZAOacsH` | Property Activity `tblbiHm44TeA55UEWSt` | Listing Renewals `tbl7XnhLXWvbRJXXh6L` | Sponsor Accounts `tbliuwzQOgnEFQNqxj9` | Business Adverts `tbln1kaLnMBM9jlgyV8` | Directory Subscriptions `tblIk58JzxlY532W6A0` | Advertiser Verifications `tblVYj7pAh9OMcDAA08`

## 8. Current Pricing
Listings: Single 500 MXN, 10-pack 3,000 MXN, 25-pack 6,900 MXN (13 wks) + 200 MXN photo upgrade. Agent upsells: Verified 300 MXN/mo (blue tick, ID upload, admin review), Featured 300 MXN/mo (homepage rail). Sponsor: 1,200 MXN/mo. Stripe Prices in Vercel env, webhook `we_1U5ZAkGe9hhLYer61iUulLAw`.

## 9. Key Architecture Decisions (ADRs)
- No functions to client components (`locale` string + internal `t`)
- Session `qrcasas_session` HttpOnly Secure SameSite Lax 30d
- Teable sole DB, Stripe webhook sole payment authority (`amount_total` in minor units, metadata cross-check)
- Media fallback placeholder, QR via `api.qrserver.com` 1024×1024 H
- `qrcasas_session` primary, `session` fallback; exact addresses never public; AI never invents

## 10. Pilot Status
20 Realtors invited free to populate DB, test lifestyle model, measure match→enquiry rate. Success = ≥80% lifestyle completion, ≥70% AI acceptance, contact intent lift.

## 11. Outstanding (Next)
Stripe webhook missing `customer.subscription.updated/deleted` in dashboard (code ready), credential rotation (exposed PATs), Pro/Pro Plus Price IDs, live image tests, sponsor carousel verification, Customer Portal, verified ID → Advertiser Verifications routing, portfolio polish.
