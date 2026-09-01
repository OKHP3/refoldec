# Controlled Release-Tree Scope Firewall Clearance

**Review date:** 2026-09-01
**Firewall:** `okhp3-scope-firewall` version `1.0.0`
**Decision:** `controlled-release-tree-cleared-with-exclusions`
**Authorization:** ReFolDec owner action in the 2026-08-31 controlled-readiness record, implemented as the assigned release-clearance work.
**Publication boundary:** Review only; no push, deployment, external organ contact, or broad publication was authorized.

## Decision

The controlled release tree is cleared for privacy, provenance, and link risk
within the boundaries below. This is a bounded release decision, not a claim
that every file in the working checkout is suitable for publication.

### Included and cleared

- Root contracts, guidance, README, changelog, contribution files, and
  repository scripts/tests.
- `semantic-class-registry/` and its abstract-token documentation.
- `notation/`, `docs/`, and the checked-in synthetic proof and conformance
  fixtures, with their analytical or representative evidence labels preserved.
- The 36 project-owned portable skill packages under `.agents/skills/`.
- Intentional checked-in generated surfaces whose source and generator are
  identified: `.agents/skills/README.md`,
  `.agents/skills/.catalog-meta.json`,
  `docs/evidence/skill-library-evaluation-view.json`, and
  `docs/evidence/skill-library-maturity.md`.

### Excluded or still blocked

- `.local/`, `.cache/`, `.upm/`, Python caches, and other ignored workspace
  state; these are not release inputs.
- The four host/third-party skill packages:
  `architecture-decision-records`, `frontend-design`,
  `vercel-react-best-practices`, and `web-design-guidelines`. They are retained
  for the local host environment, but their provenance is not part of this
  release decision. The Vercel package also has three unresolved relative
  references in its long-form host document.
- Downstream organ URLs in `ECOSYSTEM.md`: reachable routing destinations, but
  still placeholders pending owner confirmation, Repl authorization, and
  parity records.
- Any future Notion or other external destination content unless its public
  authorization and content review are separately confirmed. The two
  Notion-only links were removed from `README.md` for this controlled surface.

## Owner-authorized scan

The scan was run against `git ls-files` rather than the mutable workspace. The
following checks were used:

```text
git ls-files
git ls-files | rg -i '(secret|credential|password|token|key|private|confidential|client|employer|internal|prod|production|dump|export|backup|\.env|pem|p12|sqlite|db|log|cache|coverage|dist|build|generated)'
git grep -n -I -E '[[:alnum:]._%+-]+@[[:alnum:].-]+\.[A-Za-z]{2,}'
git grep -n -I -E '(AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9_]{20,}|BEGIN (RSA|OPENSSH|EC|PRIVATE) KEY|sk-[A-Za-z0-9]{20,})'
git grep -n -I -E '#[0-9A-Fa-f]{3,8}\b|\b(rgb|rgba|hsl|hsla|oklch)\s*\('
```

The initial scan found an unrelated application name, personal name, and
repository identifier in reusable skill examples. Those references were
genericized before the final review; the final included-tree scan returned no
matches for those identifiers, no email-like values, and no credential-shaped
values. The only remaining
color-literal matches are intentional firewall/validator detection examples or
owner-branded profile seed data, not employer-owned semantic-registry bindings.

## Manual checklist result

| Firewall area | Result | Evidence and disposition |
|---|---|---|
| Employer/client names | **PASS** | Final tracked-tree review found no third-party employer or client organization names. Jamie Hill and OKHP³ names are owner/project identity required by the canonical disclaimer. |
| Employer-owned palettes | **PASS with boundary** | Registry and contract content use abstract tokens/custom-property references. Owner-branded profile seeds are not semantic-registry bindings; no employer-owned palette was identified. |
| Proprietary identifiers and artifacts | **PASS** | The unrelated application references were genericized. No employer-specific diagram, process map, system code, or internal identifier remains in the cleared tree. |
| PII and confidential data | **PASS** | No email-like or credential-shaped values were found. No client records, metrics, pricing, or personal data were identified. |
| Provenance | **PASS with limits** | Synthetic, representative, historical, analytical, and not-run boundaries remain labelled. The case study is not presented as an executed event record. |
| Registry validator | **PASS** | `node scripts/validate-registry.mjs` and registry tests pass; bound color values remain downstream-only. |
| Locked names and disclaimer | **PASS** | The required names remain verbatim and the canonical disclaimer remains in `README.md`. |
| Local links | **PASS for included tree** | Code-fence-aware review found no unresolved local links in the included tree. The three unresolved host-package references remain excluded. |
| External links | **REACHABLE, NOT AUTHORIZED AS EVIDENCE** | Selected GitHub and OverKill Hill URLs returned HTTP 200 on 2026-09-01. Reachability does not prove ownership, parity, or destination-content privacy; organ rows remain placeholders. |
| Generated material | **PASS with boundary** | Generated catalogs/evidence are intentional, source-derived, and checked in. Ignored caches and build output are excluded; no accidental generated material is included in the cleared tree. |

## External-link review

The following selected destinations returned HTTP 200 during the review:

| Destination group | Result | Interpretation |
|---|---:|---|
| `github.com/OKHP3/refoldec` | 200 | Canonical repository reachable; ownership is contextual, not independently established by HTTP. |
| `github.com/OKHP3/mermaid-theme-builder` | 200 | Reachable only; organ remains placeholder. |
| `github.com/OKHP3/mermaid-diagram-bpmn` | 200 | Reachable only; organ remains placeholder. |
| `github.com/OKHP3/skillz` | 200 | Reachable only; organ remains placeholder. |
| `github.com/OKHP3/overkill-hill` | 200 | Reachable only; organ remains placeholder. |
| `overkillhill.com` | 200 | Public surface reachable. |
| Previously listed Notion destinations | 200 before removal | Link reachability was confirmed, but destination content authorization was not; links were removed from the controlled public README. |

## Final disposition

**Cleared:** the included controlled release tree described above.
**Blocked:** host/third-party skill packages, incomplete host references,
unconfirmed downstream organ ownership/conformance, and external destination
content not separately authorized.
**Reopen this review:** after any firewall or contract change, new external link,
new provenance claim, new generated surface, new sensitive-content finding, or
change to the included/excluded release boundary. The broader controlled
readiness review expires on 2026-11-30.