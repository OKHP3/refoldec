# Semantic Class Registry

> **Machine source of truth:** `semantic-classes.json` in this directory.
> This document is the human-readable spec. If the two files conflict, `semantic-classes.json` wins.
> Run `scripts/validate-registry.mjs` to verify the JSON is well-formed and color-agnostic.

---

## Purpose

The semantic-class registry is the **meaning axis** of the OKHP³ Visual Language Stack.

It defines, once and authoritatively, the named roles that diagram nodes can hold — what each role means, what abstract palette token it references, and what shape convention it uses. Every organ that renders or transforms diagrams reads from this registry. No organ redefines these roles.

**Critical constraint:** The registry carries **no hex values and no bound color values of any kind.** It references abstract palette tokens only. Color binding happens downstream in the presentation fold (mermaid-theme-builder). This keeps ReFolDec color-agnostic and on-thesis.

---

## Allowed palette tokens

The complete set of abstract tokens an organ may bind to concrete color values:

| Token | Semantic intent |
|---|---|
| `primary` | Primary identity — human actors, start/end events, approval gates |
| `secondary` | Secondary identity — handoffs, supporting human roles |
| `accent` | Application or system emphasis — software, automated services |
| `accent-alt` | Alternative accent — AI agents, automated reasoning components |
| `neutral` | Default structural elements — steps, channels, data, control flow |
| `boundary` | Scope and boundary markers — external systems, containers, scope edges |
| `alert` | Warning, error, or escalation — critical conditions, exception paths |
| `success` | Positive completion state — reserved for use by organs as needed |

No other token values are permitted. The validator enforces this.

---

## Shape grammar

Mermaid syntax for each shape name used in the registry:

| Shape name | Mermaid syntax | Typical use |
|---|---|---|
| `rectangle` | `[text]` | Default contained element, channels, notes |
| `rounded` | `(text)` | Process steps, applications, handoffs |
| `stadium` | `([text])` | Human actors, approval gates, alerts |
| `circle` | `((text))` | Start/end events |
| `diamond` | `{text}` | Decision points, control flow, questions |
| `cylinder` | `[(text)]` | Data stores, persistent state |
| `hexagon` | `{{text}}` | AI agents, automated reasoning components |
| `parallelogram` | `[/text/]` | Log artifacts, audit trails |

---

## classDefPattern format

Each role's `classDefPattern` is the abstract body of a Mermaid `classDef` statement, with token references substituted for color values.

**Format:** CSS property declarations using CSS custom property syntax for token references.

**Token reference convention:** `var(--token-<tokenName>)` and `var(--token-on-<tokenName>)` for foreground, `var(--token-<tokenName>-stroke)` for stroke color.

**Example resolution** (done downstream by mermaid-theme-builder, not here):
```
Registry:   fill:var(--token-primary),stroke:var(--token-primary-stroke),color:var(--token-on-primary)
Resolved:   fill:#3b5bdb,stroke:#1e3a8a,color:#ffffff   ← organ's job, not the registry's
```

---

## Architecture family

Roles for system and component architecture diagrams.

| id | meaning | paletteToken | shape | Mermaid syntax |
|---|---|---|---|---|
| `actor` | Human user or role interacting with the system | `primary` | stadium | `([text])` |
| `channel` | Communication pathway or interface between components | `neutral` | rectangle | `[text]` |
| `app` | Software application or service | `accent` | rounded | `(text)` |
| `ai` | AI model, agent, or automated reasoning component | `accent-alt` | hexagon | `{{text}}` |
| `data` | Data store, database, or persistent state | `neutral` | cylinder | `[(text)]` |
| `external` | System or actor outside the defined scope boundary | `boundary` | rectangle | `[text]` |
| `control` | Control flow, orchestration, or routing logic | `neutral` | diamond | `{text}` |
| `boundary` | Scope or system boundary marker | `boundary` | rectangle | `[text]` |
| `log` | Audit trail, log output, or immutable record | `neutral` | parallelogram | `[/text/]` |
| `question` | Open question, unknown, or decision-pending node | `alert` | diamond | `{text}` |
| `scope` | Scope container or logical grouping | `boundary` | rectangle | `[text]` |
| `alert` | Warning, error, or critical condition | `alert` | stadium | `([text])` |

### Architecture classDef patterns

```
classDef actor     fill:var(--token-primary),stroke:var(--token-primary-stroke),stroke-width:2px,color:var(--token-on-primary)
classDef channel   fill:var(--token-neutral),stroke:var(--token-neutral-stroke),stroke-width:1px,color:var(--token-on-neutral)
classDef app       fill:var(--token-accent),stroke:var(--token-accent-stroke),stroke-width:1px,color:var(--token-on-accent)
classDef ai        fill:var(--token-accent-alt),stroke:var(--token-accent-alt-stroke),stroke-width:1px,color:var(--token-on-accent-alt)
classDef data      fill:var(--token-neutral),stroke:var(--token-neutral-stroke),stroke-width:1px,color:var(--token-on-neutral)
classDef external  fill:var(--token-boundary),stroke:var(--token-boundary-stroke),stroke-width:1px,stroke-dasharray:4 2,color:var(--token-on-boundary)
classDef control   fill:var(--token-neutral),stroke:var(--token-neutral-stroke),stroke-width:1px,color:var(--token-on-neutral)
classDef boundary  fill:var(--token-boundary),stroke:var(--token-boundary-stroke),stroke-width:1px,stroke-dasharray:4 2,color:var(--token-on-boundary)
classDef log       fill:var(--token-neutral),stroke:var(--token-neutral-stroke),stroke-width:1px,color:var(--token-on-neutral)
classDef question  fill:var(--token-alert),stroke:var(--token-alert-stroke),stroke-width:2px,color:var(--token-on-alert)
classDef scope     fill:var(--token-boundary),stroke:var(--token-boundary-stroke),stroke-width:1px,stroke-dasharray:4 2,color:var(--token-on-boundary)
classDef alert     fill:var(--token-alert),stroke:var(--token-alert-stroke),stroke-width:2px,color:var(--token-on-alert)
```

---

## Process family

Roles for business-process and workflow diagrams.

| id | meaning | paletteToken | shape | Mermaid syntax |
|---|---|---|---|---|
| `startend` | Start or end event of a process | `primary` | circle | `((text))` |
| `step` | A discrete action or task performed by an actor | `neutral` | rounded | `(text)` |
| `system` | Automated system action or background operation | `accent` | rectangle | `[text]` |
| `decision` | Branching decision point | `neutral` | diamond | `{text}` |
| `approval` | Human approval gate or sign-off requirement | `primary` | stadium | `([text])` |
| `handoff` | Transfer of ownership or responsibility between actors | `secondary` | rounded | `(text)` |
| `data` | Data input, output, or transformation in process context | `neutral` | cylinder | `[(text)]` |
| `note` | Annotation, comment, or explanatory note | `neutral` | rectangle | `[text]` |
| `control` | Process control event such as a timer, signal, or interrupt | `neutral` | diamond | `{text}` |
| `alert` | Error, exception, or escalation path | `alert` | stadium | `([text])` |

### Process classDef patterns

```
classDef startend  fill:var(--token-primary),stroke:var(--token-primary-stroke),stroke-width:2px,color:var(--token-on-primary)
classDef step      fill:var(--token-neutral),stroke:var(--token-neutral-stroke),stroke-width:1px,color:var(--token-on-neutral)
classDef system    fill:var(--token-accent),stroke:var(--token-accent-stroke),stroke-width:1px,color:var(--token-on-accent)
classDef decision  fill:var(--token-neutral),stroke:var(--token-neutral-stroke),stroke-width:1px,color:var(--token-on-neutral)
classDef approval  fill:var(--token-primary),stroke:var(--token-primary-stroke),stroke-width:2px,color:var(--token-on-primary)
classDef handoff   fill:var(--token-secondary),stroke:var(--token-secondary-stroke),stroke-width:1px,color:var(--token-on-secondary)
classDef data      fill:var(--token-neutral),stroke:var(--token-neutral-stroke),stroke-width:1px,color:var(--token-on-neutral)
classDef note      fill:var(--token-neutral),stroke:var(--token-neutral-stroke),stroke-width:1px,stroke-dasharray:2 2,color:var(--token-on-neutral)
classDef control   fill:var(--token-neutral),stroke:var(--token-neutral-stroke),stroke-width:1px,color:var(--token-on-neutral)
classDef alert     fill:var(--token-alert),stroke:var(--token-alert-stroke),stroke-width:2px,color:var(--token-on-alert)
```

---

## Notes on shared IDs across families

`data`, `control`, and `alert` appear in both families with different meanings:

| id | architecture meaning | process meaning |
|---|---|---|
| `data` | Persistent data store or database | Data input, output, or transformation |
| `control` | Orchestration or routing logic | Timer, signal, or interrupt event |
| `alert` | Warning or critical system condition | Error, exception, or escalation path |

These are separate entries in the JSON (`"family": "architecture"` vs `"family": "process"`). When applying classes, qualify by family context. The `(id, family)` pair is the unique key.

---

## How organs use this registry

**mermaid-theme-builder (Presentation fold):**
Reads `paletteToken` and `classDefPattern`. Binds `var(--token-*)` references to concrete color values for a given renderer context. Does not modify role definitions.

**bpmn-beta (Structural fold):**
Reads `id`, `family`, `shape`, and Mermaid shape syntax. Applies `classDefPattern` to diagram nodes. Does not invent new roles.

**skillz (Automation fold):**
References role names in SKILL.md inputs/outputs when describing what a fold produces. Does not define new roles.

---

## Further reading

- `semantic-classes.json` — machine source of truth (this directory)
- `scripts/validate-registry.mjs` — validator script
- `FOLD-CONTRACT.md` — defines the fold vocabulary and invariants the registry supports
- `ECOSYSTEM.md` — conformance rules for organ consumers
