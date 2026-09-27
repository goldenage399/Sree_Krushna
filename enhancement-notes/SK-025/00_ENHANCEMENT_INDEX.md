# SK-025: Universal UI Interaction Ergonomics Pre-Flight Gate & Reusable Collapsible Table Accordion Primitive (STD-UI-ERGONOMICS-GATE-001 / STD-UI-ACCORDION-001 / PKG-008)

## 📊 Metadata

- **Category**: UI_QUALITY / GOVERNANCE / INFRASTRUCTURE / DEV_VELOCITY
- **Priority**: HIGH
- **Status**: IN_PLANNING
- **Estimate**: 12 hours
- **Target Release**: v2.9.3
- **Risk Level**: MEDIUM (Touches shared planning engine, adds shared UI primitive, updates `shopping_src/`, and synchronizes to `Task-Dashboard` as PKG-008)
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]`, `[GOVERNANCE]`, `[INFRASTRUCTURE]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-022  # Family Obligations Tabular View, Dual Card/Table Mode & Printable Run Sheet Architecture
    - SK-023  # Universal Scoped Container Print Engine & Tabular Run Sheet Artisan Skill (PKG-007)
    - SK-010  # Universal UI Button Primitives & Pre-Flight Design System Gate (STD-UI-PRIMITIVE-002)
    - SK-008  # Universal Canonical Planning Engine (STD-PLANNING-ENGINE-001)
  related:
    - AC-DEC-2026-067  # Joint Council Certification: UI Ergonomics Pre-Flight Gate & Collapsible Table Primitive
    - UI-DEC-2026-051  # Universal Collapsible Container & Accordion Scannability Standard
    - STD-MOD-COMP-001 # Modular Component Architecture Invariant
    - STD-UI-LIFECYCLE-001 # Dynamic UI Lifecycle & Modal Dismissibility Invariant
  blocks:
    - None
```

---

## 🎯 Goal

Permanently eliminate the recurring gap where tabular views and data-heavy interfaces are initially delivered as static, flat data dumps requiring repetitive user-requested tweaks. This initiative establishes:
1. **Interactive Accordion & Milestone Collapsibility in `Sree_Krushna` (`#obligationsTableContent`)**:
   - Transform static `.obl-table-milestone-header` blocks into interactive accordions with tactile chevron rotation (`▼`/`▶`), smooth expansion transitions, and `localStorage` state persistence.
   - Introduce global toolbar affordances: `[▼ Expand All]` and `[▶ Collapse All]` buttons.
   - Guarantee zero-leak print preservation: in `@media print` and container print runs, all collapsed sections automatically force-unroll (`display: table !important`) so physical run sheets are never truncated.
2. **Universal Reusable Collapsible Container Primitive (`STD-UI-ACCORDION-001`)**:
   - Author a standalone, dependency-free UI primitive in `ui_primitives/scripts/collapsible_engine.js` (and CSS in `ui_primitives/styles/04_collapsible.css`) supporting declarative `data-collapsible-group`, `data-collapsible-header`, and `data-collapsible-body` attributes.
3. **Universal UI Interaction Ergonomics Pre-Flight Gate (`STD-UI-ERGONOMICS-GATE-001`)**:
   - Embed a mandatory 5-point UI Ergonomics Pre-Flight checklist into `.agent/skills/writing-plans/SKILL.md` (and `.agent/workflows/plan.md`) that blocks any frontend plan lacking interactive states (collapsibility for grouped data >15 items, sticky headers, empty states, and print decoupling).
4. **Upstream Promotion as `PKG-008` & Cross-Repo SAP Synchronization**:
   - Package the gate and primitive into `Task-Dashboard` and fan out across all 10 ecosystem repositories via `sap-sync-all-repos.cjs`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Local Interactive Milestone Accordion & Table Controls in `Sree_Krushna`
- [ ] **Interactive Milestone Headers**: Refactor `renderObligationsTable()` in `shopping_src/scripts/controller.js` so `.obl-table-milestone-header` elements toggle visibility of their sibling `.obl-data-table`.
- [ ] **Affordance & Chevron Styling**: Add rotating SVG/CSS chevrons (`transform: rotate(-90deg)` when collapsed), hover feedback, and accessibility attributes (`aria-expanded="true/false"`).
- [ ] **Expand All / Collapse All Controls**: Add global toggle buttons to `#obligationsTableContainer` toolbar for one-click bulk expansion/collapsing.
- [ ] **Client State Persistence**: Cache expanded/collapsed milestone IDs in `localStorage` (`sk_obl_accordion_state`).
- [ ] **Print Force-Unroll Guarantee**: Add `@media print { .obl-data-table { display: table !important; } }` ensuring printed run sheets are always 100% complete.
- [ ] **Validation Gate (VG-1)**: Visual and programmatic verification via headless contract test (`node scripts/test-accordion-contract.cjs`); all 7 milestone blocks toggle cleanly without breaking layout or print output.

### Phase 2: Universal UI Interaction Ergonomics Pre-Flight Gate (`STD-UI-ERGONOMICS-GATE-001`)
- [ ] **Planning Engine Integration**: Update `.agent/skills/writing-plans/SKILL.md` (and mirror in `.claude/skills/writing-plans/`) under `<!-- shared:std.agent.planning-engine.core -->` to mandate the **UI Ergonomics Pre-Flight Checklist** for all presentation-layer tasks.
- [ ] **Standard Definition**: Register `STD-UI-ERGONOMICS-GATE-001` and `STD-UI-ACCORDION-001` in `.agent/standards-catalog.json`.
- [ ] **Pre-Flight Linter / Test**: Author `scripts/verify-ui-ergonomics.cjs` checking that any grouped table component conforms to the collapsible contract.
- [ ] **Validation Gate (VG-2)**: `node scripts/verify-ui-ergonomics.cjs` runs and passes; planning workflow enforces the gate before code mutation.

### Phase 3: Universal Reusable Collapsible Container Primitive (`ui_primitives/`)
- [ ] **Primitive Implementation**: Create `ui_primitives/scripts/collapsible_engine.js` (<250 lines) providing `window.skInitCollapsibleGroups(containerSelector)`.
- [ ] **Primitive Styles**: Create `ui_primitives/styles/04_collapsible.css` with zero-specificity design tokens and print unroll rules.
- [ ] **SDCA Toolchain Wiring**: Update `shopping_src/build.cjs`, `decision_registry_src/build.cjs`, and `cockpit_src/build.cjs` to include the collapsible primitive.
- [ ] **Modularity & Parity Verification**: Verify `npm run verify:modular-architecture` passes with 100% byte parity between root and `/public`.
- [ ] **Validation Gate (VG-3)**: Automated tests confirm all 3 SDCA modules bundle the primitive cleanly under the 500-line modular limit.

### Phase 4: Upstream Promotion (`Task-Dashboard` PKG-008) & Multi-Repo Fan-Out
- [ ] **Upstream Scaffolding in `Task-Dashboard`**:
  - Deploy `collapsible_engine.js` and `04_collapsible.css` to `Task-Dashboard/templates/web-spa-shell/`.
  - Update `Task-Dashboard/scripts/bootstrap-spoke-governance.cjs` to register `PKG-008`.
  - Update `Task-Dashboard/.agent/workflows/sap-sync.md`.
- [ ] **Multi-Repo Synchronization**: Execute `node scripts/sap-sync-all-repos.cjs` to propagate `PKG-008` to all 10 repositories.
- [ ] **Validation Gate (VG-4)**: All 10 repositories exit `SUCCESS` in `sap-sync-all-repos.cjs`; governance wiring tests pass 100% green.
