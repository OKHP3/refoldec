import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';

const python = process.env.REFOLDEC_PYTHON || 'python3';
const report = JSON.parse(readFileSync('docs/evidence/skill-library-inventory.json', 'utf8'));
const evaluationView = JSON.parse(readFileSync('docs/evidence/skill-library-evaluation-view.json', 'utf8'));
const projectPackages = evaluationView.packages.filter(packageRecord =>
  packageRecord.package_class === 'portable-core'
);

for (const [label, name, version, footer, expected] of [
  ['valid active core', 'okhp3-fixture', '1.0.0', '## About', 'PASS'],
  ['invalid active version', 'okhp3-fixture', 'invalid', '## About', 'REVIEW'],
  ['mismatched active name', 'okhp3-other', '1.0.0', '## About', 'REVIEW'],
  ['missing active footer', 'okhp3-fixture', '1.0.0', '', 'REVIEW'],
  ['no active core', null, '1.0.0', '## About', 'NOT RUN'],
]) {
  test(`frontmatter summary reflects ${label} and preserves excluded duplicate`, () => {
    const temporaryDirectory = mkdtempSync(join(tmpdir(), 'frontmatter-summary-'));
    try {
      const skills = join(temporaryDirectory, 'skills');
      const duplicate = join(skills, 'okhp3-fixture copy');
      const fixture = `---\nname: ${name}\nmetadata:\n  version: "${version}"\n---\n${footer}\n`;
      mkdirSync(duplicate, { recursive: true });
      const duplicatePath = join(duplicate, 'SKILL.md');
      const duplicateContents = '---\nname: okhp3-fixture\n---\nPreserved duplicate.\n';
      writeFileSync(duplicatePath, duplicateContents);
      writeFileSync(join(skills, '.catalog-scope.json'), JSON.stringify({
        excluded_directories: { 'okhp3-fixture copy': { status: 'quarantined-duplicate' } },
      }));
      // Documented host exceptions must not turn a failing core into a pass.
      mkdirSync(join(skills, 'host-fixture'));
      writeFileSync(join(skills, 'host-fixture', 'SKILL.md'), 'Host exception.\n');
      if (name !== null) {
        mkdirSync(join(skills, 'okhp3-fixture'));
        writeFileSync(join(skills, 'okhp3-fixture', 'SKILL.md'), fixture);
      }
      const jsonOutput = join(temporaryDirectory, 'view.json');
      const markdownOutput = join(temporaryDirectory, 'report.md');
      execFileSync(python, [
        'scripts/generate-skill-library-evaluation-view.py',
        '--skills-dir', skills,
        '--json-output', jsonOutput,
        '--markdown-output', markdownOutput,
      ], { stdio: 'pipe' });
      const view = JSON.parse(readFileSync(jsonOutput, 'utf8'));
      const cores = view.packages.filter(p => p.package_class === 'portable-core');
      assert.equal(cores.length, name === null ? 0 : 1);
      if (cores.length) {
        assert.equal(cores[0].frontmatter.status, expected === 'PASS' ? 'pass' : 'review');
      }
      const row = readFileSync(markdownOutput, 'utf8').split('\n')
        .find(line => line.startsWith('| Portable-core frontmatter |'));
      assert.ok(row, 'generated report must contain the portable-core frontmatter summary row');
      assert.equal(row.split('|')[2].trim().split(' / ')[0], expected);
      assert.equal(view.scope.excluded_package_count, 1);
      assert.equal(view.packages.some(p => p.path.includes('okhp3-fixture copy')), false);
      assert.equal(readFileSync(duplicatePath, 'utf8'), duplicateContents);
    } finally {
      rmSync(temporaryDirectory, { recursive: true, force: true });
    }
  });
}

test('skill-library inventory covers the active package set', () => {
  assert.equal(report.schemaVersion, '1.0');
  assert.equal(report.summary.packageCount, 40);
  assert.equal(report.summary.versionedPackageCount, 40);
  assert.equal(report.skills.length, report.summary.packageCount);
  assert.equal(report.scope.activePackageCount, 40);
  assert.equal(report.scope.excludedPackageCount, 8);
  assert.equal(
    report.skills.some(skill => report.scope.excludedDirectories.includes(skill.name)),
    false
  );
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
  assert.deepEqual(
    report.scope.excludedDirectories,
    evaluationView.scope.excluded_directories
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
      execFileSync(python, args, { stdio: 'pipe' });
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
    python,
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
          python,
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
