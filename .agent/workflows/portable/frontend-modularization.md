---
pattern: frontend-modularization
origin_cap: CAP-020
tier: universal
applies_to:
  - "any monolithic frontend"
  - "legacy projects with HTML + CSS + JS in a single file"
prereqs:
  - "Vite or similar bundler installed"
porting_effort: high
canonical_source: enhancement-notes/CAP-020-Frontend-Pipeline-Decoupling.md
last_reviewed: 2026-04-18
description: "Splitting monolithic UI and encapsulating components."
---

# Portable Workflow: Frontend Modularization

**Context:** The project has a monolithic frontend (often a single `index.html` with thousands of lines of JS/CSS) or a pipeline that obscures the true Source of Truth. This workflow decouples the HTML skeleton from its logic and modularizes the JS.

---

## Step 1 — Audit and Extraction

1. **Skeleton Extraction**: Identify the HTML structure that rarely changes. Extract it into a hand-authored `index.html`.
2. **Logic Extraction**: Identify all `<script>` blocks. Extract them into a dedicated source directory (e.g., `frontend/src/`).
3. **Style Extraction**: Extract all `<style>` blocks into a standalone CSS file.

---

## Step 2 — Canonical Module Layout

Split the monolithic JS into functional modules. The recommended baseline layout is:

| Module | Responsibility |
|---|---|
| `state.js` | Shared constants, application state object, config |
| `utils.js` | Generic helper functions (formatting, capitalization) |
| `cache.js` | Client-side cache layer (TTL, SWR logic) |
| `api.js` | All read functions (network calls) |
| `actions.js` | All mutation functions (user-triggered writes) |
| `render.js` | DOM-building functions (keep UI logic separate) |
| `init.js` | Boot sequence, initial event listeners |
| `globals.js` | Export barrel for `window.*` assignments (legacy support) |
| `app.js` | Entry point, auth, and top-level wiring |

---

## Step 3 — Protocol Enforcement

Apply a hard limit on file size to prevent the new modules from becoming monoliths.
**Standard:** No file > 500 lines. If a module crosses this threshold, it MUST be split (e.g., `render.js` → `render-tasks.js` + `render-admin.js`).

---

## Step 4 — Build Pipeline Integration

1. **Bundler Setup**: Initialize Vite or a similar tool in the `frontend/` directory.
2. **Entry Point Wiring**: Ensure `app.js` imports all required modules.
3. **Script Update**: Point the HTML `<script>` tag to the entry point module (`<script type="module" src="/src/app.js"></script>`).

---

## Step 5 — Component Encapsulation (PIO-065 Standard)

**Constraint:** Reusable UI components (like Modals or Widgets) must encapsulate their own structure, behavior, and **styles**.
**Why:** Relying on a global `index.css` for component styling creates "Ghost Styles" (components that render broken HTML when ported to a new repository). 

**Standard Pattern:**
Use an internal `_injectStyles()` method when initializing the component to guarantee styling autonomy.

```javascript
class ReusableWidget {
  constructor(containerId) {
    this._injectStyles();
    this.render(containerId);
  }
  
  _injectStyles() {
    if (document.getElementById('widget-styles')) return;
    const style = document.createElement('style');
    style.id = 'widget-styles';
    style.textContent = `.widget { display: flex; }`;
    document.head.appendChild(style);
  }
}
```

---

## Step 6 — Verification

1. **Parity Check**: Verify that every function from the original monolith exists in a new module.
2. **Build Test**: Run the production build. Verify that all modules are correctly tree-shaken and bundled.
3. **Smoke Test**: Exercise all major UI paths in the browser.

---

## Gotchas

- **Implicit Globals**: If the project relied on implicit globals, you MUST convert them to explicit imports/exports (see `frontend-esm-migration.md`).
- **Circular Dependencies**: Splitting a monolith often reveals circular dependencies. Resolve them by creating a `*-shared.js` module.
- **Event Listeners**: Ensure that event listeners attached in `init.js` are not fired multiple times if modules are re-imported.
