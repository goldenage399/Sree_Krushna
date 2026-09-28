# SK-032: Smart Cohesive Page-Break Orchestration & Cross-Repo Tabular Packaging

## 📊 Metadata
- **Category**: UI QUALITY / PRINTS / ARCHITECTURE / ECOSYSTEM
- **Priority**: HIGH
- **Status**: IN_PLANNING
- **Estimate**: 4 Phases
- **Target Release**: v2.9.9
- **Risk Level**: LOW
- **Council Ruling**: `AC-DEC-2026-075` / `UI-DEC-2026-055` (FULL COUNCIL CERTIFIED, 2026-09-28)
- **Governing Standard**: `STD-UI-PRINT-RUNSHEET-003` / `INV-PAGE-COHESION-001`
- **Cluster**: UI Quality Enhancement Cluster

## 🔗 Dependencies
- **Depends On**: `SK-031` (Universal ink-saving print engine & page-break orchestration), `SK-029` (Proportional table budgeting & print unclamping)
- **Blocks**: None

## 🎯 Goal

Eliminate the awkward pagination defect where milestone/section tables get sliced near the bottom of a page with only the header and 1–2 rows stranded before the page break:
1. **Smart Cohesive Block Packaging (`INV-PAGE-COHESION-001`)**:
   Implement intelligent cohesive pagination:
   - Multiple milestone blocks that fit on a single page share that page fluidly.
   - When a milestone block cannot fit in the remaining height of the current page, the *entire milestone block* automatically moves to the top of the next page as a complete cohesive unit rather than being awkwardly sliced across the page boundary.
2. **Universal Ecosystem Standard Token (`.sk-print-cohesive-block`)**:
   Standardize a repo-agnostic class (`.sk-print-cohesive-block`) under `STD-UI-PRINT-RUNSHEET-003`, allowing any table, card cluster, or checklist section across `Sree_Krushna`, `Task-Dashboard`, and `OperatusOS` to achieve cohesive packaging out-of-the-box.
3. **3-Tier Configurable Pagination Spectrum**:
   Upgrade the Pre-Print Options Dialog to provide three distinct operational modes:
   - `cohesive` (**Smart Cohesive Flow — Default / Recommended**): Multiple milestones share a sheet; incomplete blocks move to the next page as cohesive units.
   - `fluid` (**Dense Fluid Flow**): Space-saving fluid packing that breaks freely between rows, best for compact drafts.
   - `milestones` (**Milestone per Page**): Strict 1-milestone-per-page for formal physical ring-binder dossiers.
4. **Automated Verification Gate**:
   Introduce `scripts/test-print-cohesion-contract.cjs` to enforce cohesive break rules and 3-tier preference parsing.

---

## 4-Phase Definition of Done (DoD v1.7) & Sequential Phasing

| Phase | Scope & Deliverables | Validation Gate (VG) | Decision Node (DN) | Status |
|---|---|---|---|---|
| **Phase 1: Declarative Block Cohesion Engine & Core Test Harness** | Implement `data-print-pagebreak="cohesive"` with `break-inside: avoid !important` in `12_print_themes_and_options.css` and `ui_primitives/scripts/print_engine.js`; support `.obl-table-milestone-block`, `.shop-table-group`, and `.sk-print-cohesive-block`; author `scripts/test-print-cohesion-contract.cjs`. | **VG-1**: `node scripts/test-print-cohesion-contract.cjs` passes 100% green; `break-inside: avoid` asserted on cohesive selectors. | **DN-1**: Confirm modern browser print engines push overflowing blocks to next page cleanly without layout loops. | ✅ **COMPLETED** |
| **Phase 2: 3-Tier Pre-Print Configuration Modal Upgrade** | Upgrade `ui_primitives/components/print_options_modal.html` and `ui_primitives/scripts/print_engine.js` to expose 3-way pagination options (`cohesive`, `fluid`, `milestones`); update preferences parser and sync logic. | **VG-2**: Headless lifecycle test verifying all 3 pagination radio values pass correctly to `skPrintContainer` and persist in `localStorage`. | **DN-2**: Confirm modal layout maintains 300px mobile responsiveness and passes `STD-UI-LIFECYCLE-001`. | ✅ **COMPLETED** |
| **Phase 3: Consumer Integration & Visual Layout Verification** | Tag obligations tables and catalog groups with `.sk-print-cohesive-block`; verify Family Obligations Register and Canonical Trousseau Catalog in both screen preview and print emulation. | **VG-3**: Automated integration test verifying zero broken milestone blocks in simulated multi-milestone print stream. | **DN-3**: Host review confirming multi-milestone packing on Page 1 with clean unbroken block eviction. | 🟡 **IN_PROGRESS / READY** |
| **Phase 4: SDCA Compilation, Byte Parity & Ecosystem Standards Promotion** | Recompile SDCA modules via `build.cjs`; assert 100% byte parity to `/public`; update `tabular-run-sheet-artisan` skill; codify pattern in `.agent/patterns/`; pass full regression suite. | **VG-4**: 100% dual-release byte parity; all 69 modular checks green; all 10 deployment gate layers pass with exit code 0; taxonomy 100% clean. | **DN-4**: Formal release readiness sign-off for v2.9.9. | ⚪ **QUEUED** |

---

## 📜 Architectural Invariant (`STD-UI-PRINT-RUNSHEET-003`)

1. **Rule 1 (Declarative Block Cohesion)**: In cohesive print mode (`data-print-pagebreak="cohesive"`), section and milestone containers must declare `break-inside: avoid !important; page-break-inside: avoid !important;`. The browser print engine must never slice a block when insufficient space remains on the current page; it must push the whole block to the next page.
2. **Rule 2 (Graceful Giant Table Degradation)**: When a cohesive block's total height exceeds the total height of a single A4 page, native CSS fragmentation must start the block at the top of a fresh page and fragment gracefully across subsequent pages, repeating the table header via `thead { display: table-header-group !important; }`.
3. **Rule 3 (Universal Token Portability)**: Any element decorated with `.sk-print-cohesive-block` must be treated as an atomic print unit across all repository modules.
4. **Rule 4 (3-Tier Spectrum Continuity)**: The user must always retain the ability to choose between dense fluid flow (`fluid`), smart cohesive flow (`cohesive`), and rigid single-milestone flow (`milestones`) in the pre-print options dialog.
