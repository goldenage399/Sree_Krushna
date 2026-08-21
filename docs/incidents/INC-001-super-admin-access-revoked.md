# INC-001 — Super Admin Access Revoked by Faulty Self-Heal

**Date**: 2026-05-17  
**Severity**: Critical (production access loss)  
**Status**: Resolved  
**Affected User**: goldenage399@gmail.com (UID: `1b0mqHTKflWUUt3VMqZdGG20Zk03`)

---

## What Happened

A warning appeared on every login:
```
⚠️ Profile doc not found for profileId: mdSir — falling back to user data
```

Claude Code diagnosed it as a stale `profileId` on the user document pointing to a missing profile doc, and proposed a self-healing fix: remove `profileId` via `deleteField()` in the missing-profile fallback branch of `AuthContext.jsx`.

The fix was applied and the dev server was running. On the next auth state change, the new code ran, called `deleteField()`, and removed `profileId` from the user document. Because `level` and `role` fields were not independently set on the user document (they were sourced from the profile), the fallback branch defaulted to level 4 (associate). All admin-gated modules became inaccessible.

---

## Root Cause

**Faulty assumption**: The fix assumed the user document had `level` and `role` fields independently of the profile document. In reality, those fields were absent from the user doc — the profile was the authoritative source of level/role for this user.

**Compounding factor**: The fix mutated live Firestore data (a destructive write) without first verifying what `data.level` and `data.role` were on the user document.

---

## What Was Wrong With the Fix

The correct response to a stale `profileId` is **not** to delete it automatically. Options that would have been safe:
- Downgrade the `console.warn` to `console.debug` (suppress noise only)
- Prompt the user to manually clear or remap via admin UI
- Write a standalone repair script with explicit dry-run confirmation before touching data

The self-healing pattern is appropriate only when the fallback state is fully self-sufficient. Here it was not.

---

## Resolution

1. **Code reverted**: `deleteField()` call and import removed from `AuthContext.jsx`
2. **Repair script created**: `scripts/repair-super-admin-INC001.cjs`  
   Restores `level: 1`, `role: 'admin'`, `designation: 'super_admin'`, `status: 'active'` on the user document via Admin SDK.

### To restore access

```bash
# Dry-run first
node scripts/repair-super-admin-INC001.cjs --dry-run

# Apply
node scripts/repair-super-admin-INC001.cjs
```

Then reload the app and sign in again.

---

## Lessons Learned

1. **Never auto-delete Firestore fields** based on a missing reference without first reading whether dependent fields exist
2. **Destructive writes are irreversible** — treat them like the risky actions they are; confirm before executing
3. **Self-healing patterns require fallback completeness** — the post-heal state must be fully functional without the removed data
4. **The warning was cosmetic** — the existing fallback already handled the missing profile correctly; the only real fix needed was suppressing or contextualising the log

---

## Files Affected

| File | Change |
|------|--------|
| `src/contexts/AuthContext.jsx` | Reverted: `deleteField` import and call removed |
| `scripts/repair-super-admin-INC001.cjs` | Created: one-time repair script |
| `docs/incidents/INC-001-super-admin-access-revoked.md` | Created: this file |
