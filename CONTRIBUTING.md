# Contributing to ReFolDec

ReFolDec is a framework in active development. Contributions, issues, and discussions are welcome.

---

## How to contribute

### Issues

Use GitHub Issues for:
- Bug reports (in tooling, schema, or Process Skills)
- Feature requests
- Questions or clarification requests
- Component feedback (BPMN-for-Mermaid, Process Skills, etc.)

### Pull Requests

1. Fork the repo
2. Create a branch: `feature/your-change-name` or `fix/issue-description`
3. Make your changes with clear, atomic commits
4. Open a PR with a description referencing the relevant issue or component
5. PRs are reviewed against the architecture principles in [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## What to contribute

| Area | What's welcome |
|---|---|
| **Process Skills** | New skill specs, improvements to existing specs |
| **BPMN-for-Mermaid** | Notation improvements, rendering fixes, new node types |
| **Schema** | Frontmatter improvements, property schema refinements |
| **Documentation** | Clarifications, examples, usage guides |
| **Architecture** | Architecture discussions via Issues before PRs |

---

## Principles

- **Capture fidelity over speed.** Artifacts should be precise and structured, not fast and loose.
- **Canon before convenience.** If something conflicts with the canonical stack described in `ARCHITECTURE.md`, the architecture wins unless you're proposing a formal revision.
- **One job per component.** Don't collapse components. Each has its own plane and role.
- **Bidirectional traceability.** Every artifact should be traceable both up (to its source material) and down (to its executable primitives).

---

## Code of conduct

Be direct. Be precise. Be kind. Argument from architecture, not from preference.
