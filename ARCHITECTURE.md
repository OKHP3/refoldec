# ReFolDec — Architecture

This document describes the full design of the ReFolDec framework: its planes, layers, mechanics, and component roles.

---

## Core thesis

MPS, BAC, xMIE/xIE, Agent Skills, BPMN-for-Mermaid, Notion capture, and GitHub canon are not disconnected projects. They are different implementations of the same operating concern:

> Capturing a living process, maturing it into durable form, inverting it into reusable primitives, and making it executable or navigable by humans, machines, or both.

This is the process of **process-capture**.

---

## The two mechanics

### xME — Maturation (Fold ↓)

The upward maturation mechanic. Takes raw, ephemeral, or loosely structured material and folds it into stable, structured, referenced artifacts.

**Input:** conversation, meeting notes, rough draft, mental model, transcript
**Output:** structured Notion page, Markdown doc, schema, ledger, versioned file

**Operations:**
- Expansion — add context, definitions, examples
- Synthesis — merge multiple threads into one coherent artifact
- Structuring — apply schema, frontmatter, properties
- Editorial pass — clean, sharpen, canonize

### xIE — Inversion (Unfold ↑)

The downward inversion/decomposition mechanic. Takes a mature artifact and unfolds it back into its constituent patterns, primitives, and reusable instructions.

**Input:** mature doc, runbook, narrative, process diagram
**Output:** Agent Skill, SOP fragment, prompt template, diagram node, schema primitive

**Operations:**
- Decomposition — break artifact into atomic steps
- Primitive extraction — identify repeatable patterns
- Abstraction — lift specific instances to general rules
- Packaging — wrap as Agent Skill, template, or schema

### xMIE — The Combined System

xMIE is the operating physics. Any artifact in the system is always somewhere on the fold/unfold continuum. ReFolDec governs movement in both directions.

---

## The planes

| Plane | System | Role |
|---|---|---|
| **Capture** | Notion, transcripts, Markdown, meeting notes | Where living process objects enter the system |
| **Structuring** | Schema, page properties, frontmatter, ledgers | Where raw input becomes addressable |
| **Maturation** | xME — expansion, synthesis, editorial | Where structured input becomes durable artifact |
| **Inversion** | xIE — decomposition, primitive extraction | Where mature artifacts become reusable primitives |
| **Executable** | Agent Skills, prompts, runbooks, SOPs | Where primitives become actionable by agents or humans |
| **Visual** | Mermaid, BPMN-for-Mermaid, linked diagrams | Where process relationships become navigable |
| **Version/Publish** | GitHub, OverKill Hill, static sites | Where canon is stored, versioned, and made public |

---

## The components

### Process Skills (Agent Skills)

**Role:** Executable process-capture contracts for agents.

Process Skills are the bridge between the Inversion plane and the Executable plane. When a mature artifact is inverted, its patterns and steps are packaged as Process Skills — structured instruction sets that agents (AI or human) can execute repeatably.

Each skill has:
- A `SKILL.md` spec file
- Optional supporting assets and scripts
- Trigger conditions
- Compatible agent surfaces

### BPMN-for-Mermaid

**Role:** Visual notation layer for linked process documentation.

BPMN-for-Mermaid extends Mermaid's native diagram types with BPMN-aware notation, making it possible to represent linked process flows in Markdown-native documentation. It is a component of ReFolDec, not an independent product.

### Notion (Capture Plane)

**Role:** Living capture plane and process object store.

Notion holds the ephemeral-to-structured transition. Pages are the primary unit. Properties and schemas govern addressability. Linked databases and backlinks govern relationships.

### GitHub (Canon Plane)

**Role:** Versioned canon, schema, artifact, and publishing plane.

GitHub holds the durable form of all artifacts. Markdown is the canonical format. Repos are organized by system component. The `main` branch of each repo is source of truth.

---

## The source-of-truth rule

| System | Governing role |
|---|---|
| **xMIE** | Governing abstraction |
| **ReFolDec** | Public framework name and operating framework |
| **Capture FoundRy** | Parent system / product framing metaphor |
| **MPS** | Narrative testbed and fictional proof |
| **BAC** | Nonfiction doctrine and editorial operating manual |
| **Process Skills** | Executable capture workflows |
| **BPMN-for-Mermaid** | Visual notation component |
| **Notion** | Capture plane |
| **GitHub** | Versioned canon and implementation plane |
| **OverKill Hill** | Public explanation and publishing surface |

---

## What each artifact is NOT collapsed into

The convergence is architectural, not organizational. Each artifact keeps its own job:

- **MPS** carries the wound and narrative bloodstream
- **BAC** carries the doctrine and method
- **xMIE** carries the abstraction
- **Process Skills** carry repeatable execution
- **BPMN-for-Mermaid** carries visual notation
- **Notion** carries living capture
- **GitHub** carries durable canon

Do not collapse all of this into one mega-project.

---

## Recursive origin chain

```
Unrelated curiosity threads
  ↓
through-lines emerge
  ↓
MPS becomes the narrative world
  ↓
BAC becomes the method/documentation layer
  ↓
PME/PIE and CME/CIE become xME/xIE
  ↓
xMIE becomes the general abstraction
  ↓
Agent Skills become executable process contracts
  ↓
BPMN-for-Mermaid becomes the visual index layer
  ↓
Notion + GitHub become the capture/version planes
  ↓
ReFolDec emerges as the named public framework
```

---

## Keeper sentence

BPMN-for-Mermaid began as a missing diagram type; MPS began as a narrative through-line; BAC began as an authoring method; xMIE began as a maturation metaphor. All four are now recognizable as expressions of the same system: the capture, maturation, inversion, visualization, and reuse of process.
