import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const workflow = fs.readFileSync(
  ".github/workflows/technology-freshness.yml",
  "utf8"
);
const postMergeSetup = fs.readFileSync("scripts/post-merge-setup.sh", "utf8");

test("technology freshness workflow covers pushes and pull requests", () => {
  const triggers = workflow.match(/^on:\s*\n((?:[ \t]+[^\n]*\n)*)/m)?.[1] ?? "";

  assert.match(triggers, /^[ \t]+push:\s*$/m);
  assert.match(triggers, /^[ \t]+pull_request:\s*$/m);
  assert.match(
    workflow,
    /^[ \t]+run:\s*bash scripts\/post-merge-setup\.sh\s*$/m,
    "workflow must run the repository post-merge checks"
  );
});

test("post-merge checks keep inventory and evaluation freshness separate", () => {
  const inventoryCommand = "node scripts/audit-skill-library.mjs --check";
  const evaluationCommand =
    '"$REFOLDEC_PYTHON" scripts/generate-skill-library-evaluation-view.py --check';
  const lines = postMergeSetup.split(/\r?\n/).map((line) => line.trim());

  assert.equal(
    lines.filter((line) => line === inventoryCommand).length,
    1,
    "inventory freshness must run exactly once as its own check"
  );
  assert.equal(
    lines.filter((line) => line === evaluationCommand).length,
    1,
    "evaluation-evidence freshness must run exactly once as its own check"
  );
  assert.notEqual(
    lines.indexOf(inventoryCommand),
    lines.indexOf(evaluationCommand),
    "freshness checks must remain separate commands"
  );
});
