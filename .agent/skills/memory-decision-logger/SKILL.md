---
name: memory-decision-logger
description: >
  Logs key decisions to .agent\memory\decisions.md with rationale and alternatives.
  Triggered on implementation choices, architectural decisions, approach rejections.
---

# Memory Decision Logger Skill

## 📌 Purpose

Capture key decisions with their rationale to:
1. Avoid revisiting the same decision later
2. Provide context for future sessions
3. Document why alternatives were rejected

---

## 🎯 Trigger

**When**: After making a significant decision (heuristically detected).

### Heuristic Triggers

| Trigger | Example |
|---------|---------|
| **Choosing between alternatives** | "Use phased rollout vs. big bang" |
| **Creating/modifying implementation plan** | "Plan structure decision" |
| **Rejecting an approach** | "Not using React because..." |
| **Architectural choice** | "Put this in infrastructure vs. module" |
| **Tool/library selection** | "Use existing pattern, not new library" |
| **Scope decision** | "Defer Phase 2 to future work" |

### NOT a Trigger

| Non-Trigger | Why |
|-------------|-----|
| Routine code edits | Too granular |
| Fixing typos | Not a decision |
| Following existing patterns | No choice made |
| Answering questions | Not an implementation decision |

---

## 📝 Entry Format

```markdown
- [YYYY-MM-DD HH:MM] **Decision**: Description.
  - **Rationale**: Why this choice was made.
  - **Alternatives**: Other options considered (if any).
```

### Example Entries

```markdown
- [2026-01-27 14:30] **Decision**: Use 4-skill architecture for memory enforcement.
  - **Rationale**: Skills provide event-driven triggers. More robust than relying on agent willpower.
  - **Alternatives**:
    1. Protocol-only (weaker enforcement)
    2. Single monolithic skill (less granular)
    3. Tool wrappers (not possible in this IDE)

- [2026-01-27 14:45] **Decision**: Adopt phased rollout with scoped file logging.
  - **Rationale**: External reviewer identified context overload risk.
  - **Alternatives**:
    1. Log everything (rejected: token overload)
    2. Skip file logging (rejected: loses context value)
```

---

## 🔲 Checkpoint Lifecycle Logging

> **Contract Reference**: [STRICT_MODE_MEMORY_CONTRACT.md](../../governance/STRICT_MODE_MEMORY_CONTRACT.md)

### When to Log Checkpoints

| Event | Log Entry |
|-------|-----------|
| Checkpoint created | `[CREATE] CHKPT-PHASE-TIMESTAMP-HASH` |
| Checkpoint suspended | `[SUSPEND] CHKPT-xxx - reason: <reason>` |
| Checkpoint resumed | `[RESUME] CHKPT-xxx` |
| Checkpoint resolved | `[RESOLVE] CHKPT-xxx - selection: A/B/C` |

### Checkpoint Entry Format

```markdown
- [YYYY-MM-DD HH:MM] **[EVENT]** `CHKPT-PHASE-TIMESTAMP-HASH`
  - **Phase**: DISCOVERY/PLANNING/EXECUTION/VERIFICATION
  - **Options**: A) ... B) ... C) ...
  - **Status**: ACTIVE/SUSPENDED/RESOLVED
  - **Reason**: (if suspended)
```

### Integration with Strict Mode

When `/strict-mode` is active:
- ALL checkpoints MUST be logged
- Suspension MUST include reason
- Resolution MUST include selected option

---

## 🔧 Logging Procedure

### Step 1: Detect Decision

When agent:
- Compares options
- Creates implementation plan
- Rejects an approach
- Makes architectural choice

→ **Log the decision**

### Step 2: Extract Components

| Component | Source |
|-----------|--------|
| **Decision** | What was chosen |
| **Rationale** | Why it was chosen |
| **Alternatives** | What was considered but rejected |

### Step 3: Format Entry

```markdown
- [YYYY-MM-DD HH:MM] **Decision**: [Clear, actionable description].
  - **Rationale**: [Why this choice makes sense].
  - **Alternatives**: [List of other options].
```

### Step 4: Append to Memory

Append entry to `memory/decisions.md` under `## Entries`.

---

## 📊 Decision Categories

| Category | Examples |
|----------|----------|
| **Architecture** | Module structure, data flow, layer boundaries |
| **Implementation** | Algorithm choice, pattern selection, API design |
| **Scope** | What to include/exclude, phasing, priorities |
| **Tool/Library** | Dependencies, frameworks, existing vs. new |
| **Process** | Workflow changes, governance updates |

---

## ❌ Anti-Patterns

| Anti-Pattern | Why It's Wrong |
|--------------|----------------|
| Logging every small choice | Bloats memory with noise |
| Skipping rationale | Future sessions won't understand WHY |
| Logging without alternatives | Loses context of what was considered |
| Verbose descriptions | Keep decisions concise (1-2 lines) |

---

## 🔗 Integration Points

### Protocol Reference

- **Protocol #38**: Memory System Maintenance (enforces this skill).

### Related Skills

- `memory-session-loader`: Loads decisions at session start
- `memory-file-logger`: Logs file reads
- `memory-session-end`: Syncs at session end

---

## ✅ Validation Checklist

When logging a decision, verify:

1. [ ] Decision is significant (not routine)
2. [ ] Rationale is clear and concise
3. [ ] Alternatives are documented (if applicable)
4. [ ] Entry follows format
5. [ ] Entry appended to `memory/decisions.md`
