# Layer Routing Rules (C-Ops Access Logic)

**Protocol ID**: LRR-001
**Status**: ✅ **ACTIVE**
**Created**: 2025-11-15
**Last Updated**: 2025-11-15
**Pattern Family**: NIST-Type (Operational Framework)
**Related**: ENH-INFRA-054 (Infra-Ops), ENH-INFRA-055 (proto-query), C-Ops Framework

---

## 🎯 Purpose

A single, deterministic routing map that tells Claude Code which layer, cache, or tool to use — and which flags to apply — for a given class of query or operation.

This document is the **canonical runtime glue** for:
- C-Ops ↔ Infra-Ops ↔ AKCS ↔ proto-knowledge-query integration

---

## 🏛️ Governance Principles

### 1. Deterministic First
Routing rules are **explicit conditionals** (no heuristics).
Machine-readable AND human-readable.

### 2. Fail-Safe
Default to *safe, minimal action* (answer normally) if no rule applies.
Log the decision path for audit.

### 3. Least-Privilege Tool Use
Only invoke a tool when the rule **explicitly requires** it.

### 4. Traceability
Every routing decision emits a provenance object:
```json
{
  "trigger": "rule-id",
  "layer": "AKCS|Infra-Ops|C-Ops|LocalDirect",
  "tool": "proto-query|infra-enforcer|local-read|none",
  "flags": {},
  "timestamp": "2025-11-15T...",
  "reason": "short explanation"
}
```

### 5. Idempotent
Repeated identical queries should route identically unless caches or routing table change.

---

## 📚 Layers & Short Names

| Layer | Purpose | Examples |
|-------|---------|----------|
| **C-Ops** | Cognitive execution / high-level reasoning | Planning, synthesis, trade-off analysis |
| **Infra-Ops** | Protocol rules, enforcement, infra-level guarantees | Policy validation, compliance checks |
| **AKCS** | Knowledge caches (7 domains) | Enhancement registry, protocol cache, service map |
| **Proto-Query** | Unified search across AKCS (`proto-knowledge-query`) | Cross-domain queries, graph traversal |
| **LocalDirect** | Local repo/files (code, fixtures) direct read | Source code, git artifacts, specific files |

---

## ⚖️ Priority Hierarchy

When multiple layers match, prefer the **highest-priority** layer (lower number = higher priority):

1. **Infra-Ops** (protocol & enforcement) - Security and compliance first
2. **AKCS / Proto-Query** (knowledge retrieval) - Facts feed reasoning
3. **LocalDirect** (read-only repo artifacts) - Code is authoritative
4. **C-Ops** (freeform reasoning / synthesis) - Reasoning uses above layers

**Rationale**: Protocol rules and infra constraints must not be violated by reasoning; knowledge retrieval should feed reasoning; local artifacts are authoritative for code-level detail.

---

## 🏷️ Semantic Flag Contracts

These flags are **declarative** - they change tool behavior but **do not** change routing decisions.

| Flag | Meaning | Default | Example |
|------|---------|---------|---------|
| `--comprehensive` | Graph traversal across `related_*` fields | Off | Returns nodes + edges |
| `--depth` | Limits traversal depth | 2 | `--depth=3` |
| `--keyword` | Exact/primary-key lookup (O(1)) | Off | Fast exact match |
| `--format` | Output shape | table | `json\|table\|compact\|graph` |
| `--limit` | Result cap per domain | Unlimited | `--limit=10` |
| `--source` | Restrict to AKCS domains | All | `--source=protocols,services` |
| `--provenance` | Include routing metadata | Off | Shows decision path |

---

## 🔀 Deterministic Routing Rules

**Evaluation Order**: Top-to-bottom. First match wins.

---

### Rule 1 - Protocol Enforcement (Infra-Ops)

**Match Conditions**:
- Query contains: `policy`, `enforce`, `compliance`, `authZ`, `authN`, `rollout`, `circuit-breaker`, `service-level`
- OR explicitly asks: "what are the protocol steps"

**Action**:
1. Invoke **Infra-Ops** layer
2. Return protocol doc or enforcement verdict
3. If Infra-Ops needs knowledge → call **Proto-Query** as sub-step with `--keyword` restricted to `protocols` domain

**Flags**: `--provenance` recommended

**Examples**:
- "Is it allowed to bypass feature flag X in canary?" → Infra-Ops policy check
- "What are the compliance steps for authentication?" → Protocol retrieval

---

### Rule 2 - Immediate Code/Config Lookup (LocalDirect)

**Match Conditions**:
- Query asks for specific file, commit, line, or artifact
- Patterns: `file:`, `path:`, `show me <filename>`, `where is <function>`
- Also: `build`, `ci`, `npm run`, `stack trace` when path/stack provided

**Action**:
1. Read from **LocalDirect** (repo)
2. Return snippet or error if not found
3. If file references AKCS IDs → Consider **Proto-Query** lookup as sub-step

**Examples**:
- "Show me src/services/auth/index.js where the token is parsed" → Direct file read
- "What's in package.json?" → Direct read

---

### Rule 3 - Knowledge Retrieval (AKCS / Proto-Query)

**Match Conditions**:
- Query asks for domain knowledge: `how`, `what`, `guidance`, `enhancement`, `service`, `component`, `architecture`, `css`, `testing`, `example`, `reference`
- OR user explicitly prefixes `proto-query` or `proto-knowledge-query`

**Action**:
1. Call **proto-query** with appropriate flags
2. Default: `proto-query "<query>" --format=json --limit=10`
3. If query contains relationship words → add `--comprehensive`

**Flag Mapping**:
| Query Contains | Add Flag |
|----------------|----------|
| `impact`, `affects`, `break` | `--comprehensive --depth=2` |
| `exact`, `id:` | `--keyword` |
| domain name | `--source=<domain>` |

**Examples**:
- "What services are affected if we change authentication?" → proto-query --comprehensive
- "How does theme validation work?" → proto-query "theme validation"
- "Show me all protocols" → proto-query --source=protocols

---

### Rule 4 - Architectural Reasoning (C-Ops + AKCS)

**Match Conditions**:
- Query asks for multi-step design decisions, trade-offs, prioritizations, or synthesis
- Keywords: "should we", "tradeoff", "recommendation", "best approach"

**Action**:
1. Run short proto-query probe: `proto-query "<query>" --limit=5 --format=compact --provenance`
2. Pass results to **C-Ops** for reasoning
3. **C-Ops** must annotate final answer with provenance
4. List which AKCS entries influenced each claim

**Examples**:
- "Should we refactor TaskCreation or create a new component?" → Proto-query facts + C-Ops reasoning
- "What's the tradeoff between approach A and B?" → Knowledge + analysis

---

### Rule 5 - Execution / Actionable Tasks (C-Ops + Infra-Ops)

**Match Conditions**:
- Query asks to perform or schedule actions
- Keywords: "create task", "deploy", "run tests", "apply patch", "commit", "push"

**Action**:
1. Confirm user intent (unless pre-approved automation policy exists)
2. Use **Infra-Ops** to validate policy
3. **C-Ops** prepares steps
4. If action requires knowledge → call **Proto-Query** as sub-step

**Examples**:
- "Run the screenshot tests" → Validate policy + execute
- "Create an enhancement for this feature" → Check governance + create

---

### Rule 6 - Default / Direct Answer (C-Ops)

**Match Conditions**:
- Nothing above matched

**Action**:
1. Provide normal C-Ops response
2. Add note: "No infra or cache rule matched — answered from C-Ops"
3. If appropriate, suggest `proto-query` for deeper facts

**Examples**:
- "How do I debug React hooks?" → General knowledge answer
- "What's a good approach for error handling?" → C-Ops reasoning

---

## 🔍 Provenance & Logging

All routed responses **must include** a `provenance` object when:
- `--provenance` flag present
- OR by default for infra actions

**Provenance Format**:
```json
{
  "trigger": "rule-3-knowledge-retrieval",
  "layer": "AKCS",
  "tool": "proto-query",
  "flags": {
    "format": "json",
    "limit": 10
  },
  "timestamp": "2025-11-15T12:34:56Z",
  "note": "Cross-domain knowledge query for authentication impact"
}
```

**Audit Log**:
- Write one-line entry to `/.logs/claude-routing.log`
- Include unique ID for traceability

---

## 🛡️ Fallbacks & Error Modes

### Tool Unavailable
If `proto-query` or Infra-Ops is down:
- **Do not** call it
- Respond from C-Ops with clearly marked disclaimer
- Include `suggested_local_actions` (e.g., "run `npm run proto-query:stats` locally")

### No Match in AKCS
Return:
- Empty AKCS result
- C-Ops summary: "I found no AKCS entries; here is best-effort reasoning"

### Contradictory Answers from Multiple Caches
Prefer entries by:
1. `last_updated` timestamp (most recent wins)
2. `domain_weight`: Infra > Architecture > Services > Components > CSS > Testing > Enhancements

Log the conflict for review.

---

## 🚨 Safe-guards & Anti-Hallucination Patterns

### 1. Citation Requirement
Any factual claim traceable to a cache entry **must include** the entry ID(s).

**Example**:
> "According to ENH-UI-033 and PROTO-015, theme validation uses..."

### 2. No Protocol Fabrication
If Infra-Ops would be required but **no protocol entry exists**:
- Refuse to assert a protocol
- Mark as `needs_infra_authoring`

### 3. Limit Chain-of-Thought Exposure
- Don't include internal chain-of-thought
- Only include final reasoning + explicit citations/provenance

---

## 📋 Examples (Canonical)

### Example 1: Impact Analysis
**User**: "What services are affected if we change authentication?"

**Routing**:
- Matches **Rule 3** (Knowledge Retrieval - contains "affected")
- Add `--comprehensive` flag (impact query)

**Execution**:
```bash
proto-query "authentication services" --comprehensive --depth=2
```

**Response**:
- Graph with nodes + edges
- C-Ops summary of impact
- Provenance: `{trigger: "rule-3", layer: "AKCS", tool: "proto-query", flags: {comprehensive: true, depth: 2}}`

---

### Example 2: File Lookup
**User**: "Show me src/services/auth/index.js where the token is parsed"

**Routing**:
- Matches **Rule 2** (LocalDirect - specific file path)

**Execution**:
- Direct file read with Read tool
- Return snippet with line numbers

**Response**:
- File content at relevant lines
- Provenance: `{trigger: "rule-2", layer: "LocalDirect", tool: "local-read"}`

---

### Example 3: Policy Check
**User**: "Is it allowed to bypass feature flag X in canary?"

**Routing**:
- Matches **Rule 1** (Infra-Ops - policy/authorization)

**Execution**:
```bash
proto-query "feature flag bypass policy" --source=protocols --keyword
```

**Response**:
- `allowed|denied` with policy ID reference
- Provenance: `{trigger: "rule-1", layer: "Infra-Ops", tool: "infra-enforcer"}`

---

### Example 4: Architectural Decision
**User**: "Should we refactor TaskCreation or create a new component?"

**Routing**:
- Matches **Rule 4** (Architectural Reasoning - "should we")

**Execution**:
1. `proto-query "TaskCreation component architecture" --limit=5 --format=compact --provenance`
2. C-Ops analyzes retrieved knowledge
3. Provides recommendation with citations

**Response**:
- Recommendation with trade-offs
- Citations to relevant enhancements/protocols
- Provenance: `{trigger: "rule-4", layer: "C-Ops+AKCS", tools: ["proto-query", "c-ops-reasoning"]}`

---

## 🔧 Implementation Checklist

**Infrastructure**:
- [ ] Add this file to `/docs/protocols/LAYER-ROUTING-RULES.md`
- [ ] Reference in CLAUDE.md under "Layer Routing" section
- [ ] Implement provenance logger
- [ ] Create `/.logs/claude-routing.log` with rotation

**Proto-Query Integration**:
- [x] Proto-query CLI operational (ENH-INFRA-055 Phase 1-2 complete)
- [ ] Add programmatic interface for sub-queries
- [ ] Flag validation and error handling

**LocalDirect Integration**:
- [ ] Hook LocalDirect reader with repo path index
- [ ] Implement file-index TTL for cache freshness

**Testing**:
- [ ] Unit tests for each rule (simulate inputs → assert tool invocation)
- [ ] Integration tests for multi-layer workflows
- [ ] Provenance validation tests

**Documentation**:
- [ ] Add examples to CLAUDE.md
- [ ] Update proto-query documentation with routing context
- [ ] Create troubleshooting guide for routing conflicts

---

## 📝 Change Log / Governance

**Change Authority**: This document is authoritative
**Change Requirements**: ENH-INFRA PR with reviewers:
- One from Infra-Ops team
- One from C-Ops team

**PR Tags**: `infra-routing` for immediate review

**Version History**:
- v1.0 (2025-11-15): Initial routing rules specification based on November 13 architecture

---

## 🔗 Related Documentation

- [ENH-INFRA-054: Infra-Ops Maturation](../enhancements/ENH-INFRA-054-INFRA-OPS-MATURATION-TRACKER.md)
- [ENH-INFRA-055: proto-knowledge-query](../enhancements/ENH-INFRA-055-PROTO-KNOWLEDGE-QUERY-UNIFIED-INTERFACE.md)
- [CLAUDE.md](../../CLAUDE.md) - C-Ops framework definition
- [Infra-Ops Layer Architecture](../infrastructure/INFRA-OPS-LAYER.md)

---

*End of Layer Routing Rules (LRR-001)*
