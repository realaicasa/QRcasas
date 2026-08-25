# PHASE 7: 20-REALTOR PILOT DASHBOARD & VALIDATION

## Objective
Validate the core marketplace loop with 20 Realtors before public launch.

## Pilot Structure

### Recruitment
- **Target**: 20 forward-thinking Realtors in Playa del Carmen / Riviera Maya
- **Incentive**: Free lifetime "Pro" tier + "Founding Realtor" badge
- **Duration**: 90 days
- **Commitment**: Add 10+ properties each, complete Lifestyle DNA

### Onboarding Flow
```tsx
// Pilot Onboarding Flow
1. Realtor signs up at /pilot/apply
2. Admin reviews & approves
3. Account created with "Founding Realtor" flag
3. Onboarding wizard:
   - Profile setup (photo, bio, areas, specialties)
   - Connect Stripe (for future upsells)
   - Add 5+ properties with Lifestyle DNA
   - Complete agent profile (specialist, contact, social)
5. Training video (15 min): "Getting Matched with Buyers"
```

## Pilot Dashboard (`/pilot/dashboard`)

### Admin View
```tsx
// app/[locale]/pilot/dashboard/page.tsx
export default async function PilotDashboard() {
  const stats = await getPilotStats();
  const realtors = await getPilotRealtors();
  const properties = await getPilotProperties();
  const buyerActivity = await getBuyerActivity();
  
  return (
    <DashboardLayout>
      <header>
        <h1>QRcasas Founding 20 Pilot</h1>
        <p className="text-muted-foreground">
          {pilotStats.activeRealtors}/20 Realtors • {pilotStats.totalProperties} Properties
        </p>
      </header>

      {/* Key Metrics */}
      <MetricsGrid>
        <MetricCard 
          label="Active Realtors" 
          value={stats.activeRealtors} 
          target={20} 
          trend={stats.realtorGrowth} 
        />
        <MetricCard 
          label="Properties Listed" 
          value={stats.totalProperties} 
          target={200} 
        />
        <MetricCard 
          label="Avg Lifestyle Completion" 
          value={`${stats.avgCompletion}%`} 
          target="80%" 
        />
        <MetricCard 
          label="Match → Enquiry Rate" 
          value={`${stats.matchToEnquiryRate}%`} 
          target=">10%" 
        />
      </MetricsGrid>

      {/* Realtor Progress Table */}
      <RealtorProgressTable realtors={realtors} />
      
      {/* Buyer Activity Feed */}
      <BuyerActivityFeed activities={buyerActivity} />
      
      {/* Property Quality Heatmap */}
      <PropertyQualityHeatmap properties={properties} />
    </DashboardLayout>
  );
}
```

### Realtor Progress Table
```tsx
function RealtorProgressTable({ realtors }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Realtor</TableHead>
          <TableHead>Properties</TableHead>
          <TableHead>Enhanced</TableHead>
          <TableHead>Match Ready</TableHead>
          <TableHead>Views (30d)</TableHead>
          <TableHead>Matches (30d)</TableHead>
          <TableHead>Contact Intents</TableHead>
          <TableHead>Enquiries</TableHead>
          <TableHead>Conversion</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {realtors.map(r => (
          <TableRow key={r.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                {r.photoUrl ? <img src={r.photoUrl} className="h-8 w-8 rounded-full" /> : <Avatar>{r.name[0]}</Avatar>}
                <div>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>{r.totalProperties}</TableCell>
            <TableCell>
              <ProgressBar value={r.enhancedCount} max={r.totalProperties} />
              <span className="text-xs text-muted-foreground">
                {r.enhancedCount}/{r.totalProperties}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={r.matchReady ? 'default' : 'secondary'}>
                {r.matchReady ? 'Ready' : 'Incomplete'}
              </Badge>
            </TableCell>
            <TableCell>{r.views30d}</TableCell>
            <TableCell>{r.matches30d}</TableCell>
            <TableCell>{r.contactIntents}</TableCell>
            <TableCell>{r.enquiries}</TableCell>
            <TableCell>
              {r.views30d > 0 ? ((r.enquiries / r.views30d) * 100).toFixed(1) + '%' : '—'}
            </TableCell>
            <TableCell>
              <Badge variant={r.active ? 'default' : 'secondary'}>
                {r.active ? 'Active' : 'Inactive'}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

### Buyer Activity Feed
```tsx
function BuyerActivityFeed({ activities }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Buyer Activity</CardTitle>
        <CardDescription>Last 100 buyer interactions</CardDescription>
      </CardHeader>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {activities.slice(0, 50).map((activity, i) => (
          <ActivityRow key={i} activity={activity} />
        ))}
      </Card>
    </Card>
  );
}

function ActivityRow({ activity }) {
  const icons = {
    property_view: Eye,
    lifestyle_match: Sparkles,
    contact_modal_open: MessageCircle,
    viewing_request: Calendar,
    whatsapp_click: MessageCircle,
    enquiry_submitted: Mail,
  };
  
  const Icon = icons[activity.eventType] || Activity;
  
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
      <Icon className="size-5 text-primary" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {activity.propertyTitle} <span className="text-muted-foreground">in {activity.areaName}</span>
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {activity.buyerProfile ? `Buyer: ${activity.buyerProfile}` : 'Anonymous'}
        </p>
      </div>
      <Badge variant={getEventVariant(activity.eventType)} className="text-xs">
        {EVENT_LABELS[activity.eventType]}
      </Badge>
      <TimeAgo date={activity.timestamp} />
    </div>
  );
}
```

### Property Quality Heatmap
```tsx
function PropertyQualityHeatmap({ properties }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Data Quality Heatmap</CardTitle>
        <CardDescription>Lifestyle DNA completion by property</CardDescription>
      </CardHeader>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Missing Critical</TableHead>
              <TableHead>Match Ready</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map(p => (
              <TableRow key={p.id} className={p.completion < 50 ? 'bg-red-50' : p.completion < 80 ? 'bg-yellow-50' : ''}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>{p.areaName}</TableCell>
                <TableCell>
                  <ProgressBar value={p.completion} max={100} className="w-32" />
                  <span className="text-xs text-muted-foreground">{p.completion}%</span>
                </TableCell>
                <TableCell>
                  <Badge variant={p.missingCritical > 0 ? 'destructive' : 'default'}>
                    {p.missingCritical} critical fields
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={p.matchReady ? 'default' : 'secondary'}>
                    {p.matchReady ? 'Ready' : 'Incomplete'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
```

## Pilot Success Metrics

### Primary Metrics (Must Hit)
| Metric | Target | Measurement |
|--------|--------|-------------|
| Realtor Activation | 20/20 active | Dashboard login + 1+ property |
| Data Completion | ≥80% avg | Avg lifestyle completion % |
| Match → Enquiry Rate | >10% | Contact intents / lifestyle matches |
| Enquiry Quality | >50% rated "qualified" | Realtor survey |
| Realtor Retention | >80% at 90 days | Active at day 90 |

### Secondary Metrics
- Avg time to "Match Ready": <30 min
- AI suggestion acceptance rate: >70%
- Buyer "Describe" usage: >30% of searches
- Deal Breaker usage: >20% of searches
- Contact intent → enquiry conversion: >30%

### Feedback Collection
```tsx
// In-app feedback widget (triggered at day 7, 30, 60)
function FeedbackPrompt({ realtorId }) {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    const lastPrompt = localStorage.getItem(`feedback_prompt_${realtorId}`);
    const daysSinceSignup = (Date.now() - realtor.createdAt) / (1000*60*60*24);
    
    if (daysSinceSignup >= 7 && !lastPrompt) {
      setTimeout(() => setShow(true), 5000);
    }
  }, []);
  
  if (!show) return null;
  
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Help us improve QRcasas</DialogTitle>
          <DialogDescription>Quick 2-minute survey about your experience so far</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label>How easy was it to add your first property?</Label>
              <RadioGroup value={form.ease} onValueChange={setEase}>
                <RadioGroupItem value={1}>Very difficult</RadioGroupItem>
                <RadioGroupItem value={2}>Difficult</RadioGroupItem>
                <RadioGroupItem value={3}>Neutral</RadioGroupItem>
                <RadioGroupItem value={4}>Easy</RadioGroupItem>
                <RadioGroupItem value={5}>Very easy</RadioGroupItem>
              </RadioGroup>
            </div>
            <div>
              <Label>Did the AI suggestions save you time?</Label>
              <RadioGroup value={form.aiHelpful} onValueChange={setAiHelpful}>
                <RadioGroupItem value="saved_lots">Saved me lots of time</RadioGroupItem>
                <RadioGroupItem value="saved_some">Saved some time</RadioGroupItem>
                <RadioGroupItem value="neutral">Neutral</RadioGroupItem>
                <RadioGroupItem value="slowed_me">Slowed me down</RadioGroupItem>
              </RadioGroup>
            </div>
            <div>
              <Label>How accurate were the AI-suggested lifestyle scores?</Label>
              <RadioGroup value={form.aiAccuracy} onValueChange={setAiAccuracy}>
                <RadioGroupItem value="very">Very accurate</RadioGroupItem>
                <RadioGroupItem value="mostly">Mostly accurate</RadioGroupItem>
                <RadioGroupItem value="mixed">Hit or miss</RadioGroupItem>
                <RadioGroupItem value="poor">Mostly wrong</RadioGroupItem>
              </RadioGroup>
            </div>
            <div>
              <Label>What was most frustrating?</Label>
              <Textarea placeholder="Tell us..." />
            </div>
            <div>
              <Label>What feature would you add?</Label>
              <Textarea placeholder="Your idea..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShow(false)}>Skip</Button>
            <Button type="submit">Submit Feedback</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## Security Gate (Latest — hidden super-admin)
Public header no longer exposes Super Admin tab. Access via discreet footer "Admin Portal" button + global shortcut `Ctrl+Shift+A` / `Cmd+Shift+A`. `SuperAdminLoginModal.tsx`: passkey `qrcasas-admin-2026` + show/hide toggle + optional 2FA PIN `772202`, 5-attempt 30s lock, `sessionStorage` 30-min expiry, Lock Terminal / Sign Out.

## Footer Modals — Bilingual Standard
All footer modals (UserManual, LegalCompliance, PlatformGuide, Disclaimer, InstallApp, BecomeSponsor) are now audited to render 100% pure EN or ES with no mixed blocks. Each has sticky header, outside-click + Escape close, `fixed inset-0 z-50 overflow-y-auto bg-black/75`.

## AI Advisor Lead Capture
Concise 1-3 sentences, multilingual (EN/ES/PL/RU/FR/DE/IT/PT), strict domain (verified inventory + Fideicomiso + Living DNA only), never leaks raw contact, inline lead card (Name/WhatsApp/Email/Horizon/question) → instant Kanban + red alarm bell + analytics.

## Pilot Success Criteria (Gate to Public Launch)

| Metric | Threshold | Measurement |
|--------|-----------|-------------|
| Realtor Activation | 100% | All 20 create ≥5 properties |
| Data Completion | ≥80% avg | Lifestyle DNA completion rate |
| AI Acceptance | ≥70% | AI suggestions accepted vs edited |
| Match Quality | >85% rated "accurate" | Realtor + buyer survey |
| Contact Intent Rate | >12% | contact_modal_open / lifestyle_matches |
| Enquiry Quality | >60% "qualified" | Realtor rates 4-5/5 |
| Buyer Lifestyle Usage | >30% of searches | Use lifestyle/describe search |
| Deal Breaker Usage | >20% of searches | At least one deal breaker set |
| Realtor NPS | >50 | Post-pilot survey |

## Go/No-Go Decision Framework
- **GO**: All primary metrics hit + zero critical bugs
- **CONDITIONAL**: 3/4 primary metrics hit, clear path for remaining
- **NO-GO**: <3 primary metrics hit, fundamental UX issues