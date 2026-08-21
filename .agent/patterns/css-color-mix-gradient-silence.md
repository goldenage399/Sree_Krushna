---
pattern: css-color-mix-gradient-silence
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: "npm run check:color-mix"
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# css-color-mix-gradient-silence

**Category**: Anti-Pattern
**Applies to**: Any frontend CSS development involving the `color-mix()` function and CSS Custom Properties (Design Tokens).
**Origin**: 2026-07-10 — Calendar chip background rendering as transparent in Sepia theme.
**Status**: VALIDATED

---

## Anti-Pattern — Gradient Tokens in `color-mix()`

### What it is
Using a design token that maps to a gradient string (e.g., `linear-gradient(...)`) as the color argument in the CSS `color-mix()` function.

### Symptoms
- The element's background or text color becomes completely `transparent` or disappears.
- No CSS compiler or browser console error is thrown (it fails silently).
- The bug only appears in specific themes (e.g., Sepia) where the token swaps from a solid color to a gradient.

### Why it fails
The `color-mix()` specification expects two valid `color` values. A `linear-gradient()` is technically an image, not a color. When the browser evaluates `color-mix(in srgb, var(--theme-bg), transparent 50%)` and `--theme-bg` resolves to `linear-gradient(...)`, the function becomes invalid and evaluates to `transparent` (or the initial value) silently.

### Correction
Replace the gradient-based token with a solid-color primitive or surface token that is guaranteed not to use gradients in any theme.
- **Currently forbidden** (INC-062, 2026-07-12 — DERIVED, not a fixed list, see Enforcement below): `--theme-bg`, `--theme-bg-secondary`, plus any `--theme-*` colour token the guard finds holding a gradient value at scan time.
- **Approved**: `--theme-surface-primary`, `--theme-surface-canvas`, `--primitive-*`, and any `--theme-*` colour token the guard confirms is solid in every theme.

**Enforcement**: `npm run check:color-mix` (`scripts/check-color-mix-types.cjs`), wired into `preflight` as `P-CMT`.

> [!WARNING]
> **This list used to be hardcoded and drifted (INC-062).** `--theme-accent` was on the forbidden list here and in the guard's `FORBIDDEN_TOKENS` array for months after it stopped being universally a gradient (it was solid in `dark`/`sepia`, gradient in the other 5 themes) — and the guard's own inline comment about which themes were risky was **inverted from reality**. The guard now **derives** the forbidden set by reading `src/styles/theme-tokens.css` directly (see `.agent/patterns/derive-dont-declare-guardrails.md`), so `--theme-accent` was removed once M3a made it solid everywhere. **Do not hand-edit the bullet list above as if it were authoritative — it is a snapshot for readability. `npm run check:color-mix` is the source of truth**; run it, don't read this file, when you need the current answer.

### Task-Dashboard instance
Calendar Chip backgrounds in Sepia theme (INC-057). Recurred on `--theme-accent` across 5 themes (INC-062) — root cause there was a *hardcoded* forbidden-list drifting from reality, not a new instance of the `color-mix()` mechanism itself; see `derive-dont-declare-guardrails.md` for that half of the story.
