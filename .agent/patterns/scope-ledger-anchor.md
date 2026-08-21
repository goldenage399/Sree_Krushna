---
pattern: scope-ledger-anchor
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Scope Ledger / Load-Anchor Pattern

**Category**: Process / Session Resumption  
**Applies to**: Any complex, multi-milestone work stream spanning multiple sessions or context resets.  
**Origin**: EUR-001 (Team Oversight Redesign), 2026-06-17.  
**Status**: VALIDATED (Successfully used to coordinate 3 milestones across resets without regression).

---

## Pattern — Scope Ledger

### Problem
In multi-session development tracks, conversation transcripts grow rapidly (often exceeding 2,000+ lines). When a session restarts or a model's context resets, the incoming agent must parse the entire transcript to understand where the task stands, leading to:
1. **Context Bloat**: Wasting input tokens on stale discussions.
2. **Disorientation**: Getting lost in historical debates, leading to duplicate or regressive decisions.
3. **Orphaned Polish Notes**: Small, non-blocking items identified in early steps are forgotten or overwritten by later steps.

### Why it happens
Chat transcripts are chronological logs, not structured states. Relying on transcript history as the primary source of truth forces the agent to reconstruct the state from conversations, which is computationally expensive and prone to hallucination.

### Solution
Establish a single, terse living document: a **Scope Ledger** (e.g., `EUR-001_SCOPE_LEDGER.md`) capped at **1 page**. This document serves as the absolute "load-anchor" for the work stream.

The ledger must contain exactly:
1. **SSOT References**: Links to current, authoritative design and contract specifications (never refer back to chat queries).
2. **Milestone Tracker**: A table listing each project increment, its target status, gate check, and notes.
3. **Decision Log**: A single-line list of locked architectural decisions (details go in foundation docs).
4. **Open Gaps / Risks**: Table of known blockers, dependencies, and their resolution checkpoints.
5. **Deferred Production Punch-List**: A repository for non-blocking polish notes discovered during reviews. These are parked here to prevent scope creep during active milestones, and are systematically integrated at the final deployment/ingestion stage.
6. **Next Action**: A single, unambiguous command defining the scope of the immediate package.

**Update Discipline**: 
* When a milestone gate passes, flip its status.
* When a decision is made, append a terse line to the log.
* When a polish item is found, append it to the punch-list.
* Keep the ledger at 1 page; details must live in foundation documents.

### Failure Mode
If the ledger is allowed to grow past 1 page or becomes clogged with detailed implementation notes or conversation transcripts, it ceases to be a rapid resume anchor and becomes another heavy document that agents scan partially or ignore, leading back to transcript-based resumption.

### Task-Dashboard instance
[EUR-001_SCOPE_LEDGER.md](file:///d:/GitHub_Repo/Task-Dashboard/User_Created/Discussion%20Threads/260612_Team-Tasks/EUR-001_SCOPE_LEDGER.md) was created and maintained throughout the Team Oversight redesign track to anchor the milestones M0, M1, and M2. It successfully preserved the deferred polish punchlist (P1-P5) across multiple session boundaries and prevented design regressions.

---

## Anti-Pattern — Transcript-Based Resumption

### What it is
Resuming a multi-session task by reading or copy-pasting the conversation history or relying on the agent to read the raw log of past turns.

### Symptoms
* The agent asks "Where did we leave off?" despite logs being present.
* The agent flip-flops on design decisions (e.g., reverting back to a legacy card body layout because a user's question was misconstrued).
* Small detail fixes (like adjusting card right-padding or changing a title string) disappear in later milestone deliveries.

### Correction
* Halt work.
* Initialize the Scope Ledger (`<track>_SCOPE_LEDGER.md`) using the [EUR-001_SCOPE_LEDGER.md](file:///d:/GitHub_Repo/Task-Dashboard/User_Created/Discussion%20Threads/260612_Team-Tasks/EUR-001_SCOPE_LEDGER.md) format.
* Tell the incoming agent: *"Load the Scope Ledger to resume context. The discussion transcript is archive-only."*
