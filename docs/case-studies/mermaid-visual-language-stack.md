# Case Study: The Mermaid Visual Language Stack

## A process idea moving through the full ReFolDec loop

This case study traces a single process idea from raw thought to reusable artifact, moving through every active layer of the OKHP³ Visual Language Stack. Each stage is mapped to a ReFolDec plane and direction.

This is a representative example — not a record of one specific event. It describes the pattern that any process-capture workflow follows when the full stack is in use.

---

## The scenario

**Starting point:** Someone notices a repeated, error-prone process — the kind that happens often enough to be worth capturing, varied enough that people keep doing it differently, and consequential enough that consistency matters.

The process is not yet named. It exists only as a shared understanding between a few people, expressed in conversations, improvised each time it runs.

The goal: fold this into a structured, visual, executable, and reusable artifact. Then verify it can be unfolded back.

---

## The fold: idea → reusable artifact

### Stage 1 — Raw idea (Capture plane)

**Direction:** Fold ↓ begins  
**ReFolDec plane:** Capture

The process is captured in its rawest available form: a conversation transcript, a rough bullet list, a voice note, a Notion page with unordered thoughts. No schema is applied yet. No structure is imposed. The goal at this stage is **fidelity over form** — get the idea into the system before it dissolves.

**Output:** An unstructured Notion page, a transcript, or a rough Markdown note.

---

### Stage 2 — Process capture agent (Capture plane — lineage note)

**Direction:** Fold ↓ continues  
**ReFolDec plane:** Capture  
**Note:** This stage reflects the PathScrib-R / Flowpilot Scribbler lineage.

In earlier iterations of this pattern, a process-capture agent was invoked to extract structure from the raw capture — asking clarifying questions, identifying steps, naming actors and decision points, and assembling a first-draft process narrative. This agent-assisted structuring step is the ancestor of what ReFolDec now calls the Structuring plane.

PathScrib-R and Flowpilot Scribbler were the experimental tools that proved this step's value. They are not current active tools, but the pattern they established — conversational extraction → structured narrative — is preserved in ReFolDec's Capture and Structuring planes.

**Output (historical):** A conversationally-extracted first-draft process narrative.

---

### Stage 3 — Process narrative (Structuring plane)

**Direction:** Fold ↓ continues  
**ReFolDec plane:** Structuring

The raw capture is given structure. A Markdown document is produced with:
- A named process
- Identified actors or roles
- Sequential or branching steps
- Decision points and conditions
- Defined inputs and outputs

Frontmatter is applied: title, version, status, related artifacts. The process object is now addressable — it can be referenced, linked, tracked, and versioned.

**Output:** A structured process narrative in Markdown, stored in Notion and/or GitHub.

---

### Stage 4 — BPMN for Mermaid notation (Visual plane — notation)

**Direction:** Fold ↓ continues  
**ReFolDec plane:** Visual

The structured narrative is translated into a BPMN-for-Mermaid diagram. Process steps become nodes. Decisions become gateways. Roles become swim lanes. Flows become directed edges. The process structure becomes navigable as a visual artifact.

BPMN for Mermaid handles the notation layer — the *structure* of the diagram: which elements exist, how they connect, what they represent. The diagram is written in a Markdown-native DSL that can live inside any Markdown document without leaving the plain-text ecosystem.

**Output:** A BPMN-for-Mermaid diagram block embedded in a Markdown document.

---

### Stage 5 — Rendered Mermaid diagram (Visual plane — output)

**Direction:** Fold ↓ continues  
**ReFolDec plane:** Visual

The diagram block is rendered. The Mermaid renderer interprets the notation and produces a visual graph. This is the human-navigable form of the process — the version that can be reviewed in a pull request, embedded in a doc, or included in a presentation without explaining code syntax.

**Output:** A rendered diagram visible in GitHub, Notion, or any Mermaid-compatible renderer.

---

### Stage 6 — Mermaid Theme Builder governance profile (Visual plane — governance)

**Direction:** Fold ↓ continues  
**ReFolDec plane:** Visual

A visual governance profile is applied. Mermaid Theme Builder defines:
- A renderer profile: which Mermaid renderer settings govern this diagram context
- A palette: which colors map to which semantic roles (actor, decision, output, error path)
- A semantic class library: named style classes (e.g., `critical-path`, `async-step`, `human-decision`) applied consistently across diagrams
- A diagram-output contract: rules ensuring the diagram renders consistently across different environments and versions

This step separates *what the diagram means* (BPMN for Mermaid's concern) from *how it looks* (Mermaid Theme Builder's concern). Both concerns matter. Neither subsumes the other.

**Output:** A styled, governed diagram with a stable visual contract.

---

### Stage 7 — Markdown documentation (Maturation plane — xME output)

**Direction:** Fold ↓ continues  
**ReFolDec plane:** Maturation

The diagram and narrative are combined into a full documentation artifact. This includes:
- The process narrative (Stage 3)
- The rendered diagram (Stages 4–6)
- Usage notes, edge cases, and rationale
- Version history and ownership metadata

This is the mature, durable, human-readable form of the process. It can be shared with anyone who needs to understand the process without needing to execute it.

**Output:** A complete Markdown documentation file, versioned in GitHub.

---

### Stage 8 — SKILL.md execution package (Executable plane — xIE output)

**Direction:** Fold ↓ reaches Executable; Unfold ↑ begins  
**ReFolDec plane:** Executable

The mature documentation is inverted (xIE) into an executable package. A `SKILL.md` file is produced that contains:
- Trigger conditions: when to invoke this skill
- Compatible agent surfaces: which agents or humans can execute it
- Steps: the process in sequential, unambiguous, executable form
- Inputs: what must be provided before the skill runs
- Outputs: what the skill produces
- Notes: edge cases, failure modes, escalation paths

This is no longer a human-narrative document. It is an instruction set for an agent. The skillz substrate can pick this up and make it invokable by name.

**Output:** A `SKILL.md` file in the `skills/` directory, ready for packaging.

---

### Stage 9 — Refolded artifact (Capture or Maturation plane — loop closes)

**Direction:** Loop closes; a new fold may open  
**ReFolDec plane:** Capture or Maturation

The packaged skill is the artifact. It is versioned, linked to its documentation, traceable to its source narrative and diagram, and executable by an agent.

When the process changes — new actors, new decision points, new failure modes — the artifact re-enters the loop. The `SKILL.md` is unfolded back into its narrative form, updated, and refolded into a new version. The diagram is revised. The governance profile is checked. The loop runs again.

The artifact is never final. It is always somewhere on the fold/unfold continuum.

**Output:** A versioned, traceable, executable artifact — ready for reuse, and ready to be refolded when the process evolves.

---

## What this case study demonstrates

| ReFolDec property | Where it appears |
|---|---|
| **Capture fidelity over speed** | Stage 1 — raw capture before schema |
| **Semantic continuity** | The process is recognizable in every form, from prose to diagram to `SKILL.md` |
| **Bidirectional traceability** | Every artifact links up (to source narrative) and down (to executable primitives) |
| **One job per component** | BPMN for Mermaid handles notation; Mermaid Theme Builder handles governance; skillz handles execution — none overlaps |
| **The loop closes** | Stage 9 — the artifact re-enters the system when the process changes |
| **Lineage is preserved** | Stage 2 — PathScrib-R is acknowledged as the ancestor of the capture pattern, not erased |

---

## Further reading

- [`docs/concepts/core-loop.md`](../concepts/core-loop.md) — The full recursive transformation grammar
- [`docs/okhp3-visual-language-stack.md`](../okhp3-visual-language-stack.md) — Ecosystem map and project roles
- [`docs/glossary.md`](../glossary.md) — Term definitions
- [`ARCHITECTURE.md`](../../ARCHITECTURE.md) — Planes, mechanics, and source-of-truth rules
