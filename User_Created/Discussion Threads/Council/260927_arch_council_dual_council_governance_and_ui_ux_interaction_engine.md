# 🏛️ Architecture & UI Council Decision Record: Universal Dual-Council Governance Protocol & 7-Domain UI/UX Interaction Pre-Flight Engine

**Council Reference:** `AC-DEC-2026-068` / `UI-DEC-2026-052`  
**Standards Activated:** `STD-COUNCIL-DUAL-GATE-001` / `STD-UI-INTERACTION-SPEC-001` / `INV-DUAL-COUNCIL-PREFLIGHT-001` / `PKG-009`  
**Governing Ticket:** `SK-026` ([`enhancement-notes/SK-026/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-026/00_ENHANCEMENT_INDEX.md))  
**Date:** 2026-09-27  
**Type:** Joint Architecture & UI Council Deliberation  
**Status:** ✅ **APPROVED & CERTIFIED**  
**Quorum:** Full Joint Council (6 Core Auditors Seated)  
**Governing Workflows:** `.agent/workflows/architecture-council.md` (SOP-WFL-ARCH-COUNCIL-001), `.agent/workflows/ui-council.md` (SOP-WFL-UI-COUNCIL-001), and `.agent/workflows/plan-review.md`

---

## 1. Ground Truth & Systemic Problem Statement

### 1.1 The Symptom: Repetitive Post-Implementation UI Refinement Churn
Throughout past development cycles across repositories, user-facing features repeatedly suffered from a chronic lifecycle pattern:
1. **Initial Implementation**: An agent scaffolds a data structure or user view (e.g. Shopping Table, Lightbox, Modals, Decision Registry). The agent focuses strictly on data validity, file modularity (<500 lines), and passing basic tests.
2. **The Friction Gap**: When the user opens the application, fundamental interaction and ergonomic affordances are missing:
   - **Tables**: Delivered static, requiring follow-up tickets to add column sorting, category filters, column width constraints, line clamping, and collapsible milestone accordions.
   - **Lightboxes & Media**: Initially delivered as single-image popups, requiring separate iterative cycles to add multi-look carousel navigation (`Prev`/`Next`), thumbnail strips, pinch/wheel zoom-pan, keyboard arrow navigation, and swipe gestures.
   - **Modals & Drawers**: Initially built with raw close buttons, requiring separate passes to add 3-trigger dismissibility (Backdrop click + Escape key), focus trapping, and scroll lock.
   - **Mobile Viewports**: Delivered with desktop-biased touch targets (<30px), failing thumb-zone usability.
3. **The Penalty**: Every missing UI affordance turns into an extra round of prompts, plan modifications, bug reports, and refactoring, causing massive cognitive friction and developer velocity drain.

### 1.2 The Root Cause: Structural Council & Planning Engine Decoupling
1. **The Council Separation Fallacy**:
   - `architecture-council.md` governed *structure, data schemas, and service boundaries*.
   - `ui-council.md` governed *visual presentation, design tokens, and craft*.
   - In practice, Architecture Council was convened routinely, but **UI Council was treated as a separate, optional, or post-facto audit**. Features were planned, coded, and deployed without UI Council or `impeccable` ever reviewing the user interaction model.
2. **Planning Engine Heuristic Void (`writing-plans/SKILL.md`)**:
   - The canonical planning engine mandated TDD, file placement, and button token checks, but contained **zero requirement to specify interaction heuristics**. An agent could author an implementation plan for a complex data grid without ever considering sorting, filtering, collapsibility, keyboard accessibility, or touch targets.

---

## 2. Systematic Comparative Evaluation of Options

| Evaluation Dimension | Option A: Ad-Hoc Post-Implementation UI Polish | Option B: Standalone UI Council Audit After Architecture | **Option C (Certified Hybrid): Mandatory Dual-Council Pre-Planning Protocol & 7-Domain Heuristic Engine (PKG-009)** |
| :--- | :--- | :--- | :--- |
| **Description** | Implement features as before, then ask user/agents to polish UI afterwards. | Convene Architecture Council, finish technical plan, then run UI Council as a separate follow-up session. | **1. Enforce Mandatory Dual-Council Pre-Planning Gate (`STD-COUNCIL-DUAL-GATE-001`): Any UI plan must have joint Architecture + UI clearance.<br>2. Embed the 7-Domain UI/UX Interaction Heuristics Matrix (`STD-UI-INTERACTION-SPEC-001`) into `writing-plans/SKILL.md`.<br>3. Automate pre-flight static analysis via `scripts/verify-ui-interaction-specs.cjs`.<br>4. Package as `PKG-009` across all 10 repos.** |
| **Eliminates UI Rework Churn** | Zero (perpetuates the cycle). | Low (adds latency and multi-pass planning drift). | **Complete (all 7 interaction domains are locked into the plan before code is written).** |
| **Coverage of Complex UI Affordances** | Fragmented. | Inconsistent. | **Exhaustive (Tables, Lightboxes/Zoom/Carousels, Modals, Touch, Keyboard, State, Print).** |
| **Planning Overhead** | Unpredictable (hidden rework cost). | High (two full separate council meetings). | **Optimized & Predictable (unified 7-domain checklist in single planning pass).** |
| **Cross-Repo Reusability** | None. | None. | **Maximum (deployed to Task-Dashboard and synchronized to all 10 repos via `/sap-sync`).** |

---

## 3. Multi-Disciplinary Council Deliberations

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: APPROVE Option C.
- **Evidence**: Fragmented planning violates the 4-Phase Problem Solving Discipline (`4-PPSD`). Requiring UI interaction specifications inside the canonical planning engine ensures that "Definition of Done" includes UX completeness, not just code compilation.

### 3.2 Impeccable Craft & Polish Auditor (`impeccable`)
- **Position**: APPROVE Option C.
- **Evidence**:
  - The historical issues highlighted by the user (lightbox carousel, zoom-pan, table sorting, keyboard shortcuts) are textbook examples of craft neglect during planning.
  - Locking the **7-Domain Interaction Matrix** into `writing-plans` guarantees that no agent can write a plan for a table without declaring its sorting/filtering/density story, or a plan for an image viewer without declaring its carousel/zoom/gesture story.

### 3.3 Visual Hierarchy & Usability Auditor (`ui-ux-pro-max`)
- **Position**: APPROVE Option C.
- **Evidence**:
  - Eliminates "blank state" and "raw dump" UI anti-patterns.
  - Enforces 44px minimum touch targets on mobile viewports, high-contrast text ratios, tactile hover states, and clear keyboard focus rings.

### 3.4 Modularity & SDCA Auditor (`STD-MOD-COMP-001`)
- **Position**: APPROVE Option C.
- **Evidence**:
  - Prevents bloated inline scripting. Requiring shared primitives (like `ui_primitives/scripts/print_engine.js`, `zoom_pan_engine.js`, `comments_engine.js`, and `collapsible_engine.js`) keeps individual sub-engine controllers well below the 500-line modularity threshold.

### 3.5 Maintainability & Velocity Auditor (Ponytail Dissenter)
- **Position**: CONDITIONAL APPROVAL.
- **Challenge**: "Does this mean an agent has to write 50 pages of documentation for every small button tweak?"
- **Resolution**:
  - **Scoped Application**: The 7-Domain Matrix applies specifically to *new components, data views, and structural redesigns*.
  - Routine 1-line styling fixes or label copy edits are explicitly exempt under the established low-stakes escape hatch (`meta-prompt.md` Step 4).
  - For applicable components, filling out the checklist takes 3 minutes during planning, saving hours of downstream refactoring.

---

## 4. Council Synthesis & Certified Invariants

### Invariant 1: Mandatory Dual-Council Pre-Planning Gate (`STD-COUNCIL-DUAL-GATE-001`)
> No implementation plan for a user-facing component, table, viewer, or interactive interface may be approved or executed without satisfying BOTH architectural integrity (modularity, APIs, data schemas) AND UI craft heuristics (scannability, touch targets, state craft, and keyboard accessibility). The planning engine must cite clearance from both council perspectives.

### Invariant 2: Universal 7-Domain UI/UX Interaction Specification Matrix (`STD-UI-INTERACTION-SPEC-001`)
> Every implementation plan touching the presentation layer MUST include an explicit section evaluating and defining contracts across all 7 interaction domains:
> 1. **Data Tables & Lists**: Sorting, filtering, density toggle, column constraints/line-clamping, progressive disclosure/collapsible groups, responsive scroll.
> 2. **Media & Lightbox Viewers**: Multi-look carousel (prev/next), thumbnail strip, zoom-pan (mouse wheel/pinch), swipe gestures, arrow key keyboard navigation.
> 3. **Modals, Drawers & Popovers**: 3-trigger dismissibility (Close/Backdrop/Escape), focus trapping, scroll-lock, active view gating.
> 4. **Interactive Controls & Touch Targets**: Min 44x44px touch targets on mobile, `cursor: pointer`, hover/active/focus-visible states, disabled styling, zero naked `<button>`.
> 5. **Keyboard & Accessibility (A11y)**: Arrow keys, Escape, Enter, Space, Tab order, `aria-expanded`, `aria-label`, screen-reader announcements.
> 6. **State Craft & Micro-Feedback**: Loading skeletons, empty states, error boundaries, optimistic UI, success toasts.
> 7. **Dual-Surface Media Isolation**: Print unrolling (`@media print` forced expansion), high-contrast A4 ink-saving rules, zero parent bleed.

---

## 5. Certification Ruling

The Joint Architecture & UI Council **CERTIFIES** and **RATIFIES** the following:
1. **Ticket Scaffolded**: [`SK-026`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-026/00_ENHANCEMENT_INDEX.md) (Tier: Complex, Target: `v2.9.4`).
2. **Standards Registered**: `STD-COUNCIL-DUAL-GATE-001`, `STD-UI-INTERACTION-SPEC-001`, and `PKG-009`.
3. **Execution Plan**: Phase 1 implementation plan generated via `writing-plans` in `implementation_plan.md`.
