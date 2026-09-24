# SPEC-ARCH-BUTTON-PRIMITIVES-001: Universal UI Button Primitives & Pre-Flight Design System Verification Gate

<details>
<summary>🔑 FKL Item Header (FKL-DI-024)</summary>

```yaml
---
fkl_id: FKL-DI-024
fkl_type: DesignInvariant
source:
  - docs/incidents/INC-098-orphan-button-tokens-and-preflight-design-system-blind-spot.md
  - User_Created/Discussion Threads/Council/260924_arch_council_ui_button_primitives_and_preflight_gate.md
  - AC-DEC-2026-047
  - UI-DEC-2026-043
  - STD-UI-PRIMITIVE-002
  - WT-02
  - WT-06
promoted_from: ""
applies_to:
  - UniversalButtonPrimitives
  - ModalCloseAffordances
  - OptionIntakeModal
  - WhatsAppModal
  - DecoratorCockpit
  - ShoppingRegistry
workflow_activation:
  - WT-02
  - WT-06
  - WT-09
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-BUTTON-PRIMITIVES-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-AL-008)</summary>

```yaml
---
fkl_id: FKL-AL-008
fkl_type: ArchitecturalLearning
source:
  - docs/incidents/INC-098-orphan-button-tokens-and-preflight-design-system-blind-spot.md
  - SK-010
  - P-BUTTON-PRIMITIVE-GATE-001
promoted_from: ""
applies_to:
  - StaticDOMAnalyzer
  - RegexClassTokenResolution
  - PreFlightVerificationPipeline
workflow_activation:
  - WT-06
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-BUTTON-PRIMITIVES-001.md
---
```
</details>

<details>
<summary>🔑 FKL Item Header (FKL-WI-005)</summary>

```yaml
---
fkl_id: FKL-WI-005
fkl_type: WorkflowImprovement
source:
  - docs/incidents/INC-098-orphan-button-tokens-and-preflight-design-system-blind-spot.md
  - SK-010
  - scripts/verify-ui-button-primitives.cjs
promoted_from: ""
applies_to:
  - verify-modular-architecture
  - verify-deployment
  - CIBuildPipeline
workflow_activation:
  - WT-09
promotion_status: Active
superseded_by: ""
content_ref: docs/references/SPEC-ARCH-BUTTON-PRIMITIVES-001.md
---
```
</details>

---

## 1. Architectural Motivation & Context

In a complex multi-surface web platform (Single-Page Application, standalone tools, and dynamically injected sub-application fragments), UI components are constructed by multiple developers and automated subagents.

During development of the Candidate Looks Option Intake modal (`ui_primitives/components/option_intake_modal.html`), modal buttons were assigned intended design system class names (`class="sk-btn sk-btn-secondary"`, `class="sk-btn sk-btn-primary"`, `class="sk-modal-close"`), but **zero CSS rules** had actually been written in the global stylesheet (`ui_primitives/styles/01_primitives.css`).

Consequently:
1. **The User-Agent Fallback Failure**: Browsers silently fell back to user-agent default styles, rendering raw, grey, beveled 3D buttons (such as `#skBtnVerifyDrive`, `#skBtnCancelIntake`, `#skBtnSubmitOption`). This shattered the luxury dark gold visual aesthetic.
2. **The Pre-Flight Blind Spot**: Existing automated checks (`verify:modular-architecture`, `verify:ui-lifecycle`) only checked file lengths, JavaScript syntax, and event listener patterns; none verified that `<button>` tags possessed approved design classes or that referenced button classes actually existed in CSS.

---

## 2. Invariant Specifications

### 2.1 Invariant: Universal UI Button Primitives & Token Contract (`FKL-DI-024` / `STD-UI-PRIMITIVE-002`)

All button elements across all templates and release artifacts must utilize canonical design tokens declared in `ui_primitives/styles/01_primitives.css`:

1. **Base Reset (`.sk-btn`)**:
   - `display: inline-flex; align-items: center; justify-content: center; gap: 8px;`
   - `font-family: var(--sk-font-sans); font-size: 13px; font-weight: 600; line-height: 1.4;`
   - `padding: 8px 16px; min-height: 38px; border-radius: var(--sk-radius-md, 8px);`
   - `border: 1px solid transparent; background: transparent; cursor: pointer; text-decoration: none;`
   - `transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;`
   - Accessible focus: `:focus-visible { outline: 2px solid var(--sk-gold); outline-offset: 2px; }`
2. **Secondary Surface (`.sk-btn-secondary`)**:
   - `background: var(--sk-surface); border-color: var(--sk-border); color: var(--sk-text-primary);`
   - Hover: `background: var(--sk-surface-elevated); border-color: var(--sk-gold); color: var(--sk-gold);`
3. **Primary Luxury Accent (`.sk-btn-primary`)**:
   - `background: var(--sk-gold); border-color: var(--sk-gold); color: #0f1117; font-weight: 700;`
   - `box-shadow: 0 4px 14px rgba(212, 163, 89, 0.25);`
   - Hover: `transform: translateY(-1px); box-shadow: 0 6px 18px rgba(212, 163, 89, 0.4);`
4. **Danger Alert Surface (`.sk-btn-danger`)**:
   - `background: rgba(239, 68, 68, 0.12); border-color: rgba(239, 68, 68, 0.35); color: #f87171;`
   - Hover: `background: rgba(239, 68, 68, 0.22); border-color: #ef4444; color: #ffffff;`
5. **Modal Close Affordance (`.sk-modal-close`)**:
   - Circular `32px × 32px` touch target (`min-width: 32px; min-height: 32px; border-radius: 50%;`).
   - Centered SVG glyph, translucent gold hover state (`background: rgba(212, 163, 89, 0.15); color: var(--sk-gold);`).
6. **Disabled State Contract**:
   - `opacity: 0.5; cursor: not-allowed; pointer-events: none; transform: none; box-shadow: none;`

### 2.2 Invariant: Static Pre-Flight Cross-Layer Class Resolution (`FKL-AL-008` / `P-BUTTON-PRIMITIVE-GATE-001`)

See [`.agent/patterns/button-primitive-and-preflight-gate.md`](../../.agent/patterns/button-primitive-and-preflight-gate.md). An automated AST and regex analyzer (`scripts/verify-ui-button-primitives.cjs`) statically verifies cross-layer integrity prior to build promotion:

1. **`INV-BTN-01` (Zero Naked Buttons)**: Every `<button>` must declare at least one approved design-system class name:
   `['sk-btn', 'sk-modal-close', 'sk-carousel-btn', 'sk-zoom-btn', 'sk-drawer-close-btn', 'sk-reaction-btn', 'sk-role-pill', 'sk-intake-tab', 'shop-btn', 'table-group-btn', 'table-filter-btn', 'table-status-btn', 'table-reset-btn', 'table-accordion-toggle-btn', 'survey-stakeholder-btn', 'header-action-btn', 'btn-return']`.
2. **`INV-BTN-02` (Zero Orphan Button Classes)**: Every class token matching `sk-btn*` or `sk-modal-close` referenced in HTML MUST resolve to a corresponding CSS rule in `01_primitives.css`.
3. **`INV-BTN-03` (CSS State & Touch Contract)**: Enforces that button primitive classes explicitly define `cursor: pointer`, `:hover`, and minimum touch ergonomics.

### 2.3 Invariant: Zero Naked Buttons CI & Modular Gate Integration (`FKL-WI-005`)

The button verification gate is not an optional advisory check; it is wired directly into:
1. `npm run verify:ui-buttons` (Standalone gate).
2. `npm run verify:modular-architecture` (Step 6 of the SDCA Modular Component Architecture Gate).
3. `npm run verify:deployment` (Deployment Release Gate).

Any attempt to introduce a naked `<button>` or orphan button class triggers a non-zero exit code (`1`), immediately halting compilation and blocking production release.

---

## 3. Structural Constraints & Modularity Compliance (`STD-MOD-COMP-001`)

- `ui_primitives/styles/01_primitives.css`: Strictly `<= 500 lines` (currently 307 lines).
- `scripts/verify-ui-button-primitives.cjs`: Zero external dependencies (`fs`, `path`), strictly `<= 500 lines` (currently 305 lines).

---

## 4. Verification & Gate Compliance

All changes touching buttons or templates must pass:
1. `npm run verify:ui-buttons`
2. `npm run verify:modular-architecture`
3. `npm run verify:ui-lifecycle`
4. `npm run verify:deployment`
5. `npm run verify:governance-wiring:all`
