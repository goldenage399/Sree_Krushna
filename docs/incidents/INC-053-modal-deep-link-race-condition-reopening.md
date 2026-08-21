# Incident Report: INC-053 — Modal Deep Link Race Condition Reopening

## Incident Summary

A UI issue was reported where closing a task details modal caused the modal to immediately reopen. This issue occurred on views that synchronize their open/closed details modal state with the URL query parameters using the deep link hook.

Forensic analysis revealed a React state update race condition:
1. **The Race Condition**: In `useTaskDeepLink.js`, the `closeTask` method synchronously dispatches a state update to close the details modal (`detailsModal.close()`), changing `isOpen` to `false`. Simultaneously, it calls React Router's `setSearchParams` to delete the `taskId` query parameter from the URL.
2. **Asynchronous Propagation Delay**: The React Router history update runs asynchronously. During the next immediate render, `detailsModal.isOpen` is `false`, but React Router's `searchParams` still contains the old `taskId` (as the navigation update has not propagated to local component state yet).
3. **Reopening Trigger**: Because `useModalFlow` returns a new object reference on every render, the auto-open `useEffect` inside `useTaskDeepLink` is triggered. Seeing that the modal is not open (`!detailsModal.isOpen` is true) and that a valid `taskId` exists in `searchParams`, the effect calls `detailsModal.open(task)` which immediately reopens the modal.

- **Affected Components**: `src/hooks/patterns/useTaskDeepLink.js`
- **Symptom**: User closes the modal once, and it immediately flashes/reopens.
- **Fix**: Added a `useRef`-based guard (`justClosedTaskId`) inside the `useTaskDeepLink` hook. This tracks the task ID currently being closed. The auto-open effect is bypassed if the URL's `taskId` matches the task we just closed, and the ref is reset once the parameter is successfully cleared from the URL.

---

## Root Cause Analysis

React state updates are batched and scheduled, but asynchronous transitions like URL history changes propagate through React Router context, which is typically deferred relative to local synchronous reducer dispatches. 

When `useTaskDeepLink` closes a task modal:
```javascript
  const closeTask = useCallback(() => {
    detailsModal.close(); // 1. Synchronously dispatches CLOSE action (isOpen -> false)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(paramName);
      return next;
    }, { replace: true }); // 2. Schedules URL param deletion asynchronously
  }, [detailsModal, setSearchParams, paramName]);
```
The local reducer changes state immediately. Upon the next render:
- `detailsModal.isOpen` is `false`.
- `searchParams.get(paramName)` is STILL the target taskId because the router's asynchronous state update has not resolved yet.
- The `useEffect` dependencies trigger a run.
- The condition `if (detailsModal.isOpen) return;` evaluates to false, and the code detects `taskId` in search parameters, matching it against the tasks array and calling `detailsModal.open()`.

---

## Architectural Surface Mapping

1. **UI Surface**: Modal flashes and reopens, preventing users from dismissing the details dialog.
2. **Data Surface**: N/A.
3. **Reactive Surface**: Mismatch between synchronous local state updates (via `useReducer` in `useModalFlow`) and asynchronous contextual updates (via `useSearchParams` in React Router). Resolved via a mutable `useRef` to bridge the propagation delay.
4. **Service Surface**: N/A.
5. **Module Surface**: N/A.
6. **Governance Surface**: Registered new design invariant `FKL-DI-021` (Ref-based state transition synchronization/race-condition guards in deep link hooks).

---

## Corrective Actions & Resolution

1. **Ref Guard**: Introduced `justClosedTaskId` ref in `useTaskDeepLink.js` to guard the auto-open effect.
2. **Clear Logic**: Reset the ref to `null` once the query parameter deletion propagates and `taskId` is no longer present in the URL, or when a new task is explicitly opened.
3. **Verification**: Checked file syntax and linting with eslint (`npx eslint src/hooks/patterns/useTaskDeepLink.js`).

---

## Prevention & Invariants

- **FKL-DI-021 (SSOT Invariant)**: In custom hooks coordinating local synchronous modal state with global asynchronous state (like search parameters or URL history), a mutable `useRef` guard MUST be used to block auto-open effects from reacting to stale parameters during the asynchronous transition period.
