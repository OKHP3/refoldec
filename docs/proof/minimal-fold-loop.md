# Minimal Fold Loop Proof

This is the first complete, public-safe synthetic loop using the conformance
fixture. A second, distinct public development fixture is recorded alongside it
to test whether the comparison survives a different graph shape. Both packages
are intentionally small enough for a reviewer to reproduce by inspection.
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

The second fixture is the synthetic order-reconciliation workflow:

| Artifact | Location |
|---|---|
| Neutral fixture | [`fixture-order-reconciliation.json`](../conformance/fixture-order-reconciliation.json) |
| Frozen proof package | [`order-reconciliation/`](./order-reconciliation/) |
| Comparison and hashes | [`comparison.json`](./order-reconciliation/comparison.json) |

It has seven nodes, seven directed edges, two branches, and four governance
tags. Its `system` and `log` roles, resubmission path, and branch vocabulary
differ from the six-node access-request fixture. The second package repeats the
source, four canonical forms, inverse Code and Documentation artifacts, and
manual invariant comparison.

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

Both comparison records report `PASS` for all five contract invariants:
semantic role, node identity, edge topology, flow relationships, and governance
tags. The second record also stores SHA-256 values for each invariant projection
and each frozen artifact, with explicit reject-on-mismatch handling. The
recorded evidence status remains **manual-analytical**: a human performed and
reviewed the bounded transformations, while no independent runtime executor,
renderer, or agent client was used. Lossy, ambiguous, and deferred cases are
recorded rather than treated as successful.

## What this proves—and what it does not

This proves that two distinct synthetic workflows have complete, inspectable,
contract-shaped paths through Documentation → Code → Diagram and
Documentation → Code → Agent-Executable, with inverse artifacts compared at the
invariant level. It supports the bounded claim **two public-safe
fixture-level fold loops were manually demonstrated on distinct graph
shapes**.

Repeating the manual comparison on a second graph shape is analytical evidence
against a one-example self-consistency explanation, but it does not prove a
general parser, renderer, agent executor, production losslessness, portability,
or the deferred direct Diagram ↔ Agent-Executable folds. Because the second
fixture is checked in and visible, it is a public development fixture rather
than a protected release holdout. The diagrams are source-level reproducible,
and neither executable artifact is presented as having run.

## Reproduction checks

From the repository root, run:

```sh
node scripts/validate-conformance.mjs
node --test tests/conformance.test.mjs
git diff --check
```

Then inspect both proof packages, their transformation records, and the exact
invariant comparisons in each `comparison.json`. Recompute the recorded
SHA-256 values with `sha256sum` if any proof artifact changes; a changed hash
requires a fresh manual comparison.
