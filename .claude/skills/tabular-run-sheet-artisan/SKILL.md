---
name: tabular-run-sheet-artisan
description: Transform any structured tabular entity or dataset (obligations, trousseau, rituals, samagri, decisions, vendors, financials, tasks, logs) into a high-density, ink-friendly A4 landscape/portrait standalone printable run sheet, canonical Markdown table, and automated parity test suite.
---

# Universal Tabular Run Sheet Artisan & Print Isolation Skill

## Overview

Use this skill whenever you need to turn a complex dataset, data table, or registry into an executive, ink-friendly physical paper run sheet formatted for A4 printing (landscape or portrait).

This skill directly prevents the common catastrophic single-page application (SPA) failure mode where calling browser print dumps **50 to 60 unintended pages** of inactive tabs, navigation chrome, and dark theme backgrounds.

### Standards & Rulings
- **Standard**: `STD-TABULAR-RUN-SHEET-SKILL-001` & `STD-UI-PRINT-CONTAINER-001`
- **Invariants**: `INV-PRINT-ZERO-DUMP-001` / `INV-PRINT-IFRAME-SANDBOX-001` / `INV-LIFECYCLE-02`
- **Rulings**: `AC-DEC-2026-064` / `AC-DEC-2026-065` / `UI-DEC-2026-048` / `UI-DEC-2026-049`
- **Governing Package**: `PKG-007` (Universal Scoped Print Sandbox & Tabular Run Sheet Artisan)

---

<!-- shared:std.agent.tabular-run-sheet-artisan.core:start -->

## The 3 Core Architectural Invariants

1. **`INV-PRINT-ZERO-DUMP-001` (Zero Multi-Tab Global Dump Contract)**:
   - In single-page applications with tab navigation, `@media print` in the global stylesheet (`main.css`) must NEVER unroll all tabs (`.tab-content { display: block !important; }`).
   - In global print mode (Ctrl+P), only the currently active tab (`.tab-content.active`) may be rendered. Inactive tabs (`.tab-content:not(.active)`) MUST be strictly hidden with `display: none !important;`.

2. **`INV-PRINT-IFRAME-SANDBOX-001` (Sandboxed Headless Print Isolation Contract)**:
   - In-app container-scoped print buttons (`[🖨️ Print Table]` / `[🖨️ Print View]`) must execute via `window.sapPrintContainer(targetSelectorOrEl, options)` (or alias `window.skPrintContainer`).
   - The print engine isolates the target HTML into a temporary hidden, same-origin `<iframe>`, injects self-contained ink-saving A4 styles, triggers print, and cleans up the iframe asynchronously.
   - Screen-only UI controls (`.no-print`, buttons, search bars, pagination pills) are stripped automatically before rendering.

3. **`INV-DUAL-RELEASE-BYTE-PARITY` (100% Byte Parity on Standalone Sheets)**:
   - Any standalone printable HTML run sheet emitted in the repository root (`/<name>.html`) must maintain 100% byte-for-byte identity with its public release copy (`/public/<name>.html`).

---

## Turnkey CLI Generation Playbook

To turn any data table or array into an ink-saving run sheet, use the built-in generator script:

```bash
node scripts/generate-tabular-run-sheet.cjs [options]
```

### Common Command Examples:

#### 1. Generate Milestone-Grouped Landscape Run Sheet (e.g. Family Obligations)
```bash
node scripts/generate-tabular-run-sheet.cjs \
  --data js/obligations-data.js \
  --title "Customary Family Obligations Run Sheet" \
  --subtitle "49 Codified Ritual Dayitva & Handover Covenants (Vidhi Dayitva / Bhara / Sara)" \
  --seal "📋 OPERATIONAL RUN SHEET" \
  --orientation landscape \
  --groupBy milestone \
  --columns '[{"key":"code","label":"Code","width":"65px"},{"key":"milestone","label":"Milestone","width":"75px"},{"key":"obligorFamily","label":"Obligor","width":"65px"},{"key":"recipientParty","label":"Recipient","width":"75px"},{"key":"title","label":"Item / Covenant","width":"auto"},{"key":"category","label":"Category","width":"75px"},{"key":"cashHonorarium","label":"Dakshina / Cash","width":"85px"}]' \
  --outputHtml family-obligations-run-sheet.html \
  --outputMd 02_RITUALS_CULTURE/obligations/family_obligations_table.md
```

#### 2. Generate Commercial Procurement Catalog Run Sheet
```bash
node scripts/generate-tabular-run-sheet.cjs \
  --data js/shopping-data.js \
  --title "Commercial Procurement Sourcing Catalog" \
  --subtitle "Canonical Sourcing Catalog & Vendor Specifications" \
  --orientation landscape \
  --groupBy chapter \
  --outputHtml trousseau-run-sheet.html
```

---

## In-App Container Print Integration (`STD-UI-PRINT-CONTAINER-001`)

To wire a scoped print button to any container or table inside a live web application:

1. **Import the Shared Primitive**:
   Ensure `js/print_engine.js` (or `ui_primitives/scripts/print_engine.js`) is included in the build or loaded in the template.

2. **Add the Scoped Print Button**:
   In your component template, add a button invoking your controller handler:
   ```html
   <button type="button" class="btn btn-secondary" onclick="window.printMyTableContainer()" title="Print Scoped Run Sheet (A4 Landscape)">
     <span>🖨️</span> Print Table
   </button>
   ```

3. **Wire Controller Handler**:
   In your component controller:
   ```javascript
   function printMyTableContainer() {
     const tableEl = document.querySelector('#myTableContainer');
     const printFn = window.sapPrintContainer || window.skPrintContainer;
     if (typeof printFn === 'function' && tableEl) {
       printFn(tableEl, {
         title: 'My Custom Run Sheet Title',
         subtitle: 'Subtitle / Active Filter State',
         orientation: 'landscape', // 'landscape' or 'portrait'
         pageSize: 'A4',
         margin: '8mm 10mm',
         includeSignoff: true // Appends coordinator & elder sign-off lines
       });
     } else {
       window.print();
     }
   }
   window.printMyTableContainer = printMyTableContainer;
   ```

---

## Standard Print CSS Tokens & Typography Rules

When designing custom tabular run sheets, enforce these standard specifications:

| Dimension | Specification |
|---|---|
| **Orientation** | **Landscape** for ≥5 columns; **Portrait** for ≤4 narrow columns |
| **Page Size & Margins** | `@page { size: A4 [orientation]; margin: 8mm 10mm; }` |
| **Color Fidelity** | Pure black (`#000000`) text on white (`#ffffff`) background; zero dark toner fills |
| **Table Header** | `th { background: #000000 !important; color: #ffffff !important; }` with `display: table-header-group;` so headers repeat on multi-page overflows |
| **Row Break Avoidance** | `tr { page-break-inside: avoid; }` to prevent half-cut text across page margins |
| **Checkboxes** | `display: inline-block; width: 13px; height: 13px; border: 1.5px solid #000000; border-radius: 2px;` |
| **Sign-Off Block** | Signature lines for *Coordinator / Lead* and *Approval Authority* with `page-break-inside: avoid;` |

<!-- shared:std.agent.tabular-run-sheet-artisan.core:end -->
