# 🏛️ Architecture & UI Council Deliberation: Multi-User Concurrency, Active Focus Protection & Live Collision Detection

**Decision References:** `AC-DEC-2026-030` (Architecture) / `UI-DEC-2026-026` (UI/UX)  
**Standard Identifier:** `P-COLLAB-CONCURRENCY-001` (Multi-User Collaborative Concurrency & Active Focus Protection Standard)  
**Parent Specifications:** `AC-DEC-2026-028`, `AC-DEC-2026-029`, `STD-MOD-COMP-001`  
**Session Date:** 2026-09-18  
**Deliberation Type:** FULL Council Deliberation  
**Maturity Anchor (RFG-001):** Operational Readiness / Production In-Use — Real-Time Shopping Party in Bhubaneswar Retail Districts.  
**Governing Workflows:** `.agent/workflows/architecture-council.md` & `.agent/workflows/ui-council.md` (Featuring `impeccable` as Core Craft Auditor)  
**Related SSOTs:** [`SPEC-PROC-TROUSSEAU-001.md`](../../04_PROCUREMENT_VENDORS/trousseau_and_shopping/SPEC-PROC-TROUSSEAU-001.md), [`firestore.rules`](../../firestore.rules), [`FEATURE_CATALOG.json`](../../FEATURE_CATALOG.json)

---

## 1. Executive Summary & Problem Context

During real-time multi-device usage across Bhubaneswar showrooms, multiple shoppers (Bride, Groom, Sisters, Parents) interact with the same shopping items concurrently. Without rigorous concurrency protocols:
1. **Cross-Field Clashes**: Multiple users editing different attributes of an item could overwrite each other's changes if document-level overwrites are used.
2. **Active Input Destruction (Cursor Jumping)**: When User B updates any item, an incoming remote `onSnapshot` could re-render the entire table, destroying User A's uncommitted `<input>` text, focus, and caret.
3. **Contested Overwrite Attribution**: Simultaneous status or price changes must preserve clear audit attribution (`updatedBy`, `updatedAt`) without silent data loss.

---

## 2. Official Council Rulings (`AC-DEC-2026-030` / `UI-DEC-2026-026`)

1. **Ruling 1: Granular Field-Level Merging (`{ merge: true }`)**:
   All write operations via `fsSetShoppingItemStatus(itemId, patch)` MUST strictly patch only modified keys (`status`, `actualPrice`, `actualStore`, `notes`), guaranteeing that concurrent edits to different fields merge seamlessly without collision.

2. **Ruling 2: Active Focus & Caret Guard (`P-COLLAB-CONCURRENCY-001`)**:
   During live `onSnapshot` events, `renderShoppingTable()` captures `document.activeElement`. If the user is currently typing in an `<input>` or `<textarea>`, that specific element's value, focus, and text selection range (`setSelectionRange`) SHALL NOT be disrupted or overwritten.

3. **Ruling 3: Live Collision Beacon & Visual Attribution**:
   Table rows display subtle attribution subtext (e.g. `Updated by Priya`). When a remote update alters an on-screen row, that row triggers a gentle 1.5s gold pulse animation (`@keyframes rowUpdatePulse`).

4. **Ruling 4: Throttled Toast Notifications**:
   Remote updates from other shoppers are throttled using a 4-second sliding window. Rapid successive updates are batched (e.g. *"Priya updated 2 items"*) to prevent toast notification flooding on mobile devices.

5. **Ruling 5: Monotonic Offline Queuing**:
   In basement showrooms with zero cellular reception, mutations queue locally in IndexedDB via Firestore's `persistentLocalCache()` and flush sequentially upon network reconnection with atomic server timestamp ordering.

---

## 3. Council Ledger Sign-Off

- **Architecture Council Chair**: APPROVED & SIGNED (`AC-CHAIR-2026-030`)
- **UI/UX Council Chair**: APPROVED & SIGNED (`UI-CHAIR-2026-026`)
- **Core Craft Auditor (`impeccable`)**: CERTIFIED FOR PRODUCTION
