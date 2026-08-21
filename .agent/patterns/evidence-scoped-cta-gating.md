---
pattern: evidence-scoped-cta-gating
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

# Pattern: Evidence-Scoped CTA Gating

**Category**: Anti-Pattern
**Applies to**: Any implementation of a council ruling, ADR, or RAM/RRM rule that names an actor abstractly (e.g. "Current Handler," "Owner," "the assigned occupant") rather than a specific role literal.
**Origin**: 2026-07-11 — TASK-213 Phase 4 (escalation mechanism). User asked "why can't I see an Escalate button as Admin?" after the feature had already shipped and been council-ratified.
**Status**: VALIDATED (caught and corrected in the same session that introduced it)

---

## Pattern — Evidence-Scoped CTA Gating

### Problem

A governance ruling (council record, ADR, RAM/RRM row) authorizes an action for an actor defined by a **data condition** — e.g. RAM's Responsibility Resolution Matrix says "Current Handler" may "Request escalation," which is level-agnostic and applies to whichever profile currently holds the task, Associate or Admin alike. But the *evidence* that motivated the ruling (an incident, a specific X1/X2 finding, a bug report) only ever exercised **one persona** — in this case, Associates, because that's whose escalations were structurally invisible.

The implementing agent writes the underlying service/writer method correctly (level-agnostic, as the rule requires), then wires the UI trigger only into the dashboard the evidence pointed at (`AssociateDashboard`). The mechanism is correct; the *reach* is wrong. Any other lawful actor under the same rule (an Admin who owns a task and needs Super Admin input for one phase) has no path to the action at all — not blocked by a permission check, just absent from every surface they'd naturally look.

This is worse than a visible permission denial: the capability silently doesn't exist for them, and nothing in the code flags the gap — `npm run build`, lint, and even the council's own validation gate all pass clean, because the omission is a *missing* CTA, not a broken one.

### Why it happens

Implementing agents (and humans) pattern-match to the concrete evidence in front of them rather than re-deriving the rule's actual scope from the abstract SSOT language. The evidence (X1/X2, "Associates' escalations are invisible to Supervisors") is vivid and specific; the rule ("Current Handler," RAM RRM) is abstract and easy to silently narrow while translating it into a `RequireAuth allowedRoles={[...]}` check or a dashboard-specific `handleEscalateConfirm`. The narrowing feels like scoping discipline (ship the fix for the reported case) rather than what it actually is — an unauthorized restriction of a ruling that was written to be broader.

### Solution

When implementing any capability derived from a rule that names an actor by **condition** rather than by **role literal**:

1. **Re-read the rule's exact wording before wiring the UI.** If it says "Current Handler," "Owner," "the assigned occupant," or similar — the authorization check must be a data predicate (`profileId ∈ myActiveProfileIds`), never a route guard, role array, or dashboard-specific placement.
2. **Enumerate every surface that renders the governed entity to a potentially-authorized actor** (every page/modal that can show this task/record to any user), not just the surface the motivating evidence came from. Gate the CTA there on the data predicate from step 1.
3. **Ask explicitly**: "Under the rule as written, which personas can legally take this action?" then check each has at least one reachable UI path — don't stop at "the persona in the bug report can now do it."
4. **If the rule is genuinely role-scoped** (some are — e.g. "Admin/Super Admin only" actions ARE role literals), the role-array/route-guard approach is correct. The trap is applying it to a rule that was written as a condition.

### Failure Mode

If applied incorrectly (i.e., not applied — the anti-pattern occurs): the feature ships, passes all automated gates, and the council/PR record shows the ruling was "implemented" — but a silent subset of the ruling's intended actors have no way to exercise it. The gap is typically discovered only when one of those actors manually asks "where is the button?", as happened here — meaning it survives code review, build, and even a formal governance record unless someone re-derives the rule's scope from first principles and checks every persona against it.

### Task-Dashboard instance

- **Introduced**: commit `919fd2bd` (TASK-213 Phase 4) — `applyManualEscalation`/`clearEscalation` written level-agnostically in `EnhancedTaskService.js`, but the only trigger was `AssociateDashboard.jsx`'s `handleEscalateConfirm`, gated implicitly by the `/associate` route.
- **Caught**: same session, next user turn — "I can't see escalate button as admin... isn't that escalation?"
- **Corrected**: follow-up commit adding a "My Task Actions" panel to `TaskDetailsModal.jsx`, gated on `isTaskOwner || isCurrentActor` computed from `userData.profileAssignments` — a data predicate, reachable from any surface that renders the modal, independent of role/level.
- **Verification detail worth repeating**: before trusting the widened gate, live data was checked (`npm run db:overview`) to confirm the target-resolution logic (`closest higher-level profile in same project`) actually has candidates at every level in the hierarchy (L1 "managing director" profiles are project-scoped, not global) — a rule can be correctly *scoped* in UI and still fail at runtime if the underlying data doesn't support every level the rule claims to cover.
