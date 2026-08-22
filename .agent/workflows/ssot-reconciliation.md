---
description: SSOT Conflict Resolution Workflow - Resolve architectural drift when code, documentation, and reality diverge.
---

# /ssot-reconciliation — SSOT Conflict Resolution Workflow

**Purpose:** Resolve architectural drift when code, documentation, and reality diverge.

> **Protection Rules**: See `.agent/patterns/ssot-preservation-template-guard.md` for the full protocol on protecting canonical SSOTs from template-driven overwrites.


---

## Steps at a Glance

| Step | Name                 | Goal                               |
|------|----------------------|------------------------------------|
| -1   | Coverage Check       | Confirm an SSoT exists at all (else → SSOT-001, not this workflow) |
| 1    | Knowledge Scan       | Gather all claims                  |
| 2    | Drift Detection      | Find contradictions                |
| 3    | Root Cause           | Understand why divergence happened |
| 4    | Authority Resolution | Choose correct version             |
| 5    | SSOT Hardening       | Update authoritative doc           |
| 6    | Doc Redaction        | Mark obsolete docs                 |
| 7    | Readiness Gate       | Confirm safe to proceed            |
| 8    | Memory Lock          | Add breadcrumbs                    |

---

## Modes

| Mode       | Purpose                                  | Entry                           |
| ---------- | ---------------------------------------- | ------------------------------- |
| `conflict` | Resolve contradictions (Steps 0-8 above) | Default: `/ssot-reconciliation` |
| `cascade`  | Update related docs from hub             | `/ssot-reconciliation cascade`  |

---

## Cascade Mode (Hub-Centric Updates)

> **When to Use**: Need to update multiple related docs for a module/topic change.
> **Purpose**: Auto-discover impacted docs from hub, apply updates systematically.
> **Enforcement**: Protocol #41 (Hub-First Search).

### Step C1: Define Scope

**Input**: User specifies module, topic, or specific file.

```
What is the scope of this update?
- Module: [Accounts/Expense/Ledger/Receivables]
- Topic: [e.g., "field locking", "validation rules"]
- File: [specific doc path, if known]
```

### Step C2: Discover from Hub

**Action**: Read `docs/DOCUMENTATION-INDEX.md`

1. Search **Semantic Domain Index** for topic
2. Search **Dependency Graph** for scope
3. Extract all related docs

```
Hub Lookup:
- Scope: Accounts Module
- Found in Dependency Graph: CONTRACT.json, SHEET_SCHEMAS.md, DATA_FLOW_MAP.md
- Impacted by: VALIDATION_Rules.md, Frontend validators
```

**If NOT found in hub:**

- Run grep as fallback
- Immediately add discovered doc to hub
- Log as "Hub Gap" (PIRR Category 15)

### Step C3: Impact Assessment

**Classify each discovered doc:**

| Doc                    | Impact Level | Update Needed?     |
| ---------------------- | ------------ | ------------------ |
| `CONTRACT.json`        | Direct       | YES – field added  |
| `SHEET_SCHEMAS.md`     | Direct       | YES – column added |
| `DATA_FLOW_MAP.md`     | Indirect     | MAYBE – review     |
| `FRONTEND_PATTERNS.md` | None         | NO                 |

### Step C4: Generate Update Plan

**Output**: Ordered list of updates

```markdown
## Cascade Update Plan

1. `CONTRACT.json` — Add new action schema
2. `SHEET_SCHEMAS.md` — Add column definition
3. `DATA_FLOW_MAP.md` — Update diagram
4. `DOCUMENTATION-INDEX.md` — Update Dependency Graph
```

### Step C5: Execute Updates

**Apply updates using `writing-technical-documentation` skill:**

1. Open each doc in order
2. Apply changes following hierarchy standard
3. Cross-reference related docs

### Step C6: Hub Maintenance

**After all updates:**

1. Update "Last Verified" dates in Dependency Graph
2. Add any new dependencies discovered
3. Remove stale entries if applicable

---

## Step -1 — Coverage Check (run before Step 0)

**Purpose**: Distinguish "sources disagree" (this workflow's actual job) from "no source exists"
(a different failure mode — SSOT-001, not a reconciliation).

```
Before treating this as a contradiction to resolve, ask:
Does an SSoT already exist for this subsystem at all — a single doc a `grep`-free
navigation (CLAUDE.md → hub → spoke) would land on?

If NO SSoT exists (not "two SSoTs disagree", but zero exist):
  This is a coverage gap, not a contradiction. Stop here.
  → Route to docs/protocols/SSOT-001.md and create the missing doc instead of
    running Steps 0-8 below, which assume ≥2 existing claims to compare.

If an SSoT exists but conflicts with code/other docs:
  Proceed to Step 0 — this is the contradiction case this workflow is built for.
```

> This workflow was previously silent on pure coverage gaps (a subsystem with 3+ scattered
> files but zero SSoT, and nothing contradicting anything because nothing claimed it existed).
> Origin: 2026-07-15, Recurring Checklists module shipped without an SSoT for several turns —
> this workflow ran at session-close and correctly found nothing to reconcile, because absence
> isn't a contradiction. See `docs/protocols/SSOT-001.md` for the coverage-side check.

---

## Step 0 — Trigger / Context Lock

**Purpose**: Pause all fixes, clearly state the observed inconsistency.

```
You are investigating a logic or behavior that appears inconsistent
across code and documentation.

Pause all fix recommendations.
State clearly:
1. What is the observed behavior
2. What is the expected behavior (per any doc or assumption)
3. Where the mismatch is visible (logs, UI, data, tests)

Do not propose solutions yet.
```

---

## Step 1 — Full Knowledge Scan

**Purpose**: Gather ALL claims from ALL sources without judgment.

```
Scan all relevant sources:
- SSOT docs (SHEET_SCHEMAS.md, ARCHITECTURE_*.md)
- Enhancement notes
- Debugging docs
- Inline code comments
- Git history (recent commits affecting this area)

Extract only:
- What each source claims is the correct logic
- Whether the source is authoritative, contextual, or historical

List contradictions explicitly. Do not resolve them yet.
```

> **If the reconciliation concerns a design token** (`--theme-*`, `--tc-*`, `--dt-*`, `--cic-*`) — do not scan `THEME-SYSTEM.md`'s claims by re-reading the CSS by hand. Query the derived source of truth first: `npm run query -- --token <name>` (regenerate first with `npm run cache:build:tokens` if it's more than a few commits stale). It answers "is this token actually defined, where, and is it consumed" without a fresh grep — and its orphan/phantom findings ARE pre-computed drift, which is exactly Step 2's job for this domain. `THEME-SYSTEM.md`'s prose is a claim about the CSS; the token map IS the CSS. When they disagree, the token map wins by construction (INC-062: a hand-maintained claim about a token's type was inverted from reality).

---

## Step 2 — Ambiguity & Drift Detection

**Purpose**: Identify specific conflicts and why they might mislead.

```
From the extracted claims, identify:
- Conflicting definitions of the same logic
- Documents that may mislead future readers
- Gaps or unstated assumptions
- Implicit assumptions in code that contradict docs

Produce a concise ambiguity list.
Do not choose a correct version yet.
```

> **Token-domain shortcut**: `.cache/token-map.json`'s `findings.orphans` (defined, never consumed — dead styling, INC-064 shape) and `findings.phantoms` (consumed, missing from some theme — INC-057/062/063 shape) are a standing, always-current ambiguity list for the entire token system. Check it before hand-tracing a suspected token conflict — remember its known limitation (phantom findings don't know consumer selector scope, so verify each one against the actual consuming rule before trusting it).

---

## Step 3 — Root Cause Archaeology

**Purpose**: Understand HOW the divergence occurred.

```
Trace when and why the divergent logic was introduced.

Check:
- Git commits / patches / enhancement references
- Original intent at time of change
- Whether change was intentional or accidental

Classify the cause:
- Workaround that was never cleaned up
- Partial refactor that didn't update all docs
- Legacy carryover from old system
- Intentional change with forgotten doc update

Identify any components depending on current behavior.
```

---

## Step 4 — Authority Resolution
> For sub-engine module boundary and shell delegation conflicts, see `.agent/patterns/sub-engine-shadowing-and-tab-reconciliation.md`.

**Purpose**: Make an explicit decision on what is correct.

```
Based on evidence, determine:
- Which logic should be the authoritative truth now
- Why this version is correct
- Why alternatives should be rejected

Document the rationale clearly.
Do not modify code yet.

Output format:
AUTHORITATIVE SOURCE: [File/Section]
REASON: [Why this is correct]
REJECTED ALTERNATIVES:
- [Alternative 1]: [Why rejected]
- [Alternative 2]: [Why rejected]
```

---

## Step 5 — SSOT Hardening

**Purpose**: Update the authoritative document to be unambiguous.

```
Update or propose updates to the SSOT to include:
- Final authoritative logic
- Precedence / fallback rules (if applicable)
- Common failure symptoms
- Clear debugging entry points
- Links to related docs

Ensure no interpretation is left implicit.
Mark the update date and reason.

Gating Rule: If the updated document is a Decision Record (ADR in docs/adr/):
- Apply the ADR Amendment vs. Supersession standard defined in docs/adr/README.md#adr-lifecycle
- For minor/mechanical corrections (e.g. file paths), amend the ADR in-place with a dated blockquote:
  > **AMENDED YYYY-MM-DD** (Reconciliation Context / Council Session <ref>): <rationale>
- For major reversals, create a new ADR that supersedes the old one.
```

---

## Step 6 — Documentation Redaction

**Purpose**: Prevent obsolete docs from misleading future readers.

```
Identify documents that contradict or dilute the SSOT.

For each:
- Mark as [HISTORICAL], [SUPERSEDED], or add banner:
  > ⚠️ **OUTDATED**: See [SSOT link] for current logic
- Add explicit pointers to the correct SSOT section
- Consider archiving/deleting if completely stale

Ensure no outdated doc can mislead a future reader.
```

**Mandatory mechanical sweep — do not "identify" by memory or intuition.** For every
name the resolution retired, renamed, or superseded (file, pipeline, token, class,
script, verdict), grep all guidance surfaces:

```bash
grep -rn "<retired-name>" .agent/workflows/ .agent/patterns/ .agent/skills/ docs/ CLAUDE.md GEMINI.md AGENTS.md
```

Classify every hit: **historical record** (dated incident docs, PIRRs, retired-systems
tables — leave as-is) vs. **live guidance** (debug tracks, protocol steps, decision
trees, SSOT claims — these WILL mislead the next reader and must be fixed now, in this
session). The intuition-based version of this step is exactly how `debug-frontend.md`
Track I stayed stale through five compliant TASK-218 sessions (2026-07-14): each session
updated the SSOT targets it *knew about*; nobody grepped for what else still referenced
the retired files, and the workflow doc kept routing agents to CSS files that no longer
existed and away from a token family whose deprecation had been formally reversed.

> **Trigger note (closes the reactive-only blind spot)**: This workflow normally fires on
> a *reported contradiction*. A retirement/supersession is a contradiction you just
> *created* — every doc still describing the old state is now wrong, whether or not
> anyone has tripped over it yet. So any session that retires or supersedes something
> runs **this Step 6 sweep directly**, without waiting for Steps 0-5 or a user report.
> (Same class of fix as Step -1, which closed the "absence isn't a contradiction" blind
> spot — this one closes "staleness nobody has hit yet isn't a contradiction.")

---

## Step 7 — Fix Readiness Gate

**Purpose**: Confirm it's safe to proceed with implementation.

```
Validate readiness to proceed with code changes.

Confirm:
- [ ] One unambiguous SSOT exists
- [ ] All conflicting docs are annotated or redirected
- [ ] Root cause is documented (for future reference)
- [ ] Risk areas are known
- [ ] Debugging path is obvious

State explicitly whether it is safe to proceed.

If NOT safe, list what's blocking.
```

Each box above must reflect an actual re-check performed in this session (re-read the doc, re-run the grep) — not memory of a conclusion reached in an earlier step. A checklist filled in from recollection, or a "verification" summary that was written to look like tool output without a command actually being run, is a gate failure equivalent to skipping Step 7 entirely (same failure class as the Council's fabricated wiring-check block, 2026-07-30 — see `Council_Ledger.md`).

---

## Step 8 — Memory Lock

**Purpose**: Leave breadcrumbs for future developers.

```
Add minimal but permanent references:
- Cross-links between SSOT, debugging docs, and enhancement records
- Short "Why this exists" notes in code comments if applicable
- Entry in PIRR_RECONCILIATION_LOG.md if significant

Optimize for future clarity without re-investigation.
```

---

## Guardrails

### ⛔ DO NOT:

- Propose code fixes before completing Step 4
- Skip root cause analysis (Step 3)
- Assume recency = correctness
- Create new docs without marking old ones

### ✅ SAFE to proceed when:

- Step 7 checklist is complete
- User has reviewed authority resolution (Step 4)
- SSOT has been updated (Step 5)

---

## Example Prompt to Trigger

> "I found conflicting information about [X]. Run `/ssot-reconciliation` starting from Step 0."

Or for specific steps:

> "Run Step 3 (Root Cause) for the variance formula conflict."

---

## Related Workflows

| Workflow                          | Relationship                                 |
| --------------------------------- | -------------------------------------------- |
| `/complex-architecture-blueprint` | Invokes this when conflicts found in Phase A |
| `/aos-session`                    | May reveal need for this during Phase A      |
| `/pirr`                           | Results from this workflow logged there      |
| `docs/protocols/SSOT-001.md`      | Handles the *absence* of an SSoT (Step -1 routes here); this workflow only handles *contradictions* between existing ones |
