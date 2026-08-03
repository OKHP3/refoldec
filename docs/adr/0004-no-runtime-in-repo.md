# ADR-0004: No codec runtime or fold orchestrator in this repository

## Status

Accepted

## Date

2026-06-20

## Context

ReFolDec is a bidirectional process-capture and transformation framework. A natural next step for any framework is an executable runtime — something that can actually orchestrate a fold or unfold operation end-to-end.

The question arose: should the ReFolDec repository include scaffolding for a fold orchestrator, a codec runtime, or any application code?

Arguments for inclusion:
- Demonstrates the framework in action.
- Gives contributors something to run.
- Accelerates proof-of-concept work.

Arguments against:
- The framework's organs (BAC, MPS, xMIE/xIE) are not yet stable; a runtime built before they stabilize will diverge from the spec.
- Application code creates maintenance obligations and dependency chains.
- A runtime built in isolation from real fold operations is likely to be wrong in non-obvious ways.
- The repository's value is its specification, contracts, and semantic vocabulary — not its runtime behavior.

## Decision

**No codec runtime, fold orchestrator, or application code belongs in this repository until the organs stabilize.**

This is recorded explicitly in:
- `README.md` — status table row: "ReFolDec runtime / fold orchestrator | ⏸ Intentionally deferred".
- `ECOSYSTEM.md` — "what ReFolDec is not" section.
- `SCOPE-FIREWALL.md` — explicit prohibition on application, runtime, and orchestration code.
- `AGENTS.md` — "What agents must not do" section.

## Consequences

### Positive

- The repo stays focused. Anyone reading it understands immediately that it is a specification repository, not a runnable application.
- No build system, package manager, or deployment pipeline needs to be maintained.
- Agents working in the repo cannot accidentally introduce application code without violating a documented, checkable rule.

### Negative

- There is no immediately runnable demonstration of the framework.
- Contributors who expect a `npm start` or `python main.py` entry point will find none.

### Review trigger

This decision should be revisited when: at least two of BAC, MPS, and xMIE/xIE have stable v1.0 specifications that have been validated against real fold operations.

## References

- `SCOPE-FIREWALL.md` — scope policy and explicit prohibitions.
- `ECOSYSTEM.md` — head-canon: organs, their status, and what is not a runtime.
- `README.md` — status tracker.
