# Fold Conformance Matrix

This matrix turns `FOLD-CONTRACT.md` into an implementation-neutral test
contract. A conforming implementation may use any parser or renderer, but its
observable result must satisfy the same checks.

## Invariant comparison

Compare these canonical projections, ignoring formatting and presentation:

```text
nodes[id] = { semantic_role, governance_tags }
edges = sorted({ from, to, relationship })
flows = sorted({ branch_id, source, target, condition })
```

Node IDs are exact. Roles, edge endpoints, relationship names, flow branch
identifiers, and governance tags are exact. Layout, colors, prose wording,
heading style, and renderer chrome are deliberately excluded.

## Legal folds

| Fold | Input → output | Must preserve | Allowed variation | Failure conditions |
|---|---|---|---|---|
| Documentation → Code | narrative → machine-readable source | node IDs, roles, edges, flows, governance tags | prose wording and formatting | missing identity, inferred edge not marked, missing governance tag |
| Code → Documentation | source → narrative | same canonical projections | sentence order, headings, table/list form | omitted branch, renamed node without trace |
| Code → Diagram | source → rendered visual | nodes, roles, directed topology, flows, governance tags | coordinates, palette, renderer chrome | invisible node/edge, role-only styling with no semantic trace |
| Diagram → Code | visual → source | visible node IDs/roles/topology/flows/tags | source formatting and layout reconstruction | ambiguous or unreadable visual relationship |
| Code → Agent-Executable | source → instructions | IDs, roles, sequence, branches, tags | instruction prose and formatting | unexecutable ambiguity, skipped failure path |
| Agent-Executable → Code | instructions → source | IDs, roles, sequence, branches, tags | DSL formatting | inferred step or branch lacks explicit uncertainty |
| Documentation → Agent-Executable | narrative → instructions | IDs, roles, flows, tags, plus executable inputs/outputs | prose style | rationale mistaken for an executable step |
| Agent-Executable → Documentation | instructions → narrative | IDs, roles, flows, tags | explanatory detail | trigger, output, or escalation omitted |
| Documentation → Diagram | narrative → visual | IDs, roles, topology, flows, tags | layout and style | narrative branch has no visual counterpart |
| Diagram → Documentation | visual → narrative | IDs, roles, topology, flows, tags | prose order and wording | visual ambiguity hidden by confident prose |

## Deferred folds

`Diagram → Agent-Executable` and `Agent-Executable → Diagram` remain rejected by
the conformance validator because they skip the contracted Code intermediate.
An implementation must fail explicitly and propose a contract revision rather
than silently applying an untested shortcut.

## Test design

The checked-in fixture has one valid round trip and two defective variants:

1. remove a governance tag;
2. redirect one edge to a different node.

The validator must accept the valid projections, identify the exact missing or
changed invariant in each defective variant, and reject both deferred folds.

## Contract revision rules

Changes to canonical representations, legal folds, invariant definitions, or
deferred status require:

1. a change proposal and ADR;
2. a version change in the contract and fixture schema;
3. updated matrix, fixtures, and negative tests;
4. downstream parity review;
5. an explicit decision about whether prior proof records remain valid.
