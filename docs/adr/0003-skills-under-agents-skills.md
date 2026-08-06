# ADR-0003: Process Skills located under `.agents/skills/`

## Status

Accepted

## Date

2026-07-01

## Context

ReFolDec defines **Process Skills** as executable process-capture contracts that agents can run. When the first skills were added to the repo, the directory was `/skills/` at the root.

As the OKHP³ ecosystem adopted the Agent Skills portable format (each skill: one directory, one `SKILL.md`, optional `assets/`, `scripts/`, `references/`, `evals/`), the standard placement for project-local skills across the ecosystem became `.agents/skills/<skill-name>/`.

This aligns with:
- the `okhp3-skill-cataloger` tool's default `--skills-dir .agents/skills`,
- `AGENTS.md` conventions for agent-readable governance files in `.agents/`,
- the emerging de facto standard across OKHP³ repositories.

The runtime source for all local Process Skills lives under `.agents/skills/`.
The root `/skills/` path is permitted only for an explicitly identified,
generated publication mirror such as `skills/okhp3-skill-promotion/`; it is not
an additional authoring location or runtime skill catalog.

## Decision

All Process Skills for this repository live under **`.agents/skills/<skill-name>/`**.

The `okhp3-skill-cataloger` is the tool used to inventory and validate them. Its output — `.agents/skills/README.md` (between catalog markers) and `.agents/skills/.catalog-meta.json` — is generated and should not be edited by hand.

## Consequences

### Positive

- Skills are co-located with other agent governance files (`.agents/memory/`, `.agents/skills/`).
- The cataloger works without configuration — its default path matches the repo layout.
- Cross-repo consistency: any agent familiar with `.agents/skills/` can find runtime skills immediately, while promotion mirrors remain clearly labeled and traceable.

### Negative

- Paths in older documentation or internal notes that referenced `/skills/` must be classified: runtime references are stale, while explicit promotion-mirror references may remain valid.

### Invariants

- New skills must be added as lowercase kebab-case directories directly under `.agents/skills/`.
- `SKILL.md` (uppercase) is the canonical spec file in each skill directory.
- The cataloger must be re-run after adding or changing a skill to keep `.catalog-meta.json` and the README catalog current.

## References

- `.agents/skills/README.md` — generated skill catalog.
- `.agents/skills/.catalog-meta.json` — machine-readable catalog metadata.
- `skills/` — optional publication mirrors, never a second editable runtime source.
- `AGENTS.md` — agent operating rules including skill authority order.
