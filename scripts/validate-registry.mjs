#!/usr/bin/env node
/**
 * validate-registry.mjs
 *
 * Validates semantic-class-registry/semantic-classes.json against the rules
 * defined in FOLD-CONTRACT.md and SCOPE-FIREWALL.md:
 *
 *   - File is valid JSON and a non-empty array.
 *   - Every entry has all required fields (non-empty strings).
 *   - Every `family` is in the allowed set.
 *   - Every `paletteToken` is in the allowed token set.
 *   - No hex color values appear in any string field.
 *   - No CSS color functions appear in any string field.
 *   - All (id, family) pairs are unique.
 *
 * No external dependencies. Run with: node scripts/validate-registry.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = resolve(__dirname, '..', 'semantic-class-registry', 'semantic-classes.json');

const REQUIRED_FIELDS = ['id', 'family', 'meaning', 'paletteToken', 'shape', 'classDefPattern'];

const ALLOWED_PALETTE_TOKENS = new Set([
  'primary',
  'secondary',
  'accent',
  'accent-alt',
  'neutral',
  'boundary',
  'alert',
  'success',
]);

const ALLOWED_FAMILIES = new Set(['architecture', 'process']);

// Matches #RGB, #RRGGBB, #RRGGBBAA (3, 6, or 8 hex digits after #)
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/;

// Matches CSS color functions: rgb(), rgba(), hsl(), hsla(), oklch(), lab(), lch(), color()
const CSS_COLOR_FN_PATTERN = /\b(?:rgb|rgba|hsl|hsla|oklch|lab|lch|color)\s*\(/;

// ---------------------------------------------------------------------------

function validate() {
  // 1. Read file
  let raw;
  try {
    raw = readFileSync(REGISTRY_PATH, 'utf-8');
  } catch (err) {
    fail(`Cannot read registry file at ${REGISTRY_PATH}\n  ${err.message}`);
  }

  // 2. Parse JSON
  let registry;
  try {
    registry = JSON.parse(raw);
  } catch (err) {
    fail(`semantic-classes.json is not valid JSON.\n  ${err.message}`);
  }

  // 3. Must be a non-empty array
  if (!Array.isArray(registry)) {
    fail('semantic-classes.json must be a JSON array at the top level.');
  }
  if (registry.length === 0) {
    fail('semantic-classes.json must not be empty.');
  }

  const errors = [];

  // 4. Per-entry checks
  registry.forEach((entry, index) => {
    const ref = `entry[${index}] (${entry.family ?? '?'}.${entry.id ?? '?'})`;

    // Required fields present and non-empty
    for (const field of REQUIRED_FIELDS) {
      const value = entry[field];
      if (value === undefined || value === null || value === '') {
        errors.push(`${ref}: missing or empty required field "${field}"`);
      }
    }

    // Valid family
    if (entry.family !== undefined && !ALLOWED_FAMILIES.has(entry.family)) {
      errors.push(
        `${ref}: invalid family "${entry.family}" — allowed values: ${[...ALLOWED_FAMILIES].join(', ')}`
      );
    }

    // Valid paletteToken
    if (entry.paletteToken !== undefined && !ALLOWED_PALETTE_TOKENS.has(entry.paletteToken)) {
      errors.push(
        `${ref}: invalid paletteToken "${entry.paletteToken}" — allowed tokens: ${[...ALLOWED_PALETTE_TOKENS].join(', ')}`
      );
    }

    // No bound color values in any string field
    for (const field of REQUIRED_FIELDS) {
      const value = entry[field];
      if (typeof value !== 'string') continue;

      if (HEX_PATTERN.test(value)) {
        errors.push(
          `${ref}: hex color value detected in field "${field}" — registry must be color-agnostic (no bound values)`
        );
      }

      if (CSS_COLOR_FN_PATTERN.test(value)) {
        errors.push(
          `${ref}: CSS color function detected in field "${field}" — registry must be color-agnostic (no bound values)`
        );
      }
    }
  });

  // 5. Unique (id, family) pairs
  const seen = new Map();
  registry.forEach((entry, index) => {
    if (entry.id && entry.family) {
      const key = `${entry.family}:${entry.id}`;
      if (seen.has(key)) {
        errors.push(
          `entry[${index}]: duplicate (id, family) pair "${key}" — first seen at entry[${seen.get(key)}]`
        );
      } else {
        seen.set(key, index);
      }
    }
  });

  // 6. Report
  if (errors.length > 0) {
    console.error(`\nRegistry validation FAILED — ${errors.length} error(s):\n`);
    errors.forEach((e) => console.error(`  • ${e}`));
    console.error('');
    process.exit(1);
  }

  const families = [...new Set(registry.map((e) => e.family))].sort();
  console.log(`\nRegistry validation PASSED — ${registry.length} entries verified.\n`);
  families.forEach((family) => {
    const ids = registry.filter((e) => e.family === family).map((e) => e.id);
    console.log(`  ${family} (${ids.length}): ${ids.join(', ')}`);
  });
  console.log('');
}

function fail(message) {
  console.error(`\nERROR: ${message}\n`);
  process.exit(1);
}

validate();
