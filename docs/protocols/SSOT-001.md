# SSOT-001 — Single Source of Truth Creation Protocol

**Status**: Active — First-class protocol (Central Brain Documentation Standards)
**Pattern Family**: ISO-Type (Documentation Standards) + TEP-001 (Token Efficiency)
**Authority**: Supersedes ad-hoc documentation decisions regarding master document creation
**Referenced from**: `CLAUDE.md` § "SINGLE SOURCE OF TRUTH CREATION PROTOCOL (SSOT-001)"

> **Materialization note (2026-07-15)**: `CLAUDE.md` has cited `/protocols/SSOT-001.md` as this
> protocol's canonical source since before this file existed — the file itself was never written,
> only summarized inline in `CLAUDE.md`. That gap is exactly the failure mode this protocol exists
> to prevent (a subsystem referenced from multiple places with no single authoritative doc). This
> file materializes what `CLAUDE.md` already claimed and gives the three workflows that need to
> check for it (`enhancement-protocol.md`, `ssot-reconciliation.md`, `post-incident-governance.md`)
> one place to point to instead of each restating the criteria.

---

## What SSOT-001 Is

Defines **when**, **how**, and **where** to create Single Source of Truth (SSoT) master
documents for subsystems whose knowledge has become scattered across multiple files.

**Key Principle**: When knowledge about one subsystem is scattered across 3+ files → create one
authoritative master document that references (not duplicates) the existing sources.

---

## Mandatory Triggers — Run This Check

Ask these four questions. If the answer to **any** is yes, an SSoT is required:

1. Do **3+ files** already cover this subsystem/topic (code + docs + patterns + discussion threads all count)?
2. Is knowledge about this subsystem scattered across the repo with no single doc explaining "what is this and why does it exist"?
3. Would a future session (human or agent) lose context reconstructing this subsystem's purpose from source alone?
4. Does no existing doc serve as a single entry point that a `grep`-free navigation (`CLAUDE.md → hub → spoke`) would land on?

**This is a coverage check, not a contradiction check.** It does not require any two sources to
disagree — the absence of a single entry point is itself the failure condition. This is the
property that distinguishes SSOT-001 from `/ssot-reconciliation` (which only fires when sources
*contradict* each other) and from `/post-incident-governance` (which only fires on an incident).

---

## Where to Place

- `docs/<TOPIC>.md` — user-facing subsystem/feature documentation (e.g. `TASK-MANAGEMENT.md`, `SAMPLE-DATA-MANAGEMENT.md`)
- `docs/protocols/` — governance/process systems (e.g. this file, `AGP-001-AGENT-GOVERNANCE-PROTOCOL.md`)
- `docs/ssot/<hub>/` — architecture hub spokes (e.g. `docs/ssot/architecture-hub/TASK-LIFECYCLE-SSOT.md`)
- `.agent/patterns/` — process/methodology, not subsystem documentation (see `capture-pattern.md` — different artifact type)

---

## 7 Mandatory Sections

1. Purpose & Overview
2. Architecture Diagram
3. Module/Component Definitions
4. Lifecycle/Workflow
5. Quick Reference Commands
6. Troubleshooting
7. File Locations & Navigation

---

## Cross-Linking Rules (TEP-001 Compliant)

- ✅ Reference existing files (don't duplicate their content)
- ✅ Link to canonical sources
- ✅ Create an index/map, not a content copy
- ✅ **Register the new doc** in `CLAUDE.md` (Documentation Map + a "When Working on X" pointer) and `docs/DOCUMENTATION-INDEX.md` (with trigger words) — an SSoT that exists but isn't linked from either entry point fails the same coverage check it was created to pass.

---

## Where This Check Belongs in Other Workflows

SSOT-001 is not itself a triggered workflow with a slash command — it's a **standing completion
gate** other workflows must run at the right moment:

| Workflow | When to run the SSOT-001 check |
|---|---|
| `.agent/workflows/enhancement-protocol.md` | At the close of any enhancement that shipped a new module/subsystem — before declaring the enhancement done |
| `.agent/workflows/ssot-reconciliation.md` | Before Step 1 (Knowledge Scan) — if the subsystem has no SSoT at all (not a contradiction, an absence), route here instead of running the contradiction-resolution steps against nothing |
| `.agent/workflows/post-incident-governance.md` | Phase 3, Step 1 — "Extend SSOT" presumes one exists; check first, and *create* one if the affected subsystem has none, rather than only extending |

**Origin**: 2026-07-15 — this file, and the three cross-references above, were added after a
session shipped the Recurring Checklists module (`docs/RECURRING-CHECKLISTS.md`) with no SSoT for
several turns, and both `/ssot-reconciliation` and `/post-incident-governance` were run at
session-close without either one catching the gap — correctly, per their own written scope, since
neither workflow's job is a documentation-coverage check. See `docs/PIRR_RECONCILIATION_LOG.md`
2026-07-15 entry.
