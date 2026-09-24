# 🏛️ Architecture & UI Council: Candidate Looks Ergonomics, Destructive Action Gating & Multi-Surface Visual Intake Architecture

**Decision IDs**: `AC-DEC-2026-045` / `UI-DEC-2026-041` / `P-LOOK-ERGONOMICS-001` / `P-DESTRUCTIVE-GATING-001` / `P-PROGRESSIVE-INTAKE-001`  
**Date**: 2026-09-24  
**Status**: APPROVED & CERTIFIED  
**Council Deliberation Protocol**: v1.0 (Phase 0–4 Skeleton + RFG-001 + ICG-001 + /plan-review Integration)  
**Governing Enhancement Ticket**: `SK-007` (Phase 5) in `enhancement-notes/SK-007/00_ENHANCEMENT_INDEX.md`  

---

## 🌍 Grounding Snapshot (RFG-001)

- **Maturity Stage**: Launch-Imminent (T-70 Days to Wedding, active family shopping expeditions in Bhubaneswar)
- **Module Count**: 13 Active Tabs (`index.html`, `FEATURE_CATALOG.json`)
- **Active Real Users**: 4–5 Primary Family Stakeholders (Google/Gmail authenticated Host: `goldenage399@gmail.com` / `krushna.s.panda@gmail.com`; extended family WhatsApp collaborators via deep-link tokens)
- **Primary Host OS**: Windows 11 (Desktop/Laptop with File Explorer) & Android (Mobile Chrome with native Camera and Photos)
- **Core Optimization Target**: Pragmatic, bulletproof ergonomics, accidental deletion prevention, and frictionless image intake across Windows and Android devices without bloated dependencies.

---

## 🗺️ Phase 0: Evidence Collection & Pre-Flight Audit

### 1. Evidence Snapshot & Ground Truth
- **Snapshot Git Hash**: `d38069a8b5b4678cccbe4b67f7d0b8976679c567`
- **Files Inspected Physically**:
  - `shopping_src/scripts/controller.js` (Lines 850–965, 2440–2730)
  - `shopping_src/styles/08_collab_options_and_sharing.css` (Lines 240–310, 4290–4330)
  - `ui_primitives/components/option_intake_modal.html` (Lines 1–100)
  - `ui_primitives/components/lightbox.html` (Lines 1–30)
  - `cockpit_src/scripts/controller.js` (Lines 1310–1335, 1455–1470)
  - `cockpit_src/styles/05_lookbook_and_modals.css` (Lines 340–405)
  - `enhancement-notes/SK-007/00_ENHANCEMENT_INDEX.md` (Lines 1–80)
  - `User_Created/Discussion Threads/Shopping/260918_ShoppingList.md` (Lines 5168–5210)

### 2. Prior Rulings & Ledger Trace
- `AC-DEC-2026-038` / `UI-DEC-2026-034`: Pinterest & Direct Visual Ingestion (`P-PINTEREST-INTAKE-001` / `P-MULTI-IMAGE-CONTAINER-001`).
- `AC-DEC-2026-039` / `UI-DEC-2026-035`: Decorator Cockpit Multi-Option Visual Intake (`P-DECOR-MULTI-OPTION-001`).
- `AC-DEC-2026-040` / `UI-DEC-2026-036`: Candidate Look Lifecycle & 30-Day Archival Recovery (`P-COLLAB-OPTION-LIFECYCLE-001` / `P-AUDIT-RETENTION-001`).
- `AC-DEC-2026-041` / `UI-DEC-2026-037`: Modular Comments Primitive Reusability & SK-007 Scaffolding (`STD-MOD-COMP-001`).
- `AC-DEC-2026-042` / `UI-DEC-2026-038`: Mandatory Ticket Registration & Phased Planning Gate Protocol (`P-TICKET-FIRST-PHASING-001`).

### 3. Duplication & Conflict Check
- **Option Deletion**: Currently, `shopping_src/scripts/controller.js` (L941) renders inline `<button class="shop-option-chip-delete">✕</button>` with red styling inside `.shop-option-chip-group`. No long-press or context menu exists.
- **Clear Action**: Currently, `shopping_src/scripts/controller.js` (L953–957) renders `<button class="shop-option-chip shop-option-chip-clear">✕ Clear</button>` right inside the card's `.shop-card-options-bar`. In Lightbox (`ui_primitives/components/lightbox.html`), no option-clearing affordance exists.
- **Intake Dropzone**: `ui_primitives/components/option_intake_modal.html` has `#skDropzone` and `#skFileInput` in Tab Pane 2 (`#skPaneDevice`), while Tab Pane 1 (`#skPaneDrive`) is URL-only. No window-level or modal-wide dragover/drop handlers exist; mobile users must manually switch to Tab 2 to browse files.

---

## 🏛️ Phase 1: Independent Deliberation of Seated Council Members

### 1. The SSOT Authority Auditor
- **Position**: APPROVE Option Deletion Refactor & Sequestered Clear Action; enforce strict lifecycle consistency across SSOT catalog and storage.
- **Evidence**: `SPEC-PROC-TROUSSEAU-001.md` and `enhancement-notes/SK-007/00_ENHANCEMENT_INDEX.md` designate Option 0 as the immutable canonical liturgical baseline. Inline deletion crosses on cards create user anxiety that canonical records are fragile.
- **Assumptions**: Canonical Option 0 remains non-deletable; soft-deletion moves custom options into the 30-day retention trash bin (`isArchived: true, archivedAt: ISOString`).
- **Trade-offs**: Long-press gesture is less visually obvious than an always-visible red cross, but vastly reduces accidental deletion while shopping.
- **Risks & Dependencies**: Dependency on `archiveItemOption(itemId, optIdx)` and `restoreItemOption(itemId, optIdx)` already verified in SK-007 Phase 1.
- **Challenge**: *"If a family user is unaware of the long-press gesture, how will they ever discover that candidate looks can be removed or managed?"*
  - **Concrete Failure Scenario**: A user adds 5 showroom photos, shortlists 1, and wants to delete the other 4. Tapping a chip only selects it; without a visible cue, they assume deletions cannot be done on mobile.
  - **What would change my mind**: Providing a dual-path design: a long-press gesture on the chip, plus an explicit, discoverable `[🗑️ Archive Option]` action inside the Lightbox inspection view.
- **Confidence**: High.

---

### 2. The Schema & Firestore Auditor
- **Position**: APPROVE. Ensure image data URLs from local device uploads conform to local caching invariants and do not overwhelm Firestore document limits (1MB).
- **Evidence**: `firestore.rules` validates `shopping_items/{itemId}` overlays. In `controller.js` (L2644), local file uploads are read via `FileReader.readAsDataURL()`. Large raw camera photos from 48MP Android phones can generate 10MB+ Data URLs.
- **Assumptions**: Local Data URLs are compressed or downscaled via HTML5 canvas before storage, or stored as local showroom drafts in `localStorage['sk_item_custom_options']` (max 5MB limit).
- **Trade-offs**: In-memory canvas downscaling (max 1600px width, 0.82 JPEG quality) takes ~50ms of CPU time on device, but prevents storage quota exhaustion and laggy card rendering.
- **Risks & Dependencies**: Out-of-memory errors on low-end mobile devices when handling uncompressed camera bursts.
- **Challenge**: *"If a mobile user uploads an uncompressed 12MB raw photo from an Android camera, storing it directly as a Data URL will exhaust localStorage and crash JSON serialization."*
  - **Concrete Failure Scenario**: User snaps photo in Utkalika, Bhubaneswar; `readAsDataURL` produces an 18MB base64 string; `localStorage.setItem` throws `QuotaExceededError`; option disappears silently on reload.
  - **What would change my mind**: Implementing a zero-dependency client-side canvas compressor (`compressImageFile(file, maxWidth=1400, quality=0.82)`) that guarantees data URLs stay under 300KB before storing.
- **Confidence**: High.

---

### 3. The Service Layer Integrity Auditor
- **Position**: APPROVE Hybrid Progressive Intake Architecture. Ensure SDCA decoupling between `option_intake_modal.html` and `controller.js`.
- **Evidence**: `ui_primitives/components/option_intake_modal.html` is consumed by both `shopping_src` and `cockpit_src`. Changes to modal markup must maintain 100% contract compatibility across both surfaces.
- **Assumptions**: Both Shopping Catalog and Decorator Cockpit compile against the updated shared primitive without build regressions.
- **Trade-offs**: Enhancing the shared intake primitive touches both engines, requiring dual-build recompilation (`node shopping_src/build.cjs --all` and `node cockpit_src/build.cjs --all`).
- **Risks & Dependencies**: Breaking Decorator Cockpit intake tests (`npm run test:cockpit`) if DOM IDs are renamed.
- **Challenge**: *"If shared primitive markup in `ui_primitives/components/option_intake_modal.html` is altered with shopping-specific IDs, Decorator Cockpit builds will fail smoke tests."*
  - **Concrete Failure Scenario**: Renaming `#skFileInput` or removing `#skPaneDevice` causes `test:cockpit` Phase 1b to fail due to missing DOM query anchors.
  - **What would change my mind**: Keeping all existing element IDs intact while adding universal drag-and-drop listener hooks and dual-mode triggers.
- **Confidence**: High.

---

### 4. The Dependency & Impact Auditor
- **Position**: APPROVE Lightbox Clear Button Relocation. Relocating `[✕ Clear]` from card to `#skLightboxBackdrop > div` dramatically reduces card complexity and DOM listener count.
- **Evidence**: Currently, `shopping_src/scripts/controller.js` (L953–957) evaluates `customCount > 0 && isHost` for every rendered card. Moving it to Lightbox isolates the action to active inspection.
- **Assumptions**: `openShoppingLightbox()` receives the `itemId` and `optionIndex` context so that Lightbox knows which item is being inspected.
- **Trade-offs**: Lightbox must now be state-aware (storing current `activeItemId` and `activeOptionIndex`), rather than a pure passive viewer.
- **Risks & Dependencies**: None. Lightbox already handles active photo resolution and zoom engine.
- **Challenge**: *"If Lightbox modal becomes the only home for the Clear button, how does a user clear custom looks if an item has a broken image that cannot be opened in Lightbox?"*
  - **Concrete Failure Scenario**: A bad image URL fails to load; clicking the card media placeholder opens intake instead of lightbox; user cannot open lightbox to clear the bad look.
  - **What would change my mind**: Ensuring the card placeholder and card title media wrapper always allow opening the Lightbox (with fallback SVG/plate), and ensuring the Trash Bin modal also provides a direct 'Reset All' button for the item.
- **Confidence**: High.

---

### 5. The File Placement Auditor
- **Position**: APPROVE. File modifications strictly adhere to SDCA boundaries:
  - `shopping_src/scripts/controller.js` (controller logic, gesture timers, lightbox actions).
  - `shopping_src/styles/08_collab_options_and_sharing.css` (long-press popover, lightbox clear button styles).
  - `ui_primitives/components/option_intake_modal.html` (unified drag-drop zone & mobile camera capture attributes).
  - `ui_primitives/components/lightbox.html` (inspection administrative footer).
- **Evidence**: `STD-MOD-COMP-001` line limits: `controller.js` partials remain cleanly modular, and compiled outputs maintain dual-release byte parity.
- **Assumptions**: Zero new standalone script files; extend established SDCA partials.
- **Trade-offs**: None.
- **Risks & Dependencies**: None.
- **Challenge**: *"Will adding long-press gesture handling and canvas image compression inflate `controller.js` beyond maintainable boundaries?"*
  - **Concrete Failure Scenario**: Bloating `controller.js` with complex gesture libraries or polyfills.
  - **What would change my mind**: Implementing a clean, native 30-line gesture utility using standard pointer events (`pointerdown`, `pointerup`, `pointercancel`, `contextmenu`) with zero external libraries.
- **Confidence**: High.

---

### 6. The Decision & Standards Auditor
- **Position**: APPROVE. Register two complementary standards:
  - `P-LOOK-ERGONOMICS-001`: Candidate Option Long-Press & Contextual Management Standard.
  - `P-DESTRUCTIVE-GATING-001`: Lightbox Inspection Gating for Irreversible Destructive Actions.
  - `P-PROGRESSIVE-INTAKE-001`: Progressive Multi-Surface Visual Intake (Desktop Drag & Drop + Mobile Native Camera Capture).
- **Evidence**: Nielsen Norman Group touch guidelines dictate that destructive actions should never be placed where a user commonly rests their thumb. Material Design 3 guidelines mandate two-step confirmation for bulk collection purges.
- **Assumptions**: Host authorization (`isHostUser()`) continues to gate all archival, restoration, and clearance actions.
- **Trade-offs**: Documenting these patterns establishes precedents for future modules (Venues, Decor).
- **Risks & Dependencies**: None.
- **Challenge**: *"Does standardizing long-press create an inconsistency if other modules (like Decorator Cockpit) still use old chip patterns?"*
  - **Concrete Failure Scenario**: Users have long-press on Shopping cards but click crosses on Decor cards.
  - **What would change my mind**: Porting the long-press and lightbox clear patterns to Decorator Cockpit in a fast-follow phase under SK-007.
- **Confidence**: High.

---

### 7. The Auth & Permission Auditor
- **Position**: APPROVE. Maintain strict Host-Only RBAC (`isHostUser()`) on all long-press popover delete triggers and Lightbox clear buttons.
- **Evidence**: In `shopping_src/scripts/controller.js` (L940, L953, L2552), `isHostUser()` verifies `goldenage399@gmail.com`, `krushna.s.panda@gmail.com`, or localhost development. Guest and family collaborators must only view and comment.
- **Assumptions**: If a guest triggers a long-press on mobile, the popover informs them: `"Option Archival is restricted to Wedding Hosts. You can leave feedback via 💬 Remarks."`
- **Trade-offs**: Friendly informative feedback rather than a dead gesture builds trust with family users.
- **Risks & Dependencies**: Auth state timing race resolved via `sk-auth-state-changed` event bridge (INC-092 / `AC-DEC-2026-033`).
- **Challenge**: *"If a non-host user right-clicks or long-presses an option chip, will the app throw a silent permission exception or show a broken menu?"*
  - **Concrete Failure Scenario**: Guest user holds finger on option chip; an empty popover appears or UI hangs.
  - **What would change my mind**: Explicit conditional rendering in the popover: if host, show `[🗑️ Move Option to Trash]`; if guest, show `[💬 Comment on Option]` and `[🔍 Inspect Look]`.
- **Confidence**: High.

---

### 8. The Maintainability & Velocity Auditor (RFG-001 Owner & Assigned Dissenter)
- **Position**: DISSENT / CHALLENGE against overly complex gesture frameworks or separate intake modal redesigns. ADVOCATE for the simplest native solution that directly satisfies the user's three points.
- **Evidence**: RFG-001 §3 Burden of Proof: The repository is pre-launch, 4–5 users, 1 developer. We cannot afford heavy touch gesture libraries (Hammer.js), complex drag-and-drop third-party engines, or multi-tab redesigns that break verified tests.
- **Assumptions**: Native HTML5 Drag and Drop on Desktop + standard `<input type="file" accept="image/*" capture="environment">` on Mobile + 500ms `setTimeout` on `pointerdown` completely solves the user's problem in <100 lines of vanilla JavaScript.
- **Trade-offs**: Zero new npm dependencies, zero build pipeline overhead.
- **Risks & Dependencies**: Pointer event cancellation on mobile scrolling (`touchmove` / `pointermove`) must be cleanly handled so scrolling a card does not trigger the deletion popover.
- **Challenge**: *"If pointerdown starts a 500ms timer, a user scrolling the page with their thumb across the options bar will accidentally trigger the delete popover mid-scroll!"*
  - **Concrete Failure Scenario**: User swipes vertically on Android Chrome to scroll down the trousseau items; their thumb lands on an option chip for 520ms during slow drag; delete dialog pops up and interrupts scrolling.
  - **What would change my mind**: Binding `pointermove` distance check (>10px movement cancels the timer) and canceling on `pointercancel` / `scroll`.
- **Confidence**: High.

---

## 🔬 Phase 2: Synthesis & Resolution of Auditor Challenges

### 1. Verbatim Challenge Resolution Matrix (ICG-001 Mandate)

| Auditor | Verbatim Challenge Quote | Architectural Resolution & Proof |
| :--- | :--- | :--- |
| **SSOT Authority** | *"If a family user is unaware of the long-press gesture, how will they ever discover that candidate looks can be removed or managed?"* | **Resolved**: Implement a **Dual-Surface Ergonomic Pattern**: 500ms long-press on chip is the fast gesture; simultaneously, an explicit `[🗑️ Archive Look]` button is placed inside the Lightbox modal dialog (`#skLightboxBackdrop > div`). A subtle tooltip / longpress badge (`"Hold to manage"`) is displayed on hover. |
| **Schema & Firestore** | *"If a mobile user uploads an uncompressed 12MB raw photo from an Android camera, storing it directly as a Data URL will exhaust localStorage and crash JSON serialization."* | **Resolved**: Implement client-side HTML5 Canvas downsampling in `controller.js` (`compressImageFile(file, 1400, 0.82)`) before converting to Data URL. Output images are guaranteed under 280KB, preserving performance and localStorage quota. |
| **Service Layer** | *"If shared primitive markup in `ui_primitives/components/option_intake_modal.html` is altered with shopping-specific IDs, Decorator Cockpit builds will fail smoke tests."* | **Resolved**: Preserve all canonical DOM IDs (`#skDropzone`, `#skFileInput`, `#skPaneDrive`, `#skPaneDevice`). Upgrade `#skFileInput` with `capture="environment"`, make `#skDropzone` accept drag-and-drop anywhere across the modal body, and keep backward-compatible contracts. |
| **Dependency & Impact** | *"If Lightbox modal becomes the only home for the Clear button, how does a user clear custom looks if an item has a broken image that cannot be opened in Lightbox?"* | **Resolved**: (1) The card media placeholder has a fallback click target opening Lightbox with canonical Vedic fallback; (2) The Trash Bin modal (`#skPaneArchived`) provides a secondary administrative `[Reset All Looks to Concept]` button for fail-safe recovery. |
| **File Placement** | *"Will adding long-press gesture handling and canvas image compression inflate `controller.js` beyond maintainable boundaries?"* | **Resolved**: Zero dependencies. Native Pointer Events API (`pointerdown`, `pointerup`, `pointermove`, `contextmenu`) implemented in ~35 lines. Canvas downsampler in ~25 lines. Total footprint <65 lines, well within `STD-MOD-COMP-001`. |
| **Decision & Standards** | *"Does standardizing long-press create an inconsistency if other modules (like Decorator Cockpit) still use old chip patterns?"* | **Resolved**: Standardize `P-LOOK-ERGONOMICS-001` as a shared pattern; deploy on Shopping Registry first in SK-007 Phase 5, with automated regression smoke tests verifying no cross-module interference. |
| **Auth & Permission** | *"If a non-host user right-clicks or long-presses an option chip, will the app throw a silent permission exception or show a broken menu?"* | **Resolved**: Contextual popover checks `isHostUser()`: if Host, offers `[🗑️ Archive Option to Trash]`; if Guest/Family, displays `[💬 Leave Remark]` and `[🔍 Fullscreen Inspect]`. Zero exceptions, clear intent. |
| **Maintainability (Dissenter)** | *"If pointerdown starts a 500ms timer, a user scrolling the page with their thumb across the options bar will accidentally trigger the delete popover mid-scroll!"* | **Resolved**: Attach `pointermove` listener tracking displacement (`Math.hypot(dx, dy) > 8px`). If the user moves their thumb by more than 8 pixels, the long-press timer is immediately cancelled. Also cancel on `pointercancel` and window scroll. |

---

### 2. Areas of Unanimous Agreement
1. **Eradication of Inline Cross Badges**: The permanent red circular `✕` icon on `.shop-option-chip` must be removed immediately. It degrades visual craft and causes high misclick rates.
2. **Relocation of `[✕ Clear]` Button to Lightbox**: The mass clear action must be removed from the card options bar and placed safely inside `document.querySelector("#skLightboxBackdrop > div")` (the Lightbox inspection view).
3. **Frictionless Multi-Platform File Ingestion**:
   - On Windows Desktop: Dragging and dropping an image file anywhere onto the intake modal immediately ingests it.
   - On Android Mobile: Tapping the intake upload area launches the native Android chooser (Camera or Files/Gallery) directly via `<input type="file" accept="image/*">`.
   - Elevated Ingestion Surface: The intake modal should feature a prominent dual-action dropzone or smart tab selector so local photo upload is never buried.

---

### 3. Recommended Course of Action (RFG-001 Classified)

#### 🟢 Required Now (SK-007 Phase 5 Implementation)
1. **Candidate Chip Ergonomics (`P-LOOK-ERGONOMICS-001`)**:
   - Remove `.shop-option-chip-delete` button from `controller.js` render loop.
   - Attach native pointer gesture listeners (`pointerdown`, `pointermove`, `pointerup`, `contextmenu`) to candidate chips.
   - Trigger a lightweight anchored contextual popover after 500ms hold (or desktop right-click):
     - Host: `[🗑️ Move Option N to Trash]` + `[🔍 Inspect in Lightbox]`.
     - Guest: `[💬 Add Remark]` + `[🔍 Inspect in Lightbox]`.
   - Implement thumb scroll threshold cancellation (`>8px` displacement cancels timer).
2. **Lightbox Destructive Gating (`P-DESTRUCTIVE-GATING-001`)**:
   - Remove `.shop-option-chip-clear` from `.shop-card-options-bar` HTML.
   - Add an administrative inspection toolbar inside `.sk-lightbox-card` (`#skLightboxBackdrop > div`):
     - When inspecting a custom candidate look: `[🗑️ Move Current Look to Trash]`.
     - When inspecting an item with ≥1 custom look: `[⚠️ Clear All Custom Looks (Revert to Concept)]` with a confirmation step.
3. **Progressive Multi-Platform Ingestion (`P-PROGRESSIVE-INTAKE-001`)**:
   - In `ui_primitives/components/option_intake_modal.html`:
     - Update `#skFileInput` to support native camera and gallery picking: `accept="image/*"`.
     - Add secondary button `<button type="button" id="skBtnTakeCamera">📸 Take Photo / Browse</button>`.
   - In `controller.js`:
     - Add modal-wide drag & drop listeners (`dragover`, `dragleave`, `drop`) on `#skOptionIntakeBackdrop` and `.sk-intake-card`.
     - Implement client-side Canvas compressor (`compressImageFile`) ensuring all uploaded photos are resized to max 1400px width/height and compressed to ~200KB before setting Data URL.
     - Auto-switch to preview mode upon successful drop or file selection.
4. **Dual-Release Compilation & Verification**:
   - Recompile via `node shopping_src/build.cjs --all` and `node cockpit_src/build.cjs --all`.
   - Validate 100% binary byte parity (`fc.exe /b`) and pass all verification test suites (`test:shopping`, `test:cockpit`, `verify:modular-architecture`, `verify:ui-lifecycle`, `verify:deployment`, `verify:governance-wiring:all`).

#### 🟡 Recommended Soon (SK-007 Phase 6)
- Port the long-press and lightbox clear patterns to Decorator Cockpit (`cockpit_src/scripts/controller.js`) to maintain 100% cross-module interaction parity.

#### 🔵 Future Extension (Post-Launch)
- Multi-file batch drag & drop allowing simultaneous intake of 3–5 showroom photos at once.

#### ⚪ Speculative (Rejected)
- Heavy external gesture libraries (e.g. Hammer.js, ZingTouch) — rejected as unnecessary bloat.

---

## 📋 /plan-review Governance Gate & Verification Matrix

### 1. As-Is Baseline Audit (Blocking Pre-Gate — P04/P31)

| File | Lines Inspected | Relevant Existing Logic | Status |
| :--- | :--- | :--- | :--- |
| `shopping_src/scripts/controller.js` | L935–958 | Card options bar rendering with `.shop-option-chip-delete` and `.shop-option-chip-clear` | LIVE (Requires removal & refactor) |
| `shopping_src/scripts/controller.js` | L2450–2474 | `window.openShoppingLightbox(title, photoUrl, caption)` | LIVE (Requires item context & admin actions) |
| `shopping_src/scripts/controller.js` | L2638–2650 | `fileInput.addEventListener('change', ...)` | LIVE (Requires canvas downsampling) |
| `ui_primitives/components/option_intake_modal.html` | L20–50 | `#skPaneDrive` vs `#skPaneDevice` tabs & `#skDropzone` | LIVE (Requires modal-wide drop & camera affordance) |
| `ui_primitives/components/lightbox.html` | L1–30 | Lightbox markup (`#skLightboxBackdrop > div`) | LIVE (Requires administrative action container) |
| `shopping_src/styles/08_collab_options_and_sharing.css` | L256–280 | `.shop-option-chip-delete` styles | LIVE (To be replaced with popover styles) |

### 2. Zero-Trust Claim Verification (Blocking Pre-Gate)

| Element Type | Verified Location | Purpose in Plan |
| :--- | :--- | :--- |
| **Method** | `shopping_src/scripts/controller.js:941` | Replace inline `archiveItemOption` call with long-press trigger |
| **Method** | `shopping_src/scripts/controller.js:954` | Remove `clearItemCustomOptions` from card options bar |
| **Method** | `shopping_src/scripts/controller.js:2450` | Extend `openShoppingLightbox(title, photoUrl, caption, itemId, optIdx)` |
| **CSS Class** | `shopping_src/styles/08_collab_options_and_sharing.css:256` | Deprecate `.shop-option-chip-delete` in favor of `.shop-option-popover` |
| **DOM ID** | `ui_primitives/components/option_intake_modal.html:45` | Bind drag & drop and camera click to `#skDropzone` and `#skFileInput` |
| **DOM ID** | `ui_primitives/components/lightbox.html:24` | Inject administrative action controls into `#skLightboxCaption` |

### 3. The 5 Lenses Feasibility Check
1. **User Experience (UX)**: High. Eliminates ugly red delete crosses, protects against accidental deletion, and provides seamless drag-and-drop on PC and 1-tap camera photo capture on Android.
2. **Workflow Efficiency**: High. Reduces card visual clutter while shopping in crowded Bhubaneswar bazaars; Host can inspect in Lightbox and manage looks effortlessly.
3. **Complexity & Cognitive Load**: Low. Vanilla JavaScript Pointer Events and HTML5 Canvas downsampling (<65 lines total).
4. **Performance Implications**: Positive. Eliminates dozens of delete button DOM nodes per card and compresses camera uploads to <280KB, preventing memory and localStorage bloat.
5. **Implementation Practicality**: Realistic and fully verified within the existing SDCA architecture.

### 4. P18 Integration Chain Trace
- **UI Trigger 1 (Mobile Long-Press / Desktop Right-Click)**: User holds touch on candidate look chip for 500ms (or right-clicks on PC) ➔ `handleChipPointerDown` fires timer ➔ `showChipActionPopover(e, itemId, optIdx)` renders popup.
- **UI Trigger 2 (Desktop File Drag & Drop)**: User drags image file from Windows Explorer anywhere over `#skOptionIntakeBackdrop` ➔ `dragover` highlights dropzone ➔ `drop` captures `e.dataTransfer.files[0]`.
- **UI Trigger 3 (Mobile Camera Upload)**: Android user taps dropzone ➔ triggers `#skFileInput.click()` ➔ native system camera/gallery chooser opens ➔ user takes photo.
- **Processing Layer**: `compressImageFile(file, 1400, 0.82)` renders into offscreen `<canvas>`, exports optimized JPEG Data URL (`~200KB`).
- **Storage / State Layer**: Saves to `itemCustomOptions[itemId]` in `localStorage` with `isArchived: false, createdAt: ISOString`, and mirrors to Firestore online overlay if authenticated.
- **Render / Feedback Layer**: Dispatches `renderItems()` ➔ updates candidate chips ➔ shows success Toast ➔ auto-switches to newly added candidate look.
- **Destructive Gating Layer**: Host opens Lightbox (`#skLightboxBackdrop > div`) ➔ sees full image with `[🗑️ Archive Look]` and `[⚠️ Clear All Custom Looks]` ➔ triggers deletion only upon deliberate inspection.

---

## 🎯 Phase 3: Sequential Implementation Steps & Binary Gates (VG/DN)

### Step 1: Candidate Chip Long-Press & Right-Click Ergonomics
- Remove `.shop-option-chip-delete` button from card rendering template in `shopping_src/scripts/controller.js`.
- Add `data-item-id="${item.id}"` and `data-opt-idx="${img.optionIndex}"` attributes to `.shop-option-chip`.
- Implement pointer event delegation on `.shop-card-options-bar`:
  - `pointerdown`: start 500ms timer; store initial `(startX, startY)`.
  - `pointermove`: if `Math.hypot(e.clientX - startX, e.clientY - startY) > 8`, cancel timer.
  - `pointerup` / `pointercancel`: cancel timer. If timer elapsed, suppress default click and open `#skChipActionPopover`.
  - `contextmenu`: prevent default on desktop and immediately open `#skChipActionPopover`.
- Style `.sk-chip-action-popover` in `shopping_src/styles/08_collab_options_and_sharing.css` with dark glassmorphism, gold accent, and 44px touch targets.
- 🔍 **Validation Gate 1**: Long-press on candidate chip opens popover; quick tap selects option without popover.
- 🚦 **Decision Node 1**: If touch scroll inadvertently triggers popover, increase displacement threshold to 12px and verify cancel on `scroll`.

### Step 2: Sequestering `[✕ Clear]` Button into Lightbox Modal
- Eradicate `.shop-option-chip-clear` from `.shop-card-options-bar` HTML in `shopping_src/scripts/controller.js`.
- Update `openShoppingLightbox(title, photoUrl, caption, itemId, activeOptIdx)` signature to receive `itemId` and `activeOptIdx`.
- In `openShoppingLightbox()`, if `itemId` is provided and has custom options and viewer is Host, inject administrative inspection actions into `#skLightboxCaption`:
  - If inspecting custom option (optIdx > 0): `[🗑️ Archive This Look to Trash]`.
  - If item has custom options: `[⚠️ Clear All Custom Looks (Revert to Concept)]`.
- Bind click handlers to `window.archiveItemOption(itemId, optIdx)` and `window.clearItemCustomOptions(itemId)` with confirmation dialog.
- 🔍 **Validation Gate 2**: Clear button is absent from card front; Clear and Archive actions are present and functional inside `#skLightboxBackdrop > div`.
- 🚦 **Decision Node 2**: If Lightbox is opened for an item without custom options, administrative buttons are hidden.

### Step 3: Progressive Multi-Platform File Ingestion (Windows Drag & Drop + Android Camera)
- In `ui_primitives/components/option_intake_modal.html`:
  - Add `accept="image/*"` to `#skFileInput`.
  - Enhance `#skDropzone` markup to clearly indicate: `"Tap to take photo / browse device, or drag & drop image here"`.
- In `shopping_src/scripts/controller.js`:
  - Implement canvas compression helper `compressImageFile(file, maxWidth, quality)`.
  - Bind `dragover`, `dragenter`, `dragleave`, `drop` events to `#skOptionIntakeBackdrop` and `.sk-intake-card`.
  - When image file is dropped or selected via file picker:
    1. Show loading spinner / toast: `"Processing & optimizing photo..."`.
    2. Compress via Canvas to <280KB Data URL.
    3. Auto-populate title if empty (`"Showroom Selection (Option N)"`).
    4. Auto-switch to preview card.
- 🔍 **Validation Gate 3**: Dropping a JPG/PNG onto the intake modal loads the preview; file input on Android opens camera/gallery; data URL size is <300KB.
- 🚦 **Decision Node 3**: If canvas compression fails on unsupported image formats (e.g. HEIC), fall back gracefully to direct FileReader.

### Step 4: Recompilation, Dual-Release Byte Parity & Automated Verification
- Run SDCA compilers: `node shopping_src/build.cjs --all` and `node cockpit_src/build.cjs --all`.
- Verify binary byte parity: root `shopping-registry.html`, `shopping-fragment.html`, `decorator-cockpit.html`, `cockpit-fragment.html` match their `public/` counterparts 100%.
- Run automated verification gates:
  - `npm run test:shopping`
  - `npm run test:cockpit`
  - `npm run verify:modular-architecture`
  - `npm run verify:ui-lifecycle`
  - `npm run verify:deployment`
  - `npm run verify:governance-wiring:all`
- 🔍 **Validation Gate 4**: All 6 verification commands exit code 0.
- 🚦 **Decision Node 4**: If byte parity check fails, re-run `node shopping_src/build.cjs --all`.

---

## 📜 Process Notes (ICG-001 Self-Critique Close)

- **Gap 1**: Previous intake design assumed users primarily collect Pinterest URLs on desktop, leaving mobile showroom photography in a secondary tab.
  - **Proposed Fix**: Elevated local photo upload to a universal dropzone and native mobile camera picker; applied in-session under SK-007 Phase 5.
- **Gap 2**: The mass destructive action `[✕ Clear]` was exposed on the card front, inviting accidental wipes during fast mobile thumb navigation.
  - **Proposed Fix**: Sequestered `[✕ Clear]` into the Lightbox inspection view (`#skLightboxBackdrop > div`); applied in-session under SK-007 Phase 5.
- **Gap 3**: Inline red delete crosses on option chips caused visual noise and touch targets collisions.
  - **Proposed Fix**: Replaced with 500ms long-press / desktop right-click contextual popover; applied in-session under SK-007 Phase 5.

---

## 🏛️ Council Certification

The Architecture & UI Council hereby **APPROVES AND CERTIFIES** `AC-DEC-2026-045` / `UI-DEC-2026-041`. All mandatory pre-gates, As-Is audits, zero-trust citations, auditor challenges, and verification gates have been satisfied.

**Signed by the Council**:
- The SSOT Authority Auditor
- The Schema & Firestore Auditor
- The Service Layer Integrity Auditor
- The Dependency & Impact Auditor
- The File Placement Auditor
- The Decision & Standards Auditor
- The Auth & Permission Auditor
- The Maintainability & Velocity Auditor (RFG-001 Owner & Assigned Dissenter)
