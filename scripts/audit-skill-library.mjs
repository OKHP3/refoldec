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
  const developmentCases = cases.filter(item => item.partition === 'development').length;
  const holdoutCases = cases.filter(item => item.partition === 'holdout').length;
  const completeCases = cases.filter(item =>
    ['id', 'risk', 'prompt'].every(key => Boolean(item[key])) &&
    Array.isArray(item.expectations) &&
    item.expectations.length >= 3
  ).length;

  let evaluationCoverage = 'no-evaluation-file';
  if (evalError) evaluationCoverage = 'invalid-evaluation-file';
  else if (evals) {
    if (completeCases !== cases.length) evaluationCoverage = 'incomplete-cases';
    else if (developmentCases > 0 && holdoutCases > 0) evaluationCoverage = 'development-and-holdout';
    else if (developmentCases > 0) evaluationCoverage = 'development-only';
    else evaluationCoverage = 'unpartitioned-cases';
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
      partitions,
      developmentCaseCount: developmentCases,
      holdoutCaseCount: holdoutCases,
      releaseHoldoutStatus: evals?.release_holdout?.status ?? null,
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
    skill.evaluation.coverage === 'development-and-holdout'),
  developmentOnlyCount: count(skill => skill.evaluation.coverage === 'development-only'),
  unpartitionedEvaluationCount: count(skill =>
    skill.evaluation.partitions.includes('unpartitioned')),
  invalidEvaluationCount: count(skill => skill.evaluation.coverage === 'invalid-evaluation-file'),
  incompleteEvaluationCount: count(skill => skill.evaluation.coverage === 'incomplete-cases'),
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