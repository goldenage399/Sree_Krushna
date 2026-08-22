---
description: Systematic approach for identifying all affected code when refactoring shared patterns
---

# Change Impact Analysis Protocol

## Purpose

Systematic approach to identify all affected code when making changes involving shared state, patterns, or interfaces.

## 🚨 When to Invoke This Workflow

**MANDATORY** - Run this workflow before:

- Changing any custom hook signature (`useAuth`, `useTasks`, etc.)
- Modifying context providers
- Refactoring service functions
- Changing component props that others depend on
- Modifying Firebase collection structure

> **Trigger**: If you're about to change shared code and think "this might break things", you MUST run this workflow first.

**Related**: [PRE_CHANGE_CHECKLIST.md](../../docs/PRE_CHANGE_CHECKLIST.md) for the complete 7-phase methodology.

## Step 1: Identify Change Type

| Change Type                | Impact Scope  | Search Pattern             |
| -------------------------- | ------------- | -------------------------- |
| Context/state change       | All consumers | `useContext(ContextName)`  |
| Hook signature change      | All callers   | `useHookName(`             |
| Service function change    | All callers   | `ServiceName.functionName` |
| Component prop change      | All parents   | `<ComponentName`           |
| Firebase collection change | All queries   | `collection(db, 'name')`   |

> **Prop Cascades**: When refactoring or removing component props or variants, you must trace the cascade down the component hierarchy using [.agent/patterns/prop-cascade-trace-safety.md](file:///d:/GitHub_Repo/Task-Dashboard/.agent/patterns/prop-cascade-trace-safety.md) to prevent silent visual regressions.
> **Page Anchors**: When modifying styling or adding test/accessibility anchors in page-anchors, use [.agent/patterns/page-anchors-neutrality.md](file:///d:/GitHub_Repo/Task-Dashboard/.agent/patterns/page-anchors-neutrality.md) to prevent ID selector specificity from breaking layout overlay positioning.

---

## Step 2: Build Dependency Matrix

For each change, create a matrix:

```
CHANGE: useAuth() returns new field `organizationalLevel`

AFFECTED COMPONENTS:
├── Pages
│   ├── Dashboard.jsx - uses auth for routing
│   ├── TeamTasksPage.jsx - checks permissions
│   └── AdminPage.jsx - role gating
├── Components
│   ├── TaskCard.jsx - displays assignee info
│   ├── Navbar.jsx - shows user role
│   └── ProtectedRoute.jsx - access control
├── Hooks
│   ├── useTaskFilters.js - filters by role
│   └── usePermissions.js - permission checks
└── Services
    └── taskService.js - role-based queries
```

---

## Step 3: Verify Completeness

For **structural patterns** (import shapes, hook call patterns, AST-level checks), prefer ast-grep over text search — it understands syntax, not just strings:

```powershell
# Structural scan: all ARCH-INV rules after any service/auth/query change
npm run sg:check

# Targeted: if the change touched services
npm run sg:inv002

# Targeted: if the change touched Firestore queries or subscriptions
npm run sg:inv003

# Targeted: if the change touched AuthContext or ProfileContext
npm run sg:inv005
npm run sg:inv006
```

For **text/identifier searches** (renames, callers, usages), use PowerShell:

```powershell
# Windows PowerShell - Search for pattern
Get-ChildItem -Path src -Recurse -Include *.jsx,*.js | Select-String -Pattern "OLD_PATTERN"

# Should return: no results
```

---

## Step 4: Single Batch Fix

Make ALL fixes before testing. Use `multi_replace_file_content` for efficiency.

---

## Example Record

**Date:** YYYY-MM-DD
**Change:** [Description of change]

### Impact Summary:

- `oldPattern` → `newPattern`

### Fixed Count: X total

- X usages in components
- X usages in hooks

### Files Affected:

[List files]

---

## Integration with AOS

Run this BEFORE making changes (Phase A extension).
PIRR (Phase C) will verify documentation is updated.

---

_Ported from Task-Dashboard: 2025-12-30_
