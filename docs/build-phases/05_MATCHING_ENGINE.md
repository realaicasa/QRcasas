# PHASE 5: MATCHING ENGINE & LIVING EXPERIENCE SECTION

## Objective
Build transparent, explainable lifestyle matching engine that produces trustworthy property recommendations with clear explanations.

## Core Principle
**Deterministic scoring + AI explanations** - Never use AI for scoring, only for explanations.

## Architecture

### Input Structures
```typescript
interface BuyerProfile {
  // Conventional requirements
  budgetMin: number;
  budgetMax: number;
  bedroomsMin: number;
  bathroomsMin: number;
  propertyTypes: string[];
  currencies: string[];
  purchasePurpose: 'lifestyle' | 'investment' | 'both';
  timeframe: string;
  
  // Lifestyle weights (1-10)
  weights: {
    beachAccess: number;
    walkability: number;
    restaurants: number;
    community: number;
    quietness: number;
    privacy: number;
    nature: number;
    cycling: number;
    nightlife: number;
    liveMusic: number;
    family: number;
    remoteWork: number;
    investment: number;
    carFree: number;
    adventure: number;
    healthcare: number;
    schools: number;
    shopping: number;
    airportAccess: number;
    socialLife: number;
  };
  
  // Deal breakers (hard exclusions)
  dealBreakers: DealBreaker[];
  
  // Deal breaker types
  dealBreakerTypes: DealBreakerType[];
}

interface PropertyProfile {
  id: string;
  // Conventional
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  listingType: string;
  
  // Lifestyle DNA (effective values with provenance)
  lifestyleDNA: {
    beachAccess: ScoredField;
    walkability: ScoredField;
    restaurants: ScoredField;
    community: ScoredField;
    quietness: ScoredField;
    privacy: ScoredField;
    natureAccess: ScoredField;
    cycling: ScoredField;
    carFree: ScoredField;
    internationalCommunity: ScoredField;
    socialLife: ScoredField;
    nightlife: ScoredField;
    liveMusic: ScoredField;
    traffic: ScoredField;
    construction: ScoredField;
    dogsNoise: ScoredField;
    familyFriendly: ScoredField;
    remoteWork: ScoredField;
    wellness: ScoredField;
    adventure: ScoredField;
    investmentAppeal: ScoredField;
    // Building DNA
    buildingSecurity: ScoredField;
    buildingPrivacy: ScoredField;
    shortTermRentalIntensity: ScoredField;
    buildingDensity: ScoredField;
    // Property DNA
    viewQuality: ScoredField;
    balconyPrivacy: ScoredField;
    balconyExperience: ScoredField;
    naturalLight: ScoredField;
    // Living Experience
    streetType: StreetType;
    noiseProfile: NoiseProfile;
    privacyProfile: PrivacyProfile;
    // Provenance
    dataCompleteness: number; // 0-1
  };
  
  // Conventional
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  // ...
}

interface ScoredField {
  value: number;           // 1-10
  source: "area_default" | "community_default" | "realtor_override" | "system_verified" | "ai_inferred";
  confidence: number;      // 0-1
  areaDefault?: number;
  overrideValue?: number;
  effective: number;       // Computed effective value
}
```

## Matching Algorithm

### Core Algorithm (Deterministic)
```typescript
function calculateMatch(buyer: BuyerProfile, property: PropertyProfile): MatchResult {
  // 1. Check hard deal breakers FIRST
  const dealBreakerViolations = checkDealBreakers(buyer.dealBreakers, property);
  if (dealBreakerViolations.length > 0) {
    return {
      match: false,
      score: 0,
      dealBreakerViolations,
      excluded: true
    };
  }
  
  // 2. Conventional filters (hard filters)
  if (!passesConventionalFilters(buyer, property)) {
    return { match: false, score: 0, excluded: true };
  }
  
  // 3. Calculate weighted lifestyle score
  const dimensionScores = {};
  let totalWeight = 0;
  let weightedSum = 0;
  
  const dimensions = [
    { key: 'beachAccess', weight: buyer.weights.beachAccess || 0 },
    { key: 'walkability', weight: buyer.weights.walkability || 0 },
    { key: 'restaurants', weight: buyer.weights.restaurants || 0 },
    { key: 'community', weight: buyer.weights.community || 0 },
    { key: 'quietness': buyer.weights.quietness },
    { key: 'privacy', weight: buyer.weights.privacy },
    { key: 'natureAccess', weight: buyer.weights.nature || 0 },
    { key: 'cycling', weight: buyer.weights.cycling },
    { key: 'carFree': buyer.weights.carFree },
    { key: 'internationalCommunity', weight: buyer.weights.internationalCommunity },
    { key: 'socialLife', weight: buyer.weights.socialLife },
    { key: 'nightlife', weight: buyer.weights.nightlife },
    { key: 'liveMusic', weight: buyer.weights.liveMusic },
    { key: 'familyFriendly', weight: buyer.weights.family },
    { key: 'remoteWork', weight: buyer.weights.remoteWork },
    { key: 'investment', weight: buyer.weights.investment },
    { key: 'adventure', weight: buyer.weights.adventure },
    { key: 'healthcare', weight: buyer.weights.healthcare },
    { key: 'schools', weight: buyer.weights.schools },
    { key: 'shopping', weight: buyer.weights.shopping },
    { key: 'airportAccess', weight: buyer.weights.airportAccess },
    { key: 'cycling', weight: buyer.weights.cycling },
    { key: 'carFree', weight: buyer.weights.carFree },
    { key: 'adventure', weight: buyer.weights.adventure },
    { key: 'healthcare', weight: buyer.weights.healthcare },
    { key: 'schools', weight: buyer.weights.schools },
    { key: 'shopping', weight: buyer.weights.shopping },
    { key: 'airportAccess', weight: buyer.weights.airportAccess },
    { key: 'socialLife', weight: buyer.weights.socialLife },
    { key: 'nightlife', weight: buyer.weights.nightlife },
    { key: 'liveMusic', weight: buyer.weights.liveMusic },
    { key: 'familyFriendly', weight: buyer.weights.family },
    { key: 'remoteWork', weight: buyer.weights.remoteWork },
    { key: 'investment', weight: buyer.weights.investment },
    { key: 'adventure', weight: buyer.weights.adventure },
    { key: 'healthcare', weight: buyer.weights.healthcare },
    { key: 'schools', weight: buyer.weights.schools },
    { key: 'shopping', weight: buyer.weights.shopping },
    { key: 'airportAccess', weight: buyer.weights.airportAccess },
    { key: 'socialLife', weight: buyer.weights.socialLife },
    { key: 'nightlife', weight: buyer.weights.nightlife },
    { key: 'liveMusic', weight: buyer.weights.liveMusic },
    { key: 'familyFriendly', weight: buyer.weights.family },
    { key: 'remoteWork', weight: buyer.weights.remoteWork },
    { key: 'investment', weight: buyer.weights.investment },
    { key: 'adventure', weight: buyer.weights.adventure },
    { key: 'healthcare', weight: buyer.weights.healthcare },
    { key: 'schools', weight: buyer.weights.schools },
    { key: 'shopping', weight: buyer.weights.shopping },
    { key: 'airportAccess', weight: buyer.weights.airportAccess },
    { key: 'socialLife', weight: buyer.weights.socialLife },
    { key: 'nightlife', weight: buyer.weights.nightlife },
    { key: 'liveMusic', weight: buyer.weights.liveMusic },
    { key: 'familyFriendly', weight: buyer.weights.family },
    { key: 'remoteWork', weight: buyer.weights.remoteWork },
    { key: 'investment', weight: buyer.weights.investment },
    { key: 'adventure', weight: buyer.weights.adventure },
    { key: 'healthcare', weight: buyer.weights.healthcare },
    { key: 'schools', weight: buyer.weights.schools },
    { key: 'shopping', weight: buyer.weights.shopping },
    { key: 'airportAccess', weight: buyer.weights.airportAccess },
    { key: 'socialLife', weight: buyer.weights.socialLife },
    { key: 'nightlife', weight: buyer.weights.nightlife },
    { key: 'liveMusic', weight: buyer.weights.liveMusic },
    { key: 'familyFriendly', weight: buyer.weights.family },
    { key: 'remoteWork', weight: buyer.weights.remoteWork },
    { key: 'investment', weight: buyer.weights.investment },
    { key: 'adventure', weight: buyer.weights.adventure },
    { key: 'healthcare', weight: buyer.weights.healthcare },
    { key: 'schools', weight: buyer.weights.schools },
    { key: 'shopping', weight: buyer.weights.shopping },
    { key: 'airportAccess', weight: buyer.weights.airportAccess },
  ];
  
  dimensions.forEach(dim => {
    if (dim.weight > 0) {
      const propertyValue = property.lifestyleDNA[dim.key]?.effective || 0;
      const buyerWeight = dim.weight;
      const buyerTarget = 10; // Buyer wants maximum
      
      // Score: how well property meets buyer's weighted preference
      // 10 = perfect match, 0 = no match
      const score = (property.effective / 10) * 100; // 0-100
      const weightedScore = score * buyerWeight;
      
      dimensionScores[dim.key] = {
        propertyValue: property.effective,
        buyerWeight,
        score,
        weightedScore
      };
      
      weightedSum += weightedScore;
      totalWeight += buyerWeight;
    });
    
    const lifestyleScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
    
    // Conventional match
    const conventionalScore = calculateConventionalMatch(buyer, property);
    
    // Overall score (weighted blend)
    const lifestyleWeight = 0.7;
    const conventionalWeight = 0.3;
    const overallScore = Math.round(
      lifestyleScore * lifestyleWeight + conventionalScore * conventionalWeight
    );
    
    // Confidence based on data completeness
    const dataCompleteness = property.lifestyleDNA.dataCompleteness || 0;
    const confidence = dataCompleteness > 0.7 ? 'high' : 
                       dataCompleteness > 0.4 ? 'medium' : 'low';
    
    // Generate explanation
    const explanation = generateExplanation(buyer, property, dimensionScores);
    const compromises = identifyCompromises(buyer, property, dimensionScores);
    
    return {
      match: true,
      overallScore,
      lifestyleScore,
      conventionalScore,
      dimensionScores,
      confidence: dataCompleteness > 0.7 ? 'high' : dataCompleteness > 0.4 ? 'medium' : 'low',
      explanation,
      compromises,
      dealBreakerViolations: [],
      dataCompleteness
    };
  };
```

### Deal Breaker Check
```typescript
function checkDealBreakers(dealBreakers: DealBreaker[], property: PropertyProfile): DealBreakerViolation[] {
  const violations = [];
  
  for (const db of dealBreakers) {
    const propertyValue = getPropertyValue(property, db.attribute);
    
    let violated = false;
    switch (db.operator) {
      case 'eq':
        violated = propertyValue === db.value;
        break;
      case 'neq':
        violated = propertyValue !== db.value;
        break;
      case 'lt':
        violated = propertyValue < db.value;
        break;
      case 'lte':
        violated = propertyValue <= db.value;
        break;
      case 'gt':
        violated = propertyValue > db.value;
        break;
      case 'gte':
        violated = propertyValue >= db.value;
        break;
      case 'contains':
        violated = propertyValue?.includes?.(db.value) ?? false;
        break;
    }
    
    if (violated) {
      violations.push({
        attribute: db.attribute,
        dealBreakerType: dealBreakerType,
        propertyValue,
        expected: db.value,
        operator: db.operator,
        severity: db.severity || 'high'
      });
    }
  }
  
  return violations;
}
```

### Explanation Generation
```typescript
function generateExplanation(
  buyer: BuyerProfile, 
  property: PropertyProfile, 
  dimensionScores: Record<string, DimensionScore>
): { strengths: string[]; compromises: string[] } {
  const strengths = [];
  const compromises = [];
  
  // Find top 3 matching dimensions
  const sortedDims = Object.entries(dimensionScores)
    .filter(([k, v]) => buyer.weights[v.key] > 0)
    .sort((a, b) => b[1].weightedScore - a[1].weightedScore);
  
  sortedDims.slice(0, 3).forEach(([key, score]) => {
    const attrName = ATTRIBUTE_LABELS[key];
    if (score.propertyValue >= 8) {
      strengths.push(`Excellent ${attrName} (${score.propertyValue}/10)`);
    } else if (score.propertyValue >= 6) {
      strengths.push(`Good ${attrName} (${score.propertyValue}/10)`);
    }
  });
  
  // Identify compromises (high weight, low property value)
  Object.entries(dimensionScores).forEach(([key, score]) => {
    if (buyer.weights[key] >= 8 && score.propertyValue < 6) {
      compromises.push(`${ATTRIBUTE_LABELS[key]} is ${score.propertyValue}/10 (you wanted ${buyer.weights[key]}/10)`);
    }
  });
  
  // Check data completeness
  const missingData = Object.keys(property.lifestyleDNA).filter(
    k => property.lifestyleDNA[k] === undefined
  );
  if (missingData.length > 5) {
    compromises.push(`${missingData.length} lifestyle attributes not yet rated for this property`);
  }
  
  return { strengths, compromises };
}
```

### Property Card Display
```tsx
// PropertyCard.tsx - Enhanced with Lifestyle Match
interface PropertyCardProps {
  property: PropertyProfile & { matchResult?: MatchResult };
  locale: Locale;
  t: (en: string, es: string) => string;
}

export default function PropertyCard({ property, locale, t, matchResult }) {
  const primaryPhoto = getFirstSafeImage(property.photos);
  const hasRealPhoto = property.photos.length > 0 && (property.photos[0]?.signedUrl ?? property.photos[0]?.url);
  
  return (
    <Link href={`/${locale}/properties/${property.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {hasRealPhoto ? (
          <img src={primaryPhoto} alt={property.photoAltText[0] || t("Preview", "Vista previa")} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Home className="size-12" />
          </div>
        )}
        
        {/* Lifestyle Match Badge */}
        {property.matchResult && (
          <div className="absolute top-2 right-2 z-10">
            <div className={`rounded-full px-2 py-1 text-xs font-bold ${getMatchColor(property.matchResult.overallScore)}`}>
              {property.matchResult.overallScore}% Match
            </div>
          </div>
        )}
        
        {/* Accolades */}
        {property.accolades && property.accolades.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 px-2 pb-2">
            {property.accolades.slice(0, 3).map((accolade, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {accolade.icon} {accolade.label}
              </span>
            ))}
            {property.accolades.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                +{property.accolades.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-col p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{property.title || t("Untitled", "Sin título")}</h3>
              {property.featured && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <Star className="size-3" />
                  {t("Featured", "Destacada")}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground mb-1">
              {property.listingType && <span>{property.listingType}</span>}
              {property.bedrooms != null && <span> · {property.bedrooms} {t("bed", "rec")}</span>}
              {property.bathrooms != null && <span> · {property.bathrooms} {t("bath", "baño")}</span>}
              {property.interiorArea != null && <span> · {property.interiorArea} {property.areaUnit || "m²"}</span>}
            </div>
            <div className="text-sm text-muted-foreground">
              {property.publicLocation && <span>{property.publicLocation} · </span>}
              <span className="font-medium text-foreground">
                {formatPrice(property.price, property.currency, locale)}
              </span>
            </div>
          </div>
          
          {/* Lifestyle Match Badge */}
          {property.matchResult && (
            <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${getMatchColor(property.matchResult.overallScore)}`}>
              <BadgeCheck className="size-3" />
              {property.matchResult.overallScore}% {t("Match", "Coincidencia")}
            </div>
          )}
          
          {/* Accolades */}
          {property.accolades && property.accolades.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {property.accolades.slice(0, 3).map((accolade, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {accolade.icon} {accolade.label}
                </span>
              ))}
              {property.accolades.length > 3 && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  +{property.accolades.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Match Explanation Preview */}
          {property.matchResult?.explanation?.strengths?.length > 0 && (
            <div className="mt-2 p-2 bg-primary/5 rounded-lg text-xs text-primary">
              {property.matchResult.explanation.strengths[0]}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function getMatchColor(score: number) {
  if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
  if (score >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (score >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-gray-100 text-gray-800 border-gray-200';
}
```

## Acceptance Criteria
- [ ] Deterministic matching algorithm (no AI in scoring)
- [ ] Deal breakers work as hard exclusions
- [ ] Weighted lifestyle scoring with configurable weights
- [ ] Confidence scoring based on data completeness
- [ ] Human-readable explanations for matches
- [ ] Compromise identification
- [ ] Deal breakers act as hard exclusions
- [ ] Property cards show match % and top accolades
- [ ] Property detail page shows Living Experience section
- [ ] Accolades generated from structured data only
- [ ] Unit tests for matching algorithm
- [ ] Integration tests for search flow