---
pattern: proxy-signal-verdicts
activation_tier: routed
triggers:
  - "is this dead code"
  - "safe to delete"
  - "can we remove this"
  - "retire this file"
  - "consolidate these files"
  - "merge these files"
  - "this looks like a duplicate"
  - "nothing uses this"
  - "unused token"
  - "unused export"
  - "stale file"
  - "which one is canonical"
  - "delete the redundant one"
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

# Pattern: Proxy-Signal Verdicts (Verify Before You Delete)

**ID**: `proxy-signal-verdicts`
**Type**: Process / Investigation discipline
**Severity**: Critical (each instance was one command away from shipping a regression)
**Origin**: TASK-218 / TAP-001 — see [PIRR](../../enhancement-notes/TASK-218-Token-Architecture-Stabilization-Program/08_PIRR.md)

---

## The rule

> **Do not act on a proxy for the fact. Measure the fact.**
>
> And measure it **immediately before editing** — not once, three phases earlier.

A *proxy signal* is something cheap and adjacent that feels like evidence: an import count, a filename, a file's modification time, a doc comment, a self-description in a header. Proxies are fine for **forming a hypothesis**. They are never sufficient for **destroying something**.

## Why this pattern exists

TASK-218 was a six-phase, evidence-gated architecture program *explicitly designed* to prevent premature action. It still produced **five confident, wrong verdicts** — every one from a proxy signal, every one caught only because Phase 6 re-verified instead of trusting Phase 1-4:

| Verdict (from a proxy) | The proxy used | The actual fact |
| :--- | :--- | :--- |
| "`--tc-*` is dead migration debt, 2 importers — retire it" | count of files importing the **definition** file | **~1,500 live usages** across 16 files. It counted definition-importers, not variable-**consumers**. Retiring it would have destroyed the component styling layer. |
| "The two theme CSS files are duplicates — delete one" | near-identical **filenames**; both headers self-describe as canonical | **~90% disjoint** (59 vs 15 utility classes, zero overlap). Deleting either destroys live production classes. |
| "`tokens/generated/` is 8 months stale — repoint off it" | filesystem **mtime** | mtime is reset by checkout/clone; an invalid signal here. The two trees also had **incompatible shapes**, so the "one-line import swap" never existed. |
| "theme-isolation CSS is wrongly loaded in prod — gate it" | it's imported unconditionally for a "dev-only" concern | It is **selector-scoped and inert**, and gating it would have **broken the real `/preview/*` production routes**. The proposed fix *was* the regression. |
| "Retire `--tc-*` into `--theme-*`" (a ratified Council decision) | both "are colour tokens" | **Category error.** `--tc-*` is `:root`-only/static; `--theme-*` is per-`[data-theme]`. Neither can absorb the other. |

Plus two last-second catches:
- Nearly deleted `test-generation.js` — it tests a **live** util the surviving generator still uses.
- Nearly stripped an `!important` — but its file loads **first**, so removing it would have let the *gradients* win, silently inverting the ratified decision **while looking like a cleanup**.

## The discipline

Before deleting, merging, or "consolidating" anything:

- [ ] **Measure consumption, not declaration.** `grep` for actual **usage** (`var(--x)`, call sites, imports of the *symbol*), not for who imports the file that defines it.
- [ ] **Diff content, not names.** Two things with similar names are not the same thing. Two things with different names may be.
- [ ] **Never trust filesystem metadata** (mtime, ctime) as evidence of freshness in a git working tree.
- [ ] **Never trust a header comment or doc claim about the code.** Read the code. (In INC-062 the guard's own comment was exactly backwards.)
- [ ] **Check load/cascade/execution order.** Twice in TASK-218 the correct action depended on which file loads first — invisible in the diff.
- [ ] **Re-verify at the moment of the edit.** A fact established three phases ago is a hypothesis again by the time you act on it.
- [ ] **Prove the negative before deleting.** "Nothing uses this" is a claim. Demonstrate it (empirically: instrument it, run it, watch it not fire) — don't infer it.

## Litmus

> *"If I am wrong about this, what breaks — and would I find out before the user does?"*

If the answer is "the user finds out", you do not have evidence yet. Go measure the fact.
