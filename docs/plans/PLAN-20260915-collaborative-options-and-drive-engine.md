# Master Implementation Plan: Collaborative Options, Multi-Tier Comments & Google Drive Multi-Image Engine
**Entity ID**: `PLAN-20260915-COLLAB-DRIVE` | **Version**: 1.0.0 | **Date**: 2026-09-15  
**Governing Decisions**: `AC-DEC-2026-021`, `AC-DEC-2026-022`, `UI-DEC-2026-017`, `STD-MOD-COMP-001`  
**Parent SSOT**: `docs/proposals/PROP-20260915-collaborative-options-and-comments-model.md`

---

## 1. Executive Summary & Problem Context

During the upcoming 10-day bridal shopping expedition in Bhubaneswar (encompassing Kurtas, Saris, Lehengas, Pajamas, and Jewelry), multiple family stakeholders—the Groom's sisters, In-laws, Bride, Groom, and Elders—must review, compare, discuss, and decide on options.

Wedding attire and jewelry review imposes unique requirements:
1. **High-Resolution Micro-Inspection**: Inspecting intricate Zari weaves, embroidery density, hallmark stamps, and gemstone facets requires smooth **Zoom & Pan** (up to 3x–5x magnification).
2. **Multi-Source Image Ingestion**: Photos originate from smartphone cameras, WhatsApp transfers, and shared Google Drive folders.
3. **Zero-CORS High-Bandwidth Display**: Direct Google Drive URLs (`/uc?export=view`) fail due to CORS and hotlink blocks. High-speed, responsive CDN resolution is mandatory.
4. **Strict Modular Architecture (`STD-MOD-COMP-001`)**: No file or script may exceed 500 lines, UI primitives must remain decoupled in `ui_primitives/`, and dual-release distributions (`/` and `public/`) must maintain 100% byte parity.

---

## 2. Cross-Repo Intelligence: `PIOperationsMgmt_Firebase` Audit

An exhaustive audit of `D:\GitHub_Repo\PIOperationsMgmt_Firebase` revealed proven architectures and key adaptation requirements:

| Component in PIO | Location | Proven Capabilities | Adaptation for Sree Krushna Marriage OS |
|---|---|---|---|
| **`UniversalViewer.js`** (713 lines) | `public/js/components/UniversalViewer.js` | • Floating/docked toolbar (Zoom Out, Fit, Zoom In, Reset)<br>• Drag-to-pan & mouse wheel zoom<br>• Keyboard shortcuts (`Ctrl+-`, `Ctrl++`, `0`, `R`)<br>• Static LRU Image Cache (`_imageCache`, size 20)<br>• Robust Drive URL regex extractor | **Decomposition Required**: At 713 lines, porting directly violates `STD-MOD-COMP-001` (500-line max). Must decompose into modular components: `zoom_pan_engine.js` (~200 lines), `drive_normalizer.js` (~80 lines), and CSS partial. Must also add mobile **pinch-to-zoom** and touch pan. |
| **`ImageUploadWidget.js`** (1,580 lines) | `public/js/shared/ImageUploadWidget.js` | • Dual Tabbed UI: "File Upload" vs "Drive Link"<br>• Instant memory-safe preview (`URL.createObjectURL`)<br>• Real-time URL validation | **Decoupled UI Intake**: Extract the tabbed modal structure and regex validation into `ui_primitives/components/option_intake_modal.html`. Skip heavy Cropper.js for shopping review, keeping bundle lean and fast. |
| **`ProofPreviewWidget.js`** (172 lines) | `public/js/shared/ProofPreviewWidget.js` | • Compact preview card showing thumbnail, status badge, and "Click to preview" modal trigger | **Option Card Synergy**: Natural fit for the Option Pod (`option_pod.html`) thumbnail slot with click-to-lightbox trigger. |
| **Drive Backend Proxy** | `backend/src/12_FileUpload.js` | • `DriveApp.createFile()`<br>• Sets `ANYONE_WITH_LINK` view permissions | **Zero-CORS CDN Strategy**: Unlike PIO (which needed backend base64 proxy for private invoices), Marriage OS shopping photos can use Google's official public thumbnail CDN endpoints without server round-trips. |

---

## 3. Web & Cloud Native Zero-CORS Drive Pipeline

To eliminate CORS and bandwidth throttling from Google Drive links, the system standardizes on a 3-tier URL resolution engine:

```
Pasted Drive URL 
   ├──► Extract Drive ID (Regex: /file/d/{id}, id={id}, /open?id={id})
   ▼
Tier 1 (High-Res CDN): https://drive.google.com/thumbnail?id={id}&sz=w{width}
   ├── Card Thumbnail: sz=w600
   └── Lightbox Zoom:   sz=w1600
   ▼ (Fallback on error)
Tier 2 (Direct Usercontent CDN): https://lh3.googleusercontent.com/d/{id}
   ▼ (Fallback for documents/PDFs)
Tier 3 (Embedded Preview Iframe): https://drive.google.com/file/d/{id}/preview
```

---

## 4. Architectural Synthesis: The Zero-Gap Hybrid Model

The **Hybrid Model** integrates proven components from `PIOperationsMgmt_Firebase` and web CDN best practices directly into our **Universal Shared UI Primitives Engine** (`ui_primitives/`) under strict compliance with `STD-MOD-COMP-001`:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    Universal Shared UI Primitives Engine                    │
│                              (ui_primitives/)                               │
├──────────────────────────────┬──────────────────────────────┬───────────────┤
│          Components          │            Styles            │    Scripts    │
├──────────────────────────────┼──────────────────────────────┼───────────────┤
│ • carousel.html              │ • 00_tokens_base.css         │ • primitives_ │
│ • lightbox.html (Zoom/Pan)   │ • 01_primitives.css          │   core.js     │
│ • option_pod.html            │ • 02_zoom_pan.css            │ • zoom_pan_   │
│ • option_intake_modal.html   │ • 03_option_intake.css       │   engine.js   │
│ • stepper.html               │                              │ • drive_      │
│ • whatsapp_modal.html        │                              │   normalizer. │
│ • toast.html                 │                              │   js          │
└──────────────────────────────┴──────────────────────────────┴───────────────┘
                                      ▲
                                      │ Import / Reusable Partial
                     ┌────────────────┴────────────────┐
                     ▼                                 ▼
      ┌─────────────────────────────┐   ┌─────────────────────────────┐
      │     Decision Registry       │   │      Shopping Registry      │
      │   (decision_registry_src/)  │   │       (shopping_src/)       │
      │  • Template, Components,    │   │  • Template, Components,    │
      │    Styles, Controller       │   │    Styles, Controller       │
      │  • Multi-Option Comparison  │   │  • Saree / Kurta / Jewelry  │
      │  • Multi-Tier Comments      │   │    Itemized Checklists      │
      └─────────────────────────────┘   └─────────────────────────────┘
```

### Key Architectural Invariants Enforced:
1. **Modular Source Limit**: All decomposed files in `ui_primitives/` and `*_src/` remain strictly < 300 lines (well within the 500-line limit).
2. **Byte-for-Byte Dual Release Parity**: `npm run verify:modular-architecture` enforces byte parity between `/` and `public/`.
3. **LRU Memory Protection**: High-resolution image zoom preserves mobile memory using an LRU cache (`MAX_CACHE_SIZE = 20`).
4. **Touch & Desktop Parity**: Supports both pinch-to-zoom / swipe-to-pan on mobile (300px+) and mousewheel / drag-to-pan on desktop.

---

## 5. Phased Implementation Roadmap

### Phase 1: Shared UI Primitives Engine Upgrade (`ui_primitives/`)
- [ ] **1.1**: Create `ui_primitives/scripts/drive_normalizer.js`:
  - Regex extraction for Google Drive ID (`/file/d/`, `id=`, `/open?id=`, raw ID).
  - URL builder for Zero-CORS CDN thumbnails (`sz=w600` for cards, `sz=w1600` for lightbox).
  - Standalone LRU Cache (`_imageCache` with eviction).
- [ ] **1.2**: Create `ui_primitives/scripts/zoom_pan_engine.js`:
  - Smooth pan and scale transform engine (`scale`, `pointX`, `pointY`).
  - Controls: Zoom In (`+`), Zoom Out (`-`), Fit (`0`), Reset (`R`).
  - Event listeners: Wheel zoom, drag-to-pan, touch pinch-to-zoom.
- [ ] **1.3**: Upgrade `ui_primitives/components/lightbox.html` & `ui_primitives/styles/01_primitives.css`:
  - Integrate floating zoom/pan toolbar into fullscreen lightbox.
  - Add smooth CSS transitions and boundary constraints.
- [ ] **1.4**: Create `ui_primitives/components/option_intake_modal.html`:
  - Tabbed intake: "Google Drive Link" (with instant thumbnail preview) vs "Local Image / Camera".
  - Validation feedback with inline status badge.

### Phase 2: Decision Registry SDCA Integration (`decision_registry_src/`)
- [ ] **2.1**: Update `decision_registry_src/components/` with Option Pod and Lightbox zoom wiring.
- [ ] **2.2**: Integrate Multi-Tier Comments Drawer (`HOST_INTERNAL` vs `ALL_STAKEHOLDERS`).
- [ ] **2.3**: Compile and verify byte parity with `scripts/build-decision-registry-html.cjs`.

### Phase 3: Shopping Registry SDCA Integration (`shopping_src/`)
- [ ] **3.1**: Wire Option Pods into Saree, Kurta, Lehenga, and Jewelry shopping category cards.
- [ ] **3.2**: Enable instant WhatsApp share of options using `whatsapp_modal.html`.
- [ ] **3.3**: Compile and verify byte parity with `scripts/build-shopping-html.cjs`.

### Phase 4: Automated Verification & Smoke Testing
- [ ] **4.1**: `npm run verify:modular-architecture` (all 33+ checks pass).
- [ ] **4.2**: `npm run test:decision-registry` & `npm run test:shopping`.
- [ ] **4.3**: Mobile layout verification (300px, 360px, 768px, 1200px viewports).

---

## 6. Definition of Done (DoD v1.7 Matrix)

| Gate | Verification Command / Metric | Required Verdict |
|---|---|---|
| **SDCA Script Limit** | No script in `scripts/` > 500 lines | `PASS` (current: 10 lines) |
| **Component Modularity** | All components in `ui_primitives/` < 300 lines | `PASS` |
| **Syntax Gate** | `node -c` on all JS controllers and primitives | `PASS` (0 syntax errors) |
| **Byte Parity** | `npm run verify:modular-architecture` | `PASS` (100% byte identical) |
| **Mobile Responsiveness** | Touch targets >= 44px, no overflow at 300px | `PASS` |
| **Zero-CORS Drive Preview** | Drive thumbnail test renders without CORS errors | `PASS` |
