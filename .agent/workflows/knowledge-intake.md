---
description: Knowledge Ingestion Workflow - Intake new external files/transcripts and integrate them losslessly into the Task-Dashboard's knowledge structure (SSOT docs, enhancement notes, architecture docs).
---

# /knowledge-intake — Knowledge Ingestion Workflow

**Purpose:** Register approved evidence items and synchronize them across all dependent files in the repository. Primary input is a `Knowledge_Delta.md` produced by `/knowledge-consolidate` — the already-deduplicated, already-permanence-tagged change-set. For small/simple batches, this workflow also accepts a raw, reviewer-approved `Review_Manifest.md` directly (produced by `/knowledge-archaeology`, KAE-001) and performs the equivalent duplicate/merge resolution inline at Phase 1.

---

## Steps at a Glance

| Phase | Name                    | Goal                                                              |
|-------|-------------------------|-------------------------------------------------------------------|
| 0     | Source Verification     | Verify the source document and its review manifest exist          |
| 1     | Registration            | Append approved items from `Review_Manifest.md` to target SSOT docs |
| 2     | Semantic Mapping        | Map approved evidence to relevant SSOT domains                    |
| 3-4   | Impact Analysis & Plan  | Traverse dependencies and generate a file update plan             |
| 5     | Ingestion Gate          | Automatically apply facts; hold interpretive changes for approval |
| 6-8   | Evolution & Validation  | Propagate updates, re-verify links/health, and update governance docs |

---

## Modes

| Mode       | Purpose                                                       | Command                                |
| ---------- | ------------------------------------------------------------- | -------------------------------------- |
| `full`     | Full ingestion and synchronization (default)                 | `/knowledge-intake <delta_or_manifest>`  |
| `fast`     | Ingest and register evidence only (no downstream sync)        | `/knowledge-intake <delta_or_manifest> fast` |
| `dry-run`  | Run the ingestion pipeline and preview changes without writing | `/knowledge-intake <delta_or_manifest> dry-run` |

`<delta_or_manifest>` is either a `Knowledge_Delta.md` (preferred — from `/knowledge-consolidate`) or a raw approved `Review_Manifest.md` (backward-compatible direct path).

---

## Steps & Detailed Instructions

### Step 0: Source Verification (Phase 0)
1. Read the input file and check the referenced source document(s).
2. Confirm the source is an approved, reviewed document (check the `Review_Manifest.md` for reviewer decisions).
3. Identify which SSOT domains this evidence touches:
   - Architecture decisions → `docs/ssot/architecture-hub/`
   - UI/design decisions → `docs/ssot/ui-design/`
   - Development workflow decisions → `docs/ssot/dev-workflow-hub/`
   - Testing decisions → `docs/ssot/testing-hub/`
   - Enhancement notes → `enhancement-notes/`

### Step 1: Evidence Registration (Phases 1-2)
**If given a `Knowledge_Delta.md`:** its New/Update tables already carry pre-computed sequential IDs, merge targets, and risk tags — apply them directly:
1. Append each **New (Durable)** item to the appropriate SSOT document using its pre-assigned position.
2. Append each **New (Provisional)** item to the relevant backlog or open questions section instead, framed as unconfirmed/proposed — not as settled fact.
3. Apply each **Update (Merge)** action as a citation addition or amendment to its target.
4. Do not re-derive IDs, merges, or permanence — Consolidation already resolved them; re-deriving risks disagreeing with a decision the reviewer already made.

**If given a raw `Review_Manifest.md` directly** (no consolidation step ran):
1. Scan for all items marked as approved (`[x] Approve` or `[x] Merge`).
2. For new approvals: map to the appropriate SSOT document and section, format using metadata/confidence/provenance, append.
3. For merges: identify the existing target sections, update those entries with the new citations or amendments.
4. This inline path has no pre-computed permanence tagging — apply the same Durable/Provisional judgment `/knowledge-consolidate` would before appending.

### Step 2: Semantic Mapping (Phase 3)
1. Map each newly registered fact to the appropriate SSOT domain.
2. If a fact introduces a brand-new domain concept (e.g., a new architectural pattern or a new Firestore schema element), flag it for a formal **SSOT addition** rather than merging it into unrelated docs.

### Step 3: Impact Analysis & Plan Generation (Phases 4-5)
1. Classify the change (New Evidence, Correction, Policy Update, etc.).
2. Find all dependent files by searching for affected terms and concept names in `docs/ssot/`, `GEMINI.md`, `CLAUDE.md`, and `enhancement-notes/`.
3. Generate an ordered Update Plan listing:
   - Target files to update.
   - Exact changes to be made.
   - Supporting evidence.
   - Risk rating (`Low` = factual citations; `Medium`/`High` = interpretive findings/decisions).

### Step 4: Approval Gate & Evolution (Phases 6-7)
1. Execute `Low` risk updates automatically.
2. Hold `Medium`/`High` risk updates (modifying SSOT docs, protocols, or enhancement priorities) for **explicit user approval**.
3. Once approved, update the respective SSOT spoke documents.

### Step 5: Validation & Sync (Phase 8-9)
1. Validate link integrity across affected docs.
2. Confirm no orphaned references were created.
3. Log the ingestion event as a brief entry in the relevant `SYSTEM_CLARITY_SNAPSHOT.md` or the session's closing notes.
4. Display the summary to the user.

---

## Guardrails
- **Lossless Rule**: Never summarize, shorten, or omit factual statements from external files.
- **Lineage Preservation**: Never delete or overwrite prior decisions without explicit user approval. If something is superseded, mark it as superseded with a reference to the replacement.
- **Review Integrity**: Never ingest any item that is not marked as approved in `Review_Manifest.md`.
