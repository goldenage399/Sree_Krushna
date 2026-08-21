---
hub: 00_GOVERNANCE/HUB.md
---

# Sree Krushna Marriage OS — E2E & Telemetry Instrumentation Spec

## Overview
This specification defines the canonical selector hierarchy, automated testing contracts (`data-testid`), accessibility roles (`aria-*`), and entity telemetry tags (`data-entity-id`, `data-track`, `data-gate`) across the Sree Krushna Marriage OS.

---

## 🎯 Selector Taxonomy & Matrix

### 1. Authentication & Security Gate
| Element | Selector / TestID | ARIA Role / Attributes | Purpose |
| :--- | :--- | :--- | :--- |
| **Auth Overlay** | `[data-testid="auth-overlay"]` | `role="dialog" aria-modal="true"` | Initial gate barrier preventing unauthenticated access. |
| **Sign-In Button** | `[data-testid="login-button"]` | `aria-label="Sign in with Google"` | Google popup trigger. |
| **Auth Error Alert** | `[data-testid="auth-error"]` | `role="alert" aria-live="polite"` | Error banner on access denial. |
| **User Profile Chip** | `[data-testid="user-profile-chip"]` | - | Displays active authenticated email & tier. |
| **Sign Out Button** | `[data-testid="logout-button"]` | `aria-label="Sign Out"` | Sign-out action. |

---

### 2. Navigation & Module Tabs
| Module Tab | TestID Selector | Target Panel TestID | ARIA Role / Attributes |
| :--- | :--- | :--- | :--- |
| **Command Center** | `[data-testid="nav-tab-dashboard"]` | `[data-testid="panel-dashboard"]` | `role="tab" aria-controls="tab-dashboard"` |
| **Multi-Track Swimlanes** | `[data-testid="nav-tab-swimlane"]` | `[data-testid="panel-swimlane"]` | `role="tab" aria-controls="tab-swimlane"` |
| **Action Items (CRUD)** | `[data-testid="nav-tab-tasks"]` | `[data-testid="panel-tasks"]` | `role="tab" aria-controls="tab-tasks"` |
| **Odia Vedic Liturgies** | `[data-testid="nav-tab-rituals"]` | `[data-testid="panel-rituals"]` | `role="tab" aria-controls="tab-rituals"` |
| **Couple Vision Studio** | `[data-testid="nav-tab-vision"]` | `[data-testid="panel-vision"]` | `role="tab" aria-controls="tab-vision"` |
| **Vendors & Procurement** | `[data-testid="nav-tab-procurement"]` | `[data-testid="panel-procurement"]` | `role="tab" aria-controls="tab-procurement"` |
| **Custody & Governance** | `[data-testid="nav-tab-governance"]` | `[data-testid="panel-governance"]` | `role="tab" aria-controls="tab-governance"` |

---

### 3. Task Execution Engine (CRUD)
| Action / Node | Selector / TestID | Notes |
| :--- | :--- | :--- |
| **Total Tasks KPI** | `[data-testid="kpi-total-tasks"]` | Numeric counter. |
| **Pending Tasks KPI** | `[data-testid="kpi-pending-tasks"]` | Numeric counter. |
| **Completed Tasks KPI** | `[data-testid="kpi-completed-tasks"]` | Numeric counter. |
| **Task Input Title** | `[data-testid="input-task-title"]` | Text input for new task title. |
| **Task Event Select** | `[data-testid="select-task-event"]` | Dropdown for milestone association. |
| **Task Owner Select** | `[data-testid="select-task-owner"]` | Dropdown for role assignment. |
| **Add Task Button** | `[data-testid="btn-add-task"]` | Submit trigger. |
| **Task Row** | `[data-testid="task-row-TSK-###"]` | Row container with `data-task-id="TSK-###"`. |
| **Task Checkbox** | `[data-testid="task-checkbox-TSK-###"]` | Toggle completion state. |
| **Task Delete Button** | `[data-testid="task-delete-TSK-###"]` | Deletion trigger. |

---

### 4. Day-Of Swimlanes & Gates
| Node | Selector / TestID | Telemetry Attributes |
| :--- | :--- | :--- |
| **Lane Filter Pills** | `[data-testid="filter-lane-<track>"]` | `data-track="all|bride|groom|priest|food|photo|fleet"` |
| **Track Container** | `[data-testid="swimlane-track-<track>"]` | Scoped track swimlane. |
| **Operational Gate Badge** | `[data-testid="gate-badge-GATE-##"]` | `data-gate="GATE-01..GATE-04"` |
| **Event Card Node** | `[data-testid="event-node-..."]` | Interactive modal trigger. |

---

### 5. Playwright Spec Automation Recipe

```javascript
// Example Playwright test utilizing canonical selectors
import { test, expect } from '@playwright/test';

test('verify task creation and KPI update', async ({ page }) => {
  await page.goto('https://sree-krushna-forever.web.app');
  
  // Navigate to Tasks Tab
  await page.getByTestId('nav-tab-tasks').click();
  await expect(page.getByTestId('panel-tasks')).toBeVisible();

  // Read initial total
  const initialTotal = await page.getByTestId('kpi-total-tasks').innerText();

  // Add new task
  await page.getByTestId('input-task-title').fill('Book Shehnai Troupe for Barat');
  await page.getByTestId('btn-add-task').click();

  // Verify task row mounted and KPI incremented
  await expect(page.getByText('Book Shehnai Troupe for Barat')).toBeVisible();
});
```
