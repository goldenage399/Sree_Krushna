# INC-066 — Root-Level Button Token Defaults Masked Theme-Aware Fallbacks in 5 of 7 Themes

**Date**: 2026-07-14
**Severity**: MEDIUM-HIGH (every primary/secondary button's hover/active state, and light/dim-dark/grayscale/velvet-dark/ambient's primary button base color, rendered with a generic off-palette blue-gray instead of the theme's own palette)
**Status**: RESOLVED (`src/styles/theme-tokens.css`)
**Found during**: User-driven diagnosis of a single reported symptom ("Filter Overdue" button hovers bluish in Sepia) — traced with `prompt-clarity`-scoped investigation, not assumed

**Affected Components**: `src/styles/theme-tokens.css`, every `.theme-button-primary`/`.theme-button-secondary` consumer, 5 of 7 themes (`light`, `dim-dark`, `grayscale`, `velvet-dark`, `ambient`)

---

## Summary

The user reported one concrete symptom: `TaskDashboardView.jsx`'s "Filter Overdue" button (`.theme-button-secondary`) showed a blue-gray hover in the Sepia theme (the deployment-locked default). Diagnosis traced this to `theme-tokens.css:138-143`, a `:root`-level `/* Enhanced Button Tokens */` block:

```css
:root {
  --theme-button-primary: #3b82f6;         /* Tailwind blue-500 */
  --theme-button-primary-hover: #2563eb;
  --theme-button-primary-active: #1e40af;
  --theme-button-secondary: #f1f5f9;
  --theme-button-secondary-hover: #e2e8f0; /* Tailwind slate-200 — reads as "blue-gray" */
  --theme-button-secondary-active: #cbd5e1;
}
```

These are generic, pre-theming-system defaults. Every consumption site (`theme-utilities.css`) was already written to prefer a theme-aware value — `var(--theme-button-primary, var(--theme-accent))` for primary, `var(--theme-button-secondary-hover, color-mix(in srgb, var(--theme-button-secondary-background) 85%, var(--theme-fg) 15%))` for secondary hover/active — but a `:root` definition of the *first* name in each `var()` chain **always wins** over the fallback, regardless of which theme is active, because `:root` and `[data-theme="x"]` target the same element (`<html>`) at equal specificity; only a later-loading `[data-theme]` block with its own declaration can override it via source order. Only `dark` and `sepia` had such overrides (and even those were incomplete — neither overrode `--theme-button-secondary-active`). The other 5 themes had no competing declaration, so the generic `:root` blue/slate always rendered instead of the theme's own accent/background-derived color — for the **entire lifetime of the button hover/active states**, not just Sepia.

**User-visible effect**: in `light`, `dim-dark`, `grayscale`, `velvet-dark`, and `ambient`, every `.theme-button-primary`'s base color, and every `.theme-button-primary`/`.theme-button-secondary`'s hover/active color, rendered as a generic Tailwind blue/slate instead of the theme's own accent or derived tone. In `dark`/`sepia`, the base/hover states were correctly hand-tuned, but `-secondary-active` still leaked the generic slate in every theme including those two.

## Root cause

Classic override-shadowing: a legacy default block, written before the per-theme token system existed, was never removed once per-theme `--theme-accent`/`--theme-button-secondary-background` tokens (and the `color-mix()` derivation formula built on top of them) became the actual design system. The defaults weren't wrong when written — they became a silent trap the moment the smarter, theme-aware fallback chains were added downstream and nobody checked whether the upstream defaults were still shadowing them.

## Fix

Removed the entire `:root` block (6 declarations). Each consumption site's own fallback chain now activates correctly per theme:

- `--theme-button-primary{,-hover,-active}` → `var(--theme-accent{,-hover})` — already fully defined across all 7 themes.
- `--theme-button-secondary{,-hover,-active}` → `color-mix(in srgb, var(--theme-button-secondary-background) 85%, var(--theme-fg) 15%)` (hover) / a similar formula for active — both already fully defined across all 7 themes (the `-background`/`-text` companions from `INC-064`).

`dark`/`sepia`'s own `[data-theme]` overrides are untouched — they still win via source order — so their hand-tuned values are unaffected; only the blanket default that was shadowing the *other 5 themes* is gone.

**Side effect, confirmed correct**: `dark`'s previously-uncovered `--theme-button-secondary-active` now also correctly falls through to the `color-mix()` formula instead of the generic slate — a second small bug fixed for free by the same removal, since it shared the same root cause.

## New token-map "phantoms" — verified false positives, not new bugs

Removing the `:root` block makes `.cache/token-map.json` flag `--theme-button-primary`, `-hover`, `-active`, and bare `--theme-button-secondary` as phantoms (defined only in `dark`/`sepia`, consumed elsewhere). Verified each is a false positive of the tool's own documented kind (see `scripts/cache-builders/build-token-map.cjs`'s "KNOWN LIMITATION" note): every consumption site reads these as the *first* link in a `var(x, fallback)` chain whose fallback is itself fully defined in all 7 themes — the token map doesn't see past the first fallback. Not a regression; this is the intended shape of the fix. Documented here rather than silently absorbed into the raw count (same discipline as the M1b/M3b phantom dispositions in `enhancement-notes/TASK-218-Token-Architecture-Stabilization-Program/09_CONSOLIDATION_MANIFEST.md`).

## Structural Invariant

> **A `:root`-level default for a token that has per-theme overrides elsewhere is not neutral — it is a standing shadow over every theme that doesn't (yet, or ever) get its own override.** This is the same "Rule of Safe Defaults" shape as `INC-063` (opt-out CSS defaults), applied to CSS custom properties instead of selectors: a blanket default at the root scope silently wins for every theme that was never explicitly written to beat it, and nothing about the file structure makes that visible without tracing the full fallback chain by hand.

## Prevention

- When a token has meaningful per-theme values in *some* themes (`dark`/`sepia` here), treat the presence of a `:root`-level definition of the *same* token name as a red flag, not a safe baseline — check whether every consumption site's fallback chain would produce a *better* per-theme result if the `:root` definition didn't exist at all.
- This is now the second incident (after `INC-065`) found by tracing every link in a `var(a, var(b, var(c, literal)))` fallback chain rather than trusting that the first name resolves correctly everywhere it's read.

## Related

- [INC-064](INC-064-secondary-button-suffix-mismatch-recurrence.md) — established the `-background`/`-text` companion tokens this fix's fallback chain depends on being complete.
- [INC-065](INC-065-stale-enhanced-token-inline-override-on-theme-switch.md) — same session, same class of lesson (trace every consumer/link before declaring something safe), different mechanism (inline-style injection vs. `:root` shadowing).
- [INC-063](INC-063-button-theme-hijack-opt-out-default.md) — same "Rule of Safe Defaults" principle, applied to CSS selectors instead of custom-property fallback chains.
