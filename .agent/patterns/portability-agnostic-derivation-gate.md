---
pattern: portability-agnostic-derivation-gate
activation_tier: reference
canonical_source: task-dashboard
status: HYPOTHESIS
triggers: ["portability gate", "P108", "agnostic derivation", "do not blind copy", "/portability-gate"]
consumed_by:
  - file: CLAUDE.md
    at: "Pattern Activation and PACT-001 Cross-References"
  - file: .agent/workflows/plan.md
    at: "Step 0.1: Universal Patterns Reference Check"

---

# Portability & Agnostic Derivation Gate Pattern

**Intent**: Prevent blind copy-paste of repository-private workflows, collections, and component contracts during cross-repo synchronization. Enforce agnostic derivation, 3-tier classification, and reference-based adoption.

---

## 1. Context & Problem
When synchronizing governance between a hub and multiple spokes, a common failure mode is **over-synchronization**—copying repo-private workflows (e.g. workflows hardcoded to internal Firestore schemas or specific component hierarchies) into spokes where they become dead code or cause runtime errors.

---

## 2. Invariant Rules
1. **Never copy repo-bound workflows**: Any workflow referencing repo-private collections (`checklist_templates`, `audit_logs`, `AdminShell.jsx`) must be blacklisted from universal bootstrap.
2. **Stack Fingerprinting**: Stack-specific tooling (Firebase, GAS, React) must only deploy if the target repository contains corresponding stack markers (`firebase.json`, `.clasp.json`, etc.).
3. **Agnostic Portability First**: When porting logic across repos, abstract the core principle into `.agent/workflows/portable/` and reference it rather than duplicating implementation details.