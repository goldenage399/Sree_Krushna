# Phase 1 Implementation Plan: Family Obligations Printable Run Sheet & Tabular Baseline (SK-022)

Authoritative standard: `STD-SHOPPING-OBLIGATION-002` / `AC-DEC-2026-064` / `UI-DEC-2026-048`  
Governing Ticket: [`enhancement-notes/SK-022/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-022/00_ENHANCEMENT_INDEX.md)

---

## User Review Required

> [!IMPORTANT]
> **Plan Hard-Stop & Phasing Discipline**:
> Per `AC-DEC-2026-044` and `STD-PHASED-DEV-001`, this implementation plan covers **Phase 1 only**. 
> Phase 1 delivers the immediate standalone printable HTML run sheet (`public/family-obligations-run-sheet.html`), canonical Markdown table (`02_RITUALS_CULTURE/obligations/family_obligations_table.md`), and automated test script (`scripts/test-obligations-table.cjs`).
> The live in-app dual-layout switcher (`[🗂️ Cards] ⟷ [📊 Table]`) and `@media print` enhancements to `shopping_src/` will follow in Phase 2 & Phase 3 upon completion of Phase 1.

---

## Open Questions

> [!NOTE]
> None blocking Phase 1 execution. All 49 obligations are already canonically codified in `js/obligations-data.js` and `02_RITUALS_CULTURE/obligations/OBL-001.md` through `OBL-049.md`.

---

## Proposed Changes

### Standalone Printable Surfaces & Test Suite

#### [NEW] [family-obligations-run-sheet.html](file:///d:/GitHub_Repo/Sree_Krushna/family-obligations-run-sheet.html) & [public/family-obligations-run-sheet.html](file:///d:/GitHub_Repo/Sree_Krushna/public/family-obligations-run-sheet.html)
- Standalone, ink-friendly A4 landscape printable HTML file.
- Clean high-contrast black-and-white styling with `@page { size: A4 landscape; margin: 10mm; }`.
- Milestone-grouped tables across all 6 canonical wedding milestones + post-wedding reciprocals.
- 9 columns: Code, Direction (Obligor ⟶ Recipient), Title & Description, Category, Items & Specs, Financial / Cash, Sourcing Ref (`TRS-###`), Handover Timing / Venue, and Sign-off Box (`[ ] Done`).
- Zero external CDNs; loads directly in any browser for instant `Ctrl+P` printing.

#### [NEW] [02_RITUALS_CULTURE/obligations/family_obligations_table.md](file:///d:/GitHub_Repo/Sree_Krushna/02_RITUALS_CULTURE/obligations/family_obligations_table.md)
- Canonical high-density Markdown reference table containing all 49 obligations sorted chronologically by ritual milestone.
- Links to spoke documents (`OBL-###.md`) and downstream commercial shopping references (`TRS-###`).

#### [NEW] [scripts/test-obligations-table.cjs](file:///d:/GitHub_Repo/Sree_Krushna/scripts/test-obligations-table.cjs)
- Automated verification script asserting:
  1. Exactly 49 obligations are represented in the generated table.
  2. All 6 milestone groups (`EVT-001` through `EVT-006` + `POST_WEDDING`) are present.
  3. No empty cells for obligor, recipient, or category.
  4. 100% byte parity between root and `/public` printable HTML files.

---

## Verification Plan

### Automated Tests
- `node scripts/test-obligations-table.cjs` (Must pass with 49/49 obligations verified).
- `node scripts/test-shopping-registry.cjs` (Ensure no regressions on existing shopping data).

### Manual Verification
1. Open `public/family-obligations-run-sheet.html` in browser.
2. Trigger `Ctrl+P` (Print Preview) and verify:
   - A4 landscape pagination with zero card clipping.
   - High-contrast pure black-on-white layout with zero dark ink waste.
   - Milestone headers cleanly dividing ritual stages.
