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

The root `/skills/` directory was removed and all skills were moved to `.agents/skills/`.

## Decision

All Process Skills for this repository live under **`.agents/skills/<skill-name>/`**.

The `okhp3-skill-cataloger` is the tool used to inventory and validate them. Its output — `.agents/skills/README.md` (between catalog markers) and `.agents/skills/.catalog-meta.json` — is generated and should not be edited by hand.

## Consequences

### Positive

- Skills are co-located with other agent governance files (`.agents/memory/`, `.agents/skills/`).
- The cataloger works without configuration — its default path matches the repo layout.
- Cross-repo consistency: any agent familiar with `.agents/skills/` can find skills immediately.

### Negative

- Paths in older documentation or internal notes that referenced `/skills/` are stale; they were updated when the move was made.

### Invariants

- New skills must be added as lowercase kebab-case directories directly under `.agents/skills/`.
- `SKILL.md` (uppercase) is the canonical spec file in each skill directory.
- The cataloger must be re-run after adding or changing a skill to keep `.catalog-meta.json` and the README catalog current.

## References

- `.agents/skills/README.md` — generated skill catalog.
- `.agents/skills/.catalog-meta.json` — machine-readable catalog metadata.
- `AGENTS.md` — agent operating rules including skill authority order.
