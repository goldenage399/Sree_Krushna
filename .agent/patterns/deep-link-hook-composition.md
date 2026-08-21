---
pattern: deep-link-hook-composition
activation_tier: reference
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Deep-Link Hook Composition (Wrap, Don't Modify)

**Category**: Process
**Applies to**: Adding URL-synced state (deep-linking, tab persistence, filter persistence) to a
page that already manages that state via a local hook (reducer, `useState` pair, or a shared
pattern hook like this repo's `useModalFlow`); or building a second consumer of an existing
page's rich UI that needs the same capability without duplicating it.
**Origin**: 2026-07-03 (Task-Dashboard task-detail deep-linking + shared `TaskCockpitView`)
**Status**: HYPOTHESIS

---

## Pattern — Compose a Thin Wrapper Around the Existing State Hook

### Problem

A page already manages some interaction state locally (e.g. a modal's open/closed state via a
`useModalFlow()` instance). A new requirement needs that state reflected in the URL (deep-
linking) so it survives reload/sharing. The tempting shortcut is to either (a) modify the shared
state hook itself to know about routing, coupling a generic pattern hook to `react-router-dom`
for every consumer, or (b) duplicate the open/close logic per page with router calls inlined,
producing drift between consumers.

A related, adjacent problem: a second page needs the same *rich* UI (stat cards, filters, list
rendering, modals) an existing page already has, fed by different underlying data. The shortcut
here is either building a second, cheaper copy of the UI (drift risk, doubles the surface for
the next feature request) or generalizing the *data-fetching hook* to serve both pages (risks
smuggling one page's scoping assumptions into the other, and couples two independently-evolving
query shapes).

### Why it happens

Reaching for the nearest thing that "already does most of this" is efficient in the moment, but
skips the question of *which* layer should own the new capability — the state hook, the data
hook, or a new composition layer sitting between them.

### Solution

1. **Deep-linking**: write a small hook that takes the *existing* state hook instance as a
   parameter (not a replacement for it) and returns wrapped actions (`openX`/`closeX`) that call
   the underlying hook's methods *and* sync `useSearchParams` with the functional-updater form
   (`setSearchParams(prev => { const next = new URLSearchParams(prev); ...; return next; })`,
   `{ replace: true }`) so unrelated params already in the URL survive. The original hook (e.g.
   `useModalFlow.js`) stays framework-agnostic and untouched; only the new wrapper imports
   `react-router-dom`.
2. **Shared rich UI, different data sources**: extract the UI into a component that takes
   `tasks`/`isLoading`/`error` (or equivalent) as plain props — it owns no data-fetching. Each
   page keeps its *own* separate query/hook, however differently scoped, and passes the result
   in. Do not generalize the data hook to serve both; that couples two independently-evolving
   scoping rules (e.g. "my own tasks" vs. "all tasks I'm allowed to see, role-dependent") into
   one hook's branching logic.
3. **Composition boundary**: personal/page-specific chrome (headers, page-specific banners, copy
   that says "you"/"your") stays in the page. Only the genuinely generic middle section (the part
   that would render identically regardless of *whose* data it is) moves into the shared
   component.

### Failure Mode

Modifying the shared state hook to accept router hooks internally makes every future consumer
of that hook implicitly depend on `react-router-dom`, breaking any non-routed usage (e.g. a
modal rendered inside a component-preview sandbox) and making the hook harder to test in
isolation. Generalizing the data hook instead produces a hook with a `scope` flag branching to
two different query builders — a maintenance hazard the moment one scope's rules change and the
change is applied to the shared hook without re-verifying the other scope's behavior.

### Task-Dashboard instance

`src/hooks/patterns/useTaskDeepLink.js` wraps a `useModalFlow()` instance passed in by the
caller; `useModalFlow.js` itself was not touched. `src/components/TaskCockpitView.jsx` was
extracted from `MyTasksPage.jsx` to also serve `TeamOversightPage.jsx`'s new "All Tasks" tab —
`useMyTasks` (personal, `buildPersonalTaskQuery`) and `TeamOversightPage`'s own
`tasksQuery`/`onSnapshot` (`buildScopedTaskQuery`, role-aware) were kept fully separate; only
`tasks`/`isLoading`/`error` cross the component boundary as props.

---

## Anti-Pattern — Asynchronous State Deferral Race Condition (Modal Reopening)

### What it is
A race condition where local synchronous state updates (such as closing a modal) run faster than global asynchronous state updates (such as React Router search parameters updates), causing the local state to be overwritten/reset during transition propagation.

### Symptoms
Dismissing/closing a deep-linked modal (e.g. by clicking close) causes the modal to immediately reopen or flash back into view because the URL's query parameters have not been cleared by the time the next render cycle evaluates the auto-open effect.

### Why it fails
React state updates are batched and scheduled, but asynchronous transitions like URL changes propagate through React Router context, which is typically deferred relative to local synchronous reducer dispatches. During the intermediate render:
1. Local modal `isOpen` becomes `false`.
2. The search parameters hook still returns the old `taskId` parameter.
3. The hook's auto-open `useEffect` runs, sees `!isOpen`, finds the parameter, and calls `openTask` again.

### Correction
Introduce a mutable React `useRef` (e.g. `justClosedTaskId`) inside the deep-linking hook to track the task ID currently being closed.
1. Guard the auto-open block: `if (justClosedTaskId.current === taskId) return;`
2. Set `justClosedTaskId.current = taskId` in `closeTask` before dispatching `close()`.
3. Clear `justClosedTaskId.current = null` once the URL query parameter is successfully deleted (e.g. `!taskId` in the effect) or when a new task is explicitly opened.

### Task-Dashboard instance
[useTaskDeepLink.js](file:///d:/GitHub_Repo/Task-Dashboard/src/hooks/patterns/useTaskDeepLink.js#L25-L55) introduces a `justClosedTaskId` `useRef` guard to solve this race condition when closing the `TaskDetailsModal` component.

