---
pattern: lazy-periodic-instance-generation
activation_tier: reference
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Lazy Periodic Instance Generation (Spark-Tier Cron Avoidance)

**Category**: Process Pattern / Design Gate
**Applies to**: Any feature needing daily/weekly/monthly recurring instances (checklists, digests, reports, reminders) on a Firebase Spark (free) plan
**Origin**: 2026-07-14 session, TASK-218 continuation — building the Recurring Checklists module (GAP-010)
**Status**: HYPOTHESIS (used once, in [RecurringChecklistService.js](file:///d:/GitHub_Repo/Task-Dashboard/src/services/RecurringChecklistService.js); not yet validated in a second distinct feature)

---

## Pattern — Lazy Periodic Instance Generation

### Problem
A feature needs a recurring per-period record (e.g. "today's checklist," "this week's report") that should exist on a schedule. The obvious implementation is a Cloud Scheduler + Cloud Function that materializes the record at the start of each period.

### Why it happens
This repo's CLAUDE.md (`FIREBASE-CLI-OPERATIONS-GUIDE.md` constraints) states plainly: **Cloud Functions v2 and Cloud Scheduler require the Blaze (paid) plan** — unavailable on Spark. An agent reaching for the "textbook" cron-based design will hit that wall mid-implementation, or worse, silently assume Blaze is available and ship code that fails in production.

### Solution
1. Compute a deterministic **period key** from the current date (e.g. `YYYY-MM-DD` for daily, ISO-week `YYYY-Www` for weekly, `YYYY-MM` for monthly) — pure function, no I/O.
2. Use a **deterministic document ID** combining `templateId_periodKey_userId` (or equivalent) so "does this period's instance exist" is a single `getDoc`, not a query.
3. On any client-side read path that would want the current period's record (a page view, a reminder banner check), call a single `getOrCreate(...)`: read the doc; if missing, `setDoc` it with a snapshot of the current template/config. No writes happen anywhere else — every caller converges on the same generation function, so a banner check and the actual list page never disagree about what "this period's instance" is.
4. Never write a background job to "pre-generate" future periods. If nobody visits, nothing is generated — the record materializes lazily on first visit, which is the correct behavior for an optional/self-serve accountability system anyway (no wasted writes for periods nobody engages with).

### Failure Mode
If a second surface (e.g. an admin roster view) independently re-implements its own "does this period exist" check with different date math (off-by-one week boundary, different timezone handling) instead of calling the same `getOrCreate`/`getPeriodKey` functions, the two surfaces will disagree about what period is "current" — silently fragmenting the data model. Always route every period-key computation through the one shared function.

### Task-Dashboard instance
[RecurringChecklistService.js](file:///d:/GitHub_Repo/Task-Dashboard/src/services/RecurringChecklistService.js) — `getPeriodKey()` (date → period string), `getOrCreateInstance()` (deterministic ID + lazy materialization), and `getPendingCountForUser()` (the reminder-banner path, which reuses `getOrCreateInstance` rather than a separate existence check) all converge on the same generation logic. Covered by [RecurringChecklistService.test.js](file:///d:/GitHub_Repo/Task-Dashboard/src/services/RecurringChecklistService.test.js), including ISO-week year-boundary edge cases.
