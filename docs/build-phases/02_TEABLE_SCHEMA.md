# PHASE 2: TEABLE SCHEMA & LIFESTYLE DNA DATA MODEL

## Objective
Design and implement the complete Teable schema for Lifestyle DNA, Area DNA, Building DNA, Property DNA, and Living Experience data models. This is the foundational data layer for the Lifestyle Intelligence platform.

## Current Teable Tables (Verified Live)

| Table | Teable ID | Purpose |
|-------|-----------|---------|
| Portal Users | `tbl394RbduZlmHUni8e` | User accounts |
| Clients (Agents) | `tbluaZYX8Umw7VuZHVG` | Realtor profiles |
| Properties | `tblUlJEDQW8xvlqMviu` | Property listings |
| Locations | `tblRMqpDs1ilZAOacsH` | Cities/Areas/Developments |
| Property Activity | `tblbiHm44TeA55UEWSt` | Contact analytics |
| Listing Renewals | `tbl7XnhLXWvbRJXXh6L` | Subscription tracking |
| Sponsor Accounts | `tbliuwzQOgnEFQNqxj9` | Sponsor profiles |
| Business Adverts | `tbln1kaLnMBM9jlgyV8` | Sponsor adverts |
| Directory Subscriptions | `tblIk58JzxlY532W6A0` | Agent subscriptions |
| Advertiser Verifications | `tblVYj7pAh9OMcDAA08` | ID verification for verified badge |

## Required Schema Extensions

### 1. AREA DNA TABLE
**Table**: `Area_DNA` (new or extend Locations)
**Inheritance**: Properties inherit from Area → Community → Property

```typescript
// Area DNA Fields (1-10 scale with documented rubrics)
interface AreaDNA {
  areaId: string;                    // Links to Locations table
  // Location & Access
  beachAccess: number;               // 1-10: 10=0-3min walk, 1=30+ min
  natureAccess: number;              // Jungle, parks, green space
  cenoteAccess: number;              // Proximity to cenotes
  shoppingConvenience: number;       // Supermarkets, malls, markets
  restaurantsCafes: number;          // Density & variety
  healthcareAccess: number;          // Hospitals, clinics, pharmacies
  schoolsAccess: number;             // International, bilingual schools
  publicTransport: number;           // Bus, taxi, colectivo access
  cyclingInfrastructure: number;     // Bike lanes, safety
  carFreeScore: number;              // 10 = no car needed
  internationalCommunity: number;    // Expat density, English spoken
  socialLife: number;                // Events, meetups, community
  nightlife: number;                 // Bars, clubs, evening activity
  liveMusic: number;                 // Venues, frequency
  quietness: number;                 // 10=very quiet, 1=loud
  traffic: number;                   // 10=quiet, 1=heavy
  constructionActivity: number;      // 10=none, 1=constant
  airportAccess: number;             // Minutes to airport
  familyFriendliness: number;        // Parks, schools, safety
  remoteWorkSuitability: number;     // Internet, cafes, coworking
  adventureAccess: number;           // Cenotes, diving, ruins, islands
  investmentAppeal: number;          // Rental demand, appreciation
  
  // Rubric Documentation (REQUIRED)
  // beachAccess: 10=0-3min walk, 9=4-5min, 8=6-8min, 7=9-12min, 6=13-15min, 5=16-20min, 4=21-25min, 3=21-30min, 2=30-45min, 1=45+min
}
```

### Area Defaults Table
```typescript
// Teable: Area_Defaults
// One record per Area (Playacar, Centro, Zazil-Ha, etc.)
{
  areaId: "playacar",
  cityId: "playa-del-carmen",
  defaults: {
    beachAccess: 9,
    natureAccess: 8,
    walkability: 8,
    internationalCommunity: 9,
    // ... all 20 attributes
  },
  rubricVersion: "1.0",
  lastUpdated: "2026-08-19",
  updatedBy: "system"
}
```

### 2. COMMUNITY / DEVELOPMENT TABLE
**New Table**: `Communities`

```typescript
{
  communityId: "playacar-phase-2",
  areaId: "playacar",
  name: "Playacar Phase II",
  type: "gated_residential", // gated_residential | condo_complex | mixed_use | hotel_zone
  description: "Gated residential community with golf course",
  
  // Community DNA (overrides Area defaults)
  gatedSecurity: 10,
  golfAccess: 10,
  beachAccess: 10,
  cycling: 9,
  walkability: 8,
  peace: 9,
  internationalCommunity: 9,
  // ... etc
  
  // Building defaults for this community
  buildingDefaults: {
    security: 9,
    pool: 8,
    gym: 6,
    elevator: 7,
    shortTermRentalIntensity: 4, // 1=none, 10=high
    ownerOccupancy: 8,
    parking: 7
  }
}
```

### 3. BUILDING DNA TABLE

```typescript
// Table: Building_DNA
{
  buildingId: "bldg_playacar_phase2_blockA",
  communityId: "playacar-phase-2",
  name: "Playacar Phase II - Block A",
  
  // Building characteristics
  totalUnits: 48,
  floors: 4,
  unitsPerFloor: 12,
  hasElevator: true,
  hasPool: true,
  hasGym: false,
  hasRooftop: false,
  hasGarden: true,
  hasParking: true,
  hasConcierge: false,
  hasSecurity: true,
  
  // Building DNA (1-10)
  security: 9,
  privacy: 8,
  buildingNoise: 2,        // 1=loud, 10=silent
  buildingDensity: 3,      // 1=dense, 10=spacious
  shortTermRentalIntensity: 3, // 1=none, 10=all STR
  ownerOccupancy: 8,       // % owner-occupied
  shortTermRentalPolicy: "restricted", // allowed | restricted | prohibited
  petPolicy: "allowed",    // allowed | restricted | prohibited
  
  // Common areas
  hasPool: true,
  poolRating: 8,
  hasGym: false,
  hasRooftop: false,
  hasGarden: true,
  gardenRating: 8,
  hasParking: true,
  parkingType: "underground", // surface | underground | street
  
  // Management
  hoaFee: 3500, // MXN/month
  hoaIncludes: ["security", "pool", "gardens", "common_areas"],
  managementCompany: "Playacar Management SA"
}
```

### Property Living Experience (New Fields on Properties Table)

```typescript
// Extended Fields for Properties Table
{
  // View & Outlook
  viewType: "ocean" | "beach" | "jungle" | "garden" | "pool" | "street" | "rooftop" | "courtyard" | "neighbouring_building" | "parking" | "none",
  viewQuality: 8,              // 1-10
  viewDescription: "Garden view with partial ocean glimpse",
  
  // Outdoor Space
  hasBalcony: true,
  balconySize: 12,             // m2
  balconyOrientation: "east",   // n, ne, e, se, s, sw, w, nw
  balconyView: "garden",        // ocean, beach, jungle, garden, pool, street, rooftop, city
  balconyPrivacy: 9,           // 1-10
  balconySunExposure: "morning", // morning, afternoon, all_day, evening
  hasPrivateGarden: false,
  gardenSize: 0,
  hasPrivatePool: false,
  
  // Privacy & Noise
  privacyScore: 9,              // 1-10
  balconyPrivacy: 9,
  bedroomPrivacy: 9,
  neighbourVisibility: 2,      // 1=full view, 10=none
  streetNoise: 2,              // 1=loud, 10=silent
  neighbourNoise: 1,           // 1=loud, 10=silent
  dogNoise: 2,                 // 1=constant, 10=none
  constructionNoise: 1,        // 1=active, 10=none
  trafficNoise: 2,
  nightlifeNoise: 1,
  liveMusicNoise: 1,
  
  // View & Outlook
  viewType: "garden",
  viewQuality: 8,
  viewDescription: "Mature tropical garden with mature palms",
  privacyScore: 9,
  viewQuality: 8,
  
  // Building context
  floor: 2,
  totalFloors: 4,
  unitPosition: "middle",      // corner | middle | end
  orientation: "east",         // n, ne, e, se, s, sw, w, nw
  naturalLight: 9,
  morningSun: true,
  afternoonSun: false,
  
  // Building context
  buildingDensity: 3,           // 1=dense, 10=spacious
  buildingNoise: 2,
  buildingPrivacy: 8,
  buildingSecurity: 9,
  shortTermRentalIntensity: 3,
  ownerOccupancy: 8,
  buildingAtmosphere: "quiet_residential", // quiet_residential | social | hotel_like | high_turnover | family | investor
  
  // Parking & Access
  hasParking: true,
  parkingType: "underground",  // underground | surface | street | none
  parkingSpaces: 1,
  hasElevator: true,
  floorsTotal: 4,
  unitFloor: 2,
  
  // Utilities
  hasAC: true,
  acType: "split",             // central | split | window | none
  hasInternet: true,
  internetSpeed: "500mbps",
  
  // Condition
  condition: "excellent",      // new | excellent | good | fair | needs_renovation
  renovationYear: 2023,
  furnished: "fully",          // none | partial | fully | negotiable
}
```

### Living Experience (New Table or Extended Fields)

```typescript
// Extended Living Experience Fields
{
  // Street & Access
  streetType: "cul_de_sac",    // cul_de_sac | through_road | main_road | side_street | pedestrian | gated_road | private_drive
  trafficProfile: "very_low",  // very_low | low | moderate | high | very_high
  isCulDeSac: true,
  isThroughRoad: false,
  isMainRoad: false,
  
  // Noise Profile (time-based)
  noiseProfile: {
    morning: "very_low",    // very_low | low | moderate | high | very_high
    afternoon: "low",
    evening: "moderate",    // Restaurant activity
    night: "low"
  },
  
  // Noise Sources
  noiseSources: {
    dogs: 2,              // 1=constant, 10=none
    traffic: 2,
    nightlife: 1,
    liveMusic: 1,
    construction: 1,
    neighbours: 3,
    pool: 2,
    rooftop: 1,
    street: 2
  },
  
  // Privacy
  balconyPrivacy: 9,
  bedroomPrivacy: 9,
  poolPrivacy: 8,
  neighbourVisibility: 2,  // 1=full view, 10=none
  streetExposure: 2,
  entrancePrivacy: 9,
  
  // Building Context
  buildingSize: 24,        // number of units
  buildingAtmosphere: "quiet_residential", // quiet_residential | social | hotel_like | high_turnover | family | investor
  shortTermRentalRatio: 0.15, // 0-1
  ownerOccupancyRate: 0.85,
  buildingAge: 12,         // years
  hasElevator: true,
  floorsTotal: 4,
  unitFloor: 2,
  unitsPerFloor: 12,
  
  // View & Outlook
  viewType: "garden",
  viewQuality: 8,
  viewDescription: "Mature tropical garden with mature palms",
  privacyScore: 9,
  balconyOrientation: "east",
  morningSun: true,
  afternoonSun: false,
  balconySize: 12,
  hasPrivatePool: false,
  
  // Street Character
  streetType: "cul_de_sac",
  isCulDeSac: true,
  isThroughRoad: false,
  isMainRoad: false,
  
  // Pet & Family
  dogNoise: 2,
  barkingDogs: false,
  petFriendly: true,
  familyFriendly: 8,
  
  // Parking
  hasParking: true,
  parkingType: "underground",
  parkingSpaces: 1,
  guestParking: true,
  
  // Building Amenities
  hasElevator: true,
  hasPool: true,
  poolRating: 8,
  hasGym: false,
  hasRooftop: false,
  hasGarden: true,
  gardenRating: 8,
  hasConcierge: false,
  
  // Security
  hasSecurity: true,
  securityType: "24h_gate_guard", // 24h_gate_guard | daytime_guard | intercom_only | none
  gatedCommunity: true,
  gateAccess: "key_fob", // key_fob | remote | guard | code
  
  // Parking
  hasParking: true,
  parkingType: "underground",
  parkingSpaces: 1,
  guestParking: true,
  evCharging: false
}
```

### Lifestyle Accolades (Computed Badges)

```typescript
// Auto-generated from structured data
type Accolade = 
  | "Car-Free Friendly"        // carFreeScore >= 8 && walkability >= 8
  | "Beach Access"             // beachAccess >= 8
  | "International Community"  // internationalCommunity >= 8
  | "Green Oasis"              // natureScore >= 8 && greenSpace >= 8
  | "Gated Community"          // gatedCommunity === true
  | "Golf Lifestyle"           // golfAccess >= 8
  | "Foodie Friendly"          // restaurantsScore >= 9
  | "Peaceful Retreat"         // quietness >= 9 && peaceScore >= 8
  | "Cyclist Friendly"         // cyclingScore >= 8
  | "Remote Work Friendly"     // remoteWorkScore >= 8 && internetSpeed >= 100
  | "Family Friendly"          // familyScore >= 8
  | "Pet Friendly"             // petPolicy === "allowed" && petScore >= 7
  | "Social Hub"               // socialScore >= 8 && nightlife >= 6
  | "Water Sports"             // waterSports >= 8
  | "Investor Friendly"        // investmentScore >= 8 && rentalDemand >= 8
  | "Privacy Retreat"          // privacyScore >= 9 && quietness >= 8
  | "Garden Outlook"           // gardenOutlook >= 8
  | "Pool Outlook"             // poolOutlook >= 8
  | "Ocean View"               // viewType === "ocean" && viewQuality >= 8
  | "Jungle Outlook"           // viewType === "jungle" && viewQuality >= 8
  | "Ocean View"               // viewType === "ocean" && viewQuality >= 8
  | "Mountain View"            // viewType === "mountain" && viewQuality >= 8
  | "Garden View"              // viewType === "garden" && viewQuality >= 8
  | "Pool View"                // viewType === "pool" && viewQuality >= 8
  | "Rooftop View"             // viewType === "rooftop" && viewQuality >= 8
```

### Buyer Profile (New Table)

```typescript
// Table: Buyer_Profiles
{
  buyerId: "user_123",
  userId: "rec_user_123",
  
  // Conventional
  budgetMin: 300000,
  budgetMax: 600000,
  bedroomsMin: 2,
  bathroomsMin: 2,
  propertyTypes: ["condo", "house"],
  currencies: ["MXN", "USD"],
  purchasePurpose: "lifestyle", // lifestyle | investment | both
  timeframe: "3-6_months",       // immediate | 1-3_months | 3-6_months | 6-12_months | flexible
  
  // Lifestyle Weights (1-10)
  weights: {
    beach: 8,
    walkability: 10,
    restaurants: 9,
    community: 8,
    quietness: 10,
    privacy: 9,
    nature: 8,
    cycling: 6,
    nightlife: 3,
    family: 4,
    investment: 5,
    carFree: 10,
    remoteWork: 7,
    adventure: 5,
    schools: 2,
    healthcare: 7
  },
  
  // Deal Breakers (hard exclusions)
  dealBreakers: [
    { attribute: "hasAC", operator: "eq", value: true },
    { attribute: "hasElevator", operator: "eq", value: true, condition: "floor > 2" },
    { attribute: "buildingNoise", operator: "lte", value: 3 },
    { attribute: "shortTermRentalIntensity", operator: "lte", value: 4 },
    { attribute: "hasAC", operator: "eq", value: true },
    { attribute: "hasElevator", operator: "eq", value: true, condition: "floor > 1" },
    { attribute: "hasParking", operator: "eq", value: true }
  ],
  
  // Deal Breaker Types
  dealBreakerTypes: [
    "no_ac",
    "no_elevator_above_floor_2",
    "building_noise_high",
    "short_term_rental_heavy",
    "no_parking",
    "low_privacy",
    "neighbour_overlooking_balcony",
    "high_traffic_street",
    "construction_nearby",
    "no_internet",
    "poor_internet",
    "stairs_no_elevator_above_ground"
  ],
  
  // Intended Use
  intendedUse: "lifestyle", // lifestyle | investment | both
  timeframe: "3-6_months",
  
  // Generated from natural language
  rawInput: "I'm a 55-year-old Canadian moving to Playa with my partner. We don't want a car. We want a quiet home with a pool, restaurants within walking distance, an international community and easy access to the beach. I love cycling and want to explore cenotes and Cozumel.",
  
  createdAt: "2026-08-19T10:30:00Z",
  updatedAt: "2026-08-19T10:30:00Z"
}
```

### Deal Breakers (Hard Constraints)

```typescript
// Deal Breaker Types (Standardized)
type DealBreakerType = 
  | "no_ac"
  | "no_elevator_above_floor_2"
  | "building_noise_high"
  | "short_term_rental_heavy"
  | "no_parking"
  | "low_privacy"
  | "neighbour_overlooking_balcony"
  | "high_traffic_street"
  | "construction_nearby"
  | "no_internet"
  | "poor_internet"
  | "stairs_no_elevator_above_ground"
  | "no_ac"
  | "no_elevator_above_floor_2"
  | "building_noise_high"
  | "short_term_rental_heavy"
  | "no_parking"
  | "low_privacy"
  | "neighbour_overlooking_balcony"
  | "high_traffic_street"
  | "construction_nearby"
  | "no_internet"
  | "poor_internet"
  | "stairs_no_elevator_above_ground"
```

### User Events (Analytics)

```typescript
// Table: User_Events
{
  eventId: "evt_123",
  userId: "user_123",           // or anonymous_id
  sessionId: "sess_abc",
  propertyId: "prop_123",       // nullable
  agentId: "agent_123",         // nullable
  eventType: "contact_modal_open",
  timestamp: "2026-08-19T14:30:00Z",
  metadata: {
    matchScore: 94,
    source: "lifestyle_search",
    device: "mobile",
    referrer: "google"
  }
}

Event Types:
- property_view
- lifestyle_match
- property_saved
- contact_modal_open
- contact_question
- viewing_request
- whatsapp_click
- phone_request
- enquiry_submitted
- property_share
- agent_share
- deal_breaker_triggered
- lifestyle_filter_changed
- search_performed
- natural_language_search
```

### Sponsor Tables (Already in Teable)

```typescript
// Sponsor_Accounts (tbliuwzQOgnEFQNqxj9)
{
  sponsorId: "sponsor_123",
  userId: "user_123",
  contactName: "John Smith",
  businessName: "Playa Dental Clinic",
  businessAddress: "Calle 10, Playa del Carmen",
  contactPhone: "+52 984 123 4567",
  contactEmail: "john@playadental.com",
  website: "https://playadental.com",
  logoUrl: "https://...",
  status: "active", // pending | active | suspended | cancelled
  stripeCustomerId: "cus_123",
  stripeSubscriptionId: "sub_123",
  currentPeriodEnd: "2026-09-15",
  monthlyAmount: 12000, // cents (1200 MXN)
  stripeSubscriptionStatus: "active", // active | past_due | canceled | trialing
  createdAt: "2026-08-15T10:00:00Z"
}

// Business Adverts (tbln1kaLnMBM9jlgyV8)
{
  advertId: "advert_123",
  sponsorId: "sponsor_123",
  title: "Playa Dental Clinic - Your Smile in Paradise",
  description: "Modern dental clinic in heart of Playa...",
  imageUrl: "https://...",
  destinationUrl: "https://playadental.com",
  billingStatus: "active", // active | past_due | cancelled | trialing
  monthlyAmount: 120000, // cents (1200 MXN)
  stripeSubscriptionId: "sub_456",
  stripeCustomerId: "cus_123",
  currentPeriodEnd: "2026-09-15",
  stripeCheckoutSessionId: "cs_123",
  isActive: true,
  approved: true,
  createdAt: "2026-08-15T10:00:00Z"
}
```

### Data Provenance Fields (All Scored Fields)

```typescript
// For every scored field (1-10)
interface ScoredField {
  value: number;              // 1-10
  source: "area_default" | "community_default" | "realtor_override" | "system_verified" | "ai_inferred";
  confidence: number;         // 0-1
  lastUpdated: string;        // ISO date
  updatedBy: string;          // userId or "system"
  rubricVersion: string;      // "1.0"
}

// Example in property record
{
  beachAccess: {
    value: 8,
    source: "realtor_override",
    areaDefault: 9,
    overrideValue: 8,
    effective: 8,
    confidence: 0.9,
    rubricVersion: "1.0",
    lastUpdated: "2026-08-19T10:00:00Z",
    updatedBy: "realtor_123"
  }
}
```

## Migration Strategy

### Phase 2A: Core Tables (Week 1)
1. Create Area_Defaults table
2. Add Community table
3. Add Building_DNA table
3. Add Property_Lifestyle_Experience fields to Properties
3. Add Provenance fields to all scored fields
4. Add Lifestyle_Accolades table
4. Add Property_Accolades junction table
5. Add Buyer_Profiles table
5. Add Buyer_DealBreakers table
6. Add User_Events table
6. Add Sponsor tables (if not exist)

### Migration Strategy
1. Add new fields as nullable
2. Backfill Area Defaults for existing areas
3. Run backfill script for existing properties
4. Deploy code that reads new fields
6. Add validation & UI

---
*Phase 2 Deliverable: Complete Teable schema with all tables, fields, relationships, and migration scripts*