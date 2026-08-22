---
description: Enhancement Protocol for creating tracked enhancement notes
---

# Enhancement Protocol Workflow

// turbo-all

## When to Use

Use this workflow when:

- Creating new enhancements from PRD/vision documents
- Converting implementation plans to tracked enhancements
- Formalizing feature requests into the Enhancement Registry

## Enhancement File Pattern

### Location

```
docs/enhancements/ENH-[CATEGORY]-[NUMBER]-[KEBAB-CASE-TITLE].md
```

### Categories

- `INFRA` - Infrastructure/Architecture
- `UI` - User Interface
- `GOV` - Governance/Process
- `FEATURE` - New Features

### Example

```
docs/enhancements/ENH-INFRA-052-CODEBASE-REUSABILITY-MODULARIZATION.md
```

## Required Sections

1. **Enhancement Metadata** - ID, Priority, Status, Effort, Timeline
2. **Enhancement Overview** - Objective, Business Value
3. **Current State Baseline** - Metrics table
4. **Implementation Phases** - With effort & status per task
5. **Validation Gates** - Per-phase success criteria (see structure below)
6. **Risk Management** - Identified risks & mitigations
7. **Decision Log** - Decisions with rationale
8. **Related Documents** - Links to supporting docs
9. **Progress Tracking** - Weekly metrics table
10. **Success Criteria** - Checklist of completion criteria

## Validation Gates Structure (Mandatory)

Every implementation phase must end with a **Validation Gate** and a **Decision Node**. Free-form "verify that..." prose is not valid.

### Required format per phase

```markdown
### Phase N: [Phase Title]
- [ ] Step 1: ...
- [ ] Step 2: ...

**🔍 Validation Gate** (max 2 binary checks):
  1. (Binary) `<command or DOM/state check>` → must return `<exact expected value>`
  2. [human-review] `<visual or UX check>` *(advisory — does not block phase completion)*

**🚦 Decision Node**:
  - **Pass**: Mark phase complete, proceed to Phase N+1.
  - **Fail (1st)**: `<specific rollback command or targeted debug action>`. Re-execute gate.
  - **Fail (2nd)**: Halt. Surface to user with observed output before continuing.
```

### Gate check classification

| Check type | Binary? | Gate-eligible? |
|---|---|---|
| CLI / script exit code or output | Yes | ✅ Yes |
| DOM state (`data-testid`, React state) | Yes | ✅ Yes |
| Visual / layout appearance | No | `[human-review]` advisory only |
| Multi-step UX interaction | No | Split into sub-steps or demote to advisory |

### Constraints

- **Max 2 gate checks per phase.** More than 2 signals the phase should be split.
- **Fail (1st)** must name a specific command or action — not "investigate".
- **Fail (2nd)** must always escalate to the user. No silent retries beyond one.
- **Before designing a second consumer of an existing page's rich UI** (deep-linking a new
  page's modal state, or reusing another page's list/cockpit UI for different-scoped data) —
  read `.agent/patterns/deep-link-hook-composition.md` first. Compose a thin wrapper around the
  existing state hook rather than modifying it; keep data-fetching hooks separate per consumer.
- **Before designing a recurring/scheduled feature** (daily/weekly/monthly instances, digests,
  reminders) — read `.agent/patterns/lazy-periodic-instance-generation.md` first. This repo is on
  the Spark plan; Cloud Scheduler/Functions v2 are unavailable, so recurring records must be
  lazily materialized on read (deterministic period key + doc ID), not cron-generated.

## SSOT-001 Completion Gate (Mandatory)

Before declaring an enhancement done, run the coverage check from `docs/protocols/SSOT-001.md` —
this is separate from (and not covered by) `/ssot-reconciliation` or `/post-incident-governance`,
which only fire on contradictions or incidents, never on missing coverage:

- [ ] Does this enhancement's subsystem now span 3+ files (service, page/component, rules, tests,
      pattern files) with no single doc explaining what it is and why it exists?
- [ ] If yes: create `docs/<TOPIC>.md` per the 7-section structure in `docs/protocols/SSOT-001.md`,
      and register it in **both** `CLAUDE.md` (Documentation Map + a "When Working on X" pointer)
      and `docs/DOCUMENTATION-INDEX.md` (with trigger words). A doc that exists but isn't linked
      from either entry point still fails this gate.
- [ ] If no: note in the Decision Log why the threshold wasn't met (e.g. "single file, no
      standalone concept — covered by existing cluster entry").

## Complexity Assessment

```yaml
simple_enhancement:
  criteria: "<200 lines, <3 phases, <3 files"
  documentation: "Cluster file entry only"

moderate_enhancement:
  criteria: "3-4 phases, standard testing"
  documentation: "Cluster entry + brief notes"

complex_enhancement:
  criteria: ">4 phases, architecture changes, comprehensive testing"
  documentation: "Dedicated enhancement file + implementation guide"
```

## Reference Protocol

```
docs/protocols/ENHANCEMENT-IMPLEMENTATION-FILE-PATTERN.md
```

## Quick Start

1. Determine complexity (simple/moderate/complex)
2. Assign Enhancement ID: `ENH-[CATEGORY]-[NUMBER]`
3. Create file in `docs/enhancements/`
4. Fill required sections
5. Link to supporting documents (architecture analysis, data flow, etc.)
6. Run the SSOT-001 Completion Gate before declaring done
