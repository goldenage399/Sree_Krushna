# Architecture Council Session: Universal Sheet-Drive Media Relay Skill, Portable Pattern & SAP Sync Package

**Session ID**: `AC-2026-055`  
**Date**: 2026-09-26  
**Ruling Reference**: `AC-DEC-2026-055`  
**Cluster**: `[INFRASTRUCTURE]` & `[GOVERNANCE]`  
**Enhancement Target**: `SK-015` (Universal Reusable Skill & Standard)  
**Governing Standard**: `SOP-WFL-ARCH-COUNCIL-001` (Council Deliberation Protocol v1.0) & `/plan-review`  
**Precedence Ladder**: `AC-DEC-2026-051` (Multi-Provider Cloud Storage) &rarr; `AC-DEC-2026-052` (PIOps Webhook Port) &rarr; `AC-DEC-2026-054` (Sheet-Configured Media Hierarchy) &rarr; `AC-DEC-2026-055` (Universal Sheet-Drive Media Relay Skill & SAP Sync Package)

---

## 🏛️ Executive Summary & Context

Following the certification of `AC-DEC-2026-054`, the host planning authority mandated:
> *"Before we proceed with the implementation of the same, the entire storage structure that we just discussed must be reusable and hence it must be presented as a workflow or a skill that can be reused at any point of time in any of the repos using SapSync. So please prepare a single workflow or a skill that understands the entire structure that we have been discussing and preparing, and we already know that it works because of the other repos history. Let's create a reusable pattern and standard before we even proceed with the implementation plan."*

This council convenes to formally design, standardize, and ratify the **Universal Sheet-Drive Media Relay & Audit Ledger System** as an exportable SAP capability (`STD-DRIVE-MEDIA-RELAY-001` / `.agent/skills/sheet-drive-relay`), decoupling the reusable ecosystem standard from local repository implementations.

---

## 📋 Phase 0: Ground Truth & Evidence Collection (The 4 Anchors)

### 1. Maturity Anchor (Reality-First Grounding — RFG-001)
- **Historical Evidence**:
  - `PIOperationsMgmt_Firebase`: Proved zero-CORS `text/plain` POST to GAS webhooks bypasses browser preflight issues, but suffered timeouts due to uncompressed 10MB payloads.
  - `Unified_Uploader/src/4_1_ImageUpload.js`: Proved that Google Sheets (`ImageUploader` / `DocLinks`) with 10-minute in-memory caching (`CacheService`) effectively manages folder IDs, but had tight coupling to legacy sheet dialogs.
  - `Sree_Krushna`: Proved client-side offscreen Canvas downscaling (2048px 2K QHD, 0.88 quality, <1.2MB payload) completely eradicates GAS timeouts and delivers tack-sharp zoom via Google UserContent CDN (`lh3.googleusercontent.com/d/{id}=w2048`).
- **SAP Ecosystem Need**: Other repositories (`Task-Dashboard`, `Capsicum`, `BMS`, `UG-Farmhouse`, `QSR`) require zero-billing media and document intake pipelines without rewriting ad-hoc Google Apps Script code each time.

### 2. Evidence Anchor (Structural Files & Standards)
- Standards Catalog: `.agent/standards-catalog.json` (currently 8 standards).
- Skill Router: `.agent/skill-router.yaml` (routes agent intents across 9 SAP repos).
- SAP Sync Engine: `.agent/workflows/sap-sync.md` (distributes universal packages across repos).
- Boundary Isolations: `<!-- shared:std.agent.sheet-drive-relay.core:start/end -->`.

### 3. Precedence Anchor
- `STD-MOD-COMP-001` / `P-MOD-COMP-001`: Decoupled component architecture.
- `STD-PHASED-DEV-001` / `P-TICKET-FIRST-PHASING-001`: Mandatory ticket scaffolding before multi-phase execution.
- `P-SSOT-DOCS`: Hub-and-spoke documentation standard.

### 4. Reversibility Anchor
- Creating the reusable skill and standard in `.agent/skills/sheet-drive-relay` and `.agent/patterns/` is strictly additive.
- It does not modify existing client code or disrupt `SK-011` / `SK-014` execution.
- It guarantees that when `SK-014` is implemented, it directly instantiates the canonical SAP standard rather than an ad-hoc local implementation.

---

## ⚖️ Phase 1: Comparative Options Evaluation & Multi-Disciplinary Council Review

### Comparative Evaluation Matrix

| Architectural Axis | Option A: Reusable Operational Skill Only | Option B: Procedural Workflow & Pattern Only | Option C (Certified Hybrid): Universal SAP Triad Package |
| :--- | :--- | :--- | :--- |
| **Packaging Surface** | `.agent/skills/sheet-drive-relay/` | `.agent/workflows/portable/` + `.agent/patterns/` | **Complete Triad**: Standard Pattern (`.agent/patterns/`) + Portable Skill (`.agent/skills/sheet-drive-relay/`) + Portable Workflow (`.agent/workflows/portable/`) |
| **Template Reusability** | Templates embedded in skill folder | No bundled templates; manual code writing | **Turnkey Bundled Templates**: Parameterized `MediaRelay.template.js`, declarative `SHEET_SCHEMA_SPEC.md`, `deploy-gas-relay.cjs`, and `appsscript.json` |
| **SAP Sync Distribution** | Synced via skill-router | Synced via patterns | **100% Lossless SAP Distribution**: Automatically distributed via `sap-sync` across all 9 SAP repos with universal boundary markers |
| **Agent Discoverability** | Discovered by agents reading skills | Discovered via slash command | **Dual-Harness Discoverability**: Registered in `.agent/skill-router.yaml` and `.claude/skills/` with triggers (`"setup drive upload"`, `"sheet drive relay"`, `"/sheet-drive-relay"`) |
| **Complexity Score** | Low | Low | **Optimal High-Utility**: Zero boilerplate duplication; provides exact turnkey files for instant instantiation in any repo |

---

### Council Member Deliberations

#### 1. SSOT Authority Auditor (`ssot-reconciliation`)
> **Position**: SUPPORT HYBRID OPTION C.  
> **Evidence**: Creating a formal standard `STD-DRIVE-MEDIA-RELAY-001` in `.agent/patterns/sheet-drive-media-relay.md` and registering it in `.agent/standards-catalog.json` elevates the architecture to an enforceable institutional contract. The standard establishes the 5 Prime Invariants: Zero-CORS Simple POST, Two-Tier Sheet Control Plane, Dynamic Hierarchical Folder Provisioning, Universal 2K CDN Resolution, and Automated Clasp Deployment.

#### 2. Schema & Firestore Auditor (`firebase-firestore`)
> **Position**: SUPPORT HYBRID OPTION C.  
> **Evidence**: A reusable skill must define the exact decoupled boundary between the Google Drive / Sheets layer and the application data layer. By standardizing the JSON webhook response schema `{ success: true, fileId, fileUrl, cdnUrl, subfolderPath }`, any client data layer (whether Firestore, Google Sheets, Supabase, or PostgreSQL) can consume the media relay without schema coupling.

#### 3. Service Layer Integrity Auditor (`debug-backend` / `cos-invoke`)
> **Position**: SUPPORT HYBRID OPTION C.  
> **Evidence**: In `Unified_Uploader`, the backend was tightly coupled to Google Sheets UI (`HtmlService.createHtmlOutputFromFile('4_2_UploadSideBar')`). The reusable skill must enforce pure headless execution in `doPost(e)`, making the webhook completely agnostic of whether callers are web SPAs, mobile apps, or backend workers.

#### 4. Dependency & Impact Auditor (`change-impact-analysis`)
> **Position**: SUPPORT HYBRID OPTION C.  
> **Evidence**: Distributing this capability as an isolated skill in `.agent/skills/sheet-drive-relay/` has zero blast radius on existing application controllers. It establishes a clean upstream dependency that `SK-014` can consume without circular dependencies.

#### 5. File Placement Auditor (`file-placement-guardrail`)
> **Position**: SUPPORT HYBRID OPTION C.  
> **Evidence**: In strict conformance with SAP file taxonomy:
> - Canonical Standard: `.agent/patterns/sheet-drive-media-relay.md`
> - Portable Skill: `.agent/skills/sheet-drive-relay/SKILL.md`
> - Portable Workflow: `.agent/workflows/portable/sheet-drive-media-relay.md`
> - Skill Templates: `.agent/skills/sheet-drive-relay/templates/`
> - Dual Mirror: `.claude/skills/sheet-drive-relay/`
> - Catalog Registration: `.agent/standards-catalog.json` & `.agent/skill-router.yaml`.

#### 6. Auth & Permission Auditor (`protocol-enforcer-pre-code`)
> **Position**: SUPPORT HYBRID OPTION C.  
> **Evidence**: The reusable skill standardizes the Family/Team Allowlist RBAC pattern, supporting dynamic sheet-configured authorization lists as well as environment fallback, ensuring unauthenticated external actors cannot flood the storage quota.

#### 7. Maintainability & Velocity Auditor (`ponytail` / RFG-001)
> **Position**: SUPPORT HYBRID OPTION C.  
> **Evidence**: Grounded in real repo history across PIOps, Unified Uploader, and Sree Krushna. Packaging this once as a reusable SAP skill prevents future agents from reinventing Drive webhooks, CORS workarounds, and folder lookups from scratch.

---

## 📜 Phase 2: Council Synthesis & Certified Architecture Ruling

### Decision Reference: `AC-DEC-2026-055`
**Status**: APPROVED & CERTIFIED  
**Title**: Universal Sheet-Drive Media Relay Skill, Portable Pattern & SAP Sync Package  

The Architecture Council unanimously rules:
1. **Canonical Standard Specification (`STD-DRIVE-MEDIA-RELAY-001`)**:
   - Establish `.agent/patterns/sheet-drive-media-relay.md` formalizing the 5 Universal Invariants:
     1. Zero-CORS Simple POST Relay Protocol (`Content-Type: text/plain`).
     2. Browser-Side 2K QHD Offscreen Canvas Budgeting (<1.2MB payload).
     3. Two-Tier Google Sheet Control Plane (`Config_Routing` + `Upload_Ledger`).
     4. Dynamic Hierarchical Folder Auto-Provisioning with 10-Minute `CacheService` TTL.
     5. Cross-Platform Clasp Pipeline with Pre-Flight Syntax Validation Gate.
2. **Universal Skill Scaffolding (`sheet-drive-relay`)**:
   - Scaffold `.agent/skills/sheet-drive-relay/SKILL.md` (and dual-mirror `.claude/skills/sheet-drive-relay/SKILL.md`).
   - Bundle turnkey parameterized templates:
     - `templates/MediaRelay.template.js`
     - `templates/appsscript.json`
     - `templates/deploy-gas-relay.cjs`
     - `resources/SHEET_SCHEMA_SPEC.md`
3. **Cross-Repo SAP Integration**:
   - Register `STD-DRIVE-MEDIA-RELAY-001` in `.agent/standards-catalog.json`.
   - Register skill `sheet-drive-relay` in `.agent/skill-router.yaml` and reference in `GEMINI.md` / `CLAUDE.md`.
4. **Mandatory Ticket Phasing**:
   - Register enhancement ticket **`SK-015`** in `enhancement-notes/SK-015/00_ENHANCEMENT_INDEX.md` with a 3-phase sequential DoD matrix.

---

## 📑 Cross-Council Referral Note
- **To UI/UX Council**: No UI changes required. The standard governs serverless cloud relay, folder taxonomy, and spreadsheet ledger mechanics.
