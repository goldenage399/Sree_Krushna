# INC-058: Theme Button Override and Text Contrast Compliance

- **Status**: Resolved
- **Date**: 2026-07-10
- **Type**: UI Layout Defect & Accessibility Compliance
- **Affected Component**: MyTasksPage, Timeline Buttons, Theme System (`themes-enhanced.css`)

---

## 1. Symptom

During the integration of the **Schedule & Focus** timeline widget on `MyTasksPage`, buttons representing scheduled events rendered with solid brown/beige background blocks in Sepia mode (and solid purple blocks in Velvet-Dark mode). In addition to breaking the subtle list-item hierarchy, the text on these buttons had extremely poor contrast, making it virtually unreadable.

---

## 2. Root Cause

1. **Global Button Selector Collision**:
   - The global stylesheets (`themes-enhanced.css`) declare aggressive theme-reset styles for buttons:
     `[data-theme="sepia"] button:not(.theme-button-secondary)`
     `[data-theme="velvet-dark"] button:not(.theme-button-secondary)`
   - Because our new timeline event buttons were implemented as `<button>` elements without the `.theme-button-secondary` class, they were captured by these global selectors, overriding the transparent list item design with solid theme primary gradients.

2. **Low-Contrast Theme Gradients**:
   - The gradient colors defined for primary buttons in Sepia mode (`#A67C52` to `#C19A6B`) combined with off-white text (`#F8F5F0`) produced a contrast ratio of only **2.33:1** (normal) and **1.86:1** (hover).
   - In Velvet-Dark, the gradient (`#8b5cf6` to `#a78bfa`) combined with light-purple text (`#f8f9ff`) similarly failed the WCAG AA minimum requirement of **4.5:1** for regular text.

---

## 3. Resolution

1. **Surgical Component Opt-Out (`MyTasksPage.jsx`)**:
   - Added the `.theme-button-secondary` class to the timeline event buttons in [MyTasksPage.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/pages/MyTasksPage.jsx). This immediately exempted them from the global theme-reset overrides, restoring the correct transparent backgrounds and list-item text styling.

2. **Global Contrast Compliance Hardening (`themes-enhanced.css`)**:
   - **Sepia Theme**: Darkened the primary button background gradient to a deep leather brown (`#54310f` to `#7c4c1d`), increasing contrast ratio with cream text (`#F8F5F0`) to a highly readable **6.5:1** (normal) and **4.52:1** (hover).
   - **Velvet-Dark Theme**: Darkened the primary button background gradient to rich royal purple (`#5b21b6` to `#7c3aed`), increasing contrast ratio with white text to **5.52:1** (normal).

---

## 4. Architectural Surface Mapping

1. **UI Surface**: Button backgrounds, border colors, and text contrast on timeline event items and all primary buttons in Sepia and Velvet-Dark modes.
2. **Data Surface**: N/A.
3. **Reactive Surface**: N/A.
4. **Service Surface**: N/A.
5. **Module Surface**: N/A.
6. **Governance Surface**: Checked against `FKL-DI-003` (Theme Button Opt-out Contract). Strengthened global compliance with WCAG AA contrast rules in the theme stylesheets.

---

## 5. Prevention

- **FKL-DI-003 Awareness**: Future custom button components (like tabs, switchers, or list items) must declare `.theme-button-secondary` explicitly to opt out of global theme button gradients.
- **Contrast Checkpoint**: Primary buttons inside theme systems must be designed using contrast calculations (minimum 4.5:1 text-to-background ratio) to maintain accessibility.
