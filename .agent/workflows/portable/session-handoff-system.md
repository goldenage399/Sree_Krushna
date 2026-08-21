---
pattern: session-handoff-system
origin_cap: CAP-035
tier: universal
applies_to:
  - "any project with long-running agentic tasks"
  - "repos with multi-session context"
prereqs:
  - "Knowledge graph tool (optional but recommended)"
  - "Implementation registry (e.g. ENHANCEMENTS.md)"
porting_effort: medium
canonical_source: .agent/workflows/aos-session-open.md
last_reviewed: 2026-04-18
description: "The SHO system for AI context preservation."
---

# Portable Workflow: Session Handoff System

**Purpose:** Ensure seamless context transfer between AI agent sessions. This system eliminates redundant exploration and prevents "amnesia" when switching agents or resetting context windows.

---

## 1. Session Open Protocol

Every new session MUST start with an orientation phase before any code is written.

### Step 1: Authority Orientation
Read the authoritative project maps in order:
1. **`CLAUDE.md`** (or equivalent): Rules, conventions, and Source of Truth map.
2. **`ENHANCEMENTS.md`** (or implementation registry): Current progress and pending tasks.
3. **Knowledge Graph**: (If available) Understand system topology and god nodes.

### Step 2: Handoff Selection
Locate and read the most recent **Session Handoff (SHO)** document.
- Identify the exact state of work.
- Note any blockers or pending items left by the previous agent.

### Step 3: Specific Discovery
Read the SSOT documents relevant to the current task (e.g., API schemas, design language).

---

## 2. Session Close Protocol

Every session MUST end with a formal handoff generation.

### Step 1: Artifact Sync
Ensure all architectural documentation (ADRs, SSOTs, PRDs) reflects the final state of the code.

### Step 2: Task Consolidation
Update the implementation registry (ENHANCEMENTS.md) with the results of the session.

### Step 3: Handoff Generation (SHO)
Create a new handoff document (e.g., `docs/SESSION_HANDOFF/SHO_YYYYMMDD_HHMM.md`).

**The SHO MUST include:**
- **Summary**: What was accomplished.
- **Implementation State**: Which files were modified and why.
- **Pending Tasks**: Explicit TODO list for the next session.
- **Critical Context**: Decisions made, traps avoided, or open questions for the user.
- **Forensic Audit**: (Optional) A brief record of major tool calls and their outcomes.

---

## Gotchas

- **Stale Handoffs**: If multiple handoffs exist, always use the most recent one unless instructed otherwise.
- **Documentation Drift**: If the agent forgets to update the SHO, the next agent will waste time re-discovering the state. Make handoff generation a hard gate at session end.
- **Implicit Knowledge**: Avoid leaving information only in the chat history. If it's important, put it in a file (SHO or SSOT).
