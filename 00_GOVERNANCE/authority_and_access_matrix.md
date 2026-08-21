---
hub: 00_GOVERNANCE/HUB.md
---

# 🔐 Authority, RBAC & Scoped Access Matrix

**Specification:** `SPEC-RBAC-SCOPED-001`  
**Purpose:** Precise specification of permissions across Role, Domain, Action, Object, and Sensitivity levels to guarantee least-privilege security and operational autonomy.

---

## 1. Permission Dimensions Model

Permissions in Sree Krushna Marriage OS are evaluated along 5 formal axes:
$$\text{Permission} = \langle \text{Persona / Role}, \text{Domain}, \text{Object Category}, \text{Permitted Action}, \text{Sensitivity Level} \rangle$$

### Action Codes:
- **`R` (Read):** View information.
- **`W` (Write / Draft):** Author, propose, or edit draft records.
- **`A` (Approve / Freeze):** Formal sign-off authority (binds budget or changes master schedule).
- **`E` (Execute / Dispatch):** Mark tasks completed, release on-ground assets, or initiate contingency.

### Sensitivity Classifications:
- **`CONFIDENTIAL (L1)`:** Overall budget, bank balances, real cash ledger, gold locker codes, private couple notes.
- **`RESTRICTED (L2)`:** Vendor contract terms, full guest master list with contact details, family decisions.
- **`OPERATIONAL (L3)`:** Scoped run-sheets, assigned tasks, samagri checklists, room numbers, pickup rosters.
- **`PUBLIC (L4)`:** Event dates, muhurat windows, venue maps, attire dress codes, public photo links.

---

## 2. Fine-Grained Role × Domain Permission Matrix

| Role Persona | Financial Ledger (L1) | Gold & Vault (L1) | Vendor Contracts (L2) | Decisions `DEC-###` (L2) | Tasks & Ops (L3) | Ritual Specs (L3) | Guest Data (L3/L4) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **👑 Core Couple (Sree & Groom)** | `R / W / A / E` | `R / W / A / E` | `R / W / A / E` | `R / W / A` (Freeze) | `R / W / A / E` | `R / W / A` | Full Access |
| **🏛️ Parents Council** | `R` (Category Summary) | `R / W / E` (Custody) | `R / A` (Co-Sign) | `R / W / A` (Consult) | `R / W / E` | `R / W / A` | Full Access |
| **📋 Planning Committee Lead** | `R` (Category Budget) | ❌ Denied | `R / W` (Propose) | `R / W` (Propose) | `R / W / E` | `R` | Full Master List |
| **🍲 Catering & Hospitality Lead**| ❌ Denied | ❌ Denied | `R` (Caterer Scope Only) | ❌ Denied | `R / E` (Food Tasks) | `R` (Meal Timings)| `R` (Dietary/Pax) |
| **📸 Photography Lead Coordinator**| ❌ Denied | ❌ Denied | `R` (Photo Scope Only) | ❌ Denied | `R / E` (Photo Tasks)| `R` (Shot Timings) | `R` (VIP List) |
| **🚗 Fleet & Transport Lead** | ❌ Denied | ❌ Denied | `R` (Vehicle Scope Only)| ❌ Denied | `R / E` (Fleet Tasks)| ❌ Denied | `R` (Pickup Roster)|
| **🏨 Accommodation & Room Lead** | ❌ Denied | ❌ Denied | `R` (Hotel Scope Only) | ❌ Denied | `R / E` (Room Tasks) | ❌ Denied | `R` (Rooming List)|
| **🕉️ Officiating Vedic Purohit** | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | `R / E` (Ritual Tasks)| `R / W` (Liturgies)| ❌ Denied |
| **💵 Cash Envelopes Custodian** | `R / E` (Voucher Pool) | ❌ Denied | ❌ Denied | ❌ Denied | `R / E` (Cash Tasks) | ❌ Denied | ❌ Denied |
| **💍 Gold & Jewellery Custodian** | ❌ Denied | `R / W / E` (Custody) | ❌ Denied | ❌ Denied | `R / E` (Vault Tasks)| `R` (Attire Match)| ❌ Denied |
| **✉️ General Guest / Relative** | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | ❌ Denied | `R` (Public Rites) | Own Itinerary Only |

---

## 3. Separation-of-Duty (SoD) Constraints

To prevent conflicts of interest and single-point failure modes:
1. **Cash Disbursement SoD:** The person who authorizes an expense (`DEC-###` / Couple/Parents) cannot be the sole unverified person disbursing cash without a countersigned voucher (`PAY-###`).
2. **Gold Transfer SoD:** No transfer of high-value jewellery occurs without a named **Transferor**, **Recipient Custodian**, and a **Third-Party Family Witness** logging the timestamp.
3. **Catering Plate Count SoD:** The lead who signed the catering contract does not perform the sole manual plate count at the gate; an independent coordinator logs the actual plates served.
