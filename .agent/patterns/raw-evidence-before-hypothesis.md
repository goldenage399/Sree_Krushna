---
pattern: raw-evidence-before-hypothesis
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

# Raw Evidence Before Hypothesis

**Category**: Methodology
**Applies to**: Any investigation where a symptom is "data/behavior differs between two surfaces" or "a value is missing here but present there"
**Origin**: 2026-07-02 (GNP FFC activity-timeline dual-event-store incident)
**Status**: VALIDATED

---

## Problem

When a symptom is "X shows in view A but not view B," it's tempting to read the code for view B, form a hypothesis about which fields it depends on, and query only those fields. If the targeted query comes back empty, the agent escalates to explaining *why* the write might be missing (deploy timing, code history) instead of first asking "am I even looking at all the data that exists?" This produces long, plausible-sounding but wrong investigations.

## Why it happens

1. Reading code first and querying second means the query is scoped to *what the agent already believes* the schema looks like — it can't discover a field/branch the agent hasn't read yet.
2. A targeted grep for how a value might be written (`arrayUnion(...)`, a specific literal shape) fails silently when the real write uses different formatting, variable indirection, or lives in a file not yet considered — and a failed grep is easy to misread as "nothing writes this" rather than "my search terms were wrong."
3. Circumstantial evidence (git commit timestamps, file mtimes, deploy cache timestamps) is narratively satisfying and easy to string into a confident-sounding explanation, even when it was never actually verified against the failure mode.

## Solution

1. **Dump full raw state first.** On any "present here, absent there" symptom involving a document/record, the *first* tool call should be a complete dump of the raw object (`Object.keys(data)` + full JSON) — not a targeted read of the fields you expect from reading source code. This finds fields you didn't know to look for.
2. **Shadow-schema check.** Before concluding a field/collection name has one canonical source, enumerate *every* reader and writer of that exact literal name across the codebase. An identical name (e.g. `events`) can refer to two structurally unrelated stores (an inline array field vs. a subcollection) written by disjoint code paths with disjoint type vocabularies. Finding one writer does not mean it's the only one.
3. **Label confidence per IVP-001's evidence hierarchy inline, especially for timeline/history-based reasoning.** A theory built from git commit dates or file mtimes is `Inferred`, not `Verified`, until the failure mode is directly reproduced or the data directly confirms it. State this explicitly to the user rather than presenting a plausible narrative with the same confidence as a directly-queried fact — the user may act on it (e.g. redeploy) before it's actually confirmed.
4. **Concurrent-session tooling volatility.** In a workspace where the user may run another agent session (Gemini/Antigravity IDE, per this project's discussion-thread history) against the same repo concurrently, a script's on-disk behavior is not stable across a single investigation. If a tool's output is inconsistent between two runs with no edit of your own, run `git status --short -- <script>` / `git diff -- <script>` on it before concluding your own analysis (or the tool) was wrong — someone else may have modified it mid-session.
5. **Production-write confirm-then-execute must be two separate turns.** For any backfill/repair write to production data, show the exact payload and obtain explicit confirmation in its own response, then execute in a subsequent turn. Bundling "here's the payload" and the write attempt in the same turn risks the write being blocked (the payload wasn't actually confirmed by the user yet, only proposed) and forces a redundant round-trip.

## Failure Mode

An agent spends multiple tool-call rounds building an increasingly elaborate but never-verified narrative (deploy timing, tool staleness) to explain missing data, when the real cause is a second, structurally different, previously-undiscovered write path for an identically-named field — discoverable in one call via a full raw-document dump.

## Task-Dashboard instance

During the 2026-07-02 GNP FFC activity-timeline investigation:
- `db:task` (`db-inspect.cjs`) was read and run, confirming (at that moment) it queried legacy top-level `taskHistory`/`auditLogs` collections rather than the real `tasks/{id}/events` subcollection — a real, verified finding at the time.
- Several grep rounds for how an inline `task.events[]` field might be written all came back empty; the field was only found by pivoting to a full raw-document key dump, which surfaced it in one call.
- A plausible but never-verified "deploy timing" narrative (hosting cache mtime vs. commit dates) was constructed to explain a missing event, and was superseded once the real second write path (the inline array) was discovered via a user-provided screenshot.
- A follow-up `db:task` run later in the same session showed corrected, subcollection-based output — because `src/scripts/db-inspect.cjs` had been modified (uncommitted, in the working tree) between the two runs, almost certainly by a concurrent agent session working the same incident.


## Rule 6 � Governance Evidence Must Be Pinned to Live File Content

**Applies to**: Any Architecture Council report, ADR, or session summary that references specific lines of source code as evidence for a finding or verdict.

**Problem**: If an agent uses a prior cached read as the basis for a council report, the code snippet may be stale. The council verdict is then architecturally correct but operationally misleading.

**Rule**: Before writing any council/governance document that quotes source code as evidence:
1. Issue a fresh `view_file` call for the exact lines being cited.
2. Confirm the quoted snippet exactly matches what `view_file` returns.
3. If the fix is already present, record **"PRINCIPLE CONFIRMED � already implemented"** rather than **"APPROVED � modify [file]"**.

**Anti-pattern**: Writing `userData.level <= 2` based on a read from 20 tool-call turns ago, when the file has since been updated to `=== 1`.

## Task-Dashboard instance (2026-07-10) � Council evidence staleness

- Council evidence block quoted `userData.level <= 2` as live code in `ProjectContext.jsx` L221.
- Actual live code was `parseInt(userData.level, 10) === 1` � the restriction was already in place.
- The session summary wrote "Level 2 admin scoping deferred to tracked enhancement" � a false status with no enhancement ticket.
- Root cause: council session used cached file state rather than issuing a fresh `view_file` before authoring the report.
- **Corrected** by SSOT reconciliation + PIRR on 2026-07-10: council doc and Council Ledger amended with audit banners.