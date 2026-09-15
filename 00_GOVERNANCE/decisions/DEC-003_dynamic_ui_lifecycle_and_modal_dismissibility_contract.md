---
id: DEC-003
title: "Ratification of Dynamic UI Lifecycle, Script Sequencing, and 3-Trigger Modal Dismissibility Standard (STD-UI-LIFECYCLE-001)"
category: "Frontend Architecture & Lifecycle Governance"
status: "Approved"
date_decided: "2026-09-15"
decision_makers:
  - "Architecture Council"
  - "UI/UX Council"
  - "Lead Systems Architect"
governing_hub: "00_GOVERNANCE/HUB.md"
related_entities:
  - "STD-UI-LIFECYCLE-001"
  - "STD-MOD-COMP-001"
  - "P-VERIFY-GATE-002"
  - "INC-072"
  - "PAT-DEPLOY-GATE-001"
financial_impact_inr: 0
downstream_artifacts:
  - "scripts/verify-ui-lifecycle.cjs"
  - "scripts/verify-deployment.cjs"
  - ".agent/patterns/dynamic-fragment-lifecycle-and-modal-dismiss-contract.md"
  - "public/js/app.js"
  - "ui_primitives/scripts/comments_engine.js"
---

# Architecture Council Decision Record: DEC-003

## 1. Context & Forensic Retrospective

### 1.1 The Incident
During the integration of the Master Decision Registry (`#tab-decision-registry`) and Collaborative Options Model (`#skCommentsDrawer`) into the host SPA shell:
1. Navigating to `#tab-decision-registry` threw a fatal runtime exception:
   `TypeError: Cannot read properties of undefined (reading 'icon') at renderMilestones`.
2. Upon opening the Collaborative Comments Drawer (`#skCommentsDrawer`), the user was completely unable to close or dismiss the drawer via the close button, backdrop click, or keyboard.

### 1.2 Forensic Analysis: Why Did It Happen?
1. **Dynamic Script Tag Execution Race Condition (W3C HTML5 Spec)**:
   When `mountDecisionRegistryTab()` appended script elements to the DOM, external data and controller scripts (`<script src="...">`) were loaded asynchronously by the browser. Subsequent inline bootstrap scripts executed synchronously immediately, invoking `initDecisionRegistry()` before `DECISION_REGISTRY_DATA` was loaded and parsed into global memory.
2. **The "Static Document Mindset" vs. Dynamic SPA Lifecycle Trap**:
   The comments engine in `ui_primitives/scripts/comments_engine.js` initialized its DOM event listeners via `document.addEventListener('DOMContentLoaded', ...)`. In a dynamic Single-Page-Application (SPA) where fragments are loaded and injected via `fetch()` and `innerHTML` after the page has finished loading (`document.readyState === 'complete'`), the `DOMContentLoaded` event has already fired and never fires again. The event listeners were **silent zombies**, leaving all dismiss buttons completely inert.
3. **Closed-Over Scope & Missing Data Hydration Fallback**:
   In `decision_registry_src/scripts/controller.js`, state structures were sealed in `const` declarations at script evaluation time with no defensive null guards during initial milestone iteration.

### 1.3 Latency Analysis: Why Did Triage Take Multi-Turn Steps?
1. **Symptom-Masking vs. Root-Cause Divergence**:
   The initial error message (`Cannot read properties of undefined (reading 'icon')`) appeared to be a cosmetic data-schema omission in a JSON file. Initial investigation inspected data objects rather than identifying the script execution sequence.
2. **Proxy-Signal Verification Blindspot**:
   Existing pre-flight tests (`verify-deployment.cjs`, `local-smoke-test.cjs`) relied on **static string regex scanning** (e.g. checking whether `id="skCommentsDrawer"` existed in HTML strings). They verified element *existence*, not *interactive state machine transitions* (Open $\to$ Close Button Click $\to$ Backdrop Click $\to$ Escape Key $\to$ State Reset).

---

## 2. Evaluation of Architectural Options

The Council evaluated three distinct architectural approaches:

### Option A: Reactive Ad-Hoc Hardening (Localized Component & Script Patching)
- **Concept**: Surgically patch the immediate defect sites (`public/js/app.js` loader, `comments_engine.js` listener, `controller.js` null guards) and write component-specific unit tests.
- **Similarities**: Resolves the immediate user bugs and restores functional parity in `#tab-decision-registry`.
- **Distinctions**: Treats the incident as isolated typos; introduces no systemic gate; leaves sister modules (`mountCockpitTab`, `mountShoppingRegistryTab`) vulnerable to identical race conditions.
- **Council Verdict**: **REJECTED AS INSUFFICIENT** (High recurrence probability).

### Option B: Mechanical Pre-Flight Release Gate (Tooling-First)
- **Concept**: Port sister repository (`Task-Dashboard`) gate mechanics directly: build `scripts/verify-ui-lifecycle.cjs` and integrate it as Layer 10 of `verify-deployment.cjs`, asserting script sequencing, zero zombie listeners, and headless state simulation.
- **Similarities**: Provides automated detection and blocks non-compliant builds before release.
- **Distinctions**: Highly effective at catching known mechanical regressions, but lacks architectural authority without governance codification; developers can implement superficial workarounds if invariants are not formally standardized.
- **Council Verdict**: **NECESSARY BUT INCOMPLETE ON ITS OWN**.

### Option C: Architectural Standard Codification (Governance-First)
- **Concept**: Formulate `STD-UI-LIFECYCLE-001`, ratify an Architecture Council Decision, and capture `.agent/patterns/dynamic-fragment-lifecycle-and-modal-dismiss-contract.md` aligned with W3C and WAI-ARIA standards.
- **Similarities**: Solves root-cause understanding and establishes unambiguous design doctrine.
- **Distinctions**: Documentation without mechanical enforcement ("paper standard") suffers from gradual developer drift.
- **Council Verdict**: **NECESSARY BUT INCOMPLETE WITHOUT AUTOMATED TEETH**.

---

## 3. The Zero-Gap Hybrid Approach (Certified Rulings)

The Architecture Council hereby ratifies the **Zero-Gap Hybrid Approach**, binding together:
1. **Surgical Root-Cause Remediation** across all dynamic tab mounters and primitives.
2. **Mechanical Pre-Flight Teeth** via `scripts/verify-ui-lifecycle.cjs` (Layer 10 of deployment pipeline).
3. **Formal Architectural Standard (`STD-UI-LIFECYCLE-001`)** permanently binding all UI development.

### 3.1 Architectural Standard: `STD-UI-LIFECYCLE-001`
All web components, interactive overlays, and dynamic tab fragments in Marriage OS MUST adhere to four mandatory invariants:

- **`INV-LIFECYCLE-01` (Dynamic Script Sequencing Contract)**:
  Any host loader that dynamically extracts and appends `<script>` tags from HTML fragments MUST await external script network loading (`script.onload`) sequentially via a Promise before injecting or executing dependent inline scripts.
- **`INV-LIFECYCLE-02` (Zombie Listener Prohibition)**:
  UI primitives and fragment controllers are strictly prohibited from using naked `document.addEventListener('DOMContentLoaded', ...)`. They MUST guard with `document.readyState !== 'loading'` for immediate binding, re-bind defensively on element activation, and expose an explicit `init()` or `mount()` hook.
- **`INV-LIFECYCLE-03` (3-Trigger Modal/Drawer Dismissibility Contract — WAI-ARIA 1.2)**:
  Every modal dialog, bottom sheet, or slide-over drawer MUST implement all three dismiss triggers:
  1. *Explicit Close Button*: Dedicated target with click handler.
  2. *Backdrop Click*: Closes overlay when clicking outside the content container.
  3. *Escape Key*: Global `keydown` handler dismissing active overlays.
  4. *Programmatic API*: Idempotent dismiss function exported to `window`.
- **`INV-LIFECYCLE-04` (Automated Headless State Machine Simulation)**:
  Pre-flight gates must simulate state transitions (Open $\to$ Trigger 1 Close $\to$ Open $\to$ Trigger 2 Close $\to$ Open $\to$ Trigger 3 Close) in a headless VM sandbox, asserting class removal and state reset.

---

## 4. Council Verification & Parity Audit

1. **Automated Gate Execution**:
   - `scripts/verify-ui-lifecycle.cjs` implemented and passing 100% GREEN.
   - `scripts/verify-deployment.cjs` Layer 10 wired and passing 100% GREEN.
   - `npm test` (`scripts/local-smoke-test.cjs`) passing 100% GREEN.
2. **Proactive Fix Detected by Gate**:
   - The new gate immediately detected and prevented a dormant script-ordering defect in `mountCockpitTab()`, which has now been converted to the sequential Promise await standard.
3. **Sister Repo Alignment**:
   - Imports proven safety mechanics from `Task-Dashboard` (`INC-072`, `modal-action-handler-contract.md`, and `preflight-gate.cjs`).

---

## 5. Next Steps
- [x] Implement `scripts/verify-ui-lifecycle.cjs` and register in `package.json`.
- [x] Wire Layer 10 into `scripts/verify-deployment.cjs`.
- [x] Codify `.agent/patterns/dynamic-fragment-lifecycle-and-modal-dismiss-contract.md`.
- [x] Update `GEMINI.md` Prime Invariants.
- [x] Verify all 8 test and verification suites.
