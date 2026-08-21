# Architectural Decision Record 001: Collection Ownership Contract

* **Status**: Accepted
* **Date**: 2026-05-21
* **Deciders**: Google DeepMind Agentic Coding Pair, Repo Architect, Orchestrator
* **Cross-References**:
  - Context Registry: [.agent/context-registry.json](file:///d:/GitHub_Repo/Task-Dashboard/.agent/context-registry.json)
  - P66/P67 Pattern Catalog: [.agent/patterns/P66-P67-collection-ownership.md](file:///d:/GitHub_Repo/Task-Dashboard/.agent/patterns/P66-P67-collection-ownership.md)
  - ESLint Enforcement Rule: [eslint.config.js — firebase/no-direct-collection-access plugin](file:///d:/GitHub_Repo/Task-Dashboard/eslint.config.js)
  - Integrity Test Suite: [src/__tests__/context-registry.test.js](file:///d:/GitHub_Repo/Task-Dashboard/src/__tests__/context-registry.test.js)
  - Mutation Invalidation Contract: [.agent/patterns/mutation-contract-pattern.md](file:///d:/GitHub_Repo/Task-Dashboard/.agent/patterns/mutation-contract-pattern.md)

---

## 1. Context and Problem Statement

In complex React-based applications querying client-heavy datastores (such as Firebase Firestore), it is common for multiple independent pages, widgets, and UI hooks to fetch and mutate the same shared database collections (e.g., `users`, `profiles`, `projects`).

When these accesses are uncoordinated, two critical architectural failures emerge:
1. **Divergent Fetch Strategy (P66)**: Components in the same session access the same resource using conflicting fetching configurations (e.g., mixing real-time subscriptions with cached, one-shot reads), causing layout sections to render divergent values.
2. **Session-Layer Entity Fragmentation (P67)**: Passive caches are not invalidated when another component modifies a document, creating stale client-side session states.

We need a systematic, stack-agnostic approach to enforce strict collection ownership, controlled reads, and coordinated invalidations post-mutation.

---

## 2. Decision Outcome

We accept a **strict 4-Layer Collection Ownership Contract** as the core data governance policy for all shared mutable collections:

1. **Explicit Context Ownership**: Every shared mutable Firestore collection must map to exactly **one** designated owning context layer. The owner governs all reads, caching strategies, and queries.
2. **Registry-Driven Access Control**: All collection-to-context assignments are declared in [.agent/context-registry.json](file:///d:/GitHub_Repo/Task-Dashboard/.agent/context-registry.json).
3. **No Direct Collection Imports**: Components, pages, and hooks residing outside `/contexts/` are strictly **forbidden** from making direct collection queries (`collection()`, `onSnapshot()`, `getDocs()`). They must consume governed collections through their context owners.
4. **Mandatory Mutation-Invalidation Hooks**: Any service, hook, or API making a write mutation to an enforced collection must execute the owner's registered invalidation handler on success (e.g., calling `refreshCurrentUserProfile()` post-profile update).

---

## 3. Alternatives Considered

### Alternative A: Global Redux/Zustand Store
* *Pros*: Single central cache and unified mutation actions.
* *Cons*: High refactoring cost for a codebase heavily built around React Contexts; introduces a massive blast radius to existing features.

### Alternative B: Firestore Security Rules Enforcement
* *Pros*: Enforces data access control at the database API level.
* *Cons*: Cannot control client-side caching strategies, session duplication, or infinite loop listener issues.

---

## 4. Consequences

### Positive Consequences
* **Visual & Session Consistency**: Guarantees a single, unified data stream across all layout components, resolving visual divergence issues completely.
* **Reduced Database Overhead**: Prevents duplicate real-time subscriptions, lowering database query usage and operational costs.
* **Automated CI/CD Verification**: Lint rules (ESLint) and integrity tests (Vitest) catch illegal direct datastore reads and invalidation omissions before merging.

### Negative Consequences
* **Increased Boilerplate**: Developers must register new collections and context hooks rather than writing ad-hoc `collection()` fetches directly in their components.
* **Path Exclusions**: Certain files (like seeding or migration scripts) may require explicit annotations or exclusions in architectural tests.
