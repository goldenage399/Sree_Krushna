---
pattern: context-bootstrap
origin_pio: PIO-ICAP-2026-05-17
tier: universal
applies_to:
  - "Any repository with SSOT documentation folders"
  - "Complex module investigations requiring contextual convergence"
  - "Architectural analysis, refactors, and mutation planning"
prereqs:
  - "Module SSOT folder (docs/<MODULE>_SSOT/ or equivalent)"
  - "Dependency graph (graphify or equivalent)"
  - "Memory layer (memory-session-loader or equivalent)"
porting_effort: low
last_reviewed: 2026-05-17
description: "Institutionalized Context Acquisition Protocol (ICAP) for full contextual convergence in complex module investigations."
---

<!-- shared:std.agent.context-bootstrap.core:start -->

# /context-bootstrap — Institutionalized Context Acquisition Protocol (ICAP)

> **Purpose**: Achieve full contextual convergence for any module investigation within minutes, not hours. Replace ad-hoc, grep-driven exploration with a deterministic 5-phase pipeline.
>
> **Core Principle**: Architecture is discovered from governance and topology first, then verified through code.
>
> `Code = implementation detail` · `SSOT = architectural truth` · `Graph = structural topology` · `Memory = continuity layer` · `Protocols = invariant boundaries`

---

## When to Use

- ✅ Starting any complex investigation of a module
- ✅ Before architectural analysis, refactor planning, or mutation proposals
- ✅ Resuming work on a module after a context window reset
- ✅ Invoked via `/context-bootstrap <module>`

---

## PHASE 0 — Session Bootstrap

> **Enforcement**: No implementation file traversal may begin before Phase 0 completes.

1. Run `/aos-session-open` — loads skill router, graph, memory, and handoff
2. Load memory/context layer — surfaces prior conclusions, known invariants, protocol sensitivities, historical risks

**Gate**: No file traversal until bootstrap is complete.

---

## PHASE 1 — Governance-First SSOT Ingestion

> **Enforcement**: SSOT ingestion is mandatory before any grep, router tracing, or service file traversal.

Mandatory ingestion order from `docs/<MODULE>_SSOT/` (or repo-equivalent):

| Step | File | Purpose |
|------|------|---------|
| 1 | `HUB.md` | One-page module orientation |
| 2 | `CONTRACT.json` | Exact API parameter signatures |
| 3 | `DATA_FLOW_MAP.md` | Full UI → API → Writer → Storage chain |
| 4 | `SERVICE_LAYER_MAP.md` | File-level layer responsibilities |
| 5 | `ARCHITECTURE.md` | Architectural decisions (if exists) |
| 6 | `KNOWN_INVARIANTS.md` | Protocol sensitivities (if exists) |

> If implementation contradicts SSOT → **flag drift immediately**. Do not silently trust implementation.

---

## PHASE 2 — Topology Extraction

> **Enforcement**: Graph topology is the primary discovery mechanism. Manual grep is fallback only.

1. Read the graph community report — identify the module's Community cluster(s)
2. Run a structured graph query to extract:
   - Community cluster ID(s)
   - Dependency map (direct + transitive)
   - Service relationships
   - Writer/audit chain
   - Cross-module touchpoints

---

## PHASE 3 — Protocol Surface Scan

> **Enforcement**: No mutation proposal may be made before protocol scans complete.

Run protocol enforcement tools against:
- Module service files
- Writer/audit files
- Loop constructs (performance invariants)
- Transactional boundaries (error handling, rollback)

**Objective**: Surface invariant conflicts *before* architectural reasoning begins.

---

## PHASE 4 — Context Reconstruction

Generate and emit `MODULE_MEMORY_SUMMARY.md`:

1. **Execution chain** — `UI → Router → Service → Engine → Writer → Audit`
2. **Dependency summary** — all files in scope by layer
3. **Invariant summary** — active protocol constraints for this module
4. **Mutation surface** — specific files/functions that would change
5. **Risk surface** — financial writes, shared engines, cross-module dependencies

> **Emit this file to**: `docs/<MODULE>_SSOT/MODULE_MEMORY_SUMMARY.md`
> This becomes the re-entry point for future sessions — skipping Phases 1–4.

---

## PHASE 5 — Code Verification

Implementation files may now be opened.

**Purpose only**: verify SSOT claims, inspect edge cases, confirm implementation nuance.  
**NOT for**: primary architectural discovery.

---

## Institutional Rules

| Rule | Constraint |
|------|-----------|
| **SSOT Supremacy** | Implementation contradiction → flag drift, do not trust code silently |
| **Governance Before Mutation** | No mutation proposal before Phase 3 completes |
| **Graph Before Grep** | Topology-first discovery is mandatory — grep is fallback only |
| **Memory Persistence** | Every investigation must emit `MODULE_MEMORY_SUMMARY.md` |

---

## Quick Reference Checklist

```markdown
### /context-bootstrap Checklist

Phase 0 — Session Bootstrap
- [ ] Session opened, memory loaded

Phase 1 — SSOT Ingestion
- [ ] HUB.md read?
- [ ] CONTRACT / API signatures ingested?
- [ ] Data flow chain mapped?
- [ ] Layer responsibilities clear?

Phase 2 — Topology Extraction
- [ ] Community cluster(s) identified?
- [ ] Cross-module touchpoints noted?

Phase 3 — Protocol Surface Scan
- [ ] Protocol tools run?
- [ ] Active violations documented?

Phase 4 — Context Reconstruction
- [ ] Execution chain generated?
- [ ] Invariant summary generated?
- [ ] Mutation surface identified?
- [ ] MODULE_MEMORY_SUMMARY.md emitted?

Phase 5 — Code Verification
- [ ] Only opened files to VERIFY (not discover) architecture?
```

---

## Success Condition

The bootstrap is complete when the agent can answer:
- *"What writes to which storage and how is it audited?"*
- *"Which protocols apply to this module?"*
- *"Which files would change for this task?"*

…**without opening any source file**.

<!-- shared:std.agent.context-bootstrap.core:end -->
