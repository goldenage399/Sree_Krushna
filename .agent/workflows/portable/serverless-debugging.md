---
pattern: serverless-debugging
origin_cap: CAP-035
tier: universal
applies_to:
  - "Serverless functions (GAS, Lambda, Cloud Functions)"
  - "Any headless API backend"
prereqs:
  - "Centralized logging system"
porting_effort: low
canonical_source: GEMINI.md Protocol #41, #42
last_reviewed: 2026-04-18
description: "Diagnostic decomposition protocols."
---

# Portable Workflow: Serverless Debugging

**Purpose:** Serverless functions (like Google Apps Script) can be difficult to trace due to their stateless nature and limited observability. This workflow provides a deterministic process to resolve unexplained failures and prevent "debugging spirals."

---

## 1. Diagnostic Decomposition (Protocol #41)

When a multi-step function (Read → Filter → Transform → Write) fails unexpectedly, do NOT guess. Write a standalone `diag_X()` function to observe actual runtime state.

**The 5-Step Diagnostic Pattern:**
1. **Log State**: Log all dependencies before the operation (e.g. headers, config values, input parameters).
2. **Execute & Read Back**: Perform the operation (e.g. write), then immediately read the raw result back from the persistence layer.
3. **Trace Logic**: Log the exact return value of every sub-function.
4. **Normalized Comparison**: Log the **Expected** value vs the **Actual** value side-by-side.
5. **Clean Up**: Ensure the diagnostic leaves the persistence layer in its original state.

---

## 2. The Two-Attempt Gate (Protocol #42)

**Hard Constraint**: If a fix for a failure has been attempted **twice** and it is still failing, all code edits MUST stop.

1. **Stop**: Do not write a third fix based on inference.
2. **Observe**: Emit the minimum diagnostic code needed to capture the actual state (e.g. `console.log(JSON.stringify(obj))`).
3. **Wait**: Ask the user to run the diagnostic and provide the output.
4. **Analyze**: Confirm the root cause from the observed data.
5. **Fix**: Propose exactly one targeted fix based on ground truth.

---

## 3. Serverless Decision Tree

| Symptom | Debug Action |
|---|---|
| **Function not found** | Check deployment status and visibility permissions. |
| **Timeout Error** | Check for infinite loops or inefficient O(n^2) operations on the data layer. |
| **Mismatched Data** | Run a schema diagnostic to compare live headers vs expected schema. |
| **"Cannot read property X of null"** | Check for missing defensive handling in the response chain. |

---

## Gotchas

- **Execution Environment**: Ensure you are debugging the correct environment (Development vs Production).
- **Asynchronous Latency**: In some serverless environments, writes may not be immediately available for reads. Use `flush()` or equivalent if available.
- **Log Truncation**: Large JSON objects may be truncated in some console logs. Log specific fields if the object is too large.
