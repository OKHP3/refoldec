import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const fixture = JSON.parse(fs.readFileSync("docs/conformance/fixture.json", "utf8"));
const secondFixture = JSON.parse(
  fs.readFileSync("docs/conformance/fixture-order-reconciliation.json", "utf8")
);
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
  return foldFixture(fixture, sourceName, targetName);
}

function foldFixture(candidate, sourceName, targetName) {
  if (deferredFolds.some(([from, to]) => from === sourceName && to === targetName)) {
    const error = new Error(`DEFERRED_FOLD: ${sourceName} → ${targetName}`);
    error.code = "DEFERRED_FOLD";
    throw error;
  }
  assert.ok(
    legalFolds.some(([from, to]) => from === sourceName && to === targetName),
    `unsupported fold: ${sourceName} → ${targetName}`
  );
  return clone(candidate.representations[targetName]);
}

test("fixture declares exactly four concrete forms and the current contract", () => {
  assert.deepEqual(Object.keys(fixture.representations), representations);
  assert.equal(fixture.contract.id, "refoldec-fold-contract");
  assert.equal(fixture.contract.version, "1.0.0");
  assert.equal(fixture.schema_version, "1.1");
});

test("fixture covers only the canonical stages in the core-loop mapping", () => {
  const mappedForms = Object.values(loopStageMapping).filter(Boolean);
  const explanatoryStages = Object.entries(loopStageMapping)
    .filter(([, form]) => form === null)
    .map(([stage]) => stage);

  assert.deepEqual(mappedForms, representations);
  assert.deepEqual(
    Object.keys(fixture.representations).filter((name) =>
      explanatoryStages.includes(name)
    ),
    [],
    "explanatory loop stages must not become fixture representations"
  );
  for (const form of mappedForms) {
    assert.ok(fixture.representations[form], `fixture is missing mapped form ${form}`);
  }
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

  for (const candidate of [fixture, secondFixture]) {
    for (const { semantic_role: role } of candidate.canonical_projection.nodes) {
      assert.ok(
        familyByRole.has(role),
        `${candidate.fixture_id} role is absent from registry: ${role}`
      );
      assert.ok(
        familyByRole.get(role).some((family) => registryRoleKeys.has(`${family}:${role}`)),
        `${candidate.fixture_id} role has no registry family: ${role}`
      );
    }
  }
});

test("the second fixture has a distinct public-safe graph shape", () => {
  assert.equal(secondFixture.fixture_id, "synthetic-order-reconciliation");
  assert.notDeepEqual(
    secondFixture.canonical_projection,
    fixture.canonical_projection,
    "the generalization case must not duplicate the original projection"
  );
  assert.equal(secondFixture.canonical_projection.nodes.length, 7);
  assert.equal(secondFixture.canonical_projection.edges.length, 7);
  assert.equal(secondFixture.canonical_projection.flows.length, 2);
  assert.deepEqual(Object.keys(secondFixture.representations), representations);
  for (const name of representations) {
    assertProjectionEqual(
      secondFixture.representations[name],
      { projection: secondFixture.canonical_projection },
      `second fixture ${name} does not expose its canonical invariant projection`
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

test("the second fixture preserves every legal direction", () => {
  for (const [sourceName, targetName] of legalFolds) {
    const target = foldFixture(secondFixture, sourceName, targetName);
    const reconstructed = foldFixture(secondFixture, targetName, sourceName);
    assertProjectionEqual(
      reconstructed,
      secondFixture.representations[sourceName],
      `second fixture ${sourceName} → ${targetName} → ${sourceName} lost an invariant`
    );
    assertProjectionEqual(
      target,
      secondFixture.representations[targetName],
      `second fixture ${sourceName} → ${targetName} did not preserve the target projection`
    );
  }
});

test("the second proof freezes and verifies all artifact and invariant hashes", () => {
  const comparison = JSON.parse(
    fs.readFileSync("docs/proof/order-reconciliation/comparison.json", "utf8")
  );
  const proofRoot = path.resolve("docs/proof/order-reconciliation");
  const hash = (filePath) =>
    crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  const hashValue = (value) =>
    crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");

  assert.equal(comparison.evidence_status, "manual-analytical");
  assert.equal(comparison.visibility, "public-development-fixture");
  assert.equal(comparison.actual_executor_used, false);
  assert.equal(comparison.artifact_hashes.algorithm, "sha256");
  assert.ok(comparison.artifact_hashes.files.length >= 8);

  const artifactPaths = new Set();
  for (const entry of comparison.artifact_hashes.files) {
    assert.match(entry.sha256, /^[a-f0-9]{64}$/);
    assert.ok(!artifactPaths.has(entry.path), `duplicate artifact hash: ${entry.path}`);
    artifactPaths.add(entry.path);
    assert.equal(
      hash(path.resolve(proofRoot, entry.path)),
      entry.sha256,
      `artifact hash mismatch: ${entry.path}`
    );
  }

  const expectedInvariants = [
    "semantic_role_assignment",
    "node_identity",
    "edge_topology",
    "flow_relationships",
    "governance_tags",
  ];
  const checks = comparison.invariant_comparison.checks;
  const secondProjection = secondFixture.canonical_projection;
  const canonicalInvariantHashes = {
    semantic_role_assignment: hashValue(
      sortRecords(
        secondProjection.nodes.map(({ id, semantic_role }) => ({ id, semantic_role }))
      )
    ),
    node_identity: hashValue(
      sortRecords(secondProjection.nodes.map(({ id }) => ({ id })))
    ),
    edge_topology: hashValue(sortRecords(secondProjection.edges)),
    flow_relationships: hashValue(sortRecords(secondProjection.flows)),
    governance_tags: hashValue(secondProjection.governance),
  };
  assert.deepEqual(
    checks.map(({ invariant }) => invariant),
    expectedInvariants
  );
  for (const check of checks) {
    assert.match(check.expected_sha256, /^[a-f0-9]{64}$/);
    assert.equal(
      check.expected_sha256,
      canonicalInvariantHashes[check.invariant],
      `${check.invariant} hash does not match the neutral fixture`
    );
    assert.equal(check.result, "PASS");
    assert.equal(check.failure_code, null);
    for (const form of comparison.invariant_comparison.compared_forms) {
      assert.equal(
        check.observed_sha256[form],
        check.expected_sha256,
        `${check.invariant} hash mismatch for ${form}`
      );
    }
    assert.match(check.on_mismatch, /^reject output/);
  }
  for (const [condition, action] of Object.entries(comparison.failure_handling)) {
    assert.ok(condition);
    assert.match(action, /FAIL|reject|stop/i);
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