---
artifact: synthetic-access-request
representation: Documentation
direction: Code -> Documentation (unfold)
version: 1.0.0
owner: refoldec-maintainers
status: fixture
applicable_context: public-safe synthetic demonstration
---

# Synthetic access request — unfolded narrative

The `requester` actor performs `submit`, sending an access request to the
`review` decision. When the request is complete, the `review` decision sends
the `complete` branch to the `approve` approval step, which flows to the
`record` data node. When the request is incomplete, the `review` decision
sends the `incomplete` branch to the `return` handoff, which flows back to
`submit` for correction and resubmission. If completeness cannot be
determined, the process stops and escalates.

The node roles are `requester: actor`, `submit: step`, `review: decision`,
`approve: approval`, `return: handoff`, and `record: data`. The governance tags
are `artifact_version: 1.0.0`, `owner: refoldec-maintainers`, `status: fixture`,
and `applicable_context: public-safe synthetic demonstration`.