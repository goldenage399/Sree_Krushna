# Implementation Plan: SK-031 Phase 1 — Zero-Ink CSS Wireframe Default & Page-Break Invariants

Invert all heavy solid black printable headers (`#000000` / `#222222`) in `@media print` and the universal print engine (`ui_primitives/scripts/print_engine.js`) into an ink-saving **Executive Wireframe** design (white background, bold 6px left structural border, crisp typography), and enforce deterministic CSS Paged Media invariants (`break-after: avoid` on milestone headers, `display: table-header-group` on `thead`) per `STD-UI-PRINT-RUNSHEET-002` and Architecture Council Ruling `AC-DEC-2026-072` / `UI-DEC-2026-054`.

---

## User Review Required

> [!IMPORTANT]
> **Ink-Saving Executive Wireframe Invariant (`INV-INK-SAVER-001`)**:
> Out-of-the-box, both `@media print` and `window.skPrintContainer` will cease rendering solid black filled header rectangles. Instead, milestone headers will render as:
> - **Background**: `#ffffff !important;` (pure white, zero toner drain)
> - **Typography**: `#0f172a !important;` (deep charcoal/black, crisp contrast)
> - **Structural Borders**: `1.5px solid #0f172a; border-left: 6px solid #0f172a;` (architectural framing)
> - **Count Badge**: `#f8fafc` background with `1px solid #cbd5e1` outline
> This eliminates >95% of printer ink consumption immediately on physical paper and PDF exports, with zero manual PDF editing required.

> [!NOTE]
> **Anti-Orphan Header Invariant (`INV-PAGE-BREAK-ORCH-001`)**:
> - Milestone headers declare `break-after: avoid !important; page-break-after: avoid !important;`. The browser print engine will never strand a milestone header alone at the bottom of a page without its subsequent table.
> - `thead` enforces `display: table-header-group !important;`, repeating the 8-column header row at the top of every subsequent A4 page when a milestone table breaks across multiple sheets.
> - Table rows enforce `break-inside: avoid !important; page-break-inside: avoid !important;`.

---

## Open Questions

None. The architectural strategy was evaluated and certified by unanimous Architecture & UI Council quorum in [`AC-DEC-2026-072` / `UI-DEC-2026-054`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/260928_arch_council_ink_saving_print_themes_and_page_break_orchestration.md).

---

## Proposed Changes

### Shopping Obligations Print Stylesheet

#### [MODIFY] [11_obligations_table_and_print.css](file:///d:/GitHub_Repo/Sree_Krushna/shopping_src/styles/11_obligations_table_and_print.css)
- Inside `@media print`:
  - Refactor `.obl-table-milestone-header`:
    ```css
    .obl-table-milestone-header {
      background: #ffffff !important;
      color: #0f172a !important;
      border: 1.5px solid #0f172a !important;
      border-left: 6px solid #0f172a !important;
      padding: 5px 10px !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      break-after: avoid !important;
      page-break-after: avoid !important;
    }
    .obl-table-milestone-count {
      color: #334155 !important;
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      padding: 1px 6px !important;
      border-radius: 3px !important;
      font-size: 9px !important;
      font-weight: 600 !important;
    }
    ```
  - Enforce repeating table header group:
    ```css
    .obl-data-table thead {
      display: table-header-group !important;
    }
    ```
  - Refactor `.obl-data-table th` to clean wireframe / subtle light gray tint (`#f8fafc !important; border: 1px solid #000000 !important; color: #000000 !important;`).

---

### Universal Scoped Print Engine Primitive

#### [MODIFY] [print_engine.js](file:///d:/GitHub_Repo/Sree_Krushna/ui_primitives/scripts/print_engine.js)
- Inside `defaultStyles`:
  - Update `th`:
    - Change `background: #000000 !important; color: #ffffff !important;` to `background: #f8fafc !important; color: #000000 !important; border: 1.5px solid #000000;`.
  - Update `.obl-table-milestone-header`:
    - Change `background: #222222 !important; color: #ffffff !important;` to `background: #ffffff !important; color: #000000 !important; border: 1.5px solid #000000; border-left: 6px solid #000000; break-after: avoid; page-break-after: avoid;`.
  - Ensure `thead { display: table-header-group; }` is preserved and enforced.

---

### Automated Contract Test Suite

#### [NEW] [test-print-ink-saver-contract.cjs](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-print-ink-saver-contract.cjs)
- Assertions:
  1. `11_obligations_table_and_print.css` declares `background: #ffffff !important` on `.obl-table-milestone-header` in `@media print`.
  2. `11_obligations_table_and_print.css` forbids solid black backgrounds (`background: #000000` or `#222222`) on `.obl-table-milestone-header`.
  3. `11_obligations_table_and_print.css` declares `break-after: avoid` or `page-break-after: avoid` on `.obl-table-milestone-header`.
  4. `11_obligations_table_and_print.css` declares `thead { display: table-header-group !important; }`.
  5. `print_engine.js` declares white/wireframe backgrounds for headers and avoids solid black `#000000` fills.
  6. Line count limits stay below 500 lines per `STD-MOD-COMP-001`.

---

## Verification Plan

### Automated Tests
1. Run new print contract test:
   ```powershell
   node scripts/test-print-ink-saver-contract.cjs
   ```
2. Run density and table budgeting test:
   ```powershell
   node scripts/test-obligations-table-density.cjs
   ```
3. Run structural contracts check:
   ```powershell
   npm run verify:structural-contracts
   ```
4. Run SDCA compilation and byte parity:
   ```powershell
   node shopping_src/build.cjs
   npm run verify:modular-architecture
   ```
5. Run deployment gate:
   ```powershell
   npm run verify:deployment
   ```

### Manual Verification
- Open Chrome DevTools in Print Emulation Mode (`Rendering -> Emulate CSS media type -> print`).
- Inspect `#shoppingObligationsView`:
  - Verify milestone headers render crisp white background with bold 6px left black border and black text.
  - Verify zero solid black filled rectangles across the entire print sheet.
  - Verify table headers repeat cleanly across multi-page table milestone blocks.
