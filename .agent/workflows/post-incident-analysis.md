---
description: Post-Incident Learning & Prevention Workflow (9-Step Diagnostic Engine & Session Audit)
---

# Post-Incident Learning & Prevention Workflow

## Purpose
Convert bug fixes into durable organizational knowledge, ensuring that solved defects never recur across the codebase. Performs a full-session transcript audit to capture all un-diagnosed bugs resolved during the session.

---

## Phase 0: Session Transcript Audit (Multi-Incident Discovery)
1. **Scan Transcript**: Audit the full conversation transcript and `.agent/memory/event_stream.md` for error tracebacks, bug reports, and fix commits made during the session.
2. **Enumerate Defects**: List all distinct defects fixed during this session.
3. **Deduplication Check**: Filter out defects already logged with an `INC-XXX` case study in this session.
4. **Construct Queue**: Build the **Pending Incident Queue** of undiagnosed defects.

---

## The 9-Step Diagnostic Engine

For each defect in the Pending Incident Queue, execute the 9-step retrospective:

1. **Root Cause Timeline**: When introduced? Which commit? Incorrect assumptions? What later change exposed it?
2. **Escape Analysis**: Why wasn't it detected? Missing tests, contracts, docs, or review assumptions?
3. **Systemic Weaknesses**: Architectural, API contract, semantic, configuration, or cross-module coupling?
4. **Change Impact Analysis**: Shared abstractions affected? Modules implicitly impacted? Future risks?
5. **Missed Signals**: Dead code, impossible branches, silent assumptions, missing assertions or telemetry?
6. **Preventive Guardrails**: Automated tests, static analysis, invariants, runtime assertions, CI checks.
7. **Generalized Defect Pattern**: Abstract into a reusable defect pattern.
8. **Repository Scan**: Search for other instances of this defect class across the codebase.
9. **Knowledge Capture**: Specify exact updates for ADRs, architecture docs, standards catalog, and review checklists.

*Note: Label every diagnostic conclusion as `VERIFIED`, `INFERRED`, or `SPECULATIVE`.*

---

## Output Mapping & SSOT Write-Back

- **Step 1–5** -> Write formal Case Study to `docs/incidents/INC-XXX.md`.
- **Step 6–7** -> Update `.agent/standards-catalog.json`, `violation-patterns.json`, and `GEMINI.md`.
- **Step 8–9** -> Record decisions in `.agent/memory/decisions.md` and update relevant SSOT hubs.
- **Workflow Delegate** -> For complete lifecycle execution, see [.agent/workflows/post-incident-governance.md](file:///d:/GitHub_Repo/PIOperationsMgmt_Firebase/.agent/workflows/post-incident-governance.md).
