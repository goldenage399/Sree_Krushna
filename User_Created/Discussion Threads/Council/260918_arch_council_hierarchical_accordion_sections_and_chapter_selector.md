# 🏛️ Architecture & UI Council Deliberation: Hierarchical Accordion Section Engine, Modal Chapter Selector & Dual-Mode Table Density

**Decision References:** `AC-DEC-2026-032` (Architecture) / `UI-DEC-2026-028` (UI/UX)  
**Standard Identifier:** `P-TABLE-ACCORDION-001` / `SPEC-TABLE-HIERARCHY-001` (Collapsible Table Hierarchy, Modal Chapter Intake & Dual-Mode Presentation Standard)  
**Parent Specifications:** `AC-DEC-2026-028`, `AC-DEC-2026-029`, `AC-DEC-2026-030`, `AC-DEC-2026-031`, `STD-MOD-COMP-001`, `STD-UI-LIFECYCLE-001`  
**Session Date:** 2026-09-18  
**Deliberation Type:** FULL Council Deliberation  
**Maturity Anchor (RFG-001):** Operational Readiness / Production In-Use — Real-Time Collaborative Shopping in Bhubaneswar Retail Districts.  
**Governing Workflows:** `.agent/workflows/architecture-council.md` & `.agent/workflows/ui-council.md` (Featuring `impeccable` as Core Craft Auditor)  
**Related SSOTs:** [`SPEC-PROC-TROUSSEAU-001.md`](../../04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md), [`table_view.html`](../../shopping_src/components/table_view.html), [`controller.js`](../../shopping_src/scripts/controller.js), [`06_mutable_table.css`](../../shopping_src/styles/06_mutable_table.css)

---

## 1. Problem Context & Forensic Root Cause Analysis

Following real-time testing and DOM inspection via browser DevTools:
```javascript
document.querySelector("#shoppingTableBody > tr:nth-child(29) > td > div > span")
```
The Architecture and UI Councils conducted a root-cause analysis addressing three fundamental architectural inquiries:

### Finding 1: The Missing Chapter Selector in the Intake Modal
The DOM node `tr:nth-child(29) > td > div > span` is the liturgical group banner heading for Chapter 2 (`👑 Groom Wedding Regalia & Mandap Dhoti`). In the existing `+ Add Item` modal (`table_view.html`), the form exposed fields for Title, Category, Status, Store, Price Range, Role, and Notes—but **completely omitted an input for `Chapter` (`chapterId`)**. Consequently, newly added items defaulted to `chapter_general` in Firestore (`public/js/modules/firestore-client.js:139`) and were automatically dumped into the bottom overflow group (`✨ Additional & Ad-Hoc Items`), preventing shoppers from assigning newly discovered attire to its canonical chapter.

### Finding 2: Section Headers vs. Columnar Data Grids (The Ergonomics Paradox)
Questions arose regarding whether Chapter/Store grouping should be represented as full-width section headers or as a dedicated 10th table column:
- **Column-Only Drawback**: On mobile displays (360px–430px), rendering a dedicated Chapter column repeats identical strings ("Bridal Sacred Silks & Trousseau") 10 to 12 times consecutively, squandering 130px–160px of horizontal real estate and forcing actionable financial fields (Actual Price, Status, Notes) off-screen. Furthermore, columnar grids cannot display group-level aggregations (e.g. Chapter subtotals) without introducing confusing synthetic rows.
- **Static Section Header Drawback**: Static full-width headers break the grid into liturgical phases and support subtotal badges, but without collapsible mechanics, users are forced to endure 44+ rows of vertical scroll fatigue while standing in a busy showroom.

### Finding 3: The Missing Accordion Affordance
Enterprise-grade data tables (Airtable, TanStack Table, Linear) employ collapsible accordion rows to enable vertical compression. While the initial release implemented static banner rows, high-velocity showroom navigation requires shoppers at a jewellery store (e.g., Khimji) to collapse Chapters 1, 2, 4, and 5, bringing Chapter 3 (Jewellery) immediately into focus.

---

## 2. Comparative Evaluation Matrix of Available Architectures

| Dimension | Architecture A: Pure Columnar Grid | Architecture B: Static Section Dividers (Status Quo) | Architecture C: Certified Zero-Gap Hybrid (`P-TABLE-ACCORDION-001`) |
| :--- | :--- | :--- | :--- |
| **Mobile Horizontal Space (360px-430px)** | **Poor**: Wastes 130px+ per row repeating chapter names. Actionable price/notes fields pushed off-screen. | **Optimal**: Full-width section dividers consume 0 horizontal columns. | **Optimal**: Spanning section dividers in grouped mode; compact chapter badge in flat mode. |
| **Liturgical Scannability** | **Low**: Monolithic list. Difficult to identify where Bridal ends and Groom begins. | **High**: Clear visual demarcations between wedding days/roles. | **Superior**: High-contrast gold accordion bars with live progress badges. |
| **Group Progress & Subtotals** | **Unsupported**: Cannot render chapter budget sums in standard cells. | **Supported**: Header displays Items, Purchased, and Spent ₹. | **Supported**: Header displays Items, Purchased, and Spent ₹ with live recalculation. |
| **Vertical Density & Ergonomics** | **Poor**: Linear 44-row scroll. | **Poor**: Linear 44-row scroll. | **Superior**: One-tap collapsing of completed chapters; master `[↕ Collapse/Expand All]`. |
| **Sorting Integrity** | Global column sorting only. | Inner-group sorting within liturgical chapters. | **Dual Mode**: Inner-group sort in Grouped views; global sort with Chapter badge in Flat view. |
| **Intake Accuracy** | High (if dropdown exists). | Low (omitted from modal; defaults to General). | **Flawless**: Explicit Chapter selector + Bidirectional Smart Category Auto-Defaulting. |
| **Council Verdict** | REJECTED (Ergonomic failure on mobile) | REJECTED (Scroll fatigue) | **CERTIFIED & ADOPTED UNANIMOUSLY** |

---

## 3. Official Council Rulings (`AC-DEC-2026-032` / `UI-DEC-2026-028`)

### Ruling 1: Modal Chapter Selector with Smart Auto-Mapping (`P-INTAKE-CHAPTER-001`)
1. The `+ Add Item` modal (`#addShoppingItemModal`) SHALL provide an explicit, required `<select id="newItemChapter">` containing all canonical chapters:
   - `chapter_engagement`: `💍 Chapter 0: Engagement & Nirbandha Ceremony`
   - `chapter_bridal_silks`: `🪔 Chapter 1: Bridal Sacred Silks & Trousseau`
   - `chapter_groom_wear`: `👑 Chapter 2: Groom Wedding Regalia & Mandap Dhoti`
   - `chapter_jewellery`: `💎 Chapter 3: Temple Gold & Sacred Silver Tarakasi`
   - `chapter_sara_gifting`: `🎁 Chapter 4: In-Laws 'Sara' Bundles & Gifting`
   - `chapter_general`: `✨ Chapter 5: Additional & Ad-Hoc Sourcing`
2. **Smart Category Auto-Mapping**: The controller SHALL listen to `#newItemCategory` changes. Selecting a category automatically defaults `#newItemChapter` (e.g. `bridal` ➔ `chapter_bridal_silks`, `groom` ➔ `chapter_groom_wear`, `jewellery` ➔ `chapter_jewellery`, `sara` ➔ `chapter_sara_gifting`, `engagement` ➔ `chapter_engagement`). Shoppers retain full autonomy to manually override the chapter.
3. Form submission SHALL pass `chapterId` directly to `fsCreateShoppingItem(item)` for Firestore persistence.

### Ruling 2: Interactive Collapsible Accordion Sections (`P-TABLE-ACCORDION-001`)
1. All table group header rows (`tr.table-group-header-row`) SHALL function as interactive collapsible accordions.
2. Each header row SHALL display an animated chevron indicator (`span.accordion-arrow`: `▼` when expanded, `▶` when collapsed), the chapter/store icon and title, and live aggregate badges (`Items`, `Purchased`, `Spent ₹`).
3. Clicking anywhere on the group header row (or pressing `Enter`/`Space` when focused) SHALL toggle that group between expanded and collapsed states.
4. When collapsed, all child rows belonging to that group (`tr[data-group-id="..."]`) SHALL be hidden with zero lag (`display: none;`).
5. Accordions SHALL enforce full accessibility: `role="button"`, `tabindex="0"`, `aria-expanded="true/false"`, and `aria-controls`.

### Ruling 3: Master Toolbar Toggle (`[↕ Collapse All / Expand All]`)
1. A master accordion toggle button SHALL be integrated into the table toolbar directly alongside the group switcher (`#tableGroupSwitcher`).
2. Clicking `[↕ Collapse All]` collapses all active group headers simultaneously. The button dynamically flips its label and title to `[↕ Expand All]`.
3. Clicking `[↕ Expand All]` restores all group rows to full visibility.

### Ruling 4: State Preservation Across Real-Time Collaborative Echoes
1. Active collapsed group IDs SHALL be tracked in `tableState.collapsedGroups = new Set()`.
2. When remote Firestore updates arrive via `onSnapshot`, the table re-render SHALL respect `tableState.collapsedGroups`. Remote writes by other family members SHALL NEVER abruptly pop open or close sections currently being viewed by the local user.

### Ruling 5: Dual-Mode Context Preservation (Sections in Grouped vs Badge in Flat Mode)
1. In **Grouped Mode** (`groupBy === 'chapter'` or `'store'`), full-width accordion headers manage segregation; no redundant chapter column is rendered.
2. In **Flat List Mode** (`groupBy === 'none'`), section headers are dissolved. The rendering engine SHALL display a compact, styled Chapter Badge (`span.item-chapter-badge`) in the item details/category cell, and permit sorting by Chapter.

---

## 4. Architectural Verification & Governance Ledger

- **Architecture Council Chair**: APPROVED & CERTIFIED (`AC-CHAIR-2026-032`)
- **UI/UX Council Chair**: APPROVED & CERTIFIED (`UI-CHAIR-2026-028`)
- **Core Craft Auditor (`impeccable`)**: CERTIFIED FOR PRODUCTION (Zero Monolithic Breakage, <500 Line Compliance per `STD-MOD-COMP-001`)
