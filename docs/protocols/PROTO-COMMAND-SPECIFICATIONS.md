# 🚀 Proto-Command Specifications

**Status**: Production Active
**Last Updated**: 2025-11-06
**Parent Document**: [CLAUDE.md](../../CLAUDE.md)
**Complete Manual**: [PROTO-GOVERNANCE-COMPLETE-MANUAL.md](./PROTO-GOVERNANCE-COMPLETE-MANUAL.md)

---

## 🎯 Natural Language Governance Layer

**Any prompt beginning with `proto-` activates comprehensive governance intelligence mode.**

---

## 📋 Core Proto Domains

### **Quick Reference Table**

| Proto Domain | Purpose | Use Case |
|--------------|---------|----------|
| `proto_theme` | UI themes, visual consistency, accessibility compliance | Theme system work |
| `proto_modal` | Modal components, interaction patterns, accessibility | Modal development |
| `proto_automation` | Safe refactoring, AST transformations, rollback capability | Automation scripts |
| `proto_crisis` | Emergency procedures, damage control, recovery protocols | Crisis management |
| `proto_rollout` | Production readiness, deployment validation, testing | Deployment prep |
| `proto_document` | Documentation completeness, dependency validation | Doc creation |
| `proto_diagnose` | System integrity, health checks, conflict detection | System diagnostics |
| `proto_safe` | Risk mitigation, safe operation constraints | Safe operations |
| `proto_workspace` | File architecture, dependencies, system organization | Workspace analysis |
| `proto_impact` | Change impact analysis, file safety assessment | Impact assessment |
| `proto_accessibility` | WCAG compliance, screen reader support, keyboard navigation | Accessibility work |
| `proto_ui_chain` | Implementation chain tracking, suggestion→review→correction | UI implementation |
| `proto_discover` | System discovery protocol, existing capability audit | Discovery checks |
| `proto_system_discovery` | Structured system discovery with decision flow | Enhancement search |
| `proto_plan` | Agent control, cache-first review mode | Planning mode |
| `proto_export_context` | Export findings to research cache | Cache export |

---

## 🛠️ Proto-System-Discovery Command

### **Command Syntax**
```bash
proto-system-discovery <query>
```

### **Purpose**
Perform structured system discovery check before suggesting new enhancements, docs, or solutions.

### **Execution Steps**

1. **Enhancement Registry Search**
   - Search `ENHANCEMENT-MASTER-REGISTRY.md` for matches to `<query>`
   - Check all 136+ enhancements

2. **Cluster Document Search**
   - `UI-QUALITY-ENHANCEMENT-CLUSTER.md` for UI/UX work
   - `GOVERNANCE-ENHANCEMENT-CLUSTER.md` for process improvements
   - `INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md` for automation/tooling

3. **Enhancement ID Search**
   - Search for related `ENH-XXX` enhancement IDs

4. **Documentation Search**
   - Check 579+ existing docs for overlapping solutions

### **Output Format**

```yaml
discovery_results:
  exact_matches:
    - "ENH-UI-012: TaskCreationPage UX Enhancement"
    - "ENH-INFRA-035: Repository Knowledge Structure Enhancement"

  partial_matches:
    - "ENH-UI-014: TaskCreationPage Accessibility Crisis"
    - "ENH-INFRA-043: Universal Research Knowledge Cache"

  related_docs:
    - "docs/architecture/PROFILE-PROJECT-ASSIGNMENT-ARCHITECTURE.md"
    - "docs/protocols/PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md"

  no_matches: "Confirmed - no existing solutions found for [specific query]"

recommended_action:
  type: "update|extend|create_new"
  target: "ENH-UI-012|existing_doc_path|new_enhancement"
  rationale: "Clear explanation of why this action path was chosen"
```

### **Integration Points**

- **Auto-triggered**: Before suggestions in governed domains (UI, architecture, automation, documentation)
- **Links to**: `proto-updateEnhancement` and `proto-addEnhancement` commands
- **Enforces transparency**: Shows discovery results to user
- **Prevents duplication**: Through systematic existing system verification

### **Compliance**
Discovery results must be surfaced transparently. Any suggestion without discovery proof is protocol violation.

**Reference**: [SYSTEM-DISCOVERY-PROTOCOL.md](./SYSTEM-DISCOVERY-PROTOCOL.md)

---

## 📝 Research Cache Write Protocol

### **Command Integration**
Part of `proto_export_context` workflow

### **Purpose**
Eliminate multi-read inefficiency, enable deterministic cache updates

### **Required Steps**

```yaml
research_cache_write_protocol:
  schema_reference: ".cache/research-map.schema.json"

  required_steps:
    step_1_read_schema: "Read .cache/research-map.schema.json ONCE for structure model"
    step_2_read_cache: "Read .cache/research-map.json ONCE for current entries + index"
    step_2a_reconcile_structure: "CRITICAL: Preserve ALL existing sessions"
    step_3_check_index: "Use index object for instant duplicate detection (O(1) lookup)"
    step_4_validate: "Validate new entry against schema before write"
    step_4a_validate_count: "CRITICAL: Compare total_sessions before/after"
    step_5_write: "Single Write operation (append or overwrite targeted entry)"
```

### **Append Logic**

**Check Duplicate**:
- Method: Lookup topic in `cache.index` object
- If found: Compare confidence scores (new vs existing)

**If Duplicate Found**:
- Compare confidence: `new_confidence` vs `existing_confidence`
- If new higher: Overwrite existing entry at index[topic] location
- If existing higher: Skip write, notify user (existing entry better)

**If No Duplicate**:
- Generate ID: Format `{category}-{topic-slug}-{next-number}`
- Append entry: Add to `sessions.{category}.{entry_id}`
- Update index: Add mapping: `topic → entry_id`
- Update metadata: Increment `total_sessions`, update `last_updated`

### **Transparency Requirements**

- Announce action: "Added/Updated/Skipped with clear reasoning"
- Show entry ID: Display assigned entry ID (e.g., `research-auth-013`)
- Show confidence: Display confidence score for transparency
- Confirm success: "✅ Cache updated successfully" message

### **Prohibited Operations**

- ❌ Multiple redundant Reads (only 2 allowed: schema + cache)
- ❌ Full file reconstruction (use schema as write model)
- ❌ Broad updates across multiple entries (targeted write only)
- ❌ Writing without schema validation (data corruption risk)

### **Performance Target**

- File operations: 2 Reads (schema + cache) + 1 Write (update)
- Token efficiency: 90% reduction vs multi-read pattern
- Execution time: <2 seconds from command to confirmation

**Reference**: [UNIVERSAL-RESEARCH-CACHE-PROTOCOL.md](./UNIVERSAL-RESEARCH-CACHE-PROTOCOL.md)

---

## 🔄 Proto-Export-Context Command

### **Command Syntax**
```bash
#cache-export topic:"<topic>" confidence:<float>
```

### **Description**
Export structured findings from current conversation to research cache

### **Trigger**
User command (ANTI-AGENT-TRIGGER compliant - user-triggered only)

### **Execution Flow**

1. **Analyze Runtime**: Review responses in current conversation (runtime context)
2. **Extract Findings**: Identify research/diagnostic findings, files touched, enhancements referenced
3. **Structure Data**: Create JSON matching `.cache/research-map.schema.json`
4. **Validate Preservation**: CRITICAL - Count existing sessions before write
5. **Write Cache**: Use Write tool to update `.cache/research-map.json` (MUST preserve ALL existing sessions)
6. **Confirm**: Show user what was cached with topic, confidence, entry ID

### **Schema Reference**
`.cache/research-map.schema.json`

### **Write Protocol**
Uses `research_cache_write_protocol` (see above)

### **Prohibited Actions**

- ❌ Don't read JSONL session files (use runtime context)
- ❌ Don't launch agents to analyze (ANTI-AGENT-TRIGGER violation)
- ❌ Don't write to intermediate files (direct to cache)
- ❌ Multiple redundant Reads (schema + cache = 2 reads max)

---

## 🛡️ Proto-Plan Command

### **Description**
Forbids internal planning or background agents unless explicitly authorized

### **Enforcement**
If `proto_plan` auto-triggers, redirect to cache-first review mode

### **Override Check**
Check ANTI-AGENT-TRIGGER status before any agent consideration

### **Cache Check**
Mandatory `.cache/*` verification before suggesting research/discovery

**Reference**: [CLAUDE.md](../../CLAUDE.md) ANTI-AGENT-TRIGGER PROTOCOL

---

## 🛡️ Protocolization Reflex

### **Trigger**
`#protocolize` - Converts recurring issues into permanent enforced protocols

### **Auto-Generation Pipeline**

**Input Format**:
```yaml
trigger: "#protocolize"
issue_name: "[ISSUE]"
problem: "[describe repeating pain]"
context: "[framework/domain]"
desired_guardrails: "[docs | lint | checklist | CLAUDE.md enforcement]"
```

**Output Generation**:
```yaml
protocol_doc: "docs/protocols/[ISSUE]-PROTOCOL.md"
safety_checklist: "docs/development-guidelines/[ISSUE]-CHECKLIST.md"
automation_stub: ".rules/[ISSUE].js"
claude_enforcement: "🔥 BEFORE any [trigger] → MANDATORY: [ISSUE] Protocol"
```

### **Purpose**
Capture recurring pain points and lock them into permanent guardrails

### **Scope**
Framework-agnostic (Firebase, CI/CD, GraphQL, Docker, any recurring issue)

### **Template**
[PROTOCOL-TEMPLATE.md](../templates/PROTOCOL-TEMPLATE.md) - Consistent structure for all protocol docs

---

## 📊 Proto Domain Details

### **Proto Theme**
**Focus**: UI themes, visual consistency, accessibility compliance
**Use Cases**: Theme system architecture, color token management, theme switching
**Related Enhancements**: ENH-UI-005 through ENH-UI-010 (theme system work)

### **Proto Modal**
**Focus**: Modal components, interaction patterns, accessibility
**Use Cases**: Modal development, focus management, keyboard navigation
**Related Protocols**: Accessibility compliance, component safety

### **Proto Automation**
**Focus**: Safe refactoring, AST transformations, rollback capability
**Use Cases**: Code transformation scripts, batch updates, safe automation
**Related Protocols**: [SAFE-AUTOMATION-PROTOCOL.md](./SAFE-AUTOMATION-PROTOCOL.md)

### **Proto Crisis**
**Focus**: Emergency procedures, damage control, recovery protocols
**Use Cases**: Production incidents, critical bugs, rollback scenarios
**Related Systems**: Git workflow, rollback automation

### **Proto Rollout**
**Focus**: Production readiness, deployment validation, testing
**Use Cases**: Pre-deployment checks, release validation, production gates
**Related Protocols**: [PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md](./PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md)

### **Proto Document**
**Focus**: Documentation completeness, dependency validation
**Use Cases**: Documentation creation, enhancement tracking, protocol writing
**Related Systems**: Enhancement registry, documentation system

### **Proto Diagnose**
**Focus**: System integrity, health checks, conflict detection
**Use Cases**: System audits, health checks, diagnostic analysis
**Related Protocols**: [UNIVERSAL-DOM-GEOMETRY-DIAGNOSTICS-PROTOCOL.md](./UNIVERSAL-DOM-GEOMETRY-DIAGNOSTICS-PROTOCOL.md)

### **Proto Safe**
**Focus**: Risk mitigation, safe operation constraints
**Use Cases**: Risk assessment, safe operation modes, constraint enforcement
**Related Protocols**: Multiple safety protocols

### **Proto Workspace**
**Focus**: File architecture, dependencies, system organization
**Use Cases**: Workspace analysis, dependency mapping, file organization
**Related Tools**: Workspace intelligence suite

### **Proto Impact**
**Focus**: Change impact analysis, file safety assessment
**Use Cases**: Pre-change impact analysis, file dependency analysis
**Related Tools**: Impact analysis tools

### **Proto Accessibility**
**Focus**: WCAG compliance, screen reader support, keyboard navigation
**Use Cases**: Accessibility audits, WCAG compliance checks, A11y fixes
**Related Enhancements**: ENH-UI-014 (TaskCreation accessibility)

### **Proto UI Chain**
**Focus**: Implementation chain tracking, suggestion→review→correction transparency
**Use Cases**: UI implementation workflows, change tracking, transparency
**Related Systems**: Agentic UI system

### **Proto Discover**
**Focus**: System discovery protocol, existing capability audit, anti-duplication enforcement
**Use Cases**: Pre-implementation discovery, capability audit
**Related Protocols**: [SYSTEM-DISCOVERY-PROTOCOL.md](./SYSTEM-DISCOVERY-PROTOCOL.md)

---

## 🔗 Related Documentation

### **Core Documentation**
- **[CLAUDE.md](../../CLAUDE.md)** - Main project navigation hub
- **[PROTO-GOVERNANCE-COMPLETE-MANUAL.md](./PROTO-GOVERNANCE-COMPLETE-MANUAL.md)** - Complete governance guide
- **[PROTO-GOVERNANCE-INTELLIGENCE-SYSTEM.md](./PROTO-GOVERNANCE-INTELLIGENCE-SYSTEM.md)** - Intelligence system details

### **Discovery & Enhancement**
- **[SYSTEM-DISCOVERY-PROTOCOL.md](./SYSTEM-DISCOVERY-PROTOCOL.md)** - System discovery protocol
- **[ENHANCEMENT-MASTER-REGISTRY.md](../../ENHANCEMENT-MASTER-REGISTRY.md)** - Central enhancement registry
- **[auto-enforcement-rules.md](../claude-navigation/auto-enforcement-rules.md)** - All enforcement rules

### **Cache Systems**
- **[UNIVERSAL-RESEARCH-CACHE-PROTOCOL.md](./UNIVERSAL-RESEARCH-CACHE-PROTOCOL.md)** - Research cache protocol
- **[diagnostic-cache-quick-reference.md](../claude-navigation/diagnostic-cache-quick-reference.md)** - Diagnostic cache guide

### **Safety Protocols**
- **[SAFE-AUTOMATION-PROTOCOL.md](./SAFE-AUTOMATION-PROTOCOL.md)** - Safe automation
- **[PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md](./PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md)** - Production-first approach
- **[PROTOCOL-TEMPLATE.md](../templates/PROTOCOL-TEMPLATE.md)** - Protocol template

---

## 📈 Usage Statistics

**Total Proto Domains**: 16
**Most Used**: proto_system_discovery, proto_theme, proto_automation
**Integration Points**: 50+ enforcement rules, 136+ enhancements
**Token Efficiency**: 85-95% through cache-first patterns
