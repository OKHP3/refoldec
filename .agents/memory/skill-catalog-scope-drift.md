---
name: Skill catalog scope drift
description: How to scope a skill-library audit when a task's planned package count predates repository expansion.
---

Treat the current checked-in direct package inventory as the authoritative audit
scope. Preserve an older package count from a planning brief as historical
context rather than silently omitting newer packages or rewriting the brief.

**Why:** Skill-library work can continue while an earlier task waits in the
queue, so a fixed count in that task can become stale before execution.

**How to apply:** Regenerate the catalog first, report both the current count
and the historical planning count, classify adopted host or third-party
packages explicitly, and apply project-owned release gates to the current
project-owned set.