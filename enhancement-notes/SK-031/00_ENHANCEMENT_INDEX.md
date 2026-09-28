# SK-031: Universal Ink-Saving Print Engine, Configurable Themes & Accordion Page-Break Orchestration

## 📊 Metadata
- **Category**: UI QUALITY / PRINTS / ARCHITECTURE / ECOSYSTEM
- **Priority**: HIGH
- **Status**: IN_PROGRESS (Phase 1 Verified)
- **Estimate**: 4 Phases
- **Target Release**: v2.9.9
- **Risk Level**: LOW
- **Council Ruling**: `AC-DEC-2026-072` / `UI-DEC-2026-054` (FULL COUNCIL CERTIFIED, 2026-09-28)
- **Governing Standard**: `STD-UI-PRINT-RUNSHEET-002` / `INV-PRINT-ZERO-DUMP-001` / `INV-COLLAPSIBLE-PRINT-001`
- **Cluster**: UI Quality Enhancement Cluster

## 🔗 Dependencies
- **Depends On**: `SK-023` (Universal scoped container print engine), `SK-025` (Collapsible table accordions & print unrolling), `SK-029` (Proportional table budgeting & print unclamping)
- **Blocks**: None

## 🎯 Goal

Resolve the printer ink/toner depletion defect caused by heavy solid black printable headers (`#000000` / `#222222`), eliminate orphaned accordion milestone headers during paper pagination, and introduce an ecosystem-wide configurable print theme and page-break engine:
1. **Zero-Toner Wireframe Default (`INV-INK-SAVER-001`)**: Replace all solid black banner backgrounds in `@media print` and `ui_primitives/scripts/print_engine.js` with an elegant, ink-saving executive wireframe aesthetic (white background `#ffffff`, dark charcoal text `#0f172a`, crisp 1.5px/2px high-contrast structural borders, and subtle accent rules), slashing ink/toner usage by >95% out of the box with zero user effort.
2. **Deterministic CSS Paged Media Orchestration (`INV-PAGE-BREAK-ORCH-001`)**: Enforce strict pagination invariants preventing split accordions:
   - Accordion Milestone Headers declare `break-after: avoid !important; page-break-after: avoid !important;`, preventing orphan headers stranded at the bottom of pages without their data tables.
   - Table Headers (`<thead>`) enforce `display: table-header-group !important;`, repeating column headers automatically at the top of every subsequent printed page.
   - Table Rows (`<tr>`) enforce `break-inside: avoid !important; page-break-inside: avoid !important;`, preventing torn rows.
3. **Configurable Print Engine & Themes (`STD-UI-PRINT-RUNSHEET-002`)**: Upgrade `ui_primitives/scripts/print_engine.js` (`window.skPrintContainer`) with first-class support for dynamic print configurations:
   - Themes: `eco` (0% toner wireframe default), `tint` (subtle 4% gray fill for executive briefs), and `contrast` (high-contrast solid for digital PDF exports).
   - Page Breaks: `smart` (fluid flow with orphan header suppression) and `milestones` (forces each event milestone onto a fresh A4 page for ring-binder dossiers).
4. **Pre-Print Configuration Affordance**: Provide a lightweight, accessible Print Options Popover adjacent to `[🖨️ Print Sheet]` in `#shoppingObligationsView`, letting users preview and customize ink modes and page breaks before sending to printer or PDF.

---

## 4-Phase Definition of Done (DoD v1.7) & Sequential Phasing

| Phase | Scope & Deliverables | Validation Gate (VG) | Decision Node (DN) | Status |
|---|---|---|---|---|
| **Phase 1: Zero-Ink CSS Wireframe Default & Page-Break Invariants** | Invert black headers in `11_obligations_table_and_print.css` and `ui_primitives/scripts/print_engine.js` to executive wireframe; declare `break-after: avoid` on milestone headers and `table-header-group` on `thead`; author `scripts/test-print-ink-saver-contract.cjs`. | **VG-1**: `node scripts/test-print-ink-saver-contract.cjs` passes 100% green; zero `#000000` / `#222222` background fills in print selectors; `break-after: avoid` asserted on headers. | **DN-1**: Confirm wireframe styling satisfies physical paper high-contrast readability without gray muddying. | ✅ **COMPLETED** |
| **Phase 2: Configurable Print Options Engine in `ui_primitives/`** | Upgrade `skPrintContainer(target, options)` to accept `theme` and `pageBreaks` options; inject data-attributes into print sandbox DOM; wire dynamic CSS rules for `data-print-theme` and `data-print-pagebreak="milestones"`. | **VG-2**: Headless test verifying dynamic theme and page-break injection into sandbox iframe; automated verification of `break-before: page` for milestone-separated printing. | **DN-2**: Verify sandbox iframe maintains complete style isolation without leaking into host document. | ⚪ **QUEUED** |
| **Phase 3: Interactive Pre-Print Options Popover in Shopping Surface** | Introduce accessible Print Options Popover next to `[🖨️ Print Sheet]` in `#shoppingObligationsView`; allow user to select Ink Saver (Wireframe vs Tint vs Contrast) and Page Breaks (Smart vs Milestone per Page); persist choices in `localStorage`. | **VG-3**: Interactive smoke test verifying options selection passes correct parameters to `window.skPrintContainer`; verify persistent user preferences across page reloads. | **DN-3**: Confirm popover dismisses on outside click and Escape key per `STD-UI-LIFECYCLE-001`. | ⚪ **QUEUED** |
| **Phase 4: SDCA Compilation, Byte Parity & Ecosystem Standards Promotion** | Recompile SDCA modules via `build.cjs`; assert 100% byte parity to `/public`; codify pattern `.agent/patterns/ink-saving-print-themes-and-page-break-orchestration.md`; update `tabular-run-sheet-artisan` skill; pass full regression suite. | **VG-4**: 100% dual-release byte parity; all 64 modular checks green; all 10 deployment gate layers pass with exit code 0; taxonomy 100% clean. | **DN-4**: Formal release readiness sign-off for v2.9.9. | ⚪ **QUEUED** |

---

## 📜 Architectural Invariant (`STD-UI-PRINT-RUNSHEET-002`)

1. **Rule 1 (Zero-Toner Default)**: In all print media styles across all modules, headers, banners, and table headers must never use solid dark backgrounds (`#000000`, `#111111`, `#222222`). Default print styling must use pure white backgrounds (`#ffffff`) with crisp structural borders (`1.5px–2px solid #000000`) and dark text (`#000000` / `#0f172a`).
2. **Rule 2 (Anti-Orphan Header Contract)**: All group/accordion headers that precede tabular data must declare `break-after: avoid !important; page-break-after: avoid !important;` to ensure they never appear detached at the bottom of a page without at least the table header and first row.
3. **Rule 3 (Repeating Column Headers)**: All printable tables must define a `<thead>` with `display: table-header-group !important;`, ensuring the browser repeats column names at the top of every subsequent printed page.
4. **Rule 4 (Configurable Print Sandbox Attributes)**: The scoped print container engine (`skPrintContainer`) must expose declarative configuration options (`theme`, `pageBreaks`) that attach as `data-print-*` attributes to the sandbox `<body>`, allowing CSS rules to adapt deterministically to user print preferences.
