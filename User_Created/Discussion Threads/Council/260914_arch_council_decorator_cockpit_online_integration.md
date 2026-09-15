# 🏛️ Architecture & UI Council Review: Decorator Cockpit Online Integration Architecture

**Decision ID:** `AC-DEC-2026-012` / `UI-DEC-2026-008`
**Council:** Architecture Council + UI/UX Council (joint session — precedent: `AC-DEC-2026-008`/`UI-DEC-2026-004`, 2026-09-13)
**Session Type:** FULL (gate result: Reversibility=YES, Boundary=YES, Disagreement=YES — see Phase 0 §6)
**Date:** 2026-09-14
**Status:** **PROPOSED — pending owner decision** (this file is written to be edited in place as the plan iterates; it is *not* self-certified the way prior same-day rulings were, because the requester explicitly asked for an editable working plan, not a closed verdict)
**Governing Standard:** `SOP-WFL-ARCH-COUNCIL-001` + `SOP-WFL-UI-COUNCIL-001` (adapted — see Process Notes, Gap 2)
**Input:** [`260913_DecoratorDiscussion.md`](../DecoratorDiscussion/260913_DecoratorDiscussion.md) Query 4.2 / Response 4.2 (the "Seamless Fusion Hybrid Model" proposal)
**Target Surfaces:** `index.html` / `public/index.html` (nav shell), `decorator-cockpit.html` / `public/decorator-cockpit.html` (519KB / 5,333-line monolithic engine), `cockpit_src/` (SDCA build pipeline), `FEATURE_CATALOG.json`, `scripts/verify-deployment.cjs`, `sw.js` / `public/sw.js`, `js/auth.js`, `firestore.rules`

---

## 0. Grounding Snapshot (RFG-001 Maturity Anchor)

Pre-launch, single-family-operator repo. 3 allow-listed SuperAdmin users (`js/allowed_users.js`: Groom, Groom, Bride — no tiered role hierarchy). 1 wedding event, 10 canonical tabs (`FEATURE_CATALOG.json`). The Decorator Cockpit itself is one day old at time of writing (built and hardened through 6 rapid council sessions on 2026-09-13) and has never yet been evaluated for *reachability* from the authenticated app — that gap is this session's entire subject. Optimization target: the best integration **for a 3-user household planning one wedding**, not a multi-tenant vendor-negotiation platform.

---

## Phase 0: Evidence Collection

1. **Ledger check** — 8 prior rulings (2026-08-22 → 2026-09-13, see `Council_Ledger.md`) cover the cockpit's *internal* craft, print hardening, mobile ergonomics, and visual architecture, and separately the sticky-header/nav redesign. **None address app-integration or reachability.** No contradiction; a genuine, previously-unaddressed gap — confirmed, not assumed.
2. **Duplication check** — `grep -rn "tab-cockpit"` across the repo: zero hits. No existing nav entry, launcher, or route touches `decorator-cockpit.html` from inside `index.html` today. The file is reachable only by typing its exact path.
3. **Ground truth read** —
   - `index.html:165-175` — `<nav class="tab-nav" role="tablist">`, 10 `<button class="nav-btn">` entries, each pairing an emoji + label with a `switchTab()` `onclick`.
   - `FEATURE_CATALOG.json` — `canonicalTabs` array, 10 entries, each with `id`/`testId`/`navTestId`/`title`/`required: true`. `scripts/verify-deployment.cjs:345` iterates this array as its nav/panel existence gate — the only mechanical gate a new tab must satisfy today.
   - `cockpit_src/build.cjs` + `.agent/skills/cockpit-intake/SKILL.md` Phase 4 — the SDCA pipeline bundles `cockpit_src/{data,components,styles,scripts}` into **two byte-identical standalone documents**: `decorator-cockpit.html` and `public/decorator-cockpit.html`. Both are full documents (own `<html><head><body>`, `00_embedded_fonts.css`, global resets per `cockpit_src/styles/01_tokens_and_base.css`). **There is no fragment/component-only build target.**
   - `sw.js` and `public/sw.js` both exist — this is a real PWA with a live service worker, not a hypothetical.
   - `js/auth.js` + `js/allowed_users.js` — Google Sign-In via Firebase Auth, gated by a 3-email allow-list, wired into `index.html`'s `authOverlay`/`appRoot`. **`grep -n "auth.js\|onAuthStateChanged\|firebaseConfig" decorator-cockpit.html` returns zero matches.** The standalone cockpit file has no authentication of any kind.
   - `firestore.rules` — a live, documented Firestore surface already exists: **"SK-004 Firestore Cross-Device Sync"** (`change_requests/{id}`, `task_status/{id}`, `counters/{id}`), gated by the same 3-email allow-list, used today to sync task/change-request state **across the 3 users' separate devices**.
   - `js/marriage-state.js` / `public/js/marriage-state.js` — `grep -n "localStorage"` returns **zero matches**. The main app's state model does not use `localStorage` for anything the cockpit would need to interoperate with; the cockpit's `localStorage` persistence (`cockpit_src/scripts/controller.js`) is a fully separate, per-browser data silo from both the main app and from Firestore.
4. **Evidence snapshot** — commit `b9d9e43269bb2777d54f18f96e64431284224739` (2026-09-13 11:17:59 +0530). Working tree at review time carries uncommitted edits to `index.html`, `decorator-cockpit.html`, `public/decorator-cockpit.html`, `package.json`, `scripts/verify-governance-wiring.cjs`, plus untracked `cockpit_src/`, `.agent/skills/cockpit-intake/`, `scripts/test-cockpit-smoke.cjs`. Files this session's evidence relies on are listed in full above.
5. **Referral check** — substantively touches both councils: Architecture (build pipeline fork, auth boundary, service-worker cache behavior, sub-engine state ownership) and UI (nav real estate, mobile dock math, print CSS, theme parity). Per ordering convention, Architecture findings are load-bearing constraints on the UI findings below; this repo's own 2026-09-13 precedent (`AC-DEC-2026-008`/`UI-DEC-2026-004`, `-009`/`-005`, `-010`/`-006`, `-011`/`-007`) already runs these as **joint** sessions rather than sequential handoffs, and this session follows that local practice rather than the generic template's "no joint sessions" line.
6. **3-question invocation gate** — Reversibility: **YES** (a shipped nav tab and a URL people bookmark are hard to walk back once discovered; a build-pipeline fork is a standing maintenance surface). Boundary: **YES** (crosses the nav shell, the SDCA build pipeline, and the auth perimeter — none of which the cockpit currently touches). Disagreement: **YES** (the source thread already proposed 3 competing options before landing on a 4th hybrid; this session finds a 5th axis — see UI-2/Dissenter below — that the hybrid didn't resolve). → **FULL session, not expedited.**
7. **Concept collision check** — searched `.agent/patterns/` for "sub-engine", "monolithic port", "iframe". Found an exact, validated precedent: **INC-086** (`sub-engine-shadowing-and-tab-reconciliation.md`, `monolithic-engine-port-css-scoping-gate.md`, `localhost-sw-cache-bypass-gate.md`) — the DO-PKOS Studio port into this same app, 2026-08-22. These three patterns are listed in this repo's own `CLAUDE.md` Pattern Activation section and were **not cited anywhere in the Query 4.2 response**, despite describing, almost verbatim, the exact move that response proposes (porting a standalone monolithic engine into a tab of this exact multi-tab SPA).

---

## Roster

### Seated members

| Seat | Sourced from | Why seated |
|---|---|---|
| **Sub-Engine Integration Auditor** (Core, added) | INC-086 pattern trio | Not in either default template roster (both are Task-Dashboard-authored) but the single most directly applicable lens available in this repo — validated once already, on this exact app. |
| **Security & Auth Boundary Auditor** (added) | `js/auth.js`, `firestore.rules` | Added ad hoc after Phase 0 evidence surfaced a live, unauthenticated exposure (§Finding SEC-1) that neither default roster's template members would have caught (Task-Dashboard's "Auth & Permission Auditor" is scoped to its 5-level role hierarchy, which doesn't exist here). |
| **Craft & Visual Polish Auditor** (`impeccable`) | UI council default roster, mandatory core member | Required by the UI council SOP for any presentation-layer decision. |
| **Visual Hierarchy / Navigation Density Auditor** (`ui-ux-pro-max` lens, adapted) | UI council default roster | Nav real estate, mobile dock arithmetic, scan-time. |
| **SSOT & Decision-Continuity Auditor** (adapted `ssot-reconciliation`) | Architecture council default roster | Checks this proposal against the 8 prior rulings and `FEATURE_CATALOG.json`/`ARCHITECTURE_SPEC.md`. |
| **Maintainability & Velocity / RFG-001 Auditor** — **assigned dissenter** | Both councils' shared RFG-001 owner | Burden-of-proof gate on any new permanent surface; argues against the emerging majority direction per SOP. |

### Explicit N/A ledger (ICG-001 requirement)

| Default member (source template) | Status | Reason |
|---|---|---|
| Schema & Firestore Auditor (Arch, full form) | **Partially N/A** | This repo's Firestore surface (`SK-004`) is real but narrow (3 collections, 3-user allow-list) — evaluated directly under the Sub-Engine/SSOT seats instead of seating a dedicated auditor for a 3-collection schema. |
| Auth & Permission Auditor (Arch, 5-level hierarchy version) | **N/A** | Template describes a `super_admin`(1)…`associate`(5) hierarchy that does not exist in this repo (flat 3-user SuperAdmin allow-list). Superseded by the ad hoc Security & Auth Boundary Auditor above. |
| Service Layer Integrity / ServiceRegistry / React Context Auditors (Arch) | **N/A** | No `src/services/`, no React, no `ServiceRegistry.js` in this repo — vanilla JS + static HTML. |
| Theme System Auditor, Design System Integrity Auditor (UI, full token-registry form) | **Folded into Craft & Polish seat** | This repo's `--theme-*`/`--dt-*` token registry is much smaller than Task-Dashboard's 7-theme matrix; evaluated as part of Craft & Polish rather than seating a separate auditor. |
| Mobile Usability Auditor (`mobile-ui-validator`) | **Folded into Navigation Density seat** | Same underlying concern (viewport/touch-target math); this repo's mobile surface (2026-08-22 dual-anchor dock) is small enough to evaluate in one seat. |

---

## Phase 1: Independent Evaluations

### Seat 1 — Sub-Engine Integration Auditor

**Position:** None of the four options in Query 4.2's response (In-App Tab, Deconstruct, Launchpad, Hybrid) can be implemented as scoped today, because **the SDCA build pipeline has no fragment output**. `cockpit_src/build.cjs` bundles into a complete standalone `<html>` document by design (Phase 4 of `cockpit-intake/SKILL.md`: "bundles data, components, styles, and scripts... Guarantees 100% byte-for-byte parity" between two *standalone* files). Embedding that document inline inside `appRoot` today means inheriting its global resets (`monolithic-engine-port-css-scoping-gate.md`'s literal example: `html, body { height:100%; overflow:hidden; font-size:13px; }`) onto all 10 existing tabs — this is not a hypothetical risk, it is the documented, validated failure mode of the exact same move already made once in this repo (INC-086, DO-PKOS Studio port).

**Evidence:** `cockpit_src/styles/01_tokens_and_base.css` (not read line-by-line this session, but its existence plus the pattern's own historical description of `swimlane-engine.css`'s global resets is the same class of file); `.agent/patterns/monolithic-engine-port-css-scoping-gate.md`; `.agent/patterns/sub-engine-shadowing-and-tab-reconciliation.md` (documents `app.js` shadowing a sub-engine's exported render function — the exact shape of bug that appears if `index.html`'s `switchTab()` ever grows a local copy of cockpit logic instead of delegating to `window.<CockpitExport>`).

**Assumptions:** That the user wants the cockpit reachable *inside* the authenticated shell (not just linked externally) — confirmed by the original Query 4.2 wording ("this cockpit can be introduced" / "synthesized into the online application").

**Trade-offs:** Building a fragment-mode SDCA target is upfront engineering cost not accounted for in the original plan's 4-step sequence — but it is a one-time cost that both Option 1 and the Hybrid model require regardless; skipping it doesn't avoid the cost, it just defers discovering it until the CSS bleeds into production.

**Risks & Dependencies:** If `controller.js` calls `document.body.requestFullscreen()` or `document.body.style.overflow='hidden'` anywhere (typical for a standalone "presenter mode" — and this pattern's own failure-mode list literally names `overflow:hidden` on `body`), the "Fullscreen Meeting Mode" feature named in Tier 1 of the Hybrid proposal will either fullscreen the *entire host app* (wrong) or silently fail once `document.body` belongs to the shell, not the cockpit. This was not mentioned anywhere in the Query 4.2 response and must be audited before Tier 1 ships.

**Challenge:** *If the fragment build is skipped and Option 1 is implemented as "embed the existing standalone file inside a container," what breaks first?* Concrete failure: the very first tab switch away from `tab-cockpit` back to, say, `tab-vision` inherits the cockpit's 13px base font-size and hidden body scrollbar, because `01_tokens_and_base.css`'s reset was loaded into the same document and CSS resets are not un-loadable per-tab without `#tab-cockpit`-scoping every selector. **What would change my mind:** a runtime scan (`grep -c "^\*\s*{" cockpit_src/styles/*.css` plus a manual read of `01_tokens_and_base.css`) showing the stylesheet was already written scoped — not yet done this session, and should be step 1 of implementation, not an assumption either way.

**Confidence:** High (the failure mode is a validated, cited incident on this exact codebase, not a generic worry).

---

### Seat 2 — Security & Auth Boundary Auditor

**Position:** **Finding SEC-1 (Required Now, independent of the integration decision):** `decorator-cockpit.html` and `public/decorator-cockpit.html` currently ship with **zero authentication** and are served as static files on Firebase Hosting (per `.deploymentrc.json`/`.github/workflows/deploy-firebase.yml`). Static Firebase Hosting files are public by default at their exact path. The file's own content (`master_decisions.json`, `topics_marquee.json`/`topics_rayagada.json`) is explicitly described in `cockpit-intake/SKILL.md` as containing **negotiation scripts, price-tier calculators, non-negotiable guardrails, and "Firm" tone battlecards** meant to be used *against* vendor VDR-002 in a live negotiation. If the URL is ever discovered — a shared link, a search-engine crawl of the Firebase Hosting domain, a referrer leak, a screenshot shared to the wrong group chat — the vendor (or anyone) can read the family's entire negotiation strategy, including price ceilings, before or during the negotiation itself. This is a live, present-tense exposure, not a hypothetical one — it exists today regardless of whether any of the four integration options are ever built.

**Evidence:** `grep -n "auth.js|onAuthStateChanged|firebaseConfig" decorator-cockpit.html` → 0 matches (verified this session). `js/auth.js` header comment: "Google Sign-In + email allow-list gate for Sree Krushna Marriage OS" — confirms the intended perimeter exists and simply isn't applied to this file. `js/allowed_users.js` confirms the content owners are the Bride/Groom (Tier 1 SuperAdmin) — i.e., the same people the negotiation content is meant to protect.

**Assumptions:** Firebase Hosting is not otherwise access-restricted (no separate App Check / signed-URL / hosting-level auth rule was found in `.deploymentrc.json` this session — not exhaustively verified, flagged as an open check).

**Trade-offs:** Gating the standalone file behind the same `auth.js` perimeter as `index.html` is small, additive, and reversible; it does not block or depend on any of the four integration options, so it should ship first and separately.

**Risks & Dependencies:** None identified that argue against fixing this immediately; the only "cost" is remembering to keep both the root and `public/` copies gated (the SDCA build's dual-file parity guarantee should be extended to cover the auth wrapper, not just content).

**Challenge:** *Is this actually exploitable, or is "security by obscurity" (an un-guessable long path) sufficient in practice for a 3-week household negotiation window?* Concrete failure scenario: the file is already linked in plaintext from a git-tracked Markdown discussion thread (`260913_DecoratorDiscussion.md`) that could itself be shared, screen-shared, or exported to PDF for exactly the kind of "share with vendor for tender review" workflow this repo's own `VEN-001_HOTEL_INSPECTION_CHECKLIST.pdf` shows is a normal action in this household's workflow — one accidental share of the wrong link closes the gap between "obscure" and "exposed." **What would change my mind:** confirmation that Firebase Hosting is deployed with a global auth-wall (e.g., Firebase Hosting + Cloud Run/Functions auth check, or the whole site is behind Google Identity-Aware Proxy) rather than plain static hosting — not found in `.deploymentrc.json` this session, so treated as absent.

**Confidence:** High.

---

### Seat 3 — Craft & Visual Polish Auditor (`impeccable`)

**Position:** Whichever embedding mechanism is chosen, the **transition into and out of** the cockpit is itself a craft surface the plan never designs. "Add a tab, mount the container" reads as wiring, not experience: entering a 519KB negotiation cockpit mid-meeting should not feel like a context-switch into a different product. The Hybrid model's Tier-1 top action bar (`[⛶ Fullscreen Meeting Mode]`, `[📄 Export Tender Annexure]`) is the right instinct but under-specified — no loading state is designed for the (likely non-trivial, see Seat 5 performance note) mount time on first activation.

**Evidence:** `260913_ui_council_cockpit_impeccable_craft_and_mobile_hardening.md` (`UI-DEC-2026-003`) already hardened the cockpit's *internal* states (tactile hotkey badges, illuminated amber alcove for scripts, vermilion guardrail shield) to a high standard — this session's finding is that none of that craft language extends to the *entry/exit* experience, which is a new surface this integration creates.

**Assumptions:** The cockpit will be lazy-mounted rather than always-present in the DOM (see Seat 5) — if mounted eagerly, this finding is moot but the performance cost (Seat 5) becomes mandatory to pay on every app load instead.

**Trade-offs:** A designed loading/transition state costs a small amount of additional CSS/JS; skipping it risks the cockpit's own hard-won craft (`UI-DEC-2026-003`) reading as a jarring pop-in against the host shell's calmer chrome.

**Risks & Dependencies:** Depends on Seat 1's fragment-build outcome — a scoped fragment container is the natural place to attach a skeleton/loading state; an iframe's loading state is a separate, simpler concern (browser-native).

**Challenge:** *Does this actually matter for a 3-person household tool, or is this over-designing a rarely-used internal surface?* Concrete scenario: mid-negotiation, in front of the vendor, the coordinator taps the tab and the screen shows a blank flash while ~500KB mounts — in a live meeting that reads as a broken app, not a polished one, exactly the moment this cockpit exists to look expensive during (`UI-DEC-2026-003`'s entire premise). **What would change my mind:** if lazy-mount is dropped in favor of always-present DOM (Seat 5's performance concern would then dominate instead).

**Confidence:** Medium (the concern is real but its priority depends on the mount-time numbers, which are unmeasured).

---

### Seat 4 — Visual Hierarchy / Navigation Density Auditor

**Position:** The 2026-08-22 UI council ruling (`260822_ui_council_sticky_header_redesign.md`) redesigned the mobile nav specifically as a **"dual-anchor (42px top / 54px bottom dock)"** sized around the then-current 10 tabs. Adding an 11th nav entry was asserted as low-complexity in the Query 4.2 response ("Low (Clean embed)") without re-running the pixel-fit math that ruling's own Math Auditor discipline requires before any grid/count change to a shared nav shell.

**Evidence:** `Council_Ledger.md` row, 2026-08-22, UI FULL: "mobile dual-anchor (42px top / 54px bottom dock)"; `index.html:165-175` shows the current 10-button `.tab-nav`.

**Assumptions:** The bottom dock is a fixed-count icon strip rather than a scrolling one — not verified this session (CSS for `.tab-nav` under the `<900px` breakpoint was not read); this is exactly the kind of assumption the Math Auditor role exists to close before, not after, implementation.

**Trade-offs:** If the dock is scrollable, an 11th icon is cheap; if it's fixed-width, an 11th icon either shrinks all icons below a usable touch target or forces an overflow ("More") pattern that doesn't exist in this app yet.

**Risks & Dependencies:** Depends on nothing else in this session; this is a pure measurement gap, closeable in minutes by reading the mobile CSS before implementation.

**Challenge:** *Given the dissenter's position (Seat 6) that the tab shouldn't be permanent at all, does this math even matter?* If nav visibility becomes conditional (only shown during active VDR-002 negotiation), the permanent-11th-icon math is replaced by a temporary-12th-icon-sometimes problem, which is arguably worse for layout stability (icons shifting position as tabs appear/disappear) unless the conditional slot is reserved rather than removed. **What would change my mind:** the mobile CSS turning out to already reserve a "contextual slot" pattern — not found this session, needs a direct read of the relevant stylesheet before final sign-off either way.

**Confidence:** Medium (real concern, but the specific verification step wasn't completed this session — flagged as an open pre-implementation check, not a blocking unknown).

---

### Seat 5 — SSOT & Decision-Continuity Auditor

**Position:** The Query 4.2 response's Tier 3 KPI ("Live Command Center telemetry... `16/20 Decor Decisions Resolved (80%)` from `localStorage`") silently assumes a single-device household. `firestore.rules`' documented "SK-004 Firestore Cross-Device Sync" mechanism exists **precisely because** this repo already learned that a 3-person household needs state synced across separate devices (that's the mechanism's own stated purpose) — yet the cockpit's decision-progress state was built on `localStorage` instead of plugging into SK-004, and the integration plan proposes surfacing that same localStorage number on the shared Command Center dashboard as if it were global truth.

**Evidence:** `firestore.rules` `task_status/{taskId}` and `change_requests/{requestId}` collections, both allow-listed to the same 3 emails as the cockpit's intended audience; `grep -n "localStorage" js/marriage-state.js public/js/marriage-state.js` → 0 matches (the main app deliberately does not use localStorage for shared state — this is a real, observed convention this repo already follows, not a suggestion).

**Assumptions:** All 3 SuperAdmins (Bride, Groom, Groom) use different physical devices at least some of the time — a very ordinary assumption for a real household during active wedding planning, not a stretch case.

**Trade-offs:** Extending SK-004 with a small `cockpit_decisions/{id}` collection (or folding the 20 decisions into `task_status` as ad-hoc `TSK-###`-shaped entries, reusing the existing rule functions verbatim) is modest schema work reusing an already-proven mechanism — cheaper than it looks, and it is the RFG-001-preferred path ("prefer evolving an existing capability over creating a new one, always").

**Risks & Dependencies:** Until this ships, the Tier 3 KPI tile must not present itself as a shared live number — doing so is a masking failure (the tile *looks* authoritative to whichever of the 3 users isn't the one who last touched the cockpit on their own device).

**Challenge:** *Is this over-engineering a "nice-to-have" dashboard tile?* Concrete failure: the Bride opens Command Center on her own phone the morning of the vendor meeting, sees "16/20 Resolved (80%)" left over from a stale local cache, walks into the meeting believing 4 items are still open when actually 6 are (the Groom resolved 2 more the previous night on his laptop, which never touched her phone's localStorage) — a wrong number at exactly the moment the tool exists to prevent that kind of mistake. **What would change my mind:** if this household in practice always negotiates from one shared device — not asserted anywhere in the source thread, so not assumed here.

**Confidence:** High on the gap existing; Medium on the exact schema shape (not designed this session).

---

### Seat 6 — Maintainability & Velocity / RFG-001 Auditor (assigned dissenter)

**Position (dissents from the emerging majority direction — a permanent Tier-1 nav tab):** A permanent 11th top-level nav slot for a tool whose useful life is the decorator negotiation window (realistically a few weeks out of the whole wedding timeline) is over-scoped for this repo's actual maturity (3 users, 1 event, 10 tabs already). Burden-of-proof test: (1) the problem — cockpit unreachable from the app — exists today, cited (Phase 0 §2); (2) can the existing architecture evolve to solve it without a *permanent* structural addition? **Yes** — a nav entry conditioned on VDR-002's contract-negotiation status (visible while `Negotiating`/`Pending_Signature`, collapsed to a link inside the Vendors tab once `CTR-###` is signed) solves reachability without permanently taxing nav real estate; (3) net complexity: a conditional-visibility rule is *lower* long-run complexity than a permanent tab, because it doesn't force every future one-off vendor negotiation tool (this repo already builds these fast — 6 council sessions in one day) to also claim a permanent nav slot by precedent; (4) deferring the *permanent* framing costs nothing measurable — the conditional version ships the same reachability today.

**Evidence:** `04_PROCUREMENT_VENDORS/vendors/` directory structure (per `P-ENT-ID`, `VDR-###` is a general vendor entity, not decorator-specific) implies more vendor negotiations are likely to come; `firestore.rules`' `change_requests.targetDomain` enum already includes `VENDORS` as one of six domains, suggesting the repo's own data model expects vendor-workflow tooling to recur, not to be a one-off.

**Assumptions:** VDR-002's contract status is or can be made a readable field the nav-visibility check can query (e.g., via the existing `task_status`/`change_requests` mechanism, or a simple field in the vendor's own record under `04_PROCUREMENT_VENDORS/vendors/`).

**Trade-offs:** Conditional visibility adds a small amount of logic (a status check) that a flat permanent tab doesn't need — genuinely more moving parts for a genuinely smaller permanent footprint.

**Risks & Dependencies:** If no such status field exists yet, this becomes an extra prerequisite before Tier 1 ships at all — must be scoped honestly, not hand-waved.

**Challenge (verbatim, quoted in Synthesis below):** *"A permanent 11th top-level tab commits nav real estate forever to content relevant mainly during the decorator negotiation window (weeks, not the whole event lifecycle) — 6 months post-wedding, the nav bar still burns a permanent slot on a negotiation tool nobody opens again."* **What would change my mind:** if the cockpit is deliberately generalized into a reusable *any-vendor* negotiation engine (not decorator-specific) that stays useful across every entry in `04_PROCUREMENT_VENDORS/vendors/` for the rest of the wedding — then a permanent tab is justified as a durable capability, not a one-vendor artifact. That generalization was not proposed anywhere in the source thread and is out of scope for this session.

**Confidence:** Medium (a genuine, evidence-grounded product-judgment disagreement — not resolved by evidence alone; carried into Synthesis as an explicit open question rather than a picked side, per the SOP's instruction for unresolved disagreements).

---

## Phase 2: Synthesis

### Unanimous agreement

1. The Hybrid model's core shape (in-app surface + cross-tab portals + a dashboard signal) is directionally right and is **not** being overturned.
2. Option 2 ("Deep Modular Synthesis" — deconstruct the cockpit across 3 existing tabs) is rejected outright, for the same reasons the original response gave (fragments the live-negotiation meeting flow; high CSS bloat) — and this session adds that it would also fragment the SK-004 sync work three ways instead of one.
3. Whatever embedding mechanism is chosen, the CSS/JS boundary work described by the INC-086 pattern trio (Seat 1) is mandatory, not optional polish.
4. SEC-1 (Seat 2) must be fixed regardless of which integration option is chosen, and does not block or depend on any of them.

### Areas of disagreement

**Disagreement 1 — Permanent vs. conditional nav tab.** Seat 6 (dissenter) argues nav visibility should be conditioned on VDR-002's negotiation status; Seats 3/4 implicitly assumed a permanent tab (as did the original Query 4.2 response) and did not weigh the long-run nav-bloat cost. **This is not resolved by the evidence gathered this session** — it depends on a product judgment (will more vendor-negotiation cockpits like this one be built for other vendors?) that only the household can answer. **Presented as an open question below, not decided by this synthesis.**

**Disagreement 2 — Inline-DOM fragment vs. iframe.** Seat 1 leans toward a same-document fragment (cleaner Fullscreen API and print-CSS integration, matches the INC-086 precedent's own resolution) once the CSS-scoping gate is properly applied; an iframe would get CSS/print isolation "for free" but at the cost of extra plumbing for the Tier-3 KPI tile and Fullscreen Meeting Mode (both need to reach across the frame boundary). No seat argued iframe is *better* overall, but it is flagged as the safer fallback if the fragment build proves harder than expected.

### Trade-off analysis

| Path | CSS/print isolation | Fullscreen Meeting Mode | Tier-3 KPI wiring | Engineering cost |
|---|---|---|---|---|
| Inline DOM fragment (scoped per INC-086 patterns) | Requires disciplined scoping work (one-time cost) | Native, same-document — easiest | Native, same-document — easiest | Medium (new SDCA build target) |
| iframe embed | Free (browser-native isolation) | Needs `iframe.requestFullscreen()` + postMessage coordination | Needs `postMessage` bridge or shared-origin storage event listener | Low upfront, higher ongoing plumbing |

### Recommended Course of Action (RFG-001 tagged)

1. **[Required Now]** Gate `decorator-cockpit.html` and `public/decorator-cockpit.html` behind the existing `auth.js` perimeter (Seat 2, SEC-1). Ships immediately, independent of everything else below. Until Steps 2-6 land, this also makes **Option 3 (Header Launchpad)** a legitimate *interim* bridge — a simple authenticated launch button is strictly better than the current unauthenticated direct-URL status quo, and can ship the same day as SEC-1.
2. **[Required Now, prerequisite for Tier 1]** Extend `cockpit_src/build.cjs` with a fragment-mode output: no outer `<html>/<head>/<body>`, every selector in `cockpit_src/styles/*.css` scoped under `#tab-cockpit #cockpitFrame` (per `monolithic-engine-port-css-scoping-gate.md`), and an audit of `controller.js` for any `document.body`/`document.documentElement` fullscreen or scroll-lock calls, redirected to a scoped container reference (Seat 1). Apply `sub-engine-shadowing-and-tab-reconciliation.md`'s delegation contract so `switchTab()` in `index.html` calls a single exported `window.render*`/`window.mount*` entry point and never duplicates cockpit logic.
3. **[Required Now, before Step 2 ships]** Verify `sw.js`/`public/sw.js` still bypasses cache correctly on `localhost` after the new fragment fetch path is added (`localhost-sw-cache-bypass-gate.md`) — a quick check, not a redesign.
4. **[Recommended Soon]** Register `tab-cockpit` in `FEATURE_CATALOG.json`; wire the nav button and a **lazy-mounted** container (fetch-and-inject on first tab activation, not baked into `index.html`'s initial payload — protects `npm run audit:lighthouse` scores on the other 10 tabs from the ~520KB payload). Design an explicit loading/skeleton state for the mount (Seat 3).
5. **[Open question — not decided here]** Nav visibility: permanent 11th tab vs. conditional-on-VDR-002-status. Recommend the household decide directly; the conditional version is cheap to build if the answer is "conditional" (Seat 6) and trivial to skip if the answer is "we're comfortable with a permanent tab."
6. **[Recommended Soon]** Before shipping, pixel-verify the new nav entry against the 2026-08-22 mobile dual-anchor dock CSS (Seat 4) — a direct read of the breakpoint stylesheet, not an assumption.
7. **[Recommended Soon]** Tier 2 cross-tab portals (Vendors/VDR-002 card, Vision Studio banner) as originally proposed in Query 4.2 — low risk, additive, no new findings against them this session.
8. **[Recommended Soon]** Tier 3 KPI: back it with a small Firestore extension of the existing SK-004 mechanism (Seat 5) rather than raw `localStorage`. **Until that ships, label the tile "(this device)"** rather than implying a shared live number — anti-masking discipline, not a cosmetic nit.
9. **[Recommended Soon]** Add a Playwright e2e spec for `nav-tab-cockpit` (the app already has `npm run test:e2e`; the cockpit's own `npm run test:cockpit` only covers the standalone artifact, not its in-app reachability) before certifying the integration complete.
10. **[Future Extension, explicitly deferred]** Generalizing the cockpit into a reusable any-vendor negotiation engine (Seat 6's "what would change my mind" condition for a permanent tab). Re-open trigger: a second vendor negotiation (beyond VDR-002/decorator) requests the same cockpit treatment.
11. **[Recommended Soon, housekeeping, non-blocking]** `architecture-council.md` and `ui-council.md` are verbatim Task-Dashboard templates (React/Firestore/`src/services` rosters) not yet localized to this repo's actual stack — this session had to seat an ad hoc roster because of it (see Process Notes).

### Alternatives considered and rejected

- **Option 2 (Deep Modular Synthesis)** — rejected (unanimous; see above).
- **Option 3 (Launchpad) as the permanent destination** — rejected as a *final* state, because it perpetuates SEC-1's unauthenticated exposure by leaving the standalone file as the primary access path; **accepted as the temporary bridge** between Step 1 (auth gate) and Steps 2-6 (in-app embed).
- **iframe-forever embed** — not rejected outright, but not the primary recommendation; kept as the named fallback if the fragment-mode SDCA build (Step 2) proves harder than scoped.

### Confidence levels

| Finding | Confidence | Why |
|---|---|---|
| SEC-1 (no auth on standalone cockpit) | High | Directly verified via grep against the live file, twice (root + `public/`). |
| INC-086 pattern applicability | High | Validated, cited precedent on this exact codebase, not a generic analogy. |
| SK-004 extension as the fix for Tier-3 KPI | Medium-High | Mechanism verified to exist and match the exact need; exact new schema not designed this session. |
| Permanent vs. conditional nav tab | Medium | Genuine open product question, correctly left undecided rather than forced. |
| Mobile dock pixel-fit for an 11th icon | Medium | Real concern; the actual breakpoint CSS was not read this session — flagged as a pre-implementation check. |

---

## Process Notes (ICG-001 self-critique)

- **Gap:** This session ran as a single synthesizing pass rather than dispatching independently-reasoning parallel subagents per the SOP's `dispatching-parallel-agents` phase-execution skill. **Proposed fix:** acceptable under the SOP's own expedited-tier allowance given the FULL-vs-expedited call was close; a genuinely parallel dispatch would most strengthen the Craft & Polish (Seat 3) and Navigation Density (Seat 4) seats, which benefit most from independently-framed takes. **Applied in-session:** No — deferred; recommend a follow-up dedicated design session (`impeccable` + `ui-ux-pro-max` live) once the fragment-mode chrome itself is being built.
- **Gap:** `architecture-council.md` and `ui-council.md`'s default rosters, mandate tables, and even their "Task-Dashboard-specific elaboration" headers are verbatim copies from a different repository (React/Firestore/`src/services`/5-level role hierarchy — none of which exist here), forcing this session to seat an entirely ad hoc roster (see N/A ledger above). **Proposed fix:** a dedicated housekeeping session to localize both files' default rosters to this repo's actual stack (vanilla JS SPA, Firebase Hosting, the narrow SK-004 Firestore surface), the way the shared `RFG-001`/`ICG-001` blocks already carry Sree-Krushna-appropriate generic wording. **Applied in-session:** No — logged as Recommended-Soon item 11 above, out of scope for this decision.
- **Gap:** `check-council-artifact.ps1`, which the shared ICG-001 block says mechanically checks council artifacts for roster/Phase-1-field/Challenge-quote completeness, **does not exist in this repository** (confirmed via `find . -maxdepth 1 -iname "check-council-artifact.ps1"` → no match). **Proposed fix:** either port the checker script from wherever it originated, or update the shared block's wording in both council files to state plainly that this repo enforces ICG-001 by convention only, not tooling. **Applied in-session:** No.

---

## Execution Addendum (2026-09-14, post-Milestone-1)

Milestone 1 (auth refactor, cockpit auth overlay, header launch button, `FEATURE_CATALOG.json` registration) was implemented and its PASS claims were **independently re-verified this session** (re-ran `build:cockpit`, `test:cockpit`, `verify:deployment`, `verify:governance-wiring` directly rather than trusting the execution report) — all genuinely green, and the engineering itself (the `initAuthGate` refactor, the real `display:none` DOM-hide, relative-path parity across root/`public`) is sound.

**However, direct inspection of the built output shows SEC-1 is only partially mitigated, not closed:** the full `MASTER_DECISIONS`/`TOPICS_*` negotiation dataset ships in plaintext inside the same static HTTP response as the auth-overlay markup — confirmed by reading the file with no browser/JS execution at all. The client-side auth gate closes the casual-click exposure path but not view-source, `curl`, DevTools console inspection, or search-engine indexing (no `robots.txt`/`X-Robots-Tag` exists anywhere in the repo). This is a structural limit of gating a purely static file client-side, not an implementation bug in Milestone 1's code.

**Status correction:** `AC-DEC-2026-012`/`UI-DEC-2026-008` item 1 ("gate the standalone cockpit behind auth") should be tracked as **Partially Mitigated**, not **Resolved**, until either (a) a `robots.txt`/`noindex` stopgap closes the crawler vector, or (b) the sensitive data is moved behind a real request-time boundary — for which Milestone 3's already-planned `cockpit_decisions` Firestore migration is the natural mechanism (fetch decisions post-auth, let Firestore rules do the actual authorization). Recommend evaluating whether to pull that piece of Milestone 3 forward, ahead of or parallel to Milestone 2's CSS-scoping work.

Full detail: [`260913_DecoratorDiscussion.md`](../DecoratorDiscussion/260913_DecoratorDiscussion.md) Response 4.7.

### Second Addendum (2026-09-14, same day): both remediations implemented

Both the stopgap and the real fix were implemented this session:

1. **Stopgap, shipped:** `public/robots.txt` disallows `/decorator-cockpit.html`; `firebase.json` adds an `X-Robots-Tag: noindex, nofollow, noarchive` header for that path. Closes the search-indexing vector. Does not (and cannot) close view-source/curl/DevTools — that requires item 2.
2. **Real fix, code-complete and independently re-verified, one manual step remaining:**
   - `master_decisions.json`, `topics_marquee.json`, `topics_rayagada.json` are no longer embedded in the compiled `decorator-cockpit.html` (confirmed: file size dropped ~65KB, and a direct byte-level check shows the actual decision/topic titles are absent from the raw HTML — see `scripts/test-cockpit-smoke.cjs` Phase 4b, "SEC-1 Zero-Leak Verification," now a permanent regression test).
   - They are fetched client-side from Firestore's new `cockpit_content/{docId}` collection only after `initAuthGate`'s `onSignedIn` fires (`cockpit_src/template.html`), via `applyCockpitContent()` (`cockpit_src/scripts/controller.js`), with loading/error banners for the fetch window.
   - `firestore.rules` gained a `cockpit_content` match block (read/write gated to the same 3-email allow-list as every other collection). `build.cjs` gained a self-check that fails the build if this content ever leaks back into the compiled output.
   - `npm run build:cockpit`, `npm run test:cockpit`, `npm run verify:deployment`, `npm run verify:governance-wiring` all independently re-run and green.
   - `scripts/seed-cockpit-firestore.html` — a one-time (and re-run-on-content-change) migration utility, deliberately kept outside `public/` so it can never be deployed — pushes the 3 JSON files into `cockpit_content` via the Firestore **client** SDK, signed in as an allow-listed user, so it needs no service-account credentials.
   - **Not done by this session, requires the household's own action:** (a) `firebase deploy --only firestore:rules` — blocked by this session's own tooling permissions as a live production action; (b) running `scripts/seed-cockpit-firestore.html` once, which requires an interactive Google sign-in a coding agent cannot perform. **Until (a) ships, every `cockpit_content` read falls through to `firestore.rules`' default-deny rule and fails with a permission error** (surfaced via the new error banner); once (a) ships but before (b) runs, reads succeed but return no documents, so topics/decisions render empty. Both are deliberate fail-closed states, not bugs.

Updated `.agent/skills/cockpit-intake/SKILL.md` to require re-seeding after any future edit to these 3 files.

### Third Addendum (2026-09-15): DLRS Hybrid Model & Milestone 2 Scoped Fragment Pipeline Fully Operational

Both manual steps from the Second Addendum were automated and closed, and Milestone 2 was fully implemented and independently verified:

1. **Firestore Rules Live in Production**: Deployed to production Firebase via `firebase.cmd deploy --only firestore:rules --non-interactive`. `firestore.rules` ruleset successfully compiled and released to `cloud.firestore`.
2. **Headless Admin Seeder (`scripts/seed-cockpit-firestore.cjs`)**: Built a zero-dependency headless Node seeder utilizing cached Firebase CLI OAuth credentials from `~/.config/configstore/firebase-tools.json` (auto-refresh enabled). Directly seeded `master_decisions`, `topics_marquee`, and `topics_rayagada` into Firestore `cockpit_content` via the REST API, eliminating any browser/OAuth popup requirement. Verified in `npm run seed:cockpit`.
3. **Milestone 2 Scoped Fragment Pipeline**: Extended `cockpit_src/build.cjs` to support `--fragment` and `--all` modes:
   - Scopes all selectors in `cockpit_src/styles/*.css` under `#tab-cockpit #cockpitFrame` per `monolithic-engine-port-css-scoping-gate.md`.
   - Maps `:root` tokens and resets to `#tab-cockpit #cockpitFrame`.
   - Contains exactly zero unscoped global CSS rules (`* {`, `body {`, `html {`, `:root {`).
   - Strips standalone `ambient-bg`, `cockpitAuthOverlay`, and standalone auth module, emitting clean fragment markup into `cockpit-fragment.html` and `public/cockpit-fragment.html` with 100% byte parity.
   - Enforces SEC-1 zero-leak contract on fragment files.
   - Exposes `window.renderDecoratorCockpit` lifecycle hook for parent tab delegation.
4. **Automated Test Gate Parity**: `scripts/test-cockpit-smoke.cjs` upgraded to audit both standalone and fragment release artifacts, CSS scoping isolation, and zero-leak contracts. All gates (`npm run test:cockpit`, `npm run verify:deployment`, `npm run verify:governance-wiring`) pass 100% green.

---


## Evidence Snapshot

- **Commit:** `b9d9e43269bb2777d54f18f96e64431284224739` (2026-09-13 11:17:59 +0530)
- **Files relied on this session:** `index.html`, `public/index.html`, `decorator-cockpit.html`, `public/decorator-cockpit.html`, `FEATURE_CATALOG.json`, `cockpit_src/build.cjs`, `.agent/skills/cockpit-intake/SKILL.md`, `sw.js`, `public/sw.js`, `js/auth.js`, `js/allowed_users.js`, `firestore.rules`, `js/marriage-state.js`, `public/js/marriage-state.js`, `scripts/verify-deployment.cjs`, `.agent/patterns/sub-engine-shadowing-and-tab-reconciliation.md`, `.agent/patterns/monolithic-engine-port-css-scoping-gate.md`, `.agent/patterns/localhost-sw-cache-bypass-gate.md`, `.agent/workflows/architecture-council.md`, `.agent/workflows/ui-council.md`, `Council_Ledger.md`, `260913_DecoratorDiscussion.md` (Query/Response 4.2).
- **Staleness rule:** a future session citing this ruling should run `git log b9d9e432..HEAD -- <the file list above>`; any commits returned mean the ruling should be re-validated before being relied on.
