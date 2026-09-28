---
pattern: ink-saving-print-themes-and-page-break-orchestration
activation_tier: reference
status: ACTIVE
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/skills/tabular-run-sheet-artisan/SKILL.md
    at: "Universal Tabular Run Sheet Artisan & Print Isolation Skill"

portability: universal
canonical_source: sree-krushna
porting_effort: low
---

# Ink-Saving Print Themes & Page-Break Orchestration

**Standard ID**: `STD-UI-PRINT-RUNSHEET-002` / `STD-UI-PRINT-CONTAINER-001`  
**Council Ruling**: `AC-DEC-2026-072` / `UI-DEC-2026-054`  
**Invariants**: `INV-INK-SAVER-001`, `INV-PAGE-BREAK-ORCH-001`, `INV-PRINT-ZERO-DUMP-001`, `INV-PRINT-IFRAME-SANDBOX-001`  
**Applies to**: All printable web views, tabular run sheets, physical handovers, and PDF exports across `Sree_Krushna`, `Task-Dashboard`, and `OperatusOS`.

---

## 1. Problem Statement

Two recurring failure modes compromise physical run sheet printing and PDF generation in modern web applications:

1. **Printer Toner Depletion via Dark Fill Banners (`INV-INK-SAVER-001`)**:
   Web tables and dashboards often render grouping headers and table column headers with solid dark fills (`#000000`, `#111111`, `#222222`). While visually striking on OLED monitors, when printed to physical paper, this causes:
   - Severe printer ink/toner depletion (>90% wasted on solid blocks).
   - Damp, soggy physical paper that curls and smudges.
   - Forcing users to manually edit colors with external PDF editor tools before printing.

2. **Orphaned Accordion Milestone Headers (`INV-PAGE-BREAK-ORCH-001`)**:
   Standard browser print pagination does not inherently respect accordion milestone groupings. When a table overflows a page margin:
   - A milestone header can be printed as an isolated single line at the very bottom of Page 1, while its data table prints on Page 2.
   - Column headers are not repeated across page breaks, forcing coordinators to flip back and forth between sheets to read 8-column data.
   - Table rows get sliced in half horizontally across physical page margins.

---

## 2. The Solution: Architectural Invariants

### 2.1 Zero-Toner Executive Wireframe Default (`INV-INK-SAVER-001`)
In `@media print` and scoped container print sandboxes, solid black filled backgrounds are strictly prohibited:
```css
/* Executive Wireframe Milestone Header */
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

/* Repeating Clean Wireframe Column Headers */
.obl-data-table thead {
  display: table-header-group !important;
}

.obl-data-table th {
  background: #f8fafc !important;
  color: #000000 !important;
  border: 1px solid #000000 !important;
  font-size: 8.5px !important;
  font-weight: 700 !important;
}

/* Row Integrity Contract */
.obl-data-table tr {
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}
```

### 2.2 Deterministic CSS Paged Media Orchestration (`INV-PAGE-BREAK-ORCH-001`)
- **Anti-Orphan Header Contract**: All grouping headers preceding data tables must enforce `break-after: avoid !important; page-break-after: avoid !important;`. The browser engine will never strand a milestone header alone at the bottom of a page.
- **Repeating Column Headers**: All `<thead>` elements must declare `display: table-header-group !important;`, ensuring the browser automatically repeats column headers at the top of every subsequent printed page.
- **Torn Row Prevention**: All `<tr>` elements must declare `break-inside: avoid !important; page-break-inside: avoid !important;`.

### 2.3 Configurable Print Sandbox Attributes (`STD-UI-PRINT-RUNSHEET-002`)
The scoped print engine (`skPrintContainer(target, options)`) accepts declarative configurations and stamps them directly onto the sandbox `<body>`:
```html
<body data-print-theme="eco" data-print-pagebreak="smart">
```

Supported Themes:
- `eco` (Default): 100% white background, clean charcoal text, crisp architectural borders (0% toner drain).
- `tint`: Subtle 4% gray header fill (`#f1f5f9`), slate border framing (`#64748b`) for formal physical briefings.
- `contrast`: High-contrast solid dark banner (`#0f172a`) for digital screen PDF distribution.

Supported Page Breaks:
- `smart` (Default): Fluid flow with orphan suppression and repeating headers.
- `milestones`: Forces each major event/milestone block onto a fresh A4 sheet for ring-binder dossiers:
  ```css
  body[data-print-pagebreak="milestones"] .obl-table-milestone-block:not(:first-child),
  body[data-print-pagebreak="milestones"] .shop-table-group:not(:first-child) {
    break-before: page !important;
    page-break-before: always !important;
    margin-top: 0 !important;
  }
  ```

---

## 3. Implementation Checklist for New Modules

1. **Audit `@media print` Selectors**:
   - Ensure all `th`, `.header`, `.banner`, and milestone headers declare white/light backgrounds.
   - Assert zero occurrences of `background: #000000` or `background: #222222`.
2. **Apply Paged Media Rules**:
   - Declare `break-after: avoid !important;` on milestone and section headers.
   - Declare `display: table-header-group !important;` on all `<thead>`.
   - Declare `break-inside: avoid !important;` on all `<tr>`.
3. **Use Scoped Print Engine**:
   - Always route print actions through `window.skPrintContainer(container, options)` or `window.skOpenPrintOptionsModal(config)`.
   - Never call naked `window.print()` directly on the full SPA without container isolation (`INV-PRINT-ZERO-DUMP-001`).
4. **Pre-Print User Customization**:
   - Provide a companion `[⚙️]` options button next to the primary print button so users can toggle between Eco Wireframe, Executive Tint, and High Contrast.
   - Persist user choices in `localStorage` under `sk_print_options`.
