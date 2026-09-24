# SK-010: Universal UI Button Primitives & Pre-Flight Design System Verification Gate

## 📊 Metadata

- **Category**: FEATURE / DESIGN_SYSTEM / QUALITY_GATE
- **Priority**: HIGH
- **Status**: IMPLEMENTED
- **Estimate**: 4 hours
- **Target Release**: v2.5.0
- **Risk Level**: LOW
- **Owner**: goldenage399
- **Cluster**: `[UI-QUALITY]`

## 🔗 Dependencies

```yaml
dependencies:
  depends_on:
    - SK-007  # Candidate Look Lifecycle, 30-Day Archival Recovery & Shared Comments Primitive Integration
    - SK-009  # Contextual Multi-Option Comments Engine Architecture & Cross-Option Tagging
  related:
    - AC-DEC-2026-019  # Modular Component Architecture Invariant (STD-MOD-COMP-001)
    - AC-DEC-2026-026  # 3-Tier Multi-Surface Web App & Shopping Deployment
    - AC-DEC-2026-035  # Pinterest Intake & Collaborative Visual Sharing
    - AC-DEC-2026-047  # Universal UI Button Primitives & Pre-Flight Gate (STD-UI-PRIMITIVE-002)
    - .agent/patterns/button-primitive-and-preflight-gate.md
    - docs/references/SPEC-ARCH-BUTTON-PRIMITIVES-001.md
    - docs/incidents/INC-098-orphan-button-tokens-and-preflight-design-system-blind-spot.md
  blocks:
    - None
```

---

## 🎯 Goal

Permanently eradicate unstyled and unformatted `<button>` elements (such as `#skBtnVerifyDrive`, `#skBtnCancelIntake`, `#skBtnSubmitOption`, `#skOptionIntakeClose`) across all application surfaces by:
1. Codifying canonical, token-bound Universal Button & Modal Close Primitives (`.sk-btn`, `.sk-btn-primary`, `.sk-btn-secondary`, `.sk-btn-danger`, `.sk-modal-close`) in `ui_primitives/styles/01_primitives.css`.
2. Implementing an automated, deterministic pre-flight static verification gate (`scripts/verify-ui-button-primitives.cjs`) that scans all HTML component templates and release artifacts for raw unstyled `<button>` tags and orphan CSS classes, halting builds on violation.
3. Recompiling all 12 standalone and fragment surfaces (Cockpit, Shopping, Decision Registry) with 100% binary byte parity to `/public`.

---

## 📋 Definition of Done (DoD v1.7 Matrix) & Sequential Phasing

### Phase 1: Universal Button & Modal Close Primitives (`ui_primitives/styles/01_primitives.css`)
- [x] **Base Button Reset (`.sk-btn`)**: Implement `.sk-btn` declaring `display: inline-flex`, `align-items: center`, `justify-content: center`, gap, `padding: 8px 16px`, `min-height: 38px`, `border-radius: var(--sk-radius-md, 8px)`, `font-family: var(--sk-font-sans)`, `font-size: 13px`, `font-weight: 600`, zero border/background default, `cursor: pointer`, and `:focus-visible` gold outline.
- [x] **Secondary Button Surface (`.sk-btn-secondary`)**: Implement `.sk-btn-secondary` bound to `var(--sk-surface)`, `border: 1px solid var(--sk-border)`, `color: var(--sk-text-primary)` with hover elevation to `var(--sk-surface-elevated)` and `border-color: var(--sk-gold)`.
- [x] **Primary Button Luxury Accent (`.sk-btn-primary`)**: Implement `.sk-btn-primary` bound to `var(--sk-gold)`, dark text (`#0f1117`), gold box-shadow, and subtle `-1px` transform on hover.
- [x] **Danger Button Alert Surface (`.sk-btn-danger`)**: Implement `.sk-btn-danger` with subtle rose tint and border.
- [x] **Modal Close Affordance (`.sk-modal-close`)**: Implement `.sk-modal-close` declaring `32px × 32px` circular geometry, transparent background, muted gray text, and gold hover transition.
- [x] **Disabled & Accessibility States**: Enforce `opacity: 0.5`, `cursor: not-allowed`, and `pointer-events: none` for disabled states.
- [x] **Validation Gate (VG-1)**: Manual inspect + headless syntax validation confirms `01_primitives.css` compiles with valid CSS token bindings and no syntax errors (verified at 294 lines, <500 limit).

### Phase 2: Automated Pre-Flight Gate Script & CI Wiring
- [x] **Static DOM Analyzer (`scripts/verify-ui-button-primitives.cjs`)**: Develop zero-dependency Node.js script scanning `ui_primitives/components/*.html`, `shopping_src/components/*.html`, `cockpit_src/components/*.html`, and compiled HTML pages.
- [x] **Invariant Check 1 (`INV-BTN-01`)**: Enforce Zero Naked Buttons. Every `<button>` element must declare at least one design-system class from the approved whitelist:
  `['sk-btn', 'sk-modal-close', 'sk-carousel-btn', 'sk-zoom-btn', 'sk-drawer-close-btn', 'sk-reaction-btn', 'sk-role-pill', 'sk-intake-tab', 'shop-btn', 'table-group-btn', 'table-filter-btn', 'table-status-btn', 'table-reset-btn', 'table-accordion-toggle-btn', 'survey-stakeholder-btn']`.
- [x] **Invariant Check 2 (`INV-BTN-02`)**: Enforce Zero Orphan Button Classes. Every class name matching `sk-btn*` or `sk-modal-close` referenced in HTML MUST resolve to a defined rule in `ui_primitives/styles/01_primitives.css`.
- [x] **Invariant Check 3 (`INV-BTN-03`)**: CSS State & Touch Contract. Assert that primitive button classes declare `cursor: pointer` and `:hover` states.
- [x] **Package.json Wiring**: Add `"verify:ui-buttons": "node scripts/verify-ui-button-primitives.cjs"` to `package.json` scripts.
- [x] **Pre-Flight Hooking**: Wire `verify:ui-buttons` into `scripts/verify-modular-architecture.cjs` so that running modular architecture checks automatically gates button compliance.
- [x] **Validation Gate (VG-2)**: Synthetic test introducing an unstyled `<button>` triggers non-zero exit code `1`; running against current codebase passes with 0 errors.

### Phase 3: Module Recompilation, Dual-Release Parity & Verification
- [x] **SDCA Recompilation**: Rebuild all targets via:
  - `node cockpit_src/build.cjs --all`
  - `node shopping_src/build.cjs --all`
  - `node scripts/build-decision-registry-html.cjs`
- [x] **Binary Byte Parity**: Verify 100% byte parity between root files and `public/` files across:
  - `shopping-registry.html` ⟷ `public/shopping-registry.html`
  - `shopping-fragment.html` ⟷ `public/shopping-fragment.html`
  - `decorator-cockpit.html` ⟷ `public/decorator-cockpit.html`
  - `cockpit-fragment.html` ⟷ `public/cockpit-fragment.html`
  - `decision-registry.html` ⟷ `public/decision-registry.html`
  - `decision-registry-fragment.html` ⟷ `public/decision-registry-fragment.html`
- [x] **Automated Test Matrix Green Sweep**:
  - `npm run verify:ui-buttons` (5/5 checks green)
  - `npm run verify:modular-architecture` (46/46 checks green)
  - `npm run verify:ui-lifecycle` (4/4 checks green)
  - `npm run test:shopping` (44/44 items green)
  - `npm run test:cockpit` (smoke test passed)
  - `npm run verify:deployment` (10/10 layers green)
  - `npm run verify:governance-wiring:all` (190/190 artifacts green)
- [x] **Validation Gate (VG-3)**: Visual confirmation in live browser that `#skBtnVerifyDrive`, `#skBtnCancelIntake`, `#skBtnSubmitOption`, and `#skOptionIntakeClose` render with pristine luxury dark-mode aesthetics.
