import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compare, version, selectReleases, request, replitLines, plan, run, sources } from '../scripts/check-technology-versions.mjs';

const nodeReleases = [
  { version: 'v24.9.0', lts: 'Krypton', date: '2026-01-01' },
  { version: 'v26.1.0', lts: false, date: '2026-05-01' },
  { version: 'v24.10.0', lts: 'Krypton', date: '2026-06-01' },
  { version: 'v28.0.0-rc1', lts: 'Future', date: '2026-01-01' },
  { version: 'v28.0.0', lts: 'Future', date: '2099-01-01' },
];
const pythonHtml = '<a>Python 3.14.6</a><a>Python 3.15.0rc1</a><a>Python 3.14.7</a>';
const releases = { nodeLts: '24.10.0', nodeCurrent: '26.1.0', pythonStable: '3.14.7', mermaidStable: '12.0.0' };
const replit = 'modules = ["nodejs-24", "python-base-3.13"]\n[nix]\nchannel = "stable-25_05"\n';
const fetcher = async url => ({ ok: true, json: async () => url === sources.node ? nodeReleases : { version: '12.0.0' }, text: async () => pythonHtml });

test('numeric ordering and strict stable versions', () => {
  assert.ok(compare('24.10.0', '24.9.0') > 0);
  for (const bad of ['3.15.0rc1', '3.15.0-beta', '24', '24.01.0', '24.0.0\ncommand', undefined]) assert.throws(() => version(bad));
});
test('unsorted releases exclude prereleases and future Node dates; Current is separate from LTS', () => {
  assert.deepEqual(selectReleases(nodeReleases, pythonHtml, { version: '12.0.0' }, new Date('2026-09-18')), releases);
});
test('a later LTS major becomes the target', () => {
  const next = selectReleases([...nodeReleases, { version: 'v26.10.0', lts: 'Next', date: '2026-11-01' }], pythonHtml, { version: '12.0.0' }, new Date('2026-12-01'));
  assert.equal(next.nodeLts, '26.10.0');
  assert.equal(plan({ node: '24.10.0', python: '3.14.7' }, next, { node: '24', python: '3.14' }).warnings.length, 1);
});
test('empty or changed release formats fail closed', () => {
  assert.throws(() => selectReleases([], pythonHtml, { version: '12.0.0' }));
  assert.throws(() => selectReleases(nodeReleases, '<a>Python 3.15.0rc1</a>', { version: '12.0.0' }));
  assert.throws(() => selectReleases(nodeReleases, pythonHtml, { version: '13.0.0-beta' }));
});
test('Replit declarations must be real and unambiguous', () => {
  assert.deepEqual(replitLines('# nodejs-99\n' + replit), { node: '24', python: '3.13' });
  assert.throws(() => replitLines('# modules = ["nodejs-24", "python-base-3.13"]'));
  assert.throws(() => replitLines(replit + replit));
});
test('updater refuses downgrades and reports host migration independently', () => {
  assert.throws(() => plan({ node: '26.0.0', python: '3.14.7' }, releases, { node: '24', python: '3.13' }), /downgrade/);
  const p = plan({ node: '24.9.0', python: '3.14.6' }, releases, { node: '24', python: '3.13' });
  assert.equal(p.changes.length, 2);
  assert.equal(p.warnings.length, 1);
});
test('HTTP and timeout failures are bounded and surfaced', async () => {
  let attempts = 0;
  await assert.rejects(request('https://example.invalid', 'json', async (_url, options) => {
    attempts++;
    assert.ok(options.signal instanceof AbortSignal);
    return { ok: false, status: 503 };
  }), /503/);
  assert.equal(attempts, 3);
  await assert.rejects(request('https://example.invalid', 'json', async () => { throw new Error('timeout'); }), /timeout/);
});
async function fixture(t, old = releases) {
  const dir = await mkdtemp(join(tmpdir(), 'refoldec-technology-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  await mkdir(join(dir, 'docs'));
  await writeFile(join(dir, '.node-version'), `${old.nodeLts}\n`);
  await writeFile(join(dir, '.python-version'), `${old.pythonStable}\n`);
  await writeFile(join(dir, '.replit'), replit);
  await writeFile(join(dir, 'docs/technology-versions.json'), JSON.stringify({ schemaVersion: 1, retrievedAt: '2026-01-01', sources, releases: old }));
  return dir;
}
const snapshot = dir => readFile(join(dir, 'docs/technology-versions.json'), 'utf8');
test('unchanged sources do not create date-only update proposals', async t => {
  const dir = await fixture(t), before = await snapshot(dir);
  assert.equal((await run('--update', dir, fetcher)).changed, false);
  assert.equal(await snapshot(dir), before);
});
test('dry check detects drift without writes; update changes pins and snapshot, preserving Replit', async t => {
  const dir = await fixture(t, { ...releases, nodeLts: '24.9.0', pythonStable: '3.14.6' });
  const before = await snapshot(dir);
  await assert.rejects(run('--check', dir, fetcher), /differ/);
  assert.equal(await snapshot(dir), before);
  assert.equal((await run('--update', dir, fetcher)).changed, true);
  assert.equal((await readFile(join(dir, '.node-version'), 'utf8')).trim(), '24.10.0');
  assert.equal((await readFile(join(dir, '.python-version'), 'utf8')).trim(), '3.14.7');
  assert.equal(await readFile(join(dir, '.replit'), 'utf8'), replit);
  await run('--offline', dir, () => assert.fail('Offline validation must not use the network'));
});
test('failed retrieval cannot change any candidate file', async t => {
  const dir = await fixture(t), before = await snapshot(dir);
  await assert.rejects(run('--update', dir, async () => { throw new Error('offline'); }));
  assert.equal(await snapshot(dir), before);
  assert.equal((await readFile(join(dir, '.node-version'), 'utf8')).trim(), releases.nodeLts);
});
