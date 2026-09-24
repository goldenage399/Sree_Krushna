---
pattern: button-primitive-and-preflight-gate
activation_tier: guarded
guard: "npm run verify:ui-buttons"
canonical_source: sree-krushna
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: enhancement-notes/SK-010/00_ENHANCEMENT_INDEX.md
    at: "Phase 2"
triggers:
  - "sk-btn"
  - "verify-ui-button-primitives"
  - "verify:ui-buttons"
  - "INV-BTN-01"
  - "INV-BTN-02"
  - "INV-BTN-03"
portability: universal
porting_effort: low
---

# Pattern: Universal UI Button Primitives & Pre-Flight Design System Verification Gate

**Standard ID**: `STD-UI-PRIMITIVE-002` / `P-BUTTON-PRIMITIVE-GATE-001`  
**Category**: Architecture / Design System / Automated Verification Gate  
**Origin**: Sree Krushna Marriage OS (SK-010 / AC-DEC-2026-047 / UI-DEC-2026-043)  
**Status**: VALIDATED  

---

## 1. Problem Statement
In component-based web architectures and modular HTML assemblers (SDCA), UI developers frequently introduce `<button>` tags into templates with intended CSS class names (e.g. `class="sk-btn sk-btn-secondary"`) that have not yet been declared in global or modular stylesheets. Alternatively, developers write naked `<button>` tags without any design system classes.

This yields two fatal user-facing failure modes:
1. **Unformatted User-Agent Fallback**: The browser renders raw, grey, beveled 3D buttons (such as `#skBtnVerifyDrive`), jarringly shattering the premium dark-mode luxury aesthetic.
2. **Pre-Flight Blind Spots**: Traditional linters and component build scripts verify HTML syntax and file line counts, but fail to verify semantic CSS class bindings and design token resolution.

---

## 2. The 3 Mandatory Invariants

### INV-BTN-01: Zero Naked Buttons Contract
Every `<button>` element across all template components (`ui_primitives/components/`, `shopping_src/components/`, `cockpit_src/components/`) and compiled release artifacts MUST declare at least one approved design-system class:
- Approved whitelist includes: `sk-btn`, `sk-modal-close`, `sk-carousel-btn`, `sk-zoom-btn`, `sk-drawer-close-btn`, `sk-reaction-btn`, `sk-role-pill`, `sk-intake-tab`, `shop-btn`, `table-group-btn`, `table-filter-btn`, `table-status-btn`, `table-reset-btn`, `table-accordion-toggle-btn`, `survey-stakeholder-btn`, `header-action-btn`, `btn-return`.
- Naked `<button>` tags (with no class or empty class) trigger an immediate build failure.

### INV-BTN-02: Zero Orphan Button Classes Contract
Every class name matching `sk-btn*` or `sk-modal-close` referenced in HTML templates MUST resolve to an active, defined CSS rule in `ui_primitives/styles/01_primitives.css`. Referencing undefined button token classes is strictly prohibited.

### INV-BTN-03: Design System Touch & State Contract
All button primitives in `01_primitives.css` MUST declare:
1. `cursor: pointer` explicitly.
2. `:hover`, `:active`, and `:focus-visible` accessibility outline states.
3. Disabled styling (`opacity: 0.5`, `cursor: not-allowed`, `pointer-events: none`).
4. Minimum touch ergonomic height (`min-height: 38px` or circular `32px × 32px`).

---

## 3. Automated Pre-Flight Gate (`scripts/verify-ui-button-primitives.cjs`)
A zero-dependency Node.js script audits all templates and release artifacts prior to deployment:

```bash
# Standalone execution:
npm run verify:ui-buttons

# Chained automatically inside:
npm run verify:modular-architecture
npm run verify:deployment
```

If any template introduces a raw `<button>` or orphan button class, the pre-flight gate prints line numbers and file paths, halting the build with non-zero exit code `1`.
