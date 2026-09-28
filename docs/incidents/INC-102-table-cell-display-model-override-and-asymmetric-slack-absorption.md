# INC-102: Table-Cell Display Model Override & Asymmetric Slack Absorption

**Incident Reference:** `INC-102`  
**Date:** 2026-09-28  
**Severity:** MEDIUM (Presentation-Layer Defect / Ergonomic Degradation)  
**Governing Standard:** `STD-TABLE-BUDGET-001` / `INV-TABLE-DOM-001` / `INV-COLLAPSIBLE-PRINT-001`  
**Governing Ticket:** `SK-029` ([`enhancement-notes/SK-029/00_ENHANCEMENT_INDEX.md`](file:///d:/GitHub_Repo/Sree_Krushna/enhancement-notes/SK-029/00_ENHANCEMENT_INDEX.md))  
**Council Certification:** `AC-DEC-2026-071` / `UI-DEC-2026-053`  

---

## 1. Executive Summary

During testing of the Family Obligations spreadsheet table (`#shoppingObligationsView` / `.obl-data-table`), Chrome DevTools inspection revealed that Column 1 (`Items / Specifications` / `.obl-td-specs`) was locked to a rigid box of `220px × 63.8px`, while Column 2 (`Customary Title & Description` / `.obl-td-title`) greedily expanded across hundreds of pixels of widescreen slack space. On 1440px–1920px viewports, multi-bullet liturgical specifications prematurely wrapped and truncated into ellipses (`...`) after 3 lines despite extensive blank whitespace sitting unused across the row.

---

## 2. Architectural Surface Mapping

Per `post-incident-governance.md` Validation Gate 1, all 6 architectural surfaces were assessed:

| Surface | Impact Status | Technical Justification |
| :--- | :--- | :--- |
| **1. UI Surface** | **AFFECTED (Primary)** | `display: -webkit-box` on `<td>` broke native table-cell formatting; `.obl-td-specs` remained locked to 220px while `.obl-td-title` absorbed 100% of slack width in `table-layout: auto`. Resolved by moving line-clamp to `<div class="obl-specs-clamp">` and establishing proportional column budgeting. |
| **2. Data Surface** | **UNAFFECTED** | Zero mutations to physical obligation records (`02_RITUALS_CULTURE/obligations/OBL-###.md`), schema schemas, or JSON catalogs. The underlying 53 obligations and item objects remained immutable. |
| **3. Reactive Surface** | **UNAFFECTED** | Client-side reactive filtering and sorting state machines (`activeOblTableSort`, `activeOblCategory`) remained intact. The fix was purely structural within the DOM rendering pipeline. |
| **4. Service Surface** | **UNAFFECTED** | Google Apps Script (`MediaRelay.js`), Firebase Auth, and Firestore endpoints were untouched. |
| **5. Module Surface** | **AFFECTED (Secondary)** | Required SDCA recompilation of `shopping_src/scripts/controller.js` and `11_obligations_table_and_print.css` into `shopping-registry.html` and `shopping-fragment.html` with 100% byte parity to `/public`. |
| **6. Governance Surface** | **AFFECTED (Primary)** | Codified standard `STD-TABLE-BUDGET-001` and invariant `INV-TABLE-DOM-001` into `.agent/standards-catalog.json`, `GEMINI.md`, `CLAUDE.md`, and `SPEC-ARCH-MUTABLE-TABLE-001.md`. Updated density gate `test-obligations-table-density.cjs`. |

---

## 3. Root Cause Analysis (RCA)

1. **Table-Cell Display Model Override**:
   In `SK-024` (`UI-DEC-2026-050`), developers added `display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;` directly to `.obl-td-specs`. In Chromium/WebKit, setting `display: -webkit-box` on a `<td>` replaces `display: table-cell`, detaching the cell from the table layout engine's column width calculations.
2. **Asymmetric Slack Absorption under `table-layout: auto`**:
   The master table `.obl-data-table` defaulted to `table-layout: auto`. When the table rendered at 100% width on wide desktop screens (1440px–1920px), the browser distributed all surplus width ("slack") exclusively to columns without fixed constraints. Because `.obl-td-title` had no CSS width rule while `.obl-td-specs` was locked with `-webkit-box` and `width: 220px`, Title absorbed 100% of the slack.
3. **Premature Ellipsis Truncation**:
   Specifications with 4–6 liturgical items wrapped at 220px and truncated with ellipses after line 3, while the neighboring description cell enjoyed over 600px of mostly empty space.

---

## 4. Resolution & Invariant Classification

1. **Table-Cell Display Model Isolation (`INV-TABLE-DOM-001`)**:
   Extracted line-clamping and text-overflow strictly into an inner container:
   ```html
   <td class="obl-td-specs">
     <div class="obl-specs-clamp" title="${escapeHtml(itemsTooltip)}">• ${itemsText}</div>
   </td>
   ```
   Restored native `display: table-cell` to `.obl-td-specs`.
2. **Proportional Fixed Column Budgeting (`STD-TABLE-BUDGET-001`)**:
   Migrated table to `table-layout: fixed; width: 100%;` allocating 30% to Title and 25% to Specs, ensuring harmonious scaling on wide screens.
3. **Print Run-Sheet Unclamping (`INV-COLLAPSIBLE-PRINT-001`)**:
   Unclamped `.obl-specs-clamp` completely in `@media print` so paper run sheets display 100% of liturgical details without cutoff.

---

## 5. Verification Proof

- `node scripts/test-obligations-table-density.cjs`: PASS (All 4 density and clamp checks green).
- `npm run verify:structural-contracts`: PASS (17/17 checks green).
- `npm run verify:modular-architecture`: PASS (All 64 checks green, 100% byte parity).
- `npm run verify:governance-wiring:all`: PASS (All 203 artifacts fully wired).
