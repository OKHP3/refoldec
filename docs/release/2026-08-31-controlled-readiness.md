# Controlled Public Readiness Decision

**Decision date:** 2026-08-31  
**Decision:** `approve-with-limits`  
**Evidence status:** analytical, with narrow live structural checks  
**Review record:** [`../reviews/2026-08-31-controlled-readiness.md`](../reviews/2026-08-31-controlled-readiness.md)  
**Machine record:** [`../reviews/2026-08-31-controlled-readiness.json`](../reviews/2026-08-31-controlled-readiness.json)  
**Review expiry:** 2026-11-30, or sooner on any trigger listed below.

## Decision boundary

ReFolDec is approved for controlled public use as a specification/head-canon
repository and as a source of bounded, public-safe analytical proof. This is
not approval of an implemented codec, general losslessness, ecosystem-wide
conformance, skill portability, production readiness, or repository-wide
publication clearance.

## Approved

- Public explanation of the four canonical representations, legal fold pairs,
  deferred direct folds, invariants, semantic registry, and scope-firewall
  policy.
- The checked-in synthetic proof package as a **manual, fixture-level
  demonstration**, with its stated evidence boundary.
- Contributions to contracts, documentation, registry entries, proof fixtures,
  and bounded skill specifications that preserve the no-runtime boundary.
- The existing contribution path through issues and pull requests, subject to
  the architecture, contract, and scope-firewall checks in
  [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

## Approved with limits

- Describe ReFolDec as an analytical, bidirectional process-capture framework,
  not as a working general-purpose codec.
- Describe the proof as one public-safe synthetic fold loop whose invariant
  comparison was performed manually. The proof does not claim a renderer or
  Agent Skills client executed the artifacts.
- Describe the 40-package skill-library inventory as structural and analytical
  evidence. Current task-quality, uplift, portability, and production evidence
  is `not-run`; one historical benchmark does not transfer to current versions.
- Use organ URLs as routing context only. The four downstream organ pointers
  remain placeholders until owners confirm them and provide parity records.

## Deferred

- General codec/runtime or fold orchestrator capability.
- Operational claims that folds are lossless, reversible, or round-trippable
  beyond the bounded fixture-level manual demonstration.
- Generalization from one fixture to unseen workflows.
- Skill task-quality, uplift, portability, adversarial-client, or production
  claims.
- External organ conformance, current organ status, and URL verification.
- Repository-wide publication/privacy clearance from the scope firewall.
- Direct `Diagram ↔ Agent-Executable` folds, which remain contract-deferred.

## Rejected for this release

- Any claim that a passing registry or conformance validator proves
  ecosystem-wide conformance.
- Any implementation or public description that treats the case study as an
  executed event record.
- Any unilateral direct `Diagram ↔ Agent-Executable` implementation.
- Any runtime work that starts before the contract, proof, and owner-conformance
  gates are satisfied.

## Evidence reconciliation

| Evidence area | Current result | Release interpretation |
|---|---|---|
| Contract | `FOLD-CONTRACT.md` 1.0.0 and fixture schema 1.1 define four forms, legal pairs, invariants, and deferred direct folds. | Normative specification evidence; not runtime evidence. |
| Registry | Dependency-free validator and registry tests pass for the color-agnostic registry. | Narrow live evidence for registry integrity only. |
| Conformance | Fixture and matrix cover legal-direction preservation, explicit loss, ambiguity, missing metadata, and deferred-fold rejection. | Fixture/specification evidence; no general executor is present. |
| Cross-representation proof | One synthetic source is represented in four forms with manually reviewed invariant comparisons, hashes, and inverse artifacts. | Analytical proof of one bounded fixture; not general or production proof. |
| Skill library | 40 packages inventoried; 36 project-owned evaluation designs are ready; current task-quality evidence is `not-run`; one historical benchmark is retained. | Structural maturity only; no uplift, portability, or production claim. |
| Provenance/case study | The case study is explicitly representative; the proof package carries synthetic source provenance and a public-safe boundary. | Case study remains explanatory; proof is the only bounded demonstration. |
| Scope firewall | Policy and registry-specific automation are present. Whole-tree firewall clearance and external-link verification were not run. | Policy may guide contributions; it is not a publication clearance. |
| Organ pointers | All four downstream organ links are marked placeholders; no owner-authorized parity reports are available. | Ecosystem claims remain deferred. |

## Strongest surviving objection

The strongest objection is that a deterministic fixture validator and a manually
assembled fixture can agree with themselves while a real implementation loses
meaning, mishandles ambiguity, or fails in another client. That objection
survives. The limited approval is therefore restricted to the specification and
the explicitly bounded proof; it does not convert structural agreement into
runtime, portability, or ecosystem evidence.

## Owner decisions and next authorized actions

| Decision or action | Owner | Smallest decisive evidence | If unresolved |
|---|---|---|---|
| Map the explanatory core-loop stages to the four canonical forms without changing the contract by implication. | ReFolDec owner and contract maintainers | Publish a normative stage/transition mapping and check it against one fixture. | Keep claims of one formal loop deferred. |
| Confirm each downstream organ pointer and provide a parity result. | Each organ owner / ReFolDec owner | Owner-authorized repository/Repl confirmation plus the required parity fields in `ECOSYSTEM.md`. | Keep placeholders and ecosystem conformance deferred. |
| Establish a second unseen proof fixture before generalizing the proof claim. | Future fold-claims implementation owner | Repeat the invariant comparison with source, intermediates, inverse artifacts, and hashes. | Keep proof labelled single-fixture. |
| Run current-version skill evaluations with an unseen holdout. | Process Skills and equilibrium-review maintainers | Matched isolated runs, separated or blinded grading, and a protected holdout. | Keep skill evidence structural/analytical and task-quality `not-run`. |
| Perform a release-tree firewall review before any broad publication claim. | ReFolDec owner | Owner-authorized whole-tree scan plus manual checklist and link review. | No repository-wide publication clearance. |

No external publication, push, deployment, organ contact, or runtime
implementation is authorized by this decision.

## Review-expiry trigger

Reopen this decision and create a new frozen review record immediately if any of
the following occurs:

- the contract, canonical representations, legal/deferred folds, registry, or
  scope-firewall policy changes;
- a codec/runtime surface or a second proof fixture is introduced;
- a downstream organ is declared conforming or a placeholder becomes a public
  dependency;
- the skill-library evaluation design, package versions, or benchmark evidence
  changes;
- a whole-tree publication review, protected benchmark, renderer run, or
  Agent Skills client run becomes available; or
- new external links, provenance claims, or sensitive-content risk enters the
  intended release surface.

Absent an earlier trigger, revisit the decision no later than **2026-11-30**.