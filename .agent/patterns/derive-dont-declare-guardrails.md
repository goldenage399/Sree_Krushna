---
pattern: derive-dont-declare-guardrails
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Pattern: Derive, Don't Declare (Guard-Rail Design)

**ID**: `derive-dont-declare-guardrails`
**Type**: Process / Guard-rail design
**Severity**: High (produces guards that are simultaneously blind AND misleading)
**Origin Incident**: [INC-062](../../docs/incidents/INC-062-token-type-001-recurrence-theme-accent-gradient.md) (recurrence of [INC-057](../../docs/incidents/INC-057-calendar-chip-gradient-transparent-color-mix.md))

---

## The rule

> **A guard rail must not restate a fact the codebase already states. It must read it.**

If a check concerns a property that some source of truth already declares — a token's value, a route's existence, a collection's name, a file's exports — the check must **derive** that property from the source. The moment you copy it into the guard as a literal, you have created a second source of truth that nothing keeps in sync.

**A restated fact is a fact that will be wrong.**

## What it looked like (INC-062)

`scripts/check-color-mix-types.cjs` protected TOKEN-TYPE-001: *"gradient tokens must never enter a colour function."* It knew which tokens were gradients via:

```js
const FORBIDDEN_TOKENS = ['--theme-bg', '--theme-bg-secondary', '--theme-accent'];
```

That list was a hand-maintained copy of a fact stated in the CSS. It drifted. Two independent failures resulted:

1. **Blind.** It never noticed that `--theme-accent` was a gradient in 5 of 7 themes — 71 sites where `color:`/`border:` silently dropped and `color-mix()` went transparent.
2. **Actively misleading.** The comment beside the list said *"Risk: LOW in light/grayscale (`--theme-accent` is solid). Risk: HIGH in sepia/velvet-dark."* This was **exactly inverted** — it was solid in dark/sepia and a gradient in light/grayscale. Anyone trusting the guard's own documentation would have searched the wrong five themes.

So a bug the repo had already had (INC-057), already documented, and already built a guard for, **stayed live for months** — because the guard restated the world instead of reading it.

## The fix

```js
// Read theme-tokens.css; any --theme-* token whose value resolves to a gradient
// in ANY theme is forbidden inside colour functions.
const FORBIDDEN_MAP = deriveGradientTokens();   // <- reads the CSS
```

No list to maintain. Add a gradient to a colour token tomorrow and the guard notices, because it is looking at the token, not at someone's memory of the token.

**Verified**: re-introducing the exact bug (making `--theme-accent` a gradient in `light`) makes the guard fire immediately with 7 violations. Reverting makes it clean.

## Smell test — when this pattern applies

Ask of any guard/lint/check you are writing or reviewing:

- [ ] Does it contain a **hardcoded list** of things that exist in the codebase (tokens, routes, collections, filenames, component names, exported symbols)?
- [ ] If someone changed that thing in the codebase, would the guard **silently** become wrong?
- [ ] Does the guard's own comment assert a **fact about the code** that nothing verifies?

Any "yes" → derive it instead.

## Related failure shapes

- **Filename-keyed governance state.** INC-062 also exposed this: the guard's baseline-debt list was keyed by file path, so renaming a file (`themes-enhanced.css` → `theme-utilities.css`) resurfaced 5 "new" violations that were not new. Prefer content- or rule-keyed state where practical; where not, treat a rename as a governance event.
- **Documenting a hazard instead of removing it.** TOKEN-TYPE-001 originally said "don't use these tokens in colour functions" — while 71 sites did exactly that. The durable fix was to make the token *not a gradient*, i.e. fix the type, not police the callers. **Prefer making the bad state unrepresentable over forbidding it.**

## Litmus

> *"If someone changes the underlying fact tomorrow, does this guard notice — with nobody remembering to update it?"*

If no, the guard is decoration.
