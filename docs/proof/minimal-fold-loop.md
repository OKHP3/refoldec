# Minimal Fold Loop Proof

This is one complete, public-safe synthetic loop using the conformance fixture.
It is intentionally small enough for a reviewer to reproduce by inspection.
The record is a manual/fixture-level proof, not evidence of a general codec
runtime or an agent having executed the instructions.

## Source and four canonical forms

The raw synthetic capture is [`source-input.md`](./checkout-request/source-input.md).
It is provenance for the proof, not a fifth canonical representation.

| Representation | Artifact |
|---|---|
| Documentation | [`documentation.md`](./checkout-request/documentation.md) |
| Code | [`code.mmd`](./checkout-request/code.mmd) |
| Diagram | [`diagram.md`](./checkout-request/diagram.md) |
| Agent-Executable | [`agent-executable.md`](./checkout-request/agent-executable.md) |

The neutral source fixture is [`fixture.json`](../conformance/fixture.json).
The recorded comparison, transformation ledger, hashes, and review decisions
are [`comparison.json`](./checkout-request/comparison.json).
The manually reconstructed inverse outputs are
[`unfolded-code.mmd`](./checkout-request/unfolded-code.mmd) and
[`unfolded-documentation.md`](./checkout-request/unfolded-documentation.md).

## Executed/manual sequence

The proof was performed as a bounded manual transformation sequence. Each
step has a checked-in input/output artifact and is recorded in
[`comparison.json`](./checkout-request/comparison.json).

1. Capture the synthetic request workflow in `source-input.md`.
2. Fold the capture into `documentation.md`, naming six nodes, their registry
   roles, six directed edges, two conditional branches, and all four
   governance tags.
3. Fold Documentation → Code into `code.mmd`, using the six canonical IDs and
   explicit Mermaid class assignments.
4. Fold Code → Diagram into `diagram.md`; retain the source-level Mermaid
   rendering recipe and a visible trace table. No renderer is claimed.
5. Fold Code → Agent-Executable into `agent-executable.md`, preserving the
   ordered steps, both branches, escalation path, roles, IDs, and tags.
6. Unfold Agent-Executable → Code into `unfolded-code.mmd`.
7. Unfold Code → Documentation into `unfolded-documentation.md`.
8. Compare the source Documentation projection with the final unfolded
   Documentation projection, and compare the original Code projection with
   the inverse Code projection.

The comparison records `PASS` for all five contract invariants: semantic role,
node identity, edge topology, flow relationships, and governance tags. The
recorded evidence status is **manual-analytical**: a human performed and
reviewed the bounded transformation, while no independent runtime executor,
renderer, or agent client was used. Lossy, ambiguous, and deferred cases are
recorded rather than treated as successful.

## What this proves—and what it does not

This proves that one synthetic workflow has a complete, inspectable,
contract-shaped path through Documentation → Code → Diagram and
Documentation → Code → Agent-Executable, with inverse artifacts compared at
the invariant level. It supports the bounded claim **one public-safe
fixture-level fold loop was manually demonstrated**.

It does not prove a general parser, renderer, agent executor, production
losslessness, portability, or the deferred direct Diagram ↔ Agent-Executable
folds. The diagram is source-level reproducible, and the executable artifact
is not presented as having run.

## Reproduction checks

From the repository root, run:

```sh
node scripts/validate-conformance.mjs
node --test tests/conformance.test.mjs
git diff --check
```

Then inspect the seven transformation records and the exact invariant
comparison in `comparison.json`. Recompute the recorded SHA-256 values with
`sha256sum` if any proof artifact changes; a changed hash requires a fresh
manual comparison.
