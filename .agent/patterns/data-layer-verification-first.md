---
pattern: data-layer-verification-first
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

# Data-Layer Verification First (Layer 0 Check)

**Category**: Methodology
**Applies to**: Any database, Firestore query, rules, indexing, or collection schema debugging session
**Origin**: 2026-07-01 (Session to resolve mapping/telemetry gaps)
**Status**: VALIDATED

---

## Pattern — Data-Layer Verification First

### Problem
When debugging a database or collection query error (such as a permission denied, missing field, or empty result), developers often jump straight to modifying security rules, index files, or data-mapping logic without verifying if *any* actual document exists in that collection to be queried. This leads to wasted rounds of rules/indexes deployment and diagnostic changes for a collection that was actually deprecated or unused.

### Why it happens
LLM agents naturally focus on code edits first rather than querying state. Without checking if the targeted collection is populated or even used by current write paths, the agent works on false assumptions.

### Solution
Always verify data presence at the absolute start of a debugging session:
1. **Count / Existence Query (Layer 0)**: Check if the collection has any documents. Execute a single-document limit fetch (`db.collection(col).limit(1).get()`) or count check.
2. **Trace Caller Footprint**: Run a quick static scan (`grep -rn "collectionName" src/`) to verify if any active write path actually populates this collection.
3. **Inspect Real Documents**: Retrieve one representative document to verify its actual schema layout before writing mappers, rather than guessing its properties.

### Failure Mode
Treating a collection mentioned in a schema file as active and deploying indexes/rules for it, only to realize later that the collection has zero documents and is completely orphaned.

### Task-Dashboard instance
During the telemetry gaps resolution (INC-2026-07-01), the agent spent multiple turns deploying composite indexes and security rules for the `activityLogs` collection, only to discover later via direct queries that the collection was completely empty and retired, as the app had migrated to the `events` subcollection.
