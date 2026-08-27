---
pattern: three-way-schema-alignment
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: .agent/workflows/role-activation.md
    at: "Step 5.8 — 3-Way Schema Alignment Preflight (TSAP-001)"
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

### Solution
Enforce **TSAP-001**:
Before modifying, adding, or indexing fields/columns:
1. **Execute 3-Way Preflight Check**:
   - Source 1: Canonical SSOT Documentation
   - Source 2: Code Schema/Header Registry
   - Source 3: Ingestion / Range Read Configuration
2. **Enforce 3-Way Invariant**:
   $$\text{len}(\text{SSOT\_Documentation}) \equiv \text{len}(\text{Code\_Registry}) \equiv \text{Ingestion\_Total\_Width}$$
3. Reconcile any existing mismatch before calculating new indices.
