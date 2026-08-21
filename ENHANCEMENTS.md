# ENHANCEMENTS.md — Sree Krushna Enhancement System Index

This file is the root-level entry point for Sree Krushna's enhancement-tracking system, mirroring the domain-cluster model used in `Task-Dashboard`, `PIOperationsMgmt_Firebase`, `Capsicum`, and `BMS`. It is a navigation index only — never a write target. Lean entries go in the relevant Domain Cluster file; full detail for Complex enhancements goes in `enhancement-notes/`.

## 📋 Quick Navigation

- **Primary Registry**: [ENHANCEMENT-MASTER-REGISTRY.md](./ENHANCEMENT-MASTER-REGISTRY.md)
- **Protocol**: [ENHANCEMENT_PROTOCOL.md](./ENHANCEMENT_PROTOCOL.md)

### 📂 Domain Clusters (Active Backlogs)

| Cluster | Focus | Backlog |
| :--- | :--- | :--- |
| **🧠 Governance** | Protocols, workflows, SSOT reconciliation, entity lifecycles | [Backlog](./docs/enhancements/GOVERNANCE-ENHANCEMENT-CLUSTER.md) |
| **📂 Infrastructure** | Architecture, Hub & Spoke structure, compilers, scripts, CI/CD | [Backlog](./docs/enhancements/INFRASTRUCTURE-ENHANCEMENT-CLUSTER.md) |
| **🎨 UI Quality** | View modularization, design tokens, responsiveness, 300px mobile | [Backlog](./docs/enhancements/UI-QUALITY-ENHANCEMENT-CLUSTER.md) |
| **💼 Business Logic** | Rituals, timeline events, guests, vendors, logistics, financials | [Backlog](./docs/enhancements/BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md) |

---

**Bootstrapped**: 2026-08-22, scaffolding `SK-001`, `SK-002`, and `SK-003` as foundational enhancements. See [ENHANCEMENT_PROTOCOL.md](./ENHANCEMENT_PROTOCOL.md) for lifecycle rules.

**Add a New Enhancement**: Follow the process in the [enhancement-scaffolder skill](.agent/skills/enhancement-scaffolder/SKILL.md).