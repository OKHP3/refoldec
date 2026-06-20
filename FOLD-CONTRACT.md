# FOLD-CONTRACT.md — The ReFolDec Codec Contract

> **This is the authoritative definition of the ReFolDec codec.**
> All organs conform to the representations, fold directions, and lossless criteria defined here.

---

## The thesis

A diagram, its underlying code, its documentation, and its agent-executable form are the **same meaning held in different folds**. Meaning can move between those forms without loss, recursively.

This document defines that claim formally: what the representations are, what legal folds exist between them, what lossless means, and when a round-trip guarantee holds.

---

## 1. Canonical representations

There are exactly four canonical representations. No organ may introduce a fifth without a formal revision to this contract.

---

### Representation 1 — Diagram

**Short name:** `Diagram`

**Definition:** The rendered visual form of a process or system. What a human sees in a browser, document, or presentation.

**Authoritative for:**
- Spatial layout and visual communication
- The human-navigable surface of process structure
- What a diagram looks like in a given rendering context

**Not authoritative for:**
- Source structure or node identity (those are Code's concern)
- Intent or rationale (those are Documentation's concern)
- Execution logic (that is Agent-Executable's concern)

**Canonical formats:** Mermaid rendered output, BPMN-for-Mermaid rendered output, any renderer-produced visual.

---

### Representation 2 — Code

**Short name:** `Code`

**Definition:** The machine-readable source form. The DSL, syntax, or notation that a renderer or parser interprets.

**Authoritative for:**
- Process structure — what nodes exist, how they connect
- Node identity — the canonical identifiers of each element
- Edge topology — the directed relationships between nodes
- Semantic class assignments — which role class is applied to each node

**Not authoritative for:**
- Visual output (that is Diagram's concern, governed by mermaid-theme-builder)
- Human-readable rationale (that is Documentation's concern)
- Execution steps (that is Agent-Executable's concern)

**Canonical formats:** Mermaid DSL (`.md` blocks, `.mmd` files), bpmn-beta notation.

---

### Representation 3 — Documentation

**Short name:** `Documentation`

**Definition:** The prose narrative form. Human-readable descriptions of a process, system, or transformation.

**Authoritative for:**
- Intent and rationale — why a process works the way it does
- Context — the conditions, actors, and environment around a process
- Human comprehension — the explanation a person needs to understand or review a process

**Not authoritative for:**
- Source structure (that is Code's concern)
- Visual presentation (that is Diagram's concern)
- Step-by-step execution (that is Agent-Executable's concern)

**Canonical formats:** Markdown (`.md`), structured prose with frontmatter, process narratives.

---

### Representation 4 — Agent-Executable

**Short name:** `Agent-Executable`

**Definition:** The instruction form. A structured set of steps, trigger conditions, and outputs that an agent (human or AI) can execute directly.

**Authoritative for:**
- Step sequence — the ordered, unambiguous steps of a process
- Trigger conditions — when to invoke this process
- Inputs and outputs — what is required and what is produced
- Failure paths and escalation conditions

**Not authoritative for:**
- Visual presentation (that is Diagram's concern)
- Source structure (that is Code's concern)
- Rationale (that is Documentation's concern)

**Canonical formats:** `SKILL.md`, runbooks, structured prompt templates, SOPs.

---

## 2. Legal folds

A **fold** is a directed transformation from one canonical representation to another that preserves all invariants (see Section 3).

All folds are reversible. The reverse of a fold is an unfold in the opposite direction.

### Fold table

| Fold | Direction | Reversible | What moves |
|---|---|---|---|
| `Documentation → Code` | Fold ↓ | Yes (`Code → Documentation`) | Prose steps and relationships become DSL nodes and edges |
| `Code → Documentation` | Unfold ↑ | Yes | DSL structure is narrated as readable prose |
| `Code → Diagram` | Fold ↓ | Yes (`Diagram → Code`) | Source syntax is rendered to visual output |
| `Diagram → Code` | Unfold ↑ | Yes | Visual structure is reconstructed as source |
| `Code → Agent-Executable` | Fold ↓ | Yes (`Agent-Executable → Code`) | DSL steps become SKILL.md instructions |
| `Agent-Executable → Code` | Unfold ↑ | Yes | SKILL.md steps are extracted back to DSL form |
| `Documentation → Agent-Executable` | Fold ↓ | Yes (`Agent-Executable → Documentation`) | Prose narrative becomes executable instructions |
| `Agent-Executable → Documentation` | Unfold ↑ | Yes | Instructions are explained as prose rationale |
| `Documentation → Diagram` | Fold ↓ | Yes (`Diagram → Documentation`) | Prose is translated into a visual structure |
| `Diagram → Documentation` | Unfold ↑ | Yes | Visual structure is narrated as prose |

### Deferred folds

The following folds are **not yet defined** in this contract. They would skip an intermediate representation and require both relevant organs to agree on the intermediate form before the fold is legal.

| Deferred fold | Reason deferred |
|---|---|
| `Diagram → Agent-Executable` | Skips Code; intermediate representation not yet contracted |
| `Agent-Executable → Diagram` | Skips Code; intermediate representation not yet contracted |

An organ may not implement a deferred fold unilaterally. Propose a contract revision.

---

## 3. Lossless criteria

A fold is **lossless** when all invariants are preserved across the transformation.

### Invariants — must be preserved across every fold

| Invariant | Definition |
|---|---|
| **Semantic role assignment** | Every node's class (`actor`, `decision`, `ai`, etc.) is identical in every representation. A node that is `actor` in Code is `actor` in Documentation and `actor` in Agent-Executable. |
| **Node identity** | Node identifiers or canonical names are traceable across representations. A node named `ReviewRequest` in Code is identifiable as the same node in Documentation and Agent-Executable. |
| **Edge topology** | The set of directed relationships between nodes is preserved. An edge present in Code is present (explicitly or implicitly) in all other representations. |
| **Flow relationships** | Sequence, branching, and merge logic is preserved. A decision branch that leads to two outcomes in Code leads to the same two outcomes in Documentation and Agent-Executable. |
| **Governance tags** | Explicit metadata — version, owner, status, applicable-context markers — survives every fold. |

### Allowed to vary across folds

These properties are **not invariants**. Their variation does not make a fold lossy.

- Layout coordinates and spatial positioning
- Color binding and palette application
- Presentation chrome — borders, shadows, background fills
- Prose style and sentence structure
- Markdown formatting choices (heading level, table vs. list)
- Rendering engine-specific visual output details

### Must never vary

These are the hardened invariants — if they change, the fold is defective.

- **The meaning of a node** — what it represents and what semantic role it holds
- **Role assignment** — if a node is `actor` in one representation, it is `actor` in all representations
- **Edge topology** — if a directed edge exists in one representation, it exists in all representations
- **Semantic class assignment** — class labels from the semantic-class registry do not change across folds

---

## 4. Round-trip guarantee

A fold sequence is **round-trippable** when the following condition holds:

> Starting from Representation A, fold to Representation B, then unfold back to A′. The result A′ is **semantically equivalent** to A: all invariants listed in Section 3 are identical, even if cosmetic properties differ.

### Formal statement

A fold `A → B` satisfies the round-trip guarantee when:
1. All invariants (semantic roles, node identity, edge topology, flow relationships, governance tags) are present in B.
2. An unfold `B → A′` can reconstruct A′ such that A′ is semantically equivalent to A.
3. A′ may differ from A in allowed-to-vary properties (layout, color, prose style) without violating the guarantee.

### When the round-trip guarantee does not hold

The round-trip guarantee is **broken** when:
- A fold loses an invariant (e.g., a semantic role is not preserved in the output).
- A fold introduces ambiguity that prevents the inverse fold from reconstructing a semantically equivalent form.
- A deferred fold is implemented without contracting the intermediate representation.

A broken round-trip is a **defective fold**. It must be corrected before the fold is considered lossless.

### Programmatic testing

A future validator may test round-trip compliance by:
1. Parsing the invariants of Representation A.
2. Executing the fold to produce Representation B.
3. Executing the inverse fold to produce A′.
4. Asserting that all invariants extracted from A are present and identical in A′.

For this pass, the prose definition above is the operative specification. The test implementation is deferred to the codec runtime.

---

## 5. Fold vocabulary

These terms are used consistently throughout the ecosystem. Do not redefine them in organ documentation.

| Term | Definition |
|---|---|
| **Fold** | A transformation from one canonical representation to another that preserves all invariants. Synonymous with xME (Maturation) direction. |
| **Unfold** | The inverse of a fold. Moving from a structured representation back toward its source form. Synonymous with xIE (Inversion) direction. |
| **Lossless** | A fold that preserves all invariants defined in Section 3. |
| **Defective fold** | A fold that fails to preserve one or more invariants. |
| **Round-trip** | The sequence: fold A to B, then unfold B back to A′, where A′ is semantically equivalent to A. |
| **Invariant** | A property that must be identical across all representations of the same artifact. |
| **Allowed-to-vary** | A property that may differ across representations without violating losslessness. |
| **Semantic role** | A named class from the semantic-class registry that describes what a node means. |
| **Canonical representation** | One of the four defined forms: Diagram, Code, Documentation, Agent-Executable. |
