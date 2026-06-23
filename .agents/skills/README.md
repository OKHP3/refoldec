# Process Skills

This directory contains **Process Skills** — executable process-capture contracts for agents.

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

## SKILL.md format

Every `SKILL.md` must include:

```markdown
# Skill Name

**Trigger:** When to invoke this skill
**Plane:** Which ReFolDec plane this operates on
**Direction:** Fold (xME) | Unfold (xIE) | Both

## Description

## Steps

## Inputs

## Outputs

## Compatible agent surfaces

## Notes
```

---

Skills are under active development. First batch coming in v0.2.0.
