---
description: Invoke structured control mode when agent is hallucinating or needs tight control
---

# /strict-mode - Phased Gate-Kept Control

**When to use**: Agent is hallucinating, making assumptions, or you need controlled step-by-step execution.

---

## ACTIVATION

When this workflow is invoked:

1. **STOP all autonomous action immediately**
2. **Set internal state to LOCKED**
3. **Acknowledge activation**:
   ```
   🔒 STRICT MODE ACTIVATED
   Phase: AWAITING_DIRECTION
   Status: LOCKED - awaiting your choice
   ```

---

## OPERATING RULES (MANDATORY)

### Rule 1: No Action Without Selection

- **NEVER** take action based on free-form text interpretation
- **ALWAYS** present A/B/C options before any action
- If user types free text → rephrase as structured options

### Rule 2: Structured Checkpoints

At EVERY decision point, present:

```
📋 CHECKPOINT: [Brief context]

  A) [Concrete action 1]
  B) [Concrete action 2]  
  C) [Concrete action 3]
  D) Suggest something else (I will rephrase)

Your choice: _
```

### Rule 3: Free-Form Loop

If user selects D or types free text:

1. DO NOT act on the text directly
2. Rephrase the intent as 3 new concrete options
3. Present new A/B/C menu
4. Repeat until user selects A, B, or C

### Rule 4: Phase Advancement

Only advance when user explicitly selects an option:

```
✅ Choice recorded: [A/B/C]
🔓 Proceeding with: [action description]
```

---

## PHASE STRUCTURE

```
DISCOVERY → PLANNING → EXECUTION → VERIFICATION
```

| Phase | You May | You May NOT |
|-------|---------|-------------|
| **DISCOVERY** | Ask questions, read files | Propose changes |
| **PLANNING** | Propose options, create plans | Write code |
| **EXECUTION** | Implement selected option | Add unselected features |
| **VERIFICATION** | Run tests, validate | Make new changes |

**Phase transitions require explicit user approval.**

---

## MEMORY INTEGRATION

> **Reference**: [STRICT_MODE_MEMORY_CONTRACT.md](../governance/STRICT_MODE_MEMORY_CONTRACT.md)
> **Policy**: [strict-mode-checkpoints.json](../policies/strict-mode-checkpoints.json)

### Checkpoint Persistence

All checkpoints MUST:
1. Be logged via `memory-decision-logger` with type `checkpoint`
2. Include `checkpoint_id` in format: `CHKPT-<phase>-<timestamp>-<hash>`
3. Be recoverable across sessions

### Non-Selection Handling

If user provides free-form input that is NOT an option selection:
1. Current checkpoint → `SUSPENDED` state
2. Log suspension to memory with reason: `"non-selection input"`
3. Present Side Checkpoint menu:
   ```
   📋 SIDE CHECKPOINT (Strict Mode still active)
   
   An active checkpoint is suspended.
   
     A) Address this side topic, then return
     B) Replace the original task with this new direction
     C) Resume the suspended checkpoint
     D) Clarify how this relates
   
   Your choice:
   ```

### Session Resumption

On session start with active/suspended checkpoints:
1. Surface all pending checkpoints
2. Remain in LOCKED state
3. Await user selection before proceeding

---

## EXAMPLE INTERACTION

```
🔒 STRICT MODE ACTIVATED
Phase: DISCOVERY
Status: LOCKED - awaiting your choice

📋 CHECKPOINT: What would you like me to investigate?

  A) Read the file you mentioned and summarize
  B) Search for related code patterns
  C) Explain the current implementation
  D) Suggest something else

Your choice: _
```

User types: "just fix the bug"

```
📋 CHECKPOINT: You said "fix the bug". Which approach?

  A) Identify the bug first (show me the error)
  B) You know the bug - describe it and I'll propose fixes
  C) Run existing tests to locate failures
  D) None of these - clarify

Your choice: _
```

---

## DEACTIVATION

Strict mode remains active until:

1. User says `/normal` or "exit strict mode"
2. User explicitly requests normal operation

On deactivation:
```
🔓 STRICT MODE DEACTIVATED
Returning to normal autonomous operation.
```

---

## ANTI-PATTERNS (FORBIDDEN)

❌ Acting on interpreted intent without A/B/C selection
❌ Skipping phases
❌ Presenting more than 4 options (keep it simple)
❌ Auto-advancing without explicit choice
❌ Assuming what user wants from vague instructions

---

## QUICK REFERENCE

| User Says | Agent Does |
|-----------|------------|
| `/strict-mode` | Activate, present first checkpoint |
| Selects A/B/C | Log choice, perform action, present next checkpoint |
| Types free text | Rephrase as A/B/C options, await selection |
| `/normal` | Deactivate, return to autonomous mode |
