---
description: "Induct a new repository into the Portable Knowledge System (PKS) ecosystem."
---

# PKS Onboarding Workflow (/onboard-pks-repo)

> **Purpose**: Induct a new repository into the Portable Knowledge System (PKS) ecosystem.
> **Prerequisites**: Repository must already have basic AOS infrastructure.

---

## 📋 Onboarding Checklist

### 1. SAP Registration (Hub Side)
- [ ] Add new repo path to `Capsicum/docs/SHARED_ALIGNMENT_PROTOCOL.md` (Section 5B).
- [ ] Add new repo file targets to tracked blocks (Section 6).

### 2. Infrastructure Propagation
- [ ] Copy `skill-router.yaml` to `[new-repo]/.agent/skill-router.yaml`.
- [ ] Copy `aos-session-start.md` to `[new-repo]/.agent/workflows/aos-session-start.md`.
- [ ] Ensure `shared` block tags are preserved.

### 3. Graphify Initiation
- [ ] Run `graphify:detect` on the new repository.
- [ ] Generate initial `graphify-out/graph.json` and `GRAPH_REPORT.md`.
- [ ] Verify that `Protocol 26/39` (Hardened Pre-Flight) is added to `GEMINI.md`.

### 4. Documentation Indexing
- [ ] Add "Architectural Governance" section to `[new-repo]/docs/DOCUMENTATION_HUB.md`.
- [ ] Link `graphify-out/GRAPH_REPORT.md` and `docs/SHARED_ALIGNMENT_PROTOCOL.md`.

---

## 🚀 Execution Script (PowerShell)

```powershell
# 1. Sync Router & Workflow
Copy-Item D:/GitHub_Repo/Capsicum/.agent/skill-router.yaml .agent/skill-router.yaml -Force
Copy-Item D:/GitHub_Repo/Capsicum/.agent/workflows/aos-session-start.md .agent/workflows/aos-session-start.md -Force

# 2. Setup Graphify Path
New-Item -ItemType Directory -Force -Path graphify-out

# 3. Log Onboarding
# Add entry to docs/SHARED_ALIGNMENT_PROTOCOL.md
```

---

## 🛡️ Verification
- [ ] Run `Step 0` in the new repo.
- [ ] Verify agent loads `skill-router.yaml` successfully.
- [ ] Verify agent performs Graphify Pre-Flight before discovery.
