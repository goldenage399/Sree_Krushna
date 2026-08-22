const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('index.html', 'utf8');
const appJs = fs.readFileSync('public/js/app.js', 'utf8');

// Extract all tags with onclick
const regex = /<([a-zA-Z0-9]+)[^>]*\bonclick="([^"]+)"[^>]*>/g;
let match;
const buttons = [];

while ((match = regex.exec(html)) !== null) {
  buttons.push({
    tag: match[1],
    fullTag: match[0],
    handler: match[2]
  });
}

console.log(Found  interactive elements with onclick in index.html:\n);
buttons.forEach((b, idx) => {
  console.log([#] <> onclick="");
});
