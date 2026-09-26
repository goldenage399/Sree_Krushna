---
pattern: interactive-multi-look-lightbox-carousel
activation_tier: guarded
guard: "npm run test:shopping"
canonical_source: sree-krushna
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: enhancement-notes/SK-013/00_ENHANCEMENT_INDEX.md
    at: "DoD Matrix"
  - file: User_Created/Discussion Threads/Council/260924_arch_council_interactive_multi_look_lightbox_carousel.md
    at: "AC-DEC-2026-050"
triggers:
  - "sk-btn-nav"
  - "skLightboxCounter"
  - "skLightboxThumbs"
  - "INV-ZOOM-SWIPE-001"
  - "STD-UI-PRIMITIVE-003"
  - "P-LIGHTBOX-CAROUSEL-001"
portability: universal
porting_effort: low
---

# Pattern: Interactive Multi-Look Lightbox Carousel & Shared Primitive Navigation Architecture

**Standard ID**: `STD-UI-PRIMITIVE-003` / `P-LIGHTBOX-CAROUSEL-001`  
**Category**: Architecture / Shared UI Primitives / Lightbox Carousel  
**Origin**: Sree Krushna Marriage OS (SK-013 / AC-DEC-2026-050 / UI-DEC-2026-045)  
**Status**: VALIDATED  

---

## 1. Problem Statement
Modal lightboxes in media-rich web applications frequently evolve from simple single-image inspection viewers into multi-asset exploration stations (e.g. inspecting 4 alternative bridal lehengas, jewelry pairings, or decorator floral arrangements). 

Without architectural safeguards, multi-asset modal viewing suffers from 3 major failures:
1. **Modal Re-Opening Friction**: Users must close the lightbox, scroll down to the card, click a different thumbnail chip, and re-open the lightbox to compare options.
2. **Gesture Concurrency Collision**: Horizontal swipe gestures for navigating slides conflict with single-finger zoom-and-pan gestures. When a user zooms in to examine embroidery or jewelry hallmarks, dragging horizontally accidentally navigates to the next look instead of panning the image.
3. **Single-Image Consumer Regressions**: Adding prev/next buttons and thumbnail strips directly into shared modal templates can break callers that only provide a single image (rendering broken "Look 1 of 0" counters or empty thumbnail ribbons).

---

## 2. Mandatory Architectural Invariants

### INV-ZOOM-SWIPE-001: Zoom-Pan Isolation Guard
Touch swipe slide navigation MUST query the modal's zoom engine state before handling swipe deltas:
```javascript
// In touch swipe handler:
if (lightboxZoomEngine && lightboxZoomEngine.scale > 1.05) {
  return; // Abort slide navigation; allow PanEngine to handle panning
}
```
When `scale <= 1.05`, horizontal swipe gestures ($\Delta X \ge 40\text{px}$) transition cleanly between slides.

### INV-CAROUSEL-FALLBACK-001: Non-Breaking Single-Image Fallback
All carousel controls (`#skBtnLightboxPrev`, `#skBtnLightboxNext`, `#skLightboxCounter`, `#skLightboxThumbs`) MUST default to `display: none` in CSS. 
They are ONLY shown when the container has class `.has-multi-look` applied by a caller that supplies $N \ge 2$ images:
```css
#skBtnLightboxPrev,
#skBtnLightboxNext,
#skLightboxCounter,
#skLightboxThumbs {
  display: none;
}

#skLightboxBackdrop.has-multi-look #skBtnLightboxPrev,
#skLightboxBackdrop.has-multi-look #skBtnLightboxNext,
#skLightboxBackdrop.has-multi-look #skLightboxCounter {
  display: flex;
}

#skLightboxBackdrop.has-multi-look #skLightboxThumbs {
  display: flex;
}
```

### INV-CAROUSEL-TOKEN-001: Universal Button Primitive Conformity
All carousel navigation buttons MUST conform to `STD-UI-PRIMITIVE-002` using the `.sk-btn` and `.sk-btn-nav` tokens:
- 44px circular floating action button with backdrop blur (`backdrop-filter: blur(8px)`).
- Semi-transparent dark background (`rgba(10, 10, 15, 0.75)`).
- Gold accent border and hover glow (`var(--gold-primary)`).
- Touch target $\ge 44\text{px}$ for mobile thumbs.

### INV-CAROUSEL-SYNC-001: Two-Way State & Context Synchronization
Navigating between candidate looks within the lightbox MUST synchronously:
1. Reset zoom level to 1.0 via `lightboxZoomEngine.fit()`.
2. Update the visual counter (`Look X of Y`).
3. Scroll and activate the corresponding thumbnail in `#skLightboxThumbs`.
4. Update the item's active selected option in parent catalog views (`itemOptionSelected[itemId] = idx`).
5. Update Host administrative action handlers (`Move Option X to Trash Bin`).
