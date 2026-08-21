# Incident Report: INC-038 — Auth Level Strict Equality Type Mismatch

## Incident Summary

The `isSuperAdmin` flag in `ProjectPresetsTab.jsx` was computed as `level === 1` (strict equality, number literal). The `level` value returned from `useAuth()` is a **string** (sourced from Firestore document data), so the comparison silently evaluated to `false` for all users — including SuperAdmins — making the Edit button permanently invisible regardless of the authenticated user's role.

**Affected Component**: `src/components/ProjectPresetsTab.jsx`  
**Symptom**: Edit button not visible for SuperAdmin in Project Presets tab.  
**Fix**: `parseInt(level) === 1` — coerce to integer before comparing.

---

## Root Cause Analysis

Firestore stores custom claims and user-level fields as strings (e.g., `"1"`, `"2"`). The `useAuth()` context propagates the `level` field **as-is** from the Firestore document, which is a string. Any component performing `level === N` (strict equality against a number literal) will always produce `false` because JavaScript `"1" === 1` is `false`.

```js
// ❌ BEFORE — always false for string-typed level
const isSuperAdmin = level === 1;

// ✅ AFTER — coerces before comparing
const isSuperAdmin = parseInt(level) === 1;
```

The same bug would silently affect any component that checks `level === N`, `level > N`, or `level < N` without coercing first.

---

## Architectural Surface Mapping

1. **UI Surface**: `ProjectPresetsTab.jsx` — Edit button gated on `isSuperAdmin` evaluated to `false`. Edit button was invisible. Fixed with `parseInt(level) === 1`.
2. **Data Surface**: N/A — No schema change. Root cause is in how the Firestore string is consumed, not how it is stored.
3. **Reactive Surface**: `useAuth()` context delivers `level` as a string. The context is the source. Any consumer performing strict numeric comparison without coercion will silently fail. No fix applied to the context itself (would be a breaking change); coercion is the fix contract at the consumer.
4. **Service Surface**: N/A — No Cloud Function or service layer involvement.
5. **Module Surface**: N/A — No routing or package changes.
6. **Governance Surface**: No existing ADR or standard prevents `level === N` strict equality in component code. New Standard **P94** (Auth Level Type Coercion Contract) registered to address this gap.

---

## Corrective Actions & Resolution

1. **Fix at consumer**: Changed `level === 1` to `parseInt(level) === 1` in `ProjectPresetsTab.jsx` (commit `7e8c8764`).
2. **Standard registered**: P94 — Auth Level Comparison Contract. Requires `parseInt(level)` or `Number(level)` before any numeric level comparison at the component/hook layer.

---

## Codebase Coverage Audit

**Grep scan results — `level === N` without parseInt across src/**:**

| File | Line | Pattern | Risk |
|------|------|---------|------|
| `ProjectPresetsTab.jsx` | 92 | `level === 1` | ✅ Fixed (`parseInt`) |
| `TaskManagementPanel.jsx` | 24 | `isSuperAdmin = level === 1` | ⚠️ Same bug — NOT YET FIXED |
| `usePermissions.js` | 46, 50, 96, 105–108 | `level === 1/5/3/2/4` | ⚠️ Pervasive — same bug in hook |
| `useNavigationItems.js` | 80, 103 | `level === 1` | ⚠️ Navigation gating |
| `AuthContext.jsx` | 314–405 | `level === 1/2/3` | ⚠️ Source context itself has comparisons |
| Services (`TaskArchiveService`, `FeatureFlagService`, etc.) | various | `userData.level === 1` | ⚠️ userData.level from Firestore (same origin) |

**Root of the type issue**: `AuthContext.jsx:161` reads `profileData.lvl` from Firestore and passes it directly to `setLevel`. Firestore returns strings. If `DESIGNATION_TO_LEVEL` lookup doesn't match, the raw string propagates. The canonical fix is **at the source**: normalize `level` to a number when calling `setLevel` in `AuthContext`.

**Recommended comprehensive fix (Phase 4 — deferred to next session)**:
- In `AuthContext.jsx`: wrap every `setLevel(x)` call with `setLevel(parseInt(x) || null)` to normalize at the source
- This removes the need for `parseInt()` at every consumer

---

## Prevention & Invariants

- **P94** (registered): All numeric level comparisons (`=== 1`, `> 2`, `< 4`, etc.) MUST coerce first via `parseInt(level)` or `Number(level)`. Raw `level === N` is prohibited in component and hook files.
- The `useAuth()` hook SHOULD document that `level` is a string type to surface the contract at the point of use.
- **Pattern reference**: See GEMINI.md § "P94 — Auth Level Comparison Contract"

---

## Litmus Test

> *"If a new developer touches this codebase tomorrow, is it physically impossible for them to make this same mistake without violating a written protocol?"*

After P94 registration: YES — the standard catalogs `level === N` as a violation pattern. A pre-commit scan or agent reading P94 before writing auth level guards will catch it.
