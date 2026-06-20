# ECOSYSTEM.md — ReFolDec Head Canon

> **This is the authoritative context document for the OKHP³ ecosystem.**
> Every organ reads this file. Reference it by raw URL. Do not fork the definitions.

---

## The head-and-organs model

The OKHP³ ecosystem is organized as one body with a conceptual head and four organs. Each organ owns exactly one fold of the meaning-to-output continuum. The head owns the contracts all organs conform to.

```
ReFolDec (Head)
  The Recursively Folding Codec
  Owns: shared contracts, fold vocabulary, semantic-class registry, scope firewall
  ─────────────────────────────────────────────────────────────────────────────
  │
  ├── mermaid-theme-builder      (Organ — Presentation fold)
  │     How meaning looks when it unfolds to a rendered diagram.
  │     Color, renderer safety, semantic-role styling.
  │
  ├── bpmn-beta                  (Organ — Structural fold)
  │     The canonical code form for business-process meaning.
  │     DSL, notation, process graph structure.
  │
  ├── skillz                     (Organ — Automation fold)
  │     Packages folds as portable agent skills.
  │     SKILL.md format, execution contracts.
  │
  └── OverKill-Hill              (Organ — Narrative fold)
        The public storefront. Makes the body legible as one thing.
        overkillhill.com
```

---

## Ecosystem topology

| Role | Component | Fold owned | Description |
|---|---|---|---|
| **Head** | ReFolDec | All planes (contracts only) | Defines the codec, fold vocabulary, semantic classes, and scope firewall. Source of truth flows down from here. |
| **Organ** | mermaid-theme-builder | Presentation | Governs how diagram meaning is rendered visually — color, renderer profile, semantic-role styling, diagram-output contracts. |
| **Organ** | bpmn-beta | Structural | The canonical code form for process meaning — DSL, BPMN-aware notation, process graph structure. |
| **Organ** | skillz | Automation | Packages fold transformations as portable, named, agent-executable skills. |
| **Organ** | OverKill-Hill | Narrative | The public surface. Routes the ecosystem, provides proof, makes the body legible as a unified project. |

---

## What the head owns

ReFolDec owns the **shared contracts** that every organ conforms to:

1. **The fold vocabulary** — the canonical names and definitions of fold, unfold, representation, lossless, round-trip, and the xMIE mechanics. See `FOLD-CONTRACT.md`.

2. **The semantic-class registry** — the authoritative meaning axis. Every role (`actor`, `decision`, `ai`, etc.) is defined once here with its abstract palette token and shape convention. See `semantic-class-registry/`. Organs reference the registry; they do not redefine it.

3. **The scope firewall** — the shared policy governing what travels between OKHP³ components and what stays private. See `SCOPE-FIREWALL.md`.

4. **The conformance rules** — the behavioral contracts every organ must follow. See below.

---

## How organs relate to the head

An organ's job is to **apply** the fold it owns — not to define new fold vocabulary, redefine semantic roles, or modify the scope firewall.

Specifically:

- **mermaid-theme-builder** reads the semantic-class registry to know the canonical roles and abstract tokens. It binds those tokens to concrete palette values (color, weight, dash) for a given renderer context. It does not invent new roles or redefine existing tokens.

- **bpmn-beta** reads the semantic-class registry to apply role classes to diagram nodes. It uses the ReFolDec fold vocabulary when describing its transformation inputs and outputs. It does not define new fold directions.

- **skillz** reads the fold vocabulary to describe what its packaged skills transform. A SKILL.md produced by skillz describes a fold or unfold as defined in `FOLD-CONTRACT.md`. It does not invent new canonical representations.

- **OverKill-Hill** surfaces the ecosystem vocabulary in its public narrative. It uses the locked names verbatim (see below). It does not rebrand or rename components for marketing reasons.

---

## Conformance rules

These rules are authoritative for all components. They do not need to be re-explained in each organ — reference this file.

**Rule 1 — Do not redefine shared concepts.**
The semantic-class registry, the fold vocabulary, and the scope firewall are defined once, here in ReFolDec. Organs reference them. Do not fork the definition, restate it in a conflicting way, or let it drift.

**Rule 2 — Source of truth flows down from ReFolDec.**
Consumers vendor a synced copy of shared assets and add a parity check. If the head updates the registry, organs update their vendored copy. The head does not sync upward.

**Rule 3 — Honor the scope firewall.**
No third-party employer names in any public or shared asset. No employer-owned color values (hex) in any OKHP³ repo. Brand-agnostic frameworks, methodology, vocabulary, and role names travel freely. Specific palettes and proprietary identifiers do not. See `SCOPE-FIREWALL.md` for the full policy and pre-publish checklist.

**Rule 4 — Stay inside your fold.**
Author structure where you own structure. Apply color where you own color. Do not cross fold boundaries without an explicit contract between the two organs.

---

## Locked names

Use these names verbatim in all public and shared assets:

| Name | Use |
|---|---|
| `ReFolDec` | The framework and head |
| `bpmn-beta` | The structural fold organ |
| `skillz` | The automation fold organ |
| `PathScrib-R` | The early process-capture agent lineage ancestor |
| `Flowpilot Scribbler` | The Flowpilot Scribbler lineage name |
| `OverKill-Hill` | The narrative surface organ (repo/component name) |
| `overkillhill.com` | The public URL |

Do not abbreviate, rename, or rebrand these names in shared assets.

---

## Organ pointer table

> URLs marked `[placeholder]` are to be confirmed and updated when repos and Repls are published.

| Organ | Repo | Repl | Fold | Primary ReFolDec dependency |
|---|---|---|---|---|
| **mermaid-theme-builder** | `github.com/OKHP3/mermaid-theme-builder` [placeholder] | `replit.com/t/overkill-hill/repls/mermaid-theme-builder` [placeholder] | Presentation | `semantic-class-registry/`, `FOLD-CONTRACT.md` |
| **bpmn-beta** | `github.com/OKHP3/mermaid-diagram-bpmn` [placeholder] | `replit.com/t/overkill-hill/repls/mermaid-diagram-bpmn` [placeholder] | Structural | `semantic-class-registry/`, `FOLD-CONTRACT.md` |
| **skillz** | `github.com/OKHP3/skillz` [placeholder] | `replit.com/t/overkill-hill/repls/skillz` [placeholder] | Automation | `FOLD-CONTRACT.md` |
| **OverKill-Hill** | `github.com/OKHP3/overkill-hill` [placeholder] | `replit.com/t/overkill-hill/repls/overkill-hill` [placeholder] | Narrative | `ECOSYSTEM.md`, `FOLD-CONTRACT.md` |

**ReFolDec (this repo):**
- Repo: `github.com/OKHP3/refoldec`
- Repl: `replit.com/t/overkill-hill/repls/refoldec`

---

## Codec runtime status

The ReFolDec codec runtime — an orchestrator that chains folds programmatically across representations — is **intentionally deferred**. This repo is a specification repository. The runtime will be scoped after the organs stand on their own and the contracts are stable.

See `README.md` for the full status tracker.
