# INC-005 — Fieldset min-width Blowout & Flex Ellipsis clipping

**Date**: 2026-06-08  
**Severity**: Medium (tablet/narrow layout blowout, visual option text truncation)  
**Status**: Resolved (responsive adaptive styling applied, remapped standards, validation gate script active)  
**Affected Component**: `BasicInformationStep.jsx`, `task-creation-modular.css`  
**Keywords**: overflow, fieldset, min-width, flex, ellipsis, truncate, grid, tablet, narrow-viewport, blowout, text-clipping
**Topology Layer**: Constraint Authority
**Ownership Type**: width, overflow
**Symptom Tags**: flex-blowout, text-clipping, fieldset-min-content, grid-column-overlap

---

## What Happened

During visual layout validation of the `TaskCreation` step wizard in compact viewports:
1. **Grid Column Overlap**: Under tablet/narrow desktop viewports, the Priority Level selector container bled out of its grid cell, overlapping and rendering on top of the adjacent "Due Date" column.
2. **Text Clipping**: The priority label texts ("High", "Medium", "Low") hard-clipped under horizontal pressure. Specifically, "Medium" rendered as `"Mediu"` and "Low" or "High" clipped to `"Lo"` / `"Hi"` without displaying the standard trailing ellipsis (`…`).

---

## Investigation

The issue was analyzed across grid column calculations and browser painting engines to determine the constraints:
1. **Grid Track Overrides**: The grid track width was configured dynamically, but the browser painted the `<fieldset>` element with an implicit minimum width (`min-width: min-content`) corresponding to the combined size of the priority toggles (~217px). This override forced the container to expand outside its allotted cell.
2. **Flex container no-op**: The button wrapper used `display: flex` to center the emoji and text elements. In modern CSS, applying `text-overflow: ellipsis` on a parent flex container or raw text node flex items is ignored since flex items are not block containers. The browser fallback is simple pixel clipping.

---

## Architectural Surface Mapping

The incident was audited against the six architectural surfaces to extract lessons and prevent regressions:

### 1. UI Surface
* **Fieldset default constraint**: Browsers default `<fieldset>` to `min-width: min-content`. It must be overridden with `min-width: 0` to scale down.
* **Flex ellipsis limit**: Ellipsis truncation only fires on block containers. Text nodes inside flex button groups must be wrapped in block-level child elements (e.g. `<span class="priority-text">` styled as `display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`).
* **Firefox legend bug**: Firefox ignores flexbox alignment rules placed directly on `<legend>` elements; positioning must be scoped to child wrapper elements.

### 2. Data Surface
* **No Impact**: No database read/write APIs, schemas, or SheetWriter structures were altered.

### 3. Reactive Surface
* **No Impact**: Standard components consume existing form bindings. No state setter payload contracts or context hook states were modified.

### 4. Service Surface
* **No Impact**: No external APIs, Firebase Cloud Functions, or authorization services were involved.

### 5. Module Surface
* **No Impact**: Modular dependencies, router configs, and package bounds remained unchanged.

### 6. Governance Surface
* **Standard ID Collision**: The initial registration of layout standards collided with database standards (`P67` / `P68`).
* **Collision Resolution**: Shipped remapped visual standards `P70`, `P71`, and `P72` in `GEMINI.md`, `standards-catalog.json`, and `violation-patterns.json`.
* **Programmatic Integrity Gate**: Created `scripts/verify-standards-integrity.cjs` to validate ID uniqueness and pattern mappings before commits, and integrated it into the verification pipeline.

---

## Fix Applied

1. **JSX Wrapper ([BasicInformationStep.jsx](file:///d:/GitHub_Repo/Task-Dashboard/src/components/TaskCreation/steps/BasicInformationStep.jsx#L285-L318))**:
   - Wrapped raw priority text nodes in `<span className="priority-text">`.
   - Added hover `title` tooltips to preserve semantic labels in icon-only modes.
2. **Responsive CSS ([task-creation-modular.css](file:///d:/GitHub_Repo/Task-Dashboard/src/styles/task-creation-modular.css#L1605))**:
   - Overrode fieldset minimum width: `.priority-fieldset { min-width: 0; }`.
   - Configured block ellipsis: `.priority-text` styled with `display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;`.
   - Added adaptive query: `@media (max-width: 1199px) { .priority-text { display: none; } }` to transition to centered emojis (🔴🟡🟢) when column width is tight.

---

## Lessons Learned & Prevention

1. **Layout Sizing overrides**: Grid cell children (especially form `<fieldset>` tags) must be initialized with `min-width: 0` to override browser defaults.
2. **Automated Registry Audits**: Never rely on manual catalog ID assignments. Automated registry checks must run to block ID duplication.

---

## Structural Invariant Established

### Protocol 71: Segmented Control Flex-Wrap Safety & Overflows
* **Rule**: Horizontal segmented button groups must explicitly define `flex-wrap: nowrap`, override `<fieldset>` min-width, and wrap text in block containers for ellipsis rendering.
* **Verification**: Running `node scripts/verify-standards-integrity.cjs` must return exit code `0` before commit.
