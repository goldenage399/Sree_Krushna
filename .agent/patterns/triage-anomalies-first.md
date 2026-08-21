---
pattern: triage-anomalies-first
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

# Triage Anomalies First

**Category**: Process / Methodology
**Applies to**: Data repairs, database schemas, migration scripts, and reconcilers
**Origin**: Session 2026-06-16/17 (TASK-176 Step 3 Remediation)
**Status**: VALIDATED

---

## Pattern — Triage Anomalies First

### Problem
An agent detects a data mismatch or missing schema fields and immediately designs a generic database migration system (backfill script, automated reconciler, static invariants, schema validation gates), only to discover later that the anomaly affects only one or two real users, while the remaining affected records are legacy seed/test garbage. This results in significant over-engineering, high verification overhead, and unnecessary database risk.

### Why it happens
The agent naively assumes that any database drift is a systemic issue requiring general-purpose code remediation, without first validating the scale of the anomaly (the "population size") or checking which records are live production data versus disposable test data.

### Solution
Before writing any database repair script or scheduling a consistency checks reconciler:
1. **Determine blast radius**: Execute a read-only count query to locate every record containing the anomaly.
2. **Classify the population**: Check the record emails/domains to separate real onboarded users (e.g. gmail, corporate domains) from legacy seed test accounts (e.g. `@taskdashboard.test` domain).
3. **Validate with the user**: Present the counts to the human reviewer and ask:
   > "We found N anomalies. {X} are legacy test accounts, and {Y} are real users. Is the test data disposable? Should we wipe/re-seed the test data and manually correct the Y real documents, or do we genuinely require a systemic migration system?"
4. **Match effort to scale**: 
   - If test records are disposable, **delete the seed cruft**.
   - If only a few real records are affected, **hand-correct them** (or re-onboard them cleanly through the normal write path) instead of creating a backfill command-line system.
   - Limit migration script engineering to true large-scale production anomalies.

### Failure Mode
Applying a general backfill script to disposable seed data can trigger collateral damage, such as wiping `projectLevels` (and thus task visibility) for legacy seed users who do not have backing profile assignments.

### Task-Dashboard instance
During TASK-176 Step 3, the agent spent multiple turns engineering `repair-profile-assignments.cjs` and a reconciler, only to discover that the target population consisted of just 2 real users (`operations.excutive.pe@gmail.com`, `pratimaenterprises0402@gmail.com`) and 4 legacy seed test accounts (`testadmin`, `adminlead`, etc.). A simple query triage at the start would have led to deleting the seed accounts and repairing the 2 real records in seconds.
