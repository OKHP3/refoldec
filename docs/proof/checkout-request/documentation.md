---
artifact: synthetic-access-request
representation: Documentation
version: 1.0.0
owner: refoldec-maintainers
status: fixture
applicable_context: public-safe synthetic demonstration
---

# Synthetic access request

The **Requester** submits an access request. A reviewer checks whether the
request is complete. Complete requests proceed to **Approve request** and then
the decision is recorded. Incomplete requests return to the requester for
correction and are submitted again. If completeness cannot be determined, the
process stops and escalates rather than inventing a decision.

## Semantic trace

The names in backticks are canonical node IDs, not merely labels. The role
assignments are taken from the ReFolDec semantic-class registry.

| Node ID | Human label | Semantic role |
|---|---|---|
| `requester` | Requester | `actor` |
| `submit` | Submit access request | `step` |
| `review` | Request complete? | `decision` |
| `approve` | Approve request | `approval` |
| `return` | Return for correction | `handoff` |
| `record` | Record decision | `data` |

The directed relationships are `requester → submit` (`performs`),
`submit → review` (`flows-to`), `review → approve` (`yes`),
`review → return` (`no`), `approve → record` (`flows-to`), and
`return → submit` (`flows-to`). The `complete` branch means “request is
complete”; the `incomplete` branch means “request is incomplete”.

## Governance trace

This artifact carries `artifact_version: 1.0.0`, `owner:
refoldec-maintainers`, `status: fixture`, and `applicable_context: public-safe
synthetic demonstration`. These values are compared exactly in the proof
record.

This public-safe fixture exists to demonstrate semantic traceability. It does
not describe a real organization or authorization policy.
