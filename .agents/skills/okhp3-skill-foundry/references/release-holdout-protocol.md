# Protected release holdout protocol

This protocol makes a live release check reproducible without packaging an
unseen fixture in the optimizing repository. It is an execution handoff, not a
fixture generator and not evidence that a holdout has already run.

## Roles and separation

1. An authorized release executor, outside the optimizing author's context,
   receives one unseen fixture and an authorization reference. The executor
   must not return the fixture to the author or commit it to the repository.
2. Run `prepare` with the external fixture. The resulting record contains only
   the fixture identifier and SHA-256, never its path or contents.
3. In separate executor contexts, run `with_skill` first and `without_skill`
   second. Use the frozen version, skill-file hashes, rubric, tool
   availability, model/host settings, treatment order, and session identity
   copied from `benchmarks/benchmark.json`. The without-skill context must not
   inspect the target package. Record both context identifiers and these
   settings in an external run-settings file.
4. A separate blinded grader receives the two response artifacts and the
   unseen rubric. Its input contains expectation identifiers, binary results,
   and concise verbatim evidence, but not expectation text or prompts. The
   grader supplies all four evidence boundaries: confirmed, inferred, proposed,
   and unknown.
5. `grade` records response hashes and appends both configurations' verbatim
   evidence. It does not copy either response or the fixture into release
   evidence. Validate the completed record before review.

Example commands (run from the repository root; external paths are illustrative):

```text
node .agents/skills/okhp3-skill-foundry/scripts/run-release-holdout.cjs prepare \
  --fixture /secure/holdouts/foundry-2026-09-a.json \
  --fixture-id foundry-2026-09-a \
  --executor-id authorized-release-executor \
  --authorization-ref release-approval-2026-09 \
  --output /secure/release-evidence/prepared.json
```

```text
node .agents/skills/okhp3-skill-foundry/scripts/run-release-holdout.cjs grade \
  --manifest /secure/release-evidence/prepared.json \
  --grader-input /secure/grader/blinded-grading.json \
  --with-response /secure/responses/with-skill.txt \
  --without-response /secure/responses/without-skill.txt \
  --run-settings /secure/executor/run-settings.json \
  --grader-id separate-blinded-grader \
  --authorization-ref grading-approval-2026-09 \
  --output /secure/release-evidence/holdout-run.json
```

## Exposure and replacement

If the fixture, a response that reveals it, or grader material is exposed to
the optimizer, do not continue optimization or reuse the fixture. Record the
old fixture identifier and hash with `exposure`, supply a newly identified
external fixture, and start a new preparation record. The replacement hash is
recorded without copying replacement contents.

```text
node .agents/skills/okhp3-skill-foundry/scripts/run-release-holdout.cjs exposure \
  --manifest /secure/release-evidence/prepared.json \
  --reason "fixture was visible in an optimizer-accessible log" \
  --replacement-fixture /secure/holdouts/foundry-2026-09-b.json \
  --replacement-id foundry-2026-09-b \
  --executor-id authorized-release-executor \
  --authorization-ref replacement-approval-2026-09 \
  --output /secure/release-evidence/exposure.json
```

The existing checked-in attempt remains `not-run` until these roles and inputs
are actually available. A preparation record is not a performance result.