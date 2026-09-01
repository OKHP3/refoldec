#!/usr/bin/env node

/**
 * Build or verify a project-level inventory of local Agent Skills.
 * This reports structural and evaluation coverage; it does not claim live
 * task-quality uplift.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const skillsDir = join(root, '.agents', 'skills');
const defaultReport = join(root, 'docs', 'evidence', 'skill-library-inventory.json');
const args = new Set(process.argv.slice(2));
const reportPath = resolve(process.argv.find((arg, index) =>
  process.argv[index - 1] === '--report') || defaultReport);
const asOfIndex = process.argv.indexOf('--as-of');
let asOf = asOfIndex >= 0 ? process.argv[asOfIndex + 1] : null;
if (!asOf && args.has('--check') && existsSync(reportPath)) {
  try {
    asOf = JSON.parse(readFileSync(reportPath, 'utf8')).asOf ?? null;
  } catch {
    asOf = null;
  }
}

if (args.has('--help') || args.has('-h')) {
  console.log('Usage: node scripts/audit-skill-library.mjs [--write|--check] [--report <path>] [--as-of YYYY-MM-DD]');
  process.exit(0);
}

function filesUnder(directory) {
  if (!existsSync(directory)) return [];
  const result = [];
  const stack = [directory];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '__pycache__') continue;
      const full = join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else result.push(full);
    }
  }
  return result.sort();
}

function versionFrom(frontmatter) {
  return frontmatter.match(/^\s{2}version:\s*["']?([^"'\s]+)["']?\s*$/m)?.[1] ?? null;
}

function inspectSkill(directory) {
  const skillPath = join(directory, 'SKILL.md');
  const text = readFileSync(skillPath, 'utf8');
  const frontmatter = text.startsWith('---\n') ? text.split('---\n')[1] ?? '' : '';
  const evalPath = join(directory, 'evals', 'evals.json');
  const benchmarkPath = join(directory, 'benchmarks', 'benchmark.json');
  let evals = null;
  let evalError = null;
  if (existsSync(evalPath)) {
    try {
      evals = JSON.parse(readFileSync(evalPath, 'utf8'));
    } catch (error) {
      evalError = error.message;
    }
  }
  let benchmark = null;
  let benchmarkError = null;
  if (existsSync(benchmarkPath)) {
    try {
      benchmark = JSON.parse(readFileSync(benchmarkPath, 'utf8'));
    } catch (error) {
      benchmarkError = error.message;
    }
  }

  const cases = Array.isArray(evals?.evals) ? evals.evals : [];
  const partitions = [...new Set(cases.map(item => item.partition || 'unpartitioned'))].sort();
  const requiredCoverage = Array.isArray(evals?.coverage_required)
    ? evals.coverage_required
    : ['normal', 'edge', 'boundary'];
  const validPartitions = new Set(['development', 'holdout']);
  const validCoverage = new Set(['normal', 'edge', 'boundary']);
  const legacyCases = cases.filter(item =>
    !item || !item.id || !item.partition || !item.risk || !item.prompt ||
    !Array.isArray(item.expectations) || item.expectations.length < 3
  );
  const invalidCases = cases.filter(item =>
    !item || !validPartitions.has(item.partition) ||
    !validCoverage.has(item.coverage_class) ||
    !Array.isArray(item.expectations) || item.expectations.length < 3
  );
  const duplicateIds = cases.length - new Set(cases.map(item => item?.id)).size;
  const coverageCounts = Object.fromEntries(
    [...validCoverage].map(coverageClass => [
      coverageClass,
      cases.filter(item => item?.partition === 'development' && item?.coverage_class === coverageClass).length,
    ])
  );
  const holdout = evals?.release_holdout;
  const publicCasesExposed = holdout?.public_cases_exposed === true;
  const protectedHoldoutStatus = holdout?.status === 'protected'
    ? 'protected'
    : holdout?.status === 'external-required'
      ? 'external-required'
      : 'not-declared';
  const holdoutMetadataValid = Boolean(
    holdout &&
    holdout.status === 'external-required' &&
    holdout.holdout_seen === true &&
    holdout.public_cases_exposed === true &&
    holdout.protected_case_location === 'external' &&
    holdout.reason
  );
  const developmentCases = cases.filter(item => item.partition === 'development').length;
  const holdoutCases = cases.filter(item => item.partition === 'holdout').length;
  const completeCases = cases.filter(item =>
    ['id', 'partition', 'risk', 'prompt', 'coverage_class'].every(key => Boolean(item[key])) &&
    Array.isArray(item.expectations) &&
    item.expectations.length >= 3
  ).length;

  let evaluationCoverage = 'no-evaluation-file';
  if (evalError) evaluationCoverage = 'invalid-evaluation-file';
  else if (evals) {
    const coverageReady = requiredCoverage.every(coverageClass =>
      validCoverage.has(coverageClass) && coverageCounts[coverageClass] > 0
    );
    if (completeCases !== cases.length || legacyCases.length || invalidCases.length || duplicateIds) {
      evaluationCoverage = 'incomplete-cases';
    } else if (coverageReady && holdoutMetadataValid) {
      evaluationCoverage = 'release-ready-design';
    } else {
      evaluationCoverage = 'coverage-incomplete';
    }
  }

  const benchmarkStatus = benchmarkError
    ? 'invalid-benchmark-file'
    : benchmark?.metadata?.evaluation_status ?? 'not-run';
  const countFiles = name => filesUnder(join(directory, name)).length;

  return {
    name: basename(directory),
    version: versionFrom(frontmatter),
    hasScopeSection: /^## Scope\b/m.test(text),
    hasValidationLoopSignal: /\b(plan|validate|verify)\b/i.test(text),
    evaluation: {
      filePresent: Boolean(evals),
      caseCount: cases.length,
      completeCaseCount: completeCases,
      legacyCaseCount: legacyCases.length,
      invalidCaseCount: invalidCases.length,
      duplicateIdCount: duplicateIds,
      partitions,
      developmentCaseCount: developmentCases,
      holdoutCaseCount: holdoutCases,
      coverageRequired: requiredCoverage,
      coverageCounts,
      publicCasesExposed,
      protectedHoldoutStatus,
      releaseHoldoutStatus: holdout?.status ?? null,
      holdoutMetadataValid,
      coverage: evaluationCoverage,
    },
    benchmarkStatus,
    resourceCounts: {
      references: countFiles('references'),
      scripts: countFiles('scripts'),
      tests: countFiles('tests'),
    },
  };
}

if (!existsSync(skillsDir)) {
  console.error(`Skills directory does not exist: ${skillsDir}`);
  process.exit(1);
}

const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(join(skillsDir, entry.name, 'SKILL.md')))
  .map(entry => inspectSkill(join(skillsDir, entry.name)));

const count = predicate => skills.filter(predicate).length;
const summary = {
  packageCount: skills.length,
  versionedPackageCount: count(skill => Boolean(skill.version)),
  evaluationFileCount: count(skill => skill.evaluation.filePresent),
  noEvaluationFileCount: count(skill => !skill.evaluation.filePresent),
  developmentAndHoldoutPartitionCount: count(skill =>
    skill.evaluation.developmentCaseCount > 0 && skill.evaluation.holdoutCaseCount > 0),
  completeDevelopmentAndHoldoutCount: count(skill =>
    skill.evaluation.coverage === 'release-ready-design'),
  developmentOnlyCount: count(skill => skill.evaluation.coverage === 'coverage-incomplete'),
  unpartitionedEvaluationCount: count(skill =>
    skill.evaluation.partitions.includes('unpartitioned')),
  invalidEvaluationCount: count(skill => skill.evaluation.coverage === 'invalid-evaluation-file'),
  incompleteEvaluationCount: count(skill => skill.evaluation.coverage === 'incomplete-cases'),
  legacyCaseCount: skills.reduce((total, skill) => total + skill.evaluation.legacyCaseCount, 0),
  invalidCaseCount: skills.reduce((total, skill) => total + skill.evaluation.invalidCaseCount, 0),
  duplicateEvaluationIdPackageCount: count(skill => skill.evaluation.duplicateIdCount > 0),
  releaseReadyDesignCount: count(skill =>
    skill.evaluation.coverage === 'release-ready-design'),
  publicCasesExposedPackageCount: count(skill => skill.evaluation.publicCasesExposed),
  protectedHoldoutPackageCount: count(skill =>
    skill.evaluation.protectedHoldoutStatus === 'protected'),
  holdoutMetadataInvalidPackageCount: count(skill =>
    skill.evaluation.filePresent && !skill.evaluation.holdoutMetadataValid),
  minimumShapePackageCount: count(skill =>
    skill.evaluation.filePresent &&
    skill.evaluation.completeCaseCount === skill.evaluation.caseCount),
  packageLocalTestCount: count(skill => skill.resourceCounts.tests > 0),
  benchmarkStatusCounts: Object.fromEntries(
    [...new Set(skills.map(skill => skill.benchmarkStatus))].sort()
      .map(status => [status, count(skill => skill.benchmarkStatus === status)])
  ),
};

const report = {
  schemaVersion: '1.0',
  reportKind: 'local-skill-library-inventory',
  asOf: asOf ?? 'not-specified',
  evidenceBoundary: 'structural and analytical inventory; no live task-quality uplift claim',
  summary,
  skills,
};
const serialized = `${JSON.stringify(report, null, 2)}\n`;

if (args.has('--check')) {
  if (!existsSync(reportPath) || readFileSync(reportPath, 'utf8') !== serialized) {
    console.error(`Skill-library inventory is stale: ${reportPath}`);
    process.exit(1);
  }
  console.log(`Skill-library inventory check passed: ${skills.length} packages.`);
} else {
  writeFileSync(reportPath, serialized);
  console.log(`Wrote ${reportPath} for ${skills.length} packages.`);
}