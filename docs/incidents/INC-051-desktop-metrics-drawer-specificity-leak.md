# Incident Report: INC-051 — Desktop Metrics Drawer Style Leakage & CSS Specificity Conflict

## Incident Summary

During the split-grid layout refactoring for the production activity views (`UserActivityDashboard.jsx` and `UserActivityPage.jsx`), a visual bug was reported where the mobile slide-out metrics drawer was leaking its custom card container styles (white background, shadow, padding, and left border) onto desktop viewports when the drawer was toggled to the open state. In addition, the close button header ("Activity Metrics" and the "X" button) designed for the mobile drawer remained visible on desktop viewports.

- **Affected Components**: [UserActivityDashboard.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/UserActivityDashboard.jsx), [UserActivityPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/UserActivityPage.jsx), [page-anchors.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/page-anchors.css)
- **Symptom**: Desktop layout rendered the metrics column with a duplicate white background card container, border, padding, and shadow. The mobile Close "X" button and header were visible on desktop grid columns.
- **Fix**:
  1. Relocated all mobile drawer styles (position, top, bottom, right, padding, border-left, background, and shadows) into a dedicated `.metrics-drawer-open` CSS class scoped inside a `@media (width <= 1023px)` media query block.
  2. Created a `.lg-hidden-important` CSS utility scoped inside a `@media (width >= 1024px)` media query block to guarantee the close header is hidden on desktop viewports.
  3. Renamed the ID selector `#isActive` to `#is-active` in [page-anchors.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/page-anchors.css) and updated inputs in [ProjectCategoryManager.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/ProjectCategoryManager.jsx) and [ProfileModal.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/ProfileModal.jsx) to resolve stylelint pattern failures.

---

## Root Cause Analysis

1. **Specificity Collisions**:
   * The wrapper applied Tailwind-like custom helper classes such as `bg-theme-bg-card` and `border-theme-border`. Because these classes are custom CSS selectors defined in global stylesheets rather than core Tailwind utility classes, they had the same CSS specificity (`0-1-0`) as Tailwind's responsive reset utilities (e.g. `lg:bg-transparent`, `lg:border-none`).
   * In the CSS cascade, selectors with equal specificity are resolved by stylesheet source order. The custom background and border classes overrode the responsive Tailwind utility classes, causing them to leak into desktop layouts.
2. **State Shadowing & Conditional Leakage**:
   * The layout wrapper checked `isSidebarCollapsed` to apply drawer styles. However, on desktop, the sidebar is always rendered inline. Mixing responsive Tailwind override classes in a conditional ternary block caused the desktop layout to inherit mobile styling when the drawer state was toggled.

---

## Architectural Surface Mapping

1. **UI Surface**: Corrected CSS class mapping in [UserActivityDashboard.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/UserActivityDashboard.jsx) and [UserActivityPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/UserActivityPage.jsx) using media-scoped rules in [page-anchors.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/page-anchors.css) to prevent style leakage.
2. **Data Surface**: N/A.
3. **Reactive Surface**: Controlled `isSidebarCollapsed` state behavior to only trigger drawer overrides on mobile/tablet viewports.
4. **Service Surface**: N/A.
5. **Module Surface**: N/A.
6. **Governance Surface**: Resolved stylelint validation errors on `#isActive` to enforce kebab-case standard IDs across CSS rules and React components.

---

## Corrective Actions & Resolution

1. **Media-Scoped Mobile Invariants**: Moved mobile drawer styles in [page-anchors.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/page-anchors.css) behind `(width <= 1023px)` media checks.
2. **Desktop Display Rules**: Added `.lg-hidden-important` behind `(width >= 1024px)` to guarantee close headers do not render on desktop.
3. **Pre-commit Pass**: Renamed `#isActive` to `#is-active` in [page-anchors.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/page-anchors.css), [ProfileModal.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/ProfileModal.jsx), and [ProjectCategoryManager.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/ProjectCategoryManager.jsx) to satisfy DHCP-001 stylelint checks.

---

## Prevention & Invariants

- **FKL-DI-020 (SSOT Invariant)**: Custom CSS selectors representing theme variables or colors (e.g. `.bg-theme-bg-card`) must not be mixed with Tailwind responsive utility overrides (e.g. `lg:bg-transparent`) on the same DOM element. Instead, mobile drawer overlays and responsive layout components must scope their custom variables behind clean CSS media queries to prevent specificity leaks.
