import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

test('evaluation evidence generation is byte-identical across reruns', () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), 'skill-library-evaluation-'));
  const firstJson = join(temporaryDirectory, 'first.json');
  const firstMarkdown = join(temporaryDirectory, 'first.md');
  const secondJson = join(temporaryDirectory, 'second.json');
  const secondMarkdown = join(temporaryDirectory, 'second.md');

  try {
    const generate = (jsonOutput, markdownOutput, generatedAt) => {
      const args = [
        'scripts/generate-skill-library-evaluation-view.py',
        '--skills-dir',
        '.agents/skills',
        '--json-output',
        jsonOutput,
        '--markdown-output',
        markdownOutput,
      ];
      if (generatedAt) {
        args.push('--generated-at', generatedAt);
      }
      execFileSync('python3', args, { stdio: 'pipe' });
    };

    generate(firstJson, firstMarkdown);
    generate(secondJson, secondMarkdown);

    assert.deepEqual(
      readFileSync(secondJson),
      readFileSync(firstJson),
      'unchanged inputs must produce byte-identical JSON'
    );
    assert.deepEqual(
      readFileSync(secondMarkdown),
      readFileSync(firstMarkdown),
      'unchanged inputs must produce byte-identical Markdown'
    );

    const generatedJson = JSON.parse(readFileSync(firstJson, 'utf8'));
    const generatedMarkdown = readFileSync(firstMarkdown, 'utf8');
    assert.equal('generated_at' in generatedJson, false);
    assert.doesNotMatch(generatedMarkdown, /^\*\*Generated:\*\*/m);

    generate(secondJson, secondMarkdown, '2026-09-01T00:00:00Z');
    assert.equal(
      JSON.parse(readFileSync(secondJson, 'utf8')).generated_at,
      '2026-09-01T00:00:00Z'
    );
    assert.match(
      readFileSync(secondMarkdown, 'utf8'),
      /^\*\*Generated:\*\* 2026-09-01T00:00:00Z$/m
    );
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
});

test('checked-in evaluation evidence passes its drift check', () => {
  execFileSync(
    'python3',
    ['scripts/generate-skill-library-evaluation-view.py', '--check'],
    { stdio: 'pipe' }
  );
});

test('evaluation evidence drift check catches either stale output', () => {
  const evidencePaths = [
    'docs/evidence/skill-library-evaluation-view.json',
    'docs/evidence/skill-library-maturity.md',
  ];
  const originalContents = evidencePaths.map(path => readFileSync(path));

  try {
    for (const [index, path] of evidencePaths.entries()) {
      writeFileSync(path, Buffer.concat([originalContents[index], Buffer.from('stale\n')]));
      assert.throws(
        () => execFileSync(
          'python3',
          ['scripts/generate-skill-library-evaluation-view.py', '--check'],
          { stdio: 'pipe' }
        ),
        error => error.status === 1 && error.stderr.includes(path)
      );
      writeFileSync(path, originalContents[index]);
    }
  } finally {
    evidencePaths.forEach((path, index) => writeFileSync(path, originalContents[index]));
  }
});
