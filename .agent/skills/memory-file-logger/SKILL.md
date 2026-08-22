---
name: memory-file-logger
description: >
  RETIRED (2026-06-10). Logged file reads to .agent\memory\file_reads.md — retired as write-only
  memory with no downstream reader. Do not invoke.
---

# Memory File Logger Skill — 🕰️ RETIRED (2026-06-10)

> **Status**: Retired per URP-001. `file_reads.md` was append-only with no consumer; the logging cost tokens every session and changed no downstream behavior. Decisions and verification tiers remain the canonical session memory (`memory-decision-logger`, `memory-verification-logger`).
> **Historical version**: `git log --follow -- .agent/skills/memory-file-logger/SKILL.md`

## 📌 Purpose

Automatically log file reads to persistent memory while:
1. Filtering out irrelevant files (node_modules, .git, etc.)
2. Deduplicating reads within the same session
3. Capturing meaningful summaries (not raw content)

---

## 🎯 Trigger

**When**: After any `view_file` or `view_file_outline` call on a project file.

**Scope**: Only files matching the include rules below.

---

## 📋 Scope Filter Rules

### ✅ Include Paths (Log These)

```
backend/src/**
public/js/**
public/css/**
docs/**
.agent/**
memory/**
enhancement-notes/**
*.md (at project root)
```

### ❌ Exclude Paths (Never Log)

```
node_modules/**
.git/**
build/**
dist/**
coverage/**
venv/**
__pycache__/**
*.lock
*.log
package-lock.json
.clasp.json
```

### 🔄 Deduplication Rule

Log each file **only once per session** unless:
- The file was modified since last read
- Agent explicitly re-reads for updated content

Track logged files in session state (mental note or working memory).

---

## 📝 Entry Format

```markdown
- [YYYY-MM-DD HH:MM] `relative/path/to/file` (module: X, type: Y): Brief purpose.
```

### Field Definitions

| Field | Values | Example |
|-------|--------|---------|
| `module` | expense, accounts, ledger, governance, frontend, backend | `expense` |
| `type` | source, config, doc, test, style | `source` |
| `purpose` | 1-line summary of what was learned | "Contains router actions for Expense module" |

### Example Entries

```markdown
- [2026-01-27 14:30] `backend/src/02_Router.js` (module: backend, type: source): Main API router with action dispatch.
- [2026-01-27 14:32] `docs/DOCUMENTATION_HUB.md` (module: governance, type: doc): Index of all SSOT documents by domain.
- [2026-01-27 14:35] `.agent/workflows/aos-session.md` (module: governance, type: doc): AOS workflow with Phase A/B/C.
```

---

## 🔧 Logging Procedure

### Step 1: Check Scope

```
Is file path in INCLUDE list?
├─ NO → Skip logging (silent)
└─ YES → Continue to Step 2
```

### Step 2: Check Exclusion

```
Is file path in EXCLUDE list?
├─ YES → Skip logging (silent)
└─ NO → Continue to Step 3
```

### Step 3: Check Deduplication

```
Was this file already logged this session?
├─ YES → Skip logging (silent)
└─ NO → Continue to Step 4
```

### Step 4: Generate Entry

1. Extract relative path from project root
2. Infer module from path (e.g., `backend/src/modules/expense/*` → `expense`)
3. Infer type from extension/path (e.g., `.js` in `src/` → `source`)
4. Write 1-line purpose summary

### Step 5: Append to Memory

Append entry to `memory/file_reads.md` under `## Entries`.

---

## 📊 Module Inference Rules

| Path Pattern | Module |
|--------------|--------|
| `backend/src/modules/expense/*` | expense |
| `backend/src/modules/accounts/*` | accounts |
| `backend/src/modules/ledger/*` | ledger |
| `backend/src/00_*.js` | infrastructure |
| `public/js/modules/expense/*` | expense-frontend |
| `public/js/modules/accounts/*` | accounts-frontend |
| `docs/*` | governance |
| `.agent/*` | governance |
| `enhancement-notes/*` | enhancement |

## 📊 Type Inference Rules

| Extension/Path | Type |
|----------------|------|
| `*.js` in `src/` | source |
| `*.js` in `public/js/` | frontend |
| `*.css` | style |
| `*.md` | doc |
| `*.json` in `docs/` | config |
| `99_TestScripts_*.js` | test |
| `SKILL.md` | skill |

---

## ❌ Anti-Patterns

| Anti-Pattern | Why It's Wrong |
|--------------|----------------|
| Logging `node_modules/` | Wastes tokens, irrelevant to project |
| Logging without deduplication | Bloats memory with repeated entries |
| Logging full file content | Overloads context budget |
| Skipping all logging | Causes future context amnesia |

---

## 🔗 Integration Points

### Protocol Reference

- **Protocol #38**: Memory System Maintenance (enforces this skill).

### Related Skills

- `memory-session-loader`: Loads memory at session start
- `memory-decision-logger`: Logs decisions
- `memory-session-end`: Syncs at session end

---

## ✅ Validation Checklist

When logging a file, verify:

1. [ ] File matches include paths
2. [ ] File does NOT match exclude paths
3. [ ] File not already logged this session
4. [ ] Entry follows format: `[timestamp] path (module, type): purpose`
5. [ ] Entry appended to `memory/file_reads.md`
