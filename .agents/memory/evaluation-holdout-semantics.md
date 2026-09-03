---
name: Evaluation holdout semantics
description: Durable distinction between public evaluation designs and genuinely protected release holdouts.
---

Checked-in evaluation cases are public development designs because implementers can read them. A genuine release holdout must remain outside the optimizing context and be recorded as external-required/not-run until an isolated executor supplies evidence.

**Why:** A packaged case cannot be both visible in the repository and an unseen release holdout; conflating those states overstates evaluation evidence.

**How to apply:** Keep public exposure explicit in evaluation metadata and reports, preserve the no-live-quality-claim boundary, and do not add packaged holdout cases merely to make partition counts look complete.

For a runnable release handoff, snapshot the version-matched benchmark protocol and whitelist the evidence fields copied from external executor and grader inputs. Store fixture and response hashes rather than paths or contents, require separate executor/grader attestations, and make exposure records require a different replacement fixture.

**Why:** A handoff can be operationally ready without making the unseen fixture public; unrestricted JSON copying or role self-attestation could quietly defeat that boundary.

**How to apply:** Treat preparation as `not-run`, promote to `live` only after both settings-matched runs and blinded evidence exist, and retain four explicit evidence-boundary tiers in the final record.