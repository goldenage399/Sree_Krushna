---
pattern: in-context-balance-refresh-cache-busting
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: GEMINI.md
    at: "Pattern Activation & PACT-001 Cross-References"
  - file: CLAUDE.md
    at: "Pattern Activation & PACT-001 Cross-References"
triggers: []
portability: universal
canonical_source: PIOperationsMgmt_Firebase
porting_effort: low
---

# In-Context Financial Balance Refresh & Client Cache Invalidation (STD-REC-002)

**Category**: Architectural / Frontend State & Data Freshness Pattern  
**Applies to**: Multi-step financial wizards, daily accounting registers, reconciliation forms, and accounting dashboards  
**Origin**: 2026-09-24 Accounts Step 4 On-Demand Refresh Parity (DEC-20260924-02 / Discussion Thread 260916 Query 7.1)  
**Status**: VALIDATED  

---

## 1. Executive Summary & Core Invariant

> **Standard STD-REC-002 (In-Context Balance Refresh & Cache-Busting Invariant)**:  
> *"When a financial UI displays a historical snapshot, opening balance, or calculated summary from a prior period, the component MUST provide an explicit, in-context on-demand refresh control that invalidates client-side memory cache and queries live backend data without requiring a full page reload."*

Automated backend in-flight self-healing (such as `14_05_MasterAccountsReader.js` self-healing DAR from `Input_Accounts` on missing cash) guarantees data parity on initial load. However, backend automation alone does not protect operators against **client-side in-memory caching traps** when prior dates are updated in parallel tabs, windows, or background reconciliation jobs.

---

## 2. The Failure Mode: The "Stale Memory Cache" Trap

### The Anti-Pattern
```
Operator opens Today's Entry Wizard
  ↓
Step 4 fetches yesterday's closing balance via API (e.g., ₹5,000)
  ↓
Module caches response in memory: varianceSummary = { previousClosing: 5000 }
  ↓
Another manager adjusts yesterday's counter cash in parallel tab (now ₹9,823)
  ↓
Today's wizard is still open: Operator navigates between Steps 1, 2, 3, 4
  ↓
Step 4 executes: if (!varianceSummary) { ... } -> SKIPS FETCH
  ↓
UI displays stale ₹5,000 opening balance, triggering false ₹4,823 variance alarm!
```

### Why It Fails
1. **Memory Cache Blindness**: Client caching (`if (!varianceSummary)`) optimizes for low API calls but blinds the UI thread to external state changes occurring during long-running entry sessions.
2. **Loss of Operator Trust**: When cashiers know yesterday's cash was fixed, seeing yesterday's old closing balance inside today's wizard creates high anxiety and prompts duplicate support tickets.
3. **Destructive Reload Workaround**: Without an in-context refresh button, the only way to bust the cache is a hard browser reload (`F5`), which wipes unsaved drafts in the active form steps.

---

## 3. The 6-Point Implementation Standard (STD-REC-002)

Every in-context balance refresh implementation must adhere to these 6 invariants:

1. **5-Second Debounce Lock**:
   - The button must set a module-level lock (`isRefreshing = true`) and disable itself with a loading state/shimmer.
   - The lock must hold for 5 seconds via `finally` timeout to prevent cashier spamming and Apps Script concurrency throttling.
2. **Explicit Memory Cache Invalidation**:
   - The handler must explicitly set the in-memory cache variable to `null` (`varianceSummary = null;`) *before* invoking the API.
3. **User Draft Isolation**:
   - The refresh action MUST update *only* the read-only opening balance input (`#w-prevClosing`) and derived calculations.
   - It MUST NEVER reset, wipe, or overwrite operator-entered manual draft counts (`#w-cashAvailable`).
4. **Real-Time Equation Recalculation Cascade**:
   - Upon receiving the fresh balance, the handler must trigger the equation recalculation routine (`populateCashPositionTable()`).
   - Expected cash (`#w-expectedCash`), table breakdown cells (`eq-opening`, `eq-expected`), and variance indicators must synchronize instantly.
5. **Non-Destructive Graceful Fallback**:
   - If a transient network glitch occurs during the refresh, the `catch` block MUST retain the existing displayed balance and surface a gentle toast notification.
   - It must never reset the balance to `0` (which would trigger a false cash deficit panic).
6. **View-Only State Enforcement**:
   - If the active date is finalized or locked (`isViewOnly = true`), the refresh button must be disabled with a descriptive tooltip to prevent unnecessary API churn.

---

## 4. Concrete Reference Implementation

```javascript
// Example in financial registers / wizard components

let isRefreshingPrevClosing = false;

async function handleRefreshPreviousClosing() {
  if (isRefreshingPrevClosing) return;

  isRefreshingPrevClosing = true;
  const btn = document.getElementById('btn-refresh-prev-closing');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-text-shimmer">⏳ Fetching...</span>';
  }

  // 1. Invalidate local in-memory cache
  varianceSummary = null;

  try {
    // 2. Fetch fresh live data from self-healing backend
    varianceSummary = await callBackend('getVarianceSummary', {
      locationId: globalLocation.key,
      date: entryDate
    });

    const prevClosing = varianceSummary?.previousClosing || 0;
    const prevDate = varianceSummary?.previousDate || 'yesterday';

    // 3. Update DOM targets (isolate from manual cashAvailable input)
    const prevClosingInput = document.getElementById('w-prevClosing');
    if (prevClosingInput) {
      prevClosingInput.value = `₹${Number(prevClosing).toLocaleString('en-IN')}`;
    }
    const prevDateSpan = document.getElementById('w-prevClosingDate');
    if (prevDateSpan) {
      prevDateSpan.textContent = prevDate;
    }

    // 4. Cascade dynamic expected cash calculation
    populateCashPositionTable();

    if (typeof showToast === 'function') {
      showToast('Previous day closing balance refreshed from sheets.', 'success');
    }
  } catch (error) {
    console.error('[Wizard] Error refreshing previous closing balance:', error);
    if (typeof showToast === 'function') {
      showToast('Failed to refresh balance. Keeping current value.', 'warning');
    }
  } finally {
    // 5. Release debounce after 5 seconds
    setTimeout(() => {
      isRefreshingPrevClosing = false;
      const rBtn = document.getElementById('btn-refresh-prev-closing');
      if (rBtn) {
        rBtn.disabled = false;
        rBtn.innerHTML = '🔄 Refresh';
      }
    }, 5000);
  }
}
```

---

## 5. Verification & Tripwire Tests

The presence and behavior of this pattern is enforced by automated tests in client modules:
- Asserts `#btn-refresh-prev-closing` and `#w-prevClosing` are rendered in balance reconciliation steps.
- Asserts `handleRefreshPreviousClosing` explicitly sets `varianceSummary = null`.
- Asserts 5-second debounce timeout is enforced.
- Simulates rapid consecutive clicks to confirm subsequent requests are blocked while the lock is active.
