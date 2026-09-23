/**
 * Sree Krushna Marriage OS — Shopping Asset Registry & Sync Engine
 * Standard: P-UNIVERSAL-VISUAL-ASSET-001 / P-SHOPPING-ASSET-TAXONOMY-001
 * Ruling: AC-DEC-2026-035 / UI-DEC-2026-031
 * 
 * Scans assets/shopping/, compiles registry.json, synchronizes to public/assets/shopping/
 * with 100% byte parity, and enriches js/shopping-data.js.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const assetsDir = path.join(rootDir, 'assets', 'shopping');
const publicAssetsDir = path.join(rootDir, 'public', 'assets', 'shopping');

// Mapping of Canonical Item IDs to Human-Readable Folder Slugs & Metadata
const ITEM_MAP = {
  'TRS-BR-01': {
    slug: 'vivaha_pata',
    title: 'Sacred Vivaha Pata (Hastaganthi Saree)',
    category: 'bridal',
    chapterId: 'chapter_bridal_silks',
    defaultLabel: 'Sambalpuri Khandua Pata (Curated Concept)'
  },
  'TRS-BR-02': {
    slug: 'sangeet_lehenga',
    title: 'Bridal Sangeet Lehenga & Choli',
    category: 'bridal',
    chapterId: 'chapter_bridal_silks',
    defaultLabel: 'Midnight Blue Velvet Lehenga (Curated Concept)'
  },
  'TRS-BR-03': {
    slug: 'haldi_saree',
    title: 'Haldi Mangala Snana Saree',
    category: 'bridal',
    chapterId: 'chapter_bridal_silks',
    defaultLabel: 'Mustard Cotton-Silk Handloom (Curated Concept)'
  },
  'TRS-BR-04': {
    slug: 'mehndi_lehenga',
    title: 'Mehendi Garden Promenade Outfit',
    category: 'bridal',
    chapterId: 'chapter_bridal_silks',
    defaultLabel: 'Emerald Organza Lehenga (Curated Concept)'
  },
  'TRS-GR-01': {
    slug: 'mandap_dhoti',
    title: 'Mandap Pure Silk Dhoti & Kurta',
    category: 'groom',
    chapterId: 'chapter_groom_wear',
    defaultLabel: 'Raw Silk Tussar Dhoti-Kurta (Curated Concept)'
  },
  'TRS-GR-03': {
    slug: 'barat_sherwani',
    title: 'Barat Royal Sherwani',
    category: 'groom',
    chapterId: 'chapter_groom_wear',
    defaultLabel: 'Champagne Gold Jacquard Sherwani (Curated Concept)'
  },
  'TRS-JW-01': {
    slug: 'chandra_haar',
    title: 'Chandra Haar / Temple Gold Choker',
    category: 'jewellery',
    chapterId: 'chapter_jewellery',
    defaultLabel: '22K Temple Gold Choker (Curated Concept)'
  },
  'TRS-OD-01': {
    slug: 'khandua_pata',
    title: 'Nuapatna Khandua Pata',
    category: 'heirlooms',
    chapterId: 'chapter_bridal_silks',
    defaultLabel: 'Holy Gita Govinda Nuapatna Pata (Curated Concept)'
  }
};

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function syncDirectoryRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      syncDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildRegistry() {
  ensureDir(assetsDir);
  const items = [];

  for (const [itemId, meta] of Object.entries(ITEM_MAP)) {
    const itemDir = path.join(assetsDir, meta.slug);
    ensureDir(itemDir);

    const files = fs.readdirSync(itemDir).filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));
    // Sort so _0 comes first, then _1, _2
    files.sort((a, b) => {
      const idxA = parseInt((a.match(/_(\d+)\.jpe?g$/i) || [0, 999])[1], 10);
      const idxB = parseInt((b.match(/_(\d+)\.jpe?g$/i) || [0, 999])[1], 10);
      return idxA - idxB;
    });

    const options = files.map(file => {
      const match = file.match(/_(\d+)\.jpe?g$/i);
      const optionIndex = match ? parseInt(match[1], 10) : 0;
      const isDefault = (optionIndex === 0);
      return {
        optionIndex,
        isDefault,
        label: isDefault ? meta.defaultLabel : `Showroom Option ${optionIndex}`,
        filename: file,
        fileSrc: `./assets/shopping/${meta.slug}/${file}`,
        aspectRatio: '3:4',
        format: 'jpg'
      };
    });

    items.push({
      itemId,
      slug: meta.slug,
      folder: `assets/shopping/${meta.slug}`,
      title: meta.title,
      category: meta.category,
      chapterId: meta.chapterId,
      optionsCount: options.length,
      options
    });
  }

  const registry = {
    version: '1.0.0',
    standard: 'P-UNIVERSAL-VISUAL-ASSET-001',
    updated_at: new Date().toISOString(),
    items
  };

  const registryFile = path.join(assetsDir, 'registry.json');
  fs.writeFileSync(registryFile, JSON.stringify(registry, null, 2), 'utf8');
  console.log(`✅ Generated ${registryFile} with ${items.length} registered item groups.`);

  // Mirror to public
  ensureDir(publicAssetsDir);
  syncDirectoryRecursive(assetsDir, publicAssetsDir);
  console.log(`✅ Synchronized assets/shopping/ to public/assets/shopping/ with 100% byte parity.`);

  return registry;
}

// Update js/shopping-data.js and public/js/shopping-data.js
function enrichShoppingData(registry) {
  const dataFileRoot = path.join(rootDir, 'js', 'shopping-data.js');
  const dataFilePublic = path.join(rootDir, 'public', 'js', 'shopping-data.js');

  const content = fs.readFileSync(dataFileRoot, 'utf8');
  const sandbox = {};
  eval(content.replace('window.', 'sandbox.'));
  const data = sandbox.SHOPPING_REGISTRY_DATA;

  if (!data || !data.items) {
    console.error('❌ Failed to parse SHOPPING_REGISTRY_DATA');
    return;
  }

  const registryMap = new Map();
  registry.items.forEach(it => registryMap.set(it.itemId, it));

  data.items.forEach(item => {
    if (registryMap.has(item.id)) {
      const regItem = registryMap.get(item.id);
      item.slug = regItem.slug;
      item.images = regItem.options.map(opt => ({
        optionIndex: opt.optionIndex,
        isDefault: opt.isDefault,
        label: opt.label,
        src: opt.fileSrc,
        filename: opt.filename
      }));
    } else {
      item.slug = item.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
      item.images = [];
    }
  });

  const outputJs = `/**
 * Sree Krushna Marriage OS — Wedding Trousseau, "Sara" Gifting & Shopping Registry Data
 * Standard: SPEC-PROC-TROUSSEAU-001 / P-SHOPPING-CONSENSUS-001 / P-UNIVERSAL-VISUAL-ASSET-001
 * Ruling: AC-DEC-2026-035 / UI-DEC-2026-031
 * 
 * Aggregates all wedding shopping items, 4-stage chapters, multi-stakeholder consensus
 * clusters, Bhubaneswar retail stores, WhatsApp sharing templates, and visual asset registry.
 */

window.SHOPPING_REGISTRY_DATA = ${JSON.stringify(data, null, 2)};
`;

  fs.writeFileSync(dataFileRoot, outputJs, 'utf8');
  fs.writeFileSync(dataFilePublic, outputJs, 'utf8');
  console.log(`✅ Enriched shopping-data.js (root & public) with image asset contracts.`);
}

if (require.main === module) {
  const registry = buildRegistry();
  enrichShoppingData(registry);
}

module.exports = { buildRegistry, enrichShoppingData, ITEM_MAP };
