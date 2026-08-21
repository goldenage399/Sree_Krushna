---
pattern: layout-linter-neutrality-gate
activation_tier: reference
canonical_source: task-dashboard
status: VALIDATED
portability: universal
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

---

# Layout Linter Neutrality Gate & Instrumentation Separation

## Problem

When a strict build-time preflight linter requires that every HTML `id` selector used in components is declared in a CSS stylesheet, agents are tempted to quiet the linter by adding placeholder styles. If the agent guesses or speculatively adds layout-altering properties (such as `display: flex;` or `display: grid;`) to global wrappers (such as `#main-content`), it can silently cause severe visual regressions and layout breakage across the entire application.

## Solution

1. **Differentiate Testing Hooks from Layout IDs**:
   - If an element is instrumented *strictly* for testing or automation hooks (e.g., E2E container matching), rely solely on `data-testid="my-element"` rather than `id="my-element"`.
   - Update linter patterns and layout catalog parsers (`idRegex`) to ignore `data-testid` attributes entirely.

2. **Enforce Layout-Neutral CSS Placeholders**:
   - When a dummy CSS selector is required for validation compliance, the rule must be kept layout-neutral.
   - Apply only browser default behaviors (e.g., `display: block` for `<main>`) or safe fallback properties (like `min-width: 0`), with an explicit CSS comment stating it is a placeholder.

3. **Mandate Visual Smoke-Checks for Global Styles**:
   - Running the local development server and conducting visual verification across multiple views is mandatory whenever root-level (`App.jsx`) or global stylesheets are modified.

## Task-Dashboard instance

- **Incident INC-021**: Reverted display of `#main-content` to `display: block;` and removed `id="main-content"` in favor of `data-testid="main-content"` in `src/App.jsx`.
- **Linter regex fix**: Added a word boundary (`\b`) anchor to the `idRegex` in `scripts/build-layout-catalog.cjs` and `scripts/preflight-gate.cjs` to prevent matching `data-testid` as `id`.
