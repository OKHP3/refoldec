# Local Skill Library Maturity Report

**Review date:** 2026-08-22  
**Inventory:** 40 direct child packages under `.agents/skills/`  
**Evidence status:** analytical / structural; live task-quality benchmark not run.

## Inventory result

All 40 packages have a discoverable `SKILL.md`, a valid directory name, and
resolvable local references under the Foundry structural validator. The catalog
was regenerated from source rather than hand-edited.

| Dimension | Result | Evidence |
|---|---|---|
| Package discovery | PASS | `.agents/skills/.catalog-meta.json` reports 40 |
| Catalog generation | PASS | `gen-skills-readme.py --check` |
| Portable metadata | PASS | All 40 cataloged packages now declare version metadata |
| Resource paths | PASS | `validate-skill-suite.cjs --skills-dir .agents/skills` |
| Package checks | PASS where present | Package-local Node/Python tests |
| Normal/edge/safety evaluation design | PARTIAL | Present for reviewed evaluation-bearing packages; not uniform across all packages |
| Live matched benchmark | NOT RUN | No isolated executor and protected holdout recorded |
| Public uplift claim | BLOCKED | Structural health is not task-quality evidence |

## Version normalization

`architecture-decision-records` and `frontend-design` were the only catalog
warnings for missing version metadata; both frontmatter blocks are now
normalized. This is metadata normalization, not a quality claim or benchmark
result.

## Release posture

The library is **approved as a checked-in candidate collection with limits**.
Each skill remains subject to its own trigger boundary, host capability checks,
and safety instructions. No claim is made that the collection improves agent
outcomes until current-version treatment/control runs use a fresh protected
holdout and independent grading.

## Remaining gates

1. Add or verify at least one normal, one edge, and one unsafe/out-of-scope case
   for every skill that performs external reads, scripts, or writes.
2. Freeze hashes, fixtures, host, model settings, and grader rubric for a
   version-matched benchmark.
3. Run the benchmark outside the optimizer context and replace any exposed
   holdout.
