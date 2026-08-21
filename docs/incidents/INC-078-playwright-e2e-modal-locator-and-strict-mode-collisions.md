# INC-078 — Playwright E2E Modal Locator Collisions, Compact Card Click Target Gaps & Strict-Mode Disambiguation

**Date**: 2026-08-13  
**Status**: RESOLVED (VERIFIED by 4/4 passing E2E tests in 33.8s, Commit `c601de74`)  
**Domain**: Frontend E2E Automation / Playwright / Component Accessibility  
**Affected Components**: `tests/playwright/risk-scoring-e2e.spec.js`, `src/components/TaskCard.jsx`, `src/hooks/patterns/useTaskDeepLink.js`  

---

## 1. Executive Summary

During E2E validation of **Blocker-Aware Task Risk Scoring & Upstream Link Read-Back (TASK-180)**, Playwright test runs encountered repeated timeouts and strict-mode locator failures when attempting to open and assert content inside `TaskDetailsModal`. Systematic debugging revealed four distinct UI/E2E interaction gaps: missing `onClick` handlers on compact Kanban card containers, locator ambiguity between top-banner widgets and grid cards, strict-mode collisions on multi-rendered task titles, and sequential modal state transition races. Resolving these issues established the canonical **Playwright E2E Modal Automation Protocol** for the repository.

---

## 2. Root Cause & Defect Analysis

### Defect 1 — Missing `onClick` Handler on Compact Task Cards (`VERIFIED`)
- **Symptom**: `card.getByRole('button', { name: /View Details/i })` timed out after 60,000ms.
- **Root Cause**: On `/my-tasks`, `groupedView` defaults to `true` (Kanban layout), rendering tasks in `compact` mode. Compact cards did not render the standard `"View Details"` button (which only exists in full list view), and the compact card `<div id="task-card-compact-${task.id}">` lacked an `onClick` handler. Clicking compact cards did nothing.
- **Fix**: Added `onClick={() => onViewDetails?.(task)}` to the compact card wrapper in `TaskCard.jsx:301`.

### Defect 2 — Loose Locator Banner Collisions (`VERIFIED`)
- **Symptom**: `page.getByText('Overdue Task').first()` clicked an element, but `TaskDetailsModal` never opened.
- **Root Cause**: The string `'Overdue Task'` rendered in both the top `ActionRequiredWidget` banner and the main task list. Loose matching with `.first()` clicked the top banner heading instead of the task card in the execution grid.
- **Fix**: Container-scoped locators or Tier 2 URL deep links (`/my-tasks?taskId=...`).

### Defect 3 — Strict-Mode Collision on Multi-Rendered Titles (`VERIFIED`)
- **Symptom**: `expect.toBeVisible: strict mode violation: getByTestId('task-details-modal').getByText(...) resolved to 2 elements`.
- **Root Cause**: `TaskDetailsModal.jsx` renders `task.title` in both the modal title heading `<h2 data-testid="task-details-modal-title">` and the top breadcrumb navigation path `<span>`. Loose `getByText()` matched both.
- **Fix**: Target specific test IDs: `modal.getByTestId('task-details-modal-title')`.

### Defect 4 — Sequential Modal State Transition Races (`VERIFIED`)
- **Symptom**: Running sequential click-to-open operations inside a single `for` loop caused test 2 and test 3 to fail waiting for modal visibility.
- **Root Cause**: Closing a React modal triggers asynchronous state cleanup (`useModalFlow` and URL param removal). Triggering the next card click before React completed state cleanup created a race condition.
- **Fix**: Split test cases into independent, isolated `test()` blocks with fresh page contexts.

---

## 3. Preventive Guardrails & Standard Operating Procedures

1. **Tier 2 Deep-Link E2E Pattern**:
   Prefer deep link URL parameters (`/my-tasks?taskId=${taskId}`) for modal testing. This bypasses layout-dependent click target differences and directly exercises `useTaskDeepLink` URL state sync.
2. **Explicit `data-testid` Modal Assertions**:
   Always assert modal titles using explicit test IDs (`modal.getByTestId('task-details-modal-title')`) rather than generic `getByText()`.
3. **Isolated Test Case Execution**:
   Never loop multiple modal open/close actions in a single `test()` block. Each modal interaction must be its own independent `test('...', async ({ page }) => { ... })`.

---

## 4. Verification Evidence

```text
Running 4 tests using 3 workers

  ok 1 [setup] › tests/playwright/auth.setup.js:48:1 › authenticate as e2e test user (11.3s)
  ok 2 [chromium] › 1. Blocked Task — resolves upstream dependency title via deep link (11.9s)
  ok 3 [chromium] › 3. Unplanned Task — renders unplanned status in details modal via deep link (12.7s)
  ok 4 [chromium] › 2. Overdue Task — renders overdue status in details modal via deep link (11.8s)

  4 passed (33.8s)
```
- **Screenshots Captured**: `02-my-tasks-blocked-task-modal.png`, `03-my-tasks-overdue-task-modal.png`, `04-my-tasks-unplanned-task-modal.png`.
- **Commit**: `c601de74`.

## 5. Affected Components
- `tests/playwright/risk-scoring-e2e.spec.js`
- `src/components/TaskCard.jsx`
- `src/hooks/patterns/useTaskDeepLink.js`
