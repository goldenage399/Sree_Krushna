---
name: structural-contract-verifier
description: >
  Validates SDCA HTML component tag balance and DOM structural contracts across source files,
  compiled artifacts, and runtime mount containers (STD-STRUCTURAL-CONTRACT-001).
  Prevents unclosed tag reparenting and broken DOM hierarchy regressions.
---

# SDCA Structural Contract Verifier (STD-STRUCTURAL-CONTRACT-001)

## Goal
Eliminate silent DOM structural corruptions and layout breakages caused by unclosed HTML tags, improper tag nesting, and broken lazy-mount container selector contracts across SDCA modules.

---

## When to Use

1. **Pre-Compilation**: Whenever creating or modifying any HTML component template in `_src/components/*.html`.
2. **Build Verification**: Whenever running SDCA builds or compiling standalone/fragment artifacts.
3. **Runtime Verification**: Whenever introducing or modifying SPA lazy fragment mounting logic (`app.js` tab mounters, `querySelector`, `getElementById`).
4. **Cross-Repo Porting**: When verifying HTML component architectures across repositories via `/sap-sync`.

---

## 3-Phase Verification Pipeline

### Phase 1: Source-Level Tag Balance (Gap Variant A)
Stack-based tag matcher validating that every `<tag>` in component source files has a strictly matching `</tag>`.
```bash
node scripts/check-html-balance.cjs <path/to/component.html>
```

### Phase 2: Compile-Time Hierarchy Contracts (Gap Variant B)
Reads declarative JSON contracts in `.structural-contracts/<module>.json` and uses stack-based tag-mapping to assert that parent-child and ancestor-descendant relationships exist in compiled output (`.html` and `-fragment.html`).
```bash
node scripts/verify-structural-contracts.cjs
# Or on any target repo:
node scripts/verify-structural-contracts.cjs --dir <target-repo-path>
```

### Phase 3: Runtime DOM Contract Assertions (Gap Variant C)
Playwright headless browser assertions (`tests/sdca-structural.spec.mjs`) asserting that lazy-mount containers contain expected root elements in the live browser DOM (`frameEl.contains(rootEl) === true`).
```bash
npm run test:sdca-structural
```

---

## Contract Schema (`.structural-contracts/<module>.json`)

```json
{
  "module": "module_name",
  "source_components": ["module_src/components/*.html"],
  "artifacts": {
    "standalone": "module-standalone.html",
    "fragment": "module-fragment.html"
  },
  "required_ids": [
    {
      "id": "containerFrame",
      "artifact": "fragment",
      "must_be_at_root": true,
      "comment": "Outer mount frame for host SPA"
    },
    {
      "id": "containerRoot",
      "artifact": "fragment",
      "must_be_descendant_of": "containerFrame",
      "comment": "Injected child root"
    }
  ],
  "runtime_selectors": [
    { "selector": "#containerFrame", "mounted_by": "mountTab()", "app_js_line": 120 }
  ]
}
```
