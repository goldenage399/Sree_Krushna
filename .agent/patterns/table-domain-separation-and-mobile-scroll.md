---
pattern: table-domain-separation-and-mobile-scroll
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"
triggers: []
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Clean Domain Separation & Pure Tabular Responsive Architecture (`P-TABLE-DOMAIN-SEPARATION-001`)

**Category**: Architecture, Domain Decoupling & UI/UX Design Pattern  
**Applies to**: High-density mutable tables, accounting ledgers, administrative data grids, and multi-surface applications with paired visual lookbooks  
**Origin**: 2026-09-27 (`INC-100`, Directive 2.2 / `AC-DEC-2026-034` / `SK-021`)  
**Status**: VALIDATED  

---

## 1. Problem & Context

Operational interfaces that track complex real-world entities often conflate two distinct operational domains:
1. **Decision & Curation Domain**: "What do we want?" (Aesthetic exploration, multi-look candidate selection, stakeholder consensus voting, Pinterest intake, and photo lookbooks).
2. **Procurement & Execution Domain**: "What are we doing about it?" (Vendor sourcing, live status workflows, actual cost vs budget, tailoring notes, delivery dates, and ledger accounting).

When teams attempt to make high-density data tables "responsive" on mobile devices, they frequently deploy a well-known CSS trick: collapsing table rows into vertical blocks using `display: block` and CSS pseudo-elements (`td::before { content: attr(data-col-label); }`).

### Failure Modes of Pseudo-Card Table Reflow
1. **Column Header Stripping**: Hiding `<thead>` and replacing columns with stacked vertical cells destroys spreadsheet glanceability and column comparison.
2. **Wireframe Block Degradation**: Because tables lack high-resolution lookbook thumbnails and visual layout grids, the reflowed cells appear as broken, unformatted wireframe blocks (`#shoppingTableBody > tr:nth-child(2)`).
3. **Accidental Domain Ownership**: A surface becomes an accidental owner of a foreign domain. The table attempts to mimic a showroom without the showroom's rich visual tools, while the catalog attempts to duplicate accounting fields.

---

## 2. Invariant: Clean Domain Separation (`Path A`)

> **Prime Invariant**: *A surface never becomes the owner of a fact because it displays or edits it.*

```
+-----------------------------------------------------------------------------------------+
|                               SREE KRUSHNA MARRIAGE OS                                  |
|                                SHOPPING & TROUSSEAU                                     |
+-----------------------------------------------------------------------------------------+
|  [👑 Catalog Showroom]                           [📊 Execution Ledger & Table]          |
|  Surface: #catalogViewSection                    Surface: #shoppingTableViewSection     |
|                                                                                         |
|  DECISION / CURATION DOMAIN                      PROCUREMENT / EXECUTION DOMAIN         |
|  • Candidate Looks (Pinterest / Showroom)         • Procurement Status (Planned -> Paid) |
|  • Stakeholder Consensus (Bride/Sisters/In-Laws) • Actual Price vs Estimated Budget    |
|  • Family Remarks & Lookbook Inspection          • Store Sourcing & Vendor Attribution  |
|  • Lightbox Zoom-Pan Multi-Look Carousel         • Tailoring & Specification Notes      |
|                                                                                         |
|  Item Card Footer:                               Table Row Action Cell:                 |
|  +---------------------------+                   +----------------------------------+   |
|  | [💬 Remarks] [📤 Share]   |                   | [👁️ View in Catalog]  <---+      |   |
|  | [📊 Ledger] ------------+ |                   | [🔍 Visual Search]        |      |   |
|  +-------------------------|-+                   | [📱 WhatsApp Share]       |      |   |
|                            |                     +---------------------------|------+   |
|                            +-------------------------------------------------+          |
|                             Instant 1-Tap Handoff (≤2 Interactions)                     |
|                             With Target Focus & Glow Pulse                              |
+-----------------------------------------------------------------------------------------+
```

1. **Surfaces Own Experiences, Not Domains**:
   - **Catalog Surface**: Strictly visual curation, inspiration, multi-look comparison, and consensus.
   - **Ledger Surface**: Strictly an execution spreadsheet for high-density accounting, live status, and tailoring notes.
2. **Retire Table Card Mode Permanently**:
   - Tables must NEVER collapse into cards or pseudo-cards via CSS.
   - If an application needs cards, it must route to a dedicated Card/Catalog surface.

---

## 3. Pure Tabular Responsive Ergonomics

To maintain high usability on mobile viewports ($\le 768\text{px}$) without collapsing table semantics:

1. **Horizontal Swipe Container**:
   Wrap the table in a dedicated container with native hardware-accelerated touch-scrolling:
   ```css
   .shop-table-container {
     overflow-x: auto;
     -webkit-overflow-scrolling: touch;
     position: relative;
   }
   .shop-data-table {
     min-width: 900px;
     border-collapse: separate;
     border-spacing: 0;
   }
   ```
2. **Sticky Frozen Identity Column**:
   Keep the identity anchor (Item ID + Title) pinned to the left so the user never loses context while panning:
   ```css
   .shop-data-table td.sticky-col {
     position: sticky;
     left: 0;
     z-index: 2;
     background: rgba(15, 23, 42, 0.96);
     box-shadow: 2px 0 6px rgba(0, 0, 0, 0.25);
   }
   .shop-data-table th.sticky-col {
     position: sticky;
     left: 0;
     top: 0;
     z-index: 6;
   }
   ```
3. **WCAG 2.5.8 Touch Target Compliance ($\ge 44 \times 44\text{px}$)**:
   Under `@media (max-width: 768px)` and container queries, interactive controls must be sized for touch:
   ```css
   .status-dropdown,
   .table-price-input,
   .table-notes-input {
     min-height: 44px;
     font-size: 0.85rem;
   }
   .cell-action-btn {
     min-width: 44px;
     min-height: 44px;
     display: inline-flex;
     align-items: center;
     justify-content: center;
     font-size: 1rem;
   }
   ```

---

## 4. Bi-Directional Cross-Surface Navigation Protocol ($\le 2$ Interactions)

Instead of replicating features across surfaces, provide immediate 1-tap handoffs between the paired surfaces:

1. **Table $\rightarrow$ Catalog (`window.jumpToCatalogItem(itemId)`)**:
   - Switches active view to `catalog`.
   - Clears active search/category filters to ensure the target item is rendered.
   - Smoothly centers card (`#card-${itemId}`) into viewport.
   - Applies gold focus glow (`.highlight-target-item`) for 3 seconds.
   - Displays toast confirmation.
2. **Catalog $\rightarrow$ Table (`window.jumpToLedgerItem(itemId)`)**:
   - Switches active view to `table`.
   - Calls `window.resetTableFilters()` to uncollapse accordions and clear query filters.
   - Smoothly centers row (`tr[data-item-id="${itemId}"]`) into viewport.
   - Applies update row pulse (`.row-pulse`) for 3 seconds.
   - Displays toast confirmation.

---

## 5. Verification Gate

Before approving any mutable table or catalog pull request:
1. **Zero Cards in Table**: Verify no `mode-cards`, `td::before { content: attr(...) }`, or table layout toggle exists.
2. **Table Semantic Retention**: Verify `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<td>` retain table layout at all viewports (320px to 1440px).
3. **Cross-Navigation Verification**: Verify clicking `[👁️]` navigates to Catalog in $\le 2$ interactions, and clicking `[📊 Ledger]` navigates to Table in $\le 2$ interactions.
