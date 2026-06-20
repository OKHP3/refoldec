# Glossary

Canonical term definitions for the ReFolDec framework and the OKHP³ Visual Language Stack.

Terms are listed alphabetically within sections. Where a term has a short form and a long form, both are listed.

---

## Framework terms

### ReFolDec
**Full form:** Recursively Folding Codec

The public framework name for the OKHP³ recursive transformation system. ReFolDec is not a tool or a product — it is the meta-theory and transformation grammar that governs how ideas move between representations without losing semantic continuity.

Supersedes `Capture FoundRy` as the public framework name. (Capture FoundRy remains a useful descriptive metaphor for the implementation.)

---

### xMIE
The combined operating physics of ReFolDec. xMIE is the system — the union of xME (Maturation) and xIE (Inversion). Any artifact in the ReFolDec system is always at some position on the xMIE continuum.

---

### xME — Maturation (Fold ↓)
The folding direction. xME takes raw, ephemeral, or loosely structured material and folds it into stable, structured, referenced artifacts.

**Operations:** Expansion, synthesis, structuring, editorial pass.  
**Movement:** Raw idea → text → structure → diagram → code → documentation → agent instruction → reusable artifact.

---

### xIE — Inversion (Unfold ↑)
The unfolding direction. xIE takes a mature artifact and unfolds it back into its constituent primitives, patterns, and reusable instructions.

**Operations:** Decomposition, primitive extraction, abstraction, packaging.  
**Movement:** Reusable artifact → agent instruction → documentation → code → diagram → structure → text → idea.

---

### Fold
The act of moving an artifact toward greater structure, durability, and addressability. Synonymous with xME / Maturation direction.

---

### Unfold
The act of moving an artifact toward its source primitives, patterns, and executable instructions. Synonymous with xIE / Inversion direction.

---

### Semantic continuity
The property that the core meaning of an artifact is preserved across every transformation. A process described in prose, in a diagram, and in a `SKILL.md` file describes the same process, makes the same logical commitments, and can be traced back to its source without loss of meaning.

A transformation that destroys semantic continuity is a defective fold.

---

### Canon
The durable, versioned, authoritative form of an artifact. In ReFolDec, GitHub holds the canon. The `main` branch of a repo is source of truth for that component's canon.

---

### Living artifact
An artifact that has not yet reached durable canon form — it is still being shaped, updated, or matured. Notion pages are the primary store for living artifacts.

---

### Primitive
An atomic, reusable unit extracted from a mature artifact during xIE (Inversion). Primitives are the building blocks of new skills, templates, and patterns.

---

### Reusable artifact
An artifact that has been packaged, versioned, and made reproducible for use by agents or humans beyond its original context. Process Skills / `SKILL.md` files are the primary form.

---

## Planes

### Capture plane
The entry layer where raw, ephemeral material enters the ReFolDec system. Notion, transcripts, Markdown drafts, and meeting notes are the primary capture surfaces.

### Structuring plane
The layer where raw input becomes addressable. Schema, page properties, frontmatter, and ledgers are applied. A structuring pass does not yet mature the artifact — it makes it findable and linkable.

### Maturation plane
The layer where structured input becomes a durable artifact through xME operations: expansion, synthesis, and editorial pass.

### Inversion plane
The layer where mature artifacts are decomposed through xIE operations: decomposition, primitive extraction, abstraction, and packaging.

### Executable plane
The layer where primitives and extracted patterns become actionable by agents or humans. Agent Skills, SOPs, prompt templates, and runbooks live here.

### Visual plane
The layer where process relationships become navigable as diagrams. Mermaid diagrams, BPMN-for-Mermaid notation, and Mermaid Theme Builder governance profiles operate here.

### Version/Publish plane
The layer where canon is stored, versioned, and made public. GitHub repos and OverKill Hill are the primary surfaces.

---

## Project terms

### Process Skills (Agent Skills)
Executable process-capture contracts packaged as `SKILL.md` files. Each skill defines: a trigger, compatible agent surfaces, steps, inputs, outputs, and notes. Process Skills are the bridge between the Inversion plane and the Executable plane.

See [`skills/README.md`](../skills/README.md) for the schema.

---

### BPMN-for-Mermaid
The process-structure and notation component of the ReFolDec Visual plane. Extends Mermaid's native diagram types with BPMN-aware notation — swim lanes, gateways, events, task nodes — in a Markdown-native DSL.

BPMN-for-Mermaid governs *what* a diagram depicts (structure, relationships, flow). It does not govern *how* a diagram looks (styling, color, renderer settings — those are Mermaid Theme Builder's concern).

---

### Mermaid Theme Builder
The visual governance component of the ReFolDec Visual plane. Defines and manages renderer profiles, palette systems, semantic class libraries, and diagram-output contracts.

Not the apex of the OKHP³ stack — a visual governance layer within the Visual plane.

---

### skillz
The executable agent-skill substrate for the OKHP³ stack. Packages ReFolDec-style transformations as named, invokable, agent-executable instruction sets. The external distribution and execution layer for Process Skills.

---

### PathScrib-R / Flowpilot Scribbler
Lineage artifacts. Earlier process-capture agent tools that proved the value of conversational extraction → structured narrative. They are the acknowledged ancestors of ReFolDec's Capture and Structuring planes. Not current active tools.

---

### OverKill Hill
The public narrative, portfolio, and proof surface for the OKHP³ stack. Operates at the Version/Publish plane. Public URL: [overkillhill.com](https://overkillhill.com).

---

## Visual governance terms

The following terms describe patterns abstracted from enterprise-scale diagram governance work. They use generic language only — no employer-specific names, colors, or internal systems.

### Renderer profile
A defined set of Mermaid renderer settings that govern how diagrams are styled and rendered in a given context. A renderer profile is applied to ensure consistent output across diagram types and rendering environments.

### Brand palette profile
A color system mapped to semantic roles within a diagram ecosystem. Palette profiles ensure that colors carry consistent meaning (e.g., the same color always indicates a decision node, an error path, or a human actor) across all diagrams in a library.

### Semantic class library
A named set of style classes with consistent meaning across a diagram library. For example, a class named `critical-path` might define the visual treatment for all nodes on the critical execution path of a process.

### Diagram-output contract
A defined set of rules ensuring that a diagram renders consistently across different versions, renderers, and environments. A style-preserving update follows the contract — changes are made without breaking the established visual output.

### Style-preserving update
An update to a diagram or its governing profile that maintains the diagram-output contract. Visual output is not destabilized by content changes.

### Syntax repair mode
A mode in which a diagram tool corrects invalid or deprecated syntax to conform to the current renderer spec, without altering the diagram's meaning or visual output contract.

---

## Further reading

- [`ARCHITECTURE.md`](../ARCHITECTURE.md) — Planes, mechanics, and component roles
- [`docs/concepts/core-loop.md`](./concepts/core-loop.md) — The recursive transformation grammar
- [`docs/okhp3-visual-language-stack.md`](./okhp3-visual-language-stack.md) — Ecosystem map
- [`docs/case-studies/mermaid-visual-language-stack.md`](./case-studies/mermaid-visual-language-stack.md) — Case study
