# SPEC-ARCH-MUTABLE-TABLE-001: Mutable Table Dual-Mode Card/Table Reflow & Multi-Viewport Architecture

<details>
<summary>🔑 FKL Item Header (FKL-DI-022)</summary>

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

**Specification Reference:** `SPEC-ARCH-MUTABLE-TABLE-001`  
**Governing Decisions:** `AC-DEC-2026-034` / `UI-DEC-2026-030` (`P-MULTI-VIEWPORT-RESPONSIVE-001`)  
**Standard References:**  
- `STD-MOD-COMP-001` (Modular Component Architecture & SDCA Structure)  
- `INV-SDCA-004` (SDCA At-Rule Compiler Scoping Invariant)  
- `INV-LIFECYCLE-03` (3-Trigger Modal/Drawer Dismissibility)  
- `FKL-DI-022` (Mutable Table Dual-Mode Card/Table Reflow with Frozen Column)  
**Version:** `1.0.0` (Production Baseline)  

---

## 1. Architectural Problem & Domain Requirements

High-density collaborative operational interfaces—such as the **Bhubaneswar Shopping Registry** (`#shoppingRegistryFrame`), **Master Decision Registry** (`#decisionRegistryFrame`), and **Decorator Cockpit** (`#cockpitFrame`)—present severe responsiveness paradoxes:

1. **Cell Mutability vs Horizontal Scrolling**:
   Traditional responsive tables wrap table markup in `overflow-x: auto`. On small mobile viewports ($\le 480\text{px}$), horizontal scroll forces users to pan sideways repeatedly to edit quantities, notes, vendor prices, and status selectors. This produces high operational friction and frequent mis-taps.
2. **Identifier Loss During Scroll**:
   When scrolling horizontally, row headers (Item Code, Title) scroll out of view, detaching data inputs from the item identity.
3. **Container Query Mangling in SDCA Compilers (`INV-SDCA-004`)**:
   SDCA build scripts (`build.cjs`) compile standalone HTML pages and fragment HTML files by pre-scoping CSS partials using a parent selector prefix (e.g. `#shoppingRegistryFrame`). When CSS introduces `@container` rules, naive compilers checking only `trimmed.startsWith('@media')` treat `@container` as a regular CSS selector and prepend the parent ID (e.g. `#shoppingRegistryFrame @container (...)`), producing invalid CSS syntax that fails to parse in modern browsers.
4. **Header Saturation on Compact Displays**:
   Dense header shells with multiple quick-action buttons, search fields, and status indicators wrap into multiple chaotic vertical lines on ultra-compact mobile screens ($300\text{px}$–$360\text{px}$).

---

## 2. Invariant Specifications

### 2.1 Invariant FKL-DI-022: Mutable Table Dual-Mode Card/Table Reflow
Tables supporting interactive editing (`input`, `select`, `textarea`) MUST implement a dual presentation state based on container width:

```css
/* Desktop & Laptop Viewports (> 768px): Traditional Grid Table */
.data-table-container {
  overflow-x: auto;
  position: relative;
}
.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.data-table th.sticky-col,
.data-table td.sticky-col {
  position: sticky;
  left: 0;
  z-index: 2;
  background: var(--bg-card);
}
.data-table th.sticky-col {
  z-index: 6; /* Intersecting header + sticky col must be higher */
}

/* Mobile & Small Tablet Viewports (<= 768px): Reflowed Card Pods */
@media (max-width: 768px) {
  .data-table thead {
    display: none; /* Hide tabular header */
  }
  .data-table,
  .data-table tbody,
  .data-table tr,
  .data-table td {
    display: block;
    width: 100% !important;
  }
  .data-table tr {
    margin-bottom: 12px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 10px 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  .data-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    border: none;
    border-bottom: 1px dashed var(--border-color-subtle);
  }
  .data-table td:last-child {
    border-bottom: none;
  }
  .data-table td::before {
    content: attr(data-col-label);
    font-weight: 600;
    font-size: 0.8rem;
    color: var(--text-muted);
    margin-right: 12px;
    flex-shrink: 0;
  }
  .data-table td .cell-input,
  .data-table td .cell-select {
    width: 60%;
    min-height: 36px;
  }
}
```

### 2.2 Invariant FKL-AL-006 / INV-SDCA-004: At-Rule Compiler Scoping
SDCA build compilers that parse modular CSS partials to generate scoped fragment bundles MUST match all CSS at-rules using the regular expression:
```javascript
const atRuleRegex = /^@(media|container|supports|layer)[^{]*\{/;
```
Any at-rule matched by this pattern MUST preserve the at-rule signature verbatim at the root of the stylesheet, recursively scoping only the selectors contained *inside* the block.

### 2.3 Invariant FKL-WI-004: Header Saturation Gate & Popover Fallback
At viewports $\le 360\text{px}$, sticky headers (`#stickyHeaderShell`) must not exceed a single horizontal row ($48\text{px}$–$56\text{px}$). Secondary and tertiary actions must be grouped into a single `[⚡ Actions ▾]` popover button with:
1. `min-height: 44px` touch target compliance (WCAG 2.5.8).
2. 3-Trigger dismissibility: (a) Button toggle, (b) Outside click / backdrop, (c) `Escape` keydown (`INV-LIFECYCLE-03`).

---

## 3. Verification & Parity Matrix

All implementations of `SPEC-ARCH-MUTABLE-TABLE-001` must pass automated validation across 5 standard viewport test points:

| Viewport Category | Width | Layout Mode | Verification Gate |
| :--- | :--- | :--- | :--- |
| **Desktop Ultra** | $1440\text{px}$ | 100% Fluid Grid Table, Sticky Headers, Frozen Col 1 | `npm run test:shopping` |
| **Laptop Standard** | $1024\text{px}$ | Grid Table, Horizontal Scroll with Sticky Left Col | `npm run test:shopping` |
| **Tablet Portrait** | $768\text{px}$ | Card Reflow Transition Point, Full-Width Inputs | `npm run verify:mobile` |
| **Mobile Standard** | $480\text{px}$ | Single Column Cards, Auto-fit Images, 44px Targets | `npm run verify:mobile` |
| **Ultra-Compact** | $320\text{px}$ | Header Quick-Actions Popover, 0 Horizontal Bleed | `npm run verify:mobile` |
