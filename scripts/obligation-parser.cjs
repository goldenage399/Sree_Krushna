/**
 * Lightweight deterministic YAML frontmatter parser for Marriage OS obligations
 * Supports 3-level nesting, arrays of objects, and standard primitives.
 */

function parseValue(val) {
  if (val === undefined || val === null) return null;
  val = val.trim();
  if (val === 'null' || val === '~' || val === '') return null;
  if (val === 'true') return true;
  if (val === 'false') return false;
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  if (/^-?\d*\.\d+$/.test(val)) return parseFloat(val);
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  return val;
}

function parseYamlFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const yamlStr = match[1];
  const lines = yamlStr.split(/\r?\n/);
  const result = {};

  let currentTopKey = null;
  let currentList = null;
  let currentItemObj = null;

  for (let rawLine of lines) {
    // Strip comments only when preceded by whitespace or at line start
    let line = rawLine.replace(/(?:^|\s+)#.*$/, '').trimEnd();
    if (!line.trim()) continue;

    const indent = line.search(/\S/);
    const trimmed = line.trim();

    if (indent === 0) {
      currentList = null;
      currentItemObj = null;
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1) {
        currentTopKey = trimmed.slice(0, colonIdx).trim();
        const valStr = trimmed.slice(colonIdx + 1).trim();
        if (valStr) {
          result[currentTopKey] = parseValue(valStr);
        } else {
          result[currentTopKey] = {};
        }
      }
    } else if (indent === 2) {
      if (trimmed.startsWith('- ')) {
        if (!Array.isArray(result[currentTopKey])) {
          result[currentTopKey] = [];
        }
        currentList = result[currentTopKey];
        const itemContent = trimmed.slice(2).trim();
        if (itemContent.includes(':')) {
          const colonIdx = itemContent.indexOf(':');
          const k = itemContent.slice(0, colonIdx).trim();
          const v = itemContent.slice(colonIdx + 1).trim();
          currentItemObj = { [k]: parseValue(v) };
          currentList.push(currentItemObj);
        } else {
          currentList.push(parseValue(itemContent));
          currentItemObj = null;
        }
      } else {
        const colonIdx = trimmed.indexOf(':');
        if (colonIdx !== -1) {
          const subKey = trimmed.slice(0, colonIdx).trim();
          const valStr = trimmed.slice(colonIdx + 1).trim();
          if (typeof result[currentTopKey] !== 'object' || Array.isArray(result[currentTopKey]) || result[currentTopKey] === null) {
            result[currentTopKey] = {};
          }
          result[currentTopKey][subKey] = parseValue(valStr);
        }
      }
    } else if (indent === 4 && currentItemObj) {
      const colonIdx = trimmed.indexOf(':');
      if (colonIdx !== -1) {
        const subKey = trimmed.slice(0, colonIdx).trim();
        const valStr = trimmed.slice(colonIdx + 1).trim();
        currentItemObj[subKey] = parseValue(valStr);
      }
    }
  }

  return result;
}

module.exports = { parseYamlFrontmatter, parseValue };
