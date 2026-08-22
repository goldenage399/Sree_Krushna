---
pattern: build-safety-guards
origin_cap: CAP-036
tier: universal
applies_to:
  - "any Vite + ESM frontend"
  - "any bundled JS project with cross-module wiring"
  - "GAS + Firebase hybrid SPA"
prereqs:
  - "Project uses native ES Modules (import/export)"
  - "Vite (or Rollup) as bundler"
  - "Jest installed (or equivalent test runner)"
porting_effort: low
canonical_source: docs/prd/features/CAP-036-build-safety-guards/PRD.md
last_reviewed: 2026-04-19
description: "Build-time validation and Unicode PS guards."
---

# Portable Pattern: Build-Time Safety Guards

## Why This Exists

During any ESM migration or modularisation effort, three classes of wiring bug
recur reliably. All three are invisible to the bundler by default and only
surface as `ReferenceError` crashes in the browser:

| Bug class | Example | Default bundler behaviour |
|-----------|---------|--------------------------|
| Missing `export` | `function foo(){}` used by importer | Treated as global — no warning |
| Commented-out import | `// import { foo } from './bar'` + `foo()` call | Same — silent global assumption |
| Exported-but-never-wired | `export function setIdToken()` never called | Passes lint, passes build, fails at runtime |

This pattern closes all three ESM wiring gaps with three complementary layers, and adds a final platform-level guard against deployment failures.

---

## The Zero-Unicode Guard (Windows/PowerShell)

**Constraint:** NEVER use Unicode characters (emojis, box drawing, localized characters) in PowerShell scripts (`.ps1` files) or their `Write-Host` outputs.
**Why:** PowerShell on Windows handles text encoding inconsistently. UTF-8 files containing Unicode without a BOM (Byte Order Mark) are often misread, leading to fatal `UnexpectedToken` parser errors during automated deployment scripts.
**Standard:** Use standard ASCII text and basic characters (e.g., `[+]`, `[ERROR]`, `===`) for all script logging.

---

## The Three Layers

```
Layer 1: ESLint (no-undef + import/named)
  → catches: undefined bare references, missing named imports
  → when: prepended to build script

Layer 2: Rollup onwarn escalation
  → catches: MISSING_EXPORT, UNRESOLVED_IMPORT at bundle time
  → when: during vite build

Layer 3: Jest wiring manifest
  → catches: exports that exist but are never wired to their callers
  → when: npm test
```

---

## Setup (one-time, ~15 minutes)

### Step 1 — Install ESLint

```bash
npm install -D eslint @eslint/js eslint-plugin-import globals
```

### Step 2 — Create `eslint.config.js`

```js
import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    plugins: { import: importPlugin },
    languageOptions: {
      globals: {
        ...globals.browser,
        // Add CDN-injected bare globals for this project, e.g.:
        // google: 'readonly',   // Google Charts
        // lucide: 'readonly',   // Lucide Icons
      }
    },
    rules: {
      'no-undef': 'error',
      'import/named': 'error',
      'import/no-unresolved': 'off'  // keep off if using CDN/aliased imports
    }
  }
];
```

> **Identifying your globals:** Run `grep -r "typeof \w\+ !== 'undefined'" src/` and
> `grep -rn "^\w\+\." src/ | grep -v "^.*import\|window\.\|this\."` to find bare
> global references. Only add genuinely CDN-injected globals — standard Web APIs
> are covered by `globals.browser`.

### Step 3 — Update `package.json` scripts

```json
"lint":  "eslint src/**/*.js --max-warnings 0",
"build": "npm run lint && vite build"
```

### Step 4 — Add Rollup `onwarn` to `vite.config.js`

```js
build: {
  rollupOptions: {
    onwarn(warning, warn) {
      // Suppress known-safe warnings
      if (['THIS_IS_UNDEFINED', 'CIRCULAR_DEPENDENCY'].includes(warning.code)) return;
      // Escalate wiring errors to build failures
      if (['MISSING_EXPORT', 'UNRESOLVED_IMPORT'].includes(warning.code)) {
        throw new Error(warning.message);
      }
      warn(warning);
    }
  }
}
```

> Adjust the suppression list to match your project's expected warnings.

### Step 5 — Create the wiring manifest test

Create `tests/boot.smoke.test.js` (or equivalent path):

```js
/**
 * Wiring manifest — add an entry when a new cross-module export is wired.
 * Each entry asserts the named export exists and is a function.
 *
 * WHEN TO ADD AN ENTRY:
 *   - A module exports a function that must be called by another module at boot
 *   - The export is the "glue" between two otherwise-independent modules
 *   - The bug class is "exported-but-never-wired" (passes lint, fails at runtime)
 *
 * WHEN NOT TO ADD AN ENTRY:
 *   - Simple utility functions used inline — ESLint import/named covers those
 *   - Functions only called from HTML onclick — not a wiring gap
 */
const WIRING_MANIFEST = [
  // { module: '../src/api-client.js', export: 'setIdToken' },
  // Add your project's critical cross-module wiring points here
];

describe('Module wiring manifest', () => {
  test.each(WIRING_MANIFEST)(
    '$export is exported from $module',
    async ({ module, export: exportName }) => {
      const mod = await import(module);
      expect(typeof mod[exportName]).toBe('function');
    }
  );
});
```

---

## Identifying Your Wiring Manifest Entries

A function belongs in the manifest when ALL of the following are true:

1. It is `export`ed from module A
2. Module B must call it at boot/init time for the system to work correctly
3. If the call is missing, the system silently degrades (no immediate crash, no lint error)

Classic examples:
- Auth token injection: `setIdToken(token)` must be called after auth resolves
- Icon library init: `lucide.createIcons()` must be called after DOM is ready
- Feature flag bootstrap: `initFlags(config)` must be called before any flag check

---

## Maintenance Rules

| Event | Action |
|-------|--------|
| New cross-module wiring added | Add entry to `WIRING_MANIFEST` in the same PR |
| Module renamed or export renamed | Update manifest entry — test will fail as a reminder |
| New CDN global added to project | Add to `eslint.config.js` globals |
| New Rollup warning appears in build | Decide: suppress (add to ignore list) or fix (remove the warning's cause) |

---

## What This Does NOT Catch

- **Runtime logic bugs** — the manifest only checks that exports exist, not that they behave correctly
- **Import/export of non-function values** — extend the test if you need to assert on objects or constants
- **Circular dependencies** — suppressed by default; address separately if they cause issues
- **TypeScript type errors** — consider a `tsc --noEmit` layer if the project migrates to TS

---

## Best Practices Checklist (no-brainer setup for any new codebase)

- [ ] ESLint `no-undef` + `import/named` installed and wired into `build` script
- [ ] Rollup `onwarn` escalates MISSING_EXPORT and UNRESOLVED_IMPORT
- [ ] Wiring manifest test exists with at least one entry per auth/init wiring point
- [ ] CDN globals declared explicitly in `eslint.config.js`
- [ ] `import/no-unresolved` OFF if project uses CDN or aliased imports
- [ ] Manifest entries updated in same PR as the wiring they describe
