# Implementation Plan: SK-029 Phase 1 — Structural Decoupling & Test Contract Update

Resolve the asymmetric table column expansion defect where `Customary Title & Description` absorbs all available table width while `Items / Specifications` is locked at 220px. Phase 1 decouples the line-clamp styling from the table cell (`<td>`) into a dedicated child container (`<div class="obl-specs-clamp">`), restores native `display: table-cell` to `.obl-td-specs`, and upgrades the density test suite to assert the new structural contract.

## User Review Required

> [!IMPORTANT]
> **Structural Decoupling (`INV-TABLE-DOM-001`)**: 
> In `shopping_src/scripts/controller.js`, `td.obl-td-specs` currently outputs:
> ```html
> <td class="obl-td-specs" title="...">• ${itemsText}</td>
> ```
> This will be refactored to:
> ```html
> <td class="obl-td-specs">
>   <div class="obl-specs-clamp" title="${escapeHtml(itemsTooltip)}">• ${itemsText}</div>
> </td>
> ```
> In `shopping_src/styles/11_obligations_table_and_print.css`, `display: -webkit-box`, `-webkit-line-clamp: 3`, and `overflow: hidden` are removed from `.obl-td-specs` and applied strictly to `.obl-specs-clamp`. This restores natural table cell expansion capability to `.obl-td-specs`.

> [!NOTE]
> **Proportional Column Budgeting (`STD-TABLE-BUDGET-001`)**:
> `table-layout: fixed; width: 100%;` will be applied to `.obl-data-table` in Phase 2 with explicit column percentage budgets (Code: 8%, Dir: 12%, Title: 30%, Cat: 9%, Specs: 25%, Cash: 8%, Sourced: 8%). Phase 1 establishes the structural foundation and updates tests to prevent regressions.

## Open Questions

None. The architectural strategy was evaluated and certified by unanimous Architecture & UI Council quorum in [`AC-DEC-2026-071` / `UI-DEC-2026-053`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Council/260928_arch_council_multi_viewport_fluid_table_budgeting_and_print_run_sheet.md).

---

## Proposed Changes

### Shopping Module Component & Controller

#### [MODIFY] [controller.js](file:///d:/GitHub_Repo/Sree_Krushna/shopping_src/scripts/controller.js#L4323)
- In `renderObligationsTable()` around line 4323, wrap the cell contents of `.obl-td-specs` inside `<div class="obl-specs-clamp" title="${escapeHtml(itemsTooltip)}">• ${itemsText}</div>`.
- Ensure clean tag balancing and proper escaping.

---

### Obligations Table & Print Stylesheet

#### [MODIFY] [11_obligations_table_and_print.css](file:///d:/GitHub_Repo/Sree_Krushna/shopping_src/styles/11_obligations_table_and_print.css#L141-L153)
- Remove `display: -webkit-box`, `-webkit-line-clamp: 3`, `-webkit-box-orient: vertical`, and `overflow: hidden` from `.obl-td-specs`.
- Introduce `.obl-specs-clamp`:
  ```css
  .obl-specs-clamp {
    width: 100%;
    line-height: 1.4;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  ```
- In `@media print`, update unclamping rules to target `.obl-specs-clamp`:
  ```css
  .obl-specs-clamp {
    display: block !important;
    -webkit-line-clamp: unset !important;
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
  }
  ```

---

### Density & Regression Test Suite

#### [MODIFY] [test-obligations-table-density.cjs](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-obligations-table-density.cjs)
- Update test assertions:
  1. Verify `.obl-td-specs` retains native table-cell display and has removed `-webkit-box`.
  2. Verify `.obl-specs-clamp` declares `line-clamp: 3` and `overflow: hidden`.
  3. Verify `@media print` unclamps `.obl-specs-clamp`.
  4. Verify `controller.js` renders `<div class="obl-specs-clamp">` inside `<td class="obl-td-specs">`.

---

## Verification Plan

### Automated Tests
- Run updated density test:
  ```powershell
  node scripts/test-obligations-table-density.cjs
  ```
- Run structural contract checks:
  ```powershell
  node scripts/check-html-balance.cjs
  npm run verify:structural-contracts
  ```
- Run SDCA compilation and byte parity:
  ```powershell
  node shopping_src/build.cjs
  npm run verify:modular-architecture
  ```
- Run obligations test:
  ```powershell
  npm run test:obligations
  ```

### Manual Verification
- Launch local HTTP server: `npx http-server -p 8080 -c-1`
- Open `http://localhost:8080/shopping-registry.html?subview=obligations` in browser.
- Inspect `td.obl-td-specs` with DevTools: verify it now flexes smoothly without being locked to 220px.
- Verify text truncates to 3 lines with ellipsis via `.obl-specs-clamp`.
- Trigger print preview (Ctrl+P): verify all lines unclamp cleanly for A4 landscape paper run sheet.
