---
description: How to create a new feature module following Task Dashboard patterns
---

# New Module Creation Workflow

> **Purpose**: Ensures all new features follow the established patterns from day one.

## Prerequisites Checklist

- [ ] Review existing similar features (e.g., TeamTasksPage, MyTasksPage)
- [ ] Understand the authentication/permission model
- [ ] Identify required Firebase collections

---

## Step 1: Create Component Structure

```powershell
# Create component directory (if needed)
New-Item -ItemType Directory -Path "src/components/NewFeature" -Force
```

Create these files:

- [ ] `NewFeaturePage.jsx` - Main page component
- [ ] `NewFeatureCard.jsx` - Card/list item component (if applicable)
- [ ] `NewFeatureModal.jsx` - Modal for create/edit (if applicable)

---

## Step 2: Create Service (if new Firebase operations)

```powershell
# If this feature requires new Firebase operations
# Create in src/services/
```

Create:

- [ ] `src/services/newFeatureService.js` - Firebase CRUD operations

> **ARCH-INV-002**: After creating the service file, run `npm run sg:inv002` to confirm it does not import other services directly. All inter-service dependencies must go through `ServiceRegistry.get()`.

Template:

```javascript
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const COLLECTION_NAME = "newFeature";

export const newFeatureService = {
  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async create(data) {
    return await addDoc(collection(db, COLLECTION_NAME), data);
  },

  async update(id, data) {
    await updateDoc(doc(db, COLLECTION_NAME, id), data);
  },

  async delete(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  },
};
```

---

## Step 3: Create Custom Hook (if complex state)

- [ ] `src/hooks/useNewFeature.js` - State management hook

Template:

```javascript
import { useState, useEffect } from "react";
import { newFeatureService } from "../services/newFeatureService";

export function useNewFeature() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const result = await newFeatureService.getAll();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, refresh: loadData };
}
```

---

## Step 4: Add Route

Update `src/App.jsx`:

- [ ] Import the new page component
- [ ] Add route in the router configuration

---

## Step 5: Create Documentation

- [ ] `docs/enhancements/ENH-XXX-feature-name.md` - Enhancement spec

---

## Validation Checklist (Before PR)

- [ ] Component follows existing patterns (check TeamTasksPage for reference)
- [ ] Uses `useAuth()` for authentication if needed
- [ ] Loading states handled
- [ ] Error states handled
- [ ] No console errors
- [ ] Works with sample data
- [ ] Mobile responsive (if UI component)
- [ ] `npm run sg:inv002` passes (if new service created)
- [ ] `npm run sg:inv003` passes (if Firestore subscriptions added)

---

## Anti-Patterns to Avoid

❌ Inline Firebase calls in components (use services)
❌ Direct state mutation (use useState properly)
❌ Missing loading/error states
❌ Hardcoded user IDs or roles
❌ Missing permission checks for admin features
❌ `query()` / `where()` / `orderBy()` inside `useEffect` without `useMemo` — causes infinite subscription loops (ARCH-INV-003, QMP-001)
❌ Service files importing other service files directly — use `ServiceRegistry.get()` (ARCH-INV-002)

---

## Integration with AOS

1. Before starting: Follow Phase A (read GEMINI.md, relevant docs)
2. After completing: Run PIRR to update documentation

---

_Ported from Task-Dashboard: 2025-12-30_
