---
pattern: sub-engine-shadowing-and-tab-reconciliation
activation_tier: reference
canonical_source: task-dashboard
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: .agent/workflows/ssot-reconciliation.md
    at: "Step 4: Authority Resolution"
triggers: []
guard: ""
portability: universal
porting_effort: low
---

# Sub-Engine Shadowing and Tab Reconciliation

**Category**: Architecture Invariant / Module Boundary  
**Applies to**: Web SPAs with dedicated sub-engines mounted across tab views  
**Origin**: 2026-08-22 (INC-086 — Legacy DO-PKOS rendering function in app.js shadowing dopkos-engine.js)  
**Status**: VALIDATED  

---

## Pattern — Sub-Engine Shadowing and Tab Reconciliation

### Problem
When a specialized sub-engine (e.g. DAG Topology Studio, 3D Canvas, Financial Ledger Engine) is extracted into its own standalone script file (e.g. `dopkos-engine.js`), legacy inline copies of the rendering logic often linger inside the main application shell script (`app.js`).
When the user navigates between tabs, the shell script invokes its own internal function instead of the standalone module's exported window binding. This leads to silent regressions where switching away from a tab and returning to it re-renders the old legacy interface.

### Why it happens
1. The script execution order in `index.html` loads the sub-engine first and `app.js` second.
2. `app.js` declares a local `function renderStudio()` that shadows `window.renderStudio` or executes prior to delegating.
3. Tab switching event listeners (`switchTab()`) call the local function by default.

### Solution
1. **Single Source of Module Authority**:
   - The standalone module MUST own 100% of the sub-engine state, data transformation, and DOM rendering.
2. **Purge All Duplicate Logic in Shell**:
   - Delete all duplicate functions, mock arrays, and local view state from `app.js`.
3. **Explicit Delegation Contract in Navigation**:
   - `app.js` must exclusively delegate rendering via global export guards:
     ```javascript
     if (targetId === 'tab-dopkos' && window.renderDoPkosStudio) {
       window.renderDoPkosStudio();
     } else if (targetId === 'tab-planning' && window.renderPlanningSuite) {
       window.renderPlanningSuite();
     }
     ```

### Failure Mode
Retaining duplicate functions causes:
- Inconsistent behavior between first page load and subsequent tab clicks.
- "Ghost Views" where user edits mysteriously reset to older layouts.
- Split-brain state where status changes in one view are lost in another.

### Task-Dashboard / Sree Krushna Instance
- Validated in `public/js/app.js` (purged 1,206 duplicate lines) and `public/js/modules/dopkos-engine.js`.
- Incident reference: `docs/incidents/INC-086-monolithic-engine-port-css-scoping-and-sw-cache-bypass.md`.
