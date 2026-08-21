---
pattern: rules-enforcement-testing-no-emulator
activation_tier: routed
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

triggers:
  - "test firestore rules"
  - "verify security rules"
  - "non-member denial test"
  - "permission-denied test"
  - "test rules without emulator"
  - "verify rules enforcement"
guard: ""
portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Pattern: Rules-Enforcement Testing Without an Emulator

**Category**: Investigation Methodology
**Applies to**: Any task requiring proof that a Firestore security rule actually denies unauthorized access — DoD gates, council validation gates, post-deploy verification — in a production-only environment (ADR-002 D7: no dev/emulator project).
**Origin**: 2026-07-13 — TASK-213 DoD closure, "rules ↔ query predicate parity" gate required a real non-member denial test.
**Status**: VALIDATED (used successfully — 3/3 assertions correct against live deployed rules)

---

## Pattern — Rules-Enforcement Testing Without an Emulator

### Problem

You need to prove a Firestore security rule *denies* an unauthorized read/write, not just that the app's query predicates *look* correct on paper. Code review and reading `firestore.rules` prose isn't proof — rules have subtle escape hatches (e.g. a `hasGlobalLevel(N)` fallback that unexpectedly grants broader access than the specific rule branch you're testing suggests). You need to actually attempt the operation as an unauthorized user and observe the real outcome.

### Why the naive approach fails

The tool already in hand — the Admin SDK, via a service-account key (`serviceAccountKey.prod.json`) — is the wrong instrument. **The Admin SDK bypasses Firestore security rules entirely**, by design (it's meant for trusted server contexts). Any read performed with it succeeds regardless of what the rules say, so "querying as a specific user with the admin SDK" proves nothing about enforcement — it only proves the data exists. This is an easy trap: the admin SDK is already imported, already authenticated, and *looks* like it's answering the question, but it's silently answering a different one.

### Solution

1. **Mint, don't authenticate.** Use the Admin SDK for exactly one thing: `admin.auth().createCustomToken(uid)` for a real test account's UID. This does not require knowing their password.
2. **Switch to the client SDK for the actual read.** `signInWithCustomToken(clientAuth, customToken)` via `firebase/auth`, then perform the read via `firebase/firestore`'s client APIs (`getDoc`, `getDocs`, `query`) — never the admin SDK — against the **live deployed** `firestore.rules`. This is the same code path the real app uses, so the test is authoritative.
3. **Always pair a denial test with a positive control.** Test the same actor reading something they're supposed to see (e.g. a task in their own project) in the same run. A denial alone doesn't distinguish "rules correctly scoped" from "rules broken and denying everyone" — the positive control does.
4. **Get explicit user approval before running it.** Impersonating a real named user's identity — even read-only, even via a legitimate mechanism — is exactly the kind of action a permission-conscious environment should gate on explicit authorization, not infer from a general "verify this" request. State the mechanism plainly (whose account, what will be read, that it's read-only) and let the user decide.
5. **Run it as a throwaway script, not permanent infra.** Write it once (repo root, so `require()` resolves against `node_modules`), run it, delete it immediately after — including any scratchpad copy. No emulator config, no test framework, no permanent artifact; this is a one-shot verification, not a regression suite (a real suite would use `@firebase/rules-unit-testing` against the emulator instead — that's the tool to reach for if repeated/automated rules testing becomes a recurring need, not for a one-off DoD closure).

### Failure Mode

If applied incorrectly: querying with the admin SDK and reporting "read succeeded, so the user isn't blocked" (or the inverse) as if it were a rules-enforcement finding. Every such finding would be **meaningless** — the admin SDK's success/failure has zero correlation with what a real, non-privileged client would experience. A reviewer trusting an admin-SDK-based "denial test" would sign off on a DoD gate that was never actually tested.

### Task-Dashboard instance

- **First (wrong) attempt**: an inline `node -e` one-liner using the admin SDK to directly query `tasks where projectId == 'fcit'` — this would have proven data existence, not rule enforcement, and was separately halted by the environment's action classifier before it ran (flagged as an unreviewed direct-prod-read pattern).
- **Correct execution**: `admin.auth().createCustomToken()` for `marketing.liaisonexecutive.pe@gmail.com` (level 5, member of 4 projects, not a member of `fcit`) → client SDK sign-in → `getDoc` on an `fcit` task (denied, `permission-denied`) + `getDoc` on one of her own project's tasks (succeeded, positive control) + `getDocs` on the foreign task's `events` subcollection (denied). All 3 assertions matched expectation.
- **Approval checkpoint**: the environment's classifier separately flagged the custom-token mechanism itself (real-user impersonation) and required standalone chat approval before the script was allowed to run — confirming step 4 above is enforced, not optional, in this environment.
- **Closed**: TASK-213 DoD row "Rules ↔ query predicate parity verified end-to-end," commit `ad7bafc7`.
