---
name: memory-session-loader
description: >
  Loads persistent memory context at session start. Reads .agent\memory\ files to recall
  prior file reads, decisions, and active plans. Triggered before AOS Phase A discovery.
---

# Memory Session Loader Skill

## 📌 Purpose

Load the agent's persistent memory at the start of each work session to:
1. Recall recently read files and their purposes
2. Review recent decisions and their rationale
3. Check active plans and current status
4. Avoid re-discovery and context amnesia

---

## 🎯 Trigger

**When**: Start of any work session (before AOS Phase A).

**How to invoke**: Agent reads `.agent\memory\` files as first action of session.

---

## 📋 Loading Procedure

### Step 1: ~~Read File Reads Log~~ (RETIRED 2026-06-10)

`file_reads.md` is retired (write-only log, no downstream reader). Skip — start at Step 2.

### Step 2: Read Decisions Log (Last 5)

```markdown
# Read: memory/decisions.md
# Extract: Last 5 entries only (token budget)
```

Review recent decisions to understand:
- What approaches were chosen
- Why alternatives were rejected
- What constraints are in play

### Step 3: Read Active Plans

```markdown
# Read: memory/plans.md
# Extract: Active Plans section only (skip Completed)
```

Check current work status:
- Any in-progress tasks?
- What are the next steps?
- Any blockers noted?

### Step 4: Load JSON Metadata (Full)

```markdown
# Read: memory/file_meta.json
# Read: memory/dependencies.json
# These are small, load fully
```

### Step 5: Check Verification Debt

```markdown
# Read: memory/verification_debt.json
# If debt_items.length > 0: Surface warning
```

If verification debt exists:
- Surface warning to user immediately
- List items with their tier (T4 = critical)
- Note: User can acknowledge and proceed, or address debt first

### Step 6: Write Session Open Signal

Write a JSON file to `.agent/session/session_opened.json` containing:

```json
{
  "sessionOpenedAt": "YYYY-MM-DDTHH:MM:SSZ",
  "verificationDebtChecked": true
}
```

This serves as the mechanical proof (for preflight-gate) that memory loading occurred in this session.

---

## 📊 Output Format

After loading, produce a brief summary (~200 tokens max):

```markdown
## 🧠 Memory Context Loaded

### Recent File Reads (Last 10)
- `path/to/file1.js`: Purpose
- `path/to/file2.md`: Purpose
...

### Recent Decisions (Last 5)
- **Decision 1**: Brief summary
- **Decision 2**: Brief summary
...

### Active Plans
- Plan: [Title] — Status: [In Progress/Pending]

### Verification Debt
- ⚠️ {N} items pending verification (T4 = unverified)
- [List items if any]

### Ready to proceed with discovery.
```

---

## ⚠️ Token Budget

| Source | Max Entries | Approx Tokens |
|--------|-------------|---------------|
| `decisions.md` | 5 | ~75 |
| `plans.md` | Active only | ~50 |
| JSON files | Full | ~50 |
| `verification_debt.json` | Full | ~25 |
| **Total** | — | **~200** |

> [!TIP]
> If memory files are large, only read the tail (recent entries).

---

## ❌ Anti-Patterns

| Anti-Pattern | Why It's Wrong |
|--------------|----------------|
| Skipping memory load | Causes context amnesia, repeated discovery |
| Loading full file history | Exceeds token budget, bloats context |
| Not summarizing | Raw dump overwhelms working memory |

---

## 🔗 Integration Points

### AOS Integration

- **Phase A0.5**: This skill is invoked as the first step of any session.
- **Trigger**: Agent should run this before `A1. Assessment & Discovery`.

### Protocol Reference

- **Protocol #38**: Memory System Maintenance (enforces this skill).

### Related Skills

- `memory-file-logger`: Logs files after reading (runs during session)
- `memory-decision-logger`: Logs decisions (runs during session)
- `memory-session-end`: Syncs memory at end (runs at PIRR)

---

## ✅ Validation Checklist

After running this skill, verify:

1. [ ] All 7 memory files were checked (4 .md + 3 .json)
2. [ ] Summary produced is under 350 tokens
3. [ ] Active plans identified (if any)
4. [ ] Verification debt surfaced (if any)
5. [ ] Ready to proceed with discovery
