# 💌 Invitation Suite, Video Invites & Stationery Specification

**Specification Code:** `SPEC-BRAND-INV-001`  
**Domain Pillar:** `04_PROCUREMENT_VENDORS` & `03_PEOPLE_GUESTS`  
**WBS Scope:** `5.2 Invitation Card Printing & Digital Dispatch` & `5.6 Digital Guest Experience`  
**Version:** `1.0.0` (Production Baseline)  
**Parent SSOT:** [`ARCHITECTURE_SPEC.md`](file:///d:/GitHub_Repo/Sree_Krushna/ARCHITECTURE_SPEC.md) & [`monogram_and_identity.md`](file:///d:/GitHub_Repo/Sree_Krushna/04_PROCUREMENT_VENDORS/brand_and_stationery/monogram_and_identity.md)

---

## 1. The Luxury Physical Box Invitation Suite (`INV-BOX`)

The physical invitation represents the first tangible sacred artifact received by family and guests. It is housed in a handcrafted rigid book-style box with gold foil stamping and consecrated Odia offerings.

```
┌─────────────────────────────────────────────────────────────┐
│ 👑 SREE & KRUSHNA WEDDING INVITATION BOX (240 × 180 × 55mm) │
├─────────────────────────────────────────────────────────────┤
│  Top Lid: Crimson Velvet with Gold Foil 'SK' Monogram Crest │
│  Inside Cavity:                                             │
│   ├── Tray 1: Consecrated Ganesha & Jagannath Blessing Card │
│   ├── Tray 2: 5 Handcrafted Deckle-Edge Foil-Stamped Leaves │
│   │    ├── Leaf 1: Nirbandha & Ashirbad (EVT-001)           │
│   │    ├── Leaf 2: Mehendi & Sangeet Night (EVT-002)        │
│   │    ├── Leaf 3: Mangan Snana & Haldi (EVT-003)           │
│   │    ├── Leaf 4: Barat, Kanyadaan & Wedding (EVT-004)     │
│   │    └── Leaf 5: Grand Royal Reception (EVT-005)          │
│   └── Tray 3: Luxury Velvet Drawstring Pouch                │
│        ├── Whole Brass-Wrapped Betel Nuts (Puri Pana Gua)   │
│        ├── Consecrated Puri Nirmalya / Akshata Pouch        │
│        └── Sealed Box of Premium Odia Ghee Khaja (150g)     │
└─────────────────────────────────────────────────────────────┘
```

### Technical Print Specifications:
*   **Outer Box Material**: 1200 GSM Kappa Board wrapped in Deep Crimson European Silk Velvet.
*   **Insert Cards Paper Stock**: 450 GSM 100% Recycled Cotton Handmade Paper with natural raw deckle edges.
*   **Embossing & Foil**: 24K Matte Gold Hot Stamping (*Kurz Alufin*) with blind-embossed Kalinga arch borders.
*   **Enclosing Band (belly band)**: Translucent vellum paper band sealed with the custom antique gold wax seal stamp.
*   **Total Production Quantity**: 250 Luxury Box Sets + 150 Single-Envelope Classic Cards.

---

## 2. Animated Digital WhatsApp Video Invites (`INV-VID`)

To deliver personal, high-touch invitations to friends, colleagues, and outstation guests via WhatsApp and email, a 45-second cinematic motion graphics invitation video is produced.

```mermaid
timeline
    title 45-Second Cinematic Video Invite Storyboard
    00:00 - 00:08 : Sacred Invocation : Sloka 'Vakratunda Mahakaya' with temple bell chimes & Lord Jagannath visual
    00:08 - 00:18 : The Union : Flute melody begins; Sree & Krushna couple portrait dissolves with SK Monogram
    00:18 - 00:30 : Event Highlights : Animated calendar flip through Pre-Wedding, Wedding Muhurat & Grand Reception
    00:30 - 00:40 : Venue & Hospitality : 3D render of Mayfair Convention Hub with interactive location pin
    00:40 - 00:45 : Warm Welcome : "Seeking your blessings & presence" signed by Parents & Couple
```

### Video Production Technical Specs:
*   **Duration**: 45 Seconds (Optimized for WhatsApp Stories & direct messaging).
*   **Aspect Ratios Delivered**:
    1. **Vertical 9:16 (1080 × 1920 px)**: For WhatsApp Status, Instagram Stories, and mobile full-screen viewing.
    2. **Horizontal 16:9 (3840 × 2160 px - 4K UHD)**: For TV screens, web portal, and tablet display.
*   **Soundtrack & Audio Engineering**: Custom fusion track featuring live Odissi classical flute (*Bansuri*), traditional Shehnai notes, and subtle cello strings.
*   **File Size Optimization**: Compressed under 16 MB using H.264 / AAC for instant playback without buffer on cellular data.

---

## 3. Digital Web Invite & QR Event Pass (`INV-WEB`)

Every digital invitation link directs the recipient to a personalized private web landing page with:
1. **Interactive Timeline & Muhurat Countdown**: Live ticker counting down to 25th November 2026.
2. **One-Tap Google Maps Navigation**: Pre-configured directions to Mayfair Convention Hub (`VEN-001`).
3. **Smart RSVP Form**: Captures arrival dates, flight/train details, dietary requirements, and family headcount.
4. **Digital Event Pass (QR Code)**: Scanned at the venue hospitality desk for instant room key delivery and welcome hamper allocation.

---

## 4. Vendor SLA & Production Timeline

| Deliverable | Milestone Phase | Target Deadline | Vendor Lead | Verification Standard |
| :--- | :--- | :--- | :--- | :--- |
| **Monogram & Artwork Proofs** | Phase 2 (T-90 Days) | 2026-08-25 | Creative Designer | High-res vector PDF & font licenses signed off |
| **Video Storyboard & Audio Master** | Phase 2 (T-75 Days) | 2026-09-10 | Motion Graphics Studio | 4K sample render approved by Sree & Krushna |
| **Physical Card Sample Box** | Phase 2 (T-60 Days) | 2026-09-25 | Luxury Print Press | Physical sample inspected for foil crispness & deckle edges |
| **Mass Print & Box Assembly** | Phase 3 (T-45 Days) | 2026-10-10 | Print Press | 250 boxes packed with sealed *Pana Gua* & *Khaja* |
| **Digital Video & Web Launch** | Phase 3 (T-40 Days) | 2026-10-15 | Tech & Media Lead | Broadcast messaging test completed with 10 test guests |
| **Postal / Courier Handover** | Phase 3 (T-35 Days) | 2026-10-20 | PER-014 (Logistics) | Tracking numbers logged in `03_PEOPLE_GUESTS/` |
