---
pattern: dynamic-fragment-lifecycle-and-modal-dismiss-contract
activation_tier: guarded
guard: "npm run verify:ui-lifecycle"
canonical_source: task-dashboard / sree-krushna
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: 00_GOVERNANCE/decisions/DEC-003_dynamic_ui_lifecycle_and_modal_dismissibility_contract.md
    at: "Downstream Artifacts"
triggers:
  - "mount.*Tab"
  - "openCommentsDrawer"
  - "openModal"
  - "closeDrawer"
  - "skCommentsDrawer"
portability: universal
porting_effort: low
---

# Pattern: Dynamic Fragment Lifecycle & 3-Trigger Modal Dismissibility Contract

**Standard ID**: `STD-UI-LIFECYCLE-001` / `DEC-003`  
**Category**: Architecture / Release Gate / UI Component Integrity  
**Origin**: Sree Krushna Incident DEC-003 / Task-Dashboard INC-072  
**Status**: VALIDATED  

---

## 1. Problem Statement
In Single-Page Applications (SPAs) employing modular dynamic component fragment architectures (SDCA), UI fragments and scripts are fetched and inserted after the initial document has parsed (`document.readyState === 'complete'`). This causes two critical failure modes:
1. **Dynamic Script Race Condition**: Browsers load dynamically appended `<script src="...">` elements asynchronously, while subsequent inline `<script>` tags execute immediately, crashing on missing global symbols (`TypeError: Cannot read properties of undefined`).
2. **Zombie `DOMContentLoaded` Listeners**: Components relying on `DOMContentLoaded` fail to attach click and dismiss event listeners because the event has already fired. Modals and slide-over drawers become completely unclosable.

---

## 2. The 4 Mandatory Invariants

### INV-LIFECYCLE-01: Dynamic Script Tag Sequencing Contract
Any SPA tab mount function that extracts and injects `<script>` tags from an HTML fragment MUST await external script loading before executing dependent code:

```javascript
const scripts = doc.querySelectorAll('script');
for (const oldScript of scripts) {
  await new Promise((resolve) => {
    const newScript = document.createElement('script');
    if (oldScript.type) newScript.type = oldScript.type;
    if (oldScript.src) {
      newScript.src = oldScript.src;
      newScript.onload = () => resolve();
      newScript.onerror = (e) => {
        console.warn('Script failed to load:', oldScript.src, e);
        resolve();
      };
      document.body.appendChild(newScript);
    } else {
      newScript.textContent = oldScript.textContent;
      document.body.appendChild(newScript);
      resolve();
    }
  });
}
```

### INV-LIFECYCLE-02: Zombie DOMContentLoaded Prohibition
Components MUST NOT rely on naked `DOMContentLoaded` event listeners. They MUST guard with readyState checks and re-bind defensively upon opening:

```javascript
_initDomListeners() {
  const bind = () => this._bindDomEvents();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind(); // Immediate execution if DOM is already ready
  }
}
```

### INV-LIFECYCLE-03: 3-Trigger Modal/Drawer Dismissibility Contract (WAI-ARIA 1.2)
All interactive overlays (modals, bottom sheets, slide-over drawers) MUST support all three dismiss triggers:
1. **Explicit Close Button**: Element with click listener and declarative `onclick="closeDrawer()"`.
2. **Backdrop Click**: Clicking outside the active panel dismisses the overlay.
3. **Escape Key Press**: Universal `keydown` listener listening for `e.key === 'Escape'`.
4. **Programmatic Global Hook**: Exported idempotent function on `window` (e.g. `window.closeCommentsDrawer()`).

### INV-LIFECYCLE-04: Sandboxed Interactive State Simulation
Pre-flight suites (`scripts/verify-ui-lifecycle.cjs`) MUST execute a headless state machine simulation validating:
`Closed -> Open -> Trigger 1 Close -> Closed -> Open -> Trigger 2 Close -> Closed -> Open -> Trigger 3 Close -> Closed`.

---

## 3. Automated Pre-Flight Gate
Enforced repository-wide via:
```bash
npm run verify:ui-lifecycle
npm run verify:deployment
```
Layer 10 of `scripts/verify-deployment.cjs` enforces 100% compliance before any deployment or release.
