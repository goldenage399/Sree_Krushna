# Incident Report: INC-085 — P81 Modal ID Registration & Preflight Auto-Healing

**Date**: 2026-08-20  
**Status**: RESOLVED  
**ID**: INC-085  
**Track**: Governance / Preflight Gate / Layout Catalog (P81)  
**Governing Standard**: Standard `P81` (Component Layout Containment Registration)  
**Resolved In**: `.agents/AGENTS.md`, `scripts/preflight-gate.cjs`, `src/styles/components/modals-overlays.css`  
**Keywords**: layout-catalog, css-registration, modal-accessibility, P81, preflight-gate, auto-healing, modals-overlays.css  
**Topology Layer**: Component Authority & Developer Tooling  
**Ownership Type**: css-registration / tooling-resilience  

---

## 1. Executive Summary

During the implementation of `ChecklistItemRemarkModal.jsx`, an `id="checklist-item-remark-modal"` was assigned to `<ResponsiveModal>` per the repository's W3C ARIA accessibility standard ([`.agents/AGENTS.md`](../../.agents/AGENTS.md)). However, because no corresponding CSS selector rule had been declared in `src/styles/components/modals-overlays.css` prior to running preflight, the **P81** gate in [`scripts/preflight-gate.cjs`](../../scripts/preflight-gate.cjs) raised a `🔴 P81` violation blocking preflight.

While P81 successfully intercepted the unregistered container before commit (preventing ghost layout anchors), this incident exposed a recurrent cognitive friction:
1. **Rule Asymmetry**: Accessibility governance mandated passing `id` to all modal shells, but lacked a direct cross-reference to P81's CSS declaration requirement.
2. **Tooling Passivity**: `preflight-gate.cjs` acted purely as a passive rejection gate. If a developer had added the CSS rule but omitted running `npm run cache:build:layout`, preflight failed instead of auto-rebuilding the index on the fly.

---

## 2. Architectural Surface Mapping (6 Surfaces)

| Surface | Status & Impact | Justification / Verification |
|---|---|---|
| **1. UI Surface** | ✅ AFFECTED | `#checklist-item-remark-modal` declared with `display: block` in `src/styles/components/modals-overlays.css`. Zero visual regressions; layout catalog updated to index 342 selectors. |
| **2. Data Surface** | ✅ NOT AFFECTED | No Firestore rules, schema changes, or database write paths involved. |
| **3. Reactive Surface** | ✅ NOT AFFECTED | No React state setters, contexts, or component lifecycles modified. |
| **4. Service Surface** | ✅ NOT AFFECTED | No Cloud Functions, APIs, or background services touched. |
| **5. Module Surface** | ✅ NOT AFFECTED | No package dependencies or route definitions altered. |
| **6. Governance & Tooling Surface** | ✅ AFFECTED | • Added **Rule 5** to `.agents/AGENTS.md` under "Modal Accessibility & E2E Instrumentation".<br>• Upgraded `scripts/preflight-gate.cjs` with in-memory layout catalog auto-rebuilding and context-aware error diagnostics.<br>• Promoted `.agent/patterns/p81-id-registration-process.md` to `VALIDATED`. |

---

## 3. Root Cause Analysis

1. **Governance Rule Silo**: `.agents/AGENTS.md` explicitly instructed agents to provide `id` and `data-testid` props to `<ResponsiveModal>`, but failed to note that any newly assigned ID must simultaneously be declared in a stylesheet to satisfy P81.
2. **Multi-Step Manual Friction**: Registering a modal ID required 3 disjoint operations across 3 files:
   - Defining `id="..."` in JSX.
   - Appending `#id { display: block; }` in `modals-overlays.css`.
   - Running `npm run cache:build:layout`.
3. **Passive Detection vs. Resilient Healing**: If a developer performed step 2 but forgot step 3, preflight failed with a generic message rather than auto-syncing the catalog or pointing out the exact CSS file to edit.

---

## 4. Invariants Established & Tooling Hardenings

### Invariant 1: Modal Accessibility & P81 Synchronization Rule
In [`.agents/AGENTS.md`](../../.agents/AGENTS.md), Rule 5 is now formalized:
> **5. P81 Layout Catalog Synchronization**: Whenever passing a new `id` to a modal shell or layout container, you MUST declare `#{id} { display: block; }` (or appropriate layout properties) in `src/styles/components/modals-overlays.css` (for modals/drawers) or `src/styles/page-anchors.css` (for pages) and run `npm run cache:build:layout` in the same changeset (P81 / INC-016 compliant).

### Invariant 2: Preflight Auto-Healing & Context Diagnostics
In [`scripts/preflight-gate.cjs`](../../scripts/preflight-gate.cjs):
- **On-Demand Auto-Rebuild**: If a selector is found in JSX that is missing from `dist/layout-catalog.json`, preflight triggers `build-layout-catalog.cjs` automatically. If the CSS rule is present, preflight self-heals and passes with zero manual intervention.
- **Context-Aware Error Messaging**: If the CSS declaration is truly missing, preflight outputs the exact target file and copy-paste snippet (e.g. `src/styles/components/modals-overlays.css` for modals vs. `src/styles/page-anchors.css` for page containers).

---

## 5. Verification Evidence

- `node scripts/verify-standards-integrity.cjs` $\rightarrow$ Passed (Exit Code 0).
- `npm run verify:governance-wiring` $\rightarrow$ Passed (Exit Code 0, all artifacts wired).
- `npm run preflight` $\rightarrow$ Passed (Exit Code 0, layout catalog synchronized).
- `npx vitest run` $\rightarrow$ 27/27 test files passed (374/374 unit tests).
