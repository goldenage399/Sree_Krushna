const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const modulesDir = path.join(publicDir, 'js/modules');

if (!fs.existsSync(modulesDir)) fs.mkdirSync(modulesDir, { recursive: true });

// Sree Krushna Marriage Canonical DO-PKOS Dataset
const MARRIAGE_PROJECT_STATE = {
  project: {
    id: "sree-krushna-marriage",
    name: "Sree Krushna Marriage OS — Sacred Precedence Topology",
    version: "3.0.0",
    last_updated: "2026-08-22",
    active_stage: 1,
    storage_key: "sree_krushna_dopkos_v3"
  },
  stages: [
    {
      id: 1,
      name: "T-180 Sacred Foundation",
      phases: ["S-1"],
      trades_active: ["role-purohit", "role-bride", "role-groom", "role-catering", "role-media", "role-fleet"],
      gate_condition: "Lagna Muhurat patra locked, weaver contracts signed, venue agreements locked."
    },
    {
      id: 2,
      name: "T-120 Procurement & Weaving",
      phases: ["S-2"],
      trades_active: ["role-purohit", "role-bride", "role-groom", "role-catering", "role-media", "role-fleet"],
      gate_condition: "Vidhi-Patra signoff, Deva Nimantrana at Puri Jagannath, Mithai advance booking."
    },
    {
      id: 3,
      name: "T-60 Detailing & Tasting",
      phases: ["S-3"],
      trades_active: ["role-purohit", "role-bride", "role-groom", "role-catering", "role-media", "role-fleet"],
      gate_condition: "Silver Mukuta fitting, MUA trial signoff, 125kVA generator test, FSSAI hygiene audit."
    },
    {
      id: 4,
      name: "T-14 Rayagada Pre-Wedding Rites",
      phases: ["S-4"],
      trades_active: ["role-purohit", "role-bride", "role-groom", "role-catering", "role-media", "role-fleet"],
      gate_condition: "Mangan turmeric bath, Patra Paribartana paternal vows, Rayagada feast service."
    },
    {
      id: 5,
      name: "Day 0 Sacred BBSR Wedding",
      phases: ["S-5"],
      trades_active: ["role-purohit", "role-bride", "role-groom", "role-catering", "role-media", "role-fleet"],
      gate_condition: "Baranugam, Kanyadaan (08:00), Sindoor Daan, 850-guest royal feast."
    },
    {
      id: 6,
      name: "Post-Wedding, Reception & SUJOG",
      phases: ["S-6"],
      trades_active: ["role-purohit", "role-bride", "role-groom", "role-catering", "role-media", "role-fleet"],
      gate_condition: "Grihapravesh, Astamangala, SUJOG registration, 4TB Raw archive vault deposit."
    }
  ],
  trades: ["role-purohit", "role-bride", "role-groom", "role-catering", "role-media", "role-fleet"],
  trade_meta: {
    "role-purohit":  { label: "🕉️ PUROHIT", color: "#f5c518" },
    "role-bride":    { label: "👰 BRIDE", color: "#c06b8c" },
    "role-groom":    { label: "🤵 GROOM", color: "#d4a843" },
    "role-catering": { label: "🍲 CATERING", color: "#e07850" },
    "role-media":    { label: "📸 MEDIA", color: "#64b5f6" },
    "role-fleet":    { label: "🛡️ FLEET/VAULT", color: "#66bb6a" }
  },
  tasks: [
    // STAGE 1: T-180 Foundation
    {
      id: "GOV-001",
      name: "Chief Purohit Lagna Lock (08:00 10 Mar 2027)",
      trade: "role-purohit",
      stage: 1,
      phase: "S-1",
      status: "complete",
      dependency_type: "must_precede_sealing",
      depends_on: [],
      unlocks: ["RIT-001", "VEN-001", "FOOD-001"],
      sealing_gate: "GATE-03",
      lead: "Chief Purohit (Raghunath Das)",
      phone: "+919437000003",
      notes: "Astrological verification and Lagna Patrika affirmation locked with family elders.",
      checklist: ["Verify planetary alignment for 10 Mar 2027", "Affirm Muhurat Patra with both elders", "Sign canonical astrological record"]
    },
    {
      id: "TSK-001",
      name: "Nuapatna Baula Patani Saree Master Weaver Contract",
      trade: "role-bride",
      stage: 1,
      phase: "S-1",
      status: "complete",
      dependency_type: "standard",
      depends_on: [],
      unlocks: ["TSK-002", "TSK-006", "TSK-005"],
      lead: "Pooja & Shashi Rekha",
      phone: "+919437000001",
      notes: "Traditional Nuapatna silk handloom contract with authentic temple motif border.",
      checklist: ["Select yellow-red silk yarn palette", "Commission master weaver in Nuapatna", "Record 90-day loom delivery SLA"]
    },
    {
      id: "TSK-002",
      name: "Groom Silk Dhoti & Uttariya Custom Dyeing",
      trade: "role-groom",
      stage: 1,
      phase: "S-1",
      status: "complete",
      dependency_type: "standard",
      depends_on: ["TSK-001"],
      unlocks: ["RIT-002"],
      lead: "Groom Attire Lead",
      phone: "+919437000002",
      notes: "Nuapatna natural silk dhoti matched to bridal Baula Patani shade.",
      checklist: ["Measure groom waist & length", "Confirm natural turmeric/saffron vegetable dye", "Inspect loom sample weave"]
    },
    {
      id: "FOOD-001",
      name: "21-Item Authentic Odia Feast Menu Tasting",
      trade: "role-catering",
      stage: 1,
      phase: "S-1",
      status: "available",
      dependency_type: "standard",
      depends_on: ["GOV-001"],
      unlocks: ["FOOD-002", "FOOD-005"],
      lead: "Debashis (Royal Caterers)",
      phone: "+919437000004",
      notes: "Menu tasting with Kanika, Dahi Baigana, Chhena Jhilli, and authentic Dalma.",
      checklist: ["Organize 6-person elder tasting panel", "Score 21 dishes for authentic taste", "Finalize live sweet counter specs"]
    },
    {
      id: "TSK-003",
      name: "Photographer 36-Question SLA & Sanctum Clearance",
      trade: "role-media",
      stage: 1,
      phase: "S-1",
      status: "available",
      dependency_type: "standard",
      depends_on: [],
      unlocks: ["TSK-004"],
      lead: "Rayagada Creative Studios",
      phone: "+919437000005",
      notes: "Strict 36-question contract covering 2-camera mandap recording, 4K cards, and 4TB archive.",
      checklist: ["Review 36-Q operational SLA", "Sign Sanctum non-intrusive filming agreement", "Confirm dual-camera wireless lapel kit"]
    },
    {
      id: "VEN-001",
      name: "Rayagada & BBSR Mandap Leases & Generator SLA Lock",
      trade: "role-fleet",
      stage: 1,
      phase: "S-1",
      status: "available",
      dependency_type: "standard",
      depends_on: ["GOV-001"],
      unlocks: ["PWR-001", "SEC-001", "GATE-02"],
      lead: "Kalyan (Venue Lead)",
      phone: "+919437000006",
      notes: "Mandap lease agreements with strict 125kVA uninterrupted power backup guarantee.",
      checklist: ["Sign Rayagada Kalyana Mandap lease", "Sign Bhubaneswar Mandap agreement", "Attach 125kVA generator SLA with penalty clause"]
    },

    // STAGE 2: T-120 Procurement & Weaving
    {
      id: "RIT-001",
      name: "Vidhi-Patra Liturgy Signoff with Purohit",
      trade: "role-purohit",
      stage: 2,
      phase: "S-2",
      status: "not_started",
      dependency_type: "must_precede_sealing",
      depends_on: ["GOV-001"],
      unlocks: ["GFT-001", "RIT-006", "RIT-003"],
      sealing_gate: "GATE-02",
      lead: "Chief Purohit (Raghunath Das)",
      phone: "+919437000003",
      notes: "Complete liturgical script and samagri list approved by both family purohits.",
      checklist: ["Review Vedic mantra sequence", "Approve Gotra and Pravara lineages", "Sign dual-family liturgical charter"]
    },
    {
      id: "TSK-006",
      name: "Bridal Footwear, Trousseau & Saree Delivery",
      trade: "role-bride",
      stage: 2,
      phase: "S-2",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["TSK-001"],
      unlocks: ["RIT-003"],
      lead: "Pooja & Shashi Rekha",
      phone: "+919437000001",
      notes: "Receive finished Nuapatna silk saree from loom and fit wedding footwear.",
      checklist: ["Inspect Baula Patani saree zari quality", "Verify blouse embroidery fitting", "Pack trousseau in cedar strongbox"]
    },
    {
      id: "GFT-001",
      name: "Deva Nimantrana at Puri Shri Jagannath Temple",
      trade: "role-groom",
      stage: 2,
      phase: "S-2",
      status: "not_started",
      dependency_type: "must_precede_sealing",
      depends_on: ["RIT-001"],
      unlocks: ["RIT-004"],
      sealing_gate: "GATE-02",
      lead: "Groom Family Lead",
      phone: "+919437000002",
      notes: "Consecrated first wedding invitation offered to Lord Jagannath with Mahaprasad.",
      checklist: ["Puri temple servitor booking", "Offer first invitation with betel nuts and silk", "Receive Lord Jagannath Nirmalya"]
    },
    {
      id: "FOOD-002",
      name: "Pahala Rasagola & Nayagarh Chhenapoda Booking",
      trade: "role-catering",
      stage: 2,
      phase: "S-2",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["FOOD-001"],
      unlocks: ["FOOD-004"],
      lead: "Debashis (Royal Caterers)",
      phone: "+919437000004",
      notes: "Batch order for 1,200 fresh hot Rasagolas in earthen handis and Nayagarh Chhenapoda.",
      checklist: ["Book Pahala master sweetmakers batch", "Reserve Nayagarh Chhenapoda wood-fire batch", "Confirm morning delivery temperature logs"]
    },
    {
      id: "TSK-004",
      name: "Pre-Wedding Shoot Permits & Heritage Location Lock",
      trade: "role-media",
      stage: 2,
      phase: "S-2",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["TSK-003"],
      unlocks: ["MED-002"],
      lead: "Rayagada Creative Studios",
      phone: "+919437000005",
      notes: "Permits for Rayagada hills and Puri beach shoots with storyboard approval.",
      checklist: ["Obtain forest and heritage shoot permits", "Approve 40-scene couple shot-list", "Schedule camera crew travel roster"]
    },
    {
      id: "SEC-001",
      name: "Jewellery Photographic Ledger & Vault Custody Protocol",
      trade: "role-fleet",
      stage: 2,
      phase: "S-2",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["VEN-001"],
      unlocks: ["SEC-002"],
      lead: "Vault Security Custodian",
      phone: "+919437000006",
      notes: "High-resolution photo catalogue of all heirloom jewellery with BIS hallmarks.",
      checklist: ["Photograph every gold piece with weight tag", "Record BIS Hallmark certificate numbers", "Establish dual-custody key protocol"]
    },

    // STAGE 3: T-60 Detailing & Tasting
    {
      id: "RIT-006",
      name: "108 Vedic Samagri Trunk Inventory & Quality Audit",
      trade: "role-purohit",
      stage: 3,
      phase: "S-3",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["RIT-001"],
      unlocks: ["RIT-007"],
      lead: "Chief Purohit (Raghunath Das)",
      phone: "+919437000003",
      notes: "Trunk packing of pure cow ghee, sacred woods, kusha grass, and Ganga water.",
      checklist: ["Inspect 15kg pure desi cow ghee", "Verify 108 distinct samagri sachets", "Seal liturgical trunk with priest signoff"]
    },
    {
      id: "TSK-005",
      name: "Bridal Makeup (MUA) HD Trial & Lookbook Signoff",
      trade: "role-bride",
      stage: 3,
      phase: "S-3",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["TSK-001"],
      unlocks: ["RIT-003"],
      lead: "Pooja (Bride Lead)",
      phone: "+919437000001",
      notes: "Full HD hair and makeup trial with jewelry placement and timing verification.",
      checklist: ["Conduct 3-hour MUA trial session", "Capture 4K lighting lookbook photos", "Approve Day-Of 04:00 AM dressing schedule"]
    },
    {
      id: "RIT-002",
      name: "Cuttack Tarakasi Silver Filigree Mukuta Sizing & Fitting",
      trade: "role-groom",
      stage: 3,
      phase: "S-3",
      status: "not_started",
      dependency_type: "must_precede_sealing",
      depends_on: ["TSK-002"],
      unlocks: ["GATE-04"],
      sealing_gate: "GATE-04",
      lead: "Groom Operations Lead",
      phone: "+919437000002",
      notes: "Custom sizing of authentic Cuttack silver filigree Mukutas for bride and groom.",
      checklist: ["Measure head circumference for groom and bride", "Verify pure silver filigree craftsmanship", "Test secure pin placement with head wrap"]
    },
    {
      id: "FOOD-004",
      name: "Kitchen FSSAI Hygiene Audit & RO Water Quality Test",
      trade: "role-catering",
      stage: 3,
      phase: "S-3",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["FOOD-002"],
      unlocks: ["FOOD-003"],
      lead: "Debashis (Royal Caterers)",
      phone: "+919437000004",
      notes: "Laboratory water test for TDS < 80 and kitchen hygiene certification.",
      checklist: ["Take water samples from kitchen RO filters", "Verify FSSAI certificates of all raw spices", "Inspect refrigeration cold-chain storage"]
    },
    {
      id: "MED-002",
      name: "Drone DGCA Flight Clearance & Audio Sync Dry-Run",
      trade: "role-media",
      stage: 3,
      phase: "S-3",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["TSK-004"],
      unlocks: ["MED-001"],
      lead: "Rayagada Creative Studios",
      phone: "+919437000005",
      notes: "DGCA drone flying approval over mandap grounds and sound-check.",
      checklist: ["File DGCA digital sky flight clearance", "Conduct wireless mic frequency sweep", "Calibrate 2-camera white balance on mandap lighting"]
    },
    {
      id: "PWR-001",
      name: "125kVA Generator Full-Load Automatic Switchover Test",
      trade: "role-fleet",
      stage: 3,
      phase: "S-3",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["VEN-001"],
      unlocks: ["MED-001"],
      lead: "Logistics Lead",
      phone: "+919437000006",
      notes: "Full-load power cut test with sub-3-second automatic generator switchover.",
      checklist: ["Simulate grid power cutoff at mandap", "Verify automatic generator start in < 3s", "Test AC chillers and lighting stability"]
    },

    // STAGE 4: T-14 Rayagada Pre-Wedding Rites
    {
      id: "RIT-007",
      name: "Aarti Thali, Mangala Ghata & Samagri Packing",
      trade: "role-purohit",
      stage: 4,
      phase: "S-4",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["RIT-006"],
      unlocks: ["RIT-005"],
      lead: "Chief Purohit (Raghunath Das)",
      phone: "+919437000003",
      notes: "7 ceremonial brass Aarti Thalis packed for Rayagada welcoming rituals.",
      checklist: ["Polish brass thalis and lamps", "Pack fresh betel leaves, vermillion, and rice", "Deliver to Rayagada transit custody"]
    },
    {
      id: "RIT-003",
      name: "Mangan Turmeric Application & Sacred Snana",
      trade: "role-bride",
      stage: 4,
      phase: "S-4",
      status: "not_started",
      dependency_type: "must_precede_sealing",
      depends_on: ["RIT-001", "TSK-005", "TSK-006"],
      unlocks: ["RIT-004"],
      sealing_gate: "GATE-02",
      lead: "Pooja & Family Elders",
      phone: "+919437000001",
      notes: "Sacred turmeric bath performed by 7 married women in Rayagada.",
      checklist: ["Grind fresh raw turmeric paste", "Perform 7-Sadhaba ceremonial anointing", "Record family blessings in bridal ledger"]
    },
    {
      id: "RIT-004",
      name: "Patra Paribartana Paternal Vows (Rayagada)",
      trade: "role-groom",
      stage: 4,
      phase: "S-4",
      status: "not_started",
      dependency_type: "must_precede_sealing",
      depends_on: ["RIT-003", "GFT-001"],
      unlocks: ["GATE-02"],
      sealing_gate: "GATE-02",
      lead: "Groom Lead & Elders",
      phone: "+919437000002",
      notes: "Exchange of formal paternal alliance letters and blessings in Rayagada.",
      checklist: ["Recite paternal gotra lineage", "Exchange betel nut covenant box", "Formal handshake between family heads"]
    },
    {
      id: "FOOD-005",
      name: "Rayagada Pre-Wedding Feast Service Execution",
      trade: "role-catering",
      stage: 4,
      phase: "S-4",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["FOOD-001"],
      unlocks: ["FOOD-003"],
      lead: "Debashis (Royal Caterers)",
      phone: "+919437000004",
      notes: "350-guest traditional Rayagada dinner service with regional delicacies.",
      checklist: ["Set up live Odia food counters", "Supervise hygienic dinner buffet", "Sign off kitchen cleanup audit"]
    },
    {
      id: "MED-001",
      name: "Lapel Audio Sync & Live Stream Mandap Dry-Run",
      trade: "role-media",
      stage: 4,
      phase: "S-4",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["MED-002", "PWR-001"],
      unlocks: ["MED-006"],
      lead: "Rayagada Creative Studios",
      phone: "+919437000005",
      notes: "Complete audio sync test on mandap mics and private YouTube stream test.",
      checklist: ["Attach wireless lapel to Purohit mock robe", "Verify zero audio clipping on Vedic chants", "Stream 1080p private test to family abroad"]
    },
    {
      id: "SEC-002",
      name: "Jewellery & Horoscope Safe Escort to BBSR Mandap",
      trade: "role-fleet",
      stage: 4,
      phase: "S-4",
      status: "not_started",
      dependency_type: "must_precede_sealing",
      depends_on: ["SEC-001"],
      unlocks: ["SEC-003"],
      sealing_gate: "GATE-03",
      lead: "Vault Security Custodian",
      phone: "+919437000006",
      notes: "Armed escort vehicle transporting jewellery vault boxes from Rayagada to BBSR.",
      checklist: ["Verify tamper-evident seal numbers", "Sign custody departure transfer sheet", "Secure strongbox in Bhubaneswar venue safe"]
    },

    // STAGE 5: Day 0 Sacred BBSR Wedding (10 Mar 2027)
    {
      id: "GATE-02",
      name: "Baranugam & Barat Welcoming Arch Gate (07:30)",
      trade: "role-groom",
      stage: 5,
      phase: "S-5",
      status: "not_started",
      dependency_type: "must_precede_sealing",
      depends_on: ["RIT-004", "VEN-001"],
      unlocks: ["RIT-005", "MED-006"],
      sealing_gate: "GATE-03",
      lead: "Chief Purohit & Groom Lead",
      phone: "+919437000002",
      notes: "Groom arrival at mandap arch, feet washing ritual, and tilak coronation.",
      checklist: ["Groom escorted to mandap entrance arch", "Mother of the bride performs welcoming Aarti", "Purohit recites welcoming mantras"]
    },
    {
      id: "SEC-003",
      name: "Jewellery Vault Dual-Custody Handover to Mandap",
      trade: "role-fleet",
      stage: 5,
      phase: "S-5",
      status: "not_started",
      dependency_type: "must_happen_during",
      depends_on: ["SEC-002"],
      unlocks: ["RIT-005"],
      sealing_gate: "GATE-03",
      lead: "Vault Security Custodian",
      phone: "+919437000006",
      notes: "Dual-key opening of safe and physical delivery of bridal gold to mandap.",
      checklist: ["Key A (Groom Elder) & Key B (Bride Elder) insert", "100% item photo match verification", "Sign physical transfer slip on mandap"]
    },
    {
      id: "RIT-005",
      name: "Kanyadaan & Hastaganthi Sacred Knot (08:00 Lagna)",
      trade: "role-purohit",
      stage: 5,
      phase: "S-5",
      status: "not_started",
      dependency_type: "must_precede_sealing",
      depends_on: ["GATE-02", "SEC-003", "RIT-007"],
      unlocks: ["GATE-04", "RIT-008", "LEG-001"],
      sealing_gate: "GATE-04",
      lead: "Chief Purohit (Raghunath Das)",
      phone: "+919437000003",
      notes: "Core Vedic sacramental rites: Kanyadaan, Hastaganthi tied, and 7 Agni Ahutis.",
      checklist: ["Kanyadaan paternal water rite", "Hastaganthi sacred knot tied with Nuapatna silk", "Vedic Agni Homa chant recitation"]
    },
    {
      id: "GATE-04",
      name: "Saptapadi & Sindoor Daan (Final Sacramental Bond 08:45)",
      trade: "role-bride",
      stage: 5,
      phase: "S-5",
      status: "not_started",
      dependency_type: "must_precede_sealing",
      depends_on: ["RIT-005", "RIT-002"],
      unlocks: ["FOOD-003", "TSK-007", "TSK-008"],
      sealing_gate: "GATE-04",
      lead: "Groom & Bride",
      phone: "+919437000001",
      notes: "7 sacred steps (Saptapadi), Sindoor Daan, and Cuttack silver Mukuta coronation.",
      checklist: ["Perform 7 steps around Vedic fire", "Apply pure vermillion (Sindoor Daan)", "Coronate both Mukutas on bride and groom"]
    },
    {
      id: "MED-006",
      name: "Mandap Audio 2-Camera 4K Live Recording",
      trade: "role-media",
      stage: 5,
      phase: "S-5",
      status: "not_started",
      dependency_type: "must_happen_during",
      depends_on: ["GATE-02", "MED-001"],
      unlocks: ["CLS-001"],
      sealing_gate: "GATE-04",
      lead: "Rayagada Creative Studios",
      phone: "+919437000005",
      notes: "Dual 4K camera recording of entire Kanyadaan and Saptapadi rites with live backup.",
      checklist: ["Verify both 4K camera rolling cards", "Monitor wireless lapel audio clarity", "Swap backup media cards at midpoint"]
    },
    {
      id: "FOOD-003",
      name: "850-Guest Royal Reception Feast Service (19:30)",
      trade: "role-catering",
      stage: 5,
      phase: "S-5",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["GATE-04", "FOOD-004", "FOOD-005"],
      unlocks: ["FOOD-006"],
      lead: "Debashis (Royal Caterers)",
      phone: "+919437000004",
      notes: "Grand 850-guest reception buffet and sit-down Odia traditional royal dining.",
      checklist: ["Open VIP sit-down hall service (120 Pax)", "Open general royal buffet (730 Pax)", "Serve fresh hot Rasagolas from earthen pots"]
    },

    // STAGE 6: Post-Wedding, Reception & SUJOG
    {
      id: "RIT-008",
      name: "Astamangala Blessing Ceremony (Day +8)",
      trade: "role-purohit",
      stage: 6,
      phase: "S-6",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["RIT-005"],
      unlocks: [],
      lead: "Chief Purohit (Raghunath Das)",
      phone: "+919437000003",
      notes: "Astamangala sacred knot untying and homecoming puja.",
      checklist: ["Untie Hastaganthi sacred knot with blessings", "Distribute Mahaprasad to assembled family", "Conclude liturgical lifecycle"]
    },
    {
      id: "TSK-007",
      name: "Grihapravesh Altas & Traditional Rice Pot Welcoming",
      trade: "role-bride",
      stage: 6,
      phase: "S-6",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["GATE-04"],
      unlocks: [],
      lead: "Pooja & Groom Mother",
      phone: "+919437000001",
      notes: "Traditional bride entrance into groom home with red alta footprints and rice pot.",
      checklist: ["Prepare milk-alta brass plate", "Guide right-foot rice pot overturning", "Seat couple for family ring finding game"]
    },
    {
      id: "TSK-008",
      name: "Chauthi Homa & Sacred Bedding Rites",
      trade: "role-groom",
      stage: 6,
      phase: "S-6",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["GATE-04"],
      unlocks: [],
      lead: "Groom Family Lead",
      phone: "+919437000002",
      notes: "Chauthi sacred homa and floral bed chamber sanctification.",
      checklist: ["Perform Chauthi evening homa", "Decorate chamber with jasmine and rajnigandha", "Receive elder blessings"]
    },
    {
      id: "FOOD-006",
      name: "Catering Settlement, Leftover Donation & Kitchen Handover",
      trade: "role-catering",
      stage: 6,
      phase: "S-6",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["FOOD-003"],
      unlocks: [],
      lead: "Debashis (Royal Caterers)",
      phone: "+919437000004",
      notes: "Complete financial reconciliation, food donation to shelter, and kitchen audit.",
      checklist: ["Coordinate leftover food dispatch to charity", "Reconcile plate count vs final invoice", "Obtain venue kitchen clearance slip"]
    },
    {
      id: "CLS-001",
      name: "4TB Master Raw Data Archive Handover & 48h Teaser",
      trade: "role-media",
      stage: 6,
      phase: "S-6",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["MED-006"],
      unlocks: [],
      lead: "Rayagada Creative Studios",
      phone: "+919437000005",
      notes: "Dual 4TB hard drives handed over to bride and groom vaults with 48h teaser video.",
      checklist: ["Deliver 4K 60-second teaser for WhatsApp", "Hand over Drive A to Groom Family Vault", "Hand over Drive B to Bride Family Vault"]
    },
    {
      id: "LEG-001",
      name: "SUJOG Odisha Legal Marriage Certificate Registration",
      trade: "role-fleet",
      stage: 6,
      phase: "S-6",
      status: "not_started",
      dependency_type: "standard",
      depends_on: ["RIT-005"],
      unlocks: [],
      lead: "Legal & Governance Lead",
      phone: "+919437000006",
      notes: "Government of Odisha SUJOG portal marriage certificate registration and legal issuance.",
      checklist: ["Upload signed priest certificate and witness IDs", "Submit SUJOG portal online application", "Download verified digital marriage certificate"]
    }
  ]
};

// Generate dopkos-engine.js
const dopkosEngineCode = `/**
 * Sree Krushna Marriage OS — Authentic DO-PKOS Multi-Track Operating Studio & Sacred Precedence DAG Engine
 * Module: js/modules/dopkos-engine.js
 * Sourced directly from UG-Farmhouse System Reference portable engine with 100% full-fidelity.
 */
(function(window) {
  'use strict';

  let currentDopkosView = 'TOPOLOGY';
  let currentDopkosEvent = 'ALL';
  let currentDopkosTrack = 'ALL';
  let selectedTopologyTaskId = null;
  let consoleExpanded = false;
  let stageStripCollapsed = false;
  let zoomLevel = 1.0;
  let tableZoomLevel = 1.0;
  let panMode = false;
  let spacePanActive = false;
  let isDragging = false;
  let hasDragged = false;
  let startX = 0, startY = 0, scrollXStart = 0, scrollYStart = 0;
  let activeFilter = 'ALL';
  let consoleSortCol = null;
  let consoleSortDir = 'asc';
  let activePanelTaskId = null;
  let openDropdown = null;

  const PROJECT_STATE = ${JSON.stringify(MARRIAGE_PROJECT_STATE, null, 2)};
  window.PROJECT_STATE = PROJECT_STATE;

  const TRADES = PROJECT_STATE.trades;
  const TRADE_META = PROJECT_STATE.trade_meta;
  const PARALLEL_TASKS = new Set(['TSK-001', 'TSK-002', 'FOOD-001', 'TSK-003', 'VEN-001']);

  const CARD_W = 168, CARD_H = 88, COL_W = 196, SLOT_H = 110, ROW_PAD = 12;
  const LABEL_W = 100;

  const STATUS_MAP = { available:'READY', not_started:'LOCKED', in_progress:'ACTIVE', blocked:'HOLD', complete:'DONE', missed_window:'MISSED' };
  const STATUS_LABEL = { READY:'READY', LOCKED:'LOCKED', ACTIVE:'ACTIVE', HOLD:'HOLD', FUTURE_HOLD:'HOLD (LOCKED)', DONE:'DONE', MISSED:'MISSED' };

  const PILL_TITLE = {
    READY:  'READY: all dependencies met — can start immediately',
    LOCKED: 'LOCKED: waiting on prerequisite tasks',
    ACTIVE: 'ACTIVE: task is currently in progress',
    HOLD:   'HOLD: task is blocked or flagged',
    FUTURE_HOLD: 'HOLD (LOCKED): task is blocked, but predecessors are not yet complete',
    DONE:   'DONE: task complete — downstream tasks unlocked',
    MISSED: 'MISSED: window closed before task was completed'
  };

  const taskMap = {};
  PROJECT_STATE.tasks.forEach(t => taskMap[t.id] = t);
  window.taskMap = taskMap;

  const storageKey = PROJECT_STATE.project.storage_key || 'sree_krushna_dopkos_v3';
  let overrides = {};
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const now = new Date().toISOString();
    Object.keys(raw).forEach(k => {
      if (typeof raw[k] === 'string') { overrides[k] = { status: raw[k], since: now }; }
      else overrides[k] = raw[k];
    });
  } catch(e) {}

  function getStatus(taskId) {
    const o = overrides[taskId];
    let baseStatus = 'LOCKED';
    if (o) {
      baseStatus = typeof o === 'object' ? o.status : o;
    } else {
      const t = taskMap[taskId];
      if (t) {
        baseStatus = STATUS_MAP[t.status] || 'LOCKED';
      }
    }
    if (baseStatus === 'HOLD') {
      const t = taskMap[taskId];
      if (t && !(t.depends_on || []).every(depId => getStatus(depId) === 'DONE')) {
        return 'FUTURE_HOLD';
      }
    }
    return baseStatus;
  }

  function setStatus(taskId, uiStatus) {
    overrides[taskId] = { status: uiStatus, since: new Date().toISOString() };
    try {
      localStorage.setItem(storageKey, JSON.stringify(overrides));
    } catch(e) {}
  }

  function toggleCardStatus(taskId, event) {
    if (event) event.stopPropagation();
    const current = getStatus(taskId);
    const nextMap = { 'LOCKED': 'READY', 'READY': 'ACTIVE', 'ACTIVE': 'DONE', 'DONE': 'READY', 'HOLD': 'READY', 'FUTURE_HOLD': 'READY' };
    const nextStatus = nextMap[current] || 'READY';
    setStatus(taskId, nextStatus);
    if (nextStatus === 'DONE') {
      propagateDone(taskId);
    }
    renderDoPkosStudio();
  }

  function propagateDone(taskId) {
    const task = taskMap[taskId];
    if (!task) return;
    PROJECT_STATE.tasks.forEach(t => {
      if (t.depends_on && t.depends_on.includes(taskId)) {
        const allDone = t.depends_on.every(d => getStatus(d) === 'DONE');
        if (allDone && getStatus(t.id) === 'LOCKED') {
          setStatus(t.id, 'READY');
        }
      }
    });
  }

  function computeColumns() {
    const cols = {};
    const computing = new Set();
    const maxStage = PROJECT_STATE.stages && PROJECT_STATE.stages.length ? Math.max(...PROJECT_STATE.stages.map(s => s.id)) : 1;
    const stageMin = new Array(maxStage + 1).fill(0);

    function col(id) {
      if (cols[id] !== undefined) return cols[id];
      if (computing.has(id)) return stageMin[taskMap[id]?.stage||1];
      computing.add(id);
      const t = taskMap[id];
      if (!t) { computing.delete(id); return 0; }
      const m = stageMin[t.stage] || 0;
      if (!t.depends_on || t.depends_on.length === 0) {
        cols[id] = m;
      } else {
        const valid = t.depends_on.filter(d => taskMap[d]);
        const maxDep = valid.length ? Math.max(...valid.map(d => col(d))) : 0;
        cols[id] = Math.max(maxDep + 1, m);
      }
      computing.delete(id);
      return cols[id];
    }

    for (let s = 1; s <= maxStage; s++) {
      if (s > 1) {
        const prev = PROJECT_STATE.tasks.filter(t => t.stage === s-1);
        const prevMax = prev.length ? Math.max(...prev.map(t => cols[t.id] !== undefined ? cols[t.id] : 0)) : 0;
        stageMin[s] = prevMax + 2;
      }
      PROJECT_STATE.tasks.filter(t => t.stage === s).forEach(t => col(t.id));
    }
    return cols;
  }

  let colMap = computeColumns();

  function displayTrade(t) {
    if (!t) return 'role-purohit';
    return t.trade || 'role-purohit';
  }

  let cellTasks = {};
  PROJECT_STATE.tasks.forEach(t => {
    const tr = displayTrade(t);
    const c = colMap[t.id] || 0;
    const key = tr + '|' + c;
    if (!cellTasks[key]) cellTasks[key] = [];
    cellTasks[key].push(t.id);
  });

  let taskPos = {};
  Object.entries(cellTasks).forEach(([key, ids]) => {
    const [trade, col] = [key.substring(0, key.lastIndexOf('|')), key.substring(key.lastIndexOf('|') + 1)];
    ids.forEach((id, i) => taskPos[id] = { col: parseInt(col), trade, subRow: i });
  });

  let rowSlots = {};
  TRADES.forEach(tr => rowSlots[tr] = 1);
  Object.values(taskPos).forEach(p => {
    rowSlots[p.trade] = Math.max(rowSlots[p.trade] || 1, p.subRow + 1);
  });
  let rowH = {};
  TRADES.forEach(tr => rowH[tr] = (rowSlots[tr] || 1) * SLOT_H + ROW_PAD * 2);

  let rowY = {};
  let curY = 0;
  TRADES.forEach(tr => { rowY[tr] = curY; curY += rowH[tr]; });
  let totalH = curY;

  const maxColVals = Object.values(colMap);
  const maxCol = maxColVals.length ? Math.max(...maxColVals) + 1 : 1;
  let totalW = maxCol * COL_W + 60;

  function cardPos(id) {
    const p = taskPos[id];
    if (!p) return null;
    const yBase = rowY[p.trade];
    if (yBase === undefined || isNaN(yBase)) return null;
    return {
      x: p.col * COL_W + 12,
      y: yBase + ROW_PAD + p.subRow * SLOT_H,
    };
  }

  function setDopkosView(viewName) {
    currentDopkosView = viewName;
    syncDopkosViewButtons();
    renderDoPkosStudio();
  }

  function syncDopkosViewButtons() {
    document.querySelectorAll('.dopkos-view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.id === ('btn-view-' + currentDopkosView.toLowerCase()));
    });
  }

  function filterDopkosEvent(evtId) {
    currentDopkosEvent = evtId;
    document.querySelectorAll('.dopkos-event-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-event') === evtId);
    });
    renderDoPkosStudio();
  }

  function filterDopkosTrack(trackId) {
    currentDopkosTrack = trackId;
    document.querySelectorAll('.dopkos-track-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-track') === trackId);
    });
    renderDoPkosStudio();
  }

  function renderDoPkosStudio() {
    const container = document.getElementById('dopkos-canvas-container');
    if (!container) return;
    render5ZoneTopology(container);
  }

  function render5ZoneTopology(container) {
    colMap = computeColumns();
    
    container.innerHTML = '<div id="dopkos-5zone-frame" style="display: flex; flex-direction: column; height: 100%; flex: 1; min-height: 0; position: relative; background: #080b11; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-subtle);">' +
      '<!-- ZONE 1 HUD -->' +
      '<div id="z1" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 16px; background: var(--bg-surface-elevated); border-bottom: 1px solid var(--border-subtle); height: 44px; flex-shrink: 0;">' +
        '<div style="display: flex; align-items: center; gap: 12px;">' +
          '<span id="z1-project" style="font-family: var(--font-display); font-size: 0.92rem; font-weight: 800; color: var(--gold-bright); cursor: pointer;">👑 SREE KRUSHNA MARRIAGE OS ▾</span>' +
          '<span id="z1-stage" style="font-size: 0.74rem; color: var(--text-dim); font-weight: 700;">STAGE 1 OF 6 — T-180 SACRED FOUNDATION</span>' +
        '</div>' +
        '<div id="z1-right" style="display: flex; align-items: center; gap: 10px;">' +
          '<span id="z1-blockers" class="z1-stat red" style="font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px;">⛔ 0 BLOCKERS</span>' +
          '<span id="z1-gates" class="z1-stat amber" style="font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: rgba(245, 158, 11, 0.15); color: #f59e0b;">⚠ 4 GATES</span>' +
          '<span id="z1-ready" class="z1-stat green" style="font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 4px; background: rgba(16, 185, 129, 0.15); color: #10b981;">✓ 3 READY</span>' +
          '<span id="z1-updated" style="font-size: 0.68rem; color: var(--text-dim); font-weight: 600;">AS OF 2026-08-22</span>' +
        '</div>' +
      '</div>' +
      '<!-- ZONE 2 STAGE STRIP -->' +
      '<div id="stage-strip-wrapper" style="position: relative; flex-shrink: 0;">' +
        '<div id="stage-strip" style="display: ' + (stageStripCollapsed ? 'none' : 'flex') + '; gap: 6px; padding: 8px 12px; background: var(--bg-surface); overflow-x: auto; border-bottom: 1px solid var(--border-subtle);"></div>' +
        '<div id="stage-summary-bar" style="display: ' + (stageStripCollapsed ? 'flex' : 'none') + '; height: 28px; background: var(--bg-surface-elevated); border-bottom: 1px solid var(--border-subtle); align-items: center; justify-content: space-between; padding: 0 12px;">' +
          '<div id="stage-summary-content" style="display: flex; align-items: center; gap: 10px; font-size: 0.74rem; font-weight: 700; color: var(--gold-bright);"></div>' +
          '<button id="stage-expand-btn" class="theme-toggle-btn" onclick="toggleStageStrip()" style="font-size: 0.68rem; padding: 2px 6px;">EXPAND STAGES ▾</button>' +
        '</div>' +
      '</div>' +
      '<!-- ZONE 3 MULTI-TRACK SWIMLANE -->' +
      '<div id="z3" style="flex: 1; position: relative; overflow: hidden; background: #080b11;">' +
        '<div id="swimlane-scroll" style="width: 100%; height: 100%; overflow: auto; position: relative;">' +
          '<div id="stage-header-row" style="height: 32px; background: var(--bg-surface-elevated); border-bottom: 2px solid var(--border-subtle); position: sticky; top: 0; z-index: 30; width: ' + (totalW + LABEL_W) + 'px;">' +
            '<div class="label-corner" style="width: 100px; height: 32px; position: sticky; left: 0; background: var(--bg-surface-elevated); z-index: 40; border-right: 2px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: var(--gold-bright);">TRACK</div>' +
            '<div id="stage-header-bands-inner" style="position: absolute; left: 100px; top: 0; height: 32px;"></div>' +
          '</div>' +
          '<div id="swimlane-inner" style="position: relative; width: ' + (totalW + LABEL_W) + 'px; height: ' + totalH + 'px;"></div>' +
        '</div>' +
        '<!-- SLIDE-OVER DETAIL / INSPECTOR PANEL -->' +
        '<div id="detail-panel">' +
          '<div id="panel-header" style="padding: 12px 16px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-surface);"></div>' +
          '<div id="panel-body" style="flex: 1; overflow-y: auto;"></div>' +
        '</div>' +
        '<!-- NAVIGATOR / ZOOM CONTROL HUD -->' +
        '<div id="console-navigator">' +
          '<button id="zoom-pan" class="nav-btn ' + (panMode ? 'active' : '') + '" onclick="togglePanMode()" title="Toggle Pan Mode (or hold Space)">✋ PAN</button>' +
          '<div id="nav-zoom-controls">' +
            '<button id="zoom-out" class="nav-btn" onclick="applyZoom(zoomLevel - 0.1)">−</button>' +
            '<span id="zoom-label" style="font-size: 0.72rem; font-weight: 800; min-width: 38px; text-align: center; font-family: monospace;">' + Math.round(zoomLevel * 100) + '%</span>' +
            '<button id="zoom-in" class="nav-btn" onclick="applyZoom(zoomLevel + 0.1)">+</button>' +
            '<button id="zoom-reset" class="nav-btn" onclick="applyZoom(1.0)">100%</button>' +
            '<button id="zoom-fit" class="nav-btn" onclick="fitZoom()">FIT</button>' +
            '<button id="zoom-fullscreen" class="nav-btn" onclick="toggleFullscreen()">FULL</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<!-- ZONE 4 & 5 UNIFIED COMMAND CONSOLE SHEET -->' +
      '<div id="console-backdrop" onclick="toggleConsoleExpand(false)"></div>' +
      '<div id="z45" class="' + (consoleExpanded ? 'expanded' : '') + '">' +
        '<div id="console-top">' +
          '<div style="display: flex; align-items: center; gap: 8px;">' +
            '<span style="font-size: 0.76rem; font-weight: 800; color: var(--gold-bright); font-family: var(--font-display);">⚡ COMMAND CONSOLE</span>' +
            '<button id="console-blockers-widget" class="console-widget" onclick="setFilter(\\\'HOLD\\\')">⛔ 0 BLOCKERS</button>' +
            '<button id="console-gates-widget" class="console-widget has-gates" onclick="setFilter(\\\'ALL\\\')">⚠ 4 GATES</button>' +
            '<input type="text" id="console-search" placeholder="Search tasks, roles, tags..." oninput="renderConsoleList()" />' +
          '</div>' +
          '<div id="console-filters">' +
            '<button class="filter-pill ' + (activeFilter === 'ALL' ? 'active' : '') + '" onclick="setFilter(\\\'ALL\\\')">ALL</button>' +
            '<button class="filter-pill ' + (activeFilter === 'READY' ? 'active' : '') + '" onclick="setFilter(\\\'READY\\\')">READY</button>' +
            '<button class="filter-pill ' + (activeFilter === 'ACTIVE' ? 'active' : '') + '" onclick="setFilter(\\\'ACTIVE\\\')">ACTIVE</button>' +
            '<button class="filter-pill ' + (activeFilter === 'HOLD' ? 'active' : '') + '" onclick="setFilter(\\\'HOLD\\\')">HOLD</button>' +
            '<button class="filter-pill ' + (activeFilter === 'DONE' ? 'active' : '') + '" onclick="setFilter(\\\'DONE\\\')">DONE</button>' +
          '</div>' +
          '<div class="console-export-container">' +
            '<button id="console-export-btn" class="header-action-btn" onclick="toggleExportMenu(event)" style="font-size: 0.72rem; padding: 2px 8px;">EXPORT ▾</button>' +
            '<div id="console-export-dropdown" class="console-export-dropdown">' +
              '<button class="console-export-item" onclick="copyConsoleTasksTSV()">📋 Copy TSV (Excel / Sheets)</button>' +
              '<button class="console-export-item" onclick="downloadConsoleTasksCSV()">📥 Download CSV</button>' +
              '<button class="console-export-item" onclick="downloadConsoleTasksJSON()">💾 Download JSON</button>' +
            '</div>' +
          '</div>' +
          '<div class="console-zoom-group">' +
            '<button id="console-table-zoom-out" class="console-zoom-btn" onclick="applyTableZoom(tableZoomLevel - 0.1)">−</button>' +
            '<span id="console-table-zoom-reset" class="console-zoom-btn console-zoom-val" onclick="applyTableZoom(1.0)">' + Math.round(tableZoomLevel * 100) + '%</span>' +
            '<button id="console-table-zoom-in" class="console-zoom-btn" onclick="applyTableZoom(tableZoomLevel + 0.1)">+</button>' +
          '</div>' +
          '<button id="console-expand-toggle-btn" class="theme-toggle-btn" onclick="toggleConsoleExpand()" style="font-size: 0.72rem; padding: 3px 8px; font-weight: 700;">' + (consoleExpanded ? '⤡ RESTORE' : '⛶ EXPAND') + '</button>' +
        '</div>' +
        '<div id="console-list"></div>' +
      '</div>' +
    '</div>';

    renderZ1();
    renderStageStrip();
    renderStageHeaderBands();
    renderSwimlaneGrid();
    renderConsoleList();
    renderStageSummaryBar();
    updateScrollSpy();
    applyZoom(zoomLevel);
    bindSwimlaneScrollEvents();
  }

  function renderZ1() {
    const proj = document.getElementById('z1-project');
    if (proj && PROJECT_STATE.project) proj.textContent = (PROJECT_STATE.project.name || PROJECT_STATE.project.id) + ' ▾';

    const activeStage = PROJECT_STATE.project ? (PROJECT_STATE.project.active_stage || 1) : 1;
    const stageObj = (PROJECT_STATE.stages || []).find(s => s.id === activeStage);
    const stageEl = document.getElementById('z1-stage');
    if (stageEl) {
      stageEl.textContent = 'STAGE ' + activeStage + ' OF ' + (PROJECT_STATE.stages ? PROJECT_STATE.stages.length : 6) + ' — ' + (stageObj ? stageObj.name.toUpperCase() : '');
    }

    const holdCount = PROJECT_STATE.tasks.filter(t => getStatus(t.id) === 'HOLD' || getStatus(t.id) === 'FUTURE_HOLD').length;
    const readyCount = PROJECT_STATE.tasks.filter(t => getStatus(t.id) === 'READY').length;
    const doneCount = PROJECT_STATE.tasks.filter(t => getStatus(t.id) === 'DONE').length;

    const bEl = document.getElementById('z1-blockers');
    if (bEl) {
      bEl.textContent = '⛔ ' + holdCount + ' BLOCKER' + (holdCount !== 1 ? 'S' : '');
      bEl.className = 'z1-stat ' + (holdCount ? 'red' : 'green');
    }

    const bw = document.getElementById('console-blockers-widget');
    if (bw) {
      bw.textContent = '⛔ ' + holdCount + ' BLOCKER' + (holdCount !== 1 ? 'S' : '');
      bw.className = 'console-widget' + (holdCount ? ' has-issues' : '');
    }

    const rEl = document.getElementById('z1-ready');
    if (rEl) {
      rEl.textContent = '✓ ' + readyCount + ' READY';
    }
  }

  function renderStageStrip() {
    const strip = document.getElementById('stage-strip');
    if (!strip) return;
    strip.innerHTML = '';
    const activeStage = PROJECT_STATE.project.active_stage || 1;

    PROJECT_STATE.stages.forEach(s => {
      const stageTasks = PROJECT_STATE.tasks.filter(t => t.stage === s.id);
      const doneCount = stageTasks.filter(t => getStatus(t.id) === 'DONE').length;
      const total = stageTasks.length;
      const pct = total ? Math.round(doneCount / total * 100) : 0;
      const isActive = s.id === activeStage;
      const isDone = doneCount === total && total > 0;

      const card = document.createElement('div');
      card.className = 'stage-card ' + (isDone ? 'done' : isActive ? 'active' : '');
      card.style.cssText = 'flex: 1; min-width: 140px; padding: 8px 12px; border-radius: 6px; background: var(--bg-surface-elevated); border: 1px solid ' + (isActive ? 'var(--gold-bright)' : 'var(--border-subtle)') + '; cursor: pointer;';
      
      const dots = (s.trades_active || []).map(tr => '<div class="trade-dot" style="background: ' + (TRADE_META[tr]?.color || '#555') + ';" title="' + tr + '"></div>').join('');

      card.innerHTML = '<div class="stage-num" style="font-size: 0.68rem; font-weight: 800; color: var(--gold-bright);">STAGE ' + s.id + '</div>' +
        '<div class="stage-name" style="font-size: 0.78rem; font-weight: 700; color: var(--text-main); margin: 2px 0 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + s.name + '</div>' +
        '<div class="stage-progress" style="height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-bottom: 4px;"><div class="stage-progress-fill" style="height: 100%; width: ' + pct + '%; background: var(--gold-bright);"></div></div>' +
        '<div class="stage-badges" style="display: flex; gap: 4px;">' + dots + '</div>';

      card.addEventListener('click', () => scrollToStage(s.id));
      strip.appendChild(card);
    });
  }

  function renderStageSummaryBar() {
    const content = document.getElementById('stage-summary-content');
    if (!content) return;
    const activeStageId = PROJECT_STATE.project ? (PROJECT_STATE.project.active_stage || 1) : 1;
    const activeStage = (PROJECT_STATE.stages || []).find(s => s.id === activeStageId);
    content.innerHTML = '<span style="color: var(--gold-bright);">STAGE ' + activeStageId + ' ACTIVE — ' + (activeStage ? activeStage.name.toUpperCase() : '') + '</span>';
  }

  function toggleStageStrip() {
    stageStripCollapsed = !stageStripCollapsed;
    const strip = document.getElementById('stage-strip');
    const summary = document.getElementById('stage-summary-bar');
    if (strip) strip.style.display = stageStripCollapsed ? 'none' : 'flex';
    if (summary) summary.style.display = stageStripCollapsed ? 'flex' : 'none';
    if (stageStripCollapsed) renderStageSummaryBar();
  }

  function renderStageHeaderBands() {
    const inner = document.getElementById('stage-header-bands-inner');
    if (!inner) return;
    inner.innerHTML = '';
    const stages = PROJECT_STATE.stages || [];
    const stageCols = [];
    stages.forEach((s, idx) => {
      const stageTasks = PROJECT_STATE.tasks.filter(t => t.stage === s.id);
      if (!stageTasks.length) return;
      const minCol = Math.min(...stageTasks.map(t => colMap[t.id] || 0));
      const maxCol = Math.max(...stageTasks.map(t => colMap[t.id] || 0));
      stageCols.push({ stage: s, minCol, maxCol, idx });
    });

    stageCols.forEach((sc, i) => {
      const s = sc.stage;
      const band = document.createElement('div');
      band.className = 'stage-header-band';
      const startCol = sc.minCol;
      const nextStage = stageCols[i + 1];
      const endCol = nextStage ? nextStage.minCol : (sc.maxCol + 1);
      
      band.style.left = (startCol * COL_W) + 'px';
      band.style.width = ((endCol - startCol) * COL_W) + 'px';
      band.style.cssText = 'position: absolute; top: 0; height: 32px; display: flex; align-items: center; padding: 0 12px; font-size: 0.72rem; font-weight: 800; color: var(--gold-bright); border-right: 1px solid var(--border-subtle); cursor: pointer; left: ' + (startCol * COL_W) + 'px; width: ' + ((endCol - startCol) * COL_W) + 'px;';
      band.textContent = 'S' + s.id + '  ' + s.name.toUpperCase();
      band.addEventListener('click', () => scrollToStage(s.id));
      inner.appendChild(band);
    });
  }

  function renderSwimlaneGrid() {
    const inner = document.getElementById('swimlane-inner');
    if (!inner) return;
    inner.innerHTML = '';

    inner.addEventListener('click', (e) => {
      if (e.target === inner || e.target.id === 'dep-svg' || e.target.classList.contains('trade-row') || e.target.classList.contains('trade-content')) {
        clearHighlights();
        selectedTopologyTaskId = null;
        closePanel();
      }
    });

    TRADES.forEach(tr => {
      const row = document.createElement('div');
      row.className = 'trade-row';
      row.style.cssText = 'display: flex; height: ' + (rowH[tr] || SLOT_H) + 'px; border-bottom: 1px solid var(--border-subtle); position: relative;';
      
      const label = document.createElement('div');
      label.className = 'trade-label ' + tr;
      label.style.cssText = 'width: 100px; flex-shrink: 0; position: sticky; left: 0; background: var(--bg-surface-elevated); z-index: 20; display: flex; align-items: center; justify-content: center; font-size: 0.74rem; font-weight: 800; border-right: 2px solid ' + (TRADE_META[tr]?.color || '#555') + '; color: ' + (TRADE_META[tr]?.color || '#555') + ';';
      label.textContent = TRADE_META[tr]?.label || tr;
      row.appendChild(label);
      
      const content = document.createElement('div');
      content.className = 'trade-content ' + tr + '-content';
      content.style.cssText = 'flex: 1; position: relative;';
      row.appendChild(content);

      inner.appendChild(row);
    });

    PROJECT_STATE.tasks.forEach(t => {
      const tr = displayTrade(t);
      const pos = cardPos(t.id);
      if (!pos) return;
      const card = buildCard(t);
      card.style.left = pos.x + 'px';
      card.style.top = (pos.y - (rowY[tr] || 0)) + 'px';
      card.style.width = CARD_W + 'px';
      
      const contentContainer = inner.querySelector('.trade-content.' + tr + '-content');
      if (contentContainer) {
        contentContainer.appendChild(card);
      }
    });

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'dep-svg';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = LABEL_W + 'px';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '1';
    svg.setAttribute('width', totalW + 'px');
    svg.setAttribute('height', totalH + 'px');

    PROJECT_STATE.tasks.forEach(t => {
      (t.depends_on || []).forEach(depId => {
        drawDepLine(svg, depId, t.id, t.dependency_type);
      });
    });

    inner.appendChild(svg);
  }

  function drawDepLine(svg, fromId, toId, depType) {
    const fp = cardPos(fromId);
    const tp = cardPos(toId);
    if (!fp || !tp) return;

    const x1 = fp.x + CARD_W;
    const y1 = fp.y + CARD_H / 2;
    const x2 = tp.x;
    const y2 = tp.y + CARD_H / 2;

    let color = 'rgba(245, 197, 24, 0.4)';
    let strokeWidth = 1.6;
    let dashArray = 'none';

    if (depType === 'must_precede_sealing') { 
      color = '#f59e0b'; 
      strokeWidth = 2.2; 
    }
    else if (depType === 'must_happen_during') { 
      color = '#38bdf8'; 
      strokeWidth = 2.2; 
      dashArray = '5,3'; 
    }

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const pathD = 'M' + x1 + ',' + y1 + ' C' + midX + ',' + y1 + ' ' + midX + ',' + y2 + ' ' + x2 + ',' + y2;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'dep-edge');
    g.setAttribute('data-from', fromId);
    g.setAttribute('data-to', toId);

    const visiblePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    visiblePath.setAttribute('class', 'visible-path');
    visiblePath.setAttribute('d', pathD);
    visiblePath.setAttribute('stroke', color);
    visiblePath.setAttribute('stroke-width', strokeWidth);
    visiblePath.setAttribute('fill', 'none');
    if (dashArray !== 'none') visiblePath.setAttribute('stroke-dasharray', dashArray);
    visiblePath.setAttribute('data-from', fromId);
    visiblePath.setAttribute('data-to', toId);
    g.appendChild(visiblePath);

    const hitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    hitPath.setAttribute('class', 'hit-path');
    hitPath.setAttribute('d', pathD);
    hitPath.setAttribute('stroke', 'transparent');
    hitPath.setAttribute('stroke-width', '14');
    hitPath.setAttribute('fill', 'none');
    hitPath.setAttribute('data-from', fromId);
    hitPath.setAttribute('data-to', toId);
    hitPath.style.pointerEvents = 'stroke';
    hitPath.style.cursor = 'pointer';
    g.appendChild(hitPath);

    g.addEventListener('mouseenter', () => {
      const fromCard = document.querySelector('.task-card[data-id="' + fromId + '"]');
      const toCard = document.querySelector('.task-card[data-id="' + toId + '"]');
      if (fromCard) fromCard.classList.add('edge-hovered');
      if (toCard) toCard.classList.add('edge-hovered');
    });

    g.addEventListener('mouseleave', () => {
      const fromCard = document.querySelector('.task-card[data-id="' + fromId + '"]');
      const toCard = document.querySelector('.task-card[data-id="' + toId + '"]');
      if (fromCard) fromCard.classList.remove('edge-hovered');
      if (toCard) toCard.classList.remove('edge-hovered');
    });

    g.addEventListener('click', e => {
      e.stopPropagation();
      selectAndCenterCard(fromId, true);
      openPanel(fromId);
    });

    svg.appendChild(g);
  }

  function buildCard(t) {
    const status = getStatus(t.id);
    const card = document.createElement('div');
    card.className = 'task-card status-' + status;
    card.setAttribute('data-id', t.id);
    if (card.dataset) card.dataset.id = t.id;

    const tr = displayTrade(t);
    const trColor = TRADE_META[tr]?.color || '#555';
    card.style.borderLeftColor = trColor;
    card.style.borderLeftWidth = '3px';

    let depIcon = '';
    if (t.dependency_type === 'must_precede_sealing') depIcon = '<span class="card-dep-icon" title="Type 3: Must precede sealing">🔒</span>';
    else if (t.dependency_type === 'must_happen_during') depIcon = '<span class="card-dep-icon" title="Type 2: Embedded window">⚡</span>';

    let gateRef = t.sealing_gate ? '<div class="card-gate" style="font-size: 0.62rem; color: #f59e0b; font-weight: 700;">Gate: ' + t.sealing_gate + '</div>' : '';

    card.innerHTML = '<div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">' +
        '<span class="card-id" style="font-family: monospace; font-size: 0.68rem; font-weight: 800; color: var(--gold-bright);">' + t.id + '</span>' +
        depIcon +
      '</div>' +
      '<div class="card-name" style="font-size: 0.76rem; font-weight: 700; color: var(--text-main); line-height: 1.25; max-height: 2.5em; overflow: hidden; margin: 2px 0 4px;">' + t.name + '</div>' +
      gateRef +
      '<div class="card-dropdown" id="drop-' + t.id + '"></div>' +
      '<button class="status-pill ' + status + '" data-action="pill" data-id="' + t.id + '" onclick="toggleCardStatus(\\\'' + t.id + '\\\', event)" title="' + (PILL_TITLE[status] || '') + '" style="font-size: 0.62rem; font-weight: 800; padding: 2px 6px; border-radius: 3px; border: 1px solid transparent; cursor: pointer;">' + STATUS_LABEL[status] + '</button>';

    card.addEventListener('click', e => {
      e.stopPropagation();
      selectAndCenterCard(t.id, true);
      openPanel(t.id);
    });

    return card;
  }

  function openPanel(taskId) {
    const t = taskMap[taskId];
    if (!t) return;

    activePanelTaskId = taskId;
    const tr = displayTrade(t);
    const trColor = TRADE_META[tr]?.color || '#555';
    const status = getStatus(taskId);

    const panel = document.getElementById('detail-panel');
    if (panel) panel.style.borderLeftColor = trColor;

    const header = document.getElementById('panel-header');
    if (header) {
      header.innerHTML = '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">' +
          '<span style="font-family: monospace; font-size: 0.9rem; font-weight: 800; color: ' + trColor + ';">' + t.id + '</span>' +
          '<button onclick="closePanel()" style="background: none; border: none; color: var(--text-dim); font-size: 1.2rem; cursor: pointer;">✕</button>' +
        '</div>' +
        '<div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main); line-height: 1.3; margin-bottom: 8px;">' + t.name + '</div>' +
        '<div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">' +
          '<span class="status-mini ' + status + '" style="font-size: 0.68rem; font-weight: 700; padding: 2px 8px; border-radius: 3px; background: var(--bg-surface-elevated);">' + STATUS_LABEL[status] + '</span>' +
          '<span style="font-size: 0.74rem; font-weight: 800; color: ' + trColor + ';">' + (TRADE_META[tr]?.label || tr) + '</span>' +
          '<span style="font-size: 0.74rem; color: var(--text-dim);">Stage ' + t.stage + '</span>' +
        '</div>';
    }

    const body = document.getElementById('panel-body');
    if (body) {
      body.innerHTML = '';

      if (t.unlocks && t.unlocks.length) {
        body.appendChild(buildPanelSection('UNLOCKS WHEN DONE', t.unlocks.map(uid => ({
          id: uid, task: taskMap[uid],
          color: taskMap[uid] ? (TRADE_META[displayTrade(taskMap[uid])]?.color || '#555') : '#555',
          status: getStatus(uid)
        }))));
      }

      if (t.depends_on && t.depends_on.length) {
        body.appendChild(buildPanelSection('DEPENDS ON (PREDECESSORS)', t.depends_on.map(did => ({
          id: did, task: taskMap[did],
          color: taskMap[did] ? (TRADE_META[displayTrade(taskMap[did])]?.color || '#555') : '#555',
          status: getStatus(did)
        }))));
      }

      if (t.notes) {
        const sec = document.createElement('div');
        sec.className = 'panel-section';
        sec.innerHTML = '<div class="panel-section-title">NOTES & SCOPE</div><div style="font-size: 0.78rem; color: var(--text-dim); line-height: 1.5;">' + t.notes + '</div>';
        body.appendChild(sec);
      }

      if (t.lead || t.phone) {
        const sec = document.createElement('div');
        sec.className = 'panel-section';
        sec.innerHTML = '<div class="panel-section-title">LEAD COORDINATOR</div>' +
          '<div style="font-size: 0.8rem; font-weight: 700; color: var(--text-main);">' + (t.lead || 'Family Elder') + '</div>' +
          (t.phone ? '<div style="margin-top: 8px; display: flex; gap: 8px;">' +
            '<a href="tel:' + t.phone + '" class="header-action-btn" style="font-size: 0.72rem; padding: 4px 10px; text-decoration: none;">📞 Call</a>' +
            '<a href="https://wa.me/' + t.phone.replace(/[^0-9]/g, '') + '" target="_blank" class="header-action-btn btn-gold" style="font-size: 0.72rem; padding: 4px 10px; text-decoration: none;">💬 WhatsApp</a>' +
          '</div>' : '');
        body.appendChild(sec);
      }
    }

    if (panel) panel.classList.add('open');
  }

  function buildPanelSection(title, items) {
    const sec = document.createElement('div');
    sec.className = 'panel-section';
    
    const titleEl = document.createElement('div');
    titleEl.className = 'panel-section-title';
    titleEl.textContent = title + ' (' + items.length + ')';
    sec.appendChild(titleEl);

    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'panel-chips-container';
    chipsContainer.style.cssText = 'display: flex; gap: 6px; flex-wrap: wrap; margin-top: 6px;';

    items.forEach(({ id, task, color, status }) => {
      const chip = document.createElement('button');
      chip.className = 'dep-chip';
      chip.style.borderLeftColor = color;
      chip.innerHTML = '<span style="font-family: monospace; font-weight: 800;">' + id + '</span>' +
        '<span style="font-size: 0.65rem; color: var(--text-dim);">' + (STATUS_LABEL[status] || status) + '</span>';

      chip.addEventListener('click', e => {
        e.stopPropagation();
        selectAndCenterCard(id, true);
        openPanel(id);
      });

      chipsContainer.appendChild(chip);
    });

    sec.appendChild(chipsContainer);
    return sec;
  }

  function closePanel() {
    const panel = document.getElementById('detail-panel');
    if (panel) panel.classList.remove('open');
    activePanelTaskId = null;
  }

  function renderConsoleList() {
    const list = document.getElementById('console-list');
    if (!list) return;
    list.innerHTML = '';

    const searchInput = document.getElementById('console-search');
    const query = searchInput ? (searchInput.value || '').trim().toLowerCase() : '';

    let tasks = PROJECT_STATE.tasks.filter(t => {
      const s = getStatus(t.id);
      if (activeFilter === 'READY' && s !== 'READY') return false;
      if (activeFilter === 'ACTIVE' && s !== 'ACTIVE') return false;
      if (activeFilter === 'HOLD' && s !== 'HOLD' && s !== 'FUTURE_HOLD' && s !== 'MISSED') return false;
      if (activeFilter === 'DONE' && s !== 'DONE') return false;

      if (query) {
        const matchId = t.id.toLowerCase().includes(query);
        const matchName = t.name.toLowerCase().includes(query);
        const matchTrade = displayTrade(t).toLowerCase().includes(query);
        if (!matchId && !matchName && !matchTrade) return false;
      }
      return true;
    });

    if (!tasks.length) {
      list.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text-dim);font-size:0.78rem;">NO MATCHING TASKS FOUND</div>';
      return;
    }

    if (consoleExpanded) {
      let tableHtml = '<table style="width: 100%; border-collapse: collapse; font-size: 0.76rem;">' +
        '<thead><tr style="background: var(--bg-surface-elevated); color: var(--gold-bright); border-bottom: 2px solid var(--border-subtle);">' +
          '<th style="padding: 6px 10px; text-align: left;">TRADE</th>' +
          '<th style="padding: 6px 10px; text-align: left;">ID</th>' +
          '<th style="padding: 6px 10px; text-align: left;">TASK NAME</th>' +
          '<th style="padding: 6px 10px; text-align: left;">STAGE</th>' +
          '<th style="padding: 6px 10px; text-align: left;">STATUS</th>' +
          '<th style="padding: 6px 10px; text-align: left;">PREDECESSORS</th>' +
          '<th style="padding: 6px 10px; text-align: left;">UNLOCKS</th>' +
        '</tr></thead><tbody>';

      tasks.forEach(t => {
        const status = getStatus(t.id);
        const tr = displayTrade(t);
        const color = TRADE_META[tr]?.color || '#555';
        const preds = (t.depends_on || []).join(', ') || '—';
        const succs = (t.unlocks || []).join(', ') || '—';

        tableHtml += '<tr onclick="selectAndCenterCard(\\\'' + t.id + '\\\', true); openPanel(\\\'' + t.id + '\\\')" style="border-bottom: 1px solid var(--border-subtle); cursor: pointer;" onmouseover="this.style.background=\\\'rgba(255,255,255,0.04)\\\'" onmouseout="this.style.background=\\\'transparent\\\'">' +
          '<td style="padding: 6px 10px;"><span style="background:' + color + '22; color:' + color + '; padding: 2px 6px; border-radius: 3px; font-weight: 700;">' + (TRADE_META[tr]?.label || tr) + '</span></td>' +
          '<td style="padding: 6px 10px; font-family: monospace; font-weight: 800; color: var(--gold-bright);">' + t.id + '</td>' +
          '<td style="padding: 6px 10px; font-weight: 600; color: var(--text-main);">' + t.name + '</td>' +
          '<td style="padding: 6px 10px; color: var(--text-dim);">S' + t.stage + '</td>' +
          '<td style="padding: 6px 10px;"><span class="status-mini ' + status + '" style="font-size:0.68rem; padding:2px 6px; border-radius:3px; font-weight:700; background:var(--bg-surface);">' + STATUS_LABEL[status] + '</span></td>' +
          '<td style="padding: 6px 10px; font-family: monospace; font-size: 0.7rem; color: #f59e0b;">' + preds + '</td>' +
          '<td style="padding: 6px 10px; font-family: monospace; font-size: 0.7rem; color: #38bdf8;">' + succs + '</td>' +
        '</tr>';
      });

      tableHtml += '</tbody></table>';
      list.innerHTML = tableHtml;
      return;
    }

    tasks.forEach(t => {
      const status = getStatus(t.id);
      const tr = displayTrade(t);
      const color = TRADE_META[tr]?.color || '#555';

      const row = document.createElement('div');
      row.className = 'console-task-row';
      row.style.cssText = 'display:flex;align-items:center;gap:10px;padding:6px 12px;border-bottom:1px solid var(--border-subtle);cursor:pointer;';
      row.setAttribute('data-id', t.id);
      if (row.dataset) row.dataset.id = t.id;

      row.innerHTML = '<span style="background:' + color + '22;color:' + color + ';font-size:0.72rem;padding:2px 6px;border-radius:3px;font-weight:700;">' + (TRADE_META[tr]?.label || tr) + '</span>' +
        '<span style="font-family:monospace;font-weight:800;color:var(--gold-bright);font-size:0.78rem;min-width:60px;">' + t.id + '</span>' +
        '<span style="flex:1;font-size:0.8rem;color:var(--text-main);font-weight:600;">' + t.name + '</span>' +
        '<span class="status-mini ' + status + '" style="font-size:0.7rem;padding:2px 6px;border-radius:3px;font-weight:700;background:var(--bg-surface);">' + STATUS_LABEL[status] + '</span>';

      row.addEventListener('click', () => {
        selectAndCenterCard(t.id, true);
        openPanel(t.id);
      });
      list.appendChild(row);
    });
  }

  function toggleConsoleExpand(forceState) {
    consoleExpanded = typeof forceState === 'boolean' ? forceState : !consoleExpanded;
    render5ZoneTopology(document.getElementById('dopkos-canvas-container'));
  }

  function applyTableZoom(newZoom) {
    tableZoomLevel = Math.min(1.5, Math.max(0.7, Math.round(newZoom * 100) / 100));
    renderConsoleList();
    const lbl = document.getElementById('console-table-zoom-reset');
    if (lbl) lbl.textContent = Math.round(tableZoomLevel * 100) + '%';
  }

  function toggleExportMenu(e) {
    if (e) e.stopPropagation();
    const dropdown = document.getElementById('console-export-dropdown');
    if (dropdown) dropdown.classList.toggle('open');
  }

  function copyConsoleTasksTSV() {
    const tasks = PROJECT_STATE.tasks;
    const headers = ["ID", "Name", "Trade", "Stage", "Status", "Predecessors", "Unlocks"];
    const rows = tasks.map(t => [t.id, t.name, t.trade, t.stage, getStatus(t.id), (t.depends_on || []).join(', '), (t.unlocks || []).join(', ')].join('\\t'));
    const tsv = [headers.join('\\t'), ...rows].join('\\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tsv).then(() => alert('Copied ' + tasks.length + ' tasks to clipboard (TSV)!'));
    }
  }

  function downloadConsoleTasksCSV() {
    const tasks = PROJECT_STATE.tasks;
    const headers = ["ID", "Name", "Trade", "Stage", "Status", "Predecessors", "Unlocks"];
    const rows = tasks.map(t => ['"' + t.id + '"', '"' + t.name + '"', '"' + t.trade + '"', t.stage, '"' + getStatus(t.id) + '"', '"' + (t.depends_on || []).join(', ') + '"', '"' + (t.unlocks || []).join(', ') + '"'].join(','));
    const csv = [headers.join(','), ...rows].join('\\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sree_Krushna_Tasks.csv';
    a.click();
  }

  function downloadConsoleTasksJSON() {
    const jsonStr = JSON.stringify(PROJECT_STATE, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sree_Krushna_Project_State.json';
    a.click();
  }

  function applyZoom(newZoom) {
    zoomLevel = Math.max(0.5, Math.min(1.5, +newZoom.toFixed(2)));
    const lbl = document.getElementById('zoom-label');
    if (lbl) lbl.textContent = Math.round(zoomLevel * 100) + '%';

    const inner = document.getElementById('swimlane-inner');
    if (inner) {
      inner.style.transform = zoomLevel === 1.0 ? '' : 'scale(' + zoomLevel + ')';
      inner.style.transformOrigin = 'top left';
    }
  }

  function fitZoom() {
    const scrollEl = document.getElementById('swimlane-scroll');
    if (!scrollEl) return;
    const fit = Math.min(scrollEl.clientWidth / (totalW + LABEL_W), (scrollEl.clientHeight - 32) / totalH);
    applyZoom(fit);
    scrollEl.scrollLeft = 0; scrollEl.scrollTop = 0;
  }

  let _isFullscreen = false;
  function toggleFullscreen() {
    if (!_isFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
      _isFullscreen = true;
    } else {
      document.exitFullscreen().catch(() => {});
      _isFullscreen = false;
    }
  }

  function togglePanMode() {
    panMode = !panMode;
    const btn = document.getElementById('zoom-pan');
    const scrollEl = document.getElementById('swimlane-scroll');
    if (btn) btn.classList.toggle('active', panMode);
    if (scrollEl) scrollEl.classList.toggle('pan-mode', panMode);
  }

  function bindSwimlaneScrollEvents() {
    const scrollContainerEl = document.getElementById('swimlane-scroll');
    if (!scrollContainerEl) return;

    scrollContainerEl.addEventListener('mousedown', e => {
      if (panMode || spacePanActive) {
        isDragging = true;
        hasDragged = false;
        scrollContainerEl.classList.add('dragging');
        startX = e.clientX;
        startY = e.clientY;
        scrollXStart = scrollContainerEl.scrollLeft;
        scrollYStart = scrollContainerEl.scrollTop;
        e.preventDefault();
      }
    });

    window.addEventListener('mousemove', e => {
      if (isDragging && scrollContainerEl) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
        scrollContainerEl.scrollLeft = scrollXStart - dx;
        scrollContainerEl.scrollTop = scrollYStart - dy;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging && scrollContainerEl) {
        isDragging = false;
        scrollContainerEl.classList.remove('dragging');
      }
    });
  }

  function updateScrollSpy() {
  }

  function clearHighlights() {
    const swimlaneInner = document.getElementById('swimlane-inner');
    const depSvg = document.getElementById('dep-svg');
    if (swimlaneInner) swimlaneInner.classList.remove('selection-active');
    if (depSvg) depSvg.classList.remove('selection-active');

    document.querySelectorAll('.task-card').forEach(card => {
      card.classList.remove('is-selected', 'is-predecessor', 'is-successor', 'edge-hovered');
    });

    if (depSvg) {
      depSvg.querySelectorAll('g.dep-edge').forEach(g => {
        g.classList.remove('is-highlighted', 'is-predecessor-line', 'is-successor-line');
      });
    }
  }

  function highlightSvgLines(taskId, dependsOn, unlocks) {
    const depSvg = document.getElementById('dep-svg');
    if (!depSvg) return;

    depSvg.querySelectorAll('g.dep-edge').forEach(g => {
      const from = g.getAttribute('data-from');
      const to = g.getAttribute('data-to');

      if (to === taskId && dependsOn.includes(from)) {
        g.classList.add('is-highlighted', 'is-predecessor-line');
      } else if (from === taskId && unlocks.includes(to)) {
        g.classList.add('is-highlighted', 'is-successor-line');
      } else {
        g.classList.remove('is-highlighted', 'is-predecessor-line', 'is-successor-line');
      }
    });
  }

  function scrollToHighlightedSubgraph(taskId, dependsOn, unlocks, forceScroll = false) {
    const scrollEl = document.getElementById('swimlane-scroll');
    const clickedPos = cardPos(taskId);
    if (!scrollEl || !clickedPos) return;

    let minX = clickedPos.x;
    let maxX = minX + CARD_W;

    dependsOn.forEach(depId => {
      const pos = cardPos(depId);
      if (pos) {
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x + CARD_W);
      }
    });

    unlocks.forEach(succId => {
      const pos = cardPos(succId);
      if (pos) {
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x + CARD_W);
      }
    });

    const visibleWidth = scrollEl.clientWidth;
    const subGraphWidth = maxX - minX;

    let targetScrollLeft = scrollEl.scrollLeft;
    if (subGraphWidth > visibleWidth) {
      targetScrollLeft = clickedPos.x + CARD_W / 2 - visibleWidth / 2;
    } else {
      const subGraphCenter = (minX + maxX) / 2;
      targetScrollLeft = subGraphCenter - visibleWidth / 2;
    }

    let targetScrollTop = clickedPos.y + CARD_H / 2 - scrollEl.clientHeight / 2;

    scrollEl.scrollTo({
      left: Math.max(0, targetScrollLeft),
      top: Math.max(0, targetScrollTop),
      behavior: 'smooth'
    });
  }

  function applyHighlights(taskId) {
    const t = taskMap[taskId];
    if (!t) return;

    clearHighlights();

    const swimlaneInner = document.getElementById('swimlane-inner');
    const depSvg = document.getElementById('dep-svg');
    if (swimlaneInner) swimlaneInner.classList.add('selection-active');
    if (depSvg) depSvg.classList.add('selection-active');

    const card = document.querySelector('.task-card[data-id="' + taskId + '"]');
    if (card) {
      card.classList.add('is-selected');
    }

    const dependsOn = t.depends_on || [];
    dependsOn.forEach(predId => {
      const predCard = document.querySelector('.task-card[data-id="' + predId + '"]');
      if (predCard) predCard.classList.add('is-predecessor');
    });

    const unlocks = t.unlocks || [];
    unlocks.forEach(succId => {
      const succCard = document.querySelector('.task-card[data-id="' + succId + '"]');
      if (succCard) succCard.classList.add('is-successor');
    });

    highlightSvgLines(taskId, dependsOn, unlocks);
  }

  function selectAndCenterCard(targetId, forceScroll = true) {
    if (selectedTopologyTaskId === targetId) {
      clearHighlights();
      selectedTopologyTaskId = null;
      closePanel();
      return;
    }
    selectedTopologyTaskId = targetId;
    applyHighlights(targetId);

    const task = taskMap[targetId];
    const dependsOn = (task && task.depends_on) || [];
    const unlocks = (task && task.unlocks) || [];

    scrollToHighlightedSubgraph(targetId, dependsOn, unlocks, forceScroll);
  }

  function scrollToStage(stageId) {
    const stageTasks = PROJECT_STATE.tasks.filter(t => t.stage === stageId);
    if (!stageTasks.length) return;
    const minCol = Math.min(...stageTasks.map(t => colMap[t.id] || 0));
    const targetX = LABEL_W + minCol * COL_W - 20;
    const scrollEl = document.getElementById('swimlane-scroll');
    if (scrollEl) {
      scrollEl.scrollTo({ left: Math.max(0, targetX), behavior: 'smooth' });
    }
  }

  function setFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll('.filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.textContent === filter);
    });
    renderConsoleList();
  }

  function updateScrollSpy() {
    const scrollEl = document.getElementById('swimlane-scroll');
    if (!scrollEl) return;
    const curX = scrollEl.scrollLeft;
    const col = Math.floor(Math.max(0, curX - LABEL_W) / COL_W);
    const visibleTask = PROJECT_STATE.tasks.find(t => (colMap[t.id] || 0) >= col);
    if (visibleTask && PROJECT_STATE.project) {
      const stageObj = (PROJECT_STATE.stages || []).find(s => s.id === visibleTask.stage);
      const stageEl = document.getElementById('z1-stage');
      if (stageEl && stageObj) {
        stageEl.textContent = 'STAGE ' + stageObj.id + ' OF ' + (PROJECT_STATE.stages ? PROJECT_STATE.stages.length : 6) + ' — ' + stageObj.name.toUpperCase();
      }
    }
  }

  function renderDopkosRunSheet(container) {
    const DAY_OF_SCHEDULE = [
      { time: '03:30', label: 'Mobilisation & Wakeup', gate: null, tasks: 'Mangala Snana, Mandap Samagri Setup, Fleet Engine Warmup' },
      { time: '05:00', label: 'Bridal Dressing & Groom Prep', gate: null, tasks: 'MUA HD Hair & Makeup, Nuapatna Silk Dhoti Dressing' },
      { time: '07:00', label: 'Baranugam & Barat Arrival', gate: 'GATE-02: Barat Welcoming & Tilak (07:45)', tasks: 'Barat Slow-Mo Drone, Arch Welcoming Aarti' },
      { time: '08:00', label: 'Sacred Lagna Muhurat', gate: 'GATE-03: Lagna Muhurat Sanctum Lock (08:00 - 08:30)', tasks: 'Kanyadaan, Hastaganthi Sacred Knot, 7 Agni Ahutis' },
      { time: '08:45', label: 'Saptapadi & Sindoor Daan', gate: 'GATE-04: Sindoor Daan & Legal Witness (09:15)', tasks: '7 Steps (Saptapadi), Silver Mukuta Coronation, Sindoor' }
    ];

    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    DAY_OF_SCHEDULE.forEach(slot => {
      html += '<div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px;">' +
        (slot.gate ? '<div style="background: rgba(245, 197, 24, 0.15); border-left: 3px solid var(--gold-bright); padding: 6px 12px; margin-bottom: 8px; font-size: 0.78rem; font-weight: 800; color: var(--gold-bright);">🔒 ' + slot.gate + '</div>' : '') +
        '<div style="display: flex; align-items: center; gap: 8px;">' +
          '<span style="font-family: monospace; font-size: 1rem; font-weight: 800; color: var(--gold-bright);">' + slot.time + '</span>' +
          '<strong style="font-size: 0.9rem; color: var(--text-main);">' + slot.label + '</strong>' +
        '</div>' +
        '<div style="font-size: 0.8rem; color: var(--text-dim); margin-top: 4px;">' + slot.tasks + '</div>' +
      '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderDopkosRoadmap(container) {
    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
    PROJECT_STATE.stages.forEach(s => {
      const stageTasks = PROJECT_STATE.tasks.filter(t => t.stage === s.id);
      html += '<div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px;">' +
        '<h4 style="margin: 0 0 6px 0; color: var(--gold-bright);">' + s.name + '</h4>' +
        '<p style="margin: 0 0 10px 0; font-size: 0.8rem; color: var(--text-muted);">' + s.gate_condition + '</p>' +
        '<div style="display: flex; gap: 6px; flex-wrap: wrap;">' +
          stageTasks.map(t => '<span class="role-pill-tag" onclick="setDopkosView(\\\'TOPOLOGY\\\'); selectAndCenterCard(\\\'' + t.id + '\\\')" style="cursor: pointer; font-size: 0.74rem;">' + t.id + ': ' + t.name + '</span>').join('') +
        '</div>' +
      '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderDopkosMatrix(container) {
    let html = '<div style="overflow-x: auto;"><table style="width: 100%; border-collapse: collapse; font-size: 0.76rem;"><thead><tr><th style="padding: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated); color: var(--gold-bright);">TRACK</th>';
    PROJECT_STATE.stages.forEach(s => html += '<th style="padding: 8px; border: 1px solid var(--border-subtle); background: var(--bg-surface-elevated); color: var(--gold-bright);">S' + s.id + '</th>');
    html += '</tr></thead><tbody>';
    TRADES.forEach(tr => {
      html += '<tr><td style="padding: 8px; border: 1px solid var(--border-subtle); font-weight: 700; color: ' + (TRADE_META[tr]?.color || '#fff') + ';">' + (TRADE_META[tr]?.label || tr) + '</td>';
      PROJECT_STATE.stages.forEach(s => {
        const tasksInSlot = PROJECT_STATE.tasks.filter(t => t.trade === tr && t.stage === s.id);
        html += '<td style="padding: 6px; border: 1px solid var(--border-subtle); vertical-align: top;">' +
          tasksInSlot.map(t => '<div onclick="setDopkosView(\\\'TOPOLOGY\\\'); selectAndCenterCard(\\\'' + t.id + '\\\')" style="cursor: pointer; background: var(--bg-surface); padding: 4px; border-radius: 3px; margin-bottom: 4px; font-weight: 600;">' + t.id + '</div>').join('') +
        '</td>';
      });
      html += '</tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  }

  function renderDopkosCritical(container) {
    const criticalChain = [
      { id: 'GOV-001', name: 'Chief Purohit Lagna Lock', horizon: 'T-180' },
      { id: 'RIT-001', name: 'Vidhi-Patra Signoff', horizon: 'T-120' },
      { id: 'GFT-001', name: 'Deva Nimantrana at Puri Jagannath', horizon: 'T-90' },
      { id: 'RIT-004', name: 'Patra Paribartana Vows (Rayagada)', horizon: 'T-14' },
      { id: 'GATE-02', name: 'Baranugam Arch Welcome & Barat', horizon: 'Day 0 (07:30)' },
      { id: 'RIT-005', name: 'Kanyadaan & Hastaganthi Sacred Knot', horizon: 'Day 0 (08:00)' },
      { id: 'GATE-04', name: 'Sindoor Daan & Mukuta Coronation', horizon: 'Day 0 (08:45)' },
      { id: 'LEG-001', name: 'SUJOG Legal Marriage Registration', horizon: 'Day +30' }
    ];

    let html = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    criticalChain.forEach((c, idx) => {
      html += '<div style="display: flex; gap: 12px; align-items: center; background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-left: 3px solid var(--gold-bright); border-radius: var(--radius-sm); padding: 10px 14px;">' +
        '<span style="width: 24px; height: 24px; border-radius: 50%; background: var(--gold-bright); color: #080b11; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 0.76rem;">' + (idx + 1) + '</span>' +
        '<div style="flex: 1;"><div style="font-weight: 700; color: var(--text-main); font-size: 0.85rem;">' + c.id + ': ' + c.name + '</div><div style="font-size: 0.72rem; color: var(--text-dim);">' + c.horizon + '</div></div>' +
        '<button class="btn btn-primary" onclick="setDopkosView(\\\'TOPOLOGY\\\'); selectAndCenterCard(\\\'' + c.id + '\\\')" style="font-size: 0.72rem; padding: 3px 8px;">View In DAG →</button>' +
      '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  let currentPlanningView = 'MATRIX2D';

  function setPlanningView(viewName) {
    currentPlanningView = viewName;
    document.querySelectorAll('.planning-view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.id === ('btn-plan-' + viewName.toLowerCase()));
    });
    renderPlanningSuite();
  }

  function renderPlanningSuite() {
    const container = document.getElementById('planning-canvas-container');
    if (!container) return;

    document.querySelectorAll('.planning-view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.id === ('btn-plan-' + currentPlanningView.toLowerCase()));
    });

    if (currentPlanningView === 'MATRIX2D') {
      if (window.renderDopkosTopology) {
        window.renderDopkosTopology(container);
      }
    } else if (currentPlanningView === 'THREADS') {
      if (window.renderDopkosThreads) {
        window.renderDopkosThreads(container);
      } else {
        container.innerHTML = '<div style="color: var(--text-dim); padding: 20px;">Loading Threads...</div>';
      }
    } else if (currentPlanningView === 'RUNSHEET') {
      renderDopkosRunSheet(container);
    } else if (currentPlanningView === 'ROADMAP') {
      renderDopkosRoadmap(container);
    } else if (currentPlanningView === 'MATRIX') {
      renderDopkosMatrix(container);
    } else if (currentPlanningView === 'CRITICAL') {
      renderDopkosCritical(container);
    }
  }

  // Exports to window
  window.setDopkosView = setDopkosView;
  window.filterDopkosEvent = filterDopkosEvent;
  window.filterDopkosTrack = filterDopkosTrack;
  window.renderDoPkosStudio = renderDoPkosStudio;
  window.setPlanningView = setPlanningView;
  window.renderPlanningSuite = renderPlanningSuite;
  window.selectAndCenterCard = selectAndCenterCard;
  window.scrollToStage = scrollToStage;
  window.toggleConsoleExpand = toggleConsoleExpand;
  window.setFilter = setFilter;
  window.renderConsoleList = renderConsoleList;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderDoPkosStudio();
      renderPlanningSuite();
    });
  } else {
    setTimeout(() => {
      renderDoPkosStudio();
      renderPlanningSuite();
    }, 50);
  }

})(window);
`;

fs.writeFileSync(path.join(modulesDir, 'dopkos-engine.js'), dopkosEngineCode, 'utf8');
console.log('✓ Wrote public/js/modules/dopkos-engine.js');

// Bump Service Worker Cache in sw.js and public/sw.js
function bumpServiceWorker(swPath) {
  if (!fs.existsSync(swPath)) return;
  let swContent = fs.readFileSync(swPath, 'utf8');
  swContent = swContent.replace(/sree-krushna-os-v[0-9.]+/g, 'sree-krushna-os-v3.0.0');
  fs.writeFileSync(swPath, swContent, 'utf8');
  console.log('✓ Bumped service worker cache in ' + swPath);
}

bumpServiceWorker(path.join(root, 'sw.js'));
bumpServiceWorker(path.join(publicDir, 'sw.js'));
console.log('=== DO-PKOS BUILD COMPLETED SUCCESSFULLY ===');
