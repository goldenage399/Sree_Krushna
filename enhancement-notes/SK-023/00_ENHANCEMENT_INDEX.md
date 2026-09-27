# SK-023: Universal Scoped Container Print Engine & Tabular Run Sheet Artisan Skill (STD-UI-PRINT-CONTAINER-001 / STD-TABULAR-RUN-SHEET-SKILL-001)

## 📊 Metadata

- **Category**: UI_QUALITY / ARCHITECTURE / GOVERNANCE / DEV_VELOCITY
- **Priority**: HIGH
- **Status**: COMPLETED
- **Estimate**: 12 hours
- **Target Release**: v2.9.2
- **Risk Level**: MEDIUM (Touches global `@media print` in `main.css`, adds UI primitive, and registers a reusable agent skill)
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]`, `[GOVERNANCE]`, and `[DEV-VELOCITY]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-022  # Family Obligations Tabular View, Dual Card/Table Mode & Printable Run Sheet Architecture
    - SK-010  # Universal UI Button Primitives & Pre-Flight Design System Gate (STD-UI-PRIMITIVE-002)
    - SK-008  # Universal Canonical Planning Engine (STD-PLANNING-ENGINE-001)
  related:
    - AC-DEC-2026-064  # Family Obligations Tabular View & Printable Run Sheet Architecture
    - AC-DEC-2026-065  # Scoped Container Print Engine & Universal Tabular Run Sheet Artisan Skill
    - UI-DEC-2026-049  # Container-Isolated Print UX & Zero-Dump Printing Standard
    - STD-MOD-COMP-001 # Modular Component Architecture Invariant
  blocks:
    - None
```

---

## 🎯 Goal

Resolve the catastrophic 50-to-60 page SPA print dump and formalize the creation of high-density ink-friendly printable tabular run sheets into a reusable repo-wide engineering standard:
1. **Container-Scoped Print Engine (`STD-UI-PRINT-CONTAINER-001`)**:
   - Provide a zero-bleed, isolated print primitive (`window.skPrintContainer(containerSelectorOrEl, options)`) using the sandboxed headless iframe pattern.
   - Patch `public/css/main.css` to eliminate the naive `.tab-content { display: block !important; page-break-after: always; }` rule, ensuring global browser printing only prints the active tab rather than dumping all 13 SPA modules.
2. **Standardized Container Print Affordance**:
   - Equip every data table and key subview container (Obligations, Commercial Trousseau, Decisions, Liturgy, Tasks) with a dedicated `[🖨️ Print View]` button that prints strictly that container's rendered state.
3. **Reusable Tabular Run Sheet Artisan Skill (`STD-TABULAR-RUN-SHEET-SKILL-001`)**:
   - Create `.agent/skills/tabular-run-sheet-artisan/SKILL.md` (and generic generator `scripts/generate-tabular-run-sheet.cjs`) enabling any agent or human to transform any structured dataset/table into an ink-saving A4 landscape/portrait standalone run sheet + Markdown reference table + automated regression test.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Global SPA Print De-Multiplexing & Sandboxed Container Print Primitive
- [x] **Global `@media print` Patch**: In `public/css/main.css`, retired unconditional `.tab-content { display: block !important; }`. Replaced with active-tab-only visibility (`.tab-content.active { display: block !important; }` and `.tab-content:not(.active) { display: none !important; }`).
- [x] **Shared UI Print Primitive (`ui_primitives/scripts/print_engine.js`)**: Implemented `window.skPrintContainer(target, options)`:
  - Dynamically builds a hidden `<iframe>`.
  - Injects target container's current DOM (respecting active filters/search).
  - Injects standard ink-saving A4 landscape/portrait CSS (`@page { size: A4 landscape; margin: 8mm 10mm; }`, pure `#000000` text, `#ffffff` background, hidden `.no-print` elements, border-collapse).
  - Dispatches `print()` and safely garbage-collects the iframe on afterprint/timeout.
- [x] **Headless Test Baseline (`scripts/test-print-container-contract.cjs`)**: Verified primitive syntax, DOM injection safety, and active-tab print rules.
- [x] **Validation Gate (VG-1)**: `node scripts/test-print-container-contract.cjs` passes 100% green (8/8 checks); all pre-flight gates verified.

### Phase 2: Container Print Integration Across Major Data Tables & SDCA Modules
- [x] **Shopping Registry (`shopping_src/`)**: Wired `[🖨️ Print Sheet]` in `#shoppingObligationsView` and added `[🖨️ Print Table]` in `#shoppingTableViewSection` to invoke `window.skPrintContainer()`.
- [x] **Decision Registry & Cockpit**: Bundled `print_engine.js` into SDCA build toolchain (`primScriptFiles`) for all modular modules.
- [x] **Validation Gate (VG-2)**: Printing from each container prints solely that container with current filter state; zero bleed from neighbor tabs or app nav.

### Phase 3: Universal Reusable Skill & Generic CLI Generator Tooling
- [x] **Canonical Skill Definition**: Created `.agent/skills/tabular-run-sheet-artisan/SKILL.md` (and `.claude/skills/` mirror) documenting schema requirements, standalone template architecture, and automated test generation.
- [x] **Generic CLI Generator**: Implemented `scripts/generate-tabular-run-sheet.cjs` taking structured JSON/JS data with orientation, grouping, columns, and dual-release options.
- [x] **Skill Router & Standards Integration**: Registered `tabular-run-sheet-artisan` in `.agent/skill-router.yaml` and added `STD-UI-PRINT-CONTAINER-001` & `STD-TABULAR-RUN-SHEET-SKILL-001` to `.agent/standards-catalog.json`.
- [x] **Validation Gate (VG-3)**: Generator executed on trousseau data and verified with 100% byte parity to `public/trousseau-run-sheet.html`.

### Phase 4: SDCA Compilation, Byte Parity & Pre-Flight Verification Gate
- [x] **Compilation**: Ran SDCA compilers (`node shopping_src/build.cjs --all`, `node decision_registry_src/build.cjs --all`, `node cockpit_src/build.cjs --all`).
- [x] **Byte Parity**: Confirmed 100% byte parity between root (`/`) and `/public` distribution directories.
- [x] **Pre-Flight Gates**: Executed `npm run verify:modular-architecture`, `npm run verify:ui-lifecycle`, `npm run verify:deployment`, and `npm run verify:governance-wiring:all`.
- [x] **Validation Gate (VG-4)**: All automated verification suites passed 100% green.
