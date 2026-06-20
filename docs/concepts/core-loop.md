# The ReFolDec Core Loop

## The recursive transformation grammar

ReFolDec is built on a single, recursive insight: **any idea can be folded into a more structured form, and any structured artifact can be unfolded back into its source primitives — without losing semantic continuity.**

This is the core loop.

---

## The eight-stage loop

```
idea
  ⇄ text
    ⇄ structure
      ⇄ diagram
        ⇄ code
          ⇄ documentation
            ⇄ agent instruction
              ⇄ reusable artifact
                ⇄ idea  (loop closes — or opens a new fold)
```

Each stage is a valid entry point. Each stage can move in either direction. The loop is not a pipeline — it is a grammar.

---

## The two directions

### Folding (xME — Maturation)

Folding moves an artifact **toward greater structure, durability, and addressability**.

At each stage, folding means:

| From | Fold toward | What happens |
|---|---|---|
| Raw idea | Text | Thought is captured as prose — imprecise but present |
| Text | Structure | Prose is given schema: headers, properties, frontmatter, lists |
| Structure | Diagram | Relationships become visual — flows, nodes, connections |
| Diagram | Code | Visual logic becomes machine-readable — Mermaid DSL, BPMN notation |
| Code | Documentation | Code is given narrative context — explanations, usage guides, references |
| Documentation | Agent instruction | Narrative becomes executable — steps, triggers, conditions, outputs |
| Agent instruction | Reusable artifact | The instruction is packaged, versioned, and made reproducible |

### Unfolding (xIE — Inversion)

Unfolding moves an artifact **toward its constituent primitives, patterns, and reusable components**.

At each stage, unfolding means:

| From | Unfold toward | What happens |
|---|---|---|
| Reusable artifact | Agent instruction | The package is opened — its steps and conditions extracted |
| Agent instruction | Documentation | Instructions become explanatory prose — rationale and context surface |
| Documentation | Code | Narrative is reduced to its executable logic |
| Code | Diagram | Logic becomes a visual map — flow, branching, relationships |
| Diagram | Structure | Visual relationships become addressable schema |
| Structure | Text | Schema becomes readable prose again |
| Text | Idea | Prose is distilled to its core insight or primitive concept |

---

## Why the loop is recursive, not linear

A linear pipeline has a start and an end. The ReFolDec loop has **neither**.

- Any stage can be the entry point. A process captured as a diagram never passed through prose first. A skill extracted from a codebase never had a structured note. The loop meets artifacts where they are.
- Any stage can be the exit point. Not every fold completes all eight stages. A structured note that becomes a diagram and stops there is a valid, partial fold.
- The loop closes but does not terminate. When a reusable artifact re-enters the capture plane — because a process changed, because context was updated, because a new use case emerged — a new fold begins. The artifact becomes raw material again.
- Transformations preserve semantic content. Moving a process from prose to diagram to agent instruction does not destroy meaning — it translates it. A skilled reader can trace the idea through every form it has taken.

---

## What "semantic continuity" means

Semantic continuity is the property that makes recursion safe: **the core meaning of an artifact is preserved across every transformation**.

This does not mean the artifact looks the same in every form. A process diagram and its `SKILL.md` equivalent look nothing alike. But they describe the same process, make the same logical commitments, and can be refolded into each other without loss of meaning.

When semantic continuity breaks — when a transformation loses information, introduces ambiguity, or produces an artifact that cannot be traced back to its source — the fold is defective.

---

## Entry points

Different work starts at different stages of the loop. Here are the most common entry points:

| Entry point | Trigger | Direction |
|---|---|---|
| **Raw idea** | A conversation, observation, or mental model needs to be captured | Fold ↓ |
| **Existing document** | A mature doc needs to be made executable or decomposed | Unfold ↑ |
| **Diagram** | A visual process needs to be turned into a skill or runbook | Unfold ↑ |
| **Agent instruction** | A skill needs to be explained or documented for human readers | Unfold ↑ |
| **Reusable artifact** | A packaged skill needs to be updated or revised | Unfold ↑, then re-Fold ↓ |
| **Broken structure** | An artifact has lost coherence and needs to be refolded from a more primitive stage | Unfold ↑, then re-Fold ↓ |

---

## The loop in the OKHP³ stack

Each project in the OKHP³ Visual Language Stack operates at one or more specific stages of this loop:

| Project | Stages governed |
|---|---|
| **BPMN-for-Mermaid** | Structure ⇄ Diagram |
| **Mermaid Theme Builder** | Diagram (visual governance — renderer profiles, style contracts) |
| **skillz** | Agent instruction ⇄ Reusable artifact |
| **Process Skills (ReFolDec)** | Documentation ⇄ Agent instruction |
| **OverKill Hill** | Reusable artifact → public surface |

---

## Further reading

- [`ARCHITECTURE.md`](../../ARCHITECTURE.md) — Planes, mechanics, and component roles
- [`docs/okhp3-visual-language-stack.md`](../okhp3-visual-language-stack.md) — Ecosystem map
- [`docs/case-studies/mermaid-visual-language-stack.md`](../case-studies/mermaid-visual-language-stack.md) — Concrete walkthrough of the loop in action
