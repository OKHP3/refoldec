#!/usr/bin/env node
/**
 * Dependency-free fixture conformance validator.
 * This validates the contract fixture; it is not a codec runtime.
 */
import fs from "node:fs";
import assert from "node:assert/strict";

const fixture = JSON.parse(fs.readFileSync("docs/conformance/fixture.json", "utf8"));
const representationNames = ["Diagram", "Code", "Documentation", "Agent-Executable"];
const loopStageMapping = {
  idea: null,
  text: null,
  structure: null,
  diagram: "Diagram",
  code: "Code",
  documentation: "Documentation",
  "agent instruction": "Agent-Executable",
  "reusable artifact": null,
};
const projectionKeys = ["nodes", "edges", "flows", "governance"];
const governanceKeys = ["artifact_version", "owner", "status", "applicable_context"];

assert.deepEqual(fixture.contract, {
  id: "refoldec-fold-contract",
  version: "1.0.0",
});
assert.equal(fixture.schema_version, "1.1");
assert.equal(fixture.fixture_id, "synthetic-access-request");
assert.deepEqual(Object.keys(fixture.representations), representationNames);
assert.deepEqual(Object.keys(fixture.canonical_projection), projectionKeys);
assert.deepEqual(
  Object.values(loopStageMapping).filter(Boolean),
  representationNames,
  "core-loop mapping must resolve to the four canonical forms"
);
for (const stage of Object.entries(loopStageMapping)
  .filter(([, form]) => form === null)
  .map(([stage]) => stage)) {
  assert.equal(
    fixture.representations[stage],
    undefined,
    `explanatory loop stage must not be a fixture representation: ${stage}`
  );
}

function validateProjection(projection, label) {
  assert.deepEqual(Object.keys(projection), projectionKeys, `${label}: projection keys`);
  assert.equal(projection.nodes.length, 6, `${label}: node count`);
  assert.equal(projection.edges.length, 6, `${label}: edge count`);
  assert.equal(projection.flows.length, 2, `${label}: flow count`);
  assert.deepEqual(Object.keys(projection.governance), governanceKeys, `${label}: governance keys`);

  const nodeIds = new Set();
  for (const node of projection.nodes) {
    assert.match(node.id, /^[a-z][a-z0-9-]+$/, `${label}: invalid node ID`);
    assert.ok(!nodeIds.has(node.id), `${label}: duplicate node ID ${node.id}`);
    nodeIds.add(node.id);
    assert.match(node.semantic_role, /^[a-z][a-z0-9-]+$/, `${label}: invalid semantic role`);
  }
  for (const edge of projection.edges) {
    assert.ok(nodeIds.has(edge.from), `${label}: unknown edge source ${edge.from}`);
    assert.ok(nodeIds.has(edge.to), `${label}: unknown edge target ${edge.to}`);
    assert.match(edge.relationship, /^[a-z][a-z0-9-]+$/, `${label}: invalid relationship`);
  }
  const branchIds = new Set();
  for (const flow of projection.flows) {
    assert.ok(!branchIds.has(flow.branch_id), `${label}: duplicate branch ID ${flow.branch_id}`);
    branchIds.add(flow.branch_id);
    assert.ok(nodeIds.has(flow.source), `${label}: unknown flow source ${flow.source}`);
    assert.ok(nodeIds.has(flow.target), `${label}: unknown flow target ${flow.target}`);
    assert.ok(flow.condition, `${label}: empty flow condition`);
  }
  for (const key of governanceKeys) {
    assert.equal(typeof projection.governance[key], "string", `${label}: governance.${key}`);
    assert.ok(projection.governance[key], `${label}: empty governance.${key}`);
  }
}

validateProjection(fixture.canonical_projection, "canonical projection");
for (const name of representationNames) {
  const form = fixture.representations[name];
  assert.ok(form.format, `${name}: missing format`);
  assert.ok(form.payload, `${name}: missing payload`);
  validateProjection(form.projection, `${name} projection`);
  assert.deepEqual(
    form.projection,
    fixture.canonical_projection,
    `${name}: projection differs from canonical fixture`
  );
}

console.log(
  `Conformance fixture PASSED — ${fixture.canonical_projection.nodes.length} nodes, ` +
    `${fixture.canonical_projection.edges.length} edges, ` +
    `${fixture.canonical_projection.flows.length} flows across ${representationNames.length} forms.`
);