---
pattern: three-way-schema-alignment
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

# 3-Way Schema Alignment Preflight (TSAP-001)

**Category**: Architecture / Schema Preflight Protocol  
**Applies to**: Database schema migrations, table extensions, range read configurations  
**Origin**: 2026-08-26 (INC-088: Code header arrays missing columns compared to canonical SSOT)  
**Status**: VALIDATED  

---

## Pattern — 3-Way Schema Alignment Preflight

### Problem
When adding fields or columns to a database table or collection, developers frequently inspect only a local JavaScript array or mock object to calculate counts and offsets. If that local array was previously stale or out of sync with canonical documentation (`SHEET_SCHEMAS.md` / `CONTRACT.json`) and the live database, all new field calculations, range constants, and migration scripts will be mathematically wrong from the start.

### Why it happens
1. **Code-as-Truth Fallacy**: Assuming that a local constants array represents 100% of live schema columns.
2. **Partial Legacy Migrations**: Historical migrations added fields/columns to live stores and updated documentation, but never updated the fallback header arrays in code.

### Solution
Enforce **TSAP-001**:
Before modifying, adding, or indexing columns/fields:
1. **Execute 3-Way Preflight Check**:
   - Source 1: Canonical SSOT Documentation (Ground Truth)
   - Source 2: Code Schema/Header Registry
   - Source 3: Ingestion / Range Read Configuration
2. **Enforce 3-Way Invariant**:
   $$\text{len}(\text{SSOT\_Documentation}) \equiv \text{len}(\text{Code\_Registry}) \equiv \text{Ingestion\_Total\_Width}$$
3. **Resolve Pre-existing Mismatch First**:
   If an existing mismatch is detected, reconcile the code registries and range constants to match the canonical SSOT *before* calculating new field indices.

### Failure Mode
Adding $N$ new fields to a stale code array of $K$ items when the real schema has $K+M$ items causes ingestion readers to read $K+N$ instead of $K+M+N$, silently truncating $M$ items from every read.

### Task-Dashboard Instance
- **INC-088**: Schema code had 33 entries; adding 2 columns gave 35. But SSOT documentation and live sheets already had 37 columns. The true required column width was 39.
