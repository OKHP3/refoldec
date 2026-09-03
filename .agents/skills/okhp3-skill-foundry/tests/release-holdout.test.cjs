const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const packageDir = path.resolve(__dirname, '..');
const script = path.join(packageDir, 'scripts', 'run-release-holdout.cjs');

function run(args) {
  return spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
}

function fixtureDirectory() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'foundry-holdout-external-'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function prepare(directory, fixtureId = 'unseen-a') {
  const fixture = path.join(directory, `${fixtureId}.json`);
  const manifest = path.join(directory, `${fixtureId}-prepared.json`);
  fs.writeFileSync(fixture, 'unseen fixture material that must not enter evidence\n');
  const result = run([
    'prepare',
    '--fixture', fixture,
    '--fixture-id', fixtureId,
    '--executor-id', 'independent-executor',
    '--authorization-ref', 'release-authorization',
    '--output', manifest,
  ]);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  return { fixture, manifest, record: JSON.parse(fs.readFileSync(manifest, 'utf8')) };
}

function graderInput() {
  const expectations = [
    { expectation_id: 'safety-1', passed: true, verbatim: true, evidence: 'Verbatim response evidence A.' },
    { expectation_id: 'quality-2', passed: false, verbatim: true, evidence: 'Verbatim response evidence B.' },
  ];
  return {
    schema_version: '1.0',
    blinded: true,
    evaluated_skill_version: '3.1.0',
    with_skill: { expectations },
    without_skill: { expectations: expectations.map(item => ({ ...item, passed: !item.passed })) },
    evidence_boundary: {
      confirmed: ['The grader recorded exact response excerpts.'],
      inferred: ['This is evidence for the evaluated fixture only.'],
      proposed: ['Review the release gates before making a claim.'],
      unknown: ['Generalization beyond the fixture remains unknown.'],
    },
  };
}

function runSettings() {
  const shared = {
    host: 'Replit Agent delegated executor',
    model: 'delegation-subagent',
    tool_availability: 'filesystem read-only; no network or write actions requested',
    treatment_order: 'with_skill then without_skill',
    session_identity: 'separate executor context per configuration',
  };
  return {
    schema_version: '1.0',
    with_skill: {
      ...shared,
      activation_mode: 'with_skill',
      context_id: 'with-context',
    },
    without_skill: {
      ...shared,
      activation_mode: 'without_skill',
      context_id: 'without-context',
      target_skill_inspection: 'prohibited',
    },
  };
}

test('prepares an external fixture with only its identifier and hash', () => {
  const directory = fixtureDirectory();
  try {
    const { fixture, manifest, record } = prepare(directory);
    const evidence = fs.readFileSync(manifest, 'utf8');
    assert.deepEqual(Object.keys(record.holdout).sort(), ['fixture_id', 'fixture_sha256']);
    assert.equal(record.holdout.fixture_id, 'unseen-a');
    assert.match(record.holdout.fixture_sha256, /^[A-F0-9]{64}$/);
    assert.equal(record.privacy.fixture_contents_recorded, false);
    assert.equal(record.privacy.fixture_path_recorded, false);
    assert.doesNotMatch(evidence, /unseen fixture material/);
    assert.doesNotMatch(evidence, new RegExp(fixture.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    const validation = run(['validate', '--record', manifest]);
    assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('refuses a fixture inside the optimizing repository', () => {
  const directory = fs.mkdtempSync(path.join(packageDir, 'holdout-test-'));
  const fixture = path.join(directory, 'fixture.txt');
  const output = path.join(os.tmpdir(), `foundry-rejected-${Date.now()}.json`);
  fs.writeFileSync(fixture, 'must be rejected');
  try {
    const result = run([
      'prepare',
      '--fixture', fixture,
      '--fixture-id', 'inside-repo',
      '--executor-id', 'independent-executor',
      '--authorization-ref', 'release-authorization',
      '--output', output,
    ]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /outside the optimizing repository/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
    fs.rmSync(output, { force: true });
  }
});

test('grades both configurations without copying responses or test cases', () => {
  const directory = fixtureDirectory();
  try {
    const { manifest } = prepare(directory);
    const grader = path.join(directory, 'grader.json');
    const withResponse = path.join(directory, 'with-response.txt');
    const withoutResponse = path.join(directory, 'without-response.txt');
    const settings = path.join(directory, 'run-settings.json');
    const output = path.join(directory, 'holdout-run.json');
    writeJson(grader, graderInput());
    writeJson(settings, runSettings());
    fs.writeFileSync(withResponse, 'with-skill response body');
    fs.writeFileSync(withoutResponse, 'without-skill response body');
    const result = run([
      'grade',
      '--manifest', manifest,
      '--grader-input', grader,
      '--with-response', withResponse,
      '--without-response', withoutResponse,
      '--run-settings', settings,
      '--grader-id', 'separate-grader',
      '--authorization-ref', 'grading-authorization',
      '--output', output,
    ]);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    const record = JSON.parse(fs.readFileSync(output, 'utf8'));
    assert.equal(record.evaluation_status, 'live');
    assert.equal(record.grader.separate_from_executor, true);
    assert.equal(record.grader.blinded, true);
    assert.equal(record.runs.with_skill.summary.pass_rate, 0.5);
    assert.equal(record.runs.without_skill.summary.pass_rate, 0.5);
    assert.equal(record.privacy.response_contents_recorded, false);
    assert.equal(record.privacy.verbatim_grader_evidence_recorded, true);
    const evidence = fs.readFileSync(output, 'utf8');
    assert.doesNotMatch(evidence, /with-skill response body|without-skill response body/);
    for (const config of ['with_skill', 'without_skill']) {
      for (const item of record.runs[config].verbatim_evidence) {
        assert.equal(Object.prototype.hasOwnProperty.call(item, 'text'), false);
        assert.equal(Object.prototype.hasOwnProperty.call(item, 'prompt'), false);
      }
    }
    assert.doesNotMatch(evidence, /hidden expectation/);
    const validation = run(['validate', '--record', output]);
    assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('requires a separate grader and rejects expectation text', () => {
  const directory = fixtureDirectory();
  try {
    const { manifest } = prepare(directory);
    const grader = path.join(directory, 'grader.json');
    const response = path.join(directory, 'response.txt');
    const settings = path.join(directory, 'run-settings.json');
    const output = path.join(directory, 'run.json');
    const input = graderInput();
    writeJson(settings, runSettings());
    input.with_skill.expectations[0].text = 'hidden expectation';
    writeJson(grader, input);
    fs.writeFileSync(response, 'response');
    const exposedText = run([
      'grade',
      '--manifest', manifest,
      '--grader-input', grader,
      '--with-response', response,
      '--without-response', response,
      '--run-settings', settings,
      '--grader-id', 'separate-grader',
      '--authorization-ref', 'grading-authorization',
      '--output', output,
    ]);
    assert.notEqual(exposedText.status, 0);
    assert.match(exposedText.stderr, /must not carry expectation text/);

    delete input.with_skill.expectations[0].text;
    writeJson(grader, input);
    const sameRole = run([
      'grade',
      '--manifest', manifest,
      '--grader-input', grader,
      '--with-response', response,
      '--without-response', response,
      '--run-settings', settings,
      '--grader-id', 'independent-executor',
      '--authorization-ref', 'grading-authorization',
      '--output', output,
    ]);
    assert.notEqual(sameRole.status, 0);
    assert.match(sameRole.stderr, /separate from the independent executor/);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('records exposure and a replacement hash before optimization resumes', () => {
  const directory = fixtureDirectory();
  try {
    const { manifest } = prepare(directory);
    const replacement = path.join(directory, 'replacement.json');
    const output = path.join(directory, 'exposure.json');
    fs.writeFileSync(replacement, 'fresh replacement fixture material\n');
    const result = run([
      'exposure',
      '--manifest', manifest,
      '--reason', 'fixture was visible to the optimizer',
      '--replacement-fixture', replacement,
      '--replacement-id', 'unseen-b',
      '--executor-id', 'independent-executor',
      '--authorization-ref', 'replacement-authorization',
      '--output', output,
    ]);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    const record = JSON.parse(fs.readFileSync(output, 'utf8'));
    assert.equal(record.exposure.exposed, true);
    assert.equal(record.exposure.replacement_required_before_optimization, true);
    assert.equal(record.exposure.old_fixture_id, 'unseen-a');
    assert.equal(record.exposure.replacement_fixture_id, 'unseen-b');
    assert.match(record.exposure.replacement_fixture_sha256, /^[A-F0-9]{64}$/);
    assert.doesNotMatch(fs.readFileSync(output, 'utf8'), /fresh replacement fixture material/);
    const validation = run(['validate', '--record', output]);
    assert.equal(validation.status, 0, `${validation.stdout}\n${validation.stderr}`);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});