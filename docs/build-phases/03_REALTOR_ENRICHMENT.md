# PHASE 3: REALTOR ENRICHMENT WORKFLOW & AI ASSISTANCE

## Objective
Make enhanced lifestyle data entry effortless for Realtors. Transform tedious data entry into a value exchange: Realtors get AI-powered buyer matching in exchange for completing Living Experience profiles.

## Current State
- Basic property upload works (bedrooms, bathrooms, price, etc.)
- Agent form exists with profile photo/logo upload
- Basic SEO fields exist but with property-focused copy

## Phase 3A: Realtor Property Form - Lifestyle DNA Section

### Integration Point
After basic property details (bedrooms, bathrooms, price, etc.), add new section:
```tsx
// In property-form.tsx after pricing/type section
<LifestyleDNASection 
  property={property}
  tierLevel={tierLevel}
  onDataChange={handleLifestyleDataChange}
  initialData={property.lifestyleDNA}
/>
```

### Form Structure: Lifestyle DNA Section

```tsx
// New Component: LifestyleDNASection.tsx
<Section title="Lifestyle DNA" subtitle="Help buyers find their perfect lifestyle match">
  {/* Area/Community Selection - DRIVES DEFAULTS */}
  <LocationSelector
    value={form.areaId}
    onChange={handleAreaChange}
    showCommunitySelector={true}
  />
  
  {/* Area Defaults Notice */}
  {areaDefaults && (
    <InfoBanner>
      <InfoIcon /> Based on <strong>{areaName}</strong>, we've pre-filled lifestyle scores. 
      Adjust any that don't match this specific property.
    </InfoBanner>
  )}
  
  {/* Lifestyle DNA Grid */}
  <CollapsibleSection title="🌎 Around You (Area DNA)" defaultOpen>
    <LifestyleSlider 
      label="Beach Access"
      value={form.beachAccess}
      onChange={v => update('beachAccess', v)}
      inherited={areaDefaults?.beachAccess}
      rubric="10=0-3min walk, 5=15-20min, 1=30+min"
    />
    {/* ... repeat for all 20 area attributes */}
  </CollapsibleSection>
  
  <CollapsibleSection title="🏢 Building DNA" defaultOpen={false}>
    {/* Building DNA fields */}
  </CollapsibleSection>
  
  <CollapsibleSection title="🏡 Property DNA" defaultOpen={false}>
    {/* Property-specific lifestyle */}
  </CollapsibleSection>
  
  <CollapsibleSection title="🏡 Living Experience" defaultOpen={false}>
    {/* Living Experience - the "what's it like to live here" section */}
  </CollapsibleSection>
```

### Visual Design for Override UI
```tsx
// Component: InheritedScoreDisplay
function InheritedScore({ value, inherited, onChange, label, rubric }) {
  const isOverridden = value !== inherited;
  
  return (
    <div className="space-y-2">
      <Label>{label} {inherited !== undefined && (
        <InfoIcon className="inline ml-1" title={`Area default: ${inherited}/10`} />
      )}</Label>
      
      <div className="flex items-center gap-4">
        <Slider
          value={value}
          onChange={onChange}
          min={1} max={10}
          className="flex-1"
          disabled={!canOverride}
        />
        <Input 
          type="number" 
          min={1} max={10} 
          value={value} 
          onChange={e => onChange(parseInt(e.target.value))}
          className="w-16 text-center"
        />
        
        {inherited !== undefined && value !== inherited && (
          <Badge variant="outline" className="text-xs">
            Area default: {inherited}/10
          </Badge>
        )}
        
        {rubric && (
          <Tooltip content={rubric}>
            <HelpCircle className="size-4 text-muted-foreground" />
          </Tooltip>
        )}
      </div>
      
      {isOverridden && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onChange(inherited)}
          className="text-xs text-muted-foreground"
        >
          Revert to area default ({inherited})
        </Button>
      )}
    </div>
  );
}
```

### AI-Assisted Prefill
```typescript
// API Route: /api/properties/ai-suggest-lifestyle
// POST { propertyId, basicData, areaId }
// Returns: { suggestedScores: {...}, confidence: {...}, sources: {...} }

async function suggestLifestyleScores(propertyId: string) {
  const property = await getPropertyById(propertyId);
  const area = await getAreaById(property.areaId);
  const building = property.buildingId ? await getBuilding(property.buildingId) : null;
  const community = property.communityId ? await getCommunity(property.communityId) : null;
  
  // Use AI to suggest scores based on:
  // - Property description & features
  // - Area defaults
  // - Building characteristics
  // - Similar properties in area
  // - Satellite imagery (future)
  
  return {
    suggestedScores: {
      beachAccess: { value: 8, confidence: 0.85, source: "area_default" },
      walkability: { value: 9, confidence: 0.9, source: "system_verified" },
      // ...
    },
    reasoning: "Based on 650m to beach, 47 restaurants within 1km, 12 min walk to grocery"
  };
}
```

### Realtor Form Updates
```tsx
// In agent-form.tsx - Add to Profile Images section
{/* Verified ID Upload */}
<div>
  <label className="mb-1 block text-xs font-medium text-muted-foreground">
    {t("Proof of ID (for Verified Badge)", "Comprobante de ID")}
  </label>
  <input 
    type="file" 
    accept="image/*" 
    onChange={(e) => uploadVerificationDoc(e.target.files?.[0])} 
    className="block w-full text-sm" 
  />
  {agent?.identityVerificationStatus === "Verified" && (
    <Badge className="mt-1 bg-green-100 text-green-800">
      {t("Verified", "Verificado")} <BadgeCheck className="size-3" />
    </Badge>
  )}
  {agent?.identityVerificationStatus === "Pending Review" && (
    <Badge className="mt-1 bg-yellow-100 text-yellow-800">
      {t("Pending Review", "En Revisión")}
    </Badge>
  )}
  <p className="text-xs text-muted-foreground mt-1">
    {t("Upload government ID for verification. Required for Verified badge.", "Sube identificación oficial para verificación. Requerido para insignia verificada.")}
  </p>
```

### Verified Badge Logic
```typescript
// In agent-detail-modal.tsx
const isVerified = agent.identityVerificationStatus === "Verified" && agent.verificationFeeActive;

{isVerified && (
  <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800">
    <BadgeCheck className="size-3" />
    {t("Verified", "Verificado")}
  </Badge>
}
```

### Property Form - Verified ID Upload
```tsx
// In property-form.tsx - Add to photos section
{/* Verified ID Upload (for Verified agents) */}
{agent && agent.identityVerificationStatus === "Verified" && (
  <div className="border rounded-lg p-4 space-y-4 bg-blue-50 border-blue-200">
    <h3 className="font-medium text-sm">{t("Verified Agent Documents", "Documentos de Agente Verificado")}</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {t("Government ID", "Identificación Oficial")}
        </label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => uploadVerificationDoc(e.target.files?.[0], "government_id")}
          className="block w-full text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          {t("Proof of Address", "Comprobante de Domicilio")}
        </label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => uploadVerificationDoc(e.target.files?.[0], "proof_of_address")}
          className="block w-full text-sm"
        />
      </div>
    </div>
  </div>
)}
```

## Agent Form - SEO Fields Fix
```tsx
// In seo-fields.tsx - Already fixed in previous commit
// Placeholders now agent-specific:
// "Dynamic Mike — Playa del Carmen Real Estate Agent"
// "Specialist in Playa del Carmen vacation rentals and long-term rentals..."
```

## Sign-in Gate for Agent Contact Modal
```tsx
// In agent-detail-modal.tsx - Already implemented
// Pass isLoggedIn from server component
// Show "Sign In to Reveal Contact" for non-logged-in users
```

## TypeScript Types for New Fields
```typescript
// Add to src/lib/data/property.ts
export interface PropertyLifestyleDNA {
  // Area-inherited (can be overridden)
  beachAccess?: ScoredField;
  natureAccess?: ScoredField;
  // ... all 20 area attributes
  
  // Building DNA
  buildingSecurity?: ScoredField;
  buildingPrivacy?: ScoredField;
  shortTermRentalIntensity?: ScoredField;
  // ...
  
  // Property DNA
  viewType?: ViewType;
  viewQuality?: ScoredField;
  balconyPrivacy?: ScoredField;
  // ...
  
  // Living Experience
  streetType?: StreetType;
  noiseProfile?: NoiseProfile;
  privacyProfile?: PrivacyProfile;
  // ...
}

interface ScoredField {
  value: number;           // 1-10
  source: "area_default" | "community_default" | "realtor_override" | "system_verified" | "ai_inferred";
  confidence: number;
  rubricVersion: string;
  lastUpdated: string;
  areaDefault?: number;
  overrideValue?: number;
}

interface NoiseProfile {
  morning: "very_low" | "low" | "moderate" | "high" | "very_high";
  afternoon: "very_low" | "low" | "moderate" | "high" | "very_high";
  evening: "very_low" | "low" | "moderate" | "high" | "very_high";
  night: "very_low" | "low" | "moderate" | "high" | "very_high";
  sources: {
    dogs: number;
    traffic: number;
    nightlife: number;
    liveMusic: number;
    construction: number;
    neighbours: number;
    pool: number;
    rooftop: number;
    street: number;
  };
}
```

## Acceptance Criteria
- [ ] Realtor can create basic listing without lifestyle data
- [ ] "Enhance Listing" button appears after basic save
- [ ] Area selection auto-populates 20+ lifestyle scores
- [ ] Realtor can override any inherited value
- [ ] AI suggests scores with confidence scores
- [ ] Realtor confirms/edits each score
- [ ] "Match Ready" badge appears when sufficient data
- [ ] Property detail page shows Living Experience section
- [ ] Upload error handling with clear messages
- [ ] Current profile photo/logo displayed with green "Current" badge