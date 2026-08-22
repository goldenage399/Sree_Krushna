---
pattern: monolithic-engine-port-css-scoping-gate
activation_tier: reference
canonical_source: task-dashboard
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: .agent/workflows/external-ui-redesign.md
    at: "Step 2: External CSS Adaptation & Scope Isolation"
triggers: []
guard: ""
portability: universal
porting_effort: low
---

# Monolithic Engine Port CSS Scoping Gate

**Category**: Design Gate / CSS Specificity & Isolation  
**Applies to**: Porting standalone web engines, canvas apps, or external UI modules into multi-tab SPAs  
**Origin**: 2026-08-22 (INC-086 — DO-PKOS Studio port from UG-Farmhouse into Sree Krushna Marriage OS)  
**Status**: VALIDATED  

---

## Pattern — Monolithic Engine Port CSS Scoping Gate

### Problem
When standalone canvas apps or full-screen studios (e.g. `swimlane-engine.css`, CAD viewers, Gantt engines) are ported into an existing multi-tab application, their CSS stylesheets often contain global root resets:
```css
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; font-family: -apple-system; font-size: 13px; }
.card-header { ... }
.btn { ... }
```
When imported directly into the parent SPA, these unscoped global rules override the parent site's fonts, scrollbars, card padding, and button themes across unrelated tabs and pages.

### Why it happens
Standalone tools assume they own the entire `window`, `html`, and `body`. In a multi-tab single page application, the host application shell owns global typography, root layout, and page scrollability.

### Solution
1. **Remove Global Tag Resets**:
   - Strip `*`, `html`, `body`, and `#app` rules from the engine's stylesheet.
2. **Strict Root Container Scoping**:
   - Prefix every selector in the engine stylesheet with the tab/container ID:
     `#tab-engine-id #engine-frame-id .selector`
3. **Local Custom Property Encapsulation**:
   - Declare engine theme variables inside the scoped frame container (`#tab-dopkos #dopkos-5zone-frame { ... }`), rather than globally on `:root`.
4. **Explicit Viewport Height Management**:
   - The active tab container MUST declare an explicit height (`height: calc(100vh - 140px); min-height: 720px; display: flex !important; flex-direction: column;`) so internal `flex: 1` scrollable viewports do not collapse to 0 height.

### Failure Mode
If this pattern is skipped or partially applied:
- The host application's body scrollbar disappears or locks up.
- Unrelated cards and buttons inherit engine-specific colors and micro font sizes.
- The engine's internal flex views collapse when switching between tabs.

### Task-Dashboard / Sree Krushna Instance
- Validated in `public/css/dopkos-engine.css` under `#tab-dopkos #dopkos-5zone-frame`.
- Incident reference: `docs/incidents/INC-086-monolithic-engine-port-css-scoping-and-sw-cache-bypass.md`.
