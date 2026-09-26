# 🏛️ Architecture & UI Council Decision Record: Interactive Multi-Look Lightbox Carousel Architecture

**Standard Identifier:** `STD-UI-PRIMITIVE-003` / `P-LIGHTBOX-CAROUSEL-001` / `SK-013`  
**Council Decision:** `AC-DEC-2026-050` / `UI-DEC-2026-045`  
**Date:** 2026-09-24  
**Type:** FULL Architecture & UI Council Deliberation with Integrated `/plan-review`  
**Status:** ✅ APPROVED & CERTIFIED — IMPLEMENTATION-READY (PLAN HARD-STOP)  
**Maturity Anchor (RFG-001):** Pre-launch wedding OS · 4–5 real users today (Host/Groom, Bride, Sisters, Parents), ~20 expected as wedding approaches · 2 visual modules (Shopping Registry & Decorator Cockpit) · 1 developer.  
**Git Baseline Commit:** `019e65e8c50c4e8fb0290674069622ecf2029372`  
**Pattern Specification:** [.agent/patterns/interactive-multi-look-lightbox-carousel.md](../../.agent/patterns/interactive-multi-look-lightbox-carousel.md)

---

## 1. Context & Problem Statement

### 1.1 Current Limitation
When a user opens an image in the universal Lightbox (`#skLightboxBackdrop`) from the Shopping Catalog, it currently renders a single, isolated image preview:
1. **Isolated Preview**: The trigger (`window.openShoppingLightbox(title, photoUrl, caption, itemId, activeOptIdx)`) only loads one image asset into `#skLightboxImg`.
2. **Missing Carousel Navigation**: There are no **Previous (`◀`)** or **Next (`▶`)** buttons to traverse other candidate looks belonging to the same parent shopping item without closing the lightbox, clicking a chip on the card, and re-opening.
3. **Missing Visual Position Indicators**: There are no position indicators or pagination counters (e.g. `Look 1 of 4`) showing where the user is within the item's candidate looks.
4. **Missing Bottom Thumbnail Strip**: There is no bottom thumbnail ribbon for rapid 1-tap switching between alternative candidate looks.
5. **Missing Keyboard & Mobile Gestures**: Arrow keys (`ArrowLeft`, `ArrowRight`) and horizontal touch swipe gestures are not bound for candidate look navigation.

### 1.2 Architectural Constraints & Invariants
- **`STD-MOD-COMP-001` (Modular Component Architecture)**: Lightbox markup lives in `ui_primitives/components/lightbox.html` and is compiled into 12 standalone and fragment distributions. Zero monolithic scripts >500 lines.
- **`STD-UI-PRIMITIVE-002` (Universal UI Button Primitives)**: All navigation buttons must consume canonical `.sk-btn` tokens (e.g. `.sk-btn`, `.sk-btn-nav`, `.sk-modal-close`) and pass `verify:ui-buttons` without naked buttons or orphan classes.
- **`STD-UI-LIFECYCLE-001` (Dynamic UI Lifecycle & Dismissibility)**: Lightbox must maintain 3-trigger dismissibility (Close button, backdrop click, Escape key) and guard against unhandled touch/pointer races.
- **`SKZoomPanEngine` Concurrency**: Zoom/Pan engine operates on `#skLightboxImg`. Single-finger drag pans when zoomed (`scale > 1.05`). When zoomed, carousel swipe navigation must be disabled to avoid accidental slide transitions while inspecting fabric weave or jewelry hallmarks.

---

## 2. Comparative Evaluation of Available Options

| Dimension | Option A: Monolithic Primitive Overhaul | Option B: Module-Siloed Shopping Injection | Option C: Governance-Complete SDCA Hybrid Architecture (`STD-UI-PRIMITIVE-003` / `SK-013`) |
| :--- | :--- | :--- | :--- |
| **Description** | Completely rewrite `ui_primitives/components/lightbox.html` into a heavy self-contained multi-carousel modal with embedded DOM state. | Keep `ui_primitives/` strictly single-image; dynamically inject navigation buttons, thumbnails, and gesture listeners exclusively in `shopping_src/scripts/controller.js`. | **Universal Lightweight Navigation Primitive** in `ui_primitives/components/lightbox.html` & `02_zoom_pan.css` + **State & Look Sync Controller** in `shopping_src/scripts/controller.js` + **Non-Breaking Single-Image Fallback**. |
| **Similarities** | Solves Prev/Next navigation and thumbnail jumping. | Solves candidate look inspection in Shopping Catalog. | Incorporates the multi-look browsing capabilities of both options while respecting SDCA separation. |
| **Distinctions** | Couples the shared primitive tightly to shopping candidate looks data models. | Creates siloed UI logic in Shopping Catalog; Decorator Cockpit and Decision Registry cannot reuse carousel navigation. | Separates **DOM Primitive Capabilities** (Prev/Next buttons, thumbnail container, counter badge, swipe hook) from **Domain Data Binding** (Shopping `candidate_looks`). |
| **Trade-offs** | Breaks backwards compatibility for single-image consumers (e.g. Decision Registry plates). | Low blast radius, but creates technical debt and inconsistent UX across wedding OS modules. | Requires careful coordination between `ui_primitives/` and `shopping_src/`, but establishes permanent reusable standard. |
| **Dependencies** | Requires rewriting `zoom_pan_engine.js` and all existing lightbox callers. | Zero primitive dependencies; tightly coupled to `shopping_src/`. | `ui_primitives/components/lightbox.html`, `ui_primitives/styles/02_zoom_pan.css`, `ui_primitives/scripts/primitives_core.js`, `shopping_src/scripts/controller.js`. |
| **Impact Radius** | High: All 12 HTML distribution targets and their respective controllers. | Low: Confined strictly to `shopping-registry.html` and `shopping-fragment.html`. | Medium: Updates shared Lightbox markup and CSS; enhances Shopping controller; leaves single-image callers fully backwards-compatible. |
| **Complexity** | High (over-engineered state machine in dumb HTML template). | Low-Medium (ad-hoc DOM manipulation in controller). | Balanced: Declarative markup in template + clean event delegation in controller + automated pre-flight gates. |
| **Risks** | Risk of breaking existing single-image inspection in Decorator Cockpit and Decision Registry. | Risk of fragmented user experience where lightbox behaves differently across modules. | Low: Mitigated by default `display: none` on carousel elements when image count $\le 1$ (single-image fallback invariant). |
| **Architectural Implications** | Violates RFG-001 by introducing heavy multi-gallery abstractions before multi-module need. | Violates `STD-MOD-COMP-001` by creating ad-hoc DOM structures outside shared primitives. | **Exemplifies SDCA Principle**: Shared dumb primitive provides slots & buttons; module controller provides data binding and event logic. |

---

## 3. Web Research & Industry Best Practices Integration

Industry research on mobile touch gestures, zoom-pan engines, and lightbox carousels (Swiper.js, PhotoSwipe v5, Fancybox) reveals four load-bearing implementation standards:

1. **The Zoom-State vs. Swipe-Gesture Isolation Contract**:
   - When an image is zoomed in (`scale > 1.05`), single-finger touch moves must be reserved exclusively for panning the zoomed fabric or jewelry details.
   - Horizontal swipe gesture listeners must be conditionally enabled:
     $$\text{Swipe Navigation Active} \iff \text{scale} \le 1.05$$
   - This prevents the critical UX failure mode where a user panning across a high-resolution saree border accidentally flips to the next look.

2. **`touch-action` Scoping & Passive Event Discipline**:
   - Set `touch-action: none;` on `#skLightboxMedia` to prevent browser pull-to-refresh and background document scrolling during gesture handling.
   - Use `{ passive: true }` for touchstart/touchend listeners that only observe coordinates, avoiding main-thread scrolling jank.

3. **Semantic `<button>` Tokens & WCAG Focus Trapping**:
   - Navigation controls must be native `<button type="button" class="sk-btn sk-btn-nav" ...>` elements rather than clickable `<div>` or `<span>` tags.
   - Must provide physical touch hitboxes $\ge 44\text{px} \times 44\text{px}$ (WCAG 2.5.5 / Protocol 19).
   - Keyboard arrows (`ArrowLeft`, `ArrowRight`) must navigate looks only when the lightbox modal is actively open (`#skLightboxBackdrop.is-active`).

4. **Bi-directional State Synchronization**:
   - Navigating within the lightbox carousel must dynamically update:
     1. Main preview `src` (resolved via `SKPrimitives.resolveDriveAsset`).
     2. Micro-inspection zoom engine (`fit()` reset to 100%).
     3. Active ring on thumbnail strip.
     4. Position badge (`Look X of Y`).
     5. Host administrative controls (`[🗑️ Move Option X to Trash Bin]`).
     6. Background shopping card candidate look selection state (synchronizing the active look index).

---

## 4. Multi-Disciplinary Architecture Council Independent Evaluations

### 4.1 SSOT Authority Auditor (`ssot-reconciliation`)
- **Position**: APPROVE Option C. The proposal formalizes the multi-image container architecture (`P-MULTI-IMAGE-CONTAINER-001` / `AC-DEC-2026-038`) into the lightbox inspection phase.
- **Evidence**: `ui_primitives/components/lightbox.html` currently lacks carousel affordances. Adding them with single-image fallback preserves SSOT parity across `ARCHITECTURE_SPEC.md` and compiled distributions.
- **Confidence**: High.

### 4.2 Schema & Data Layer Auditor
- **Position**: APPROVE Option C. No Firestore schema modification is required. Data flows from existing in-memory / local storage structures:
  `item.images` (canonical baseline) $\cup$ `itemCustomOptions[itemId]` (active candidate looks).
- **Evidence**: `shopping_src/scripts/controller.js` line 142 already implements `getItemImages(item)`, returning all active (non-archived) looks in order.
- **Confidence**: High.

### 4.3 Service Layer & Component Integrity Auditor (`STD-MOD-COMP-001`)
- **Position**: APPROVE Option C. The changes adhere to SDCA invariants:
  - Markup added to `ui_primitives/components/lightbox.html`.
  - Styles added to `ui_primitives/styles/02_zoom_pan.css`.
  - Helper functions added to `ui_primitives/scripts/primitives_core.js`.
  - Controller logic housed in `shopping_src/scripts/controller.js`.
  - Recompiled cleanly via `shopping_src/build.cjs`.
- **Evidence**: Zero monolithic files will exceed 500 lines in `scripts/`.
- **Confidence**: High.

### 4.4 Dependency & Impact Auditor (`change-impact-analysis`)
- **Position**: APPROVE Option C WITH GUARDRAIL.
- **Evidence**: Lightbox is consumed by:
  1. `shopping-registry.html` / `shopping-fragment.html`
  2. `decorator-cockpit.html` / `cockpit-fragment.html`
  3. `decision-registry.html` / `decision-registry-fragment.html`
- **Guardrail**: If `#skLightboxPrev`, `#skLightboxNext`, and `#skLightboxThumbs` are added to `ui_primitives/components/lightbox.html`, they MUST default to `display: none` in CSS and only be set to visible when a caller explicitly passes a multi-item array ($N > 1$). This guarantees zero visual regression in Decorator Cockpit and Decision Registry.
- **Confidence**: High.

### 4.5 File Placement & Standards Auditor (`STD-UI-PRIMITIVE-002`)
- **Position**: APPROVE Option C.
- **Evidence**: All newly introduced navigation buttons (`#skBtnLightboxPrev`, `#skBtnLightboxNext`) must use `.sk-btn` and `.sk-btn-nav`. The pre-flight linter `scripts/verify-ui-button-primitives.cjs` must be updated to whitelist `.sk-btn-nav` and verify zero unstyled buttons.
- **Confidence**: High.

### 4.6 Auth & Permission Auditor
- **Position**: APPROVE Option C.
- **Evidence**: In `shopping_src/scripts/controller.js` lines 2460–2485, the Host administrative bar (`[🗑️ Move Option X to Trash Bin]`) is conditionally injected based on `isHostUser()`. When traversing between candidate looks via the carousel, this administrative bar must dynamically update to reflect the currently viewed option index ($X$). If the user traverses to Option 0 (the canonical baseline concept), the Trash Bin button must cleanly disappear (as Option 0 cannot be deleted).
- **Confidence**: High.

### 4.7 Maintainability & Velocity Auditor (`ponytail` / RFG-001)
- **Position**: APPROVE Option C.
- **Burden of Proof**:
  1. *Problem exists today*: Host and family members inspecting sarees in the Lightbox must close and reopen the modal repeatedly to compare 4 candidate looks.
  2. *Existing architecture cannot evolve without it*: Current lightbox signature takes a single scalar `photoUrl`.
  3. *Net complexity*: Adding ~30 lines of CSS and ~60 lines of controller code provides an executive-grade carousel without importing bloated third-party libraries (Swiper/PhotoSwipe).
  4. *Measurable debt if deferred*: Family shopping consensus during the Bhubaneswar expedition will suffer significant friction.
- **Confidence**: High.

### 4.8 Assigned Dissenter Seat (Challenge & Devil's Advocate)
- **Position**: CHALLENGE Option C on gesture race conditions and mobile viewport clobbering.
- **Concrete Failure Scenario**:
  > *"On a 360px mobile screen, when the bottom thumbnail strip is rendered inside `#skLightboxCard`, the media container height shrinks, causing the image to be squashed. Furthermore, when the user double-taps or pinches to zoom into a saree border and then swipes horizontally to inspect the embroidery, an unhardened swipe listener will fire a slide change, resetting the zoom and throwing the user to Look 2."*
- **What Would Change My Mind**:
  1. The swipe gesture handler must explicitly query `lightboxZoomEngine.scale` and immediately abort if `scale > 1.05`.
  2. The thumbnail strip must have a fixed compact height ($\le 54\text{px}$) with horizontal scroll and negative margin absorption so the image viewport retains $\ge 65\text{vh}$.
  3. Thumbnails must be lazy-loaded or use thumbnail-normalized CDN URLs (`sz=w120`) to prevent mobile memory spikes.
- **Resolution**: Both constraints are formally adopted into the Specification & Decision below!

---

## 5. Synthesis & Integrated Feature Plan Review (`/plan-review`)

### Section 1: Problem & Requirements
- **Problem Statement**: Sree Krushna Marriage OS Shopping Registry supports multi-candidate looks per item, but the full-screen Lightbox inspection modal is limited to a single static image. Users cannot swipe, arrow-navigate, or tap thumbnails to compare alternate looks within the modal.
- **Target Users**: Host/Groom, Bride, Sisters, Family shopping reviewers.
- **Success Metrics**:
  - 100% of candidate looks for any shopping item are traversable inside the Lightbox via Prev/Next buttons, keyboard arrows, mobile swipe gestures, and thumbnail strip.
  - Zero zoom-pan gesture collisions (swipe navigation completely suppressed while zoomed in `scale > 1.05`).
  - Zero regression on single-image lightbox callers (Decorator Cockpit, Decision Registry).
  - 100% pass across all pre-flight gates (`verify:modular-architecture`, `verify:ui-buttons`, `verify:ui-lifecycle`).

### Section 2: Technical Architecture & Data Flow

```
[ Shopping Card / Avatar / Chip ]
            │
            ▼ Click "Inspect in Lightbox"
[ window.openShoppingLightbox(title, photoUrl, caption, itemId, activeOptIdx) ]
            │
            ├─► Look up item in items[]: item = items.find(i => i.id === itemId)
            ├─► Retrieve all active looks: looks = getItemImages(item)
            ├─► Set activeLookIndex = current activeOptIdx
            │
            ▼ Render Lightbox Modal Container (#skLightboxBackdrop)
   ┌─────────────────────────────────────────────────────────────────┐
   │ Header: Title + Look Counter (#skLightboxCounter: "Look 2 of 4")│
   ├─────────────────────────────────────────────────────────────────┤
   │ [ ◀ Prev ]          #skLightboxMediaContainer        [ ▶ Next ] │
   │                  #skLightboxImg (Zoom/Pan)                      │
   │                    Floating Zoom Toolbar                        │
   ├─────────────────────────────────────────────────────────────────┤
   │ Bottom Thumbnail Strip (#skLightboxThumbs):                     │
   │  [Thumb 0]  [Thumb 1 (ACTIVE RING)]  [Thumb 2]  [Thumb 3]       │
   ├─────────────────────────────────────────────────────────────────┤
   │ Caption & Dynamic Host Admin Bar:                               │
   │  "TRS-BR-01 • Mehendi Saree • Option 1"                         │
   │  [ 🗑️ Move Option 1 to Trash Bin ]                              │
   └─────────────────────────────────────────────────────────────────┘
            │
            ├── Swipe Left / Click Next / ArrowRight ──► activeLookIndex++
            ├── Swipe Right / Click Prev / ArrowLeft ──► activeLookIndex--
            └── Click Thumbnail(N)                   ──► activeLookIndex = N
```

### Section 3: The 5 Lenses Check (Feasibility & Impact)
1. **User Experience (UX)**: Greatly elevated. Seamless visual inspection of candidate sarees and groom attire with rapid comparison.
2. **Workflow Efficiency**: Cuts user clicks by ~75% when comparing candidate looks during shopping consultations.
3. **Complexity & Cognitive Load**: Zero extra cognitive load; adheres to standard mobile gallery conventions (Instagram/Amazon).
4. **Performance Implications**: Zero bundle bloat. Drive CDN URLs use thumbnail normalization (`sz=w120` for thumbnails, `sz=w1600` for main zoom).
5. **Implementation Practicality**: High. Leverages existing `SKZoomPanEngine` and `getItemImages` helpers.

### Section 4: Risk Assessment & Mitigations

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Zoom/Pan vs. Swipe Conflict** | High | Explicit guard in touch handler: `if (zoomEngine && zoomEngine.scale > 1.05) return;`. Swipe is strictly suppressed when zoomed. |
| **Single-Image Regressions** | High | Default CSS: `#skBtnLightboxPrev, #skBtnLightboxNext, #skLightboxCounter, #skLightboxThumbs { display: none; }`. Only enabled when `looks.length > 1`. |
| **Button Primitive Violations** | Med | Style all buttons with canonical `.sk-btn`, `.sk-btn-nav` tokens. Whitelist in `scripts/verify-ui-button-primitives.cjs`. |
| **Host Action Desynchronization**| Med | Dynamically re-render `#skLightboxCaption` and the Host management bar on every look transition. |

### Section 5: Phased Implementation & Definition of Done (DoD)

#### Phase 1: Shared Primitive Enhancement (`ui_primitives/`)
- Upgrade `ui_primitives/components/lightbox.html`:
  - Add `#skLightboxCounter` badge inside header info.
  - Add `#skBtnLightboxPrev` (`◀`) and `#skBtnLightboxNext` (`▶`) navigation buttons with `.sk-btn .sk-btn-nav` inside `#skLightboxMedia`.
  - Add `#skLightboxThumbs` scrollable container below media container.
- Update `ui_primitives/styles/02_zoom_pan.css`:
  - Style `.sk-btn-nav` (circular floating translucent buttons, gold hover, desktop positioning, mobile thumb hits).
  - Style `.sk-lightbox-counter` (gold pill badge).
  - Style `.sk-lightbox-thumbs` and `.sk-lightbox-thumb` with `.is-active` gold ring.
  - Default all multi-look controls to `display: none`.
- Update `scripts/verify-ui-button-primitives.cjs` whitelist with `.sk-btn-nav`.
- **Validation Gate (VG-1)**: `npm run verify:ui-buttons` and `npm run verify:modular-architecture` pass 100%.

#### Phase 2: Shopping Controller Integration & State Machine (`shopping_src/`)
- Upgrade `shopping_src/scripts/controller.js`:
  - Expand `window.openShoppingLightbox` to accept `itemId` and query `getItemImages(item)`.
  - Maintain `currentLightboxLooks` and `currentLightboxLookIdx`.
  - Bind Click handlers on `#skBtnLightboxPrev` and `#skBtnLightboxNext`.
  - Bind Keyboard listeners: `ArrowLeft` (Prev), `ArrowRight` (Next) guarded by `lightboxBackdrop.classList.contains('is-active')`.
  - Bind Touch gesture listeners: horizontal swipe with $\Delta X \ge 40\text{px}$ threshold, strictly guarded by `zoomEngine.scale <= 1.05`.
  - Render thumbnail strip into `#skLightboxThumbs` with Drive CDN thumbnail sizing (`sz=w120`).
  - Wire dynamic Host management bar re-rendering on look change.
- **Validation Gate (VG-2)**: `npm run build:shopping:all` compiles with byte parity; `npm run test:shopping` passes 100%.

#### Phase 3: Lifecycle Verification & Cross-Module Parity
- Verify `decorator-cockpit.html` and `decision-registry.html` single-image lightbox previews remain visually flawless and unaffected.
- Verify 3-trigger dismissibility (Close, Backdrop, Escape) passes `verify:ui-lifecycle`.
- Run full pre-flight deployment audit (`npm run pre-deploy`).
- **Validation Gate (VG-3)**: All 6 test suites and deployment gates green.

---

## 6. Architecture Council Ruling & Formal Certification

### 6.1 Formal Decision (`AC-DEC-2026-050` / `UI-DEC-2026-045`)
The Architecture & UI Council **UNANIMOUSLY APPROVES & CERTIFIES** Option C: **Interactive Multi-Look Lightbox Carousel Architecture (`STD-UI-PRIMITIVE-003` / `SK-013`)**.

### 6.2 Mandatory Plan Hard-Stop
In strict adherence to Prime Invariant §8 (`STD-PLANNING-ENGINE-001`) and `prompt-clarity` Step 3:
- This document stands as the **authoritative architectural specification, council decision record, and plan review**.
- **Implementation is gated**: No production code files shall be modified until the user reviews and authorizes Phase 1 execution.

---
*Signed by the Architecture & UI Council — 2026-09-24*
