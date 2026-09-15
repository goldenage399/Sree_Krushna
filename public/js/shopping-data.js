/**
 * Sree Krushna Marriage OS — Wedding Trousseau, "Sara" Gifting & Shopping Registry Data
 * Standard: SPEC-PROC-TROUSSEAU-001 / P-SHOPPING-CONSENSUS-001 / P-COMPARE-SHARE-001
 * Ruling: AC-DEC-2026-018 / UI-DEC-2026-014
 * 
 * Aggregates all wedding shopping items, 4-stage chapters, multi-stakeholder consensus
 * clusters, Bhubaneswar retail stores, and WhatsApp sharing templates.
 */

window.SHOPPING_REGISTRY_DATA = {
  "meta": {
    "title": "Sree Krushna Marriage OS — Wedding Trousseau, 'Sara' & Bhubaneswar Shopping Registry",
    "version": "1.0.0",
    "updated_at": "2026-09-15T09:15:00+05:30",
    "governance_ref": "AC-DEC-2026-018",
    "standard": "SPEC-PROC-TROUSSEAU-001 & P-SHOPPING-CONSENSUS-001",
    "trip_window": "Next 10 Days (Pre-Wedding Runway Gate)",
    "primary_location": "Bhubaneswar, Odisha"
  },
  "chapters": [
    {
      "id": "chapter_bridal_silks",
      "number": 1,
      "title": "Bridal Sacred Silks & Trousseau",
      "subtitle": "Hastaganthi Mandap Pata, Sangeet Lehenga, Haldi & Reception Wardrobe",
      "icon": "🪔",
      "dayTimeline": "Day 1 (10:00 - 19:30)",
      "primaryZone": "Master Canteen & Janpath",
      "itemCount": 8
    },
    {
      "id": "chapter_groom_wear",
      "number": 2,
      "title": "Groom Ceremonial & Barat Wardrobe",
      "subtitle": "Mandap Pure Silk Dhoti-Kurta, Royal Sherwani, Safa, Juttis & Sangeet Tux",
      "icon": "👑",
      "dayTimeline": "Day 2 (10:30 - 19:30)",
      "primaryZone": "Janpath & Ashok Nagar (BMC Keshari)",
      "itemCount": 9
    },
    {
      "id": "chapter_jewellery",
      "number": 3,
      "title": "Temple Gold & Sacred Silver Tarakasi",
      "subtitle": "Chandra Haar, Matha Patti, Long Sita Haar, Silver Bridal Payal & Bichhiya",
      "icon": "💎",
      "dayTimeline": "Day 3 (10:30 - 20:00)",
      "primaryZone": "Janpath Retail Strip & Master Canteen",
      "itemCount": 10
    },
    {
      "id": "chapter_sara_gifting",
      "number": 4,
      "title": "In-Laws 'Sara' Bundles & Sister Wardrobe",
      "subtitle": "Samandhi Vastra (In-Laws Clothes), Sisters' Lehengas, Shringar Trunk & Sweets",
      "icon": "🎁",
      "dayTimeline": "Day 4 & 5 (11:00 - 20:00)",
      "primaryZone": "Saheed Nagar & Market Building Unit-2",
      "itemCount": 7
    }
  ],
  "clusters": [
    {
      "id": "cluster_vivaha_pata",
      "title": "Sacred Vivaha Pata (Hastaganthi Mandap Saree)",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "deciders": [
        "Bride",
        "In-Laws",
        "Sisters"
      ],
      "description": "Central consecrated handloom saree for the 12:00 PM Daytime Hastaganthi sacred hand-joining ritual.",
      "whatsappTemplate": "🌺 *Sree Krushna Marriage OS — Bridal Vivaha Pata Review*\nHelp us select the sacred wedding saree for the Hastaganthi ritual! Please review the 3 shortlisted options:\n• *Option A:* Authentic Sambalpuri Pata (Crimson Red with Temple Kumbha Border)\n• *Option B:* Heritage Khandua Pata (Sindoor Red with Gita Govinda Shloka Border)\n• *Option C:* Royal Bomkai Silk Pata (Sunset Maroon with Heavy Zari Pallu)\n👉 Review and share your opinion on your phone: {url}",
      "options": [
        {
          "optionId": "A",
          "title": "Authentic Sambalpuri Pata",
          "color": "Crimson Red & Deep Gold",
          "weave": "Double Ikkat Bandha Silk",
          "highlight": "Traditional temple Kumbha border, sacred conch and fish motifs, heavy pallu, GI-tagged handloom.",
          "store": "Boyanika (Janpath / Master Canteen)",
          "priceTier": "₹28,000 - ₹38,000",
          "status": "Shortlisted"
        },
        {
          "optionId": "B",
          "title": "Heritage Khandua Pata",
          "color": "Sindoor Red & Golden Yellow",
          "weave": "Nuapatna Khandua Silk",
          "highlight": "Calligraphic Gita Govinda verses in pallu, auspicious floral mandala, lightweight and comfortable for havan fire.",
          "store": "Sambalpuri Bastralaya (Janpath)",
          "priceTier": "₹22,000 - ₹32,000",
          "status": "Shortlisted"
        },
        {
          "optionId": "C",
          "title": "Royal Bomkai Silk Pata",
          "color": "Sunset Maroon & Antique Bronze",
          "weave": "Ganjam Bomkai Brocade Silk",
          "highlight": "Intricate extra-weft threadwork, regal contrast border, opulent ceremonial drape.",
          "store": "Priyadarshini (Saheed Nagar)",
          "priceTier": "₹35,000 - ₹48,000",
          "status": "Alternative"
        }
      ]
    },
    {
      "id": "cluster_groom_mandap",
      "title": "Groom Mandap Liturgical Attire",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "deciders": [
        "Groom",
        "In-Laws",
        "Sisters"
      ],
      "description": "Vedic Mandap ritual ensemble required for sacred fire havan and Hastaganthi rituals.",
      "whatsappTemplate": "👑 *Sree Krushna Marriage OS — Groom Mandap Attire Review*\nHelp us finalize the Groom's ritual Dhoti-Kurta for the Vedic Mandap rituals! Review the options:\n• *Option A:* Pure Raw Tussar Silk Dhoti & Kurta (Boyanika)\n• *Option B:* Ivory Cotton-Silk Dhoti & Brocade Kurta (Manyavar)\n👉 Vote here: {url}",
      "options": [
        {
          "optionId": "A",
          "title": "Pure Raw Tussar Silk Dhoti & Kurta",
          "color": "Natural Raw Silk Beige with Red/Gold Zari",
          "weave": "Pure Tussar Handloom Silk",
          "highlight": "Unstitched sacred silk dhoti with temple border + matching 2.5m ceremonial silk Patta (Angavastra) for knot tying.",
          "store": "Boyanika (Master Canteen)",
          "priceTier": "₹18,000 - ₹26,000",
          "status": "Recommended"
        },
        {
          "optionId": "B",
          "title": "Ivory Cotton-Silk Dhoti with Gold Brocade Kurta",
          "color": "Off-White & Antique Gold",
          "weave": "Cotton-Silk Jacquard Blend",
          "highlight": "Modern pre-draped dhoti cut with tailored brocade kurta, easy movement, comfortable in hall temperature.",
          "store": "Manyavar (Janpath)",
          "priceTier": "₹14,000 - ₹20,000",
          "status": "Shortlisted"
        }
      ]
    },
    {
      "id": "cluster_bridal_lehenga",
      "title": "Bridal Sangeet & Reception Lehenga",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "deciders": [
        "Bride",
        "Sisters"
      ],
      "description": "High-impact evening outfit for Sangeet concert performances and celebration party.",
      "whatsappTemplate": "✨ *Sree Krushna Marriage OS — Sangeet Outfit Review*\nHelp the bride choose her Sangeet dance outfit! Review the 3 shortlisted designs:\n• *Option A:* Midnight Blue Velvet Lehenga (Kalamandir)\n• *Option B:* Rose Gold Raw Silk Floral Lehenga (Manyavar Mohey)\n• *Option C:* Deep Wine Flared Indo-Western Gown (Posh Affair)\n👉 Vote here: {url}",
      "options": [
        {
          "optionId": "A",
          "title": "Midnight Blue Velvet Zardozi Lehenga",
          "color": "Midnight Royal Blue & Silver",
          "weave": "Micro-Velvet with Zardozi Work",
          "highlight": "Spectacular concert stage lighting presence, double dupatta styling, structured can-can silhouette.",
          "store": "Kalamandir (Janpath)",
          "priceTier": "₹55,000 - ₹85,000",
          "status": "Shortlisted"
        },
        {
          "optionId": "B",
          "title": "Rose Gold Raw Silk Floral Lehenga",
          "color": "Rose Gold & Muted Peach",
          "weave": "Raw Silk with Mirror & Resham Threadwork",
          "highlight": "Lightweight and flexible for active dance choreographies, romantic pastel aesthetic.",
          "store": "Manyavar Mohey (Janpath)",
          "priceTier": "₹45,000 - ₹65,000",
          "status": "Shortlisted"
        },
        {
          "optionId": "C",
          "title": "Deep Wine Flared Gown with Cape",
          "color": "Rich Wine & Antique Gold",
          "weave": "Georgette with Embroidered Organza Cape",
          "highlight": "Contemporary Indo-Western silhouette, hands-free ease, dramatic cape flutter during stage entry.",
          "store": "Posh Affair (Saheed Nagar)",
          "priceTier": "₹38,000 - ₹52,000",
          "status": "Alternative"
        }
      ]
    },
    {
      "id": "cluster_sara_inlaws",
      "title": "In-Laws Samandhi Vastra Package",
      "category": "sara",
      "chapterId": "chapter_sara_gifting",
      "deciders": [
        "Groom Parents",
        "Groom Sisters",
        "In-Laws"
      ],
      "description": "Respect garments gifted to bride's parents during the formal 'Sara' trousseau exchange.",
      "whatsappTemplate": "🎁 *Sree Krushna Marriage OS — In-Laws 'Sara' Gifting Review*\nReview the ceremonial Samandhi Vastra package for the In-Laws:\n• *Option A:* Royal Bomkai Saree + Pure Silk Tussar Dhoti-Kurta\n• *Option B:* Berhampuri Pata Saree + Premium Raymond Suiting Cut\n👉 Share family approval: {url}",
      "options": [
        {
          "optionId": "A",
          "title": "Traditional Heritage Handloom Package",
          "color": "Royal Teal Bomkai & Cream Silk Dhoti",
          "weave": "Pure Silk Handloom",
          "highlight": "Bomkai silk saree with pure zari pallu for Mother-in-law + Pure Tussar Silk Dhoti-Kurta set for Father-in-law.",
          "store": "Boyanika (Janpath)",
          "priceTier": "₹32,000 - ₹44,000",
          "status": "Recommended"
        },
        {
          "optionId": "B",
          "title": "Classic Silk & Executive Suiting Package",
          "color": "Maroon Berhampuri & Navy Suiting Fabric",
          "weave": "Pure Silk + Italian Worsted Wool",
          "highlight": "Berhampuri Pata silk saree for Mother-in-law + Premium Raymond Super-120s Italian wool suiting fabric for Father-in-law.",
          "store": "Boyanika + Raymond Shop (Janpath)",
          "priceTier": "₹28,000 - ₹40,000",
          "status": "Alternative"
        }
      ]
    }
  ],
  "stores": [
    {
      "id": "store_boyanika_master_canteen",
      "name": "Boyanika (State Handloom Apex)",
      "zone": "Master Canteen / Janpath",
      "address": "Janpath Rd, near Master Canteen Square, Bhubaneswar, Odisha 751001",
      "phone": "+91 674 253 0122",
      "specialty": "Authentic GI-Tagged Sambalpuri Pata, Bomkai Silk, Tussar Dhoti-Kurta",
      "recommendedFor": [
        "TRS-BR-01",
        "TRS-GR-01",
        "TRS-GR-02",
        "TRS-SA-01"
      ],
      "timings": "10:00 AM - 08:30 PM (All Days)"
    },
    {
      "id": "store_khimji_janpath",
      "name": "Khimji Jewellers",
      "zone": "Janpath, Kharavela Nagar",
      "address": "621, Janpath Rd, Saheed Nagar / Kharavela Nagar, Bhubaneswar 751007",
      "phone": "+91 674 253 3000",
      "specialty": "Hallmarked 22K Temple Gold, Chandra Haar, Cuttack Tarakasi Silver Filigree",
      "recommendedFor": [
        "TRS-JW-01",
        "TRS-JW-02",
        "TRS-JW-04",
        "TRS-JW-05",
        "TRS-JW-07",
        "TRS-JW-08"
      ],
      "timings": "10:30 AM - 08:30 PM"
    },
    {
      "id": "store_lalchnd_master_canteen",
      "name": "Lalchnd Jewellers",
      "zone": "Master Canteen Junction",
      "address": "Station Square, Master Canteen, Bhubaneswar, Odisha 751001",
      "phone": "+91 674 253 2828",
      "specialty": "Heritage Bridal Gold Sets, Matha Patti, Kundan Waist Chains, Silver Puja Vessels",
      "recommendedFor": [
        "TRS-JW-01",
        "TRS-JW-03",
        "TRS-JW-06",
        "TRS-JW-09"
      ],
      "timings": "10:30 AM - 08:30 PM"
    },
    {
      "id": "store_kalamandir_janpath",
      "name": "Kalamandir Royal Heritage",
      "zone": "Janpath, Kharavela Nagar",
      "address": "Janpath Rd, opposite Ram Mandir, Kharavela Nagar, Bhubaneswar 751001",
      "phone": "+91 674 239 1234",
      "specialty": "Bridal Lehengas, Kanjeevaram & Banarasi Silks, Designer Gowns",
      "recommendedFor": [
        "TRS-BR-02",
        "TRS-BR-05",
        "TRS-SA-04"
      ],
      "timings": "10:30 AM - 09:00 PM"
    },
    {
      "id": "store_manyavar_janpath",
      "name": "Manyavar & Mohey",
      "zone": "Janpath, Saheed Nagar Junction",
      "address": "Plot No. 132, Janpath Rd, Kharavela Nagar, Bhubaneswar 751001",
      "phone": "+91 674 238 0900",
      "specialty": "Groom Royal Sherwanis, Safas, Mojaris, Brocade Kurtas, Mohey Bridal Lehengas",
      "recommendedFor": [
        "TRS-GR-03",
        "TRS-GR-04",
        "TRS-GR-05",
        "TRS-GR-07",
        "TRS-SA-03"
      ],
      "timings": "10:30 AM - 09:00 PM"
    },
    {
      "id": "store_sherwani_house_keshari",
      "name": "Sherwani House",
      "zone": "Ashok Nagar (BMC Keshari Mall)",
      "address": "2nd Floor, BMC Keshari Mall, Ashok Nagar, Bhubaneswar 751009",
      "phone": "+91 94370 12345",
      "specialty": "Custom-Fit Embroidered Sherwanis, Royal Safas, Groom Accoutrements",
      "recommendedFor": [
        "TRS-GR-03",
        "TRS-GR-04",
        "TRS-GR-08"
      ],
      "timings": "11:00 AM - 09:00 PM"
    },
    {
      "id": "store_market_building_unit2",
      "name": "Market Building (Unit-2 Plaza)",
      "zone": "Ashok Nagar / Unit-2",
      "address": "Market Building Promenade, Unit-2, Ashok Nagar, Bhubaneswar 751009",
      "phone": "Local Hub",
      "specialty": "Kala Niketan, Shringar Boxes, Bridal Footwear, Alta, Bangles, Kula Hampers",
      "recommendedFor": [
        "TRS-BR-06",
        "TRS-GR-08",
        "TRS-JW-08",
        "TRS-SA-05"
      ],
      "timings": "11:00 AM - 09:30 PM"
    },
    {
      "id": "store_raymond_janpath",
      "name": "The Raymond Shop",
      "zone": "Janpath, Kharavela Nagar",
      "address": "Janpath Rd, Kharavela Nagar, Bhubaneswar 751001",
      "phone": "+91 674 253 4567",
      "specialty": "Custom Made-to-Measure Tuxedos, Jodhpuri Suits, Italian Wool Fabric Cuts",
      "recommendedFor": [
        "TRS-GR-06",
        "TRS-SA-02"
      ],
      "timings": "10:30 AM - 08:30 PM"
    }
  ],
  "items": [
    {
      "id": "TRS-BR-01",
      "code": "BR-01",
      "title": "Sacred Vivaha Pata (Hastaganthi Saree)",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "clusterId": "cluster_vivaha_pata",
      "role": "Mandap Vivaha Ritual (12:00 PM Hastaganthi)",
      "spec": "Pure Mulberry Silk Sambalpuri/Khandua Pata with red temple border",
      "suggestedColor": "Crimson Red / Sindoor Red",
      "store": "Boyanika / Sambalpuri Bastralaya",
      "priceRange": "₹25,000 - ₹38,000",
      "status": "Shortlisted",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-BR-02",
      "code": "BR-02",
      "title": "Bridal Sangeet Lehenga & Choli",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "clusterId": "cluster_bridal_lehenga",
      "role": "Day 1 Sangeet & Performance Night",
      "spec": "Heavy velvet/raw-silk flared lehenga with zardozi & can-can",
      "suggestedColor": "Midnight Royal Blue or Rose Gold",
      "store": "Kalamandir / Manyavar Mohey",
      "priceRange": "₹45,000 - ₹75,000",
      "status": "Shortlisted",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-BR-03",
      "code": "BR-03",
      "title": "Haldi Mangala Snana Saree",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "role": "Day 1 Haldi Ceremony",
      "spec": "Breathable cotton-silk handloom with contrasting border",
      "suggestedColor": "Turmeric Yellow / Mustard",
      "store": "Boyanika / Utkalika",
      "priceRange": "₹4,500 - ₹8,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": false,
        "inlaws": false
      }
    },
    {
      "id": "TRS-BR-04",
      "code": "BR-04",
      "title": "Mehendi Garden Promenade Outfit",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "role": "Day 1 Mehendi Event",
      "spec": "Flowing georgette or lightweight organza Anarkali / Lehenga",
      "suggestedColor": "Emerald Green / Sage",
      "store": "Amber / Kalamandir",
      "priceRange": "₹12,000 - ₹22,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": false,
        "inlaws": false
      }
    },
    {
      "id": "TRS-BR-05",
      "code": "BR-05",
      "title": "Reception Grand Silk Saree",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "role": "Day 2 Evening Reception / Bhoji",
      "spec": "Heavy Kanjeevaram Silk or Banarasi Brocade with broad gold zari",
      "suggestedColor": "Rani Pink / Royal Maroon",
      "store": "Kalamandir / Saheed Nagar",
      "priceRange": "₹35,000 - ₹55,000",
      "status": "Planned",
      "approvals": {
        "bride": false,
        "sisters": false,
        "inlaws": true
      }
    },
    {
      "id": "TRS-BR-06",
      "code": "BR-06",
      "title": "Bridal Odhani / Mandap Veil",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "role": "Hastaganthi Mandap Veil",
      "spec": "Fine crimson net with gold gota patti & Subha Vivaha border",
      "suggestedColor": "Crimson Red with Gold Zari",
      "store": "Market Building Unit-2",
      "priceRange": "₹3,500 - ₹6,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-BR-07",
      "code": "BR-07",
      "title": "Post-Wedding Daily Handloom Silks (Set of 5)",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "role": "Temple Visits & Family Hospitality",
      "spec": "Soft Bomkai, Berhampuri, and Ikkat silk sarees",
      "suggestedColor": "Assorted Festive Palette",
      "store": "Boyanika (Master Canteen)",
      "priceRange": "₹40,000 - ₹60,000 (Total Set)",
      "status": "Planned",
      "approvals": {
        "bride": false,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-GR-01",
      "code": "GR-01",
      "title": "Mandap Pure Silk Dhoti & Kurta",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "clusterId": "cluster_groom_mandap",
      "role": "Vedic Mandap Rituals & Hastaganthi",
      "spec": "Pure unstitched Tussar/Raw Silk Dhoti + Kurta with temple border",
      "suggestedColor": "Natural Raw Silk Beige with Gold Border",
      "store": "Boyanika (Master Canteen)",
      "priceRange": "₹18,000 - ₹26,000",
      "status": "Shortlisted",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-GR-02",
      "code": "GR-02",
      "title": "Ceremonial Silk Patta (Angavastra)",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "role": "Hastaganthi Sacred Knot Tying",
      "spec": "2.5m Pure Silk Stole with woven shloka or floral border",
      "suggestedColor": "Off-White & Red Zari",
      "store": "Boyanika / Sambalpuri Bastralaya",
      "priceRange": "₹4,000 - ₹7,500",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": false,
        "inlaws": true
      }
    },
    {
      "id": "TRS-GR-03",
      "code": "GR-03",
      "title": "Barat Royal Sherwani",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "role": "Day 2 Morning Barat Procession",
      "spec": "Raw Silk / Jacquard with zardozi collar and matching churidar. [Decision Gate: Custom Tailor (Fabric from Janpath + Ashok Nagar Tailor: ₹12k–₹16k, 7-10d) vs Readymade Manyavar (₹35k–₹55k)]",
      "suggestedColor": "Ivory, Champagne Gold, or Pearl",
      "store": "Manyavar (Janpath) / Ashok Nagar Master Tailors",
      "priceRange": "₹12,000 - ₹45,000",
      "status": "Shortlisted",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-GR-04",
      "code": "GR-04",
      "title": "Groom Safa (Turban) & Feather Kalgi",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "role": "Barat Royal Regalia",
      "spec": "Crushed tissue or chanderi silk with jeweled brooch",
      "suggestedColor": "Royal Peach / Crimson / Gold",
      "store": "Market Building / Manyavar",
      "priceRange": "₹4,500 - ₹8,500",
      "status": "Planned",
      "approvals": {
        "bride": false,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-GR-05",
      "code": "GR-05",
      "title": "Barat Stole & Multi-Layer Pearl Mala",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "role": "Barat Accoutrements",
      "spec": "Embroidered velvet/silk stole + layered pearl/emerald mala",
      "suggestedColor": "Maroon / Emerald + Off-White",
      "store": "Manyavar / Saheed Nagar Boutiques",
      "priceRange": "₹5,000 - ₹9,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-GR-06",
      "code": "GR-06",
      "title": "Sangeet Tuxedo / Royal Bandhgala",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "role": "Day 1 Sangeet Concert & Celebration",
      "spec": "Custom-tailored Italian wool Tuxedo or Royal Jodhpuri suit",
      "suggestedColor": "Midnight Black or Deep Navy",
      "store": "Raymond Custom Tailoring (Janpath)",
      "priceRange": "₹25,000 - ₹42,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-GR-07",
      "code": "GR-07",
      "title": "Haldi Cotton-Silk Kurta-Pajama",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "role": "Day 1 Haldi Ceremony",
      "spec": "Breathable Lucknowi Chikan or cotton-silk with churidar",
      "suggestedColor": "Mustard Yellow / Gold",
      "store": "Fabindia / Manyavar (Janpath)",
      "priceRange": "₹4,000 - ₹7,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": false,
        "inlaws": false
      }
    },
    {
      "id": "TRS-GR-08",
      "code": "GR-08",
      "title": "Traditional Mojaris & Juttis (2 Pairs)",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "role": "Ceremonial & Mandap Footwear",
      "spec": "Handcrafted leather mojaris with gold thread embroidery",
      "suggestedColor": "Antique Gold & Raw Silk Ivory",
      "store": "Market Building Unit-2",
      "priceRange": "₹4,000 - ₹7,000",
      "status": "Planned",
      "approvals": {
        "bride": false,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-JW-01",
      "code": "JW-01",
      "title": "Chandra Haar / Temple Gold Choker",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Mandap Hastaganthi Central Neckpiece",
      "spec": "22K Hallmarked Gold handcrafted temple architecture motif",
      "suggestedColor": "Pure Antique 22K Yellow Gold",
      "store": "Khimji Jewellers / Lalchnd Jewellers",
      "priceRange": "Gold Weight Based (~40-60g)",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-JW-02",
      "code": "JW-02",
      "title": "Long Sita Haar (Layered Necklace)",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Bridal Regal Layering",
      "spec": "22K Gold with floral/peacock medallion drops",
      "suggestedColor": "Pure 22K Gold",
      "store": "Khimji / Epari Govindam",
      "priceRange": "Gold Weight Based (~50-80g)",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": false,
        "inlaws": true
      }
    },
    {
      "id": "TRS-JW-03",
      "code": "JW-03",
      "title": "Matha Patti & Maang Tikka",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Forehead Adornment",
      "spec": "22K Gold with dangling pearl drops & kundan settings",
      "suggestedColor": "Gold with Basra Pearl Accents",
      "store": "Lalchnd Jewellers / Tanishq",
      "priceRange": "Gold Weight Based (~20-30g)",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-JW-04",
      "code": "JW-04",
      "title": "Traditional Tiered Jhumkas & Kaanbali",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Ear Adornment with Hair Support",
      "spec": "22K Gold tiered bell jhumkas with connecting ear-chains",
      "suggestedColor": "Pure 22K Gold",
      "store": "Khimji Jewellers / Kalyan",
      "priceRange": "Gold Weight Based (~25-35g)",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": false,
        "inlaws": false
      }
    },
    {
      "id": "TRS-JW-05",
      "code": "JW-05",
      "title": "Gold Kadas / Bangles (Set of 4)",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Bridal Arm Adornment",
      "spec": "22K Gold nakshi filigree kadas + red/green glass bangles",
      "suggestedColor": "Pure 22K Gold",
      "store": "Khimji / Epari Govindam",
      "priceRange": "Gold Weight Based (~40-60g)",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-JW-06",
      "code": "JW-06",
      "title": "Kamarbandh (Gold Waist Chain)",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Saree Drape Anchor",
      "spec": "22K Gold or high-grade antique filigree waist belt",
      "suggestedColor": "Antique Gold",
      "store": "Lalchnd / Saheed Nagar",
      "priceRange": "Gold Weight Based (~30-50g)",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-JW-07",
      "code": "JW-07",
      "title": "Silver Bridal Payal (Cuttack Tarakasi Nupur)",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Sacred Ankle Bells (Gold forbidden on feet)",
      "spec": "925 Sterling Silver handcrafted Cuttack filigree with bells",
      "suggestedColor": "Polished Sterling Silver",
      "store": "Tarakasi Artisans / Khimji",
      "priceRange": "₹8,000 - ₹16,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-JW-08",
      "code": "JW-08",
      "title": "Silver Bichhiya (Toe Rings - 2 Sets)",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Auspicious Symbol of Married Woman",
      "spec": "Pure Sterling Silver engraved adjustable toe rings",
      "suggestedColor": "Bright Sterling Silver",
      "store": "Khimji / Market Building",
      "priceRange": "₹1,500 - ₹3,500",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": false,
        "inlaws": true
      }
    },
    {
      "id": "TRS-JW-09",
      "code": "JW-09",
      "title": "Silver Sindoor Farua & Ceremonial Kajal Lata",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Mandap Liturgical Accessories",
      "spec": "Sterling Silver carved peacock Sindoor container + Kajal Lata",
      "suggestedColor": "Carved Antique Silver",
      "store": "Epari Govindam / Lalchnd",
      "priceRange": "₹4,500 - ₹8,500",
      "status": "Planned",
      "approvals": {
        "bride": false,
        "sisters": false,
        "inlaws": true
      }
    },
    {
      "id": "TRS-SA-01",
      "code": "SA-01",
      "title": "Samandhi Vastra (Mother-in-Law Silk Saree)",
      "category": "sara",
      "chapterId": "chapter_sara_gifting",
      "clusterId": "cluster_sara_inlaws",
      "role": "Formal In-Laws Respect Gifting",
      "spec": "Pure Bomkai Silk or Berhampuri Pata Saree with pure zari pallu",
      "suggestedColor": "Teal Blue / Forest Green / Maroon",
      "store": "Boyanika (Janpath)",
      "priceRange": "₹18,000 - ₹28,000",
      "status": "Shortlisted",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-SA-02",
      "code": "SA-02",
      "title": "Samandhi Vastra (Father-in-Law Suiting / Dhoti)",
      "category": "sara",
      "chapterId": "chapter_sara_gifting",
      "clusterId": "cluster_sara_inlaws",
      "role": "Formal In-Laws Respect Gifting",
      "spec": "Pure Silk Tussar Dhoti-Kurta OR Raymond Super-120s Suiting Fabric",
      "suggestedColor": "Natural Cream Silk or Navy Wool",
      "store": "Boyanika / Raymond Shop (Janpath)",
      "priceRange": "₹12,000 - ₹20,000",
      "status": "Shortlisted",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-SA-03",
      "code": "SA-03",
      "title": "Bride's Immediate Siblings Hampers",
      "category": "sara",
      "chapterId": "chapter_sara_gifting",
      "role": "Family Welcoming Gift",
      "spec": "Kurta-Pajama set for Brother; Silk/Georgette suit for Sister",
      "suggestedColor": "Festive Palette",
      "store": "Manyavar / Amber (Janpath)",
      "priceRange": "₹12,000 - ₹20,000 (Total)",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-SA-04",
      "code": "SA-04",
      "title": "Groom's Sisters Wardrobe (2 Sets each)",
      "category": "sara",
      "chapterId": "chapter_sara_gifting",
      "role": "Sangeet & Mandap Outfits for Groom's Sisters",
      "spec": "Set 1: Designer Sangeet Lehenga. Set 2: Festive Sambalpuri Pata Saree",
      "suggestedColor": "Pastel Mint, Peach, Royal Violet",
      "store": "Kalamandir / Saheed Nagar Boutiques",
      "priceRange": "₹45,000 - ₹70,000 (Total)",
      "status": "Planned",
      "approvals": {
        "bride": false,
        "sisters": true,
        "inlaws": false
      }
    },
    {
      "id": "TRS-SA-05",
      "code": "SA-05",
      "title": "Ceremonial Shringar & Kula Trunk Kit",
      "category": "sara",
      "chapterId": "chapter_sara_gifting",
      "role": "Traditional Trousseau Trunk Presentation",
      "spec": "Painted brass/bamboo Kula, pure Alta, Bindi, Sindoor, perfume, glass bangles",
      "suggestedColor": "Auspicious Crimson & Yellow",
      "store": "Market Building Unit-2",
      "priceRange": "₹5,000 - ₹9,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-SA-06",
      "code": "SA-06",
      "title": "Auspicious Dry Fruit & Odia Pitha Hampers (5 Baskets)",
      "category": "sara",
      "chapterId": "chapter_sara_gifting",
      "role": "Traditional Hospitality Gifting",
      "spec": "Cashews, almonds, pistachios, figs + vacuum-packed Chhena Poda & Arisha",
      "suggestedColor": "Gold Wrapped Decorative Trays",
      "store": "Saheed Nagar / Nimapada Sweets / Janpath",
      "priceRange": "₹15,000 - ₹25,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-OD-01",
      "code": "OD-01",
      "title": "Nuapatna Khandua Pata Silk (Diya Mangula & Puja)",
      "category": "bridal",
      "chapterId": "chapter_bridal_silks",
      "role": "Sacred Jagannath Blessing & Temple Mangula Ritual",
      "spec": "Pure Mulberry Silk Nuapatna Handloom with Gita Govinda verses & sacred lotus motifs",
      "suggestedColor": "Auspicious Vermilion Red / Sun Orange",
      "store": "Boyanika (Master Canteen) / Utkalika",
      "priceRange": "₹12,000 - ₹22,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-OD-02",
      "code": "OD-02",
      "title": "Balakati Hand-Cast Bell-Metal (Kansa) 7-Piece Dining Service",
      "category": "sara",
      "chapterId": "chapter_sara_gifting",
      "role": "Newlywed Couple's First Ritual Feast & Ayurvedic Longevity Gift",
      "spec": "Hand-beaten bell-metal Thali, 3 Katoris, Water Glass, Dessert Bowl, and Spoon (Ayurvedic dosha-balancing)",
      "suggestedColor": "Polished Golden Bronze / Bell Metal",
      "store": "Balakati Bell Metal Co-op / Utkalika (Janpath)",
      "priceRange": "₹8,500 - ₹15,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-OD-03",
      "code": "OD-03",
      "title": "Cuttack Tarakasi Silver Filigree Sindura Phuda & Pana Batta",
      "category": "jewellery",
      "chapterId": "chapter_jewellery",
      "role": "Auspicious Mandap Vermilion & Respected Guest Welcome Regalia",
      "spec": "Handcrafted 925 Sterling Silver Cuttack filigree peacock Sindoor casket + floral Pana Batta",
      "suggestedColor": "Polished 925 Pure Silver",
      "store": "Khimji Jewellers / Cuttack Tarakasi Artisans",
      "priceRange": "₹12,000 - ₹24,000",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    },
    {
      "id": "TRS-OD-04",
      "code": "OD-04",
      "title": "Sambalpuri Handloom Groom Joda & Silk Dhoti Set",
      "category": "groom",
      "chapterId": "chapter_groom_wear",
      "role": "Traditional Odia Sacred Mandap Ceremony & Satyanarayana Puja",
      "spec": "Pure Sambalpuri Pattu Dhoti + matching Angavastram (Uttariya) with traditional temple border",
      "suggestedColor": "Tussar Gold with Maroon/Black Kumbha Border",
      "store": "Sambalpuri Bastralaya (Janpath) / Boyanika",
      "priceRange": "₹6,500 - ₹12,500",
      "status": "Planned",
      "approvals": {
        "bride": true,
        "sisters": true,
        "inlaws": true
      }
    }
  ]
};
