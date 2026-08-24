# PHASE 6: QR PAGES, REALTOR MINI-SITES & BUYER INTENT ANALYTICS

## Objective
Build the QRcasas identity system: unique QR pages for properties and agents, contact intent tracking, and sharing infrastructure.

## QR Identity System

### URL Structure
```
Properties:     qrcasas.com/p/{propertyId}          # Short QR URL
                qrcasas.com/en/properties/{slug}   # Full SEO URL

Realtors:      qrcasas.com/a/{agentId}              # Short QR URL  
                qrcasas.com/en/agent/{slug}        # Full SEO URL

Communities:   qrcasas.com/c/{communityId}        # Community pages
                qrcasas.com/en/community/{slug}

Areas:         qrcasas.com/a/{areaId}
                qrcasas.com/en/area/{slug}
```

### QR Code Generation
```tsx
// Component: QRCodeDisplay.tsx
interface QRCodeDisplayProps {
  url: string;
  label: string;
  locale: Locale;
  t: (en: string, es: string) => string;
}

export default function QRCodeDisplay({ url, label, locale, t }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Use external QR API for reliable generation
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&ecc=H&data=${encodeURIComponent(url)}`;
  const previewUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&ecc=H&data=${encodeURIComponent(url)}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrApiUrl);
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `qrcasas-qr-${label.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch {
      window.open(qrApiUrl, "_blank");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleOpen = () => window.open(url, "_blank");

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center gap-2">
        <QrCode className="size-5 text-primary" />
        <h4 className="text-sm font-semibold">{label}</h4>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* QR Preview */}
        <div className="shrink-0">
          {showQR ? (
            <img
              src={previewUrl}
              alt={`QR code for ${label}`}
              className="size-32 rounded-lg border border-border"
            />
          ) : (
            <button
              onClick={() => setShowQR(true)}
              className="flex size-32 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              aria-label={t("Show QR code", "Mostrar código QR")}
            >
              <QrCode className="size-8" />
            </button>
          )}
        </div>

        {/* URL + Actions */}
        <div className="flex-1 space-y-2">
          <div className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground break-all">
            {url}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="size-3.5" />
              {t("Download PNG", "Descargar PNG")}
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Copy className="size-3.5" />
              {copied ? t("Copied!", "¡Copiado!") : t("Copy URL", "Copiar URL")}
            </button>
            <button
              onClick={handleOpen}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ExternalLink className="size-3.5" />
              {t("Open", "Abrir")}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t(
              "1024×1024 PNG, high error correction. Print on business cards, flyers, or signs.",
              "PNG 1024×1024, alta corrección de errores. Imprime en tarjetas, flyers o letreros."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Property Detail Page Integration
```tsx
// In property detail page - after map section
<div className="mt-8">
  <QrCodeDisplay
    url={absoluteUrl(`/properties/${property.slug}?source=qr`)}
    label={property.title || "Property"}
    locale={locale}
    t={t}
  />
</div>
```

### Agent QR Code
```tsx
// In agent-form.tsx - after profile images
{agent && agent.customSlug && (
  <QrCodeDisplay
    url={`${typeof window !== "undefined" ? window.location.origin : "https://qrcasas.com"}/realtors/${agent.customSlug}?source=qr&contact=1`}
    label={agent.businessName}
    locale={locale as Locale}
    t={t}
  />
}
```

## Realtor Mini-Site

### Route: `/en/agent/{agentId}` and `/a/{agentId}`
```tsx
// app/[locale]/directory/[agentId]/page.tsx
export default async function AgentProfilePage({ params }) {
  const { agentId } = await params;
  const locale = normalizeLocale((await params).locale);
  const { t } = getCopy(locale);

  const agent = await getAgentById(agentId);
  if (!agent) notFound();

  const properties = await getPropertiesByAgent(agent.id);
  const featuredProperties = properties.filter(p => p.featured).slice(0, 6);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link href={`/${locale}/directory`} className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3" />
        {t("Back to directory", "Volver al directorio")}
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
          {photoUrl ? (
            <img src={photoUrl} alt={agent.businessName} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-primary">
              {agent.businessName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{agent.displayName || agent.businessName}</h1>
          <p className="text-sm text-muted-foreground">{agent.businessName}</p>
          {agent.specialistVocation && (
            <p className="mt-1 text-sm text-primary">{agent.specialistVocation}</p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <StatCard value={properties.length} label={t("Active Listings", "Anuncios Activos")} />
        <StatCard value={agent.agentReference} label={t("Agent ID", "ID de Agente")} />
        <StatCard value={agent.tierLevel} label={t("Tier", "Nivel")} />
        <StatCard value={agent.featuredAgent ? "✓" : "—"} label={t("Featured", "Destacado")} />
      </div>

      {/* Portfolio Grid */}
      {properties.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold">{t("My Properties", "Mis Propiedades")}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} locale={locale} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* Contact Modal */}
      {isLoggedIn ? (
        <ContactDetailsModal locale={locale} propertyId={propertyId} propertyName={property.title} advertiser={agent} />
      ) : (
        <SignInPrompt locale={locale} next={`/directory/${agentId}`} />
      )}
    </main>
  );
}
```

### Agent Dashboard
```tsx
// app/[locale]/account/properties/page.tsx - Enhanced with intent analytics
export default async function AgentDashboardPage({ params, searchParams }) {
  // ... existing code ...
  
  // Enhanced analytics
  const propertiesWithAnalytics = await Promise.all(
    properties.map(async (p) => {
      const [matches, contactOpens, contactIntents, enquiries] = await Promise.all([
        countLifestyleMatches(p.id),
        countContactDetailsOpens(p.id),
        countContactIntents(p.id), // New: tracks modal opens by type
        countEnquiries(p.id)
      ]);
      return { ...p, lifestyleMatches: matches, contactOpens, contactIntents, enquiries };
    });

  // Track contact intent types
  async function countContactIntents(propertyId: string) {
    const events = await getEvents('contact_modal_open', { propertyId });
    const intents = events.map(e => e.metadata?.intent).filter(Boolean);
    return {
      total: events.length,
      byType: {
        question: intents.filter(i => i === 'question').length,
        viewing: intents.filter(i => i === 'viewing').length,
        info: intents.filter(i => i === 'info').length,
        whatsapp: intents.filter(i => i === 'whatsapp').length,
        call: intents.filter(i => i === 'call').length,
      }
    };
  }
```

### Contact Modal Enhancement
```tsx
// components/properties/contact-details-modal.tsx
// Enhanced with progressive disclosure

export default function ContactDetailsModal({ 
  locale, 
  propertyId, 
  propertyName, 
  advertiser,
  onContactAction 
}: ContactDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'intent' | 'contact' | 'success'>('intent');
  const [intent, setIntent] = useState<'question' | 'viewing' | 'info' | ''>('');
  
  useEffect(() => {
    if (open) {
      // Track contact intent
      trackEvent('contact_modal_open', { propertyId, agentId: advertiser.id });
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(false)}>
        <div className="max-h-[90vh] w-full max-w-md rounded-2xl border border-border bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="relative p-6">
            <button onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-full bg-black/20 p-1.5 text-white transition-colors hover:bg-black/40">
              <X className="size-5" />
            </button>

            {step === 'intent' ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t("Connect with Agent", "Contactar al Agente")}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("What would you like to do?", "¿Qué te gustaría hacer?")}
                </p>
                
                <div className="space-y-2">
                  <button onClick={() => { setIntent('question'); setStep('contact'); }}
                    className="w-full flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-left text-sm transition-colors hover:bg-muted hover:border-primary/50"
                  >
                    <HelpCircle className="size-5 text-primary" />
                    <div>
                      <p className="font-medium">{t("Ask a Question", "Hacer una Pregunta")}</p>
                      <p className="text-xs text-muted-foreground">{t("Ask about the property, neighborhood, or process", "Pregunta sobre la propiedad, zona o proceso")}</p>
                    </div>
                  </button>
                  <button onClick={() => { setIntent('viewing'); setStep('contact'); }}
                    className="w-full flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-left text-sm transition-colors hover:bg-muted hover:border-primary/50"
                  >
                    <Calendar className="size-5 text-primary" />
                    <div>
                      <p className="font-medium">{t("Arrange a Viewing", "Agendar una Visita")}</p>
                      <p className="text-xs text-muted-foreground">{t("Schedule an in-person or virtual tour", "Programa una visita presencial o virtual")}</p>
                    </div>
                  </button>
                  <button onClick={() => { setIntent('info'); setStep('contact'); }}
                    className="w-full flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-left text-sm transition-colors hover:bg-muted hover:border-primary/50"
                  >
                    <FileText className="size-5 text-primary" />
                    <div>
                      <p className="font-medium">{t("Get More Details", "Obtener Más Información")}</p>
                      <p className="text-xs text-muted-foreground">{t("Receive full brochure, floor plans, and documents", "Recibe folleto completo, planos y documentos")}</p>
                    </div>
                  </button>
                  <button onClick={() => { setIntent('whatsapp'); setStep('contact'); }}
                    className="w-full flex items-center gap-3 rounded-lg bg-green-100 px-4 py-3 text-left text-sm font-medium text-green-700 hover:bg-green-200 transition-colors"
                  >
                    <MessageCircle className="size-5" />
                    {t("WhatsApp", "WhatsApp")}
                  </button>
                </div>
              </div>
            ) : step === 'contact' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{t("Contact Agent", "Contactar Agente")}</h3>
                  <button onClick={() => setStep('intent')} className="text-muted-foreground hover:text-foreground">
                    <X className="size-5" />
                  </button>
                </div>
                
                <EnquiryForm 
                  locale={locale}
                  propertyId={propertyId}
                  propertyName={propertyName}
                  advertiser={advertiser}
                  initialIntent={intent}
                  onSubmit={async (data) => {
                    await submitEnquiry(data);
                    setStep('success');
                  }}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="size-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("Request Sent!", "¡Solicitud Enviada!")}</h3>
                <p className="text-muted-foreground mb-6">{t("The agent will contact you shortly.", "El agente se pondrá en contacto contigo pronto.")}</p>
                <button onClick={() => setOpen(false)} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                  {t("Done", "Listo")}
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  );
}
```

### Agent Dashboard - Intent Analytics
```tsx
// app/[locale]/account/properties/page.tsx - Enhanced

export default async function AgentDashboardPage({ params, searchParams }) {
  // ... existing code ...
  
  const propertiesWithAnalytics = await Promise.all(
    properties.map(async (p) => {
      const [matches, contactOpens, contactIntents, enquiries] = await Promise.all([
        countLifestyleMatches(p.id),
        countContactDetailsOpens(p.id),
        countContactIntents(p.id), // New: tracks modal opens by type
        countEnquiries(p.id)
      ]);
      return { ...p, lifestyleMatches: matches, contactOpens, contactIntents, enquiries };
    });

  // Track contact intent types
  async function countContactIntents(propertyId: string) {
    const events = await getEvents('contact_modal_open', { propertyId });
    const intents = events.map(e => e.metadata?.intent).filter(Boolean);
    return {
      total: events.length,
      byType: {
        question: intents.filter(i => i === 'question').length,
        viewing: intents.filter(i => i === 'viewing').length,
        info: intents.filter(i => i === 'info').length,
        whatsapp: intents.filter(i => i === 'whatsapp').length,
        call: intents.filter(i => i === 'call').length,
      }
    };
  }
```

## Acceptance Criteria
- [ ] Property pages have unique QR URLs with `?source=qr`
- [ ] Agent pages have unique QR URLs with `?source=qr&contact=1`
- [ ] QR codes generate 1024x1024 PNG via api.qrserver.com
- [ ] Download/copy/open actions work on QR display
- [ ] Realtor pages show portfolio, stats, bio, contact
- [ ] Contact modal tracks `contact_modal_open` event
- [ ] Contact modal tracks intent type (question/viewing/info/whatsapp/call)
- [ ] Agent dashboard shows intent analytics (views, matches, contact intents)
- [ ] No exact property addresses exposed publicly
- [ ] Contact info protected behind modal (not in HTML source)
- [ ] Property URLs use `/properties/{slug}` format
- [ ] Agent URLs use `/directory/{agentId}` and `/realtors/{slug}`
- [ ] Sharing buttons work (WhatsApp, FB, LinkedIn, email, copy link)
- [ ] Property pages show "Check Your Lifestyle Match" CTA