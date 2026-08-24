# PHASE 4: BUYER SEARCH EXPERIENCE

## Objective
Implement three progressive search modes that transform property discovery from "what property" to "what lifestyle".

## Search Entry Points (Homepage Hero)

### Search Mode Selector (Primary UI)
```tsx
// Component: SearchModeSelector.tsx
<div className="flex items-center justify-center gap-3 mb-8">
  <button
    onClick={() => setMode('search')}
    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      mode === 'search'
        ? 'bg-primary text-primary-foreground shadow-sm' 
        : 'border border-border text-foreground hover:bg-muted'
    }`}
  >
    <Search className="size-4 mr-2" />
    {t("Search Properties", "Buscar Propiedades")}
  </button>
  
  <button
    onClick={() => setMode('lifestyle')}
    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      mode === 'lifestyle'
        ? 'bg-primary text-primary-foreground shadow-sm' 
        : 'border border-border text-foreground hover:bg-muted'
    }`}
  >
    <Sparkles className="size-4 mr-2" />
    {t("Lifestyle Search", "Búsqueda por Estilo de Vida")}
  </button>
  
  <button
    onClick={() => setMode('describe')}
    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      mode === 'describe'
        ? 'bg-primary text-primary-foreground shadow-sm' 
        : 'border border-border text-foreground hover:bg-muted'
    }`}
  >
    <MessageSquare className="size-4 mr-2" />
    {t("Describe Your Dream", "Describe tu Vida Ideal")}
  </button>
</div>
```

## Search Mode 1: Traditional Search
**URL**: `/en/properties?search=...&bedrooms=2&price_max=500000`
- Standard filters: location, price, bedrooms, bathrooms, property type
- Sort: newest, price asc/desc, featured first
- View modes: List / Map / Split

## Search Mode 2: Lifestyle Filters (Visual)

### Lifestyle Filter Bar Component
```tsx
// Component: LifestyleFilterBar.tsx
<div className="sticky top-16 z-30 border-b border-border bg-card shadow-sm">
  <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
    {/* Priority Weights */}
    <div className="mb-4">
      <label className="text-xs font-semibold text-muted-foreground mb-2 block">
        {t("What matters most?", "¿Qué es lo más importante?")}
      </label>
      <div className="flex flex-wrap gap-2">
        {LIFESTYLE_ATTRIBUTES.map(attr => (
          <LifestyleWeightSlider
            key={attr.key}
            label={attr.label}
            icon={attr.icon}
            value={weights[attr.key] || 0}
            onChange={(v) => setWeights({...weights, [attr.key]: v})}
            min={0} max={10}
          />
        ))}
      </div>
    </div>
    
    {/* Quick Filters */}
    <div className="flex flex-wrap gap-2">
      {QUICK_FILTERS.map(filter => (
        <FilterChip
          key={filter.key}
          label={filter.label}
          icon={filter.icon}
          active={filters[filter.key]}
          onToggle={() => toggleFilter(filter.key)}
        />
      ))}
    </div>
    
    {/* Deal Breakers - Progressive Disclosure */}
    <Details className="mt-4">
      <Summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
        <ShieldAlert className="size-4" />
        {t("Deal Breakers", "Puntos de Ruptura")}
        <ChevronDown className="size-4" />
      </Summary>
      <DealBreakerPanel />
    </Details>
  </div>
</div>
```

### Weighted Lifestyle Sliders
```tsx
// Component: LifestyleWeightSlider.tsx
const LIFESTYLE_ATTRIBUTES = [
  { key: 'beach', label: 'Beach Access', icon: Waves },
  { key: 'walkability', label: 'Walkability', icon: Footprints },
  { key: 'restaurants', label: 'Restaurants', icon: Utensils },
  { key: 'community', label: 'Community', icon: Users },
  { key: 'nature', label: 'Nature', icon: Trees },
  { key: 'quietness', label: 'Quietness', icon: VolumeX },
  { key: 'privacy', label: 'Privacy', icon: Shield },
  { key: 'cycling', label: 'Cycling', icon: Bike },
  { key: 'remoteWork', label: 'Remote Work', icon: Laptop },
  { key: 'family', label: 'Family', icon: Users },
  { key: 'investment', label: 'Investment', icon: TrendingUp },
];

function LifestyleWeightSlider({ label, icon, value, onChange }) {
  return (
    <div className="flex items-center gap-2 min-w-[140px]">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
        <icon className="size-3.5" />
        {label}
      </label>
      <div className="flex-1 min-w-[100px]">
        <Slider
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          max={10}
          step={1}
          className="h-2"
        />
        <span className="text-xs font-mono text-muted-foreground w-6 text-right">{value}</span>
      </div>
    </div>
  );
}
```

### Deal Breaker Panel
```tsx
// Component: DealBreakerPanel.tsx
const DEAL_BREAKER_CATEGORIES = {
  building: {
    label: "Building & Access",
    icon: Building2,
    items: [
      { key: 'no_elevator', label: 'No elevator', severity: 'high' },
      { key: 'stairs_only', label: 'Stairs only (no elevator)', severity: 'high' },
      { key: 'poor_accessibility', label: 'Poor accessibility', severity: 'medium' },
    ]
  },
  noise: {
    label: "Noise & Disturbance",
    icon: Volume2,
    items: [
      { key: 'nightclub_noise', label: 'Nightclub noise', severity: 'high' },
      { key: 'live_music', label: 'Live music venue nearby', severity: 'medium' },
      { key: 'traffic_noise', label: 'Heavy traffic noise', severity: 'high' },
      { key: 'construction_nearby', label: 'Construction nearby', severity: 'medium' },
      { key: 'barking_dogs', label: 'Barking dogs', severity: 'medium' },
      { key: 'noisy_neighbours', label: 'Noisy neighbours', severity: 'medium' },
    ]
  },
  home: {
    label: "Home Essentials",
    icon: Home,
    items: [
      { key: 'no_ac', label: 'No air conditioning', severity: 'critical' },
      { key: 'no_parking', label: 'No parking', severity: 'high' },
      { key: 'no_outdoor_space', label: 'No outdoor space', severity: 'medium' },
      { key: 'low_privacy', label: 'Low privacy', severity: 'high' },
      { key: 'neighbour_overlooking', label: 'Neighbour overlooking balcony', severity: 'critical' },
    ]
  },
  location: {
    label: "Location Risks",
    icon: AlertTriangle,
    items: [
      { key: 'construction_nearby', label: 'Active construction nearby', severity: 'high' },
      { key: 'flood_zone', label: 'Flood zone', severity: 'critical' },
      { key: 'erosion_risk', label: 'Coastal erosion risk', severity: 'high' },
      { key: 'sargassum_severe', label: 'Severe sargassum', severity: 'high' },
    ]
  }
};

// Component: DealBreakerPanel.tsx
export function DealBreakerPanel({ selected, onChange }) {
  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-sm">{t("Deal Breakers", "Puntos de Ruptura")}</h4>
        <Badge variant="secondary" className="text-xs">
          {t("Hard exclusions", "Exclusiones estrictas")}
        </Badge>
      </div>
      
      {Object.entries(DEAL_BREAKER_CATEGORIES).map(([category, { label, icon, items }]) => (
        <div key={category} className="space-y-2">
          <h5 className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <icon className="size-3.5" />
            {label}
          </h5>
          <div className="flex flex-wrap gap-2 ml-4">
            {items.map(item => (
              <label key={item.key} className="inline-flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(item.key)}
                  onChange={(e) => onChange(item.key, e.target.checked)}
                  className="size-4 rounded border-border text-primary focus:ring-primary/40"
                />
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <Badge variant="secondary" className={`text-[10px] ${item.severity === 'critical' ? 'bg-red-100 text-red-700' : item.severity === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {item.severity}
                </Badge>
              </label>
            ))}
          </div>
        </div>
      ))}
      
      {Object.keys(selectedDealBreakers).length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">
            {t("Properties matching these will be excluded", "Las propiedades con estos criterios serán excluidas")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(selectedDealBreakers).map(key => (
              <Badge key={key} variant="destructive" className="text-xs gap-1">
                {DEAL_BREAKER_LABELS[key]}
                <X className="size-3" onClick={() => removeDealBreaker(key)} />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Natural Language Search (Option 3)

### Describe Your Dream Interface
```tsx
// Component: NaturalLanguageSearch.tsx
export function NaturalLanguageSearch({ locale, onResults }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  const EXAMPLES = [
    "I'm a 55-year-old Canadian moving to Playa with my partner. We don't want a car and we'd love somewhere where we can walk to restaurants and cafés. I love cycling and going to live music, but I don't want to live somewhere noisy. We'd like a pool and some privacy, preferably somewhere with an international community.",
    "Young Mexican family looking for a safe neighborhood in Mérida with good schools, parks for kids, and a yard for our dog. We need 3 bedrooms and a garage.",
    "Digital nomad from Germany looking for a 1-bedroom condo in Tulum with fast internet, coworking nearby, yoga studios, and a community of other digital nomads. Budget $1500/month.",
    "Retired couple from Texas looking for a lock-and-leave condo in Playa del Carmen with golf course access, pool, and easy airport access for visits from grandkids."
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/search/natural-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, locale })
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(t("Something went wrong. Please try again.", "Algo salió mal. Intenta de nuevo."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <Sparkles className="mx-auto size-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {t("Describe Your Dream Home", "Describe tu Hogar Ideal")}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t(
              "Tell us about yourself, who you'll live with, how you spend your time, what you love, what you don't like, and what you're looking for in Quintana Roo.",
              "Cuéntanos sobre ti, con quién vivirás, cómo pasas tu tiempo, qué te gusta, qué no te gusta y qué buscas en Quintana Roo."
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t(
                "e.g. \"I'm a 55-year-old Canadian moving to Playa with my partner. We don't want a car and we'd love somewhere where we can walk to restaurants and cafés. I love cycling and going to live music, but I don't want to live somewhere noisy. We'd like a pool and some privacy, preferably somewhere with an international community.\"",
                "ej. \"Soy un canadiense de 55 años mudándome a Playa con mi pareja. No queremos carro y nos encantaría un lugar donde podamos caminar a restaurantes. Me encanta andar en bici e ir a conciertos, pero no quiero vivir en un lugar ruidoso. Queremos alberca y algo de privacidad, preferiblemente en una zona con comunidad internacional.\""
              )}
              className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="flex-1"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  {t("Finding Your Lifestyle Matches...", "Buscando tu Estilo de Vida...")}
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-2" />
                  {t("Find My Lifestyle Matches", "Encontrar mi Estilo de Vida")}
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={() => { setInput(""); setResults(null); }}
              variant="outline"
              className="w-auto"
            >
              {t("Clear", "Limpiar")}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center mt-3">{error}</p>
          )}
        </form>

        {/* Example prompts */}
        <div className="mt-8">
          <p className="text-xs text-muted-foreground text-center mb-3">
            {t("Try one of these examples:", "Prueba uno de estos ejemplos:")}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAMPLES.map((example, i) => (
              <button
                key={i}
                onClick={() => setInput(example)}
                className="p-3 text-left text-xs text-muted-foreground hover:bg-muted rounded-lg border border-border transition-colors text-left"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Results Preview */}
        {results && (
          <div className="mt-8 p-4 bg-muted/50 rounded-xl">
            <h4 className="font-semibold mb-3">{t("Your Lifestyle Profile", "Tu Perfil de Estilo de Vida")}</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(results.buyerDNA).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-card rounded-lg">
                  <span className="text-sm text-muted-foreground capitalize">{key}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${value * 10}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{value}/10</span>
                  </div>
                </div>
              ))}
            </div>
            {results.dealBreakers?.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-800 mb-2">
                  {t("Deal Breakers Detected:", "Puntos de Ruptura Detectados:")}
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {results.dealBreakers.map((db, i) => <li key={i}>{db}</li>)}
                </ul>
              </div>
            )}
            <Button 
              onClick={() => onResults(results)}
              className="mt-4 w-full"
            >
              {t("Search Properties Matching This Profile", "Buscar Propiedades que Coincidan")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Buyer DNA Extraction API
```typescript
// API Route: /api/search/natural-language
export async function POST(request: Request) {
  const { query, locale } = await request.json();
  
  if (!query || query.trim().length < 20) {
    return NextResponse.json({ error: "Query too short" }, { status: 400 });
  }

  const prompt = `Extract structured buyer preferences from this natural language description. 
Return JSON with:
- weights: object with 1-10 scores for each attribute
- dealBreakers: array of deal breaker keys
- requirements: { bedrooms, bathrooms, priceMin, priceMax, propertyTypes, currencies, timeframe, purchasePurpose }
- rawInput: original text

Attributes to score (1-10):
beachAccess, walkability, restaurants, community, quietness, privacy, nature, cycling, nightlife, liveMusic, family, remoteWork, investment, carFree, adventure, healthcare, schools, shopping, airportAccess, socialLife, nightlife

Deal breaker keywords: no_ac, no_elevator, building_noise_high, short_term_rental_heavy, no_parking, low_privacy, neighbour_overlooking, high_traffic, construction_nearby, no_internet, poor_internet, stairs_no_elevator.

Return ONLY valid JSON.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: query }
    ],
    response_format: { type: "json_object" },
    temperature: 0.3
  });

  return NextResponse.json(JSON.parse(completion.choices[0].message.content));
}
```

## Acceptance Criteria
- [ ] Three search modes accessible from homepage
- [ ] Lifestyle sliders with weight visualization
- [ ] Deal breaker panel with categorized items
- [ ] Natural language input with AI parsing
- [ ] Buyer DNA preview before search
- [ ] Deal breakers act as hard exclusions
- [ ] Mobile responsive on all modes
- [ ] TypeScript types for BuyerDNA