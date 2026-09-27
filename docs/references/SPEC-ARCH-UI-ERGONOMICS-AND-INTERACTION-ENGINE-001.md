# SPEC-ARCH-UI-ERGONOMICS-AND-INTERACTION-ENGINE-001: Universal UI/UX Interaction Engine, Dual-Council Gate & Collapsible Progressive Disclosure Architecture

<details>
<summary>🔑 FKL Item Header (FKL-DI-026)</summary>

```yaml
fkl_version: 1.0.0
fkl_id: FKL-DI-026
type: Design Invariant
title: Dual-Surface Media Isolation & Accordion Print-Force-Unroll Contract
description: >
  Interactive screen view states (e.g. collapsed accordions, hidden tabs, compact viewports)
  must NEVER conceal data when printed or exported. In @media print and container-scoped print
  streams (window.skPrintContainer), all collapsible table containers must unconditionally force-unroll
  (display: table !important; height: auto !important; opacity: 1 !important).
governing_standard: STD-UI-ACCORDION-001 / INV-COLLAPSIBLE-PRINT-001
governing_ticket: SK-025 / SK-022
council_decision: AC-DEC-2026-067 / UI-DEC-2026-051
affected_surfaces:
  - shopping_src/styles/11_obligations_table_and_print.css
  - ui_primitives/scripts/print_engine.js
  - public/css/main.css
discovered_date: 2026-09-27
status: Active
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-AL-010)</summary>

```yaml
fkl_version: 1.0.0
fkl_id: FKL-AL-010
type: Architectural Learning
title: Print-First Mental Model Conflation & Static Viewport Anti-Pattern
description: >
  Transposing the mental model of a physical paper run sheet directly into interactive web views
  results in inert, static data dumps that inflict cognitive overload on users. Interactive screen ergonomics
  (progressive disclosure, column sorting, category facet filtering, hover tooltips, and localStorage memory)
  must be architecturally decoupled from print fidelity.
governing_standard: STD-UI-INTERACTION-SPEC-001 / STD-UI-ACCORDION-001
governing_ticket: SK-025 / SK-026
council_decision: AC-DEC-2026-067 / AC-DEC-2026-068
affected_surfaces:
  - shopping_src/scripts/controller.js
  - shopping_src/components/obligations_view.html
discovered_date: 2026-09-27
status: Active
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-WI-007)</summary>

```yaml
fkl_version: 1.0.0
fkl_id: FKL-WI-007
type: Workflow Improvement
title: Mandatory Dual-Council Pre-Planning Protocol & 7-Domain UI/UX Interaction Specification Engine
description: >
  Technical planning engines that only check TDD tests and file sizes leave a massive UI/UX blind spot,
  causing repetitive post-implementation churn (missing table sorting/filters, image carousels, zoom/pan,
  modal keyboard dismiss, mobile touch targets). Any plan touching user interfaces must pass BOTH Architecture
  and UI Councils and explicitly define contracts across all 7 interaction domains before code execution.
governing_standard: STD-COUNCIL-DUAL-GATE-001 / STD-UI-INTERACTION-SPEC-001 / PKG-009
governing_ticket: SK-026
council_decision: AC-DEC-2026-068 / UI-DEC-2026-052
affected_surfaces:
  - .agent/skills/writing-plans/SKILL.md
  - .claude/skills/writing-plans/SKILL.md
  - .agent/workflows/plan.md
discovered_date: 2026-09-27
status: Active
```
</details>

---

## 1. Problem Statement & Reality-First Evidence

When implementing the high-density family obligations table (`#obligationsTableContent`), the feature was built flat to ensure printability on physical A4 paper. Because paper cannot be clicked, the developer omitted all interactive affordances on screen. 

When loaded in the browser, 49 obligations across 7 milestones unrolled simultaneously, forcing coordinators to scroll past 15 rows of engagement gifts to view wedding day tasks (`EVT-004`). 

Furthermore, root cause analysis revealed that our planning engine (`writing-plans/SKILL.md`) had no gate requiring interaction specifications before code was generated, creating a chronic cycle of post-implementation rework across data tables, lightboxes, modals, and mobile touch surfaces.

---

## 2. Invariant Specifications

### 2.1 Invariant FKL-DI-026: Dual-Surface Media Isolation & Forced Print Unrolling (`INV-COLLAPSIBLE-PRINT-001`)
1. **Interactive Screen View**:
   - Each grouped table section must be wrapped in `.obl-table-milestone-block` with `data-milestone-id`.
   - Headers must feature tactile feedback: `cursor: pointer`, smooth background transition on hover, and an animated chevron (`.obl-milestone-chevron`) rotating from `0deg` (expanded `▼`) to `-90deg` (collapsed `▶`).
   - Clicking toggles `.is-collapsed` on the parent block and updates `aria-expanded` attributes.
   - User expansion/collapse choices must persist in `localStorage` under `sk_obl_accordion_state`.
   - Toolbar must provide bulk `[▼ Expand All]` and `[▶ Collapse All]` controls.
2. **Print Media Isolation**:
   ```css
   @media print {
     .obl-table-milestone-block.is-collapsed .obl-data-table {
       display: table !important;
     }
     .obl-milestone-chevron,
     .obl-accordion-controls {
       display: none !important;
     }
   }
   ```
   Physical paper and PDF prints must unconditionally force-unroll every table row, guaranteeing zero truncated data.

### 2.2 Invariant FKL-AL-010: Decoupling Screen Ergonomics from Print Fidelity
- Viewport interaction and print fidelity serve distinct personas:
  - **Screen Persona (Coordinator / Host)**: Needs rapid navigation, scannability, search filtering, column sorting, and progressive disclosure to prevent cognitive fatigue.
  - **Print Persona (Elders / Day-of Logistics)**: Needs high-density, ink-friendly, complete physical dossiers with signature lines and zero hidden elements.
- Codebases must never sacrifice screen ergonomics to achieve print fidelity, or vice-versa.

### 2.3 Invariant FKL-WI-007: Mandatory Dual-Council Pre-Planning Gate (`STD-COUNCIL-DUAL-GATE-001`)
- All implementation plans touching user interfaces must satisfy both:
  1. **Architecture Council**: Data schemas, API boundaries, state machines, and file modularity (<500 lines).
  2. **UI Council (Impeccable & UI-UX Pro-Max)**: Craft, typography, scannability, touch targets (min 44px), and keyboard accessibility.
- All plans must address the **Universal 7-Domain UI/UX Interaction Specification Matrix (`STD-UI-INTERACTION-SPEC-001`)** prior to plan approval.
