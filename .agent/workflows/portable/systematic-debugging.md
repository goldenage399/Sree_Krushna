---
pattern: systematic-debugging
origin_cap: PIOps-Debug
tier: universal
applies_to:
  - "Frontend/Backend troubleshooting"
  - "Logic error investigation"
  - "Performance diagnostics"
prereqs:
  - "Structured logging"
  - "Diagnostic tools access"
porting_effort: low
canonical_source: GEMINI.md
last_reviewed: 2026-04-21
description: "Proof-based Layer Tracing and tool-usage guardrails."
---

# Portable Workflow: Systematic Debugging & Layer Trace

**Purpose:** Move from "Shotgun Debugging" (guessing/random fixes) to "Evidence-Based Debugging" (proving the failure point).

---

## 1. The Layer Trace (Protocol #55)

**Constraint:** You must prove where the data "died" by verifying layers in order. Never skip a layer.

| Layer | What to Verify | Frontend Tool | Backend Tool |
|-------|----------------|---------------|--------------|
| **Layer 0 (Source)** | Does the data exist in the DB? | N/A | Sheet / Firestore Console |
| **Layer 1 (API)** | Did the request fire and return 200 OK? | Browser Network Tab | GAS Executions / Server Logs |
| **Layer 2 (State)** | Is the app's internal memory/cache populated? | `stateManager.get*()` / Console Log | Variable inspection |
| **Layer 3 (Render)** | Is the UI correctly reflecting that state? | DOM Inspection / React DevTools | Response JSON |

---

## 2. The 6-Step Methodology

**MANDATORY for complex bugs:**
1. **STOP & DEFINE**: List your current tools and identify your assumptions (e.g., "I assume the API is working").
2. **REPRODUCE**: Confirm the bug is consistent. If intermittent, add logging *first*.
3. **TRACE**: Use the **Layer Trace** to isolate the first layer that fails.
4. **EVIDENCE**: Collect actual log outputs. Never say "I think it's X," say "The log shows Y."
5. **ROOT CAUSE**: Form a hypothesis based on the failed layer. Test it surgically.
6. **FIX + VERIFY + PREVENT**: Apply the fix, verify it across all layers, and add a guardrail (like Protocol #34) so it never returns.

---

## 3. The 2-Strike Rule (Tool Efficiency)

**Constraint:** Switch tools/strategies after 2 failed attempts.
**Why:** Agents often fall into "Grep Rabbit Holes," trying slightly different search terms instead of changing their perspective.
**Pattern:**
- 2 failed `grep_search` → Switch to `view_file_outline` or `list_dir`.
- 2 failed `replace_file_content` → Switch to `write_to_file` or the **Large Code Removal Protocol**.
- 2 failed logic fixes → Stop and emit a **Diagnostic Gate** (Protocol #42).
