---
module: Protocols
purpose: Mandatory development protocols and safety guidelines for Task Dashboard
status: active
owner: Governance Team
total_protocols: 37
last_updated: 2025-11-04
tags: [protocols, governance, safety, guidelines, best-practices]
---

# Development Protocols

**Purpose**: Mandatory protocols and safety guidelines that govern Task Dashboard development

**Scope**: 37+ protocols covering safety, quality, performance, and governance

**Enforcement**: Auto-enforcement through CLAUDE.md triggers

---

## 🚨 Critical Safety Protocols (MANDATORY)

These protocols are **NON-NEGOTIABLE** and enforced automatically:

| Protocol | Trigger | Prevents |
|----------|---------|----------|
| [Production-First Development](./PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md) | ANY development suggestion | Over-engineering, premature optimization |
| [Query Memoization (QMP-001)](../development-guidelines/QUERY-MEMOIZATION-PROTOCOL.md) | ANY Firebase query | Infinite subscription loops (50+ min crises) |
| [Firebase Subscription Infinite Loop Prevention](./FIREBASE-SUBSCRIPTION-INFINITE-LOOP-PREVENTION.md) | ANY useFirestoreSubscription | Re-render loops, performance issues |
| [Circular Dependency Prevention](./CIRCULAR-DEPENDENCY-PREVENTION-PROTOCOL.md) | Service creation/modification | Import cycles, build failures |
| [Build Verification](./BUILD-VERIFICATION-PROTOCOL.md) | ANY file changes | Deployment breakage |
| [Safe Automation](./SAFE-AUTOMATION-PROTOCOL.md) | ANY automation script | Destructive operations, data loss |

---

## 🏗️ Architecture & Design Protocols

| Protocol | Purpose | Use When |
|----------|---------|----------|
| [Component Safety Analysis](./COMPONENT-SAFETY-ANALYSIS-PROTOCOL.md) | Impact analysis before component changes | Modifying shared components |
| [Firebase Security Architecture](../FIREBASE-SECURITY-ARCHITECTURE-ANALYSIS.md) | Security rules and access control | Working with Firebase |
| [CSS-JSX Targeting Implementation](../ui-compliance/CSS-ARCHITECTURE-ANALYSIS-REPORT.md) | Semantic token usage, specificity resolution | CSS/styling changes |

---

## 🧠 Governance & Intelligence Protocols

| Protocol | Purpose | Use When |
|----------|---------|----------|
| [Proto Governance Intelligence System](./PROTO-GOVERNANCE-INTELLIGENCE-SYSTEM.md) | Natural language governance with crisis management | proto- prefixed prompts |
| [Enhanced Agent Instruction System](../proto-think/ENHANCED-AGENT-INSTRUCTION-SYSTEM.md) | Misinterpretation-proof Claude protocols | Complex instructions |
| [Documentation-Practice Gap Elimination](../proto-think/DOCUMENTATION-PRACTICE-GAP-ELIMINATION-SYSTEM.md) | Protocol compliance enforcement | Ensuring protocol adherence |

---

## 📝 Documentation & Enhancement Protocols

| Protocol | Purpose | Use When |
|----------|---------|----------|
| [Documentation Best Practices & Guard Rails](./DOCUMENTATION-BEST-PRACTICES-AND-GUARD-RAILS-PROTOCOL.md) | Quality documentation standards | Creating/updating docs |
| [Summary Quality Assurance](./SUMMARY-QUALITY-ASSURANCE-PROTOCOL.md) | High-quality status reports | Generating summaries |
| [Script Development Standardization](../development-guidelines/SCRIPT-DEVELOPMENT-STANDARDIZATION-PROTOCOL.md) | Consistent script structure | Creating automation scripts |

---

## 🎨 UI/UX & Visual Protocols

| Protocol | Purpose | Use When |
|----------|---------|----------|
| [Visual Analysis Scope Enhancement Pipeline](./VISUAL-ANALYSIS-SCOPE-ENHANCEMENT-PIPELINE.md) | Multi-phase visual analysis roadmap | UI analysis work |
| [Visual Regression Detection](../regression/VISUAL-REGRESSION-DETECTION-GUIDE.md) | Before/after screenshot comparison | UI changes |

---

## 🔧 Operational Protocols

| Protocol | Purpose | Use When |
|----------|---------|----------|
| [Protocol Navigation Map](./PROTOCOL-NAVIGATION-MAP.md) | Instant protocol access with routing | Finding right protocol |
| [Protocolization Reflex (#protocolize)](../../CLAUDE.md#protocolization-reflex) | Convert recurring issues to protocols | Identifying new protocol needs |

---

## 📊 Protocol Statistics

**Total Protocols**: 37+
**Critical/Mandatory**: 6
**Architecture**: 3
**Governance**: 3
**Documentation**: 3
**UI/UX**: 2
**Operational**: 2
**Other**: 18+

**Auto-Enforcement Triggers**: 15+ in CLAUDE.md

---

## 🎯 Quick Navigation

### By Development Activity

**Starting Development**:
1. [Production-First Development](./PRODUCTION-FIRST-DEVELOPMENT-PROTOCOL.md)
2. [Build Verification](./BUILD-VERIFICATION-PROTOCOL.md)

**Working with Firebase**:
1. [Query Memoization (QMP-001)](../development-guidelines/QUERY-MEMOIZATION-PROTOCOL.md)
2. [Firebase Subscription Infinite Loop Prevention](./FIREBASE-SUBSCRIPTION-INFINITE-LOOP-PREVENTION.md)
3. [Firebase Security Architecture](../FIREBASE-SECURITY-ARCHITECTURE-ANALYSIS.md)

**Creating Services**:
1. [Circular Dependency Prevention](./CIRCULAR-DEPENDENCY-PREVENTION-PROTOCOL.md)
2. [Component Safety Analysis](./COMPONENT-SAFETY-ANALYSIS-PROTOCOL.md)

**UI/CSS Changes**:
1. [CSS-JSX Targeting Implementation](../ui-compliance/CSS-ARCHITECTURE-ANALYSIS-REPORT.md)
2. [Visual Regression Detection](../regression/VISUAL-REGRESSION-DETECTION-GUIDE.md)

**Creating Automation**:
1. [Safe Automation](./SAFE-AUTOMATION-PROTOCOL.md)
2. [Script Development Standardization](../development-guidelines/SCRIPT-DEVELOPMENT-STANDARDIZATION-PROTOCOL.md)

---

## 🚨 Auto-Enforcement Rules

From CLAUDE.md, these protocol triggers are **automatically enforced**:

```yaml
🚀 ANY development suggestion → MANDATORY: Production-First Development Protocol
🔥 BEFORE any useFirestoreSubscription → MANDATORY: Firebase Subscription Infinite Loop Prevention
🚨 BEFORE component modification → MANDATORY: Component Safety Analysis Protocol
🚨 BEFORE service creation/modification → MANDATORY: Circular Dependency Prevention Protocol
🔧 BEFORE creating any script → MANDATORY: Script Development Standardization Protocol
🚨 BEFORE any automation → MANDATORY: Safe Automation Protocol (4-step process)
🚨 BEFORE creating CSS classes → MANDATORY: Check CSS Duplicate Class Crisis Analysis
🚨 BEFORE any summary/status report → MANDATORY: Summary Quality Assurance Protocol
🛡️ PROTOCOLIZE TRIGGER → Auto-generate protocol docs when #protocolize invoked
```

---

## 📚 Related Documentation

### Core Navigation
- [CLAUDE.md](../../CLAUDE.md) - Central protocol hub with auto-enforcement
- [HOW-TO-FIND-THINGS.md](../HOW-TO-FIND-THINGS.md) - Repository navigation
- [Protocol Navigation Map](./PROTOCOL-NAVIGATION-MAP.md) - Intelligent protocol routing

### Development Guidelines
- [Development Guidelines Directory](../development-guidelines/) - Best practices
- [JSDoc Template Guide](../development-guidelines/JSDOC-TEMPLATE-GUIDE.md) - Code documentation

### Enhancement System
- [Enhancement Master Registry](../../ENHANCEMENT-MASTER-REGISTRY.md) - Enhancement tracking
- [Enhancement Clusters](../enhancements/) - Domain-organized enhancements

---

## 🎓 Protocol Usage Best Practices

### Do's ✅
- ✅ Check CLAUDE.md for auto-enforcement triggers before starting work
- ✅ Use Protocol Navigation Map for intelligent routing
- ✅ Apply protocols FIRST, not as afterthought
- ✅ Use #protocolize to create new protocols for recurring issues

### Don'ts ❌
- ❌ Skip critical safety protocols (QMP-001, Build Verification, etc.)
- ❌ Default to basic approaches when protocols exist
- ❌ Treat protocols as optional suggestions
- ❌ Create duplicate protocols without checking existing

---

## 🔄 Protocol Lifecycle

**Creation**: Via #protocolize trigger or manual documentation
**Enforcement**: Auto-triggers in CLAUDE.md
**Evolution**: Updated based on lessons learned
**Archival**: Moved to archive/ when superseded

---

**Last Updated**: 2025-11-04
**Total Protocols**: 37+
**Maintenance**: Monthly protocol compliance reviews
**Governance**: Part of Proto Think Master Protocol System
