# INC-094 — Duplicate URL Parameter Variable Re-declaration in Modular Controller Script and Validation via SDCA Pre-Emit Syntax Gate

**Incident ID**: `INC-094`  
**Date**: `2026-09-24`  
**Severity**: Medium (Build-Time Caught Syntax Defect / Lexical Scope Shadowing)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Governing Standard**: `STD-MOD-COMP-001`, `INV-SDCA-003`, `P-COLLAB-VISUAL-INTAKE-001`  
**Affected Components**: `shopping_src/scripts/controller.js`, `shopping_src/build.cjs`  
**Related Patterns**: `.agent/patterns/sdca-pre-emit-syntax-gate.md`, `.agent/patterns/collab-visual-intake-and-deep-link-sharing.md`  

---

## Architectural Surface Mapping

1. **UI Surface**: The shopping registry and shopping fragment controllers process URL deep-links (`?cluster=...&item=...&option=...`). A syntax error in the script would cause the entire IIFE controller to fail evaluation, rendering the catalog in a dormant, non-interactive state.
2. **Data Surface**: No data corruption in Firestore or `shopping-data.js`.
3. **Reactive Surface**: Event listeners for filters, search, modal toggles, and option pills depend entirely on controller execution. Failure of script execution halts all client interactions.
4. **Service Surface**: No backend cloud service impact.
5. **Module Surface**: `shopping_src/scripts/controller.js` contained duplicate lexical variable declarations (`const paramOption`) across sibling conditional blocks within the deep-link handler function.
6. **Governance Surface**: Validated the effectiveness of `INV-SDCA-003` (Automated Pre-Emit Syntax Gate `node -c`).

---

## 1. Executive Summary & Symptom

During the implementation of Phase 5 collaborative deep-linking in `shopping_src/scripts/controller.js`, URL parameter parsing logic was added to handle both cluster-level navigation and item-level option selection.

When executing `node shopping_src/build.cjs` to compile the distribution artifacts (`shopping-registry.html` and `shopping-fragment.html`), the SDCA build script failed immediately with exit code 1:
```text
SyntaxError: Identifier 'paramOption' has already been declared
    at shopping_src/build.cjs:181
```

Because of the mandatory pre-emit syntax gate (`node -c <assembled_script>`) implemented in `shopping_src/build.cjs`, the compiler halted before writing any bytes to `shopping-registry.html`, `shopping-fragment.html`, or `public/`.

---

## 2. Root Cause Analysis & Diagnostic Steps

### Step 1: Lexical Scope Inspection
In `shopping_src/scripts/controller.js`, inside the deep-link initialization routine:
```javascript
// Scope Block A: Cluster Resolution
if (paramCluster) {
  const paramOption = params.get('option'); // Line 144
  ...
}

// Scope Block B: Direct Item Deep-Link Resolution
if (paramItem) {
  const paramOption = params.get('option'); // Line 181 (DUPLICATE DECLARATION in same scope)
  ...
}
```
Because both `if` blocks were contained within the same lexical function scope rather than isolated block-scoped closures, the JavaScript engine parser threw `SyntaxError: Identifier 'paramOption' has already been declared` during code evaluation.

### Step 2: Escape Analysis
- **Did the defect reach production?**
  No. It was caught 100% locally at compile time by the pre-emit syntax gate.
- **Why did it occur?**
  Linear addition of parameter extraction logic across different functional concerns (cluster deep-links vs item deep-links) without checking prior variable declarations in the enclosing scope.

---

## 3. Immediate Resolution & Code Correction

The duplicate declaration was eliminated by extracting URL parameter values once at the top of the routine or referencing the existing in-scope variable:

```javascript
// Cleaned Parameter Extraction
const paramCluster = params.get('cluster');
const paramItem = params.get('item');
const paramOption = params.get('option');
const paramView = params.get('view');
```

Running `node shopping_src/build.cjs` immediately passed syntax verification, generating both standalone and scoped distribution artifacts with 100% byte parity.

---

## 4. Preventive Guardrails & Lessons Learned

1. **Defense-in-Depth via SDCA Pre-Emit Syntax Gate (`INV-SDCA-003`)**:
   This incident demonstrates the value of the pre-emit `node -c` gate. Without this automated check, broken JavaScript could have been embedded into HTML distribution files and deployed to production.
2. **Unified URL Parameter Extraction**:
   Controllers that handle complex deep-linking must extract and validate query parameters in a centralized, structured object at the top of the handler rather than ad-hoc queries inside nested conditionals.
3. **Automated Unit & Smoke Gate**:
   `scripts/test-shopping-registry.cjs` verifies that generated scripts are syntactically valid and all option pod methods are callable.

---

## 5. Certification

- **Build Gate**: `npm run verify:modular-architecture` passes (45/45).
- **Test Gate**: `npm run test:shopping` passes (6/6 suites, 100% green).
- **Governance Gate**: `npm run verify:governance-wiring` passes (0 missing).
