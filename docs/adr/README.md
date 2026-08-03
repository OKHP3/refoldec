# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the ReFolDec framework.

ADRs capture why significant decisions were made — context, options considered, the decision taken, and its consequences. They are never deleted; superseded records are marked **Deprecated** and a new record explains the change.

---

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [0001](0001-refoldec-as-framework-name.md) | ReFolDec as the public framework name | Accepted | 2026-06-20 |
| [0002](0002-semantic-class-registry-design.md) | Semantic class registry — token-variable contract | Accepted | 2026-06-20 |
| [0003](0003-skills-under-agents-skills.md) | Process Skills located under `.agents/skills/` | Accepted | 2026-07-01 |
| [0004](0004-no-runtime-in-repo.md) | No codec runtime or fold orchestrator in this repository | Accepted | 2026-06-20 |

---

## Creating a new ADR

1. Copy the next sequential number.
2. Create `NNNN-short-title.md` in this directory.
3. Fill in Status, Context, Decision, and Consequences.
4. Add a row to the index table above.

## ADR status values

- **Proposed** — under discussion
- **Accepted** — decided and in effect
- **Deprecated** — no longer relevant; see the superseding ADR
- **Rejected** — considered but not adopted
