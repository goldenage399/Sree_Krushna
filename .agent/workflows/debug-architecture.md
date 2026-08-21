---
description: MANDATORY workflow for debugging architectural issues (Generic)
---

# Debug Architecture Workflow

> ⚠️ This workflow is **MANDATORY** before suggesting fixes for architectural violations.

## Step 1: Architecture Check (BLOCKING)

**Before ANY code tracing**, read existing architectural documentation.

1.  **Identify the Domain**: What system are you touching? (e.g., Auth, Expense, Gas Tracker)
2.  **Find the ADR/SSOT**: Look for `docs/adr/` or `docs/ssot/` files.

    - _If no ADR exists_, check `CLAUDE.md` or `PROJECT_RULES.md`.

3.  **Answer these questions**:

    - What is the PRIMARY design pattern? (e.g., "Location Isolation", "Frontend Token Verification")
    - What is the correct implementation?
    - What explicitly violates this design?

4.  **Quote the Rule**:
    > "Per [Document Name], [Rule Description]..."

## Step 2: Contextual Analysis (CRITICAL)

**Before flagging a bug**, ask:

1.  **Subject**: Is this "My Data" (Subject = Me) or "Target Data" (Subject = Admin/Service)?
2.  **Purpose**: Is this a core workflow or a search/filter?

| Pattern                             | Context       | Verdict                       |
| ----------------------------------- | ------------- | ----------------------------- |
| Forbidden Pattern + "Core Use"      | Core Workflow | **VIOLATION** (Fix code)      |
| Forbidden Pattern + "Exception Use" | Admin/Bridge  | **EXCEPTION** (Mark as valid) |

> [!WARNING]
> **Evidence gathering — do not act on a proxy signal.** See `.agent/patterns/proxy-signal-verdicts.md`.
> Import counts, filenames, filesystem mtimes and header comments are hypotheses, never evidence.
> Before concluding anything is dead/duplicate/stale, measure real **consumption** (`var(--x)`, call
> sites), diff real **content**, and check **load order**. Re-verify immediately before editing — a
> fact established earlier in the investigation is a hypothesis again by the time you act on it.
> (TASK-218 produced five confident, wrong verdicts this way; each was one command from shipping a regression.)

## Step 3: Violation Analysis

**ONLY after completing Step 2**, trace code to find violations:

1.  Search for code that violates the architecture.
2.  Any forbidden pattern (without exception context) is a BUG.
3.  Fix = change to use the architecturally correct pattern.

## Step 4: Fix Suggestion

State clearly:

> "Per [ADR/SSOT], the fix is to use [Correct Pattern], not [Wrong Pattern]."

## Anti-Pattern Warning

| ❌ WRONG                                         | ✅ CORRECT                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------------- |
| "This looks like a bug because it returns null." | "The Architecture mandates X, so returning null here is expected/violation." |
| "Let's try changing X to Y to see if it works."  | "Changing X to Y violates Rule Z. We must fix the root cause."               |
| **Ignoring Context**                             | **Distinguishing "My Data" vs "Target Data"**                                |
