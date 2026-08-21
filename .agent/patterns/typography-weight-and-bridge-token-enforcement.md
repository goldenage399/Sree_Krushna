---
pattern: typography-weight-and-bridge-token-enforcement
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "typography weight inflation"
  - "font-black or font-extrabold"
  - "inert shadow classes"
  - "shadow-2xs or shadow-xs"
  - "slashed color opacities in JSX"
  - "rounded-2xl on buttons"
guard: ""
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Typography Weight & Semantic Bridge Token Enforcement Pattern

**Category**: UI Quality & Design System Invariant  
**Applies to**: All UI components, modals, forms, and pages (`DESIGN.md`, `PRODUCT.md`, `CLAUDE.md § 🗚`, `tailwind-semantic-bridge.css`).  
**Origin**: 2026-08-18 — UI Council & Impeccable Inspection (INC-083).  
**Status**: VALIDATED (Enforced across `TemplateEditorModal.jsx`, `PositionRoutinesTab.jsx`, `AuditAndComplianceTab.jsx`, and `RecurringChecklistsPage.jsx`).  

---

## Pattern — Typography Scale & Token Integrity

### Problem
Developers building or refactoring React components frequently import arbitrary utility classes from standard Tailwind JIT (`font-black`, `font-extrabold`, `shadow-2xs`, `shadow-xs`, `rounded-2xl`, `bg-black/60`, `bg-surface/50`, `bg-status-info/10`). In projects using a curated vanilla CSS bridge (`tailwind-semantic-bridge.css`) and strict design tokens (`DESIGN.md`):
1. Unsupported classes (`shadow-2xs`, `shadow-xs`, `backdrop-blur-xs`) resolve to **no CSS rule at all**, rendering elements flat and broken.
2. Weight inflation (`font-black` 900, `font-extrabold` 800) destroys information hierarchy by making sub-labels shout louder than page headings.
3. Slashed color opacities on CSS variables fail to compute properly across dark themes, Sepia, and Velvet-Dark modes.
4. Over-rounding (`rounded-2xl` on small action buttons) creates cartoonish and inconsistent button shapes.

### The Canonical Scale

```
┌─────────────────────────┬──────────────┬───────────────┬────────────────────────────┐
│ Hierarchy Level         │ Font Size    │ Font Weight   │ Target Elements            │
├─────────────────────────┼──────────────┼───────────────┼────────────────────────────┤
│ Display / Hero          │ text-xl/2xl  │ font-bold     │ Page Headers, Major H1     │
│ Title / Headline        │ text-base/lg │ font-semibold │ Modal H2, Section H3       │
│ Sub-Title / Panel H4    │ text-sm      │ font-semibold │ Card Titles, Sub-Panels    │
│ Labels / Badges / Tabs  │ text-xs      │ font-medium   │ Nav Pills, Scope Buttons   │
│ Body / Inputs / Selects │ text-xs/sm   │ font-normal   │ Form Inputs, Textarea, Body│
│ Micro-Meta / Status     │ text-xs      │ font-medium   │ Status Tags, Mono Timestamps│
└─────────────────────────┴──────────────┴───────────────┴────────────────────────────┘
```

### Prohibited vs. Required Rules

| Prohibited Anti-Pattern | Required Canonical Pattern | Rationale |
|---|---|---|
| `font-black` (900), `font-extrabold` (800) | `font-semibold` (600) / `font-bold` (700) | Eliminates shouting typography and restores hierarchy. |
| `shadow-2xs`, `shadow-xs` | `shadow-none`, `shadow-sm`, `shadow-md`, `shadow-lg` | Only classes registered in `tailwind-semantic-bridge.css` produce elevation. |
| `rounded-2xl` on buttons / inputs | `rounded-lg` (8px / `0.5rem`) | Standardized 8px radius per `DESIGN.md § 5`. |
| `bg-black/60` | `bg-surface-base-inverse backdrop-blur-sm` | Theme-aware modal backdrop. |
| `bg-surface/50`, `bg-status-info/10` | `bg-section`, `bg-card`, `bg-surface`, `text-info` | Pure vanilla CSS theme compatibility. |
| Input fields with `font-bold` | `font-normal` (400) | Form inputs should never be bold. |

---

## Verification & Preflight

1. **Grep Check**: `grep -r "font-black" src/` and `grep -r "font-extrabold" src/` should return 0 occurrences in clean UI components.
2. **Bridge Shadow Audit**: Ensure all shadow classes match `tailwind-semantic-bridge.css`.
3. **Layout Catalog Recompile**: Run `npm run cache:build:layout` to ensure 100% of selectors resolve cleanly.
