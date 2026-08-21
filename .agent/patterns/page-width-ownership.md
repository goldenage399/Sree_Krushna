---
pattern: page-width-ownership
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Page Width Ownership Diagnostic

**Category**: Process Pattern + Anti-Pattern
**Applies to**: Multi-page React apps with a shared layout shell and PageContainer-style width constraint components
**Origin**: 2026-06-24 — ProfileManagementHub / AdminUsersPage width divergence investigation (INC-026)
**Status**: VALIDATED (diagnosed and resolved in this session; pattern matches category of known per-page drift issues)

---

## Pattern — Width Ownership Diagnostic

### Problem

Two structurally identical pages (same header + cards + table layout) render at visually different widths. One page is constrained to a max-width; the other stretches edge-to-edge inside `<main>`.

### Why it happens

Width constraints are distributed across page components as **per-page ownership** — each page independently decides whether to apply a container and at what width. When a page is created without a constraint, there is no visible signal: the page simply fills the parent flex container. The gap is invisible until both pages are compared side by side.

The root cause cannot be found with `grep` — you cannot grep for *absence* of a container component.

### Solution

1. **Compare the two pages' return roots**: Find the opening element of each page's main return statement.
2. **Check for outer width constraint**: Does one have a `<PageContainer>` or equivalent `max-width` wrapper at the root and the other not?
3. **If the constraint is missing**: Do NOT add it to the page. Route the width decision to the **layout shell** (e.g., `DashboardLayout`, a registry, or a route-level wrapper).
4. **If a registry exists** (e.g., `pageLayouts.js`): Add the route with the correct tier (`standard`/`wide`/`fluid`). Zero page-file edits required.
5. **If no registry exists**: This is the architectural debt to resolve — see Anti-Pattern below.

### Failure Mode

Adding a `PageContainer` directly to the page component fixes the visual symptom but does not prevent the next page from having the same drift. Per-page ownership is the failure mode, not the symptom.

### Task-Dashboard instance

- `src/pages/ProfileManagementHub.jsx` — had no outer PageContainer; fixed by adding to registry with `width: 'standard'` (zero file edits to the page itself)
- `src/config/pageLayouts.js` — canonical layout registry; see route entries and `getPageLayout()` fallback
- `docs/incidents/INC-026-per-page-pagecontainer-width-drift.md` — full case study

---

## Anti-Pattern — Per-Page Width Ownership

### What it is

Each page component independently imports and applies a `PageContainer` (or equivalent) at its root. There is no central registry.

### Symptoms

- Two structurally similar pages render at different widths
- New pages consistently look "wrong" until someone notices and adds a container
- Width changes require touching each page file individually
- Full-viewport exceptions are handled with hardcoded pathname checks in the shell (e.g., `isFullViewportPage = location.pathname === '/tasks/create'`)

### Why it fails

- Absence of a container produces no error, no warning, and no visual gap until the page is compared to a sibling
- The exception logic in the shell (`isFullViewportPage`) is exactly the kind of per-route logic the registry was meant to eliminate — it grows by one case every time someone adds a bypass
- `grep`-based audits for PageContainer usage can't detect pages where the container is absent

### Correction

Centralize route → layout config in a registry consumed by the shell. Each page returns its content as a Fragment or bare div. The shell wraps it in the correct container. See `src/config/pageLayouts.js` for the canonical implementation.
