---
name: Benchmark hash boundaries
description: How to keep cross-file evaluation evidence hashes verifiable.
---

An aggregate benchmark may hash stable package inputs, while a synchronization record may hash the aggregate; do not hash the synchronization record back into the aggregate.

**Why:** Including both directions creates a circular dependency where changing either evidence file invalidates the other and prevents a stable verification record.

**How to apply:** Define explicit self/generated-file exclusions in the aggregate hash scope, then update the one-way synchronization hash after the aggregate is finalized.