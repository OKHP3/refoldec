---
name: Inventory stability
description: Durable rule for repository-wide inventories that count files under generated or tested directories.
---

Repository inventories must exclude transient generated directories such as `__pycache__`, `node_modules`, and `.git`; otherwise running tests can change the reported resource counts without changing source evidence.

**Why:** A package-local Python test generated a bytecode cache inside a counted resource directory, making an otherwise deterministic inventory appear stale after validation.

**How to apply:** Keep traversal filters explicit and rerun the inventory after the full test suite, not only before it.