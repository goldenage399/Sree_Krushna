# DOCS_HUB.md — Sree Krushna Marriage OS Documentation Hub

> **Protocol Standard**: `P-SSOT-DOCS` (Spoke & Wheel Single Source of Truth)  
> **Master Entity Specification**: [`ARCHITECTURE_SPEC.md`](./ARCHITECTURE_SPEC.md)

---

## 🏛️ Domain Hubs Navigation

| Domain | Hub File | Scope & Entities |
|---|---|---|
| **00 Governance** | [`00_GOVERNANCE/HUB.md`](./00_GOVERNANCE/HUB.md) | Tasks (`TSK`), Decisions (`DEC`), Risks (`RSK`), Authority Matrix |
| **01 Timeline Events** | [`01_TIMELINE_EVENTS/HUB.md`](./01_TIMELINE_EVENTS/HUB.md) | Master Timeline, Sequence Events (`EVT-001` to `EVT-007`) |
| **02 Rituals & Culture** | [`02_RITUALS_CULTURE/HUB.md`](./02_RITUALS_CULTURE/HUB.md) | Ritual Specs (`RIT-001` to `RIT-012`), Samagri Checklists (`SAM`) |
| **03 People & Guests** | [`03_PEOPLE_GUESTS/HUB.md`](./03_PEOPLE_GUESTS/HUB.md) | Guest Directory (`PER`), Families (`FAM`), Responsibility Matrix |
| **04 Procurement & Vendors**| [`04_PROCUREMENT_VENDORS/HUB.md`](./04_PROCUREMENT_VENDORS/HUB.md)| Vendors (`VDR`), Contracts (`CTR`), Attire, Photography, Decor |
| **05 Operations & Logistics**| [`05_OPERATIONS_LOGISTICS/HUB.md`](./05_OPERATIONS_LOGISTICS/HUB.md)| Venues (`VEN`), Accommodation, Transport Fleet, Operational Gates |
| **06 Finance & Commercials**| [`06_FINANCE_COMMERCIALS/HUB.md`](./06_FINANCE_COMMERCIALS/HUB.md)| Budget Master, Cash Logistics, Payment Ledger (`PAY`), Shagun |

---

## 🌐 Architectural Knowledge Graph & Entity Index

- **Canonical Entity Graph Report**: [`graphify-out/GRAPH_REPORT.md`](./graphify-out/GRAPH_REPORT.md) (`STD-UNIVERSAL-TAXONOMY-001` / `STD-PCL-001`)
- **JSON Adjacency Graph**: [`graphify-out/graph.json`](./graphify-out/graph.json)
- **Graph Generator Tooling**: `npm run build:graph` (`scripts/generate-domain-graph.cjs`)

---

## ⚡ Session Acceleration & Taxonomy Governance

- **System Clarity Snapshot**: [`docs/SYSTEM_CLARITY_SNAPSHOT.md`](./docs/SYSTEM_CLARITY_SNAPSHOT.md) (`STD-UNIVERSAL-TAXONOMY-001` / `AC-DEC-2026-059`)
- **Dual-Block Taxonomy Dictionary**: [`.agent/taxonomy_dictionary.cjs`](./.agent/taxonomy_dictionary.cjs) (`INV-SAP-DUAL-BLOCK-001` / `AC-DEC-2026-063`)
- **Vocabulary Verification Tooling**: `npm run verify:taxonomy` (`scripts/verify-taxonomy-vocabulary.cjs`)

---

**Governance Rules**:
- Hub files are indexes and status snapshots strictly capped at 150 lines.
- Spoke files declare parent hub in frontmatter (`hub: "<domain>/HUB.md"`).