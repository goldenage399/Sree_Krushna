# INC-007 — Hardcoded CSS Color: "Fix by Certainty" Anti-Pattern

**Date**: 2026-06-10  
**Severity**: High (DHCP-001 violation; design token bypass; change rejected by user)  
**Status**: Resolved (change reverted; P-CSS protocol created; pre-commit gate wired)  
**Affected Component**: `src/styles/components/stepper-wizard.css` — `.validation-icon-item`, `.validation-success-collapsed-badge`  
**Keywords**: css, hardcoded-color, design-token, theme, variable, DHCP-001, anti-pattern, hex, specificity
**Topology Layer**: Component Authority
**Ownership Type**: design-token
**Symptom Tags**: invisible-border, color-mix-opacity-too-low, dhcp-violation, hardcoded-hex

---

## What Happened

User reported that `.validation-icon-item` circular borders in `#compact-validation-summary` were invisible via browser DevTools selector:
```
document.querySelector("#compact-validation-summary > div.validation-icon-grid > button:nth-child(1)")
```

The agent diagnosed the symptom (invisible border) correctly but misidentified the root cause. Instead of tracing why the token-based value was failing, the agent replaced it with a hardcoded hex fallback:

**Before (original — invisible):**
```css
.validation-icon-item {
  border: 1px solid color-mix(in srgb, var(--theme-border-subtle, var(--color-border-subtle)) 30%, transparent) !important;
}
.validation-success-collapsed-badge {
  border: 1px solid color-mix(in srgb, var(--task-creation-success, #10b981) 40%, transparent);
}
```

**After (agent change — DHCP-001 violation):**
```css
.validation-icon-item {
  border: 1.5px solid var(--color-border, var(--theme-border-subtle, #cbd5e1)) !important;
}
.validation-success-collapsed-badge {
  border: 1.5px solid var(--task-creation-success, #10b981) !important;
}
```

The agent introduced `#cbd5e1` as a third-level hardcoded fallback in a CSS custom property chain. User rejected the change.

---

## Root Cause

### Primary: "Fix by Certainty" Anti-Pattern
The agent encountered an invisible visual element and, instead of diagnosing **why** the token-based value was invisible (30% opacity in `color-mix()` reduced contrast to near-zero), it reached for a raw hex value it **knew** would be visible. This is a confidence substitution — the agent bypassed diagnosis and hardcoded certainty.

### Secondary: No Enforcement Gate
- `lint:dhcp` script existed and would have caught `#cbd5e1` immediately
- No agent self-check obligation existed before CSS edits
- `.husky/pre-commit` was empty — nothing blocked commit
- DHCP-001 was documented but not enforced

### Actual Technical Root Cause
`color-mix(in srgb, var(--theme-border-subtle) 30%, transparent)` = 30% border color, 70% transparent. On both light and dark themes, this produced a border indistinguishable from the background. Correct fix: remove the opacity reduction entirely.

```css
/* Correct fix — no hardcoded values */
.validation-icon-item {
  border: 1.5px solid var(--theme-border-subtle, var(--color-border-subtle)) !important;
}
.validation-success-collapsed-badge {
  border: 1.5px solid var(--task-creation-success) !important;
}
```

---

## Architectural Surface Mapping

| Surface | Affected? | Detail |
|---|---|---|
| **UI Surface** | ✅ Yes | `.validation-icon-item` border color using hardcoded hex fallback; visual rendering affected on all themes |
| **Data Surface** | ❌ No | No Firestore, no schema, no data writes involved |
| **Reactive Surface** | ❌ No | No React state, context, or hooks involved |
| **Service Surface** | ❌ No | No Cloud Functions, APIs, or auth layer involved |
| **Module Surface** | ❌ No | No new dependencies, routes, or file structure changes |
| **Governance Surface** | ✅ Yes | DHCP-001 standard had no enforcement gate; agent behavioral rule missing; pre-commit hook absent |

**Classification**: 2-surface incident → Full 6-Surface Audit required (completed above).

---

## Resolution

1. **Change reverted** — User rejected the hardcoded change; git working tree reverted to original.

2. **Root cause fix (pending)** — The actual fix is to remove the `color-mix()` 30% opacity and use direct token references:
   ```css
   border: 1.5px solid var(--theme-border-subtle, var(--color-border-subtle)) !important;
   ```

3. **Protocol P-CSS created** — GEMINI.md Protocol #76 mandates `npm run lint:dhcp -- <file>` after every CSS edit before proposing the change.

4. **Pre-commit gate wired** — `.husky/pre-commit` now runs `stylelint --config .stylelintrc.dhcp-001.json` on all staged CSS files; blocks commit on DHCP-001 violation.

5. **Violation pattern registered** — `P_CSS_HARDCODED_VALUES` added to `.agent/violation-patterns.json` with incident reference.

6. **Standards catalog updated** — `P-CSS` entry added to `.agent/standards-catalog.json` (standard #75); referential integrity verified.

---

## Structural Invariant Established

### Protocol 76: CSS Edit Self-Check (DHCP-001 Mandatory Gate) [P-CSS]

- **Constraint**: After editing ANY `.css` file in `src/styles/` or `src/components/`, **MUST** run `npm run lint:dhcp -- <file>` before proposing or committing the change.
- **Banned**: Raw hex (`#rrggbb`), `rgb()`, `rgba()`, `hsl()`, `hsla()` for `color`, `background-color`, `border-color` properties.
- **Anti-Pattern Name**: "Fix by Certainty" — substituting a known-visible hardcoded value instead of diagnosing why the token-based approach is failing.
- **Verification Gate**: `npm run lint:dhcp` returns exit code `0` AND `.husky/pre-commit` blocks staged violations.

---

## Litmus Test

> *"If a new developer touches this codebase tomorrow, is it physically impossible for them to make this same mistake without violating a written protocol?"*

**YES** — `lint:dhcp` now runs on every commit via `.husky/pre-commit`. A hardcoded hex value in a CSS border would block the commit before it lands.

> *"Is there an ADR that would have made this bug architecturally impossible to introduce?"*

**YES** — P-CSS (Protocol #76) in GEMINI.md combined with the pre-commit hook makes DHCP-001 a hard structural invariant, not a documentation suggestion.
