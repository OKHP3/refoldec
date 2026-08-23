#!/usr/bin/env node
/**
 * Dependency-free fixture conformance validator.
 * This validates the contract fixture; it is not a codec runtime.
 */
import fs from "node:fs";
import assert from "node:assert/strict";

const fixture = JSON.parse(fs.readFileSync("docs/conformance/fixture.json", "utf8"));
const nodeIds = new Set(fixture.nodes.map((node) => node.id));
assert.equal(fixture.schema_version, "1.0");
assert.equal(fixture.nodes.length, 6);
assert.equal(fixture.edges.length, 6);
assert.equal(fixture.flows.length, 2);
assert.deepEqual(fixture.representations, ["Diagram", "Code", "Documentation", "Agent-Executable"]);
for (const node of fixture.nodes) {
  assert.match(node.id, /^[a-z][a-z0-9-]+$/);
  assert.ok(node.semantic_role);
  assert.ok(node.label);
}
for (const edge of fixture.edges) {
  assert.ok(nodeIds.has(edge.from), `unknown edge source: ${edge.from}`);
  assert.ok(nodeIds.has(edge.to), `unknown edge target: ${edge.to}`);
  assert.ok(edge.relationship);
}
for (const flow of fixture.flows) {
  assert.ok(nodeIds.has(flow.source));
  assert.ok(nodeIds.has(flow.target));
  assert.ok(flow.condition);
}
console.log(`Conformance fixture PASSED — ${fixture.nodes.length} nodes, ${fixture.edges.length} edges, ${fixture.flows.length} flows.`);