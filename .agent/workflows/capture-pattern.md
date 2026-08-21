---
description: Pattern Capture Workflow - Archive process discoveries and methodologies into persistent patterns.
rrm001_profile: worthiness-filter
---

# /capture-pattern — Pattern Capture Workflow

**Purpose**: Archive a validated process discovery into `.agent/patterns/` so it survives beyond
the current session and is reliably consumed by future agents.


**When to use**: You've just completed a multi-step workflow (debugging, redesign, incident response)
and noticed a *reusable methodology* — a way of running a process that worked, a failure mode that
recurs, or a design gate that should be checked every time.

---

## Step 0 — Worthiness Filter (run before writing anything)

A pattern is worth capturing if it meets at least 3 of these 4 criteria:

1. **Reusability**: Would this apply to ≥2 future tasks of the same type?
2. **Retention Cost**: Would a future agent re-derive this from scratch at significant cost?
3. **Non-Obviousness**: Is this non-obvious — something a careful agent *could* miss?
4. **Boundary Definition**: Does it define a clear decision boundary (when to apply / when not to)?

If < 3 criteria met → do not capture. Note the observation in `.agent/memory/event_stream.md` instead.

---

## Step 1 — Classify the Pattern Type

| Type | Description | Home |
|---|---|---|
| **Process Pattern** | A methodology for running a workflow correctly | `.agent/patterns/<name>.md` |
| **Design Gate** | A checkpoint that must pass before proceeding | `.agent/patterns/<name>.md` |
| **Anti-Pattern** | A named failure mode with symptoms and correction | `.agent/patterns/<name>.md` (as a section) |
| **Code Standard** | A scannable, enforceable rule about how code must be written | → Route to `/register-standard` instead |
| **Workflow Update** | An improvement to an existing agent workflow | → Edit the relevant `.agent/workflows/<name>.md` directly |

> If the answer is "Workflow Update" — stop here, edit the workflow file directly, and note the change in `.agent/memory/event_stream.md`.

---

## Step 2 — Check for Existing Coverage

Before creating anything:

```powershell
# Check existing patterns
Get-ChildItem .agent/patterns/ | Select-Object Name

# Check if the concept is already in a workflow
Select-String -Path ".agent/workflows/*.md" -Pattern "<keyword>"
```

If a match is found → **read it first**. Either extend it (add a new section) or confirm the new pattern is genuinely distinct.

---

## Step 3 — Write the Pattern File

Create or append to `.agent/patterns/<descriptive-name>.md`.

**Required frontmatter** — the Pattern Activation Contract (PACT-001). This is what the
`verify-governance-wiring` gate (P82) validates. A pattern with no contract = a hard failure
at session-close:

```yaml
---
pattern: <descriptive-name>          # must match the filename
activation_tier: reference          # reference | routed | guarded — decide in Step 3.5
status: HYPOTHESIS                    # HYPOTHESIS | VALIDATED
consumed_by:                          # ≥1 entry REQUIRED — the anti-orphan back-link
  - file: .agent/workflows/<consumer>.md
    at: "<phase/section where it is read>"
triggers: []                          # REQUIRED if activation_tier == routed
guard: ""                             # REQUIRED if activation_tier == guarded
portability: repo-specific            # universal | repo-specific (drives cross-repo propagation)
canonical_source: task-dashboard
porting_effort: low                   # low | medium | high
---
```

**Required sections** (all must be non-empty):

```markdown
# <Pattern Name>

**Category**: <Process | Design Gate | Anti-Pattern | Methodology>
**Applies to**: <Which workflows or contexts trigger this>
**Origin**: <Session date + what surfaced it — be specific>
**Status**: HYPOTHESIS | VALIDATED (VALIDATED = worked in ≥2 distinct contexts)

---

## Pattern — <Name>

### Problem
<What goes wrong without this pattern. One concrete failure scenario.>

### Why it happens
<Root cause — why the naive approach fails.>

### Solution
<The approach that works. Be specific: what to do, in what order, with what artifacts.>

### Failure Mode
<What breaks if this pattern is applied incorrectly or partially.>

### Task-Dashboard instance
<The specific file, session, or evidence from THIS project that validates it.>
```

**For Anti-Patterns**, use this structure instead:

```markdown
## Anti-Pattern — <Name>

### What it is
<Brief description of the bad pattern.>

### Symptoms
<Observable signals that this anti-pattern has occurred — concrete, checkable.>

### Why it fails
<Root cause explanation.>

### Correction
<What to do instead — reference the positive pattern if one exists.>
```

---

## Step 3.5 — Declare the Activation Contract (choose a tier)

> **This is the step that stops patterns from going inert.** A captured pattern is worthless
> until something *pulls* it. Pick the tier that matches how the pattern will actually be
> consumed, and do the matching wiring. The tier is a **graduation ladder** — a pattern can
> start at `reference` and graduate to `guarded` once it earns an executable check.

| Tier | Consumed by | Use when | Required wiring (verified by P82) |
|---|---|---|---|
| **`reference`** | A workflow that reads it on demand | The pattern is a *playbook* an agent follows when it runs a specific workflow (can't be mechanically scanned) | `consumed_by:` lists ≥1 workflow that **actually contains** `.agent/patterns/<name>.md` |
| **`routed`** | Natural-language detection, standalone | The pattern should surface on its **own keywords**, not only when a parent workflow runs | `reference` wiring **+** non-empty `triggers:` **+** a `skill-router.yaml` entry invoking `read .agent/patterns/<name>.md` |
| **`guarded`** | An executable check at preflight/lint | The pattern maps to a rule that can **fail a command** (ESLint, ast-grep, preflight) | `reference` wiring **+** `guard: "npm run <script>"` that resolves to a **real `package.json` script** |

**Decision aid:**
- Can it fail a command? → **`guarded`** (strongest — wire a PREFLIGHT row + guard script).
- Should "how do I do X" surface it by keyword? → **`routed`** (add triggers + router entry).
- Is it a process/design playbook only a workflow pulls? → **`reference`** (the honest default for methodology patterns).

---

## Step 4 — Wire the Contract (per the tier you chose)

The pattern exists because a workflow produced it. Close the loop **according to its tier** —
this is no longer optional prose, it is what P82 verifies:

1. **All tiers** — fill `consumed_by` and make the back-link real: open the consumer file
   (e.g. `.agent/workflows/external-ui-redesign.md`) and add a line pointing to the pattern:
   > "See `.agent/patterns/<name>.md` for the full protocol."
   The verifier confirms the consumer file **actually contains** that path (bidirectional check).

2. **If `routed`** — also add a `skill-router.yaml` entry so NL detection surfaces it standalone:
   ```yaml
   - id: pattern-<name>
     repo: [task-dashboard]
     triggers: ["<phrase one>", "<phrase two>"]
     cost: low
     invoke: read .agent/patterns/<name>.md
     when: "Surface the <name> pattern when its triggers are detected"
   ```

3. **If `guarded`** — also add a PREFLIGHT row routing the trigger files to this pattern + its
   guard command, and ensure the `guard:` script exists in `package.json`.

4. **Update the index** — add a row to `.agent/patterns/README.md`.

5. If the pattern affects agent behavior at session-start → note it in `.agent/memory/decisions.md`.

---

## Step 4.5 — Discoverability Self-Check (DISC-001)

> **Purpose**: Ensure a future agent can find this pattern without grep-hunting through source files. A pattern that requires greping is effectively invisible.

Ask all three questions. All must be YES before proceeding to Step 5:

- [ ] **SSOT → Source (1-hop)**: Is there an FKL-indexed entry in a spoke doc (or a row in `.agent/patterns/README.md`) that names the exact file and line where this pattern is implemented or enforced?
- [ ] **Source → SSOT (back-link)**: Does the source file (CSS, JS, JSX, or pattern file) contain a comment pointing back to that SSOT entry? (e.g., `/* SSOT: docs/ssot/... § "<section>" */`)
- [ ] **Zero-grep reachability**: Starting from `AGENTS.md → GEMINI.md → relevant hub → spoke`, could an agent reach both the rule and its source in ≤3 clicks, with no `grep` required?

If any answer is NO:
1. Add the missing SSOT entry (with FKL ID) **or** add the back-link comment to the source file — whichever is absent.
2. Re-answer all three questions.

> [!NOTE]
> This check is what prevents the "invisible breakpoint" failure mode: a custom CSS class registered nowhere in docs, discovered only by grepping `src/` after 10 wasted tool calls.

---

## Step 5 — Quality Gate

Before declaring done:

- [ ] Pattern passes worthiness filter (Step 0) — at least 3/4
- [ ] No duplicate of an existing pattern (Step 2 check done)
- [ ] **PACT-001 frontmatter present** — `activation_tier`, `status`, ≥1 `consumed_by`
- [ ] All required sections filled — no empty `Problem` or `Failure Mode`
- [ ] `Status` field is honest (`HYPOTHESIS` unless genuinely tested in 2+ contexts)
- [ ] At least one `Task-Dashboard instance` entry with a specific file or session reference
- [ ] Tier wiring done (Step 4) — back-link real; router entry if `routed`; guard if `guarded`
- [ ] `.agent/patterns/README.md` index updated
- [ ] **Discoverability Self-Check passed (Step 4.5 — DISC-001)** — SSOT→Source and Source→SSOT both verified; zero-grep reachable
- [ ] **`npm run verify:governance-wiring` passes** — the contract is green (P82 gate)
- [ ] If an anti-pattern was captured, the corrective positive pattern is also documented

---

## Step 6 — Output Report

After completing the capture, report in this format:

```
EVALUATED:  <N> candidate patterns from <source/session>
CAPTURED:   <N> patterns
REJECTED:   <N> — <brief reason>

→ .agent/patterns/<filename>.md
ADDED:      <Pattern name> — <Category · Status>
ADDED:      <Anti-pattern name> — <Anti-Pattern · Status>

→ .agent/workflows/<filename>.md
UPDATED:    <Phase or section updated> — <what changed>

CASCADED:   <other file if applicable> — <what changed>
```

---

## Relationship to Other Workflows

| Workflow | When to use |
|---|---|
| `/capture-pattern` (this) | Process/methodology discovery → `.agent/patterns/` |
| `/register-standard` | Code pattern → `standards-catalog.json` + `violation-patterns.json` |
| `/enh-update` | Feature progress → `enhancement-notes/` tracker |
| `/run-pirr` | Post-implementation reconciliation → SSOT sync |
| `/aos-session-close` | End of session → memory flush, this workflow is a sub-step |
