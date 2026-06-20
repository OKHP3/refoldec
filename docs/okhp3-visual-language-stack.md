# The OKHP³ Visual Language Stack

This document describes the ecosystem of OKHP³ projects that ReFolDec governs as a meta-theory.

---

## What it is

The **OKHP³ Visual Language Stack** is the set of related projects whose individual concerns — visual governance, process notation, executable agent skills, process capture, and public publishing — are unified and explained by ReFolDec theory.

ReFolDec is not one of these projects. It is the **keystone theory above them**: the recursive transformation grammar that names and governs how ideas move between planes, between representations, and between human-readable and machine-executable forms.

---

## The stack

```
ReFolDec
  The Recursively Folding Codec
  Meta-theory and recursive transformation grammar
  ─────────────────────────────────────────────────────────
  │
  ├── skillz
  │     Executable agent-skill substrate
  │     Executable plane
  │
  ├── Mermaid Theme Builder
  │     Visual governance: renderer profiles, palettes, semantic style contracts
  │     Visual plane
  │
  ├── BPMN-for-Mermaid
  │     Process-structure and Markdown-native notation
  │     Visual plane
  │
  ├── OverKill Hill
  │     Public narrative, portfolio, and proof surface
  │     Version/Publish plane
  │
  └── PathScrib-R / Flowpilot Scribbler
        Early process-capture agent lineage
        Capture plane (lineage — not current active layer)
```

---

## Project roles

### ReFolDec

**Plane:** All planes  
**Role:** Meta-theory and governing transformation grammar

ReFolDec defines the recursive fold/unfold loop that all other projects operate within. It names the mechanics (xME, xIE, xMIE), the planes (Capture → Structuring → Maturation → Inversion → Executable → Visual → Version/Publish), and the principle of semantic continuity across transformations.

ReFolDec does not replace or compete with the projects below. It explains them.

---

### skillz

**Plane:** Executable  
**Role:** Executable agent-skill substrate

skillz packages ReFolDec-like transformations as named, reusable, agent-executable instruction sets. Where ReFolDec describes *how* an artifact moves from one representation to another, skillz *operationalizes* that movement as a skill a human or AI agent can invoke by name.

skillz is the external substrate for distributing Process Skills beyond the ReFolDec repo. A `SKILL.md` file inside ReFolDec defines the spec; a skillz package makes it runnable at scale.

**Relationship to ReFolDec:** skillz implements the Executable plane. It is the delivery layer for xIE outputs.

---

### Mermaid Theme Builder

**Plane:** Visual  
**Role:** Visual governance — renderer profiles, palette management, semantic styling contracts, diagram-output contracts

Mermaid Theme Builder governs the visual output layer of Mermaid diagrams. It defines renderer profiles (how a diagram is styled and rendered for a given context), palette management (color systems applied to diagram elements), semantic class libraries (named style classes with consistent meaning across diagrams), and style-preserving update contracts (rules for keeping visual output stable across changes).

The governance-profile pattern that Mermaid Theme Builder implements was proven in enterprise-scale diagram governance contexts — managing consistent visual output across large, version-controlled diagram libraries. That provenance informs the design without being exposed here.

**Relationship to ReFolDec:** Mermaid Theme Builder operates at the Visual plane. It is the style-governance component, not the notation component. It does not define process structure — it governs how process structures *look*.

---

### BPMN-for-Mermaid

**Plane:** Visual  
**Role:** Process-structure and Markdown-native notation

BPMN-for-Mermaid extends Mermaid's native diagram types with BPMN-aware notation, making it possible to represent linked process flows in plain Markdown documents. It handles the *structure* of process diagrams — swim lanes, events, gateways, task nodes, flows — not the visual styling of them.

**Relationship to ReFolDec:** BPMN-for-Mermaid is a component of ReFolDec's Visual plane. It provides the notation layer that Mermaid Theme Builder then governs visually. Neither replaces the other — they operate at different concerns within the same plane.

---

### OverKill Hill

**Plane:** Version/Publish  
**Role:** Public narrative, portfolio, and proof surface

OverKill Hill ([overkillhill.com](https://overkillhill.com)) is the public-facing surface for the OKHP³ stack. It routes visitors to the projects, explains the stack in narrative form, and provides proof-of-concept demonstrations.

**Relationship to ReFolDec:** OverKill Hill operates at the Version/Publish plane. It is where folded, matured artifacts are made navigable and human-accessible as a public portfolio.

---

### PathScrib-R / Flowpilot Scribbler

**Plane:** Capture (lineage)  
**Role:** Early process-capture agent ancestors

PathScrib-R and its Flowpilot Scribbler lineage were earlier approaches to process-capture agent design — the same capture-first concern that now lives more precisely in the Capture plane of ReFolDec. They are acknowledged as provenance, not as current active tools.

**Relationship to ReFolDec:** PathScrib-R is lineage. The patterns it explored — conversational capture, process narrative extraction, agent-assisted structuring — are formalized in ReFolDec's Capture and Structuring planes and in the Process Skills spec. The lineage is preserved as design history, not as a parallel system.

---

## What this stack is not

- It is not a product suite in the commercial SaaS sense.
- It is not a single application with plug-in components.
- It is not finished. Each project is at a different maturity level.
- Mermaid Theme Builder is not the apex of the stack. It governs one concern within one plane.
- BPMN-for-Mermaid is not an independent product. It is a notation component.
- skillz is not a replacement for ReFolDec. It is the executable delivery layer for one of ReFolDec's planes.

---

## Further reading

- [`ARCHITECTURE.md`](../ARCHITECTURE.md) — Full ReFolDec planes, mechanics, and source-of-truth rules
- [`docs/concepts/core-loop.md`](./concepts/core-loop.md) — The recursive transformation grammar
- [`docs/case-studies/mermaid-visual-language-stack.md`](./case-studies/mermaid-visual-language-stack.md) — Concrete walkthrough: idea → artifact through the full stack
- [`docs/glossary.md`](./glossary.md) — Canonical term definitions
