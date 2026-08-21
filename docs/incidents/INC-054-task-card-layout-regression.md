# INC-054: TaskCard Layout and Text Smashing Regression

- **Status**: Resolved
- **Date**: 2026-07-10
- **Type**: UI Layout Regression & CSS Specificity Error
- **Affected Component**: `src/components/TaskCockpitView.jsx`, `src/components/TaskCard.jsx`

---

## 1. Symptom

During the consolidation of `TaskDetailsModal.jsx` (which unified the details view onto the cockpit layout variant), the main "My Tasks" landing page suffered two visual layout regressions:
1. **Wide Layout Regression**: Task cards under "Active Work Items" stretched to 100% width and displayed full, uncompact legacy descriptions/fields instead of the expected 2-column compact cockpit card format.
2. **Text-Smashing Layout Defect**: The *Department* and *Currently filled by* fields on the task card squished together without proper spacing or line breaks (e.g., `Department: OperationsCurrently filled by:`).

---

## 2. Root Cause

1. **Over-Cleanup of the `variant` Prop**:
   - The refactoring plan target was to remove the obsolete `variant="cockpit"` prop from the details modals since only one details view remained.
   - However, during call-site propagation in [TaskCockpitView.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskCockpitView.jsx), the `variant` prop was also stripped from the `<TaskCard>` component calls.
   - Since `TaskCard` relies on the `variant` prop (`variant === 'cockpit'`) to choose between the compact cockpit layout and the default legacy layout, removing the prop caused all cards to fall back to `variant="default"`.

2. **Inline Component Wrapping**:
   - In [TaskCard.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskCard.jsx), the Department and assigned user details were rendered using the `<Caption>` typography component.
   - Since `<Caption>` defaults to rendering as an inline `<span>` tag, these fields did not behave as block-level elements, causing them to flow together inline.

---

## 3. Resolution

1. **Re-add Card Variant**:
   - Hardcoded `variant="cockpit"` directly on `<TaskCard>` elements inside [TaskCockpitView.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskCockpitView.jsx) to permanently isolate the cockpit view card presentation from modal changes.
2. **Apply Block Rendering**:
   - Added `as="div"` to the `<Caption>` wrappers for Department and assignee fields inside [TaskCard.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskCard.jsx) to ensure they render as block-level elements and stack correctly.
3. **Build Check**:
   - Verified clean compilation with `npm run build`.

---

## 4. Architectural Surface Mapping

1. **UI Surface**: Task cards stretched to 100% width and display expanded layouts instead of the compact 2-column cockpit layout. Inline `<Caption>` elements squished text together.
2. **Data Surface**: N/A (unaffected).
3. **Reactive Surface**: Prop stripping of `variant` from `<TaskCard>` call sites during modal updates led to incorrect component render state.
4. **Service Surface**: N/A (unaffected).
5. **Module Surface**: N/A (unaffected).
6. **Governance Surface**: Missing cascade verification checks during component cleanup. Addressed by registering `P-PCP` (Prop Cascade Preservation).

---

## 5. Preventive Guards & Gates

To prevent similar issues in the future, the following guards are established:
1. **AVP (Artifact-Validation-Promotion) on Cleanup Scope**:
   - Before executing code removals, a structural impact analysis must trace *all* consumers of a prop or class name across *all* components, not just the primary file being edited.
2. **Component Isolation Invariant**:
   - Layout components (like `TaskCard`) should define distinct, self-contained sub-components or explicit props rather than sharing overloaded config attributes (like `variant`) that can be easily stripped during parent-level cleanups.
