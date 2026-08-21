# INC-009 — Unmemoized Search Callback Infinite Render Loop

**Date**: 2026-06-12  
**Severity**: High (unresponsive UI, browser warning / loop crash on active pages)  
**Status**: Resolved (pattern hooks hardened, calling pages refactored to stable module-level callbacks)  
**Affected Component**: `useAsyncSearch.js` (and pages: `EscalationDashboard.jsx`, `Dashboard.jsx`, `UnifiedTaskView.jsx`)  

---

## What Happened

When loading the `EscalationDashboard` page, the browser console outputted:
```
Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
    at EscalationDashboard (http://localhost:5174/src/pages/EscalationDashboard.jsx:26:24)
```
This warning indicates that the page entered an infinite loop of state updates and renders, freezing the user interface.

---

## Root Cause

1. **Unstable Function References**: In `EscalationDashboard.jsx`, `useTeamOversight` was instantiated with inline functions for search configuration:
   ```javascript
   const oversight = useTeamOversight({
     realtime: true,
     realtimeQuery: buildEscalatedQuery,
     searchTasks: async () => [], // <-- Recreated on every render
     batchUpdateTasks: async () => {},
   });
   ```
2. **Direct Hook Dependency on Callback**: Under the hood, `useTeamOversight` delegates to the pattern hook `useAsyncSearch.js`. This hook listed `searchFn` directly in its query-fetching `useEffect` dependency array.
3. **Loop Cycle**: 
   - Initial render calls `useAsyncSearch`.
   - The query length check in `useAsyncSearch` runs:
     ```javascript
     if (debouncedQuery.length < minChars) {
       setResults([]); // <-- Triggers state update
       return;
     }
     ```
   - Because `setResults` sets state, React schedules a re-render.
   - The re-render recreates the inline `searchTasks: async () => []` callback reference.
   - `useAsyncSearch`'s `useEffect` detects `searchFn` changed and runs again, calling `setResults([])` (which is a new array literal), creating an infinite loop.

---

## Resolution

1. **Hardened Pattern Hook**: Updated `useAsyncSearch.js` to decouple the search execution from the `searchFn` reference changes. The callback is now stored in a `useRef`, mimicking the ref-based delegate pattern used in other core hooks:
   ```javascript
   const searchFnRef = useRef(searchFn);
   useEffect(() => {
     searchFnRef.current = searchFn;
   });
   
   // ...
   
   useEffect(() => {
     const currentSearchFn = searchFnRef.current;
     if (!currentSearchFn) return;
     // ... Perform search
   }, [debouncedQuery, minChars, cacheResults]); // searchFn removed from deps
   ```

2. **Cleaned calling Pages**: Refactored the dashboard components ([EscalationDashboard.jsx](file:///d:/GitHub_Repo/Task_Dashboard/Task-Dashboard/src/pages/EscalationDashboard.jsx), [Dashboard.jsx](file:///d:/GitHub_Repo/Task_Dashboard/Task-Dashboard/src/pages/Dashboard.jsx), and [UnifiedTaskView.jsx](file:///d:/GitHub_Repo/Task_Dashboard/Task-Dashboard/src/pages/UnifiedTaskView.jsx)) to define empty/no-op callbacks outside the component rendering function, establishing stable references.

3. **Added Regression Test**: Created a unit test suite [useAsyncSearch.test.js](file:///d:/GitHub_Repo/Task_Dashboard/Task-Dashboard/src/hooks/patterns/useAsyncSearch.test.js) asserting that changing `searchFn` references do not trigger redundant searches or state updates.

---

## Architectural Surface Mapping

1. **UI Surface**: Unresponsive/frozen interface during infinite render loops. Resolving this fixed the loop.
2. **Data Surface**: *N/A* - No changes to Firestore schemas, rules, or database write API structures.
3. **Reactive Surface**: State updates (`setResults`) inside pattern hooks were triggered by changing callback function references. decalibrated dependency tracking was corrected using `useRef`.
4. **Service Surface**: *N/A* - Cloud functions, authentication context, and external API gateways are unaffected.
5. **Module Surface**: *N/A* - Module package boundaries or route registrations were not modified.
6. **Governance Surface**: Standards updated in `GEMINI.md` to ensure pattern hooks handle developer-provided callbacks defensively via refs.

---

## Structural Invariant Established

### Protocol 84: Hook Callback Reference Decoupling
* **Rule**: When building or maintaining generic pattern hooks (e.g. T2 patterns like `useAsyncSearch`, `useDataGridFlow`, etc.) that accept developer-defined callback functions, the hook **MUST** store these callbacks in a mutable React ref (`useRef`) and update them on every render.
* **Why**: This prevents unmemoized callback references passed inline by product developers from causing infinite render loops or stale closures inside pattern effects.
* **Verification Gate**: Running `npm run test:unit:run` must assert reference-change safety for all hooks.
