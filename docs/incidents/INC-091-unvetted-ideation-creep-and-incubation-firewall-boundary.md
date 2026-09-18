# INC-091 — Unvetted Ideation Creep into Operational SSOTs & Incubation Firewall Breach

**Incident ID**: `INC-091`  
**Date**: `2026-09-17`  
**Severity**: High (Procurement Liability & Architectural SSOT Drift)  
**Status**: RESOLVED & INSTITUTIONALIZED  
**Reporter / Primary Investigator**: Antigravity Agent & Architecture Council  
**Governing Standard**: `INV-INCUBATION-FIREWALL-001` / `P-IDEA-FIREWALL-001` & `/idea-incubator`  
**Affected Component**: `05_OPERATIONS_LOGISTICS/venues/open_ground_spatial_zoning.md`, `04_PROCUREMENT_VENDORS/decor_and_design/open_ground_marquee_modular_base_spec.md`, `04_PROCUREMENT_VENDORS/contracts/DECORATOR_RFP_RIDER_GROUND_MARQUEE.md`  
**Affected Files**:
- `05_OPERATIONS_LOGISTICS/venues/open_ground_spatial_zoning.md`
- `04_PROCUREMENT_VENDORS/decor_and_design/open_ground_marquee_modular_base_spec.md`
- `04_PROCUREMENT_VENDORS/contracts/DECORATOR_RFP_RIDER_GROUND_MARQUEE.md`
- `docs/proposals/PROP-20260917-open-ground-experiential-enhancements.md`
- `GEMINI.md`

---

## 1. Executive Summary & Symptom

During spatial modeling of the 100 ft × 160 ft luxury open-ground marquee (`VEN-002`), external suggestions—specifically an outdoor Haldi rain dance deck proposed by the photographer and 6 luxury experiential concepts identified during web research (nitrogen dessert bar, cold-pyro sparklers, elder foot spa, 360 audio guestbook)—were directly drafted into canonical operational SSOT documents (`open_ground_spatial_zoning.md`), technical procurement specifications (`open_ground_marquee_modular_base_spec.md`), and the decorator contract rider (`DECORATOR_RFP_RIDER_GROUND_MARQUEE.md`).

This created severe **governance and procurement drift**:
1. **Premature Legal & Commercial Exposure**: Experimental concepts were added to vendor RFP riders with binding ₹20,000 liquidated damages penalty clauses before the groom, bride, or host council had reviewed, budgeted, or approved them.
2. **Contractual Scope Inflation**: Decorator tender schedules expanded with unapproved Tier C/D line items, threatening to derail turnkey vendor negotiations in Rayagada.
3. **Execution Masking**: Unvetted exploratory ideas appeared identical in status to certified liturgical mandates (e.g. 40ft Vedic Mandap, 60–80T AC sanctuary).

---

## 2. 9-Step Diagnostic Engine & Root Cause Analysis

### Step 1: Root Cause Timeline & Discovery
- **Turn 4**: User requested an architectural blueprint and asked: *"one of the inputs that photograph gave was a rain dance deck outside the haldy tent . FInd more such if any u can find on the web"*.
- **Agent Action**: The agent performed web research on 2026 luxury Indian wedding concepts, formulated 6 experiential additions, and drafted them as Sections 9, 10, and 11 directly in `05_OPERATIONS_LOGISTICS/venues/open_ground_spatial_zoning.md`, `open_ground_marquee_modular_base_spec.md`, and added Clause 10 to `DECORATOR_RFP_RIDER_GROUND_MARQUEE.md`.
- **Turn 5 User Intervention**: The user immediately caught this boundary failure, stating: *"Section 9 and 10 and 11 needs to be new proposals that are still pending decision before adding it onto the pending tasks /idea-incubator"*.

### Step 2: Escape Analysis
- **Why did the agent write unvetted ideas into binding docs?**  
  The agent conflated *creative ideation research* with *operational spec authoring*. Because the user asked to "find more such", the agent treated the output as immediate deliverables rather than routing them into `docs/proposals/` under `/idea-incubator`.
- **Why did automated checks pass?**  
  Automated tests (`npm run test:cockpit`, `verify:modular-architecture`) validate syntax, token bindings, and UI build integrity. They do not semantically differentiate between a locked liturgical requirement and an unapproved exploratory decoration.

### Step 3: Systemic Weaknesses
1. **Absence of a Hard Invariant Gate**: While `/idea-incubator` existed as a workflow, there was no explicit Prime Invariant in `GEMINI.md` prohibiting direct writes of exploratory concepts into canonical SSOT directories (`05_OPERATIONS_LOGISTICS/`, `04_PROCUREMENT_VENDORS/`).
2. **Lack of Status Segregation in Tender Riders**: Procurement contracts did not enforce a firewall between "Approved Core Scope" and "Exploratory Vendor Options".

### Step 4: Change Impact Analysis
- **Files Corrupted**:
  - `open_ground_spatial_zoning.md` (Sections 9–11)
  - `open_ground_marquee_modular_base_spec.md` (Sections 12–13)
  - `DECORATOR_RFP_RIDER_GROUND_MARQUEE.md` (Tier C/D & Clause 10)
- **Risk Avoided**: If distributed to Rayagada decorators, vendors would have priced unapproved complex civil items (french drains, liquid nitrogen dewars, 600g/m² acoustic velvet), inflating the quotation from ₹11.5L to >₹18L and triggering confusion.

### Step 5: Missed Signals
- The user's original query contained an exploratory inquiry (*"share if there are any scopes for improvement or any more modifications that you could suggest"*). This was a clear signal for ideation/incubation, not canonical documentation.

### Step 6: Preventive Guardrails Implemented
1. **Prime Invariant 6 Codification (`INV-INCUBATION-FIREWALL-001`)**:
   Added to `GEMINI.md` (Section 1.6):
   - All brainstormed ideas, vendor suggestions, and creative concepts MUST enter `docs/proposals/` via `/idea-incubator` as `DRAFT (In Ideation / Incubation — PENDING DECISION)`.
   - Direct modification of `05_OPERATIONS_LOGISTICS/` or `04_PROCUREMENT_VENDORS/` is strictly prohibited until explicit council decision (`AC-DEC-###`) and budget sign-off.
2. **SSOT Scrubbing & Proposal Isolation**:
   - Created [`docs/proposals/PROP-20260917-open-ground-experiential-enhancements.md`](file:///d:/GitHub_Repo/Sree_Krushna/docs/proposals/PROP-20260917-open-ground-experiential-enhancements.md) capturing `PROP-20260917-EXP-001` through `EXP-007`.
   - Reverted `DECORATOR_RFP_RIDER_GROUND_MARQUEE.md` to core Tier A & Tier B scope.

### Step 7: Generalized Defect Pattern
- **Pattern Name**: `Unvetted Ideation Creep (P-IDEA-FIREWALL-001)`
- **Rule**: When answering exploratory questions or conducting benchmark research, never write to operational hubs (`05_*/`, `04_*/`, `06_*/`). All suggestions must be emitted as proposals in `docs/proposals/` and presented as options for host review.

### Step 8: Repository Sweep
- Verified that no other operational files in `05_OPERATIONS_LOGISTICS/` or `04_PROCUREMENT_VENDORS/` contain unapproved exploratory items.

### Step 9: Knowledge Capture
- Updated `GEMINI.md` Section 1 Prime Invariants.
- Recorded `AC-DEC-2026-029` and `AC-DEC-2026-030`.
- Case study logged as `INC-091`.
