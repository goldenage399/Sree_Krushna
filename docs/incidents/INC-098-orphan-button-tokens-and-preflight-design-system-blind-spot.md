# INC-098 — Orphan Button Tokens, Naked HTML Buttons & Pre-Flight Design System Verification Blind Spot

**Incident ID**: `INC-098`  
**Date**: `2026-09-24`  
**Severity**: Medium (Visual Hierarchy Defect / User-Agent Fallback / Pre-Flight Verification Blind Spot)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Governing Standard**: `STD-UI-PRIMITIVE-002`, `P-BUTTON-PRIMITIVE-GATE-001`, `AC-DEC-2026-047`, `UI-DEC-2026-043`, `SPEC-ARCH-BUTTON-PRIMITIVES-001.md`  
**Affected Components**: `ui_primitives/styles/01_primitives.css`, `ui_primitives/components/option_intake_modal.html`, `scripts/verify-ui-button-primitives.cjs`, `scripts/verify-modular-architecture.cjs`, `cockpit_src/template.html`, `index.html`  
**Related Patterns**: [`.agent/patterns/button-primitive-and-preflight-gate.md`](../../.agent/patterns/button-primitive-and-preflight-gate.md), [`.agent/patterns/dynamic-fragment-lifecycle-and-modal-dismiss-contract.md`](../../.agent/patterns/dynamic-fragment-lifecycle-and-modal-dismiss-contract.md)  

---

## Architectural Surface Mapping

1. **UI Surface**: In `ui_primitives/components/option_intake_modal.html` and `whatsapp_modal.html`, buttons (`#skBtnVerifyDrive`, `#skBtnCancelIntake`, `#skBtnSubmitOption`, `#skOptionIntakeClose`) declared classes `sk-btn`, `sk-btn-primary`, `sk-btn-secondary`, and `sk-modal-close`. Because zero CSS rules existed for these classes, browsers fell back to raw, beveled 3D grey buttons.
2. **Data Surface**: Unaffected (Purely presentation and CSS token resolution; no database mutations or schemas were altered).
3. **Reactive Surface**: Unaffected (Click handlers, modal open/close actions, and input validation remained functional, but suffered visually from user-agent fallback).
4. **Service Surface**: Unaffected (No external Cloud Functions or Firebase services involved).
5. **Module Surface**: SDCA module templates (`cockpit_src`, `shopping_src`, `ui_primitives`, and `index.html`) contained raw `<button>` elements or references to undefined button token classes.
6. **Governance Surface**: Ratified `AC-DEC-2026-047` / `UI-DEC-2026-043` (`STD-UI-PRIMITIVE-002` / `P-BUTTON-PRIMITIVE-GATE-001`), scaffolded and completed `SK-010`, developed `scripts/verify-ui-button-primitives.cjs`, and registered `FKL-DI-024`, `FKL-AL-008`, `FKL-WI-005` in `docs/references/SPEC-ARCH-BUTTON-PRIMITIVES-001.md`.

---

## 1. Executive Summary & Symptoms

During manual and visual review of the candidate look ingestion modal (`#skOptionIntakeModal`), action buttons such as `#skBtnVerifyDrive` were observed rendering with browser-default, raw grey beveled 3D styling rather than the application's signature dark luxury gold theme.

The user queried:
> *"why do these unformatted buttons still exists - document.querySelector("#skBtnVerifyDrive") How are we even allowing that? Be it may in any of the module or section throughout the app. Isn't there any pre-flight check for all these things that can be done automatically so that such mishaps never occur and such small details should not be followed up again"*

---

## 2. Root Cause Analysis

### Step 1: Technical Anatomy
1. **Orphan Token Classes in HTML**: When `option_intake_modal.html` was created, the markup author added design system classes:
   ```html
   <button type="button" class="sk-btn sk-btn-secondary" id="skBtnVerifyDrive">Verify & Preview</button>
   ```
   However, the author never added `.sk-btn`, `.sk-btn-primary`, `.sk-btn-secondary`, or `.sk-modal-close` to `ui_primitives/styles/01_primitives.css` or any other stylesheet.
2. **Pre-Flight Verification Blind Spot**:
   - `scripts/verify-modular-architecture.cjs` verified line counts (`<= 500 lines`), component presence, and byte parity between root and `public/`.
   - `scripts/verify-ui-lifecycle.cjs` verified event listener guards (`readyState !== 'loading'`) and script awaiting.
   - Neither gate inspected the HTML AST or regex patterns to verify whether `<button>` elements possessed valid CSS class names or whether referenced classes actually existed in CSS stylesheets.

---

## 3. Resolution & Invariant Formulated

Under `AC-DEC-2026-047` / `UI-DEC-2026-043` and enhancement ticket `SK-010`, a **Hybrid Architecture** was implemented:

1. **Universal Button & Modal Close Primitives (`STD-UI-PRIMITIVE-002` / `FKL-DI-024`)**:
   - Codified `.sk-btn`, `.sk-btn-primary`, `.sk-btn-secondary`, `.sk-btn-danger`, `.sk-btn-whatsapp`, and `.sk-modal-close` in `ui_primitives/styles/01_primitives.css`.
   - Enforced 44px minimum touch targets, dark gold color palette, smooth transitions, focus-visible outlines, and disabled states.
   - Preserved SDCA modularity: `01_primitives.css` is 308 lines (`<= 500 lines`).
2. **Automated Static Verification Gate (`P-BUTTON-PRIMITIVE-GATE-001` / `FKL-AL-008` / `FKL-WI-005`)**:
   - Developed `scripts/verify-ui-button-primitives.cjs` (zero dependencies, 306 lines).
   - Enforces three invariants:
     - `INV-BTN-01` (Zero Naked Buttons): Fails if any `<button>` lacks an approved design-system class.
     - `INV-BTN-02` (Zero Orphan Button Classes): Fails if any `sk-btn*` or `sk-modal-close` in HTML lacks an active CSS definition.
     - `INV-BTN-03` (Button State & Contract Enforcement): Asserts `cursor: pointer`, `:hover`, and focus states.
   - Wired into `package.json` (`npm run verify:ui-buttons`).
   - Chained directly into `scripts/verify-modular-architecture.cjs` as **Step 6**.
3. **Codebase Sanitation**:
   - Eliminated naked buttons in `cockpit_src/template.html` (`class="sk-btn sk-btn-login"`) and `index.html` (`class="header-action-btn btn-gold"`).
4. **Distribution Parity**:
   - Recompiled all standalone and fragment surfaces (`decorator-cockpit.html`, `shopping-registry.html`, `decision-registry.html`, and their `/public` mirrors) with 100% byte parity.

---

## 4. Verification & Prevention Gates

All verification checks pass 100% green:
1. `npm run verify:ui-buttons` — 5/5 checks green, 0 naked buttons found across 29 HTML files.
2. `npm run verify:modular-architecture` — 46/46 checks green (including Step 6 button primitives gate).
3. `npm run verify:ui-lifecycle` — 4/4 checks green.
4. `npm run verify:deployment` — 10/10 deployment layers green, root & public in exact sync.
5. `npm run verify:governance-wiring:all` — 191/191 artifacts fully wired (P82).
