---
pattern: write-without-reader
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

# Pattern: Write-Without-Reader

**ID**: `write-without-reader`
**Type**: Process / Verification
**Severity**: High (causes invisible data silos and silent feature failures)
**Origin Incident**: [INC-059](../../docs/incidents/INC-059-write-without-reader-pattern.md)


## The Anti-Pattern

A service or component writes data to a specific database collection, but no UI component currently exists or is wired to read from that collection to present the data to the user.

Example: `NotificationService` writes `schedule` events to the `notifications` collection, but `NotificationPanel` is hardcoded to derive its own notification list by querying `tasks` where `status === 'pending'`, completely ignoring the `notifications` collection. As a result, the `schedule` events disappear into a black hole.

## The Verification Protocol

When creating a new feature that writes to a database collection (especially via an existing Service), the agent MUST verify that a Read Path exists for that data before claiming the feature is "built".

### Step-by-Step Check
1. Identify the target collection being written to (e.g., `notifications`).
2. Identify which UI component is supposed to display this data (e.g., `NotificationPanel`).
3. Verify that the UI component actually executes a query against the target collection.
4. **Halt Condition**: If the UI component derives its data from a different collection (e.g. `tasks`), you have discovered a Write-Without-Reader gap. Do not proceed with the write path without flagging this gap as technical debt or resolving it.

## When to Apply
- When implementing any new "System Event", "Notification", or "Audit Log" that writes to a shared collection.
- When the user asks to "save X so the user can see it".

## Resolution Guideline
Do not rewrite the reader component unilaterally if it poses a massive architectural shift (e.g., if it would break existing derived notifications). Instead, document the incident, flag it as technical debt (e.g. DS-5), and consult the Architecture Council or the user for approval to rewire the read path.
