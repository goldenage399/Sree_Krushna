---
pattern: declarative-option-clustering-and-consensus
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"
triggers: []
guard: ""
portability: universal
canonical_source: sree-krushna-marriage-os
porting_effort: low
---

# Declarative Option Clustering & Frictionless Consensus

**Category**: Methodology & Design Gate  
**Applies to**: Multi-option comparisons, decor tenders, vendor alternatives, family voting dashboards  
**Origin**: 2026-09-15 — Resolution of the `PLATE-01` and `PLATE-10` separation issue in Sree Krushna Decision Registry  
**Status**: VALIDATED (Validated across Mandap & Sangeet Stage selection surfaces)  

---

## Pattern — Declarative Option Clustering & Frictionless Consensus

### Problem
In complex, multi-event initiatives (such as weddings or large productions), media assets, technical proposals, and quotations arrive in staggered waves over weeks or months:
- Wave 1 contains initial tender specifications (`PLATE-01` to `PLATE-08`).
- Wave 2 contains ideation proposals and alternatives (`PLATE-09` to `PLATE-12`).

When an application or visual lookbook renders assets by linear array iteration or registration timestamp:
1. Competing alternatives for the exact same decision (e.g. `PLATE-01` Vedic Lotus Mandap and `PLATE-10` Royal Carved Mandap) end up separated across distant array indices.
2. Decision-makers and non-technical family members are forced to hunt through disconnected screens to evaluate alternatives.
3. Attempting to gather extended family consensus by requiring logins, heavy dashboards, or account creation results in zero participation and administrative deadlock.

### Why it happens
1. **Naive Iteration by Ingestion Order**: Developers iterate over `plates.map(...)` or database collections in chronological insertion order rather than grouping by functional decision scope.
2. **Coupling Host Administration with Family Voting**: Decision dashboards often treat executive management (cost modeling, vendor contracts, WBS milestones) and family review as the same view, overwhelming non-technical relatives with operational noise.

### Solution

#### 1. Declarative Decision Clustering (`P-OPTION-POD-001`)
Group competing alternatives explicitly in the canonical data layer using semantic clusters rather than linear indices:
```javascript
const clusters = [
  {
    id: "mandap",
    clusterId: "CLUSTER-MANDAP",
    title: "Vedic Vivaha Mandap Architecture",
    event: "wedding",
    decisionId: "DEC-14",
    whatsappTemplate: "🌺 *Mandap Review*...\n👉 Vote here: {url}",
    options: [
      { plateId: "PLATE-01", optionId: "A", label: "Option A: Vedic Lotus Mandap", highlight: "Sacred lotus floral canopy..." },
      { plateId: "PLATE-10", optionId: "B", label: "Option B: Royal Carved Mandap", highlight: "Carved temple pillars..." },
      { plateId: "PLATE-11", optionId: "C", label: "Option C: Suspended Lotus Dome", highlight: "Inverted fresh carnation dome..." }
    ]
  }
];
```

#### 2. Side-by-Side N-Option Pods
Render comparative option cards inside a dedicated cluster container with:
- High-resolution visual preview.
- Dimensional and spatial specifications.
- Concrete architectural highlights (distinguishing differences).
- Tactile radio selection with immediate local feedback and consensus vote tallying.

#### 3. URL Query Parameter State Hydration (`P-DEEP-LINK-001`)
Support direct routing into filtered views:
- `?mode=family`: Activates family mode (hides administrative toolbars, JSON exports, and vendor contract details; shows welcome banner and touch-friendly cards).
- `?event=<eventId>`: Selects active milestone.
- `?cluster=<clusterId>`: Direct-focuses the specific decision cluster and opens comparative view.

#### 4. 1-Click WhatsApp Consensus Generator (`P-COMPARE-SHARE-001`)
Provide a single-click action to copy structured invite text with direct deep links to the system clipboard, formatted for instant posting in family WhatsApp groups.

### Failure Mode
- **Unclustered Ingestion**: Future asset waves added to raw arrays without declarative `clusterId` assignment revert to index-based separation.
- **Deep-Link State Loss**: Omitting query parameter handling causes shared links to drop family members onto a generic dashboard landing page.

### Task-Dashboard / Marriage OS Instance
- Implementation: `scripts/build-decision-registry-data.cjs` (`clusters`), `scripts/build-decision-registry-html.cjs` (`#clusterPodsContainer`, `#eventStepperSection`, `window.shareClusterWhatsApp`).
- Artifacts: `decision-registry.html` and `public/decision-registry.html`.
- Formal Council Ruling: `AC-DEC-2026-016` / `UI-DEC-2026-012`.
