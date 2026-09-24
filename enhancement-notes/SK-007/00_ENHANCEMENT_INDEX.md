# SK-007: Candidate Look Lifecycle, 30-Day Archival Recovery & Shared Comments Primitive Integration

## 📊 Metadata

- **Category**: FEATURE / REFACTOR / BUGFIX
- **Priority**: HIGH
- **Status**: IMPLEMENTED
- **Estimate**: 6 hours
- **Target Release**: v2.3.0
- **Risk Level**: LOW
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-006  # Decorator Cockpit Multi-Option Intake & Zoom-Pan Primitives
  related:
    - AC-DEC-2026-021  # Collaborative Options and Multi-Tier Comments Model (PROP-20260915)
    - AC-DEC-2026-038  # Tri-Modal Visual Ingestion & Collaborative Deep-Link Sharing
    - AC-DEC-2026-039  # Decorator Cockpit Multi-Option Visual Intake
    - AC-DEC-2026-040  # Candidate Look Lifecycle, 30-Day Archival Recovery & Collaborative Comments
    - AC-DEC-2026-041  # Modular Comments Primitive Reusability & SK-007 Scaffolding
  blocks:
    - None (Foundational)
```

---

## 🎯 Goal

Resolve the localhost page refresh wipe regression on candidate looks, establish a non-destructive 30-day soft-delete retention archive (Trash Bin) with 1-click recovery for shortlisted bridal trousseau and decor choices, enforce Host-Only RBAC on destructive actions, and wire the universal modular `CommentsEngine` primitive (`ui_primitives/scripts/comments_engine.js`) across both the **Shopping Registry** and **Decorator Cockpit** with live Firestore synchronization.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Boot Wipe Bugfix & 30-Day Soft-Delete State Machine
- [x] **Eradicate Hardcoded Wipe**: Remove `delete itemCustomOptions['TRS-BR-01']` from `shopping_src/scripts/controller.js`.
- [x] **Render-Time 30-Day Filter (No Clock-Race Purge)**: Enforce non-destructive render-time filter in `getItemImages()`: hide archived options older than 30 days (`now - archivedAt >= 30d`) without fragile boot-time hard deletion.
- [x] **State Machine Helpers**: Implement `archiveItemOption(itemId, optionIndex)` and `restoreItemOption(itemId, optionIndex)`.
- [x] **Active Query Guard**: Ensure `getItemImages()` filters out active looks from archived state so cards, Lightbox, and A4 printouts never show deleted looks.
- [x] **Dynamic Fallback Invariant (`INV-OPTION-FALLBACK-001`)**: If the currently selected look is archived, dynamically fall back to the first available non-archived option (not assuming Option 0 always exists).

### Phase 2: In-Modal Trash & Host-Only RBAC
- [x] **Host Identity Gate**: Implement `isHostUser()` checking authenticated Host emails (`goldenage399@gmail.com`, `krushna.s.panda@gmail.com`) with localhost dev fallback.
- [x] **Protected Deletion Affordance**: Render `[🗑️ Delete Look]` button only for the Host (primary baseline concept protected from deletion).
- [x] **In-Modal Recovery Drawer**: Add segmented `[🗄️ Trash / Archived (N)]` tab inside `ui_primitives/components/option_intake_modal.html`.
- [x] **Restoration Control**: Render remaining days countdown badge (`"Expires in 28 days"`) and 1-click `[♻️ Restore Look]` button.

### Phase 3: Cross-Module Universal `CommentsEngine` Integration
- [x] **Decorator Cockpit Bundle**: Add `comments_engine.js` and inject `comments_drawer.html` in `cockpit_src/build.cjs`.
- [x] **Card Remarks Affordances**: Render `[💬 N Remarks]` button on Shopping cards and Decorator Lookbook cards.
- [x] **Shared Primitives Wiring**: Connect button clicks to `window.SKPrimitives.openComments(optionUid, meta)` using standardized UID `${entityId}_opt_${optionIndex}`.
- [x] **Live Persistence Bridge**: Bridge `CommentsEngine` to call `window.fsSetShoppingItemStatus` (or cockpit equivalent) when online so comments from separate mobile devices sync via Firestore in real time.

### Phase 4: Dual-Release Parity & Automated Verification Gate
- [x] **SDCA Recompilation**: Run `node shopping_src/build.cjs --all` and `node cockpit_src/build.cjs --all`.
- [x] **Binary Byte Parity**: Verify 100% byte parity (`fc.exe /b`) between root and `public/` artifacts.
- [x] **Modular Architecture Suite**: Run `npm run verify:modular-architecture` (45/45 checks pass).
- [x] **UI Lifecycle Suite**: Run `npm run verify:ui-lifecycle` (100% pass).
- [x] **Domain Smoke Tests**: Run `npm run test:shopping` and `npm run test:cockpit` (100% pass).
- [x] **Deployment Verification**: Run `npm run verify:deployment` (10/10 layers pass).
- [x] **Governance Wiring**: Run `npm run verify:governance-wiring:all` (188/188 checks pass).

### Phase 5: Candidate Look Ergonomics, Lightbox Destructive Gating & Multi-Surface File Ingestion (`AC-DEC-2026-045`)
- [x] **Eradicate Inline Chip Delete Icon**: Remove `.shop-option-chip-delete` (`✕`) from card rendering in `shopping_src/scripts/controller.js`.
- [x] **Long-Press & Context Menu Popover (`P-LOOK-ERGONOMICS-001`)**: Implement 500ms long-press with `>8px` scroll displacement cancellation on mobile and `contextmenu` on desktop, opening `#skChipActionPopover` (`[🗑️ Move Option to Trash]` / `[🔍 Inspect]`).
- [x] **Sequester Clear Button into Lightbox (`P-DESTRUCTIVE-GATING-001`)**: Remove `.shop-option-chip-clear` from card options bar; render administrative inspection controls inside `#skLightboxBackdrop > div` (`[🗑️ Archive Look]` and `[⚠️ Clear All Custom Looks]`).
- [x] **Desktop Modal Drag-and-Drop Ingestion (`P-PROGRESSIVE-INTAKE-001`)**: Implement modal-wide HTML5 drag & drop listeners on `#skOptionIntakeBackdrop` and `.sk-intake-card`.
- [x] **Android Camera & File Picker Ingestion**: Update `#skFileInput` to support `accept="image/*"`, providing direct access to native Android camera capture and photo gallery.
- [x] **Client-Side Offscreen Canvas Compressor**: Implement `compressImageFile()` in `controller.js` guaranteeing Data URLs stay under 280KB.
- [x] **Automated Verification & Byte Parity**: Pass `npm run test:shopping`, `npm run test:cockpit`, `npm run verify:modular-architecture`, `npm run verify:ui-lifecycle`, `npm run verify:deployment`, and `npm run verify:governance-wiring:all` with 100% byte parity.

---

## 🛡️ Risk Assessment

- **Risks**:
  1. CSS class collision or z-index battle between `#skCommentsDrawer` and `#skOptionIntakeBackdrop`.
  2. Bypassing `getItemImages()` filter in secondary table or run sheet views.
  3. Modifying `build.cjs` causing SDCA line limit violation (>500 lines).
- **Mitigation**:
  1. Z-index layering: Comments Drawer (`z-index: 100010`) stacks cleanly above Intake Modal (`z-index: 100000`).
  2. Centralize option extraction strictly in `getItemImages()`.
  3. Keep `build.cjs` modular and run `npm run verify:modular-architecture`.
