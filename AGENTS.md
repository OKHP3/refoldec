# AGENTS.md — ReFolDec Agent Context

This file provides orientation for any AI agent working in this repository. Read it before making any changes.

---

## What this repo is

**ReFolDec** (Recursively Folding Codec) is a **specification repository**, not an application. It contains:

- Ecosystem contracts that every OKHP³ organ conforms to
- A semantic-class registry (the meaning axis for all diagram roles)
- A fold contract (the formal codec definition)
- A scope firewall (the shared privacy and content policy)
- Conceptual documentation and case studies
- One validation script (no application runtime)

There is no web server, no frontend, no database, and no application logic to run. The only executable code is `scripts/validate-registry.mjs` and `tests/registry.test.mjs`, both of which validate the semantic-class registry JSON.

---

## Read these first

Before making any changes, read these files in order:

1. **`ECOSYSTEM.md`** — The head-and-organs model, conformance rules, locked names, organ pointer table.
2. **`FOLD-CONTRACT.md`** — The four canonical representations, legal folds, lossless invariants, round-trip guarantee.
3. **`SCOPE-FIREWALL.md`** — What may and may not appear in any public or shared asset. Run the pre-publish checklist before committing.
4. **`ARCHITECTURE.md`** — The ReFolDec planes, mechanics, and component roles.

---

## Repo structure

```
/
├── AGENTS.md                          ← this file
├── ECOSYSTEM.md                       ← ecosystem context (read first)
├── FOLD-CONTRACT.md                   ← codec contract (read first)
├── SCOPE-FIREWALL.md                  ← content firewall (read first)
├── ARCHITECTURE.md                    ← planes, mechanics, component roles
├── README.md                          ← public-facing overview
├── CHANGELOG.md                       ← version history
├── CONTRIBUTING.md                    ← contribution guide
│
├── semantic-class-registry/
│   ├── SEMANTIC-CLASSES.md            ← human spec for all diagram roles
│   └── semantic-classes.json          ← machine source of truth (no hex)
│
├── scripts/
│   └── validate-registry.mjs          ← registry validator (no dependencies)
│
├── tests/
│   └── registry.test.mjs              ← tests (run with: node --test)
│
├── notation/
│   └── README.md                      ← BPMN-for-Mermaid component spec
│
├── docs/
│   ├── okhp3-visual-language-stack.md ← ecosystem map
│   ├── glossary.md                    ← canonical term definitions
│   ├── concepts/
│   │   └── core-loop.md               ← recursive transformation grammar
│   └── case-studies/
│       └── mermaid-visual-language-stack.md ← full fold walkthrough
│
└── .agents/
    └── skills/
        └── README.md                  ← Process Skills schema and structure
```

---

## What agents may do

- Add or improve documentation in `docs/`, `ARCHITECTURE.md`, `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`
- Add new entries to `semantic-class-registry/semantic-classes.json` (must pass the validator)
- Add new `SKILL.md` files under `.agents/skills/<skill-name>/SKILL.md`
- Improve or extend `ECOSYSTEM.md`, `FOLD-CONTRACT.md`, or `SCOPE-FIREWALL.md` when directed
- Extend `scripts/validate-registry.mjs` or `tests/registry.test.mjs` when directed

---

## What agents must not do

- **Do not create application code.** No `src/` directory, no web app, no CLI, no parser, no renderer, no orchestration engine. The codec runtime is intentionally deferred.
- **Do not introduce hex color values** anywhere in any file — not in JSON, not in Markdown, not in scripts.
- **Do not introduce CSS color functions** (`rgb()`, `hsl()`, `oklch()`, etc.) in any shared or registry file.
- **Do not expose employer names, employer palettes, or employer-specific artifacts.** See `SCOPE-FIREWALL.md` for the full policy.
- **Do not redefine shared concepts.** Fold vocabulary, semantic roles, and palette tokens are defined in the contracts. Reference them; do not fork them.
- **Do not rename locked names.** See the locked-names table below.
- **Do not install external dependencies** for the validation script or tests. Both are intentionally dependency-free.

---

## Locked names

Use these verbatim in all files:

| Name | Do not alter to |
|---|---|
| `ReFolDec` | Refoldec, refoldec, RFD |
| `bpmn-beta` | BPMN-beta, bpmn_beta |
| `skillz` | skills, Skillz |
| `PathScrib-R` | PathScribR, pathscrib-r |
| `Flowpilot Scribbler` | flowpilot-scribbler, Flowpilot_Scribbler |
| `OverKill-Hill` | Overkill-Hill, overkill-hill (as repo/component name) |
| `overkillhill.com` | overkill-hill.com |
| `xMIE`, `xME`, `xIE` | xmie, Xme, xie |

---

## File naming conventions

| Convention | Rule |
|---|---|
| Spec files | `UPPERCASE.md` — e.g., `SKILL.md`, `README.md`, `AGENTS.md` |
| Documentation files | `lowercase-kebab.md` — e.g., `core-loop.md`, `glossary.md` |
| JSON assets | `lowercase-kebab.json` — e.g., `semantic-classes.json` |
| Scripts | `lowercase-kebab.mjs` — e.g., `validate-registry.mjs` |
| Skill directories | `lowercase-kebab/` under `.agents/skills/` |

---

## Validation

After any change to `semantic-class-registry/semantic-classes.json`, run:

```bash
node scripts/validate-registry.mjs
```

And run the full test suite with:

```bash
node --test tests/registry.test.mjs
```

Both must pass before committing. The validator enforces:
- All required fields present and non-empty
- `family` is `architecture` or `process`
- `paletteToken` is from the allowed token set
- No hex color values (`#rrggbb`, `#rgb`, `#rrggbbaa`)
- No CSS color functions (`rgb()`, `hsl()`, `oklch()`, etc.)
- All `(id, family)` pairs are unique

---

## Semantic class registry rules

The registry (`semantic-class-registry/semantic-classes.json`) is the meaning axis for all OKHP³ diagram roles. When working with it:

- **Never add hex values.** Use abstract palette tokens only (`primary`, `secondary`, `accent`, `accent-alt`, `neutral`, `boundary`, `alert`, `success`).
- **Never add a sixth representation or a new family** without a formal revision to `FOLD-CONTRACT.md`.
- **The `(id, family)` pair is the unique key.** `data`, `control`, and `alert` intentionally appear in both families with different meanings — this is by design.
- The `classDefPattern` field uses CSS custom property syntax (`var(--token-*)`) as the abstract reference format. Organs resolve these to concrete values; the registry does not.

---

## Scope firewall quick check

Before committing any content, verify:

- [ ] No employer or client names
- [ ] No hex color values anywhere
- [ ] No CSS color functions in any registry or contract file
- [ ] No employer-owned palette files or brand assets
- [ ] Generic language for any enterprise-context references
- [ ] Locked names used verbatim
- [ ] Canonical disclaimer present in README

Full policy: `SCOPE-FIREWALL.md`

---

## Canonical disclaimer

This text must appear in the README of any public OKHP³ repo:

> Personal project of Jamie Hill / OverKill Hill P³, not affiliated with any employer, the mermaid-js maintainers, Mermaid Chart, or Mermaid.ai.

## Imported Claude Cowork project instructions
