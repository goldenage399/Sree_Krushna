---
pattern: modal-swap-transition
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Modal Swap Transition with Isolated Component Composition

**Category**: Design Gate
**Applies to**: React pages and components handling sequential modal triggers (e.g., details modal raising a warning or override modal).
**Origin**: 2026-07-12 (DecisionSupportWarningModal z-index overlay bug FKL-DI-017)
**Status**: VALIDATED

---

## Pattern — Modal Swap Transition

### Problem
When an interactive modal (like `TaskDetailsModal`) raises a secondary validation or warning popup (like `DecisionSupportWarningModal`), mounting the second modal directly on top of the first causes visual clutter, dark backdrop stacking, and severe z-index/stacking context issues (e.g., the warning modal rendering *under* the details modal).

### Why it happens
1. **Z-Index limitations**: When React components render nested modals, the browser evaluates z-index within the nearest parent Stacking Context. If the secondary modal is rendered inside a nested wrapper, it may never overlay the root-level details modal.
2. **Backdrop compounding**: Layering two backdrops (`bg-black/50`) causes extreme screen darkening, reducing accessibility and visual clarity.

### Solution
Instead of layering multiple popups, implement a **Modal Swap Transition**:
1. **Portalling**: Render all standalone modals using `createPortal` to mount them directly under `document.body` (satisfying `FKL-DI-017`).
2. **Modal Swap State**: When the secondary modal triggers, close the primary modal and open the secondary modal.
3. **Restore Reference**: Store the source/origin identifier of the active primary modal. If the secondary modal is cancelled or closed without executing the action, use this reference to restore/reopen the primary modal seamlessly.

### Failure Mode
1. **Lost Context**: Failing to store the active task/trigger data causes the user to return to a blank list if they cancel the secondary modal, breaking task triage flow.
2. **Double Backdrop**: Forgetting to close the primary modal when opening the secondary modal, causing backdrop stacking.

### Task-Dashboard instance
* **Component Portalling**: [DecisionSupportWarningModal.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TeamOversight/DecisionSupportWarningModal.jsx) wraps its entire tree in `createPortal(..., document.body)`.
* **State Coordination**: [TeamOversightPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/TeamOversightPage.jsx) tracks the source details modal in state:
  ```javascript
  const [warningSourceModal, setWarningSourceModal] = useState(null); // 'details' | 'all-tasks' | null
  ```
  And restores it on close:
  ```javascript
  const handleWarningClose = () => {
    setIsWarningModalOpen(false);
    // Swap back: re-open the original details modal
    if (warningSourceModal === 'details' && activeTriageTask) {
      setSelectedTask(activeTriageTask);
      setIsTaskDetailsOpen(true);
    } else if (warningSourceModal === 'all-tasks' && activeTriageTask) {
      allTasksDetailsModal.open(activeTriageTask);
    }
  };
  ```
