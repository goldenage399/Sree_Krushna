# SK-026: Universal Dual-Council Governance Protocol & 7-Domain UI/UX Interaction Pre-Flight Engine (STD-COUNCIL-DUAL-GATE-001 / STD-UI-INTERACTION-SPEC-001 / PKG-009)

## 📊 Metadata

- **Category**: GOVERNANCE / UI_QUALITY / INFRASTRUCTURE / DEV_VELOCITY
- **Priority**: CRITICAL
- **Status**: IN_PLANNING
- **Estimate**: 16 hours
- **Target Release**: v2.9.4
- **Risk Level**: MEDIUM (Touches shared planning engine `writing-plans/SKILL.md`, council workflows, preflight verification scripts, and propagates via `/sap-sync` across 10 repos)
- **Owner**: goldenage399
- **Cluster**: `[GOVERNANCE]`, `[UI-QUALITY]`, `[INFRASTRUCTURE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-008  # Universal Canonical Planning Engine (STD-PLANNING-ENGINE-001)
    - SK-010  # Universal UI Button Primitives & Pre-Flight Design System Gate (STD-UI-PRIMITIVE-002)
    - SK-012  # Institutional Governance Safeguards & Anti-Performative Pipeline Verification Gate
    - SK-013  # Interactive Multi-Look Lightbox Carousel & Shared Primitive Navigation (STD-UI-PRIMITIVE-003)
    - SK-023  # Universal Scoped Container Print Engine & Tabular Run Sheet Artisan Skill (STD-UI-PRINT-CONTAINER-001 / PKG-007)
    - SK-025  # Universal UI Interaction Ergonomics Pre-Flight Gate & Reusable Collapsible Table Primitive (PKG-008)
  related:
    - AC-DEC-2026-068  # Dual-Council Governance Protocol & 7-Domain UI/UX Interaction Pre-Flight Engine
    - UI-DEC-2026-052  # Universal UI/UX Interaction Heuristics Matrix
    - SOP-WFL-ARCH-COUNCIL-001 # Architecture Council Review Workflow
    - SOP-WFL-UI-COUNCIL-001   # UI Council Review Workflow
  blocks:
    - None
```

---

## 🎯 Goal

Permanently eliminate the recurring systemic failure mode where user-facing features are initially implemented as flat, rudimentary MVPs that omit critical interactive affordances (such as table sorting, column filters, progressive disclosure, image zoom/pan, carousel navigation, keyboard shortcuts, and touch targets), inevitably forcing repetitive cycles of post-implementation rework.

This initiative establishes:
1. **Mandatory Dual-Council Pre-Planning Protocol (`STD-COUNCIL-DUAL-GATE-001`)**:
   - Mandates that any feature, enhancement, or refactor touching the presentation layer (HTML/CSS/JS components, dashboards, viewers, modals, tables) MUST receive explicit pre-planning clearance from BOTH the **Architecture Council** (structure, data models, API boundaries, modularity) AND the **UI Council** (featuring `impeccable`, `ui-ux-pro-max`, `frontend-design`, and `mobile-ui-validator` for craft, scannability, ergonomics, touch, and tactile feedback) before implementation planning can conclude.
2. **Universal 7-Domain UI/UX Interaction Specification Matrix (`STD-UI-INTERACTION-SPEC-001`)**:
   - Embeds an exhaustive 7-category interaction checklist directly into `<!-- shared:std.agent.planning-engine.core -->` in `.agent/skills/writing-plans/SKILL.md` (and `.claude/skills/writing-plans/SKILL.md`), compelling every agent to explicitly design and verify:
     - **Domain 1 (Tables & Data Grids)**: Sorting, inline filtering, column width constraints, line clamping, hover tooltips, progressive disclosure/accordions, density toggles.
     - **Domain 2 (Media, Images & Lightbox)**: Multi-look carousel (prev/next), thumbnail strip, zoom-pan (mouse wheel/pinch), swipe gestures, arrow key keyboard navigation.
     - **Domain 3 (Modals, Drawers & Overlays)**: 3-trigger dismissibility (Close/Backdrop/Escape), focus trapping, scroll-lock, active view gating.
     - **Domain 4 (Touch & Interactive Ergonomics)**: Min 44x44px touch targets on mobile viewports, `cursor: pointer`, hover/active/focus-visible states, disabled styling, zero naked `<button>`.
     - **Domain 5 (Keyboard & Accessibility / A11y)**: Arrow keys, Escape, Enter, Space, Tab order, `aria-expanded`, `aria-label`, screen-reader announcements.
     - **Domain 6 (State Craft & Micro-Feedback)**: Loading skeletons, empty states, error boundaries, optimistic UI, success toasts.
     - **Domain 7 (Dual-Surface Media Isolation)**: Print unrolling (`@media print` forced expansion), high-contrast A4 ink-saving rules, zero parent bleed.
3. **Automated Pre-Flight Gate Linter (`scripts/verify-ui-interaction-specs.cjs`)**:
   - An automated static analysis gate that audits implementation plans and UI source files against the 7 domains to catch missing interaction contracts before code is merged.
4. **Upstream Promotion as `PKG-009` & Ecosystem-Wide SAP Synchronization**:
   - Package the Dual-Council Protocol and 7-Domain Matrix into `Task-Dashboard` and fan out across all 10 repositories via `sap-sync-all-repos.cjs`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Canonical Planning Engine Integration (`writing-plans/SKILL.md`)
- [ ] **Dual-Block Isolation Update**: In `.agent/skills/writing-plans/SKILL.md` (and `.claude/skills/writing-plans/SKILL.md`), embed the **Universal 7-Domain UI/UX Interaction Specification Matrix** inside `<!-- shared:std.agent.planning-engine.core -->`.
- [ ] **Mandatory UI Interaction Section in Implementation Plans**: Require that any plan touching UI components must dedicate a top-level section: `## UI/UX Interaction & Ergonomics Specification (STD-UI-INTERACTION-SPEC-001)` addressing all 7 domains explicitly.
- [ ] **Dual-Council Intake Check**: Require planning engines to verify Architecture Council referral notes and UI Council clearance before declaring plan readiness.
- [ ] **Validation Gate (VG-1)**: Plan template validation passes; syntax and SAP sync markers verified intact.

### Phase 2: Dual-Council Protocol Codification & Workflow Interlock
- [ ] **Architecture Council Update (`architecture-council.md`)**: Add mandatory referral hand-off to UI Council whenever a structural change affects user-visible interfaces.
- [ ] **UI Council Update (`ui-council.md`)**: Codify the 7-domain heuristic evaluation rubric for the Craft Auditor (`impeccable`) and Visual Hierarchy Auditor (`ui-ux-pro-max`).
- [ ] **Standards Catalog Registration**: Register `STD-COUNCIL-DUAL-GATE-001` and `STD-UI-INTERACTION-SPEC-001` in `.agent/standards-catalog.json`.
- [ ] **Validation Gate (VG-2)**: Workflows cross-reference cleanly without circular dependency; council charter alignment verified.

### Phase 3: Automated UI Interaction Specification Verification Tooling
- [ ] **Verification Script (`scripts/verify-ui-interaction-specs.cjs`)**: Author static analysis tool checking for:
  - Table sorting/filtering attributes.
  - Lightbox keyboard/gesture listeners.
  - Modal 3-trigger dismissibility.
  - Print force-unrolling rules (`@media print`).
- [ ] **Pre-Flight Suite Integration**: Add check to `npm run verify:ui-lifecycle` and `.agent/PREFLIGHT.md`.
- [ ] **Validation Gate (VG-3)**: `node scripts/verify-ui-interaction-specs.cjs` passes 100% green against all active UI modules.

### Phase 4: Upstream Promotion (`Task-Dashboard` PKG-009) & Multi-Repo Fan-Out
- [ ] **Upstream Scaffolding in `Task-Dashboard`**:
  - Propagate updated `writing-plans/SKILL.md`, `architecture-council.md`, and `ui-council.md` to `Task-Dashboard`.
  - Register `PKG-009` in `Task-Dashboard/scripts/bootstrap-spoke-governance.cjs`.
  - Update `Task-Dashboard/.agent/workflows/sap-sync.md`.
- [ ] **Multi-Repo Synchronization**: Execute `node scripts/sap-sync-all-repos.cjs` to propagate `PKG-009` across all 10 repositories.
- [ ] **Validation Gate (VG-4)**: All 10 repositories report `SUCCESS` in `sap-sync-all-repos.cjs`; governance wiring tests pass 100% green.
