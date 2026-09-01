---
name: Evaluation holdout semantics
description: Durable distinction between public evaluation designs and genuinely protected release holdouts.
---

Checked-in evaluation cases are public development designs because implementers can read them. A genuine release holdout must remain outside the optimizing context and be recorded as external-required/not-run until an isolated executor supplies evidence.

**Why:** A packaged case cannot be both visible in the repository and an unseen release holdout; conflating those states overstates evaluation evidence.

**How to apply:** Keep public exposure explicit in evaluation metadata and reports, preserve the no-live-quality-claim boundary, and do not add packaged holdout cases merely to make partition counts look complete.