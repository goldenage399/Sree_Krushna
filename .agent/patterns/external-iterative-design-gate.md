---
pattern: external-iterative-design-gate
activation_tier: reference          # reference | routed | guarded  (PACT-001)
status: HYPOTHESIS                   # HYPOTHESIS | VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []                         # not routed — pulled on-demand by the workflow above
guard: ""                            # not guarded — design process cannot be mechanically scanned
portability: universal               # universal | repo-specific  (cross-repo propagation)
canonical_source: task-dashboard
porting_effort: low
---

# External Iterative Design Gate — Patterns & Anti-Patterns

**Category**: UI Design Process · External Collaboration  
**Applies to**: Any multi-session external UI redesign using the `/external-ui-redesign` workflow  
**Origin**: Task-Dashboard Team Oversight redesign, 2026-06-12 — 4 iteration versions, Part 1 brief validation  
**Status**: HYPOTHESIS (validated on 1 iteration; upgrade to VALIDATED after 2nd project confirms)

---

## Pattern 1 — Component Registry as Anti-Regression Gate

### Problem
When a UI component is iteratively redesigned across multiple external sessions, each new iteration overwrites approved patterns. The external agent silently reverts decisions from prior rounds (e.g., reverting rich occupant objects back to plain strings) because it has no memory of what was approved and the brief never explicitly said "don't touch this."

### Why it happens
External agents (AI or human) have zero codebase context and zero session memory. Without a persistent record of approved patterns, every brief is interpreted as a blank-sheet request — even if it says "carry locked components forward."

### Solution — `COMPONENT_REGISTRY.md`

Maintain a registry file (internal — never sent to the external) with three layers:

**`✅ LOCKED`** — Approved components the external must carry forward verbatim:
- Function name + source file + line range
- Prose description of exact behaviour
- Verbatim code excerpt
- Concrete verification checklist (UI behaviours, not abstract rules)

**`🔄 PENDING`** — What exists but needs improvement in the next iteration:
- Specific change instructions
- Reference to the brief section that addresses it

**`🚫 REGRESSION BLACKLIST`** — Table of patterns explicitly removed:
- What the pattern was, what version it appeared in, why it was removed

**Update discipline** (at the end of every iteration):
- Promote newly approved patterns → `LOCKED`
- Resolve completed `PENDING` items → `LOCKED` or close
- Log any regressions that slipped through → `BLACKLIST`
- Update the version index with the new baseline filename

### Failure Mode
Registry created but not updated after first iteration. By iteration 3, a new approved pattern exists in code but not in the registry. The brief for iteration 4 doesn't mention it. The external overwrites it. Regression not caught until integration.

### Task-Dashboard instance
`User_Created/Discussion Threads/260612_Team-Tasks/COMPONENT_REGISTRY.md`  
10 LOCKED components, 6 PENDING items, 6 BLACKLIST entries as of 2026-06-12.

---

## Pattern 2 — Incremental External Design Brief (Inherit-First Format)

### Problem
External design briefs framed as "design this feature" cause the external agent to start from scratch — even when a working baseline exists. Prose like "carry locked components forward" is ignored because the external has no concrete mechanism for compliance.

### The rule
> A brief that does not name the exact file to open and the exact functions to leave unchanged will be treated as a blank-sheet request.

### Solution — Five mandatory brief sections

**STEP 0 — BEFORE YOU WRITE A SINGLE LINE** (always first)  
Explicit 3-step action: open named baseline file → copy to new named file → only then edit.  
File paths must be absolute. This makes "start from scratch" mechanically harder.

**🔴 DO NOT TOUCH**  
A table: component name | line range in baseline | what it does.  
Plus a 5-item verification checklist of concrete UI behaviours the agent can self-test.  
*Not abstract rules like "carry LOCK-003 forward" — concrete checks like "clicking a profile card opens the right-side drawer."*

**🟢 YOUR TASK — ADD ONLY**  
New work only, split into named ADD blocks.  
Each ADD includes:
- Exact state wiring code (not prose description of behaviour)
- The precise DOM location relative to existing elements where it is inserted

**🎭 Demo States**  
Two explicit named states to render (one default, one filtered/active).  
Gives the reviewer a concrete visual to validate against.

**✅ Definition of Done**  
Binary checklist the external checks before submitting.  
Must include the DO NOT TOUCH verification items — if those fail, the submission is rejected.

### Failure Mode
Brief provides correct state wiring code but uses stale line numbers from a previous baseline version. External copies code exactly, it conflicts with current structure, build fails. External defaults to a fresh implementation.

### Task-Dashboard instance
`User_Created/Discussion Threads/260612_Team-Tasks/` — scratch draft `Part1_Brief_Draft.md`  
Part 1 result: 0 regressions on first run, all 5 locked components preserved verbatim.

---

## Pattern 3 — Diff-as-Design-Review Gate

### Problem
Reviewing a complete redesign file top-to-bottom is slow (~30 min for 500 lines) and still misses regressions because the reviewer must remember what the baseline looked like. Reviewers over-index on additions and under-index on deletions.

### The rule
> A diff reads in 2 minutes and surfaces regressions mechanically. Full-file review reads in 30 minutes and surfaces regressions probabilistically.

### Solution — Structured diff review

```powershell
# Step 1: Ratio check (insertion/deletion ratio is the first signal)
git diff --no-index --stat -- <baseline> <result>

# Step 2: Full diff piped to key lines only
git diff --no-index -U3 -- <baseline> <result> 2>&1 | Select-String -Pattern "^(\+\+\+|---|@@|^[+-])"
```

**Categorize every hunk**:
- ✅ **New work** — expected additions matching the brief's ADD blocks
- ❌ **Regression** — any `+/-` lines inside a LOCKED component function body → auto-reject
- ⚠️ **Drift** — changes that are neither requested nor clearly regressions → flag for discussion

**Produce a structured verdict** (✅/⚠️/❌ per brief criterion) before any prose review.

**Red flags in the stat output**:
- Deletion-to-insertion ratio > 1:1 on a brief targeting 3 additions → likely over-rewrite
- Any deletions inside locked component line ranges → regression

### Failure Mode
Diff is run but reviewer focuses only on green (additions), skips red (deletions). A locked component has 3 lines deleted — looked like comments. Reviewer approves. Deletion breaks `pointer-events-none` dimming. Bug surfaces in integration.

### Task-Dashboard instance
Part 1 review: diff took 4 minutes, caught 3 issues (missing sticky positioning, weak empty state, orphan project tab) that would likely have been missed in a full read.

### Windows/PowerShell note
Files with spaces in their names require either quoting or a copy step first:
```powershell
Copy-Item "C:\path\file with spaces.tsx" -Destination "D:\repo\result_clean.tsx"
git diff --no-index -- baseline.jsx result_clean.tsx
```

---

## Anti-Pattern — Tabula-Rasa Brief Regression

### What it is
An incremental design brief written in outcome prose ("the header must be sticky, the tabs must filter cards") without referencing the baseline file or naming what must not change. The external interprets it as a fresh-design request and produces a complete rewrite.

### Symptoms
- Returned file has no imports or references from the baseline
- Locked components appear with different class names or restructured JSX
- Mock data objects regressed to simpler shapes (`occupants: ['Alex']` instead of `occupants: [{name, hoursLogged, active}]`)
- `git diff --stat` shows high deletion count (200+ deletions for a brief targeting 3 additions)

### Correction
Apply Pattern 2 (Incremental External Design Brief):
- Name the baseline file explicitly
- Provide the DO NOT TOUCH table  
- Give state wiring code, not prose

### This becomes more damaging over time
The anti-pattern is impossible on first iteration (no baseline). By iteration 5, a tabula-rasa brief discards 4 rounds of approved work.

---

## Worthiness Criteria (Task-Dashboard specific)

These patterns are included in this repo's `.agent/patterns/` because they meet this project's capture criteria:

| Criterion | Met? | Evidence |
|---|---|---|
| Emerged from real operational pressure | ✅ | Iterative brief without baseline anchor caused full rewrite of 4 approved versions |
| Corrects a pattern that was failing | ✅ | Replaces prose "carry forward" instructions with mechanical inheritance anchors |
| Non-obvious to a competent engineer | ✅ | Counter-intuitive: the brief needs to be MORE prescriptive, not less, to allow creativity in the right places |
| Relevant to this project's external UI workflow | ✅ | Task-Dashboard uses the external-ui-redesign workflow for Team Oversight and other complex pages |
| Validated in this codebase | ✅ | Part 1 brief draft → Part 1 result: 0 regressions confirmed via diff |

**What was NOT captured here (belongs in QSR portable library if ever needed)**:  
The abstract canonical schema versions. This file stays project-idiomatic.
