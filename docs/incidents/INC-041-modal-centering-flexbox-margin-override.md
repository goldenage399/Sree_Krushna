# Incident Report: INC-041 — Modal Horizontal Centering Blocked by static margin override

## Incident Summary

When displaying the `#profile-workspace-modal` and other desktop-class enhanced modals, the modal container was rendered left-aligned at the top-left rather than centered on the viewport.

**Affected Component**: `src/styles/vibrancy-utilities.css` and `src/styles/utilities/visual.css`  
**Symptom**: Enhanced modals were stuck left-aligned on screens >= 1280px.  
**Fix**: Added flexbox layout centering to `.modal-backdrop-enhanced` in `visual.css` and changed the margin from `margin: 1rem` to `margin: 1rem auto` in `.modal-container-enhanced` in `vibrancy-utilities.css`.

---

## Root Cause Analysis

1. In flexbox layouts, if a child flex item has explicitly set physical margins (e.g. `margin: 1rem;` on `.modal-container-enhanced`), the layout engine respects the margins and ignores parent-level layout overrides like `justify-content: center` and `align-items: center` of the `.modal-backdrop-enhanced` flex container.
2. The static analysis and initial implementation failed to trace this CSS specificity override because we guessed layout properties rather than retrieving computed layout properties via runtime dev tools or scripts.

---

## Architectural Surface Mapping

1. **UI Surface**: Enhanced modals were misaligned on desktop class resolutions. Resolving it required adjusting parent flex alignment rules and child auto-margins.
2. **Data Surface**: N/A
3. **Reactive Surface**: N/A
4. **Service Surface**: N/A
5. **Module Surface**: N/A
6. **Governance Surface**: Missing enforcement of Runtime Evidence Gate (REG-001) and Visual Edit Attempt Cap (VEA-001) for styling discrepancies, which led to a failed initial visual edit before tracing the computed margins.

---

## Corrective Actions & Resolution

1. Added `display: flex; align-items: center; justify-content: center;` to `.modal-backdrop-enhanced` in `visual.css`.
2. Changed `margin: 1rem;` to `margin: 1rem auto;` in `.modal-container-enhanced` in `vibrancy-utilities.css`.
3. Rebuilt layout catalog: `npm run cache:build:layout`.
4. Verified compilation and preflight passes cleanly.

---

## Prevention

- **Standard Enforced**: Registered **Runtime Evidence Gate (REG-001)** as standard `P95` in the standards catalog and `GEMINI.md` to prevent guessing of CSS layout parameters.
- **Role Contracts Hardened**: Hardened `safe-implementer-R04` in `.agent/roles/safe-implementer.yaml` to enforce REG-001 and demand parent/child computed properties after a single failed styling edit.
