import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const report = JSON.parse(readFileSync('docs/evidence/skill-library-inventory.json', 'utf8'));
const evaluationView = JSON.parse(readFileSync('docs/evidence/skill-library-evaluation-view.json', 'utf8'));
const projectPackages = evaluationView.packages.filter(packageRecord =>
  packageRecord.package_class === 'portable-core'
);

test('skill-library inventory covers the active package set', () => {
  assert.equal(report.schemaVersion, '1.0');
  assert.equal(report.summary.packageCount, 40);
  assert.equal(report.summary.versionedPackageCount, 40);
  assert.equal(report.skills.length, report.summary.packageCount);
});

test('skill-library inventory keeps live evidence claims bounded', () => {
  assert.match(report.evidenceBoundary, /no live task-quality uplift claim/);
  assert.equal(report.summary.benchmarkStatusCounts.live ?? 0, 1);
  assert.equal(report.summary.benchmarkStatusCounts.historical ?? 0, 0);
});

test('skill evaluations use an explicit comparable release design', () => {
  assert.equal(projectPackages.length, 36);
  assert.equal(evaluationView.summary.legacy_partition_packages, 0);
  assert.equal(evaluationView.summary.invalid_case_packages, 0);
  assert.equal(evaluationView.summary.protected_holdout_packages, 0);

  for (const packageRecord of projectPackages) {
    const evaluation = packageRecord.evaluation;
    assert.equal(evaluation.partition_status, 'explicit', packageRecord.name);
    assert.deepEqual(evaluation.partitions, ['development'], packageRecord.name);
    assert.equal(evaluation.case_shape, 'complete', packageRecord.name);
    assert.equal(evaluation.legacy_case_count, 0, packageRecord.name);
    assert.equal(evaluation.invalid_case_count, 0, packageRecord.name);
    assert.equal(evaluation.duplicate_id_count, 0, packageRecord.name);
    assert.equal(evaluation.public_cases_exposed, true, packageRecord.name);
    assert.equal(evaluation.protected_holdout_status, 'external-required', packageRecord.name);
    assert.equal(evaluation.holdout_metadata_valid, true, packageRecord.name);
    for (const coverageClass of evaluation.coverage_required) {
      assert.equal(
        evaluation.coverage.classes[coverageClass].covered,
        true,
        `${packageRecord.name}:${coverageClass}`
      );
    }
  }
});

test('inventory and evaluation view agree on release design counts', () => {
  assert.equal(
    report.summary.releaseReadyDesignCount,
    evaluationView.summary.evaluation_design_ready
  );
  assert.equal(
    report.summary.publicCasesExposedPackageCount,
    evaluationView.summary.public_holdout_exposed_packages
  );
  assert.equal(
    report.summary.protectedHoldoutPackageCount,
    evaluationView.summary.protected_holdout_packages
  );
  assert.equal(
    report.summary.legacyCaseCount,
    evaluationView.summary.invalid_case_packages
  );
});