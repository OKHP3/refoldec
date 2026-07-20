#!/usr/bin/env node

/**
 * Checks the declared Replit Node.js major against the latest Node.js LTS.
 * No external dependencies are required.
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const replit = await readFile(resolve(root, '.replit'), 'utf8');
const declared = replit.match(/nodejs-(\d+)/)?.[1];

if (!declared) {
  console.error('Could not find a nodejs-<major> declaration in .replit.');
  process.exit(1);
}

const response = await fetch('https://nodejs.org/dist/index.json');
if (!response.ok) {
  console.error(`Node.js release index request failed: ${response.status}`);
  process.exit(1);
}

const releases = await response.json();
const latestLts = releases.find((release) => release.lts);
if (!latestLts) {
  console.error('Node.js release index did not contain an LTS release.');
  process.exit(1);
}

const latestMajor = latestLts.version.match(/^v(\d+)/)?.[1];
console.log(`Declared Replit Node.js major: ${declared}`);
console.log(`Latest Node.js LTS release: ${latestLts.version}`);

if (declared !== latestMajor) {
  console.error(`Update .replit from nodejs-${declared} to nodejs-${latestMajor}.`);
  process.exit(1);
}

console.log('Technology freshness check passed.');
