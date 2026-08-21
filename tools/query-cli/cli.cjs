#!/usr/bin/env node

/**
 * CB-INTROSPECTION-001 Query CLI
 * Unified query interface for component, function, style, and Firestore maps
 *
 * Usage:
 *   npm run query -- --component TaskCreationWizard
 *   npm run query -- --function handleSubmit
 *   npm run query -- --style btn-primary
 *   npm run query -- --firestore users
 *   npm run query -- --impact src/components/TaskCreation/TaskCreationWizard.jsx
 *
 * Output Formats:
 *   --format console (default) - Pretty-printed with colors
 *   --format json - Machine-readable JSON
 *   --format markdown - Documentation generation
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

// Risk tier indicators
const riskTiers = {
  high: { symbol: '🔴', label: 'HIGH', color: colors.red, threshold: 10 },
  medium: { symbol: '🟡', label: 'MEDIUM', color: colors.yellow, threshold: 4 },
  low: { symbol: '🟢', label: 'LOW', color: colors.green, threshold: 1 },
  none: { symbol: '⚪', label: 'NONE', color: colors.gray, threshold: 0 }
};

class QueryCLI {
  constructor() {
    this.cacheDir = path.join(__dirname, '../../.cache');
    this.maps = {};
  }

  /**
   * Load all cache maps
   */
  loadMaps() {
    const mapFiles = {
      component: 'component-map.json',
      function: 'function-map.json',
      style: 'style-map.json',
      firestore: 'firestore-map.json',
      token: 'token-map.json'
    };

    for (const [type, filename] of Object.entries(mapFiles)) {
      const filepath = path.join(this.cacheDir, filename);
      if (fs.existsSync(filepath)) {
        try {
          this.maps[type] = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
        } catch (error) {
          console.error(`${colors.red}Error loading ${filename}: ${error.message}${colors.reset}`);
        }
      }
    }
  }

  /**
   * Calculate risk tier based on consumer count
   */
  calculateRiskTier(count) {
    if (count >= riskTiers.high.threshold) return 'high';
    if (count >= riskTiers.medium.threshold) return 'medium';
    if (count >= riskTiers.low.threshold) return 'low';
    return 'none';
  }

  /**
   * Query component map
   */
  queryComponent(componentName, format = 'console') {
    if (!this.maps.component) {
      return this.error('Component map not found. Run: npm run map:components');
    }

    const files = this.maps.component.files || {};
    const matches = [];

    // Search for component in files
    for (const [filepath, data] of Object.entries(files)) {
      if (filepath.includes(componentName) || data.components?.includes(componentName)) {
        matches.push({
          file: filepath,
          components: data.components || [],
          imports: data.imports || [],
          consumers: data.consumers || [],
          riskTier: this.calculateRiskTier((data.consumers || []).length)
        });
      }
    }

    return this.formatOutput({
      type: 'component',
      query: componentName,
      matches,
      totalMatches: matches.length
    }, format);
  }

  /**
   * Query function map
   */
  queryFunction(functionName, format = 'console') {
    if (!this.maps.function) {
      return this.error('Function map not found. Run: npm run map:functions');
    }

    const functions = this.maps.function.functions || {};
    const matches = [];

    // Search for function across all files
    for (const [filepath, data] of Object.entries(functions)) {
      if (data.functions?.includes(functionName)) {
        matches.push({
          file: filepath,
          functions: data.functions,
          count: data.count
        });
      }
    }

    return this.formatOutput({
      type: 'function',
      query: functionName,
      matches,
      totalMatches: matches.length,
      statistics: this.maps.function.statistics
    }, format);
  }

  /**
   * Query style map
   */
  queryStyle(className, format = 'console') {
    if (!this.maps.style) {
      return this.error('Style map not found. Run: npm run map:styles');
    }

    const classUsage = this.maps.style.class_usage || {};
    const usages = classUsage[className] || [];

    // Count unique files
    const uniqueFiles = [...new Set(usages)];
    const riskTier = this.calculateRiskTier(uniqueFiles.length);

    return this.formatOutput({
      type: 'style',
      query: className,
      totalUsages: usages.length,
      uniqueFiles: uniqueFiles.length,
      files: uniqueFiles,
      riskTier,
      statistics: this.maps.style.statistics
    }, format);
  }

  /**
   * Query token map — where a CSS custom property is defined, where it's consumed, and
   * whether it's an orphan (defined, never read) or a phantom (read, missing in some theme).
   * See scripts/cache-builders/build-token-map.cjs for the "known limitation" note: phantom
   * findings are a lead to verify against the consuming selector's scope, not a confirmed bug.
   */
  queryToken(tokenName, format = 'console') {
    if (!this.maps.token) {
      return this.error('Token map not found. Run: npm run cache:build:tokens');
    }

    const name = tokenName.startsWith('--') ? tokenName : `--${tokenName}`;
    const entry = this.maps.token.tokens?.[name];

    if (!entry) {
      return this.formatOutput({
        type: 'token',
        query: name,
        found: false,
        message: `No token named "${name}" found in definitions or consumption. Check spelling, or it may not exist yet.`
      }, format);
    }

    const orphan = this.maps.token.findings.orphans.find((o) => o.token === name);
    const phantom = this.maps.token.findings.phantoms.find((p) => p.token === name);
    const gradientRisk = this.maps.token.findings.gradientRisks.find((g) => g.token === name);

    return this.formatOutput({
      type: 'token',
      query: name,
      found: true,
      definedIn: entry.definedIn,
      consumedBy: entry.consumedBy,
      gradientInThemes: entry.gradientInThemes,
      isOrphan: !!orphan,
      isPhantom: !!phantom,
      phantomMissingFrom: phantom?.missingFrom,
      isGradientRisk: !!gradientRisk,
      themesTracked: this.maps.token.themes
    }, format);
  }

  /**
   * Query frontend knowledge index (JSONL)
   * Searches incidents, constraints, and fix patterns by symptom/keyword
   */
  queryFrontend(terms, format = 'console') {
    const indexPath = path.join(__dirname, '../../docs/frontend/frontend-knowledge-index.jsonl');
    if (!fs.existsSync(indexPath)) {
      return this.error('Frontend knowledge index not found. Expected: docs/frontend/frontend-knowledge-index.jsonl');
    }

    const lines = fs.readFileSync(indexPath, 'utf-8').split('\n').filter(l => l.trim());
    const searchTerms = terms.toLowerCase().split(/\s+/);
    const matches = [];

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        const searchText = [
          entry.id || '',
          entry.title || '',
          ...(entry.topologyLayers || []),
          ...(entry.symptoms || []),
          ...(entry.keywords || []),
          ...(entry.fixPatterns || []),
          ...(entry.ownershipType || [])
        ].join(' ').toLowerCase();

        const score = searchTerms.filter(t => searchText.includes(t)).length;
        if (score > 0) matches.push({ entry, score });
      } catch (_) { /* skip invalid lines */ }
    }

    matches.sort((a, b) => b.score - a.score);

    return this.formatOutput({
      type: 'frontend',
      query: terms,
      matches: matches.map(m => m.entry),
      totalMatches: matches.length
    }, format);
  }

  /**
   * Query backend knowledge index (JSONL)
   * Same schema/search as queryFrontend, sourced from the backend-specific index
   */
  queryBackend(terms, format = 'console') {
    const indexPath = path.join(__dirname, '../../docs/backend/backend-knowledge-index.jsonl');
    if (!fs.existsSync(indexPath)) {
      return this.error('Backend knowledge index not found. Expected: docs/backend/backend-knowledge-index.jsonl');
    }

    const lines = fs.readFileSync(indexPath, 'utf-8').split('\n').filter(l => l.trim());
    const searchTerms = terms.toLowerCase().split(/\s+/);
    const matches = [];

    for (const line of lines) {
      try {
        const entry = JSON.parse(line);
        const searchText = [
          entry.id || '',
          entry.title || '',
          ...(entry.topologyLayers || []),
          ...(entry.symptoms || []),
          ...(entry.keywords || []),
          ...(entry.fixPatterns || []),
          ...(entry.ownershipType || [])
        ].join(' ').toLowerCase();

        const score = searchTerms.filter(t => searchText.includes(t)).length;
        if (score > 0) matches.push({ entry, score });
      } catch (_) { /* skip invalid lines */ }
    }

    matches.sort((a, b) => b.score - a.score);

    return this.formatOutput({
      type: 'backend',
      query: terms,
      matches: matches.map(m => m.entry),
      totalMatches: matches.length
    }, format);
  }

  /**
   * Query context map (semantic/concept search)
   */
  queryConcept(searchTerm, format = 'console') {
    if (!this.maps.context) {
      // Try to load context map
      try {
        const contextPath = path.join(this.cacheDir, 'context-map.json');
        if (fs.existsSync(contextPath)) {
          this.maps.context = JSON.parse(fs.readFileSync(contextPath, 'utf-8'));
        } else {
          return this.error('Context map not found. Run: npm run map:context');
        }
      } catch (error) {
        return this.error('Failed to load context map: ' + error.message);
      }
    }

    const contextMap = this.maps.context;
    const searchLower = searchTerm.toLowerCase();
    const matches = [];

    // Strategy 1: Exact entity ID match
    if (contextMap.entities[searchLower]) {
      matches.push({
        entity: contextMap.entities[searchLower],
        matchType: 'exact',
        confidence: 1.0
      });
    }

    // Strategy 2: Keyword index lookup (fuzzy)
    const keywordMatches = new Set();
    for (const [keyword, entityIds] of Object.entries(contextMap.index || {})) {
      if (keyword.includes(searchLower) || searchLower.includes(keyword)) {
        entityIds.forEach(id => keywordMatches.add(id));
      }
    }

    // Strategy 3: Primary concept fuzzy match
    for (const [entityId, entity] of Object.entries(contextMap.entities)) {
      const conceptLower = entity.primary_concept.toLowerCase();
      if (conceptLower.includes(searchLower) || searchLower.includes(conceptLower)) {
        keywordMatches.add(entityId);
      }
    }

    // Add keyword matches
    for (const entityId of keywordMatches) {
      if (!matches.some(m => m.entity.entity_id === entityId)) {
        const entity = contextMap.entities[entityId];
        // Calculate confidence based on keyword relevance
        const keywordScore = entity.keywords.filter(kw =>
          kw.includes(searchLower) || searchLower.includes(kw)
        ).length / entity.keywords.length;

        matches.push({
          entity,
          matchType: 'fuzzy',
          confidence: keywordScore
        });
      }
    }

    // Sort by confidence
    matches.sort((a, b) => b.confidence - a.confidence);

    return this.formatOutput({
      type: 'concept',
      query: searchTerm,
      matches,
      totalMatches: matches.length,
      statistics: contextMap.statistics
    }, format);
  }

  /**
   * Query Firestore map
   */
  queryFirestore(collectionName, format = 'console') {
    if (!this.maps.firestore) {
      return this.error('Firestore map not found. Run: npm run map:firestore');
    }

    const collections = this.maps.firestore.collections || {};
    const collection = collections[collectionName];

    if (!collection) {
      return this.formatOutput({
        type: 'firestore',
        query: collectionName,
        found: false,
        availableCollections: Object.keys(collections)
      }, format);
    }

    return this.formatOutput({
      type: 'firestore',
      query: collectionName,
      found: true,
      collection: {
        name: collectionName,
        usage_count: collection.usage_count,
        referenced_in: collection.referenced_in
      }
    }, format);
  }

  /**
   * Cross-cache impact analysis
   */
  queryImpact(filepath, format = 'console') {
    const results = {
      type: 'impact',
      query: filepath,
      component: null,
      functions: null,
      styles: null,
      firestore: null,
      overallRisk: 'none'
    };

    // Component impact
    if (this.maps.component?.files?.[filepath]) {
      const componentData = this.maps.component.files[filepath];
      results.component = {
        consumers: componentData.consumers || [],
        imports: componentData.imports || [],
        riskTier: this.calculateRiskTier((componentData.consumers || []).length)
      };
    }

    // Function impact
    if (this.maps.function?.functions?.[filepath]) {
      results.functions = this.maps.function.functions[filepath];
    }

    // Calculate overall risk (highest risk tier wins)
    const risks = ['high', 'medium', 'low', 'none'];
    if (results.component) {
      const componentRiskIndex = risks.indexOf(results.component.riskTier);
      const currentRiskIndex = risks.indexOf(results.overallRisk);
      if (componentRiskIndex < currentRiskIndex) {
        results.overallRisk = results.component.riskTier;
      }
    }

    return this.formatOutput(results, format);
  }

  /**
   * Format output based on format type
   */
  formatOutput(data, format) {
    switch (format) {
      case 'json':
        return this.formatJSON(data);
      case 'markdown':
        return this.formatMarkdown(data);
      default:
        return this.formatConsole(data);
    }
  }

  /**
   * Format as JSON
   */
  formatJSON(data) {
    console.log(JSON.stringify(data, null, 2));
  }

  /**
   * Format as Markdown
   */
  formatMarkdown(data) {
    let output = `# Query Results: ${data.query}\n\n`;
    output += `**Type**: ${data.type}\n\n`;

    if (data.type === 'component' && data.matches) {
      output += `## Matches: ${data.totalMatches}\n\n`;
      data.matches.forEach(match => {
        const tier = riskTiers[match.riskTier];
        output += `### ${tier.symbol} ${match.file}\n\n`;
        output += `- **Risk Tier**: ${tier.label}\n`;
        output += `- **Consumers**: ${match.consumers.length}\n`;
        output += `- **Imports**: ${match.imports.length}\n\n`;
      });
    } else if (data.type === 'style') {
      const tier = riskTiers[data.riskTier];
      output += `${tier.symbol} **Risk Tier**: ${tier.label}\n\n`;
      output += `- **Total Usages**: ${data.totalUsages}\n`;
      output += `- **Unique Files**: ${data.uniqueFiles}\n\n`;
      output += `### Files Using This Class\n\n`;
      data.files.forEach(file => {
        output += `- ${file}\n`;
      });
    }

    console.log(output);
  }

  /**
   * Format as console output with colors
   */
  formatConsole(data) {
    console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Query Results: ${colors.white}${data.query}${colors.reset}`);
    console.log(`${colors.gray}Type: ${data.type}${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

    if (data.type === 'component') {
      this.formatComponentConsole(data);
    } else if (data.type === 'function') {
      this.formatFunctionConsole(data);
    } else if (data.type === 'style') {
      this.formatStyleConsole(data);
    } else if (data.type === 'token') {
      this.formatTokenConsole(data);
    } else if (data.type === 'firestore') {
      this.formatFirestoreConsole(data);
    } else if (data.type === 'impact') {
      this.formatImpactConsole(data);
    } else if (data.type === 'concept') {
      this.formatConceptConsole(data);
    } else if (data.type === 'frontend') {
      this.formatFrontendConsole(data);
    } else if (data.type === 'backend') {
      this.formatFrontendConsole(data);
    }

    console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  }

  formatComponentConsole(data) {
    if (data.totalMatches === 0) {
      console.log(`${colors.yellow}No matches found${colors.reset}`);
      return;
    }

    console.log(`${colors.bright}Total Matches: ${data.totalMatches}${colors.reset}\n`);

    data.matches.forEach((match, index) => {
      const tier = riskTiers[match.riskTier];
      console.log(`${tier.symbol} ${tier.color}${colors.bright}Risk: ${tier.label}${colors.reset} - ${colors.white}${match.file}${colors.reset}`);
      console.log(`   ${colors.gray}Components: ${match.components.length} | Imports: ${match.imports.length} | Consumers: ${match.consumers.length}${colors.reset}`);

      if (match.consumers.length > 0) {
        console.log(`   ${colors.cyan}Consumers:${colors.reset}`);
        match.consumers.slice(0, 5).forEach(consumer => {
          console.log(`     - ${consumer}`);
        });
        if (match.consumers.length > 5) {
          console.log(`     ${colors.gray}... and ${match.consumers.length - 5} more${colors.reset}`);
        }
      }
      console.log();
    });
  }

  formatTokenConsole(data) {
    if (!data.found) {
      console.log(`${colors.yellow}${data.message}${colors.reset}`);
      return;
    }

    console.log(`${colors.bright}Defined in:${colors.reset} ${Object.keys(data.definedIn).length ? '' : colors.gray + '(nowhere)' + colors.reset}`);
    for (const [scope, info] of Object.entries(data.definedIn)) {
      const gradTag = info.isGradient ? `${colors.magenta}[GRADIENT]${colors.reset}` : '';
      console.log(`   ${colors.white}${scope.padEnd(14)}${colors.reset} = ${info.value}  ${gradTag}  ${colors.gray}(${info.file})${colors.reset}`);
    }

    console.log(`\n${colors.bright}Consumed by:${colors.reset} ${data.consumedBy.length ? '' : colors.gray + '(nowhere — ORPHAN)' + colors.reset}`);
    data.consumedBy.slice(0, 10).forEach((c) => {
      console.log(`   ${colors.cyan}${c.file}${colors.reset} ${colors.gray}(${c.count}x)${colors.reset}`);
    });
    if (data.consumedBy.length > 10) {
      console.log(`   ${colors.gray}... and ${data.consumedBy.length - 10} more${colors.reset}`);
    }

    console.log();
    if (data.isOrphan) {
      console.log(`${colors.red}🔴 ORPHAN — defined but never consumed anywhere in src/. Dead styling (INC-064 shape).${colors.reset}`);
    }
    if (data.isPhantom) {
      console.log(`${colors.yellow}🟡 PHANTOM lead — consumed, but not defined for: ${data.phantomMissingFrom.join(', ')}.${colors.reset}`);
      console.log(`   ${colors.gray}Verify: is the consuming selector itself scoped to a theme that DOES define it? See the "known limitation" note in build-token-map.cjs — this may be a false positive.${colors.reset}`);
    }
    if (data.isGradientRisk) {
      console.log(`${colors.magenta}⚠️  Holds a gradient in some theme(s) and is consumed elsewhere — verify no color:/border:/color-mix() usage (TOKEN-TYPE-001, INC-057/062).${colors.reset}`);
    }
    if (!data.isOrphan && !data.isPhantom && !data.isGradientRisk) {
      console.log(`${colors.green}✅ No known issues.${colors.reset}`);
    }
  }

  formatFunctionConsole(data) {
    if (data.totalMatches === 0) {
      console.log(`${colors.yellow}No matches found${colors.reset}`);
      console.log(`${colors.gray}Total functions in codebase: ${data.statistics?.total_functions || 0}${colors.reset}`);
      return;
    }

    console.log(`${colors.bright}Total Matches: ${data.totalMatches}${colors.reset}\n`);

    data.matches.forEach(match => {
      console.log(`${colors.green}✓${colors.reset} ${colors.white}${match.file}${colors.reset}`);
      console.log(`   ${colors.gray}Functions in file: ${match.count}${colors.reset}`);
      if (match.functions.length <= 10) {
        console.log(`   ${colors.cyan}All functions:${colors.reset} ${match.functions.join(', ')}`);
      }
      console.log();
    });

    if (data.statistics) {
      console.log(`${colors.gray}Statistics: ${data.statistics.total_functions} functions across ${data.statistics.files_with_functions} files${colors.reset}`);
    }
  }

  formatStyleConsole(data) {
    const tier = riskTiers[data.riskTier];

    console.log(`${tier.symbol} ${tier.color}${colors.bright}Risk Tier: ${tier.label}${colors.reset}`);
    console.log(`${colors.bright}Total Usages:${colors.reset} ${data.totalUsages}`);
    console.log(`${colors.bright}Unique Files:${colors.reset} ${data.uniqueFiles}\n`);

    if (data.uniqueFiles === 0) {
      console.log(`${colors.yellow}⚠ Class not found in codebase${colors.reset}`);
      console.log(`${colors.gray}Total classes tracked: ${data.statistics?.total_unique_classes || 0}${colors.reset}`);
      return;
    }

    console.log(`${colors.cyan}Files Using This Class:${colors.reset}`);
    data.files.slice(0, 20).forEach(file => {
      console.log(`  ${colors.green}✓${colors.reset} ${file}`);
    });

    if (data.files.length > 20) {
      console.log(`  ${colors.gray}... and ${data.files.length - 20} more files${colors.reset}`);
    }
  }

  formatFirestoreConsole(data) {
    if (!data.found) {
      console.log(`${colors.yellow}Collection not found: ${data.query}${colors.reset}\n`);
      console.log(`${colors.cyan}Available collections:${colors.reset}`);
      data.availableCollections.forEach(name => {
        console.log(`  - ${name}`);
      });
      return;
    }

    const collection = data.collection;
    console.log(`${colors.green}✓${colors.reset} ${colors.bright}Collection: ${collection.name}${colors.reset}`);
    console.log(`${colors.gray}Usage Count: ${collection.usage_count || 0}${colors.reset}\n`);

    if (collection.referenced_in && collection.referenced_in.length > 0) {
      console.log(`${colors.cyan}Referenced In:${colors.reset}`);
      collection.referenced_in.forEach(file => {
        console.log(`  - ${colors.white}${file}${colors.reset}`);
      });
    }
  }

  formatConceptConsole(data) {
    if (data.totalMatches === 0) {
      console.log(`${colors.yellow}No matches found${colors.reset}`);
      console.log(`${colors.gray}Total entities in context map: ${data.statistics?.total_entities || 0}${colors.reset}`);
      return;
    }

    console.log(`${colors.bright}Total Matches: ${data.totalMatches}${colors.reset}\n`);

    data.matches.slice(0, 10).forEach((match, index) => {
      const entity = match.entity;
      const confidencePercent = (match.confidence * 100).toFixed(0);
      const confidenceColor = match.confidence > 0.7 ? colors.green : match.confidence > 0.4 ? colors.yellow : colors.gray;

      console.log(`${colors.bright}${index + 1}. ${colors.white}${entity.primary_concept}${colors.reset} ${confidenceColor}(${confidencePercent}% match)${colors.reset}`);
      console.log(`   ${colors.cyan}Summary:${colors.reset} ${entity.summary}`);
      console.log(`   ${colors.gray}Type: ${entity.entity_type} | Category: ${entity.category} | Priority: ${entity.priority}${colors.reset}`);

      if (entity.files.length > 0) {
        console.log(`   ${colors.cyan}Files:${colors.reset}`);
        entity.files.slice(0, 3).forEach(file => {
          console.log(`     - ${file}`);
        });
        if (entity.files.length > 3) {
          console.log(`     ${colors.gray}... and ${entity.files.length - 3} more${colors.reset}`);
        }
      }

      if (entity.functions.length > 0) {
        console.log(`   ${colors.cyan}Functions:${colors.reset} ${entity.functions.slice(0, 5).join(', ')}`);
        if (entity.functions.length > 5) {
          console.log(`     ${colors.gray}... and ${entity.functions.length - 5} more${colors.reset}`);
        }
      }

      if (entity.collections.length > 0) {
        console.log(`   ${colors.cyan}Collections:${colors.reset} ${entity.collections.join(', ')}`);
      }

      if (entity.keywords.length > 0) {
        const relevantKeywords = entity.keywords.filter(kw =>
          kw.includes(data.query.toLowerCase()) || data.query.toLowerCase().includes(kw)
        );
        if (relevantKeywords.length > 0) {
          console.log(`   ${colors.cyan}Keywords:${colors.reset} ${relevantKeywords.join(', ')}`);
        }
      }

      console.log();
    });

    if (data.totalMatches > 10) {
      console.log(`${colors.gray}... and ${data.totalMatches - 10} more matches${colors.reset}`);
    }
  }

  formatFrontendConsole(data) {
    if (data.totalMatches === 0) {
      console.log(`${colors.yellow}No matches found for: "${data.query}"${colors.reset}`);
      console.log(`${colors.gray}Try broader terms (e.g. "overflow" instead of "overflow-auto")${colors.reset}`);
      return;
    }

    console.log(`${colors.bright}Matches: ${data.totalMatches}${colors.reset}\n`);

    data.matches.forEach((entry, i) => {
      const typeIcon = entry.type === 'incident' ? '🔴' : '🔧';
      const layers = (entry.topologyLayers || []).join(', ');
      console.log(`${typeIcon} ${colors.bright}${entry.id || entry.type}${colors.reset}  ${colors.cyan}[${layers}]${colors.reset}`);
      if (entry.title) console.log(`   ${colors.white}${entry.title}${colors.reset}`);
      if (entry.symptoms && entry.symptoms.length > 0) {
        console.log(`   ${colors.gray}Symptoms: ${entry.symptoms.slice(0, 3).join(', ')}${colors.reset}`);
      }
      if (entry.fixPatterns && entry.fixPatterns.length > 0) {
        console.log(`   ${colors.green}Fix: ${entry.fixPatterns[0]}${colors.reset}`);
      }
      if (entry.relatedFiles && entry.relatedFiles.length > 0) {
        console.log(`   ${colors.gray}→ ${entry.relatedFiles[0]}${colors.reset}`);
      }
      console.log();
    });
  }

  formatImpactConsole(data) {
    const tier = riskTiers[data.overallRisk];

    console.log(`${tier.symbol} ${tier.color}${colors.bright}Overall Risk: ${tier.label}${colors.reset}\n`);

    if (data.component) {
      const componentTier = riskTiers[data.component.riskTier];
      console.log(`${colors.cyan}Component Impact:${colors.reset}`);
      console.log(`  ${componentTier.symbol} Risk: ${componentTier.label}`);
      console.log(`  ${colors.gray}Consumers: ${data.component.consumers.length}${colors.reset}`);
      console.log(`  ${colors.gray}Imports: ${data.component.imports.length}${colors.reset}`);

      if (data.component.consumers.length > 0) {
        console.log(`\n  ${colors.cyan}Top Consumers:${colors.reset}`);
        data.component.consumers.slice(0, 5).forEach(consumer => {
          console.log(`    - ${consumer}`);
        });
        if (data.component.consumers.length > 5) {
          console.log(`    ${colors.gray}... and ${data.component.consumers.length - 5} more${colors.reset}`);
        }
      }
      console.log();
    }

    if (data.functions) {
      console.log(`${colors.cyan}Function Impact:${colors.reset}`);
      console.log(`  ${colors.gray}Functions defined: ${data.functions.count}${colors.reset}`);
      if (data.functions.functions.length <= 10) {
        console.log(`  ${colors.white}${data.functions.functions.join(', ')}${colors.reset}`);
      }
      console.log();
    }

    if (!data.component && !data.functions) {
      console.log(`${colors.yellow}No impact data found for this file${colors.reset}`);
    }
  }

  /**
   * Error handler
   */
  error(message) {
    console.error(`${colors.red}${colors.bright}Error:${colors.reset} ${message}`);
    process.exit(1);
  }

  /**
   * Display help
   */
  showHelp() {
    console.log(`
${colors.bright}${colors.cyan}CB-INTROSPECTION-001 Query CLI${colors.reset}
${colors.gray}Unified query interface for codebase introspection${colors.reset}

${colors.bright}Usage:${colors.reset}
  npm run query -- --component <name>   Query component map
  npm run query -- --function <name>    Query function map
  npm run query -- --style <class>      Query style map
  npm run query -- --token <name>       ${colors.green}Token definition/consumption map (NEW)${colors.reset}
  npm run query -- --firestore <name>   Query Firestore collections
  npm run query -- --concept <term>     ${colors.green}Semantic concept search${colors.reset}
  npm run query -- --frontend <terms>  ${colors.green}Frontend incident/constraint search (NEW)${colors.reset}
  npm run query -- --backend <terms>   ${colors.green}Backend incident/invariant search (NEW)${colors.reset}
  npm run query -- --impact <filepath>  Cross-cache impact analysis

${colors.bright}Options:${colors.reset}
  --format <type>   Output format: console (default), json, markdown

${colors.bright}Examples:${colors.reset}
  npm run query -- --component TaskCreationWizard
  npm run query -- --function handleSubmit
  npm run query -- --style btn-primary
  npm run query -- --token theme-button-secondary   ${colors.green}← is it defined? consumed? orphaned?${colors.reset}
  npm run query -- --firestore users
  npm run query -- --concept featureFlag      ${colors.green}← Semantic search${colors.reset}
  npm run query -- --concept authentication
  npm run query -- --frontend overflow modal
  npm run query -- --frontend fieldset flex blowout
  npm run query -- --frontend zero results profile
  npm run query -- --backend firestore rule missing
  npm run query -- --backend write without reader
  npm run query -- --impact src/components/TaskCreation/TaskCreationWizard.jsx
  npm run query -- --style btn-primary --format json

${colors.bright}Risk Tiers:${colors.reset}
  🔴 HIGH     - 10+ consumers (architectural review, feature flags, 2-3x testing)
  🟡 MEDIUM   - 4-9 consumers (coordinate teams, test all consumers)
  🟢 LOW      - 1-3 consumers (standard review, targeted testing)
  ⚪ NONE     - 0 consumers (maximum agility, prototype freely)
`);
  }

  /**
   * Main execution
   */
  run(args) {
    // Parse arguments
    const componentIndex = args.indexOf('--component');
    const functionIndex = args.indexOf('--function');
    const styleIndex = args.indexOf('--style');
    const tokenIndex = args.indexOf('--token');
    const firestoreIndex = args.indexOf('--firestore');
    const conceptIndex = args.indexOf('--concept');
    const impactIndex = args.indexOf('--impact');
    const formatIndex = args.indexOf('--format');
    const helpIndex = args.indexOf('--help') >= 0 || args.indexOf('-h') >= 0;

    if (helpIndex || args.length === 0) {
      this.showHelp();
      return;
    }

    const format = formatIndex >= 0 ? args[formatIndex + 1] : 'console';

    // Load all maps
    this.loadMaps();

    // Execute query
    if (componentIndex >= 0) {
      const componentName = args[componentIndex + 1];
      if (!componentName) return this.error('Component name required');
      this.queryComponent(componentName, format);
    } else if (functionIndex >= 0) {
      const functionName = args[functionIndex + 1];
      if (!functionName) return this.error('Function name required');
      this.queryFunction(functionName, format);
    } else if (styleIndex >= 0) {
      const className = args[styleIndex + 1];
      if (!className) return this.error('Class name required');
      this.queryStyle(className, format);
    } else if (tokenIndex >= 0) {
      const tokenName = args[tokenIndex + 1];
      if (!tokenName) return this.error('Token name required (e.g. --token theme-button-secondary or --theme-accent)');
      this.queryToken(tokenName, format);
    } else if (firestoreIndex >= 0) {
      const collectionName = args[firestoreIndex + 1];
      if (!collectionName) return this.error('Collection name required');
      this.queryFirestore(collectionName, format);
    } else if (conceptIndex >= 0) {
      const searchTerm = args[conceptIndex + 1];
      if (!searchTerm) return this.error('Search term required');
      this.queryConcept(searchTerm, format);
    } else if (args.indexOf('--frontend') >= 0) {
      const frontendIndex = args.indexOf('--frontend');
      const terms = args.slice(frontendIndex + 1).filter(a => !a.startsWith('--')).join(' ');
      if (!terms) return this.error('Search terms required (e.g. --frontend overflow modal)');
      this.queryFrontend(terms, format);
    } else if (args.indexOf('--backend') >= 0) {
      const backendIndex = args.indexOf('--backend');
      const terms = args.slice(backendIndex + 1).filter(a => !a.startsWith('--')).join(' ');
      if (!terms) return this.error('Search terms required (e.g. --backend firestore rule missing)');
      this.queryBackend(terms, format);
    } else if (impactIndex >= 0) {
      const filepath = args[impactIndex + 1];
      if (!filepath) return this.error('File path required');
      this.queryImpact(filepath, format);
    } else {
      this.showHelp();
    }
  }
}

// Execute CLI
if (require.main === module) {
  const cli = new QueryCLI();
  cli.run(process.argv.slice(2));
}

module.exports = QueryCLI;
