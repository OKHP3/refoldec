import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const report = JSON.parse(readFileSync('docs/evidence/skill-library-inventory.json', 'utf8'));

test('skill-library inventory covers the active package set', () => {
  assert.equal(report.schemaVersion, '1.0');
  assert.equal(report.summary.packageCount, 40);
  assert.equal(report.summary.versionedPackageCount, 40);
  assert.equal(report.skills.length, report.summary.packageCount);
});

test('skill-library inventory keeps live evidence claims bounded', () => {
  assert.match(report.evidenceBoundary, /no live task-quality uplift claim/);
  assert.equal(report.summary.benchmarkStatusCounts.live ?? 0, 0);
});