# Repository cleanup and organization — closeout

Date: 2026-10-27 (America/Chicago). Task: **Audit and clean ReFolDec repo**.
Stable task ID: `019fd53b-21e3-78a2-8ec5-cb465c34e9f7`.

## Purpose and coverage

The owner requested an evidence-led understanding of ReFolDec, then a
proportionate cleanup of obsolete working material and file organization. A
later request emphasized a small root and expressly approved moving the
technology inventory to `docs/technology-stack.md`. This is a summary and
decision record, not a lossless conversation transcript.

ReFolDec is the specification head for shared fold vocabulary, a semantic
registry, ecosystem conformance and a publication firewall. Its four
representations are Diagram, Code, Documentation and Agent-Executable. The
codec runtime remains deferred. The repository contains specification checks
and agent support, not an implemented fold orchestrator.

The supported task-history API returned five turns including this closeout,
with `hasMore: false` and no next cursor. The original request, both approvals,
the organization proposal, previous final reports and available patch/tool
summaries were reviewed. Some older tool outputs are not exposed in full by
that API; current files and Git history were checked independently. The task
attachment listing is empty; no required image, download or external handoff was
identified. No missing source is known to change the approved cleanup scope.

The project home is the existing `OKHP3/refoldec` Git checkout. The baseline
for this closeout was clean `main` at `8bd440bc3da60220b50a23286da13c5f0f923dbf`;
the live `origin` main matched that commit. No stash was listed. Two separate
maintenance worktrees were observed and not modified. Their existence does not
prove they are active workers. This record uses the existing `docs/closeouts/`
convention and changes no shared index.

## Completion ledger

Execution owner: the assistant in this task. Project ownership remains with
Jamie Hill. U1 is the original cleanup request; U2 the approval of the cleanup;
U3 the root-organization request; U4 the explicit move approval; U5 the current
closeout request.

| Obligation and source | Acceptance criterion | Evidence | Status |
|---|---|---|---|
| Project and organization evaluation, U1 | Explain purpose, scope, structure and safe cleanup choices | Original task report; current `README.md`, contracts and repository map | Verified complete |
| Remove Python bytecode and prevent recurrence, U1–U2 | Approved tracked artifact removed; cache ignored | Commit `1be8bf7eb1835d91e49efd13a63f426581273214`; `.gitignore`; current tracked-file and ignore checks | Verified complete |
| Refresh skill catalog and remove stale manual list, U1–U2 | Generated index matches the active package set | Commit `f30a0795b2b6c21230624ce606d7ba87cb61f944`; independent generated-content comparison and 40-package inventory, with excluded directories separately scoped | Verified complete |
| Clarify runtime source and publication mirror, U1–U2 | ADR explains distinct roles without inventing another runtime source | `docs/adr/0003-skills-under-agents-skills.md`; commit `f30a0795b2b6c21230624ce606d7ba87cb61f944` | Verified complete |
| Root organization, U3–U4 | Move only the approved technology inventory and update navigation | Commit `1be8bf7eb1835d91e49efd13a63f426581273214`; `docs/technology-stack.md`, `README.md`, `AGENTS.md` | Verified complete |
| Preserve evidence and user work, U1–U4 | Do not purge evaluation provenance or unrelated branches without a decision | Approved changes limited to the identified artifact and documentation; present repository history and evidence reviewed | Verified complete for this task |
| Independent implementation validation, U5 | Run the project gate and inspect the actual outputs | Pass A below | Verified complete |
| Adversarial completion review, U5 | Check obligations, source limits, privacy and receipt | Independent review and follow-up checks in Pass B below | Verified complete |
| Durable closeout, U5 | Save a self-contained record in the established home and commit scoped changes | This package; its containing commit and clean status must be verified before archive | Complete in containing commit, subject to verification |
| Archive exact task, U5 | Archive after completion and verify if supported | Supported exact-ID archive action after final checks | Unfinished at pre-action save |

## Decisions and limits

- Keep the root contracts, README, agent guidance, contribution and changelog
  files, `.replit` and `.gitignore` accessible. The approved move concerned one
  supporting document; no additional moves were authorized in that decision.
- Keep evaluation workspaces and benchmark records where their provenance is
  useful. Similar or byte-identical files alone do not prove they are disposable.
- The previous final response said there were no duplicate candidates after the
  move. That specific conclusion was unsupported: the final inventory did not
  use hashing. An earlier hash-enabled inventory found 19 exact-match groups,
  including intentional promotion mirrors and skill resources. This record does
  not claim every duplicate is intentional or that none exists today.
- Computer Use denied access to Terminal during the approved move. The move was
  instead performed through the local repository terminal and recorded in Git.
- The earlier review left the then-open Dependabot PRs for separate review. No
  merge or deletion was authorized by that finding, and their present lifecycle
  is not an outstanding deliverable of this task.
- The Replit Python module mismatch reported by the current offline gate is a
  separate project-owned host follow-up. This task does not establish hosted
  availability, migration approval or downstream organ conformance.
- A later change, `fd18c5f8a91be375f9956930206447d88f0e230f`, altered the
  active promotion skill's `evals/evals.json` without updating its publication
  mirror. The mirror check on 2026-10-27 returned exit 1 and named that single
  differing file. The earlier equality result was historical, not current.
  This later project-owned drift needs an inspected, separately authorized
  synchronization decision; it was not part of the approved cleanup changes.

## Artifact manifest

Paths below are relative to the repository root. Existing tracked artifacts are
in Git; these new closeout files will enter Git with the scoped commit.

| Artifact | Role and evidence |
|---|---|
| `docs/technology-stack.md` | Moved technology inventory; later project updates are retained |
| `.gitignore` | Prevents recurring Python cache artifacts |
| `.agents/skills/README.md`, `.agents/skills/.catalog-meta.json` | Generated skill catalog; current scope is also recorded in `.agents/skills/.catalog-scope.json` |
| `docs/adr/0003-skills-under-agents-skills.md` | Source and mirror distinction |
| `README.md`, `AGENTS.md` | Navigation and current repository guidance |
| `docs/closeouts/repository-cleanup-019fd53b-21e3-78a2-8ec5-cb465c34e9f7/closeout.md` | This ledger, evidence and pre-archive receipt |
| `docs/closeouts/repository-cleanup-019fd53b-21e3-78a2-8ec5-cb465c34e9f7/source-requests.md` | Normalized original requests and approvals; not a complete transcript |

## Validation and final receipt

Pass A: `PYTHONDONTWRITEBYTECODE=1 bash scripts/post-merge-setup.sh` exited 0
on Darwin arm64 with Node `v26.10.0` and Python `3.14.7`. The gate checked the
22-entry registry, two conformance fixtures, offline technology snapshot,
repository and skill tests, 40 skill packages, generated inventory/evaluation
freshness, catalog and whitespace. It issued advisory skill-style warnings and
a Replit Python module follow-up. Installed Mac versions differ from pinned CI
targets; Linux, Windows, Replit, online freshness and downstream parity were
not run here. The check does not prove a codec runtime or external deployment.

The cataloger's `--check` validates packages and marker presence, but does not
compare generated catalog text to the saved catalog. The independent reviewer
compared current generated content separately and found it matches apart from
timestamps. The later publication-mirror check failed as described above;
its historical equality record must not be used as current parity evidence.

The original cleanup commits `1be8bf7eb1835d91e49efd13a63f426581273214`
and `f30a0795b2b6c21230624ce606d7ba87cb61f944` are ancestors of baseline
`8bd440bc3da60220b50a23286da13c5f0f923dbf`, which matched live remote main
on 2026-10-27. Thus the original changes are remotely preserved. This
closeout's local commit is identified by `git log -1 --format=%H --` on this
file; the original task did not authorize pushing a new closeout or deployment.

Pass B: independent reviewer Dirac (`01a17bcf-e56e-7bb1-af23-856ae641bd94`)
inspected current artifacts, history and original obligations without edits.
The reviewer confirmed the approved changes and identified the catalog-check
limit, later mirror drift, and 97 portable-profile path flags (including
intentional conventions and legacy names, with no observed case or
normalization collision). The assistant independently
reproduced the mirror difference and inspected the catalog check. The findings
are recorded above rather than being masked by the passing general gate. The
historical approval did not authorize overwriting a later divergent mirror.
The review of this closeout identified an overstated storage claim and an
ambiguous request comparison; both were corrected. The saved generic completion
request matches the current request's body after normalization, aside from an
added heading. The reviewer found no obvious confidential material in the draft.
The final staged files were reviewed for scope, path references and common
credential patterns; no private paths or credential patterns were found.
The staged diff passed `git diff --cached --check`.

Prepared receipt: the approved cleanup and root move are verified; original
commits are present on live remote main; this closeout is a scoped local
record. No publication or deployment was requested for this record. The
supported archive action is the remaining administrative step; this
pre-action record does not claim it occurred. If archival fails, retain this
file and report **COMPLETE — ARCHIVE PENDING**. Reruns should reuse this path,
inspect current task history and Git status, and update only changed evidence.
