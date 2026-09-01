---
artifact: synthetic-order-reconciliation
representation: Diagram
source: code.mmd
render_status: source-level-reproducible
version: 1.0.0
owner: refoldec-maintainers
status: fixture
applicable_context: public-safe synthetic demonstration
---

# Diagram representation

The diagram is the visual fold of [`code.mmd`](./code.mmd). The Mermaid source
is included below so a reviewer can render it with a compatible Mermaid
renderer. This repository does not claim that a renderer or visual parser ran;
the proof uses the source-level diagram anchors and records that limitation.

```mermaid
flowchart TD
  requester[Requester] -->|performs| submit[Submit order change]
  submit -->|flows-to| validate{Change fulfillable?}
  validate -->|available| fulfill[Fulfill change]
  validate -->|unavailable| request-info[Request information]
  fulfill -->|flows-to| record[(Record outcome)]
  record -->|flows-to| audit[/Audit outcome/]
  request-info -->|flows-to| submit
  class requester actor
  class submit step
  class validate decision
  class fulfill system
  class request-info handoff
  class record data
  class audit log
```

## Semantic and governance trace

| Node ID | Semantic role | Directed relationships |
|---|---|---|
| `requester` | `actor` | `performs → submit` |
| `submit` | `step` | `flows-to → validate` |
| `validate` | `decision` | `available → fulfill`; `unavailable → request-info` |
| `fulfill` | `system` | `flows-to → record` |
| `request-info` | `handoff` | `flows-to → submit` |
| `record` | `data` | `flows-to → audit` |
| `audit` | `log` | terminal |

The two branches are `available` (`validate → fulfill`, “the requested change
can be fulfilled”) and `needs-information` (`validate → request-info`, “the
requested change cannot yet be fulfilled”). The governance tags are
`artifact_version: 1.0.0`, `owner: refoldec-maintainers`, `status: fixture`, and
`applicable_context: public-safe synthetic demonstration`.
Coordinates, colors, shape rendering details, and renderer chrome are
allowed-to-vary properties and are excluded from comparison.