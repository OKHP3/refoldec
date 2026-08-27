---
artifact: synthetic-access-request
representation: Agent-Executable
version: 1.0.0
owner: refoldec-maintainers
status: fixture
applicable_context: public-safe synthetic demonstration
trigger: A synthetic access request needs to be checked.
---

# Execute: synthetic access request

1. Receive the request from `requester`.
2. Perform `submit`.
3. At `review`, check whether the request is complete.
4. If complete, perform `approve`, then perform `record`.
5. If incomplete, perform `return` and repeat `submit`.
6. If the process cannot determine completeness, stop and escalate rather than
   inventing a decision.

## Semantic trace

| Step/node ID | Semantic role | Action or relationship |
|---|---|---|
| `requester` | `actor` | provides the request to `submit` |
| `submit` | `step` | submits the access request to `review` |
| `review` | `decision` | branches to `approve` or `return` |
| `approve` | `approval` | approves the complete request for `record` |
| `return` | `handoff` | sends an incomplete request back to `submit` |
| `record` | `data` | records the decision |

The `complete` branch is `review → approve` when “request is complete”. The
`incomplete` branch is `review → return` when “request is incomplete”. These
relationships, IDs, and roles are invariant even though the executable form
uses ordered prose.

## Governance trace

Preserve `artifact_version: 1.0.0`, `owner: refoldec-maintainers`, `status:
fixture`, and `applicable_context: public-safe synthetic demonstration` when
this instruction is copied or executed.

## Output

Return either `recorded` or `returned-for-correction`. Preserve the artifact
version, owner, and status tags from the source fixture.
