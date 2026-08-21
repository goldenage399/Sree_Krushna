# INC-055: Edit Task Details Modal Viewport Positioning Bug

- **Status**: Resolved
- **Date**: 2026-07-10
- **Type**: UI Layout Defect & CSS Specificity Override
- **Affected Component**: `src/styles/page-anchors.css`, `src/components/ResponsiveModal.jsx`

---

## 1. Symptom

When opening the `EditTaskDetailsModal` (Edit Task Details), the dialog did not render centered in the viewport. Instead, it was positioned offset at the very bottom of the page, half-clipped off-screen.

---

## 2. Root Cause

1. **CSS Specificity Override**:
   - The root backdrop `div` of `ResponsiveModal` carries the `id` prop value passed from the parent caller, which for the Edit modal is `id="edit-task-details-modal"`.
   - For E2E testing and accessibility instrumentation, `page-anchors.css` declared:
     ```css
     #edit-task-details-modal {
       position: relative;
     }
     ```
   - Because ID selectors (`#id`) carry higher CSS specificity than class selectors (`.modal-backdrop-enhanced`), this rule overrode the backdrop's default fixed overlay positioning (`position: fixed;` -> `position: relative;`).
   - Consequently, the backdrop div lost its viewport-fixed context and flowed in the normal document body structure, positioning itself relative to the end of the body element.

---

## 3. Resolution

1. **Avoid Layout Override**:
   - Modified `src/styles/page-anchors.css` to use `display: flex;` instead of `position: relative;` for the `#edit-task-details-modal` ID anchor.
   - Since the backdrop class `.modal-backdrop-enhanced` already renders using `display: flex;`, this change maintains compatibility with testing anchors without corrupting the crucial fixed overlay layout properties.

---

## 4. Architectural Surface Mapping

1. **UI Surface**: Backdrop positioning shifted from fixed-centered to relative flow, clipping the modal off-screen.
2. **Data Surface**: N/A (unaffected).
3. **Reactive Surface**: N/A (unaffected).
4. **Service Surface**: N/A (unaffected).
5. **Module Surface**: N/A (unaffected).
6. **Governance Surface**: Missing enforcement checks in `page-anchors.css` to ensure testing selectors do not define properties altering layout coordinates. Captured in `P-ISG` (ID Selector Specificity Guard).

---

## 5. Prevention

- **P-ISG (ID Selector Specificity Guard)**: Testing and instrumentation ID anchors targeting top-level component backdrops or layouts MUST NOT declare structural positioning/coordinate properties (`position`, `inset`, `top`, `left`, `right`, `bottom`, `z-index`) that override class-based layout contracts.
