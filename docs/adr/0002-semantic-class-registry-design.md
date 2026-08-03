# ADR-0002: Semantic class registry — token-variable contract

## Status

Accepted

## Date

2026-06-20

## Context

ReFolDec's BPMN-for-Mermaid notation layer requires a controlled vocabulary of semantic node/edge classes. The classes must:

- work across both `architecture` and `process` diagram families,
- drive Mermaid `classDef` styling without embedding hex colors or named color functions,
- be machine-readable for validation and agent consumption,
- support a validator that can be run in CI or locally,
- remain extensible without breaking existing diagrams.

Two designs were considered:

1. **Plain Markdown table** — human-readable, no tooling, no validation.
2. **JSON registry + validator script** — machine-readable, validates constraints, can be tested.

## Decision

Use a JSON registry at `semantic-class-registry/semantic-classes.json` with a companion Markdown spec at `semantic-class-registry/SEMANTIC-CLASSES.md`.

Each entry carries: `id`, `family`, `meaning`, `usage`, and `classDefPattern`. The `classDefPattern` field is the Mermaid `classDef` string and **must use CSS custom property references (`var(--token-…)`) only — no hex values, no named color functions**.

A Node.js validator (`scripts/validate-registry.mjs`) enforces:
- required fields present,
- family limited to `architecture` or `process`,
- no hex or color-function literals in `classDefPattern`,
- no duplicate `(id, family)` pairs.

A test suite (`tests/registry.test.mjs`) runs with the Node built-in test runner and covers all constraints including negative cases.

## Consequences

### Positive

- The registry is the single source of truth; Markdown spec and validator both derive from it.
- Hex-free rule is mechanically enforced, not just documented.
- Adding a new class requires one JSON entry and a validator pass.
- Test coverage prevents regressions on constraint rules.

### Negative

- Tooling dependency: Node.js must be available to run validator/tests.
- JSON is less writable by hand than Markdown; contributors need to know the schema.

### Risks

- CSS custom property names (`--token-…`) must be defined in the consuming theme; if a theme does not define them, diagrams render with fallback colors. This is documented in `SCOPE-FIREWALL.md`.

## References

- `semantic-class-registry/SEMANTIC-CLASSES.md` — schema and entry rules.
- `semantic-class-registry/semantic-classes.json` — the registry.
- `scripts/validate-registry.mjs` — constraint validator.
- `tests/registry.test.mjs` — regression tests.
- `SCOPE-FIREWALL.md` — hex-free policy and scope constraints.
