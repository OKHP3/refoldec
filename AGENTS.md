# AGENTS.md — ReFolDec Repository Guide

Read this file before changing the repository. It is the canonical agent guide; `CLAUDE.md` points here.

## Project identity and scope

ReFolDec (Recursively Folding Codec) is a Git-backed specification and contract repository for the OKHP³ ecosystem. It defines the shared vocabulary and boundaries that downstream organs use when moving the same meaning between diagram, code, documentation, and agent-executable forms.

Confirmed repository responsibilities:

- Define ecosystem conformance rules in `ECOSYSTEM.md`.
- Define the four representations, legal folds, invariants, and round-trip criteria in `FOLD-CONTRACT.md`.
- Maintain the color-agnostic semantic-class registry under `semantic-class-registry/`.
- Enforce the publication boundary in `SCOPE-FIREWALL.md`.
- Explain the architecture and case studies in Markdown documentation.
- Carry a small set of checked-in Process Skills under `.agents/skills/`.

Mission, confirmed by the contracts and README: provide the shared specification head for the OKHP³ organs. The longer-term vision, inferred from the contracts, is a lossless, recursively foldable process-capture model; the programmatic codec runtime is explicitly deferred.

Current status:

- Active specification/documentation project; no application runtime is present. Exact validation targets are recorded in `.node-version` and `.python-version`. Python is required by repository evidence checks and supporting skill scripts. Replit module lines are declared separately in `.replit`.
- The semantic registry validator and Node test suite are working and dependency-free.
- Forty active skills and eight excluded directories are recorded by the skill-library inventory under `.agents/skills/`; these are checked-in agent capabilities, not a ReFolDec runtime.
- Organ URLs and some ecosystem plans are still marked as placeholders or planned in the documentation.

## Scope boundaries and non-goals

Allowed work includes contract and documentation maintenance, semantic-registry entries, Process Skill specifications, and explicitly requested changes to the registry validator/tests.

Do not create or introduce:

- An application, web server, CLI, parser, renderer, database, orchestration engine, or fold runtime.
- New dependencies for the repository-level validator or tests.
- A fifth canonical representation, a new semantic family, or forked definitions of shared vocabulary without a formal contract revision.
- Employer/client names, proprietary identifiers, private artifacts, employer-owned palettes, or sensitive data.
- Bound color literals or CSS color functions in shared/registry content. Registry entries use abstract palette tokens and CSS custom-property references only.

The existing support code inside `.agents/skills/` is in scope only when maintaining those skills. Do not treat it as permission to add application logic.

## Architecture and workflows

ReFolDec is the head of a conceptual ecosystem:

- `mermaid-theme-builder` owns the presentation fold.
- `bpmn-beta` owns the structural/process-notation fold.
- `skillz` owns the automation/package fold.
- `OverKill-Hill` owns the narrative/public surface.

The four canonical representations are `Diagram`, `Code`, `Documentation`, and `Agent-Executable`. `xME` is maturation/fold direction, `xIE` is inversion/unfold direction, and `xMIE` is the combined mechanic. Across folds, preserve semantic role, node identity, edge topology, flow relationships, and governance tags; layout, palette binding, presentation chrome, and prose style may vary.

The normal information flow is:

```text
capture → structure → maturation → inversion → executable/visual artifact → versioned canon
```

The semantic registry is the meaning axis consumed by downstream organs. The head defines roles and abstract tokens; presentation consumers bind concrete styling downstream.

## Repository map

```text
AGENTS.md                         canonical agent guidance
CLAUDE.md                         pointer to AGENTS.md
ECOSYSTEM.md                      ecosystem head and conformance rules
FOLD-CONTRACT.md                  representation and fold contract
SCOPE-FIREWALL.md                 publication/privacy policy
ARCHITECTURE.md                   planes, mechanics, and component roles
README.md                         public overview and status tracker
CONTRIBUTING.md                   contribution conventions
CHANGELOG.md                      history and planned work
.github/ISSUE_TEMPLATE/           issue forms
.replit                           Replit environment metadata; no run command
.node-version / .python-version   exact stable validation targets
semantic-class-registry/          human and machine registry definitions
scripts/validate-registry.mjs     dependency-free registry validator
tests/registry.test.mjs           Node test suite for registry rules
notation/README.md                BPMN-for-Mermaid notation specification
docs/                             concepts, glossary, ecosystem map, case study, technology inventory
.agents/skills/                   local SKILL.md files and optional assets/scripts
attached_assets/                  checked-in source prompts/reference material
```

There is one Git repository at this root. No nested repository or independent application was found.

## Runtime and validation

The repository has no root package manifest or dependency-install step. Seven private skill manifests contain dependency-free Node test commands. Repository checks use Node.js and Python standard libraries. `.replit` declares hosted module lines; exact CI targets are in `.node-version` and `.python-version`.

Run the repository checks from the root:

```bash
node scripts/validate-registry.mjs
node --test tests/registry.test.mjs
node scripts/validate-conformance.mjs
node --test tests/conformance.test.mjs
node --test tests/technology-versions.test.mjs
node scripts/check-technology-versions.mjs --offline
bash scripts/post-merge-setup.sh
```

The registry validator checks JSON shape, required fields, allowed `family` and `paletteToken` values, color-agnostic content, and unique `(id, family)` pairs. The conformance validator checks the four-form fixture, its canonical invariant projections, and contract/schema versions; its tests cover legal-direction preservation, invariant loss, ambiguity, missing metadata, and deferred folds. These are fixture/specification checks, not a codec runtime. For documentation-only changes, additionally run `git diff --check` and inspect `git status --short`.

The Bash post-merge hook runs all repository and skill-support tests, structural validators and generated-evidence freshness checks. `.gitattributes` preserves LF text on every host so frozen evidence hashes remain valid. Generated evidence uses portable paths and UTF-8/LF bytes. CI runs the full gate on Linux and Windows; use Git Bash on Windows and keep host-specific results separate.

No application build, local server, deployment command, or production guarantee is defined in this repository. Links to GitHub/Replit and organ projects in the docs are contextual; placeholder links remain unresolved until the project owner confirms them.

## Change conventions

Before editing, read these in order:

1. `ECOSYSTEM.md`
2. `FOLD-CONTRACT.md`
3. `SCOPE-FIREWALL.md`
4. `ARCHITECTURE.md`

Use the existing naming conventions: uppercase contract/spec files, lowercase kebab-case documentation and JSON assets, lowercase kebab-case skill directories, and `SKILL.md` for a skill entry point.

For registry changes:

- Treat `semantic-class-registry/semantic-classes.json` as the machine source of truth and keep `SEMANTIC-CLASSES.md` aligned.
- Use only the allowed abstract palette tokens: `primary`, `secondary`, `accent`, `accent-alt`, `neutral`, `boundary`, `alert`, `success`.
- The `(id, family)` pair is unique; `data`, `control`, and `alert` may intentionally occur in both families.
- Run both registry commands above after editing the JSON.

For all public/shared content, apply the full checklist in `SCOPE-FIREWALL.md`. Preserve these locked names verbatim: `ReFolDec`, `bpmn-beta`, `skillz`, `PathScrib-R`, `Flowpilot Scribbler`, `OverKill-Hill`, `overkillhill.com`, `xMIE`, `xME`, and `xIE`.

Preserve existing user changes and do not use destructive version-control commands. Keep edits limited to the requested contract, documentation, guidance, registry, skill, or validation scope.

## Known gaps and open questions

- The codec runtime/orchestrator is intentionally deferred; its eventual scope and implementation contract are unknown.
- The organ pointer table contains placeholder repository/Replit URLs that need owner confirmation before being treated as authoritative deployment links.
- Process Skills are present, but their broader release/versioning plan remains in progress.
- The repository has no application build or deployment configuration. `.github/workflows/technology-freshness.yml` validates exact runtime pins and the Replit module lines. `.github/workflows/technology-updates.yml` proposes tested weekly runtime updates; Dependabot handles Actions. See `docs/technology-stack.md` for activation, host migration, stable-release policy and evidence limits. Replit module/channel changes require provider availability checks and validation in that host.

## Keeping this guide current

Update this file when the repository gains a new top-level artifact, validation command, execution surface, canonical contract, or materially different project status. Keep `CLAUDE.md` as the short pointer rather than duplicating this guide. Re-check the structure and validation commands whenever the registry, skills directory, or runtime policy changes.

## Canonical disclaimer

This text must appear in the README of any public OKHP³ repo:

> Personal project of Jamie Hill / OverKill Hill P³, not affiliated with any employer, the mermaid-js maintainers, Mermaid Chart, or Mermaid.ai.
