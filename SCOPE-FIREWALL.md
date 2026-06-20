# SCOPE-FIREWALL.md — The OKHP³ Scope Firewall

> **This is the shared firewall policy for all OKHP³ components.**
> Every organ inherits and enforces this policy. It does not need to be restated in each organ — reference this file.

---

## Purpose

The scope firewall exists to ensure that private, employer-specific, or proprietary material never enters the public OKHP³ ecosystem. Brand-agnostic frameworks, methodology, vocabulary, and role names travel freely. Specific palettes, proprietary identifiers, and employer-owned artifacts do not.

This is not a constraint on what you can build. It is a constraint on what you can publish.

---

## What travels freely

The following categories of content may appear in any OKHP³ public repo, site, or shared asset without restriction:

| Category | Description | Examples |
|---|---|---|
| **Framework vocabulary** | Generic terms for processes, patterns, and methodology | fold, unfold, codec, representation, lossless, semantic role, governance profile |
| **Abstract role names** | Semantic class IDs from the registry | `actor`, `decision`, `ai`, `channel`, `boundary`, `alert` |
| **Abstract palette tokens** | Token names that reference colors without binding to specific values | `primary`, `accent`, `neutral`, `alert`, `boundary` |
| **Shape conventions** | Mermaid shape names and syntax | `stadium`, `diamond`, `cylinder`, `((text))` |
| **Methodology** | Process-capture principles, fold mechanics, xMIE theory | xME, xIE, xMIE, the fold loop, lossless criteria |
| **Generic governance patterns** | Descriptions of enterprise-style problems without identifying the enterprise | renderer profile, diagram-output contract, style-preserving update, syntax repair mode |
| **OKHP³ ecosystem vocabulary** | Locked names and concepts within this ecosystem | ReFolDec, bpmn-beta, skillz, PathScrib-R, OverKill-Hill |

---

## What does not travel

The following categories of content must **never** appear in any public or shared OKHP³ asset:

| Category | Description | Examples of what to block |
|---|---|---|
| **Employer names** | Any third-party employer or client organization name | Organization names, abbreviations, brand identifiers |
| **Employer-owned color values** | Any hex value, RGB value, or HSL value tied to a private brand palette | `#1a2b3c`, `rgb(26, 43, 60)`, brand-specific palette files |
| **Proprietary identifiers** | Internal system names, project codes, or product names owned by an employer | Internal platform names, internal project codes |
| **Employer-specific artifacts** | Diagrams, documents, or assets that are recognizably from or about an employer | Org charts, internal process maps, company-specific workflows |
| **Client PII or confidential data** | Any personally identifiable or commercially sensitive information | Names, emails, internal metrics, pricing data |

### A note on provenance

It is acceptable to acknowledge that a pattern was proven in an enterprise context, or that a design was informed by real-world governance work, using generic language only. The following substitutions are always acceptable:

| Private → Generic |
|---|
| [Employer name] → "an enterprise context" or "a production diagram governance context" |
| [Employer palette] → "enterprise brand palette" or "private palette profile" |
| [Internal system name] → "a third-party diagramming platform" or "a production rendering environment" |
| [Internal project code] → "an enterprise diagram library" or "a governed diagram system" |

---

## The pre-publish checklist

Run this checklist before merging any content to `main` in any OKHP³ repo or deploying any OKHP³ public surface.

```
OKHP³ Scope Firewall — Pre-Publish Checklist
─────────────────────────────────────────────

[ ] No employer or client organization names appear in any file.

[ ] No hex color values appear in any shared or public asset.
    (Hex is permitted in private, local config files that are gitignored.)

[ ] No CSS color functions (rgb(), rgba(), hsl(), hsla(), oklch(), etc.)
    appear in any shared registry or contract file.

[ ] No employer-owned palette files, color tokens, or brand assets are
    present in the repo or referenced from public URLs.

[ ] No internal system names, project codes, or platform identifiers
    that belong to a third-party employer appear in any file.

[ ] No client PII or commercially sensitive data appears anywhere.

[ ] Any reference to enterprise-context provenance uses generic language
    (e.g., "enterprise governance context" not "[Employer name] context").

[ ] The semantic-class registry contains only abstract palette tokens —
    no bound color values. Run validate-registry.mjs to confirm.

[ ] All locked names are used verbatim:
    ReFolDec, bpmn-beta, skillz, PathScrib-R, Flowpilot Scribbler,
    OverKill-Hill, overkillhill.com.

[ ] The canonical disclaimer is present in the README of any public repo:
    "Personal project of Jamie Hill / OverKill Hill P³, not affiliated
    with any employer, the mermaid-js maintainers, Mermaid Chart, or
    Mermaid.ai."
```

---

## Enforcement

This firewall is enforced by convention, review, and the validation script for the semantic-class registry (`scripts/validate-registry.mjs`). The validator enforces the no-hex rule for the registry automatically. All other checks are human review items on the checklist above.

If a violation is found after publication, the corrective action is:
1. Remove or redact the violating content immediately.
2. Force-push or rewrite history if the content was committed to git. (Coordinate with the repo owner.)
3. Confirm the fix with the pre-publish checklist before re-deploying.

---

## Relationship to other contracts

- `ECOSYSTEM.md` — Conformance Rule 3 states this firewall policy as a conformance requirement for all organs. This file is the authoritative definition.
- `FOLD-CONTRACT.md` — Defines what representations exist; this file governs what content may appear in those representations.
- `semantic-class-registry/` — The validator script enforces the no-hex, no-color-function rules on the registry automatically.
