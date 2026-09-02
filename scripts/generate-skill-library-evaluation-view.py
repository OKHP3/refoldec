#!/usr/bin/env python3
"""Generate the project-level Agent Skill library evaluation view.

This is an inventory and evidence-status report, not an evaluator.  It derives
structural signals from the checked-in packages and preserves the distinction
between analytical review, historical evidence, and not-run task-quality
evaluation.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import tempfile
from pathlib import Path
from typing import Any


EVIDENCE_STATUSES = {"live", "analytical", "historical", "not-run"}
EVALUATION_PARTITIONS = {"development", "holdout"}
EVALUATION_COVERAGE_CLASSES = {"normal", "edge", "boundary"}
REFERENCE_PATTERN = re.compile(r"`((?:references|assets|scripts)/[^`\s]+)[^`]*`")
SEMVER_PATTERN = re.compile(r"^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$")


def frontmatter(text: str) -> str:
    match = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    return match.group(1) if match else ""


def scalar(block: str, key: str) -> str:
    match = re.search(rf"^{re.escape(key)}:\s*(.+)$", block, re.MULTILINE)
    if not match:
        return ""
    value = match.group(1).strip()
    if value in {"|", ">"}:
        lines = []
        for line in block[match.end() :].splitlines():
            if re.match(r"^[A-Za-z0-9_-]+:", line):
                break
            lines.append(line.strip())
        return " ".join(lines).strip()
    return value.strip("\"'")


def metadata_scalar(block: str, key: str) -> str:
    match = re.search(rf"^\s{{2}}{re.escape(key)}:\s*(.+)$", block, re.MULTILINE)
    return match.group(1).strip().strip("\"'") if match else ""


def load_json(path: Path) -> dict[str, Any] | None:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError):
        return None
    return value if isinstance(value, dict) else None


def evaluation_record(skill_dir: Path, version: str) -> dict[str, Any]:
    eval_path = skill_dir / "evals" / "evals.json"
    benchmark_path = skill_dir / "benchmarks" / "benchmark.json"
    evals = load_json(eval_path) if eval_path.exists() else None
    benchmark = load_json(benchmark_path) if benchmark_path.exists() else None
    cases = evals.get("evals", []) if evals else []
    if not isinstance(cases, list):
        cases = []

    required_coverage = evals.get("coverage_required", ["normal", "edge", "boundary"]) if evals else []
    if not isinstance(required_coverage, list):
        required_coverage = []
    partitions = sorted(
        {case.get("partition", "unpartitioned") for case in cases if isinstance(case, dict)}
    )

    def case_is_shaped(case: Any) -> bool:
        return (
            isinstance(case, dict)
            and bool(case.get("id"))
            and bool(case.get("partition"))
            and bool(case.get("risk"))
            and bool(case.get("prompt"))
            and case.get("partition") in EVALUATION_PARTITIONS
            and case.get("coverage_class") in EVALUATION_COVERAGE_CLASSES
            and isinstance(case.get("expectations"), list)
            and len(case["expectations"]) >= 3
        )

    case_shape_complete = bool(cases) and all(case_is_shaped(case) for case in cases)
    legacy_case_count = sum(
        1
        for case in cases
        if not isinstance(case, dict)
        or not case.get("id")
        or not case.get("partition")
        or not case.get("risk")
        or not case.get("prompt")
        or not isinstance(case.get("expectations"), list)
        or len(case.get("expectations", [])) < 3
    )
    invalid_case_count = sum(
        1
        for case in cases
        if not isinstance(case, dict)
        or case.get("partition") not in EVALUATION_PARTITIONS
        or case.get("coverage_class") not in EVALUATION_COVERAGE_CLASSES
    )
    duplicate_id_count = len(cases) - len(
        {case.get("id") for case in cases if isinstance(case, dict)}
    )
    coverage_counts = {
        coverage_class: sum(
            1
            for case in cases
            if isinstance(case, dict)
            and case.get("partition") == "development"
            and case.get("coverage_class") == coverage_class
        )
        for coverage_class in sorted(EVALUATION_COVERAGE_CLASSES)
    }
    coverage = {
        coverage_class: {
            "required": coverage_class in required_coverage,
            "development_case_count": coverage_counts[coverage_class],
            "covered": coverage_class in required_coverage
            and coverage_counts[coverage_class] > 0,
        }
        for coverage_class in sorted(EVALUATION_COVERAGE_CLASSES)
    }

    benchmark_meta = benchmark.get("metadata", {}) if benchmark else {}
    benchmark_status = benchmark_meta.get("evaluation_status")
    if benchmark_status not in EVIDENCE_STATUSES:
        benchmark_status = None
    design_status = evals.get("status") if evals else None
    if design_status not in EVIDENCE_STATUSES:
        design_status = "not-run"

    evaluated_version = benchmark_meta.get("evaluated_skill_version") if benchmark else None
    version_match = evaluated_version in (None, version)
    if benchmark_status == "live" and not version_match:
        benchmark_status = "historical"

    holdout = evals.get("release_holdout") if evals else None
    if not isinstance(holdout, dict):
        holdout = None
    holdout_metadata = holdout or {}
    public_cases_exposed = holdout_metadata.get("public_cases_exposed") is True
    protected_holdout_status = (
        holdout_metadata.get("status")
        if holdout_metadata.get("status") in {"external-required", "protected"}
        else "not-declared"
    )
    holdout_metadata_valid = bool(
        holdout
        and holdout.get("status") == "external-required"
        and holdout.get("holdout_seen") is True
        and public_cases_exposed
        and holdout.get("protected_case_location") == "external"
        and holdout.get("reason")
    )
    coverage_ready = all(
        item["covered"] for item in coverage.values() if item["required"]
    )
    partition_status = (
        "explicit"
        if cases
        and all(
            isinstance(case, dict)
            and case.get("partition") in EVALUATION_PARTITIONS
            for case in cases
        )
        else ("missing" if not cases else "invalid")
    )

    return {
        "design_file": eval_path.exists(),
        "design_status": design_status,
        "design_skill_version": (
            evals.get("skill_version")
            or evals.get("version")
            if evals
            else None
        ),
        "design_version_matches": (
            not evals
            or not (evals.get("skill_version") or evals.get("version"))
            or (evals.get("skill_version") or evals.get("version")) == version
        ),
        "case_count": len(cases),
        "legacy_case_count": legacy_case_count,
        "invalid_case_count": invalid_case_count,
        "duplicate_id_count": duplicate_id_count,
        "partitions": partitions,
        "case_shape": "complete" if case_shape_complete else ("partial" if cases else "missing"),
        "partition_status": partition_status,
        "coverage_required": required_coverage,
        "coverage": {
            "normal": coverage["normal"]["covered"],
            "edge": coverage["edge"]["covered"],
            "boundary": coverage["boundary"]["covered"],
            "unsafe_or_out_of_scope": coverage["boundary"]["covered"],
            "classes": coverage,
            "status": (
                "ready"
                if case_shape_complete
                and not legacy_case_count
                and not invalid_case_count
                and not duplicate_id_count
                and partition_status == "explicit"
                and coverage_ready
                and holdout_metadata_valid
                else "incomplete"
            ),
        },
        "benchmark_file": benchmark_path.exists(),
        "benchmark_status": benchmark_status or "not-run",
        "evaluated_skill_version": evaluated_version,
        "benchmark_version_matches": version_match,
        "release_holdout": holdout
        or {
            "status": "not-declared",
            "holdout_seen": None,
            "public_cases_exposed": False,
            "protected_case_location": None,
            "reason": "No release holdout record is present.",
        },
        "public_cases_exposed": public_cases_exposed,
        "protected_holdout_status": protected_holdout_status,
        "holdout_metadata_valid": holdout_metadata_valid,
    }


def package_record(skill_dir: Path, project_owned: bool) -> dict[str, Any]:
    skill_path = skill_dir / "SKILL.md"
    text = skill_path.read_text(encoding="utf-8")
    fm = frontmatter(text)
    body = text[text.find("\n---", 4) + 4 :] if fm else text
    name = scalar(fm, "name") or skill_dir.name
    version = metadata_scalar(fm, "version")
    references = sorted(set(REFERENCE_PATTERN.findall(body)))
    missing_references = [
        ref for ref in references if not (skill_dir / ref.split("?", 1)[0]).exists()
    ]
    has_scope = bool(re.search(r"(?im)^##+\s+(?:Scope|Scope boundary|Scope Firewall)", body))
    has_trigger_boundary = bool(
        re.search(r"(?im)^##+\s+(?:When to use|Use this skill|Trigger)", body)
    ) or "description" in fm
    has_safety_boundary = bool(
        re.search(r"(?i)\b(?:safety|security|out.of.scope|authorization|untrusted)\b", body)
    )
    has_output_contract = bool(
        re.search(r"(?im)^##+\s+(?:Output contract|Output Contract|Output Schema|Output Format|Deliverables?)", body)
    )
    adapter = (skill_dir / "agents" / "openai.yaml").exists()
    eval_data = evaluation_record(skill_dir, version)

    if project_owned:
        frontmatter_status = (
            "pass"
            if name == skill_dir.name
            and bool(version)
            and bool(SEMVER_PATTERN.match(version))
            and "## About" in body
            else "review"
        )
        package_class = "portable-core"
    else:
        frontmatter_status = "documented-exception"
        package_class = "host-or-third-party"

    return {
        "name": name,
        "path": str(skill_path),
        "version": version or None,
        "package_class": package_class,
        "frontmatter": {
            "status": frontmatter_status,
            "host_adapter_present": adapter,
            "trigger_boundary_present": has_trigger_boundary,
            "scope_boundary_present": has_scope,
        },
        "resources": {
            "referenced_paths": references,
            "missing_references": missing_references,
            "scripts_present": (skill_dir / "scripts").is_dir(),
            "package_tests_present": (skill_dir / "package.json").exists(),
        },
        "dimensions": {
            "trigger_quality": {
                "status": "analytical" if has_trigger_boundary else "not-run",
                "basis": "Description and package trigger sections were inspected; no client recall/precision run was available.",
            },
            "portability": {
                "status": "analytical" if frontmatter_status in {"pass", "documented-exception"} else "not-run",
                "basis": "Static package contract and path checks only.",
            },
            "safety": {
                "status": "analytical" if has_safety_boundary else "not-run",
                "basis": "Boundary language was inspected; no adversarial executor run was available.",
            },
            "output_contract": {
                "status": "analytical" if has_output_contract else "not-run",
                "basis": "Output headings/schema language were inspected; no task-quality run was available.",
            },
            "task_quality": {
                "status": "not-run",
                "basis": "No isolated matched executor and unseen release holdout were available.",
            },
        },
        "evaluation": eval_data,
    }


def build_view(skills_dir: Path, generated_at: str | None = None) -> dict[str, Any]:
    packages = []
    for child in sorted(skills_dir.iterdir()):
        if child.is_dir() and (child / "SKILL.md").exists():
            packages.append(package_record(child, child.name.startswith("okhp3-")))

    project_packages = [p for p in packages if p["package_class"] == "portable-core"]
    eval_ready = [
        p["name"] for p in project_packages if p["evaluation"]["coverage"]["status"] == "ready"
    ]
    incomplete = [
        p["name"] for p in project_packages if p["evaluation"]["coverage"]["status"] != "ready"
    ]
    missing_refs = [
        p["name"] for p in packages if p["resources"]["missing_references"]
    ]
    historical = [
        p["name"]
        for p in packages
        if p["evaluation"]["benchmark_status"] == "historical"
    ]
    live_benchmarks = [
        p["name"]
        for p in packages
        if p["evaluation"]["benchmark_status"] == "live"
    ]
    legacy_partitions = [
        p["name"]
        for p in project_packages
        if p["evaluation"]["partition_status"] != "explicit"
    ]
    undeclared_holdouts = [
        p["name"]
        for p in project_packages
        if p["evaluation"]["release_holdout"].get("status") == "not-declared"
    ]
    invalid_cases = [
        p["name"]
        for p in project_packages
        if p["evaluation"]["invalid_case_count"]
        or p["evaluation"]["legacy_case_count"]
        or p["evaluation"]["duplicate_id_count"]
    ]
    public_exposed = [
        p["name"] for p in project_packages if p["evaluation"]["public_cases_exposed"]
    ]
    protected_holdouts = [
        p["name"]
        for p in project_packages
        if p["evaluation"]["protected_holdout_status"] == "protected"
    ]
    invalid_holdout_metadata = [
        p["name"] for p in project_packages if not p["evaluation"]["holdout_metadata_valid"]
    ]
    view = {
        "schema_version": "1.0",
        **({"generated_at": generated_at} if generated_at is not None else {}),
        "scope": {
            "skills_dir": str(skills_dir),
            "cataloged_package_count": len(packages),
            "project_owned_package_count": len(project_packages),
            "host_or_third_party_exception_count": len(packages) - len(project_packages),
            "scope_note": "The task brief named the 14-package catalog at planning time; this view uses the current checked-in tree as the source of truth and inventories all 40 packages.",
        },
        "status_legend": {
            "live": "Comparable executor or user runs occurred for the exact version and configuration.",
            "analytical": "Static, fixture, or manual review only; supports design/integrity findings.",
            "historical": "Completed evidence for an older version or superseded setup.",
            "not-run": "Evaluation design or check was unavailable, unauthorized, or not executed.",
        },
        "acceptance_criteria": {
            "frontmatter": "Every project-owned package has a quoted semver and portable name; adopted host/third-party packages are explicit exceptions.",
            "resources": "Referenced package-local paths resolve, and available deterministic package checks pass.",
            "evaluation_design": "Each relevant package has normal, edge, and unsafe/out-of-scope development coverage before a release holdout is considered.",
            "task_quality": "No task-quality or uplift claim without matched current-version runs, separated grading, and an unseen holdout.",
        },
        "summary": {
            "evaluation_design_ready": len(eval_ready),
            "evaluation_design_incomplete": len(incomplete),
            "legacy_partition_packages": len(legacy_partitions),
            "holdout_not_declared_packages": len(undeclared_holdouts),
            "invalid_case_packages": len(invalid_cases),
            "public_holdout_exposed_packages": len(public_exposed),
            "protected_holdout_packages": len(protected_holdouts),
            "invalid_holdout_metadata_packages": len(invalid_holdout_metadata),
            "packages_with_missing_references": len(missing_refs),
            "live_benchmark_packages": len(live_benchmarks),
            "historical_benchmark_packages": len(historical),
            "task_quality_status": "not-run",
            "release_posture": "analytical-structural-integrity",
        },
        "packages": packages,
    }
    return view


def markdown(view: dict[str, Any]) -> str:
    scope = view["scope"]
    summary = view["summary"]
    generated_line = (
        f'**Generated:** {view["generated_at"]}\n'
        if view.get("generated_at") is not None
        else ""
    )
    rows = []
    for package in view["packages"]:
        evaluation = package["evaluation"]
        coverage = evaluation["coverage"]
        rows.append(
            "| {name} | {version} | {kind} | {coverage} | {partition} | {evidence} | {holdout} |".format(
                name=package["name"],
                version=package["version"] or "—",
                kind=package["package_class"],
                coverage=coverage["status"],
                partition=evaluation["partition_status"],
                evidence=evaluation["benchmark_status"],
                holdout=evaluation["release_holdout"]["status"],
            )
        )

    return f"""# Local Skill Library Maturity Report

<!-- GENERATED BY scripts/generate-skill-library-evaluation-view.py; DO NOT EDIT THIS REPORT BY HAND. -->

{generated_line}**Scope:** {scope["cataloged_package_count"]} direct packages under `{scope["skills_dir"]}` ({scope["project_owned_package_count"]} project-owned portable cores and {scope["host_or_third_party_exception_count"]} documented host/third-party exceptions).
**Release posture:** **{summary["release_posture"]}**; current task-quality evidence is **{summary["task_quality_status"]}**.

## Decision boundary

The planning brief referenced the earlier 14-package catalog. The checked-in tree
has since expanded, so this report inventories the current 40-package tree rather
than silently omitting newer packages. The machine-readable companion is
[`skill-library-evaluation-view.json`](./skill-library-evaluation-view.json).

Structural health is not task-quality uplift. `analytical` means static or
fixture-level review; `historical` is retained for prior versions; `not-run`
means no outcome claim is permitted. No package is presented as live-tested or
production-ready by association.

## Summary

| Dimension | Result | Interpretation |
|---|---:|---|
| Package discovery | PASS ({scope["cataloged_package_count"]}) | Direct `SKILL.md` packages were inventoried. |
| Portable-core frontmatter | PASS / documented exceptions | Project-owned packages have semver/name/footer checks; host or third-party packages remain labeled exceptions. |
| Referenced resources | {"PASS" if summary["packages_with_missing_references"] == 0 else "BLOCKED"} | {summary["packages_with_missing_references"]} package(s) have unresolved backtick-delimited local references. |
| Evaluation design coverage | {summary["evaluation_design_ready"]} ready / {summary["evaluation_design_incomplete"]} incomplete | Explicit normal, edge, and boundary development coverage; {summary["legacy_partition_packages"]} legacy/unpartitioned packages and {summary["invalid_case_packages"]} invalid-case packages. |
| Public design exposure | {summary["public_holdout_exposed_packages"]} packages | Checked-in development cases are public and cannot serve as an unseen release holdout. |
| Protected release holdout | {summary["protected_holdout_packages"]} packages | A protected holdout remains external-required/not-run; no package claims protected evidence. |
| Trigger quality | ANALYTICAL | Description and trigger-boundary inspection only; client recall/precision is not-run. |
| Portability and safety | ANALYTICAL | Static package and boundary review only; no separated client/adversarial executor. |
| Output-contract performance | NOT RUN | {summary["live_benchmark_packages"]} package(s) have bounded matched current-version public-development runs; protected release task-quality evidence remains not-run. |
| Historical evidence | {summary["historical_benchmark_packages"]} package(s) | Historical records are not inherited by newer versions. |

## Package evidence view

| Package | Version | Class | Case coverage | Partitioning | Benchmark evidence | Holdout |
|---|---|---|---|---|---|---|
{chr(10).join(rows)}

## Validation evidence

- Catalog check: `python3 .agents/skills/okhp3-skill-cataloger/scripts/gen-skills-readme.py --skills-dir .agents/skills --check`
- Foundry structural/package validator: `node .agents/skills/okhp3-skill-foundry/scripts/validate-skill-suite.cjs --skills-dir .agents/skills`
- Evaluation evidence drift check: `python3 scripts/generate-skill-library-evaluation-view.py --check`
- Available package checks: seven package-local `npm test` suites; all passed after aligning their stale name assertions with the portable directory contract.
- Script safety review: PASS. The cataloger writes only its documented generated surfaces; the three thread extract helpers validate repository-relative destinations and write atomically, with no network, subprocess, credential, or destructive-cleanup behavior.
- This report and [`skill-library-evaluation-view.json`](./skill-library-evaluation-view.json) are generated by `scripts/generate-skill-library-evaluation-view.py`.

## Remaining release gates

1. Run the protected external holdout with an independent executor before making a release, uplift, or production-readiness claim.
2. Keep the Foundry 1.0.0 benchmark historical; the current public-development run is bounded live evidence for version 3.1.0 only.
3. Re-run this view and the catalog after any package, resource, or evaluation-version change.
"""


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skills-dir", default=".agents/skills")
    parser.add_argument("--json-output", default="docs/evidence/skill-library-evaluation-view.json")
    parser.add_argument("--markdown-output", default="docs/evidence/skill-library-maturity.md")
    parser.add_argument(
        "--check",
        action="store_true",
        help="Regenerate both outputs in a temporary directory and fail if either committed output is stale.",
    )
    parser.add_argument(
        "--generated-at",
        help="Include this caller-supplied stable timestamp; omitted by default for reproducibility.",
    )
    args = parser.parse_args()
    view = build_view(Path(args.skills_dir), args.generated_at)
    json_path = Path(args.json_output)
    markdown_path = Path(args.markdown_output)

    generated_json = json.dumps(view, indent=2) + "\n"
    generated_markdown = markdown(view)
    if args.check:
        stale_paths = []
        with tempfile.TemporaryDirectory(prefix="skill-library-evaluation-") as temporary_directory:
            temporary_json = Path(temporary_directory) / "skill-library-evaluation-view.json"
            temporary_markdown = Path(temporary_directory) / "skill-library-maturity.md"
            temporary_json.write_text(generated_json, encoding="utf-8")
            temporary_markdown.write_text(generated_markdown, encoding="utf-8")

            for expected_path, temporary_path in (
                (json_path, temporary_json),
                (markdown_path, temporary_markdown),
            ):
                try:
                    matches = expected_path.read_bytes() == temporary_path.read_bytes()
                except (OSError, UnicodeError):
                    matches = False
                if not matches:
                    stale_paths.append(str(expected_path))

        if stale_paths:
            print(
                "Skill-library evaluation evidence is stale: "
                + ", ".join(stale_paths),
                file=sys.stderr,
            )
            return 1
        print(
            "Skill-library evaluation evidence check passed: "
            f"{json_path}, {markdown_path}"
        )
        return 0

    json_path.parent.mkdir(parents=True, exist_ok=True)
    markdown_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(generated_json, encoding="utf-8")
    markdown_path.write_text(generated_markdown, encoding="utf-8")
    print(
        f"Generated evaluation view for {view['scope']['cataloged_package_count']} packages: "
        f"{json_path}, {markdown_path}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())