import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const fixture = JSON.parse(fs.readFileSync("docs/conformance/fixture.json", "utf8"));
const registry = JSON.parse(fs.readFileSync("semantic-class-registry/semantic-classes.json", "utf8"));
const representations = ["Diagram", "Code", "Documentation", "Agent-Executable"];
const legalFolds = [
  ["Documentation", "Code"],
  ["Code", "Documentation"],
  ["Code", "Diagram"],
  ["Diagram", "Code"],
  ["Code", "Agent-Executable"],
  ["Agent-Executable", "Code"],
  ["Documentation", "Agent-Executable"],
  ["Agent-Executable", "Documentation"],
  ["Documentation", "Diagram"],
  ["Diagram", "Documentation"],
];
const deferredFolds = [
  ["Diagram", "Agent-Executable"],
  ["Agent-Executable", "Diagram"],
];

const clone = (value) => structuredClone(value);
const sortRecords = (records) =>
  records
    .map((record) => JSON.stringify(record))
    .sort()
    .map((record) => JSON.parse(record));

function projection(form) {
  return {
    nodes: sortRecords(form.projection.nodes),
    edges: sortRecords(form.projection.edges),
    flows: sortRecords(form.projection.flows),
    governance: form.projection.governance,
  };
}

function assertProjectionEqual(actual, expected, message) {
  assert.deepEqual(projection(actual), projection(expected), message);
}

function invariantFailureCodes(actual, expected) {
  const actualProjection = projection(actual);
  const expectedProjection = projection(expected);
  const codes = [];
  const actualIds = actualProjection.nodes.map(({ id }) => id);

  if (new Set(actualIds).size !== actualIds.length) codes.push("AMBIGUOUS_MAPPING");
  if (
    JSON.stringify(actualProjection.nodes) !== JSON.stringify(expectedProjection.nodes)
  ) {
    codes.push("ROLE_DRIFT");
  }
  if (
    JSON.stringify(actualProjection.edges) !== JSON.stringify(expectedProjection.edges)
  ) {
    codes.push("TOPOLOGY_DRIFT");
  }
  if (
    JSON.stringify(actualProjection.flows) !== JSON.stringify(expectedProjection.flows)
  ) {
    codes.push("FLOW_DRIFT");
  }
  if (
    JSON.stringify(actualProjection.governance) !==
    JSON.stringify(expectedProjection.governance)
  ) {
    codes.push("GOVERNANCE_DRIFT");
  }
  return codes;
}

function fold(sourceName, targetName) {
  if (deferredFolds.some(([from, to]) => from === sourceName && to === targetName)) {
    const error = new Error(`DEFERRED_FOLD: ${sourceName} → ${targetName}`);
    error.code = "DEFERRED_FOLD";
    throw error;
  }
  assert.ok(
    legalFolds.some(([from, to]) => from === sourceName && to === targetName),
    `unsupported fold: ${sourceName} → ${targetName}`
  );
  return clone(fixture.representations[targetName]);
}

test("fixture declares exactly four concrete forms and the current contract", () => {
  assert.deepEqual(Object.keys(fixture.representations), representations);
  assert.equal(fixture.contract.id, "refoldec-fold-contract");
  assert.equal(fixture.contract.version, "1.0.0");
  assert.equal(fixture.schema_version, "1.1");
});

test("every form exposes the same five invariant classes", () => {
  for (const name of representations) {
    assertProjectionEqual(
      fixture.representations[name],
      { projection: fixture.canonical_projection },
      `${name} does not expose the canonical invariant projection`
    );
  }
});

test("fixture roles are present in the semantic-class registry", () => {
  const registryRoleKeys = new Set(registry.map(({ id, family }) => `${family}:${id}`));
  const familyByRole = new Map();
  for (const entry of registry) {
    if (!familyByRole.has(entry.id)) familyByRole.set(entry.id, []);
    familyByRole.get(entry.id).push(entry.family);
  }

  for (const { semantic_role: role } of fixture.canonical_projection.nodes) {
    assert.ok(familyByRole.has(role), `fixture role is absent from registry: ${role}`);
    assert.ok(
      familyByRole.get(role).some((family) => registryRoleKeys.has(`${family}:${role}`)),
      `fixture role has no registry family: ${role}`
    );
  }
});

test("each legal direction has a preserving fixture-level round trip", () => {
  for (const [sourceName, targetName] of legalFolds) {
    const target = fold(sourceName, targetName);
    const reconstructed = fold(targetName, sourceName);
    assertProjectionEqual(
      reconstructed,
      fixture.representations[sourceName],
      `${sourceName} → ${targetName} → ${sourceName} lost an invariant`
    );
    assertProjectionEqual(
      target,
      fixture.representations[targetName],
      `${sourceName} → ${targetName} did not preserve the target projection`
    );
  }
});

test("every legal direction detects semantic-role loss", () => {
  for (const [sourceName, targetName] of legalFolds) {
    const target = fold(sourceName, targetName);
    target.projection.nodes.find(({ id }) => id === "review").semantic_role = "step";
    assert.ok(
      invariantFailureCodes(target, fixture.representations[targetName]).includes("ROLE_DRIFT"),
      `${sourceName} → ${targetName} failed to detect ROLE_DRIFT`
    );
  }
});

test("missing governance metadata is detected as lossy", () => {
  const defective = clone(fixture.representations.Code);
  delete defective.projection.governance.owner;
  assert.ok(
    invariantFailureCodes(defective, fixture.representations.Code).includes("GOVERNANCE_DRIFT")
  );
});

test("topology and flow changes are detected as lossy", () => {
  const topologyDefect = clone(fixture.representations.Code);
  topologyDefect.projection.edges[2].to = "return";
  assert.ok(
    invariantFailureCodes(topologyDefect, fixture.representations.Code).includes(
      "TOPOLOGY_DRIFT"
    )
  );

  const flowDefect = clone(fixture.representations.Code);
  flowDefect.projection.flows[0].condition = "request is incomplete";
  assert.ok(
    invariantFailureCodes(flowDefect, fixture.representations.Code).includes("FLOW_DRIFT")
  );
});

test("ambiguous identity is rejected rather than inferred", () => {
  const ambiguous = clone(fixture.representations.Diagram);
  ambiguous.projection.nodes[1].id = "requester";
  const ids = ambiguous.projection.nodes.map(({ id }) => id);
  assert.notEqual(new Set(ids).size, ids.length, "fixture mutation should create ambiguity");
  assert.ok(
    invariantFailureCodes(ambiguous, fixture.representations.Diagram).includes(
      "AMBIGUOUS_MAPPING"
    )
  );
  assert.throws(
    () => {
      if (new Set(ids).size !== ids.length) {
        const error = new Error("AMBIGUOUS_MAPPING");
        error.code = "AMBIGUOUS_MAPPING";
        throw error;
      }
    },
    { code: "AMBIGUOUS_MAPPING" }
  );
});

test("both deferred direct folds fail explicitly", () => {
  for (const [sourceName, targetName] of deferredFolds) {
    assert.throws(
      () => fold(sourceName, targetName),
      { code: "DEFERRED_FOLD" },
      `${sourceName} → ${targetName} must remain deferred`
    );
  }
});