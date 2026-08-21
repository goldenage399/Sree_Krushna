# Incident Report: INC-014 — Preflight Gate Empty Wiring Schema Validation Loop

**Date**: 2026-06-18  
**Status**: RESOLVED  
**ID**: INC-014  
**Track**: Governance (Remediation)

---

## 1. Executive Summary

During the execution of the governance remediation steps, running the preflight gate check (`npm run preflight`) failed due to a schema validation error. Modifying an existing workflow file (`.agent/workflows/plan-review.md`) triggered the P82 governance change validator (`verify-governance-wiring.cjs`).

Because the changes modified an existing file instead of adding a *new* governance file, the verifier script, running in diff mode (without `--all`), populated `governance-wiring.json` with an empty classes and artifacts array. This violated the GAWC schema (`governance-wiring.schema.json`), which enforces `minItems: 1` on the `classes` property. Consequently, `npm run preflight` failed, creating a blocker loop in the commit pipeline.

The issue was resolved by refactoring the verifier script so that the `--emit` flag always performs a full catalog scan (ensuring `governance-wiring.json` is a complete projection of the entire workspace), while the exit code remains focused strictly on the diff changeset.

---

## 2. Architectural Surface Mapping (6-Surface Audit)

### 1. UI Surface
- **Impact**: N/A. The bug was entirely localized to pre-commit tooling, validation scripts, and schema serialization; no client UI components or stylesheets were affected.

### 2. Data Surface
- **Impact**: N/A. No Firestore collections, schema fields, or database write patterns were affected.

### 3. Reactive Surface
- **Impact**: N/A. No React hooks, contexts, state setters, or lifecycle listeners were involved.

### 4. Service Surface
- **Impact**: N/A. No external APIs, Cloud Functions, or user authentication flows were modified.

### 5. Module Surface
- **Impact**: N/A. No dependency changes, exports, or module layer boundaries were breached.

### 6. Governance Surface
- **Impact**: The P82 verification gate failed because the emitted GAWC projection was dynamically truncated in diff mode. In addition, the volumetric session-open check threatened to block non-interactive/CI runners since it was not bypassed.
- **Correction**: (1) Updated `verify-governance-wiring.cjs` to run a full check when building the emitted graph, keeping the graph complete and valid under all run modes. (2) Added a `process.env.CI` bypass to the preflight session validation check.

---

## 3. Root Cause Analysis

The root cause was a design mismatch between the GAWC graph schema requirements and the verifier script's generation scope. The schema was designed to validate a complete model of the workspace's governance relationships, whereas the verifier script was generating the output graph dynamically based on the current run mode. When run in diff mode on a changeset with no new files, the output was empty and failed to satisfy schema constraints.

---

## 4. Invariants and Corrective Standards

To prevent recurrence:
1. **P82 Projection Stability**: Generated projection graphs (like `governance-wiring.json`) must always compile a full representation of the workspace state rather than representing transient, incomplete git diff states.
2. **Pre-commit Automation Safeguards**: Environment checks (like `process.env.CI`) must be utilized to prevent local state checks (such as session-open timestamps) from breaking automated runner pipelines.

---

## 5. Verification

- **Governance Schema Check**: Run `npm run verify:governance-schema` to confirm the emitted file passes validation.
- **Preflight Gate**: Run `npm run preflight` to confirm the changeset is completely clean.
