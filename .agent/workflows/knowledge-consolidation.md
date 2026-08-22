---
description: Knowledge Consolidation Workflow - Turn an approved Review Manifest into a single canonical, deduplicated Knowledge Delta plus a quantified Knowledge Impact Report, ready for mechanical application by /knowledge-intake.
---

# /knowledge-consolidate — Knowledge Consolidation Workflow

**Purpose:** Sit between "the reviewer approved a manifest" and "the SSOT docs get edited." Knowledge Archaeology's job is to **recover everything**; this workflow's job is to **decide the exact, final shape of what becomes organizational memory** from what was approved — resolving duplicates into canonical entries, resolving entity aliases, merging timeline events, closing only the contradictions the reviewer explicitly resolved, and assigning each item a permanence class (durable vs. provisional). The output is one deterministic change-set (`Knowledge_Delta.md`) and one quantified summary (`Knowledge_Impact_Report.md`). `/knowledge-intake` then applies the Delta mechanically instead of re-deriving these judgment calls itself.

---

## Pipeline Position

```
Source Document
   ↓
Knowledge Archaeology (/knowledge-archaeology)   — recover everything, 15 deliverables
   ↓
Human Review                                     — reviewer marks Review_Manifest.md
   ↓
Knowledge Consolidation (/knowledge-consolidate) — THIS WORKFLOW — decide what becomes memory
   ↓
Knowledge Intake (/knowledge-intake)             — mechanically apply the Delta
   ↓
SSOT Sync                                        — docs/ssot/, enhancement-notes/, GEMINI.md updated; dependents propagated
```

This workflow only runs on a manifest that already has reviewer decisions recorded (`[x]` marks). It never operates on an untouched manifest.

---

## Steps at a Glance

| Phase | Name                        | Goal                                                                 |
|-------|------------------------------|-----------------------------------------------------------------------|
| 0     | Approved-Item Filtering      | Keep only `[x] Approve` / `[x] Merge` items; exclude Reject/Needs Review |
| 1     | Duplicate Resolution         | Resolve each approved item to New vs. Update-existing entry           |
| 2     | Entity Alias Resolution      | Resolve each approved entity to New vs. alias of an existing concept   |
| 3     | Canonical Technical Figures  | Canonicalize only where the reviewer explicitly resolved a conflict    |
| 4     | Timeline Merge               | Dedupe new timeline events against the live `User_Created/` history   |
| 5     | Contradiction Closure        | Close only contradictions the reviewer explicitly marked resolved     |
| 6     | Permanence Assignment        | Tag every item Durable or Provisional                                 |
| 7     | Delta Assembly               | Produce `Knowledge_Delta.md` — the exact, mechanically-applicable change-set |
| 8     | Knowledge Impact Report      | Produce `Knowledge_Impact_Report.md` — quantified before/after summary |

---

## Invocation

```text
/knowledge-consolidate <approved_review_manifest_path> [mode]
```

- `<approved_review_manifest_path>` — path to a `Review_Manifest.md` that the reviewer has already marked (produced by `/knowledge-archaeology`).
- `[mode]` — optional, one of `full` (default, writes both deliverables) or `dry-run` (preview only, writes nothing).

---

## Phase-by-Phase Instructions

### Phase 0 — Approved-Item Filtering
Scan the manifest. Keep only items marked `[x] Approve` or `[x] Merge`. Items marked `[x] Reject` are dropped entirely (logged in the Impact Report's count only). Items left `[ ]` or marked `[x] Needs Review` are **excluded from the Delta** and must remain open — surface them as a reminder, do not silently drop them from the corpus's memory of "things still pending."

### Phase 1 — Duplicate Resolution
For each approved item, check the source package's `Duplicate_Candidates.md`:
- If the reviewer approved a `Merge (with existing)` action, the Delta records this as an **Update** to that existing entry (add citation/detail), never as a new entry.
- If genuinely new (no duplicate flagged, or reviewer overrode a "possible merge" as "approve as new" because the items are actually distinct), the Delta records this as **New**, with a computed position for insertion into the target SSOT document.

### Phase 2 — Entity Alias Resolution
For each approved entity in `Entity_Register.md`, resolve against existing docs and SSOT definitions:
- **Alias** → record as a merge/update to the existing concept (add the new evidence citation, not a new entry).
- **New** → record as a new entity registration.
Never invent a merge that the archaeology package didn't already flag or the reviewer didn't approve.

### Phase 3 — Canonical Technical Figures
This phase **canonicalizes, it does not adjudicate**. Two cases only:
1. **No real conflict** — the same fact is restated by multiple sources. Consolidate into one canonical entry with all citations attached.
2. **The reviewer explicitly resolved a conflict** in the manifest. Only then does the Delta record a canonical entry and mark the superseded one accordingly.

If neither condition holds, **both/all versions ship as-is with the contradiction left open** — never silently average or pick one side of a genuinely conflicting pair.

### Phase 4 — Timeline Merge
Compare each approved new timeline event against the live session history in `User_Created/Discussion Threads/`:
- Same date + same event (near-exact restatement) → merge, add citation.
- Same date, materially different or elaborating event → keep as a distinct, adjacent entry.
- No overlap → new entry.

### Phase 5 — Contradiction Closure
Only close (mark Resolved) a contradiction if the manifest shows an explicit reviewer-approved resolution action for that contradiction. Newly proposed contradictions the reviewer approved for *registration* (not resolution) are added to the register **still open** — approving a contradiction's existence is not the same as approving its resolution.

### Phase 6 — Permanence Assignment
Tag every approved item:
- **Durable** — verified facts, dated events, Track A (first-hand verified) statements, and the fact-of-occurrence for Track B statements.
- **Provisional** — Track B content being treated as a hypothesis or recommendation rather than adopted strategy, Low-confidence claims, and anything explicitly flagged `Needs Investigation`. Provisional items still enter the Delta but are routed to open questions / "proposed, unconfirmed" framing.

### Phase 7 — Delta Assembly
Produce `Knowledge_Delta.md` in the same package folder, with this fixed shape:

```markdown
# Knowledge Delta — <package name> — Consolidated <date>

Source manifest: <path>, reviewer decisions dated <date>
Status: Ready for /knowledge-intake

## New Evidence (Durable)
| Target SSOT Doc | Section | Value | Source | Confidence | Risk |
|---|---|---|---|---|---|

## New Evidence (Provisional)
| Target SSOT Doc | Section | Value | Source | Confidence | Reason held | Risk |
|---|---|---|---|---|---|---|

## Evidence Updates (Merges)
| Target SSOT Doc | Target Section | New Citation/Detail | Reason |
|---|---|---|---|

## New Entities
| Entity | New or Alias-of | Target Doc | Risk |
|---|---|---|---|

## Timeline Additions / Merges
| Date | Event | New or Merged-into | Risk |
|---|---|---|---|

## Contradiction Additions (still open)
| Description | Risk |
|---|---|

## Contradiction Resolutions (reviewer-approved only)
| Contradiction | Resolution | Risk |
|---|---|---|

## Excluded (for the record — not entering the KB)
| Item | Disposition | Reason |
|---|---|---|
```

Every row carries a pre-computed risk tag (`Low` / `Medium` / `High`) so `/knowledge-intake` Phase 6's approval gate does not need to re-derive it — Low executes automatically, Medium/High still holds for explicit confirmation even when Consolidation ran in `full` mode.

### Phase 8 — Knowledge Impact Report
Produce `Knowledge_Impact_Report.md` in the same package folder:

```markdown
## Knowledge Impact Report — <date> — <package name>

Source package:            <path>
Consolidation mode:        [full | dry-run]

New Evidence (Durable):         +N
Existing Evidence Updated:      N
Facts Superseded:               N
New Entities:                   +N
Entity Merges:                  N
New Contradictions:             +N
Contradictions Resolved:        N
Timeline Events Added:          +N
Timeline Events Merged:         N
Durable facts admitted:         +N
Provisional facts held:         N    (routed to open questions)
Rejected items:                 N    (excluded)
Needs-Review items pending:     N    (excluded, still open)
Knowledge Density Delta:        +N net durable facts
Recommended Human Review:       [specific items this run could not resolve alone, or "None"]
```

---

## Guardrails

### ⛔ DO NOT:
- Resolve a contradiction the reviewer didn't explicitly resolve.
- Assign a new position without first checking for a Merge action.
- Promote a Provisional/Track-B item to Durable to make the Impact Report look bigger.
- Write anything to `docs/ssot/` directly. Consolidation, like Archaeology, only proposes — `Knowledge_Delta.md` is still pre-SSOT.
- Silently drop Rejected or Needs-Review items from view — they must appear in the Delta's "Excluded" table.

### ✅ SAFE to proceed when:
- The Review Manifest has at least one `[x]`-marked decision.
- You are ready to produce both `Knowledge_Delta.md` and `Knowledge_Impact_Report.md` before handing off to `/knowledge-intake`.

## Related
- [knowledge-archaeology.md](knowledge-archaeology.md) — produces the Review Manifest this workflow consumes
- [knowledge-intake.md](knowledge-intake.md) — consumes this workflow's `Knowledge_Delta.md`
