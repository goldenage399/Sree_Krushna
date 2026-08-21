---
pattern: anti-masking-fallback-layers
activation_tier: reference
status: VALIDATED
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

portability: universal
canonical_source: task-dashboard
porting_effort: low
---

# Anti-Masking Fallback Layers (Security & Data Desync Muting)

**Category**: Anti-Pattern & Design Gate  
**Applies to**: Service hydration, error handling, fallbacks, Architecture Council evaluations, database debugging  
**Origin**: 2026-08-08 (Session analyzing `MyAssignmentsModal` "Unknown Project" defect, thread `260806_errors.md` lines 1114–1500)  
**Status**: VALIDATED  

---

## Anti-Pattern — Masking Security & Data-Desync Alarms with Fallbacks

### What it is
Introducing client-side UI fallback layers, default formatting strings, or try/catch swallowed fallbacks when a database fetch fails, without first verifying *why* the fetch failed. 

### Symptoms
1. UI components display generic fallback labels (e.g. `'Unknown Project'`, `'Unknown Profile'`, `'General'`) or render empty strings.
2. Service methods catch all errors in a `try/catch` block and silently return `null` or a default fallback object.
3. Security rule rejections (`FirebaseError: Missing or insufficient permissions`) are swallowed and converted into missing data fallbacks.
4. Agents propose new multi-tier fallback architectures or UI formatting layers to "fix" a display issue without inspecting the live database state first.

### Why it fails
- **Mutes the Alarm**: The fallback string masks a critical security rule failure or data desynchronization (such as an un-synced `user.projectLevels` map or missing claims), allowing the underlying defect to silently break access control and filtering across the rest of the application.
- **Wasted Architecture Overhead**: Creates redundant code complexity (e.g., multi-tier lookup strategies) when the actual problem is a single stale database record or an unexecuted repair script.
- **Renders Incorrect / Blank Data**: Fallback functions may produce blank strings for valid edge cases (e.g., `formatProjectName('default_project')` returning `''`), worsening the presentation issue.

### Correction
1. **Always Inspect Live Database Truth First (Layer 0 Check)**: Run a live data inspection (`db-inspect` or check `scripts/` for existing repair tools like `node scripts/repair-profile-assignments.cjs`) before forming diagnostic hypotheses or proposing code changes.
2. **Differentiate Security Rejections from Missing Data**: Service hydration methods must log explicit errors or re-throw when receiving `permission-denied` rather than swallowing the error into `null`.
3. **Execute Root-Cause Repair over Symptom Patching**: Fix the underlying data desynchronization or security rule mismatch at the root instead of adding UI masks.

### Task-Dashboard Instance
In `MyAssignmentsModal.jsx` and `AssignmentService.js`, when users saw `"Unknown Project"`, the AI agent hypothesized missing Firestore project documents and convened an Architecture Council to ratify a 3-tier fallback layer. In reality:
- All 5 project documents existed in Firestore with correct names.
- The users had active profile assignments, but their `user.projectLevels` map in Firestore was empty (`{}`), causing Firestore security rules (`isProjectMember()`) to reject `projects/{id}` reads with `permission-denied`.
- `AssignmentService.getProjectDetails()` caught `permission-denied` and returned `null`, which evaluated to `'Unknown Project'`.
- Applying `node scripts/repair-profile-assignments.cjs --apply` repaired `projectLevels` and claims in 4 seconds, resolving the issue at root cause without adding any code tiers or masks.
