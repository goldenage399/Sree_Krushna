---
pattern: table-cell-display-model-isolation-and-slack-budgeting
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: docs/references/SPEC-ARCH-MUTABLE-TABLE-001.md
    at: "FKL-DI-027"
triggers: []
portability: universal
canonical_source: sree-krushna
porting_effort: low
---

# Table-Cell Display Model Isolation & Proportional Slack Budgeting (`INV-TABLE-DOM-001` / `STD-TABLE-BUDGET-001`)

**Category**: UI/UX Layout, CSS Box Model Architecture & Print Preservation  
**Applies to**: High-density data tables, spreadsheet views, run sheets, and multi-viewport tabular displays with text truncation  
**Origin**: 2026-09-28 (`INC-102`, `AC-DEC-2026-071` / `UI-DEC-2026-053`, `SK-029`)  
**Status**: VALIDATED  

---

## 1. Problem & Context

In data-heavy operational interfaces, developers often need to limit long multi-line text (e.g. descriptions, items lists, notes) to a fixed number of rows (e.g. 3 lines) to prevent vertical row blowout across table rows.

A common implementation pitfall is applying CSS `-webkit-line-clamp` directly to a table cell (`<td>`):
```css
/* ❌ ANTI-PATTERN: Applying line-clamp directly on td */
.data-table td.specs {
  width: 220px;
  max-width: 260px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### The Three Cascading Failure Modes
1. **Broken Table Formatting Context (Display Override on `<td>`)**:
   A table cell's native display model is `display: table-cell`. When overridden with `display: -webkit-box;`, modern browser rendering engines (Blink/Chromium, WebKit) detach the cell from the table's column width calculation and horizontal slack distribution algorithm. The cell behaves as an isolated inline/block formatting box locked to its declared pixel width (`220px`).
2. **Asymmetric Slack Absorption under `table-layout: auto`**:
   In `table-layout: auto`, when a `width: 100%` table container expands on wide monitors, the browser distributes available slack space exclusively to columns whose `<td>` cells have unconstrained flexibility. Neighboring columns (such as Title/Description) expand to hundreds of extra pixels, while the clamped column remains starved at 220px with awkward empty gaps.
3. **Premature Truncation on Ultra-Wide Monitors**:
   Users on 1440px–1920px screens see multi-bullet specifications prematurely truncated to 3 lines with ellipsis (`...`) even when extensive blank horizontal space sits unused across the row.

---

## 2. Invariant: Table-Cell Display Model Isolation (`INV-TABLE-DOM-001`)

> **Prime Invariant**: *Table cells (`<td>`, `<th>`) must never have `display: -webkit-box`, `display: flex`, or `display: grid` applied directly. All text clamping, flex alignment, and overflow constraints must be encapsulated inside a dedicated child container.*

### The Clean Structural Pattern
```html
<!-- ✅ CORRECT: Native table-cell td with inner clamp container -->
<td class="obl-td-specs">
  <div class="obl-specs-clamp" title="${fullTextTooltip}">
    • ${itemsContent}
  </div>
</td>
```

```css
/* Cell maintains natural table formatting context */
.obl-td-specs {
  font-size: 11px;
  color: #e2e8f0;
  vertical-align: top;
}

/* Inner container isolates line-clamp */
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

---

## 3. Invariant: Proportional Table Budgeting (`STD-TABLE-BUDGET-001`)

To guarantee deterministic, jitter-free column allocation across all screen viewports, tables with multiple descriptive text columns must declare:
```css
.obl-data-table {
  width: 100%;
  table-layout: fixed; /* Deterministic column geometry */
  border-collapse: collapse;
}
```

Column widths are declared proportionally on the `<th>` row:
- Primary descriptive columns (e.g. Title 30%, Specs 25%) are allocated balanced percentage shares (within a 1.0–1.3x ratio).
- Numerical and status columns receive compact fixed percentages (Code 8%, Dir 12%, Cat 9%, Cash 8%, Sourced 8%).
- On desktop viewports, both descriptive columns scale harmoniously with container width.

---

## 4. Multi-Viewport & Print Run-Sheet Contract

### 4.1 Responsive Horizontal Scroll (<1024px)
On tablet and mobile viewports, the table container enforces:
```css
.obl-table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.obl-data-table {
  min-width: 880px; /* Protects minimum readable column widths */
}
```

### 4.2 Zero-Truncation Print Preservation (`INV-COLLAPSIBLE-PRINT-001`)
In `@media print` and container print streams (`window.skPrintContainer`), the inner clamp container unclamps completely:
```css
@media print {
  .obl-td-specs {
    display: table-cell !important;
    max-width: none !important;
    overflow: visible !important;
  }
  .obl-specs-clamp {
    display: block !important;
    -webkit-line-clamp: unset !important;
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
  }
  .obl-data-table tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
```

---

## 5. Verification Checklist

1. [x] **Zero Display Overrides on `<td>`**: Grep CSS for `\.obl-td-.*display:\s*-webkit-box` returns 0 matches.
2. [x] **Inner Clamp Container**: Every cell with text-overflow clamping nests a `<div class="*-clamp">`.
3. [x] **Deterministic Fixed Layout**: Master table declares `table-layout: fixed; width: 100%;`.
4. [x] **Print Unclamping**: `@media print` unclamps the inner container with `-webkit-line-clamp: unset !important;`.
5. [x] **Automated Density Gate**: Automated script (`scripts/test-obligations-table-density.cjs`) validates that cells avoid `-webkit-box` and that inner wrappers enforce clamping.
