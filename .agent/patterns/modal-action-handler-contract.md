---
pattern: modal-action-handler-contract
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "onTaskAction"
  - "modal action handler"
  - "step_completed"
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Modal Action Handler Contract & UI State Synchronization

**Category**: Process / Design Gate  
**Applies to**: Child modal components that emit actions back to parent page containers (`TaskDetailsModal`, `TaskReviewModal`, `TaskUpdateModal`, `TaskCreationModal`).  
**Origin**: 2026-08-09 (INC-072 / TASK-224 Review 6.3)  
**Status**: VALIDATED  

---

## Pattern — Modal Action Handler Contract

### Problem
When a child modal component performs a mutation (e.g. step completion, task reassignment, status change) and calls `onTaskAction(action, payload)`, if the parent page container's `onTaskAction` switch statement omits a handler branch for `action`, the Firestore write succeeds and a toast fires, but the UI state on the parent page fails to re-render, leaving the interface stagnant until modal re-open or page reload.

### Why it happens
1. **Signature Mismatch**: Child modal emits 3 arguments (`onTaskAction(action, id, object)`) while parent page handler expects standard 2 arguments `(action, object)`.
2. **Missing Action Branch**: Parent page handler (`handleTaskAction`) handles `'reassign'` and `'override_complete'` but ignores new action types like `'step_completed'` or `'update'`.
3. **Prop-Only Reliance**: Child modal relies solely on parent prop re-render instead of updating its own internal state copy upon mutation completion.

### Solution

1. **Child Modal Signature**: Always emit standard 2-argument signature `onTaskAction(actionName, payloadObject)`:
   ```javascript
   if (onTaskAction) {
     await onTaskAction('step_completed', updatedTask);
   }
   ```

2. **Internal Modal State Backup**: Maintain internal local state initialized from props (with `useEffect` sync) inside complex modals so mutations trigger immediate re-renders:
   ```javascript
   const [task, setTask] = useState(initialTask);
   useEffect(() => { setTask(initialTask); }, [initialTask]);
   ```

3. **Parent Container Handler**: Always include a fallback `step_completed` and `update` branch in parent `onTaskAction` / `handleTaskAction` callbacks:
   ```javascript
   onTaskAction={async (action, t) => {
     if (action === 'reassign') { ... }
     else if (action === 'step_completed' || action === 'update') {
       if (t && typeof t === 'object') setSelectedTask(t);
     }
   }}
   ```

### Task-Dashboard Instance
- [`src/components/TaskDetailsModal.jsx`](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskDetailsModal.jsx#L483-L493)
- [`src/pages/TeamOversightPage.jsx`](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/TeamOversightPage.jsx#L1604-L1611)
- [`src/pages/MyTasksPage.jsx`](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/MyTasksPage.jsx#L195-L203)
- Incident Record: [`docs/incidents/INC-072-modal-action-handler-disconnect-and-ui-sync.md`](file:///d:/GitHub_Repo/Task-Dashboard/docs/incidents/INC-072-modal-action-handler-disconnect-and-ui-sync.md)
