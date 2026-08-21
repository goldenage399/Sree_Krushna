#!/usr/bin/env node
/**
 * GAWC schema validator — validates the governance-wiring schema (GWPA §2 machine form)
 * and any emitted governance-wiring.json against it.
 *
 * Self-test: validates the schema's embedded examples (so the contract can't silently rot).
 * Once the compiler (PIO-159 step 2) emits governance-wiring.json, this also validates that file.
 * Exits non-zero on any failure — wire to PREFLIGHT alongside verify-governance-wiring.
 *
 * Consumer of: ajv, ajv-formats (added 2026-06-14 for the GAWC projection, PIO-159 §5.1).
 */
const fs = require('fs');
const path = require('path');

let Ajv;
try { Ajv = require('ajv/dist/2020'); } catch (e) { Ajv = require('ajv').default || require('ajv'); }
const addFormats = require('ajv-formats');

const SCHEMA = path.join(__dirname, '..', 'docs', 'protocols', 'governance-wiring.schema.json');
const DATA = path.join(__dirname, '..', 'governance-wiring.json'); // emitted by the compiler (PIO-159 step 2)

const schema = JSON.parse(fs.readFileSync(SCHEMA, 'utf8'));
const examples = schema.examples || [];
const compiled = { ...schema };
delete compiled.examples;

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(compiled);

let failures = 0;

examples.forEach((ex, i) => {
  if (!validate(ex)) {
    failures++;
    console.error(`❌ schema example[${i}] invalid:`, JSON.stringify(validate.errors, null, 2));
  }
});
if (failures === 0) {
  console.log(`✅ schema self-test: ${examples.length} embedded example(s) valid`);
}

if (fs.existsSync(DATA)) {
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  if (!validate(data)) {
    failures++;
    console.error('❌ governance-wiring.json invalid:', JSON.stringify(validate.errors, null, 2));
  } else {
    console.log('✅ governance-wiring.json valid against schema');
  }
} else {
  console.log('ℹ️  governance-wiring.json not present yet (emitted by the compiler — PIO-159 step 2)');
}

process.exit(failures ? 1 : 0);
