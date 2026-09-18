# Architecture & UI Council Deliberation: Multi-Viewport Responsive Modernization Architecture

**Deliberation Date:** 2026-09-18  
**Council Type:** FULL (Architecture & UI Joint Council)  
**Decision ID:** `AC-DEC-2026-034` / `UI-DEC-2026-030`  
**Pattern Invariant:** `P-MULTI-VIEWPORT-RESPONSIVE-001`  
**Enhancement Track:** `SK-005` (Cluster: `[UI-QUALITY]`)  
**Status:** `APPROVED & RATIFIED`  

---

## 1. Executive Summary & Problem Context

Following the deployment of real-time collaborative Firestore features in the Bhubaneswar Shopping Registry and the 5-Zone DO-PKOS DAG studio, the user requested an exhaustive multi-viewport modernization to make `#shoppingRegistryFrame`, `#stickyHeaderShell`, and other pages responsive across 4 device classes: Compact Mobile ($300\text{px}$–$480\text{px}$), Tablet ($481\text{px}$–$1024\text{px}$), Small Laptop ($1025\text{px}$–$1366\text{px}$), and Large Desktop ($1440\text{px}$+).

Forensic tracing revealed severe spatial saturation:
1. **Header Clutter & Math Reality (`parent-layout-audit`)**: On viewports $<768\text{px}$, the 8 interactive items in `.header-right` (7 buttons + profile trigger) require $298\text{px}$ in icon-only mode ($8 \times 32\text{px} + 7 \times 6\text{px}$ gap). Combined with the brand lockup ($129\text{px}$) and header padding ($12\text{px}$), the minimum required width is $443\text{px}$. On mobile screens $<440\text{px}$ (e.g. iPhone SE at $320\text{px}$ or $375\text{px}$), this causes brand text clipping and horizontal overflow.
2. **Shopping Frame Scalability**: `shopping_src/styles/` relied on sparse media queries (`max-width: 600px` / `500px`) rather than modern CSS Container Queries. The 44-item live mutable table lacked mobile card conversion and sticky identifiers.
3. **Institutional Lesson (INC-093 Precedent)**: Review 4.1 flagged a prior draft that prematurely claimed council certification with colliding IDs (`AC-DEC-2026-033`). This session explicitly pulls sequential IDs (`AC-DEC-2026-034` / `UI-DEC-2026-030`), establishes live CSS measurement proof, and enforces strict scope containment.

---

## 2. Roster & Auditor Findings

- **The SSOT Authority Auditor**: Validated that data schemas (`shopping_items`, `tasks`) and liturgical specifications (`SPEC-PROC-TROUSSEAU-001.md`) remain untouched. Changes are strictly presentation and ergonomic refactors.
- **The Craft & Visual Polish Auditor (`impeccable`)**: Commanded elimination of topbar clutter on mobile. Mandated consolidating secondary action links into an executive Quick-Action Popover (`#headerQuickActionsMenu`), restoring breathing room, optical balance, and visual calm to the Royal Obsidian theme.
- **The Math & Parent Layout Auditor (`parent-layout-audit`)**: Formally certified the $443\text{px}$ required vs $288\text{px}$ usable width cascade at $300\text{px}$, proving that action button consolidation on mobile is an absolute mathematical invariant.
- **The Mobile Usability Auditor (`mobile-ui-validator`)**: Enforced Protocol 19 (`M-GATE-01`): $\ge 44 \times 44\text{px}$ touch targets, zero horizontal page scroll (`overflow-x: clip`), and responsive Table-to-Card dual-mode switcher (`[🗂️ Cards]` ⟷ `[📊 Table]`) with sticky frozen Item columns.
- **The Maintainability & Velocity Auditor (`ponytail`)**: De-scoped speculative overhauls of the DO-PKOS DAG canvas and Decorator Cockpit. Mandated native CSS Container Queries (`@container`), fluid `clamp()` tokens, and lightweight vanilla event delegation.

---

## 3. Certified Decisions & Invariants (`AC-DEC-2026-034` / `UI-DEC-2026-030`)

1. **Mobile Header Consolidation (`#headerQuickActionsBtn` / `#headerQuickActionsPopover`)**:
   - On viewports $<1024\text{px}$, secondary standalone header buttons (`#openInspirationBtn`, `#openIntakeLedgerBtn`, `#openCockpitBtn`, `#openDecisionRegistryBtn`, `#openShoppingRegistryBtn`, `#openExecutiveShareBtn`) collapse under `.desktop-only-action` into a consolidated Quick-Action popover triggered by `[⚡ Quick Actions]`.
   - On compact mobile ($<480\text{px}$), `.header-right` displays a maximum of 3 items (Theme Toggle, Quick Actions, Profile Avatar), comfortably fitting in $106\text{px}$ within the $159\text{px}$ remaining space.
   - 3-trigger dismissibility strictly enforced (`INV-LIFECYCLE-03`: Close button, Backdrop click, Escape keydown).
2. **Tab Navigation Edge-Fade Scroll**:
   - `nav.tab-nav` receives CSS linear gradient masks on left and right edges for fluid touch scroll cues across all 13 modules.
3. **Container-Query Powered Shopping Registry**:
   - `#shoppingRegistryRoot` establishes `container-type: inline-size; container-name: shoppingRegistry;`.
   - Items and stores reflow seamlessly from 1 column ($<480\text{px}$) to 2 columns ($480\text{px}$–$749\text{px}$), 3 columns ($750\text{px}$–$1099\text{px}$), and 4 columns ($\ge 1100\text{px}$) regardless of host viewport.
4. **Live Mutable Table Responsive Dual-Mode**:
   - Table toolbar includes `[🗂️ Cards]` ⟷ `[📊 Table]` view switcher.
   - On mobile ($<680\text{px}$ container width), card view mode provides stacked shopping cards optimized for one-thumb bazaar operation.
   - In table mode, Item Name and Thumbnail column freeze at `position: sticky; left: 0; z-index: 3;` during horizontal scroll.
5. **Universal Deployment Parity**:
   - All compiled releases in `shopping-registry.html`, `shopping-fragment.html`, and `index.html` maintain 100% byte parity with their `public/` counterparts.
