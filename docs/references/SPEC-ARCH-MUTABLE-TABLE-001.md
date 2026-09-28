# SPEC-ARCH-MUTABLE-TABLE-001: Mutable Table Pure Tabular Architecture, Frozen Column & Cross-Surface Navigation

<details>
<summary>🔑 FKL Item Header (FKL-DI-022 — SUPERSEDED)</summary>

```yaml
---
fkl_id: FKL-DI-022
fkl_type: DesignInvariant
source:
  - docs/incidents/INC-093-sdca-compiler-regex-container-query-mangling.md
  - WT-02
  - WT-06
promoted_from: ""
applies_to:
  - MutableTable
  - ShoppingRegistry
workflow_activation:
  - WT-02
  - WT-06
promotion_status: Superseded
superseded_by: FKL-DI-025
content_ref: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-DI-025)</summary>

```yaml
---
fkl_id: FKL-DI-025
fkl_type: DesignInvariant
source:
  - docs/incidents/INC-100-mutable-table-cards-mode-degradation-and-cross-domain-conflation.md
  - Directive 2.2 / SK-021
  - WT-02
  - WT-06
promoted_from: ""
applies_to:
  - MutableTable
  - ShoppingRegistry
  - DecisionRegistry
  - DecoratorCockpit
workflow_activation:
  - WT-02
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-AL-006)</summary>

```yaml
---
fkl_id: FKL-AL-006
fkl_type: ArchitecturalLearning
source:
  - docs/incidents/INC-093-sdca-compiler-regex-container-query-mangling.md
  - INV-SDCA-004
promoted_from: ""
applies_to:
  - SDCABuilder
  - ScopedCssCompiler
workflow_activation:
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-AL-009)</summary>

```yaml
---
fkl_id: FKL-AL-009
fkl_type: ArchitecturalLearning
source:
  - docs/incidents/INC-100-mutable-table-cards-mode-degradation-and-cross-domain-conflation.md
  - Directive 2.2 / SK-021
promoted_from: ""
applies_to:
  - MutableTable
  - ResponsiveDesign
workflow_activation:
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-WI-004)</summary>

```yaml
---
fkl_id: FKL-WI-004
fkl_type: WorkflowImprovement
source:
  - .agent/skills/parent-layout-audit/SKILL.md
  - SK-005
promoted_from: ""
applies_to:
  - StickyHeaderShell
  - ActionToolbar
workflow_activation:
  - WT-02
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-WI-006)</summary>

```yaml
---
fkl_id: FKL-WI-006
fkl_type: WorkflowImprovement
source:
  - docs/incidents/INC-100-mutable-table-cards-mode-degradation-and-cross-domain-conflation.md
  - Directive 2.2 / SK-021
promoted_from: ""
applies_to:
  - MutableTable
  - CatalogShowroom
  - CrossSurfaceNavigation
workflow_activation:
  - WT-02
  - WT-06
promotion_status: Active
 superseded_by: ""
content_ref: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-DI-027)</summary>

```yaml
---
fkl_id: FKL-DI-027
fkl_type: DesignInvariant
source:
  - docs/incidents/INC-102-table-cell-display-model-override-and-asymmetric-slack-absorption.md
  - SK-029
  - AC-DEC-2026-071
promoted_from: ""
applies_to:
  - MutableTable
  - ObligationsTable
  - DataTableLayout
workflow_activation:
  - WT-02
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-AL-011)</summary>

```yaml
---
fkl_id: FKL-AL-011
fkl_type: ArchitecturalLearning
source:
  - docs/incidents/INC-102-table-cell-display-model-override-and-asymmetric-slack-absorption.md
  - SK-029
  - AC-DEC-2026-071
promoted_from: ""
applies_to:
  - MutableTable
  - TableLayoutAlgorithm
  - SlackDistribution
workflow_activation:
  - WT-02
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-WI-008)</summary>

```yaml
---
fkl_id: FKL-WI-008
fkl_type: WorkflowImprovement
source:
  - docs/incidents/INC-102-table-cell-display-model-override-and-asymmetric-slack-absorption.md
  - SK-029
  - AC-DEC-2026-071
promoted_from: ""
applies_to:
  - MutableTable
  - PrintRunSheet
  - DensityGate
workflow_activation:
  - WT-02
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
---
```
</details>

**Specification Reference:** `SPEC-ARCH-MUTABLE-TABLE-001`  
**Governing Decisions:** `AC-DEC-2026-034` / `UI-DEC-2026-030` (`P-MULTI-VIEWPORT-RESPONSIVE-001`), `Directive 2.2 / SK-021` (`P-TABLE-DOMAIN-SEPARATION-001`), `AC-DEC-2026-071` / `UI-DEC-2026-053` (`STD-TABLE-BUDGET-001` / `INV-TABLE-DOM-001` / `SK-029`)  
**Standard References:**  
- `STD-MOD-COMP-001` (Modular Component Architecture & SDCA Structure)  
- `STD-TABLE-BUDGET-001` (Proportional Fixed Column Budgeting)  
- `INV-TABLE-DOM-001` (Table-Cell Display Model Isolation)  
- `INV-COLLAPSIBLE-PRINT-001` (Zero-Truncation Print Unrolling)  
- `INV-SDCA-004` (SDCA At-Rule Compiler Scoping Invariant)  
- `INV-LIFECYCLE-03` (3-Trigger Modal/Drawer Dismissibility)  
- `FKL-DI-025` (Clean Domain Separation & Pure Tabular Responsive Architecture)  
- `FKL-DI-027` (Table-Cell Display Model Isolation & Proportional Budgeting)  
- `FKL-AL-009` (Anti-Pattern of Pseudo-Element Table Column Collapses)  
- `FKL-AL-011` (Table Layout Algorithm Slack Absorption & Display Model Conflation)  
- `FKL-WI-006` (Cross-Surface Bi-Directional Quick-Handoff Protocol)  
- `FKL-WI-008` (Inner Clamp Container Decoupling & Print Unrolling Contract)  
- Pattern Contract: [.agent/patterns/table-domain-separation-and-mobile-scroll.md](../../.agent/patterns/table-domain-separation-and-mobile-scroll.md)  
- Pattern Contract: [.agent/patterns/table-cell-display-model-isolation-and-slack-budgeting.md](../../.agent/patterns/table-cell-display-model-isolation-and-slack-budgeting.md)  
**Version:** `2.0.0` (Production Ratified — Path A Clean Separation)  

---

## 1. Architectural Problem & Domain Boundaries

Operational wedding management interfaces—such as the **Bhubaneswar Shopping Registry** (`#shoppingRegistryFrame`), **Master Decision Registry** (`#decisionRegistryFrame`), and **Decorator Cockpit** (`#cockpitFrame`)—contain two distinct domains that must never be conflated:

1. **Decision & Curation Domain**: "What do we want?"
   - Explores candidate looks, multi-photo lightboxes, stakeholder consensus voting (Bride / Sisters / In-Laws), and Pinterest intake.
   - Requires rich visual cards, lookbook photography, and emotional deliberation.
2. **Procurement & Execution Domain**: "What are we doing about it?"
   - Tracks purchasing status (`Planned` $\to$ `Shortlisted` $\to$ `In Trial` $\to$ `Ordered` $\to$ `Purchased` $\to$ `Dropped`), actual price vs estimated budget, tailor specifications, store vendor attribution, and delivery.
   - Requires high-density spreadsheet grid layout for glanceability and batch accounting.

### Invariant: Domain vs Surface Boundary
> *A surface never becomes the owner of a fact because it displays or edits it.*
- **Catalog Surface** (`#catalogViewSection`): Strictly an exploratory showroom. It projects procurement data (e.g. status tags) but delegates execution commands to the Ledger.
- **Ledger Surface** (`#shoppingTableViewSection`): Strictly an execution spreadsheet. It projects approved design selections but delegates look curation to the Catalog.

---

## 2. Invariant Specifications

### 2.1 Invariant FKL-DI-025: Pure Tabular Responsive Architecture (Supersedes FKL-DI-022)
The experimental Cards mode (`.mode-cards`) in the Mutable Table is permanently retired. Tables supporting interactive editing MUST maintain tabular grid semantics across all viewports ($\le 320\text{px}$ to $\ge 1440\text{px}$) using a native horizontal touch-scrolling container with pinned left key columns:

```css
/* Container & Table Structure */
.shop-table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  position: relative;
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
}

.shop-data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 900px;
}

/* Sticky Frozen Left Key Column */
.shop-data-table td.sticky-col {
  position: sticky;
  left: 0;
  z-index: 2;
  background: rgba(15, 23, 42, 0.96);
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.25);
}

.shop-data-table th.sticky-col {
  position: sticky;
  left: 0;
  top: 0;
  z-index: 6;
  background: rgba(26, 36, 54, 0.98);
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.35);
}

/* Mobile Touch Optimization (<= 768px) */
@media (max-width: 768px) {
  .status-dropdown,
  .table-price-input,
  .table-notes-input {
    min-height: 44px;
    font-size: 0.85rem;
  }
  .cell-action-btn {
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }
  .cell-actions {
    gap: 8px;
  }
}
```

### 2.2 Invariant FKL-AL-009: Anti-Pattern of Pseudo-Element Table Column Collapses
Collapsing data table rows into card blocks using `display: block` and `td::before { content: attr(data-col-label); }` is an anti-pattern in high-density operational software. It strips table column headers, breaks spreadsheet glanceability, creates unformatted wireframe blocks, and causes cross-domain confusion without providing genuine visual lookbook capabilities.

### 2.3 Invariant FKL-WI-006: Cross-Surface Bi-Directional Quick-Handoff Protocol
Instead of duplicating features between Catalog and Ledger, paired surfaces must implement 1-tap cross-navigation in $\le 2$ interactions:
1. **Ledger $\to$ Catalog (`window.jumpToCatalogItem(itemId)`)**:
   Switches view to `catalog`, clears search filters, centers `#card-${itemId}`, and applies a 3-second gold glow pulse (`.highlight-target-item`).
2. **Catalog $\to$ Ledger (`window.jumpToLedgerItem(itemId)`)**:
   Switches view to `table`, calls `window.resetTableFilters()` to uncollapse groups and clear filters, centers `tr[data-item-id="${itemId}"]`, and applies a 3-second update pulse (`.row-pulse`).

### 2.4 Invariant FKL-AL-006 / INV-SDCA-004: At-Rule Compiler Scoping
SDCA build compilers that parse modular CSS partials to generate scoped fragment bundles MUST match all CSS at-rules using:
```javascript
const atRuleRegex = /^@(media|container|supports|layer)[^{]*\{/;
```
Any at-rule matched by this pattern MUST preserve the signature at the root of the stylesheet, recursively scoping only selectors inside the block.

### 2.5 Invariant FKL-WI-004: Header Saturation Gate & Popover Fallback
At viewports $\le 360\text{px}$, sticky headers (`#stickyHeaderShell`) must not exceed a single horizontal row ($48\text{px}$–$56\text{px}$). Secondary and tertiary actions must collapse into a single touch-compliant popover with 3-trigger dismissibility (`INV-LIFECYCLE-03`).

### 2.6 Invariant FKL-DI-027: Table-Cell Display Model Isolation & Proportional Budgeting (`INV-TABLE-DOM-001` / `STD-TABLE-BUDGET-001`)
In all HTML data tables, table cells (`<td>`, `<th>`) must maintain their native `display: table-cell` display model. Under no circumstances may `display: -webkit-box`, `display: flex`, or `display: grid` be applied directly to a `<td>` or `<th>`. Text clamping, flex alignments, or badge grouping must always be encapsulated inside a dedicated child container (`<div class="*-clamp">` or `<div class="*-inner">`). Tables with multiple descriptive columns must declare `table-layout: fixed; width: 100%;` with explicit percentage budgeting (e.g. 30% Title / 25% Specs) to prevent single-column slack absorption.

### 2.7 Invariant FKL-AL-011: Table Layout Algorithm Slack Absorption & Display Model Conflation
Under default W3C `table-layout: auto`, browsers distribute all excess table container width ("slack") exclusively to columns with unconstrained `<td>` cells, while cells with explicit pixel widths or overridden display models remain starved. When `display: -webkit-box` is placed directly on a `<td>`, Blink/Chromium treats the cell as a rigid box locked to its declared width, starving it from slack expansion and causing premature 3-line truncation with ellipses even when hundreds of pixels of blank whitespace sit unused across widescreen viewports.

### 2.8 Invariant FKL-WI-008: Inner Clamp Container Decoupling & Print Unrolling Contract (`INV-COLLAPSIBLE-PRINT-001`)
All inner clamp containers (`.obl-specs-clamp`) must unconditionally unclamp in print media (`-webkit-line-clamp: unset !important; overflow: visible !important; height: auto !important; max-height: none !important;`) per `INV-COLLAPSIBLE-PRINT-001`. This guarantees that high-density paper run sheets printed for elders and coordinators display 100% of customary and liturgical specifications without ellipsis cutoffs.

---

## 3. Verification & Parity Matrix

All implementations of `SPEC-ARCH-MUTABLE-TABLE-001` must pass automated validation across 5 standard viewport test points:

| Viewport Category | Width | Layout Mode | Verification Gate |
| :--- | :--- | :--- | :--- |
| **Desktop Ultra** | $1440\text{px}$ | 100% Fluid Grid Table, Sticky Headers, Frozen Col 1 | `npm run test:shopping` |
| **Laptop Standard** | $1024\text{px}$ | Grid Table, Horizontal Scroll with Sticky Left Col | `npm run test:shopping` |
| **Tablet Portrait** | $768\text{px}$ | Pure Grid Table, Horizontal Scroll, 44px Touch Targets | `npm run test:shopping` |
| **Mobile Standard** | $480\text{px}$ | Pure Grid Table, Pinned Identity Col, 44px Targets | `npm run test:shopping` |
| **Ultra-Compact** | $320\text{px}$ | Pure Grid Table, Pinned Col, Header Popover | `npm run test:shopping` |
