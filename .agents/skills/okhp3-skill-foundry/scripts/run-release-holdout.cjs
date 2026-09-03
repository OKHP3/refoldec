#!/usr/bin/env node

/**
 * Prepare and validate a protected release holdout without packaging its
 * fixture. The fixture, response files, and grader input stay outside the
 * optimizing repository; evidence contains identifiers, hashes, and grader
 * evidence only.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { isDeepStrictEqual } = require('node:util');

const packageDir = path.resolve(__dirname, '..');
const benchmarkPath = path.join(packageDir, 'benchmarks', 'benchmark.json');
const evalsPath = path.join(packageDir, 'evals', 'evals.json');
const protocolDocPath = path.join(packageDir, 'references', 'release-holdout-protocol.md');
const runnerPath = path.join(packageDir, 'scripts', 'run-release-holdout.cjs');
const HASH = /^[A-F0-9]{64}$/;
const IDENTIFIER = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const REQUIRED_BOUNDARIES = ['confirmed', 'inferred', 'proposed', 'unknown'];

function usage() {
  console.log(`Usage:
  node run-release-holdout.cjs prepare --fixture <external-file> --fixture-id <id>
    --executor-id <id> --authorization-ref <ref> --output <evidence.json>
  node run-release-holdout.cjs grade --manifest <prepared.json>
    --grader-input <external.json> --with-response <external-file>
    --without-response <external-file> --run-settings <external.json>
    --grader-id <id>
    --authorization-ref <ref> --output <release-evidence.json>
  node run-release-holdout.cjs exposure --manifest <prepared.json>
    --reason <text> --replacement-fixture <external-file>
    --replacement-id <id> --executor-id <id> --authorization-ref <ref>
    --output <exposure-evidence.json>
  node run-release-holdout.cjs validate --record <evidence.json>`);
}

function fail(message) {
  throw new Error(message);
}

function parseOptions(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith('--')) fail(`unexpected argument: ${token}`);
    const equals = token.indexOf('=');
    const key = equals >= 0 ? token.slice(2, equals) : token.slice(2);
    if (!key) fail('empty option name');
    if (equals >= 0) options[key] = token.slice(equals + 1);
    else if (args[index + 1] && !args[index + 1].startsWith('--')) options[key] = args[++index];
    else options[key] = true;
  }
  return options;
}

function option(options, name) {
  const value = options[name];
  if (typeof value !== 'string' || !value.trim()) fail(`--${name} is required`);
  return value.trim();
}

function identifier(value, name) {
  if (typeof value !== 'string' || !IDENTIFIER.test(value)) fail(`--${name} must be a short identifier using letters, numbers, dot, underscore, or hyphen`);
  return value;
}

function nonPlaceholder(value, name) {
  if (typeof value !== 'string' || !value.trim() || /<[^>]+>|not-recorded|replace-me|todo/i.test(value)) {
    fail(`${name} must be a non-placeholder reference`);
  }
  return value.trim();
}

function readJson(file, label) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`${label}: invalid JSON (${error.message})`);
  }
}

function hashFile(file) {
  const hash = crypto.createHash('sha256');
  const input = fs.createReadStream(file);
  return new Promise((resolve, reject) => {
    input.on('data', chunk => hash.update(chunk));
    input.on('error', reject);
    input.on('end', () => resolve(hash.digest('hex').toUpperCase()));
  });
}

function realFile(file, label) {
  const resolved = path.resolve(file);
  if (!fs.existsSync(resolved)) fail(`${label} does not exist: ${resolved}`);
  if (!fs.statSync(resolved).isFile()) fail(`${label} must be a regular file: ${resolved}`);
  return fs.realpathSync(resolved);
}

function isInside(child, parent) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function externalFile(file, label, repoRoot) {
  const resolved = realFile(file, label);
  const roots = [fs.realpathSync(packageDir), fs.realpathSync(path.resolve(repoRoot || process.cwd()))];
  if (roots.some(root => isInside(resolved, root))) {
    fail(`${label} must remain outside the optimizing repository and skill package`);
  }
  return resolved;
}

function writeJson(file, value) {
  const resolved = path.resolve(file);
  if (fs.existsSync(resolved) && !fs.statSync(resolved).isFile()) fail(`output must be a file: ${resolved}`);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'w' });
}

function ensureHash(value, label) {
  if (typeof value !== 'string' || !HASH.test(value)) fail(`${label} must be an uppercase SHA-256`);
}

function loadFrozenProtocol() {
  const benchmark = readJson(benchmarkPath, benchmarkPath);
  const evals = readJson(evalsPath, evalsPath);
  const metadata = benchmark.metadata || {};
  const settings = metadata.host_and_model_settings;
  const rubric = benchmark.protocol?.grading_rubric;
  const requiredModes = ['with_skill', 'without_skill'];
  if (metadata.skill_name !== 'okhp3-skill-foundry' ||
      !metadata.evaluated_skill_version ||
      metadata.evaluation_status !== 'live' ||
      !metadata.skill_file_hashes ||
      !rubric ||
      !settings ||
      !benchmark.protocol?.comparability ||
      !Array.isArray(settings.activation_modes) ||
      !requiredModes.every(mode => settings.activation_modes.includes(mode)) ||
      settings.treatment_order !== 'with_skill then without_skill' ||
      settings.session_identity !== 'separate executor context per configuration') {
    fail('benchmark.json does not contain the required frozen live comparison protocol');
  }
  if (evals.skill_name !== metadata.skill_name ||
      evals.skill_version !== metadata.evaluated_skill_version ||
      !Array.isArray(evals.evals) ||
      !metadata.fixture_sha256) {
    fail('benchmark.json and evals/evals.json are not version-matched');
  }
  const evalsHash = crypto.createHash('sha256')
    .update(fs.readFileSync(evalsPath))
    .digest('hex')
    .toUpperCase();
  if (evalsHash !== metadata.fixture_sha256) {
    fail('benchmark fixture_sha256 does not match evals/evals.json');
  }
  for (const [file, hash] of Object.entries(metadata.skill_file_hashes)) ensureHash(hash, `benchmark skill_file_hashes.${file}`);
  return {
    evaluated_skill_version: metadata.evaluated_skill_version,
    benchmark_sha256: crypto.createHash('sha256').update(fs.readFileSync(benchmarkPath)).digest('hex').toUpperCase(),
    evaluation_fixture_sha256: metadata.fixture_sha256,
    skill_file_hashes: metadata.skill_file_hashes,
    grading_rubric: rubric,
    host_and_model_settings: settings,
    comparability: benchmark.protocol.comparability,
  };
}

function harnessHashes() {
  return {
    runner_script_sha256: crypto.createHash('sha256').update(fs.readFileSync(runnerPath)).digest('hex').toUpperCase(),
    protocol_reference_sha256: crypto.createHash('sha256').update(fs.readFileSync(protocolDocPath)).digest('hex').toUpperCase(),
  };
}

function assertBoundary(boundary) {
  if (!boundary || typeof boundary !== 'object' || Array.isArray(boundary)) fail('evidence_boundary must be an object');
  for (const key of REQUIRED_BOUNDARIES) {
    if (!Array.isArray(boundary[key]) || boundary[key].length < 1 ||
        boundary[key].some(item => typeof item !== 'string' || !item.trim())) {
      fail(`evidence_boundary.${key} must contain at least one explicit statement`);
    }
  }
}

function validatePrepared(record) {
  if (record.schema_version !== '1.0' || record.evidence_type !== 'protected_release_holdout_preparation' ||
      record.evaluation_status !== 'not-run') fail('prepared record has an invalid type or status');
  if (!record.protocol || !record.holdout || !record.executor) fail('prepared record is incomplete');
  ensureHash(record.holdout.fixture_sha256, 'holdout.fixture_sha256');
  if (!identifier(record.holdout.fixture_id, 'fixture-id')) fail('prepared record has an invalid fixture id');
  if (record.executor.independent !== true || record.executor.authorized !== true) {
    fail('prepared record must attest to an authorized independent executor');
  }
  nonPlaceholder(record.executor.authorization_ref, 'executor.authorization_ref');
  if (!isDeepStrictEqual(record.protocol.harness, harnessHashes())) {
    fail('prepared record harness hashes do not match the release runner');
  }
  const current = loadFrozenProtocol();
  if (!isDeepStrictEqual(record.protocol.frozen, current)) {
    fail('prepared record does not use the current frozen benchmark protocol');
  }
}

async function prepare(options) {
  const fixture = externalFile(option(options, 'fixture'), 'fixture', options['repo-root']);
  const fixtureId = identifier(option(options, 'fixture-id'), 'fixture-id');
  const executorId = nonPlaceholder(option(options, 'executor-id'), 'executor-id');
  const authorizationRef = nonPlaceholder(option(options, 'authorization-ref'), '--authorization-ref');
  const frozen = loadFrozenProtocol();
  const record = {
    schema_version: '1.0',
    evidence_type: 'protected_release_holdout_preparation',
    evaluation_status: 'not-run',
    prepared_at: new Date().toISOString(),
    protocol: {
      source: '.agents/skills/okhp3-skill-foundry/benchmarks/benchmark.json',
      frozen,
      harness: harnessHashes(),
    },
    holdout: {
      fixture_id: fixtureId,
      fixture_sha256: await hashFile(fixture),
    },
    executor: {
      id: executorId,
      independent: true,
      authorized: true,
      authorization_ref: authorizationRef,
    },
    privacy: {
      fixture_contents_recorded: false,
      fixture_path_recorded: false,
      test_cases_packaged: false,
    },
    next_action: 'Run with_skill then without_skill in separate comparable executor contexts, then pass both response artifacts to a separate blinded grader.',
  };
  validatePrepared(record);
  writeJson(option(options, 'output'), record);
}

function validateGraderInput(input, version) {
  if (!input || input.schema_version !== '1.0' || input.blinded !== true ||
      input.evaluated_skill_version !== version) {
    fail('grader input must be schema 1.0, blinded, and version-matched');
  }
  const withSkill = input.with_skill;
  const withoutSkill = input.without_skill;
  if (!withSkill || !withoutSkill || !Array.isArray(withSkill.expectations) || !Array.isArray(withoutSkill.expectations) ||
      withSkill.expectations.length < 1 || withSkill.expectations.length !== withoutSkill.expectations.length) {
    fail('grader input must contain equally sized with_skill and without_skill expectation evidence');
  }
  const ids = side => side.expectations.map(item => item?.expectation_id);
  const withIds = ids(withSkill);
  const withoutIds = ids(withoutSkill);
  if (new Set(withIds).size !== withIds.length || !isDeepStrictEqual(withIds, withoutIds)) {
    fail('both configurations must use the same ordered expectation identifiers');
  }
  for (const side of [withSkill, withoutSkill]) {
    for (const item of side.expectations) {
      if (!identifier(item.expectation_id, 'expectation_id') || typeof item.passed !== 'boolean' ||
          typeof item.evidence !== 'string' || !item.evidence.trim() || item.verbatim !== true) {
        fail('each graded expectation needs expectation_id, passed, verbatim=true, and non-empty evidence');
      }
      if (Object.prototype.hasOwnProperty.call(item, 'text') || Object.prototype.hasOwnProperty.call(item, 'prompt')) {
        fail('grader input must not carry expectation text or prompts into release evidence');
      }
    }
  }
  assertBoundary(input.evidence_boundary);
  const sanitize = side => ({
    expectations: side.expectations.map(item => ({
      expectation_id: item.expectation_id,
      passed: item.passed,
      verbatim: true,
      evidence: item.evidence.trim(),
    })),
  });
  return { with_skill: sanitize(withSkill), without_skill: sanitize(withoutSkill) };
}

function validateRunSettings(settings, frozen) {
  if (!settings || settings.schema_version !== '1.0' ||
      !settings.with_skill || !settings.without_skill) {
    fail('run settings must be schema 1.0 with both configurations');
  }
  const shared = frozen.host_and_model_settings;
  const sanitized = { schema_version: '1.0' };
  for (const configuration of ['with_skill', 'without_skill']) {
    const item = settings[configuration];
    const expected = {
      activation_mode: configuration,
      host: shared.host,
      model: shared.model,
      tool_availability: shared.tool_availability,
      treatment_order: shared.treatment_order,
      session_identity: shared.session_identity,
    };
    for (const [key, value] of Object.entries(expected)) {
      if (item[key] !== value) fail(`run settings ${configuration}.${key} does not match the frozen benchmark protocol`);
    }
    if (typeof item.context_id !== 'string' || !item.context_id.trim()) {
      fail(`run settings ${configuration}.context_id must identify its separate executor context`);
    }
    sanitized[configuration] = {
      activation_mode: item.activation_mode,
      host: item.host,
      model: item.model,
      tool_availability: item.tool_availability,
      treatment_order: item.treatment_order,
      session_identity: item.session_identity,
      context_id: item.context_id.trim(),
    };
  }
  if (settings.with_skill.context_id === settings.without_skill.context_id) {
    fail('with_skill and without_skill must use separate executor context identifiers');
  }
  if (settings.without_skill.target_skill_inspection !== 'prohibited') {
    fail('without_skill run settings must prohibit target skill inspection');
  }
  sanitized.without_skill.target_skill_inspection = 'prohibited';
  return sanitized;
}

function summary(expectations) {
  const passed = expectations.filter(item => item.passed).length;
  return { passed, failed: expectations.length - passed, total: expectations.length, pass_rate: passed / expectations.length };
}

async function grade(options) {
  const manifestPath = realFile(option(options, 'manifest'), 'manifest');
  const manifest = readJson(manifestPath, manifestPath);
  validatePrepared(manifest);
  const graderInputPath = externalFile(option(options, 'grader-input'), 'grader input', options['repo-root']);
  const withResponse = externalFile(option(options, 'with-response'), 'with_skill response', options['repo-root']);
  const withoutResponse = externalFile(option(options, 'without-response'), 'without_skill response', options['repo-root']);
  const runSettingsPath = externalFile(option(options, 'run-settings'), 'run settings', options['repo-root']);
  const graderInput = readJson(graderInputPath, graderInputPath);
  const graded = validateGraderInput(graderInput, manifest.protocol.frozen.evaluated_skill_version);
  const executionSettings = validateRunSettings(
    readJson(runSettingsPath, runSettingsPath),
    manifest.protocol.frozen
  );
  const graderId = nonPlaceholder(option(options, 'grader-id'), 'grader-id');
  const authorizationRef = nonPlaceholder(option(options, 'authorization-ref'), '--authorization-ref');
  if (graderId === manifest.executor.id) fail('grader must be separate from the independent executor');
  const record = {
    schema_version: '1.0',
    evidence_type: 'protected_release_holdout_run',
    evaluation_status: 'live',
    recorded_at: new Date().toISOString(),
    protocol: manifest.protocol,
    holdout: manifest.holdout,
    executor: manifest.executor,
    execution_settings: executionSettings,
    grader: {
      id: graderId,
      separate_from_executor: true,
      blinded: true,
      authorization_ref: authorizationRef,
    },
    runs: {
      with_skill: {
        response_sha256: await hashFile(withResponse),
        verbatim_evidence: graded.with_skill.expectations,
        summary: summary(graded.with_skill.expectations),
      },
      without_skill: {
        response_sha256: await hashFile(withoutResponse),
        verbatim_evidence: graded.without_skill.expectations,
        summary: summary(graded.without_skill.expectations),
      },
    },
    evidence_boundary: graderInput.evidence_boundary,
    privacy: {
      fixture_contents_recorded: false,
      fixture_path_recorded: false,
      test_cases_recorded: false,
      response_contents_recorded: false,
      verbatim_grader_evidence_recorded: true,
    },
  };
  writeJson(option(options, 'output'), record);
}

async function exposure(options) {
  const manifestPath = realFile(option(options, 'manifest'), 'manifest');
  const manifest = readJson(manifestPath, manifestPath);
  validatePrepared(manifest);
  const replacement = externalFile(option(options, 'replacement-fixture'), 'replacement fixture', options['repo-root']);
  const replacementId = identifier(option(options, 'replacement-id'), 'replacement-id');
  if (replacementId === manifest.holdout.fixture_id) fail('replacement-id must differ from the exposed fixture id');
  const replacementHash = await hashFile(replacement);
  if (replacementHash === manifest.holdout.fixture_sha256) fail('replacement fixture must have a different SHA-256');
  const record = {
    schema_version: '1.0',
    evidence_type: 'protected_release_holdout_exposure',
    evaluation_status: 'not-run',
    recorded_at: new Date().toISOString(),
    exposure: {
      exposed: true,
      reason: nonPlaceholder(option(options, 'reason'), '--reason'),
      old_fixture_id: manifest.holdout.fixture_id,
      old_fixture_sha256: manifest.holdout.fixture_sha256,
      replacement_fixture_id: replacementId,
      replacement_fixture_sha256: replacementHash,
      replacement_required_before_optimization: true,
    },
    executor: {
      id: nonPlaceholder(option(options, 'executor-id'), 'executor-id'),
      authorization_ref: nonPlaceholder(option(options, 'authorization-ref'), '--authorization-ref'),
    },
    privacy: {
      fixture_contents_recorded: false,
      fixture_paths_recorded: false,
    },
    next_action: 'Discard the exposed fixture and prepare a fresh external holdout before optimization continues.',
  };
  writeJson(option(options, 'output'), record);
}

function validateRecord(options) {
  const recordPath = realFile(option(options, 'record'), 'record');
  const record = readJson(recordPath, recordPath);
  if (record.evidence_type === 'protected_release_holdout_preparation') {
    validatePrepared(record);
  } else if (record.evidence_type === 'protected_release_holdout_run') {
    if (record.evaluation_status !== 'live' || !record.grader?.separate_from_executor || record.grader.blinded !== true) {
      fail('release run must be live and have a separate blinded grader');
    }
    if (record.grader.id === record.executor.id) fail('release grader must not be the executor');
    validatePrepared({ ...record, evidence_type: 'protected_release_holdout_preparation', evaluation_status: 'not-run' });
    for (const config of ['with_skill', 'without_skill']) {
      const run = record.runs?.[config];
      if (!run || !HASH.test(run.response_sha256) || !Array.isArray(run.verbatim_evidence) || !run.summary) {
        fail(`release run is missing ${config} evidence`);
      }
    }
    validateRunSettings(record.execution_settings, record.protocol.frozen);
    const graded = validateGraderInput({
      schema_version: '1.0',
      blinded: true,
      evaluated_skill_version: record.protocol.frozen.evaluated_skill_version,
      with_skill: { expectations: record.runs.with_skill.verbatim_evidence },
      without_skill: { expectations: record.runs.without_skill.verbatim_evidence },
      evidence_boundary: record.evidence_boundary,
    }, record.protocol.frozen.evaluated_skill_version);
    for (const config of ['with_skill', 'without_skill']) {
      if (!isDeepStrictEqual(record.runs[config].verbatim_evidence, graded[config].expectations)) {
        fail(`${config} evidence contains fields outside the release grading schema`);
      }
    }
    assertBoundary(record.evidence_boundary);
  } else if (record.evidence_type === 'protected_release_holdout_exposure') {
    ensureHash(record.exposure?.old_fixture_sha256, 'exposure.old_fixture_sha256');
    ensureHash(record.exposure?.replacement_fixture_sha256, 'exposure.replacement_fixture_sha256');
    if (record.evaluation_status !== 'not-run' ||
        !identifier(record.exposure.old_fixture_id, 'old_fixture_id') ||
        !identifier(record.exposure.replacement_fixture_id, 'replacement_fixture_id') ||
        record.exposure.old_fixture_id === record.exposure.replacement_fixture_id ||
        !nonPlaceholder(record.exposure.reason, 'exposure.reason') ||
        record.exposure.exposed !== true ||
        record.exposure.replacement_required_before_optimization !== true) {
      fail('exposure record must require replacement before optimization');
    }
    if (record.exposure.old_fixture_sha256 === record.exposure.replacement_fixture_sha256) {
      fail('exposure replacement must have a different SHA-256');
    }
  } else {
    fail('unknown release holdout evidence type');
  }
  console.log(`Valid protected holdout record: ${record.evidence_type}`);
}

async function main() {
  const command = process.argv[2];
  if (!command || command === '--help' || command === '-h') {
    usage();
    return;
  }
  const options = parseOptions(process.argv.slice(3));
  if (command === 'prepare') await prepare(options);
  else if (command === 'grade') await grade(options);
  else if (command === 'exposure') await exposure(options);
  else if (command === 'validate') validateRecord(options);
  else fail(`unknown command: ${command}`);
}

main().catch(error => {
  console.error(`ERROR ${error.message}`);
  process.exitCode = 1;
});