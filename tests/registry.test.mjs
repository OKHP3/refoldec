/**
 * tests/registry.test.mjs
 *
 * Tests for semantic-class-registry/semantic-classes.json.
 * Run with: node --test
 *
 * Verifies:
 *   - Registry is a non-empty array of well-formed entries.
 *   - Every entry has all required fields.
 *   - Every family and paletteToken is from the allowed sets.
 *   - No hex color values appear in any field.
 *   - No CSS color functions appear in any field.
 *   - All (id, family) pairs are unique.
 *   - The validator would correctly fail on bad inputs (negative cases).
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
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

const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/;
const CSS_COLOR_FN_PATTERN = /\b(?:rgb|rgba|hsl|hsla|oklch|lab|lch|color)\s*\(/;

// Load registry once
const raw = readFileSync(REGISTRY_PATH, 'utf-8');
const registry = JSON.parse(raw);

// ---------------------------------------------------------------------------
// Positive cases — the real registry must pass all of these
// ---------------------------------------------------------------------------

describe('semantic-classes.json — structure', () => {
  it('parses as valid JSON', () => {
    assert.doesNotThrow(() => JSON.parse(raw));
  });

  it('is a non-empty array', () => {
    assert.ok(Array.isArray(registry), 'top-level value must be an array');
    assert.ok(registry.length > 0, 'registry must not be empty');
  });

  it('contains entries for both families', () => {
    const families = new Set(registry.map((e) => e.family));
    assert.ok(families.has('architecture'), 'must include architecture family');
    assert.ok(families.has('process'), 'must include process family');
  });
});

describe('semantic-classes.json — required fields', () => {
  it('every entry has all required fields (non-empty)', () => {
    for (const entry of registry) {
      for (const field of REQUIRED_FIELDS) {
        assert.ok(
          entry[field] !== undefined && entry[field] !== null && entry[field] !== '',
          `entry (${entry.family}.${entry.id}) is missing or has empty field "${field}"`
        );
      }
    }
  });
});

describe('semantic-classes.json — allowed values', () => {
  it('every family is from the allowed set', () => {
    for (const entry of registry) {
      assert.ok(
        ALLOWED_FAMILIES.has(entry.family),
        `entry (${entry.id}) has invalid family "${entry.family}" — allowed: ${[...ALLOWED_FAMILIES].join(', ')}`
      );
    }
  });

  it('every paletteToken is from the allowed set', () => {
    for (const entry of registry) {
      assert.ok(
        ALLOWED_PALETTE_TOKENS.has(entry.paletteToken),
        `entry (${entry.family}.${entry.id}) has invalid paletteToken "${entry.paletteToken}" — allowed: ${[...ALLOWED_PALETTE_TOKENS].join(', ')}`
      );
    }
  });
});

describe('semantic-classes.json — color-agnostic enforcement', () => {
  it('no hex color values appear in any field', () => {
    for (const entry of registry) {
      for (const field of REQUIRED_FIELDS) {
        const value = entry[field];
        if (typeof value !== 'string') continue;
        assert.ok(
          !HEX_PATTERN.test(value),
          `entry (${entry.family}.${entry.id}) field "${field}" contains a hex color value — registry must be color-agnostic`
        );
      }
    }
  });

  it('no CSS color functions appear in any field', () => {
    for (const entry of registry) {
      for (const field of REQUIRED_FIELDS) {
        const value = entry[field];
        if (typeof value !== 'string') continue;
        assert.ok(
          !CSS_COLOR_FN_PATTERN.test(value),
          `entry (${entry.family}.${entry.id}) field "${field}" contains a CSS color function — registry must be color-agnostic`
        );
      }
    }
  });
});

describe('semantic-classes.json — uniqueness', () => {
  it('all (id, family) pairs are unique', () => {
    const seen = new Map();
    for (const entry of registry) {
      const key = `${entry.family}:${entry.id}`;
      assert.ok(
        !seen.has(key),
        `duplicate (id, family) pair: "${key}" — first at index ${seen.get(key)}`
      );
      seen.set(key, registry.indexOf(entry));
    }
  });
});

// ---------------------------------------------------------------------------
// Negative cases — verify the detection logic fires correctly on bad inputs
// ---------------------------------------------------------------------------

describe('detection logic — negative cases', () => {
  it('hex detection fires on #RRGGBB', () => {
    assert.ok(HEX_PATTERN.test('fill:#ff0000'), 'should detect #ff0000');
  });

  it('hex detection fires on #RGB shorthand', () => {
    assert.ok(HEX_PATTERN.test('fill:#f00'), 'should detect #f00');
  });

  it('hex detection fires on #RRGGBBAA', () => {
    assert.ok(HEX_PATTERN.test('fill:#ff0000cc'), 'should detect #ff0000cc');
  });

  it('hex detection does not fire on token references', () => {
    assert.ok(!HEX_PATTERN.test('fill:var(--token-primary)'), 'should not flag token reference');
  });

  it('CSS color function detection fires on rgb()', () => {
    assert.ok(CSS_COLOR_FN_PATTERN.test('fill:rgb(255,0,0)'), 'should detect rgb()');
  });

  it('CSS color function detection fires on rgba()', () => {
    assert.ok(CSS_COLOR_FN_PATTERN.test('fill:rgba(255,0,0,0.5)'), 'should detect rgba()');
  });

  it('CSS color function detection fires on hsl()', () => {
    assert.ok(CSS_COLOR_FN_PATTERN.test('stroke:hsl(0,100%,50%)'), 'should detect hsl()');
  });

  it('CSS color function detection fires on oklch()', () => {
    assert.ok(CSS_COLOR_FN_PATTERN.test('fill:oklch(0.6 0.2 30)'), 'should detect oklch()');
  });

  it('CSS color function detection does not fire on token references', () => {
    assert.ok(
      !CSS_COLOR_FN_PATTERN.test('fill:var(--token-accent)'),
      'should not flag token reference'
    );
  });

  it('missing field detection fires on incomplete entry', () => {
    const badEntry = { id: 'test', family: 'architecture' };
    const missing = REQUIRED_FIELDS.filter(
      (f) => badEntry[f] === undefined || badEntry[f] === null || badEntry[f] === ''
    );
    assert.ok(missing.length > 0, 'should detect missing required fields');
  });

  it('invalid paletteToken detection fires on arbitrary color name', () => {
    assert.ok(!ALLOWED_PALETTE_TOKENS.has('crimson'), 'crimson is not an allowed token');
    assert.ok(!ALLOWED_PALETTE_TOKENS.has('blue'), 'blue is not an allowed token');
    assert.ok(!ALLOWED_PALETTE_TOKENS.has('#336699'), 'hex value is not an allowed token');
  });

  it('invalid family detection fires on unknown family string', () => {
    assert.ok(!ALLOWED_FAMILIES.has('unknown'), 'unknown is not an allowed family');
    assert.ok(!ALLOWED_FAMILIES.has('ui'), 'ui is not an allowed family');
  });
});
