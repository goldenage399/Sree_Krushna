---
description: Rolling Snapshot Update Workflow - Maintain the rolling clarity of the master system snapshot to prevent information decay.
---

# Rolling Snapshot Update Workflow (`/snapshot-update`)

> **Purpose**: Maintain the rolling clarity of the master system snapshot (`docs/SYSTEM_CLARITY_SNAPSHOT.md`) to prevent information decay, stale data, and cognitive bloat across agent sessions.
>
> **Background**: Localized and mapped from QSR's `SNAPSHOT_UPDATE_WORKFLOW.md`, this workflow governs how the repository's single master rolling record tracks all active workstreams, active database configurations, and active architectural invariants.

---

## 📅 Lifecycle of the Snapshot

The Master System Snapshot (`docs/SYSTEM_CLARITY_SNAPSHOT.md`) is a **permanent, living document** that coordinates overall repository status.

1. **Incremental Updates**: Updated at the end of every session that modifies the project's state, rules, or workstream progress.
2. **Context Retention**: Never deleted. Its git history acts as the timeline, while the workspace copy remains the rolling master.
3. **Session Archiving**: A snapshot copy is frozen and archived inside the session's discussion thread at closeout.

---

## 🛠️ Step-by-Step Procedure

### Step 1 — Section Classification

When editing the master snapshot, classify sections as **Evergreen** (high-level structure) or **Session-Updated** (progress/details). Only edit sections where the state or truth actually changed this session.

| Section Type | Example Content | When to Update |
| :--- | :--- | :--- |
| **Evergreen** | §1. Active System Architecture | Positional profile mapping, Firebase rules architecture, and user context logic. | Only when core configurations or database boundaries change. |
| **Session-Updated** | §2. Active Workstreams | TASK-XXX chain status, active mock baseline versions, and approved design specs. | Always update when workstream status transitions or UI briefs are approved. |
| **Session-Updated** | §3. Deployed State & Invariants | Commit hashes, rules fixes, and new captured patterns. | Always update when changes are deployed or new standard patterns are registered. |
| **Session-Updated** | §4. Next Actions Queue | Next tasks, defect triage items, and gate timelines. | Always update to match the current post-session state. |

---

## 🧹 Step 2 — Strip-Down Rules (Keep it Lean)

To prevent the snapshot from bloating into an unreadable historical log:

1. **No Completed Queue Items**:
   - Strip all completed tasks or `DONE` queue items from the active queue sections.
   - Do **NOT** accumulate completed logs in the snapshot; the enhancement indexes and Git history are their permanent records.
2. **Use Stale-Tracking Tags**:
   - Every modified section must carry a `<!-- last updated: YYMMDD -->` tag immediately beneath the section header.
   - Leave unchanged sections' tags untouched so stale areas are visible.
3. **No Redundant Plan Details**:
   - If a plan detail or decision is promoted to a PRD, enhancement index, or standard protocol doc, remove it from the snapshot and link to the permanent target instead.

---

## 🔗 Step 3 — Ingestion & Session Close Integration

1. **Integration with `aos-session-close.md`**:
   - During Step 4 (Memory Synchronization) of the session closeout, the agent must check if this session changed the repository's state.
   - If YES, follow this workflow to incrementally update the master rolling snapshot file at `docs/SYSTEM_CLARITY_SNAPSHOT.md`.
2. **Session Archival Copy**:
   - For historical tracking and context preservation within the discussion thread, **always copy the updated snapshot file** into the current session's folder (e.g., `User_Created/Discussion Threads/<session_folder>/`) at session close.
   - Example command:
     `Copy-Item "docs/SYSTEM_CLARITY_SNAPSHOT.md" -Destination "User_Created/Discussion Threads/260612_Team-Tasks/" -Force`
3. **Wiring Checklist**:
   - Ensure all references are relative paths using standard GitHub Markdown formatting.
   - Run `npm run preflight` to verify that any path adjustments do not violate structural invariants.
