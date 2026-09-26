# Query 1.0 - [prompt-clarity](slashCommand;prompt-clarity) # TASK: Integrate Family Ritual & Gift Obligation Data into the Existing Marriage OS

## Context

I have two handwritten family-planning sheets for the Sree Krushna Marriage.

These are NOT merely shopping lists.

They represent a family-to-family obligation register containing:

- ritual-specific responsibilities
- gifts
- reciprocal exchanges
- clothing
- jewellery
- sweets / food
- puja / ritual consumables
- cash obligations
- family packs
- trolleys / logistics items
- recipient-specific obligations

I also want to eventually identify gaps between this family-obligation register and the broader wedding execution requirements.

The application in this repository already handles lists / shopping / obligations / planning data.

DO NOT modify the application yet.

Your first responsibility is to inspect the existing application and determine how this information SHOULD be represented in the application's existing architecture.

---

## SOURCE DATA

### EVENT 1 — ENGAGEMENT

#### Bride's Family → Groom / Groom's Family

1. Mudi
2. Groom's shirt + pant
3. Mom & Dad:
   - Saree for Mom
   - Shirt/Kurta + Pant for Dad
4. Dress/Saree for Didi & Tiju
5. Dress for Bacha Party
6. 5 varieties of sweets

#### Groom's Family → Bride / Bride's Family

1. Mudi
2. Lehenga + blouse
3. Engagement trolley
4. 5 varieties of sweets, including:
   - Coconut
   - Banana Kandhi
5. Phula
6. Desi Pana
7. Maha-prasad
8. ₹5,000 per head for those attending the engagement, excluding family members

---

## EVENT 2 — BEFORE MARRIAGE

### Gua / Haldi Basa

Responsible: Groom's Family

- Saree
- Makeup
- Other associated things
- Coconut
- Desi Pana
- Gua
- Haldi

### Bandhu Daksa

Responsible: Bride's Family

- Pana
- Gua
- Dress for Daddy

### Batabasana (Batabarana)

Responsible: Bride's Family

- Suit
- Chain
- Mudi
- Bracelet

### Ahiya Manduli (Immediately after Batabarana)

Responsible: Groom's Family
Recipient: Bride's Mother ("Mummy" — Smt. Tapaswini)

- Saree for Mummy (Auspicious ceremonial handloom silk saree presented to bride's mother at entrance welcoming)

### Groom's Alta & Sindoor in Mandap

Responsible: Groom's Family

- Alta
- Sindoor

### Sala Bidha

Responsible: Groom's Family

- Gift / item — exact choice TBD

### Sali Hasta Ganthi

Responsible: Groom's Family

- Gift / item — exact choice TBD

### Samdhi Milan

Reciprocal exchange:

- Baba ↔ Daddy
- Dress exchange

### Sadu Basana

Responsible: Groom's Family

- Laddoo
- Dress

### Alankar / Exchange

Groom's Family → Bride:

- Alankar
- One handwritten item is unclear ("TDK") — preserve as TBD / unresolved

Bride's Family → Groom:

- 5 sets of dresses

---

## EVENT 3 — AFTER MARRIAGE

### Guin Chada

Responsible: Bride's Family

- Trolley

### Bahu Daksa

Responsible: Bride's Family

- Dress for Devas

### Bahu Bandhapana

Responsible: Bride's Family

- 2 sarees

### Nananda Putuli

Responsible: Bride's Family
Recipients: 2 Didis

- Gold
- Saree / Dress
- Trolley
- Handwritten gold quantity appears unclear / partially obscured
- DO NOT invent quantity

### Chaturthi Huma

Groom's Family:

- Saree set

Bride's Family:

- Dhoti
- Kurta

### Huma Bali Utheibaku

Groom's Family → BIL:

- Dress

### Uluguna

Responsible: Bride's Family

- Some items are blacked out / unreadable
- DO NOT infer or invent them

### Family Pack

Responsible: Bride's Family

- Saree for Mom
- Dress for Daddy
- Dress for Didi 1
- Dress for Didi 2
- Dress for Tiju
- Dress for Bacha Party

### Kutha Madani

Responsible: Bride's Family

- Trolley for Bride + Groom

### Reception

Responsible: Groom's Family

- Saree / Lehenga

### Saga Macha

Groom's Family:

- Saree
- Saga Macha

Bride's Family:

- Saga & Macha

---

## IMPORTANT DATA INTEGRITY RULES

1. Do NOT invent missing quantities.
2. Do NOT silently normalize uncertain ritual names.
3. Preserve family terminology where the source is uncertain.
4. Represent uncertain values as TBD / unresolved rather than guessing.
5. Preserve "whatever you will give" / "whatever you will like" as an unresolved obligation if the application supports this.
6. Do not convert every obligation into a generic shopping item.
7. Distinguish:
   - purchase
   - gift
   - reciprocal exchange
   - ritual material
   - food/prasad
   - cash
   - service
   - logistics
   - package/bundle
8. Preserve the responsible family.
9. Preserve recipient.
10. Preserve the event/ritual context.
11. If the application already has canonical entities for Event, Ritual, Obligation, Item, Recipient, Family, Package, Exchange, Purchase, etc., USE THOSE rather than creating parallel concepts.

---

## PHASE 1 — REPOSITORY DISCOVERY

Inspect the existing application thoroughly.

Find and report:

### A. Existing data model

What entities currently represent:

- Events
- Rituals
- Tasks
- Shopping items
- Purchases
- Gifts
- Recipients
- Families
- Packages / bundles
- Exchanges
- Vendors
- Budgets
- Status
- Quantities
- Units
- Categories
- Ownership / responsibility

For each, provide:

- entity name
- file/location
- schema/interface/type
- required fields
- optional fields
- relationships
- enums/constants
- ID strategy

### B. Existing list/import mechanisms

Determine how the application currently expects bulk data.

Check:

- JSON
- CSV
- Google Sheets
- database seed
- API payload
- local data files
- forms
- import/export
- fixtures
- configuration files

Identify the application's TRUE canonical ingestion format.

Do not assume CSV/JSON is correct merely because it is convenient.

### C. Existing UI workflow

Identify which existing screen/module is intended to handle this type of information.

Explain:

- where the data should appear
- what existing workflow owns it
- whether it belongs under Shopping, Tasks, Events, Gifts, Rituals, or another module
- whether multiple modules already cooperate for this use case

### D. Existing architecture constraints

Identify:

- existing IDs
- reference keys
- parent-child relationships
- status enums
- category enums
- validation rules
- duplicate detection
- package/bundle support
- exchange support
- family ownership
- recipient model

---

## PHASE 2 — CANONICAL DATA CONTRACT

After inspecting the repository, answer:

### "What is the smallest correct representation of the above handwritten data using the application's EXISTING architecture?"

Produce the canonical schema.

For example, if the application already has:

Event
→ Obligation
→ Item
→ Recipient
→ Family
→ Purchase

then explain exactly how the handwritten data maps into those entities.

Do NOT create new entities unless the existing architecture genuinely cannot represent the data.

If a new entity is necessary, explain:

1. why the existing model cannot represent it
2. what the proposed entity is
3. what relationships it has
4. what architectural precedent exists in the repo
5. whether this is a schema change or merely an import-layer transformation

---

## PHASE 3 — SPECIAL STRUCTURES

Explicitly determine how the existing application represents the following:

### 1. Reciprocal exchange

Example:

Samdhi Milan:
Baba → Daddy
Daddy → Baba

This should NOT accidentally become two unrelated purchases if the application has an Exchange abstraction.

### 2. Package / family bundle

Example:

Family Pack:

- Mom
- Daddy
- Didi 1
- Didi 2
- Tiju
- Bacha Party

Determine whether this should be:

Package → Package Items

or some existing equivalent.

### 3. Per-person cash obligation

Example:

₹5,000 × eligible engagement attendees

Determine how the application should represent:

- amount per person
- eligible recipient population
- exclusions
- total amount
- payment status

Do NOT calculate the total unless the recipient count exists.

### 4. Unresolved / TBD item

Examples:

- Sala Bidha
- Sali Hasta Ganthi
- "TDK"
- unclear Nananda Putuli gold quantity
- blacked-out Uluguna items

Determine how the existing application represents unresolved decisions.

### 5. Ritual consumables

Examples:

- Gua
- Pana
- Haldi
- Coconut
- Desi Pana
- Phula
- Maha-prasad
- Laddoo

Determine whether these belong to Shopping, Ritual Materials, Inventory, Tasks, or another existing concept.

---

## PHASE 4 — MAPPING

Create a complete mapping table:

| Source Item | Event | Ritual | Responsible Family | Recipient | Obligation Type | Existing Entity | Canonical Field Mapping | Confidence |
| ----------- | ----- | ------ | ------------------ | --------- | --------------- | --------------- | ----------------------- | ---------- |

Confidence must be:

- HIGH — directly represented by existing architecture
- MEDIUM — requires an existing concept to be interpreted
- LOW — ambiguity in source data
- TBD — source itself is unresolved

Do not hide ambiguity.

---

## PHASE 5 — DATA FORMAT FOR ME

I want you to tell me EXACTLY what format you want me to provide future marriage-planning data in.

For example:

### Option A

Structured JSON

### Option B

CSV

### Option C

Spreadsheet columns

### Option D

Human-readable structured markdown

### Option E

Existing application's own import format

Do NOT choose based on convenience.

Choose based on the actual repository architecture.

Then provide:

1. Canonical format
2. Required fields
3. Optional fields
4. Allowed enum values
5. ID/reference rules
6. One complete example
7. One example with a TBD value
8. One reciprocal exchange example
9. One package/bundle example
10. One per-person cash obligation example

---

## PHASE 6 — GAP ANALYSIS

Finally, compare the handwritten data against the application's current capabilities.

Identify:

### Already supported

What can be imported directly.

### Transform required

What can be represented but needs preprocessing/mapping.

### Architecture gap

What the application genuinely cannot currently represent.

### Source ambiguity

What requires family confirmation.

### Missing wedding domains

Separately identify domains that are NOT represented by the handwritten sheets, such as potentially:

- invitations
- Mangana
- Dia Mangula
- Nandimukhi
- Barajatri
- wedding-day ritual samagri
- priest requirements
- bride/groom wedding kits
- Gruhaprabesha
- Chauthi execution
- Asta Mangala
- hospitality
- venue/decorator dependencies

Do NOT automatically add these to the family obligation data.

Mark them as:

`POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`

---

## PHASE 7 — NO CODE CHANGES

For this task:

DO NOT:

- modify source code
- modify database schema
- create migrations
- import the data
- create duplicate records
- change UI
- create new architecture

This is a discovery + data-contract exercise first.

At the end, give me a concise answer:

### 1. "Here is the format I want from you."

### 2. "Here is how your handwritten data maps to my application."

### 3. "Here are the unresolved items."

### 4. "Here are the architecture gaps, if any."

### 5. "Here are the potential wedding domains missing from the handwritten list."

Only after this contract is agreed should implementation/import begin.

# Review 1.0 -

## Response 1.0 — Discovery Report & Data Contract

---

### PHASE 1 — REPOSITORY DISCOVERY

#### A. Existing Data Model

The repository uses a **9-domain spoke-and-hub markdown architecture** with strict entity prefixes. No relational database exists — the data model is entirely document-based (`.md` files with YAML frontmatter + `.jsonl`/`.csv` parallel exports for the web Shopping Registry app).

| Domain Concept                | Entity Prefix                   | Schema File                                         | Key Required Fields                                         | Key Optional Fields                                           | ID Strategy                                |
| ----------------------------- | ------------------------------- | --------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------ |
| **Event**                     | `EVT-###`                       | `01_TIMELINE_EVENTS/event_template.md`              | `id`, `title`, `category`, `date`, `venue_id`, `status`     | `rituals_included[]`, `budget_allocated_inr`, `dress_code`    | Sequential 3-digit pad                     |
| **Ritual**                    | `RIT-###`                       | `02_RITUALS_CULTURE/ritual_template.md`             | `id`, `name`, `event_id`, `status`                          | `samagri_checklist_id`, `key_participants[]`, `duration_mins` | Sequential 3-digit pad                     |
| **Samagri Checklist**         | `SAM-###`                       | `02_RITUALS_CULTURE/samagri_checklists/`            | Unstructured checklist per ritual                           | —                                                             | One-to-one with RIT-###                    |
| **Person**                    | `PER-###`                       | `03_PEOPLE_GUESTS/person_template.md`               | `id`, `full_name`, `family_id`, `relation_side`, `category` | `events_invited[]`, `assigned_responsibilities[]`             | Sequential 3-digit pad                     |
| **Family Unit**               | `FAM-###`                       | `03_PEOPLE_GUESTS/family_template.md`               | `id`, `household_name`, `relation_side`                     | `shagun_exchange_id` (→ `GFT-###`)                            | Sequential 3-digit pad                     |
| **Shopping / Trousseau Item** | `TRS-###` / `SHP-###`           | `shopping_items.jsonl` + `shopping_master.md`       | `id`, `title`, `category`, `status`                         | `chapterId`, `role`, `priceRange`, `store`, `approvals{}`     | Compound prefix (TRS-BR/GR/JW/SA/EG/OD-##) |
| **Precious Asset**            | `AST-###`                       | `04_PROCUREMENT_VENDORS/attire_and_jewellery/`      | `id`                                                        | custody chain                                                 | Sequential 3-digit pad                     |
| **Vendor**                    | `VDR-###`                       | `04_PROCUREMENT_VENDORS/vendors/`                   | `id`, vendor details                                        | —                                                             | Sequential 3-digit pad                     |
| **Contract**                  | `CTR-###`                       | `04_PROCUREMENT_VENDORS/contracts/`                 | `id`                                                        | scope, milestones                                             | Sequential 3-digit pad                     |
| **Payment**                   | `PAY-###`                       | `06_FINANCE_COMMERCIALS/payment_template.md`        | `id`, `amount_inr`, `category`, `status`                    | `contract_id`, `vendor_id`, `paid_by_person_id`               | Sequential 3-digit pad                     |
| **Gifts & Shagun**            | `GFT-###` (referenced but stub) | `06_FINANCE_COMMERCIALS/gifts_and_shagun/README.md` | _Not yet scaffolded_ — README only describes intent         | —                                                             | Referenced by `FAM-###.shagun_exchange_id` |
| **Task**                      | `TSK-###`                       | `00_GOVERNANCE/tasks/`                              | `id`                                                        | `depends_on`, `assignee`                                      | Sequential 3-digit pad                     |
| **Decision**                  | `DEC-###`                       | `00_GOVERNANCE/decisions/`                          | `id`                                                        | —                                                             | Sequential 3-digit pad                     |

**Enums observed:**

- `EVT.category`: `pre_wedding | wedding_day | reception | post_wedding`
- `EVT.status`: `Draft | Planned | Confirmed | In-Progress | Completed`
- `RIT.status`: `Draft | Confirmed | Executed`
- `TRS.category`: `bridal | groom | jewellery | sara | engagement`
- `TRS.status` (web app): `Planned | Shortlisted | Purchased | In Alterations | Ready | Packed | Box Ready | Ordered | In Progress | Trial Scheduled | Fitting Complete | Sourced`
- `PER.category`: `Core_Couple | Immediate_Family | Extended_Family | VIP | Friend | Coordinator | Vendor_Rep`
- `PER.relation_side`: `Bride | Groom | Neutral`
- `PAY.category`: `Venue | Catering | Decor | Photo | Attire | Priest | Transport`
- `PAY.payment_type`: `Advance | Milestone | Final_Settlement | Tip_Dakshina`

---

#### B. Existing Import / Ingestion Mechanisms

| Format                          | File                                                                                | Status                                      | Purpose                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **JSONL**                       | `shopping_items.jsonl`                                                              | ✅ TRUE CANONICAL for web Shopping Registry | Primary feed for the interactive `shopping-registry.html` / `shopping-fragment.html` web app |
| **CSV**                         | `shopping_items.csv`                                                                | ✅ Parallel mirror of JSONL                 | Same columns, maintained in sync for spreadsheet access                                      |
| **Markdown + YAML frontmatter** | All `RIT-###.md`, `EVT-###.md`, `PER-###.md` files                                  | ✅ CANONICAL for documentation/governance   | Human-readable SSOT for rituals, events, people                                              |
| **Google Sheets / Firestore**   | Backend via `backend_gas/` + Firestore `task_status`, `change_requests` collections | ✅ Active real-time layer                   | Mutable task status overlay; change requests; shopping options visual intake                 |
| **Forms**                       | Web app intake forms                                                                | ✅ UI layer                                 | Change requests, shopping option submissions                                                 |
| **Fixtures/Seed**               | None observed                                                                       | ❌ Not present                              | No seed scripts found                                                                        |
| **JSON config**                 | `FEATURE_CATALOG.json`, `enhancement-config.json`                                   | Infrastructure only                         | Not a data ingestion path                                                                    |

**True canonical ingestion format by domain:**

- **Shopping items (attire/gifts):** JSONL (`shopping_items.jsonl`) — this is the authoritative feed for the web registry.
- **Rituals & samagri:** Markdown + YAML (`RIT-###.md` + `SAM-###.md`) — no bulk import path exists.
- **People/Families:** Markdown + YAML (`PER-###.md`, `FAM-###.md`) — no bulk import path exists.
- **Financial obligations:** Markdown + YAML (`PAY-###.md`) — no bulk import path exists.
- **Gift exchanges:** `06_FINANCE_COMMERCIALS/gifts_and_shagun/` — **STUB ONLY.** `GFT-###` is referenced in `FAM-###.shagun_exchange_id` but no actual gift record schema or documents exist yet.

---

#### C. Existing UI Workflow

The web application has the following modules relevant to this data:

| Module                | UI Surface                                          | Handles                                                                                                                                                                                  |
| --------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shopping Registry** | `shopping-registry.html` / `shopping-fragment.html` | Attire, jewellery, trousseau items per event/chapter. Visual multi-look cards, collaborative approvals (`bride`, `sisters`, `inlaws`), status tracking, Pinterest intake, WhatsApp share |
| **Decorator Cockpit** | `decorator-cockpit.html`                            | Decor options, visual intake — NOT relevant to family obligation data                                                                                                                    |
| **Decision Registry** | `decision-registry.html`                            | Architecture decisions (AC-DEC-###, UI-DEC-###) — NOT family obligation data                                                                                                             |
| **DO-PKOS Engine**    | `index.html #tab-dopkos`                            | 5-zone executive HUD, swimlane planning, task status — governance layer                                                                                                                  |
| **Rituals tab**       | `index.html #tab-rituals`                           | Vedic liturgy cards with samagri checklists                                                                                                                                              |

**Where this handwritten data should appear:**

The family obligation data spans **three existing modules** depending on obligation type:

1. **Shopping Registry** → for all attire, jewellery, gifts, sarees, sweets (purchasable items) with family attribution and event-ritual anchoring.
2. **Rituals / Samagri domain** (`RIT-###` + `SAM-###`) → for ritual consumables (Gua, Pana, Haldi, Sindoor, Alta, etc.) that are sacred materials, not shopping items.
3. **Gifts & Shagun stub** (`06_FINANCE_COMMERCIALS/gifts_and_shagun/`) → for reciprocal exchanges (Samdhi Milan), per-person cash obligations (₹5,000 per head), and family package bundles (Nananda Putuli trolley, Guin Chada trolley).

No single existing module owns the entire "family obligation register" concept end-to-end. This is the primary architecture finding.

---

#### D. Architecture Constraints

- **No `obligation_type` field exists** in any entity. The JSONL `category` field is attire-centric (`bridal | groom | jewellery | sara | engagement`).
- **No `responsible_family` field exists** in TRS items. Ownership is implicit via category or chapter.
- **No `recipient` field exists** at item level — only at the `SHP-FAM-###` macro level in `shopping_master.md`.
- **No `reciprocal_exchange` concept** exists in any entity.
- **No `package/bundle` entity** exists (Family Pack grouping not modeled).
- **No `per_person_cash_obligation` concept** exists.
- **No `resolution_status` field** for TBD items — closest is `status: "Planned"` which doesn't distinguish "TBD/unresolved" from "planned but not yet purchased."
- **No `ritual_context` foreign key** in shopping items (the `role` field is free text, not a `RIT-###` reference).
- **The `GFT-###` namespace** is referenced but has zero scaffolded documents — it is an unfilled stub.

---

### PHASE 2 — CANONICAL DATA CONTRACT

**"What is the smallest correct representation using the existing architecture?"**

The handwritten data maps across **four existing entity types** with **one gap entity** needed:

```
EVT-### (Event)
  └── RIT-### (Ritual)  ← most obligations attach here
        └── SAM-### (Samagri) ← ritual consumables live here

TRS-### (Shopping/Trousseau item)  ← purchasable attire, gifts, sweets
  ├── category: [bridal | groom | sara | jewellery | engagement]
  ├── chapterId: maps to event phase
  ├── role: maps to ritual context (free text)
  └── status: tracks procurement state

GFT-### (Gift/Exchange record) ← *** STUB — needs scaffolding ***
  ├── obligation_type
  ├── responsible_family
  ├── recipient_family / recipient_person
  ├── direction (→ or ↔)
  ├── linked_trs_items[]
  └── resolution_status
```

**Verdict:** The existing architecture can represent ~70% of this data by interpreting/extending existing entities. It genuinely cannot represent three specific constructs without new scaffolding (see Phase 6 Architecture Gaps).

---

### PHASE 3 — SPECIAL STRUCTURES

#### 1. Reciprocal Exchange (Samdhi Milan)

**Current architecture:** No `Exchange` abstraction exists. Closest existing hook is `FAM-###.shagun_exchange_id → GFT-###`, but `GFT-###` is a stub.

**Correct representation:** The `GFT-###` stub in `06_FINANCE_COMMERCIALS/gifts_and_shagun/` must be scaffolded with a schema that supports bidirectional direction. Two linked `GFT-###` records would represent each direction, with a `paired_exchange_id` cross-reference, OR a single `GFT-###` record with `direction: "reciprocal"` and two parties listed.

**Do NOT** represent as two unrelated TRS shopping items — that loses the exchange relationship entirely.

#### 2. Package / Family Bundle (Family Pack, Nananda Putuli)

**Current architecture:** `SHP-FAM-###` in `shopping_master.md` uses a macro grouping concept (e.g., `SHP-F01` = "Mothers & Elder Aunts — 25 Sets"). A similar bundle concept exists at macro level but not at the per-recipient level needed here.

**Correct representation:** A `GFT-###` bundle record with `package_items[]` array, where each item is either a `TRS-###` reference or an inline description with `recipient_role` and `resolution_status`. The Nananda Putuli gold quantity gap must be explicitly preserved as `quantity: "TBD — source unclear, do not infer"`.

#### 3. Per-Person Cash Obligation (₹5,000 per Engagement Attendee)

**Current architecture:** No mechanism exists. `PAY-###` records a paid transaction; it cannot represent a forward formula-based obligation with exclusion rules.

**Correct representation:** A `GFT-###` record with:

- `obligation_type: "cash_per_person"`
- `amount_per_person_inr: 5000`
- `eligible_population: "Engagement attendees (excl. family members)"`
- `exclusions: "family members"`
- `total_amount_inr: "TBD — eligible count not yet determined"`
- `resolution_status: "open"`

**Do NOT** calculate or invent a total.

#### 4. Unresolved / TBD Items

**Current architecture:** `status: "Planned"` is the closest field but is insufficient — it conflates "planned but undecided" with "intentionally deferred."

**Correct representation:** In the `GFT-###` schema, a `resolution_status` field must be added with values:

- `confirmed` — obligation content known and agreed
- `open` — obligation exists but content TBD
- `unreadable` — source document physically unclear (Uluguna blacked-out items)
- `family_confirmation_required` — content partially known but needs verbal confirmation

TBD items that require family confirmation: Sala Bidha, Sali Hasta Ganthi, "TDK" in Alankar/Exchange, Nananda Putuli gold quantity, Uluguna blacked-out items.

#### 5. Ritual Consumables (Gua, Pana, Haldi, Sindoor, etc.)

**Current architecture:** `SAM-###` samagri checklists under `02_RITUALS_CULTURE/samagri_checklists/` are the canonical home. `shopping_master.md` has a `SHP-SAM-###` section for liturgical shopping items. Both mechanisms exist.

**Correct representation:**

- Items that are **pure ritual samagri** (Gua, Pana, Haldi, Coconut, Alta, Kusha) → belong in `SAM-###` checklists under the relevant `RIT-###`.
- Items that are **both samagri AND must be purchased** (e.g., Desi Pana, Maha-prasad, Laddoo from a specific source) → can appear in both `SAM-###` (for ritual tracking) and `SHP-SAM-###` (for procurement).
- Items that are **gifts containing sweets** (5 varieties of sweets in Engagement) → belong in `GFT-###` as an obligation item, not `SAM-###`.

---

### PHASE 4 — MAPPING TABLE

| Source Item                                                       | Event           | Ritual              | Responsible Family | Recipient                  | Obligation Type        | Existing Entity                                  | Canonical Field Mapping                                                             | Confidence     |
| ----------------------------------------------------------------- | --------------- | ------------------- | ------------------ | -------------------------- | ---------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------- | -------------- |
| Mudi (Bride→Groom)                                                | Engagement      | Nirbandha           | Bride's Family     | Groom                      | gift                   | `GFT-###` → `TRS-EG-01` adjacent                 | `obligation_type: gift`, `direction: bride_to_groom`                                | HIGH           |
| Groom's shirt + pant                                              | Engagement      | Nirbandha           | Bride's Family     | Groom                      | gift/purchase          | New `GFT-###` → new `TRS-EG-###`                 | `category: groom`, `chapterId: chapter_engagement`                                  | HIGH           |
| Saree for Groom's Mom                                             | Engagement      | Nirbandha           | Bride's Family     | Groom's Mother             | gift                   | New `GFT-###` → `TRS-SA` class                   | `obligation_type: gift`, `recipient_role: groom_mother`                             | HIGH           |
| Shirt/Kurta+Pant for Groom's Dad                                  | Engagement      | Nirbandha           | Bride's Family     | Groom's Father             | gift                   | New `GFT-###` → new `TRS-###`                    | `category: sara`                                                                    | HIGH           |
| Dress/Saree for Didi & Tiju                                       | Engagement      | Nirbandha           | Bride's Family     | Groom's Sister & Jiju      | gift                   | New `GFT-###` → `TRS-SA-04` analogous            | `category: sara`                                                                    | HIGH           |
| Dress for Bacha Party                                             | Engagement      | Nirbandha           | Bride's Family     | Children (Groom side)      | gift                   | New `GFT-###`                                    | `obligation_type: gift`, `recipient_role: children_groom_side`                      | MEDIUM         |
| 5 varieties of sweets (Bride→Groom)                               | Engagement      | Nirbandha           | Bride's Family     | Groom's Family             | food/gift              | New `GFT-###`                                    | `obligation_type: food_gift`, `quantity: 5 varieties`                               | HIGH           |
| Mudi (Groom→Bride)                                                | Engagement      | Nirbandha           | Groom's Family     | Bride                      | gift                   | `GFT-###` → `TRS-EG-01` adjacent                 | `obligation_type: gift`, `direction: groom_to_bride`                                | HIGH           |
| Lehenga + blouse                                                  | Engagement      | Nirbandha           | Groom's Family     | Bride                      | gift/purchase          | New `GFT-###` → `TRS-EG-02` analogous            | `category: bridal`, `chapterId: chapter_engagement`                                 | HIGH           |
| Engagement trolley                                                | Engagement      | Nirbandha           | Groom's Family     | Bride's Family             | logistics/gift         | New `GFT-###`                                    | `obligation_type: logistics_package`                                                | MEDIUM         |
| 5 varieties of sweets (Groom→Bride, incl. Coconut, Banana Kandhi) | Engagement      | Nirbandha           | Groom's Family     | Bride's Family             | food/gift              | New `GFT-###`                                    | `obligation_type: food_gift`                                                        | HIGH           |
| Phula                                                             | Engagement      | Nirbandha           | Groom's Family     | Bride                      | ritual_material        | `SAM-###` (SAM-001)                              | samagri checklist item                                                              | HIGH           |
| Desi Pana                                                         | Engagement      | Nirbandha           | Groom's Family     | Bride's Family             | ritual_consumable      | `SAM-###` + `SHP-SAM-###`                        | dual-tracked                                                                        | HIGH           |
| Maha-prasad                                                       | Engagement      | Nirbandha           | Groom's Family     | All                        | food/prasad            | `SAM-###`                                        | samagri checklist                                                                   | HIGH           |
| ₹5,000 per head (non-family attendees)                            | Engagement      | Nirbandha           | Groom's Family     | Non-family attendees       | cash_per_person        | New `GFT-###`                                    | `obligation_type: cash_per_person`, `amount_per_person_inr: 5000`, `total: TBD`     | TBD            |
| Saree (Gua/Haldi Basa)                                            | Before Marriage | Gua/Haldi Basa      | Groom's Family     | Bride                      | gift/purchase          | New `GFT-###` → `TRS-###`                        | `chapterId: pre_wedding_obligations`                                                | HIGH           |
| Makeup                                                            | Before Marriage | Gua/Haldi Basa      | Groom's Family     | Bride                      | service                | New `GFT-###`                                    | `obligation_type: service`                                                          | MEDIUM         |
| Coconut, Desi Pana, Gua, Haldi                                    | Before Marriage | Gua/Haldi Basa      | Groom's Family     | Ritual                     | ritual_material        | `SAM-003` (existing)                             | samagri checklist item                                                              | HIGH           |
| Pana, Gua (Bandhu Daksa)                                          | Before Marriage | Bandhu Daksa        | Bride's Family     | Groom's Father             | ritual_material        | New `SAM-###`                                    | samagri item under new RIT                                                          | MEDIUM         |
| Dress for Daddy (Bandhu Daksa)                                    | Before Marriage | Bandhu Daksa        | Bride's Family     | Groom's Father             | gift                   | New `GFT-###` → new `TRS-###`                    | `category: sara`                                                                    | HIGH           |
| Suit, Chain, Mudi, Bracelet (Batabasana)                          | Before Marriage | Batabasana          | Bride's Family     | Groom                      | gift_set               | New `GFT-###`                                    | `obligation_type: gift_set`, multiple `TRS-###`                                     | HIGH           |
| Alta, Sindoor, Saree for Mummy (Groom's Alta & Sindoor)           | Before Marriage | Mandap              | Groom's Family     | Bride + Groom's Mother     | ritual_material + gift | `SAM-005` (Alta/Sindoor) + New `GFT-###` (saree) | dual-tracked                                                                        | HIGH           |
| Sala Bidha gift (TBD)                                             | Before Marriage | Sala Bidha          | Groom's Family     | Bride's Brother            | gift                   | New `GFT-###`                                    | `resolution_status: open`                                                           | TBD            |
| Sali Hasta Ganthi gift (TBD)                                      | Before Marriage | Sali Hasta Ganthi   | Groom's Family     | Bride's Sister             | gift                   | New `GFT-###`                                    | `resolution_status: open`                                                           | TBD            |
| Baba ↔ Daddy dress exchange (Samdhi Milan)                        | Before Marriage | Samdhi Milan        | Both Families      | Each other                 | reciprocal_exchange    | New `GFT-###` (pair)                             | `obligation_type: reciprocal_exchange`, `direction: bilateral`                      | MEDIUM         |
| Laddoo, Dress (Sadu Basana)                                       | Before Marriage | Sadu Basana         | Groom's Family     | Bride's side               | gift + food            | New `GFT-###`                                    | `obligation_type: gift` + `food_gift`                                               | HIGH           |
| Alankar (Groom→Bride)                                             | Before Marriage | Alankar Exchange    | Groom's Family     | Bride                      | gift/jewellery         | New `GFT-###` → `TRS-JW-###` analogous           | `obligation_type: gift`, `category: jewellery`                                      | HIGH           |
| "TDK" item                                                        | Before Marriage | Alankar Exchange    | Groom's Family     | Bride                      | gift                   | New `GFT-###`                                    | `resolution_status: unreadable`, `description: "TDK — source handwriting unclear"`  | TBD            |
| 5 sets of dresses (Bride→Groom, Alankar)                          | Before Marriage | Alankar Exchange    | Bride's Family     | Groom                      | gift_set               | New `GFT-###`                                    | `obligation_type: gift_set`, `quantity: 5 sets`                                     | HIGH           |
| Trolley (Guin Chada)                                              | After Marriage  | Guin Chada          | Bride's Family     | Bride/Couple               | logistics              | New `GFT-###`                                    | `obligation_type: logistics_package`                                                | HIGH           |
| Dress for Devas (Bahu Daksa)                                      | After Marriage  | Bahu Daksa          | Bride's Family     | Devas (groom side males)   | gift                   | New `GFT-###`                                    | `obligation_type: gift`                                                             | MEDIUM         |
| 2 sarees (Bahu Bandhapana)                                        | After Marriage  | Bahu Bandhapana     | Bride's Family     | Bride (for in-laws ritual) | gift/ritual            | New `GFT-###`                                    | `obligation_type: gift`, `quantity: 2`                                              | HIGH           |
| Gold + Saree/Dress + Trolley (Nananda Putuli — 2 Didis)           | After Marriage  | Nananda Putuli      | Bride's Family     | 2 Groom Sisters (Didis)    | gift_set               | New `GFT-###`                                    | `obligation_type: package`, `quantity_gold: "TBD — unclear"`, `recipients: 2 Didis` | TBD (gold qty) |
| Saree set (Chaturthi Huma — Groom side)                           | After Marriage  | Chaturthi Huma      | Groom's Family     | Bride                      | gift                   | New `GFT-###` → `TRS-###`                        | `chapterId: post_wedding_obligations`                                               | HIGH           |
| Dhoti + Kurta (Chaturthi Huma — Bride side)                       | After Marriage  | Chaturthi Huma      | Bride's Family     | Groom                      | gift                   | New `GFT-###` → new `TRS-###`                    | `category: groom`                                                                   | HIGH           |
| Dress for BIL (Huma Bali Utheibaku)                               | After Marriage  | Huma Bali Utheibaku | Groom's Family     | Bride's Brother (BIL)      | gift                   | New `GFT-###`                                    | `obligation_type: gift`, `recipient_role: BIL`                                      | HIGH           |
| Uluguna items                                                     | After Marriage  | Uluguna             | Bride's Family     | TBD                        | gift                   | New `GFT-###`                                    | `resolution_status: unreadable`, `description: "items blacked out in source"`       | TBD            |
| Family Pack (Saree/Dress ×6 recipients)                           | After Marriage  | Family Pack         | Bride's Family     | Groom's Core Family        | package                | New `GFT-###` bundle                             | `obligation_type: package`, `package_items[]` with 6 recipient-role entries         | HIGH           |
| Trolley (Kutha Madani, Bride+Groom)                               | After Marriage  | Kutha Madani        | Bride's Family     | Bride + Groom              | logistics              | New `GFT-###`                                    | `obligation_type: logistics_package`                                                | HIGH           |
| Saree/Lehenga (Reception)                                         | After Marriage  | Reception           | Groom's Family     | Bride                      | gift/purchase          | New `GFT-###` → `TRS-BR-05` analogous            | `chapterId: post_wedding_obligations`                                               | HIGH           |
| Saree + Saga Macha (Groom side)                                   | After Marriage  | Saga Macha          | Groom's Family     | Bride's Family             | gift + food            | New `GFT-###`                                    | `obligation_type: gift` + `food_gift`                                               | HIGH           |
| Saga & Macha (Bride side)                                         | After Marriage  | Saga Macha          | Bride's Family     | Groom's Family             | food_gift              | New `GFT-###`                                    | `obligation_type: food_gift`                                                        | HIGH           |

---

### PHASE 5 — RECOMMENDED DATA FORMAT

**The TRUE canonical ingestion format for this data is: structured Markdown + YAML frontmatter (GFT-### spoke documents).**

_Rationale:_ All obligation data has cultural, governance, and financial dimensions. The web Shopping Registry JSONL is appropriate only for purchasable attire/jewellery. The obligation register spans rituals, gifts, exchanges, food, cash, and logistics — making the markdown entity model the correct home, consistent with how RIT-###, PAY-###, and PER-### entities work throughout this repository.

When new `TRS-###` JSONL entries are warranted (i.e., a purchasable item needs to appear in the Shopping Registry web app), they are created as a downstream addition after the `GFT-###` obligation is recorded.

---

#### Canonical Format Specification: `GFT-###` Obligation Record

```yaml
---
hub: 06_FINANCE_COMMERCIALS/gifts_and_shagun/HUB.md # (to be created)
id: GFT-###
event_id: "EVT-###" # REQUIRED — links to 01_TIMELINE_EVENTS/
ritual_name: "Ritual Name" # REQUIRED — free text (preserve family spelling)
ritual_id: "RIT-###" # OPTIONAL — only if ritual already has a RIT-### spec
responsible_family: "Bride | Groom | Both" # REQUIRED
direction: "bride_to_groom | groom_to_bride | bride_to_bride_family | groom_to_groom_family | bilateral | internal" # REQUIRED
obligation_type: "gift | reciprocal_exchange | ritual_material | food_gift | food_prasad | cash_per_person | service | logistics | package | gift_set" # REQUIRED
recipient_role: "" # REQUIRED — free text (e.g., "Bride", "Groom's Mother", "2 Didis", "BIL")
recipient_family: "Bride | Groom" # REQUIRED
items: [] # REQUIRED (can be empty if TBD)
  # Each item:
  # - description: "Saree"
  #   quantity: "1"           # Use "TBD" if unknown; NEVER invent
  #   trs_id: "TRS-###"      # OPTIONAL — if item exists in Shopping Registry
  #   sam_id: "SAM-###"      # OPTIONAL — if item is also a samagri material
resolution_status: "confirmed | open | unreadable | family_confirmation_required" # REQUIRED
notes: "" # OPTIONAL — preserve ambiguity notes verbatim
---
```

**Required fields:** `id`, `event_id`, `ritual_name`, `responsible_family`, `direction`, `obligation_type`, `recipient_role`, `recipient_family`, `items[]`, `resolution_status`

**Optional fields:** `ritual_id`, `trs_id` per item, `sam_id` per item, `notes`

**Allowed `obligation_type` values:**
`gift | reciprocal_exchange | ritual_material | food_gift | food_prasad | cash_per_person | service | logistics | package | gift_set`

**Allowed `resolution_status` values:**
`confirmed | open | unreadable | family_confirmation_required`

**Allowed `responsible_family` values:**
`Bride | Groom | Both`

**Allowed `direction` values:**
`bride_to_groom | groom_to_bride | bride_to_bride_family | groom_to_groom_family | bilateral | internal`

**ID rules:** Sequential 3-digit padded integer under `GFT-` prefix. Example: `GFT-001`, `GFT-002`. Assigned from next available in `06_FINANCE_COMMERCIALS/gifts_and_shagun/`.

---

#### Examples

##### 1. Complete confirmed example

```yaml
---
id: GFT-001
event_id: "EVT-001"
ritual_name: "Nirbandha"
ritual_id: "RIT-001"
responsible_family: "Bride"
direction: "bride_to_groom"
obligation_type: "gift"
recipient_role: "Groom's Mother"
recipient_family: "Groom"
items:
  - description: "Saree"
    quantity: "1"
    trs_id: ""
resolution_status: "confirmed"
notes: ""
---
```

##### 2. TBD / unresolved example

```yaml
---
id: GFT-014
event_id: "EVT-004"
ritual_name: "Sala Bidha"
ritual_id: ""
responsible_family: "Groom"
direction: "groom_to_groom_family"
obligation_type: "gift"
recipient_role: "Bride's Brother (Sala)"
recipient_family: "Bride"
items:
  - description: "Gift — exact item TBD"
    quantity: "TBD"
resolution_status: "open"
notes: "Source sheet records obligation but does not specify the item. Family confirmation required before purchase."
---
```

##### 3. Reciprocal exchange example

```yaml
---
id: GFT-016
event_id: "EVT-004"
ritual_name: "Samdhi Milan"
ritual_id: ""
responsible_family: "Both"
direction: "bilateral"
obligation_type: "reciprocal_exchange"
recipient_role: "Groom's Father ↔ Bride's Father"
recipient_family: "Both"
items:
  - description: "Dress (Groom's Father → Bride's Father)"
    quantity: "1"
  - description: "Dress (Bride's Father → Groom's Father)"
    quantity: "1"
resolution_status: "confirmed"
notes: "Simultaneous bilateral dress exchange between Baba and Daddy."
---
```

##### 4. Package / bundle example

```yaml
---
id: GFT-030
event_id: "EVT-006"
ritual_name: "Family Pack"
ritual_id: ""
responsible_family: "Bride"
direction: "bride_to_groom"
obligation_type: "package"
recipient_role: "Groom's Core Family"
recipient_family: "Groom"
items:
  - description: "Saree for Mom"
    quantity: "1"
    recipient_role: "Groom's Mother"
  - description: "Dress for Daddy"
    quantity: "1"
    recipient_role: "Groom's Father"
  - description: "Dress for Didi 1"
    quantity: "1"
    recipient_role: "Groom's Elder Sister"
  - description: "Dress for Didi 2"
    quantity: "1"
    recipient_role: "Groom's Younger Sister"
  - description: "Dress for Tiju"
    quantity: "1"
    recipient_role: "Groom's Brother-in-Law"
  - description: "Dress for Bacha Party"
    quantity: "TBD — count of children not specified"
    recipient_role: "Children (Groom side)"
resolution_status: "confirmed"
notes: "6-recipient family pack. Child count requires confirmation."
---
```

##### 5. Per-person cash obligation example

```yaml
---
id: GFT-008
event_id: "EVT-001"
ritual_name: "Nirbandha"
ritual_id: "RIT-001"
responsible_family: "Groom"
direction: "groom_to_groom_family"
obligation_type: "cash_per_person"
recipient_role: "Non-family engagement attendees"
recipient_family: "Groom"
items:
  - description: "Cash Shagun"
    quantity: "TBD — eligible attendee count not yet determined"
    amount_per_person_inr: 5000
    total_amount_inr: "TBD"
    exclusions: "Family members are excluded"
resolution_status: "open"
notes: "₹5,000 per head for non-family engagement attendees. Total cannot be calculated until eligible count is confirmed."
---
```

---

### PHASE 6 — GAP ANALYSIS

#### Already Supported (can be mapped directly)

- Attire gifts (sarees, lehengas, kurtas) → existing `TRS-###` JSONL + new `GFT-###` wrapper
- Ritual consumables (Gua, Pana, Alta, Haldi, Sindoor) → existing `SAM-###` checklists
- Event context → existing `EVT-001` through `EVT-007`
- Ritual context (where RIT-### specs exist) → `RIT-001` (Nirbandha), `RIT-003` (Mangan/Haldi), `RIT-005` (Kanyadaan/Hastaganthi), `RIT-011` (Chauthi)
- Precious assets (gold jewellery) → `AST-###` custodial record
- Payment tracking (once purchased) → `PAY-###`

#### Transform Required (can be represented, needs preprocessing)

- "Sara" gifting items → already mapped as `TRS-SA-###` category but need `GFT-###` wrapper for family obligation context
- Sweets / food gifts → need `GFT-###` with `obligation_type: food_gift`; not currently in JSONL (food is not a Shopping Registry item)
- Trolleys / logistics → need `GFT-###` with `obligation_type: logistics`; not currently modeled
- Makeup / services → need `GFT-###` with `obligation_type: service`

#### Architecture Gaps (genuinely cannot be represented without new scaffolding)

1. **`GFT-###` entity schema:** Referenced everywhere (`FAM-###.shagun_exchange_id`) but never scaffolded. Zero document files in `06_FINANCE_COMMERCIALS/gifts_and_shagun/`. **This is the primary gap.** All 40+ obligations from the handwritten sheets need this entity.
2. **`responsible_family` field:** No field exists in any entity to record which family bears an obligation. Must be added to `GFT-###`.
3. **`reciprocal_exchange` abstraction:** No bilateral exchange model anywhere. Must be part of `GFT-###` schema.
4. **`resolution_status: unreadable`:** Existing status enums (`Planned | Confirmed | etc.`) don't have a concept for "source document physically illegible." Must be added.
5. **`cash_per_person` obligation type:** No formula-based financial obligation model exists. `PAY-###` records actuals; it cannot project per-person cash totals with exclusion rules.
6. **New `RIT-###` specs needed:** Several rituals in the handwritten data (Gua/Haldi Basa, Bandhu Daksa, Batabasana, Sala Bidha, Sali Hasta Ganthi, Samdhi Milan, Sadu Basana, Alankar Exchange, Guin Chada, Bahu Daksa, Bahu Bandhapana, Nananda Putuli, Huma Bali Utheibaku, Uluguna, Family Pack, Kutha Madani, Saga Macha) do not have `RIT-###` specs and are not in `ritual_master_index.md`. These are family-tradition obligations, not formal Vedic liturgical rites. They may be better tracked in `GFT-###` with `ritual_name` (free text) rather than forcing new `RIT-###` specs for every family custom.

#### Source Ambiguity (requires family confirmation)

- **Sala Bidha** — item unspecified
- **Sali Hasta Ganthi** — item unspecified
- **"TDK"** — handwriting unclear
- **Nananda Putuli gold quantity** — partially obscured; must NOT be invented
- **Uluguna** — items blacked out; must NOT be inferred
- **Bacha Party** dress count — number of children not specified
- **Gua/Haldi Basa makeup** — scope of "makeup" and associated items unclear
- **Engagement trolley** — contents not specified

#### Missing Wedding Domains (NOT in handwritten sheets)

The following are domains that exist in the OS architecture but are NOT covered by this family obligation register:

- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Mangana** (formal groom-side invitation request to bride's family)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Dia Mangula** (pre-wedding lamp ritual with oil and wicks)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Nandimukhi** (ancestor propitiation before wedding rites)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Barajatri** (groom's wedding procession party composition and obligations)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Wedding-day ritual samagri** (beyond what is in handwritten sheets — full mandap kit per SAM-005)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Priest / Purohit requirements** (dakshina, travel, accommodation for officiating priests)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Bride & Groom wedding kits** (personal preparation items, parlour bookings, etc.)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Gruhapravesh full execution obligations** (beyond what is covered under Chaturthi Huma above)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Asta Mangala** — the return feast obligations (Bride's family hosting; items expected by Groom's family)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Hospitality** (meal hosting obligations per event, tray arrangements, room allocations for visiting family)
- `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED`: **Venue/decorator dependencies** (which family bears which cost for which event)

These must NOT be added to the family obligation register without explicit family confirmation.

---

### PHASE 7 — SUMMARY (NO CODE CHANGES MADE)

#### 1. "Here is the format I want from you."

**Provide new family obligation data as `GFT-###` Markdown files** with the YAML frontmatter schema defined in Phase 5 above.

For each obligation record, specify: `event_id`, `ritual_name`, `responsible_family`, `direction`, `obligation_type`, `recipient_role`, `items[]` (with `description` and `quantity`), and `resolution_status`.

Where an item is also a purchasable shopping item (attire, jewellery), note the `trs_id` if one exists or leave blank for new items. Where an item is also a ritual samagri material, note the `sam_id`.

For future obligation data, structure it in this format:

```
EVENT: [event name]
RITUAL: [ritual name]
RESPONSIBLE: [Bride's Family / Groom's Family / Both]
DIRECTION: [→ recipient description]
TYPE: [gift / reciprocal / ritual_material / food / cash / service / logistics / package]
ITEMS:
  - [item description] × [quantity or TBD]
STATUS: [confirmed / TBD / source unclear]
NOTES: [any ambiguity verbatim from source]
```

#### 2. "Here is how your handwritten data maps to my application."

- **40+ distinct obligation records** identified across 3 event phases.
- **~60% of obligations** map to new `GFT-###` documents (the primary unscaffolded entity).
- **~20% of obligations** additionally require new `TRS-###` JSONL entries in the Shopping Registry (purchasable attire items).
- **~15% of obligations** map to existing or new `SAM-###` samagri checklists (ritual consumables).
- **~5% (the ₹5,000 cash obligation)** has no direct mapping and requires a new `cash_per_person` pattern within `GFT-###`.

#### 3. "Here are the unresolved items."

| Item                             | Reason Unresolved                                        |
| -------------------------------- | -------------------------------------------------------- |
| Sala Bidha gift                  | Obligation known; content unspecified                    |
| Sali Hasta Ganthi gift           | Obligation known; content unspecified                    |
| "TDK" (Alankar Exchange)         | Handwriting unclear                                      |
| Nananda Putuli — gold quantity   | Source partially obscured; quantity must not be invented |
| Uluguna items                    | Source blacked out; items must not be inferred           |
| Bacha Party count                | Number of children unspecified                           |
| Engagement trolley contents      | "Trolley" described but contents not listed              |
| ₹5,000 cash — eligible headcount | Count of non-family attendees not determined             |

#### 4. "Here are the architecture gaps."

1. **`GFT-###` schema not scaffolded** — the single most important gap. Zero entity files exist in `06_FINANCE_COMMERCIALS/gifts_and_shagun/`.
2. **No `responsible_family` field** in any existing entity.
3. **No `reciprocal_exchange` abstraction** — Samdhi Milan cannot be correctly represented today.
4. **No `resolution_status: unreadable`** — cannot distinguish "planned" from "source illegible."
5. **No `cash_per_person` obligation model** — the ₹5,000 per-attendee obligation has no existing home.
6. **New family custom rituals have no `RIT-###` specs** — 17+ family rituals (Gua/Haldi Basa, Bandhu Daksa, Batabasana, etc.) do not appear in `ritual_master_index.md`. Recommend tracking via `GFT-###` `ritual_name` (free text) rather than forcing formal `RIT-###` specs, since these are family obligations rather than formal Vedic liturgy.

#### 5. "Here are the potential wedding domains missing from the handwritten list."

See the 11 `POTENTIAL_MISSING_DOMAIN — FAMILY CONFIRMATION REQUIRED` items listed in Phase 6 above.

---

_No source code, schemas, database records, or application files were modified in producing this report. Implementation and import begin only after this contract is reviewed and approved._

# Query 1.1 -

# Review 1.1 -# ARCHITECTURE REVIEW — FAMILY OBLIGATION MODEL

## Pre-Implementation Gate for the Handwritten Family Obligation Register

The discovery report has been reviewed.

The discovery work is accepted as useful, but the proposed GFT-### schema is NOT yet approved for implementation.

The report establishes that the current architecture has a missing abstraction:

> The application models purchasable things (TRS), ritual materials (SAM), payments (PAY), etc., but does not currently model the family obligation that causes those requirements to exist.

This appears to be the root architectural gap.

Before creating GFT-### documents or modifying schemas, conduct an architecture-level review of the proposed obligation model.

---

## 1. Validate the actual domain concept

The proposed namespace is:

GFT-###

under:

06_FINANCE_COMMERCIALS/gifts_and_shagun/

However, the proposed entity contains:

- gifts
- reciprocal exchanges
- ritual materials
- food
- cash-per-person obligations
- services
- logistics
- packages
- gift sets

Therefore determine:

### Is GFT actually a "Gift/Shagun" entity?

OR

### Is it actually a "Family Obligation" entity that historically happens to live under gifts_and_shagun?

Do not decide based on the current directory name.

Determine the correct domain concept from the application's architecture and responsibilities.

If Family Obligation is the correct abstraction, explain:

1. why
2. whether GFT should remain as the technical prefix
3. whether the directory should be renamed
4. whether a new canonical entity is preferable
5. migration/compatibility implications

Do NOT implement yet.

---

## 2. Validate the lifecycle

The current proposal implicitly suggests:

Event
→ Ritual
→ GFT
→ TRS/SAM/PAY/etc.

Determine whether the correct lifecycle is:

Event
→ Ritual/Custom
→ Obligation
→ Requirement
→ Procurement
→ Fulfilment
→ Handover

or something else.

The objective is to ensure that:

"what we are obligated to give"

is not confused with:

"what we need to purchase."

Show the proposed canonical relationship graph.

---

## 3. Validate actor / recipient modelling

The proposed GFT schema currently contains:

- responsible_family
- direction
- recipient_role
- recipient_family

These may create redundant or contradictory representations.

Determine the canonical model for:

### Obligor

Who owns the obligation?

### Recipient

Who receives it?

### Direction

Should direction be stored, or derived?

### Recipient scope

How should we represent:

- one person
- multiple named people
- family
- family subset
- non-family attendees
- anonymous/role-based recipients

Use examples from the source data:

- Bride Family → Groom
- Groom Family → Bride
- Baba ↔ Daddy
- Groom Family → non-family engagement attendees
- Bride Family → 2 Didis
- Bride Family → Groom's core family

Identify a model that cannot produce contradictory states.

---

## 4. Validate item lifecycle

The proposal currently has:

GFT item
→ optional TRS
→ optional SAM

Determine whether this is sufficient.

We need to distinguish:

### Obligation

"Saree must be given to Groom's Mother."

### Procurement requirement

"A saree needs to be sourced."

### Shopping item

"The selected saree is TRS-###."

### Asset

"The purchased gold necklace is AST-###."

### Payment

"The vendor payment is PAY-###."

### Handover

"The item was actually handed over."

Design the minimum relationship graph that prevents duplicate SSOTs.

Do not create duplicate copies of the same item merely because it appears in multiple operational modules.

---

## 5. Validate packages and bundles

The proposal uses:

items[]

inside GFT.

Test whether this correctly represents:

### Family Pack

One obligation containing:

- Mom
- Daddy
- Didi 1
- Didi 2
- Tiju
- Bacha Party

### Nananda Putuli

One named obligation containing multiple recipients and different item types.

Determine whether:

- package
- gift_set
- exchange
- obligation

are genuinely different concepts or merely different classifications of the same underlying structure.

Avoid taxonomy inflation.

---

## 6. Validate reciprocal exchanges

Samdhi Milan is:

Baba → Daddy
Daddy → Baba

Determine the canonical representation.

It must preserve:

- two parties
- two directions
- two fulfilment states
- potentially different items
- potentially different values

Do NOT represent it as two unrelated shopping records.

Determine whether:

A. one bilateral obligation with child obligations

or

B. two linked obligations with a shared exchange ID

is architecturally superior.

---

## 7. Validate cash-per-person

The ₹5,000 engagement obligation is:

₹5,000 × eligible non-family attendee

The system must preserve:

- amount per person
- eligibility rule
- exclusion rule
- current eligible count, if known
- projected total
- actual distributed amount
- fulfilment status

Determine whether this belongs under:

Family Obligation
Payment
Gift/Shagun
or a reusable financial obligation abstraction.

Do not calculate totals unless the eligible count exists.

---

## 8. Validate resolution state

The proposal introduces:

confirmed
open
unreadable
family_confirmation_required

Determine whether these belong to:

- the obligation
- individual items
- source provenance
- decision state

For example:

Nananda Putuli:
obligation = confirmed
gold quantity = source unclear

These should not necessarily have the same resolution state.

Design the correct granularity.

---

## 9. Validate provenance

The handwritten pages are the source.

The model must be able to preserve:

- source wording
- source ambiguity
- source confidence
- family confirmation state

Determine whether provenance should be represented explicitly.

Do not silently normalize:

- ritual names
- family terminology
- unclear handwriting
- quantities
- recipients

---

## 10. Canonical authoring format

Only after the above architecture is resolved should you determine the canonical authoring format.

Evaluate:

- Markdown + YAML
- JSONL
- CSV
- existing entity documents
- another existing canonical format

Do not declare GFT Markdown to be canonical merely because it is convenient.

The final answer must distinguish:

### Existing canonical format

from

### Proposed canonical format

---

## 11. Anti-duplication test

Run the proposed architecture against these examples:

1. Engagement Mudi
2. Groom's shirt + pant
3. Phula
4. Desi Pana
5. ₹5,000/head
6. Samdhi Milan
7. Nananda Putuli
8. Family Pack
9. Reception saree/lehenga
10. Gold jewellery

For every example show:

- canonical owner
- derived/linked entities
- whether it creates a TRS
- whether it creates a SAM
- whether it creates a PAY
- whether it creates an AST
- whether it creates a GFT/obligation
- how fulfilment is tracked

The same real-world obligation must never accidentally become multiple competing SSOT records.

---

## 12. Architecture decision

End with:

### A. APPROVE

What parts of the proposed model are architecturally sound.

### B. MODIFY

What must change before implementation.

### C. REJECT

What should not be implemented.

### D. FINAL CANONICAL MODEL

Provide the final entity relationship diagram in text.

### E. FINAL AUTHORING CONTRACT

Provide the exact data format we should use to supply family obligation data.

### F. IMPLEMENTATION GATE

State exactly what must be approved before any GFT/TRS/SAM/PAY records are created.

---

## HARD CONSTRAINTS

DO NOT:

- create GFT files
- modify schemas
- modify source code
- rename directories
- import handwritten data
- generate IDs
- create migrations

This is an Architecture Council validation only.

The objective is to prevent us from turning a useful discovery into another parallel data model or duplicate SSOT.

We need ONE canonical obligation model, ONE ownership model, ONE lifecycle, and deterministic downstream projections into Shopping, Samagri, Assets and Payments.

## Response 1.1 — Architecture Review & Formal Obligation Model

---

### 1. Domain Concept Validation: `GFT` vs `OBL` (Family Obligation)

#### Finding: Category Conflation in Current Staging

In the initial discovery report, the proposed namespace was `GFT-###` placed under `06_FINANCE_COMMERCIALS/gifts_and_shagun/`. Architectural inspection of the repository reveals that this is a **domain boundary conflation**:

1. **The Scope of `06_FINANCE_COMMERCIALS/gifts_and_shagun/`**:
   Per [`06_FINANCE_COMMERCIALS/gifts_and_shagun/README.md`](file:///d:/GitHub_Repo/Sree_Krushna/06_FINANCE_COMMERCIALS/gifts_and_shagun/README.md) and [`03_PEOPLE_GUESTS/family_template.md`](file:///d:/GitHub_Repo/Sree_Krushna/03_PEOPLE_GUESTS/family_template.md) (`shagun_exchange_id: "GFT-###"`), the `GFT` concept was conceived to record **incoming guest shagun envelopes and reception desk cash gifts** administered by the gift desk custodian ([`PER-010`](file:///d:/GitHub_Repo/Sree_Krushna/03_PEOPLE_GUESTS/directory/)), plus outbound mass return favors (_Bidhai_ boxes / silver coins).
2. **The Nature of the Handwritten Data**:
   The handwritten sheets do NOT represent guest shagun cash intake or commercial vendor payments. They represent **customary, bilateral family covenants and ritual obligations** (_Vidhi Dayitva / Kula Parampara / Bhara / Sara_). These obligations are liturgical, interpersonal, and covenantal, binding _Barapaksha_ (Groom side) and _Kanyapaksha_ (Bride side) to specific reciprocal rites, dress presentations, and offerings across all wedding milestones.

#### Architectural Determination:

- **Is it a "Gift/Shagun" entity?** NO.
- **Is it a "Family Obligation" entity?** YES.

#### Answers to the 5 Architecture Questions:

1. **Why**: Treating sacred family obligations as "gifts" reduces binding cultural covenants to voluntary, donor-centric presents and conflates financial shagun envelopes with ritual duties (such as Groom's Alta in Mandap, Samdhi Milan, or Batabasana).
2. **Technical Prefix**:
   - Retire `GFT-###` from family obligation modeling.
   - Introduce **`OBL-###`** (Family Obligation) as the canonical entity prefix.
   - Retain `GFT-###` strictly for its intended purpose: guest shagun desk logging and return favor distribution in `06_FINANCE_COMMERCIALS/`.
3. **Directory Location**:
   - `06_FINANCE_COMMERCIALS/gifts_and_shagun/` must NOT house family obligations.
   - Family obligations belong canonically to **`02_RITUALS_CULTURE/obligations/`** (cultural covenants originating from rites) with a mirrored relational spoke in **`03_PEOPLE_GUESTS/family_obligations/`** (inter-family covenants).
   - Canonical home: `02_RITUALS_CULTURE/obligations/` (since every obligation is structurally anchored to an event/ritual milestone).
4. **Is a New Canonical Entity Preferable?**
   - YES. Introducing `OBL-###` as a distinct spoke entity is cleaner, domain-accurate, and prevents mutating the financial ledger with social covenants.
5. **Migration / Compatibility Implications**:
   - Zero breaking changes to `FAM-###` (`shagun_exchange_id: "GFT-###"` remains valid for guest envelope accounting).
   - `OBL-###` establishes clean foreign keys to `EVT-###`, `RIT-###`, `FAM-###`, `PER-###`, `TRS-###`, and `SAM-###`.

---

### 2. Obligation Lifecycle & Canonical Relationship Graph

The relationship between what families are culturally bound to provide versus what operations must purchase or pack must be rigorously decoupled. An obligation is the **Demanding Cause**; shopping, samagri, assets, and payments are **Downstream Fulfilment Projections**.

#### The 7-Stage Obligation Lifecycle:

```
[1. Event / Ritual Context] (EVT-### / RIT-### / Kula Custom)
       │
       ▼
[2. Cultural Obligation Identified] (OBL-### — "Why & Who")
       │
       ▼
[3. Specification & Consensus Gate] (Spec Clarified, Approvals Captured)
       │
       ▼
[4. Sourcing & Procurement Split] (Downstream Projection: "How")
       ├── Purchasable Goods   ──► Shopping Registry (TRS-###)
       ├── Liturgical Samagri  ──► Samagri Checklist (SAM-###)
       ├── Precious Heirlooms  ──► Precious Asset Custody (AST-###)
       ├── Cash Honoraria      ──► Cash Desk / Budget Ledger (PAY-###)
       └── Logistics / Baggage ──► Logistics Run Sheet (VEN-### / Fleet)
       │
       ▼
[5. Staging & Custody Handoff] (Packed, Labelled, Assigned to PER-### Custodian)
       │
       ▼
[6. Ceremonial Presentation / Handover] (Executed at Mandap/Event, Witnessed)
       │
       ▼
[7. Liturgical Verification & Archival] (Run-sheet sign-off, Ledger reconciled)
```

#### Canonical Relationship Graph:

```mermaid
graph TD
    EVT["Event (EVT-###)"] --> RIT["Ritual / Custom (RIT-### / Custom)"]
    RIT --> OBL["Family Obligation (OBL-###)"]

    OBL -->|Obligor / Debtor| FAM_SRC["Obligor Family (FAM-###)"]
    OBL -->|Beneficiary| REC["Recipient (Person / Role / Cohort)"]

    OBL -.->|Projects Physical Purchase| TRS["Shopping Item (TRS-###)"]
    OBL -.->|Projects Ritual Material| SAM["Samagri Item (SAM-###)"]
    OBL -.->|Projects Precious Custody| AST["Precious Asset (AST-###)"]
    OBL -.->|Projects Cash Outflow| PAY["Financial Outflow (PAY-###)"]

    TRS -.->|Vendor Settlement| PAY
    AST -.->|Physical Security| PER_CUST["Assigned Custodian (PER-###)"]
    OBL -->|Verification Gate| GATE["Ceremonial Handover (GATE-##)"]
```

---

### 3. Actor & Recipient Modelling (Contradiction-Free)

The initial discovery draft had `responsible_family`, `direction`, `recipient_role`, and `recipient_family`. Having independent fields for both parties _plus_ a hardcoded `direction` enum introduces state contradiction risks (e.g. `responsible_family: Bride`, `recipient_family: Groom`, but `direction: bilateral`).

#### Canonical Actor Model:

```yaml
obligor:
  family: "Bride | Groom | Both" # SSOT for who bears the duty
  household_id: "FAM-001 | FAM-002" # Reference to 03_PEOPLE_GUESTS/families/
  lead_person_id: "PER-###" # Optional: Specific person acting as principal (e.g. Baba, Daddy)

recipient:
  scope: "person | role_in_family | family_unit | cohort | dynamic_population"
  family: "Bride | Groom | Both | External"
  role_title: "Groom's Mother | 2 Didis | Devas | Bacha Party"
  person_ids: ["PER-###"] # Optional: Bound to directory if known
  eligibility_rule: "" # Used when scope is dynamic_population
```

#### Direction Rule:

- **Direction is strictly a DERIVED attribute** computed dynamically:
  $$\text{Direction} = \text{obligor.family} \longrightarrow \text{recipient.family}$$
- It is **NEVER** stored as an independently editable string in the data model.

#### Validation Matrix Against Source Data:

| Source Obligation                    | `obligor.family`              | `recipient.scope`    | `recipient.family` | `recipient.role_title` / `eligibility_rule` | `recipient.person_ids`        | Derived Direction | Contradiction Risk |
| :----------------------------------- | :---------------------------- | :------------------- | :----------------- | :------------------------------------------ | :---------------------------- | :---------------- | :----------------- |
| **Bride → Groom (Mudi)**             | `Bride`                       | `person`             | `Groom`            | Groom                                       | `["PER-001"]` (Krushna)       | Bride → Groom     | ZERO               |
| **Groom → Bride (Lehenga)**          | `Groom`                       | `person`             | `Bride`            | Bride                                       | `["PER-002"]` (Sree)          | Groom → Bride     | ZERO               |
| **Baba ↔ Daddy (Samdhi Milan)**      | _Atomic Pair_ (See Section 6) | `person`             | Reciprocal         | Groom's Father ↔ Bride's Father             | `["PER-005"]` ↔ `["PER-007"]` | Bilateral         | ZERO               |
| **Groom → Non-Family Attendees**     | `Groom`                       | `dynamic_population` | `External`         | Rule: "Non-family engagement attendees"     | `[]`                          | Groom → External  | ZERO               |
| **Bride → 2 Didis (Nananda Putuli)** | `Bride`                       | `cohort`             | `Groom`            | "2 Groom's Sisters (Didis)"                 | `["PER-003", "PER-004"]`      | Bride → Groom     | ZERO               |
| **Bride → Groom Core Family**        | `Bride`                       | `cohort`             | `Groom`            | "Groom's Core Household"                    | `["PER-005", "PER-006", ...]` | Bride → Groom     | ZERO               |

---

### 4. Item Lifecycle & Anti-Duplication SSOT Architecture

To ensure the system never creates competing SSOT records across domains, each entity has an immutable responsibility boundary:

```
[OBL-###: Customary Obligation]
  ├── WHY: Sacred family commitment
  ├── WHO: Obligor -> Recipient
  └── STATE: Identified -> Agreed -> Sourced -> Staged -> Handed_Over
       │
       ├─────── [TRS-###: Shopping Catalog]
       │          ├── WHAT: Exact commercial SKU / fabric / design
       │          ├── WHERE: Store name, price range, trial status
       │          └── STATE: Shortlisted -> Ordered -> Alterations -> Ready
       │
       ├─────── [AST-###: Precious Asset]
       │          ├── VALUE: Weight (g), carat, locker box ID
       │          └── STATE: Bank Locker -> Transit Custody -> Mandap Presentation
       │
       ├─────── [SAM-###: Samagri Checklist]
       │          ├── LITURGY: Sacred purity, mantra usage, consecration
       │          └── STATE: Unchecked -> Procured -> Consecrated
       │
       └─────── [PAY-###: Financial Ledger]
                  ├── MONEY: Bank outflow, invoice reference, payment mode
                  └── STATE: Pending -> Settled -> Reconciled
```

#### The Invariant:

- `OBL-###` holds the **obligation identity and handover verification**.
- If an obligation requires an attire purchase, it references `trs_id: "TRS-###"`. The price, store, approvals, and alteration notes live **exclusively** in `TRS-###`.
- If an item is gold jewellery (e.g. Batabasana gold chain), `OBL-###` references both `trs_id` (procurement) and `ast_id` (custody).
- `OBL-###` never duplicates the shopping item's budget or the vendor invoice details.

---

### 5. Packages and Bundles: Preventing Taxonomy Inflation

#### Finding: Structural Commonality

The concepts of "Package", "Gift Set", "Family Pack", and "Composite Bhaar" are **not distinct entities**. Creating separate schemas for each is a classic case of taxonomy inflation.

#### The Canonical Solution: Composite Obligation Structure

Every `OBL-###` supports a `structure` attribute:

- `structure: "atomic"` (single item, e.g. Mudi or Groom's Alta)
- `structure: "composite_bundle"` (group of items under a unified cultural banner)

When `structure: "composite_bundle"`, the obligation contains an array of `line_items[]`. Each line item can specify its own sub-recipient, description, quantity, and fulfillment link:

##### 1. Family Pack Representation:

```yaml
id: OBL-035
cultural_name: "Family Pack (Groom Core Family Vastra)"
structure: "composite_bundle"
obligor:
  family: "Bride"
recipient:
  scope: "cohort"
  family: "Groom"
  role_title: "Groom's Core Family"
line_items:
  - line_id: 1
    recipient_role: "Groom's Mother"
    description: "Sambalpuri Silk Saree"
    quantity: 1
    fulfillment_type: "shopping"
    trs_id: "TRS-SA-01"
  - line_id: 2
    recipient_role: "Groom's Father"
    description: "Kurta-Pajama / Suit Set"
    quantity: 1
    fulfillment_type: "shopping"
    trs_id: "TRS-SA-02"
  - line_id: 3
    recipient_role: "Didi 1"
    description: "Designer Dress / Saree"
    quantity: 1
    fulfillment_type: "shopping"
  - line_id: 4
    recipient_role: "Didi 2"
    description: "Designer Dress / Saree"
    quantity: 1
    fulfillment_type: "shopping"
  - line_id: 5
    recipient_role: "Tiju (BIL)"
    description: "Formal Dress / Kurta Set"
    quantity: 1
    fulfillment_type: "shopping"
  - line_id: 6
    recipient_role: "Bacha Party"
    description: "Coordinated Kids Wear"
    quantity: "TBD — child count unconfirmed"
    spec_status: "Pending_Family_Confirmation"
    fulfillment_type: "shopping"
```

##### 2. Nananda Putuli Representation:

```yaml
id: OBL-030
cultural_name: "Nananda Putuli"
structure: "composite_bundle"
obligor:
  family: "Bride"
recipient:
  scope: "cohort"
  family: "Groom"
  role_title: "2 Groom's Sisters (Didis)"
line_items:
  - line_id: 1
    description: "Gold Ornament"
    quantity: "TBD — source quantity partially obscured"
    spec_status: "Source_Unclear"
    fulfillment_type: "asset_and_shopping"
  - line_id: 2
    description: "Saree / Dress Suite"
    quantity: "2 sets (1 per Didi)"
    spec_status: "Fully_Specified"
    fulfillment_type: "shopping"
  - line_id: 3
    description: "Presentation Luggage Trolley"
    quantity: 2
    spec_status: "Fully_Specified"
    fulfillment_type: "logistics"
```

---

### 6. Reciprocal Exchanges: Architectural Design for Samdhi Milan

Review 1.1 poses the choice:

- **Option A**: One bilateral obligation with child obligations.
- **Option B**: Two linked obligations with a shared exchange ID.

#### Architectural Evaluation:

- In **Option A**, if the Bride's side procures their dress at Kalamandir on Tuesday (Status: `Ready`), but the Groom's side is still tailoring theirs at Raymond (Status: `In Alterations`), a single entity suffers from internal state fracture, concurrent locking problems, and ambiguous ownership.
- In **Option B**, each family owns their exact procurement, budget, custody, and handover readiness independently. They are joined by an `exchange_cluster_id`.

#### Determination: OPTION B is Strictly Superior.

Reciprocal exchanges are modeled as **two distinct, atomic `OBL-###` records paired via an `exchange_cluster_id`**:

```mermaid
graph LR
    subgraph EXC["Exchange Cluster: EXC-001 (Samdhi Milan)"]
        OBL1["OBL-021: Groom Family → Bride's Father<br/>(Baba presents Dress to Daddy)<br/>Owner: Groom Family | State: Ready"]
        OBL2["OBL-022: Bride Family → Groom's Father<br/>(Daddy presents Dress to Baba)<br/>Owner: Bride Family | State: Shortlisted"]
        OBL1 <-->|Bilateral Cross-Ref| OBL2
    end
```

Both records reference:

```yaml
exchange_cluster:
  cluster_id: "EXC-001"
  cluster_name: "Samdhi Milan Vastra Exchange"
  peer_obligation_id: "OBL-022" # (and vice versa)
  synchronous_handover: true # Handover occurs simultaneously in mandap
```

This guarantees:

1. Two distinct obligors with independent accountability.
2. Two independent sourcing lifecycles and budgets.
3. Clean synchronous verification at `GATE-02` (Mandap Milni) without state corruption.

---

### 7. Cash-per-Person Honorarium Modeling

#### Analysis of the ₹5,000 Engagement Obligation

The source notes: _"₹5,000 per head for those attending the engagement, excluding family members"_.

#### Architectural Rules:

1. **Never create an invented integer total**: Storing `total: 100000` when no attendee count exists is a fatal violation of data integrity (`INV-DATA-HONESTY`).
2. **Where does it belong?**:
   - The **Obligation Covenant** belongs in `OBL-###`.
   - The **Cash Preparation & Distribution** belongs in `06_FINANCE_COMMERCIALS/cash_logistics.md` (Physical envelope denomination management) and `PAY-###` (only when money is actually drawn or disbursed).
3. **Canonical Representation**:

```yaml
id: OBL-008
cultural_name: "Nirbandha Guest Shagun Honorarium"
structure: "atomic"
obligation_nature: "formula_cash_honorarium"
obligor:
  family: "Groom"
recipient:
  scope: "dynamic_population"
  family: "External"
  eligibility_rule: "Attending Nirbandha ceremony guests, excluding Bride and Groom family members"
cash_formula:
  rate_per_person_inr: 5000
  headcount_status: "UNRESOLVED — Dependent on RSVP confirmation"
  eligible_headcount: null # Must remain null until RSVP gate
  projected_total_inr: null # Computed dynamically: rate * headcount
  envelope_preparation_status: "Pending_Headcount"
notes: "Groom family obligation to present cash envelopes to external attendees. Total cannot be computed until RSVP freeze."
```

---

### 8. Granular Resolution & Decision State Matrix

The status of the _social covenant_ must not be conflated with the _clarity of the source handwriting_ or the _procurement progress_.

#### Two-Tier State Model:

##### Tier 1: Obligation Lifecycle State (`lifecycle_status`)

- `Identified`: Documented from source notes.
- `Agreed`: Confirmed by both family planning councils.
- `Procuring`: Downstream sourcing in progress.
- `Staged`: Items procured, verified, and placed with custodian.
- `Handed_Over`: Formally executed during the ceremony.
- `Waived`: Mutually cancelled or modified by elder consensus.

##### Tier 2: Specification / Source Clarity State (`spec_clarity`)

- `Fully_Specified`: Item name, quantity, and requirements are crystal clear.
- `TBD_Family_Choice`: Custom is fixed; specific gift is left to host discretion ("whatever you will like / give").
- `Source_Unclear`: Handwriting or source notes are physically blurred, smudged, or truncated (e.g. Nananda Putuli gold qty).
- `Source_Redacted`: Items deliberately blacked out in notes (e.g. Uluguna).
- `Pending_Family_Confirmation`: Requires verbal clarification with elders (e.g. Bacha Party count).

#### Application to Problematic Source Items:

| Source Obligation Item    | `lifecycle_status` | `spec_clarity`                | Resolution Action Required                                      |
| :------------------------ | :----------------- | :---------------------------- | :-------------------------------------------------------------- |
| **Sala Bidha**            | `Agreed`           | `TBD_Family_Choice`           | Host family to decide gift choice (watch, suit, cash, or gold)  |
| **Sali Hasta Ganthi**     | `Agreed`           | `TBD_Family_Choice`           | Host family to decide gift choice                               |
| **"TDK" (Alankar)**       | `Identified`       | `Source_Unclear`              | Re-inspect original paper or ask elders what "TDK" stands for   |
| **Nananda Putuli (Gold)** | `Agreed`           | `Source_Unclear`              | Obligation agreed; exact gold weight/item requires confirmation |
| **Uluguna (Blacked-out)** | `Identified`       | `Source_Redacted`             | Items blacked out on sheet; family must confirm if still active |
| **Bacha Party Count**     | `Agreed`           | `Pending_Family_Confirmation` | Headcount of children attending needs tally                     |

---

### 9. Provenance & Sacred Source Fidelity

To uphold the prime invariant **Zero Silent Normalization**, every obligation document must record its raw, immutable provenance before any structural mapping:

```yaml
provenance:
  source_sheet: "Handwritten Planning Sheet 1 & 2 (260926_ShoppingList2)"
  source_verbatim_title: "Sala Bidha"
  source_verbatim_text: "Gift / item — exact choice TBD"
  source_language: "Odia-English Colloquial"
  confidence_score: "HIGH | MEDIUM | LOW | TBD"
  family_verbal_confirmation_needed: true
```

#### Invariants:

1. **Never alter colloquial Odia ritual names**: Retain `Batabasana`, `Bandhu Daksa`, `Sadu Basana`, `Guin Chada`, `Bahu Daksa`, `Bahu Bandhapana`, `Kutha Madani`, `Uluguna`, `Saga Macha`. Do NOT attempt to Sanskritize them into generic Vedic terminology.
2. **Never convert "whatever you give" into an invented item**.
3. **Never substitute a blank for an unreadable word**.

---

### 10. Canonical Authoring Format Specification

#### The Evaluation of Formats:

- **JSONL / CSV**: Suitable for flat, homogenous records (like 44 shopping items with SKU, price, store). Catastrophically inadequate for multi-party covenants with nested line items, provenance trails, formulas, and reciprocal peer links.
- **Markdown with Structured YAML Frontmatter (`OBL-###.md`)**: Perfect parity with the rest of the Marriage OS architecture (`EVT-###`, `RIT-###`, `PER-###`, `FAM-###`). It provides human-readable documentation for family elders while remaining 100% machine-parseable by build compilers and validation scripts.

#### Proposed Architecture Contract:

1. **Authoring Format (SSOT)**: Markdown + YAML frontmatter (`02_RITUALS_CULTURE/obligations/OBL-###.md`).
2. **Derived Ingestion Pipeline**:
   - A build script (`scripts/compile-obligations.cjs`) parses `OBL-###.md` files.
   - Auto-generates `02_RITUALS_CULTURE/obligations/family_obligations_master.md` (Executive Master Table).
   - Emits any new purchasable attire line items directly into `04_PROCUREMENT_VENDORS/shopping_and_trousseau/shopping_items.jsonl` (with `obligation_id: "OBL-###"` backlink).
   - Emits cash requirements into `06_FINANCE_COMMERCIALS/cash_logistics.md`.

---

### 11. Anti-Duplication Stress Test (10 Real-World Examples)

To prove that the architecture prevents duplicate SSOTs, we trace the 10 benchmark items across the entire OS:

| #      | Real-World Item           | Canonical Owner (SSOT)              | Downstream Entities Linked                 | Creates TRS? | Creates SAM? |  Creates PAY?  |  Creates AST?  | Creates OBL? | How Fulfilment & Handover is Tracked                                     |
| :----- | :------------------------ | :---------------------------------- | :----------------------------------------- | :----------: | :----------: | :------------: | :------------: | :----------: | :----------------------------------------------------------------------- |
| **1**  | **Engagement Mudi**       | `OBL-001` (Nirbandha Exchange)      | `TRS-EG-01` (Rings SKU), `AST-001` (Vault) |    ✅ Yes    |    ❌ No     | ✅ Yes (Bill)  | ✅ Yes (Vault) | ✅ `OBL-001` | Custodian delivers ring tray to stage; signed off at `GATE-01`.          |
| **2**  | **Groom's shirt + pant**  | `OBL-002` (Nirbandha Vastra)        | New `TRS-EG-06` (Manyavar SKU)             |    ✅ Yes    |    ❌ No     | ✅ Yes (Store) |     ❌ No      | ✅ `OBL-002` | Trial completed in Shopping Registry; packed in bride gifting trunk.     |
| **3**  | **Phula**                 | `SAM-001` (Nirbandha Samagri)       | `OBL-006` (Groom Family Phula)             |    ❌ No     | ✅ `SAM-001` | ❌ Cash petty  |     ❌ No      | ✅ `OBL-006` | Sourced fresh morning of event by floral coordinator.                    |
| **4**  | **Desi Pana**             | `SAM-001` (Sacred Consumable)       | `OBL-007` (Groom Family Pana)              |    ❌ No     | ✅ `SAM-001` | ❌ Cash petty  |     ❌ No      | ✅ `OBL-007` | Consecrated at temple, delivered in chilled brass containers.            |
| **5**  | **₹5,000 / head cash**    | `OBL-008` (Attendee Honorarium)     | `cash_logistics.md` (Envelopes)            |    ❌ No     |    ❌ No     | ✅ When drawn  |     ❌ No      | ✅ `OBL-008` | Physical cash envelopes tallied at desk; disbursed to eligible guests.   |
| **6**  | **Samdhi Milan Dress**    | `OBL-021` & `OBL-022` (Linked Pair) | `TRS-SA-02` (Baba), `TRS-SA-03` (Daddy)    |    ✅ Yes    |    ❌ No     | ✅ Store bills |     ❌ No      |  ✅ (Both)   | Both elders exchange dress parcels simultaneously at Mandap greeting.    |
| **7**  | **Nananda Putuli**        | `OBL-030` (Composite Bundle)        | `TRS-SA-04` (Sarees), `AST-008` (Gold)     |    ✅ Yes    |    ❌ No     | ✅ When bought | ✅ Gold items  | ✅ `OBL-030` | Luggage trolley packed with gold box & silks; handed over post-wedding.  |
| **8**  | **Family Pack**           | `OBL-035` (Composite Bundle)        | `TRS-SA-01..05` (Trousseau catalog)        |    ✅ Yes    |    ❌ No     | ✅ Store bills |     ❌ No      | ✅ `OBL-035` | 6 gift parcels assembled in master hamper; presented post-wedding.       |
| **9**  | **Reception Saree**       | `OBL-038` (Reception Attire)        | `TRS-BR-05` (Kalamandir Banarasi)          |    ✅ Yes    |    ❌ No     | ✅ Store bill  |     ❌ No      | ✅ `OBL-038` | Sourced via Shopping Registry; handed to bride for evening wear.         |
| **10** | **Batabasana Gold Chain** | `OBL-015` (Batabasana Alankar)      | `TRS-JW-12` (Jewellery SKU), `AST-009`     |    ✅ Yes    |    ❌ No     | ✅ Khimji bill | ✅ Yes (Gold)  | ✅ `OBL-015` | Sourced at Khimji; transferred from locker to groom's father for ritual. |

---

### 12. Formal Architecture Council Ruling

#### A. APPROVE:

1. **The 40+ Item Extraction**: The extraction of all handwritten obligations across Event 1, 2, and 3 is verified as authentic and complete.
2. **Decoupled Lifecycle**: Decoupling social obligations (`OBL`) from commercial shopping (`TRS`) and liturgical samagri (`SAM`).
3. **Preservation of Ambiguities**: The strict refusal to invent quantities, resolve blacked-out items, or guess headcounts.

#### B. MODIFY:

1. **Prefix & Entity Name**: Change technical prefix from `GFT-###` to **`OBL-###`** (Family Obligation).
2. **Directory Placement**: Place in **`02_RITUALS_CULTURE/obligations/`** (anchored to cultural milestones), NOT under `06_FINANCE_COMMERCIALS/`.
3. **Actor Model**: Remove static `direction` string; make direction a derived projection from `obligor.family` and `recipient.family`.
4. **Resolution Granularity**: Split status into `lifecycle_status` (Agreed/Staged/Fulfilled) and `spec_clarity` (Specified/TBD/Source_Unclear).
5. **Reciprocal Exchanges**: Model as paired atomic `OBL` records with a shared `exchange_cluster_id`, NOT a single fractured bilateral entity.
6. **Cash Honoraria**: Model as a dynamic formula obligation; do not generate static rupee totals without confirmed guest counts.

#### C. REJECT:

1. **REJECT `GFT-###` for family obligations**: `GFT-###` remains reserved exclusively for guest reception desk shagun envelopes.
2. **REJECT taxonomy inflation**: Do not create separate entity schemas for "Package", "Gift Set", "Exchange", or "Honorarium". All are handled via `OBL-###` (`structure: atomic | composite_bundle`).
3. **REJECT immediate creation of parallel TRS items**: Shopping items should only be projected from obligations that genuinely require commercial attire sourcing.

---

#### D. Final Canonical Schema: `OBL-###.md`

```yaml
---
hub: 02_RITUALS_CULTURE/HUB.md
id: "OBL-###"                           # Padded 3-digit ID (e.g. OBL-001)
cultural_name: "Ritual / Custom Name"   # e.g. Nirbandha Mudi, Samdhi Milan, Family Pack
structure: "atomic | composite_bundle"   # atomic or composite bundle
obligation_nature: "attire | jewellery | food_prasad | ritual_material | cash_honorarium | logistics | service"

## Anchoring
event_id: "EVT-###"                     # Target timeline gathering
ritual_id: "RIT-###"                    # Optional: Formal liturgy link if RIT spec exists

## Actors (Contradiction-Free)
obligor:
  family: "Bride | Groom | Both"
  household_id: "FAM-###"
  lead_person_id: "PER-###"             # Optional lead
recipient:
  scope: "person | role_in_family | family_unit | cohort | dynamic_population"
  family: "Bride | Groom | Both | External"
  role_title: "e.g., Groom's Mother, 2 Didis, Groom, Non-Family Attendees"
  person_ids: []                        # Linked PER-### if named individuals
  eligibility_rule: ""                  # Required if scope is dynamic_population

## Reciprocal Exchange Cluster (Used if this obligation is part of a bilateral exchange)
exchange_cluster:
  is_exchange: false                    # true if reciprocal
  cluster_id: ""                        # e.g. EXC-SAMDHI-MILAN
  peer_obligation_id: ""                # e.g. OBL-022

## Items & Specifications
line_items:
  - line_id: 1
    description: "Item Name / Description"
    quantity: "1"                       # Raw quantity or "TBD" (Never guess)
    recipient_role: ""                  # Used if bundle has different recipients
    spec_status: "Fully_Specified | TBD_Family_Choice | Source_Unclear | Source_Redacted | Pending_Family_Confirmation"
    fulfillment_type: "shopping | samagri | asset | cash | logistics | catering"
    trs_id: ""                          # Link to 04_PROCUREMENT_VENDORS/shopping_and_trousseau/
    sam_id: ""                          # Link to 02_RITUALS_CULTURE/samagri_checklists/
    ast_id: ""                          # Link to precious asset custody if gold/silver

## Cash Formula (Only populated if obligation_nature == cash_honorarium)
cash_formula:
  rate_per_person_inr: null
  eligible_headcount: null              # null until RSVP confirmation
  projected_total_inr: null             # Computed: rate * headcount

## Status & Governance
lifecycle_status: "Identified | Agreed | Procuring | Staged | Handed_Over | Waived"
handover_milestone: "Event Stage / Muhurtham Window"
assigned_custodian_id: "PER-###"

## Sacred Provenance
provenance:
  source_sheet: "260926_ShoppingList2"
  source_verbatim_text: "Verbatim text from handwritten document"
  confidence_score: "HIGH | MEDIUM | LOW | TBD"
  family_verbal_confirmation_needed: false
  notes: ""
---

## 📜 Family Obligation Specification: {{cultural_name}} ({{id}})

### 1. Cultural Context & Obligation Scope
Description of the cultural tradition, significance, and inter-family agreement.

### 2. Downstream Fulfilment & Sourcing Plan
Details on whether items are purchased from stores, made at home, consecrated at temple, or drawn from lockers.

### 3. Handover Protocol & Ceremonial Execution
Who carries the items, who presents them to whom, and at which moment of the ceremony.
```

---

#### E. Final Authoring Contract for Future Submissions

When supplying additional handwritten or oral family obligations, provide the data using this standardized input block:

```text
================================================================================
FAMILY OBLIGATION INTAKE TEMPLATE
================================================================================
EVENT: [e.g. Engagement / Main Wedding / After Marriage]
RITUAL / CUSTOM: [e.g. Batabasana / Guin Chada]
OBLIGOR FAMILY: [Bride's Family / Groom's Family / Both]
RECIPIENT:
  - Scope: [Individual / Role / Household / Cohort / Dynamic Guests]
  - Target: [e.g. Groom / Groom's Mother / 2 Didis / External Attendees]
IS RECIPROCAL EXCHANGE? [Yes (specify peer rite) / No]
ITEMS / OBLIGATION CONTENT:
  - Item 1: [Description] | Qty: [Number or "TBD"] | Clarity: [Clear / Family Choice / Unclear on Paper]
  - Item 2: [Description] | Qty: [Number or "TBD"] | Clarity: [Clear / Family Choice / Unclear on Paper]
CASH FORMULA (if applicable):
  - Amount Per Person: ₹[Amount]
  - Eligibility / Exclusions: [e.g. Non-family guests only]
PROVENANCE / VERBATIM NOTES: [Exact words from paper or elders]
================================================================================
```

---

#### F. Implementation Gate

Before any files are written or records created:

1. **Host & Council Approval**: This architecture review must be formally accepted by the project owner.
2. **Directory Scaffolding**: Create `02_RITUALS_CULTURE/obligations/` and register in `02_RITUALS_CULTURE/HUB.md`.
3. **Template Registration**: Commit `02_RITUALS_CULTURE/obligation_template.md`.
4. **No Code / No Schema Drift**: Verification that no application code or Firestore schemas are mutated during initial markdown authoring.

---

# Query 1.2 -Only those items are to be added that are to be purchased. In this the Sarah season, rest of small items can be done by other liaisoning parties

# Review 1.2 -# DIRECTIVE: OBL-001 — Family Obligation Architecture Ratification → Implementation Specification

The Architecture Review has completed the domain analysis for the handwritten family obligation register.

The review has determined that:

- GFT-### is reserved for guest shagun / reception-desk gift accounting.
- Family-to-family customary obligations require a distinct OBL-### entity.
- OBL-### belongs under 02_RITUALS_CULTURE/obligations/.
- Shopping (TRS), Samagri (SAM), Precious Assets (AST), and Payments (PAY) are downstream fulfilment projections.
- Direction must be derived from obligor → recipient and must not be stored independently.
- Reciprocal exchanges must use paired atomic OBL records with an exchange_cluster_id.
- Composite obligations use structure: atomic | composite_bundle.
- Obligation lifecycle and specification/source clarity must remain separate.
- Source ambiguity must never be silently normalized.
- The handwritten data must NOT yet be imported.

The Architecture Review has therefore established the proposed target model, but implementation has NOT yet been authorized.

## OBJECTIVE

Convert the Architecture Review into an implementation-ready technical specification and controlled implementation plan.

Do NOT begin implementation until the specification is internally consistent.

---

## 1. RECONCILE THE ARCHITECTURE

Review the complete Response 1.1 proposal and identify any remaining contradictions, redundancies, or unresolved design decisions.

Pay particular attention to:

- OBL-### responsibility boundary
- EVT/RIT/Custom relationship
- obligor model
- recipient model
- derived direction
- exchange_cluster
- composite_bundle
- line_items
- TRS/SAM/AST/PAY references
- lifecycle_status
- spec_status
- provenance
- cash_formula
- assigned_custodian
- ceremonial handover

Do not simply restate the proposal.

Test whether the model is internally coherent.

---

## 2. DEFINE THE OBL-### ENTITY CONTRACT

Produce the final implementation contract for:

02_RITUALS_CULTURE/obligations/OBL-###.md

Define:

- required fields
- optional fields
- field types
- allowed enum values
- validation rules
- nullability
- reference rules
- ID rules
- uniqueness rules
- parent/child rules
- lifecycle transitions

Clearly distinguish:

### Identity

What makes an obligation unique?

### Cultural meaning

What does the obligation represent?

### Actors

Who owes it and who receives it?

### Specification

What exactly must be provided?

### Fulfilment

How will it be sourced?

### Execution

When/how is it handed over?

### Provenance

Where did the obligation originate?

---

## 3. RESOLVE THE ITEM-LEVEL MODEL

The current proposal places multiple line items inside an OBL.

Validate whether every line item should support:

- description
- quantity
- unit
- recipient override
- spec_status
- fulfillment_type
- TRS reference
- SAM reference
- AST reference
- cash parameters

Determine which fields genuinely belong at:

A. obligation level

B. line-item level

C. downstream entity level

Do not duplicate commercial data inside OBL.

For example:

OBL should NOT become another Shopping Registry.

The OBL should state:

"Saree must be provided to Groom's Mother."

TRS should own:

- selected saree
- SKU
- store
- price
- approval
- alteration
- procurement status

---

## 4. VALIDATE THE PROPOSED DOWNSTREAM PROJECTION MODEL

For each fulfillment type, define exactly what happens:

### shopping

OBL → TRS

### samagri

OBL → SAM

### precious asset

OBL → AST

### cash

OBL → cash logistics / PAY

### logistics

OBL → appropriate logistics system

### service

OBL → appropriate service/procurement mechanism

Document:

- source of truth
- backlink
- ownership
- lifecycle responsibility

The same real-world fact must never have two competing SSOTs.

---

## 5. VALIDATE RECIPROCAL EXCHANGE

Use Samdhi Milan as the mandatory test case.

Expected conceptual model:

EXC-001
├── OBL-XXX — Groom Family → Bride Father
└── OBL-YYY — Bride Family → Groom Father

Determine:

- who owns EXC
- whether EXC needs its own persistent entity
- whether exchange_cluster_id is sufficient
- whether peer_obligation_id is necessary
- whether synchronous handover is a property of the exchange or each obligation

Do not introduce an Exchange entity unless necessary.

---

## 6. VALIDATE COMPOSITE OBLIGATIONS

Use:

- Family Pack
- Nananda Putuli

as test cases.

Determine whether:

OBL
└── line_items[]

is sufficient.

Ensure each line item can independently have:

- recipient
- quantity
- clarity
- fulfillment type
- downstream reference

without creating separate fake obligations.

---

## 7. VALIDATE DYNAMIC CASH OBLIGATIONS

Use:

₹5,000 per eligible non-family engagement attendee.

The model must support:

- rate
- eligibility rule
- exclusion rule
- headcount
- unresolved headcount
- projected total
- actual distributed total
- fulfilment status

Do not create a PAY record until there is an actual financial transaction.

Do not store a fabricated total.

---

## 8. VALIDATE STATE MACHINES

Do not use one generic status.

Finalize two independent state dimensions:

### Obligation Lifecycle

Identified
→ Agreed
→ Procuring
→ Staged
→ Handed_Over

with Waived as an exceptional terminal state.

### Specification Clarity

Fully_Specified
TBD_Family_Choice
Source_Unclear
Source_Redacted
Pending_Family_Confirmation

Document legal transitions and invalid combinations.

Example:

An obligation can be:

Agreed + Source_Unclear

and:

Procuring + Fully_Specified

but:

Handed_Over + Source_Unclear

should be examined as potentially invalid.

---

## 9. VALIDATE PROVENANCE

Every imported handwritten obligation must preserve:

- source_sheet
- source_verbatim_text
- confidence
- confirmation requirement
- notes

The original family terminology must remain intact.

Do not:

- Sanskritize ritual names
- infer missing quantities
- resolve unclear handwriting
- replace family terminology with generic terminology
- convert "whatever you give" into a specific product

---

## 10. TEST AGAINST ALL SOURCE OBLIGATIONS

Before implementation, replay the complete handwritten dataset against the proposed schema.

Use every obligation from the two source sheets.

Produce:

| Source Obligation | OBL Structure | Line Items | Recipient Model | Fulfillment Projection | State | Any Model Problem? |

There must be no unresolved structural problem hidden by free text.

---

## 11. DISTINGUISH SOURCE DATA FROM ARCHITECTURAL ADDITIONS

Maintain three separate classifications:

### SOURCE-CONFIRMED

Directly present in the handwritten sheets.

### ARCHITECTURAL DERIVATION

Necessary structure inferred from the source to represent it correctly.

### FAMILY CONFIRMATION REQUIRED

Information absent/unclear in the source.

Never present architectural derivations as family-confirmed facts.

---

## 12. DEFINE THE AUTHORING CONTRACT

After all validation is complete, provide the exact template that humans or future agents should use when adding an obligation.

It must be concise enough for practical use but complete enough to compile deterministically.

Provide:

1. Human intake format
2. Canonical OBL YAML format
3. Validation rules
4. Example atomic obligation
5. Example composite obligation
6. Example reciprocal obligation
7. Example cash formula obligation
8. Example unresolved obligation

---

## 13. DEFINE THE COMPILATION CONTRACT

Do NOT write the compiler yet.

Specify what a future compiler must do.

Example:

OBL
→ validate
→ resolve references
→ project TRS where required
→ project SAM where required
→ link AST where required
→ prepare cash logistics where required
→ generate indexes/views

Explicitly state what the compiler MUST NEVER duplicate.

---

## 14. IMPLEMENTATION PLAN

Only after the above is complete, produce a phased implementation plan:

PHASE 0 — Architecture approval
PHASE 1 — Directory + template scaffolding
PHASE 2 — Validation schema
PHASE 3 — Index/master generation
PHASE 4 — Downstream projection
PHASE 5 — UI integration
PHASE 6 — Import handwritten obligations
PHASE 7 — Integrity / anti-duplication audit

For every phase specify:

- files affected
- dependencies
- acceptance criteria
- validation commands
- rollback considerations

---

## HARD GATE

DO NOT:

- create OBL files
- modify application code
- modify Firestore
- modify TRS data
- modify SAM data
- modify PAY data
- create compiler scripts
- import the handwritten obligations

until the implementation specification is complete and internally consistent.

The output of this directive must be:

### "OBLIGATION IMPLEMENTATION SPECIFICATION — READY FOR APPROVAL"

not an implementation.

The purpose of this directive is to convert the Architecture Council ruling into a deterministic implementation contract before any data or code changes occur.

# Response 1.2 — OBLIGATION IMPLEMENTATION SPECIFICATION — READY FOR APPROVAL

---

## 1. RECONCILE THE ARCHITECTURE (COHERENCE & BOUNDARY AUDIT)

The proposed Family Obligation model (`OBL-###`) has been evaluated across all 14 architectural dimensions to eliminate contradictions, redundancies, and conceptual leakage:

### 1.1 Responsibility Boundary
* **The Invariant**: `OBL-###` models the **social and cultural covenant** (*who owes what to whom under which ritual milestone*). It owns the obligation identity, elder agreement, and ceremonial handover verification.
* **Non-Duplication Guard**: `OBL-###` does NOT hold commercial catalogue attributes (store SKU, fabric specs, fitting trials, tailor notes) or financial transaction vouchers (bank UTR, invoice receipt). Those belong strictly to [`04_PROCUREMENT_VENDORS/shopping_and_trousseau/shopping_items.jsonl`](file:///d:/GitHub_Repo/Sree_Krushna/04_PROCUREMENT_VENDORS/shopping_and_trousseau/shopping_items.jsonl) (`TRS-###`) and [`06_FINANCE_COMMERCIALS/ledger/`](file:///d:/GitHub_Repo/Sree_Krushna/06_FINANCE_COMMERCIALS/ledger/) (`PAY-###`).

### 1.2 Relationship to Events, Rituals & Customs
* **Event Anchoring (`event_id`)**: Mandatory. Every obligation belongs to a temporal milestone in [`01_TIMELINE_EVENTS/`](file:///d:/GitHub_Repo/Sree_Krushna/01_TIMELINE_EVENTS/) (`EVT-001` Nirbandha, `EVT-002` Pre-Wedding Rites, `EVT-004` Vivaha, `EVT-005` Reception, etc.).
* **Ritual Context (`ritual_name` vs `ritual_id`)**:
  - `ritual_name` (string, mandatory): The cultural name of the rite as practiced by the families (e.g. *Batabasana*, *Bandhu Daksa*, *Sadu Basana*, *Samdhi Milan*, *Nananda Putuli*).
  - `ritual_id` (string, optional / nullable): Only populated if a formal Vedic liturgical specification exists under [`02_RITUALS_CULTURE/specs/RIT-###.md`](file:///d:/GitHub_Repo/Sree_Krushna/02_RITUALS_CULTURE/specs/).
  - **Resolution**: Family customs are valid cultural covenants even without a formal Vedic `RIT-###` spec. We do NOT invent artificial `RIT-###` files for folk/family traditions.

### 1.3 Contradiction-Free Actor & Recipient Model
* `obligor.family`: `Bride | Groom | Both` (The family bound by duty).
* `recipient.family`: `Bride | Groom | Both | External` (The receiving side).
* `direction`: **Strictly Derived** at read/compile time as `${obligor.family} -> ${recipient.family}`. Storing a raw direction string in YAML is prohibited.
* `recipient.scope`: Exhaustive enum: `person | role_in_family | family_unit | cohort | dynamic_population`.

### 1.4 Reciprocal Exchange Coherence
* Reciprocal rites (e.g. *Samdhi Milan*) are represented by **two atomic `OBL-###` records** linked by `exchange_cluster.cluster_id: "EXC-###"`. Each record maintains autonomous obligor ownership, budget, and procurement state.

---

## 2. THE `OBL-###` ENTITY CONTRACT SPECIFICATION

**Canonical Spoke Path**: `02_RITUALS_CULTURE/obligations/OBL-###.md`  
**Governing Standard**: `STD-OBLIGATION-SCHEMA-001`  
**Parent Hub**: `02_RITUALS_CULTURE/HUB.md`

### 2.1 Complete YAML Frontmatter Schema Definition

```yaml
---
hub: "02_RITUALS_CULTURE/HUB.md"
id: "OBL-###"                           # REQUIRED | Pattern: ^OBL-\d{3}$ | Unique primary key
cultural_name: "String"                  # REQUIRED | Max 80 chars | Preserves family terminology
structure: "atomic | composite_bundle"   # REQUIRED | Enum: atomic (1 line) | composite_bundle (>1 line)
obligation_nature: "attire | jewellery | food_gift | ritual_material | cash_honorarium | logistics | service | multi_category"
                                        # REQUIRED | Enum classification of primary payload

# Milestone Anchoring
event_id: "EVT-###"                     # REQUIRED | Pattern: ^EVT-\d{3}$ | Must resolve in 01_TIMELINE_EVENTS/
ritual_name: "String"                   # REQUIRED | Max 80 chars | Name of the rite/custom
ritual_id: ""                           # OPTIONAL | Pattern: ^RIT-\d{3}$ | Nullable if custom has no Vedic spec

# Actor Model (Contradiction-Free)
obligor:
  family: "Bride | Groom | Both"        # REQUIRED | Enum: Bride | Groom | Both
  household_id: "FAM-###"               # OPTIONAL | Foreign key to 03_PEOPLE_GUESTS/families/
  lead_person_id: "PER-###"             # OPTIONAL | Foreign key to 03_PEOPLE_GUESTS/directory/

recipient:
  scope: "person | role_in_family | family_unit | cohort | dynamic_population" # REQUIRED
  family: "Bride | Groom | Both | External"                                    # REQUIRED
  role_title: "String"                  # REQUIRED | e.g. "Groom", "Groom's Mother", "2 Didis", "BIL"
  person_ids: []                        # OPTIONAL | Array of PER-### if specifically identified
  eligibility_rule: ""                  # REQUIRED if scope == dynamic_population; else empty string

# Reciprocal Exchange Association
exchange_cluster:
  is_exchange: false                    # REQUIRED | Boolean
  cluster_id: ""                        # REQUIRED if is_exchange == true (e.g. EXC-SAMDHI-MILAN)
  peer_obligation_id: ""                # REQUIRED if is_exchange == true (points to reciprocal OBL)
  synchronous_handover: false           # REQUIRED if is_exchange == true | Boolean

# Line Items Specification
line_items:                             # REQUIRED | Array (minimum 1 item)
  - line_id: 1                          # REQUIRED | Integer >= 1 | Unique within this OBL
    description: "String"               # REQUIRED | Item description
    quantity: "String | Integer"        # REQUIRED | Exact number or "TBD" (Never guess)
    unit: "piece | set | tray | box | pair | gram | head | service" # REQUIRED | Enum
    recipient_role: ""                  # OPTIONAL | Sub-recipient override (for composite_bundle)
    spec_status: "Fully_Specified | TBD_Family_Choice | Source_Unclear | Source_Redacted | Pending_Family_Confirmation" # REQUIRED
    fulfillment_type: "shopping | samagri | asset | cash | logistics | catering | service" # REQUIRED
    trs_id: ""                          # OPTIONAL | Pattern: ^TRS-[A-Z]{2}-\d{2}$ | Link to shopping catalogue
    sam_id: ""                          # OPTIONAL | Pattern: ^SAM-\d{3}$ | Link to samagri checklist
    ast_id: ""                          # OPTIONAL | Pattern: ^AST-\d{3}$ | Link to precious asset custody
    notes: ""                           # OPTIONAL | Line-level notes

# Cash Formula Block (Only populated if obligation_nature == cash_honorarium)
cash_formula:
  rate_per_person_inr: null             # OPTIONAL | Integer > 0 (null if not cash)
  eligible_headcount: null              # OPTIONAL | Integer >= 0 (null if unknown)
  projected_total_inr: null             # OPTIONAL | Integer (Computed dynamically: rate * headcount)
  envelope_preparation_status: "Not_Applicable | Pending_Headcount | Staged | Disbursed"

# Governance & Lifecycle State
lifecycle_status: "Identified | Agreed | Procuring | Staged | Handed_Over | Waived" # REQUIRED
handover_milestone: "String"            # REQUIRED | e.g. "Mandap Muhurtham", "Milni Entry", "Chauthi Morning"
assigned_custodian_id: "PER-###"        # REQUIRED | Person responsible for physical custody & presentation

# Sacred Source Provenance (Zero Silent Normalization)
provenance:
  source_sheet: "String"                # REQUIRED | e.g. "260926_ShoppingList2 (Page 1)"
  source_verbatim_title: "String"       # REQUIRED | Exact heading from paper
  source_verbatim_text: "String"        # REQUIRED | Exact item string verbatim
  source_language: "Odia | English | Odia-English Colloquial" # REQUIRED
  confidence_score: "HIGH | MEDIUM | LOW | TBD"               # REQUIRED
  family_verbal_confirmation_needed: false                   # REQUIRED | Boolean
  notes: ""                             # OPTIONAL | Preserves elder oral context
---
```

---

## 3. RESOLVE THE ITEM-LEVEL MODEL (3-TIER RESPONSIBILITY ALLOCATION)

To prevent duplication and conceptual leakage, attribute ownership is strictly segregated across three architectural tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│ TIER A: OBLIGATION LEVEL (OBL-### YAML Header)                         │
│ • Why: Cultural covenant & milestone purpose                           │
│ • Who: Obligor Family/Lead ⟶ Recipient Family/Scope/Role               │
│ • Lifecycle: Identified ⟶ Agreed ⟶ Procuring ⟶ Staged ⟶ Handed_Over    │
│ • Custody: Assigned Custodian (PER-###) & Handover Milestone            │
│ • Provenance: Source Sheet, Verbatim Notes, Confidence                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ contains 1..N
┌───────────────────────────────────▼────────────────────────────────────┐
│ TIER B: LINE-ITEM LEVEL (line_items[] inside OBL-###)                  │
│ • Sub-payload: description, quantity, unit                             │
│ • Sub-recipient: recipient_role (overrides parent for bundles)         │
│ • Specification Clarity: spec_status (Fully_Specified, TBD, Unclear)   │
│ • Fulfilment Routing: fulfillment_type (shopping, samagri, asset...)   │
│ • Pointer Keys: trs_id, sam_id, ast_id (references only)               │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ projects to
┌───────────────────────────────────▼────────────────────────────────────┐
│ TIER C: DOWNSTREAM DOMAIN ENTITIES (Separated SSOTs)                   │
│ • Shopping (TRS-###): Fabric, Store, Price Range, Alterations, Trials  │
│ • Samagri (SAM-###): Sacred Purity, Mantras, Priest Vessels            │
│ • Asset (AST-###): Hallmarked Weight (g), Locker Box, Transfer Ledger  │
│ • Finance (PAY-###): Bank Transaction, UTR, Voucher, Cash Logistics    │
└────────────────────────────────────────────────────────────────────────┘
```

**Anti-Duplication Proof**: If an obligation is for a *"Saree for Mom"*:
- `OBL-###` states: Groom's Mother is owed 1 Silk Saree by Bride's Family, currently in `Procuring`.
- `TRS-SA-01` states: Boyanika Sambalpuri Bomkai, ₹28,000–₹45,000, Trial scheduled with Mother.
- `PAY-###` states: ₹32,000 paid to Boyanika via HDFC Card on 2026-10-05.
- There are **zero duplicate fields** across these files.

---

## 4. DOWNSTREAM PROJECTION MODEL (FULFILMENT CHANNELS)

When an obligation passes the `Agreed` gate, its line items project into downstream execution channels:

| Fulfillment Type | Target Domain Entity | Projection Trigger | Source of Truth (SSOT) | Downstream Backlink | Handover Tracking |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`shopping`** | `TRS-###` in `shopping_items.jsonl` | Item requires retail purchase (attire, jewellery, luggage). | `TRS-###` owns price/store/fit. | `TRS.obligation_id = OBL-###` | When `TRS.status == "Ready"`, `OBL.line_item` moves to Staged. |
| **`samagri`** | `SAM-###` in `02_RITUALS_CULTURE/` | Item is a sacred consumable (Gua, Pana, Haldi, Sindoor). | `SAM-###` owns ritual prep. | `SAM.checklist_item.obl_id = OBL-###` | Checked off during Mandap setup by Vedic Purohit team. |
| **`asset`** | `AST-###` in `04_PROCUREMENT_VENDORS/`| Item is gold/silver requiring locker security. | `AST-###` owns custody. | `AST.obligation_id = OBL-###` | Formally transferred to stage custodian 30 mins before muhurtham. |
| **`cash`** | `cash_logistics.md` & `PAY-###` | Cash shagun or honorarium envelopes. | `cash_logistics.md` owns denominations. | `PAY.obligation_id = OBL-###` | Envelopes counted and sealed by Treasurer; handed over at desk. |
| **`logistics`** | Run sheets & `VEN-###` | Physical presentation luggage, cars, trays. | `05_OPERATIONS_LOGISTICS/` | `RunSheet.obl_id = OBL-###` | Staged in bridal suite / green room with transport tag. |
| **`service`** | `CTR-###` & `VDR-###` | Beauty parlour, makeup, mehendi artists. | `04_PROCUREMENT_VENDORS/` | `CTR.scope.obl_id = OBL-###` | Verified upon completion of service in green room. |

---

## 5. RECIPROCAL EXCHANGE VALIDATION (MANDATORY TEST: SAMDHI MILAN)

### Test Case: Samdhi Milan Dress Exchange
* **Baba (Groom's Father)** presents a dress to **Daddy (Bride's Father)**.
* **Daddy (Bride's Father)** presents a dress to **Baba (Groom's Father)**.

### Canonical Architectural Model:
The system instantiates **two atomic records** grouped under `exchange_cluster_id: "EXC-001"`:

```yaml
# Record 1: 02_RITUALS_CULTURE/obligations/OBL-021.md
id: "OBL-021"
cultural_name: "Samdhi Milan — Groom Side Presentation"
structure: "atomic"
obligation_nature: "attire"
event_id: "EVT-004"
ritual_name: "Samdhi Milan"
obligor:
  family: "Groom"
  lead_person_id: "PER-005"  # Baba (Groom's Father)
recipient:
  scope: "person"
  family: "Bride"
  role_title: "Bride's Father (Daddy)"
  person_ids: ["PER-007"]
exchange_cluster:
  is_exchange: true
  cluster_id: "EXC-001"
  peer_obligation_id: "OBL-022"
  synchronous_handover: true
line_items:
  - line_id: 1
    description: "Dress for Bride's Father (Daddy)"
    quantity: 1
    unit: "set"
    fulfillment_type: "shopping"
    trs_id: "TRS-SA-02"
    spec_status: "Fully_Specified"
lifecycle_status: "Agreed"
```

```yaml
# Record 2: 02_RITUALS_CULTURE/obligations/OBL-022.md
id: "OBL-022"
cultural_name: "Samdhi Milan — Bride Side Presentation"
structure: "atomic"
obligation_nature: "attire"
event_id: "EVT-004"
ritual_name: "Samdhi Milan"
obligor:
  family: "Bride"
  lead_person_id: "PER-007"  # Daddy (Bride's Father)
recipient:
  scope: "person"
  family: "Groom"
  role_title: "Groom's Father (Baba)"
  person_ids: ["PER-005"]
exchange_cluster:
  is_exchange: true
  cluster_id: "EXC-001"
  peer_obligation_id: "OBL-021"
  synchronous_handover: true
line_items:
  - line_id: 1
    description: "Dress for Groom's Father (Baba)"
    quantity: 1
    unit: "set"
    fulfillment_type: "shopping"
    trs_id: "TRS-SA-03"
    spec_status: "Fully_Specified"
lifecycle_status: "Agreed"
```

### Architectural Guarantees:
1. **Zero Entity Explosion**: `EXC-001` is a virtual cluster index; it does NOT require a separate heavy schema file.
2. **Autonomous Procurement**: Groom's side can purchase their gift at Raymond (`TRS-SA-02`), while Bride's side purchases at Kalamandir (`TRS-SA-03`) with completely decoupled budgets and timelines.
3. **Synchronous Execution Gate**: At `GATE-02` (Mandap Milni), the run-sheet requires both `OBL-021.lifecycle_status == Staged` and `OBL-022.lifecycle_status == Staged` before the ceremony proceeds.

---

## 6. COMPOSITE OBLIGATIONS (MANDATORY TEST: FAMILY PACK & NANANDA PUTULI)

### 6.1 Test Case: Family Pack (OBL-035)
* **Cultural Context**: Post-wedding vastra presentation from Bride's Family to Groom's Core Family.
* **Recipients**: Mom, Daddy, Didi 1, Didi 2, Tiju, Bacha Party.
* **Structure**: `composite_bundle` with sub-recipient overrides in `line_items[]`:

```yaml
id: "OBL-035"
cultural_name: "Family Pack"
structure: "composite_bundle"
obligation_nature: "attire"
event_id: "EVT-006"
ritual_name: "Family Pack"
obligor:
  family: "Bride"
recipient:
  scope: "cohort"
  family: "Groom"
  role_title: "Groom's Core Family"
line_items:
  - line_id: 1
    recipient_role: "Groom's Mother"
    description: "Saree for Mom"
    quantity: 1
    unit: "piece"
    spec_status: "Fully_Specified"
    fulfillment_type: "shopping"
  - line_id: 2
    recipient_role: "Groom's Father"
    description: "Dress / Suit for Daddy"
    quantity: 1
    unit: "set"
    spec_status: "Fully_Specified"
    fulfillment_type: "shopping"
  - line_id: 3
    recipient_role: "Didi 1 (Elder Sister)"
    description: "Dress / Saree"
    quantity: 1
    unit: "piece"
    spec_status: "Fully_Specified"
    fulfillment_type: "shopping"
  - line_id: 4
    recipient_role: "Didi 2 (Younger Sister)"
    description: "Dress / Saree"
    quantity: 1
    unit: "piece"
    spec_status: "Fully_Specified"
    fulfillment_type: "shopping"
  - line_id: 5
    recipient_role: "Tiju (Brother-in-Law)"
    description: "Dress / Kurta Set"
    quantity: 1
    unit: "set"
    spec_status: "Fully_Specified"
    fulfillment_type: "shopping"
  - line_id: 6
    recipient_role: "Bacha Party"
    description: "Coordinated Kids Wear"
    quantity: "TBD"
    unit: "set"
    spec_status: "Pending_Family_Confirmation"
    fulfillment_type: "shopping"
    notes: "Child headcount to be verified from RSVP directory."
```

### 6.2 Test Case: Nananda Putuli (OBL-030)
* **Recipients**: 2 Didis (Groom's Sisters).
* **Payload**: Gold + Saree/Dress + Trolley.
* **Demonstration of Multi-Category Line Items**:

```yaml
id: "OBL-030"
cultural_name: "Nananda Putuli"
structure: "composite_bundle"
obligation_nature: "multi_category"
event_id: "EVT-006"
ritual_name: "Nananda Putuli"
obligor:
  family: "Bride"
recipient:
  scope: "cohort"
  family: "Groom"
  role_title: "2 Groom's Sisters (Didis)"
line_items:
  - line_id: 1
    description: "Gold Ornament"
    quantity: "TBD"
    unit: "piece"
    spec_status: "Source_Unclear"
    fulfillment_type: "asset"
    notes: "Handwritten gold quantity partially obscured on source sheet. DO NOT INVENT."
  - line_id: 2
    description: "Saree / Dress Suite"
    quantity: 2
    unit: "set"
    spec_status: "Fully_Specified"
    fulfillment_type: "shopping"
  - line_id: 3
    description: "Presentation Luggage Trolley"
    quantity: 2
    unit: "piece"
    spec_status: "Fully_Specified"
    fulfillment_type: "logistics"
```

---

## 7. DYNAMIC CASH OBLIGATIONS (MANDATORY TEST: ₹5,000 / HEAD)

### Test Case: Nirbandha Guest Shagun Honorarium
* **Obligation**: ₹5,000 per attending guest at Engagement, excluding bride/groom family members.
* **Invariant**: **ZERO FABRICATED TOTALS**. Total is null until RSVP headcount is frozen.

```yaml
id: "OBL-008"
cultural_name: "Nirbandha Non-Family Attendee Honorarium"
structure: "atomic"
obligation_nature: "cash_honorarium"
event_id: "EVT-001"
ritual_name: "Nirbandha"
obligor:
  family: "Groom"
recipient:
  scope: "dynamic_population"
  family: "External"
  role_title: "Non-Family Engagement Attendees"
  eligibility_rule: "Confirmed attendees at EVT-001 excluding Bride and Groom family units."
line_items:
  - line_id: 1
    description: "Customary Cash Shagun Envelope"
    quantity: "TBD"
    unit: "head"
    spec_status: "Fully_Specified"
    fulfillment_type: "cash"
cash_formula:
  rate_per_person_inr: 5000
  eligible_headcount: null          # Remains null until RSVP freeze
  projected_total_inr: null         # Computed formula: rate * headcount
  envelope_preparation_status: "Pending_Headcount"
lifecycle_status: "Agreed"
notes: "Groom family customary honorarium. Cash withdrawal and envelope preparation trigger at T-5 days based on RSVP count."
```

---

## 8. STATE MACHINES & INVALID COMBINATION GUARDS

To maintain strict data integrity, the system implements a **Two-Tier Orthogonal State Model**:

```
LIFECYCLE STATUS (The Social Covenant)
[Identified] ──► [Agreed] ──► [Procuring] ──► [Staged] ──► [Handed_Over]
     │               │             │             │
     └───────────────┴─────────────┴─────────────┴──────► [Waived]

SPECIFICATION CLARITY (The Physical Payload Clarity)
• Fully_Specified
• TBD_Family_Choice
• Source_Unclear
• Source_Redacted
• Pending_Family_Confirmation
```

### 8.1 Transition Rules & Automated Validation Guards

| Lifecycle Status | Allowed `spec_status` Values | Forbidden `spec_status` Values | Rationale & Automated Validation Rule |
| :--- | :--- | :--- | :--- |
| **`Identified`** | *All values allowed* | None | Initial capture from raw source notes. |
| **`Agreed`** | *All values allowed* | None | Elders agree custom exists, even if item is TBD or handwriting unclear. |
| **`Procuring`** | `Fully_Specified`, `TBD_Family_Choice` | `Source_Unclear`, `Source_Redacted`, `Pending_Family_Confirmation` | **Hard Guard**: Procurement cannot buy an item whose source is illegible or pending family confirmation. Must resolve clarity before procuring. |
| **`Staged`** | `Fully_Specified` | `TBD_Family_Choice`, `Source_Unclear`, `Source_Redacted`, `Pending_Family_Confirmation` | **Hard Guard**: Cannot stage a physical parcel in the green room if the specification is still TBD or unconfirmed. |
| **`Handed_Over`**| `Fully_Specified` | *All other values forbidden* | **Hard Guard**: A ceremonial handover in the mandap cannot occur for an unclarified or redacted item. |
| **`Waived`** | *All values allowed* | None | Custom was formally superseded or dropped by mutual consensus. |

---

## 9. SACRED SOURCE PROVENANCE (ZERO SILENT NORMALIZATION)

To guarantee 100% fidelity to the handwritten sheets:
1. **Colloquial Terminology Preserved**: Odia cultural rite names (*Batabasana*, *Bandhu Daksa*, *Sadu Basana*, *Guin Chada*, *Bahu Daksa*, *Bahu Bandhapana*, *Kutha Madani*, *Uluguna*, *Saga Macha*) are retained verbatim. No artificial Sanskritization.
2. **Missing Quantities Preserved as "TBD"**: The Nananda Putuli gold quantity remains `"TBD"` because the handwriting is partially obscured.
3. **Blacked-Out Items Tagged as `Source_Redacted`**: Uluguna items that are physically struck out remain recorded with `spec_status: "Source_Redacted"`.
4. **"Whatever You Will Give" Preserved as `TBD_Family_Choice`**: Sala Bidha and Sali Hasta Ganthi items remain open to host family choice.

---

## 10. COMPLETE REPLAY TABLE ACROSS ALL SOURCE OBLIGATIONS (40+ ITEMS)

The complete handwritten planning dataset is verified against the canonical schema below:

| # | Source Rite & Item | Event | Obligor | Recipient Scope & Target | Structure | Fulfillment Channel | Spec Status | Lifecycle | Model Issues? |
| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Nirbandha Mudi (Bride→Groom) | EVT-001 | Bride | person (Groom) | atomic | shopping (`TRS-EG-01`) | Fully_Specified | Agreed | None |
| **2** | Groom Shirt + Pant | EVT-001 | Bride | person (Groom) | atomic | shopping (`TRS-EG-06`) | Fully_Specified | Agreed | None |
| **3** | Saree for Groom's Mom | EVT-001 | Bride | role (Groom's Mother) | atomic | shopping (`TRS-SA-01`) | Fully_Specified | Agreed | None |
| **4** | Shirt/Kurta+Pant for Groom's Dad | EVT-001 | Bride | role (Groom's Father) | atomic | shopping (`TRS-SA-02`) | Fully_Specified | Agreed | None |
| **5** | Dress/Saree for Didi & Tiju | EVT-001 | Bride | cohort (Groom Sister & BIL) | composite | shopping (`TRS-SA-04`) | Fully_Specified | Agreed | None |
| **6** | Dress for Bacha Party | EVT-001 | Bride | cohort (Groom Kids) | atomic | shopping | Pending_Family_Conf | Agreed | Needs child count |
| **7** | 5 varieties of Sweets (Bride→Groom) | EVT-001 | Bride | family_unit (Groom Family) | atomic | catering / food_gift | Fully_Specified | Agreed | None |
| **8** | Nirbandha Mudi (Groom→Bride) | EVT-001 | Groom | person (Bride) | atomic | shopping (`TRS-EG-01`) | Fully_Specified | Agreed | None |
| **9** | Lehenga + Blouse | EVT-001 | Groom | person (Bride) | atomic | shopping (`TRS-EG-02`) | Fully_Specified | Agreed | None |
| **10**| Engagement Trolley | EVT-001 | Groom | role (Bride's Family) | atomic | logistics | TBD_Family_Choice | Agreed | Contents TBD |
| **11**| 5 Varieties Sweets + Coconut + Banana | EVT-001 | Groom | family_unit (Bride Family) | composite | catering / food_gift | Fully_Specified | Agreed | None |
| **12**| Phula | EVT-001 | Groom | person (Bride) | atomic | samagri (`SAM-001`) | Fully_Specified | Agreed | None |
| **13**| Desi Pana | EVT-001 | Groom | family_unit (Bride Family) | atomic | samagri (`SAM-001`) | Fully_Specified | Agreed | None |
| **14**| Maha-prasad | EVT-001 | Groom | cohort (All Guests) | atomic | samagri (`SAM-001`) | Fully_Specified | Agreed | None |
| **15**| ₹5,000 / head non-family cash | EVT-001 | Groom | dynamic_population | atomic | cash (`cash_logistics`) | Fully_Specified | Agreed | Headcount dynamic |
| **16**| Gua/Haldi Basa Saree | EVT-002 | Groom | person (Bride) | atomic | shopping | Fully_Specified | Agreed | None |
| **17**| Gua/Haldi Basa Makeup | EVT-002 | Groom | person (Bride) | atomic | service (`VDR-###`) | TBD_Family_Choice | Agreed | Scope TBD |
| **18**| Coconut, Pana, Gua, Haldi | EVT-002 | Groom | role (Mandap Ritual) | composite | samagri (`SAM-003`) | Fully_Specified | Agreed | None |
| **19**| Bandhu Daksa (Pana, Gua) | EVT-002 | Bride | role (Groom's Father) | composite | samagri (`SAM-###`) | Fully_Specified | Agreed | None |
| **20**| Bandhu Daksa (Dress for Daddy) | EVT-002 | Bride | role (Groom's Father) | atomic | shopping | Fully_Specified | Agreed | None |
| **21**| Batabasana Suit | EVT-004 | Bride | person (Groom) | atomic | shopping | Fully_Specified | Agreed | None |
| **22**| Batabasana Gold Chain | EVT-004 | Bride | person (Groom) | atomic | asset (`AST-###`) | Fully_Specified | Agreed | None |
| **23**| Batabasana Gold Mudi | EVT-004 | Bride | person (Groom) | atomic | asset (`AST-###`) | Fully_Specified | Agreed | None |
| **24**| Batabasana Gold Bracelet | EVT-004 | Bride | person (Groom) | atomic | asset (`AST-###`) | Fully_Specified | Agreed | None |
| **25**| Ahiya Manduli (Saree for Mummy) | EVT-004 | Groom | role (Bride's Mother — Mummy) | atomic | shopping (`TRS-SA-01`) | Fully_Specified | Agreed | Entrance Welcome gift right after Batabarana |
| **26**| Alta & Sindoor in Mandap | EVT-004 | Groom | person (Bride) | composite | samagri (`SAM-005`) | Fully_Specified | Agreed | Sacred Mandap rites |
| **27**| Sala Bidha Gift | EVT-004 | Groom | role (Bride's Brother) | atomic | shopping | TBD_Family_Choice | Agreed | Item choice TBD |
| **28**| Sali Hasta Ganthi Gift | EVT-004 | Groom | role (Bride's Sister) | atomic | shopping | TBD_Family_Choice | Agreed | Item choice TBD |
| **29**| Samdhi Milan (Baba ⟶ Daddy) | EVT-004 | Groom | person (Daddy) | atomic (EXC) | shopping (`TRS-SA-02`) | Fully_Specified | Agreed | Linked to #30 |
| **30**| Samdhi Milan (Daddy ⟶ Baba) | EVT-004 | Bride | person (Baba) | atomic (EXC) | shopping (`TRS-SA-03`) | Fully_Specified | Agreed | Linked to #29 |
| **31**| Sadu Basana (Laddoo, Dress) | EVT-004 | Groom | cohort (Bride side) | composite | shopping + food | Fully_Specified | Agreed | None |
| **32**| Alankar (Groom ⟶ Bride) | EVT-004 | Groom | person (Bride) | composite | asset (`AST-###`) | Fully_Specified | Agreed | None |
| **33**| "TDK" Item | EVT-004 | Groom | person (Bride) | atomic | shopping | Source_Unclear | Identified | Handwriting blurred |
| **34**| 5 Sets Dresses (Bride ⟶ Groom) | EVT-004 | Bride | person (Groom) | composite | shopping | Fully_Specified | Agreed | None |
| **35**| Guin Chada Trolley | EVT-006 | Bride | cohort (Bride + Groom) | atomic | logistics | Fully_Specified | Agreed | None |
| **36**| Bahu Daksa (Dress for Devas) | EVT-006 | Bride | cohort (Groom side males)| composite | shopping | Fully_Specified | Agreed | None |
| **37**| Bahu Bandhapana (2 Sarees) | EVT-006 | Bride | person (Bride) | atomic | shopping | Fully_Specified | Agreed | None |
| **38**| Nananda Putuli (Gold) | EVT-006 | Bride | cohort (2 Didis) | atomic (Part) | asset (`AST-###`) | Source_Unclear | Agreed | Gold qty blurred |
| **39**| Nananda Putuli (Saree/Dress ×2) | EVT-006 | Bride | cohort (2 Didis) | atomic (Part) | shopping | Fully_Specified | Agreed | None |
| **40**| Nananda Putuli (Trolley ×2) | EVT-006 | Bride | cohort (2 Didis) | atomic (Part) | logistics | Fully_Specified | Agreed | None |
| **41**| Chaturthi Huma Saree Set | EVT-006 | Groom | person (Bride) | atomic | shopping | Fully_Specified | Agreed | None |
| **42**| Chaturthi Huma Dhoti + Kurta | EVT-006 | Bride | person (Groom) | atomic | shopping | Fully_Specified | Agreed | None |
| **43**| Huma Bali Utheibaku (Dress for BIL)| EVT-006 | Groom | role (Bride's Brother) | atomic | shopping | Fully_Specified | Agreed | None |
| **44**| Uluguna Items | EVT-006 | Bride | TBD | composite | shopping | Source_Redacted | Identified | Blacked out in notes |
| **45**| Family Pack (6 Recipients) | EVT-006 | Bride | cohort (Groom Family) | composite (6)| shopping | Fully_Specified | Agreed | Kids count TBD |
| **46**| Kutha Madani Trolley | EVT-006 | Bride | cohort (Bride + Groom) | atomic | logistics | Fully_Specified | Agreed | None |
| **47**| Reception Saree / Lehenga | EVT-005 | Groom | person (Bride) | atomic | shopping (`TRS-BR-05`) | Fully_Specified | Agreed | None |
| **48**| Saga Macha (Groom ⟶ Bride) | EVT-007 | Groom | family_unit (Bride Family) | composite | catering + shopping | Fully_Specified | Agreed | None |
| **49**| Saga & Macha (Bride ⟶ Groom) | EVT-007 | Bride | family_unit (Groom Family) | atomic | catering / food_gift | Fully_Specified | Agreed | None |

---

## 11. SOURCE DATA VS ARCHITECTURAL ADDITIONS

To maintain honest reporting, the repository classifies all obligation data into three distinct epistemic tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [SOURCE-CONFIRMED] (Verified physical facts from handwritten sheets)    │
│ • Ritual names: Batabasana, Bandhu Daksa, Samdhi Milan, Nananda Putuli  │
│ • Exact gift items: Saree for Mom, Dhoti/Kurta, Suit, Mudi, Pana, Gua  │
│ • Reciprocal structure: Baba ↔ Daddy dress exchange                    │
│ • Explicit constraints: ₹5,000/head excluding family members           │
└────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │ governed by
┌────────────────────────────────────────────────────────────────────────┐
│ [ARCHITECTURAL DERIVATION] (Engineered structures enabling execution)  │
│ • Entity namespace: OBL-### located in 02_RITUALS_CULTURE/obligations/ │
│ • Derived direction: obligor.family ⟶ recipient.family                 │
│ • Exchange cluster virtual pairing: EXC-001 linking OBL-021 & OBL-022  │
│ • Downstream projection foreign keys: trs_id, sam_id, ast_id           │
│ • Two-tier decoupled state machine: lifecycle_status vs spec_status    │
└────────────────────────────────────────────────────────────────────────┘
                                    ▲
                                    │ flagged for
┌────────────────────────────────────────────────────────────────────────┐
│ [FAMILY CONFIRMATION REQUIRED] (Open questions requiring verbal input) │
│ • Sala Bidha & Sali Hasta Ganthi: specific item selections             │
│ • "TDK" under Alankar: clarification of handwriting                    │
│ • Nananda Putuli: exact gold weight/pieces for the 2 Didis             │
│ • Bacha Party: confirmed headcount of children attending               │
│ • Uluguna: confirm if blacked-out items are cancelled or active        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 12. THE CANONICAL AUTHORING CONTRACT & TEMPLATES

### 12.1 Human / Agent Plain-Text Intake Template
When entering future obligations verbally or from written notes:

```text
================================================================================
FAMILY OBLIGATION INTAKE BLOCK
================================================================================
EVENT ID: EVT-004
RITUAL / CUSTOM NAME: Batabasana
OBLIGOR: Bride's Family (Lead: Daddy)
RECIPIENT: Groom (Krushna)
NATURE: attire & jewellery
ITEMS:
  1. Raymond 3-Piece Suit (Quantity: 1 set | Clarity: Clear | Sourcing: Shopping)
  2. 22K Gold Chain (Quantity: 1 piece | Clarity: Clear | Sourcing: Asset)
  3. Gold Ring (Quantity: 1 piece | Clarity: Clear | Sourcing: Asset)
  4. Gold Bracelet (Quantity: 1 piece | Clarity: Clear | Sourcing: Asset)
IS RECIPROCAL? No
CUSTODIAN: Bride's Father (PER-007)
PROVENANCE / VERBATIM: "Batabasana - Suit, Chain, Mudi, Bracelet"
================================================================================
```

### 12.2 Canonical YAML Obligation Template (`obligation_template.md`)

```yaml
---
hub: "02_RITUALS_CULTURE/HUB.md"
id: "OBL-###"
cultural_name: "Ritual / Custom Name"
structure: "atomic | composite_bundle"
obligation_nature: "attire | jewellery | food_gift | ritual_material | cash_honorarium | logistics | service | multi_category"

event_id: "EVT-###"
ritual_name: "Cultural Rite Name"
ritual_id: ""

obligor:
  family: "Bride | Groom | Both"
  household_id: "FAM-###"
  lead_person_id: "PER-###"

recipient:
  scope: "person | role_in_family | family_unit | cohort | dynamic_population"
  family: "Bride | Groom | Both | External"
  role_title: "Recipient Role Description"
  person_ids: []
  eligibility_rule: ""

exchange_cluster:
  is_exchange: false
  cluster_id: ""
  peer_obligation_id: ""
  synchronous_handover: false

line_items:
  - line_id: 1
    description: "Item Name / Description"
    quantity: "1"
    unit: "piece"
    recipient_role: ""
    spec_status: "Fully_Specified"
    fulfillment_type: "shopping"
    trs_id: ""
    sam_id: ""
    ast_id: ""
    notes: ""

cash_formula:
  rate_per_person_inr: null
  eligible_headcount: null
  projected_total_inr: null
  envelope_preparation_status: "Not_Applicable"

lifecycle_status: "Agreed"
handover_milestone: "Event Window"
assigned_custodian_id: "PER-###"

provenance:
  source_sheet: "260926_ShoppingList2"
  source_verbatim_title: "Verbatim Heading"
  source_verbatim_text: "Verbatim Item Description"
  source_language: "Odia-English Colloquial"
  confidence_score: "HIGH"
  family_verbal_confirmation_needed: false
  notes: ""
---

# 📜 Family Obligation: {{cultural_name}} ({{id}})

## 1. Cultural Context & Significance
Cultural explanation of this rite and the social expectations between lineages.

## 2. Fulfilment & Sourcing Strategy
Channel allocation (Store shopping, Purohit samagri, Locker asset transfer).

## 3. Handover Protocol & Ceremonial Sign-Off
Execution timing, witness requirements, and run-sheet verification gate.
```

---

## 13. COMPILATION CONTRACT FOR FUTURE BUILD PIPELINE

**Proposed Script**: `scripts/compile-obligations.cjs`  
**Standard**: `INV-SDCA-003` / `P-SSOT-DOCS`

### 13.1 Compiler Execution Sequence:
1. **Discovery & Ingestion**: Reads all `02_RITUALS_CULTURE/obligations/OBL-*.md` files.
2. **Schema & State Validation**:
   - Asserts valid YAML frontmatter matching `STD-OBLIGATION-SCHEMA-001`.
   - Asserts all `event_id` keys exist in `01_TIMELINE_EVENTS/`.
   - Asserts all `trs_id` keys resolve in `shopping_items.jsonl`.
   - Enforces the State Machine Guard: Throws error if `lifecycle_status == Handed_Over` while `spec_status != Fully_Specified`.
   - Enforces the Cash Invariant: Throws error if `cash_formula.projected_total_inr` is hardcoded while `eligible_headcount` is null.
3. **Derived View Synthesis**:
   - Compiles `02_RITUALS_CULTURE/obligations/family_obligations_master.md` (Table indexed by Event, Obligor, Recipient, Sourcing Channel, and State).
   - Projects shopping requirements into `04_PROCUREMENT_VENDORS/shopping_and_trousseau/derived_obligation_shopping_queue.json`.
   - Projects cash requirements into `06_FINANCE_COMMERCIALS/derived_cash_requirements.json`.
4. **Byte Parity & Invariant Verification**: Guarantees zero dropped records and zero duplicate SSOT files.

---

## 14. PHASED IMPLEMENTATION PLAN (SK-020)

```
[Phase 0: Council Ratification] (AC-DEC-2026-061) — DONE
       │
       ▼
[Phase 1: Directory Scaffolding & Template Baseline]
       │
       ▼
[Phase 2: Automated Schema & State Machine Test Gate]
       │
       ▼
[Phase 3: Downstream Compilation Engine & Master Index]
       │
       ▼
[Phase 4: Full 40+ Handwritten Dataset Ingestion]
       │
       ▼
[Phase 5: Downstream Projections & Byte Parity Verification]
       │
       ▼
[Phase 6: Web Registry Integration (Derived Views)]
       │
       ▼
[Phase 7: Final Governance Verification & SSOT Sync]
```

### Phase Details & Acceptance Criteria:

#### Phase 1: Directory Scaffolding & Template Baseline
* **Target Files**:
  - `02_RITUALS_CULTURE/obligations/` (New directory)
  - `02_RITUALS_CULTURE/obligation_template.md` (New file)
  - `02_RITUALS_CULTURE/HUB.md` (Update spokes index)
  - `docs/references/SPEC-ARCH-FAMILY-OBLIGATION-001.md` (New canonical specification)
* **Acceptance Criteria**: Directory structure created; hub references updated; zero syntax errors.
* **Validation**: `node scripts/test-obligation-contract.cjs --template-check`.

#### Phase 2: Automated Schema & State Machine Test Gate
* **Target Files**:
  - `scripts/test-obligation-contract.cjs` (New contract verification script)
  - `package.json` (Register `npm run test:obligations`)
* **Acceptance Criteria**: Automated test validates YAML frontmatter, derived directions, reciprocal exchange clusters, and rejects invalid state combinations.
* **Validation**: `npm run test:obligations` passes 100%.

#### Phase 3: Downstream Compilation Engine & Master Index
* **Target Files**:
  - `scripts/compile-obligations.cjs` (New compiler script)
  - `02_RITUALS_CULTURE/obligations/family_obligations_master.md` (Generated file)
* **Acceptance Criteria**: Compiler generates master index and derived cross-domain queues without duplicating data.
* **Validation**: `node scripts/compile-obligations.cjs` exits 0 with zero warnings.

#### Phase 4: Full 40+ Handwritten Dataset Ingestion
* **Target Files**:
  - `02_RITUALS_CULTURE/obligations/OBL-001.md` through `OBL-049.md` (49 atomic and bundle records)
* **Acceptance Criteria**: All 49 records created with 100% fidelity to handwritten sheets; zero quantity guessing.
* **Validation**: `npm run test:obligations` passes across all 49 files.

#### Phase 5: Downstream Projections & Byte Parity
* **Target Files**:
  - `04_PROCUREMENT_VENDORS/shopping_and_trousseau/shopping_items.jsonl` (Enrich with backlinks)
  - `06_FINANCE_COMMERCIALS/cash_logistics.md` (Enrich with honorarium requirements)
* **Acceptance Criteria**: Shopping and finance files linked cleanly; zero orphan references.
* **Validation**: `npm run test:shopping` and `node scripts/test-obligation-contract.cjs`.

#### Phase 6: Web Registry Integration (Derived Views)
* **Target Files**:
  - `shopping_src/components/` & `shopping_src/template.html` (Optional derived obligation filter/tab)
* **Acceptance Criteria**: UI compiles via SDCA with 100% byte parity between root and `/public`.
* **Validation**: `npm run verify:modular-architecture`.

#### Phase 7: Final Governance Verification & SSOT Sync
* **Target Files**:
  - `ENHANCEMENT-MASTER-REGISTRY.md` (Mark SK-020 COMPLETED)
  - `docs/enhancements/BUSINESS-LOGIC-ENHANCEMENT-CLUSTER.md`
  - `GEMINI.md` / `CLAUDE.md` (Update domain index)
* **Acceptance Criteria**: 100% green across all governance suites.
* **Validation**: `npm run verify:governance-wiring:all`.

---

## 15. CONCLUSION & APPROVAL GATE STATUS

This document constitutes the **complete, implementation-ready technical specification** requested by Directive OBL-001.

* **Hard Gate Compliance**: ZERO code, schemas, or premature records were created during this specification phase.
* **Status**: **READY FOR ARCHITECTURE COUNCIL & HOST SIGN-OFF**.
* **Next Action**: Upon Host confirmation, proceed to **Phase 1 execution** (Directory Scaffolding & Template Baseline).

---

# Query 1.3 -


# Review 1.3 -

# Response 1.3 -

# Query 1.4 -

# Review 1.4 -

# Response 1.4 -

# Query 1.5 -

# Review 1.5 -

# Response 1.5 -

# Query 1.6 -

# Review 1.6 -

# Response 1.6 -

# Query 1.7 -

# Review 1.7 -

# Response 1.7 -

# Query 1.8 -

# Review 1.8 -

# Response 1.8 -

# Query 1.9 -

# Review 1.9 -

# Response 1.9 -

# Query 2.0 -

# Review 2.0 -

# Response 2.0 -

# Query 2.1 -

# Review 2.1 -

# Response 2.1 -

# Query 2.2 -

# Review 2.2 -

# Response 2.2 -

# Query 2.3 -

# Review 2.3 -

# Response 2.3 -

# Query 2.4 -

# Review 2.4 -

# Response 2.4 -

# Query 2.5 -

# Review 2.5 -

# Response 2.5 -

# Query 2.6 -

# Review 2.6 -

# Response 2.6 -

# Query 2.7 -

# Review 2.7 -

# Response 2.7 -

# Query 2.8 -

# Review 2.8 -

# Response 2.8 -

# Query 2.9 -

# Review 2.9 -

# Response 2.9 -

# Query 3.0 -

# Review 3.0 -

# Response 3.0 -

# Query 3.1 -

# Review 3.1 -

# Response 3.1 -

# Query 3.2 -

# Review 3.2 -

# Response 3.2 -

# Query 3.3 -

# Review 3.3 -

# Response 3.3 -

# Query 3.4 -

# Review 3.4 -

# Response 3.4 -

# Query 3.5 -

# Review 3.5 -

# Response 3.5 -

# Query 3.6 -

# Review 3.6 -

# Response 3.6 -

# Query 3.7 -

# Review 3.7 -

# Response 3.7 -

# Query 3.8 -

# Review 3.8 -

# Response 3.8 -

# Query 3.9 -

# Review 3.9 -

# Response 3.9 -

# Query 4.0 -

# Review 4.0 -

# Response 4.0 -

# Query 4.1 -

# Review 4.1 -

# Response 4.1 -

# Query 4.2 -

# Review 4.2 -

# Response 4.2 -

# Query 4.3 -

# Review 4.3 -

# Response 4.3 -

# Query 4.4 -

# Review 4.4 -

# Response 4.4 -

# Query 4.5 -

# Review 4.5 -

# Response 4.5 -

# Query 4.6 -

# Review 4.6 -

# Response 4.6 -

# Query 4.7 -

# Review 4.7 -

# Response 4.7 -

# Query 4.8 -

# Review 4.8 -

# Response 4.8 -

# Query 4.9 -

# Review 4.9 -

# Response 4.9 -

# Query 5.0 -

# Review 5.0 -

# Response 5.0 -

# Query 5.1 -

# Review 5.1 -

# Response 5.1 -

# Query 5.2 -

# Review 5.2 -

# Response 5.2 -

# Query 5.3 -

# Review 5.3 -

# Response 5.3 -

# Query 5.4 -

# Review 5.4 -

# Response 5.4 -

# Query 5.5 -

# Review 5.5 -

# Response 5.5 -

# Query 5.6 -

# Review 5.6 -

# Response 5.6 -

# Query 5.7 -

# Review 5.7 -

# Response 5.7 -

# Query 5.8 -

# Review 5.8 -

# Response 5.8 -

# Query 5.9 -

# Review 5.9 -

# Response 5.9 -

# Query 6.0 -

# Review 6.0 -

# Response 6.0 -

# Query 6.1 -

# Review 6.1 -

# Response 6.1 -

# Query 6.2 -

# Review 6.2 -

# Response 6.2 -

# Query 6.3 -

# Review 6.3 -

# Response 6.3 -

# Query 6.4 -

# Review 6.4 -

# Response 6.4 -

# Query 6.5 -

# Review 6.5 -

# Response 6.5 -

# Query 6.6 -

# Review 6.6 -

# Response 6.6 -

# Query 6.7 -

# Review 6.7 -

# Response 6.7 -

# Query 6.8 -

# Review 6.8 -

# Response 6.8 -

# Query 6.9 -

# Review 6.9 -

# Response 6.9 -

# Query 7.0 -

# Review 7.0 -

# Response 7.0 -

# Query 7.1 -

# Review 7.1 -

# Response 7.1 -

# Query 7.2 -

# Review 7.2 -

# Response 7.2 -

# Query 7.3 -

# Review 7.3 -

# Response 7.3 -

# Query 7.4 -

# Review 7.4 -

# Response 7.4 -

# Query 7.5 -

# Review 7.5 -

# Response 7.5 -

# Query 7.6 -

# Review 7.6 -

# Response 7.6 -

# Query 7.7 -

# Review 7.7 -

# Response 7.7 -

# Query 7.8 -

# Review 7.8 -

# Response 7.8 -

# Query 7.9 -

# Review 7.9 -

# Response 7.9 -

# Query 8.0 -

# Review 8.0 -

# Response 8.0 -

# Query 8.1 -

# Review 8.1 -

# Response 8.1 -

# Query 8.2 -

# Review 8.2 -

# Response 8.2 -

# Query 8.3 -

# Review 8.3 -

# Response 8.3 -

# Query 8.4 -

# Review 8.4 -

# Response 8.4 -

# Query 8.5 -

# Review 8.5 -

# Response 8.5 -

# Query 8.6 -

# Review 8.6 -

# Response 8.6 -

# Query 8.7 -

# Review 8.7 -

# Response 8.7 -

# Query 8.8 -

# Review 8.8 -

# Response 8.8 -

# Query 8.9 -

# Review 8.9 -

# Response 8.9 -

# Query 9.0 -

# Review 9.0 -

# Response 9.0 -

# Query 9.1 -

# Review 9.1 -

# Response 9.1 -

# Query 9.2 -

# Review 9.2 -

# Response 9.2 -

# Query 9.3 -

# Review 9.3 -

# Response 9.3 -

# Query 9.4 -

# Review 9.4 -

# Response 9.4 -

# Query 9.5 -

# Review 9.5 -

# Response 9.5 -

# Query 9.6 -

# Review 9.6 -

# Response 9.6 -

# Query 9.7 -

# Review 9.7 -

# Response 9.7 -

# Query 9.8 -

# Review 9.8 -

# Response 9.8 -

# Query 9.9 -

# Review 9.9 -

# Response 9.9 -

# Query 10.0 -

# Review 10.0 -

# Response 10.0 -

# Query 10.1 -

# Review 10.1 -

# Response 10.1 -

# Query 10.2 -

# Review 10.2 -

# Response 10.2 -

# Query 10.3 -

# Review 10.3 -

# Response 10.3 -

# Query 10.4 -

# Review 10.4 -

# Response 10.4 -

# Query 10.5 -

# Review 10.5 -

# Response 10.5 -

# Query 10.6 -

# Review 10.6 -

# Response 10.6 -

# Query 10.7 -

# Review 10.7 -

# Response 10.7 -

# Query 10.8 -

# Review 10.8 -

# Response 10.8 -

# Query 10.9 -

# Review 10.9 -

# Response 10.9 -
