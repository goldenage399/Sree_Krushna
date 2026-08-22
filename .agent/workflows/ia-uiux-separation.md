---
description: Mandatory two-workflow separation for dashboard, portal, and interface initiatives — Information Architecture (What) is approved before UI/UX Architecture (How) begins. Prevents decision overlap and ambiguity.
---

# IA / UI-UX Separation Workflow (IUS-001)

**Purpose**: Enforce a hard boundary between two independent workflows in any dashboard, portal, or interface initiative. The boundary prevents decision overlap, ambiguity, and the most common failure mode in interface design — conflating *what to present* with *how to present it* and making both decisions poorly at the same time.

**Canonical principle**:
> **Information Architecture answers *What?***
> **UI/UX Architecture answers *How?***

**Established by**: Task-Dashboard governance alignment (IUS-001 — Workflow Separation Directive)
**Version**: 1.0 (2026-07-07)
**Applies to**: Admin Dashboard, Profile Workspace, Task Views, Escalation Shell, Activity Feed, and any new interface initiative under this repository.

---

## The Two Workflows

### Workflow 1 — Information Architecture (IA)

**Domain**: Content and data. Answers ***What?***

**Owner**: Architect + Product Owner (joint approval required before UI/UX begins)

**Responsibilities**:

| Responsibility | Description |
|---|---|
| **Content determination** | What information belongs on this interface |
| **Canonical data model** | Which Firestore collections and service layer outputs are authoritative sources |
| **Information hierarchy** | Priority ordering of sections and content types (e.g. task list before audit trail) |
| **Section / widget definition** | Named sections: Task Cards, Profile Headers, Escalation Timelines, Activity Feeds, KPI tiles |
| **Refresh / update mechanism** | How often content is updated; real-time Firestore listeners vs. manual fetch |
| **Data ownership & governance** | Who authors, approves, and gates each content type (Admin / Supervisor / User roles) |
| **Automatic vs. curated** | Per-item classification: computed (e.g. task counts) or hand-authored (e.g. profile descriptions) |
| **SSOT alignment** | Traceability of every displayed item to its Firestore collection / service module |
| **Content-safety gates** | Which items require explicit Admin sign-off before surfacing (e.g. escalation status) |

**Explicitly out of scope for IA**:
- Layout choices
- Visual design or component decisions
- Interaction patterns
- Responsive breakpoints
- Typography, color, animation

**Output (mandatory before UI/UX begins)**:
- An approved, named IA document (e.g., `260707_ProfileWorkspace_IA.md`)
- Section list with named Firestore sources for each section
- Auto vs. curated classification per item
- Content-safety gates identified and documented
- Architect + product owner sign-off (explicit, not assumed)

---

### Workflow 2 — UI/UX Architecture (UIUX)

**Domain**: Presentation layer. Answers ***How?***

**Owner**: Architect (with external design input where applicable; see `/external-ui-redesign`)

**Entry gate**: IA document is approved. UIUX does **not** begin until the IA output is signed off.

**Responsibilities**:

| Responsibility | Description |
|---|---|
| **Layout** | Page structure, grid, section arrangement |
| **Navigation** | Sidebar nav, page hierarchy, routing (React Router v6) |
| **Components** | Card types, widgets, tables, timeline visuals |
| **Visual hierarchy** | Typography scale, emphasis, whitespace |
| **Interaction patterns** | Hover states, expand/collapse, click-to-reveal |
| **Responsive behaviour** | Breakpoints, mobile treatment, viewport contracts |
| **Design system** | CSS custom property tokens, color palette, motion guidelines |
| **Accessibility** | Contrast, keyboard nav, ARIA, reduced-motion |
| **Dashboard usability** | Scannability, cognitive load, information density |
| **Information discoverability** | Jump-links, search, progressive disclosure |

**Explicitly out of scope for UIUX**:
- Redefining which information is displayed
- Questioning or revising the content model
- Adding new Firestore data sources not approved in the IA
- Changing section names or scope without escalation (see Escalation below)

**Output**:
- Design specification or PRD Part 2
- Component/section mapping against the approved IA section list
- Design system decisions recorded (palette, type scale, motion rules)

---

## Workflow Sequence

```
┌─────────────────────────────────────────┐
│  Workflow 1 — Information Architecture  │
│  (What?)                                │
│                                         │
│  1. Survey Firestore collections        │
│  2. Define sections & data model        │
│  3. Classify auto vs. curated           │
│  4. Document content-safety gates       │
│  5. Architect + Product Owner SIGN-OFF  │
└──────────────────┬──────────────────────┘
                   │  ← hard gate, no bypass
                   ▼
┌─────────────────────────────────────────┐
│  Workflow 2 — UI/UX Architecture        │
│  (How?)                                 │
│                                         │
│  1. Design system foundation            │
│  2. Section-level layout design         │
│  3. Component specification             │
│  4. Interaction & motion design         │
│  5. Responsive + accessibility pass     │
│  6. Architect SIGN-OFF                  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
            Implementation
```

---

## Entry Protocol

At the start of any work session touching a dashboard, portal, or interface initiative, establish which domain is being addressed **before** taking any action:

**Prompt yourself (or the user)**:

> *"Is this session defining what information to present, or how approved information should be presented?"*

| Answer | Domain | Workflow |
|---|---|---|
| Defining content, Firestore sources, sections, or data model | **What** | Workflow 1 — IA |
| Designing layout, components, visuals, or interaction | **How** | Workflow 2 — UIUX |
| Unclear — both concerns are mixed | **Stop** | Separate the concerns before proceeding |

If a session starts with "both" — that is the problem this workflow exists to prevent. Separate them, choose the right one for this session, and defer the other.

---

## Escalation — When UIUX Hits a Content Constraint

UIUX may not redefine content. But implementation constraints can surface genuine IA gaps:

**Permitted escalation**: during UIUX work, if a content-level decision is required (e.g., a proposed layout requires a data type that the IA did not define), the implementer **escalates back to IA** — stops UIUX, documents the constraint, and requests an IA amendment.

**Not permitted**: silently adding content, inventing new sections, or using IA-undefined Firestore fields because the design needs them. These are IA decisions that must be approved before the UIUX can consume them.

**Escalation log format** (append to the active IA document):

```
## IA Escalation — [date]
Raised by: [implementer]
Constraint: [what UIUX implementation revealed]
IA question: [the decision that must be resolved]
Resolution: [approved answer or DEFERRED]
Approved by: [architect / product owner]
```

---

## Governance Rules

1. **IA must be approved before UIUX begins** — no exceptions, no parallel-tracking.
2. **UIUX cannot redefine content** — layout decisions that implicitly change what's shown are IA decisions.
3. **Every section in the UIUX spec maps 1:1 to a section in the approved IA** — if there's no IA entry, the section is out of scope.
4. **Content-safety gates from the IA carry through to UIUX and implementation** — they are not re-evaluated at the design stage.
5. **Domain mixing is a process violation** — if review reveals that IA and UIUX decisions were made in the same document or the same session without separation, a reconciliation pass is required before implementation continues.

---

## Application to This Repository

| Initiative | IA Document | Status |
|---|---|---|
| Task Dashboard — Admin Overview | To be created per initiative | As needed |
| Profile Workspace | To be created per initiative | As needed |
| Escalation Shell | To be created per initiative | As needed |
| Activity Feed & Audit Trail | To be created per initiative | As needed |

---

## Related

- [external-ui-redesign.md](external-ui-redesign.md) — EUR workflow for delegating *presentation design* to an external (the IA/UIUX separation is a prerequisite: you can only delegate UIUX if IA is already approved and locked)
- [governance-workflow.md](governance-workflow.md) — prevents "Helpful Inference Trap" — the same failure mode this workflow guards against in the content/design dimension
- [file-placement-guardrail.md](file-placement-guardrail.md) — verify placement of any new IA or UIUX artifacts before creating them
- [debug-frontend.md](debug-frontend.md) — frontend debug tracks; only enters after IA/UIUX are both resolved
