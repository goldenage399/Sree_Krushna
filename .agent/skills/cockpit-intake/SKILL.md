---
name: cockpit-intake
description: >
  Standardized ingestion protocol for the Decorator Cockpit (SDCA). Translates
  decorator discussion threads, vendor meeting outcomes, and venue layout briefs
  losslessly into Cockpit topics, presentation slides, and master decisions.
  Enforces practical host-centric tone, SDCA compilation (INV-SDCA-003), and
  automated smoke test verification (npm run test:cockpit).
---

# /cockpit-intake — Decorator Cockpit Ingestion Protocol

**Purpose:** Standardized, repeatable channel for taking any new decorator discussion thread updates, vendor meeting clarifications, or spatial layout decisions and ingesting them cleanly into the **Decorator Negotiation Cockpit** (`cockpit_src/`).

---

## The 5-Phase Ingestion Lifecycle

```
[1. DELTA SCAN] ──> [2. COMPONENT MAP] ──> [3. TONE GUARD] ──> [4. SDCA BUILD] ──> [5. SMOKE GATE]
 Thread Review/       Topics, Slides,       Practical Host       npm run             npm run
 Response X.Y         Decisions, HTML       Comfort & Reuse      build:cockpit       test:cockpit
```

---

### Phase 1: Thread Delta Scan & Extraction
1. Open the active discussion thread: [`User_Created/Discussion Threads/DecoratorDiscussion/260913_DecoratorDiscussion.md`](file:///d:/GitHub_Repo/Sree_Krushna/User_Created/Discussion%20Threads/DecoratorDiscussion/260913_DecoratorDiscussion.md).
2. Locate the latest `# Query X.Y` and read the associated `# Review X.Y` and `# Response X.Y`.
3. Extract the concrete operational deltas:
   - Venue dimensions, tent sizes, and buffer zones.
   - Stage dimensions, elevations, and flanking wings.
   - Dining / hospitality locations (main buffet vs. VIP/elderly tents).
   - Arrival approaches, tunnels, and outdoor transitions.
   - Reusable elements and secondary-life transitions (e.g., Mandap post-wedding photo reuse).
   - Vendor action deliverables or tender specs.

---

### Phase 2: SDCA Component Mapping Matrix

Every extracted fact must map to its precise source file inside `cockpit_src/`:

| Ingested Fact Category | Target File | What to Update |
|---|---|---|
| **Negotiation Scripts & Arguments** | `cockpit_src/data/topics_marquee.json` / `topics_rayagada.json` | Warm, Data, Firm scripts, tree steps, curveballs — **Firestore-sourced, re-seed after editing (Phase 4)** |
| **Presentation Deck Slides** | `cockpit_src/data/slides_marquee.json` / `slides_rayagada.json` | 16:9 slides, titles, subtitles, 3-column summary cards |
| **Roadmap Decisions & Options** | `cockpit_src/data/master_decisions.json` | Decision titles, pre-selected options, vendor deliverables — **Firestore-sourced, re-seed after editing (Phase 4)** |
| **Commercials & Budget Splits** | `cockpit_src/data/commercial_tiers.json` | 4-tier calculator defaults, caps, discount percentages |
| **Visual Lookbook Plates** | `cockpit_src/data/canonical_plates.json` | Plate IDs, photos, CAD blueprint links, generation prompts |
| **UI Components & Workspace HTML**| `cockpit_src/components/` | Workspace structures, headers, modal shells |
| **Styling & Themes** | `cockpit_src/styles/` | CSS variables, typography, layout cards |

---

### Phase 3: Practical Host Tone Guardrail

> **Core Principle:** The vendor does weddings on a regular basis. **Do NOT over-engineer or drown the brief in academic/technical jargon.**

* **Focus on what matters to the host:**
  1. **Flow & Circulation**: How guests naturally move from arrival to rituals to dining to entertainment.
  2. **Close Family & Elder Comfort**: Where immediate family sits during 2-hour rituals (e.g., 30ft Mandap flanks); quiet dining with short walking distances.
  3. **Photo Sightlines**: Clear camera angles, clean 3200K warm white lighting (zero multicolor face tinting).
  4. **Smart Reuse to Prevent Waste**: Repurposing structures (like the Mandap) for outdoor portraits rather than paying for duplicate teardown and new setups.
* **Keep Scripts Conversational**: Warm scripts should sound like an appreciative, gracious host; Data scripts should cite clear dimensions and benchmarks; Firm scripts should enforce quality boundaries calmly without hostility.

---

### Phase 4: SDCA Compilation Gate (`INV-SDCA-003`)
All cockpit edits must be compiled via the SDCA build tool:
```bash
npm run build:cockpit
```
* Runs `node -c cockpit_src/scripts/controller.js` syntax validation.
* Safely bundles data, components, styles, and scripts into both:
  - `decorator-cockpit.html` (root distribution)
  - `public/decorator-cockpit.html` (dev server distribution)
* Guarantees 100% byte-for-byte parity.

**⚠️ SEC-1 exception (AC-DEC-2026-012):** `master_decisions.json`, `topics_marquee.json`, and
`topics_rayagada.json` are **NOT** embedded into the compiled output — they hold the actual
negotiation scripts, guardrails, and decision options, and are fetched client-side from
Firestore's `cockpit_content` collection only after Google Sign-In + allow-list succeeds (see
`cockpit_src/template.html` and `firestore.rules`). `build.cjs`'s zero-leak gate will fail the
build if this regresses. **Whenever you edit any of these 3 files, you must also re-seed
Firestore** — open `scripts/seed-cockpit-firestore.html` (see that file's header for the exact
local-serving command; never copy it into `public/`), sign in, and click "Seed to Firestore."
The compiled HTML will keep showing stale content until you do.

---

### Phase 5: Automated Smoke & Runtime Verification Gate
Every ingestion MUST pass the automated 5-phase smoke test:
```bash
npm run test:cockpit
```
* **Phase 1**: Dual release artifact existence & exact byte parity.
* **Phase 2**: DOM workspace integrity (`hudWorkspace`, `founderWorkspace`, `decisionsWorkspace`, modals).
* **Phase 3**: Physical media assets exist on disk (`public/assets/decor/*.jpg` and `*.svg`).
* **Phase 4**: Structured data store sanity (20 decisions, all topics, all slides).
* **Phase 5**: Node VM sandbox execution testing state machines (`switchEvent`, `switchTone`, `calculateDecisionProgress`).

---

## Quick Invocation Checklist

When user says "ingest this update into cockpit" or runs `/cockpit-intake`:
- [ ] Scan latest Query/Review/Response in `260913_DecoratorDiscussion.md`
- [ ] Map updates to `topics_*.json`, `slides_*.json`, or `master_decisions.json`
- [ ] Maintain practical, host-centric tone (no engineering jargon overload)
- [ ] Run `npm run build:cockpit`
- [ ] Run `npm run test:cockpit` (must be 100% green)
- [ ] Verify `npm run verify:governance-wiring`
- [ ] **If `master_decisions.json`, `topics_marquee.json`, or `topics_rayagada.json` changed:** re-seed via `scripts/seed-cockpit-firestore.html` (SEC-1, AC-DEC-2026-012) — the compiled HTML no longer carries this content
