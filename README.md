# QRcasas — Quintana Roo Living Intelligence Platform

> **Don't just search for a property. Search for the life you want to live.**

QRcasas is a lifestyle-first property discovery platform for Quintana Roo, Mexico. Unlike traditional portals that filter by bedrooms and price, QRcasas matches buyers to properties based on **how they want to live** — walkability, community, privacy, beach access, quietness, and 20+ other lifestyle dimensions.

## 🌟 Core Concept

```
Traditional:  "3 bed, 2 bath, $500k, Playa del Carmen"
QRcasas:      "I want a quiet home with a pool, walkable to restaurants, 
               international community, near the beach — 
               car-free lifestyle for a Canadian couple retiring in Playa."
```

## 🏗 Architecture Overview

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

## ✨ Key Features

### 🏠 For Buyers
- **Three Search Modes**: Traditional filters → Lifestyle sliders → Natural language ("Tell us your dream")
- **Deal Breakers**: Hard exclusions (no AC, no elevator, nightclub noise, etc.)
- **Lifestyle Match %**: Transparent scoring with explanations
- **Living Experience**: "What it's like to live here" — noise, privacy, views, building vibe
- **AI Buyer Profile**: Natural language → structured preferences
- **Deal Breakers**: Hard exclusions (no AC, no elevator, nightclub noise, etc.)

### 🏘️ For Realtors
- **Free Basic Listing**: Standard property details
- **Enhanced Listing** (Free during pilot): AI-powered Living Experience Profile
- **AI-Assisted Entry**: System suggests lifestyle scores → Realtor confirms
- **Agent Profile**: Mini-website with portfolio, QR codes, specialties
- **Dashboard**: Views, lifestyle matches, contact intent analytics
- **QR Codes**: Unique property/realtor QR codes for marketing

### 🏢 For Sponsors
- **$1,200 MXN/mo**: Homepage carousel placement
- **Self-serve dashboard**: Create/edit adverts, track performance
- **Stripe recurring billing** with webhook automation

### 🤖 AI-Powered Features
- **Natural Language Search**: "I'm a Canadian couple retiring in Playa..."
- **AI Property Enrichment**: Suggests lifestyle scores from photos/description
- **Buyer DNA**: Natural language → structured preferences
- **Match Explanations**: "Strong match for walkability & restaurants. Compromise: beach is 12 min walk."
- **Higgsfield Integration**: AI-generated property videos/ads

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Lucide React icons |
| **Database** | Teable (Airtable-like, REST API) |
| **Auth** | Custom cookie-based (`qrcasas_session`) |
| **Payments** | Stripe (one-time + recurring subscriptions) |
| **AI/ML** | OpenAI GPT-4o-mini (natural language → structured data) |
| **Creative** | Higgsfield Marketing Studio (AI video/ads) |
| **Images** | Sharp (WebP, 2400px max, 82% quality) |
| **QR Codes** | api.qrserver.com (1024×1024 PNG, ecc=H) |
| **Deployment** | Vercel (auto-deploy from GitHub main) |
| **Database** | Teable (Airtable-like, REST API) |
| **Source Control** | GitHub (realaicasa/QRcasas) |
| **CI/CD** | Vercel auto-deploy from GitHub main |

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Teable account + API token
- Stripe account (live keys for production)
- OpenAI API key
- Vercel account

### Local Development
```bash
# Clone
git clone https://github.com/realaicasa/QRcasas.git
cd QRcasas-github

# Install dependencies
npm install

# Environment variables (create .env.local)
cp .env.example .env.local
# Edit with your keys:
# TEABLE_API_URL=https://app.teable.ai/api
# TEABLE_API_TOKEN=your_token
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# STRIPE_PRICE_SINGLE_PROPERTY=price_...
# STRIPE_PRICE_UP_TO_10=price_...
# STRIPE_PRICE_UP_TO_25=price_...
# STRIPE_PRICE_SPONSOR_MONTHLY=price_...
# STRIPE_WEBHOOK_SECRET=whsec_...
# NEXTAUTH_SECRET=...
# NEXTAUTH_URL=http://localhost:3000
# NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Run development server
npm run dev

# Type check
npm run typecheck

# Run tests
npm test

# Build for production
npm run build
```

## 📁 Project Structure

```
QRcasas-github/
├── docs/
│   ├── build-phases/           # Phase-by-phase build docs
│   ├── QRcasas_ARCHITECTURE.md
│   ├── QRcasas_STATUS.md
│   └── PROJECT_CONTEXT.md
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── properties/           # Search + detail pages
│   │   │   ├── directory/            # Agent directory
│   │   │   ├── account/              # Agent dashboard
│   │   │   ├── sponsors/             # Sponsor portal
│   │   │   └── super-admin/          # Admin panel
│   │   ├── api/
│   │   │   ├── stripe/               # Checkout, webhooks
│   │   │   ├── uploads/              # Photo uploads
│   │   │   ├── activity/             # Contact analytics
│   │   │   └── search/natural-language
│   │   └── layout.tsx
│   ├── components/
│   │   ├── properties/               # Cards, forms, filters, QR
│   │   ├── directory/                # Agent cards, modals, explorer
│   │   ├── layout/                   # Header, footer
│   │   ├── shared/                   # QR display, SEO fields
│   │   └── dashboard/                # Super admin
│   ├── lib/
│   │   ├── data/                     # Data layer (properties, agents, etc.)
│   │   │   ├── teable/               # Teable client + SQL helpers
│   │   │   └── *.ts                  # Domain logic
│   │   ├── stripe.ts                 # Stripe helpers
│   │   ├── request.ts                # Teable fetch wrapper
│   │   ├── customer-auth.ts          # Session validation
│   │   ├── media.ts                  # Safe image URLs
│   │   ├── stripe.ts                 # Stripe helpers
│   │   └── i18n.ts                   # EN/ES translations
│   └── middleware.ts                 # Auth protection
├── public/                           # Static assets
├── docs/
│   └── build-phases/                 # Phase-by-phase build docs
├── .env.example
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── vercel.json
```

## 🔑 Environment Variables

```bash
# Teable
TEABLE_API_URL=https://app.teable.ai/api
TEABLE_API_TOKEN=your_teable_token

# Stripe (LIVE)
STRIPE_SECRET_KEY=rk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_SINGLE_PROPERTY=price_...
STRIPE_PRICE_UP_TO_10=price_...
STRIPE_PRICE_UP_TO_25=price_...
STRIPE_PRICE_SPONSOR_MONTHLY=price_...

# App
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://qrcasas.com
NEXT_PUBLIC_SITE_URL=https://qrcasas.com
```

## 🔐 Security & Privacy

- **No exact addresses** — Area/Community only
- **Contact protection** — Modal-gated, anti-scraping
- **Session cookies** — `qrcasas_session` (HttpOnly, Secure, SameSite=Lax)
- **No PII in logs** — Structured logging only
- **Stripe webhook** — Signature verification on all events
- **Teable credentials** — Server-side only, never in client bundle

## 🧪 Testing & Quality

```bash
# Type checking
npm run typecheck

# Unit tests
npm test

# Linting
npm run lint

# Production build
npm run build
```

## 📦 Deployment

```bash
# Vercel auto-deploys from main branch
git push origin main

# Manual Vercel deploy
vercel --prod

# Rollback
vercel rollback [deployment-url]
```

## 📚 Documentation

- [Architecture](docs/QRcasas_ARCHITECTURE.md) — System design
- [Project Status](docs/QRcasas_STATUS.md) — Current state & next steps
- [Build Phases](docs/build-phases/) — Phase-by-phase implementation guide
- [Commands](docs/COMMANDS.md) — Common development tasks

## 🗺 Roadmap

### Phase 1: Pilot Launch (Current)
- [x] Core platform + lifestyle matching
- [x] Stripe one-time + recurring payments
- [x] Agent/Buyer dashboards
- [ ] 20 Realtor pilot launch
- [ ] Live image upload verification
- [ ] Pro/Pro Plus Stripe Price IDs

### Phase 2: Marketplace Features
- [ ] Sponsor carousel on homepage
- [ ] Agent portfolio section (`#portfolio`)
- [ ] Stripe Customer Portal integration
- [ ] Verified ID → Advertiser Verifications table
- [ ] AI Marketing copy generation (Higgsfield)

### Phase 3: Intelligence Layer
- [ ] Sargassum/seasonality intelligence
- [ ] Construction/future development tracking
- [ ] Relocation intelligence
- [ ] Events/community graph
- [ ] AI Marketing copy generation

### Phase 4: Scale
- [ ] Tulum / Cancún / Bacalar expansion
- [ ] Multi-language (EN/ES/FR/DE)
- [ ] White-label for brokerages
- [ ] API for third-party portals

## 🤝 Contributing

1. Fork → Feature branch → PR
2. Run `npm run typecheck && npm test && npm run build`
3. Follow conventional commits: `feat:`, `fix:`, `refactor:`
4. Update docs for new features

## 📄 License

Proprietary — All rights reserved. QRcasas® is a registered trademark.

## 📞 Support

- **Technical**: Create GitHub issue
- **Business**: mike@dynamicmike.com
- **Stripe/Teable**: Check respective dashboards

---

**QRcasas** — *Find your life in Quintana Roo* 🌴

*Built with ❤️ for the Riviera Maya community*