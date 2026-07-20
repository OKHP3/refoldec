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

- Active specification/documentation project; no application runtime is present. The checked-in validation surface uses Node.js 24 LTS; the supporting skill scripts require Python 3.9+ when those skills are exercised.
- The semantic registry validator and Node test suite are working and dependency-free.
- Four local skills and their supporting assets/scripts are present under `.agents/skills/`; these are checked-in agent capabilities, not a ReFolDec runtime.
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
semantic-class-registry/          human and machine registry definitions
scripts/validate-registry.mjs     dependency-free registry validator
tests/registry.test.mjs           Node test suite for registry rules
notation/README.md                BPMN-for-Mermaid notation specification
docs/                             concepts, glossary, ecosystem map, case study
.agents/skills/                   local SKILL.md files and optional assets/scripts
attached_assets/                  checked-in source prompts/reference material
```

There is one Git repository at this root. No nested repository or independent application was found.

## Runtime and validation

The repository has no package manifest and no install step. `.replit` declares Node.js 24 for the hosted environment; the checks require only Node.js and built-in modules.

Run the repository checks from the root:

```bash
node scripts/validate-registry.mjs
node --test tests/registry.test.mjs
```

The validator checks JSON shape, required fields, allowed `family` and `paletteToken` values, color-agnostic content, and unique `(id, family)` pairs. The test suite also covers negative detection cases. For documentation-only changes, additionally run `git diff --check` and inspect `git status --short`.

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
- The repository has no application build, deployment configuration, or integration test beyond the registry checks. Technology freshness is checked weekly by `.github/workflows/technology-freshness.yml`; update `.replit` when the supported Node.js LTS major changes.

## Keeping this guide current

Update this file when the repository gains a new top-level artifact, validation command, execution surface, canonical contract, or materially different project status. Keep `CLAUDE.md` as the short pointer rather than duplicating this guide. Re-check the structure and validation commands whenever the registry, skills directory, or runtime policy changes.

## Canonical disclaimer

This text must appear in the README of any public OKHP³ repo:

> Personal project of Jamie Hill / OverKill Hill P³, not affiliated with any employer, the mermaid-js maintainers, Mermaid Chart, or Mermaid.ai.
