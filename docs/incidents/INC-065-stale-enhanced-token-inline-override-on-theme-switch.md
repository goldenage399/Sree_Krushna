# INC-065 — Stale `tokens/enhanced/` Values Overwrote Live Theme Colors on Every Explicit Theme Switch

**Date**: 2026-07-14
**Severity**: HIGH (every user who manually switches themes gets wrong colors — not a rare edge case, the primary interaction the feature exists for)
**Status**: RESOLVED (`src/contexts/ThemeContext.jsx`)
**Found during**: TASK-218 Phase 2 (TAP-001) precondition check for the M1b disposition decision, then confirmed live by user screenshot showing the sidebar active-item highlight rendering blue instead of sepia-brown

**Affected Components**: `src/contexts/ThemeContext.jsx`, all 7 themes (any theme reached via explicit `setTheme()`, i.e. any theme the user picks from the switcher rather than the default on first load)

---

## Summary

TASK-218 M1 (2026-07-12) retired one dead JS token tree (`tokens/generated/`) as unreachable. `tokens/enhanced/` — the tree M1 kept as canonical — was not fully retired, and turned out to still be **partially live**: its color *values* were never applied by the `themePreset` useMemo/effect path (that part of M1's reachability proof held), but a separate code path in the same file, `setTheme()`, independently lazy-loaded `tokens/enhanced/{theme}.enhanced.tokens.js` and applied its values as **inline styles** on every explicit theme switch.

Inline styles beat any non-`!important` stylesheet rule. Since `theme-tokens.css`'s `--theme-*` declarations carry no `!important`, this silently overwrote the correct, current values with stale ones generated 2025-07-22 — before the gradient background system and several color revisions existed. Confirmed divergent on every theme checked:

| Token | `theme-tokens.css` (correct, live) | `tokens/enhanced/*.js` (stale, injected) |
|---|---|---|
| light `--theme-bg` | `var(--theme-gradient-primary)` (gradient) | `#ffffff` (flat solid) |
| light `--theme-accent` | `#3B82F6` | `#2563eb` (different blue) |
| sepia `--theme-bg` | `var(--theme-gradient-primary)` (warm gradient) | `#ede7e1` (flat solid) |
| sepia `--theme-accent` | `#704214` (brown) | `#3d719d` (**blue** — the most visible divergence) |

**User-visible effect**: page load renders correctly (mount only calls `applyDataAttributeTheme`, which doesn't touch this path). The moment a user clicks a theme in `ThemeSwitcher.jsx`, `setTheme()` fires, and the sidebar active-item highlight, backgrounds, and other `--theme-accent`/`--theme-bg` consumers silently shift to the stale values — sepia's accent specifically flips from brown to blue, confirmed via user screenshot.

**Why it wasn't caught by M1's own verification**: M1's P89 visual pass tested that all 6 themes rendered *unchanged* after retiring the dead `tokens/generated/` tree — it did not specifically exercise "switch themes via the UI and compare against page-load rendering," so the divergence between "theme on load" and "theme after an explicit switch" was never on-screen at the same time to compare.

## Root cause

Two independent runtime paths existed in `ThemeContext.jsx` that both claimed to apply the active theme, doing genuinely different things:

1. **`themePreset` useMemo + its effect** (lines ~278–319 pre-fix): loads `tokens/enhanced/` via `createEnhancedTheme()`, checks `variableCount >= 85` to pick a branch, and for the branch that's *always* taken in production (`architecture === 'four-tier-enhanced'`), calls `applyDataAttributeTheme()` — attribute only, no values applied. This part was correctly identified as dead-in-practice by the M1b finding.
2. **`setTheme()`** (lines ~322–355 pre-fix): a *second*, independent lazy-load of the same `tokens/enhanced/` tree (via a separate `loadThemeTokensAsync` + cache, not through `createEnhancedTheme`), which **did** call `applyCSSVariables()` on the result — writing real inline `--theme-*` values.

Nobody had traced both paths together. Investigating path 1 (for the M1b architecture finding) looked like it explained "how theming works" completely; path 2 was a second, separately-reachable mechanism doing the opposite of what path 1 did, triggered only by the explicit-switch interaction rather than by initial render.

## Fix

`setTheme()` no longer lazy-loads or applies `tokens/enhanced/` values. It now only sets the `data-theme` attribute (same mechanism as page load and `ThemeErrorBoundary`'s fallback), which is sufficient — `theme-tokens.css`'s `[data-theme=...]` cascade renders every theme correctly on its own.

```js
// before: setTheme() lazy-loaded tokens/enhanced/{theme}.enhanced.tokens.js and applied
// its (stale) values as inline styles, overwriting theme-tokens.css's correct values.
const tokens = await loadThemeTokensAsync(validTheme);
if (supportsCSSVariables && tokens) {
  applyCSSVariables({ ...(tokens.variables || {}), ...(tokens.theme || {}) });
}

// after: attribute only — theme-tokens.css does the rest.
applyDataAttributeTheme(validTheme);
```

Also removed the now-orphaned `loadThemeTokensAsync`/`themeTokenCache`/`TOKEN_KEY_MAP` machinery that existed solely to serve the removed call, and the two `themeTokenCacheSize` references in `debugInfo`/`contextValue` that read from the now-deleted cache. Build verified clean.

**Not in scope of this fix**: `tokens/enhanced/` and `generate-enhanced-tokens.js` themselves still exist and are still imported by the `themePreset` useMemo path (dead-in-practice for values, per M1b, but not yet removed). That full retirement is still the open (a)/(b)/(c) disposition call tracked in `09_CONSOLIDATION_MANIFEST.md` M1b — this incident strengthens the case for (a), since the tree just proved capable of causing real bugs, not merely being inert weight.

## Structural Invariant

> **A "this path is dead" finding must be verified against every reachable path that touches the same data, not just the one path under investigation.** M1b's trace of the `themePreset` useMemo correctly proved *that* path inert — but treated it as the complete story for "how does the app apply theme values," when a second, independently-reachable function (`setTheme`) in the same file used the same underlying data differently. The lesson isn't "verify harder" in the abstract — it's: when a file has multiple functions that each independently import the same suspect module, trace *all* of them before concluding the module is inert, not just the one the current investigation happened to start from.

## Prevention

- Before concluding any token/theme source is "dead" or "inert," grep every function in the consuming file for imports of that source — not just the one under active investigation. `ThemeContext.jsx` had two separate `tokens/enhanced/` import sites (`createEnhancedTheme` in the module-level import, `loadThemeTokensAsync`'s dynamic `import()`) — a plain grep for `tokens/enhanced` (not just for the specific function already being traced) would have surfaced both immediately.
- This is a second illustration of the same lesson INC-064 already logged for CSS (a defect pattern found on one variant isn't fixed until checked on every sibling) — here applied to runtime code paths rather than CSS selectors.

## Related

- TASK-218 M1 (`09_CONSOLIDATION_MANIFEST.md`) — established the reachability-proof pattern this incident extends; retired the *other* dead JS tree (`tokens/generated/`).
- M1b (`09_CONSOLIDATION_MANIFEST.md`) — the architecture finding that led to tracing `ThemeContext.jsx` in the first place; this incident is what that tracing turned up once `setTheme()` was included.
- [INC-064](INC-064-secondary-button-suffix-mismatch-recurrence.md) — same structural lesson (check every sibling code path/variant, not just the one that triggered the investigation), different layer (CSS selector vs. runtime function).
