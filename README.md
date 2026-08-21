# 💍 Sree Krushna — Marriage Operating System (SSOT)

> **Single Source of Truth (SSOT) & Operational Control Center for the Marriage of Sree & Krushna**  
> 🌐 **Live Web Portal:** [https://sree-krushna-forever.web.app](https://sree-krushna-forever.web.app)

Welcome to the **Sree Krushna Marriage Operating System & Single Source of Truth (SSOT)**.

This repository serves as the authoritative, durable knowledge base and operational control tower across the entire lifecycle of the marriage — from vision and procurement through day-of minute-by-minute coordination, post-marriage customs (e.g., Chauthi, Astamangala), legal registrations, and lifetime digital media archival.

---

## 🏛️ 9-Pillar Repository Architecture

```text
d:\GitHub_Repo\Sree_Krushna\
├── 00_GOVERNANCE/                 # Control tower, master dashboard, decisions, tasks, risks & closure
├── 01_TIMELINE_EVENTS/            # Master chronological timeline and event orchestration specs (EVT-###)
├── 02_RITUALS_CULTURE/            # Liturgical ritual specs (RIT-###), samagri checklists & Odia traditions
├── 03_PEOPLE_GUESTS/              # Master directory of people (PER-###), families (FAM-###), RSVPs & roles
├── 04_PROCUREMENT_VENDORS/        # Vendors (VDR-###), contracts (CTR-###), attire, decor, food & photo
├── 05_OPERATIONS_LOGISTICS/       # Venues (VEN-###), accommodation, transport/fleet & day-of run sheets
├── 06_FINANCE_COMMERCIALS/        # Budget master (Planned/Committed/Actual), payments (PAY-###) & gifts
├── 07_DOCUMENTS_ARCHIVE/          # Statutory filings, signed contracts & digital media catalog
└── 08_RESEARCH_REFERENCE/         # Vedic traditions, vendor benchmarks & aesthetic inspiration boards
```

---

## 🧭 Core Architectural Principles

1. **Single Source of Truth (SSOT):** Every canonical piece of data (contact number, payment amount, samagri item, event time) is authored in exactly **one** primary file. All other files reference or link to it.
2. **Bidirectional Traceability:**
   - From high-level milestones down to individual tasks, deadlines, and assigned custodians.
   - From micro-operational assets (e.g., mandap samagri, luggage keys) up to budget, venue, and ritual specs.
3. **Structured Frontmatter:** Markdown files use standardized YAML Frontmatter schemas with strict entity identifiers (`EVT-###`, `RIT-###`, `PER-###`, `FAM-###`, `VEN-###`, `VDR-###`, `CTR-###`, `TSK-###`, `DEC-###`, `PAY-###`, `RSK-###`).
4. **Dual Execution & Archival Value:** Built to withstand day-of real-time pressure on mobile/tablets while remaining pristine for multi-decade historical lookup.

---

## 🚀 Quick Navigation

| Pillar / Control Center | Primary File | Description |
| :--- | :--- | :--- |
| **Master Dashboard** | [`00_GOVERNANCE/dashboard.md`](file:///d:/GitHub_Repo/Sree_Krushna/00_GOVERNANCE/dashboard.md) | High-level status, KPIs, critical countdown & blockers |
| **Architecture Specification** | [`ARCHITECTURE_SPEC.md`](file:///d:/GitHub_Repo/Sree_Krushna/ARCHITECTURE_SPEC.md) | Frozen domain models, entity schemas & ID standards |
| **Master Timeline** | [`01_TIMELINE_EVENTS/master_timeline.md`](file:///d:/GitHub_Repo/Sree_Krushna/01_TIMELINE_EVENTS/master_timeline.md) | Chronological sequence across planning and execution |
| **Rituals Index** | [`02_RITUALS_CULTURE/ritual_master_index.md`](file:///d:/GitHub_Repo/Sree_Krushna/02_RITUALS_CULTURE/ritual_master_index.md) | Odia Vedic liturgical sequences & priest requirements |
| **People & Guests** | [`03_PEOPLE_GUESTS/people_master_index.md`](file:///d:/GitHub_Repo/Sree_Krushna/03_PEOPLE_GUESTS/people_master_index.md) | Master attendee directory, family units & RSVP status |
| **Vendors & Contracts** | [`04_PROCUREMENT_VENDORS/vendor_master_index.md`](file:///d:/GitHub_Repo/Sree_Krushna/04_PROCUREMENT_VENDORS/vendor_master_index.md) | Procurement lifecycle & vendor service status |
| **Master Budget** | [`06_FINANCE_COMMERCIALS/budget_master.md`](file:///d:/GitHub_Repo/Sree_Krushna/06_FINANCE_COMMERCIALS/budget_master.md) | Financial ledger: Estimated vs Committed vs Paid |
| **Discussion & Utilities** | [`User_Created/Discussion Threads/`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/) | Discussion thread logs & automated markdown tools |

---

## 🛠️ Markdown & Log Formatting Tasks

This workspace includes VS Code tasks for maintaining clean Markdown documentation:
- **`Ctrl+Shift+P` → Tasks: Run Task → `Adjust Markdown Headers`**: Automatically standardizes header hierarchy for AST parsers.
- **`Ctrl+Shift+P` → Tasks: Run Task → `Format Chat Log`**: Formats discussion threads into `# Query X.Y -` and `# Response X.Y -` syntax.
