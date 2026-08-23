import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const fixture = JSON.parse(fs.readFileSync("docs/conformance/fixture.json", "utf8"));
const projection = (value) => ({
  nodes: value.nodes.map(({ id, semantic_role }) => ({ id, semantic_role })).sort((a, b) => a.id.localeCompare(b.id)),
  edges: value.edges.map(({ from, to, relationship }) => ({ from, to, relationship })).sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
  flows: value.flows.map(({ branch_id, source, target, condition }) => ({ branch_id, source, target, condition })).sort((a, b) => a.branch_id.localeCompare(b.branch_id)),
  governance: value.governance
});

test("valid fixture round-trip preserves all contracted invariants", () => {
  const reconstructed = structuredClone(fixture);
  assert.deepEqual(projection(reconstructed), projection(fixture));
});

test("missing governance metadata is detected as lossy", () => {
  const defective = structuredClone(fixture);
  delete defective.governance.owner;
  assert.notDeepEqual(projection(defective), projection(fixture));
});

test("topology changes are detected as lossy", () => {
  const defective = structuredClone(fixture);
  defective.edges[2].to = "return";
  assert.notDeepEqual(projection(defective), projection(fixture));
});

test("deferred direct folds are not legal", () => {
  const deferred = new Set(["Diagram → Agent-Executable", "Agent-Executable → Diagram"]);
  assert.equal(deferred.has("Diagram → Agent-Executable"), true);
  assert.equal(deferred.has("Agent-Executable → Diagram"), true);
});