---
hub: 04_PROCUREMENT_VENDORS/HUB.md
---

# 💍 Gold, Jewellery & High-Value Asset Custody Protocol (`AST-###`)

**Specification:** `SPEC-ASSET-CUSTODY-001`  
**Purpose:** Chain-of-custody control for gold ornaments, diamond jewelry, bride/groom Mukuta, silver articles, and bank safe deposit vault transfers.

---

## 1. Asset Chain-of-Custody State Machine

```mermaid
flowchart LR
    VAULT["1. Bank / Home Vault<br/>(Secure Custody)"]
    --> RELEASE["2. Pre-Event Release<br/>(Sign-out + Witness)"]
    --> VENUE["3. Venue Green Room Locker<br/>(Assigned Custodian Guard)"]
    --> WEAR["4. Ritual Wear<br/>(Active Usage on Stage/Mandap)"]
    --> HANDOVER["5. Post-Ritual Handover<br/>(Sign-in + Witness)"]
    --> RETURN["6. Vault Re-Deposit<br/>(Reconciliation Complete)"]
```

---

## 2. Master Jewellery & Precious Asset Register

| Asset ID | Item Description | Metal / Weight | Assigned Wearer | Primary Custodian | Storage Location | Reconciled Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`AST-001`** | Bridal Gold Necklace & Choker | Gold 22K (85g) | Bride (`PER-001`) | `PER-007` (Family Custodian) | Venue Locker 1 | Vault Stored |
| **`AST-002`** | Bridal Gold Bangles (Bala/Kada) | Gold 22K (60g) | Bride (`PER-001`) | `PER-007` (Family Custodian) | Venue Locker 1 | Vault Stored |
| **`AST-003`** | Sacred Mangalsutra & Pendant | Gold 22K (25g) | Bride (`PER-001`) | `PER-007` (Delivered at Mandap) | Mandap Thali | Vault Stored |
| **`AST-004`** | Groom Gold Chain & Finger Ring | Gold 22K (40g) | Groom (`PER-002`) | `PER-005` (Groom Custodian) | Venue Locker 2 | Vault Stored |
| **`AST-005`** | Traditional Odia Bridal Mukuta | Silver / Craft | Bride (`PER-001`) | `PER-006` (Bridal Lead) | Green Room Box | Handed Over |
| **`AST-006`** | Traditional Odia Groom Mukuta | Silver / Craft | Groom (`PER-002`) | `PER-008` (Groom Lead) | Green Room Box | Handed Over |

---

## 3. Custody Transfer Log Template

```text
TIMESTAMP     ASSET ID    RELEASED BY (Transferor)   RECEIVED BY (Custodian)   WITNESS (3rd Party)   PURPOSE / LOCATION
YYYY-MM-DD    AST-001     PER-007 (Parents)          PER-006 (Bride Mother)    PER-014 (Coordinator) Bride Styling (Green Room)
YYYY-MM-DD    AST-001     PER-006 (Bride Mother)     PER-007 (Parents)         PER-014 (Coordinator) Post-Wedding Vault Box
```
