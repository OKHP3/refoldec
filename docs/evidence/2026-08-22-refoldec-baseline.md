# ReFolDec Evidence Baseline

**Review date:** 2026-08-22  
**Artifact scope:** ReFolDec repository at the reviewed commit, including the four
contracts, registry, checked-in skills, conformance fixture, and proof package.  
**Decision question:** What can ReFolDec safely claim and release within its
specification-first scope today?  
**Audience:** Maintainers, downstream organs, contributors, and reviewers.  
**Constraints:** No runtime, external-organ write, employer material, or
unseen live benchmark is available in this repository.

## Evidence method

This is an analytical baseline. The evidence reviewer checked the authoritative
contracts and validators; the outcome reviewer checked whether the repository
offers a usable specification and reproducible proof; the safety/portability
review checked scope, provenance, privacy, and deferred boundaries. These
reviews share the same repository sources, so agreement is correlated evidence,
not independent live validation.

The narrow disruptor question was: **Could the repository's polished contracts
be mistaken for proof that a general codec preserves meaning?** The answer is
yes. The conformance fixture and validator reduce that risk for one synthetic
case, but they do not establish general runtime behavior.

## Baseline decision

**Decision: approve-with-limits for public specification and synthetic proof;
defer runtime, ecosystem-wide conformance, and task-quality claims for evidence.**

### Usable now

- Shared vocabulary, four-representation boundary, legal/deferred fold map, and
  scope firewall.
- Color-agnostic semantic registry with dependency-free validation.
- A neutral fixture and executable structural checks for invariant comparison.
- A public-safe, synthetic four-form proof package.
- A documented skill-library inventory with explicit not-run live evidence.

### Approved with limits

- Contributors may use the contracts, fixture, and validator to design organ
  implementations.
- The proof may be described as a **fixture-level demonstration**, not as a
  general codec or production guarantee.
- The local skills may be used as candidate portable workflows subject to each
  skill's own boundaries and host capabilities.

### Deferred

- A general-purpose codec runtime or orchestrator.
- Direct Diagram ↔ Agent-Executable folds.
- Live with/without-skill uplift, production readiness, and ecosystem-wide
  conformance.
- Treating placeholder organ URLs as confirmed integrations.

## Smallest decisive next tests

| Claim blocked | Smallest decisive test | Owner decision if false | Consequence |
|---|---|---|---|
| General folds preserve invariants | Run the conformance matrix against an actual implementation on unseen fixtures | Keep runtime deferred | Lossless language remains specification-only |
| Four-form proof generalizes | Add a second owner-approved or synthetic fixture and repeat comparison | Keep proof labelled single-fixture | One example cannot support generality |
| Skills improve outcomes | Isolated matched runs with a fresh holdout and blinded grading | Keep evidence `not-run` | No uplift or production claim |
| Organs conform | Each organ supplies a parity report against the registry, firewall, and fold matrix | Keep pointers as placeholders | The ecosystem remains a coordination design |

## Review expiry

Reopen this baseline when a runtime, a second proof fixture, an external organ
parity report, or a fresh protected benchmark is added. Absent those triggers,
review the decision no later than 2026-11-22.
