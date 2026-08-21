const fs = require('fs');
const path = require('path');

const root = 'd:/GitHub_Repo/Sree_Krushna/public';
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

// 1. Extract CSS
const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const allCss = styleMatch[1];
  fs.writeFileSync(path.join(root, 'css/main.css'), allCss.trim() + '\n', 'utf8');
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/, '  <link rel="stylesheet" href="/css/main.css">');
}

// 2. Extract inline scripts
const scriptMatches = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)];
if (scriptMatches.length > 0) {
  // First script in head is theme hydration
  const headScript = scriptMatches[0][1];
  fs.writeFileSync(path.join(root, 'js/theme-init.js'), headScript.trim() + '\n', 'utf8');
  html = html.replace(scriptMatches[0][0], '<script src="/js/theme-init.js"></script>');

  // The remaining body scripts
  const bodyScripts = scriptMatches.slice(1).map(m => m[1]).join('\n\n');
  fs.writeFileSync(path.join(root, 'js/app.js'), bodyScripts.trim() + '\n', 'utf8');
  
  for (let i = 1; i < scriptMatches.length; i++) {
    html = html.replace(scriptMatches[i][0], '');
  }
  
  html = html.replace('</body>', '  <script src="/js/app.js"></script>\n</body>');
}

// Clean up temporary files
if (fs.existsSync(path.join(root, 'extracted_styles.css'))) fs.unlinkSync(path.join(root, 'extracted_styles.css'));
if (fs.existsSync(path.join(root, 'extracted_scripts.js'))) fs.unlinkSync(path.join(root, 'extracted_scripts.js'));

fs.writeFileSync(path.join(root, 'index.html'), html, 'utf8');

const newLines = html.split('\n').length;
console.log('Successfully modularized public/index.html from 3,419 lines to ' + newLines + ' lines!');
