/**
 * Static Decoupled Component Assembler (SDCA) Compiler — Shopping Registry
 * Standard ID: STD-MOD-COMP-001 | Ruling: AC-DEC-2026-019 / AC-DEC-2026-022
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

// Read Body Component and Shared Modals (Lightbox + Intake Modal)
let bodyHtml = fs.readFileSync(path.join(baseDir, 'components', 'body.html'), 'utf8');

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

// Inject
template = template.replace('/* <!-- INJECT:STYLES --> */', combinedCss);
template = template.replace('<!-- INJECT:BODY -->', bodyHtml);
template = template.replace('/* <!-- INJECT:CONTROLLER --> */', fullControllerJs);

const target1 = path.join(rootDir, 'shopping-registry.html');
const target2 = path.join(rootDir, 'public', 'shopping-registry.html');

fs.writeFileSync(target1, template, 'utf8');
fs.writeFileSync(target2, template, 'utf8');

console.log('✅ Assembled shopping-registry.html (' + fs.statSync(target1).size + ' bytes)');
