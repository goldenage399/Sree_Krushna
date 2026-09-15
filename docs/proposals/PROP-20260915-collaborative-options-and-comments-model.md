# PROP-20260915: Collaborative Options & Multi-Tier Discussion Model

- **Proposal ID**: `PROP-20260915-COLLAB-OPTIONS`
- **Reference**: Query 2.4 (`User_Created/Discussion Threads/Idea_Incubator/260914_Idea_Incubator.md`)
- **Status**: `PROPOSAL (Architecture Council Certified)`
- **Ruling**: `AC-DEC-2026-021` / `UI-DEC-2026-017`
- **Domain**: `[SDCA]` Shared UI Primitives / `[DATA]` Firestore Schema & Data Layer / `[GOV-DEC]` Collaborative Consensus
- **Target Integration**: Decision Registry, Shopping Registry, and DO-PKOS Web Modules

---

## 1. Executive Summary & Problem Shift

Traditional wedding planning tools reduce family decision-making to binary voting tallies:
> *"Family Consensus Tally: Option A: 6 | Option B: 5 | Option C: 2"*

This model suffers from critical structural flaws:
1. **Masks Qualitative Nuance**: A family member who likes Option B's fabric but dislikes its color is forced into a false binary choice ("Vote A or B").
2. **Blocks Emergent Options**: If no existing candidate is satisfactory, users cannot introduce new ideas directly into the debate; they must take the discussion offline to chaotic WhatsApp groups.
3. **Loss of Context**: Comments in chat apps are disconnected from the specific visual element, creating confusion over which photo, drape, or jewelry piece is being discussed.

### The New Paradigm: Collaborative Options + Multi-Tier Comments
Instead of treating images as static voteable choices, **every proposal or visual idea is treated as a uniquely identifiable Option Entity (`Option UID`)**. Users can:
- Ingest new options dynamically via **Google Drive links**.
- Attach comments, critiques, and remarks directly to specific Option UIDs.
- Mention family members (`@Bride`, `@Sister1`, `@InLaws`) to solicit focused input.
- Conduct discussions at **three structural tiers**: Option-level, Category-level, and Event-level.
- Derive consensus organically from stakeholder alignment and remark resolution rather than shallow headcount tallies.

---

## 2. Comprehensive 10-Point Architectural Blueprint

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE 4-TIER COLLABORATIVE TAXONOMY                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 1: EVENT (EVT-###)                                                   │
│  e.g. EVT-001 (Haldi & Arrival) | EVT-003 (Sangeet) | EVT-004 (Vivaha)      │
│  └── Comments: Broad event timeline, pacing, overarching mood              │
├─────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 2: CATEGORY / SECTION (CAT-###)                                      │
│  e.g. CAT-HLD-STALLS | CAT-VIV-MANDAP | CAT-SNG-STAGE | CAT-TROUS-SILKS     │
│  └── Comments: Category budget, layout balance, logistical requirements    │
├─────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 3: OPTION ENTITY (Option UID: OPT-### / Human Label: H-01, M-02)     │
│  e.g. OPT-HLD-STL-01 (Interactive Bangle Stall via Drive link)             │
│  └── Attributes: Media URL, Contributor, Drive ID, Approval State           │
├─────────────────────────────────────────────────────────────────────────────┤
│  LEVEL 4: THREADED REMARKS & MENTIONS (REM-###)                             │
│  e.g. REM-082 by @Sister: "Can we use yellow marigolds instead of orange?"  │
│  └── Threading: Parent ID, @mentions, reactions, edit/hide audit trail     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 1. Conceptual & Relational Data Model

The data architecture is structured hierarchically, bridging declarative local data stores with live Firestore subcollections:

```
events/{eventId}
  │
  ├── categories/{categoryId}
  │     │
  │     ├── options/{optionId}                 <-- Document per Option UID
  │     │     │
  │     │     ├── title: string
  │     │     ├── description: string
  │     │     ├── mediaSource: "local" | "drive" | "firestore"
  │     │     ├── mediaUrl: string
  │     │     ├── driveFileId: string (optional)
  │     │     ├── driveThumbnailUrl: string
  │     │     ├── submittedBy: { uid, displayName, role }
  │     │     ├── createdAt: timestamp
  │     │     ├── consensusStatus: "proposed" | "under_review" | "aligned" | "locked"
  │     │     │
  │     │     └── comments/{commentId}         <-- Subcollection for Option-level remarks
  │     │           ├── author: { uid, displayName, role }
  │     │           ├── text: string
  │     │           ├── mentions: string[]     (e.g. ["PER-001", "PER-002"])
  │     │           ├── parentCommentId: string | null (for 1-level reply threading)
  │     │           ├── isEdited: boolean
  │     │           ├── isHidden: boolean
  │     │           ├── createdAt: timestamp
  │     │           └── updatedAt: timestamp
  │     │
  │     └── comments/{commentId}               <-- Subcollection for Category-level discussion
  │
  └── comments/{commentId}                     <-- Subcollection for Event-level discussion
```

---

### 2. Option UID Generation & Stability Protocol

To ensure human scannability in family chats while maintaining cryptographic database integrity:
- **Canonical Database UID**: Standardized 3-digit padded slug: `OPT-[EVENT_CODE]-[CAT_CODE]-[SEQ]`  
  *Example*: `OPT-HLD-STL-01`, `OPT-SNG-STG-02`, `OPT-VIV-MAN-03`.
- **Human-Facing Short Badge**: Derived localized badge for verbal and WhatsApp shorthand:  
  `[EVENT_LETTER]-[SEQ]` (e.g. **H-01**, **H-02** for Haldi; **S-01**, **S-02** for Sangeet; **V-01**, **V-02** for Vivaha).
- **UID Invariants**:
  - Once generated, an Option UID is **immutable and permanent**.
  - If an option is retired, its UID is marked `isArchived: true` and never recycled, preventing comment orphaned pointers.

---

### 3. Google Drive Image Ingestion & Thumbnail Normalization

Because Google Drive standard share links (`https://drive.google.com/file/d/FILE_ID/view`) cannot be embedded directly in `<img>` tags, the client engine normalizes Drive links losslessly:

```
                      ┌──────────────────────────────────────────────┐
                      │ User Pastes Google Drive Sharing URL         │
                      │ drive.google.com/file/d/1A2b3C4d.../view     │
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │ Client Regex ID Extractor                    │
                      │ /(?:id=|\/d\/|file\/d\/)([a-zA-Z0-9_-]{25,})/│
                      └──────────────────────┬───────────────────────┘
                                             │
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │ Deterministic Thumbnail Normalization        │
                      │ High-Res (Lightbox): drive.google.com/       │
                      │   thumbnail?id=FILE_ID&sz=w1600              │
                      │ Grid Preview: drive.google.com/              │
                      │   thumbnail?id=FILE_ID&sz=w600               │
                      │ Fallback CDN: lh3.googleusercontent.com/d/ID │
                      └──────────────────────────────────────────────┘
```

#### Ingestion UX:
1. User clicks **"➕ Add Option via Drive Link"** in any category header.
2. Form prompts for:
   - **Drive URL**: Link to JPEG, PNG, or WebP file.
   - **Option Title**: e.g., *"Yellow Floral Umbrella Photo-Op"*.
   - **Contributor Name / Role**: e.g., *"Pooja (Bride's Sister)"*.
   - **Brief Notes**: e.g., *"Saw this in Bhubaneswar market, fits our Haldi theme"*.
3. Client validates URL, renders instant live thumbnail preview, generates `OPT-HLD-STL-04` / `H-04`, and writes to Firestore.

---

### 4. Comments, `@Mentions`, and Lifecycle Management

- **`@Mentions` Autocomplete**:
  - Typing `@` triggers a lightweight user popover populated from `03_PEOPLE_GUESTS/directory/` (e.g. `@Bride`, `@Groom`, `@Sisters`, `@InLaws`, `@Decorator`).
  - Mentions are stored as structured entity references (`PER-###`) in the comment payload.
- **Edit & Delete Lifecycle (`P-AUDIT-TRAIL`)**:
  - Users can edit or hide their own comments within a 24-hour window.
  - Hard deletion is prohibited: comments are marked `isHidden: true` with placeholder *"This remark was hidden by the author"*.
  - Child replies remain intact to preserve conversational continuity.
  - All edits record an audit record (`editedAt`, `previousTextHash`).

---

### 5. Multi-Level Discussion Topology

| Level | Primary Focus | UI Mount Location | Typical Discussion Subject |
| :--- | :--- | :--- | :--- |
| **Tier 1: Option Level** | Specific image, texture, silhouette, or floral finish. | **Inline expandable drawer** or **Lightbox tab** directly below the Option card. | *"The drape fabric on H-02 is gorgeous, but can we avoid marigolds?"* |
| **Tier 2: Category Level** | Budget, zoning, quantity, or thematic harmony. | **Category section header** slide-out panel. | *"Do we need 3 craft stalls in Haldi or is 2 sufficient for our guest count?"* |
| **Tier 3: Event Level** | Chronology, weather contingency, guest arrival flow. | **Event Stepper top toolbar** modal. | *"Can we push Haldi start to 10:00 AM to give relatives travel buffer?"* |

---

### 6. Relationship to Voting & Consensus Model

> [!IMPORTANT]
> **Consensus is a Derived Outcome, Not a Raw Headcount Vote.**

The system **does not discard consensus tracking**; it replaces raw arithmetic voting (`6 vs 5 vs 2`) with an **Emergent Alignment Score**:
- **Option Status Lifecycle**:
  - `PROPOSED`: Newly submitted by a contributor; open for remarks.
  - `UNDER_REVIEW`: Active discussion underway with `@mentions` tagged.
  - `ALIGNED`: Core stakeholders (Bride, Groom, Key Family) have marked *"Looks Good"* with zero open blocker remarks.
  - `LOCKED`: Formally certified by the Host; assigned to vendor deliverables.
- **Derived Alignment Indicator**:
  - An option card displays an alignment badge derived from:
    1. Stakeholder sign-offs (Bride + Groom + Sisters).
    2. Blocker count: Remarks marked as `type: "blocker"` that remain unresolved.
    3. Sentiment summary: Positive vs Concerns tally.

---

### 7. UX & Interaction Model

- **Zero-Login Public Consumption**: Extended family accessing shared links (`?mode=family&option=H-02`) can view options, read discussions, and contribute remarks by entering their name, without requiring Google Account sign-in.
- **Responsive Split-View**:
  - **Desktop (≥1024px)**: Option photo on left, real-time threaded discussion sidebar on right.
  - **Mobile (<1024px)**: Clean photo card with floating comment count badge (`💬 4`). Tapping opens a bottom slide-up sheet (`90vh` height) optimized for thumbs.
- **1-Click WhatsApp Deep Linking**:
  - Next to every Option UID, a WhatsApp icon copies:
    > *"Hey! What do you think about Option H-02 (Vedic Lotus Mandap)? Check the photo & leave your thoughts here: https://.../decision-registry.html?option=H-02"*

---

### 8. Permissions, Ownership & Audit Governance

- **Host / Admin**: Can lock options, delete abusive remarks, assign options to vendor contracts, and resolve blockers.
- **Family Contributors**: Can submit Drive links, comment on any option, mention users, and edit their own posts.
- **Vendors (Decorator / Caterer)**: Can view locked and aligned options, post technical feasibility remarks, and upload CAD/render updates.
- **Audit Logging**: Every option creation and status transition logs an immutable entry to Firestore `auditLogs`.

---

### 9. Hidden Architectural Issues & Mitigations

1. **Google Drive Link Decay / Permission Revocation**:
   - *Risk*: A user shares a private Drive file or deletes it from their personal Drive.
   - *Mitigation*: Client performs an `Image.onload` health check. If broken, it displays a graceful placeholder with a button to *"Update Drive Link"*.
2. **Bandwidth Quotas on `uc?export=view`**:
   - *Risk*: Google throttles direct export links under simultaneous family traffic.
   - *Mitigation*: Strict enforcement of Google's high-capacity thumbnail endpoint: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`.
3. **Offline PWA Compatibility**:
   - *Risk*: Remote Drive images fail when the app is used completely offline.
   - *Mitigation*: Cached thumbnail caching via Service Worker Cache API for recently viewed options; local static plates (`assets/decor/`) remain the primary zero-dependency offline fallback.
4. **Firestore Realtime Listener Costs**:
   - *Risk*: Multiple real-time snapshot listeners for every option's comments could exhaust free-tier limits.
   - *Mitigation*: Lazy on-demand subcollection queries. Comments are fetched **only when an Option card or slide-over drawer is expanded**, not on page load.

---

### 10. Phased Implementation Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PHASED IMPLEMENTATION ROADMAP                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  PHASE 1: DATA MODEL & OPTION INGESTION ENGINE                              │
│  • Define Option UID generator & schema in js/decision-registry-data.js     │
│  • Deploy Drive URL normalizer (thumbnail?id=...&sz=w1200)                  │
│  • Add "Add Option via Drive" UI modal into SDCA Decision Registry          │
├─────────────────────────────────────────────────────────────────────────────┤
│  PHASE 2: THREADED COMMENTS & @MENTIONS ENGINE                              │
│  • Build sk-comments-drawer primitive in ui_primitives/                     │
│  • Wire Firestore comments subcollection with on-demand lazy querying       │
│  • Implement @mentions autocomplete and 1-level reply threading             │
├─────────────────────────────────────────────────────────────────────────────┤
│  PHASE 3: DERIVED CONSENSUS & WHATSAPP DEEP-LINK SYNCHRONIZATION            │
│  • Evolve binary voting pills into Emergent Alignment Indicators            │
│  • 1-Click WhatsApp Deep-Link Generator with ?option=OPT-UID anchors        │
│  • Dual-release byte parity validation and smoke test suites                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Conclusion & Recommendation

The Collaborative Options + Comments Model represents a far superior decision-making architecture for the Sree Krushna Marriage OS. It transforms the application from a rigid, top-down voting form into a vibrant, family-centric co-creation platform where consensus emerges naturally through shared visuals and respectful discussion.
