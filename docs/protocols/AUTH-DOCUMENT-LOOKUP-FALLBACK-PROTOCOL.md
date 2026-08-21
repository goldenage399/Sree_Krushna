# 🔐 ADLF-001 — Auth Document Lookup Fallback Protocol

**Status**: ⚠️ **MANDATORY**  
**Date**: 2026-05-15  
**Priority**: 🔥 **HIGHEST**  
**Triggered By**: PIR-001 (AuthContext silent role assignment failure)  
**Invariant**: ARCH-INV-005  
**Automated Check**: `npm run check:auth-fallbacks`

---

## Problem This Prevents

A missing `else` branch on any `if (snap.exists())` check in an auth-critical code path causes **silent no-op execution** — the code completes without setting `role` or `level`, leaving the user on an infinite spinner or blank screen with no error, no log, and no recovery.

This is specifically dangerous in `onAuthStateChanged` because:
- `setLoading(false)` fires regardless
- The UI spinner guard sees `active && !role` and waits forever
- There is no visible error — it looks like a slow network

---

## The Rule

> **Every `getDoc()` call in an auth-critical file that is followed by `if (snap.exists())` MUST have a corresponding `else` branch that sets role/level from fallback data or explicitly handles the failure.**

Auth-critical files:
- `src/contexts/AuthContext.jsx`
- `src/contexts/ProfileContext.jsx` (if exists)
- Any file imported directly by `AuthProvider`

---

## Pattern Reference

### ❌ VIOLATION — Missing else (silent no-op)

```javascript
if (data.profileId) {
  const profileSnap = await getDoc(doc(db, 'profiles', data.profileId));

  if (profileSnap.exists()) {
    setRole(profileSnap.data().role);
    setLevel(profileSnap.data().lvl);
  }
  // ❌ No else — if profile missing, role/level stay null
  // ❌ setLoading(false) fires → HomeRedirect infinite spinner
}
```

### ✅ CORRECT — With fallback else

```javascript
if (data.profileId) {
  const profileSnap = await getDoc(doc(db, 'profiles', data.profileId));

  if (profileSnap.exists()) {
    const profileData = profileSnap.data();
    setRole(data.role || LEVEL_TO_ROLE[profileData.lvl] || 'associate');
    setLevel(profileData.lvl);
    setProfile(profileData);
  } else {
    // ✅ Profile doc not found — fall back to user's own fields
    console.warn('⚠️ ADLF-001: Profile doc not found for profileId:', data.profileId);
    const userLevel = data.level || (data.designation && DESIGNATION_TO_LEVEL[data.designation]) || null;
    const userRole = data.role || LEVEL_TO_ROLE[userLevel] || 'associate';
    setRole(userRole);
    setLevel(userLevel || ROLE_TO_LEVEL[data.role] || 4);
    setProfile(null);
  }
}
```

---

## Safety Net Pattern

**Always add a final guard** before `setLoading(false)` in `onAuthStateChanged`. This catches any future code path that silently skips role assignment:

```javascript
// ADLF-001 Safety Net — catches any future missing-else before setLoading(false)
if (userData?.status === USER_STATUS.ACTIVE && !role) {
  console.error('⛔ ADLF-001 SAFETY NET: Active user reached setLoading(false) with no role — defaulting', {
    uid: currentUser.uid,
    dataRole: data.role,
    dataLevel: data.level,
    profileId: data.profileId
  });
  setRole(data.role || 'associate');
  setLevel(data.level || 4);
}
setLoading(false);
```

---

## Enforcement

### Automated (run before any auth file changes)
```bash
npm run check:auth-fallbacks
```
Scans auth-critical files for `snap.exists()` without a corresponding `else`. Exits non-zero on violation.

### Manual (code review checklist)
Before merging any change to `AuthContext.jsx`:
- [ ] Every `getDoc()` result is followed by `if (snap.exists()) { ... } else { ... }`
- [ ] Every `else` branch sets `role` and `level` from fallback data
- [ ] Safety-net guard is present before `setLoading(false)`
- [ ] No migration script writes a Firestore reference ID without verifying the target doc exists

### Architectural Invariant
ARCH-INV-005 in `.cache/architectural-invariants.jsonl` — auto-loaded when modifying auth files.

---

## Migration Script Requirements

Any script that writes a Firestore reference field (`profileId`, `teamId`, `assignedTo`, etc.) **must** validate the target exists:

```javascript
// Required pattern for all migration scripts
async function validateReference(collectionName, docId, context) {
  const snap = await getDoc(doc(db, collectionName, docId));
  if (!snap.exists()) {
    throw new Error(`ADLF-001: Reference integrity failure — ${collectionName}/${docId} not found (context: ${context})`);
  }
}
```

---

## Related Documents

- [PIR-001](../../User_Created/Docs/PIR-001-AuthContext-ProfileNotFound-2026-05-15.md) — Post-incident report
- [ARCH-INV-005](.cache/architectural-invariants.jsonl) — Architectural invariant
- [AuthContext.jsx](../../src/contexts/AuthContext.jsx) — Primary enforced file
