# INC-062 — TOKEN-TYPE-001 Recurrence: `--theme-accent` Held a Gradient in 5 of 7 Themes

**Date**: 2026-07-12
**Severity**: HIGH (silent, cross-theme rendering failure — 71 affected sites)
**Status**: RESOLVED (`da0ef95e`)
**Found during**: TASK-218 / TAP-001 M3a (nobody was looking for it)
**Recurrence of**: [INC-057](INC-057-calendar-chip-gradient-transparent-color-mix.md)

---

## Affected Component

**Affected Components**: `src/styles/theme-tokens.css`, `src/styles/theme-utilities.css`, `src/styles/tokens/color-tokens.css`, `scripts/check-color-mix-types.cjs`

*(Files modified by the fix. The consumers listed in the table below were **impacted** by the defect — their `color:`/`border:` declarations were being dropped — but required no edit, because the fix corrects the token's type at its definition rather than patching each caller. That distinction is the whole point of this incident: INC-057 patched a caller, and the bug recurred.)*

| Component | Role |
| :--- | :--- |
| `src/styles/theme-tokens.css` | **Defect site.** `--theme-accent` held `var(--theme-gradient-accent)` in 5 of 7 `[data-theme]` blocks. |
| `src/styles/theme-utilities.css` | Consumer — `color-mix()` and `linear-gradient()` colour stops using `--theme-accent`. |
| `src/styles/components/{forms,stepper-wizard,profile-cards}.css`, `task-creation-modular.css`, `mobile-bottom-navigation.css` | Consumers — `color:` / `border-color:` silently dropped. |
| `scripts/check-color-mix-types.cjs` | **Failed guard.** Hardcoded `FORBIDDEN_TOKENS` list; stale and its risk annotation inverted. Now derives from `theme-tokens.css`. |
| `.agent/standards-catalog.json` | TOKEN-TYPE-001 was **unregistered** — no catalog entry, no detection pattern, no PACT wiring. |

## Summary

`--theme-accent` resolved to `var(--theme-gradient-accent)` — a `linear-gradient()` — in **light, dim-dark, grayscale, velvet-dark and ambient**. It was solid only in **dark** and **sepia**, and only because an unrelated `!important` override happened to force it there.

A gradient is invalid in a colour slot, so in those 5 themes:

| Consequence | Sites |
| :--- | :--- |
| `color:` / `border-color: var(--theme-accent)` → declaration silently **dropped** | 41 |
| `color-mix(… var(--theme-accent) …)` → returns **transparent** | 30 |
| Used as a colour **stop** inside `linear-gradient(90deg, var(--theme-accent), …)` → **invalidates the whole background** | (subset of above) |

This is the **exact failure mode of INC-057**, still live months after INC-057 was closed.

## Root cause — why the INC-057 fix didn't hold

INC-057 fixed the *symptom's call site* (`palette.css`'s `--cic-slot-N-tint`) and then **documented** the hazard: TOKEN-TYPE-001 declared "these tokens are gradients, never use them in colour functions", and shipped `scripts/check-color-mix-types.cjs` with a **hand-maintained** list:

```js
const FORBIDDEN_TOKENS = ['--theme-bg', '--theme-bg-secondary', '--theme-accent'];
```

Three compounding failures:

1. **It fixed the caller, not the token.** The real defect is that a token named `--theme-accent` — semantically a *colour* — held a *gradient*. Forbidding its use in colour functions treats the symptom; 71 sites used it in colour contexts anyway.
2. **The guard's list was hand-maintained, so it drifted from reality.** Nothing tied `FORBIDDEN_TOKENS` to the actual token *values* in the CSS. It could be — and was — wrong.
3. **The guard's own annotation was BACKWARDS.** It stated: *"Risk: LOW in light/grayscale (`--theme-accent` is solid). Risk: HIGH in sepia/velvet-dark."* The truth was the inverse — solid in dark/sepia, gradient in light/grayscale/dim-dark/velvet-dark/ambient. A future reader trusting the comment would have looked in exactly the wrong themes.
4. **TOKEN-TYPE-001 was never registered in `.agent/standards-catalog.json`.** It existed only as prose in a spoke doc plus a script. It had no catalog entry, no detection pattern, and no PACT wiring — so nothing forced it to stay true.

## Architectural Surface Mapping (6-Surface Audit)

Multi-surface → **Full audit** required.

| # | Surface | Affected? | Detail |
| :-- | :--- | :--- | :--- |
| 1 | **UI** | ✅ **YES** | Accents, focus rings, borders and validation states silently dropped or rendered transparent across 5 of 7 themes. Invisible to the compiler; only visible by looking at each theme. |
| 2 | **Data** | ❌ No | Purely presentational. No Firestore schema, rule, or write path touched. |
| 3 | **Reactive** | ❌ No | No React state, context or hook involved. Tokens are resolved by the CSS cascade, not by JS. (`ThemeContext` only sets the `[data-theme]` attribute.) |
| 4 | **Service** | ❌ No | No Cloud Function, auth layer, or external service involved. |
| 5 | **Module** | ✅ **YES** | The token's definition site moved during M2.5 (`enhanced-themes.css` → `theme-tokens.css`), which broke the guard's **filename-keyed baseline** and caused 5 previously-invisible violations to surface. Filename-keyed governance state is itself fragile. |
| 6 | **Governance** | ✅ **YES** | TOKEN-TYPE-001 was documented but **not registered** in the standards catalog, had **no detection pattern**, and its enforcement script carried a **hand-maintained list that was factually wrong**. The invariant could not self-verify. |

## Fix

1. **`--theme-accent` is now SOLID in all 7 themes** (each adopts its own gradient's start stop). This fixes the token's *type*, not its callers.
2. `.card-enhanced::before`, the one place that genuinely wanted a gradient, now asks for `--theme-gradient-accent` **explicitly**.
3. **The guard no longer hand-maintains a token list.** `check-color-mix-types.cjs` now *derives* the set of gradient-valued tokens by reading `theme-tokens.css` — so it cannot drift from reality again (see Structural Invariant below).
4. TOKEN-TYPE-001 **registered** in `.agent/standards-catalog.json` with a detection pattern and PACT wiring.

## Structural Invariant (the actual lesson)

> **A guard rail that hand-maintains a list of facts about the codebase will drift from the codebase.**
>
> `FORBIDDEN_TOKENS` was a hardcoded copy of "which tokens are gradients." Nothing kept it honest. It went stale, and its accompanying risk note was inverted — so the guard was simultaneously incomplete *and* actively misleading.
>
> **Derive, don't declare.** Where a check concerns a property the source of truth already states (a token's value, a route's existence, a collection's name), the check must **read that source**, not restate it. A restated fact is a fact that will be wrong.

Corollary, specific to tokens:

> **A token's NAME is a contract about its TYPE.** `--theme-accent` is semantically a colour; it must hold a colour. If a gradient is wanted, that is a different token (`--theme-gradient-*`). Forbidding the *use* of a mistyped token is treating a symptom — fix the token.

## Prevention

| Layer | Control |
| :--- | :--- |
| Automated | `npm run check:color-mix` (P-CMT) — now **derives** gradient tokens from `theme-tokens.css`; cannot drift. Wired into `npm run preflight`. |
| Automated | `npm run check:tc-color` — blocks new theme-blind `--tc-` colour tokens (the related M3a defect). |
| Catalog | `TOKEN-TYPE-001` registered in `.agent/standards-catalog.json` + detection pattern. |
| SSOT | [THEME-SYSTEM.md](../ssot/ui-design/spokes/THEME-SYSTEM.md) § Token Type Registry — `--theme-accent` moved to the solid list, with the correction noted. |
| Process | [.agent/patterns/derive-dont-declare-guardrails.md](../../.agent/patterns/derive-dont-declare-guardrails.md) |

## Litmus test

> *"Can a developer reintroduce this tomorrow without violating a written protocol?"*

**No.** Making any `--theme-*` colour token hold a gradient now causes `check-color-mix-types.cjs` to detect it **from the token's actual value** the moment it is used in a colour function — the guard reads the CSS rather than a list someone remembered to update.

## Related

- [INC-057](INC-057-calendar-chip-gradient-transparent-color-mix.md) — the original incident this recurred from.
- TASK-218 / TAP-001 — the program that surfaced it (`enhancement-notes/TASK-218-Token-Architecture-Stabilization-Program/08_PIRR.md`).
