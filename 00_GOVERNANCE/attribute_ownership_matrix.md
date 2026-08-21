# 🏛️ Canonical Attribute Ownership Matrix (SSOT Anti-Duplication Protocol)

**Specification:** `SPEC-SSOT-OWNERSHIP-001`  
**Purpose:** Enforce strict single-source attribute ownership across the 9 pillars, eliminating discordant data between procurement, finance, operations, and run-sheets.

---

## 1. Core Ownership Principle
Every data field (e.g., vendor price, arrival timestamp, guest phone number, ritual duration) is authoritatively authored in **exactly one canonical home**. All other documents and derived views must **reference** the canonical attribute rather than re-declaring it.

---

## 2. Master Entity Attribute Ownership Table

### A. Vendor Entity (`VDR-###` / `CTR-###`)

| Attribute | Canonical SSOT Location | Permitted Consumers / References | Prohibited Duplicate Write Locations |
| :--- | :--- | :--- | :--- |
| **Vendor Identity & Contact** | `04_PROCUREMENT_VENDORS/vendors/VDR-xxx.md` | Run sheets, Contact book, Risk register | Event notes, Chat logs |
| **Agreed Total Cost** | `04_PROCUREMENT_VENDORS/contracts/CTR-xxx.md` | `06_FINANCE_COMMERCIALS/budget_master.md` | Vendor profiles, Run sheets |
| **Advance & Paid Amounts** | `06_FINANCE_COMMERCIALS/ledger/PAY-xxx.md` | `budget_master.md`, Vendor status card | Contract drafts, Meeting minutes |
| **Operational Scope & SLA** | `04_PROCUREMENT_VENDORS/contracts/CTR-xxx.md` | Day-of leads, Coordinator run-sheets | Email copies, Vendor notes |
| **Day-of Arrival Time & Gate**| `05_OPERATIONS_LOGISTICS/day_of_run_sheets/` | Vendor briefing card, Security lead | Contract general terms |
| **Deliverables & Media Delivery**| `07_DOCUMENTS_ARCHIVE/digital_media_catalog.md`| Post-wedding closure checklist | Informal text messages |

---

### B. Event & Timeline Entity (`EVT-###`)

| Attribute | Canonical SSOT Location | Permitted Consumers / References | Prohibited Duplicate Write Locations |
| :--- | :--- | :--- | :--- |
| **Master Date & Muhurat Window**| `01_TIMELINE_EVENTS/master_timeline.md` | `00_GOVERNANCE/dashboard.md`, Run sheets | Invitation drafts, Vendor emails |
| **Venue Space Allocation** | `05_OPERATIONS_LOGISTICS/venues/VEN-xxx.md` | Event specs, Decor layout, Caterer plan | WhatsApp briefings |
| **Dress Code & Aesthetic Theme**| `01_TIMELINE_EVENTS/EVT-xxx.md` | Digital invitations, Guest packets | Fragmented group chats |
| **Lead Day Coordinator** | `03_PEOPLE_GUESTS/responsibility_matrix.md` | Event specs, Master Dashboard | Task notes |

---

### C. Ritual Entity (`RIT-###`)

| Attribute | Canonical SSOT Location | Permitted Consumers / References | Prohibited Duplicate Write Locations |
| :--- | :--- | :--- | :--- |
| **Liturgical Steps & Sequence**| `02_RITUALS_CULTURE/specs/RIT-xxx.md` | Master run sheets, Priest briefing | General word documents |
| **Sacred Samagri Items** | `02_RITUALS_CULTURE/samagri_checklists/SAM-xxx.md`| Procurement lead, Day-of custodian | Scraps of paper |
| **Participating Family Members**| `02_RITUALS_CULTURE/specs/RIT-xxx.md` | Family responsibility matrix | Unverified verbal lists |
| **Priest Dakshina Allocation** | `06_FINANCE_COMMERCIALS/cash_logistics.md` | Cash envelope custodian (`PER-007`) | Ritual specs, Run sheets |

---

### D. Person & Family Entity (`PER-###` / `FAM-###`)

| Attribute | Canonical SSOT Location | Permitted Consumers / References | Prohibited Duplicate Write Locations |
| :--- | :--- | :--- | :--- |
| **Phone Number & Primary Email**| `03_PEOPLE_GUESTS/directory/PER-xxx.md` | Invitation tracker, Pickup roster | Multiple spreadsheets |
| **Postal Address for Cards** | `03_PEOPLE_GUESTS/families/FAM-xxx.md` | Courier log, Distribution leads | Phone contact books |
| **RSVP Status & Pax Count** | `03_PEOPLE_GUESTS/directory/PER-xxx.md` | Caterer plate count, Seating layout | Informal chats |
| **Hotel Room Assignment** | `05_OPERATIONS_LOGISTICS/accommodation/` | Welcome desk, Guest welcome packet | Individual phone notes |
| **Airport / Station Pickup Roster**| `05_OPERATIONS_LOGISTICS/transport_and_fleet/` | Fleet drivers, Assigned escort | Scattered text messages |

---

### E. Financial Transaction Entity (`PAY-###` / `GFT-###`)

| Attribute | Canonical SSOT Location | Permitted Consumers / References | Prohibited Duplicate Write Locations |
| :--- | :--- | :--- | :--- |
| **Transaction Amount & Mode** | `06_FINANCE_COMMERCIALS/ledger/PAY-xxx.md` | `budget_master.md`, Tax/CA file | Bank counter slips alone |
| **Day-of Petty Cash Custody** | `06_FINANCE_COMMERCIALS/cash_logistics.md` | Cash envelope holder, Decision makers | Day coordinators |
| **Received Shagun & Gifts** | `06_FINANCE_COMMERCIALS/gifts_and_shagun/` | Thank you note pipeline | Random gift desk diaries |
