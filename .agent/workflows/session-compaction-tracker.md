---
description: Workflow for creating a session-level progress tracker to maintain context across model compactions.
---

# Workflow: Session Progress Compaction Resilience Tracker

**Purpose**: Create a lightweight, temporary markdown tracker within the workspace during multi-step or complex sessions. This ensures that completed work, planned tasks, design justifications, and remaining queue items survive context compactions (when the AI assistant's history is compressed or truncated) without requiring a full-blown enhancement ticket folder.

---

## 🧭 Workflow Decision Flow

```
                      ┌────────────────────────────────────────┐
                      │ Session starts to span >5-10 messages  │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │    Create temporary tracker in logs    │
                      │  ([Date]_[Topic]_Tracker.md)           │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │    Update progress table as tasks      │
                      │           are completed                │
                      └───────────────────┬────────────────────┘
                                          │
                                          ▼
                               { Is session ending? }
                                 /                \
                                /                  \
                             [Yes]                 [No]
                              /                      \
                             ▼                        ▼
      ┌─────────────────────────────┐        ┌─────────────────────────────┐
      │ Closeout / Promote:         │        │ Keep tracker current for    │
      │ 1. Convert to Enhancement   │        │ next session wake-up        │
      │ 2. Or delete if fully done  │        └─────────────────────────────┘
      └─────────────────────────────┘
```

---

## 🛠️ Step-by-Step Implementation

### Step 1: Initialize the Tracker
If a task involves multiple files, manual feedback loops, or complex state verification, create a tracker file in a designated workspace logs directory (e.g. `User_Created/Discussion Threads/Task_log/`).

> [!IMPORTANT]
> **Conversation Thread Alignment**: The tracker file's name **MUST** use the exact filename of the active discussion thread or conversation log (e.g. `260626_Th7_UI_Improvements`) as a prefix or suffix. This is a hard requirement to ensure subsequent agents can trace the background context and find the corresponding chat history.

* **Naming Convention**: `[Discussion_Thread_Base_Name]_Tracker.md`
  * Example: `260626_Th7_UI_Improvements_Tracker.md`

### Step 2: Structure the Tracker
Copy this base markdown structure into the tracker file:

```markdown
# [Date]_[Topic] Progress Tracker

This file tracks the status and progress of this session's tasks to preserve context across model compactions.

---

## 🎯 Progress Overview

| Category / ID | Description | Status | Reference Files / Context |
| :--- | :--- | :--- | :--- |
| **Feature 1** | | | |
| **F1.1** | [Task description] | [🟢 Completed / 🟡 Pending] | [file_name.jsx](file:///absolute/path) |
| **Feature 2** | | | |
| **F2.1** | [Task description] | [🟢 Completed / 🟡 Pending] | [file_name.jsx](file:///absolute/path) |

---

## 🛠️ Details of Completed Tasks
* Detailed description of what was changed and why (retaining design design choices).
* Reference specific filenames as clickable markdown links.

---

## 🔮 Next Steps & Pending Items
* Immediate list of remaining tasks for the next turn/session.
```

### Step 3: Incremental Syncing
After each successful task iteration:
1. Update the **Status** column in the Progress table.
2. Log details under **Completed Tasks**.
3. Refine the **Next Steps** section to reflect the active queue.

### Step 4: Session Closure / Promotion
When the session is complete:
* **Option A (Promote to Enhancement)**: If the work is ongoing and belongs in the product backlog, use the `/enhancement-protocol` to move the tracking details into a formal `enhancement-notes/` tracker.
* **Option B (Archive)**: If the work is fully complete, leave the tracker as a historical record in logs so subsequent agents can review past decisions.
