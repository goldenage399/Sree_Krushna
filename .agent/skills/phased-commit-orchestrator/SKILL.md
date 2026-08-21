---
name: phased-commit-orchestrator
description: >
  Orchestrates the Intelligent Phased Commit Method for clean, logical commits.
  Use when user asks to "commit", "push", or has uncommitted files.
  Ensures PIRR checkpoint, relationship analysis, and user approval for conflicts.
---

## Goal

Transform messy uncommitted changes into logical, reviewable commit phases.

## The 6-Phase Process

### Phase 0: PIRR Checkpoint (MANDATORY)

Before ANY commit analysis:

1. Schema changes? → `SHEET_SCHEMAS.md` updated?
2. New functions? → `CORE_FUNCTION_INDEX.md` updated?
3. New SSOT? → `DOCUMENTATION_HUB.md` updated?
4. Config changes? → Comments updated?

**If incomplete**: Run `pirr-compliance` skill FIRST.

### Phase 0.5: Performance Guardrails (Protocol #33)

Before allowing ANY backend commit, scan for **Loop-I/O violations**:

```powershell
# Windows (PowerShell)
Get-ChildItem -Recurse backend/src/*.js | Select-String -Pattern "(for|while|map|forEach).*(SpreadsheetApp|DriveApp|UrlFetchApp|\.getRange|\.setValue)"

# Unix / Git Bash
grep -nE "(for|while|map|forEach).*(SpreadsheetApp|DriveApp|UrlFetchApp|\.getRange|\.setValue)" backend/src/**/*.js
```

**If matches found**:
1. 🛑 **PAUSE** (not auto-block). Matches require **MANUAL VERIFICATION**.
2. **REPORT**: "Potential Loop-I/O detected at [File:Line]."
3. **VERIFY**: Open the file and check if I/O is ACTUALLY inside the loop body:
   - ✅ **True Positive**: I/O call is inside `for`/`while`/`forEach` body → Must refactor
   - ❌ **False Positive**: I/O on same line as loop keyword but NOT in loop body → OK to proceed
   - ❌ **False Positive**: I/O in error handler, not the loop iteration path → OK to proceed
4. **MANDATE** (if true positive): "Refactor to use Data-First Context Loading (bulk read before loop) before committing."

> **Known False Positives**: Single-line regex can't detect multi-line loop bodies. Always verify context.


### Phase 1: Discovery

```bash
git status --short
```

Categorize files:

- Source code (`.js`, `.py`)
- Documentation (`.md`)
- Configuration (`.json`, `config`)
- Tests (`99_TestScripts*`, `*Test.js`)
- Assets (`.css`, images)

### Phase 2: Relationship Analysis

For each file, ask:

- What feature does this belong to?
- What other files does it import/reference?
- Was it changed together with other files historically?

### Phase 3: Relationship Mapping

Create ASCII tree diagram:

```
Session Theme: [Describe focus]

Group 1: [Feature Name]
├── path/to/file.js (core logic)
├── docs/related.md (documents it)
└── tests/test.js (tests it)

Group N: User Scratch (EXCLUDE)
└── User_Created/ConsoleLog.md (debug logs)
```

### Phase 4: Commit Strategy

Order commits logically:

1. **Foundation**: Config, shared utilities
2. **Feature**: Complete features with all files
3. **Documentation**: Docs that span features
4. **Tests**: Test files
5. **Polish**: Minor fixes

### Phase 5: Execution

Generate commands:

```bash
git add [files]
git commit -m "feat: descriptive message"
```

### Phase 5.5: Remote Sync

**CRITICAL**: Commit FIRST, then pull.

- Creates restore point before merge
- If conflict: STOP and ask user for resolution choice

## Conflict Resolution Protocol

🛑 **NEVER resolve conflicts unilaterally.**

1. Show both versions (LOCAL vs REMOTE)
2. Present options:
   - Keep LOCAL
   - Keep REMOTE
   - Merge manually (show proposed merge)
3. Wait for user approval
4. Only then apply resolution

## Scratch File Exclusion

**ALWAYS EXCLUDE**:

- `ConsoleLog.md`, `Error.md` (debug output)
- `*.scratch.md`, `*.draft.md`
- Session-specific debugging files

**INCLUDE**:

- `User_Created/TSO/*.md` (session transcripts with PIO-XXX context)
- Reusable prompts/tools

## ❌ Example Violation

**User**: "Commit everything."

**Agent (Bad)**: `git add . && git commit -m "update"`

**This skill STOPS**: "Let me analyze relationships first. I found 3 logical groups..."

## ➡️ What's Next?

After commits complete:

- Run **`gas-deploy-guard`** if backend changes → safe deployment
- Run **`pirr-compliance`** → verify nothing was missed
