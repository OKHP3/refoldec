# Process Skills

This directory contains **Process Skills** — executable process-capture contracts for agents. The skills are checked-in repository assets; they are not an application runtime or a fold-execution engine.

Process Skills are the bridge between the Inversion plane (xIE) and the Executable plane. When a mature artifact is inverted, its patterns and steps are packaged as Process Skills — structured instruction sets that agents (AI or human) can execute repeatably.

---

## Structure

Each skill lives in its own subdirectory:

```
.agents/skills/
  skill-name/
    SKILL.md          ← canonical spec file
    assets/           ← supporting assets (optional)
    scripts/          ← supporting scripts (optional)
```

## SKILL.md guidance

There is no single enforced template for the current skills. Existing files use
skill-specific Markdown and, in some cases, YAML frontmatter. A new or revised
skill should make its purpose, trigger conditions, workflow, inputs, outputs,
dependencies, safety constraints, and supporting assets clear. Preserve the
existing format of the skill being edited unless its owner explicitly requests
a schema change.

---

## Current inventory

- `find-skills` — discover and recommend installable or local skills.
- `okhp3-notion-capture-router` — route AI-conversation material into structured Notion capture.
- `okhp3-skill-cataloger` — inventory and maintain skill catalogs.
- `skill-creator` — create, improve, and evaluate skills.

This inventory is intentionally concise. The individual `SKILL.md` files and their referenced assets/scripts are authoritative for each skill. New skills should be added as separate lowercase kebab-case directories and reflected here.
