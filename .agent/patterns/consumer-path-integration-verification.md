---
pattern: consumer-path-integration-verification
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers: []
guard: ""
portability: universal
canonical_source: Task-Dashboard
porting_effort: low
---

# Consumer-Path Integration Verification (CPIV-001)

**Category**: Verification Standard / Anti-Pattern Prevention  
**Applies to**: Multi-tier data pipelines (Database/Store → Range Reader / Query Service → API Layer → Frontend State → UI Component)  
**Origin**: 2026-08-26 (INC-088: Isolated unit test masked truncated row slice)  
**Status**: VALIDATED  

---

## Pattern — Consumer-Path Integration Verification

### Problem
An engineer or agent implements a feature spanning multiple architectural layers (e.g. database schema, query range, API transformation, client parser, UI state). To verify the change, an isolated unit test is authored testing only a leaf function (e.g. `JSON.stringify` / `JSON.parse` or string token matching). The unit test passes with $100\%$ success, but at runtime, an intermediary layer (e.g., a capped range read, a query limit, or an unpassed argument) truncates or blocks the data, causing the feature to fail silently in production.

### Why it happens
1. **The Leaf-Test Mirage**: Leaf tests test pure logic in memory under ideal inputs, completely isolating the code from real-world data ingestion bottlenecks.
2. **False Verification Confidence**: Seeing green checkmarks from a leaf test creates unwarranted confidence that the full end-to-end integration is functional.

### Solution
Enforce **CPIV-001 (Step 5.7 in `role-activation.md`)**:
1. For any multi-tier data pipeline change, leaf unit tests are **insufficient** to claim Level 1 or Level 2 verification.
2. Verification MUST test or mock the **ingestion / range bottleneck**:
   - In Firestore/SQL: Assert query projection/select fields include all newly registered schema keys.
   - In Storage/Sheets: Assert data ingestion width accommodates all active schema columns.
3. Trace the data path from persistence read all the way to the consuming UI component or state store.

### Failure Mode
Treating leaf tests as integration verification allows range truncation, omitted query columns, or missing router parameters to slip silently into production.

### Task-Dashboard Instance
- **INC-088**: Unit test verified `_safeJsonParse` in memory, but missed that intermediary range fetch capped read width at 35 columns, slicing out newly registered schema columns.
