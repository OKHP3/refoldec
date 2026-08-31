# ReFolDec Controlled-Readiness Equilibrium Review

**Review date:** 2026-08-31  
**Protocol:** `equilibrium-v1`  
**Mode:** conditional five-role synthesis  
**Decision:** `approve-with-limits`  
**Evidence status:** analytical, with narrow live structural checks

## Frozen question and boundary

> Is ReFolDec ready, within its stated scope, to be treated as a usable, safe,
> and evidence-supported recursive fold/unfold framework, and what may be
> released now versus what must defer for evidence?

The reviewed artifact is the current ReFolDec repository as a specification,
contract, documentation, registry, proof, and checked-in skill-library project.
It contains no application runtime. This review uses the current 40-package
skill-library view generated on 2026-08-31 and the checked-in proof package.
External organ repositories, Notion pages, renderers, Agent Skills clients,
protected holdouts, and external publication checks were not treated as
available evidence.

### Acceptance criteria

1. Classify claims as confirmed, inferred, proposal, or unknown.
2. Separate analytical, live, historical, and not-run evidence.
3. State what is approved, approved with limits, deferred, or rejected.
4. Keep placeholder links, runtime limits, and firewall limitations explicit.
5. Give every blocked material claim an owner, decisive next test, and
   consequence.
6. Define a review-expiry date and earlier reopening triggers.

## Independent evidence review

| Review role | Status | Finding |
|---|---|---|
| Evidence reviewer | `analytical` | The contracts, registry design, legal/deferred fold table, conformance matrix, proof package, and skill inventory are directly present. No live general fold executor, organ parity, or current skill outcome evidence was found. |
| Outcome reviewer | `analytical` | The repository is useful as a specification/head-canon and contribution reference. The case study is explanatory; the synthetic proof supports only a bounded fixture-level demonstration. |
| Safety and portability reviewer | `analytical` | The scope firewall is a policy with registry-specific automation, not whole-tree clearance. Placeholder URLs, runtime assumptions, and client portability remain unverified. |
| Disruptor | `analytical` and triggered | The strongest maturity interpretations were challenged: fixture self-agreement, case-study proof, skill readiness, whole-tree safety, and alignment of the core loop with the four-form contract. Each objection survives absent its decisive test. |
| Negotiator | `analytical` | Approve the narrow specification and bounded proof surface with explicit limits; defer operational, ecosystem, portability, and broad publication claims. |

These roles are separate review perspectives, not independent external
corroboration. They rely substantially on the same local source set and the
model family is not independently known.

## Evidence ledger

| ID | Claim | Classification | Status | Evidence state | Decisive next test |
|---|---|---|---|---|---|
| CLM-01 | ReFolDec is a Git-backed specification/head-canon repository without an application runtime. | confirmed | supported | analytical | Reinspect the tree before any runtime claim. |
| CLM-02 | The four canonical forms, legal fold pairs, invariants, and deferred direct folds are defined. | confirmed | supported | analytical | Run each organ parity check against the contract when owner snapshots exist. |
| CLM-03 | The semantic registry is color-agnostic and mechanically validated. | confirmed | supported with limits | live for registry only | Require downstream parity checks. |
| CLM-04 | One public-safe synthetic workflow has a complete, inspectable four-form path with manually compared invariant projections. | confirmed | supported with limits | manual-analytical | Repeat on a second unseen fixture. |
| CLM-05 | The fold model is operationally lossless, reversible, and round-trippable in general. | unknown | blocked | not-run | Execute fold and inverse on implementation-backed unseen fixtures. |
| CLM-06 | The representative Mermaid case study is an executed event record. | unknown | blocked | not-run | Preserve its illustrative label; only a frozen proof fixture could support this claim. |
| CLM-07 | The 40-package skill library is portable, effective, or production-ready. | unknown | blocked | analytical structural view; task quality not-run; one historical benchmark | Run matched current-version tasks with separated grading and unseen holdout. |
| CLM-08 | The complete repository has whole-tree publication/privacy clearance. | unknown | blocked | not-run | Owner-authorized whole-tree scan and manual firewall checklist. |
| CLM-09 | Downstream organ links are verified and organs conform to the head. | unknown | blocked | not-run | Confirm URLs and obtain parity records with all required version fields. |
| CLM-10 | The explanatory core loop and four-form contract are already one formal model. | unknown | blocked | analytical disagreement risk | Publish and test a normative stage/transition mapping. |

## Independent checks and evidence boundaries

The current release record requires these checks to be rerun on the reviewed
revision:

```text
node scripts/validate-registry.mjs
node --test tests/registry.test.mjs
node scripts/validate-conformance.mjs
node --test tests/conformance.test.mjs
node --test tests/skill-library-audit.test.mjs
git diff --check
```

The first two commands are narrow live registry evidence. The conformance
commands are fixture/specification evidence: they validate the neutral fixture,
invariant projections, failure cases, and deferred-fold rule, not a codec
runtime. The skill-library checks validate inventory/package structure, not
task-quality uplift. A firewall checklist and sensitive-content scan are not
automatically converted into a whole-tree clearance claim.

## Disruptor and negotiated decision

The surviving objection is that self-consistent fixture records can mask a
defect in a parser, renderer, execution client, or unseen workflow. No available
test falsifies that objection. The negotiator therefore sets:

**`approve-with-limits` for the analytical specification/head-canon baseline
and one bounded public-safe synthetic proof package.**

The approved surface, limits, deferrals, rejected interpretations, owner
decisions, and expiry trigger are recorded in
[`../release/2026-08-31-controlled-readiness.md`](../release/2026-08-31-controlled-readiness.md).

## Validation result for this record

The current revision passed the following mechanical checks:

| Check | Result |
|---|---|
| `node scripts/validate-registry.mjs` | PASS — 22 registry entries verified |
| `node --test tests/registry.test.mjs` | PASS — 21 tests |
| `node scripts/validate-conformance.mjs` | PASS — four forms, six nodes, six edges, and two flows |
| `node --test tests/conformance.test.mjs` | PASS — 9 tests |
| `node --test tests/skill-library-audit.test.mjs` | PASS — 2 tests |
| `python3 .agents/skills/okhp3-skill-cataloger/scripts/gen-skills-readme.py --skills-dir .agents/skills --check` | PASS — 40 packages; advisory warnings retained |
| `node .agents/skills/okhp3-skill-foundry/scripts/validate-skill-suite.cjs --skills-dir .agents/skills` | PASS — 40 packages validated |
| `git diff --check` | PASS |

These checks are a mechanical floor, not a publication or maturity verdict.
The conformance and skill checks validate fixtures and package structure, not
runtime behavior or task-quality uplift. No external provider, renderer, organ,
client, protected holdout, or domain-specialist review was available.