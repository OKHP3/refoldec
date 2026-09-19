#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
export REFOLDEC_PYTHON="${REFOLDEC_PYTHON:-python3}"

node scripts/validate-registry.mjs
node scripts/validate-conformance.mjs
node scripts/check-technology-versions.mjs --offline
node --test tests/*.mjs .agents/skills/okhp3-skill-foundry/tests/*.cjs
while IFS= read -r test_file; do
  node --test "$test_file"
done < <(find .agents/skills -type f -path '*/tests/*.mjs' | sort)
while IFS= read -r test_file; do
  "$REFOLDEC_PYTHON" "$test_file"
done < <(find .agents/skills -type f -path '*/tests/*.py' | sort)
node .agents/skills/okhp3-skill-foundry/scripts/validate-skill-suite.cjs --skills-dir .agents/skills
node scripts/audit-skill-library.mjs --check
"$REFOLDEC_PYTHON" scripts/generate-skill-library-evaluation-view.py --check
"$REFOLDEC_PYTHON" .agents/skills/okhp3-skill-cataloger/scripts/gen-skills-readme.py --check
git diff --check
