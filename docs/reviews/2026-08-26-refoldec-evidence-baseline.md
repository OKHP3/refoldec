# ReFolDec Evidence Baseline

> Review date: 2026-08-26
> Review protocol: `equilibrium-v1`
> Overall decision: **approve-with-limits**

## 1. Frozen review boundary

### Artifact and version

This review assesses the ReFolDec repository as a specification, contract, and
documentation project. The frozen repository version is:

- Git commit: `54b95450b871dcbd02e8e74974e24400a481c746`
- Commit date: 2026-08-03T22:13:23Z
- Review date: 2026-08-26 (America/Chicago)
- Working tree at freeze: clean
- Artifact identity: the repository tree at the commit above, excluding this
  review record and any later changes

The exact source hashes and the command evidence are recorded in the companion
machine-readable record:
[`2026-08-26-refoldec-evidence-baseline.json`](./2026-08-26-refoldec-evidence-baseline.json).

### Artifact scope

The review covers:

- `README.md`
- `AGENTS.md`
- `ARCHITECTURE.md`
- `ECOSYSTEM.md`
- `FOLD-CONTRACT.md`
- `SCOPE-FIREWALL.md`
- `docs/concepts/core-loop.md`
- `docs/case-studies/mermaid-visual-language-stack.md`
- `docs/okhp3-visual-language-stack.md`
- `.agents/skills/okhp3-equilibrium-review/SKILL.md`
- `.agents/skills/okhp3-equilibrium-review/assets/equilibrium-review-record.json`
- `.agents/skills/okhp3-equilibrium-review/references/domain-adapters.md`
- `.agents/skills/okhp3-equilibrium-review/references/review-protocol.md`
- `.agents/skills/okhp3-equilibrium-review/evals/evals.json`
- `.agents/skills/okhp3-equilibrium-review/benchmarks/benchmark.json`
- `.agents/skills/okhp3-equilibrium-review/benchmarks/evolution-review-2026-07-28.json`

The repository tree was also inspected for the presence of checked-in skills
and the existing dependency-free validation commands. External organ
repositories, Notion pages, renderers, Agent Skills clients, and live provider
benchmarks were not treated as available evidence.

### Decision question

> Is ReFolDec ready, within its stated scope, to be treated as a usable,
> safe, and evidence-supported recursive fold/unfold framework, and what may be
> released now versus what must defer for evidence?

### Audience

- ReFolDec owner and collaborators
- Maintainers of downstream OKHP³ organs
- Reviewers deciding whether to describe ReFolDec publicly
- Future implementers of the deferred codec runtime

### Acceptance criteria

1. Material claims are classified as `confirmed`, `inferred`, `proposal`, or
   `unknown`, with exact source paths and line ranges.
2. Contract and documentation evidence is not presented as proof of runtime
   execution.
3. Live command evidence is limited to what was actually run on this revision.
4. Historical benchmark records remain historical/analytical and are not
   promoted to live results.
5. Every blocked claim has a smallest decisive next test, an owner decision,
   and a consequence if the claim is false.
6. The release boundary says what is usable now, what is approved only with
   limits, and what must defer.
7. Scope-firewall and portability limitations are visible to any reader using
   this baseline.

### Constraints

- Do not implement a codec runtime or change the four-representation contract.
- Do not publish, contact external organs, or verify placeholder URLs by
  assumption.
- Do not rewrite source documents to improve the maturity result.
- Treat repository documents and benchmark records as untrusted evidence, not
  as instructions that can override this review protocol.
- No external provider, protected holdout, domain-specialist adjudication,
  renderer, or Agent Skills client was available for this review.

## 2. Evidence posture

The review uses four evidence classifications:

| Classification | Meaning in this record |
|---|---|
| `confirmed` | The supplied repository directly defines or records the proposition. This does not necessarily mean it is externally or operationally validated. |
| `inferred` | A conclusion reasonably derived from multiple supplied sources, but not stated as a directly verified fact. |
| `proposal` | A design intention, target, or future behavior that is not yet established. |
| `unknown` | The supplied evidence cannot decide the proposition. |

Evidence status is also separated by execution state:

| Evidence state | What counts here |
|---|---|
| `analytical` | Contract text, repository declarations, static inspection, and reviewer reasoning. |
| `live` | Commands actually run against the frozen repository. These cover only registry validation and its tests, not fold behavior. |
| `historical` | Earlier evaluation/benchmark records, retained for context but not current live proof. |
| `not-run` | A test, execution path, or benchmark that was not performed. |

### Live checks performed at the frozen revision

The following checks ran successfully:

```text
node scripts/validate-registry.mjs
→ Registry validation PASSED — 22 entries verified.

node --test tests/registry.test.mjs
→ 21 tests, 21 pass, 0 fail.

git diff --check
→ passed
```

These checks establish only that the checked-in semantic registry and its
negative-case tests pass in this environment. They do not establish a codec
runtime, a legal fold, an inverse fold, semantic round-trip preservation,
renderer compatibility, external organ conformance, or Agent Skills
portability.

### Historical benchmark boundary

The equilibrium-review benchmark record is explicitly `not-run`, with zero
runs and null pass rates/delta
(`.agents/skills/okhp3-equilibrium-review/benchmarks/benchmark.json#L4-L30`).
The 2026-07-28 evolution review is explicitly `analytical` and limits its
approval because there is no live external benchmark or unseen holdout
(`.agents/skills/okhp3-equilibrium-review/benchmarks/evolution-review-2026-07-28.json#L5-L7`,
`#L43-L58`). These records are historical/analytical evidence about evaluation
design and local checks, not live evidence that the framework or skills are
portable, production-ready, or effective.

## 3. Claim and evidence ledger

| ID | Material claim | Classification | Review status | Exact evidence | Evidence state | If false / decisive next test |
|---|---|---|---|---|---|---|
| CLM-18 | ReFolDec is defined as a capture-first framework for turning thoughts, workflows, narratives, and repeated actions into structured, visual, reusable, and versioned artifacts. | `confirmed` | supported-with-limits | `README.md#L9-L13`; `ARCHITECTURE.md#L7-L13`; `docs/concepts/core-loop.md#L65-L82` | analytical definition, not outcome evidence | If false, the public positioning overstates the repository’s actual concern. **Next test:** trace one owner-authorized input through the claimed artifact types and record outputs and limitations. |
| CLM-19 | Meaning can move recursively between representations without loss of semantic continuity. | `proposal` | provisional | `FOLD-CONTRACT.md#L8-L12`, `#L174-L194`; `docs/concepts/core-loop.md#L3-L7`, `#L76-L82` | analytical thesis; practical test not-run | If false, the central recursive codec thesis fails for at least one transformation. **Owner decision:** present this as a design thesis, not an observed result. **Next test:** execute the invariant-preserving fixture loop described for CLM-07. |
| CLM-01 | ReFolDec is a Git-backed specification/contract repository and does not currently contain an application runtime. | `confirmed` | supported | `AGENTS.md#L18-L25`, `#L85-L98`; `ECOSYSTEM.md#L132-L135`; `README.md#L134-L136` | analytical | If false, users could mistake prose contracts for an executable codec. **Next test:** inspect the frozen tree and run the declared checks; no runtime claim may be made unless an actual runtime surface is found and tested. |
| CLM-02 | ReFolDec defines a bidirectional model: xME is maturation/fold, xIE is inversion/unfold, and xMIE is the combined mechanic. | `confirmed` | supported | `README.md#L17-L24`; `ARCHITECTURE.md#L17-L47`; `docs/concepts/core-loop.md#L29-L61` | analytical | If false, the shared vocabulary cannot coordinate downstream organs. **Next test:** compare each organ’s terminology against the canonical vocabulary. |
| CLM-03 | There are exactly four canonical representations: `Diagram`, `Code`, `Documentation`, and `Agent-Executable`. | `confirmed` | supported | `FOLD-CONTRACT.md#L16-L20`, `#L22-L100`; `AGENTS.md#L50-L50` | analytical | If false, inter-organ transformations may use incompatible representation sets. **Next test:** static conformance scan of organ contracts and artifacts for undeclared canonical representations. |
| CLM-04 | The head-and-organs model, ownership boundaries, source-of-truth rule, and conformance rules are defined. | `confirmed` | supported | `ECOSYSTEM.md#L8-L10`, `#L37-L59`, `#L63-L93`; `ARCHITECTURE.md#L158-L185` | analytical | If false, downstream projects may redefine shared vocabulary or cross fold boundaries. **Next test:** obtain owner-authorized snapshots of each organ contract and compare them to the head. |
| CLM-05 | The contract enumerates legal reversible fold pairs and explicitly defers direct `Diagram ↔ Agent-Executable` folds. | `confirmed` | supported | `FOLD-CONTRACT.md#L104-L134` | analytical | If false, implementers may expose unsupported transformations. **Next test:** scan organ implementations for undeclared direct folds and require a contract revision before accepting any. |
| CLM-06 | Losslessness is defined as preservation of semantic roles, node identity, edge topology, flow relationships, and governance tags; layout, palette binding, and prose style may vary. | `confirmed` | supported | `FOLD-CONTRACT.md#L138-L171` | analytical | If false, different organs could preserve different meanings. **Next test:** use one shared fixture to compare all five invariant classes before and after each legal fold. |
| CLM-07 | ReFolDec currently demonstrates practical lossless and reversible folds with successful round trips. | `unknown` | blocked | The contract makes this a criterion at `FOLD-CONTRACT.md#L174-L194`, but says programmatic testing is deferred at `#L196-L204`; runtime is deferred at `ECOSYSTEM.md#L132-L135`. | not-run | If false, a claimed “lossless” fold can silently change meaning. **Owner decision:** keep all practical lossless/round-trip claims deferred. **Next test:** freeze one fixture per legal fold, execute fold and inverse, and compare all invariants. |
| CLM-08 | The documented case study is evidence that one complete fold/unfold loop has run. | `unknown` | blocked | The case study labels itself representative and not a specific event at `docs/case-studies/mermaid-visual-language-stack.md#L3-L7`; it describes expected outputs at `#L21-L30`, `#L48-L62`, `#L66-L75`, `#L124-L154`. | not-run | If false, public readers may mistake an illustrative scenario for empirical proof. **Owner decision:** label it illustrative until a fixture is archived. **Next test:** provide raw input, every intermediate artifact, final `SKILL.md`, cross-representation IDs/tags, hashes, and a successful unfold/refold comparison. |
| CLM-09 | The eight-stage core loop and the four-representation contract are already one internally aligned formal model. | `unknown` | blocked | Four representations are exhaustive at `FOLD-CONTRACT.md#L16-L20`; the core loop separately names eight stages at `docs/concepts/core-loop.md#L11-L25` and transitions at `#L35-L61`; the case study numbers nine stages at `docs/case-studies/mermaid-visual-language-stack.md#L23-L154`. | analytical | If false, implementers cannot know whether idea, text, structure, and reusable artifact are canonical representations or explanatory states. **Owner decision:** defer claims of a single coherent formal loop until the mapping is resolved. **Next test:** publish a normative mapping for every stage and transition, then verify it against the legal-fold table and one fixture. |
| CLM-10 | Process Skills are defined as executable capture workflows and checked-in local skills exist. | `confirmed` | supported-with-limits | `ARCHITECTURE.md#L65-L77`; `AGENTS.md#L22-L25`, `#L77-L80`; `.agents/skills/okhp3-equilibrium-review/SKILL.md#L37-L43` | analytical plus live tree inspection | If false, the executable-plane description overstates the repository’s current contents. **Next test:** validate each checked-in skill against its own trigger, output, safety, and portability criteria. |
| CLM-11 | The local equilibrium-review skill and its evaluation materials prove portable, effective, production-ready agent execution. | `unknown` | blocked | Portability/evaluation requirements are stated at `.agents/skills/okhp3-equilibrium-review/references/domain-adapters.md#L38-L42`; evaluation is `design-ready` with external holdout required at `.agents/skills/okhp3-equilibrium-review/evals/evals.json#L2-L6`; benchmark is not-run at `benchmarks/benchmark.json#L4-L30`; evolution review limits approval at `benchmarks/evolution-review-2026-07-28.json#L43-L58`. | historical and analytical; no live provider run | If false, users may rely on a skill that activates poorly or handles untrusted input unsafely. **Owner decision:** approve local analytical use only, with no portability/uplift/production claim. **Next test:** matched live evaluations across separated clients or model families, including an unseen holdout and human/domain-specialist grading. |
| CLM-12 | The semantic-class registry is a color-agnostic, validated meaning axis for downstream organs. | `confirmed` | supported-with-limits | Registry purpose and color boundary at `semantic-class-registry/SEMANTIC-CLASSES.md#L9-L16`; live validator result: 22 entries; `scripts/validate-registry.mjs`; `tests/registry.test.mjs` | live for registry only; analytical for organ use | If false, role meaning and palette governance may drift. **Next test:** require organ parity checks and verify downstream consumers bind tokens without redefining roles. |
| CLM-13 | The scope firewall defines publication and privacy boundaries for the ecosystem. | `confirmed` | supported-with-limits | `SCOPE-FIREWALL.md#L8-L13`, `#L16-L53`, `#L57-L95`, `#L110-L114` | analytical | If false, private or proprietary material could enter shared assets. **Next test:** apply the checklist to each frozen release tree. |
| CLM-14 | The complete repository is proven safe and publication-ready by the scope firewall. | `unknown` | blocked | The firewall says registry checks are automated but all other controls are convention/review at `SCOPE-FIREWALL.md#L99-L101`; no repository-wide scan result is recorded. Placeholder/planned material is acknowledged at `AGENTS.md#L25-L25`, `#L122-L127`. | not-run | If false, a public release could expose prohibited content or misleading references. **Owner decision:** do not treat policy presence as a whole-tree clearance. **Next test:** freeze the release tree, run a repository-wide sensitive-content/reference scan, and independently inspect every flagged result and checklist item. |
| CLM-15 | The organ pointer table and external links are authoritative and verified. | `unknown` | blocked | The table explicitly marks organ URLs as placeholders at `ECOSYSTEM.md#L115-L128`; public links appear at `README.md#L157-L161`. | not-run | If false, readers may be sent to nonexistent or unauthorized destinations. **Owner decision:** retain `[placeholder]` and do not call links verified. **Next test:** owner-authorized URL and repository checks, recorded with retrieval dates. |
| CLM-16 | Downstream organs conform to ReFolDec contracts and the active/lineage statuses in the ecosystem map are current. | `unknown` | blocked | The head’s conformance rules are analytical at `ECOSYSTEM.md#L79-L93`; organ status is documented at `ARCHITECTURE.md#L171-L185`, while pointers are placeholders at `ECOSYSTEM.md#L115-L128`. | not-run | If false, the head may describe an ecosystem that has drifted or does not exist as stated. **Owner decision:** treat organ conformance and status as unverified until source snapshots are available. **Next test:** compare current owner-authorized organ artifacts and record parity/conformance results. |
| CLM-17 | The repository’s current validation surface supports the narrow specification baseline. | `confirmed` | supported-with-limits | Declared checks and limitations at `AGENTS.md#L85-L98`; live run passed `scripts/validate-registry.mjs`, `tests/registry.test.mjs`, and `git diff --check`. | live, narrow scope | If false, even the documentation/registry baseline is not mechanically healthy. **Next test:** rerun these checks on every baseline revision and add contract-specific checks only through approved scope. |

## 4. Independent review passes

The evidence, outcome, and safety/portability passes were run separately with
separate role prompts and contexts. They all used the same local, self-authored
source set, and the model family was not independently known. Their agreement
is therefore correlated consistency, not independent corroboration.

### Evidence reviewer — analytical

Converged that the repository directly supports the framework vocabulary,
four-representation contract, legal-fold table, invariant definitions,
ecosystem ownership rules, and scope-firewall policy. It found no live evidence
for practical reversibility, round trips, organ conformance, or skill
portability. It recommended `approve-with-limits` for the specification baseline
and deferral of operational claims.

### Outcome reviewer — analytical

Converged that the repository is useful as a head-canon/specification and as a
reference for future organ work. It found that the representative case study
does not meet the burden of a completed proof case, and that public readers
need an explicit distinction between intended mechanics and demonstrated
behavior. It recommended limiting current use to documentation, contract
review, registry maintenance, and planning.

### Safety and portability reviewer — analytical

Converged that the scope firewall is a useful policy but not a whole-tree
clearance, that placeholder URLs must remain unverified, and that runtime
assumptions are not client compatibility evidence. It recommended no release
claim for production, portability, external conformance, or repository-wide
publication safety without additional checks.

### Shared-source limitation

All three passes read substantially the same repository documents, and the
equilibrium skill’s own records were among the reviewed sources. No independent
external source, live fold executor, external Agent Skills provider, protected
holdout, renderer, or domain-specialist adjudication was available. This
limitation weakens apparent reviewer agreement and is itself part of the
decision boundary.

## 5. Narrow disruptor pass

The initial reviews materially agreed on the narrow specification baseline, so
the conditional disruptor was triggered. It tested five strongest apparent
maturity claims:

1. **Legal-fold definitions imply practical reversibility.**
   Survives as an objection: the contract defines the condition, while
   programmatic testing and the runtime are deferred
   (`FOLD-CONTRACT.md#L196-L204`; `ECOSYSTEM.md#L132-L135`).

2. **The case study proves one complete loop.**
   Survives: the case study is explicitly representative, not a record of a
   specific event (`docs/case-studies/mermaid-visual-language-stack.md#L3-L7`).

3. **Skill evaluation materials prove portability or readiness.**
   Survives: the evaluation is design-ready/external-required and the benchmark
   has no runs (`.agents/skills/okhp3-equilibrium-review/evals/evals.json#L2-L6`;
   `benchmarks/benchmark.json#L4-L30`).

4. **The scope firewall proves whole-repository publication safety.**
   Survives: only registry color checks are automated; other controls remain
   human review items (`SCOPE-FIREWALL.md#L99-L101`).

5. **The four-representation contract and eight-stage loop are already aligned.**
   Survives strongly: the core loop includes states and transitions not
   represented in the exhaustive four-representation contract
   (`FOLD-CONTRACT.md#L16-L20`; `docs/concepts/core-loop.md#L11-L25`).

Each surviving objection has a decisive test in the claim ledger. A failed
disruptor test would record a falsification attempt; it would not prove
perfection.

## 6. Negotiated baseline decision

### Decision

**Approve-with-limits** the frozen repository as an **analytical
specification/head-canon baseline**.

This decision does not approve ReFolDec as an implemented codec, a
lossless/round-tripping runtime, a completed fold loop, a portable production
skill system, a conforming multi-repository ecosystem, or a repository-wide
publication clearance.

### Usable now

- Read and cite the framework vocabulary, planes, mechanics, and ownership
  boundaries as repository-defined analytical concepts.
- Maintain the semantic registry and run its dependency-free validator/tests.
- Use the contracts to design downstream work and identify where a contract
  revision is needed.
- Use the checked-in Process Skills and equilibrium-review materials as local
  analytical instructions when their runtime assumptions and limits are
  visible.
- Use the case study as an illustrative design narrative, not an empirical
  demonstration.

### Approved with limits

- Publicly describe ReFolDec as a specification and bidirectional
  process-capture framework, with the repository’s disclaimer and deferred
  runtime status.
- Present the fold table and lossless criteria as normative design intent.
- Share the registry and firewall as controlled governance artifacts, while
  making clear that the firewall is not an automated whole-tree scan.
- Discuss the historical skill evaluation records only as analytical,
  design-ready, or not-run evidence.

### Must defer for evidence

- “Lossless,” “reversible,” or “round-trip proven” as an operational result.
- “One complete fold loop has been demonstrated.”
- Direct `Diagram ↔ Agent-Executable` folds, which the contract defers.
- Skill portability, uplift, production readiness, or general task-quality
  claims.
- External organ conformance, current organ status, and placeholder URL
  verification.
- Whole-repository publication safety or privacy clearance.
- Any codec runtime/orchestrator readiness claim.

### Unresolved owner decisions

1. Decide whether `idea`, `text`, `structure`, and `reusable artifact` in the
   core loop are explanatory states or require canonical contract status.
2. Confirm the intended public status and rights for lineage names and
   externally referenced projects before treating them as authoritative.
3. Authorize current external URL and organ-conformance checks.
4. Choose and freeze the first round-trip fixture set and the protected
   evaluation holdout.

### Review-expiry trigger

This baseline expires on **2026-09-26** or earlier when any of the following
occurs: a contract or representation changes; a codec/runtime surface is
introduced; a public proof-of-concept is published; a downstream organ is
declared conforming; the skill evaluation version or benchmark changes; or a
release tree gains new external links or sensitive-content risk. Any trigger
requires a new frozen record rather than silently updating this one.
