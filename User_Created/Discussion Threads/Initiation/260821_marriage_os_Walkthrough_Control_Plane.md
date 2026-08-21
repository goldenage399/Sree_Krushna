# Walkthrough: Sree Krushna Marriage OS — Control Plane & Operational Resilience (v2.0)

We have addressed the external architectural review findings (Score: 8.1/10) by elevating the system into a **Production-Grade Marriage Operating System with an explicit Control Plane**.

---

## 🏛️ Comprehensive Inventory of Upgrades

### 1. Control Plane Architecture & SSOT Attribute Ownership
- [`ARCHITECTURE_SPEC.md`](file:///d:/GitHub_Repo/Sree_Krushna/ARCHITECTURE_SPEC.md) *(v2.0.0 Baseline)*: Upgraded to define the cross-cutting **Control Plane** (Identity/Access, Attribute Ownership, Decisions, Change Management, Dependencies, Operational Gates, Asset Custody, Contingency, and Audit/History).
- [`00_GOVERNANCE/attribute_ownership_matrix.md`](file:///d:/GitHub_Repo/Sree_Krushna/00_GOVERNANCE/attribute_ownership_matrix.md): Master matrix defining exact canonical homes for every attribute of Vendor, Event, Ritual, Payment, and Guest, eliminating dual-ownership and discordant records.

### 2. Fine-Grained Scoped RBAC & Separation of Duty (SoD)
- [`00_GOVERNANCE/authority_and_access_matrix.md`](file:///d:/GitHub_Repo/Sree_Krushna/00_GOVERNANCE/authority_and_access_matrix.md): Multi-dimensional permission matrix across `Role × Domain × Object × Action × Sensitivity` (L1 Confidential to L4 Public) + Separation of Duty rules for cash, gold transfers, and plate count auditing.

### 3. Disruption-Resistant Operational Gates
- [`05_OPERATIONS_LOGISTICS/day_of_run_sheets/operational_gates_model.md`](file:///d:/GitHub_Repo/Sree_Krushna/05_OPERATIONS_LOGISTICS/day_of_run_sheets/operational_gates_model.md): Live synchronization gates (`GATE-01` to `GATE-04`) with Planned vs Earliest vs Drop-Dead timestamps, Go/No-Go authorities, delay thresholds, and escalation triggers.

### 4. Contingency Playbooks Catalog (`CP-001` to `CP-013`)
- [`00_GOVERNANCE/contingency_playbooks/README.md`](file:///d:/GitHub_Repo/Sree_Krushna/00_GOVERNANCE/contingency_playbooks/README.md): Pre-approved emergency SOPs covering Heavy Rain (`CP-001`), Power Outage (`CP-002`), Barat Delay (`CP-003`), Vendor No-Show (`CP-004`), Equipment Failure (`CP-005`), Food Overflow (`CP-006`), Medical Emergency (`CP-007`), and Samagri Shortage (`CP-010`).

### 5. Precious Asset & Gold Jewellery Chain-of-Custody (`AST-###`)
- [`04_PROCUREMENT_VENDORS/attire_and_jewellery/asset_custody_protocol.md`](file:///d:/GitHub_Repo/Sree_Krushna/04_PROCUREMENT_VENDORS/attire_and_jewellery/asset_custody_protocol.md): Asset state machine tracking Bank Vault $\rightarrow$ Pre-Event Release $\rightarrow$ Green Room Locker $\rightarrow$ Ritual Wear $\rightarrow$ Handover $\rightarrow$ Re-Deposit with mandatory witness logging.

### 6. Change Impact Propagation Protocol (`CHG-###`)
- [`00_GOVERNANCE/change_management_protocol.md`](file:///d:/GitHub_Repo/Sree_Krushna/00_GOVERNANCE/change_management_protocol.md): Formal protocol to systematically propagate changes in Venue, Muhurat, or Budget across all 9 pillars with audit logging.
