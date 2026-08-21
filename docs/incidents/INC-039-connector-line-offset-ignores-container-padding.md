# Incident Report: INC-039 — CSS Absolute Connector Line Offset Ignores Container Padding

## Incident Summary

The connector line in the Project Presets card hierarchy view started above the center of the first level circle. The line's `top-5` (20px) was calculated assuming zero container top padding, but the container uses `pt-3` (12px), pushing the first row's circle center to ~30px from the container top.

**Affected Component**: `src/components/ProjectPresetsTab.jsx`  
**Symptom**: Connector gradient line visually extended above circle 1 (red arrow visible in screenshot).  
**Fix**: Changed `top-5` → `top-[30px]` (12px `pt-3` + 18px half-row-height).

---

## Root Cause Analysis

When positioning an absolute child to align with a flex child's center, the calculation must account for all ancestor padding between the absolute-positioned element and the reference point:

```
circle_center_from_container_top = container_pt + (row_height / 2)
                                 = 12px (pt-3) + 18px (half of ~36px row)
                                 = 30px  →  top-[30px]
```

Using `top-5` (20px) misses the `pt-3` offset, starting the line 10px above the actual circle center.

---

## Architectural Surface Mapping

1. **UI Surface**: Connector line absolute positioning miscalculated, fixed with `top-[30px]`.
2. **Data Surface**: N/A
3. **Reactive Surface**: N/A
4. **Service Surface**: N/A
5. **Module Surface**: N/A
6. **Governance Surface**: Existing FKL knowledge item **FKL-DI-002** (parent-layout-audit) covers this class of error — must trace ancestor padding chain before asserting pixel-fit math. No new standard required; FKL-DI-002 is sufficient.

---

## Corrective Actions & Resolution

1. Changed connector `top-5` → `top-[30px]` in `ProjectPresetsTab.jsx`.
2. **No new standard required** — FKL-DI-002 (parent-layout-audit skill) already captures this invariant.

---

## Prevention

- Before setting `top` / `bottom` on an absolute connector line, always sum: `ancestor_padding_top + (row_height / 2)`.
- See FKL-DI-002 and `.agent/skills/parent-layout-audit/SKILL.md`.
