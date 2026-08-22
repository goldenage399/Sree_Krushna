---
name: task-firestore-direct-write
description: Write a task doc directly into the tasks collection via an admin script (bypassing the app UI/wizard) so it passes firestore.rules and matches the real schema on first try. Use when asked to "create a task for X", "log this as a task", "add a task in the dashboard" via script/CLI rather than the browser UI.
---

# Direct Firestore Task Write

The app's task-creation wizard (`TaskCreationWizard` → `TaskValidationService`
→ `EnhancedTaskService.createTask`) never runs when you write a task with an
admin script (`serviceAccountKey.prod.json` + `firebase-admin`). Admin SDK
writes **bypass `firestore.rules` entirely**, so a doc that "writes
successfully" can still be missing fields the real app requires — it just
won't fail loudly until something tries to query or render it. This skill
exists so that gap gets caught before the write, not after.

## Procedure

1. **Find a precedent task.** Use `npm run db:search -- "<keyword>"` or
   `node src/scripts/db-inspect.cjs search "<keyword>"` to find an existing
   task that's structurally similar (same kind of assignee, similar project).
   Fetch its **raw** Firestore doc (not the `db-inspect.cjs` pretty-printed
   view, which omits fields) — write a throwaway script that does
   `db.collection('tasks').doc(id).get()` and `console.log(JSON.stringify(doc.data(), null, 2))`.
   The pretty-printer hides `projectId`, `originProfileId`, `escalation`,
   `schemaVersion`, `assignedTo.department`, etc. — exactly the fields that
   matter.

2. **Resolve the assignee profile, not a person.** Tasks assign to
   organizational *profiles* (e.g. `fcit_managing_director_01`), not users.
   Use `node src/scripts/db-inspect.cjs overview` to list profiles by
   project, and `node src/scripts/db-inspect.cjs profile <profileId>` to
   confirm its `title`/`level`/`department`. If the request names a person
   ("MD sir", "the manager"), match them to their profile via
   `node src/scripts/db-inspect.cjs user <email>` — a user can hold several
   profiles across projects; ask which project if it's not obvious from
   context.

3. **Check `firestore.rules` `match /tasks/{taskId}` → `allow create`
   before writing anything.** As of this writing it requires, on the
   document being created:
   - `projectId` — non-null, non-empty (ENH-FIELD-001). This is the
     project **doc ID** (e.g. `"fcit"`), a separate field from `project`
     (display name — often the same string, but they're two keys).
   - `originProfileId` — the profile the task is first assigned to
     (TLM-014, ADR-014). Immutable once set; equals `assignedTo.profileId`
     at creation time.
   - `createdBy.uid` (or `.userId`) matching the actor, OR the actor has
     `hasProjectLevel(projectId, 3)+`.

   Rules bypass silently under the admin SDK — nothing will error if you
   skip these. The failure shows up later as a permission-denied on a
   *client* write, or a doc invisible to a read-rule that filters on
   `projectId`.

4. **Match the full schema**, not just the rule-required subset. Minimum
   viable task doc (field : type, from a real production doc):

   ```js
   {
     title: string,
     description: string,
     priority: 'low'|'medium'|'high'|'critical',
     project: string,            // display name
     projectId: string,          // doc ID — REQUIRED by rules
     projectId,                  // must equal an id in the `projects` collection
     category: null,
     assignee: null,
     department: string,         // top-level, e.g. 'Operations'
     assignees: [],
     createdBy: {
       profileId: null, profileTitle: null, department: null,
       lvl: number, uid: string  // or userId — null-safe checked by rules
     },
     status: 'pending',
     lastActivityBy: string,     // uid
     tags: [],
     deadline: null,
     completionCondition: '',
     visibility: { lvl5: bool, lvl4: bool, lvl3: bool, lvl2: bool, lvl1: bool },
     escalation: {
       isEscalated: false, currentLevel: 0, escalationPath: [],
       escalatedAt: null, escalationReason: null
     },
     originProfileId: string,    // REQUIRED by rules — = assignedTo.profileId
     schemaVersion: 1,
     _derived: null,
     createdAt: serverTimestamp(), lastUpdatedAt: serverTimestamp(),
     lastActivityAt: serverTimestamp(), startDate: serverTimestamp(),
     assignedTo: {
       profileId: string, profileTitle: string,
       department: string,       // REQUIRED per PROFILE_TASK_SCHEMA validator
       lvl: number, userId: null,
       assignedAt: serverTimestamp()
     }
   }
   ```

   Source of truth for the `assignedTo`/`createdBy` shape:
   `src/utils/profileTaskSchema.js` (`PROFILE_TASK_SCHEMA`,
   `validateProfileTaskAssignment` — required: `profileId`, `profileTitle`,
   `department`, `lvl`).

5. **Write the `TASK_CREATED` event.** ARCH-INV-012 (P92) requires every
   `tasks` write path to call `EnhancedTaskService.appendTaskEvent()` in the
   real app — the direct-script equivalent is adding a doc to the
   `tasks/{taskId}/events` subcollection (not a top-level `events`
   collection) with at least `type: 'TASK_CREATED'`, `createdAt`,
   `createdBy`, `meta: { title, priority, assignedProfileId }`. The
   canonical write path *also* logs to the top-level `taskHistory`
   collection (see `EnhancedTaskService.createTask`, though note that
   function's flat schema doesn't match the nested `assignedTo`/`createdBy`
   objects real UI-created tasks actually have — don't copy it verbatim,
   it appears to be a legacy/alternate path).

6. **Verify with `db-inspect.cjs`, not just "no error thrown".** Run
   `node src/scripts/db-inspect.cjs task <newTaskId>` and re-check against
   step 3's rule list and step 4's schema — a successful admin-SDK write
   proves nothing about rule-compliance.

7. **Delete the scratch script.** These are one-off admin scripts
   (`serviceAccountKey.prod.json` + `firebase-admin`), not something to
   leave in the repo — `rm` them after the task is verified, same as any
   other throwaway file.

## When this doesn't apply

If the task should be creatable by a normal user through the browser UI
(not a one-off admin backfill), don't reach for this — use the app's
`TaskCreationWizard` flow instead, which runs `TaskValidationService` and
goes through `firestore.rules` for real. This skill is specifically for
"create a task via script because no one's going to click through the
wizard for this."
