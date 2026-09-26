/**
 * .agent/taxonomy_dictionary.cjs — Universal Cross-Repository Taxonomy & Vocabulary Dictionary
 *
 * Standard: STD-UNIVERSAL-TAXONOMY-001 / INV-SAP-DUAL-BLOCK-001 / PKG-006 / AC-DEC-2026-063
 *
 * Defines the canonical vocabulary and prohibited synonym aliases across all 9 SAP repositories.
 * Partitioned into:
 *   1. SHARED CORE: Losslessly synchronized across all repos via /sap-sync.
 *   2. REPO-SPECIFIC: Local domain entities and ceremonial terms preserved from overwrite.
 */
'use strict';

// <!-- shared:std.agent.taxonomy.core:start -->
const SHARED_TAXONOMY = {
  governance: [
    {
      preferred: "Definition of Done (DoD v1.7)",
      category: "governance",
      prohibited: ["Completion Checklist", "Signoff Criteria", "DoD checklist", "Signoff checklist"]
    },
    {
      preferred: "Validation Gate (VG)",
      category: "governance",
      prohibited: ["assert step", "verification point", "validation check", "assert gate"]
    },
    {
      preferred: "Decision Node (DN)",
      category: "governance",
      prohibited: ["branch choice", "decision fork", "branch point"]
    },
    {
      preferred: "Reality-First Grounding (RFG-001)",
      category: "architecture",
      prohibited: ["grounding rule", "reality policy", "maturity anchor rule"]
    },
    {
      preferred: "Post-Implementation Reconciliation Review (PIRR)",
      category: "governance",
      prohibited: ["Post-implementation review", "closeout reconciliation review", "PIR review"]
    },
    {
      preferred: "Spoke & Wheel SSOT",
      category: "documentation",
      prohibited: ["parent/child docs", "hub and spoke hierarchy", "hub-spoke doc tree"]
    },
    {
      preferred: "4-Phase Problem-Solving Discipline (4-PPSD)",
      category: "governance",
      prohibited: ["4-phase discipline", "four phase problem solving", "PPSD framework"]
    },
    {
      preferred: "Invocation Completeness Gate (ICG-001)",
      category: "governance",
      prohibited: ["invocation completeness rule", "ICG gate"]
    }
  ],
  architecture: [
    {
      preferred: "Static Decoupled Component Assembler (SDCA)",
      category: "ui-architecture",
      prohibited: ["SDCA assembler pattern", "decoupled HTML assembler", "SDCA compiler framework"]
    },
    {
      preferred: "Single Source of Truth (SSOT)",
      category: "architecture",
      prohibited: ["primary source of truth", "canonical truth document"]
    },
    {
      preferred: "Operational Gate",
      category: "operations",
      prohibited: ["sync checkpoint", "runtime barrier"]
    }
  ]
};
// <!-- shared:std.agent.taxonomy.core:end -->

// <!-- repo-specific:sree-krushna:start -->
const REPO_SPECIFIC_TAXONOMY = {
  events: [
    {
      preferred: "Nirbandha & Ashirbad",
      category: "events",
      prohibited: ["Ring ceremony", "Engagement ceremony"]
    },
    {
      preferred: "Kanyadaan & Hastaganthi",
      category: "events",
      prohibited: ["Hand tying ceremony", "Hasta ganthi rite"]
    },
    {
      preferred: "Mangan, Mangalakrutya & Haldi Snana",
      category: "events",
      prohibited: ["Haldi ceremony alone", "Mangan ritual"]
    },
    {
      preferred: "Baranugam & Barat Reception",
      category: "events",
      prohibited: ["Baraat entry", "Groom welcoming"]
    },
    {
      preferred: "Lajahoma & Agni Pradakshina",
      category: "events",
      prohibited: ["Fire rounds", "Pheras ritual"]
    },
    {
      preferred: "Saptapadi (Seven Sacred Steps)",
      category: "events",
      prohibited: ["Seven steps ceremony", "7 pheras"]
    },
    {
      preferred: "Kanyavida (Bride Farewell)",
      category: "events",
      prohibited: ["Vidaai ceremony", "Bidaai rite"]
    },
    {
      preferred: "Grihapravesh & Chauthi Ceremony",
      category: "events",
      prohibited: ["House entering", "Home welcoming"]
    },
    {
      preferred: "Astamangala (Eighth-Day Return)",
      category: "events",
      prohibited: ["Eight day feast", "Astamangala dinner"]
    }
  ],
  entities: [
    {
      preferred: "EVT-###",
      category: "identifiers",
      prohibited: ["EVENT-###", "E-###"]
    },
    {
      preferred: "RIT-###",
      category: "identifiers",
      prohibited: ["RITUAL-###", "R-###"]
    },
    {
      preferred: "TRS-###",
      category: "identifiers",
      prohibited: ["TROUSSEAU-###", "TR-###"]
    },
    {
      preferred: "OBL-###",
      category: "identifiers",
      prohibited: ["OBLIGATION-###", "OB-###"]
    },
    {
      preferred: "GFT-###",
      category: "identifiers",
      prohibited: ["SHAGUN-###", "GIFT-###"]
    },
    {
      preferred: "PAY-###",
      category: "identifiers",
      prohibited: ["PAYMENT-###", "EXP-###"]
    }
  ]
};
// <!-- repo-specific:sree-krushna:end -->

module.exports = {
  shared: SHARED_TAXONOMY,
  repo_specific: REPO_SPECIFIC_TAXONOMY
};
