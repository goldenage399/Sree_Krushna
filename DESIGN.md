---
name: Sree Krushna Marriage OS Dual-Theme Design System
description: Royal Indian Luxury & Modern Precision Wedding Control Plane (Obsidian Dark & Ivory Light)
colors:
  primary-base-dark: "#080b11"
  surface-dark: "#0f1624"
  surface-elevated-dark: "#162032"
  glass-dark: "rgba(18, 26, 42, 0.85)"
  text-main-dark: "#f8fafc"
  text-muted-dark: "#94a3b8"
  text-dim-dark: "#64748b"
  border-subtle-dark: "rgba(212, 168, 67, 0.22)"

  primary-base-light: "#fbf9f4"
  surface-light: "#ffffff"
  surface-elevated-light: "#f4efe4"
  glass-light: "rgba(255, 255, 255, 0.9)"
  text-main-light: "#1c1917"
  text-muted-light: "#57534e"
  text-dim-light: "#78716c"
  border-subtle-light: "rgba(198, 146, 20, 0.25)"

  gold-bright: "#ffd15c"
  gold-primary: "#f5c518"
  gold-antique: "#d4a843"
  gold-deep: "#996515"
  crimson-royal: "#e63946"
  crimson-deep: "#9d0208"
  crimson-bright: "#d00000"
  rose-silk: "#ff758f"
  magenta-vibrant: "#f72585"
  violet-royal: "#7209b7"
  marigold-yellow: "#ffb703"
  saffron-orange: "#fb8500"
  midnight-deep: "#03045e"
  sapphire-bright: "#0077b6"
  emerald-sacred: "#10b981"
  sapphire-royal: "#3b82f6"
  purple-royal: "#a855f7"
typography:
  display:
    fontFamily: "'Cinzel', serif"
    fontWeight: 700
    letterSpacing: "0.8px"
  serif:
    fontFamily: "'Playfair Display', serif"
    fontWeight: 600
  body:
    fontFamily: "'Outfit', -apple-system, sans-serif"
    fontWeight: 400
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.gold-primary}"
    textColor: "{colors.primary-base-dark}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
---

# Sree Krushna Dual-Theme Design System

## Overview
The Sree Krushna Marriage OS implements a complete, semantic dual-theme token architecture. Users can effortlessly switch between **Royal Obsidian (Dark Mode)** for nighttime command operations and **Ivory Temple Gold (Light Mode)** for daytime planning and physical printing.

---

## 🎨 Dual-Theme Token Hierarchy

| Semantic Token | Royal Obsidian (Dark Mode) | Ivory Temple Gold (Light Mode) | Purpose |
| :--- | :--- | :--- | :--- |
| `--bg-base` | `#080b11` (Obsidian) | `#fbf9f4` (Warm Ivory / Sandalwood) | Canvas foundation background. |
| `--bg-surface` | `#0f1624` (Deep Slate) | `#ffffff` (Pure White Silk) | Primary card and navigation surface. |
| `--bg-surface-elevated` | `#162032` (Elevated Slate) | `#f4efe4` (Linen Sand) | Inset cards, inputs, and chips. |
| `--bg-glass` | `rgba(18, 26, 42, 0.85)` | `rgba(255, 255, 255, 0.90)` | Sticky headers and frosted modals. |
| `--text-main` | `#f8fafc` (Near White) | `#1c1917` (Charcoal Obsidian) | Primary headings and body typography (AAA contrast). |
| `--text-muted` | `#94a3b8` (Muted Slate) | `#57534e` (Warm Stone) | Secondary descriptions and metadata. |
| `--text-dim` | `#64748b` (Dim Slate) | `#78716c` (Light Stone) | Subordinate labels and strike-through items. |
| `--border-subtle` | `rgba(212, 168, 67, 0.22)` | `rgba(198, 146, 20, 0.25)` | Card and separator gold hairlines. |
| `--border-focus` | `rgba(245, 197, 24, 0.6)` | `rgba(198, 146, 20, 0.7)` | Active input and card hover borders. |
| `--shadow-elevation-1` | `0 4px 12px rgba(0,0,0,0.3)` | `0 2px 8px rgba(100,70,20,0.06)` | Subtle element lift. |
| `--shadow-elevation-2` | `0 10px 25px -4px rgba(0,0,0,0.5)` | `0 8px 20px -4px rgba(100,70,20,0.1)` | Card elevation. |
| `--shadow-elevation-3` | `0 20px 40px -8px rgba(0,0,0,0.7)` | `0 16px 36px -8px rgba(100,70,20,0.16)` | Modal dialog lift. |

---

## 🏛️ Shared Accent Palettes
- **Imperial Temple Gold:** `--gold-bright: #ffd15c`, `--gold-primary: #f5c518`, `--gold-antique: #d4a843`, `--gold-deep: #996515`
- **Sacred Crimson:** `--crimson-royal: #e63946`, `--crimson-deep: #9d0208`, `--crimson-bright: #d00000`
- **Track Semantics:** `--rose-silk: #ff758f`, `--sapphire-royal: #3b82f6`, `--emerald-sacred: #10b981`, `--purple-royal: #a855f7`

---

## 🌓 Implementation Rules
1. **Never use hardcoded hex values in component styling.** Always declare `var(--bg-surface)`, `var(--text-main)`, `var(--border-subtle)`.
2. **Persistence:** Theme state is stored in `localStorage.getItem('sree_krushna_theme')` with instant hydration before DOM rendering to prevent flashing.
3. **Contrast Compliance:** Both themes strictly satisfy WCAG AA/AAA contrast ratios against their respective backgrounds.

---

## 👑 UI/UX Component Specifications

### 1. Royal Auth Loading Skeleton Engine
To eliminate the 200–800ms "black flash" while Google Identity resolves, the application implements a dedicated pre-auth skeleton:
- **Element:** `#authLoadingSkeleton` (`.auth-skeleton-overlay`)
- **Visuals:** Obsidian radial background, pulsing crown emblem (`👑`) with dynamic gold drop-shadow filter, Cinzel gold gradient typography, and an animated shimmering gold progress track.
- **Dismissal:** Automatically faded out with a smooth `0.28s ease-out` opacity transition on `onAuthStateChanged` callback.

### 2. State & Deep-Link Navigation Engine
- **Session Storage:** Active tab is persisted in `sessionStorage.getItem('sree_krushna_active_tab')`.
- **URL Hash Synchronization:** The active tab is synchronized with the browser address bar (`#tab-vision`, `#tab-rituals`, `#tab-procurement`), allowing direct sharing of specific tabs over WhatsApp and seamless Back/Forward browser navigation.
- **Hydration Priority:** `window.location.hash` $\rightarrow$ `sessionStorage` $\rightarrow$ Default (`tab-dashboard`).

### 3. Branded Error & 404 Design System (`public/404.html`)
- **Layout:** Centered luxury card with obsidian surface (`#0f1624`), gold perimeter border, floating crown emblem, and Cinzel heading.
- **Recovery CTA:** Prominent gradient gold button (`← Return to Command Center`) linking directly to root `/`.

### 4. Mobile Ergonomics & Protocol 19 (`M-GATE-01`)
- **Viewport Limit:** Strict validation down to **300px/320px** with zero horizontal overflow (`overflow-x: hidden`).
- **Touch Targets:** All interactive elements (buttons, checkboxes, tab pills, delete buttons) guarantee minimum $\ge 44 \times 44\text{px}$ hit areas.
- **Safe Area Insets:** Header and modal overlays adapt to device notches using `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`.
- **Responsive Table Containment:** All tabular data wrapped in `.table-responsive-wrapper` with touch momentum scrolling.

### 5. PWA & Service Worker Cache Lifecycle
- **Cache Strategy:** Stale-While-Revalidate for app shell assets (`/`, `/index.html`, `/manifest.json`, `/js/config.js`, `/js/auth.js`).
- **Cache Invalidation:** Versioned cache names (`sree-krushna-os-v1.1.0`) with automatic pruning of legacy cache buckets during the `activate` event.

