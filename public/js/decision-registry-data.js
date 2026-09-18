/**
 * Sree Krushna Marriage OS — Unified Pending Decision Registry & Idea Incubator Data
 * Standard: P-DECISION-REG-001 / P-VISUAL-CAROUSEL-001 / P-COMPARE-SHARE-001 / P-EVENT-STEPPER-001
 * Ruling: AC-DEC-2026-017 / UI-DEC-2026-013
 * 
 * Aggregates all pending decisions, vendor deliverables, canonical visual plates,
 * and clustered decision pods into a single canonical data structure.
 */

window.DECISION_REGISTRY_DATA = {
  meta: {
    title: "Sree Krushna Marriage OS — Unified Decision & Ideation Registry",
    version: "2.1.0",
    updated_at: "2026-09-15T08:35:00+05:30",
    governance_ref: "AC-DEC-2026-017",
    standard: "P-DECISION-REG-001 / P-VISUAL-CAROUSEL-001 / P-COMPARE-SHARE-001"
  },
  summary: {
    totalItems: 38,
    pendingChoices: 9,
    vendorDeliverables: 4,
    incubatingIdeas: 14,
    governancePolicies: 1,
    certifiedLocked: 10,
    totalPlates: 12,
    totalClusters: 3
  },
  events: [
  {
    "id": "all",
    "label": "All Events",
    "icon": "🌟",
    "count": 12
  },
  {
    "id": "haldi",
    "label": "Day 1 Haldi & Arrival",
    "icon": "☀️",
    "count": 2,
    "phase": 1,
    "timing": "Day 1 Morning (09:00 - 13:00)"
  },
  {
    "id": "mehendi",
    "label": "Day 1 Mehendi",
    "icon": "🌿",
    "count": 2,
    "phase": 2,
    "timing": "Day 1 Afternoon (14:30 - 17:00)"
  },
  {
    "id": "sangeet",
    "label": "Day 1 Sangeet & Party",
    "icon": "🌙",
    "count": 3,
    "phase": 3,
    "timing": "Day 1 Night (19:00 - 23:30)"
  },
  {
    "id": "wedding",
    "label": "Day 2 Vedic Vivaha",
    "icon": "🪔",
    "count": 6,
    "phase": 4,
    "timing": "Day 2 Daytime Vivaha (09:30 - 16:30, Hastaganthi 12:00 Noon)"
  },
  {
    "id": "infrastructure",
    "label": "Venue Infrastructure",
    "icon": "🏗️",
    "count": 3,
    "phase": 5,
    "timing": "Whole-Venue Backbone & Shell"
  }
],
  clusters: [
  {
    "id": "mandap",
    "clusterId": "CLUSTER-MANDAP",
    "title": "Vedic Vivaha Mandap Architecture",
    "event": "wedding",
    "eventLabel": "🪔 Day 2 Vedic Vivaha",
    "zone": "Zone A — Sacred Sanctuary",
    "decisionId": "DEC-14",
    "description": "Selection of the central Vedic wedding altar and liturgical sanctum. Three distinct design philosophies.",
    "whatsappTemplate": "🌺 *Sree Krushna Marriage OS — Mandap Design Review*\nHelp us choose our Vedic Wedding Mandap! Please review the 3 shortlisted options:\n• *Option A:* Vedic Lotus Mandap & Elevated Altar (PLATE-01)\n• *Option B:* Royal Carved Telugu Vedic Mandap (PLATE-10)\n• *Option C:* Suspended Floral Lotus Canopy Dome (PLATE-11)\n👉 Compare & vote on your phone: {url}",
    "options": [
      {
        "plateId": "PLATE-01",
        "optionId": "A",
        "label": "Option A: Vedic Lotus Mandap",
        "highlight": "Sacred lotus floral canopy with brass samai lamps & 24ft timber stage"
      },
      {
        "plateId": "PLATE-10",
        "optionId": "B",
        "label": "Option B: Royal Carved Telugu Mandap",
        "highlight": "Traditional carved temple pillars with peach silk & gold jali backdrop"
      },
      {
        "plateId": "PLATE-11",
        "optionId": "C",
        "label": "Option C: Suspended Lotus Dome",
        "highlight": "Ceiling-hung inverted fresh carnation lotus with circular mandala wall"
      }
    ]
  },
  {
    "id": "stage",
    "clusterId": "CLUSTER-STAGE",
    "title": "Sangeet Concert & Performance Stage",
    "event": "sangeet",
    "eventLabel": "🌙 Day 1 Sangeet",
    "zone": "Zone A — Performance Stage",
    "decisionId": "DEC-12",
    "description": "Production stage design for Sangeet dance performances and evening celebration.",
    "whatsappTemplate": "✨ *Sree Krushna Marriage OS — Sangeet Stage Review*\nHelp us select our Sangeet stage design! Review the 2 shortlisted options:\n• *Option A:* Concert Production Stage & P3 LED Wall (PLATE-03)\n• *Option B:* Midnight Blooms Reflective Mirror Stage (PLATE-12)\n👉 Compare & vote on your phone: {url}",
    "options": [
      {
        "plateId": "PLATE-03",
        "optionId": "A",
        "label": "Option A: Concert Stage & LED Wall",
        "highlight": "36ft elevated performance deck with 24x12ft LED wall & box truss cinema spots"
      },
      {
        "plateId": "PLATE-12",
        "optionId": "B",
        "label": "Option B: Midnight Blooms Mirror Stage",
        "highlight": "40ft high-gloss black reflective runway, crystal chandeliers & wisteria arch"
      }
    ]
  },
  {
    "id": "entry",
    "clusterId": "CLUSTER-ENTRY",
    "title": "Grand Couple Entry Atmospheric Production",
    "event": "sangeet",
    "eventLabel": "🌙 Day 1 Sangeet & Vivaha Aisle",
    "zone": "Zone B — Arrival & Processional Aisle",
    "decisionId": "DEC-21",
    "description": "Special atmospheric and visual effects for couple grand entrances at Sangeet and Daytime Varmala.",
    "whatsappTemplate": "✨ *Sree Krushna Marriage OS — Grand Entry Effects Review*\nHelp us choose our wedding entry special effects! Please review the options:\n• *Option A:* Low-Lying Dry-Ice Cloud Fog + Shimmering Bubbles\n• *Option B:* Pyrotechnic Cold Spark Fountains (Gerb Units)\n• *Option C:* Mechanical Fresh Rose Petal Cannons & Floral Shower\n👉 Compare & vote on your phone: {url}",
    "options": [
      {
        "plateId": "PLATE-05",
        "optionId": "A",
        "label": "Option A: Dry-Ice Cloud Fog & Bubbles",
        "highlight": "Safe indoor/marquee cloud fog with zero smoke alarm triggers or chemical residue (PROP-05)"
      },
      {
        "plateId": "PLATE-09",
        "optionId": "B",
        "label": "Option B: Cold Spark Pyrotechnics",
        "highlight": "Theatrical concert-style spark fountains along the aisle for high-energy walk-in (PROP-03)"
      },
      {
        "plateId": "PLATE-01",
        "optionId": "C",
        "label": "Option C: Fresh Rose Petal Cannons",
        "highlight": "Traditional sacred floral rain shower cascading over the couple at stage reveal (PROP-04)"
      }
    ]
  }
],
  plates: [
  {
    "id": "PLATE-01",
    "index": 0,
    "title": "Vedic Lotus Mandap & Elevated Altar",
    "category": "mandap",
    "categoryLabel": "Mandap & Rituals",
    "events": [
      "wedding"
    ],
    "eventLabel": "🪔 Day 2 Vedic Vivaha",
    "zone": "Zone A — Sacred Sanctuary",
    "spec": "SPEC-PROC-DECOR-MARQUEE-001 §3.1",
    "clause": "CTR-DECOR-RIDER-001 Cl 1 & 2",
    "photoSrc": "./assets/decor/mandap/photo-mandap-inspiration.jpg",
    "blueprintSrc": "./assets/decor/mandap/plate-01-vedic-lotus-mandap.svg",
    "mandatory": true,
    "dimensions": "24'-0\" (7.32m) Clear Width • 18\" Riser",
    "status": "locked",
    "statusBadge": "LOCKED SPEC",
    "linkedDecisions": [
      "DEC-14",
      "DEC-20",
      "DEC-08"
    ],
    "clusterId": "mandap",
    "clusterOption": "A",
    "notes": "Treated timber stage, carved wooden/brass pillars, 2mm galvanized zinc subfloor barrier under havan altar, brass samai lamps, cascading marigold & jasmine garlands.",
    "prompt": "A breathtaking luxury Indian Vedic wedding mandap setup inside a grand hall or marquee. An elevated 18-inch wooden platform featuring a sacred lotus-shaped floral canopy dome decorated with thousands of cascading marigold and fragrant white jasmine garlands. Four intricately hand-carved traditional wooden and brass pillars frame the altar. Polished brass samai oil lamps and brass urlis filled with floating red rose petals and floating candles surround the perimeter. In the center is a sacred square havan fire altar with a polished copper kund. Atmospheric warm golden amber lighting, photorealistic, 8k resolution, elegant Indian royal aesthetic."
  },
  {
    "id": "PLATE-02",
    "index": 1,
    "title": "Havan Smoke Extraction Canopy & Ducting",
    "category": "mandap",
    "categoryLabel": "Mandap & Rituals",
    "events": [
      "wedding"
    ],
    "eventLabel": "🪔 Day 2 Vedic Vivaha",
    "zone": "Zone A — Fire & Thermodynamic Isolation",
    "spec": "SPEC-PROC-DECOR-MARQUEE-001 §3.2",
    "clause": "CTR-DECOR-RIDER-001 Cl 5",
    "photoSrc": "./assets/decor/mandap/photo-havan-fire-ritual.jpg",
    "blueprintSrc": "./assets/decor/mandap/plate-02-havan-smoke-canopy.svg",
    "mandatory": true,
    "dimensions": "1200 CFM • 150mm Flexible Duct • 6'6\" Elevation",
    "status": "locked",
    "statusBadge": "LOCKED SPEC",
    "linkedDecisions": [
      "DEC-14"
    ],
    "clusterId": null,
    "clusterOption": null,
    "notes": "Transparent flame-retardant polycarbonate / spun brass cowl, negative-pressure inline centrifugal exhaust blower, sealed outdoor discharge sleeve through gable wall. Zero smoke dispersion into 40T AC sanctuary.",
    "prompt": "A close-up architectural and liturgical interior photo of a sacred Hindu Vedic Havan ritual inside an upscale wedding mandap. A polished stepped copper Havan Kund with sacred Vedic fire burning cleanly. Directly suspended above the fire altar at 6.5 feet elevation is an elegant, polished brass and clear heat-resistant glass smoke extraction hood and ducting system designed seamlessly to evacuate smoke without dispersing into the air-conditioned hall. Surrounding the altar are brass puja thalis with ghee, coconuts, flowers, and mango leaves, set upon an ornate ceremonial carpet. Photorealistic, warm golden fire glow, architectural photography, 8k resolution."
  },
  {
    "id": "PLATE-03",
    "index": 2,
    "title": "Sangeet Production Stage & Cinema Lighting",
    "category": "sangeet",
    "categoryLabel": "Sangeet Stage",
    "events": [
      "sangeet"
    ],
    "eventLabel": "🌙 Day 1 Sangeet",
    "zone": "Zone A — Performance Stage",
    "spec": "SPEC-PROC-DECOR-MARQUEE-001 §3.3",
    "clause": "CTR-DECOR-RIDER-001 Cl 3",
    "photoSrc": "./assets/decor/sangeet/photo-sangeet-stage-lighting.jpg",
    "blueprintSrc": "./assets/decor/sangeet/plate-03-sangeet-stage-lighting.svg",
    "mandatory": true,
    "dimensions": "36'-0\" × 16'-0\" Stage (3ft Riser) • 24ft × 12ft P3 LED Wall",
    "status": "locked",
    "statusBadge": "LOCKED SPEC",
    "linkedDecisions": [
      "DEC-11",
      "PROP-02",
      "PROP-05"
    ],
    "clusterId": "stage",
    "clusterOption": "A",
    "notes": "Aluminum box truss rigging, CRI > 95 calibrated 3200K cinema fixtures, zero 120fps video banding on Sony FX3 cameras, blackout acoustic velour masking drapes, sub-stage dual 18\" bass enclosures.",
    "prompt": "A magnificent Indian wedding Sangeet concert production stage inside a luxury marquee event venue. A wide 36-foot wide elevated performance stage with glossy dark reflective dance floor. Backdrop features a massive ultra-high-definition LED video wall showcasing vibrant golden royal motifs. Overhead aluminum box truss rigging with concert-grade moving head spotlights, warm 3200K cinema profile keylights, and subtle haze beams in violet, magenta, and warm gold. Front stage dressed with floral hedges and soft uplighting. Luxurious Bollywood wedding concert aesthetic, photorealistic, 8k."
  },
  {
    "id": "PLATE-04",
    "index": 3,
    "title": "Modular Aluminum Marquee & Dual-Zone HVAC",
    "category": "marquee",
    "categoryLabel": "Marquee Shell & HVAC",
    "events": [
      "infrastructure"
    ],
    "eventLabel": "🏗️ Whole Venue Infrastructure",
    "zone": "Whole Venue — Infrastructure & Shell",
    "spec": "SPEC-OPS-VENUE-GROUND-001 / SPEC-PROC-DECOR-MARQUEE-001 §2",
    "clause": "CTR-DECOR-RIDER-001 Cl 1 & 4",
    "photoSrc": "./assets/decor/marquee/photo-luxury-marquee-chandeliers.jpg",
    "blueprintSrc": "./assets/decor/marquee/plate-04-modular-marquee-hvac.svg",
    "mandatory": true,
    "dimensions": "120ft × 80ft (9,600 sq. ft.) • 14ft Eaves / 24ft Apex",
    "status": "locked",
    "statusBadge": "LOCKED SPEC",
    "linkedDecisions": [
      "DEC-03",
      "DEC-06",
      "DEC-07",
      "DEC-10",
      "DEC-19"
    ],
    "clusterId": null,
    "clusterOption": null,
    "notes": "German clear-span hangar profile, 850 g/m² blockout PVC, pleated ivory satin ceiling drapes, acoustic partition dividing 40T AC sanctuary (24°C) from desert-cooled dining zone C.",
    "prompt": "Interior wide-angle architectural photograph of a grand, luxury German aluminum clear-span marquee wedding hall (120ft by 80ft). The ceiling is completely draped in elegant pleated ivory and champagne satin drapes with multiple grand crystal chandeliers suspended from the ridge line. Along the sides, subtle concealed air conditioning ducts deliver climate control. The floor is lined with plush carpeting and round guest banquet tables with floral centerpieces and Chiavari chairs. Ambient warm architectural up-lighting washing the fabric sidewalls. Ultra-luxury wedding pavilion interior, photorealistic, 8k."
  },
  {
    "id": "PLATE-05",
    "index": 4,
    "title": "50m Weatherproof Grand Arrival Canopy Corridor",
    "category": "tunnel",
    "categoryLabel": "50m Arrival Tunnel",
    "events": [
      "haldi",
      "wedding",
      "infrastructure"
    ],
    "eventLabel": "☀️ Day 1 Haldi & Vivaha Arrival",
    "zone": "Zone E — Arrival & Transit",
    "spec": "SPEC-OPS-VENUE-GROUND-001 §2.1",
    "clause": "CTR-DECOR-RIDER-001 Cl 7",
    "photoSrc": "./assets/decor/tunnel/photo-fairy-light-tunnel-walkway.jpg",
    "blueprintSrc": "./assets/decor/tunnel/plate-05-grand-arrival-tunnel.svg",
    "mandatory": true,
    "dimensions": "50m Length • 10ft Clear Width • 10ft Arched Clearance",
    "status": "locked",
    "statusBadge": "LOCKED SPEC",
    "linkedDecisions": [
      "DEC-02",
      "DEC-04"
    ],
    "clusterId": null,
    "clusterOption": null,
    "notes": "Direct covered tunnel bridging hotel side porch to marquee foyer, rainproof high-density tarpaulin, 8ft wide needle-felt crimson runner carpet, fairy-light curtain draping, dedicated electric golf-cart shuttle for elders (PER-012).",
    "prompt": "Architectural evening photograph of a grand 50-meter covered wedding arrival walkway and tunnel. The arched pathway has a rich crimson red carpet runner, arched metal framework covered with warm golden fairy light tunnels, cascading jasmine floral strings, and weather-proof waterproof canopy lining above. Polished brass lanterns on wooden pedestals line both sides of the corridor. In the distance, the entrance to an illuminated luxury wedding pavilion glows. Cinematic perspective down the center of the illuminated tunnel, photorealistic, 8k."
  },
  {
    "id": "PLATE-06",
    "index": 5,
    "title": "Mehendi Zone D Garden Promenade & Lounge",
    "category": "mehendi",
    "categoryLabel": "Mehendi Lawn",
    "events": [
      "mehendi"
    ],
    "eventLabel": "🌿 Day 1 Mehendi",
    "zone": "Zone D — Lawn Promenade",
    "spec": "EVT-002 Phase 2 / AC-DEC-2026-007",
    "clause": "Operational Protocol Cl 8",
    "photoSrc": "./assets/decor/mehendi/photo-mehendi-garden-lounge.jpg",
    "blueprintSrc": "./assets/decor/mehendi/plate-06-mehendi-garden-promenade.svg",
    "mandatory": false,
    "dimensions": "Open-Air Lawn Promenade • 8 Parasol Nodes",
    "status": "locked",
    "statusBadge": "LOCKED SPEC",
    "linkedDecisions": [
      "DEC-13"
    ],
    "clusterId": null,
    "clusterOption": null,
    "notes": "Phase 2 festive garden promenade (14:30–17:00), Rajasthani embroidered parasols, low charpai diwan seating with silk bolsters, center brass urli with floating marigolds, freeing Zone A for 7.5h uninterrupted Sangeet tech rigging.",
    "prompt": "An outdoor afternoon Indian wedding Mehendi ceremony setup on an emerald green lawn garden. Vibrant colorful decor featuring handcrafted Rajasthani embroidered parasols with mirror-work in yellow, hot pink, and teal. Low wooden charpai diwan seating with plush silk bolsters and vibrant printed cushions. In the center is a large antique brass urli vessel filled with water and floating yellow marigolds and orange rose petals. Elegant garden party atmosphere with fairy lights in the surrounding trees and floral hangings. Photorealistic, bright natural daylight, 8k."
  },
  {
    "id": "PLATE-07",
    "index": 6,
    "title": "20×8ft Rectangular Central Island & Dual Main Buffet",
    "category": "catering",
    "categoryLabel": "Catering & Stalls",
    "events": [
      "infrastructure"
    ],
    "eventLabel": "🏗️ Whole Venue Infrastructure",
    "zone": "Zone C & Rear BOH — Food Operations",
    "spec": "SPEC-OPS-VENUE-GROUND-001 §2.4",
    "clause": "CTR-DECOR-RIDER-001 Cl 6",
    "photoSrc": "./assets/decor/marquee/hybrid-rectangular-island-inner-view.jpg",
    "blueprintSrc": "./assets/decor/marquee/blueprint-open-ground-100x160.jpg",
    "mandatory": true,
    "dimensions": "20×8ft Central Island • 70ft Dual Main Baseline • 15ft Clear Aisles",
    "status": "locked",
    "statusBadge": "LOCKED SPEC",
    "linkedDecisions": [
      "DEC-05",
      "DEC-15"
    ],
    "clusterId": null,
    "clusterOption": null,
    "notes": "Freestanding 20×8ft rectangular central island providing 360° multi-sided servicing of salads, chaats, artisanal breads, and dual-tier plate stacks with 15ft perimeter aisles; 70ft dual main-course buffet backed by enclosed exterior BOH kitchen (DWG A103 / AC-DEC-2026-030).",
    "prompt": "An eye-level interior architectural 3D perspective rendering of a luxury 100x160 ft Indian wedding marquee pavilion featuring a grand 20x8 ft rectangular central island with warm under-counter lighting, neatly arranged gourmet salads, artisanal bread baskets, cold raitas, live artisanal chaat bowls, and elegant stacks of plates accessible from all four sides, with an inward-facing 70ft dual main buffet behind."
  },
  {
    "id": "PLATE-08",
    "index": 7,
    "title": "Interactive Wedding Engagement & Activity Stalls",
    "category": "catering",
    "categoryLabel": "Catering & Stalls",
    "events": [
      "haldi",
      "mehendi"
    ],
    "eventLabel": "☀️ Day 1 Haldi & Mehendi",
    "zone": "Zone D & Foyer — Guest Engagement",
    "spec": "SPEC-PROC-DECOR-MARQUEE-001 §3.4",
    "clause": "Operational Scope Cl 9",
    "photoSrc": "./assets/decor/stalls_catering/photo-bangle-craft-stall.jpg",
    "blueprintSrc": "./assets/decor/stalls_catering/plate-08-interactive-activity-booths.svg",
    "mandatory": false,
    "dimensions": "3 Modular Wooden Pergolas (8ft × 8ft each)",
    "status": "pending",
    "statusBadge": "PENDING HOST VOTE",
    "linkedDecisions": [
      "DEC-15",
      "PROP-07"
    ],
    "clusterId": null,
    "clusterOption": null,
    "notes": "Lac bangle maker artisan with custom sizing, instant polaroid photo booth with floral arch and event hashtag, welcome concierge desk with brass ceremonial gong and laminated run-sheet scrolls.",
    "prompt": "An authentic traditional Indian wedding live interactive guest activity stall. A charming rustic wooden canopy pergola booth decorated with hanging marigold flowers, clay bells, and brass lanterns. In the stall, a skilled traditional Indian lac artisan craftsman is shaping handcrafted colorful lac and glass bangles over a small gentle coal burner for female wedding guests. Rows of gleaming glittering traditional bangles in red, green, and gold are neatly displayed on wooden dowels and velvet trays. Beside the stall is a vintage instant polaroid guestbook station with wooden easel. Warm evening fairy-lit ambiance, photorealistic, 8k."
  },
  {
    "id": "PLATE-09",
    "index": 8,
    "title": "Starlit Aisle Canopy & Illuminated Floral Walkway",
    "category": "tunnel",
    "categoryLabel": "Arrival & Walkway",
    "events": [
      "sangeet",
      "wedding"
    ],
    "eventLabel": "🌙 Day 1 Sangeet & Vivaha Aisle",
    "zone": "Zone B — Arrival & Processional Aisle",
    "spec": "SPEC-PROC-DECOR-MARQUEE-001 §3.5",
    "clause": "CTR-DECOR-RIDER-001 Cl 4",
    "photoSrc": "./assets/decor/tunnel/photo-wedding-trail-fairylight-canopy.jpg",
    "blueprintSrc": null,
    "mandatory": true,
    "dimensions": "60'-0\" Length × 10'-0\" Clear Walkway",
    "status": "evaluating",
    "statusBadge": "INCUBATING PROPOSAL",
    "linkedDecisions": [
      "PROP-01",
      "PROP-03"
    ],
    "clusterId": null,
    "clusterOption": null,
    "notes": "Undulating warm off-white (2800K) fairy-light canopy draped across marquee trusses, plush ivory runner carpet, perimeter pastel floral hedges with integrated warm pillar candles, floral arch reveal.",
    "prompt": "An enchanting luxury wedding entry walkway under a grand marquee ceiling. Overhead dense undulating canopy of thousands of warm golden fairy rice lights creating a starry tunnel. Down the center is a pristine ivory carpet runner bordered by lush floral hedges of pale blush roses and hydrangeas. Glass hurricane lanterns with warm flickering candles line the path leading to a magnificent floral arch. Photorealistic, 8k."
  },
  {
    "id": "PLATE-10",
    "index": 9,
    "title": "Royal Carved Telugu Vedic Mandap & Sanctum",
    "category": "mandap",
    "categoryLabel": "Mandap & Rituals",
    "events": [
      "wedding"
    ],
    "eventLabel": "🪔 Day 2 Vedic Vivaha (Alt)",
    "zone": "Zone A — Sacred Sanctuary",
    "spec": "SPEC-PROC-DECOR-MARQUEE-001 §3.1",
    "clause": "CTR-DECOR-RIDER-001 Cl 1 & 2",
    "photoSrc": "./assets/decor/mandap/photo-royal-telugu-vedic-mandap-carved.jpg",
    "blueprintSrc": null,
    "mandatory": true,
    "dimensions": "28'-0\" × 20'-0\" Stage (18\" Riser) • 4 Carved Temple Pillars",
    "status": "shortlisted",
    "statusBadge": "SHORTLISTED OPTION",
    "linkedDecisions": [
      "DEC-14",
      "DEC-20"
    ],
    "clusterId": "mandap",
    "clusterOption": "B",
    "notes": "Traditional hand-carved pillars, peach silk drapery, carved gold jali backdrop with warm backlighting, stepped brass samai lamps, brass urlis, authentic South Indian Telugu Vedic ritual setup.",
    "prompt": "A majestic royal Telugu wedding mandap setup. Four intricately carved ivory and gold stone-style pillars support an ornate floral canopy with hanging pearl and flower tassels. Elegant peach silk drapery frames the altar. In the backdrop, a luminous gold filigree carved jali panel glows with amber light. On the stage are stepped brass samai oil lamps, puja offerings, and two ornate royal chairs. Photorealistic, 8k."
  },
  {
    "id": "PLATE-11",
    "index": 10,
    "title": "Suspended Floral Lotus Canopy Dome Altar",
    "category": "mandap",
    "categoryLabel": "Mandap & Rituals",
    "events": [
      "wedding"
    ],
    "eventLabel": "🪔 Day 2 Vedic Vivaha (Alt)",
    "zone": "Zone A — Center Stage Altar",
    "spec": "SPEC-PROC-DECOR-MARQUEE-001 §3.1",
    "clause": "CTR-DECOR-RIDER-001 Cl 2",
    "photoSrc": "./assets/decor/mandap/photo-suspended-lotus-mandap-dome.jpg",
    "blueprintSrc": null,
    "mandatory": false,
    "dimensions": "12'-0\" Diameter Suspended Lotus Dome • Circular Mandala Backdrop",
    "status": "shortlisted",
    "statusBadge": "SHORTLISTED OPTION",
    "linkedDecisions": [
      "DEC-14",
      "PROP-04"
    ],
    "clusterId": "mandap",
    "clusterOption": "C",
    "notes": "Ceiling-hung three-dimensional inverted lotus flower crafted from dense carnations and baby's breath, dual floral circular mandalas, dual royal ivory throne chairs.",
    "prompt": "A dramatic luxury Indian wedding mandap with a giant suspended blooming lotus flower ceiling installation made of pink and white fresh floral petals. Beneath the lotus dome is a grand floral arch and layered concentric circular flower wall mandala backdrop. Two royal white throne chairs sit on an elevated stage. Photorealistic, 8k."
  },
  {
    "id": "PLATE-12",
    "index": 11,
    "title": "Midnight Blooms Reflective Mirror Stage & Chandeliers",
    "category": "sangeet",
    "categoryLabel": "Sangeet & Reception Stage",
    "events": [
      "sangeet"
    ],
    "eventLabel": "🌙 Day 1 Sangeet (Alt Stage)",
    "zone": "Zone A — Evening Garden Stage",
    "spec": "SPEC-PROC-DECOR-MARQUEE-001 §3.3",
    "clause": "CTR-DECOR-RIDER-001 Cl 3",
    "photoSrc": "./assets/decor/sangeet/photo-midnight-blooms-mirror-stage.jpg",
    "blueprintSrc": null,
    "mandatory": false,
    "dimensions": "32'-0\" Stage • 40ft Reflective Black Acrylic Walkway",
    "status": "shortlisted",
    "statusBadge": "SHORTLISTED OPTION",
    "linkedDecisions": [
      "DEC-12"
    ],
    "clusterId": "stage",
    "clusterOption": "B",
    "notes": "High-gloss black reflective mirror runway, overhead fairy light canopy with crystal chandeliers, cascading white wisteria floral arch, tufted French royal lounge seating.",
    "prompt": "An opulent night-time garden wedding stage. A glossy black mirror aisle runway reflecting sparkling overhead fairy lights. Suspended luxury crystal chandeliers glitter under the dark sky. A massive white wisteria floral arch frames the center stage, flanked by elegant white tufted chesterfield couches and tall urn floral arrangements. Photorealistic, 8k."
  }
],
  items: [
  {
    "id": "DEC-08",
    "category": "decor_pending",
    "categoryLabel": "Decor: Host Decision",
    "domainIcon": "🎨",
    "title": "Master Color Palette & Metallic Standard",
    "phase": "Phase II: Thematic & Visual Language",
    "zone": "Whole Venue",
    "status": "pending",
    "statusLabel": "PENDING HOST DECISION",
    "dilemma": "Restricting primary, secondary, and accent colors to prevent visual dissonance across four distinct functions.",
    "benchmark": "Devika Narain: Maximum 3 primary colors per zone with a single unified metallic tone (either matte brass or antique gold, never mixed).",
    "direction": "Evaluate 3 palettes: Classic Vedic Gold, Royal Pichwai Pink, or Modern Ivory Champagne.",
    "options": [
      {
        "id": "A",
        "text": "Classic Vedic: Deep Maroon, Rich Mustard & Antique Brass",
        "selected": false
      },
      {
        "id": "B",
        "text": "Royal Pichwai: Dusty Rose, Lotus Pink, Ivory & Matte Gold",
        "selected": true
      },
      {
        "id": "C",
        "text": "Modern Ivory: Champagne Gold, Warm White & Fresh Green Accents",
        "selected": false
      }
    ],
    "actionType": "host_vote",
    "plateRef": "PLATE-01",
    "plateTitle": "Vedic Lotus Mandap & Elevated Altar",
    "event": "infrastructure"
  },
  {
    "id": "DEC-09",
    "category": "decor_pending",
    "categoryLabel": "Decor: Host Decision",
    "domainIcon": "🏛️",
    "title": "Material Palette Discipline & Prohibitions",
    "phase": "Phase II: Thematic & Visual Language",
    "zone": "Fabric & Finishes",
    "status": "pending",
    "statusLabel": "PENDING HOST DECISION",
    "dilemma": "Eliminating cheap glossy satin, plastic flowers, and raw thermocol while keeping fabric and structure within budget.",
    "benchmark": "Abu Jani Sandeep Khosla: Matte-finish fabrics (linen, cotton, raw silk, velvet) create depth; high-gloss polyester ruins flash photography.",
    "direction": "Strict ban on glossy polyester, exposed iron trusses, and plastic floral stems in guest-facing zones.",
    "options": [
      {
        "id": "A",
        "text": "Zero-Plastic Mandate: 100% Cotton Canvas, Raw Silk, Brass & Real Foliage",
        "selected": true
      },
      {
        "id": "B",
        "text": "Hybrid Spec: Matte Poly-Viscose Drapes + Premium Silk Floral Ceilings",
        "selected": false
      }
    ],
    "actionType": "host_vote",
    "plateRef": "PLATE-04",
    "plateTitle": "Modular Aluminum Marquee & Dual-Zone HVAC",
    "event": "infrastructure"
  },
  {
    "id": "DEC-12",
    "category": "decor_pending",
    "categoryLabel": "Decor: Host Decision",
    "domainIcon": "🌺",
    "title": "Floral Strategy & Structural Reuse Matrix",
    "phase": "Phase III: Production & Scenic Fabrication",
    "zone": "Scenic Transitions",
    "status": "pending",
    "statusLabel": "PENDING HOST DECISION",
    "dilemma": "Maximizing fresh flower fragrance where guests interact while avoiding single-use waste across Day 1 & Day 2.",
    "benchmark": "Vandana Mohan: Repurposing Day 1 Sangeet backdrop structures into Day 2 Photo Lounges saves up to 30% of total decor fabrication cost.",
    "direction": "Mandate that the Day 2 Mandap structure doubles as the post-muhurtham family portrait pavilion.",
    "options": [
      {
        "id": "A",
        "text": "Full Reuse Matrix: Mandap structure transitions to Post-Wedding Portrait Sanctuary",
        "selected": true
      },
      {
        "id": "B",
        "text": "Distinct Setup: Separate dedicated Photo-Op booth built at additional cost",
        "selected": false
      }
    ],
    "actionType": "host_vote",
    "plateRef": "PLATE-12",
    "alternativePlates": [
      "PLATE-03"
    ],
    "plateTitle": "Midnight Blooms Reflective Mirror Stage",
    "event": "sangeet",
    "clusterId": "stage"
  },
  {
    "id": "DEC-13",
    "category": "decor_pending",
    "categoryLabel": "Decor: Host Decision",
    "domainIcon": "🪑",
    "title": "Ceremonial Seating Typography & Concourse Clearance",
    "phase": "Phase III: Production & Scenic Fabrication",
    "zone": "Zone A Ceremonial Seating & Concourse",
    "status": "pending",
    "statusLabel": "PENDING HOST DECISION",
    "dilemma": "Balancing ceremonial sightlines during 3-hour Vivaha rituals with an uncluttered 35-ft central concourse for free guest movement.",
    "benchmark": "The Wedding Design Company: Right-sizing central seating prevents oceans of empty chairs while opening pedestrian arteries.",
    "direction": "Locked in DWG A103: 80-chair ceremonial bay (8 rows of 10) flanking 10-ft aisle + 40 chairs in family sofa wings; opens 35-ft clear central concourse.",
    "options": [
      {
        "id": "A",
        "text": "Option A (Recommended): 80-Chair Ceremonial Bay + 40 Flank Chairs & Family Sofas (DWG A103)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Option B: Dense 200-Chair Theater Block (Restricts central circulation)",
        "selected": false
      }
    ],
    "actionType": "host_vote",
    "plateRef": "PLATE-06",
    "plateTitle": "Ceremonial Seating Typography & Concourse Clearance",
    "event": "wedding"
  },
  {
    "id": "DEC-15",
    "category": "decor_pending",
    "categoryLabel": "Decor: Host Decision",
    "domainIcon": "🍽️",
    "title": "Dining Court Architecture: Rectangular Central Island & Dual Buffets",
    "phase": "Phase IV: Event Choreography & Dining",
    "zone": "Zone C Dining Court",
    "status": "pending",
    "statusLabel": "PENDING HOST DECISION",
    "dilemma": "Eliminating dinner bottlenecks across 350+ guests while separating quick appetizer grazers from full-plate main course diners.",
    "benchmark": "Luxury Wedding Banquet Standard: Freestanding multi-sided central island reduces plate/salad wait times by 60% compared to linear buffets.",
    "direction": "Locked in DWG A103: Freestanding 20×8ft Rectangular Central Island (salads, chaats, breads, plate stacks) + 70ft Dual Main-Course Baseline + West Cocktail Grazing Lounge.",
    "options": [
      {
        "id": "A",
        "text": "Option A (Recommended): 20×8ft Rectangular Central Island + 70ft Dual Main Baseline + West Cocktail Lounge (DWG A103)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Option B: Traditional Linear Perimeter Buffets (Higher queue times)",
        "selected": false
      }
    ],
    "actionType": "host_vote",
    "plateRef": "PLATE-07",
    "alternativePlates": [
      "PLATE-08"
    ],
    "plateTitle": "20×8ft Rectangular Central Island & Dual Main Buffet",
    "event": "infrastructure"
  },
  {
    "id": "DEC-16",
    "category": "decor_pending",
    "categoryLabel": "Decor: Host Decision",
    "domainIcon": "⚡",
    "title": "4-Event Function Transformation Protocol",
    "phase": "Phase IV: Event Choreography & Dining",
    "zone": "Venue Turnaround",
    "status": "pending",
    "statusLabel": "PENDING HOST DECISION",
    "dilemma": "Turnaround window of only 6 hours between Day 1 Sangeet (ends 23:30) and Day 2 Wedding Setup (ready by 06:00).",
    "benchmark": "WDC Operating Standard: Dual-crew overnight shift with pre-fabricated floral modules; zero on-site carpentry during overnight turnover.",
    "direction": "Decorator must deploy a dedicated Night Crew of 20 artisans for quiet modular changeover while guests sleep at VEN-001.",
    "options": [
      {
        "id": "A",
        "text": "Overnight Dual-Crew Modular Turnover (Mandatory contractual guarantee)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Standard Single-Crew: Risk setup delay on morning of wedding",
        "selected": false
      }
    ],
    "actionType": "host_vote",
    "plateRef": "PLATE-01",
    "alternativePlates": [
      "PLATE-03"
    ],
    "plateTitle": "Mandap to Sangeet Stage Overnight Turnover",
    "event": "wedding"
  },
  {
    "id": "DEC-02",
    "category": "decor_vendor",
    "categoryLabel": "Vendor Submission",
    "domainIcon": "📐",
    "title": "Physical Site Survey & Boundary Clearances",
    "phase": "Phase I: Site & Spatial Foundations",
    "zone": "Perimeter & Access",
    "status": "vendor",
    "statusLabel": "VENDOR DELIVERABLE DUE",
    "dilemma": "Ground compaction, drainage gradient, and heavy crane access across 50m distance.",
    "benchmark": "Laser subfloor leveling with treated timber pedestals must precede all tent framing to prevent standing water ingress.",
    "vendorDeliverable": "Stamped CAD layout + Soil compaction report (Due T-21 Days)",
    "actionType": "vendor_review",
    "plateRef": "PLATE-05",
    "plateTitle": "50m Grand Arrival Corridor",
    "event": "haldi"
  },
  {
    "id": "DEC-05",
    "category": "decor_vendor",
    "categoryLabel": "Vendor Submission",
    "domainIcon": "🚪",
    "title": "Guest vs. Service Circulation Separation",
    "phase": "Phase I: Site & Spatial Foundations",
    "zone": "Corridors & BOH",
    "status": "vendor",
    "statusLabel": "VENDOR DELIVERABLE DUE",
    "dilemma": "Preventing catering waste, gas cylinder dollies, and dirty crockery trolleys from intersecting guest arrival.",
    "benchmark": "Dedicated 8ft perimeter service corridor with acoustic screening partitions completely isolates service logistics from guest views.",
    "vendorDeliverable": "BOH circulation blueprint & screening wall elevation (Due T-14 Days)",
    "actionType": "vendor_review",
    "plateRef": "PLATE-07",
    "plateTitle": "BOH Satellite Finishing Kitchen",
    "event": "infrastructure"
  },
  {
    "id": "DEC-19",
    "category": "decor_vendor",
    "categoryLabel": "Vendor Submission",
    "domainIcon": "🧯",
    "title": "Technical, Structural & Fire Safety Certification",
    "phase": "Phase V: Compliance & Handover",
    "zone": "Safety Infrastructure",
    "status": "vendor",
    "statusLabel": "VENDOR DELIVERABLE DUE",
    "dilemma": "Flame retardancy certification of fabrics and wind load structural stability of the 40ft marquee.",
    "benchmark": "Indian Standard IS 875 (Part 3) wind pressure certification + DIN 4102 B1 flame retardancy test certificates for PVC membranes.",
    "vendorDeliverable": "Structural Engineer Wind Certificate + Fabric Flame Retardant Lab Test Report",
    "actionType": "vendor_review",
    "plateRef": "PLATE-04",
    "plateTitle": "Marquee Technical & Fire Safety",
    "event": "infrastructure"
  },
  {
    "id": "DEC-20",
    "category": "decor_vendor",
    "categoryLabel": "Vendor Submission",
    "domainIcon": "🧪",
    "title": "Physical Mock-up & Material Sample Gate",
    "phase": "Phase V: Compliance & Handover",
    "zone": "Handover Gate",
    "status": "vendor",
    "statusLabel": "VENDOR DELIVERABLE DUE",
    "dilemma": "Preventing last-minute wedding morning shock from mismatched fabric dyes or flimsy carving finishes.",
    "benchmark": "Mandatory physical mock-up bay 14 days before wedding: 1:1 scale pillar sample, drapery swatch box, and live flower sample garland.",
    "vendorDeliverable": "Physical swatch box delivery + 1:1 Pillar Mock-up review at decorator warehouse",
    "actionType": "vendor_review",
    "plateRef": "PLATE-01",
    "alternativePlates": [
      "PLATE-10",
      "PLATE-11"
    ],
    "plateTitle": "Mandap Mock-Up Verification Bay",
    "event": "wedding",
    "clusterId": "mandap"
  },
  {
    "id": "PROP-01",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "✨",
    "title": "Tent Ceiling Blackout + Rice-Light Canopy & 'Bloom' Reveal",
    "targetEvent": "Wedding / Sangeet Couple Entry",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL",
    "dilemma": "Controlled blackout of ambient floods with warm 2800K rice-light aisle tunnel, blooming into full amber wash when couple meets.",
    "benchmark": "Tested in Proposal PROP-20260914. Matched directly to visual plate PLATE-09 (Wedding Trail).",
    "options": [
      {
        "id": "A",
        "text": "Promote to Master Decor Decision (Add DMX dimmer circuit to Decorator Tender)",
        "selected": false
      },
      {
        "id": "B",
        "text": "Keep in Ideation (Refine with lighting technician first)",
        "selected": true
      }
    ],
    "estimatedCost": "Moderate (Circuit wiring only)",
    "plateRef": "PLATE-09",
    "actionType": "promote_idea",
    "plateTitle": "Starlit Aisle Canopy & Illuminated Floral Walkway",
    "event": "wedding"
  },
  {
    "id": "PROP-02",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🎈",
    "title": "Suspended Balloon Drop / Burst on Sangeet Stage",
    "targetEvent": "Sangeet Stage Couple Dance Finale",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL",
    "dilemma": "Overhead release net holding 200+ pastel balloons dropping on stage climax. Verified via reference video ref-sangeet-stage-balloon-drop.mp4.",
    "benchmark": "Manual rip-cord with counter-weight snap retraction recommended to prevent net sagging on camera.",
    "options": [
      {
        "id": "A",
        "text": "Promote to Sangeet Stage Tender (Manual rip-cord + 5\" low-static balloons)",
        "selected": false
      },
      {
        "id": "B",
        "text": "Keep in Ideation (Check stage dance floor slip safety)",
        "selected": true
      }
    ],
    "estimatedCost": "< ₹4,000",
    "videoRef": "ref-sangeet-stage-balloon-drop.mp4",
    "actionType": "promote_idea",
    "plateRef": "PLATE-03",
    "plateTitle": "Sangeet Production Stage (Balloon Drop Ref)",
    "event": "sangeet",
    "clusterId": "stage"
  },
  {
    "id": "PROP-03",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🪄",
    "title": "Family 'Guard of Honour' Sparkler / Glow-Wand Arch",
    "targetEvent": "Couple Processional Entry",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL",
    "dilemma": "25-30 close cousins and uncles lining the aisle raising warm fiber-optic amber wands indoors (or smokeless sparklers outdoors).",
    "benchmark": "Replaces ₹25,000 cold pyro with high-intimacy family participation under ₹3,000.",
    "options": [
      {
        "id": "A",
        "text": "Approve for Wedding Entry (Assign to Cousin Lead PER-014)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Defer to Rehearsal",
        "selected": false
      }
    ],
    "estimatedCost": "₹1,500 – ₹3,000",
    "actionType": "promote_idea",
    "plateRef": "PLATE-09",
    "plateTitle": "Starlit Aisle Canopy (Guard of Honour)",
    "event": "wedding"
  },
  {
    "id": "PROP-04",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🌹",
    "title": "Synchronized Fresh Rose Petal Shower on Stage Drop",
    "targetEvent": "Stage Meeting / Varmala",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL",
    "dilemma": "Concealed overhead cane baskets or parent-held petal cones releasing fragrant desi gulab at exact moment balloons drop.",
    "benchmark": "Scent creates powerful long-term episodic memory for guests and elders.",
    "options": [
      {
        "id": "A",
        "text": "Approve (Add 15kg fresh dry desi gulab to Puja Procurement SAM)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Combine with Balloon Drop only",
        "selected": false
      }
    ],
    "estimatedCost": "₹1,200 – ₹2,500",
    "actionType": "promote_idea",
    "plateRef": "PLATE-11",
    "plateTitle": "Suspended Floral Lotus Canopy Dome (Petal Shower)",
    "event": "wedding",
    "clusterId": "mandap"
  },
  {
    "id": "PROP-05",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "☁️",
    "title": "Low-Lying Dry Ice 'Dancing on the Clouds' Floor Fog",
    "targetEvent": "Couple First Dance / Stage Meeting",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL",
    "dilemma": "Knee-high dense white CO2 fog staying on floor, concealing stage cables and creating fairy-tale atmosphere under fairy lights.",
    "benchmark": "Must use genuine warm-water dry-ice machines, NOT oily haze which triggers smoke alarms and coats attire.",
    "options": [
      {
        "id": "A",
        "text": "Approve (Bundle into DJ/AV contract rider CTR-AV-001)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Skip",
        "selected": false
      }
    ],
    "estimatedCost": "₹3,000 – ₹5,000",
    "actionType": "promote_idea",
    "plateRef": "PLATE-03",
    "plateTitle": "Sangeet Production Stage (Low-Lying Fog)",
    "event": "sangeet",
    "clusterId": "stage"
  },
  {
    "id": "PROP-06",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🎙️",
    "title": "20-Second Audio Voiceover Surprise Entry Track",
    "targetEvent": "Couple Entry Sequence",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL",
    "dilemma": "Intimate pre-recorded voice note from couple/parents cutting in 5 seconds before the high-energy music swells.",
    "benchmark": "Zero financial cost (₹0); 10/10 emotional impact and room silence.",
    "options": [
      {
        "id": "A",
        "text": "Approve (Record 20s audio snippet on phone, hand to DJ)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Standard Bollywood Track",
        "selected": false
      }
    ],
    "estimatedCost": "₹0 (Zero Cost)",
    "actionType": "promote_idea",
    "plateRef": "PLATE-03",
    "plateTitle": "Sangeet Stage Cinema Audio",
    "event": "sangeet"
  },
  {
    "id": "PROP-07",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "📸",
    "title": "'Memory Clothesline' Instant Polaroid & Handwritten Blessings",
    "targetEvent": "Foyer Arrival & Dining Promenade",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL",
    "dilemma": "Rustic wooden easel with fairy lights and mini wooden pegs; guests pin Polaroid shots and written kraft cards for couple.",
    "benchmark": "Couple takes home physical, tangible keepsake on the wedding night itself.",
    "options": [
      {
        "id": "A",
        "text": "Approve (Procure 2 Fujifilm Instax + 100 film shots + kraft cards)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Standard Guestbook Table",
        "selected": false
      }
    ],
    "estimatedCost": "₹2,500 – ₹4,000",
    "actionType": "promote_idea",
    "plateRef": "PLATE-08",
    "plateTitle": "Interactive Activity Kiosks (Polaroid Station)",
    "event": "mehendi"
  },
  {
    "id": "PROP-EXP-001",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🌧️",
    "title": "Haldi Outdoor Rain Dance & Splash Deck with 3-Stage Air-Lock",
    "targetEvent": "Day 1 Haldi (EVT-003)",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL — PENDING DECISION",
    "dilemma": "Photographer suggested an exterior 20x25ft rain dance deck outside Haldi Annex. Requires 6\" composite elevation, 1:40 slope, french drainage, and 3-stage dry transition air-lock to prevent yellow turmeric water on main marquee carpet.",
    "benchmark": "Luxury Destination Wedding Standard: Isolating wet rituals completely exterior to main canopy prevents ₹50,000+ carpet water damage.",
    "options": [
      {
        "id": "A",
        "text": "Option A: Approve with budget cap (Composite deck, 8 warm-mist nozzles, perimeter sump pump)",
        "selected": false
      },
      {
        "id": "B",
        "text": "Option B (Recommended): Keep Haldi as traditional seated floral ritual; defer rain dance deck",
        "selected": true
      }
    ],
    "estimatedCost": "₹25,000 – ₹35,000",
    "plateRef": "PLATE-05",
    "actionType": "promote_idea",
    "plateTitle": "Haldi Outdoor Rain Dance & Splash Deck with 3-Stage Air-Lock",
    "event": "haldi"
  },
  {
    "id": "PROP-EXP-002",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🌺",
    "title": "Artisanal Ittar (Fragrance) & Live Lac Bangle Craft Rotunda",
    "targetEvent": "Day 1 Mehendi Promenade & Reception",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL — PENDING DECISION",
    "dilemma": "10-ft hexagonal wooden gazebo in Zone D where traditional perfumers blend custom roll-on wedding scents for guests, accompanied by a live artisan hand-sizing lac and glass bangles.",
    "benchmark": "Devika Narain: Live sensory and artisan crafting elevates guest delight 3x over static photo walls with minimal structural footprint (<100 sq ft).",
    "options": [
      {
        "id": "A",
        "text": "Option A: Approve (Source local artisans from Rayagada / Bhubaneswar; allocate ₹8k-₹12k)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Option B: Defer to standard guest favors",
        "selected": false
      }
    ],
    "estimatedCost": "₹8,000 – ₹12,000",
    "plateRef": "PLATE-08",
    "actionType": "promote_idea",
    "plateTitle": "Artisanal Ittar & Live Lac Bangle Craft Rotunda",
    "event": "mehendi"
  },
  {
    "id": "PROP-EXP-003",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🦶",
    "title": "Elder Foot Spa & Reflexology Lounge",
    "targetEvent": "Whole-Venue VIP Hospitality",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL — PENDING DECISION",
    "dilemma": "4 plush velvet reclining chairs with ultrasonic herbal foot-mist dispensers situated in the entry vestibule of the 30ft Private Dining pod, offering quick 10-minute foot relief for elderly family members.",
    "benchmark": "High-End Family Hospitality: Providing targeted relief for senior relatives during multi-hour ceremonies prevents fatigue without clinical appearance.",
    "options": [
      {
        "id": "A",
        "text": "Option A: Approve (Schedule hotel spa therapists for 2-hour shifts during peak ritual hours)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Option B: Defer (Rely on comfortable sofa seating in private tent)",
        "selected": false
      }
    ],
    "estimatedCost": "₹6,000 – ₹10,000",
    "plateRef": "PLATE-07",
    "actionType": "promote_idea",
    "plateTitle": "Elder Foot Spa & Reflexology Lounge",
    "event": "infrastructure"
  },
  {
    "id": "PROP-EXP-004",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🎥",
    "title": "360° Glam-Cam & Retro Rotary Audio Guestbook",
    "targetEvent": "Day 1 Sangeet & Reception",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL — PENDING DECISION",
    "dilemma": "Rotating slow-motion video pedestal paired with an ivory vintage rotary analog telephone in a custom acoustic booth, allowing guests to leave voice messages for the couple.",
    "benchmark": "2026 Wedding Trend: Audio guestbooks generate deeply emotional personal keepsakes compared to standard guestbook signatures.",
    "options": [
      {
        "id": "A",
        "text": "Option A: Include in Photographer Contract (Incorporate into photo production rider)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Option B: Defer to standard digital videography",
        "selected": false
      }
    ],
    "estimatedCost": "₹12,000 – ₹18,000",
    "plateRef": "PLATE-03",
    "actionType": "promote_idea",
    "plateTitle": "360° Glam-Cam & Retro Rotary Audio Guestbook",
    "event": "sangeet"
  },
  {
    "id": "PROP-EXP-005",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🍨",
    "title": "Theatrical Nitro Dessert Counter & Live Culinary Theater",
    "targetEvent": "Sangeet & Wedding Dinner",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL — PENDING DECISION",
    "dilemma": "Cryo-station for flash-freezing Odisha Chenna Poda crunch, dragon-breath meringues, and live flambé dessert presentations integrated into the 20x8ft central island or dessert wing.",
    "benchmark": "Modern Indian Catering: 'Eatertainment' dessert stations drive high visual excitement and guest interaction.",
    "options": [
      {
        "id": "A",
        "text": "Option A: Review safety & transport with caterer (Verify liquid nitrogen transport to Rayagada)",
        "selected": false
      },
      {
        "id": "B",
        "text": "Option B: Stick to traditional live warm jalebi, kulfi, and Chenna Poda counters",
        "selected": true
      }
    ],
    "estimatedCost": "₹15,000 – ₹22,000",
    "plateRef": "PLATE-07",
    "actionType": "promote_idea",
    "plateTitle": "Theatrical Nitro Dessert Counter & Live Culinary Theater",
    "event": "infrastructure"
  },
  {
    "id": "PROP-EXP-006",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🎆",
    "title": "Grand Barat Procession & Cold-Pyro Sparkler Avenue",
    "targetEvent": "Day 2 Morning Barat Procession (EVT-004)",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL — PENDING DECISION",
    "dilemma": "8 wireless DMX cold-spark fountains along the 12-ft covered canopy tunnel triggered sequentially as the groom reaches the entrance.",
    "benchmark": "Event Safety Standard: Cold spark gerb fountains produce zero heat, non-toxic smoke, and are safe for tent fabrics with 10ft overhead clearance.",
    "options": [
      {
        "id": "A",
        "text": "Option A: Approve for outdoor arrival tunnel only (Verify venue fire clearance)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Option B: Use traditional dhol tasha, brass band, and floral showers only",
        "selected": false
      }
    ],
    "estimatedCost": "₹8,000 – ₹12,000",
    "plateRef": "PLATE-05",
    "actionType": "promote_idea",
    "plateTitle": "Grand Barat Procession & Cold-Pyro Sparkler Avenue",
    "event": "wedding"
  },
  {
    "id": "PROP-EXP-007",
    "category": "idea_incubator",
    "categoryLabel": "Idea Incubator",
    "domainIcon": "🔇",
    "title": "Acoustic Decoupling Drapery for 30 ft Private VIP Dining Pod",
    "targetEvent": "Whole-Venue VIP Comfort",
    "status": "incubating",
    "statusLabel": "INCUBATING PROPOSAL — PENDING DECISION",
    "dilemma": "Quilted 600 g/m² acoustic velvet drapes lining the west wall of the 30 ft Private Dining pod to dampen 15–18 dB of Sangeet concert noise for elder diners.",
    "benchmark": "Acoustic Architecture Standard: Dual-layer heavy velour with air gap effectively dampens mid/high frequencies without requiring rigid drywall partitions.",
    "options": [
      {
        "id": "A",
        "text": "Option A: Include in Decorator Tender (Specify 600 g/m² acoustic-rated velour drapes)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Option B: Use standard double-layer decorative georgette drapes",
        "selected": false
      }
    ],
    "estimatedCost": "₹10,000 – ₹15,000",
    "plateRef": "PLATE-07",
    "actionType": "promote_idea",
    "plateTitle": "Acoustic Decoupling Drapery for 30ft VIP Dining Pod",
    "event": "infrastructure"
  },
  {
    "id": "DEC-002",
    "category": "governance",
    "categoryLabel": "Governance & Operations",
    "domainIcon": "🏨",
    "title": "Hotel Baseline Inspection & Printable Dossier",
    "phase": "Operations & Accommodations",
    "zone": "VEN-001 (Hotel Rayagada)",
    "status": "locked",
    "statusLabel": "FROZEN & RATIFIED",
    "dilemma": "Establishing 4-layer inspection checklist (AC, water pressure, backup power, room allocation) before guest arrival.",
    "benchmark": "Standardized inspection dossier ensures zero VIP guest room complaints on arrival day.",
    "direction": "Ratified in 00_GOVERNANCE/decisions/DEC-002. Inspection checklist HTML/PDF generated in VEN-001 dossier.",
    "options": [
      {
        "id": "A",
        "text": "Execute Physical Inspection using VEN-001 Dossier Checklist (Ratified)",
        "selected": true
      }
    ],
    "actionType": "governance_record",
    "event": "infrastructure"
  },
  {
    "id": "DEC-01",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "📅",
    "title": "Function Schedule & Day/Night Allocation",
    "phase": "Phase I: Site & Spatial Foundations",
    "zone": "Whole Venue",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Freezing start/end timings for Haldi, Mehendi, Sangeet, and Wedding.",
    "benchmark": "WDC Standard: 6+ hour buffer between late-night Sangeet and morning wedding.",
    "direction": "Haldi Day 1 Morning, Mehendi Afternoon Split (VEN-001 + Marquee Zone D), Sangeet Day 1 Night, Vivaha Day 2 Morning.",
    "actionType": "certified_audit",
    "event": "infrastructure"
  },
  {
    "id": "DEC-03",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "☀️",
    "title": "Sun Path & Thermodynamic Orientation",
    "phase": "Phase I: Site & Spatial Foundations",
    "zone": "Marquee Alignment",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Preventing severe afternoon solar thermal loading and blinding glare.",
    "benchmark": "850 g/m² blockout PVC reduces internal heat load by 6°C–8°C.",
    "direction": "Ridge oriented North-South; afternoon sun shielded behind rear BOH kitchen wall.",
    "actionType": "certified_audit",
    "plateRef": "PLATE-04",
    "plateTitle": "Marquee Sun Path Alignment",
    "event": "infrastructure"
  },
  {
    "id": "DEC-04",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "🗺️",
    "title": "Master Venue Spatial Zoning (Zones A–E)",
    "phase": "Phase I: Site & Spatial Foundations",
    "zone": "Master Site Plan",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Preventing cross-zone crowd congestion across 10,000 sq. ft.",
    "benchmark": "5 distinct operational zones: Sanctuary, Processional, Dining, Hospitality, Service.",
    "direction": "Zone A: Stage & Altar; Zone B: Aisle; Zone C: Dining; Zone D: Lounge; Zone E: Perimeter BOH.",
    "actionType": "certified_audit",
    "plateRef": "PLATE-05",
    "plateTitle": "Master Venue Spatial Zoning",
    "event": "infrastructure"
  },
  {
    "id": "DEC-06",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "⛺",
    "title": "Marquee Structure Architecture & Elevation",
    "phase": "Phase I: Site & Spatial Foundations",
    "zone": "Marquee Shell",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Selecting clear-span German hangar vs traditional bamboo/pole tent.",
    "benchmark": "Engineered German hangar with zero center poles guarantees uninhibited camera sightlines.",
    "direction": "40ft × 120ft modular aluminum clear-span marquee with 14ft side walls and 22ft ridge height.",
    "actionType": "certified_audit",
    "plateRef": "PLATE-04",
    "plateTitle": "Modular Aluminum Marquee Shell",
    "event": "infrastructure"
  },
  {
    "id": "DEC-07",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "❄️",
    "title": "Dual-Zone HVAC & DG Power Backbone",
    "phase": "Phase I: Site & Spatial Foundations",
    "zone": "Climate & Power",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Ensuring 22°C temperature in outdoor afternoon heat with silent electrical redundancy.",
    "benchmark": "40 Tons packaged cooling + twin synchronized 125 kVA generators with auto-mains failure (AMF).",
    "direction": "Twin 125 kVA DG sets with auto-transfer switch; zero interruption to audio or lighting.",
    "actionType": "certified_audit",
    "plateRef": "PLATE-04",
    "plateTitle": "Dual-Zone HVAC & DG Power",
    "event": "infrastructure"
  },
  {
    "id": "DEC-10",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "🪵",
    "title": "Permanent Luxury Base Infrastructure",
    "phase": "Phase II: Thematic & Visual Language",
    "zone": "Subflooring",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Preventing uneven soil humps, carpet wrinkles, and damp ground smell under guest footwear.",
    "benchmark": "19mm marine-grade plywood subfloor elevated on steel box frames with damp-proof membrane.",
    "direction": "Full-coverage elevated timber subfloor across all 4,800 sq. ft. of marquee.",
    "actionType": "certified_audit",
    "plateRef": "PLATE-04",
    "plateTitle": "Elevated Timber Subflooring",
    "event": "infrastructure"
  },
  {
    "id": "DEC-11",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "💡",
    "title": "Cinema Lighting Design (CRI > 95)",
    "phase": "Phase II: Thematic & Visual Language",
    "zone": "Lighting Rigging",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Eliminating cheap LED multicolor face tints that ruin 4K cinematic video capture.",
    "benchmark": "Calibrated 3200K warm white key lighting with CRI > 95 guarantees natural skin tones on camera.",
    "direction": "Ban all colored par-can wash lights from couple's faces; only warm 3200K cinema profile spots.",
    "actionType": "certified_audit",
    "plateRef": "PLATE-03",
    "plateTitle": "Sangeet Stage Cinema Lighting",
    "event": "sangeet"
  },
  {
    "id": "DEC-14",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "🔥",
    "title": "Sacred Mandap Architecture & Smoke Extraction",
    "phase": "Phase III: Production & Scenic Fabrication",
    "zone": "Zone A Sanctuary",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Conducting traditional Vedic Havan fire ceremony inside an air-conditioned tent without choking guests.",
    "benchmark": "1200 CFM negative-pressure clear polycarbonate smoke hood evacuated via sealed duct through gable wall.",
    "direction": "Certified in PLATE-02: Transparent smoke cowl above havan kund evacuating smoke outdoors.",
    "actionType": "certified_audit",
    "plateRef": "PLATE-01",
    "alternativePlates": [
      "PLATE-10",
      "PLATE-11"
    ],
    "plateTitle": "Vedic Lotus Mandap (3 Options Available)",
    "event": "wedding",
    "clusterId": "mandap"
  },
  {
    "id": "DEC-17",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "🎥",
    "title": "Photography Sightlines, Drone & Cable Audit",
    "phase": "Phase IV: Event Choreography",
    "zone": "Media Operations",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Preventing heavy stage power cables and camera tripod clutter from appearing in family photos.",
    "benchmark": "Subfloor cable trenches + outdoor-only drone flight invariant (indoor drones strictly forbidden).",
    "direction": "All stage power routed under subfloor; drone flights restricted to outdoor arrival & baraat only.",
    "actionType": "certified_audit",
    "event": "infrastructure"
  },
  {
    "id": "DEC-18",
    "category": "decor_locked",
    "categoryLabel": "Decor: Locked & Certified",
    "domainIcon": "💰",
    "title": "Commercial BOQ & 4-Tier Budget Settlement",
    "phase": "Phase V: Compliance & Handover",
    "zone": "Finance & Commercials",
    "status": "locked",
    "statusLabel": "LOCKED & CERTIFIED",
    "dilemma": "Controlling scope creep and preventing hidden vendor surcharge addendums.",
    "benchmark": "Turnkey all-inclusive rate with 10% performance holdback released only after post-wedding teardown audit.",
    "direction": "Locked in Tier 2 / Tier 3 commercial negotiation brackets with strict performance rider CTR-DECOR-RIDER-001.",
    "actionType": "certified_audit",
    "event": "infrastructure"
  },
  {
    "id": "DEC-21",
    "category": "decor_pending",
    "categoryLabel": "Decor: Host Decision",
    "domainIcon": "✨",
    "title": "Grand Couple Entry Atmospheric Production & Special Effects",
    "phase": "Phase IV: Event Choreography & Dining",
    "zone": "Processional Aisle & Stage",
    "status": "pending",
    "statusLabel": "PENDING HOST DECISION",
    "dilemma": "Balancing high-impact theatrical entrance visuals with indoor/marquee fire safety, guest comfort, and delicate fabric protection.",
    "benchmark": "Luxury Wedding Standard: Low-lying dense dry-ice fog produces pristine 'dancing on clouds' visuals with zero fire marshal permits; cold pyros require 15ft clearance and outdoor ventilation.",
    "direction": "Adopt low-lying dry-ice floor fog and shimmering bubbles for Sangeet & Mehendi; evaluate mechanical rose petal shower for Daytime Varmala.",
    "options": [
      {
        "id": "A",
        "text": "Low-Lying Dry Ice Cloud Fog + Shimmering Soap Bubbles (Safe indoor/marquee, zero residue, ethereal photo aesthetic)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Pyrotechnic Cold Spark Fountains (Gerb Units — high-energy theatrical sparklers, requires fire safety clearance)",
        "selected": false
      },
      {
        "id": "C",
        "text": "Mechanical Fresh Rose Petal Cannons & Floral Shower (Traditional sacred floral rain, completely organic)",
        "selected": false
      }
    ],
    "actionType": "host_vote",
    "plateRef": "PLATE-05",
    "alternativePlates": [
      "PLATE-09",
      "PLATE-01"
    ],
    "plateTitle": "Grand Couple Entry Atmospheric Production",
    "event": "sangeet",
    "clusterId": "entry"
  },
  {
    "id": "DEC-22",
    "category": "decor_pending",
    "categoryLabel": "Decor: Host Decision",
    "domainIcon": "🖼️",
    "title": "Arrival Walkway Narrative & Experiential Welcome Installation",
    "phase": "Phase II: Thematic & Visual Language",
    "zone": "Zone B Arrival Walkway",
    "status": "pending",
    "statusLabel": "PENDING HOST DECISION",
    "dilemma": "Establishing an emotional, intimate guest arrival narrative along the 60ft entrance walkway without commercial-looking banners.",
    "benchmark": "Devika Narain / Sabyasachi: Entrance passages should tell a personal couple journey; framed archival photos and warm fairy lights create an immersive memory trail.",
    "direction": "Evaluate Chronological 'Memory Lane' photo tunnel vs. Family silhouette cutout wall vs. Heritage Pattachitra Swagata Torana.",
    "options": [
      {
        "id": "A",
        "text": "Chronological 'Memory Lane' Archival Photo Passage (Framed timeline of couple's journey along starlit walkway culminating at wedding year)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Contemporary Family Silhouette & Shadow Profile Cutout Wall (Artistic backlit silhouettes of both families with custom brass monogram)",
        "selected": false
      },
      {
        "id": "C",
        "text": "Heritage Odia Pattachitra Swagata Torana (Hand-painted temple archways with auspicious terracotta bells and fresh mango leaf torana)",
        "selected": false
      }
    ],
    "actionType": "host_vote",
    "plateRef": "PLATE-09",
    "alternativePlates": [
      "PLATE-05"
    ],
    "plateTitle": "Starlit Aisle Canopy & Illuminated Floral Walkway",
    "event": "wedding"
  },
  {
    "id": "DEC-23",
    "category": "decor_pending",
    "categoryLabel": "Decor: Host Decision",
    "domainIcon": "📺",
    "title": "Sangeet Stage Digital Media Stream vs. Cultural Artisan Promenade",
    "phase": "Phase IV: Event Choreography & Dining",
    "zone": "Zone A Stage & Zone C Foyer",
    "status": "pending",
    "statusLabel": "PENDING HOST DECISION",
    "dilemma": "Allocating guest attention and budget between high-tech dynamic LED broadcast screens and interactive traditional folk craft kiosks.",
    "benchmark": "High-End Destination Wedding Benchmark: A dynamic LED screen keeps the dance floor energized; interactive artisan stalls in the foyer engage elders and non-dancers without acoustic conflict.",
    "direction": "Approve Blended Hybrid: Flanked dual LED relay screens for performance candids + 2 curated traditional artisan stalls in the arrival foyer.",
    "options": [
      {
        "id": "A",
        "text": "Blended Hybrid: Flanked Dual LED Relay Screens (Performance Candids) + Foyer Artisan Promenade (Lac Bangle & Polaroid Trellis)",
        "selected": true
      },
      {
        "id": "B",
        "text": "Pure Digital Media Focus: Full P3 LED Stage Wall with live crowd camera feed and childhood photo/video montage",
        "selected": false
      },
      {
        "id": "C",
        "text": "Pure Folk Craft Promenade: Unplugged stage with warm floral backdrop, puppet theater, and live craft stations",
        "selected": false
      }
    ],
    "actionType": "host_vote",
    "plateRef": "PLATE-03",
    "alternativePlates": [
      "PLATE-12"
    ],
    "plateTitle": "Sangeet Concert & Performance Stage",
    "event": "sangeet",
    "clusterId": "stage"
  }
]
};
