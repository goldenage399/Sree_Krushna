# INC-064 — Secondary Button Suffix Mismatch: Same Root Cause as the Original Council Finding, Missed on the Sibling Variant

**Date**: 2026-07-12
**Severity**: MEDIUM-HIGH (visible on nearly every `.theme-button-secondary` control, 6 of 7 themes)
**Status**: RESOLVED (`theme-utilities.css`)
**Found during**: User visual review (P89) of the INC-063 button-hijack fix — flagged as "buttons look faded"

**Affected Components**: `src/styles/theme-utilities.css`

---

## Summary

The 260711 UI Council session diagnosed and fixed a naming mismatch on the **primary** button: `themes-enhanced.css` defined `--theme-button-primary-bg` but the consumer read `--theme-button-primary` — the override was dead, and the button fell back to a low-contrast colour.

**The identical defect existed on the secondary button, and nobody checked.** `theme-utilities.css`'s `.theme-button-secondary` rule read `--theme-button-secondary` / `--theme-fg`. But every one of the 7 themes actually defines a *different* pair — `--theme-button-secondary-background` / `--theme-button-secondary-text` — intended, designed, per-theme values that the consumer never read. Only `dark` happened to also have a bare `--theme-button-secondary` (from the same "EMERGENCY DARK THEME FIXES" block as the primary-button hijack), so it accidentally rendered *something* close to intended; every other theme fell through to `:root`'s generic default (`#f1f5f9`, a cool light gray) regardless of the theme's actual palette.

**User-visible effect**: any `.theme-button-secondary` control (menu rows, dropdown items, secondary CTAs) rendered a flat, off-palette, low-contrast fill in light, sepia, dim-dark, grayscale, velvet-dark, and ambient — "faded," and not specific to any one component, because the defect lives in the shared class.

**Why it wasn't caught with INC-063**: INC-063 concerned *which* buttons get the primary treatment (an opt-out vs. opt-in question). This is a *different* defect on the *secondary* treatment's own colours — orthogonal, and outside what INC-063's fix touched. It surfaced only because the user did a real visual pass across the app after the INC-063 fix and noticed the secondary buttons looked wrong — the same investigative habit (verify visually, don't assume a fix landed cleanly) that has driven every finding in this session.

## Root cause

Two independent authors used two different naming schemes for the same concept (secondary button colour) and nothing tied them together:

- **Definition side** (`theme-tokens.css`, one consistent pattern across 7 themes): `--theme-button-secondary-background`, `--theme-button-secondary-text`.
- **Consumption side** (`theme-utilities.css`, one rule): `--theme-button-secondary`, `--theme-fg`.

`TaskCard.jsx`'s "Update Task" button bypassed the shared CSS class entirely by setting an inline `style` that correctly referenced `--theme-button-secondary-background`/`-text` — which is why *that* button looked right while the shared class did not. The inline style was accidentally correct; the shared rule was not.

A secondary defect found and fixed in the same pass: no per-theme `:hover`/`:active` background token exists at all for the secondary button. The rule's fallback chain reached for `--theme-bg-tertiary` / `--theme-bg-secondary` — tokens that are gradient-valued in most themes and therefore invalid inside `background-color`. Fixed by deriving hover/active from the (solid) `-background` token via `color-mix()`, the same pattern used in TASK-218 M3a.

## Fix

```css
/* before */
background-color: var(--theme-button-secondary, var(--theme-bg-secondary));
color: var(--theme-fg);

/* after */
background-color: var(--theme-button-secondary-background, var(--theme-button-secondary, #f1f5f9));
color: var(--theme-button-secondary-text, var(--theme-fg));
```

Hover/active derived via `color-mix()` from `--theme-button-secondary-background`, with a solid literal (never a `--theme-bg-*` gradient token) as the final fallback — caught by the derive-don't-declare P-CMT guard (`npm run check:color-mix`) flagging the first draft of this fix, which had nested a gradient token inside a fallback chain. Fixed before commit; the guard did exactly the job INC-062 built it for.

**Known visual change**: `dark` theme's secondary buttons now render `#374151` (the `-background` value) instead of the previous `#161e2c` (the coincidental bare-name value from the emergency-fix era). The `-background`/`-text` family is the consistently-designed, 7-theme pattern (and the one `TaskCard.jsx` already validated via its inline style), so it was treated as canonical — but this is a real, visible colour change in one theme, flagged explicitly for P89 sign-off rather than silently applied.

## Structural Invariant

> **A defect pattern found once on one variant of a component family is not fixed until checked on every sibling variant.** The 260711 Council correctly root-caused the primary-button suffix mismatch but scoped its fix to "primary" rather than asking "does the secondary button have the same shape of bug?" It did. This is the Failure-Class Recurrence Gate (landed in `ui-council.md` after INC-063) applied one component-family down: the check must be by *defect shape*, not by *which specific token name* triggered the original report.

## Prevention

- `.agent/patterns/derive-dont-declare-guardrails.md` — the corollary about hardcoded token lists drifting from the CSS; this incident is now a second example of the pattern (a hand-maintained consumer selector name drifting from a hand-maintained definition name, with nothing tying them together).
- Consider (not done here — scope creep beyond this fix): an ast-grep or build-time check that every `--theme-<x>-<suffix>` token defined in `theme-tokens.css` has a corresponding read site in `theme-utilities.css`, to catch orphaned tokens automatically rather than by user-visible symptom.

## Related

- The 260711 UI Council session — origin of the *primary*-button version of this exact defect shape.
- [INC-063](INC-063-button-theme-hijack-opt-out-default.md) — same session, sibling defect, different mechanism (opt-out selector vs. dead token name).
