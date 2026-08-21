---
name: systematic-debugger
description: >
  Interactive guide for the 6-Step Debugging Protocol (Protocol 15/PIO-050).
  Use when the user asks to "debug", "fix", or reports an "error".
  Enforces STOP & DEFINE and TRACE before allowing FIX code.
---

## Goal

Prevent "Shotgun Debugging" by forcing adherence to the 6-Step Protocol.

## The Protocol

### Step 1: STOP & DEFINE

**Action**: Ask the user:

1. "What is the exact symptom?"
2. "Does the data actually exist in the DB/Source?"
3. "Which tools should we use (Browser Subagent, Admin SDK, Manual)?"

### Step 2: REPRODUCE

**Action**: Verify consistency.

- If it happened once -> "Ghost Issue".
- If reproducible -> Proceed.

### Step 3: TRACE (The Critical Step)

**Action**: Walk the data path.

- **Layer 0 (Source)**: Is data in DB?
- **Layer 1 (Fetch)**: Is backend returning it?
- **Layer 2 (State)**: Is frontend state receiving it? (Check `stateManager`)
- **Layer 3 (UI)**: Is it rendering?

### Step 4: EVIDENCE

**Action**: Collect logs/screenshots.

- Do NOT accept "it doesn't work".
- Demand: "Show me the console log" or "Show me the network response".

### Step 5: HYPOTHESIZE

**Action**: Form a theory based on evidence.

- e.g., "The handler is zombie because the class name changed."

### Step 6: FIX + VERIFY

**Action**: Propose the fix ONLY after Step 5.

Before writing the fix, define the verification gate:

**🔍 Validation Gate** (max 2 binary checks):
  1. (Binary) `<specific command or DOM check>` → must return `<exact expected value>`
  2. [human-review] `<visual/UX observation>` *(advisory — does not block)*

**🚦 Decision Node**:
  - **Pass**: Bug confirmed fixed. Proceed to commit.
  - **Fail (1st)**: `git checkout <file>` to revert the attempted fix. Re-trace from Step 3 with the new evidence.
  - **Fail (2nd)**: Halt. Surface to user: "Fix attempt failed twice. Root cause hypothesis may be wrong — share the observed output so we can re-examine Step 5."

**Rule**: Do not proceed to commit until the binary gate passes. "It seems to work" is not a passing gate.

## Interaction Style

""I see you have a bug. Let's not guess. I will walk you through the Systematic Debugging Protocol. Step 1: Define the data source..."

## ❌ Example Violation

**User**: "The button doesn't work, let me add some console logs."

**Agent (Bad)**: Adds 10 `console.log` statements randomly.

**This skill catches it**: "STOP. What is the exact symptom? Does the method exist? Let's trace Layer 0 → 3 first."

## ➡️ What's Next?

After this skill passes (root cause found):

- Propose a targeted fix
- Run **`backend-test-generator`** if backend change needed"
