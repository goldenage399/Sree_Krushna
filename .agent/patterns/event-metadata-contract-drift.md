---
pattern: event-metadata-contract-drift
activation_tier: routed
status: HYPOTHESIS
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: ["event metadata missing", "activity feed missing note", "task update not showing in activity", "metadata field undefined", "appendTaskEvent meta", "event.metadata", "field shows in details but not activity", "P97"]
guard: ""
portability: repo-specific
canonical_source: task-dashboard
porting_effort: low
---

# Event Metadata Contract Drift

**Category**: Anti-Pattern
**Applies to**: Any workflow adding a new `appendTaskEvent()` call site, or a new consumer that reads `event.metadata.X` from the `tasks/{id}/events` subcollection
**Origin**: Session 2026-07-02 — TASK-212 / INC-045. User reported "task update shows in Task Details but not in Task Activity"; root cause traced through three independent write paths that each invented a different metadata field name for the same semantic content, while the sole renderer read a fourth key nobody wrote.
**Status**: HYPOTHESIS (validated in this one incident; not yet confirmed to recur in a second context)

---

## Anti-Pattern — Silent Metadata Key Drift

### What it is

A service method (`EnhancedTaskService.appendTaskEvent()`) accepts a free-form `meta`/`metadata` object with no enforced schema per event type. Multiple call sites across the codebase each independently choose a field name for the same semantic content (e.g., "the free-text note describing what was done"), and the consumer/renderer reads only one of those names. No compile-time, lint, or test signal catches the mismatch — the write succeeds, the read succeeds, both look correct in isolation, and the data is simply absent wherever the names don't line up.

### Symptoms

- A value is present in Firestore (confirmed via `db:task` inspection or the Firebase console) but a specific UI surface never shows it, while a *different* UI surface showing the "same" data does display it correctly.
- The "same" data renders correctly in one view and is silently blank in another, for the identical user action.
- Grepping for the missing UI text/field across the codebase turns up only ONE reader and, on inspection, MULTIPLE writers using different key names (or, inverted: multiple readers expecting a key that only some writers actually set).
- The bug reproduces 100% of the time (not intermittent) — this is what distinguishes it from a race condition or stale-cache issue.

### Why it fails

Free-form metadata objects (`meta: {...}`, `metadata: {...}`, any object literal passed to a shared write helper without a typed/enum'd shape) have no single source of truth for field names. Each call site is written independently, often in a different session or by a different contributor, with no visibility into how other call sites named the same concept. Nothing forces the reader and every writer to agree — not a type system (plain JS objects), not a test (no test asserted the field round-trips), not a lint rule (regex-based linters can't reliably catch "this key is read here but never written there" across files).

### Correction

1. **Before adding a new `appendTaskEvent` call site** (or equivalent shared free-form-metadata writer): grep ALL existing call sites for how they name fields carrying the same semantic content. Reuse the existing name — do not invent a new one because it "reads better" or you didn't check.
2. **Before adding a new metadata consumer** (a renderer, a report, an export reading `event.metadata.X`): grep all writers first to confirm the key is actually populated somewhere. Do not assume a field exists because the type/shape "should" have it.
3. **When you find a drift** (as in INC-045): standardize on ONE canonical key across all writers, update the reader to use it, and — critically — keep a defensive fallback chain (`a.comment || a.remarks || a.progressNotes`) in the reader for one migration cycle so already-written historical documents don't regress.
4. **Register the canonical field name** as a standard (`.agent/standards-catalog.json`) so future call sites have something to grep for/be caught by code review, since this class of bug is not mechanically detectable by a simple regex (it requires cross-file semantic reasoning about "same meaning, different key").

### Task-Dashboard instance

INC-045 / TASK-212 (2026-07-02): `AssociateDashboard.jsx:303` wrote `meta.comment`; `TaskUpdateModal.jsx:604` wrote `meta.progressNotes`; `TaskUpdateModal.jsx:580` (status-change branch) wrote no note field at all; `ActivityShell.jsx:640` read only `event.metadata.remarks` — a key none of the three writers ever set. Fixed by standardizing on `comment` (P97) with a fallback chain in the two readers (`ActivityShell.jsx`, `TaskDetailsModal.jsx:570`) for backward compatibility with any already-written documents.

---

## Positive Pattern — Grep-Before-Write for Shared Metadata Objects

### Problem

Without a check, every new call site to a shared free-form-metadata writer is a coin flip on whether it agrees with existing readers.

### Why it happens

No schema, no type, no test enforces agreement between independently-written call sites touching the same conceptual field.

### Solution

Treat any shared `meta`/`metadata` write helper (not just `appendTaskEvent`) as if it had an implicit contract: before writing a new call site, run `grep -rn "meta:\s*{" <file-defining-the-helper's-callers>` (or equivalent) to inventory existing key names for the concept you're about to add, and reuse the match. When in doubt, check the standards catalog for a registered canonical key (e.g., P97 → `comment`) before inventing one.

### Failure Mode

If this check is skipped and a new key is introduced anyway, the write "succeeds" and looks correct in code review (nothing is obviously wrong with the diff in isolation) — the drift only surfaces later, as a confusing "works here, not there" user report that requires tracing multiple files across write and read paths to diagnose, exactly as this incident did.

### Task-Dashboard instance

Same as above — INC-045 / TASK-212 / P97.
