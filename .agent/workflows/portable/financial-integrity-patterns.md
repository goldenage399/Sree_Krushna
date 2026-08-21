---
pattern: financial-integrity-patterns
origin_cap: PIO-103
tier: universal
applies_to:
  - "Any project handling currency, ledgers, or invoicing"
  - "Both backend calculation engines and frontend display layers"
prereqs:
  - "Centralized MoneyUtils library"
porting_effort: low
canonical_source: PIOperationsMgmt_Firebase
last_reviewed: 2026-04-21
description: "Paise-based integer arithmetic and FIFO allocators."
---

# Portable Workflow: Financial Integrity Patterns

**Purpose:** Financial calculations in JavaScript are notoriously prone to floating-point drift (`0.1 + 0.2 !== 0.3`). As applications scale to include Ledgers, Accounts, and Inventory pricing, these micro-errors compound into massive reconciliation failures.

---

## 1. Paise-Based Arithmetic (The Integer Rule)

**Constraint:** NEVER perform mathematical operations on floating-point currency values (e.g., `10.50 + 20.75`).
**Why:** IEEE 754 floating-point math creates tiny fractional artifacts.

**Standard Pattern (`MoneyUtils`):**
All internal financial values must be stored, transmitted, and calculated in their smallest indivisible unit (e.g., Paise for INR, Cents for USD).

1. **Convert to Integer on Ingress**: `Math.round(rupees * 100)`
2. **Calculate in Integers**: `totalPaise = paise1 + paise2`
3. **Convert to Float ONLY for Display**: `(totalPaise / 100).toFixed(2)`

### Standard implementation:

```javascript
const MoneyUtils = {
  toPaise: (rupees) => Math.round((Number(rupees) || 0) * 100),
  toRupees: (paise) => (Number(paise) || 0) / 100,
  formatDisplay: (paise) => `₹${((Number(paise) || 0) / 100).toFixed(2)}`,
  add: (a, b) => (Number(a) || 0) + (Number(b) || 0),
  subtract: (a, b) => (Number(a) || 0) - (Number(b) || 0)
};
```

---

## 2. API Transmission Contract

**Constraint:** API Payloads (`POST` / `GET`) must always transmit financial values as integers (Paise/Cents).

**Frontend Request:**
```javascript
// ✅ Correct
{ "amountPaise": 50000 } // Represents 500.00

// ❌ Incorrect
{ "amount": 500.00 }
```

**Backend Response:**
```javascript
// ✅ Correct
{ "totalReceivablesPaise": 125050 } // Represents 1250.50
```

---

## 3. FIFO Allocation Engine

**Constraint:** When a single payment must be applied across multiple unpaid invoices or ledger entries, use a standard FIFO (First-In, First-Out) allocator rather than ad-hoc loops.

**Pattern:**
1. Sort targets by oldest first.
2. Iterate through targets, subtracting from the remaining payment pool.
3. Lock the entry if fully paid, leave the remainder on the last entry (partial payment).

```javascript
const AllocationEngine = {
  autoAllocate(entries, totalPaise) {
    let remaining = totalPaise;
    return entries.map(entry => {
      const needed = entry.expectedPaise;
      const allocated = Math.min(needed, remaining);
      remaining -= allocated;
      return { ...entry, allocatedPaise: allocated };
    });
  }
};
```
