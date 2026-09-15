# 🏛️ Architecture & UI Council Decision Record: Collaborative Options & Multi-Tier Discussion Model

**Decision Reference:** `AC-DEC-2026-021` / `UI-DEC-2026-017`  
**Standard Reference:** `SPEC-ARCH-COLLAB-001` & `PROP-20260915-COLLAB-OPTIONS` (Collaborative Options & Multi-Tier Discussion Architecture)  
**Parent Frameworks:** `STD-MOD-COMP-001`, `P-COMPARE-SHARE-001`, `P-SSOT-DOCS`, `INC-086`  
**Date:** 2026-09-15  
**Status:** **APPROVED & CERTIFIED**  
**Quorum:** Full Council (8 Seated Domain Auditors + Assigned Dissenter)

---

## 1. Executive Summary & Problem Context

In response to Host Query 2.4 in `260914_Idea_Incubator.md`, the Architecture Council evaluated shifting the core decision engine of Sree Krushna Marriage OS from a **vote-centric model** (headcount tallies) to a **collaborative options + multi-tier comments model**.

The Council conducted independent evaluations across all 8 architectural domains plus the Assigned Dissenter, verified external web benchmarks for Google Drive direct image normalization and collaborative decision systems (Loomio/Pol.is/Figma models), and ratified **`AC-DEC-2026-020` / `UI-DEC-2026-016`**.

---

## 2. Grounding Snapshot (RFG-001)

- **Maturity Stage:** Pre-Launch / Live Stakeholder Consensus & Shopping Preparation
- **Active Real Users:** 4–5 real users (Groom, Bride, Sisters, In-Laws, Decorator)
- **Active Web Modules:** 4 distinct surfaces (Task-Dashboard, Decorator Cockpit, Decision Registry, Shopping Registry)
- **Team Size:** 1 Developer + AI Pair Architecture Council
- **Runtime Constraints:** 100% Offline-First PWA baseline, zero runtime npm dependencies in static HTML assemblers, Google Drive thumbnail normalization, lazy on-demand Firestore comment queries.

---

## 3. Comparative Evaluation of Available Options

| Dimension | Option 1: Standalone Proposal in `docs/proposals/` | Option 2: In-Thread Response in `Idea_Incubator.md` | Option 3: Full Architecture Council Blueprint in `Council/` | **Certified Zero-Gap Hybrid Approach** |
| :--- | :--- | :--- | :--- | :--- |
| **Scope** | Canonical specification artifact for permanent system documentation. | Local conversational thread answering Query 2.4 directly. | Formal governance deliberation with audit and risk analysis. | **Fuses all three into a synchronized discussion, SSOT proposal, and certified council ruling.** |
| **Audience** | Technical developers and future maintainers. | Human Host reviewing Q&A in the Idea Incubator. | Governance Council and architectural auditors. | Meets the needs of all three audiences without duplication or drift. |
| **Failure Mode** | Orphaned document without in-thread continuity. | Loses visibility outside the 3,300-line thread; hard to track in SSOT. | Overly bureaucratic without a lightweight proposal file. | **Zero gaps.** Every artifact has an explicit cross-link and verified role. |

---

## 4. Phase 1: Independent Council Deliberation

### 1. The SSOT Authority Auditor
- **Position:** Strongly approve. Canonical proposal belongs in `docs/proposals/` and discussion in `Idea_Incubator.md`. Moving to Option UIDs (`OPT-###`) reinforces `P-ENT-ID`.
- **Evidence:** `P-ENT-ID` mandates standardized 3-digit identifiers. Option UIDs (`OPT-HLD-STL-01`) fit directly into the canonical taxonomy alongside `EVT-###` and `DEC-###`.
- **Assumptions:** Option UIDs are immutable once generated.
- **Trade-offs:** Additional entity layer to track in registries.
- **Risks & Dependencies:** None.
- **Challenge:** *"If users generate Option UIDs dynamically, will they collide with predefined master decision numbers like DEC-14?"*
  - *Resolution:* Strict prefix namespacing: `OPT-` for crowd-contributed candidate options, `DEC-` for governance decisions, `PLATE-` for vetted visual plates.
- **Confidence:** High.

### 2. The Schema & Firestore Auditor
- **Position:** Approve with lazy-loading subcollections. Do not embed unbounded comment arrays inside Option documents.
- **Evidence:** Firestore documents have a 1MB limit. Storing comments as a subcollection (`events/{e}/categories/{c}/options/{o}/comments/{m}`) ensures infinite scalability with zero document bloat.
- **Assumptions:** Real-time listeners are only attached when a comment drawer is actively opened.
- **Trade-offs:** Requires Firestore rules updates for the subcollection.
- **Risks & Dependencies:** Security rules must enforce author ownership on comment edits.
- **Challenge:** *"Real-time snapshot listeners on every option's comments could exhaust Firestore free-tier read quotas during active family review sessions."*
  - *Resolution:* Enforce On-Demand Lazy Querying: comments are only fetched when an option card or drawer is clicked.
- **Confidence:** High.

### 3. The Service Layer Integrity Auditor
- **Position:** Approve. Google Drive URL extraction must be implemented as a pure, testable utility function in `ui_primitives/scripts/primitives_core.js`.
- **Evidence:** Regex extraction of Google Drive file IDs and mapping to `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200` has zero external dependencies and runs natively in pure JS.
- **Assumptions:** Image sharing permissions are set to "Anyone with the link" on Google Drive.
- **Trade-offs:** Client cannot fix permission issues on privately restricted Drive links.
- **Risks & Dependencies:** Broken image links if Drive files are deleted by users.
- **Challenge:** *"Google Drive uc?export=view links frequently fail or trigger bandwidth quota throttling under heavy client requests."*
  - *Resolution:* Enforce Google's high-capacity thumbnail endpoint (`drive.google.com/thumbnail?id=...&sz=w1200`) with fallback to `lh3.googleusercontent.com/d/...`.
- **Confidence:** High.

### 4. The Dependency & Impact Auditor
- **Position:** Approve. The comment drawer must be integrated as a shared primitive without altering the existing decision registry layout or breaking byte parity.
- **Evidence:** `ui_primitives/components/` was established under `AC-DEC-2026-019`. The comment drawer can be cleanly added as `ui_primitives/components/comments_drawer.html`.
- **Assumptions:** Modular SDCA assemblers will compile the drawer seamlessly.
- **Trade-offs:** Slight bundle size increase (~4KB).
- **Risks & Dependencies:** CSS scoping must adhere to `INC-086`.
- **Challenge:** *"Adding threaded comments to option cards could clutter the mobile view and disrupt rapid scanning during market trips."*
  - *Resolution:* Keep cards clean on mobile: show a compact comment pill (`💬 3`). Tapping opens a bottom slide-up drawer.
- **Confidence:** High.

### 5. The File Placement Auditor
- **Position:** Approve. Canonical proposal placed in `docs/proposals/PROP-20260915-collaborative-options-and-comments-model.md`, discussion recorded in `260914_Idea_Incubator.md`, and decision logged in `Council_Ledger.md`.
- **Evidence:** Follows the established Spoke-and-Wheel repository taxonomy (`P-SSOT-DOCS`).
- **Assumptions:** All cross-links are verified.
- **Trade-offs:** None.
- **Risks & Dependencies:** None.
- **Challenge:** *"Ensuring that proposal files in docs/proposals/ do not drift from what is discussed in User_Created/Discussion Threads/."*
  - *Resolution:* Synchronize `# Response 2.4 -` in `260914_Idea_Incubator.md` with direct references to `PROP-20260915`.
- **Confidence:** High.

### 6. The Decision & Standards Auditor
- **Position:** Approve. This model successfully evolves the consensus framework without invalidating existing decisions.
- **Evidence:** `P-COMPARE-SHARE-001` is preserved; WhatsApp deep-links are simply extended from cluster-level (`?cluster=...`) to option-level (`?option=H-02`).
- **Assumptions:** Consensus status is retained as a derived state (`ALIGNED`, `LOCKED`).
- **Trade-offs:** None.
- **Risks & Dependencies:** None.
- **Challenge:** *"Replacing votes with comments might make it harder to declare an option officially locked."*
  - *Resolution:* The Host maintains explicit administrative authority to transition an option from `ALIGNED` to `LOCKED` once blocker remarks are resolved.
- **Confidence:** High.

### 7. The Auth & Permission Auditor
- **Position:** Approve with dual-mode access. Family review links must allow anonymous comment submission with display names, while administrative locking requires authenticated Host sign-in.
- **Evidence:** `decision-registry.html` already supports `?mode=family`. The comment payload can store `{ isVerifiedUser: false, guestName: "Aunty Sunita" }`.
- **Assumptions:** Captcha or lightweight rate-limiting prevents comment spam.
- **Trade-offs:** Unverified comments must be flagged as "Family Contributor".
- **Risks & Dependencies:** None.
- **Challenge:** *"Anonymous family commenting could lead to impersonation or spam."*
  - *Resolution:* Host moderation controls: Host can hide any remark with 1 click; localStorage remembers the contributor's entered name.
- **Confidence:** High.

### 8. The Maintainability & Velocity Auditor (Enforcing RFG-001)
- **Position:** Approve as **Required Now** for proposal and architecture lock; recommend phased execution for implementation.
- **Evidence:** The Bride and family are arriving in Bhubaneswar within 10 days. Having this architectural model locked now allows seamless intake of live shopping photos and family comments.
- **Assumptions:** Implementation proceeds in 3 non-breaking phases.
- **Trade-offs:** Implementation effort staged across upcoming cycles.
- **Risks & Dependencies:** None.
- **Challenge:** *"Attempting to build a full real-time chat application inside the static wedding OS could derail current shopping priorities."*
  - *Resolution:* Lightweight, pragmatic implementation: use Google Drive thumbnails for images and lightweight Firestore documents for comments, avoiding heavy custom backend infrastructure.
- **Confidence:** High.

### 9. The Assigned Dissenter (Pragmatic Simplicity Advocate)
- **Position:** Challenge the need for a custom comments system when family members already use WhatsApp. Why not just let users share options to WhatsApp and talk there?
- **Evidence:** WhatsApp is already the ubiquitous communication channel for Indian families.
- **Assumptions:** Family members will open an app drawer instead of just texting in the group chat.
- **Trade-offs:** Building features that might be bypassed for WhatsApp.
- **Risks & Dependencies:** Low adoption of in-app commenting.
- **Challenge:** *"Family members will ignore the in-app comment drawer and simply paste the photo into WhatsApp anyway, rendering in-app comments unused."*
  - *Resolution:* Build the **WhatsApp-to-App Bridge**: WhatsApp deep links point directly to the Option UID card (`?option=H-02`), and the app provides a 1-click button to *"Share Remarks back to WhatsApp"*. In-app remarks act as the permanent structured record of truth, while WhatsApp acts as the notification highway.
- **Confidence:** Medium.

---

## 5. Phase 2: Consolidated Synthesis & Certified Decision

### A. Certified Rulings:
1. **Adopt the 4-Tier Collaborative Taxonomy**: Events (`EVT-###`) → Categories (`CAT-###`) → Option UIDs (`OPT-###` / `H-01`) → Threaded Remarks (`REM-###`).
2. **Standardize Google Drive Thumbnail Endpoint**: All Drive URLs must be parsed for file ID and rendered via `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200` to prevent CORS issues and bandwidth quota blocks.
3. **Consensus as a Derived Alignment Metric**: Retain alignment tracking (Bride + Groom + Sisters sign-offs with 0 unresolved blockers) rather than raw binary voting tallies.
4. **Publish Canonical SSOT Proposal**: Formally approved `docs/proposals/PROP-20260915-collaborative-options-and-comments-model.md`.
5. **Synchronize Discussion Thread**: Populate `# Response 2.4 -` in `User_Created/Discussion Threads/Idea_Incubator/260914_Idea_Incubator.md`.

---

## 6. Recommendation Classification (RFG-001)

| Recommendation | Classification Tag | Rationale |
| :--- | :--- | :--- |
| **1. Publish Proposal & Council Record** | **Required Now** | Locks the conceptual model and answers Query 2.4 comprehensively. |
| **2. Drive URL Normalizer in `primitives_core.js`** | **Required Now** | Lightweight, zero-risk utility enabling Drive image previews. |
| **3. Option UID Generator in Decision Registry** | **Recommended Soon** | Prepares the registry for live shopping photo uploads. |
| **4. Full Threaded Comments Drawer in Firestore** | **Recommended Soon** | Provides structured discussion capabilities before group shopping starts. |
| **5. AI-Assisted Sentiment Consensus Summarizer** | **Future Extension** | Summarizing family comments via LLM; deferred until real comment volume exists. |

---

## 7. Evidence Snapshot & Audit Trail

- **Snapshot Commit:** `57c319f152c7ed4fc10df966c04e3376be8b4b2e`
- **Certified By:** Architecture & UI Council of Sree Krushna Marriage OS
- **Next Step:** Synchronize `260914_Idea_Incubator.md` and present implementation plan.
