---
pattern: dual-council-pre-planning-and-interaction-matrix
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: GEMINI.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"
triggers:
  - dual council gate
  - ui interaction specification
  - progressive disclosure
  - accordion print unroll
portability: universal
canonical_source: sree-krushna
porting_effort: low
---

# Dual-Council Pre-Planning Gate & Universal UI/UX Interaction Engine

**Category**: Process Gate & Interaction Methodology  
**Applies to**: All UI/UX features, dashboards, tables, lightboxes, modals, and print media  
**Origin**: 2026-09-27 (SK-025, SK-026, INC-101, AC-DEC-2026-067, AC-DEC-2026-068)  
**Status**: VALIDATED  

---

## Pattern — Dual-Council Pre-Planning & 7-Domain Interaction Matrix

### Problem
Technical implementation plans that only verify code modularity (<500 lines) and automated TDD unit tests routinely leave a massive blind spot for frontend ergonomics. Features are executed without basic interactive affordances:
1. Tables and lists lack sorting, progressive disclosure (collapsible accordions), or facet filters.
2. Lightbox viewers lack multi-look carousels, zoom/pan ergonomics, or keyboard arrow navigation.
3. Collapsible UI containers conceal data when printed or exported, producing truncated physical dossiers.
4. Mobile viewports suffer from sub-44px touch targets or horizontal scroll traps.

This omission forces repetitive cycles of post-implementation review, developer frustration, and expensive UI rework.

### Why it happens
1. **Print-First Conflation**: Transposing physical paper artifacts (e.g. executive run sheets) directly into screen DOM leads developers to copy the flat paper model into interactive views without progressive disclosure.
2. **Asymmetric Planning Heuristics**: Planning engines (`writing-plans/SKILL.md`) historically enforced strict architecture gates (TDD, schemas, modularity) while treating UI/UX craft as discretionary polish deferred until after code execution.

### Solution
1. **Mandatory Dual-Council Pre-Planning Gate (`STD-COUNCIL-DUAL-GATE-001` / `PKG-009`)**:
   - Any implementation plan touching user interfaces must pass BOTH Architecture Council (modularity, APIs, data contracts) and UI Council (`impeccable`, `ui-ux-pro-max`: craft, typography, scannability, touch targets, accessibility).
2. **Universal 7-Domain UI/UX Interaction Specification Matrix (`STD-UI-INTERACTION-SPEC-001`)**:
   Before writing any UI code, every implementation plan must declare specifications across all 7 interaction domains:
   - **Domain 1: Tables & Data Lists**: Progressive disclosure (accordions), sort/filter affordances, sticky headers/key columns.
   - **Domain 2: Media & Lightbox Viewers**: Multi-image carousel navigation, zoom/pan scaling, keyboard arrow controls.
   - **Domain 3: Modals & Slide-Overs**: 3-trigger dismissibility (Close button, backdrop click, Escape key), focus trapping, scroll locking.
   - **Domain 4: Touch & Viewport Controls**: Minimum $44 \times 44\text{px}$ touch targets, hardware-accelerated horizontal touch-scrolling.
   - **Domain 5: Keyboard & Accessibility (A11y)**: Tab order, ARIA attributes (`aria-expanded`, `aria-label`), visible focus rings.
   - **Domain 6: State Craft & Micro-Feedback**: Instant tactile response, loading skeletons, empty states, error fallbacks.
   - **Domain 7: Dual-Surface Media Isolation (`INV-COLLAPSIBLE-PRINT-001` / `FKL-DI-026`)**: Screen view states (collapsed accordions, tabs) must unconditionally force-unroll (`display: table !important; height: auto !important`) under `@media print` and container-scoped print streams.

### Failure Mode
- **Skipping UI Council**: Reintroduces inert, 1990s-era static web views that require repetitive follow-up prompts to fix scannability.
- **Conflating Print and Screen**: Either breaks physical printouts (by hiding collapsed rows) or breaks screen usability (by unrolling 50+ rows at once).

### Sree-Krushna Instance
- Validated on the 49-row Family Obligations Register (`#obligationsTableContent`):
  - Accordion milestone headers with animated rotating chevrons and `[▼ Expand All]` / `[▶ Collapse All]` toolbar.
  - User choices persisted in `localStorage` (`sk_obl_accordion_state`).
  - `@media print` unrolling verified via `scripts/test-accordion-contract.cjs` (9/9 passing checks).
  - Planning engine pre-flight verified via `scripts/test-planning-engine-contract.cjs` (8/8 passing checks).
