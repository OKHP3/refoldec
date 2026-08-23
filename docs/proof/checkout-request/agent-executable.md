---
artifact: synthetic-access-request
representation: Agent-Executable
version: 1.0.0
owner: refoldec-maintainers
status: fixture
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

## Output

Return either `recorded` or `returned-for-correction`. Preserve the artifact
version, owner, and status tags from the source fixture.
