---
name: admin-component-contracts
description: >
  Source-of-truth pointer for shared admin UI primitives in Task-Dashboard. Use
  whenever reviewing, modifying, or creating anything that consumes AdminStatTile,
  AdminSectionHeader, PillTabGroup, SearchInput, AdminToolbar, or AdminTableShell
  (all exported from src/components/admin/AdminShell.jsx). Trigger when a review
  flags props, defaults, padding, React.memo, or className forwarding on admin
  primitives. Read the live source lines below instead of re-tracing the file or
  asserting a contract from memory — these primitives change, frozen tables rot.
---

## Goal

Stop reviewers from re-tracing `AdminShell.jsx` (and getting it wrong). All shared
admin primitives live in ONE file; this skill maps each to its exact source lines so
you read the current contract, not a stale copy.

## Single Source

**`src/components/admin/AdminShell.jsx`** — read the relevant range before asserting anything.

| Primitive | Source line | Notes |
| --- | --- | --- |
| `AdminSectionHeader` | `:38` | `{ icon, title, subtitle, action, id }` |
| `AdminStatTile` | `:80` | `React.memo` ✅, forwards `className` ✅, root `p-3 sm:p-5` |
| `PillTabGroup` | `:127` | `{ tabs, activeTab, onChange }` |
| `SearchInput` | `:158` | `{ value, onChange, placeholder, id }` |
| `AdminToolbar` | `:195` | `{ children, id }` |
| `AdminTableShell` | `:224` | table wrapper |

> ⚠️ The line numbers are hints. If they drift, grep `export (function\|const) <Name>`
> in AdminShell.jsx — never invent a prop list.

### Verified current facts (re-check at source before relying)

`AdminStatTile` (`:80-115`):
- **Wrapped in `React.memo`** — do NOT flag "add memo."
- **Accepts `className=''` and appends it to the root** (`:88`, `:100`) — overrides like
  `flex-1 min-w-[120px] max-w-[200px]` already work; do NOT flag "missing className."
- Root padding is **`p-3 sm:p-5`** (responsive) — already compliant.

## Call Sites (real usage)

- `src/components/ProfilesManageTab.jsx:301-345` — `#profile-mgmt-stats`, tiles use
  `className="flex-1 min-w-[120px] max-w-[200px]"`.
- `src/pages/AdminUsersPage.jsx` — additional usage (note: page lives in `src/pages/`,
  NOT `src/components/admin/`).

## Change Checklist

When modifying an admin primitive:
- [ ] Read its current source range first (table above)
- [ ] If consumed with layout overrides, confirm `className` is forwarded to the root
- [ ] Padding/spacing changes validated against tokens → `design-token-registry` / `DESIGN-TOKENS.md`
- [ ] New prop has a documented default in the JSDoc block above the export

## Cross-references

- Token validity → `ui-design-validator` skill / `DESIGN-TOKENS.md`
- Which SSOT spoke governs a change → `ssot-domain-mapper` skill
- Sizing math for tile grids → `parent-layout-audit` skill
