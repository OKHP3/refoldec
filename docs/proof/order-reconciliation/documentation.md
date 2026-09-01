---
artifact: synthetic-order-reconciliation
representation: Documentation
version: 1.0.0
owner: refoldec-maintainers
status: fixture
applicable_context: public-safe synthetic demonstration
---

# Synthetic order reconciliation

The **Requester** submits an order change. A system checks whether the change
can be fulfilled. An available change proceeds to **Fulfill change**, then the
outcome is recorded and audited. An unavailable change goes to **Request
information**, after which the requester corrects and resubmits it. If the
status cannot be determined, the process stops and escalates rather than
inventing a result.

## Semantic trace

The names in backticks are canonical node IDs, not merely labels. The role
assignments are taken from the ReFolDec semantic-class registry.

| Node ID | Human label | Semantic role |
|---|---|---|
| `requester` | Requester | `actor` |
| `submit` | Submit order change | `step` |
| `validate` | Change fulfillable? | `decision` |
| `fulfill` | Fulfill change | `system` |
| `request-info` | Request information | `handoff` |
| `record` | Record outcome | `data` |
| `audit` | Audit outcome | `log` |

The directed relationships are `requester → submit` (`performs`),
`submit → validate` (`flows-to`), `validate → fulfill` (`available`),
`validate → request-info` (`unavailable`), `fulfill → record` (`flows-to`),
`record → audit` (`flows-to`), and `request-info → submit` (`flows-to`).
The `available` branch means “the requested change can be fulfilled”; the
`needs-information` branch means “the requested change cannot yet be
fulfilled”.

## Governance trace

This artifact carries `artifact_version: 1.0.0`, `owner:
refoldec-maintainers`, `status: fixture`, and `applicable_context: public-safe
synthetic demonstration`. These values are compared exactly in the proof
record.

This public-safe fixture exists to test a second graph shape. It does not
describe a real organization, order, policy, or fulfillment system.