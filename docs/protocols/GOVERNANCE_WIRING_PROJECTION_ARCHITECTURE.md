---
hub: governance
status: Active
---

# Governance Wiring Projection Architecture (GWPA)

> **Document type:** Canonical architectural contract — SSOT for the governance-wiring projection in
> this repository, and a portable template for sibling governance repos.
> **Authority:** Priority 3 — governs PIO-159 implementation, the `governance-wiring.json` schema, and
> any generated projection of GAWC wiring. Subordinate to **PACT-001 §1A** (the GAWC scope) and to the
> Spoke & Wheel grammar in `docs/DOCS_HUB_FOUNDATION.md`.
> **Lineage:** *Appropriated* from the DO-PKOS engine's `SWIMLANE_ARCHITECTURE.md` (QSR repo). **This
> document is now standalone — do NOT re-infer from QSR. Extend this contract instead.**

---

## 0. Why this exists (anti-re-inference)

We adopt the DO-PKOS **data → compiler → viewport** separation, but our domain is **governance-artifact
wiring**, not construction dependency topology. Re-deriving the design from QSR on each task is the exact
failure this whole effort named: the QSR swimlane subsystem is spread across a layout directive, a
topography doc, and the real SSOT — and successive inferences drifted. Worse, QSR's *semantics*
(sealing gates, Type 1/2/3 dependencies, dependency-depth columns, calendar rejection) are
construction-specific and **do not map cleanly** onto governance.

This contract therefore **keeps the DO-PKOS pattern and discards the construction semantics**, so future
work in this repo (and sibling repos) references *this file*, not QSR. Lineage is recorded in §6; it is
history, not a live dependency.

---

## 1. Conceptual model

The governance projection is a **consumption-topology projection**. It renders *which* governance
artifacts exist, *what class* owns each, *how strongly* each is enforced, and *where consumption flows* —
and it makes orphans visible by their absence of an outbound edge.

It is **NOT** a dependency or time topology. There are no gates, no dependency types, no calendar or
"steps-from-start" columns. Those are QSR construction concepts with no governance analogue.

### The three questions it answers at a glance

| Question | How the projection answers it |
|:---|:---|
| **Which class owns this artifact?** | Row membership — each artifact class is a fixed, named lane |
| **How strongly is it enforced (and is it at risk)?** | Column position = the tier ladder `reference → routed → guarded`; status colour flags `HYPOTHESIS` vs `VALIDATED` |
| **Where does consumption flow — and is anything orphaned?** | An edge = a `consumed_by` link from artifact to consumer. **An in-scope artifact with no outbound edge is an orphan, rendered in an alarm state.** |

---

## 2. Data contract (`governance-wiring.json`)

The materialized graph must provide the following, independent of serialization format.

### Required entities

**Artifact entity** — each carries:
- `id` — stable identifier (file path or slug), unambiguous across classes.
- `artifact_type` — `pattern` | `rolling-snapshot` | `skill` | `protocol` | `collaborator-wiring` (extensible per PACT-001 §1A).
- `class` — the lane/track this artifact belongs to (see Class entity).
- `activation_tier` — `reference` | `routed` | `guarded` (the column axis).
- `status` — declared `HYPOTHESIS` | `VALIDATED`, plus derived `wiring_state`: `wired` | `orphan` | `broken-backlink`.
- `consumed_by` — edge list; each edge = `{ consumer_file, at, verified: bool }`. `verified` is true only when the consumer file **actually contains** the artifact's reference (bidirectional check).
- `scope` — `in` | `excluded`; if `excluded`, an `exclusion_reason` (e.g. "append-only archive", "code-verified SSOT").

**Class (track) entity** — `id`, `label`, stable `display_order` (classes do not reorder at runtime).

**Tier (column) entity** — ordered `reference → routed → guarded`, plus a terminal `excluded` column.

### Source-of-truth rule (non-negotiable)

The **data store, not the rendered view, is the source of truth.** Concretely for this repo:

1. **Edit surface = distributed `consumed_by` frontmatter** in each artifact (canonical; travels cross-repo per PACT-001 §6).
2. **`governance-wiring.json` = generated materialization** — emitted by the compiler from the frontmatter. **Never hand-edited.**
3. **Projection = read-only viewport** — generated from the JSON. **Never hand-edited.**

State changes are applied to the edit surface first; the JSON and view regenerate. *(Adopts GWPA-INV-001 / GWPA-INV-002, §5.)*

**Machine schema:** [`governance-wiring.schema.json`](governance-wiring.schema.json) (co-located) is the
formal JSON Schema encoding this §2 contract. The compiler (§4) MUST validate its emitted
`governance-wiring.json` against it.

### 2.1 Two wiring families

The verifier governs two structurally different artifact families. Both appear in one graph,
discriminated by `wiring_model`:

| Family | `wiring_model` | Artifacts | How "wired" is proven | Column axis |
|:---|:---|:---|:---|:---|
| **PACT-tier'd** | `pact` | `agent-pattern` (+ future `rolling-snapshot`, `protocol`, `collaborator-wiring`) | a bidirectional `consumed_by` back-link; carries `activation_tier` | the tier ladder `reference → routed → guarded` |
| **Matrix-wired** | `matrix` | `dist-catalog`, `agent-workflow`, `agent-skill`, `p-standard`, `arch-invariant` | appears in the required / at-least-one consumption files; **no tier** | grouped by `wiring_state` (wired / partial / unwired) |

Consequences for the schema:
- `activation_tier` is **required only when `wiring_model == pact`**; matrix artifacts omit it.
- `status.declared` (HYPOTHESIS/VALIDATED) is **pact-only**.
- **Orphans and broken back-links are represented, never rejected.** `consumed_by` may be empty for an
  in-scope artifact — that absence is the orphan signal (GWPA-INV-005). The wiring *gate* is the
  verifier's exit code; the schema only models truth.

---

## 3. Projection contract (the viewport)

Any renderer producing the governance projection must preserve:

- **Lane = artifact class.** Stable order, no runtime reordering.
- **Column = tier ladder** (`reference → routed → guarded`); excluded artifacts occupy a separate
  **excluded zone with no edges** — the absence of a consumer arrow *is* the decision, not an omission.
- **Edge = `consumed_by`**, drawn artifact → consumer. An in-scope artifact with no outbound edge renders
  as an **orphan alarm**.
- **Generated only.** The viewport is a deployment target, not an edit surface (GWPA-INV-002).

**Prohibited:** hand-authored diagrams; time/date axes; dependency-depth columns; any construction
semantics imported from QSR (gates, dependency types).

---

## 4. Compiler contract

`scripts/verify-governance-wiring.cjs` is the **compiler**. It must:

1. Scan the edit surface (frontmatter) across all registered `artifact_type`s.
2. Emit `governance-wiring.json` (the data contract, §2) as a byproduct of the verify run.
3. Validate each `consumed_by` **bidirectionally** (consumer exists AND references the artifact); flag
   `orphan` / `broken-backlink`; exit non-zero on any in-scope failure (the GAWC gate, PREFLIGHT R14).
4. Regenerate the projection from the JSON in the same pass (GWPA-INV-003 atomic).

---

## 5. Invariants (localized)

| ID | Title | Rule |
|:---|:---|:---|
| **GWPA-INV-001** | Companion JSON (generated) | The projection has a matching `governance-wiring.json` of the same name-base; data decoupled from rendering so the compiler/validator can read it. |
| **GWPA-INV-002** | Generated-not-edited viewport | The JSON and the projection are deployment targets, never edit surfaces. The edit surface is the artifact frontmatter. |
| **GWPA-INV-003** | Atomic regeneration | A change to the edit surface regenerates the JSON and the projection together; they commit together. |
| **GWPA-INV-004** | Class-before-id namespace | An artifact's `class` is resolved before its `id` is emitted, so lanes are unambiguous and ids never collide across classes. |
| **GWPA-INV-005** | Orphan visibility | An in-scope artifact lacking a verified outbound `consumed_by` edge must render in a distinct alarm state — never silently omitted. |

---

## 6. Lineage & divergence from QSR (history, not a live link)

| QSR / DO-PKOS concept | Our appropriation |
|:---|:---|
| `project-state.json` (SOURCE DATABASE) | `governance-wiring.json` (generated from frontmatter) |
| Tracks = construction trades | Tracks = governance artifact classes |
| Column = dependency-sequence depth | **Dropped** → column = tier-graduation ladder |
| Sealing gates, Type 1/2/3 dependencies | **Dropped** — no governance analogue |
| `INV-001` / `INV-002` / `INV-011` | Adopted → `GWPA-INV-001` / `-002` / `-003` |
| `INV-004` / `-006` / `-007` / `-009` (spatial/render/zoom) | Adopt **only if** an interactive HTML viewport is built; a static (e.g. Mermaid) projection needs only layer order. |

---

## 7. Governance

- **Home:** `docs/protocols/` (alongside the PACT-001 manual; the GAWC family).
- **Consumed by:** PACT-001 manual §1A (scope), PIO-159 §5.1 (implementation) — both link here so this is
  the single reference, not QSR.
- **Portability:** universal-template for sibling governance repos. They adopt *this* contract and
  re-declare their own local `consumed_by`; they do **not** re-infer from QSR.
- **Status:** Active · v1.0 (2026-06-14). Review on any new `artifact_type` or if an interactive viewport is built.
