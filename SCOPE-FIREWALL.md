# SCOPE-FIREWALL.md — The OKHP³ Scope Firewall

> **This is the shared firewall policy for all OKHP³ components.**
> Every organ inherits and enforces this policy. It does not need to be restated in each organ — reference this file.

---

## Firewall identity and parity

- **Firewall ID:** `okhp3-scope-firewall`
- **Firewall version:** `1.0.0`

Downstream organs MUST record the firewall version used for a release check.
Parity means that shared assets contain only the allowed generic categories,
contain none of the prohibited categories, preserve the canonical disclaimer
where required, and keep semantic registry values color-agnostic. A failing or
unrun firewall check is not a passing parity result.

Version rules:

- Patch: editorial clarification with no policy change.
- Minor: additive checklist or evidence requirement that does not relax an
  existing prohibition.
- Major: any change to what may travel, what is prohibited, or the required
  disclaimer.

All policy changes require an ADR or equivalent recorded change decision and a
fresh pre-publish review. This policy does not claim that the repository has
been automatically scanned; the checklist remains the release gate.

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

The shared codec representation vocabulary is exactly four forms:
`Diagram`, `Code`, `Documentation`, and `Agent-Executable`. The explanatory
labels `idea`, `text`, and `structure` may describe capture and structuring
states, and `reusable artifact` may describe a packaging or loop-re-entry
boundary, but none is a fifth representation or a legal fold endpoint. The
representation contract remains authoritative for what those forms contain.

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

## Controlled release-tree review — 2026-09-01

This dated record is the manual checklist result for the controlled release tree.
It is authorized by the ReFolDec owner action recorded in
[`docs/release/2026-08-31-controlled-readiness.md`](docs/release/2026-08-31-controlled-readiness.md)
and the assigned release-clearance work. It authorizes review only; it does not
authorize a push, publication, deployment, or external organ contact.

The reviewed tree is the tracked Git tree after the privacy edits recorded in
[`docs/release/2026-09-01-scope-firewall-clearance.md`](docs/release/2026-09-01-scope-firewall-clearance.md).
Ignored workspace state (`.local/`, `.cache/`, `.upm/`, and Python caches) is
not release content. Host/third-party skill packages remain excluded from the
controlled release surface until their provenance and incomplete references are
resolved.

Checklist result:

- [x] No employer or client organization names appear in the controlled release
      tree. Owner and OKHP³ ecosystem names are not employer names.
- [x] No employer-owned color values or palette assets appear in the controlled
      release tree. The registry uses abstract tokens; owner-branded style
      profiles remain outside the registry's semantic contract.
- [x] No CSS color functions appear in shared registry or contract content.
- [x] No employer-owned internal system names, project codes, or proprietary
      platform identifiers remain in the controlled release tree.
- [x] No client PII or commercially sensitive data was found. An unrelated
      application name and personal name were removed from the checked-in skill
      examples before this review.
- [x] Enterprise-context provenance is generic and synthetic/representative
      evidence is labelled as such.
- [x] `scripts/validate-registry.mjs` passes for the abstract semantic registry.
- [x] Locked names are used verbatim.
- [x] The canonical disclaimer is present in `README.md`.
- [x] Local links in the controlled release tree resolve. The three unresolved
      relative references in the excluded Vercel host package are not release
      links; they remain blocked with that package.
- [x] Reviewed generated surfaces are intentional, source-derived outputs:
      `.agents/skills/README.md`, `.agents/skills/.catalog-meta.json`, and the
      two skill-library evidence files. Ignored caches and build output are
      excluded.

The clearance status is **controlled-release-tree-cleared-with-exclusions**.
The full checkout is not blanket-cleared: excluded host/third-party packages,
their incomplete references, and any future external destination content require
separate owner review before inclusion.

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
