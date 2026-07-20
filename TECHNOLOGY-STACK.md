# ReFolDec Technology Stack

> Inventory reviewed 2026-07-20. This repository is a specification and documentation project, not a Vite/Tailwind/TypeScript application.

## Implemented technologies

| Technology | In use | Latest stable/reference checked | Notes |
|---|---:|---:|---|
| Node.js | `nodejs-24` in `.replit` | Node.js `24.18.0` LTS; `26.5.0` is the latest Current release | Node 20 was EOL and has been replaced with the supported LTS line. |
| JavaScript | ECMAScript modules in `.mjs` files | No separately pinned ECMAScript edition | The validator and tests use Node built-ins; there is no TypeScript compiler or transpiler. |
| Node built-ins | `node:test`, `node:assert/strict`, `fs`, `path`, `url` | Shipped with the selected Node.js release | No npm package dependencies or package manifest are present. |
| Python | `3.9+` documented by `okhp3-skill-cataloger` | Python `3.14.6` | Used only by optional checked-in skill support scripts; no repository Python runtime is pinned. |
| PyYAML | Imported by `skill-creator/scripts/quick_validate.py` | PyYAML `6.0.3` | Unmanaged optional skill-script dependency: no requirements file or lockfile is present. |
| JSON | `semantic-classes.json` and skill metadata | JSON has no project runtime version | The registry is validated with Node's built-in JSON parser. |
| Markdown / CommonMark | Contract, documentation, and skill files | CommonMark `0.31.2` | Markdown is the repository's canonical documentation format. |
| GitHub Actions | Added by this maintenance change | `actions/checkout@v6`, `actions/setup-node@v6` | Action references are monitored by Dependabot. |

## Referenced, but not installed here

These technologies appear in the architecture or contracts, but this repository does not contain their runtime, package, or version declaration:

- Mermaid and BPMN-for-Mermaid: notation and rendering concepts only.
- Notion and GitHub: ecosystem/capture and canon-plane references; GitHub Actions is now used only for repository checks.
- Replit: hosting metadata in `.replit`, not an application runtime dependency beyond the declared Node module.
- TypeScript, Vite, Tailwind CSS, React, Next.js, npm packages, and Python package management: not present in this solution.

## Maintenance policy

1. Keep the Replit runtime on the latest supported Node.js LTS major.
2. Use `node-version: lts/*` in CI so patch and minor LTS releases are picked up automatically.
3. Run `scripts/check-technology-versions.mjs` weekly. It fails when `.replit` falls behind the latest Node.js LTS major.
4. Let Dependabot open pull requests for GitHub Action updates.
5. When a Python skill script is promoted to a required execution path, add a pinned `requirements.txt`/lockfile and a Python CI job before treating PyYAML as a managed dependency.

## Sources

- Node.js releases: https://nodejs.org/en/about/previous-releases
- Python release: https://www.python.org/downloads/release/python-3146/
- PyYAML releases: https://pypi.org/project/PyYAML/
- Mermaid releases: https://github.com/mermaid-js/mermaid/releases
- CommonMark specification: https://spec.commonmark.org/current/
- GitHub Dependabot for Actions: https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions
