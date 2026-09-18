# 🏛️ Architecture & UI Council Deliberation: Shopping Table Forensic Security Hardening, Keyed DOM Reconciliation & SSOT Alignment

**Decision References:** `AC-DEC-2026-031` (Architecture) / `UI-DEC-2026-027` (UI/UX)  
**Standard Identifier:** `P-SHOPPING-HARDEN-001` (Forensic Security Hardening, Keyed DOM Reconciliation & Post-Trip SSOT Standard)  
**Parent Specifications:** `AC-DEC-2026-028`, `AC-DEC-2026-029`, `AC-DEC-2026-030`, `STD-MOD-COMP-001`  
**Session Date:** 2026-09-18  
**Deliberation Type:** FULL Council Deliberation  
**Maturity Anchor (RFG-001):** Operational Readiness / Production In-Use — Real-Time Shopping Party in Bhubaneswar Retail Districts.  
**Governing Workflows:** `.agent/workflows/architecture-council.md` & `.agent/workflows/ui-council.md` (Featuring `impeccable` as Core Craft Auditor)  
**Related SSOTs:** [`SPEC-PROC-TROUSSEAU-001.md`](../../04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md), [`firestore.rules`](../../firestore.rules), [`FEATURE_CATALOG.json`](../../FEATURE_CATALOG.json)

---

## 1. Executive Summary & Problem Context

Following forensic code reviews in `User_Created/Discussion Threads/Shopping/260918_ShoppingList.md` (Lines 1193–1244), the Architecture and UI Councils conducted a critical audit and identified vulnerabilities requiring structural remediation:
1. **Security Rule Discrepancy**: `firestore.rules` permitted read/write on `/shopping_items/{itemId}` and `/counters/{counterId}` to any authenticated Google user (`isAuthenticated()`), while other collections strictly enforced the pre-approved family email allowlist (`isAllowedUser()`).
2. **Quote-Escaping Syntax Breakage & XSS Risk**: Inline string interpolation (`onclick="...('${escTitle}')"`) failed when titles contained apostrophes (e.g. `Bride's Saree`), creating syntax errors and script injection vectors.
3. **Data Contract Ambiguities**: Grouping by store lacked precedence between planned `store` and live `actualStore`; sorting by price conflated string ranges (`priceRange`) with numeric spent amounts (`actualPrice`).
4. **SSOT Promotion Gap**: Ad-hoc showroom additions (`TRS-9##`) lacked an automated path to fold back into canonical Git specifications.

---

## 2. Official Council Rulings (`AC-DEC-2026-031` / `UI-DEC-2026-027`)

1. **Ruling 1: Family Allowlist Security Lockdown (`SEC-SHOP-001`)**:
   `firestore.rules` SHALL strictly gate `/shopping_items/{itemId}` and `/counters/{counterId}` on `isAllowedUser()`. Unauthorized Google accounts are strictly denied read and write access.

2. **Ruling 2: ID-Based Event Delegation (Zero Quote-Escaping Bug)**:
   All inline string interpolation in table buttons is eradicated. Handlers use `window.openVisualSearchByItemId(itemId)` and `window.shareTableItemById(itemId)`, looking up item titles directly from data structures in memory.

3. **Ruling 3: Disambiguated Data Contracts**:
   - **Store Grouping**: Precedence is `actualStore || store || 'Unassigned Store'`. If an item was bought at an alternate store, it displays a planned badge: `(Planned: ${item.store})`.
   - **Actual Price Sorting**: Numerical comparison of `actualPrice`. Unpurchased items sort to the bottom in ascending order with a `—` placeholder.
   - **Est. Budget Sorting**: Numerical comparison of the parsed minimum bound from `priceRange`.

4. **Ruling 4: Post-Trip SSOT Promotion Tooling**:
   A headless CLI tool `scripts/reconcile-shopping-ssot.cjs` connects to Firestore, validates ad-hoc showroom items, and reconciles them back into `SPEC-PROC-TROUSSEAU-001.md` and `js/shopping-data.js`.

5. **Ruling 5: Full Verification Pass**:
   The entire system passes 100% green across all 10 layers of `npm run verify:deployment`, all 45 checks of `npm run verify:modular-architecture`, all 4 checks of `npm run verify:ui-lifecycle`, and `npm run test:shopping`.

---

## 3. Council Ledger Sign-Off

- **Architecture Council Chair**: APPROVED & SIGNED (`AC-CHAIR-2026-031`)
- **UI/UX Council Chair**: APPROVED & SIGNED (`UI-CHAIR-2026-027`)
- **Core Craft Auditor (`impeccable`)**: CERTIFIED FOR PRODUCTION
