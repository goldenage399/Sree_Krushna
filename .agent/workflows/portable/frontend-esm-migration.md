---
pattern: esm-globals-migration
origin_cap: CAP-033
tier: universal
applies_to:
  - "any JS project with implicit globals sharing"
  - "Vite/Rollup/Webpack projects using concat-modules anti-pattern"
prereqs:
  - "Node.js environment"
  - "Bundler (e.g. Vite) already installed"
porting_effort: medium
canonical_source: docs/adr/ADR-006-esm-over-implicit-globals.md
last_reviewed: 2026-04-18
description: "Transitioning from concat-build to native ESM."
---

# Portable Workflow: Frontend ESM Migration
## (Implicit Globals → Explicit import/export)

**Applicable when:** A codebase uses a concat, extract, or bundle-shim script to merge
JS modules into one file before the real bundler runs, because individual modules share
variables (globals) without explicit `export`/`import` statements.

**Capsicum instance:** CAP-033 (2026-04-18). Full audit in `UserCreated/Discussion Threads/ESMMigration/`.

---

## Step 1 — Audit the concat script

Read the concat script. Record:
- The **ordered list** of source modules it concatenates
- The **output file** it produces (e.g. `raw-logic.js`)
- Any **comments** about why concat is used (they tell you what shared-scope deps exist)

---

## Step 2 — Audit each source module

For every module in the concat list:
- List every **variable/function it declares** that any other module calls (implicit exports)
- List every **variable/function it calls** that is declared elsewhere (implicit imports)
- Note **module-level side effects** (immediate `if` blocks, `window.*` assignments, `localStorage` reads)

Produce a **(provider, symbol, consumer)** triple for every cross-module dependency found.

---

## Step 3 — Identify the special cases

Before touching any code, find:

**a) External globals** (symbols used in concat modules but NOT defined in any concat module)
Common: `window.apiPost`, `lucide`, `google`. These come from the entry point (e.g. `app.js`)
or from CDN script tags. They need a different resolution path than intra-concat symbols.

**b) Circular dependencies** (module A calls a symbol from module B, AND module B calls a symbol from module A)
These are invisible in concat but become hard errors in ESM. Must be broken structurally before migrating the pair.

**c) Reverse dependencies** (module A calls a symbol from module B, but B is loaded AFTER A in concat order)
These work in concat (call-time resolution) but would fail as static imports in ESM (because import order matters for initialization). Must be resolved by moving the symbol or creating a shared module.

**d) Module-level side effects that read globals** (e.g. `if (localStorage.getItem('x')) { window.Y = true; }`)
These fire at module load time. In ESM the load order is determined by import graph topology, not concat order. Ensure the side effect's dependencies are satisfied at the time the module initializes.

---

## Step 4 — Count cross-references and estimate effort

Count distinct (provider, consumer) symbol pairs:
- **< 20 pairs:** Low effort — migrate all at once
- **20–60 pairs:** Medium effort — phase by coupling
- **60+ pairs:** High effort — strict phase ordering, structural refactors needed first

---

## Step 5 — Resolve special cases (before any module migration)

**External globals (e.g. apiPost):**
Option A: Create a singleton module (`api-client.js`) that owns the function. Entry point wires it (e.g. `setIdToken`). All modules import from the singleton.
Option B: Keep as `window.*` and reference via `window.apiPost(...)` everywhere. Simpler but not pure ESM.
Option A is recommended for functions used in 3+ modules.

**Circular dependencies:**
Extract the shared symbol(s) into a new `*-shared.js` module that both circular partners import from. Neither partner imports from the other.

**Reverse dependencies:**
Move the symbol to a module that is already a dependency of the caller, or create a new lower-level module for it.

---

## Step 6 — Determine safe migration order

Rule: **Leaf nodes first** (modules with no incoming cross-refs from other concat modules).
General ordering:

1. Pure state/constants modules (no imports, only exports)
2. Pure utility modules (no imports, only exports)
3. Cache/data layer (imports from 1+2)
4. Render layer (imports from 1+2, no mutation)
5. API/data-fetch layer (imports from 1+2+3, calls render)
6. Action/write layer (imports from 1+2+3+5)
7. Initialization/boot layer (imports from all above)
8. Admin sub-modules (bottom-up, innermost first)
9. Admin root (imports from all sub-modules)
10. globals.js / window barrel (imports from all, exports nothing)
11. Entry point (app.js): replace `import './bundle.js'` with individual imports

---

## Step 7 — Migrate each module (one at a time, in order)

For each module:
1. Add `import { X } from './provider.js'` for each consumed symbol
2. Add `export` keyword to each declared symbol consumed by other modules
3. Remove any `window.*` read that is now a proper import
4. Keep `window.*` writes only in the globals barrel
5. Run `npm run build` — confirm no new errors before proceeding to the next module

Do NOT migrate multiple modules at once unless you are certain they have no inter-dependency.

---

## Step 8 — Update the entry point

Replace the single-file import with individual module imports in the order from Step 6.
Wire any singleton initialization (e.g. `setIdToken` for auth-gated API functions).

---

## Step 9 — Update npm scripts

Remove the `node concat-script.js &&` prefix from `dev` and `build` scripts.
The generated bundle file (e.g. `raw-logic.js`) is now stale — delete it.

---

## Step 10 — Delete and verify

1. Delete the concat script
2. Delete the generated bundle file from git (`git rm frontend/src/raw-logic.js`)
3. Add the generated file to `.gitignore` as a safety net
4. Run full test suite (`npm test`)
5. Run smoke test: exercise every major user path in a browser

---

## Gotchas

| Gotcha | Notes |
|--------|-------|
| HTML `onclick=` attributes need `window.*` | Keep a globals barrel during migration. Full `addEventListener` migration is a separate scope. |
| Mutable shared state (objects like `App`) | Export the object by reference — safe. Property mutations on an exported object are visible to all importers. |
| Circular deps silently pass `npm run build` | Use `madge --circular src/` or Rollup's built-in circular dep warning to detect them before they bite. |
| Mid-migration stale bundle | After removing the bundle, any tool that still references it (tests, `preview` script) will fail. Update all references in the same PR. |
| Module-level side effects | If a module runs code at the top level (not inside a function), that code runs when the module is first imported. Make sure its dependencies are in the import graph before it. |
| ESM modules are always strict mode | Bare global names don't auto-resolve from `window` in strict mode. `apiPost()` ≠ `window.apiPost()` in a pure ESM context — the singleton approach is required. |
