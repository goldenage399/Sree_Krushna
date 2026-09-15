---
name: idea-incubator
description: Use when user wants to brainstorm, bounce an idea, stress-test an experiential concept, or add a raw proposal to the ideas list without treating it as an immediate code/app implementation requirement.
---

# /idea-incubator — Wedding OS Ideation & Concept Incubation Protocol

**Purpose:** A dedicated creative firewall that intercepts raw brainstorm thoughts, experiential concepts, and decorative ideas. It analyzes feasibility, deepens sensory impact, evaluates cost-to-impact ROI, and persists the concept into the proposal ledger—**without modifying any production code, database schemas, or treating the idea as an immediate implementation ticket.**

---

## The Prime Rule: The Implementation Firewall

> **INVARIANT**: When `/idea-incubator` is active, the agent is strictly in **Incubation Mode (Exploratory)**.
> - **DO NOT** edit production application code (`index.html`, `js/`, `css/`, `cockpit_src/`, `decorator-cockpit.html`).
> - **DO NOT** create Firestore write scripts, run deployment commands, or scaffold implementation plans.
> - **DO NOT** assume the idea is an approved sprint requirement.
> - **ONLY** analyze, refine, stress-test, brainstorm complementary touches, and record the idea in `docs/proposals/`.

---

## The 5-Phase Incubation Lifecycle

```
[1. FIREWALL LOCK] ──> [2. DECONSTRUCT] ──> [3. STRESS-TEST] ──> [4. AMPLIFY] ──> [5. LEDGER LOG]
 No code touched;       Sensory cues,        Feasibility, safety,   Cost-effective,  docs/proposals/
 Incubation mode ON     target event, intent vendor dependencies   high-ROI twists  PROP-*.md
```

---

### Phase 1: Firewall Lock & Intent Acknowledgment
1. Explicitly confirm to the host that the idea is accepted into the **Incubation Chamber**.
2. Reaffirm that production code, main app features, and decorator cockpit files remain untouched.

---

### Phase 2: Deconstruction & Sensory Mapping
Break the raw suggestion into its experiential anatomy:
- **Target Event**: Wedding Entry, Sangeet Stage, Mandap Ritual, Haldi, Hospitality, etc.
- **Sensory Medium**: Lighting, Sound/Music, Physical Props, Floral/Fragrance, Movement/Choreography.
- **Emotional Objective**: Intimate/Romantic, High-Energy Grandeur, Nostalgic/Family Memory, Surprise Factor.

---

### Phase 3: Operational & Technical Stress-Test
Critique the idea from an unvarnished host and engineering lens:
1. **Physical & Structural Limits**: Truss loads, ceiling heights, anchoring points, wind/weather exposure.
2. **Electrical & Audio/Visual Load**: DMX dimming capabilities, generator phase capacity, circuit isolation.
3. **Safety & Flow**: Slipping risks (balloons, water, wet petals), fire/flame hazards (sparklers in tents), dark-aisle tripping risks.
4. **Photo/Video Constraints**: Camera autofocus in darkness, color temperature (keep 3000K–3200K warm white, avoid saturated colored washes on faces).
5. **Vendor Ownership**: Identify which exact vendor owns execution (Decorator, DJ/AV, Venue Manager, Caterer). Formulate 2–3 precise technical questions for that vendor.

---

### Phase 4: Creative Amplification & Cost-Effective Twists
Propose 2–3 low-cost (< ₹5,000) or zero-cost complementary touches that magnify the moment:
- Scent / fresh petal synergies.
- Pre-recorded personal voice notes or audio cross-fades.
- Family involvement (cousin arches, parent blessing triggers).
- Reusable elements that can transition to the next ritual.

---

### Phase 5: Structured Proposal Logging
Record or update the proposal entry in `docs/proposals/PROP-YYYYMMDD-ideation-intake.md` (or domain-specific proposal document):

```markdown
### Proposal [PROP-###]: [Short Title]
- **Classification**: `[SDCA]` (Decorator/Stage) / `[OPS-LOG]` (Operations/Flow) / `[GOV-DEC]` (Policy) / `[APP-ENH]` (Tooling)
- **Target Event**: [Event Name]
- **Concept & Moment**: [Clear description of what happens]
- **Feasibility Analysis**: [Structural, electrical, safety, photo considerations]
- **Vendor Questions**:
  - [ ] [Key question 1]
  - [ ] [Key question 2]
- **Amplification Ideas**: [Cost-effective touches]
- **Risk & Mitigation**: [Identified risk] → *[Mitigation strategy]*
```

---

## Transition & Promotion Gate

An incubated idea **only leaves the incubator** when the user explicitly requests one of the following:
1. **To Decorator Cockpit**: Trigger `/cockpit-intake` to compile approved items into `cockpit_src/data/cockpitTopics.js` (`npm run test:cockpit`).
2. **To Formal Decision**: Promoted to `00_GOVERNANCE/decisions/` as a canonical `DEC-###` record.
3. **To Application Feature**: Scaffolded via Enhancement Protocol (`ENHANCEMENT_PROTOCOL.md`) with an approved `implementation_plan.md`.

---

## Common Anti-Patterns to Avoid

- ❌ **Premature Coding**: Jumping into editing `decorator-cockpit.html` or `index.html` after the user pitches a concept.
- ❌ **Dismissive Criticism**: Saying "that's too hard to do" without offering a safer, cheaper, or more practical alternative.
- ❌ **Over-Engineering Jargon**: Drowning a simple balloon or fairy light idea in academic abstractions; keep it grounded in practical host and vendor realities.
- ❌ **Discarding Without Recording**: Letting ideas die in chat without persisting them into `docs/proposals/`.
