---
pattern: automation-safety-protocol
origin_cap: CAP-038
tier: universal
applies_to:
  - "Automated code refactoring"
  - "Bulk file modifications"
  - "Agentic AI workflows"
prereqs:
  - "Version Control System (Git)"
porting_effort: low
canonical_source: GEMINI.md
last_reviewed: 2026-04-21
description: "Incremental validation and self-reflection debugging."
---

# Portable Workflow: Automation Safety & Debugging

**Purpose:** AI agents and automated scripts can perform massive edits instantly, but unverified automation can create cascading failures that take hours to recover from. This protocol ensures safe execution of bulk changes and establishes a baseline for self-reflective debugging.

---

## 1. Safe Automation Protocol (Protocol #54)

**Constraint:** NEVER execute an automated refactor or bulk edit across more than 5 files without incremental validation.
**Why:** A simple context-unaware replacement (e.g., regex mismatch) applied to 150 files can instantly create 50+ syntax errors. The time spent recovering from an automated error is often exponential compared to the time saved by the automation.

**Pattern (The Incremental Automation):**
1. **Scope:** Define precisely which files and changes are involved.
2. **Validate Small:** Apply the automation to 1-2 files first. Review the diff.
3. **Test Incrementally:** Move from 1 file → a batch of 5 files → all files.
4. **Monitor:** Verify tests and builds pass at each increment.
5. **Rollback Plan:** Ensure Git is clean before starting so you can easily run `git reset --hard`.

---

## 2. Self-Reflection Debugging (Protocol #54b)

**Constraint:** When facing an unexpected error or system failure during development, you must audit your recent actions before blaming the host system.
**Why:** Agents often assume the underlying framework, compiler, or host system is broken. In 99% of cases, the error was triggered by a recent script execution, state file creation, or code edit performed by the agent.

**Pattern (The Self-Reflection Questions):**
Before making external assumptions or pursuing complex workarounds, ask and answer:
1. *"What did WE just do that might cause this?"* - Check the last 3 tool executions.
2. *"What files were just modified or created?"* - Audit recent file system changes.
3. *"Could our automation trigger host system responses?"* - e.g., Did a generated state file trigger a file watcher loop?
4. *"When exactly did the problem start?"* - Correlate the failure timestamp with your action logs.
