---
hub: 00_GOVERNANCE/HUB.md
---

# 🛡️ Risk Register & Contingency Matrices (`RSK-###`)

This directory tracks operational, environmental, vendor, financial, and logistical risks along with concrete mitigation plans and fallback contacts.

---

## Active Risk Register

| Risk ID | Title | Category | Severity | Probability | Mitigation Summary | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-001** | Heavy Rain / Weather Impact | Venue / Logistics | High | Medium | Waterproof canopy & indoor backup hall confirmed | PER-005 | Active |
| **RSK-002** | Vendor No-Show (Photo/Catering) | Procurement | Critical | Low | Backup emergency vendor list in 08_RESEARCH | PER-008 | Active |
| **RSK-003** | Muhurat Delay / Schedule Slip | Ritual / Day-of | High | Medium | Priority buffer built into run sheets | PER-014 | Active |
| **RSK-004** | Cash Shortage for Day-of Tips | Financial | Medium | Low | Dedicated pre-sorted cash envelope custodian | PER-007 | Active |

---

## Standard Risk Template

```markdown
---
id: RSK-###
title: "Summary of risk"
category: "Weather | Vendor | Logistics | Health | Finance | Ritual"
severity: "Critical | High | Medium | Low"
probability: "High | Medium | Low"
owner_id: "PER-###"
trigger_condition: "What marks the onset of this risk"
status: "Active | Mitigated | Closed"
---

# Risk Analysis
Detailed description of potential hazard.

## Preventive Mitigation
Actions taken before the event to prevent the risk.

## Day-of Contingency Plan
Emergency step-by-step actions if trigger occurs.
- **Fallback Contact:** Name / Phone / Vendor
- **Immediate Action:** ...
```
