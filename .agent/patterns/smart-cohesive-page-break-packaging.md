---
pattern: smart-cohesive-page-break-packaging
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: .agent/skills/tabular-run-sheet-artisan/SKILL.md
    at: "Universal Tabular Run Sheet Artisan & Print Isolation Skill"
  - file: enhancement-notes/SK-032/00_ENHANCEMENT_INDEX.md
    at: "Phase 4"
portability: universal
canonical_source: sree-krushna
porting_effort: low
---

<!-- shared:std.agent.pattern.core -->
# Pattern: Smart Cohesive Page-Break Orchestration & Cross-Repo Tabular Packaging (`STD-UI-PRINT-RUNSHEET-003`)

**Identifier**: `PAT-PAGE-COHESION-001` / `STD-UI-PRINT-RUNSHEET-003`  
**Classification**: Universal UI Print Architecture / Tabular Layout Engine  
**Origin Decisions**: `AC-DEC-2026-075`, `UI-DEC-2026-055` (SK-032)  
**Invariants**: `INV-PAGE-COHESION-001`, `INV-GIANT-TABLE-DEGRADATION-001`, `INV-COHESIVE-TOKEN-001`, `INV-PAGINATION-SPECTRUM-001`  
**Cross-Repo Portability**: Universal (`Sree_Krushna`, `Task-Dashboard`, `OperatusOS`)  

---

## 1. Problem Statement & Symptom Profile

In complex printable web applications (event run sheets, family obligations registers, trousseau catalogs, financial ledgers, and operational task checklists), tabular data is grouped into logical milestones or sections. Standard browser paged-media rendering exhibits two polarizing failure modes:

1. **Awkward Stranded Slicing (Fluid Pagination)**:
   When rendering multiple milestone tables sequentially, browser print layout engines pack rows continuously. If a milestone block begins near the bottom of Page 1 and cannot fit completely, the browser slices it:
   - The milestone header and 1–2 rows are printed stranded at the bottom of Page 1.
   - The remaining 10 rows print on Page 2.
   - Coordinators in physical event environments miss critical context because the milestone is fractured across physical sheets.

2. **Extreme Paper Waste (Rigid 1-Milestone-Per-Page)**:
   Forcing `break-before: page` unconditionally on every milestone creates severe paper bloat. A milestone with only 2–3 items consumes an entire physical sheet, leaving 85% of the page blank.

---

## 2. Architectural Invariants

### `INV-PAGE-COHESION-001`: Declarative Block Cohesion
In cohesive print mode (`data-print-pagebreak="cohesive"`), section and milestone containers must declare:
```css
body[data-print-pagebreak="cohesive"] .obl-table-milestone-block,
body[data-print-pagebreak="cohesive"] .shop-table-group,
body[data-print-pagebreak="cohesive"] .sk-print-cohesive-block,
.sk-print-cohesive-block {
  break-inside: avoid !important;
  page-break-inside: avoid !important;
}
```
**Pagination Behavior**:
- **Fit**: If the remaining vertical space on the current sheet is sufficient to hold the entire milestone block, it packs fluidly beneath previous blocks on the same page.
- **Eviction**: If the remaining space is insufficient to hold the block intact, native CSS Fragmentation Level 3 automatically pushes the **entire block** to the top of the next page as an unbroken cohesive unit.

### `INV-GIANT-TABLE-DEGRADATION-001`: Graceful Giant Table Degradation
When a cohesive block's height exceeds the total usable height of a single physical A4 page:
- W3C CSS Fragmentation rules dictate that `break-inside: avoid` cannot be satisfied on a single sheet.
- The engine begins the giant block at the top of a fresh sheet and fragments rows gracefully across subsequent sheets.
- Header repetition contract (`thead { display: table-header-group !important; }`) ensures column titles repeat at the top of every subsequent overflow page.

### `INV-COHESIVE-TOKEN-001`: Universal Ecosystem Token (`.sk-print-cohesive-block`)
Any printable container, table wrapper, or card cluster across any ecosystem repository decorated with `.sk-print-cohesive-block` automatically participates in cohesive packaging without requiring repo-specific selectors.

### `INV-PAGINATION-SPECTRUM-001`: 3-Tier Configurable Pagination Spectrum
The pre-print options dialog exposes three explicit, user-selectable pagination behaviors:
1. `cohesive` (**Smart Cohesive Flow — Default / Recommended**): Multiple milestones share a sheet; overflowing blocks move intact to the next page.
2. `fluid` (**Dense Fluid Flow**): Space-saving continuous packing that breaks freely between rows (`break-inside: auto !important;`), optimal for quick scratch drafts.
3. `milestones` (**Milestone per Page**): Strict 1-milestone-per-page (`break-before: page !important;`), optimal for formal physical ring-binder dossiers.

---

## 3. Scoped Print Engine Implementation

In the scoped print sandbox (`ui_primitives/scripts/print_engine.js`), the engine normalizes legacy parameters and injects the corresponding attribute into the isolated print iframe `<body>`:

```javascript
// Normalize preferences with cohesive default
var pageBreaks = (options.pageBreaks === 'milestones' || options.pageBreaks === 'fluid')
  ? options.pageBreaks
  : 'cohesive';

// Stamp onto sandbox body
var printBody = printDoc.body;
printBody.setAttribute('data-print-pagebreak', pageBreaks);
```

### Pre-Print Options Dialog Markup
```html
<div class="sk-print-opt-group">
  <label class="sk-print-opt-label">Pagination & Page Breaks</label>
  <div class="sk-print-radio-stack">
    <label class="sk-print-radio-pill">
      <input type="radio" name="skPrintPageBreak" value="cohesive" checked>
      <span class="sk-print-radio-text">
        <strong>Smart Cohesive Flow (Recommended)</strong>
        <small>Fits multiple milestones per page; moves overflowing blocks to next page intact</small>
      </span>
    </label>
    <label class="sk-print-radio-pill">
      <input type="radio" name="skPrintPageBreak" value="fluid">
      <span class="sk-print-radio-text">
        <strong>Dense Fluid Flow</strong>
        <small>Continuous compact flow, breaks rows freely across pages</small>
      </span>
    </label>
    <label class="sk-print-radio-pill">
      <input type="radio" name="skPrintPageBreak" value="milestones">
      <span class="sk-print-radio-text">
        <strong>Milestone per Page</strong>
        <small>Forces each milestone onto a fresh sheet for formal dossiers</small>
      </span>
    </label>
  </div>
</div>
```

---

## 4. Verification Gate

Compliance is automated via `scripts/test-print-cohesion-contract.cjs`:
1. **Rule 1 Asserted**: `data-print-pagebreak="cohesive"` applies `break-inside: avoid !important; page-break-inside: avoid !important;` to `.sk-print-cohesive-block`.
2. **Rule 2 Asserted**: `data-print-pagebreak="fluid"` overrides to `break-inside: auto !important;`.
3. **Rule 3 Asserted**: `data-print-pagebreak="milestones"` applies `break-before: page !important;`.
4. **Rule 4 Asserted**: Modal template exposes all three options (`cohesive`, `fluid`, `milestones`) with `cohesive` as default checked.
5. **Rule 5 Asserted**: Preferences parser safely normalizes undefined, invalid, or legacy inputs to `'cohesive'`.
