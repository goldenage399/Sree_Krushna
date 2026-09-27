---
pattern: structural-dom-contract-gate
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"
portability: universal
canonical_source: sree-krushna
porting_effort: low
---

# SDCA Structural DOM Contract Gate (STD-STRUCTURAL-CONTRACT-001)

**Category**: Structural Integrity, SDCA Architecture & Cross-Repo Portable Gate  
**Applies to**: Single-Document Client Applications (SDCA), lazy-loaded HTML fragments, SPA tab mount targets, component HTML assemblers, and compiled web assets.  
**Origin**: 2026-09-28 (Sree Krushna Marriage OS — INC-089 / INC-090 / SK-028 / AC-DEC-2026-070).  
**Status**: VALIDATED  

---

## 1. Context & Problem Statement

In component-assembled web architectures and Static Decoupled Component Assemblers (SDCA), UI pages are built by assembling modular component templates (`_src/components/*.html`) into standalone HTML artifacts (`.html`) or lazy-loadable fragments (`-fragment.html`).

A critical class of regression occurs across three distinct failure layers:
1. **Source-level Unbalanced Tags (Gap Variant A)**: A missing closing tag (e.g. `<div>`) in an individual source component file silently causes browser error-recovery to reparent descendant elements outside their intended container.
2. **Source/Artifact-level Hierarchy Drift (Gap Variant B)**: All tags are strictly balanced, but elements are placed under the wrong ancestor (or outside required layout frames), breaking styling, scoping, and DOM selector assumptions.
3. **Runtime Lazy-Mount Contract Failures (Gap Variant C)**: In host SPAs that dynamically fetch and inject fragments into mount frames (e.g. `#shoppingRegistryFrame > #shoppingRegistryRoot`), runtime `querySelector()` or event binding expectations fail if the browser's DOM parser alters the ancestor chain upon injection.

Textual substring assertions (`String.includes('#id')`) completely fail to catch these bugs because the IDs exist in the file text, but in the wrong hierarchical relationship.

---

## 2. Invariant Rules (STD-STRUCTURAL-CONTRACT-001)

### Rule 1: Zero Unbalanced Source Tags (Pre-Compilation)
Every HTML component in `_src/components/*.html` must be validated by a stack-based tag matcher (`scripts/check-html-balance.cjs`) before compilation. Any unclosed or mismatched tag halts the build immediately with line-accurate diagnostics.

### Rule 2: Declarative Structural Contract Declarations
Each SDCA module must declare a JSON contract in `.structural-contracts/<module>.json` specifying:
- Source components and compiled artifact targets (distinguishing `standalone` vs `fragment`).
- Required IDs and their required ancestor relationships (`must_be_descendant_of`, `must_be_at_root`).
- Runtime selector bindings and calling JavaScript lines.

### Rule 3: Compile-Time Hierarchy Contract Validation
Compiled artifacts are validated against their `.structural-contracts/<module>.json` using a zero-dependency stack-based tag-mapping algorithm (`scripts/verify-structural-contracts.cjs`). The validator builds an exact ancestor chain for each DOM ID and verifies ancestry constraints.

### Rule 4: Runtime DOM Contract Assertions
Host application lazy-mounting routines must be asserted in headless browser tests (Playwright `tests/sdca-structural.spec.mjs`), ensuring that after tab navigation and fragment mounting, `frameEl.contains(rootEl)` evaluates to `true` in the live browser DOM.

---

## 3. Portable Implementation

### Contract Declaration Format (`.structural-contracts/<module>.json`)
```json
{
  "module": "shopping",
  "source_components": ["shopping_src/components/*.html"],
  "artifacts": {
    "standalone": "shopping-registry.html",
    "fragment": "shopping-fragment.html"
  },
  "required_ids": [
    {
      "id": "shoppingRegistryFrame",
      "artifact": "fragment",
      "must_be_at_root": true,
      "comment": "Mount frame container in host SPA"
    },
    {
      "id": "shoppingRegistryRoot",
      "artifact": "fragment",
      "must_be_descendant_of": "shoppingRegistryFrame",
      "comment": "Extracted root element injected into frame"
    },
    {
      "id": "shopWelcomeBanner",
      "artifact": "both",
      "must_be_descendant_of": "shoppingRegistryRoot",
      "comment": "Header section must remain child of main root"
    }
  ],
  "runtime_selectors": [
    { "selector": "#shoppingRegistryFrame", "mounted_by": "mountShoppingRegistryTab()", "app_js_line": 1276 }
  ]
}
```

### Portable Verification Command
```bash
# Validate local repo:
node scripts/verify-structural-contracts.cjs

# Validate any target repo on disk (zero-config):
node scripts/verify-structural-contracts.cjs --dir <path-to-target-repo>
```

---

## 4. Verification Evidence & Proven Adoption

- **Phase 1 (Gap Variant A)**: `scripts/check-html-balance.cjs` verified 16/16 SDCA HTML files green; negative test caught injected unclosed tag.
- **Phase 2 (Gap Variant B)**: `scripts/verify-structural-contracts.cjs` verified 17/17 hierarchy contracts green across 3 SDCA modules (`shopping`, `cockpit`, `decision_registry`); negative test caught deliberate hierarchy violation.
- **Phase 3 (Gap Variant C)**: Playwright test suite `tests/sdca-structural.spec.mjs` verified 8/8 runtime DOM assertions green across Desktop Chromium and Mobile Chrome (Pixel 5).
- **Phase 4 (Cross-Repo Portability)**: Verified zero-config cross-repo execution against sibling repositories `Task-Dashboard` and `OperatusOS` on disk with exit code 0.
