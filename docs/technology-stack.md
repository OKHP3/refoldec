# ReFolDec technology inventory and update policy

Original audit: **2026-09-18 America/Chicago** (2026-09-19 UTC). Upstream version references and host observations refreshed **2026-10-22 America/Chicago**. Question: which technologies actually execute or define artifacts in ReFolDec, what versions are present, and how should this repository follow stable releases?

## Scope and evidence

The baseline was clean `main`, commit `a735bba03d5be7cc1c51ab4aa4ce06f4863ac37a`, matching GitHub and the live Replit checkout. The audit covered all 502 tracked files, hidden configuration, seven skill `package.json` files, Python imports, JavaScript imports, the post-merge hook, workflow declarations, and notation/proof artifacts. Forty skills are active and eight directories are excluded by the existing catalog scope. Individual skill versions remain in [the skill inventory](evidence/skill-library-inventory.json); they are internal artifact versions, not third-party technology releases.

ReFolDec is a specification repository with maintenance/validation scripts. It has no application build, service, database or codec runtime. The seven private skill manifests are version `0.1.0`, contain test commands, and declare **zero external npm dependencies**. Tracked Python code imports only standard-library modules. There is no requirements file, lockfile or TypeScript compilation pipeline. The old inventory's PyYAML dependency and four-skill claims were stale.

### Current host observations

The 2026-10-22 check observed Windows Node **24.11.1**, Python **3.14.0rc1**, Git **2.56.0.windows.2**, and GitHub CLI **2.96.0**; the Replit checkout reported Node **24.13.0**, Python **3.13.11**, and Git **2.54.0**. These installed versions are distinct from the exact CI targets in `.node-version` and `.python-version`. In particular, the Windows Python executable is a prerelease and must not be described as the stable target. The saved upstream snapshot currently records Node **24.22.1 LTS** and Python **3.15.1**. Future update PRs change the pins and machine-readable snapshot; those files remain authoritative between documentation reviews.

The final host probe also observed Windows Git Bash **5.3.15**, Replit Bash **5.3.9**, Replit GitHub CLI **2.101.0**, and Replit **Determinate Nix 3.11.2**, based on upstream **Nix 2.31.1**. The Nix distribution version, upstream base version and Nixpkgs/Replit channel are separate version axes.

## Executed technologies and tooling

“In place” describes the original audit baseline unless the current host observations above say otherwise. Exact pins are targets for CI/version managers, not claims that installed software has already changed. Upstream references below were refreshed on 2026-10-22; links point to their maintainers' release records.

| Technology | In place / evidence | Latest stable found | Tracking and action |
|---|---|---|---|
| Node.js | `.replit`: `nodejs-24`; local `24.11.1`; live Replit `24.13.0`; former CI selector `lts/*` | **24.22.1 LTS**; **26.12.1 Current** ([Node release index](https://nodejs.org/dist/index.json); refreshed 2026-10-22) | `.node-version` defines the current target; weekly tested PRs follow latest LTS, including a new LTS major. Current is recorded separately. |
| JavaScript / ECMAScript | `.mjs` ES modules and `.cjs` CommonJS; no edition/transpiler pin | **ECMAScript 2026, 17th edition** ([Ecma](https://ecma-international.org/publications-and-standards/standards/ecma-262/)) | Runtime support follows Node. A newer standard does not imply all its features are implemented in the installed engine. |
| Node standard library | File/path/URL, child processes, crypto, test/assert, OS, etc.; bundled with each Node runtime | Same release as Node | No separate npm upgrades. |
| Python / standard library | `.replit`: `python-base-3.13`; live Replit **3.13.11**; local `python3`/`py -3`: **3.14.0rc1**; formerly CI runner-provided, unpinned | **3.15.1** ([Python downloads](https://www.python.org/downloads/)) | `.python-version` defines the current stable target. Python is required by repository evidence checks as well as optional skills. Local and Replit runtimes require separate host checks and updates. |
| Bash | `scripts/post-merge-setup.sh`; local Git Bash **5.3.15**; baseline Replit **5.2.37**, now **5.3.9** | **5.3 with patch 020 (5.3.20)** ([GNU patch index](https://ftp.gnu.org/gnu/bash/bash-5.3-patches/)) | Host-managed. Update via Git for Windows/Replit packages; validate hook after host changes. |
| Git | Version control and optional audit helpers; baseline local **2.55.0.windows.5**, Replit **2.50.1**; current hosts listed above | Upstream **2.56.0**, excluding release candidates ([Git tags](https://github.com/git/git/tags)); Windows **2.56.0.windows.2** ([Git for Windows](https://github.com/git-for-windows/git/releases/latest)) | Host-managed; the current Windows distribution matches this release. Replit upgrade availability is separate. |
| GitHub CLI | Optional repository/recovery skill subprocesses; local **2.96.0**; Replit **2.101.0** | **2.103.0** ([CLI releases](https://github.com/cli/cli/releases/latest)) | Optional host tool; update through its official installer/package manager when those skills are used. |
| GitHub Actions checkout | Existing workflow uses moving major **v7** | **v7.0.1** ([checkout releases](https://github.com/actions/checkout/releases/latest)) | Existing Dependabot configuration tracks Actions; a major tag is not proof of a historical run's resolved commit. |
| GitHub Actions setup-node | Workflow declares moving major **v7** | **v7.1.0** ([setup-node releases](https://github.com/actions/setup-node/releases/latest)) | Dependabot; exact project Node versions come from the runtime pin. |
| GitHub Actions setup-python | Workflow declares moving major **v7** | **v7.1.0** ([setup-python releases](https://github.com/actions/setup-python/releases/latest)) | Explicit stable Python setup replaces the runner default; Dependabot tracks the action. |
| create-pull-request action | Workflow declares **v8.1.1** | **v8.1.1** ([maintainer releases](https://github.com/peter-evans/create-pull-request/releases/latest)) | Creates/refreshes one reviewed update PR after candidate validation; Dependabot tracks it. |
| GitHub runner / system utilities | `ubuntu-latest`; Bash, Git, find, sort and Python bootstrap supplied by the runner | Rolling service image; no single application semver ([runner images](https://github.com/actions/runner-images)) | Runner provider updates the image. Logs record actual tools; the Node/Python matrix is explicit. No claim about the exact image of a run that was not inspected. |
| Replit / Nix environment | `.replit`: channel **stable-25_05** with Node/Python modules; executable reports **Determinate Nix 3.11.2 / upstream Nix 2.31.1** | Determinate Nix **3.23.3** ([maintainer release](https://github.com/DeterminateSystems/nix-src/releases/latest)); upstream Nix **2.35.3** ([downloads](https://nixos.org/download/)); NixOS/Nixpkgs **26.05** ([release](https://nixos.org/blog/announcements/2026/nixos-2605/)); latest Replit-supported channel **unknown** | Distribution, upstream base, Nixpkgs release and Replit channel are different version axes. Verify available modules/channels in Replit before migrating; do not invent a `stable-26_05` channel or self-upgrade the provider-managed Nix service. |

## Formats, notation and contracts

These are real authoring/storage technologies, but most have no installed package version here. A format specification release does not automatically justify rewriting existing documents or changing the fold contract.

| Technology | In place | Current published reference | Update policy |
|---|---|---|---|
| Mermaid | Authored `.mmd` and Mermaid blocks; no installed renderer or version pin; GitHub renderer version unknown | **12.2.0** ([official npm release metadata](https://registry.npmjs.org/mermaid/latest), [maintainer releases](https://github.com/mermaid-js/mermaid/releases); refreshed 2026-10-22) | Weekly upstream watch record; manually smoke-test diagram syntax on the consuming renderer before using new features. No Mermaid dependency is added. |
| Markdown / CommonMark / GFM | `.md` contracts and skills, tables, frontmatter; host-rendered | **CommonMark 0.31.2** ([spec](https://spec.commonmark.org/current/)); **GFM 0.29-gfm** ([GitHub spec](https://github.github.com/gfm/)) | Quarterly reference review and render/link checks; host implementation is not pinned by a specification number. |
| YAML | Workflow files, skill frontmatter and fixtures; skill-specific subset handling | **1.2.2** ([YAML specification](https://yaml.org/spec/1.2.2/)) | Review changes quarterly. The checked-in minimal YAML helper is not a claim of full YAML conformance. |
| TOML | `.replit`; no local parser dependency | **1.1.0** ([TOML](https://toml.io/en/)) | Host parser compatibility governs usable syntax; no migration solely to chase a spec number. |
| JSON | Registry, fixtures, skill manifests and evidence; native parsers | **RFC 8259 / ECMA-404 second edition** ([IETF](https://www.rfc-editor.org/rfc/rfc8259), [Ecma](https://ecma-international.org/publications-and-standards/standards/ecma-404/)) | Follows Node/Python parsers; preserve contract/schema compatibility. |
| JSON Schema | Skill catalog schema declares **draft-07**; no external schema-validation package | **2020-12** ([JSON Schema](https://json-schema.org/overview/what-is-jsonschema)) | Deliberate schema migration with compatibility tests, not an automatic dialect edit. |
| BPMN / BPMN-for-Mermaid | `notation/README.md` and local `bpmn-beta` specification; no BPMN engine | **BPMN 2.0.2** ([OMG](https://www.omg.org/spec/BPMN/)) | Reference standard review; the local notation is not a versioned installation of BPMN software. |
| Agent Skills / SKILL.md | 40 active versioned packages; format and supporting scripts | Living specification ([Agent Skills](https://agentskills.io/specification)); no universal installed runtime version | Review source/provenance and validate catalog/packages when importing updates. Never overwrite local skill versions from an unrelated latest tag. |
| ReFolDec contracts | Fold **1.0.0**, fixture schema **1.1**, registry **1.0.0**, firewall **1.0.0** | Repository-owned canon | Formal version rules in the contracts apply. No upstream automatic semantic revision. |

GitHub, Replit and Notion are managed services rather than installed solution packages. Notion is an architectural capture-plane reference; no Notion SDK or API-version pin executes in this checkout. Editors, browsers, ChatGPT and operating systems used to inspect the project are authoring hosts, not repository dependencies. Their provider updates cannot be controlled by a repository workflow.

## Requested technologies that are not dependencies here

The audit searched executable files, manifests, lockfiles, workflow setup, and imports. Mentions and tutorial examples inside portable skills do not establish installation.

| Technology | In-place version in ReFolDec | Stable reference checked for completeness |
|---|---|---|
| TypeScript | Not installed / no `.ts` or `.tsx` source | **7.0.2** ([maintainer npm metadata](https://registry.npmjs.org/typescript/latest)) |
| Vite | Not installed | **8.3.5** ([metadata](https://registry.npmjs.org/vite/latest)) |
| Tailwind CSS | Not installed | **4.3.3** ([metadata](https://registry.npmjs.org/tailwindcss/latest)) |
| React | Not installed; skill examples only | **19.3.1** ([metadata](https://registry.npmjs.org/react/latest)) |
| Next.js | Not installed; skill examples only | **16.4.2** ([metadata](https://registry.npmjs.org/next/latest)) |
| PyYAML | Not imported by tracked code; local Python environment happens to contain **6.0.3** | **6.0.3** ([PyPI](https://pypi.org/project/PyYAML/)) |
| npm / pip | No external package install required by repository checks; npm can dispatch the seven dependency-free skill test commands | Bundled/host tooling, not a project dependency baseline |

## Implemented update mechanism

- [`.node-version`](../.node-version) and [`.python-version`](../.python-version) define exact stable targets. [The machine-readable snapshot](technology-versions.json) records latest Node Current, Node LTS, Python stable and Mermaid upstream, with source URLs and retrieval time. Its time changes only when a version/pin changes; successful unchanged checks are timestamped in the Actions run instead.
- [`check-technology-versions.mjs`](../scripts/check-technology-versions.mjs) reads official Node/Python release records and the official Mermaid npm package. It compares numeric versions, rejects prereleases/downgrades, bounds network requests, and aborts before writing candidate files if retrieval or parsing fails.
- [`technology-updates.yml`](../.github/workflows/technology-updates.yml) runs Mondays at **08:17 UTC**, or manually, from the default branch. It proposes patches, minors, new Node LTS majors and stable Python minor/major releases; it installs the candidate runtimes, runs the full post-merge validation, then opens or updates `codex/technology-updates`. Failed checks prevent a PR. Unchanged versions create no date-only PR. No automatic merge is enabled.
- [`technology-freshness.yml`](../.github/workflows/technology-freshness.yml) validates on pushes, PRs and manual dispatch. Its matrix covers exact target pins plus the latest patches of the Node/Python lines actually declared in `.replit`. The latter is Linux compatibility evidence, not execution inside Replit. Ordinary PR checks use the saved release snapshot so upstream outages do not prevent unrelated changes.
- [Dependabot](../.github/dependabot.yml) already opens weekly GitHub Action update PRs, including the two actions added here. There are no npm/pip dependency manifests needing updater entries.
- Host-managed Git, Bash, CLI, Replit modules/Nix channel and renderers require a monthly availability/version review using the sources above. Review specifications quarterly and before changing syntax or dialects. Review each active skill's upstream provenance before a package synchronization. These are maintenance-plan items, not automated host upgrades.

### Activation and release

The workflow is merged to the default branch. On 2026-10-22, the owner-approved Actions pull-request permission was confirmed enabled while default workflow permissions remained read-only. The [manual proposal run](https://github.com/OKHP3/refoldec/actions/runs/39713723343) completed successfully with no version drift, so its candidate-install, candidate-test, and PR-creation steps were correctly skipped. Earlier candidate updates passed validation and were integrated through PRs [#11](https://github.com/OKHP3/refoldec/pull/11) and [#12](https://github.com/OKHP3/refoldec/pull/12). A future changed candidate must still pass validation and successfully create a PR; this unchanged run does not prove that future PR creation has occurred.

GitHub must continue to allow Actions to create pull requests (Settings → Actions → General → Workflow permissions). Repository/organization policy may prohibit this; a failed proposal step must be treated as a failure, not as an applied update. The workflow never enables automatic merge.

The updater uses the standard repository token. GitHub does not trigger a new PR workflow from that token's PR events. Candidate tests therefore run **before** PR creation. If protected-branch checks are pending, manually dispatch **Technology freshness** on `codex/technology-updates` and review its result. Merge only after required checks pass; do not bypass protections. See [GitHub's token-trigger rules](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow) and the [PR action's setup requirements](https://github.com/peter-evans/create-pull-request).

After a runtime PR merges, sync the clean Replit checkout and install/select the pinned versions on local development hosts. For Replit, inspect supported module and channel options, make a separate reviewed `.replit` migration if needed, restart the environment, record `node --version` and `python3 --version`, and run `bash scripts/post-merge-setup.sh`. The workflow explicitly reports a Replit line mismatch but does not rewrite unsupported module names. Immediate host review items are Python **3.13 to the current stable pin**, Node patch updates, and the old Nix channel; on Windows, replace the observed prerelease Python when selecting the stable target. Provider support for a newer Replit module/channel has not been established. Keep the tested compatibility lane until a supported migration is verified; a current pin alone does not complete a host migration.

Rollback a problematic runtime change by reverting its pin/snapshot commit, rerunning validation and selecting the previous runtime on each host. Temporarily disable the proposal workflow if it keeps proposing a known-bad release; document the reason and revisit it at the next upstream release. Do not downgrade semantic contracts as part of runtime rollback.

### Local commands

```sh
node scripts/check-technology-versions.mjs --offline  # saved-snapshot consistency, no network
node scripts/check-technology-versions.mjs --check    # read-only live comparison
node scripts/check-technology-versions.mjs --update   # write candidate pins/snapshot, no install/push
bash scripts/post-merge-setup.sh                      # validators, all support tests and drift checks
```

## Evidence limits and source ledger

Upstream release records were refreshed on 2026-10-22 using official registries, maintainer releases and standards-body pages; unchanged standards retain their published reference versions. They are primary authorities because they are maintained by the technology publisher, standards body or official distribution. Each table row maps the source to its exact supported claim; upstream availability alone does not establish local installation or compatibility.

| Claim | Tier and evidence | Consequence if false | Next check |
|---|---|---|---|
| No external npm/Python dependencies in tracked executable code | Confirmed: seven manifests; AST import scan of every tracked `.py`; JavaScript import review | Missing maintenance coverage | Repeat the inventory whenever executable code/manifests change |
| Local and Replit versions shown above | Confirmed: local version commands and Replit browser Shell at the baseline commit | Incorrect upgrade target/gap | Re-read versions after each host migration |
| Latest stable release values | Confirmed: official linked release sources, review date | Stale target | Weekly runtime/Action checks; monthly host and quarterly format review |
| Runtime update workflow is active | Confirmed on 2026-10-22: default-branch workflow, successful manual no-drift run, and enabled proposal permission | No ongoing updates | Monitor future scheduled runs and verify PR creation when a changed candidate is discovered |
| Latest targets are compatible with Replit | Unknown until installed/tested there | Broken hosted checks | Verify module availability, restart and run the host validation |
| Rendered Mermaid version | Unknown; host-controlled and no local renderer | New syntax may fail | Inspect the destination renderer and smoke-test diagrams |

Ongoing release action: review tested update PRs, synchronize each host after merge, and complete host migrations only when their supported versions and validation are verified. No application deployment or codec-runtime guarantee is implied.
