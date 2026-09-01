# Fold Conformance Matrix

This matrix is the implementation-neutral conformance specification for
`FOLD-CONTRACT.md` version `1.0.0`. It describes what a fold must accept,
produce, preserve, and reject. It does not define a parser, renderer, codec
runtime, or orchestration engine.

## Canonical invariant projection

Every form in the neutral fixture exposes an `invariant_projection`. A
downstream implementation may store these facts differently, but it MUST be
able to project its result into this shape before comparison:

```text
{
  nodes: sorted({ id, semantic_role }),
  edges: sorted({ from, to, relationship }),
  flows: sorted({ branch_id, source, target, condition }),
  governance: { artifact_version, owner, status, applicable_context }
}
```

Comparison rules:

1. Node IDs, `(id, semantic_role)` pairs, edge endpoints, relationship names,
   branch IDs, flow endpoints, conditions, and governance values are exact.
2. Arrays are compared as sets after sorting by their complete stable record;
   duplicate records are not silently deduplicated.
3. Every edge endpoint and flow endpoint MUST refer to a known node ID.
4. Missing, extra, renamed, duplicated, or ambiguous invariant records fail.
5. Layout, coordinates, colors, prose wording, heading/list style, syntax
   whitespace, and renderer chrome are excluded from comparison.
6. An implementation MUST preserve an explicitly represented invariant. It
   MUST NOT infer an absent value and report the result as lossless.

The four concrete fixture forms are in
[`fixture.json`](./fixture.json). Their payloads demonstrate the shape of a
diagram, code, narrative, and executable instruction without pretending to
execute any of them.

## Core-loop crosswalk

The explanatory core loop surrounds, but does not expand, the four canonical
forms in `FOLD-CONTRACT.md`. This crosswalk is the conformance interpretation
for loop labels:

| Loop label | Canonical mapping |
|---|---|
| `idea`, `text`, `structure` | Explanatory capture/structuring states; they are not fixture forms |
| `diagram` | `Diagram` when rendered; diagram source remains `Code` |
| `code` | `Code` |
| `documentation` | `Documentation` |
| `agent instruction` | `Agent-Executable` |
| `reusable artifact` | Explanatory package/re-entry boundary; not a fifth form |

The explanatory transitions `idea ⇄ text`, `text ⇄ structure`, packaging into
`reusable artifact`, and loop re-entry do not claim legal codec folds. The
structured narrative becomes `Documentation` before using the legal
`Documentation ⇄ Diagram` rows. The remaining adjacent canonical transitions
use the legal rows in this matrix. Direct `Diagram ⇄ Agent-Executable` remains
deferred and must not be inferred from the explanatory loop.

The synthetic access-request fixture is checked against this crosswalk by the
dependency-free validator and Node test: its representations must be exactly
`Diagram`, `Code`, `Documentation`, and `Agent-Executable`, and none of the
explanatory labels may appear as a representation key. This checks the mapping
without claiming that the fixture executes the loop.

## Legal fold matrix

Each row is a separately testable directed operation. The inverse row is also
listed; “reversible” means the two directions must produce semantically
equivalent projections, not byte-identical files.

| ID | Direction | Input contract | Output contract | Must preserve | Allowed variation | Failure conditions |
|---|---|---|---|---|---|---|
| F01 | `Documentation → Code` | Narrative names its steps, relationships, branches, and governance tags, or marks uncertainty explicitly | Machine-readable source contains addressable nodes, directed edges, flows, roles, and tags | All five invariant classes | Prose wording, headings, source whitespace | `MISSING_NODE_ID`, `ROLE_DRIFT`, `TOPOLOGY_DRIFT`, `FLOW_DRIFT`, `GOVERNANCE_DRIFT`, `UNMARKED_INFERENCE` |
| F02 | `Code → Documentation` | Source has parseable node IDs, role assignments, topology, flows, and tags | Narrative identifies every source node and explains every relationship, branch, and tag | All five invariant classes | Sentence order, headings, table/list form, explanatory wording | `OMITTED_NODE`, `OMITTED_EDGE`, `OMITTED_BRANCH`, `RENAMED_NODE`, `GOVERNANCE_DRIFT` |
| F03 | `Code → Diagram` | Source graph and registry role assignments are valid | Rendered visual exposes every node, directed edge, branch, role, and governance marker | All five invariant classes | Coordinates, palette binding, shape rendering details, renderer chrome | `INVISIBLE_NODE`, `INVISIBLE_EDGE`, `ROLE_DRIFT`, `FLOW_DRIFT`, `GOVERNANCE_DRIFT` |
| F04 | `Diagram → Code` | Visual has readable, uniquely traceable node identity, roles, topology, flows, and tags | Source reconstructs the same graph and metadata, or fails when the visual is insufficient | All five invariant classes | DSL syntax, source ordering, reconstructed layout metadata | `AMBIGUOUS_MAPPING`, `UNREADABLE_RELATIONSHIP`, `MISSING_NODE_ID`, `TOPOLOGY_DRIFT`, `UNMARKED_INFERENCE` |
| F05 | `Code → Agent-Executable` | Source describes an ordered process with triggers, inputs/outputs, branches, failure paths, roles, and tags | Instructions are directly executable and address every required step and branch | Identity, roles, topology, flow relationships, governance tags; plus executable sequence and I/O | Instruction prose, formatting, step grouping that does not change order | `OMITTED_STEP`, `UNEXECUTABLE_AMBIGUITY`, `OMITTED_FAILURE_PATH`, `FLOW_DRIFT`, `GOVERNANCE_DRIFT` |
| F06 | `Agent-Executable → Code` | Instructions contain an unambiguous sequence, trigger, I/O, branches, failure paths, roles, and tags | Source reconstructs nodes, edges, flows, and tags without promoting rationale into logic | Identity, roles, topology, flow relationships, governance tags | DSL syntax and formatting | `AMBIGUOUS_MAPPING`, `OMITTED_STEP`, `OMITTED_FAILURE_PATH`, `UNMARKED_INFERENCE`, `GOVERNANCE_DRIFT` |
| F07 | `Documentation → Agent-Executable` | Narrative distinguishes rationale/context from executable steps and states inputs, outputs, branches, failures, and tags | Instructions have an explicit trigger, ordered steps, I/O, branch conditions, escalation/failure behavior, and roles | Identity, roles, topology, flow relationships, governance tags | Narrative style and instruction formatting | `RATIONALE_AS_STEP`, `UNEXECUTABLE_AMBIGUITY`, `OMITTED_INPUT_OUTPUT`, `OMITTED_FAILURE_PATH`, `GOVERNANCE_DRIFT` |
| F08 | `Agent-Executable → Documentation` | Instructions have explicit sequence, conditions, outputs, failure paths, and governance tags | Narrative explains the process and rationale without dropping executable commitments | Identity, roles, topology, flow relationships, governance tags | Explanatory detail, sentence order, headings | `OMITTED_TRIGGER`, `OMITTED_OUTPUT`, `OMITTED_BRANCH`, `OMITTED_ESCALATION`, `GOVERNANCE_DRIFT` |
| F09 | `Documentation → Diagram` | Narrative explicitly identifies graph elements, roles, relationships, branches, and tags | Visual contains a traceable node/edge/flow representation | Identity, roles, topology, flow relationships, governance tags | Layout, coordinates, palette, renderer chrome | `INVISIBLE_NODE`, `INVISIBLE_EDGE`, `NARRATIVE_BRANCH_WITHOUT_VISUAL`, `AMBIGUOUS_MAPPING`, `GOVERNANCE_DRIFT` |
| F10 | `Diagram → Documentation` | Visual relationships, node identity, roles, flows, and tags are readable and uniquely traceable | Prose narrates every visible commitment and marks unresolved visual ambiguity | Identity, roles, topology, flow relationships, governance tags | Prose order, wording, explanatory detail | `UNREADABLE_RELATIONSHIP`, `OMITTED_EDGE`, `OMITTED_BRANCH`, `AMBIGUITY_HIDDEN`, `GOVERNANCE_DRIFT` |

F01/F02, F03/F04, F05/F06, F07/F08, and F09/F10 are inverse pairs. A valid
round trip runs one row followed by its inverse and compares the source and
reconstructed invariant projections exactly.

## Failure vocabulary

These codes are stable conformance outcomes, not implementation-specific error
messages:

| Code | Meaning |
|---|---|
| `MISSING_NODE_ID` | A node cannot be addressed across forms |
| `OMITTED_NODE` / `OMITTED_STEP` | A source node or executable step is absent |
| `ROLE_DRIFT` | A node's semantic class changed |
| `TOPOLOGY_DRIFT` / `OMITTED_EDGE` | A directed relationship changed or disappeared |
| `FLOW_DRIFT` / `OMITTED_BRANCH` | Branch identity, endpoint, or condition changed or disappeared |
| `GOVERNANCE_DRIFT` | A required governance tag changed or disappeared |
| `AMBIGUOUS_MAPPING` | More than one source element could match the output element |
| `UNMARKED_INFERENCE` | The output invents a missing fact without an explicit uncertainty marker |
| `UNEXECUTABLE_AMBIGUITY` | Instructions cannot be executed deterministically |
| `OMITTED_FAILURE_PATH` / `OMITTED_ESCALATION` | A failure or escalation commitment is absent |
| `INVISIBLE_NODE` / `INVISIBLE_EDGE` | A diagram does not expose a required element or relationship |
| `RATIONALE_AS_STEP` | Documentation context was incorrectly promoted to execution |
| `OMITTED_INPUT_OUTPUT` / `OMITTED_TRIGGER` / `OMITTED_OUTPUT` | Executable contract metadata is absent |
| `NARRATIVE_BRANCH_WITHOUT_VISUAL` | A documented branch has no diagram counterpart |
| `UNREADABLE_RELATIONSHIP` / `AMBIGUITY_HIDDEN` | Visual evidence is insufficient and was presented as certain |
| `DEFERRED_FOLD` | A direct fold is not legal in this contract |

## Deferred folds

`Diagram → Agent-Executable` and `Agent-Executable → Diagram` remain rejected.
They skip the contracted `Code` intermediate. An implementation MUST return
`DEFERRED_FOLD`, identify the missing intermediate representation, and point to
a contract revision process rather than silently applying a shortcut.

## Fixture-level test design

The dependency-free tests use the four fixture projections as stand-ins for
fold output; they do not claim to execute a codec. They cover:

- one valid round trip for every legal direction and inverse pair;
- one explicit invariant-loss mutation for every legal direction;
- role, topology, flow, and governance preservation;
- missing metadata and ambiguous identity;
- exact deferred-fold rejection;
- registry-role compatibility and the four-form fixture shape.

This is contract-level evidence. It does not establish runtime reversibility,
renderer compatibility, Agent Skills portability, or generalization to unseen
fixtures. Those claims remain bounded by the evidence baseline in
[`docs/evidence/2026-08-22-refoldec-baseline.md`](../evidence/2026-08-22-refoldec-baseline.md)
and the later review record.

## Revision and downstream parity

The source-of-truth versions are:

| Artifact | Version |
|---|---|
| `FOLD-CONTRACT.md` | `1.0.0` |
| `fixture.json` schema | `1.1` |
| Semantic class registry | `1.0.0` |
| `SCOPE-FIREWALL.md` | `1.0.0` |

Any change to canonical representations, vocabulary, invariants, legal or
deferred folds, or comparison rules requires a major contract revision, an
ADR, updated fixture/matrix/tests, and downstream parity review. Additive
non-breaking evidence or optional metadata may use a minor revision; editorial
clarifications may use a patch revision. A semantic revision invalidates prior
proof records until they are rerun. See `ECOSYSTEM.md` for the required parity
record fields and fail-closed behavior.