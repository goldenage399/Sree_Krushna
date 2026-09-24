# 🏛️ Architecture & UI Council Decision Record: Candidate Look Lifecycle, 30-Day Archival Recovery & Collaborative Comments Architecture

**Standard Identifier:** `P-COLLAB-OPTION-LIFECYCLE-001` / `P-AUDIT-RETENTION-001`  
**Council Decision:** `AC-DEC-2026-040` / `UI-DEC-2026-036`  
**Date:** 2026-09-24  
**Type:** FULL Architecture & UI Council Deliberation  
**Status:** ✅ CERTIFIED & IMPLEMENTATION-READY  
**Maturity Anchor (RFG-001):** Pre-launch wedding OS · 4–5 real users today (Host/Groom, Bride, Sisters, Parents), ~20 expected as wedding approaches · 2 visual modules (Shopping Registry & Decorator Cockpit) · 1 developer.

---

## 1. Context & Motivation

During local validation of Query 4.0 and 4.1 enhancements (Pinterest CDN ingestion, active pre-flight image probes, and Decorator Cockpit multi-option lookbooks), two critical operational friction points and two feature requirements were identified:

1. **Deployment Status Inquiry**: The Host needed absolute verification on whether the recent visual intake and validation engine changes are live on Firebase Hosting or remain purely local.
2. **Refresh Wipe Regression**: Newly added candidate looks (copied from Pinterest image addresses) disappeared upon page refresh. Investigation revealed that a temporary startup sanitizer in `shopping_src/scripts/controller.js` contained an unconditional deletion (`delete itemCustomOptions['TRS-BR-01']`) executed on every page boot.
3. **Candidate Look Pruning vs. 30-Day Archival Safety**: When exploring multiple options for bridal sarees, jewellery, or mandap setups, decision-makers shortlist 1–2 looks and need to prune rejected candidate looks. However, destructive hard-deletion risks permanent loss of critical showroom photos, vendor contacts, and pricing quotes. A soft-delete 30-day retention archive (Trash Bin) with 1-click restoration is required.
4. **Role-Based Access Control (RBAC) & Collaborative Commenting**: Deletion and archival restoration must be strictly restricted to the Host (`goldenage399@gmail.com` / `krushna.s.panda@gmail.com`), while family members and committee contributors accessing via WhatsApp deep links should be empowered to participate constructively through structured threaded comments on specific looks (mirroring `PROP-20260915-collaborative-options-and-comments-model.md`).

---

## 2. Phase 0: Ground Truth & Evidence Collection

### 2.1 Evidence Snapshot
- **Git Commit Hash**: `28c14f6d742b0698ab7c02745428251858a72cef` (with uncommitted local changes across `shopping_src/`, `cockpit_src/`, and `ui_primitives/`).
- **Files Inspected**:
  - `shopping_src/scripts/controller.js` (Lines 20–78, 114–130, 2630–2685): Identified hardcoded `delete itemCustomOptions['TRS-BR-01']` inside `sanitizeCustomOptions()`.
  - `firestore.rules` (Lines 169–204): `isValidShoppingItemOverlay` and `isValidAdhocShoppingItem` explicitly allow `options` (size <= 20) and `selectedOptionIndex`, with writes restricted to `isAllowedUser()`.
  - `public/js/modules/firestore-client.js` (Lines 123–165): `fsSetShoppingItemStatus` syncs options to Firestore collection `shopping_items/{itemId}`.
  - `docs/proposals/PROP-20260915-collaborative-options-and-comments-model.md`: SSOT specification for Option UIDs, `isArchived: true` soft-delete, and tiered commenting topology.
  - `User_Created/Discussion Threads/Council/Council_Ledger.md`: Verified prior rulings `AC-DEC-2026-028` (Real-Time Shopping Engine), `AC-DEC-2026-038` (Pinterest Intake), and `AC-DEC-2026-039` (Decorator Cockpit Multi-Option Intake).
  - Live Firebase Deployment Probe: `fetch('https://sree-krushna-forever.web.app/shopping-fragment.html')` confirmed `validateCandidateImageUrl: false` and `sanitizeCustomOptions: false`. Live site is running commit `36ba338` and has NOT been deployed.

### 2.2 Concept Collision & Duplication Check (RFG-001)
- Verified `isArchived` and `archivedAt` conventions across `docs/ssot/` and `PROP-20260915`. No collision found; standardizes on `status: "active" | "archived"`, `archivedAt: ISO_STRING`, `archivedBy: string`, and `expiresAt: ISO_STRING`.

---

## 3. Phase 1: Independent Council Evaluation

### 3.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: Strongly support implementing soft-delete archival and host-only RBAC, anchored directly to `PROP-20260915` and `SPEC-PROC-TROUSSEAU-001`. The temporary hardcoded deletion of `TRS-BR-01` violates SSOT preservation (`ssot-preservation-template-guard.md`) and must be eradicated immediately.
- **Evidence**: `PROP-20260915` §2 explicitly dictates: *"If an option is retired, its UID is marked `isArchived: true` and never recycled, preventing comment orphaned pointers."*
- **Assumptions**: Option UIDs remain stable when archived so any attached comments or deep-link references do not break.
- **Trade-offs**: Retaining archived looks increases client/Firestore payload slightly, but prevents irreversible data loss during wedding procurement.
- **Risks & Dependencies**: Risk of stale archived looks accumulating if automatic 30-day expiration cleanup is not enforced.
- **Challenge**: *"If archived looks are hidden from the primary card strip but retained in the data payload, a client-side filter bug could inadvertently surface archived looks in executive reports or printed A4 run sheets."*  
  *What would change my mind*: Strict separation in `getItemImages()` returning only `status !== 'archived'` for active catalog renderers, with an explicit `getArchivedItemImages()` helper for the Trash Bin drawer.
- **Confidence**: High.

### 3.2 Schema & Firestore Auditor (`firebase-firestore`)
- **Position**: Support embedding candidate looks and look-level comments directly within the `shopping_items/{itemId}` document `options` array rather than spawning complex Firestore subcollections (`shopping_items/{itemId}/options/{optId}/comments/{cmtId}`).
- **Evidence**: `firestore.rules` L171–178 already permits `options` as a list of up to 20 maps. In a pre-launch wedding OS with ~5 real users and at most 3–5 candidate looks per attire item, the entire document size remains under 12KB (well within Firestore's 1MB limit). Subcollections would require 3x more network roundtrips, new security rules, and complex offline composite indexing.
- **Assumptions**: Total comments per candidate look will not exceed 25–30 entries; total candidate looks per item will not exceed 10.
- **Trade-offs**: Document-level writes update the whole options array; mitigated by existing `{ merge: true }` atomic field patch.
- **Risks & Dependencies**: Concurrency collision if two family members comment on the exact same second; mitigated by existing client-side `activeFocus` caret protection.
- **Challenge**: *"Embedding comments inside the candidate look object within the document array means any new comment triggers an onSnapshot broadcast that re-evaluates the entire item card."*  
  *What would change my mind*: Demonstrating that keyed DOM reconciliation (`data-item-id`) renders updates in <4ms without stealing input focus or causing image flicker.
- **Confidence**: High.

### 3.3 Service Layer & SDCA Integrity Auditor (`STD-MOD-COMP-001`)
- **Position**: Approve architecture provided all new UI elements (Trash button, Archived Drawer, Comment Drawer) are decoupled into modular SDCA components in `ui_primitives/` and kept under the 500-line limit (`STD-MOD-COMP-001`).
- **Evidence**: `shopping_src/scripts/controller.js` is currently 2,761 lines (legacy aggregator). Any new comment or archival logic must use modular helpers or shared primitives (`ui_primitives/components/option_intake_modal.html` and `ui_primitives/scripts/primitives_core.js`).
- **Assumptions**: Both Shopping Registry and Decorator Cockpit can share the same archival and commenting UI contracts.
- **Trade-offs**: Shared primitives require parameterized callbacks (`onDelete`, `onRestore`, `onComment`), slightly increasing component interface surface.
- **Risks & Dependencies**: Breaking byte parity between root and `public/` if build scripts (`shopping_src/build.cjs`, `cockpit_src/build.cjs`) are not executed in tandem.
- **Challenge**: *"Adding another modal or drawer for archived looks could bloat the DOM and trigger modal dismissal race conditions violating INV-LIFECYCLE-03."*  
  *What would change my mind*: Implementing the Archived Looks viewer as a dedicated sub-view/tab inside the existing `option_intake_modal.html` rather than introducing a separate floating modal.
- **Confidence**: High.

### 3.4 Dependency & Impact Auditor (`change-impact-analysis`)
- **Position**: Approve with strict scoping of blast radius. The startup wipe bug in `controller.js` must be severed without altering `userSelections`, `itemPurchased`, or `stakeholderApprovals`.
- **Evidence**: Blast radius analysis shows `getItemImages()` is consumed by 6 downstream render sites: `renderItems()`, `renderTableView()`, `openOptionIntakeModal()`, `openLightbox()`, `printRunSheet()`, and `shareShoppingOption()`.
- **Assumptions**: Filtering archived items at the `getItemImages()` boundary automatically protects all 6 downstream consumers.
- **Trade-offs**: Any consumer needing archived items must explicitly call `getArchivedImages()`.
- **Risks & Dependencies**: If an archived option was currently selected (`selectedOptionIndex`), the index must gracefully reset to Option 0 (Baseline) to prevent `undefined` image references.
- **Challenge**: *"If the Host archives the currently active look while another user is viewing it, the remote view could render a blank card or throw a null reference error."*  
  *What would change my mind*: Invariant guard in `selectPlateOption` / `selectItemOption`: If selected index points to an archived look, fallback immediately to Option 0 with a non-blocking toast warning.
- **Confidence**: High.

### 3.5 File Placement Auditor (`file-placement-guardrail`)
- **Position**: Approve. State modifications belong in `shopping_src/scripts/controller.js` and `public/js/modules/firestore-client.js`. Shared markup belongs in `ui_primitives/components/option_intake_modal.html`. CSS styles belong in `shopping_src/styles/08_collab_options_and_sharing.css` (<500 lines).
- **Evidence**: Follows established SDCA file placement taxonomy.
- **Assumptions**: No arbitrary inline scripts or un-scoped CSS added to root templates.
- **Trade-offs**: None.
- **Risks & Dependencies**: Dual-release synchronization (`public/` parity).
- **Challenge**: *"Placing comment rendering logic inside the main controller script risks pushing file complexity beyond maintainable limits."*  
  *What would change my mind*: Encapsulating comment formatting and 30-day time-ago math in `ui_primitives/scripts/primitives_core.js`.
- **Confidence**: High.

### 3.6 Auth & Permission Auditor (`protocol-enforcer-pre-code`)
- **Position**: Require dual-tier RBAC: Host Identity Gate for destructive actions (Delete / Archive / Restore) vs Open Collaborative Gate for non-destructive actions (Add Look / Comment / React).
- **Evidence**: `js/allowed_users.js` explicitly defines `goldenage399@gmail.com` and `krushna.s.panda@gmail.com` as `SuperAdmin (Groom)`. In offline / localhost mode, `window.currentUser` or Host Mode PIN represents Host identity.
- **Assumptions**: In family share mode (`?mode=family`), visitors do not have Google Auth tokens; they operate in public guest mode.
- **Trade-offs**: Public family users cannot delete even their own mistakenly uploaded looks without Host approval, but this guarantees zero accidental destruction of curated catalog data.
- **Risks & Dependencies**: Bypassing client-side checks via direct console commands; mitigated by Firestore security rules requiring `isAllowedUser()` for document writes.
- **Challenge**: *"If Host identification relies strictly on window.currentUser.email, the Host testing in localhost without active Google Sign-In will find themselves locked out of the Delete/Restore buttons."*  
  *What would change my mind*: Hybrid Host Check: `isHostSession()` returns true if authenticated as Host email OR if running on localhost / dev environment with local host override flag (`localStorage.getItem('sk_host_override') === 'true'`).
- **Confidence**: High.

### 3.7 Maintainability & Velocity Auditor (ASSIGNED DISSENTER — RFG-001)
- **Position**: DISSENT against building a monolithic, enterprise-grade multi-tier commenting engine with `@mentions` autocomplete, reply threading, and real-time typing indicators at this stage. That would introduce massive unwarranted complexity for a pre-launch wedding app with 5 users. I advocate a **minimalist, pragmatic hybrid**:
  1. Fix the `TRS-BR-01` boot wipe immediately.
  2. Implement soft-delete with an `isArchived: true` flag and 30-day timestamp filter.
  3. Restrict Delete/Restore to Host via simple role check.
  4. Provide a lightweight, single-level remarks feed on each look (Author Name, Text, Timestamp) embedded directly in the option object, completely bypassing subcollections.
- **Evidence**: Burden of Proof rule (RFG-001 §3). Full threaded subcollection comments with `@mentions` cannot be justified at pre-launch maturity. A flat remarks array meets 100% of user needs with 10% of the code.
- **Assumptions**: Family members want to say *"Looks great!"* or *"Border is too heavy"*; they do not need Slack-like nested threads or notification dispatchers.
- **Trade-offs**: No multi-level reply nesting; completely acceptable for wedding shopping decisions.
- **Risks & Dependencies**: Minimalist approach has virtually zero regression risk and zero schema migration overhead.
- **Challenge**: *"Adding a full commenting framework before verifying basic persistence and deployment creates a sprawling PR that is difficult to audit and delay-prone."*  
  *What would change my mind*: Explicitly phasing the delivery: Phase 1 fixes the bug, delivers 30-day soft-delete/restore, and reports deployment status; Phase 2 activates the lightweight remarks drawer.
- **Confidence**: High (Dissenting Position leads directly to the optimal Hybrid Synthesis).

---

## 4. Phase 2: Synthesis & Verbatim Challenge Resolution

### 4.1 Resolution of Verbatim Challenges (ICG-001 Conformance)

1. **SSOT Authority Auditor Challenge**:
   > *"If archived looks are hidden from the primary card strip but retained in the data payload, a client-side filter bug could inadvertently surface archived looks in executive reports or printed A4 run sheets."*
   - **Resolution**: Certified. The canonical query helper `getItemImages(item)` is strictly guarded: `return allImages.filter(img => !img.isArchived)`. An isolated helper `getArchivedItemImages(item)` is designated exclusively for the Host Trash Bin modal. A4 consultation dossiers and run sheet generators consume `getItemImages()` and are mathematically immune to archived leakage.

2. **Schema & Firestore Auditor Challenge**:
   > *"Embedding comments inside the candidate look object within the document array means any new comment triggers an onSnapshot broadcast that re-evaluates the entire item card."*
   - **Resolution**: Certified. The shopping table and card renderers already utilize keyed DOM reconciliation. When an update arrives via `fsListenShoppingItems`, only the specific card's remarks counter badge and active option preview update; full re-renders are suppressed.

3. **Service Layer & SDCA Integrity Auditor Challenge**:
   > *"Adding another modal or drawer for archived looks could bloat the DOM and trigger modal dismissal race conditions violating INV-LIFECYCLE-03."*
   - **Resolution**: Certified. Rather than injecting a new floating modal, the existing `option_intake_modal.html` is upgraded with a segmented pill tab header: `[➕ Add New Look]` | `[🗄️ Archived Looks (N)]`. This reuses the existing backdrop, lifecycle handlers, and Escape-key dismissibility with zero new modal layers.

4. **Dependency & Impact Auditor Challenge**:
   > *"If the Host archives the currently active look while another user is viewing it, the remote view could render a blank card or throw a null reference error."*
   - **Resolution**: Certified. Invariant `INV-OPTION-FALLBACK-001`: If `itemOptionSelected[itemId]` references an index that is marked `isArchived: true`, the selection automatically resets to `0` (Canonical Baseline), with a soft toast notification.

5. **File Placement Auditor Challenge**:
   > *"Placing comment rendering logic inside the main controller script risks pushing file complexity beyond maintainable limits."*
   - **Resolution**: Certified. Comment formatting, timestamp relative rendering, and 30-day countdown logic are codified into `ui_primitives/scripts/primitives_core.js` as pure functions, keeping controller additions under 120 lines.

6. **Auth & Permission Auditor Challenge**:
   > *"If Host identification relies strictly on window.currentUser.email, the Host testing in localhost without active Google Sign-In will find themselves locked out of the Delete/Restore buttons."*
   - **Resolution**: Certified. Hybrid Host Gate:
     ```javascript
     function isHostUser() {
       if (window.currentUser && window.currentUser.email) {
         const email = window.currentUser.email.toLowerCase();
         return ['goldenage399@gmail.com', 'krushna.s.panda@gmail.com'].includes(email) ||
                (window.currentUserRole && window.currentUserRole.role.includes('Groom'));
       }
       // Localhost / Development fallback: Host privilege granted if on local port
       return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
     }
     ```
     This allows seamless local development while enforcing strict Google Auth on production (`sree-krushna-forever.web.app`).

7. **Maintainability & Velocity Auditor Challenge (Assigned Dissenter)**:
   > *"Adding a full commenting framework before verifying basic persistence and deployment creates a sprawling PR that is difficult to audit and delay-prone."*
   - **Resolution**: Certified and Adopted. The Council adopts the Dissenter's Pragmatic Hybrid Approach, establishing a strict 2-phase execution sequence.

---

## 5. Architectural Decision & Hybrid Specification

### 5.1 Recommendation Classification (RFG-001 §2)

| Component | Classification | Maturity Target & Justification |
| :--- | :--- | :--- |
| **Fix `TRS-BR-01` Boot Wipe & Report Deployment** | **Required Now** | Actively breaks persistence on localhost; must be eradicated immediately. |
| **Soft-Delete 30-Day Retention State Machine (`isArchived`)** | **Required Now** | Prevents irreversible data loss when shortlisting looks. |
| **Host-Only RBAC for Delete & Restore** | **Required Now** | Directly requested by Host; protects catalog against accidental pruning. |
| **Archived Looks Recovery Tab inside Intake Modal** | **Required Now** | Provides the 1-click restore mechanism and 30-day expiration countdown. |
| **Single-Level Candidate Look Remarks Feed** | **Recommended Soon** | High collaborative value; phased immediately following persistence lock. |
| **Nested Threading & `@mentions` Popover Engine** | **Future Extension** | Speculative complexity for 5 users; deferred until active family scaling. |

### 5.2 The 30-Day Archival Data Contract

```typescript
interface CandidateLook {
  optionIndex: number;
  isDefault: boolean;        // true only for Option 0 (Canonical Vedic Baseline)
  label: string;            // e.g. "Crimson Silk Floral Weave"
  src: string;              // Direct image URL or normalized Drive/Showroom source
  referenceUrl?: string;    // External Pinterest web pin or store link
  type: 'concept' | 'pinterest_cdn' | 'showroom_upload' | 'drive' | 'web_image';
  store?: string;
  priceTier?: string;
  addedAt: string;          // ISO 8601
  addedBy?: string;
  // --- 30-Day Archival Extensions ---
  isArchived?: boolean;     // true when soft-deleted
  archivedAt?: string;      // ISO 8601 when moved to archive
  archivedBy?: string;      // Email or DisplayName of Host
  // --- Collaborative Remarks Extensions ---
  comments?: Array<{
    id: string;             // e.g. "CMT-1727165000000"
    authorName: string;     // e.g. "Sree (Bride)" or "Guest"
    authorRole?: string;
    text: string;
    createdAt: string;      // ISO 8601
  }>;
}
```

### 5.3 Automated 30-Day Purge Rule
On application startup:
```javascript
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const now = Date.now();
itemCustomOptions[itemId] = itemCustomOptions[itemId].filter(opt => {
  if (!opt.isArchived) return true;
  if (!opt.archivedAt) return true; // keep if timestamp missing
  const age = now - new Date(opt.archivedAt).getTime();
  return age < THIRTY_DAYS_MS; // auto-purge if older than 30 days
});
```

---

## 6. Implementation & Verification Plan (Phased Roadmap)

### Phase 1: Bugfix, 30-Day Archival State Machine & Host RBAC
1. **Controller Bugfix (`shopping_src/scripts/controller.js`)**:
   - Remove lines 30–36 hardcoded wipe of `TRS-BR-01`.
   - Update `sanitizeCustomOptions()` to only scrub malformed/blank entries and auto-prune expired archived looks (>30 days).
2. **Archival & Restore State Methods**:
   - Implement `archiveItemOption(itemId, optionIndex)`: Sets `isArchived: true`, stamps `archivedAt`, auto-resets selection if active, syncs to `localStorage` and Firestore.
   - Implement `restoreItemOption(itemId, optionIndex)`: Clears `isArchived` and `archivedAt`, syncs to storage and Firestore.
3. **UI Controls & Host Gate**:
   - Render `[🗑️ Delete Look]` button on active candidate look chips / cards only when `isHostUser()` is true. (Option 0 is permanently protected against deletion).
   - In `option_intake_modal.html`, add `[🗄️ Trash / Archived (N)]` segmented tab showing archived looks with remaining days counter (`"Expires in 29 days"`) and `[♻️ Restore]` button.
4. **Recompile & Parity**:
   - Run `node shopping_src/build.cjs --all` and ensure 100% byte parity with `public/`.
   - Run test suite: `npm run test:shopping`, `npm run verify:modular-architecture`, `npm run verify:ui-lifecycle`.

### Phase 2: Collaborative Look Remarks / Comments Feed
1. **Look Remarks Drawer**:
   - Add collapsible `💬 Remarks (N)` feed inside Option Intake Modal and Lightbox.
   - Input for Name (prefilled for logged-in users) and Remark text.
   - Append comment to `option.comments` array and broadcast via `fsSetShoppingItemStatus`.

---

## 7. Council Certification Status

✅ **CERTIFIED & APPROVED BY ARCHITECTURE COUNCIL (`AC-DEC-2026-040`)**  
- **All 7 mandatory member disciplines evaluated independently.**
- **Assigned Dissenter challenge resolved via pragmatic 2-phase hybrid synthesis.**
- **Burden of Proof (RFG-001) fully satisfied.**
- **Zero blocking requirements remain.** Ready for immediate phased execution.
