# Architecture & UI Council Deliberation: Universal Column Visibility & Print Data Masking Engine

> **Document ID**: `User_Created/Discussion Threads/Council/260928_arch_council_column_selection_and_print_data_masking.md`  
> **Session Date**: 2026-09-28  
> **Council Ruling**: `AC-DEC-2026-076` / `UI-DEC-2026-056` (FULL COUNCIL CERTIFIED)  
> **Enhancement Ticket**: `SK-033` (Target Release: `v2.10.0`)  
> **Related Tickets**: `SK-032` (Smart Cohesive Page Breaks), `SK-031` (Print Themes), `SK-029` (Table Budgeting), `SK-025` (Accordions)  
> **Governing Standards**: `STD-TABLE-COL-VIS-001` / `INV-TABLE-COL-MASK-001` / `STD-COUNCIL-DUAL-GATE-001` / `STD-UI-INTERACTION-SPEC-001` / `STD-MOD-COMP-001`  

---

## 1. Executive Summary & Problem Intake

### 1.1 The User Request
During the review of the Smart Cohesive Page-Break Orchestration (`SK-032`), the user posed a critical operational question:
> *"Can we also select columns checkbox so that we can customise what to print and what not to ?? as per requirement, check if that should be scope into the same enhancement or a separate one"*

### 1.2 Core Domain Invariant & Failure Mode
When generating physical run sheets for wedding logistics, different stakeholders require distinct projections of the same table:
1. **Family Elders & Officiants**: Need ritual titles, parties, and samagri items, but are distracted or burdened by commercial SKU references (`trs`) and financial budget estimates (`cost`).
2. **Vendors & Caterers**: Need item specifications, quantities, and verification check-boxes, but must **never** be exposed to confidential family budget allocations, private cash shagun formulas, or sensitive inter-family relationship notes.
3. **Core Finance & Procurement Leads**: Need all 8 columns including estimated costs, actual expenditures, and cross-domain procurement IDs.

Without column selection checkboxes, coordinators must either print unredacted sensitive data or resort to manual physical marker blackouts.

---

## 2. Exhaustive Multi-Option Evaluation & Scoping Analysis

The Council evaluated three distinct architectural configurations:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ARCHITECTURAL OPTIONS COMPARISON                                       │
├───────────────────────────────┬───────────────────────────────┬────────────────────────────────────────┤
│ Option A: Monolithic SK-032   │ Option B: Quick Print Stripper│ Option C: Decoupled SK-033 (Hybrid)    │
│ Bundle into SK-032 (5-6 Ph)   │ Hardcoded iframe DOM filter   │ Dedicated Universal Engine (STD-001)   │
├───────────────────────────────┼───────────────────────────────┼────────────────────────────────────────┤
│ ❌ Breaches 500-line limit     │ ❌ Fragile column indexes      │ ✅ Strict modularity (<500 lines)      │
│ ❌ Delays page-break delivery  │ ❌ Broken table border widths  │ ✅ Clean separation: Y-axis vs X-axis   │
│ ❌ Conflates Y vs X axes      │ ❌ No screen table reuse      │ ✅ Reusable across all repos           │
│ ⚠️ High blast radius          │ ⚠️ High maintenance debt      │ ✅ Role presets (Elder/Vendor/Full)    │
└───────────────────────────────┴───────────────────────────────┴────────────────────────────────────────┘
```

### Option A: Monolithic Bundling into SK-032
- **Description**: Add column checkboxes to `print_options_modal.html` and column filtering logic directly to `print_engine.js` within `SK-032`.
- **Fatal Defect 1 (Modular Line Limit Breach)**: `ui_primitives/scripts/print_engine.js` is currently **463 lines**. Adding column registries, checkbox rendering, DOM column stripping, and width re-calculation will push it past 600 lines, violating `STD-MOD-COMP-001` (500-line hard limit).
- **Fatal Defect 2 (Architectural Domain Conflation)**: `SK-032` governs **Vertical Pagination Geometry** (Y-axis: page breaks, block cohesion, orphan prevention). Column customization governs **Horizontal Data Projection** (X-axis: schema filtering, sensitive data masking, column width re-budgeting). Conflating them creates a monolithic regression magnet.
- **Fatal Defect 3 (Release Pipeline Delay)**: Invalidates the already-approved `SK-032` implementation plan and delays releasing the critical cohesive page-break fix.

### Option B: Ad-Hoc Screen-Ignorant DOM Stripping
- **Description**: Hardcode arbitrary `nth-child` column removals inside `print_engine.js` based on indices.
- **Fatal Defect 1 (Table Budget Collapse)**: Per `STD-TABLE-BUDGET-001` (`SK-029`), table columns declare explicit percentage widths (`table-layout: fixed`). If columns are stripped naively via `display: none` without proportional re-budgeting, remaining columns do not fill the 100% table width, causing ugly right-side voids or misaligned header borders.
- **Fatal Defect 2 (Schema Fragility)**: If column order changes or a new column is added to the table, hardcoded numeric index stripping silently drops the wrong data.

### Option C (Approved Hybrid Architecture): Decoupled Universal Column Visibility Engine (`SK-033`)
- **Description**: Maintain `SK-032` strictly focused on **Vertical Cohesive Page Breaks** (v2.9.9). Immediately scaffold `SK-033: Universal Column Visibility & Print Data Masking Engine` (v2.10.0) under `STD-TABLE-COL-VIS-001` / `INV-TABLE-COL-MASK-001`.
- **Separation of Concerns**:
  - `SK-032` (v2.9.9): Vertical page-break flow (`cohesive`, `fluid`, `milestones`).
  - `SK-033` (v2.10.0): Horizontal data projection, column checkboxes, role-based presets, and dynamic table budget re-allocation.
- **Modular Packaging**: Author a standalone zero-dependency primitive `ui_primitives/scripts/column_visibility_engine.js` (<300 lines) that handles column state, masking, and width re-budgeting for both screen tables and the print sandbox.

---

## 3. Independent Council Member Assessments

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
> **Position: Strongly Support Separation into SK-033.**  
> "Bundling horizontal schema masking into a vertical pagination ticket violates `P-SSOT-DOCS` and will bloat `print_engine.js`. `SK-032` has clear binary gates ready for immediate execution. Scoping column customization into `SK-033` creates clean traceability from `OBL-###` customary data to stakeholder-specific run sheets."

### 3.2 Maintainability & Velocity Auditor (`ponytail` / P11)
> **Position: VETO Option A (Monolithic Bloat); Approve Option C.**  
> "`print_engine.js` has exactly **37 lines of headroom** before hitting the 500-line ceiling (`STD-MOD-COMP-001`). Forcing column selection logic into that file will trigger an instant build failure or force ugly code-golfing hacks. A decoupled helper primitive `column_visibility_engine.js` honors the Unix philosophy: do one thing and do it well."

### 3.3 Information Density & Math Auditor (`parent-layout-audit` / `STD-TABLE-BUDGET-001`)
> **Position: Approve Option C with Dynamic Proportional Width Re-Budgeting Contract.**  
> "Under `STD-TABLE-BUDGET-001`, obligations tables allocate 100% width across 8 columns (Code: 7.5%, Dir: 11.5%, Title: 29%, Cat: 8.5%, Specs: 25%, Cost: 7.5%, TRS: 7.5%, Verif: 3.5%). When Cost (7.5%) and TRS (7.5%) are masked, the remaining 85% must be proportionally normalized back to 100% (Title expands from 29% to ~34.1%, Specs expands from 25% to ~29.4%). `SK-033` must implement this proportional redistribution algorithm to guarantee ink-friendly full-width tables."

### 3.4 Craft & Visual Polish Auditor (`impeccable` / `ui-ux-pro-max`)
> **Position: Approve Option C with 1-Click Role Presets.**  
> "Manual multi-checkbox toggling is tedious for an elder or coordinator on a tablet. In addition to individual column checkboxes, the modal MUST offer 1-click **Audience Presets**:
> 1. `[🏛️ Full Operational]` (All columns)
> 2. `[👴 Elder / Ritual Run Sheet]` (Masks Costs & Procurement IDs; highlights Title, Specs & Verif)
> 3. `[🚚 Logistics / Vendor Handover]` (Masks Financials & Private Relationship directions)
> This transforms a raw technical checkbox grid into an intuitive, human-centered briefing tool."

### 3.5 Design System Integrity Auditor (`STD-UI-PRIMITIVE-002`)
> **Position: Approve Option C.**  
> "Checkboxes and preset pill buttons must adhere to universal tokens (`--shop-gold`, `--shop-radius-sm`, minimum 44px touch targets). Zero naked inputs."

---

## 4. Reality-First Grounding Policy Audit (`RFG-001`)

1. **Maturity Anchor**: Grounded strictly in the existing DOM structure of `#obligationsTableContent` (`.obl-data-table`) and `skPrintContainer` iframe sandbox. Zero speculative dependencies.
2. **Burden of Proof**: The 500-line modular limit is an immutable codebase gate. Proving that `print_engine.js` has only 37 lines left proves definitively that Option A cannot be accepted without refactoring.
3. **Recommendation Classification**:
   - **Required-Now**: Deliver `SK-032` (Cohesive Page Breaks) immediately without delay. Scaffold `SK-033` (Column Visibility Engine) as the direct next sequential enhancement.

---

## 5. Architectural Decision & Formal Ruling

### Certification: `AC-DEC-2026-076` / `UI-DEC-2026-056`
The joint Architecture & UI Council hereby certifies:
1. **Scope Decoupling**: Column selection is formally **decoupled** from `SK-032` and assigned to dedicated ticket **`SK-033`** (`Universal Column Visibility & Print Data Masking Engine`).
2. **Universal Standard (`STD-TABLE-COL-VIS-001`)**: Column visibility shall be governed by an agnostic column registration contract (`data-col-key`), supporting column toggling, role-based presets, and proportional width re-budgeting.
3. **Data Masking Invariant (`INV-TABLE-COL-MASK-001`)**: Masked columns must be completely omitted from the sandboxed print DOM tree (not merely styled with CSS `visibility: hidden`), guaranteeing confidential financial and relationship data cannot leak into printed documents.
4. **Execution Sequence**:
   - **Step 1**: Execute and release `SK-032` (v2.9.9) for cohesive page-break orchestration.
   - **Step 2**: Immediately execute `SK-033` (v2.10.0) for universal column visibility and data masking.

---

## 6. Phased Definition of Done (DoD v1.7) for SK-033

| Phase | Scope & Deliverables | Validation Gate (VG) | Decision Node (DN) |
|---|---|---|---|
| **Phase 1: Core Column Visibility Engine & Contract Test Harness** | Scaffold `ui_primitives/scripts/column_visibility_engine.js` with column registration, state management, and proportional width re-budgeting; author `scripts/test-column-visibility-contract.cjs`. | **VG-1**: Contract test passes 100% green; width normalization sums to 100%; modular limit <500 lines. | **DN-1**: Verify mathematical stability of column width redistribution. |
| **Phase 2: Pre-Print Options Dialog Integration & Role Presets** | Add "Columns & Privacy Masking" section to `print_options_modal.html`; implement 3 audience presets (`Full`, `Elder`, `Vendor`); wire bidirectional sync with `print_engine.js`. | **VG-2**: Headless test verifying checked/unchecked columns correctly omit DOM elements in `skPrintContainer` sandbox. | **DN-2**: Verify touch target compliance (>=44px) and 3-trigger dismissibility. |
| **Phase 3: Interactive Screen Table Toolbar Integration** | Expose optional `[👁️ Columns]` toggle dropdown on high-density table toolbars (`#oblTableInnerToolbar`); wire `localStorage` column persistence. | **VG-3**: Screen table dynamically hides/shows columns without page reload; accordion tables remain cohesive. | **DN-3**: Confirm mobile table scroll container maintains `min-width` integrity. |
| **Phase 4: SDCA Compilation, Byte Parity & Cross-Repo Packaging** | Recompile all SDCA surfaces via `build.cjs`; assert 100% byte parity to `/public`; package as `PKG-010` for ecosystem distribution via `/sap-sync`. | **VG-4**: 100% dual-release byte parity; all 69 modular checks green; exit code 0 across all verification suites. | **DN-4**: Formal release readiness sign-off for v2.10.0. |
