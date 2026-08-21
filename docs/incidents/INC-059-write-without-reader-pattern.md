# INC-059: Notification Sink — The Write-Without-Reader Pattern

**Date**: 2026-07-11
**Severity**: Medium (silent feature failure — notifications successfully written to DB but invisible to users)
**Branch**: eur-001/m6-ingestion
**Resolution**: Identified gap; remediation deferred via DS-5
**Affected Component**: `src/components/NotificationPanel.jsx`

---

## Symptom

When a manager schedules a task on the calendar (Phase 3), a notification is correctly written to the `notifications` Firestore collection via `NotificationService`. However, the targeted user receives no visual indicator (the bell icon unread count does not increase, and the notification panel does not display the notification). The data goes into a "black hole".

---

## Root Cause

The `NotificationPanel.jsx` component completely bypasses the `notifications` collection. Instead of subscribing to the `notifications` collection via `NotificationService.subscribeToNotifications`, it executes a derived query: it fetches tasks assigned to the user where `status === 'pending'` and transforms those raw task documents into notification objects on the fly.

Because the UI (the reader) and the Service (the writer) target completely different data models/collections, any new feature (like Calendar Phase 3 or DelegationService) that writes to the true `notifications` collection will result in dead-end data that the user can never see.

---

## Architectural Surface Mapping

| Surface | Affected? | Detail |
| :--- | :--- | :--- |
| **UI Surface** | ✅ YES | `NotificationPanel` is functionally disconnected from the real notification data stream. |
| **Data Surface** | ✅ YES | Two competing notification concepts: true documents in `notifications` vs derived documents mapped from `tasks`. |
| **Reactive Surface** | ❌ N/A | Component reactivity is functioning normally for the derived task query. |
| **Service Surface** | ✅ YES | `NotificationService` acts as a write-only sink for multiple features. |
| **Module Surface** | ❌ N/A | Not a routing/registration issue. |
| **Governance Surface** | ✅ YES | A new invariant is needed to enforce that database writes must have corresponding UI reads. |

---

## Invariant Gap Identified

The system allowed the creation and expansion of a service (`NotificationService`) that writes to a collection without validating that a UI component actually reads from that collection. 

This anti-pattern is captured in `.agent/patterns/write-without-reader.md`.
A new standard rule has been added to `GEMINI.md` to prevent this class of architectural divergence.

---

## Resolution Status

The gap was caught during Phase 3 calendar scheduling implementation. Instead of derailing the current feature with a massive UI rewrite, the technical debt is explicitly logged in the TASK-214 tracker as **DS-5 (Notification read-path wiring)**. The enhancement cannot be closed until DS-5 is resolved or explicitly dropped.
