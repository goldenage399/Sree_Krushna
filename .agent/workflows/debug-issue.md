---
description: Systematic issue debugging workflow with mandatory Layer 0 verification
---

# Debug Issue Workflow

> ⛔ **MANDATORY**: Complete Steps 1-2 before ANY code analysis or fix proposal.

## Step 1: STOP & DEFINE (Layer 0 verification)

Before anything else, clearly state:

1. **Expected Behavior**: What should happen?
2. **Actual Behavior**: What is happening instead?
3. **Tool Inventory**: What tools/scripts can I use?
4. **Data Check**: Does the data actually exist? (Layer 0)

```
PROBLEM STATEMENT:
Expected: [X should work]
Actual: [X is not working / shows empty / errors]
Data Check: [Verified in Firebase Console?]
```

---

## Step 2: REPRODUCE

1. Can I make this fail reliably?
2. What are the exact steps?
3. Create a minimal reproduction case if possible.

---

## Step 3: TRACE (+ Bisect)

Only after Steps 1-2:

```
Source (Firebase) -> Adapter -> Logic -> UI
```

**Bisect**: Is it in the backend (Layer 0) or frontend (Layer 3)?

---

## Step 4: EVIDENCE COLLECTION

Before proposing any fix, collect:

- [ ] Console logs showing actual values
- [ ] Layer 0 Check (Admin SDK output)
- [ ] Object keys at each transformation step

> **Frontend layout/overflow/scroll/responsive symptoms**: Static evidence is insufficient.
> Route to [debug-frontend.md](./debug-frontend.md) and pass through the **REG-001 Runtime Evidence Gate** before Step 6.
> Do not propose a layout fix from grep output alone.

---

## Step 5: ROOT CAUSE + HYPOTHESIS

1. Form a hypothesis (e.g., "Permissions").
2. TEST the hypothesis (don't guess).
3. Identify the "Why".

---

## Step 6: FIX + VERIFY + PREVENT

1. Apply fix.
2. Verify resolution (Reproduce Step 2).
3. Prevent recurrence.

---

## Anti-Pattern Warning

| ❌ WRONG                                      | ✅ CORRECT                                             |
| --------------------------------------------- | ------------------------------------------------------ |
| "The useEffect deps are wrong, let me fix it" | "First, do tasks exist in Firestore?"                  |
| "I see a timing issue in the code"            | "Can you check the console for the debug log I added?" |
| Proposing fix without data verification       | Ask user to verify Layer 0 first                       |

---

## Cross-References

- [SYSTEMATIC_DEBUGGING.md](../docs/ssot/testing-hub/SYSTEMATIC_DEBUGGING.md) - 5-Step Method
- [DEBUGGING_HANDBOOK.md](../docs/ssot/testing-hub/DEBUGGING_HANDBOOK.md) - 6-Layer Model, 4-Question Tree
