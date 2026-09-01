---
artifact: synthetic-order-reconciliation
representation: source-capture
version: 1.0.0
owner: refoldec-maintainers
status: fixture
applicable_context: public-safe synthetic demonstration
---

# Raw synthetic capture

Someone needs a repeatable way to handle an order change. The requester sends
the change. A system checks whether it can be fulfilled. If it can, the system
fulfills the change, records the outcome, and writes an audit entry. If it
cannot, someone requests more information and the requester submits the change
again. If the status cannot be determined, stop and escalate rather than
guessing.

This deliberately generic capture contains no real organization, policy,
person, system, order, or confidential data. It is the source material folded
into the Documentation representation for the second proof fixture.