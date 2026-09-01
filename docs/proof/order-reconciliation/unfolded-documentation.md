---
artifact: synthetic-order-reconciliation
representation: Documentation
direction: Code -> Documentation (unfold)
version: 1.0.0
owner: refoldec-maintainers
status: fixture
applicable_context: public-safe synthetic demonstration
---

# Synthetic order reconciliation — unfolded narrative

The `requester` actor performs `submit`, sending an order change to the
`validate` decision. When the requested change can be fulfilled, the
`validate` decision sends the `available` branch to the `fulfill` system node,
which flows to the `record` data node and then the `audit` log node. When the
requested change cannot yet be fulfilled, the `validate` decision sends the
`needs-information` branch to the `request-info` handoff, which flows back to
`submit`. If the status cannot be determined, the process stops and escalates.

The node roles are `requester: actor`, `submit: step`, `validate: decision`,
`fulfill: system`, `request-info: handoff`, `record: data`, and `audit: log`.
The governance tags are `artifact_version: 1.0.0`, `owner: refoldec-maintainers`,
`status: fixture`, and `applicable_context: public-safe synthetic
demonstration`.