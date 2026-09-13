# 🏛️ Architecture & UI Council Certified Ruling: Cockpit UI Craft, Scrollbar Theming, Fullscreen SVG Scaling & Authentic Photo Pipeline
**Document ID**: `AC-DEC-2026-008` / `UI-DEC-2026-004`  
**Date**: 2026-09-13  
**Status**: APPROVED & CERTIFIED  
**Conveners**: Architecture Council & UI/UX Council (featuring `/impeccable` as Core Craft Auditor)  
**Governing Documents**: `SPEC-PROC-DECOR-MARQUEE-001`, `COUNCIL-CHARTER.md`, `.agent/workflows/ui-council.md`

---

## 1. Context & Problem Statement

During operational review of the Decorator Negotiation Cockpit (`public/decorator-cockpit.html`), three critical visual craft and functional defects were identified:
1. **Scrollbar Visual Discordance**: Native OS scrollbars (harsh white/gray default sliders) visually clashing against the luxury dark navy/gold palette (`--bg-primary`, `--accent-gold`).
2. **Fullscreen Lightbox Blueprint Scaling Defect**: Blueprint SVG schematics render properly as grid thumbnails (`.lookbook-img-box`) but fail to scale or display in the Fullscreen Lightbox (`#lightboxModalBackdrop`), collapsing due to SVG intrinsic sizing conflicts within flexbox containers.
3. **Photo Asset Cultural Incongruity**: Generic stock placeholders downloaded from general web search lack the authentic cultural cues of traditional Hindu Vedic wedding decor (marigold lotus mandaps, sacred copper havan altars, royal German marquee drapery, and Rajasthani mehendi lounges).

---

## 2. Comparative Evaluation of Available Options

| Evaluation Dimension | Option 1: Full Craft Overhaul (Scrollbars + SVG Fix + AI Vedic Photos + Pinterest Linker) | Option 2: Technical Hotfix Only (Scrollbars + SVG Fix + Blank URL Linker) | Option 3: Monolithic Council Overhaul (Full Component Rewrite) |
|---|---|---|---|
| **Theme Alignment** | **Complete**: Native CSS scrollbar tokens applied globally across all containers. | **Partial**: Addresses scrollbars but leaves visual moodboard empty or generic. | **Complete**: Comprehensive design system token sweep. |
| **Blueprint Fullscreen Rendering** | **Solved**: Resolves SVG intrinsic sizing constraint in flexbox with explicit aspect-ratio and viewport bounding. | **Solved**: Fixes flexbox image wrapper CSS rules. | **Solved**: Rebuilds lightbox as a canvas/pan-zoom component. |
| **Cultural Photo Authenticity** | **High**: Photorealistic, spec-aligned Vedic imagery generated directly matching `SPEC-PROC-DECOR-MARQUEE-001`. | **Zero**: Places burden on user to manually source and paste 8 Pinterest URLs before meetings. | **Variable**: Relies on third-party design imports. |
| **Extensibility & Pinterest Integration** | **Native**: Dual-mode engine with in-app "Paste Pinterest URL" input saved to `localStorage`. | **Native**: In-app URL inputs provided. | **Complex**: Requires external asset pipeline. |
| **Risk of Scope Bloat** | **Low**: Targeted surgical upgrades inside existing tested zero-dependency architecture. | **Lowest**: Minimal changes. | **High**: Unnecessary refactoring of already green pre-flight modules. |

---

## 3. Architecture Council Certified Hybrid Ruling (`AC-DEC-2026-008` / `UI-DEC-2026-004`)

The Councils unanimously certify a **4-Pillar Unified Hybrid Architecture** leaving zero operational or visual gaps:

### Pillar 1: Universal Theme-Integrated Scrollbar Specification (`CSS-SCROLLBAR-STANDARD`)
Enforce luxury scrollbars matching the OS palette across all scrollable viewports:
- Standard CSS: `scrollbar-width: thin; scrollbar-color: rgba(245, 158, 11, 0.35) #111827;`
- Webkit CSS: `::-webkit-scrollbar { width: 6px; height: 6px; }`
- Track: `background: var(--bg-secondary);`
- Thumb: `background: rgba(245, 158, 11, 0.3); border-radius: 4px;` with `:hover` state glowing to `var(--accent-gold)` (`#f59e0b`).
- Applied to `*`, `body`, `.agenda-list`, `.topic-detail-pane`, `.lookbook-grid`, and `.tender-modal-body`.

### Pillar 2: Lightbox Viewport & SVG Intrinsic Sizing Contract (`SVG-LIGHTBOX-VIEWPORT-CONTRACT`)
- **Root Cause**: SVGs lacking absolute intrinsic dimensions inside a flex child (`.lightbox-img-wrapper`) lacking explicit width collapse in Chromium/WebKit rendering engines.
- **Contract Rule**:
  1. All vector schematics in `public/assets/decor/` must specify intrinsic `viewBox="0 0 800 500" width="800" height="500"`.
  2. The Lightbox image element must declare explicit responsive bounds:
     `width: min(86vw, 1050px); max-height: 70vh; aspect-ratio: 16/10; object-fit: contain;`
  3. Provide a dedicated **"Fit / 100% Zoom"** toggle inside the Lightbox for high-density blueprint inspection.

### Pillar 3: Authentic Vedic Wedding Decor Photography Suite (`AI-VEDIC-PHOTO-SUITE`)
Generate culturally accurate, photorealistic wedding decor photography assets specifically matching the 8 liturgical and physical specifications in `SPEC-PROC-DECOR-MARQUEE-001`:
1. **Lotus Mandap**: Cascading marigold/jasmine dome, 4 carved pillars, 18" riser, zinc fire shield.
2. **Sacred Havan Fire**: Authentic copper havan kund with ceremonial flames and negative-pressure extraction cowl.
3. **Sangeet Concert Stage**: Bollywood Sangeet performance stage with moving head lighting truss and P3 LED wall.
4. **German Marquee Pavilion**: Draped pleated ivory ceiling, crystal chandeliers, warm ambient banquet lighting.
5. **50m Arrival Canopy Corridor**: Glowing fairy-light arches with red carpet runner and elder transit lane.
6. **Mehendi Garden Promenade**: Outdoor lawn lounge, Rajasthani umbrellas, low charpai seating with silk bolsters.
7. **Royal Indian Buffet**: Luxury banquet food spread with polished brass chafing dishes and live counters.
8. **Guest Engagement Stalls**: Authentic lac bangle maker artisan stall and instant photo-booth.

### Pillar 4: Interactive Pinterest / Custom URL Override Engine (`LOCALSTORAGE-ASSET-OVERRIDE`)
- Add an intuitive **"🔗 Edit Photo / Paste Pinterest URL"** button on each card and in the Lightbox drawer.
- Users can paste any direct Pinterest pin image URL or local file path.
- State persists instantly into `localStorage` (`sree_krushna_custom_decor_photos`), seamlessly overriding defaults while preserving one-click reset to canonical assets.

---

## 4. Verification & Certification Sign-Off

- **UI Craft Auditor (`impeccable`)**: PASS — Restores visual harmony to scrollbars and establishes true fullscreen SVG presentation.
- **Systems Architecture**: PASS — Zero-dependency architecture preserved; offline asset resilience guaranteed.
- **Verification Gate**: 100% compliance required on `npm run verify:deployment` and `npm run test:smoke`.
