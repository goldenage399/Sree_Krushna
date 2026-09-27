# INC-101 — Print-First Mental Model Conflation & Planning UI Interaction Blind Spot (`#obligationsTableContent`)

**Incident ID**: `INC-101`  
**Date**: `2026-09-27`  
**Severity**: High (UI Ergonomics Blind Spot / Print-First Conflation / Chronic Post-Implementation Rework)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: User & Antigravity Agent  
**Governing Standard**: `STD-COUNCIL-DUAL-GATE-001`, `STD-UI-INTERACTION-SPEC-001`, `STD-UI-ACCORDION-001`, `INV-COLLAPSIBLE-PRINT-001`, `PKG-009`  
**Council Decision**: `AC-DEC-2026-067` / `AC-DEC-2026-068` (`UI-DEC-2026-051` / `UI-DEC-2026-052`)  
**Affected Components**:  
- `shopping_src/components/obligations_view.html`
- `shopping_src/styles/11_obligations_table_and_print.css`
- `shopping_src/scripts/controller.js`
- `.agent/skills/writing-plans/SKILL.md`
- `.claude/skills/writing-plans/SKILL.md`
- `.agent/workflows/plan.md`  
**Related Patterns**:  
- `.agent/patterns/dual-council-pre-planning-and-interaction-matrix.md`  
- `.agent/patterns/table-domain-separation-and-mobile-scroll.md`  
- `.agent/patterns/interactive-multi-look-lightbox-carousel.md`  
- `.agent/patterns/phased-development-ticket-first-gate.md`  

---

## 6-Surface Impact Assessment

1. **UI Surface**: Milestone grouping headers (`#obligationsTableContent > div:nth-child(1)`) rendered as static, unclickable dividers. All 49 obligations across 7 milestones unrolled simultaneously into a 1,200px vertical list with no progressive disclosure or collapse state.
2. **Data Surface**: Zero data corruption; all 49 obligations (`OBL-001` through `OBL-049`), categories, recipients, and amounts remained 100% intact.
3. **Reactive Surface**: The view controller had no state subscription or event handler for milestone collapsing or `localStorage` persistence.
4. **Service Surface**: No service layer failure.
5. **Module Surface**: Conflation of physical paper layout constraints (flat, non-collapsible print run sheets) with interactive digital screen viewport ergonomics.
6. **Governance Surface**: The canonical planning engine (`writing-plans/SKILL.md`) had a critical architectural blind spot: it strictly enforced TDD unit tests and modular file sizes (<500 lines) but lacked any requirement to declare or verify UI/UX interaction contracts before code generation. Ratified `SK-025` and `SK-026`.

---

## 1. Executive Summary & Root Cause Analysis (RCA)

### Symptoms
1. **Direct Symptom**: Inspecting `document.querySelector("#obligationsTableContent > div:nth-child(1)")` revealed an inert milestone container header that could not be clicked or collapsed, forcing users to scroll through 15 rows of engagement obligations to view wedding-day covenants.
2. **Systemic Symptom**: Across multiple recent features (table column sorting, lightbox photo carousels, zoom/pan navigation, mobile touch targets), the agent repeatedly delivered functional code that required subsequent prompt cycles from the user to add fundamental UI/UX affordances.

### Root Causes

#### Root Cause 1: Print-First Mental Model Conflation (`FKL-AL-010`)
In `SK-022`, the primary requirement was delivering an executive printable run sheet for family elders. Because physical paper cannot be clicked or collapsed, the developer directly transposed the static paper layout into the digital web application view. Screen scannability was degraded to preserve printability, failing to recognize that screen ergonomics (progressive disclosure) and print fidelity (complete unrolling) operate on separate media planes.

#### Root Cause 2: Asymmetric Planning Engine Verification (`FKL-WI-007`)
The universal planning skill (`writing-plans/SKILL.md`) checked:
- Modularity Invariant (<500 lines per script)
- Phased Development Tickets (`SK-###`)
- Automated TDD unit tests

However, it had **zero gates requiring UI/UX interaction specifications** prior to plan approval. The planning engine treated interactive ergonomics as informal aesthetic polish rather than a core functional requirement. Consequently, implementation plans systematically omitted progressive disclosure, keyboard accessibility, image carousel navigation, and touch target sizing.

---

## 2. The 9-Step Diagnostic Engine

### Step 1: Technical Anatomy
- **Screen View**: 49 obligations rendered as a single monolithic scroll stream.
- **Accordion Absence**: No `cursor: pointer`, no rotating chevron, no `.is-collapsed` class toggling, and no `localStorage` persistence.
- **Print Vulnerability**: If a naive CSS accordion were applied (`display: none`), printing would silently truncate hidden rows on physical paper, violating elder auditability.

### Step 2: Escape Analysis
- **Why did advisory skills (`impeccable`, `ui-ux-pro-max`) not catch it automatically?**
  Advisory skills were configured as reactive prompt assistants rather than mandatory pre-planning gates. Unless explicitly invoked by the user or routed via prompt keywords, agents skipped UI craft reviews during planning.
- **Why did automated CI tests pass?**
  Tests in `scripts/test-shopping-registry.cjs` only verified element existence (`assert(container !== null)`), not user interaction states, clickability, or accessibility attributes.

### Step 3: Resolution & Implementation

#### 1. Milestone Grouping Accordion & Print-Force-Unroll (`SK-025` / `STD-UI-ACCORDION-001`)
- **Tactile Screen Ergonomics**: Added `.obl-table-milestone-header` with pointer cursor, hover glow, and animated chevron rotating from `0deg` (expanded `▼`) to `-90deg` (collapsed `▶`).
- **State Persistence**: Implemented `sk_obl_accordion_state` in `localStorage`, maintaining collapsed/expanded state across page refreshes.
- **Bulk Controls**: Injected `[▼ Expand All]` and `[▶ Collapse All]` toolbar buttons into `#obligationsToolbar`.
- **Dual-Surface Media Isolation (`INV-COLLAPSIBLE-PRINT-001` / `FKL-DI-026`)**:
  ```css
  @media print {
    .obl-table-milestone-block.is-collapsed .obl-data-table {
      display: table !important;
      height: auto !important;
      opacity: 1 !important;
    }
    .obl-milestone-chevron,
    .obl-accordion-controls {
      display: none !important;
    }
  }
  ```
  Guarantees that collapsed accordions on screen unconditionally unroll during printing, preventing data loss.

#### 2. Universal Dual-Council Pre-Planning Gate & 7-Domain Matrix (`SK-026` / `PKG-009`)
- Codified **Gate 1: Dual-Council Clearance** in `writing-plans/SKILL.md`: plans touching user interfaces must pass BOTH Architecture Council and UI Council.
- Codified **Universal 7-Domain UI/UX Interaction Specification Matrix (`STD-UI-INTERACTION-SPEC-001`)**:
  1. Tables & Lists (accordions, sorting, filtering)
  2. Media/Lightbox Viewers (carousels, zoom, pan)
  3. Modals & Drawers (3-trigger dismissibility)
  4. Touch & Viewport Controls (min 44px targets)
  5. Keyboard & A11y (ARIA, tab order)
  6. State Craft & Micro-Feedback (loading, empty states)
  7. Dual-Surface Media Isolation (print unrolling)

---

## 3. Recurrence Prevention & Verification Lock

1. **Automated Accordion Contract**: `scripts/test-accordion-contract.cjs` (9/9 passing checks verifying header clickability, chevron CSS, bulk controls, and `@media print` unrolling).
2. **Automated Planning Engine Contract**: `scripts/test-planning-engine-contract.cjs` (8/8 passing checks verifying Section 7 Gate 1 Dual-Council Clearance and the 7-domain matrix in both `.agent` and `.claude` planning skills).
3. **Architectural Specification**: Published `docs/references/SPEC-ARCH-UI-ERGONOMICS-AND-INTERACTION-ENGINE-001.md` stamping `FKL-DI-026`, `FKL-AL-010`, `FKL-WI-007`.
4. **Universal Pattern**: Captured `.agent/patterns/dual-council-pre-planning-and-interaction-matrix.md`.
5. **Operating Manual Lock**: Enshrined Invariant 12 in `GEMINI.md` and `CLAUDE.md`.
