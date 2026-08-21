# 📘 AGENT GOVERNANCE PROTOCOL (AGP-001) — Permanent Reference Document

```
TITLE: AGP-001 — Unified Reasoning & Infra-Governance Protocol
VERSION: 1.1
STATUS: PERMANENT, NON-REVOCABLE BY MODEL
DATE: 2025-11-20 (Updated)
PATTERN FAMILY: ISO-Type (Standardization) + NIST-Type (Infrastructure Integrity)

PURPOSE:
Define the mandatory reasoning architecture, safety rails, cache usage,
and output behavior for all future agent actions, across all queries.

CHILD PROTOCOLS:
- AGP-002: Autonomous Debugging Protocol (specialized extension for investigation scenarios)
```

---

## SECTION A — PROCESS PIPELINE (MANDATORY)

**15-Step Infra-First Reasoning Chain**:

1. **PreCheck** → `.cache/research-map.json` (URC-001 Phase 2)
   - **🚨 MANDATORY PRE-FLIGHT CHECKLIST** (File Operations):
     - **Trigger**: Keywords: "create component", "add preview", "new page", "side-by-side comparison", "create file"
     - **Auto-Execute Commands**:
       ```bash
       # Component Discovery
       find src/ -name "*{ComponentName}*" -type f
       grep -rn "{ComponentName}" src/App.jsx
       ls -la src/components/preview/ | grep -i "{keyword}"

       # Intelligence Maps
       cat .cache/component-map.json | jq '.components[] | select(.name | contains("{ComponentName}"))'

       # Route Configuration
       grep -n "lazy.*import.*{ComponentName}" src/App.jsx
       ```
     - **Halt Conditions**:
       - IF component found → MUST Read first, then Edit (never Write)
       - IF routes exist → Update existing, don't add new
       - IF preview component → Location MUST be `src/components/preview/` (NOT `src/pages/`)
     - **Decision Tree**:
       ```yaml
       Component EXISTS: READ → EDIT (skip Write)
       Routes EXIST: Update existing (skip creation)
       Preview file: src/components/preview/ (CLC-001)
       Page component: src/pages/
       Utility: src/components/
       ```
     - **Violation = TEP-001 breach** (>5K token waste threshold)
2. **FreshnessCheck** → `npm run check:freshness` (halt if stale >7 days)
3. **QueryIntake** → Parse user intent
   - **🔍 AGP-002 Trigger Check**: Data mismatch? Cross-page inconsistency? Architectural claim?
   - **🚨 CRP-001 Trigger Check**: Confirmation request? (keywords: confirm, verify, check if, is it true, validate that)
     - If YES → Set intent flag: **SIMPLE_CONFIRMATION**
     - Expected response: ≤200 tokens
     - Write tool: PROHIBITED
4. **AATP-001 Gate** → No autonomous agent launches without approval
5. **Intent→Domain** → `proto-query` with domain flags (LRR-001)
   - **🚨 CRP-001 Routing**: If intent=SIMPLE_CONFIRMATION → Route to LocalDirect (existing docs)
     - Response format: ✅/❌ + 1-2 line evidence + source reference
     - Token budget: ≤200 tokens STRICT
     - Escalation offer: "Need details? (Y/N)"
     - HALT if response >200 tokens → ask user approval first
6. **ComponentScan** → `component-map.json` + `context-map.json` (O(1) lookup)
   - **Structural**: `component-map.json` (imports, dependencies, consumers)
   - **Semantic**: `context-map.json` (concepts, keywords, relationships) ← AKCS L1 cache
   - **🔍 AGP-002 Integration**: If investigation triggered, escalation level determined here
7. **DomainCacheRouting** → CSS/layout=`.cache/diagnostic-map.json` + `style-map.json`, DB=`firestore-map.json`
   - **CSS/Layout**: `diagnostic-map.json` (component-specific diagnostics) + `style-map.json` (class usage tracking)
8. **RelationshipScan** → `function-map.json` + `module-map.json` call graphs
   - **Function-level**: `function-map.json` (function calls, exports, unused)
   - **Module-level**: `module-map.json` (module dependencies, import graph) ← AKCS Phase 1
   - **🔍 AGP-002 Integration**: Cross-layer/cross-module comparison if Level 2/3 investigation
9. **ImpactScan** → `npm run impact <file>` (🔴🟡🟢⚪ risk tiers)
10. **FeatureCacheScan** → `knowledge-graph.json` + `service-map.json`
11. **InfraRulesScan** → `protocol-map.json` + `architectural-invariants.jsonl` governance
    - **Protocols**: `protocol-map.json` (protocol documentation, enforcement rules)
    - **Architectural Rules**: `architectural-invariants.jsonl` (ARCH-INV-001 to 004, bug prevention) ← Phase 5
    - **🎨 DHCP-001 Auto-Triggers**:
      - Keywords: `className`, `utility class`, `Tailwind` → Load DHCP-001 Phase 1+2
      - CSS file edit detected → Load DHCP-001 CSS Edit Self-Check Protocol
      - Repeated utilities (5+ uses) → Load DHCP-001 Phase 2 consolidation framework
      - New component creation → Verify DHCP-001 Phase 1 semantic token compliance
12. **OverrideScan** → `enhancement-registry-map.json`
13. **Synthesis** → TEP-001 minimal-mode (inline, no intermediate docs)
    - **🔍 AGP-002 Extension**: If debugging scenario, use root cause table + hypothesis elimination format
    - **🔍 ACVP-001 Enforcement**: If architectural claims detected, verify from code before confirming
    - **🚨 CRP-001 Enforcement**: If intent=SIMPLE_CONFIRMATION, enforce ≤200 token limit STRICTLY
14. **CitationCheck** → All findings must cite real cache/map entries
    - **🔍 AGP-002 Requirement**: Evidence must include file:line references + code snippets
    - **🚨 CRP-001 Verification**: If intent=SIMPLE_CONFIRMATION, verify no Write operations executed
15. **SelfImprove** → Cache only if CDF-001 ≥ 8/12

**Pipeline Enhancement Note**:
When AGP-002 triggers (Steps 3, 6-9, 13-14), the investigation follows specialized debugging procedures
while maintaining AGP-001's core pipeline, token economy, and governance rules. See AGP-002 for
progressive escalation (L1→L2→L3→L4), ACVP-001 verification, and approval gate requirements.

---

## SECTION B — OUTPUT STANDARD (MANDATORY)

**Standard Compact Format** (general queries):

```
SOURCE | LAYER | DECISION | OVERRIDE? | USER_ACTION | ADMIN_ACTION | IMPROVED_WITH
```

**Field Definitions**:
- **SOURCE**: Cache file or map used (e.g., `function-map.json:validateAssignment`)
- **LAYER**: System layer (UI/Context/Service/Infra/DB)
- **DECISION**: Gatekeeper logic or result
- **OVERRIDE?**: Feature flag or bypass available (yes/no)
- **USER_ACTION**: What user can do now
- **ADMIN_ACTION**: What admin can configure
- **IMPROVED_WITH**: Which infra tool provides better answer

**AGP-002 Extended Format** (debugging investigations):

When AGP-002 triggers, extend output with:

1. **Root Cause Table**:
```
| Layer | File | Symptom | Root Cause | Evidence |
```

2. **Hypothesis Elimination**:
```
❌ Hypothesis 1: [tested and ruled out]
✅ Hypothesis 2: [confirmed with evidence]
```

3. **Proposed Patch** (if applicable):
```
File: [path]
Before: [code]
After: [code]
Rationale: [explanation]
```

4. **Approval Gate**:
```
Reply with: "Apply Option 1" / "Modify: X" / "Cancel"
```

See AGP-002 Section 7 for complete output requirements.

---

## SECTION C — TOKEN ECONOMY (MANDATORY)

**Active Protocols**:
- **AATP-001**: No autonomous agent launches
- **TEP-001**: No duplicate documentation, max efficiency

**Output Constraints**:
- Max 10 lines for synthesis
- No UI mockups
- No prose narration
- No long explanations unless explicitly requested

---

## SECTION D — GOVERNANCE HARD RULES (MANDATORY)

**Forbidden Actions**:
- ❌ Hallucination: Citations must reference real map/cache entries
- ❌ Auto-launch: No agent launches without user approval (AATP-001)
- ❌ Non-infra reasoning: Use pipeline, not ad-hoc analysis
- ❌ Descriptive bloat: No explanations unless asked
- ❌ Pipeline drift: Validate each step before next
- ❌ **Reactive parroting**: Never echo architectural claims without verification (ACVP-001)
- ❌ **Code modification without approval**: Must present patch and wait for explicit approval

**Required Behaviors**:
- ✅ Cache-first: Check `.cache/research-map.json` before investigation
- ✅ Freshness: Verify maps <7 days old
- ✅ Impact-aware: Check risk tiers before refactor suggestions
- ✅ Grounded: All claims cite actual cache/map entries
- ✅ **Architectural verification**: When user states facts, verify from code (ACVP-001)
- ✅ **Evidence collection**: Include file:line references + code snippets (AGP-002)
- ✅ **Progressive escalation**: Start minimal, expand only if needed (AGP-002 L1→L4)
- ✅ **Design compliance**: Check DHCP-001 before CSS edits or className suggestions (ARCH-INV-004)

**DPP-001 Documentation Preservation Rule**:
- When modifying project documentation (e.g., CLAUDE.md, ARCHITECTURE.md, INFRA-OPS-LAYER.md), the agent must:
  1. Classify content as: `architecture | navigation | operational protocol | verbose enforcement`
  2. NEVER remove architecture or navigation content
  3. ONLY remove procedural or enforcement content duplicated by AGP-001
  4. ALWAYS request confirmation before deleting more than 10 lines
  5. If classification is uncertain → halt with "DPP-001 UNCERTAIN" and ask the user

---

## SECTION E — SELF-TEST HOOKS (MANDATORY)

**Pre-Answer Validation Checklist**:

```yaml
before_synthesis:
  1_pipeline_integrity: "Steps 1-15 executed in order?"
  2_freshness: "Maps verified <7 days old?"
  3_token_economy: "Output ≤10 lines, no bloat (unless AGP-002 debugging format)?"
  4_governance_rules: "Section D compliance verified?"
  5_agp002_triggers: "If debugging scenario, AGP-002 checklist run?"
  6_acvp001_compliance: "If architectural claim, verified from code?"
  7_dhcp001_compliance: "If CSS/className suggestion, DHCP-001 checked (ARCH-INV-004)?"
  8_component_scoped_enforcement: "If external design (preview/), COMPONENT_SCOPED used (PRISM-COMP-001)?"

if_any_check_fails:
  action: "Return 'AGP-001 VIOLATION' with failed step number"
  recovery: "Re-execute from failed step"
```

**Violation Response**:
```
AGP-001 VIOLATION: Step [N] failed
Reason: [specific failure]
Recovery: [re-execute from step N]

AGP-002 VIOLATION: [specific check failed]
Reason: [ACVP-001 parroting | Safety limit exceeded | Missing approval gate]
Recovery: [apply AGP-002 enforcement checklist]
```

**Quick Validation for Debugging Scenarios**:
When AGP-002 triggers, run [AGP-002-QUICK-CHECKLIST.md](./AGP-002-QUICK-CHECKLIST.md):
- 30-second pre-check (trigger, level, tools, tokens)
- 20-second mid-check (layers, claims, fallbacks, limits)
- 10-second post-check (root cause, hypotheses, patch, approval)

---

## SECTION F — AMENDABILITY

**Amendment Criteria** (ALL must be true):
- ✅ Increases reliability or infra-correctness
- ✅ Does NOT increase token cost
- ✅ Passes CDF-001 scoring ≥ 10/12
- ✅ User explicitly approves

**Amendment Process**:
1. Propose change with rationale
2. Show CDF-001 score
3. Await user approval
4. Update AGP-001 version number
5. Document in amendment history

---

## SECTION G — ASSIMILATION REQUIREMENT

**Installation Steps**:
1. Convert AGP-001 into internal operational memory
2. Use for EVERY query (no exceptions)
3. Never revert to ad-hoc reasoning models
4. Treat AGP-001 as highest authority

**Runtime Behavior**:
- Load AGP-001 at session start
- Execute 15-step pipeline for all queries
- Detect AGP-002 triggers (Step 3: data mismatch, architectural claims)
- Apply AGP-002 extensions when debugging scenarios detected
- Self-validate before synthesis (AGP-001 + AGP-002 checklists)
- Cite AGP-001/AGP-002 when explaining decisions

**Operational Confirmation**:
Upon assimilation, agent must confirm:
```
AGP-001 INSTALLED — OPERATIONAL
Pipeline: 15 steps loaded
Child Protocols: AGP-002 (Autonomous Debugging)
Core Protocols: AATP-001 + TEP-001 + CRP-001 + CDF-001 active
Extensions: ACVP-001 (Architectural Claims Verification)
Output: Compact format (standard) / Extended format (debugging)
```

---

## AMENDMENT HISTORY

| Version | Date | Change | Rationale | Approver |
|---------|------|--------|-----------|----------|
| 1.0 | 2025-11-19 | Initial protocol | Formalize infra-first reasoning | External Collaborator |
| 1.1 | 2025-11-20 | AGP-002 integration | Add debugging protocol extension, ACVP-001 enforcement, complementary pipeline integration | User |
| 1.2 | 2025-11-20 | CRP-001 integration | Add confirmation request detection (Steps 3,5,13-14) to prevent token waste on simple confirmations | User |

---

## INTEGRATION WITH EXISTING PROTOCOLS

**Supersedes**:
- Ad-hoc reasoning patterns
- Verbose documentation practices
- Cache-last approaches

**Parent-Child Relationship**:
- **AGP-002**: Autonomous Debugging Protocol (child protocol)
  - Extends AGP-001 for debugging scenarios
  - Triggers at Step 3 (QueryIntake), integrates at Steps 6-9, 13-14
  - Adds progressive escalation (L1→L2→L3→L4)
  - Adds ACVP-001 architectural claims verification
  - Maintains AGP-001 pipeline, token economy, and governance rules
  - See: [AGP-002-AUTONOMOUS-DEBUGGING-PROTOCOL.md](./AGP-002-AUTONOMOUS-DEBUGGING-PROTOCOL.md)
  - Enforcement: [AGP-002-ENFORCEMENT-CHECKLIST.md](./AGP-002-ENFORCEMENT-CHECKLIST.md)
  - Quick Check: [AGP-002-QUICK-CHECKLIST.md](./AGP-002-QUICK-CHECKLIST.md)

**Integrates With (Peer Protocols)**:
- **AATP-001**: Anti-Agent-Trigger Protocol (mandatory gate at step 4)
- **TEP-001**: Token Efficiency Protocol (output constraints)
- **CRP-001**: Confirmation Request Protocol (step 3 trigger check, step 5 routing, step 13-14 enforcement) ⚡ **NEW**
- **CDF-001**: Cache Decision Framework (step 15 filter)
- **URC-001**: Universal Research Cache Protocol (step 1 precheck)
- **LRR-001**: Layer Routing Rules (step 5 domain mapping)
- **BVP-001**: Build Verification Protocol (post-change validation)
- **QMP-001**: Query Memoization Protocol (Firestore query safety)
- **CDPP-001**: Circular Dependency Prevention Protocol (service layer safety)
- **PFDD-001**: Production-First Development Protocol (fix scope decisions)
- **DHCP-001**: Design Harmonization & CSS Protocol (step 11 UI compliance, ARCH-INV-004 enforcement) ⚡ **NEW**
- **PRISM-COMP-001**: PRISM Pipeline Comparison Protocol (COMPONENT_SCOPED mandatory for external designs, step 13 enforcement) ⚡ **NEW**

**Governance Linkage**:
- Pattern Family: ISO-Type (standardization) + NIST-Type (infrastructure)
- Central Brain Compatible: v1.0.3+
- Repository Class: WEBAPP_FIREBASE

---

**END OF AGP-001**

**Status**: ✅ PERMANENT REFERENCE DOCUMENT
**Authority**: Highest (supersedes all ad-hoc instructions)
**Enforcement**: Self-test hooks (Section E)
**Compliance**: Mandatory for all agent operations
