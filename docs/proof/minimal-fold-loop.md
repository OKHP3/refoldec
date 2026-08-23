# Minimal Fold Loop Proof

This is one complete, public-safe synthetic loop using the conformance fixture.
It is intentionally small enough for a reviewer to reproduce by inspection.

## Four canonical forms

| Representation | Artifact |
|---|---|
| Documentation | [`documentation.md`](./checkout-request/documentation.md) |
| Code | [`code.mmd`](./checkout-request/code.mmd) |
| Diagram | [`diagram.md`](./checkout-request/diagram.md) |
| Agent-Executable | [`agent-executable.md`](./checkout-request/agent-executable.md) |

The neutral source fixture is [`fixture.json`](../conformance/fixture.json).
The recorded comparison is [`comparison.json`](./checkout-request/comparison.json).

## Reproducible sequence

1. Read the Documentation narrative and identify six named nodes and two
   conditional branches.
2. Encode those nodes and relationships in Code.
3. Render Code as the Diagram representation.
4. Fold Code into Agent-Executable instructions.
5. Unfold Agent-Executable back to Code and compare the canonical projections.
6. Unfold Code back to Documentation and compare the same projections.

The comparison preserves all five contract invariants: semantic role, node
identity, edge topology, flow relationships, and governance tags. The recorded
status is **analytical**, because no independent runtime executor was used.
Lossy and deferred cases are recorded rather than treated as successful.
