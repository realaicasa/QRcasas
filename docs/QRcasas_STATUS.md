# QRcasas Project Status
**Last Updated:** 2026-08-25 | **Branch:** `main` → `origin/main` | **Deployed:** `https://qrcasas.com` (Vercel auto-deploy) | **Base:** `bseR9OOCC0f7fvY1d0z`

## Recent Commits
- `588e8250` Fix session cookie mismatch, login verification, property edit photo upload
- `7251603` Upload buttons styled, alt text optional, agent SEO corrected, Save SEO removed, featured→Stripe redirect
- `774748ac` Agent portfolio #portfolio + Scan analytics + QR downloads + Auto-rails
- `c1c631b2` Contact analytics (Agent Contact Modal Opened), recurring agent upsells, subscription webhooks
- `84a6d890` Clean credentials from SYSTEM_PROTOCOL

## Feature Matrix
| Area | Feature | Status |
|------|---------|--------|
| **Property** | CRUD, Lifestyle DNA sliders 1-10, area-inherited defaults, Living Experience section, accolades | ✅ |
| **Search** | Traditional (price/beds/baths/type/city/area) hidden until Search icon, Latest 12 + Sponsors rail (search) + Featured rail (search) → Map, Deal Breakers hard exclusions | ✅ |
| **Property page** | Gallery, Living Experience (Around You/Building/Home/Acoustic), QR 1024px download/copy/open, contact modal gated, report flow, compare dock, closing-cost calculator | ✅ |
| **Agent** | Profile mini-site, QR + ref (QRA-XXXXXXXXXX), photo/logo upload, SEO/AEO/GEO, Verified (300 MXN/mo, ID upload → Admin Verifications), Featured (300 MXN/mo) | ✅ |
| **Agent detail** | Modal + page with #portfolio grid, sign-in gate contact, View Portfolio link, bilingual | ✅ (Return→Properties fixed) |
| **Sponsor** | /sponsors/register (contact/business/ad/headline/desc/link) → image/logo (WebP 1600×800) + live preview → 1,200 MXN/mo Stripe → dashboard (status, edit, Stripe Customer Portal, delete) → webhook Active/Past Due/Cancelled → carousel (`Billing_Status=Active && Approved`) | ✅ |
| **Payments** | Listings (500/3000/6900 + 200 photo) + agent upsells + sponsor, webhook sole authority (7 events), success banners | ✅ Code ready |
| **Super Admin** | Hidden nav, footer Admin Portal + `Ctrl+Shift+A`, passkey `qrcasas-admin-2026` + 2FA `772202`, 30s lock, sessionStorage 30min, Executive KPIs, realtor/property/sponsor tables, pending verifications, reports moderation, Stripe catalog + webhook status `we_1U5ZAkGe9hhLYer61iUulLAw`, Teable sync | ✅ |
| **PWA/Platform** | Bilingual EN/ES (footer modals 100% EN or ES, no mixed), PWA install modal, legal/disclaimer/user manual modals (outside-click + Escape, sticky header), report flow (login-gated, prefilled refs, ticket REP-XXXX) | ✅ |
| **AI Advisor** | Concise 1-3 sentences, multilingual auto-detect + EN|ES toggle, strict domain (no hallucination), never leaks phone/email, inline lead card → Kanban + notification bell, Gemini 2.5 Flash + deterministic fallback | ✅ |
| **Media** | `src/lib/media.ts` safe fallback, sharp WebP, signedUrl handling | ✅ |

## Known Fixed Issues
- Session `qrcasas_session` vs `session` mismatch → fixed `getCustomerAuth` fallback
- `getUserByEmail` Is_Verified filter removed → login to correct account
- Blank pages (property/agent) from passing `t` function to client components → now `locale` prop + internal `t`
- Pricing modal close → added stopPropagation on X/Cancel + backdrop
- Upload buttons restyled from plain text to `Choose Photo` buttons (Upload icon)
- Alt text now optional, SEO placeholders agent-specific, Save SEO removed
- Featured → Stripe now client-side redirect after profile save

## Remaining / Next (Priority)
1. **Stripe dashboard:** Add `customer.subscription.updated` + `deleted` to webhook `https://qrcasas.com/api/stripe/webhook` (code already handles)
2. **Rotate credentials:** GitHub PAT, Teable PAT, `rk_live`, `whsec` (exposed in prior commits) → update Vercel env
3. **Create Price IDs:** If switching from inline `price_data` to dashboard Prices for recurring (currently inline fallback works)
4. **Live verification:** Image uploads on Vercel, property detail 500 fix, agent photos — test with real Teable attachments
5. **Sponsor carousel verification:** Confirm active adverts render on homepage (currently empty — no live sponsors)
6. **Customer Portal:** Enable in Stripe Dashboard for Manage Billing
7. **Dedup:** File still references USD in some price filters — change to MXN or currency toggle
8. **AI Chatbot Phase 2:** Grounded chatbot on agent/property data (no hallucination) + lead-gen → Kanban

## Teable Live Counts (approx)
Portal Users ~5 | Agents ~2 | Properties ~5 | Locations ~15 | Activity ~20 | Renewals ~10 | Sponsor Accounts 0 | Business Adverts 0

## Env (Vercel Production — redacted)
TEABLE_API_URL, TEABLE_API_TOKEN, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_SINGLE/UP_TO_10/UP_TO_25, SITE_URL. Webhook `we_1U5ZAkGe9hhLYer61iUulLAw`.

## Testing Checklist (Next Session)
- [ ] Login different accounts → correct agent
- [ ] Upload profile photo/logo → displays
- [ ] Create property → Listing DNA sliders → photos (1 free, 10 with upgrade) → verify display
- [ ] Sponsor register → upload banner/logo + headline/desc/link → preview → subscribe → webhook → carousel
- [ ] Agent upsell → Verified/Featured → Stripe → webhook → badge/rail
- [ ] Report flow logged-in → prefilled refs → super admin moderation
- [ ] Modals (guide, legal, disclaimer, sponsor, calculator) → top visible + outside-click close
- [ ] Mobile + PWA install
