#!/usr/bin/env node
// Repository maintenance only; built-ins only; never installs software.
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const sources = Object.freeze({
  node: 'https://nodejs.org/dist/index.json',
  python: 'https://www.python.org/downloads/',
  mermaid: 'https://registry.npmjs.org/mermaid/latest',
});
const root = fileURLToPath(new URL('..', import.meta.url));
const stable = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function version(value) {
  const result = typeof value === 'string' ? value.replace(/^v/, '') : '';
  if (!stable.test(result)) throw new Error(`Not an exact stable version: ${value}`);
  return result;
}
export function compare(a, b) {
  const left = version(a).split('.').map(Number);
  const right = version(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) if (left[i] !== right[i]) return left[i] - right[i];
  return 0;
}
function newest(values, name) {
  if (!values.length) throw new Error(`No stable ${name} releases found; source format may have changed.`);
  return values.map(version).sort((a, b) => compare(b, a))[0];
}
export function selectReleases(node, pythonHtml, mermaid, now = new Date()) {
  if (!Array.isArray(node)) throw new Error('Invalid Node release index.');
  const published = node.filter(r => /^v\d+\.\d+\.\d+$/.test(r.version)
    && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && new Date(r.date) <= now);
  const python = [...pythonHtml.matchAll(/>\s*Python (\d+\.\d+\.\d+)\s*<\/a>/g)].map(m => m[1]);
  return {
    nodeLts: newest(published.filter(r => typeof r.lts === 'string' && r.lts.length).map(r => r.version), 'Node LTS'),
    nodeCurrent: newest(published.map(r => r.version), 'Node'),
    pythonStable: newest(python, 'Python'),
    mermaidStable: version(mermaid.version),
  };
}
export async function request(url, format, fetcher = fetch) {
  let failure;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetcher(url, { signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'ReFolDec-technology-freshness' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return format === 'json' ? await response.json() : await response.text();
    } catch (error) { failure = error; }
  }
  throw new Error(`Release lookup failed for ${url}: ${failure.message}`);
}
export async function collect(fetcher = fetch) {
  const [node, python, mermaid] = await Promise.all([
    request(sources.node, 'json', fetcher), request(sources.python, 'text', fetcher),
    request(sources.mermaid, 'json', fetcher),
  ]);
  return selectReleases(node, python, mermaid);
}
export function replitLines(text) {
  const matches = [...text.matchAll(/^modules\s*=\s*\[([^\]]*)\]/gm)];
  if (matches.length !== 1) throw new Error('Expected one Replit modules declaration.');
  const modules = [...matches[0][1].matchAll(/"([^"\n]+)"/g)].map(m => m[1]);
  const node = modules.filter(m => /^nodejs-\d+$/.test(m));
  const python = modules.filter(m => /^python-base-\d+\.\d+$/.test(m));
  if (node.length !== 1 || python.length !== 1) throw new Error('Expected one Node and one Python Replit module.');
  return { node: node[0].slice(7), python: python[0].slice(12) };
}
export function plan(current, releases, replit) {
  version(current.node); version(current.python);
  const changes = [];
  for (const [name, old, next] of [
    ['Node.js LTS', current.node, releases.nodeLts], ['Python', current.python, releases.pythonStable],
  ]) {
    if (compare(next, old) < 0) throw new Error(`Refusing ${name} downgrade: ${old} -> ${next}`);
    if (compare(next, old) > 0) changes.push(`${name}: ${old} -> ${next}`);
  }
  const warnings = [];
  if (replit.node !== releases.nodeLts.split('.')[0]) warnings.push(`Replit Node module ${replit.node} differs from target ${releases.nodeLts}. Verify module availability, migrate .replit and rerun the post-merge checks in Replit.`);
  if (replit.python !== releases.pythonStable.split('.').slice(0, 2).join('.')) warnings.push(`Replit Python module ${replit.python} differs from target ${releases.pythonStable}. Verify module availability, migrate .replit and rerun the post-merge checks in Replit.`);
  return { changes, warnings };
}
export async function run(mode, directory = root, fetcher = fetch) {
  if (!['--check', '--update', '--offline'].includes(mode)) throw new Error('Use --check, --update or --offline.');
  const read = name => readFile(resolve(directory, name), 'utf8');
  const [node, python, replit, previousText] = await Promise.all([
    read('.node-version'), read('.python-version'), read('.replit'), read('docs/technology-versions.json'),
  ]);
  const previous = JSON.parse(previousText);
  if (previous.schemaVersion !== 1) throw new Error('Unsupported technology snapshot schema.');
  const current = { node: node.trim(), python: python.trim() };
  const lines = replitLines(replit);
  const releases = mode === '--offline' ? previous.releases : await collect(fetcher);
  for (const key of ['nodeLts', 'nodeCurrent', 'pythonStable', 'mermaidStable']) {
    version(releases[key]); version(previous.releases[key]);
    if (compare(releases[key], previous.releases[key]) < 0) throw new Error(`Refusing snapshot downgrade for ${key}.`);
  }
  const result = plan(current, releases, lines);
  const drift = JSON.stringify(releases) !== JSON.stringify(previous.releases);
  const changed = result.changes.length > 0 || drift;
  const report = [
    '# Technology freshness', '',
    `Node LTS: ${releases.nodeLts}; latest Current: ${releases.nodeCurrent}.`,
    `Python stable: ${releases.pythonStable}; Mermaid upstream: ${releases.mermaidStable} (advisory, not installed).`, '',
    ...result.changes.map(c => `- ${c}`), ...result.warnings.map(w => `- HOST FOLLOW-UP: ${w}`), '',
    'Exact pins apply to CI and version-manager setup. They do not install or update a local or Replit runtime.',
    'Replit module/channel changes require availability checks and validation in that host.',
  ].join('\n');
  console.log(report);
  if (mode === '--update' && changed) {
    // Retrieve and validate every source before writing. Keep the date unchanged on no-op runs.
    const snapshot = { schemaVersion: 1, retrievedAt: new Date().toISOString(), sources, releases };
    await writeFile(resolve(directory, '.node-version'), `${releases.nodeLts}\n`);
    await writeFile(resolve(directory, '.python-version'), `${releases.pythonStable}\n`);
    await writeFile(resolve(directory, 'docs/technology-versions.json'), `${JSON.stringify(snapshot, null, 2)}\n`);
  }
  if (directory === root && mode !== '--offline' && process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `${report}\n`);
  if (directory === root && mode === '--update' && process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`);
  if (mode !== '--update' && changed) throw new Error('Technology pins/snapshot differ. Run --update and validate the candidate.');
  return { ...result, changed };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await run(process.argv[2] ?? '--check'); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
