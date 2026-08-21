---
pattern: skill-source-verification-gate
activation_tier: routed
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "port skill from"
  - "onboard skill"
  - "import skill"
  - "skill from pio"
  - "skill from another repo"
  - "adapt skill"
  - "copy skill"
  - "stale skill"
  - "skill wrong token"
  - "skill wrong path"
guard: ""
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Skill Source Verification Gate

**Category**: Process Pattern + Anti-Pattern
**Applies to**: Any skill onboarding, porting, or review session where a SKILL.md file
references repo-specific artifacts (token names, file paths, hub docs, config files, CSS vars)
**Origin**: 2026-06-23 — Remediation of two PIO-ported skills (`ssot-domain-mapper`,
`ui-design-validator`) that referenced wrong z-index token names, wrong hub paths, and a
dead tailwind config file. Discovered during PRD execution for skill-gap remediation.
**Status**: HYPOTHESIS (one validated instance — promote to VALIDATED after second occurrence)

---

## Pattern — Skill Source Verification Gate

### Problem

A skill ported from a sibling repo *looks* correct and complete — it has the right structure,
valid markdown, sensible rules. But every concrete claim in the body (token names, file paths,
hub document locations, config file references) was verified against the **source repo**, not
this one. A review that uses such a skill gets confidently wrong guidance.

Concrete instance: `ui-design-validator` told reviewers to enforce `var(--pio-z-layer-modal)`.
The real token in this repo is `var(--z-modal)`. The skill passed every structural check and
fired on correct trigger phrases — the wrongness was invisible without source verification.

### Why it happens

Skills are documentation. They don't fail to compile. A ported skill that names the wrong CSS
variable or points to a non-existent hub file produces no error — it just silently misleads
every review it participates in. The `skill-onboarding.md` workflow checks structural quality
(description format, scenario testing) but not **live-source fidelity** of concrete claims.

### Solution

Before trusting or deploying any skill that contains repo-specific claims, run the
**Source Verification Checklist** (3–5 minutes, prevents hours of wrong guidance):

**1. Token names** — grep every CSS variable name the skill mentions:
```bash
grep -r "var(--<token-name>)" src/styles/ src/tokens/
```
If not found → the token is wrong. Find the real name in `src/styles/tokens/`.

**2. File paths** — for every path the skill names, confirm it exists:
```bash
ls <path>   # or use Glob
```
If missing → find the real path or remove the dead reference.

**3. Hub / SSOT document references** — for every `docs/` path the skill mentions:
```bash
ls docs/ssot/   # compare against actual tree
```

**4. Config file references** — if the skill names a config file (tailwind, vite, etc.):
- Confirm which file the tool actually loads at runtime (not which looks most complete)
- For Tailwind: `node -e "const p=require('tailwindcss/lib/util/resolveConfigPath.js'); console.log(p.default?p.default():p())"`

**5. Cross-check live source for "known facts"** — if the skill states facts about a component
(e.g. "missing React.memo", "className not forwarded"), verify at source before trusting:
```bash
grep -n "React.memo\|className" src/components/admin/AdminShell.jsx
```

### Failure Mode

Partial application — verifying token names but not file paths, or verifying the skill's
description but not its body content. The trap is that correct structure creates false
confidence. Every **concrete claim** must be verified, not just the ones that look suspicious.

### Task-Dashboard instance

**2026-06-23**: Two skills remediated:
- `ssot-domain-mapper`: referenced `docs/DOCUMENTATION_HUB.md` (doesn't exist) and
  `docs/Accounts_Module_SSOT/` (PIO paths). Real hub: `docs/ssot/ui-design/UI-DESIGN-HUB.md`.
- `ui-design-validator`: enforced `var(--pio-z-layer-modal)` / `var(--pio-z-layer-01)`.
  Real tokens: `var(--z-modal)` / `var(--z-sticky)` in `src/styles/tokens/layout-tokens.css:169`.

**Bonus finding**: `tailwind.config.cjs` (59 lines, complete-looking theme tokens) was a dead
orphan — never loaded. `tailwind.config.js` (14-line empty stub) is what Tailwind resolves.
Confirmed via `resolveConfigPath`. Deleted `.cjs`. Real token source: CSS bridge + `src/tokens/`.

---

## Anti-Pattern — Ported-Skill Trust

### What it is

Assuming a skill ported from another repo is correct for the current repo because it
*looks* complete and passes structural quality checks.

### Symptoms

- Reviews flag issues that don't exist (e.g. "missing React.memo" when it's already there)
- Reviews miss real issues because the wrong token name is enforced
- Hub navigation fails because the hub path in the skill doesn't exist in this repo
- "Which config file has the tokens?" confusion when two configs exist

### Why it fails

Skills are documentation, not executable code — wrong claims produce no compile error,
no test failure, no CI signal. The wrongness propagates silently through every review
the skill participates in.

### Correction

Run the **Source Verification Checklist** (Pattern above) on every skill that names
repo-specific artifacts. Do this **before** the skill participates in any review.
