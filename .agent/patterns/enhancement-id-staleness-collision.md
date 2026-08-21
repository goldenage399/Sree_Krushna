---
pattern: enhancement-id-staleness-collision
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

# Enhancement ID Staleness / Collision

**Category**: Design Gate
**Applies to**: `enhancement-scaffolder` skill, any workflow that mints a new `TASK-NNN` ID from `enhancement-config.json`
**Origin**: 2026-07-30 session — scaffolded `enhancement-notes/TASK-226-My-Day-Daily-Planning-Engine/` using `enhancement-config.json`'s `next_id: 226`, only to discover mid-session (while reusing `EnhancedTaskService.rescheduleTask`) that `enhancement-notes/TASK-226-Execution-Discovery-Runtime-Decision-Model/` already existed — a substantial, actively in-progress (Phase 6/Slice 4-of-5) enhancement from a different work thread, with real code already shipped (`EnhancedTaskService.logDiscovery`/`assessDiscovery`/`executeDecision`, `TaskDiscoveryPanel.jsx`). `enhancement-config.json` had never been bumped past 226 when that ticket was scaffolded.
**Status**: VALIDATED (caused a real collision this session, root-caused and fixed)

---

## Pattern — Enhancement ID Staleness / Collision

### Problem
`enhancement-config.json`'s `next_id` is trusted as ground truth by the scaffolder protocol ("Get `next_id`... Format the ID as `{prefix}-{next_id}`"). If any prior scaffolding action failed to bump it — a skipped step, a session that scaffolded outside the normal flow, a manual edit — the counter goes stale. The next scaffold then mints an ID that's already in use, silently creating two enhancements under one ID number until something (like reusing a service method with a doc comment referencing the "wrong" ticket) surfaces the collision.

### Why it happens
`next_id` is a cache of "how many enhancements have been scaffolded," not a live query against the filesystem. Nothing cross-validates it before it's trusted. The scaffolder protocol's own Step 1.5 ("CRITICAL: Increment `next_id` immediately after the user confirms the enhancement") is a discipline requirement, not a mechanically enforced one — there's no guard script comparable to `check:bridge-classes` for this.

### Solution
Before using `next_id` to mint a new ID, grep the whole repo for `{prefix}-{next_id}` (not just `enhancement-notes/` — cluster files, `docs/`, and code comments can all reference a ticket ID before its folder exists, or after its folder was renamed). Zero hits confirms it's genuinely free. Any hit means the config is stale — derive the real next ID from `enhancement-notes/`'s actual filenames (max existing number + 1) and correct the config before proceeding. See `.agent/skills/enhancement-scaffolder/SKILL.md` Step 1.4 for the exact commands.

### Failure Mode
Skipping the collision check and trusting `next_id` blindly recreates this exact incident: two unrelated enhancements sharing one ID, cluster-file entries pointing at the wrong ticket, and institutional memory fragmenting across two documents that both claim the same identity. If the collision isn't caught until code review or a doc comment cross-reference (as happened here), real work may already be duplicated under the wrong ID before anyone notices.

### Task-Dashboard instance
2026-07-30: `enhancement-config.json` claimed `next_id: 226` while `enhancement-notes/TASK-226-Execution-Discovery-Runtime-Decision-Model/` already existed (found via a doc comment in `EnhancedTaskService.js`: `"TASK-226 Slice 2 — Log an immutable runtime discovery fact"`). Fixed by renaming the newly-created `TASK-226-My-Day-Daily-Planning-Engine/` to `TASK-227-...` (verified free via repo-wide grep first), correcting all internal ID references, the cluster entry, and setting `next_id` to the true next-free value (229, after also consuming 228 for a follow-on ticket found in the same session). See `enhancement-notes/TASK-227-My-Day-Daily-Planning-Engine/00_ENHANCEMENT_INDEX.md` D-008 for the full record.
