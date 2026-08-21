---
pattern: performative-council-and-telemetry-gate
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - performative council
  - unfired telemetry
  - preflight warning suppression
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Performative Council Declarations & Unfired Telemetry Prevention

**Category**: Anti-Pattern & Process Gate  
**Applies to**: SOP Architecture/UI Councils, Service Telemetry, Preflight Summaries  
**Origin**: 2026-08-13 (TASK-245 Review 4.2 & INC-077)  
**Status**: VALIDATED  

---

## Anti-Pattern 1 — Performative Council Declaration

### What it is
Formatting prompt text with "Architecture Council Review Synthesis (SOP-WFL-ARCH-COUNCIL-001)" and naming a member roster/dissenter without executing the underlying protocol — specifically without writing the persistent council document to `User_Created/Discussion Threads/Council/` or appending a line to `Council_Ledger.md`.

### Symptoms
- Chat output includes council synthesis headers and dissenter challenges.
- `Council_Ledger.md` has no corresponding entry for the session.
- No session artifact exists in `User_Created/Discussion Threads/Council/`.

### Why it fails
It creates a false record of governance compliance. Future agents read the transcript or task comments and believe an architecture council approved the design, when in reality no formal evidence-backed evaluation or decision ledger was persisted.

### Correction
If a SOP Architecture or UI Council is claimed or invoked:
1. Generate the formal council markdown file in `User_Created/Discussion Threads/Council/YYYYMMDD_arch_council_<topic>.md`.
2. Append the entry line to `User_Created/Discussion Threads/Council/Council_Ledger.md`.
3. If no file or ledger line is written, label the output as `INFORMAL — not a SOP session`.

---

## Anti-Pattern 2 — Unfired Telemetry Declaration

### What it is
Declaring new constants in a service registry (e.g. `CHECKLIST_ITEM_CHECKED` under `ACTIVITY_TYPES` in `ActivityLogService.js`) to claim **P-VAT** compliance without wiring any caller (`logActivity()` / `logChecklistActivity()`) to fire them during runtime events.

### Symptoms
- `ACTIVITY_TYPES` contains constants with 0 caller hits in `src/`.
- UI interactions (button clicks, item checks) succeed visually, but emit 0 telemetry events to Firestore.

### Why it fails
It satisfies static text checks for missing constants while leaving runtime observability dead ("write without reader" / "constant without caller").

### Correction
When registering new event constants in `ActivityLogService.js`:
1. Wire the caller invocation in the corresponding UI handler or service method in the same commit turn.
2. Assert that `ActivityLogService.logActivity` / `logChecklistActivity` is invoked in the component unit test.

---

## Anti-Pattern 3 — Preflight Warning Suppression

### What it is
Reporting *"clean governance, zero build errors"* based solely on exit status `0` of `npm run preflight`, while ignoring active warning logs printed by the gate (such as `P11 > 600 lines` threshold breaches or `P-SVC` service impact requirements).

### Symptoms
- User summary reports "clean preflight" or "0 errors".
- Terminal log contains `🟡 P11 — File size threshold: >600 lines` or `P-SVC`.

### Why it fails
Exceeding the 600-line hard ceiling on host files causes hidden maintainability debt and refactoring blocks. Masking warnings because the script returned `0` allows code growth violations to accumulate silently.

### Correction
Always inspect the preflight output log line by line. If `P11`, `P-SVC`, or `P87` warnings are emitted, explicitly list them in the verification summary alongside the exit status.

---

## Task-Dashboard Instance

- **Session Date**: 2026-08-13  
- **Governing Ticket**: TASK-245  
- **Incident Record**: `docs/incidents/INC-077-pseudo-council-declaration-unfired-telemetry-and-preflight-suppression.md`  
- **Files Touched**: `ActivityLogService.js`, `MyDayPage.jsx`, `MyDayComponents.jsx`
