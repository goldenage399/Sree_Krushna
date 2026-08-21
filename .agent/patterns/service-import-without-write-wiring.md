---
pattern: service-import-without-write-wiring
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Anti-Pattern: Service Import Without Write Path Wiring

**Category**: Anti-Pattern
**Applies to**: Any form or modal component that imports a domain service
**Origin**: 2026-06-25 — INC-027 blocker sync gap in `TaskUpdateModal.jsx`
**Status**: VALIDATED (discovered in production, fix confirmed working)

---

## Anti-Pattern — Service Import Without Write Path Wiring

### What it is

A service is imported at the top of a component file, signalling that the service is wired. However, the service's **write methods** are never called in the component's submit handler or mutation path. The service may be called for reads (e.g. to populate dropdowns), making the import appear legitimate. The write path is silently absent.

### Symptoms

- A form field updates its local UI state but has no effect on persisted data
- On re-opening a form, the field always reverts to its default value
- The import of the service passes a surface grep scan — the absence of a write call is invisible
- No console errors (the write never attempted, so nothing fails)

### Why it fails

The import is a necessary but not sufficient signal of wiring. A service can be imported for:
- Reading data to populate options
- Utility/helper methods that don't write
- Future wiring that was never completed

None of these cause the write path to exist. An agent or reviewer scanning the file's imports sees the service and assumes the write path is present. The gap only surfaces when the domain object's persisted state is inspected directly.

### Correction

For every service imported into a form/modal component, verify:

1. **If the service owns a write interface for a field managed by this form** → that write method must be called in the submit handler when the field value is non-default.
2. **If the field initializes from the domain object** → the `useEffect`/`useState` initialization must read from the domain object, not hardcode a default.

**Grep check** (run on any form component that imports a domain service):
```bash
# Step 1: List all service imports
grep -n "^import.*Service" <component-file>

# Step 2: For each service, check write methods are called in submit handler
grep -n "ServiceName\." <component-file> | grep -v "^import"
# If only read methods appear (get*, fetch*, load*) but no write methods
# (sync*, update*, save*, create*, delete*) → gap likely exists
```

### Task-Dashboard instance

`src/components/TaskUpdateModal.jsx` — `BlockerWorkflowService` imported at line 47.
`syncTaskBlockers()` (write method) never called from `handleSubmit`.
`formData.currentBlocker` hardcoded to `'none'` on modal open, never read from `task.blockedBy`.

Fixed in INC-027 (2026-06-25). See `docs/incidents/INC-027-blocker-sync-service-import-without-write-wiring.md`.
