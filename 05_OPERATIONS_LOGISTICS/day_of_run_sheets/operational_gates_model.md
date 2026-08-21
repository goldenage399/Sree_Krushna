# 🚦 Operational Gates & Synchronization Handshakes

**Specification:** `SPEC-OPERATIONAL-GATES-001`  
**Purpose:** Transform linear timeline handshakes into disruption-resistant **Operational Gates** with explicit time windows, delay thresholds, Go/No-Go decision authorities, and automatic recovery triggers.

---

## 1. Operational Gate Architecture

```text
                     ┌──────────────────────────────────────────────┐
                     │           OPERATIONAL GATE (GATE-xxx)        │
                     ├──────────────────────────────────────────────┤
                     │ • Planned Time: 19:30                        │
                     │ • Earliest Acceptable Start: 19:15           │
                     │ • Latest Acceptable Start (Drop-Dead): 20:15 │
                     │ • Preconditions: (e.g. Groom Ready, Aarti)   │
                     │ • Go / No-Go Decision Authority: PER-014     │
                     │ • Delay Threshold: 30 Mins                   │
                     │ • Escalation: Trigger CP-003 Playbook        │
                     └──────────────────────┬───────────────────────┘
                                            │
                             ┌──────────────┴──────────────┐
                             ▼                             ▼
                     [STATUS: GO]                  [STATUS: DELAYED]
                     Execute Next Phase            Activate Playbook CP-003
                                                   Re-sequence Secondary Tracks
```

---

## 2. Live Wedding Day Critical Operational Gates

### GATE-01: Barat Arrival & Baranugam Gate
- **Planned Time:** `19:30` | **Earliest:** `19:15` | **Drop-Dead Latest:** `20:15`
- **Go/No-Go Authority:** `PER-014` (Day Incident Commander)
- **Preconditions:**
  1. Barat vehicles assembled at venue outer gate.
  2. Bride mother & welcoming elders ready at entrance with aarti thali ([`SAM-004`](file:///d:/GitHub_Repo/Sree_Krushna/02_RITUALS_CULTURE/samagri_checklists/SAM-004_baranugam_samagri.md)).
  3. Welcome drinks counter active ([`Track 4`](file:///d:/GitHub_Repo/Sree_Krushna/04_PROCUREMENT_VENDORS/food_and_catering/)).
  4. Lead photographer & drone in position ([`Track 5`](file:///d:/GitHub_Repo/Sree_Krushna/04_PROCUREMENT_VENDORS/photography/)).
- **Disruption Action (>30 min delay):** Activate [`CP-003`](file:///d:/GitHub_Repo/Sree_Krushna/00_GOVERNANCE/contingency_playbooks/) $\rightarrow$ Open dinner snacks early; notify stage lighting team; hold bride in Green Room AC.

---

### GATE-02: Varamala Stage Exchange Gate
- **Planned Time:** `20:00` | **Earliest:** `19:45` | **Drop-Dead Latest:** `20:45`
- **Go/No-Go Authority:** `PER-008` (Stage Coordinator)
- **Preconditions:**
  1. Groom on stage with garland.
  2. Bride escorted to stage entrance with bridal party.
  3. Stage floral lighting & sound fanfare active.
  4. Both sets of parents in front-row stage seats.

---

### GATE-03: Vedic Mandap Entry & Kanyadaan Gate
- **Planned Time:** `21:30` | **Earliest:** `21:15` | **Drop-Dead Latest:** `22:15` (Muhurat Constraint)
- **Go/No-Go Authority:** Officiating Purohit & `PER-005` (Ritual Lead)
- **Preconditions:**
  1. Mandap Shuddhi completed and sacred fire ignited.
  2. Samagri Checklist [`SAM-005`](file:///d:/GitHub_Repo/Sree_Krushna/02_RITUALS_CULTURE/samagri_checklists/SAM-005_kanyadaan_mandap_homa_samagri.md) verified on site.
  3. Kanyadata (Father/Mother) and Groom seated on designated *Pidhis*.
  4. Cash envelope [`CSH-01`](file:///d:/GitHub_Repo/Sree_Krushna/06_FINANCE_COMMERCIALS/cash_logistics.md) in custody of `PER-007`.

---

### GATE-04: Saptapadi & Sindoor Daan Culmination Gate
- **Planned Time:** `23:00` | **Earliest:** `22:30` | **Drop-Dead Latest:** `00:00`
- **Go/No-Go Authority:** Officiating Purohit
- **Preconditions:**
  1. Seven sacred betel nuts/plates aligned for Saptapadi.
  2. Mangalsutra & Sindoor container handed from secure custody to Priest.
  3. Primary family witnesses present around Mandap.
