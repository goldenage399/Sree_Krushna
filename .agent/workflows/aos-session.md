---
description: Agent Operating System (AOS) session workflow - Phase A discovery and Phase C PIRR reconciliation
---

# AOS Session Workflow

> **Reference**: See [AGENT_OPERATING_SYSTEM.md](../../docs/AGENT_OPERATING_SYSTEM.md) for full documentation.

---

## Phase A — Starting Work

Tell your agent:

> "Before making changes, follow Phase A of the Agent Operating System."

The agent will:

1. Read `GEMINI.md` to locate relevant domains
2. Read primary docs for impacted domain (AUTHENTICATION, TASK-MANAGEMENT, etc.)
3. Read cross-cutting docs if applicable
4. Follow `codebase-navigation.md` search strategy

---

## Phase B — During Work

Ignore AOS completely. Just solve the problem.

---

## Phase C — Ending Work (PIRR)

### Quick Method

```powershell
# Windows/PowerShell
cd D:\GitHub_Repo\Task-Dashboard
git diff --staged > changes.txt
# Or if not staged:
git diff > changes.txt
```

Then paste the PIRR prompt:

```
Run the Agent Operating System – Phase C (PIRR).

Use `changes.txt` as the ground truth for what changed.
Use the architecture docs (GEMINI.md, AUTHENTICATION.md, etc.) as reference.

Detect SSOT-worthy changes,
reconcile documentation with implemented reality,
update SSOT docs and trackers,
and append reconciliation log entries using atomic append rules.
```

### Precondition ⚠️

A `git diff` **MUST** exist. No diff = No PIRR.

---

## Quick Reference

| Moment   | Action                                         |
| -------- | ---------------------------------------------- |
| Starting | "Follow Phase A of the Agent Operating System" |
| During   | Ignore AOS                                     |
| Ending   | `git diff > changes.txt` → PIRR prompt         |

---

## When to Run PIRR

- ✅ Session touched **multiple files**
- ✅ Fixed something subtle
- ✅ Before deployment
- ✅ Switching context

> If asking "should I run it?" → **Run it.**

---

## Related Workflows (Auto-Invoke When Relevant)

| During Phase A, if you need... | Invoke                                                 |
| ------------------------------ | ------------------------------------------------------ |
| Can't find a file/component    | `/codebase-navigation`                                 |
| Understanding data flow        | Read [DATA_FLOW_SSOT.md](../../docs/DATA_FLOW_SSOT.md) |
| Permission questions           | Read [AUTHENTICATION.md](../../docs/AUTHENTICATION.md) |

| During Phase B, if you hit... | Invoke                                                                      |
| ----------------------------- | --------------------------------------------------------------------------- |
| Any debugging                 | Read [DEBUGGING_HANDBOOK.md](../../docs/DEBUGGING_HANDBOOK.md)              |
| Changing shared code          | Run [PRE_CHANGE_CHECKLIST.md](../../docs/PRE_CHANGE_CHECKLIST.md) Phase 1-2 |
| Creating new feature          | `/new-module-creation`                                                      |

| During Phase C (PIRR)... | Reference                                                                     |
| ------------------------ | ----------------------------------------------------------------------------- |
| What categories to check | [IMPACT_HINTS.md](../IMPACT_HINTS.md)                                         |
| PIRR rules               | [SSOT_RECONCILIATION_PROTOCOL.md](../../docs/SSOT_RECONCILIATION_PROTOCOL.md) |
| Append to log            | [PIRR_RECONCILIATION_LOG.md](../../docs/PIRR_RECONCILIATION_LOG.md)           |

---

_Ported from Task-Dashboard: 2025-12-30_
