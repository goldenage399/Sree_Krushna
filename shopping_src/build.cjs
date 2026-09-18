/**
 * Static Decoupled Component Assembler (SDCA) Compiler — Shopping Registry
 * Standard ID: STD-MOD-COMP-001 | Ruling: AC-DEC-2026-019 / AC-DEC-2026-026
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const baseDir = __dirname;
const rootDir = path.resolve(baseDir, '..');

console.log('⚡ Building Shopping Registry from modular components (SDCA)...');

// Syntax Gate on controller.js
const controllerPath = path.join(baseDir, 'scripts', 'controller.js');
try {
  execFileSync(process.execPath, ['-c', controllerPath], { stdio: 'pipe' });
} catch (err) {
  console.error('❌ controller.js failed node -c syntax validation: ' + err.message);
  process.exit(1);
}

// Assemble Styles (Universal UI Primitives + Module Styles)
const primStylesDir = path.join(rootDir, 'ui_primitives', 'styles');
const primStyleFiles = fs.readdirSync(primStylesDir).filter(f => f.endsWith('.css')).sort();
const primCss = primStyleFiles.map(f => fs.readFileSync(path.join(primStylesDir, f), 'utf8')).join('\n\n    ');

const stylesDir = path.join(baseDir, 'styles');
const styleFiles = fs.readdirSync(stylesDir).filter(f => f.endsWith('.css')).sort();
const moduleCss = styleFiles.map(f => fs.readFileSync(path.join(stylesDir, f), 'utf8')).join('\n\n    ');

const combinedCss = primCss + '\n\n    ' + moduleCss;

// Read Body Component and Shared Modals (Lightbox + Intake Modal + Survey Studio)
let bodyHtml = fs.readFileSync(path.join(baseDir, 'components', 'body.html'), 'utf8');

const tableViewPath = path.join(baseDir, 'components', 'table_view.html');
if (fs.existsSync(tableViewPath)) {
  bodyHtml += '\n\n' + fs.readFileSync(tableViewPath, 'utf8');
}

const surveyStudioPath = path.join(baseDir, 'components', 'survey_studio.html');
if (fs.existsSync(surveyStudioPath)) {
  bodyHtml += '\n\n' + fs.readFileSync(surveyStudioPath, 'utf8');
}

const lightboxModalPath = path.join(rootDir, 'ui_primitives', 'components', 'lightbox.html');
if (fs.existsSync(lightboxModalPath)) {
  bodyHtml += '\n\n' + fs.readFileSync(lightboxModalPath, 'utf8');
}

const intakeModalPath = path.join(rootDir, 'ui_primitives', 'components', 'option_intake_modal.html');
if (fs.existsSync(intakeModalPath)) {
  bodyHtml += '\n\n' + fs.readFileSync(intakeModalPath, 'utf8');
}

const commentsDrawerPath = path.join(rootDir, 'ui_primitives', 'components', 'comments_drawer.html');
if (fs.existsSync(commentsDrawerPath)) {
  bodyHtml += '\n\n' + fs.readFileSync(commentsDrawerPath, 'utf8');
}

// Read Primitives & Controller Scripts
const primScriptsDir = path.join(rootDir, 'ui_primitives', 'scripts');
const primScriptFiles = ['drive_normalizer.js', 'zoom_pan_engine.js', 'comments_engine.js', 'primitives_core.js'];
const primJs = primScriptFiles.map(f => fs.readFileSync(path.join(primScriptsDir, f), 'utf8')).join('\n\n');
const controllerJs = fs.readFileSync(controllerPath, 'utf8');
const fullControllerJs = primJs + '\n\n' + controllerJs;

// Read Template
let template = fs.readFileSync(path.join(baseDir, 'template.html'), 'utf8');

// Inject into Standalone HTML
template = template.replace('/* <!-- INJECT:STYLES --> */', combinedCss);
template = template.replace('<!-- INJECT:BODY -->', bodyHtml);
template = template.replace('/* <!-- INJECT:CONTROLLER --> */', fullControllerJs);

const target1 = path.join(rootDir, 'shopping-registry.html');
const target2 = path.join(rootDir, 'public', 'shopping-registry.html');

fs.writeFileSync(target1, template, 'utf8');
fs.writeFileSync(target2, template, 'utf8');

console.log('✅ Assembled standalone shopping-registry.html (' + fs.statSync(target1).size + ' bytes)');

// Build Scoped Fragment HTML (INC-086 Monolithic Engine Port Gate)
function scopeSelector(sel, prefix) {
  sel = sel.trim();
  if (!sel) return '';
  if (sel === ':root' || sel === 'body') return prefix;
  if (sel === '*') return prefix + ' *';
  if (sel.startsWith('::-webkit-scrollbar')) return prefix + ' ' + sel;
  if (sel.startsWith('@page')) return sel;
  if (sel === 'body *') return sel;
  if (sel.startsWith('#tab-shopping') || sel.startsWith('#shoppingRegistryFrame')) return sel;
  return prefix + ' ' + sel;
}

function scopeCssBlock(css, prefix) {
  let result = '';
  let i = 0;
  const len = css.length;

  while (i < len) {
    while (i < len && /\s/.test(css[i])) {
      result += css[i];
      i++;
    }
    if (i >= len) break;

    if (css.slice(i, i + 2) === '/*') {
      const endComment = css.indexOf('*/', i + 2);
      if (endComment === -1) {
        result += css.slice(i);
        break;
      }
      result += css.slice(i, endComment + 2);
      i = endComment + 2;
      continue;
    }

    if (css.slice(i).match(/^@(font-face|page|keyframes)/)) {
      const openBrace = css.indexOf('{', i);
      let braceCount = 1;
      let j = openBrace + 1;
      while (j < len && braceCount > 0) {
        if (css[j] === '{') braceCount++;
        else if (css[j] === '}') braceCount--;
        j++;
      }
      result += css.slice(i, j);
      i = j;
      continue;
    }

    if (css.slice(i).match(/^@(media|container)[^{]*\{/)) {
      const match = css.slice(i).match(/^(@(media|container)[^{]*\{)/);
      const mediaHeader = match[1];
      result += mediaHeader + '\n';
      i += mediaHeader.length;

      let innerCss = '';
      let braceCount = 1;
      while (i < len && braceCount > 0) {
        if (css.slice(i, i + 2) === '/*') {
          const endComment = css.indexOf('*/', i + 2);
          const cEnd = endComment === -1 ? len : endComment + 2;
          innerCss += css.slice(i, cEnd);
          i = cEnd;
          continue;
        }
        if (css[i] === '{') braceCount++;
        else if (css[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            i++;
            break;
          }
        }
        innerCss += css[i];
        i++;
      }
      result += scopeCssBlock(innerCss, prefix) + '\n}\n';
      continue;
    }

    const openBrace = css.indexOf('{', i);
    if (openBrace === -1) {
      result += css.slice(i);
      break;
    }

    const selectorChunk = css.slice(i, openBrace).trim();
    const closeBrace = css.indexOf('}', openBrace);
    if (closeBrace === -1) {
      result += css.slice(i);
      break;
    }
    const declarationChunk = css.slice(openBrace + 1, closeBrace);

    if (selectorChunk) {
      const scopedSelectors = selectorChunk
        .split(',')
        .map(s => scopeSelector(s, prefix))
        .filter(Boolean)
        .join(',\n');
      result += scopedSelectors + ' {' + declarationChunk + '}';
    } else {
      result += '{' + declarationChunk + '}';
    }

    i = closeBrace + 1;
  }

  return result;
}

const fragmentPrefix = '#tab-shopping #shoppingRegistryFrame';
const scopedCss = scopeCssBlock(combinedCss, fragmentPrefix);

const fragmentHtml = `<!-- Sree Krushna Marriage OS — Shopping Registry & Family Survey Scoped Fragment -->
<!-- Standard: STD-MOD-COMP-001 | Ruling: AC-DEC-2026-026 / UI-DEC-2026-022 -->
<style data-source="shopping-fragment">
${scopedCss}
</style>

<div id="shoppingRegistryFrame">
${bodyHtml}
</div>

<script src="/js/shopping-data.js"></script>
<script>
${fullControllerJs}
</script>
`;

const targetFragmentRoot = path.join(rootDir, 'shopping-fragment.html');
const targetFragmentPublic = path.join(rootDir, 'public', 'shopping-fragment.html');

fs.writeFileSync(targetFragmentRoot, fragmentHtml, 'utf8');
fs.writeFileSync(targetFragmentPublic, fragmentHtml, 'utf8');
console.log('✅ Assembled scoped shopping-fragment.html (' + fs.statSync(targetFragmentRoot).size + ' bytes)');
