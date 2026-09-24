# SK-006: Decorator Cockpit Multi-Option Intake & Zoom-Pan Primitives Integration

## 📊 Metadata

- **Category**: FEATURE
- **Priority**: HIGH
- **Status**: IMPLEMENTED
- **Estimate**: 8 hours
- **Target Release**: v2.2.0
- **Risk Level**: LOW
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-003  # Frontend Monolith Decomposition & Modular Architecture
    - SK-005  # Multi-Viewport Responsive Modernization
  related:
    - AC-DEC-2026-035  # Universal Cross-Domain Visual Asset Taxonomy (P-UNIVERSAL-VISUAL-ASSET-001)
    - AC-DEC-2026-038  # Tri-Modal Visual Ingestion & Collaborative Deep-Link Sharing (P-COLLAB-VISUAL-INTAKE-001)
  blocks:
    - None (Foundational)
```

- **Depends On**: `SK-003`, `SK-005`
- **Blocks**: None (Foundational)
- **Related / Siblings**: `AC-DEC-2026-035`, `AC-DEC-2026-038`, `P-MULTI-IMAGE-CONTAINER-001`, `P-COLLAB-OPTION-SHARE-001`

---

## 🎯 Goal

Extend the tri-modal visual intake, multi-image containers, and collaborative deep-link sharing architecture to the **Decorator Cockpit** (`decorator-cockpit.html`, `cockpit-fragment.html`), integrating the shared `ZoomPanEngine` primitive for high-resolution fabric/CAD plate micro-inspection and multi-option consensus voting across Bhubaneswar (Marquee) and Rayagada (Hotel Hall) decor scopes.

---

## 🛡️ Risk Assessment

- **Risks**:
  1. Regression of existing smoke suite `test-cockpit-smoke.cjs` which strictly asserts specific DOM IDs (`id="customPhotoModalBackdrop"`).
  2. CSS scoping leakage or collision inside `cockpit-fragment.html` when compiling shared `ui_primitives` stylesheets.
  3. `SEC-1` data residency regression: sensitive commercial pricing and negotiation battlecards must remain Firestore-only.
- **Mitigation**:
  1. Retain `#customPhotoModalBackdrop` for backward compatibility while adding `#skOptionIntakeBackdrop`.
  2. Use SDCA CSS scoping engine (`INV-SDCA-004`) to cleanly isolate `.sk-*` and `.zoom-pan-*` selectors.
  3. Run `npm run test:cockpit` and verify zero-leak checks pass.

---

## 📜 SSOT Impact

- [`User_Created/Discussion Threads/Shopping/260918_ShoppingList.md`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/Shopping/260918_ShoppingList.md#L3912) (Roadmap & Architectural Blueprint)
- [`cockpit_src/data/canonical_plates.json`](file:///d:/GitHub_Repo/Sree_Krushna/cockpit_src/data/canonical_plates.json)
- [`cockpit_src/build.cjs`](file:///d:/GitHub_Repo/Sree_Krushna/cockpit_src/build.cjs)
- [`cockpit_src/scripts/controller.js`](file:///d:/GitHub_Repo/Sree_Krushna/cockpit_src/scripts/controller.js)
- [`cockpit_src/components/modals/lightbox_modal.html`](file:///d:/GitHub_Repo/Sree_Krushna/cockpit_src/components/modals/lightbox_modal.html)
- [`cockpit_src/components/modals/lookbook_modal.html`](file:///d:/GitHub_Repo/Sree_Krushna/cockpit_src/components/modals/lookbook_modal.html)
- [`cockpit_src/styles/05_lookbook_and_modals.css`](file:///d:/GitHub_Repo/Sree_Krushna/cockpit_src/styles/05_lookbook_and_modals.css)

---

## 🔍 Open Discoveries

| ID | Discovery | Severity | Owner | Disposition | Evidence | Linked Task |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| D-001 | `toggleLightboxZoom()` was declared in `lightbox_modal.html` markup but unhandled in `controller.js` | Medium | Frontend | Resolved | `controller.js` lacked zoom logic; wired to `ZoomPanEngine` | `SK-006` |
| D-002 | Naked `DOMContentLoaded` listener in `cockpit_src/scripts/controller.js` violated `INV-LIFECYCLE-02` | High | Frontend | Resolved | Line 1141 converted to `readyState !== 'loading'` guard | `SK-006` |

---

## 📋 Implementation Plan

### Step 1: Data Layer Enrichment (Canonical Plates Options)
* **File to modify**: `cockpit_src/data/canonical_plates.json`
* **What to change**: Add `options` array and `selectedOptionIndex: 0` to each plate, seeding alternative photo options.

**🔍 Validation Gate**:
  1. (Binary) `node -e "const p = JSON.parse(fs.readFileSync('cockpit_src/data/canonical_plates.json')); if (!p.every(x => Array.isArray(x.options) && typeof x.selectedOptionIndex === 'number')) process.exit(1);"` → exits 0.
  2. [human-review] Verify option labels match canonical and design variant descriptions.

**🚦 Decision Node**:
  - **Pass**: Proceed to Step 2.
  - **Fail (1st)**: Fix schema formatting in `canonical_plates.json` and re-validate.
  - **Fail (2nd)**: Halt. Surface syntax error to user.

### Step 2: SDCA Compiler Primitives Wiring
* **File to modify**: `cockpit_src/build.cjs`
* **What to change**: Import `ui_primitives/styles/`, `ui_primitives/components/option_intake_modal.html`, and `ui_primitives/scripts/`.

**🔍 Validation Gate**:
  1. (Binary) `node cockpit_src/build.cjs --all` → must exit 0 and assemble root and public files.
  2. [human-review] Verify `decorator-cockpit.html` and `cockpit-fragment.html` contain `#skOptionIntakeBackdrop`.

**🚦 Decision Node**:
  - **Pass**: Proceed to Step 3.
  - **Fail (1st)**: Check file paths and injection markers; re-run build.
  - **Fail (2nd)**: Halt.

### Step 3: Lightbox & Lookbook Modal Templates & Styles
* **Files to modify**: `cockpit_src/components/modals/lightbox_modal.html`, `cockpit_src/components/modals/lookbook_modal.html`, `cockpit_src/styles/05_lookbook_and_modals.css`
* **What to change**: Integrate option switcher chips, look counter badges, add-option buttons, and deep-link share buttons.

**🔍 Validation Gate**:
  1. (Binary) `node cockpit_src/build.cjs --all` → exits 0.
  2. [human-review] Inspect visual layout of option chips in lookbook grid and lightbox topbar.

**🚦 Decision Node**:
  - **Pass**: Proceed to Step 4.
  - **Fail (1st)**: Check HTML tag nesting and CSS class names.
  - **Fail (2nd)**: Halt.

### Step 4: Controller Logic, ZoomPanEngine & Deep Linking
* **File to modify**: `cockpit_src/scripts/controller.js`
* **What to change**: Add option state management, ZoomPanEngine binding, intake modal handlers, WhatsApp deep-link composer, URL parameter parser, and fix `INV-LIFECYCLE-02`.

**🔍 Validation Gate**:
  1. (Binary) `node -c cockpit_src/scripts/controller.js` → exits 0 with zero syntax errors.
  2. (Binary) `npm run verify:ui-lifecycle` → exits 0.

**🚦 Decision Node**:
  - **Pass**: Proceed to Step 5.
  - **Fail (1st)**: Fix controller syntax or event binding; re-execute gate.
  - **Fail (2nd)**: Halt.

### Step 5: Test Gate Hardening & Pre-Flight Execution
* **File to modify**: `scripts/test-cockpit-smoke.cjs`
* **What to change**: Add assertions for `skOptionIntakeBackdrop`, `ZoomPanEngine`, `options` array, and deep-link parsing.

**🔍 Validation Gate**:
  1. (Binary) `npm run test:cockpit` → 100% green pass.
  2. (Binary) `npm run verify:modular-architecture` → 45/45 checks pass.

**🚦 Decision Node**:
  - **Pass**: Proceed to Step 6.
  - **Fail (1st)**: Reconcile assertions with rendered output; re-run.
  - **Fail (2nd)**: Halt.

---

## ✅ Definition of Done (v1.7)

| Tier | Name | Criterion | Verification Method | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | **Static** | Syntax & Lint Clean | `node -c`, `npm run verify:modular-architecture` | [x] | 45/45 checks pass, zero syntax errors |
| **T2** | **Functional** | Multi-Option Intake & Zoom-Pan Works End-to-End | `npm run test:cockpit` | [x] | 100% green across all 5 verification layers |
| **T2** | **Functional** | UI Lifecycle & 3-Trigger Dismissibility | `npm run verify:ui-lifecycle` | [x] | 100% green (INV-LIFECYCLE-01..04) |
| **T3** | **Integrated** | State Persistence & Deep Linking | `localStorage` + URL parameter reflection verified | [x] | Verified via `test:cockpit` VM sandbox & live URL parser |
| **T3** | **Integrated** | SSOT Synchronicity | `UI-QUALITY-ENHANCEMENT-CLUSTER.md` + registry updated | [x] | Master registry & cluster file synchronized |
| **T4** | **Standard** | Governance Compliance | `npm run verify:governance-wiring:all` | [x] | 187/187 artifacts fully wired |

**DoD Completion**: 6/6 criteria verified (100%)

