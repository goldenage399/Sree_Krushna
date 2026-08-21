# INC-022 — Tailwind Bridge Specificity & Responsiveness Overflow (User Management Page clipping)

**Date**: 2026-06-22
**Severity**: Medium-High (table columns clipped, actions pushed off-screen, search bar layout stretched)
**Status**: Resolved
**Affected Component**: `src/pages/AdminUsersPage.jsx`, `src/styles/tailwind-semantic-bridge.css`
**Related INC**: INC-002 (Tailwind Bridge Cascade Conflict — ancestor check)
**Keywords**: tailwind-bridge, specificity-conflict, cascade-order, overflow-hidden, scroll-clipping, responsive-width, table-responsiveness
**Topology Layer**: Constraint Authority, Responsive Authority
**Ownership Type**: width, overflow
**Symptom Tags**: table-column-clipping, actions-off-screen, cascade-override, responsive-width-frozen

---

## What Happened

In the Admin Dashboard → User Management page (`AdminUsersPage.jsx`), the table container was severely clipped. On desktop viewports, the "Access Roles" column was compressed to "ACCE...", and the "Actions" column (holding Cog/Trash buttons) was pushed completely off-screen. Additionally, the top search bar stayed at `w-full` on desktop instead of collapsing to `md:w-auto`.

---

## Root Cause

1. **Bridge Cascade Specificity Conflict (ADR-008)**: `tailwind-semantic-bridge.css` is loaded *after* Tailwind CSS in `App.jsx`. Because the bridge defined `.w-full` but did not map `.md:w-auto`, and they had equal specificity, the bridge's `.w-full` rule won the cascade and overrode Tailwind's `md:w-auto`, freezing the search input at full width.
2. **Missing Utility Mappings (Ghost Classes)**: The table container used `overflow-x-auto` and `min-w-full`, which were absent from `tailwind-semantic-bridge.css`. Consequently, the horizontal scroll wrapper failed silently.
3. **Scroll Clipping via Parent `overflow-hidden`**: The parent card wrapper used `overflow-hidden` to clip rounded corners, which clipped the `overflow-x-auto` scrollbar on Windows environments where scrollbars consume physical layout space.

---

## Fix Applied

1. **Cascade Resolution via Bridge Additions**: Added missing base width and overflow utilities (`.min-w-full`, `.w-1/3`, `.overflow-x-auto`) and responsive stubs (`.md:w-auto`, `.md:w-64`, `.md:items-end`) inside the bridge CSS file so they resolve cleanly in the cascade.
2. **Card Overflow Relocation**: Moved the corner clipping constraints from the outer card element to the inner scroll container, preventing the card's `overflow-hidden` from swallowing the table's scrollbar.
3. **Responsive Table Preservation**: Rejected column-hiding and mobile card toggles to preserve desktop-level administrative grids, keeping horizontal scroll as the canonical behavior for complex grids.

---

## Architectural Surface Mapping

### 1. UI Surface
Search header now collapses correctly on desktop. Table horizontal scrollbar is fully visible and functional, preventing text truncation and actions clipping.

### 2. Data Surface
Not affected.

### 3. Reactive Surface
Not affected.

### 4. Service Surface
Not affected.

### 5. Module Surface
No module structure or routing changes.

### 6. Governance Surface
Standard **`P19`** (UI Component Style Assurance) and **`P27`** (UI Design System Compliance) updated to check for specificity conflicts between Tailwind utilities and bridge overrides.

---

## Structural Invariant Established

### Specificity Safe Responsive Layout Invariant
When using responsive utility classes alongside a theme-custom CSS bridge:
- Any utility-based size or layout override (e.g. `md:w-auto`, `md:items-end`) must be mirrored inside the media query blocks of `tailwind-semantic-bridge.css` if its base class (e.g. `w-full`) is defined in the bridge.
- Cards wrapping tables or dynamic list components must not use `overflow-hidden` on the outermost wrapper if a child element relies on `overflow-x-auto` or `overflow-y-auto` scroll contexts.
- Move border-radius clipping bounds directly to the scroll-active container to preserve both corner styling and scrollbar visibility.

See `.agent/patterns/css-bridge-specificity-management.md` for the process pattern governing specificity conflict resolution.
