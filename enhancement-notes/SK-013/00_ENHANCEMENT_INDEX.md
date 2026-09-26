# SK-013: Interactive Multi-Look Lightbox Carousel & Shared Primitive Navigation Architecture

## 📊 Metadata

- **Category**: FEATURE / UI_PRIMITIVES / CAROUSEL_NAVIGATION
- **Priority**: HIGH
- **Status**: COMPLETED
- **Estimate**: 4 hours
- **Target Release**: v2.6.0
- **Risk Level**: MEDIUM
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-007  # Candidate Look Lifecycle, 30-Day Archival Recovery & Shared Comments Primitive Integration
    - SK-010  # Universal UI Button Primitives & Pre-Flight Design System Verification Gate
  related:
    - AC-DEC-2026-038  # Pinterest Intake & Multi-Image Containers (P-MULTI-IMAGE-CONTAINER-001)
    - AC-DEC-2026-050  # Interactive Multi-Look Lightbox Carousel Architecture (STD-UI-PRIMITIVE-003)
    - UI-DEC-2026-045  # Multi-Look Lightbox Gestures & Token Alignment
    - User_Created/Discussion Threads/Council/260924_arch_council_interactive_multi_look_lightbox_carousel.md
    - .agent/patterns/interactive-multi-look-lightbox-carousel.md
  blocks:
    - None
```

---

## 🎯 Goal

Upgrade the universal Lightbox (`#skLightboxBackdrop`) and Shopping Catalog integration from a static single-image viewer into a high-density, interactive multi-look inspection carousel:
1. **Sequential Navigation Controls**: Add accessible Previous (`◀`) and Next (`▶`) navigation buttons (`#skBtnLightboxPrev`, `#skBtnLightboxNext`) styled with canonical `.sk-btn` and `.sk-btn-nav` tokens (`STD-UI-PRIMITIVE-002`).
2. **Visual Position Counter**: Add `#skLightboxCounter` badge inside modal header (e.g. `Look 1 of 4`).
3. **Bottom Thumbnail Strip**: Render a compact horizontal thumbnail ribbon (`#skLightboxThumbs`) with active gold indicator ring for rapid 1-tap switching between alternate candidate looks.
4. **Keyboard & Touch Gestures**: Bind `ArrowLeft` / `ArrowRight` keyboard traversal and horizontal touch swipe gestures ($\Delta X \ge 40\text{px}$).
5. **Zoom-Pan Gesture Isolation**: Suppress swipe transitions when `SKZoomPanEngine.scale > 1.05`, allowing uninhibited panning while zoomed into fabric or jewelry details.
6. **Non-Breaking Single-Image Fallback**: Ensure that when callers pass only a single image ($N \le 1$), carousel navigation buttons, counters, and thumbnail strips cleanly default to `display: none` without breaking Decorator Cockpit or Decision Registry.
7. **Two-Way Look & Context Sync**: Dynamically synchronize the viewed look with Host administrative controls (`[🗑️ Move Option X to Trash Bin]`), caption text, and deep-link parameters.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Shared Primitive Enhancement (`ui_primitives/`)
- [x] **Modal Template Upgrade (`ui_primitives/components/lightbox.html`)**:
  - Add `<span class="sk-lightbox-counter" id="skLightboxCounter">Look 1 of 1</span>` inside `.sk-lightbox-header-info`.
  - Add `<button type="button" class="sk-btn sk-btn-nav sk-lightbox-nav-prev" id="skBtnLightboxPrev" aria-label="Previous look">◀</button>` inside `#skLightboxMedia`.
  - Add `<button type="button" class="sk-btn sk-btn-nav sk-lightbox-nav-next" id="skBtnLightboxNext" aria-label="Next look">▶</button>` inside `#skLightboxMedia`.
  - Add `<div class="sk-lightbox-thumbs" id="skLightboxThumbs" role="tablist" aria-label="Candidate look thumbnails"></div>` inside `.sk-lightbox-body`.
- [x] **CSS Primitive Styling (`ui_primitives/styles/02_zoom_pan.css` & `01_primitives.css`)**:
  - Implement `.sk-btn-nav` (circular floating translucent buttons, gold hover, desktop positioning, mobile thumb hitboxes $\ge 44\text{px}$).
  - Implement `.sk-lightbox-counter` (gold pill badge).
  - Implement `.sk-lightbox-thumbs` and `.sk-lightbox-thumb` with `.is-active` gold ring.
  - Enforce single-image fallback: `#skBtnLightboxPrev, #skBtnLightboxNext, #skLightboxCounter, #skLightboxThumbs { display: none; }` by default.
- [x] **Pre-Flight Whitelist Alignment (`scripts/verify-ui-button-primitives.cjs`)**:
  - Add `'sk-btn-nav'` to approved button class whitelist and required primitive selectors.
- [x] **Validation Gate 1 (VG-1)**:
  - `npm run verify:ui-buttons` passes 100% (5/5 checks green).
  - `npm run verify:modular-architecture` passes 100% (46/46 checks green).
  - `npm run verify:ui-lifecycle` passes 100% (4/4 checks green).
- [x] **Decision Node 1 (DN-1)**:
  - Button primitives verified, zero naked buttons, zero orphan classes, 100% byte parity preserved across all 12 distribution targets. PROCEED to Phase 2.

### Phase 2: Shopping Controller Integration & State Machine (`shopping_src/`)
- [x] **Data Model & Trigger Upgrade (`shopping_src/scripts/controller.js`)**:
  - Upgrade `window.openShoppingLightbox(title, photoUrl, caption, itemId, activeOptIdx)`:
    - Query `getItemImages(item)` to assemble the full look set ($N \ge 1$).
    - Maintain `currentLightboxLooks` array and `currentLightboxLookIdx` state.
- [x] **State Machine & DOM Render**:
  - Implement `renderLightboxLook(index)`:
    - Normalizes Drive CDN photo with `resolveDriveAsset(..., { zoomWidth: 1600 })`.
    - Resets zoom engine via `lightboxZoomEngine.fit()`.
    - Updates `#skLightboxImg.src` and `#skLightboxCounter.textContent` (`Look ${idx + 1} of ${total}`).
    - Re-renders thumbnail strip `#skLightboxThumbs` with active ring.
    - Dynamically updates `#skLightboxCaption` and Host administrative actions (`Move Option X to Trash Bin`).
- [x] **Interaction & Gesture Binding**:
  - Bind Click listeners on `#skBtnLightboxPrev` and `#skBtnLightboxNext`.
  - Bind Keyboard listeners on `window` (`ArrowLeft`, `ArrowRight`) guarded by `#skLightboxBackdrop.classList.contains('is-active')`.
  - Bind Touch swipe listeners on `#skLightboxMedia`:
    - Track `touchStartX`, `touchStartY`.
    - If `lightboxZoomEngine && lightboxZoomEngine.scale > 1.05`, abort swipe (`INV-ZOOM-SWIPE-001`).
    - If $\Delta X \le -40\text{px}$, navigate Next; if $\Delta X \ge 40\text{px}$, navigate Prev.
- [x] **Validation Gate 2 (VG-2)**:
  - `npm run build:shopping:all` compiles with byte parity.
  - `npm run test:shopping` passes 100% (7/7 checks green).
- [x] **Decision Node 2 (DN-2)**:
  - Verify swipe gestures do not trigger when zoomed in (`scale > 1.05`). PROCEED to Phase 3.

### Phase 3: Module Recompilation, Dual-Release Parity & Verification Sweep
- [x] **SDCA Recompilation**: Rebuild all 12 distribution targets via:
  - `node cockpit_src/build.cjs --all`
  - `node shopping_src/build.cjs --all`
  - `node scripts/build-decision-registry-html.cjs`
- [x] **Binary Byte Parity**: Verify 100% byte parity between root files and `public/` files across all targets.
- [x] **Single-Image Consumer Verification**:
  - Confirm single-image inspection in Decorator Cockpit and Decision Registry remains unaffected with controls hidden.
- [x] **Automated Test Matrix Green Sweep**:
  - `npm run verify:ui-buttons` (5/5 checks green)
  - `npm run verify:modular-architecture` (46/46 checks green)
  - `npm run verify:ui-lifecycle` (4/4 checks green)
  - `npm run test:shopping` (7/7 checks green)
  - `npm run test:decision-registry` (100% green)
  - `npm run test:cockpit` (5/5 checks green)
- [x] **Validation Gate 3 (VG-3)**:
  - All test suites green, zero console errors, pre-flight deployment gate passes.
- [x] **Decision Node 3 (DN-3)**:
  - Post-implementation reconciliation review and tracker update. Feature marked COMPLETED.

