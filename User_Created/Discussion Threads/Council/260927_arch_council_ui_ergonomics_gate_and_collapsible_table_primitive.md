# 🏛️ Architecture & UI Council Decision Record: Universal UI Interaction Ergonomics Pre-Flight Gate & Reusable Collapsible Table Accordion Primitive

**Council Reference:** `AC-DEC-2026-067` / `UI-DEC-2026-051`  
**Standards Activated:** `STD-UI-ERGONOMICS-GATE-001` / `STD-UI-ACCORDION-001` / `INV-COLLAPSIBLE-PRINT-001` / `PKG-008`  
**Governing Ticket:** `SK-025` ([`enhancement-notes/SK-025/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-025/00_ENHANCEMENT_INDEX.md))  
**Date:** 2026-09-27  
**Type:** Joint Architecture & UI Council Deliberation  
**Status:** ✅ **APPROVED & CERTIFIED**  
**Quorum:** Joint Council (5 Core Auditors Seated)  
**Governing Workflows:** `.agent/workflows/architecture-council.md` (SOP-WFL-ARCH-COUNCIL-001), `.agent/workflows/ui-council.md` (SOP-WFL-UI-COUNCIL-001), and `.agent/workflows/plan-review.md`

---

## 1. Ground Truth & Root Cause Analysis (RCA)

### 1.1 The Specific Target: `document.querySelector("#obligationsTableContent > div:nth-child(1)")`
- **Current DOM Node**: `<div class="obl-table-milestone-block">` containing `<div class="obl-table-milestone-header">` and a sibling `<table class="obl-data-table">`.
- **Observed Defect**: The milestone header (`EVT-001: Nirbandha & Ashirbad (ନିର୍ବନ୍ଧ ଓ ଆଶୀର୍ବାଦ)`) is rendered as a static, inert `<div>` with no collapse/expand affordance, no chevron icon, and no toggle handler.
- **Immediate UX Friction**: When viewing the 49 customary family obligations across 7 milestones (`EVT-001` through `EVT-006` and `POST_WEDDING`), all 7 milestone tables are forced to display simultaneously. A user wishing to examine wedding day tasks (`EVT-004`) is forced to scroll past 15 rows of engagement obligations, creating cognitive overload and visual fatigue.

### 1.2 What Governed this Decision in `SK-022`?
- **Print Priority Bias**: Ticket `SK-022` was scaffolded under urgent demand for a printable tabular run sheet ("*cant i get just a tabular view of this printable format asap jsut this obligation??*").
- **Design Conflation**: Printable documents require tables to be flat, uninterrupted, and fully expanded (accordions on paper cut off data). The developer transposed the mental model of a paper run sheet directly into the interactive screen UI without decoupling viewport interaction state from print state.

### 1.3 Why Did Existing Skills and Councils Fail to Auto-Suggest Collapsible Headers?
1. **Advisory Isolation vs. Blocking Enforcement**:
   - Skills like `impeccable`, `ui-ux-pro-max`, `frontend-design`, and `ui-design-validator` possess rich heuristic catalogs for progressive disclosure and cognitive scannability.
   - However, in our agent orchestration layer, these skills are **passive, on-demand reference skills**. Unless a user or prompt explicitly triggers `/impeccable` or `/ui-council`, they remain silent during general execution.
2. **SDLC Planning Gate Blind Spot**:
   - In `.agent/workflows/plan.md` and `.agent/skills/writing-plans/SKILL.md`, pre-flight gates strictly check:
     - TDD test suites
     - File line count limits (<500 lines)
     - Zero naked buttons (`STD-UI-PRIMITIVE-002`)
     - Modal 3-trigger dismissibility (`STD-UI-LIFECYCLE-001`)
   - **Crucially Missing**: There was **zero check for Information Ergonomics / Cognitive Scannability** on data-heavy layouts. The pipeline validated *syntax*, *file modularity*, and *button tokens*, but completely ignored *interaction ergonomics*.
3. **The Repetitive Rework Cycle**:
   - Because no gate verified interactive affordances before coding, the agent delivered a raw minimum viable data dump. The user tested the app, felt the friction, and had to request the accordion in a follow-up prompt. This cycle of minor tweaks drains developer velocity.

---

## 2. Systematic Comparative Evaluation of Options

| Evaluation Dimension | Option A: Local Surgical Fix in Sree_Krushna Only | Option B: Passive Skill Guidance / Documentation Update | **Option C: Certified Hybrid — Systemic Pre-Flight Gate + Universal Collapsible Primitive + Local Upgrade (PKG-008)** |
| :--- | :--- | :--- | :--- |
| **Description** | Add an `onclick` toggle to `.obl-table-milestone-header` in `shopping_src/controller.js`. | Add recommendations to `impeccable` and `ui-ux-pro-max` advising developers to use accordions for grouped tables. | **1. Enforce a mandatory UI Interaction Ergonomics Pre-Flight Gate (`STD-UI-ERGONOMICS-GATE-001`) in `writing-plans`.<br>2. Build a zero-dependency reusable `collapsible_engine.js` primitive in `ui_primitives/`.<br>3. Upgrade `#obligationsTableContent` with chevron rotation, `localStorage` memory, and Expand/Collapse All.<br>4. Package as `PKG-008` and sync across all 10 repos.** |
| **Solves Immediate User Friction** | Yes (milestone headers become collapsible). | No (leaves current code unchanged). | **Yes (fully interactive milestone blocks with global toolbar controls).** |
| **Prevents Future UI Rework** | Zero (will happen again on the next table created). | Low (agents routinely miss passive advice unless forced). | **Complete (hard gate in planning engine prevents writing frontend code without interaction specs).** |
| **Print Safety (`@media print`)** | Fragile (ad-hoc CSS overrides needed). | None. | **Guaranteed (`INV-COLLAPSIBLE-PRINT-001` force-unrolls all accordions in print media).** |
| **Cross-Repo Reusability** | None (siloed in Sree_Krushna). | Partial (doc only). | **Maximum (deployed as `PKG-008` to Task-Dashboard and fanned out to all 10 repos via `/sap-sync`).** |
| **Architectural Complexity** | Very Low. | Negligible. | **Balanced & Highly Cohesive (zero external npm dependencies, <250 lines).** |

---

## 3. Multi-Disciplinary Council Deliberations

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: APPROVE Option C.
- **Evidence**: The repetitive rework cycle directly violates the 4-Phase Problem Solving Discipline (`4-PPSD`). Codifying `STD-UI-ERGONOMICS-GATE-001` into the canonical planning engine (`STD-PLANNING-ENGINE-001`) ensures that UI plans are audited before code is generated.

### 3.2 UI/UX Craft & Ergonomics Auditor (`impeccable` / `ui-ux-pro-max`)
- **Position**: APPROVE Option C.
- **Evidence**:
  - For grouped data exceeding 15 items across >2 categories, progressive disclosure via accordions is an ergonomic imperative.
  - The milestone headers must feature tactile feedback: rotating chevrons (`▼` expanded, `▶` collapsed), minimum 44px mobile touch target, smooth CSS max-height transitions, and global `[▼ Expand All]` / `[▶ Collapse All]` bulk actions.
  - Crucially, state must be saved to `localStorage` so refreshing or switching tabs does not reset the user's expanded sections.

### 3.3 Modularity & SDCA Auditor (`STD-MOD-COMP-001`)
- **Position**: APPROVE Option C.
- **Evidence**:
  - The accordion logic must not be inlined into monolithic templates.
  - It belongs in `ui_primitives/scripts/collapsible_engine.js` and `ui_primitives/styles/04_collapsible.css`, maintaining the strict `<500` line ceiling and 100% byte parity between root and `/public`.

### 3.4 Multi-Repo SAP Fan-Out Auditor (`sap-sync` / `Task-Dashboard`)
- **Position**: APPROVE Option C.
- **Evidence**:
  - Data grouping is a universal requirement across the ecosystem (e.g. `Task-Dashboard` task groupings, `Capsicum` menu categories, `Inventory_Mgmt` stock categories).
  - Packaging the primitive and gate as **`PKG-008`** ensures that all 10 repositories benefit immediately.

### 3.5 Maintainability & Velocity Auditor (Ponytail Dissenter)
- **Position**: CONDITIONAL APPROVAL.
- **Challenge**: "Why not use native HTML5 `<details>` and `<summary>` tags instead of custom JS?"
- **Resolution**:
  - While `<details>` works well for simple text, it suffers from severe styling, animation, and cross-browser grid/table reflow bugs when wrapping complex `<table>` elements with sticky headers.
  - A lightweight vanilla JS primitive (~120 lines) using `data-collapsible-group` attributes provides identical declarative simplicity, reliable CSS grid/table animations, and seamless `localStorage` persistence with zero third-party dependencies.

---

## 4. Council Synthesis & Certified Invariants

### Invariant 1: Mandatory UI Interaction Ergonomics Pre-Flight Gate (`STD-UI-ERGONOMICS-GATE-001`)
> Any implementation plan touching presentation-layer code (HTML/CSS/JS components) MUST include an explicit **Interaction & Ergonomics Checklist** prior to approval:
> 1. **Progressive Disclosure**: Are multi-group datasets (>15 items or >2 categories) equipped with collapsible group containers?
> 2. **Bulk Controls**: Does the interface provide global Expand All / Collapse All affordances?
> 3. **State Persistence**: Is interactive view state (open/closed sections, active tabs, filters) persisted across reloads?
> 4. **Print & Export Decoupling**: Does print media force-unroll all collapsed data so physical exports are never truncated?
> 5. **Tactile Touch Targets**: Do all clickable headers have `cursor: pointer`, visible hover/active states, and a minimum 44px touch target on mobile viewports?

### Invariant 2: Zero-Truncation Print Preservation Contract (`INV-COLLAPSIBLE-PRINT-001`)
> In all print media queries (`@media print`) and container-isolated print streams (`window.skPrintContainer`), all collapsible containers must be unconditionally expanded (`display: table !important; height: auto !important; opacity: 1 !important;`). User screen-collapse state must never conceal information on printed or exported paper.

---

## 5. Certification Ruling

The Joint Architecture & UI Council **CERTIFIES** and **RATIFIES** the following:
1. **Ticket Scaffolded**: [`SK-025`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-025/00_ENHANCEMENT_INDEX.md) (Tier: Complex, Target: `v2.9.3`).
2. **Standards Registered**: `STD-UI-ERGONOMICS-GATE-001`, `STD-UI-ACCORDION-001`, and `PKG-008`.
3. **Execution Plan**: Phase 1 implementation plan generated via `writing-plans` in `implementation_plan.md`.
