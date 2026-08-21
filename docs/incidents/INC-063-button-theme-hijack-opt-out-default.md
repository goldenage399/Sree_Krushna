# INC-063 — Button Theme Hijack: Opt-Out Default Inverted to Opt-In

**Date**: 2026-07-12
**Severity**: HIGH (broke real production controls at least 3 times before the pattern was recognized)
**Status**: RESOLVED (`theme-utilities.css` selector inversion)
**Found during**: UI Council session `260711_ui_council_topbar_sepia_theme_buttons.md`, then again during TAP-001 review

---

**Affected Components**: `src/styles/theme-utilities.css`, `docs/ssot/ui-design/spokes/THEME-SYSTEM.md`, `.agent/workflows/debug-frontend.md`

## Summary

In `sepia` and `velvet-dark` themes, `[data-theme] button:not(.theme-button-secondary)` forced **every** `<button>` in the app — 884 of them — into a branded gradient CTA style **unless it carried an escape class**. Roughly 24 buttons are genuinely primary CTAs. Every other author who wrote a plain `<button>` shipped a broken control in these two themes, invisibly, until a user happened to view it there.

This recurred at least three times before being recognized as one root cause rather than three unrelated bugs:
1. The original incident that produced FKL-DI-003 (the opt-out contract).
2. INC-058 (WCAG contrast failure on the hijacked gradient).
3. The 260711 UI Council session (`Topbar.jsx`, `Sidebar.jsx`, `ThemeSwitcher.jsx`, `HeaderButton.jsx`, `UserMenu.jsx` all hijacked) — followed immediately by a follow-up query finding **4 more** hijacked buttons the same week.

## Architectural Surface Mapping (6-Surface Audit)

Multi-surface → **Full audit** required.

| # | Surface | Affected? | Detail |
| :-- | :--- | :--- | :--- |
| 1 | **UI** | ✅ **YES** | Icon buttons, menu rows, and other neutral controls rendered as bold gradient CTAs in 2 of 7 themes; the reverse defect could also occur (a genuine CTA silently losing emphasis if a competing class won the cascade). |
| 2 | **Data** | ❌ No | Purely presentational. |
| 3 | **Reactive** | ❌ No | No React state/hook involved; pure CSS selector. |
| 4 | **Service** | ❌ No | No backend involvement. |
| 5 | **Module** | ✅ **YES** | The selector's home file moved during TASK-218 M2.5 (`themes-enhanced.css` → `theme-utilities.css`); any doc/guard citing the old filename silently went stale. |
| 6 | **Governance** | ✅ **YES** | The root cause was **documented as a contract to follow** (FKL-DI-003: "remember the escape class") rather than fixed as a defect. A second invariant, FKL-DI-015, existed purely to patch a *side effect* of the same opt-out default. The enforcement guard (`sg:fkl-di-003`) was scoped narrowly enough (gradient/glassmorphism classNames only) to report 0 violations while the bug was live on plain buttons — the same blind-guard shape as [INC-062](INC-062-token-type-001-recurrence-theme-accent-gradient.md). |

## Root cause — why documenting the contract didn't stop the recurrence

The opt-out default is a **Rule of Safe Defaults violation**: the failure-safe direction and the actual default were inverted.

- **Chosen default**: "every button is a primary CTA" (true for ~3% of buttons).
- **Consequence of forgetting the exception**: a hijacked, broken, low-contrast control — a defect invisible until someone looks at that theme.
- **This is backwards.** A safe default fails *visibly* when forgotten. The chosen default failed *invisibly* when forgotten — which is precisely why it recurred: nothing signaled the omission until a human happened to look at Sepia or Velvet-Dark.

FKL-DI-003 patched this by asking every future author to remember an escape hatch, forever, on every new button. That is not a fix; it is a standing tax with a 100%-eventual-failure rate, and it produced a second invariant (FKL-DI-015) purely to handle a race condition the first invariant's own mechanism created.

## Fix

Inverted the selector from opt-out to opt-in in `src/styles/theme-utilities.css` (sepia + velvet-dark, base + `:hover` rules):

```css
/* before — every button is primary unless it escapes */
[data-theme="sepia"] button:not(.theme-button-secondary) { /* gradient CTA */ }

/* after — only a button that declares itself primary gets it */
[data-theme="sepia"] .button-theme-primary { /* gradient CTA */ }
```

**No new `.button-theme-primary` tags were added.** Every genuine primary CTA already had its own explicit theme-aware background class (`bg-theme-accent`, `bg-status-info-600`, `bg-[var(--color-primary)]`, etc.) that the opt-out rule had been silently overriding in exactly these 2 of 7 themes — those buttons already rendered correctly everywhere else. Un-hijacking them makes them consistent across all 7 themes for the first time, without tagging anything.

The 4 buttons the 260711 Council found (`HeaderButton`, `ThemeSwitcher`, `UserMenu` items) had already been tagged `.theme-button-secondary` by that session; that tag still works post-inversion (harmlessly redundant — nothing targets a bare button by default anymore).

## Structural Invariant

> **Rule of Safe Defaults**: when a global rule targets "everything except X," the failure mode for forgetting to mark something as X must be *visible and benign*, never *invisible and broken*. If forgetting the exception produces a silent defect, invert the rule: target "only things that declare Y," so forgetting Y produces a visible, self-correcting gap instead of a hidden bug.
>
> Corollary: **a contract that says "remember to add an escape class" is a standing tax, not a fix.** If violating it recurs, the fix is not a stronger reminder — it is removing the need for the escape class.

This is the same family as [INC-062](INC-062-token-type-001-recurrence-theme-accent-gradient.md)'s lesson (documenting a hazard is not fixing it) applied to a CSS *selector direction* rather than a *token type*.

## Prevention

| Layer | Control |
| :--- | :--- |
| Structural | The opt-out selector no longer exists — the bad state (bare button = hijacked) is unrepresentable, not merely forbidden. |
| SSOT | [THEME-SYSTEM.md](../ssot/ui-design/spokes/THEME-SYSTEM.md) FKL-DI-003 marked SUPERSEDED with the corrected model; FKL-DI-015 marked MOOT (the race it patched can no longer occur). |
| Debug workflow | `debug-frontend.md` Track G rewritten for the opt-in model — the direction of the likely bug is now reversed (missing branded style, not unwanted hijack). |
| Governance | `.claude/sg-rules/fkl-di-003-theme-button-optout.yml` retired (tag `v1.0.9-fkl-di-003-optout-guard-retired`) — it protected a contract that no longer exists. |
| Process | [.agent/patterns/derive-dont-declare-guardrails.md](../../.agent/patterns/derive-dont-declare-guardrails.md) — corollary: prefer making bad state unrepresentable over forbidding it. |
| Council process | [ui-council.md](../../.agent/workflows/ui-council.md) amended (see Council Ledger 2026-07-12) — Rule-Challenge step, failure-class recurrence gate, measurement gate, guard-capability audit, drifted-facts correction. |

## Litmus test

> *"Can a developer reintroduce this tomorrow without violating a written protocol?"*

**No** — there is no longer a rule that targets "everything except X" for buttons in these themes to reintroduce. A new hijack-style rule would have to be written from scratch, and the Rule of Safe Defaults corollary above is now the standing objection to it.

## Related

- [INC-062](INC-062-token-type-001-recurrence-theme-accent-gradient.md) — sibling incident, same session, same underlying discipline (fix the type/direction, don't police the callers).
- `User_Created/Discussion Threads/Council/260711_ui_council_topbar_sepia_theme_buttons.md` — the council session that found the token-naming and hardcoded-hex halves of this bug (correctly fixed) but treated the opt-out mechanism itself as background rather than the root cause.
- `User_Created/Discussion Threads/Governance/TokenGovernance/TAP-001 — Token Architecture Stabilization Program.md` — Query 3.0/3.1, where the recurrence was identified and the failure analysis of the UI Council process itself was produced.
