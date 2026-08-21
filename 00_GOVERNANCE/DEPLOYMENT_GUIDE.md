# 🌐 Web Deployment Guide: Sree Krushna Marriage OS

**Specification:** `SPEC-DEPLOY-WEB-001`  
**Purpose:** Instructions to deploy the interactive Marriage OS web portal so Sree, family, and coordinators can access it on any mobile phone or browser via a live link.

---

## 🚀 Option 1: GitHub Pages (Recommended — 100% Free & Zero Server Setup)

We have configured [`.github/workflows/deploy-pages.yml`](file:///d:/GitHub_Repo/Sree_Krushna/.github/workflows/deploy-pages.yml) to automatically publish the web portal on every push to `main`.

### Setup in 60 Seconds:
1. Push your repository commits to GitHub:
   ```bash
   git add .
   git commit -m "feat: deploy live Marriage OS console"
   git push origin main
   ```
2. On GitHub, navigate to your repository:
   - Go to **Settings** $\rightarrow$ **Pages** (in the left sidebar).
   - Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**.
3. **Your Live URL:**
   `https://<your-github-username>.github.io/Sree_Krushna/`

*Anyone with this link can open the dashboard on iPhone/Android, add/check off tasks (saved to local storage), and view the swimlanes!*

---

## 🏛️ Production Hosting (Active Canonical Target)

The canonical production instance is deployed on **Firebase Hosting** with custom security headers and PWA service worker caching:

- **Live URL:** [`https://sree-krushna-forever.web.app`](https://sree-krushna-forever.web.app)
- **Project ID:** `sree-krushna-forever`
- **Public Directory:** `public/`
- **Auth Gate:** Google Sign-In with email allow-list (`ALLOWED_USERS` in `allowed_users.js`)

### Standard Deploy Pipeline
```powershell
# 1. Sync root index.html to public/
Copy-Item index.html public/index.html -Force

# 2. Deploy to Firebase Hosting
firebase deploy --only hosting
```

---

## 📋 9-Domain Production Pre-Flight Checklist

Every production release must be verified against the 9-Domain Deployment Gate:

| Domain | Invariant | Verification Check |
|---|---|---|
| **1. Identity & Session** | Token persistence | Auto-hydrates user via `IndexedDB` on reload without re-prompting login. |
| **2. UI State & Navigation** | Active tab memory | `switchTab()` persists to `sessionStorage` and syncs `#tab-xxx` in URL hash. |
| **3. Perceived Performance** | Zero black flash | `#authLoadingSkeleton` renders instantly and fades out smoothly on auth resolve. |
| **4. Routing & Error Handling** | Branded 404 | Unknown URLs render custom `public/404.html` with return CTA to `/`. |
| **5. Offline & PWA Resilience** | Fresh cache rotation | `sw.js` cache version bumped (`sree-krushna-os-v1.1.0`) to evict stale shells. |
| **6. Security Hardening** | Enterprise headers | `X-Frame-Options: SAMEORIGIN`, `nosniff`, `strict-origin-when-cross-origin` active. |
| **7. Mobile Ergonomics** | Protocol 19 (`M-GATE-01`) | 300px/320px zero-overflow, minimum $\ge 44\text{px}$ touch targets. |
| **8. Data Integrity** | Monotonic task IDs | `generateNextTaskId()` derives `Math.max(...numericIds) + 1` to prevent reuse. |
| **9. Observability & RUM** | Core Web Vitals | Real User Monitoring script listening for `LCP`, `INP`, `CLS` metrics. |

---

## 📱 Mobile Experience Features
- **Zero Install:** Works directly in Safari, Chrome, Samsung Internet with PWA offline caching.
- **Offline Persistence:** Any tasks created or checked off in the `Task Manager` are stored locally on the user's phone via `localStorage`.
- **Touch-Optimized:** Tap any swimlane node or ritual card to open full liturgical specs, samagri requirements, and coordinator assignments.

