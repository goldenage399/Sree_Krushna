---
pattern: eur-surface-audit
activation_tier: routed
status: HYPOTHESIS
portability: universal
canonical_source: task-dashboard
porting_effort: low
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "ingest external design"
  - "port external jsx"
  - "copy from reference design"
  - "EUR execution phase"
  - "external jsx ingestion"
  - "architectural orphan"
  - "no internal equivalent"
  - "follow reference design structure"
  - "paste external component into production"
  - "adapt external jsx"
---

# EUR Surface Audit Gate

**Category**: Design Gate
**Applies to**: EUR Phase 5 (Execution) — mandatory before any production file is opened
**Origin**: 2026-06-30 — ProfileModal redesign thread (260628_Th4_ProfileCreation.md Q7.x): EUR ingestion introduced elements with no architectural home because the agent treated the external JSX as source code to adapt rather than a specification to translate
**Status**: HYPOTHESIS

---

## Pattern — Surface Audit Gate

### Problem

During EUR Execution the agent opens the approved external JSX, sees familiar patterns (grid layouts, stat cards, detail sections), and begins adapting them directly. Elements that exist in the external design for external reasons — a hook that fetches from a non-existent service, a stat card whose metric has no internal capture path, a role-badge component that duplicates an existing one under a different name — get ported into production because the ingestion process had no architectural filter step. The result: new components with no callers, services created to satisfy a design that doesn't map to real data, and regressions from elements that shadow or conflict with existing architecture.

The failure mode described in the ProfileModal thread: *"sometimes elements that weren't supposed to be in our system as they have no architectural relevance were also introduced as the EUR was not strict enough and was following the footsteps of the reference design file."*

### Why it happens

EUR Discovery and Convergence phases validate *visual intent* — does the layout work, do the states make sense, is the information hierarchy clear? They do not validate *architectural compatibility* — does every element in this design have a home in the internal system?

When Execution starts, the agent has a visually validated design file and a natural impulse to copy it. The external file is authoritative for visual intent. It is not authoritative for structure, data shape, component hierarchy, service wiring, or existence of architectural equivalents. Conflating the two produces over-ingestion.

### Solution

Before any production file is opened or the Visual Delta Matrix is produced, run a **Surface Audit**: classify every distinct UI element in the approved external design into one of five categories.

**Element Classification Table** — produce this before writing any code:

| Element | Class | Internal Equivalent | Action |
|---|---|---|---|
| `<component name>` | `LAYOUT_ONLY` / `STYLED_EXISTING` / `STYLED_NEW` / `BEHAVIORAL_EXTERNAL` / `ARCHITECTURAL_ORPHAN` | existing file + component name, or "none" | adapt / create (AGV-001 first) / DEFER / INVESTIGATE / REJECT |

**The five classes:**

| Class | Definition | Default action |
|---|---|---|
| `LAYOUT_ONLY` | Grid containers, flex wrappers, spacing shells — pure geometry with no data dependency | Copy layout intent using internal tokens; no new component |
| `STYLED_EXISTING` | Maps to an existing internal component | Apply new styles to existing component; adapt props to internal interface; do NOT create a parallel |
| `STYLED_NEW` | New presentational element with no internal counterpart; presentation-only (no data fetching, no service dependency) | Run AGV-001 (consumer ≥ 2?); if Level 0, keep local — no shared primitive |
| `BEHAVIORAL_EXTERNAL` | Carries hooks, state, or data from external context that has no internal equivalent (different service, different data model, missing collection) | **REJECT** — cannot port without creating phantom architecture |
| `ARCHITECTURAL_ORPHAN` | Exists in the external design but has no place in the internal architecture (e.g., a widget whose concept doesn't exist in the product) | **REJECT** — explicit out-of-scope; record in scope ledger |

**DEFER vs. INVESTIGATE vs. REJECT**: Not every non-adapted element is a REJECT. Use `DEFER` when the element is architecturally valid but out of scope for this iteration — record it in the scope ledger as a named future candidate. Use `INVESTIGATE` when there isn't enough evidence yet to classify confidently (e.g. unclear whether an internal equivalent exists) — this blocks gate sign-off on that row until resolved, it does not default to adapt. Reserve `REJECT` for elements that are architecturally inadmissible (`BEHAVIORAL_EXTERNAL`, `ARCHITECTURAL_ORPHAN`).

**Gate authority**: The architect reviews and approves the table before any production file is opened. Rejected elements are removed from scope here — not discovered mid-implementation. DEFER and INVESTIGATE rows must be resolved to a final action before the Visual Delta Matrix is produced.

**Portability note (optional, REJECT rows only)**: A REJECT verdict is about the element as built (its architecture, its dependencies) — not necessarily the idea behind it. If a rejected row contains a reusable idea worth remembering independent of its implementation, add a one-line "Portability note" to that row and log it in the scope ledger as a future candidate. This is optional and only for rejections worth remembering — do not force a note on every REJECT.

**One-way translation rule**: External design → internal vocabulary. The external JSX file is READ-ONLY — never open it in an editor, never adapt it directly. Extract visual intent from it, then implement that intent using only vocabulary that already exists in the system (or is approved as `STYLED_NEW`).

### Failure Mode

Partial application: agent produces the audit table, classifies everything as `STYLED_EXISTING` or `LAYOUT_ONLY` to avoid rejections, then ports faithfully — but the classifications were optimistic. The guard against this is the architect's explicit review of the table before coding starts. Any row with a suspiciously convenient classification (`STYLED_EXISTING` against an element with no plausible internal equivalent) must be challenged.

Skipping the audit entirely and jumping to the Visual Delta Matrix is the most common skip. The Visual Delta Matrix compares visual deltas; it does not filter architectural admissibility. The two gates are complementary, not substitutes.

### Task-Dashboard instance

ProfileModal LIVE VIEW redesign thread (`260628_Th4_ProfileCreation.md` Q7.x, EUR-001 m6 ingestion branch): during Execution, the external JSX's LIVE VIEW section introduced layout and element choices from the external sandbox context (a TestViteJSX preview environment) that had no counterpart in the internal profile data model. The ingestion followed the external structure too literally, requiring manual element-by-element correction post-ingestion and introduction of styling decisions that had no internal semantic token backing.

---

## Anti-Pattern — Following External Footsteps

### What it is

The executing agent treats the external JSX file as an authoritative source of implementation structure — copying component nesting, import dependencies, local state shape, and data-fetch patterns from the external file into production code.

### Symptoms

- New components created during EUR Execution that have zero callers after the session
- New services or hooks created to satisfy data displayed in the external design but absent in live Firestore
- Elements ported that duplicate existing components under slightly different names
- Session ends with more files changed than the component being redesigned
- Post-implementation debug loop to remove elements "that weren't supposed to be here"

### Why it fails

The external design file was built in a sandbox with inline mock data, external state primitives, and no architectural constraints. Its file structure is optimized for standalone preview rendering, not for integration with a live authenticated Firebase application. Copying it wholesale imports those context assumptions into production.

### Correction

Apply the Surface Audit Gate before touching any production file. Classify before copying. The correction for a session already past this point: produce the audit table retroactively — classify every element that was ported, identify the BEHAVIORAL_EXTERNAL and ARCHITECTURAL_ORPHAN classes, and remove them surgically before committing.
