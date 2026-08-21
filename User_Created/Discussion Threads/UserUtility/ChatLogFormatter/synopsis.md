# Chat Log Formatter — System Synopsis

This document provides a complete high-level synopsis of the **Chat Log Formatter** integration, detailing its core rules, design implementation, integration mechanics, step-by-step instructions, and successful execution results.

---

## 🎯 1. Core Objectives & Rules

The tool automatically restructures raw agent-user chat log headers into the sequential query/response format used for conversation history logs. It operates under three strict rules:

1. **Rule 1 (First User Input -> Query)**: The first `### User Input` header of a round is converted to `# Query X.Y -`, starting from `1.0`.
2. **Rule 2 (First Planner Response -> Response)**: The first `### Planner Response` header matching that query is converted to `# Response X.Y -`.
3. **Rule 3 (Secondary Responses Stay Level 3)**: Any subsequent `### Planner Response` headers in the same round (before a new query occurs) are left untouched (remain level 3 `### Planner Response`).

---

## 📂 2. File Placement ("What to Put Where")

```text
your-project/
├── User_Created/Discussion Threads/UserUtility/ChatLogFormatter/
│   ├── format_chat_log.py   ← Python script
│   └── synopsis.md          ← Documentation (This file)
└── .vscode/
    └── tasks.json           ← Configured tasks
```

* **Script Location**: [format_chat_log.py](file:///d:/GitHub_Repo/Task-Dashboard/User_Created/Discussion%20Threads/UserUtility/ChatLogFormatter/format_chat_log.py)
* **Task Config**: [.vscode/tasks.json](file:///d:/GitHub_Repo/Task-Dashboard/.vscode/tasks.json)

---

## 🚀 3. Exact Interaction, Step by Step

1. **Open your `.md` file** (e.g., `260627_Task205_Dynamic Blocker Handling and Registry.md`) in VS Code.
2. **Highlight the section** you want to fix (or skip this — the task falls back to the whole file).
3. **Trigger the task** via `Ctrl+Shift+P` $\rightarrow$ **Tasks: Run Task**:
   - **`Format Chat Log (Selection)`**: Standard GUI diff on selection.
   - **`Format Chat Log (Full File)`**: Standard GUI diff on full file.
   - **`Format Chat Log (Terminal Preview - Selection)`**: Terminal diff preview with Enter confirmation on selection.
   - **`Format Chat Log (Terminal Preview - Full File)`**: Terminal diff preview with Enter confirmation on full file.
   - **`Format Chat Log (Bypassed - Selection)`**: Instant auto-apply without GUI diff or prompt on selection.
   - **`Format Chat Log (Bypassed - Full File)`**: Instant auto-apply without GUI diff or prompt on full file.
4. **Terminal panel opens and prints**:
   ```text
   ┌─────────────────────────────────────────────────────┐
   │  File   : my_notes.md                               │
   │  Range  : entire file                               │
   │                                                     │
   │  Opening diff in VS Code ...                        │
   │    LEFT  (original) : /path/to/my_notes.md          │
   │    RIGHT (proposed) : /tmp/fmt_chat_xxxx.md         │
   │                                                     │
   │  Review the diff, then come back here.              │
   │  Press Enter to APPLY changes, or Ctrl+C to CANCEL. │
   └─────────────────────────────────────────────────────┘
   ```
5. **VS Code diff tab opens automatically**:
   - **LEFT** = your current file (unchanged)
   - **RIGHT** = proposed output
6. **Review the changes**:
   - Click back on the terminal panel.
   - Press **Enter** $\rightarrow$ file is written, VS Code shows a "File Changed Externally" reload prompt $\rightarrow$ click **Reload**.
   - Press **Ctrl+C** $\rightarrow$ aborts process, nothing is changed.
