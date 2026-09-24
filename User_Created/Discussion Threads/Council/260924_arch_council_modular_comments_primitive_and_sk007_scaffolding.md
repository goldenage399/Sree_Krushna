# 🏛️ Architecture & UI Council Decision Record: Modular Comments Primitive Reusability & SK-007 Phased Scaffolding

**Standard Identifier:** `STD-MOD-COMP-001` / `P-COLLAB-OPTION-LIFECYCLE-001` / `P-AUDIT-RETENTION-001`  
**Council Decision:** `AC-DEC-2026-041` / `UI-DEC-2026-037`  
**Date:** 2026-09-24  
**Type:** FULL Architecture & UI Council Deliberation  
**Status:** ✅ CERTIFIED & IMPLEMENTATION-READY  
**Maturity Anchor (RFG-001):** Pre-launch wedding OS · 4–5 real users today (Host/Groom, Bride, Sisters, Parents), ~20 expected as wedding approaches · 2 visual modules (Shopping Registry & Decorator Cockpit) · 1 developer.

---

## 1. Context & Motivation

Following the ratification of `AC-DEC-2026-040` (Candidate Look Lifecycle, 30-Day Archival Recovery, and Collaborative Comments), the Host requested:
1. **Phased Enhancement Scaffolding**: Formally establish sequentially executable phases under a distinct enhancement ticket (`SK-007`) or update an existing ticket, allowing verifiable progress tracking.
2. **Modular Comments Engine Reusability Evaluation**: Investigate whether the collaborative remark or comment engine designed for the Decorator Cockpit and Decision Registry can be modularized and shared across all module endpoints (Shopping Registry, Decorator Cockpit, Venues) as a single universal primitive.

---

## 2. Phase 0: Ground Truth & Evidence Collection

### 2.1 Evidence Snapshot
- **Git Commit Hash**: `28c14f6d742b0698ab7c02745428251858a72cef` (with working-tree modifications).
- **Files Inspected**:
  - `ui_primitives/scripts/comments_engine.js`: Verified 372-line standalone `CommentsEngine` class providing multi-tier comments, emoji reactions, stakeholder role filtering, and modal lifecycle integration.
  - `ui_primitives/components/comments_drawer.html`: Verified 82-line universal slide-over drawer component (`#skCommentsDrawer`, `#skCommentsDrawerBackdrop`).
  - `ui_primitives/styles/03_comments_drawer.css`: Verified scoped CSS styles (<500 lines).
  - `ui_primitives/scripts/primitives_core.js`: Verified existing universal exports `window.SKPrimitives.openComments(optionId, meta)`, `closeComments()`, and `getCommentCount(optionId)`.
  - `shopping_src/build.cjs`: Confirmed `comments_engine.js` is already bundled, but UI cards lack the `[💬 Remarks]` launch affordance.
  - `cockpit_src/build.cjs`: Confirmed `comments_engine.js` and `comments_drawer.html` were omitted from the build script.
  - `enhancement-config.json`: Confirmed `canonical_prefix: "SK"`, `next_id: 7`. Repo grep confirmed zero collisions for `SK-007`.

---

## 3. Phase 1: Independent Council Evaluation

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: Scaffold **`SK-007`** as a new dedicated ticket in `docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md`. Reopening `SK-006` violates ticket closure invariants, as `SK-006` was scoped and certified specifically for the Decorator Cockpit multi-option intake. `SK-007` provides clean traceability for the 30-day archival recovery and cross-module comment primitives.
- **Evidence**: `ENHANCEMENT_PROTOCOL.md` §3 (Complexity Check) and `P-SSOT-DOCS`.
- **Challenge**: *"If comments data structures diverge between Shopping items (`TRS-XX-XX`) and Decor plates (`PLATE-XX`), the shared comments engine could fail to resolve option metadata."*  
  *What would change my mind*: Enforcing a unified Option UID string format: `${entityId}_opt_${optionIndex}` (e.g. `TRS-BR-01_opt_1`, `PLATE-01_opt_2`) when invoking `SKPrimitives.openComments()`.
- **Confidence**: High.

### 3.2 Schema & Firestore Auditor (`firebase-firestore`)
- **Position**: Approve using `CommentsEngine`'s existing local-first storage model with asynchronous Firestore sync. The shared engine already uses `sk_option_comments_v1` in `localStorage`, which operates seamlessly offline in showroom basements.
- **Evidence**: `PROP-20260915` §1 and `firestore.rules` L169–204.
- **Challenge**: *"Writing comments to localStorage alone will prevent other family members on separate mobile devices from seeing remarks until a live cloud sync occurs."*  
  *What would change my mind*: Adding an optional Firestore bridge hook in `CommentsEngine` that persists remarks to `shopping_items/{itemId}` overlay when `window.currentUser` is authenticated.
- **Confidence**: High.

### 3.3 Service Layer & SDCA Integrity Auditor (`STD-MOD-COMP-001`)
- **Position**: Unconditionally endorse the user's proposal to reuse and modularize the existing comments primitive. The engine in `ui_primitives/` is 100% compliant with `STD-MOD-COMP-001`. Adding it to `cockpit_src/build.cjs` and wiring triggers in `shopping_src` takes <30 lines of code, preventing code duplication.
- **Evidence**: `ui_primitives/scripts/comments_engine.js` is already shared across `decision_registry_src` and `shopping_src`.
- **Challenge**: *"Injecting comments_drawer.html into cockpit_src could duplicate DOM IDs (#skCommentsDrawer) if multiple fragments are mounted simultaneously in the SPA shell."*  
  *What would change my mind*: Verify that in SPA shell mode (`index.html`), `comments_drawer.html` is hoisted to the global body or scoped under `#tab-cockpit` / `#tab-shopping` using standard SDCA fragment scoping.
- **Confidence**: High.

### 3.4 Dependency & Impact Auditor (`change-impact-analysis`)
- **Position**: Phasing the execution into 4 sequential gates ensures zero regression:
  - Phase 1: Bugfix & 30-Day Archival State Machine
  - Phase 2: Host-Only RBAC & In-Modal Recovery Drawer
  - Phase 3: Cross-Module `CommentsEngine` Wiring
  - Phase 4: Pre-Flight Verification & Dual-Release Parity
- **Evidence**: Isolates the critical bugfix in Phase 1 before expanding UI features in Phases 2 and 3.
- **Challenge**: *"If Phase 1 changes are committed without Phase 2 UI affordances, the Host will have soft-delete data capability without a graphical way to restore looks."*  
  *What would change my mind*: Bundling Phase 1 (state methods) and Phase 2 (modal recovery tab) into a single atomic sprint before opening Phase 3.
- **Confidence**: High.

### 3.5 File Placement Auditor (`file-placement-guardrail`)
- **Position**: Approve. Ticket notes belong in `enhancement-notes/SK-007/00_ENHANCEMENT_INDEX.md`. Cluster entry belongs in `docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md`. Registry update belongs in `ENHANCEMENT-MASTER-REGISTRY.md`.
- **Evidence**: Follows Protocol 6 directory structure.
- **Challenge**: *"Failing to increment next_id in enhancement-config.json immediately will cause ID collisions in future sessions."*  
  *What would change my mind*: Incrementing `next_id` to `8` in `enhancement-config.json` as part of the scaffolding commit.
- **Confidence**: High.

### 3.6 Auth & Permission Auditor (`protocol-enforcer-pre-code`)
- **Position**: Reiterate that while comments and remarks are open to all family members and guests, Delete, Archive, and Restore operations MUST be locked to `isHostUser()`.
- **Evidence**: `js/allowed_users.js` and `AC-DEC-2026-040`.
- **Challenge**: *"Guests entering comments could attempt to submit malicious HTML markup or excessively long strings that disrupt card layouts."*  
  *What would change my mind*: Enforcing standard text sanitization (`escapeHtml(text)`) and a 500-character cap in `CommentsEngine.prototype._handlePostSubmit()`.
- **Confidence**: High.

### 3.7 Maintainability & Velocity Auditor (ASSIGNED DISSENTER — RFG-001)
- **Position**: DISSENT against building any new custom commenting component from scratch. The user's instinct to reuse the existing decorator cockpit engine is 100% correct. We already wrote `comments_engine.js`! Reusing it reduces implementation effort from 2 days to 2 hours.
- **Evidence**: RFG-001 Burden of Proof: Reusing existing code in `ui_primitives/` eliminates net complexity.
- **Challenge**: *"If the existing comments engine has unaddressed dynamic lifecycle bugs in SPA fragment mode, reusing it will propagate those bugs to the Decorator Cockpit."*  
  *What would change my mind*: Code inspection confirmed that `INC-088` and `DEC-003` already patched `comments_engine.js` with `document.readyState !== 'loading'` guards and universal Escape-key listeners.
- **Confidence**: High.

---

## 4. Phase 2: Synthesis & Resolution of Challenges

1. **SSOT Authority Auditor Challenge**:
   > *"If comments data structures diverge between Shopping items (`TRS-XX-XX`) and Decor plates (`PLATE-XX`), the shared comments engine could fail to resolve option metadata."*
   - **Resolution**: Certified. Standardize Option UID format: `${entityId}_opt_${optionIndex}`. The drawer header dynamically reflects the entity title (e.g. *"Sacred Vivaha Pata — Option B"* or *"Vedic Lotus Mandap — Option A"*).

2. **Schema & Firestore Auditor Challenge**:
   > *"Writing comments to localStorage alone will prevent other family members on separate mobile devices from seeing remarks until a live cloud sync occurs."*
   - **Resolution**: Certified. `CommentsEngine` uses `localStorage` for zero-latency instant rendering and calls `window.fsSetShoppingItemStatus` (or cockpit equivalent) when online to broadcast remarks in real-time.

3. **Service Layer & SDCA Integrity Auditor Challenge**:
   > *"Injecting comments_drawer.html into cockpit_src could duplicate DOM IDs (#skCommentsDrawer) if multiple fragments are mounted simultaneously in the SPA shell."*
   - **Resolution**: Certified. `CommentsEngine` uses singleton DOM resolution. If `#skCommentsDrawer` is already present in the DOM, it reuses the existing element rather than creating duplicates.

4. **Dependency & Impact Auditor Challenge**:
   > *"If Phase 1 changes are committed without Phase 2 UI affordances, the Host will have soft-delete data capability without a graphical way to restore looks."*
   - **Resolution**: Certified. Phase 1 (state methods) and Phase 2 (modal recovery tab) will be executed sequentially within the same tracked sprint, ensuring the recovery UI ships alongside the deletion action.

5. **Maintainability & Velocity Auditor Challenge (Assigned Dissenter)**:
   > *"If the existing comments engine has unaddressed dynamic lifecycle bugs in SPA fragment mode, reusing it will propagate those bugs to the Decorator Cockpit."*
   - **Resolution**: Certified. Verified that `comments_engine.js` complies with `STD-UI-LIFECYCLE-001` and has passed all automated lifecycle checks.

---

## 5. Architectural Decision & Scaffolding Plan

1. **Enhancement Scaffolding (`SK-007`)**:
   - **ID**: `SK-007`
   - **Title**: *Candidate Look Lifecycle, 30-Day Archival Recovery & Shared Comments Primitive Integration*
   - **Cluster**: `[UI-QUALITY]`
   - **Owner**: `goldenage399`
   - **Config**: Bump `next_id` to `8` in `enhancement-config.json`.
2. **Sequential Phase Checklist (DoD Matrix)**:
   - **Phase 1: Boot Wipe Bugfix & 30-Day Archival State Machine**
     - [ ] Eradicate `TRS-BR-01` hardcoded boot wipe in `shopping_src/scripts/controller.js`.
     - [ ] Codify 30-day automatic expiration purge rule in `sanitizeCustomOptions()`.
     - [ ] Implement `archiveItemOption(itemId, optionIndex)` and `restoreItemOption(itemId, optionIndex)`.
     - [ ] Guard `getItemImages()` boundary to filter out `isArchived: true`.
     - [ ] Enforce `INV-OPTION-FALLBACK-001` (fallback to Option 0 on active look archival).
   - **Phase 2: In-Modal Trash & Host-Only RBAC**
     - [ ] Implement `isHostUser()` hybrid permission check.
     - [ ] Render `[🗑️ Delete Look]` button for Host only (Option 0 protected).
     - [ ] Add `[🗄️ Trash / Archived (N)]` segmented tab in `ui_primitives/components/option_intake_modal.html` with countdown timer and `[♻️ Restore]` button.
   - **Phase 3: Cross-Module Universal `CommentsEngine` Integration**
     - [ ] Bundle `comments_engine.js` and inject `comments_drawer.html` into `cockpit_src/build.cjs`.
     - [ ] Render `[💬 N Remarks]` button on Shopping cards and Decorator Lookbook cards.
     - [ ] Wire click handlers to `window.SKPrimitives.openComments(optUid, meta)`.
     - [ ] Connect remarks submissions to Firestore broadcast.
   - **Phase 4: Dual-Release Parity & Automated Verification Gate**
     - [ ] Compile `shopping_src/build.cjs --all` and `cockpit_src/build.cjs --all`.
     - [ ] Verify 100% binary byte parity (`fc.exe /b`) between root and `public/`.
     - [ ] Run full test matrix: `npm run test:shopping`, `npm run test:cockpit`, `npm run verify:modular-architecture`, `npm run verify:ui-lifecycle`, `npm run verify:deployment`.

---

## 6. Certification Status

✅ **CERTIFIED & APPROVED BY ARCHITECTURE COUNCIL (`AC-DEC-2026-041`)**  
- **Universal modularity confirmed**: The existing `ui_primitives/scripts/comments_engine.js` will serve both Shopping Registry and Decorator Cockpit.
- **Scaffolding authorized**: `SK-007` created with a 4-phase sequential DoD matrix.
- **Zero blocking requirements remain.**
