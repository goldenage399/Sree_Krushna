---
pattern: two-tier-workspace-subview-decoupling
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"
triggers: []
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Two-Tier Workspace & Operating Mode Decoupling Pattern (`P-SHOPPING-JOURNEY-HUBS-001`)

**Category**: Architecture & UX Design Pattern  
**Applies to**: Complex multi-domain SPA views, operational dashboards, and rich catalog workspaces with $\ge 3$ distinct functional concerns  
**Origin**: 2026-09-24 (`INC-096`, Shopping Catalog Domain Collision / `AC-DEC-2026-037`)  
**Status**: VALIDATED  

---

## Pattern — Two-Tier Workspace & Operating Mode Decoupling

### Problem
As single-page application tabs evolve to handle multiple operational concerns (e.g. daily travel timelines, deliberative decision pods, geographical vendor directories, and master inventory checklists), teams often append each new feature section linearly down the page.

This linear stacking causes:
1. **Severe Scroll Fatigue**: Users must scroll past ~1,800px of ancillary sections before reaching the actionable inventory checklist.
2. **Cognitive Domain Collision**: Different tasks (planning a schedule, voting on options, navigating to stores, buying items) compete for attention within the same scroll viewport.
3. **Deep-Link Collisions**: Multiple query parameters (`?cluster=...`, `?store=...`, `?chapter=...`, `?item=...`) compete without deterministic resolution precedence.
4. **Fragile Print Output**: Printing from the browser becomes tightly coupled to dynamic web visibility classes.

---

## The Solution: Two-Tier Information Architecture

```
Level 1: Primary Workspaces (Major Paradigms)
┌────────────────────────────────────────────────────────┐
│ [ 🛍️ Catalog ]      [ 📊 Live Table ]      [ 📝 Survey Studio ] │
└────────────────────────────────────────────────────────┘
       │
       ▼ (Inside Catalog View)
Level 2: Focused Operating Modes (Tactile Subnav Strip)
┌───────────────────────────────────────────────────────────────────────────────┐
│ [📋 Items (44)]  [🧭 5-Day Itinerary]  [🤝 Decisions (5)]  [📍 Stores (8)]  [👁️ Full Run Sheet] │
└───────────────────────────────────────────────────────────────────────────────┘
       │
       ├─► [Items Checklist]: Immediate 0px scroll depth to 44 items & filters
       ├─► [5-Day Itinerary]: Timeline stepper + filtered chapter items below
       ├─► [Decision Pods]: Side-by-side consensus voting pods & comments
       ├─► [Retail Stores]: Bhubaneswar store directory & Google Maps navigation
       └─► [Full Run Sheet]: Unrolled sequence for full-day showroom walkthroughs
```

---

## Core Invariants & Rules

### 1. Default 0px Execution Anchor
The primary execution checklist (`#itemsGrid`) MUST be the default operating mode (`mode-items`), placing the primary user action at 0px scroll depth immediately below the subnav strip with zero cognitive roadblocks.

### 2. Non-Destructive Inactive Container Hiding
- Inactive mode containers MUST be hidden using `display: none !important`.
- **Zero Forced Display Overrides**: Visible containers must NEVER declare forced `display: block` or `display: flex` overrides in visibility rules. Active containers MUST retain their native CSS Grid (`#itemsGrid`, `.shop-pod-grid`, `.shop-store-grid`) and Flexbox layouts.

### 3. Permanent DOM Node Preservation
All section containers (`#shoppingStepper`, `#shoppingClusterPods`, `#shoppingStoreNavigator`, `#itemsGrid`) MUST remain permanently mounted in the DOM. Never delete or conditionally detach DOM nodes, ensuring 100% compliance with automated test suites and headless verification scripts.

### 4. Decoupled Print Unrolling via `display: revert !important`
In `@media print`, unroll all sections using `display: revert !important;` instead of arbitrary `display: block`. This restores the element's natural display value (Grid for grids, Block for blocks) and allows clean physical run-sheet printing without dependence on client-side web states.

### 5. Deterministic Deep-Link Precedence Ladder
Controllers parsing complex URL queries must enforce an unambiguous priority sequence:
$$\text{Cluster / Option} \longrightarrow \text{Store} \longrightarrow \text{Chapter} \longrightarrow \text{Item} \longrightarrow \text{Subview} \longrightarrow \text{Default (Items)}$$

---

## Pre-Flight Verification Matrix

- [ ] Does `#catalogSubnavStrip` have sticky offset handling (`top: var(--shopping-sticky-offset, 12px)`)?
- [ ] Does default catalog view provide 0px scroll depth to items?
- [ ] Do all section IDs remain mounted in the DOM regardless of active mode?
- [ ] Do inactive sections hide cleanly without altering the CSS Grid layout of active sections?
- [ ] Does `@media print` unroll all sections with `display: revert !important`?
- [ ] Does the URL parameter parser follow the strict precedence ladder?
