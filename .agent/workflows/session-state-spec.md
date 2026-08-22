---
description: Session State Specification - Define the schema and lifecycle for the governance SESSION_STATE json.
---

# Session State Specification (SESSION_STATE)

This document defines the formal schema, fields, and lifecycle for the governance `SESSION_STATE` in the Interactive Mode-Based Governance System. It is the single source of truth (SSOT) for the schema serialized to `.agent/session/SESSION_GOVERNANCE_STATE.json`.

---

## 1. Field Definitions

The `SESSION_STATE` data structure contains five primary fields designed to manage execution mode lifecycle, surface constraints, and risk detection.

### 1.1 `current_phase`
Tracks the current phase of the governance system during an active session.
- **Type**: `String` (Enum)
- **Allowed Values**:
  - `Start`: Session startup, always-on minimal checks, risk signal extraction.
  - `Routing`: Orchestrator Router evaluating intent signals and routing.
  - `Execution`: Specialist modes active (Topology, Implementation, Safe Refactor).
  - `Verification`: Verification and integration validation checklist execution.
  - `GovernanceActivation`: Verification passes; PIRR, drift, and retirement evaluation active.
  - `Complete`: Teardown and session closeout completed.

### 1.2 `current_mode`
Tracks the active execution specialist mode.
- **Type**: `String` (Enum)
- **Allowed Values**:
  - `None`: No specific specialist mode active (default).
  - `Topology`: Mode 1 (Topology Specialist) analyzing graph propagation and contracts.
  - `Implementation`: Mode 2 (Implementation Executor) conducting local code updates.
  - `Verification`: Mode 3 (Integration Verification) conducting checks.
  - `Reconciliation`: Mode 4 (Reconciliation Specialist) updating SSOT documentation.
  - `SafeRefactor`: Mode 5 (Safe Refactor Specialist) handling complex/large-code migrations.

### 1.3 `risk_signals`
A set of detected signals during the startup or execution phases that trigger specialized routing.
- **Type**: `Set<String>` (Enum)
- **Allowed Values**:
  - `p11_file_growth`: A file exceeds 600 lines or acts as a god-node.
  - `p68_collection`: A Firestore collection constraint is touched.
  - `p65_shared_setter`: A shared state setter or context export is modified.
  - `cross_repo`: Multi-repository synced modifications are detected.
  - `incident`: Historical incident pattern is matched.
  - `sap_tracked_change`: Shared Alignment Protocol file modification is detected.

### 1.4 `active_surfaces`
The architectural surface areas impacted by the session's work items.
- **Type**: `Set<String>` (Enum)
- **Allowed Values**:
  - `ui`: User Interface components and layout structures.
  - `data`: Database, models, and raw schemas.
  - `reactive`: Context providers, hooks, and reactive handlers.
  - `service`: Core services and controller layers.
  - `module`: High-level feature sets and module integrations.
  - `governance`: System-level rules, workflows, and documentation.

### 1.5 `blast_radius_scope`
Defines strict limits on what codebase components can be modified.
- **Type**: `Object`
- **Structure**:
  ```json
  {
    "UI": "boolean",
    "DB": "boolean",
    "Reactive": "boolean",
    "Service": "boolean",
    "Module": "boolean",
    "Doc": "boolean"
  }
  ```
- **Population**:
  - Populated dynamically by Mode 1 (Topology Specialist) or Mode 5 (Safe Refactor Specialist).
  - **UI-Only Path Default**: If the Orchestrator Router bypasses Mode 1/5 and routes execution directly to Mode 2 (Implementation), `blast_radius_scope` is automatically initialized to:
    ```json
    {
      "UI": true,
      "DB": false,
      "Reactive": false,
      "Service": false,
      "Module": false,
      "Doc": false
    }
    ```
- **Scope Constraint**: Mode 2 (Implementation) **MUST NOT** write code that violates a flagged scope boundary. For example, if `"DB": false`, no database mutations or collection access code can be added or edited.

---

## 2. State Lifecycle

The `SESSION_STATE` flows dynamically through a session lifecycle, maintaining state persistence via a dedicated JSON file.

```
[Session Start] -> (Initialize None) -> [Risk Signals] -> [Routing] -> [Execution Specialist] -> [Verification] -> [PIRR/Reconciliation] -> [Complete]
```

### 2.1 Initialization
At session start (`aos-session-open.md`), a fresh state instance is initialized in memory:
- `current_phase` is set to `Start`.
- `current_mode` is set to `None`.
- `risk_signals` is empty.
- `active_surfaces` is empty.
- `blast_radius_scope` is initialized to all `false`.

### 2.2 Updating
The state is updated dynamically:
- **Phase transition**: When moving from Startup to Routing, `current_phase` becomes `Routing`.
- **Signal detection**: When the pre-flight scan identifies a god-node file (e.g. >600 lines), `risk_signals` appends `p11_file_growth`.
- **Mode transition**: When the orchestrator router selects a specialist, `current_mode` transitions (e.g., `SafeRefactor`) and `current_phase` becomes `Execution`.
- **Scope propagation**: The activated specialist populates `blast_radius_scope` and passes it to Mode 2.

### 2.3 Serialization & Persistence
- **Serialization Target**: `.agent/session/SESSION_GOVERNANCE_STATE.json`
- **Constraint**: State **MUST** be serialized to this dedicated JSON file on every state update.
- **Prohibition**: Do **NOT** serialize governance state fields to `SESSION_BRANCH_STATE.md` or any other branch-only tracker. The schemas are incompatible and serve distinct purposes.

---

## 3. Relationship to SESSION_BRANCH_STATE

The governance state system runs in parallel with the live branching/triage system. Their relationship is strictly defined below.

### 3.1 Division of Concerns
- **`SESSION_BRANCH_STATE.md`** (managed by `SESSION-ORCHESTRATION.md`): Tracks work-item lifecycle across concurrent investigations (e.g., branch ID, title, state, and resume conditions).
- **`SESSION_STATE`** (managed by `session-state-spec.md`): Tracks governance execution modes, risk profiles, and constraints within the execution path of a single work item.

### 3.2 Coexistence
Both systems may be active concurrently. A developer/agent may have multiple cognitive branches tracked in `SESSION_BRANCH_STATE.md`, while the active branch currently executing runs under the rules and constraints of a specific `SESSION_STATE`.

### 3.3 Session Close Order
During closeout (`aos-session-close.md`), the teardown order must be strictly sequenced:
1. **First**: Complete and serialize the final `SESSION_GOVERNANCE_STATE.json` to close the active governance loop.
2. **Second**: Run branch triage (`SESSION-ORCHESTRATION.md` §2) to manage branch-state preservation, parking, or merging.

### 3.4 Conflict Resolution
If a cognitive branch is scheduled to be **PARKED** or suspended while a governance mode is still active:
1. **Governance Teardown First**: Orderly suspend or tear down the active governance mode (e.g., transition `current_phase` to `GovernanceActivation` or safe-suspend status).
2. **Emit Handoff Note**: Generate a detailed handoff note capturing the precise `SESSION_STATE` snapshot (current phase, mode, and blast radius).
3. **Run Branch Triage**: Run the branch state updates in `SESSION_BRANCH_STATE.md` to safely park the branch.
