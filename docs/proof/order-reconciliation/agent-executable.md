---
artifact: synthetic-order-reconciliation
representation: Agent-Executable
version: 1.0.0
owner: refoldec-maintainers
status: fixture
applicable_context: public-safe synthetic demonstration
trigger: A synthetic order change needs to be reconciled.
---

# Execute: synthetic order reconciliation

1. Receive the order change from `requester`.
2. Perform `submit`.
3. At `validate`, check whether the requested change can be fulfilled.
4. If available, perform `fulfill`, then perform `record` and `audit`.
5. If unavailable, perform `request-info` and repeat `submit` after the
   requester provides the needed information.
6. If the status cannot be determined, stop and escalate rather than inventing
   a result.

## Semantic trace

| Step/node ID | Semantic role | Action or relationship |
|---|---|---|
| `requester` | `actor` | provides the change to `submit` |
| `submit` | `step` | submits the change to `validate` |
| `validate` | `decision` | branches to `fulfill` or `request-info` |
| `fulfill` | `system` | fulfills an available change for `record` |
| `request-info` | `handoff` | sends an unavailable change back to `submit` |
| `record` | `data` | records the fulfillment outcome for `audit` |
| `audit` | `log` | writes the audit entry |

The `available` branch is `validate → fulfill` when “the requested change can
be fulfilled”. The `needs-information` branch is `validate → request-info` when
“the requested change cannot yet be fulfilled”. These relationships, IDs, and
roles are invariant even though the executable form uses ordered prose.

## Governance trace

Preserve `artifact_version: 1.0.0`, `owner: refoldec-maintainers`, `status:
fixture`, and `applicable_context: public-safe synthetic demonstration` when
this instruction is copied or executed.

## Output

Return either `audited` or `awaiting-information`. Preserve the artifact
version, owner, and status tags from the source fixture.