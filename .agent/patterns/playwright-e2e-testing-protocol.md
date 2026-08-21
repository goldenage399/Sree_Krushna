---
pattern: playwright-e2e-testing-protocol
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "playwright modal test"
  - "playwright click card modal"
  - "playwright strict mode collision"
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Playwright E2E Testing & Modal Disambiguation Protocol

**Category**: Process / Design Gate / Debugging Methodology  
**Applies to**: E2E automated test suites using Playwright (`tests/playwright/`)  
**Origin**: 2026-08-13 (INC-078 / Playwright E2E Risk Scoring Validation Session)  
**Status**: VALIDATED (Verified across 4/4 passing Playwright test cases in 33.8s)  

---

## Pattern — Playwright E2E Modal Automation Protocol

### Problem
When automating React modal flows (such as clicking task cards to open detail modals), Playwright tests often hang until timeout or crash with strict mode locator collisions. This occurs because:
1. Compact card containers lack explicit click handlers or role targets.
2. Loose locators (`getByText('Task Title')`) match top banner widgets, sidebar items, or breadcrumb links instead of the target card.
3. Task titles render in multiple DOM locations (modal title `<h2>` and breadcrumb `<span>`), causing Playwright strict-mode errors (`resolved to 2 elements`).
4. Reopening modals inside a single `for` loop causes React modal state hook (`useModalFlow`) cleanup race conditions.

### Why It Happens
Naive Playwright scripts assume DOM element uniqueness and synchronous modal lifecycle transitions. In complex React dashboards, components re-render titles across navigation breadcrumbs, and modal state hooks perform asynchronous URL parameter cleanup (`useTaskDeepLink`).

### Solution (The 4 Golden Rules)

#### Rule 1: Use Tier 2 Deep Link Navigation for Modal Testing
Rather than simulating UI clicks across layout-dependent Kanban/List views, navigate directly via URL deep link parameters (`/my-tasks?taskId=${taskId}`). This:
- Bypasses layout variation differences (Kanban vs List mode).
- Exercises Tier 2 `useTaskDeepLink` URL parameter state sync.
- Guarantees deterministic, instant modal opening.

#### Rule 2: Explicit `data-testid` Modal Title Disambiguation
Never use loose `modal.getByText(title)` assertions when verifying modal titles. Target the explicit modal title test ID:
```javascript
await expect(modal.getByTestId('task-details-modal-title')).toHaveText(expectedTitle);
```

#### Rule 3: Isolated Test Case Structure (Fresh Contexts)
Never run sequential modal open/close operations inside a `for` loop in a single `test()` block. Give every modal interaction its own independent `test('...', async ({ page }) => { ... })` block. Each test receives a clean page and browser context.

#### Rule 4: Ensure Card Containers Have Click Handlers & Target Headings
When testing UI clicks, ensure card containers pass `onClick={() => onViewDetails?.(task)}` and target the inner heading (`card.getByRole('heading').first().click({ force: true })`) to avoid accidental button clicks (such as "Update" buttons on cards).

---

## Anti-Pattern — Loose Modal Locators & Loop Modal Chaining

### Symptoms
- `expect.toBeVisible: strict mode violation: getByText(...) resolved to 2 elements`.
- `Error: locator.click: Test timeout of 30000ms exceeded waiting for getByRole('button', { name: /View Details/i })`.
- Test 1 passes, but Test 2 & 3 time out waiting for `task-details-modal` to become visible.

### Correction
Replace loose text locators with scoped `data-testid` selectors, split loop tests into independent `test()` blocks, and leverage deep link parameter URLs (`?taskId=...`).

---

## Task-Dashboard Instance
- `tests/playwright/risk-scoring-e2e.spec.js`: Fully certified Playwright test suite using Tier 2 deep link navigation and `task-details-modal-title` test IDs.
- `src/components/TaskCard.jsx:301`: Added `onClick` handler to compact card container wrapper.
- Case Study: `docs/incidents/INC-078-playwright-e2e-modal-locator-and-strict-mode-collisions.md`.
