# ADR-0001: ReFolDec as the public framework name

## Status

Accepted

## Date

2026-06-20

## Context

The project originated under the working title **Capture FoundRy** and went through several internal names tied to the OKHP³ xMIE Operating System. As the framework matured, a name was needed that:

- encodes the bidirectional nature of the process (fold in, unfold out),
- is pronounceable and memorable,
- is distinct from existing tools and not tied to a specific organ or sub-component,
- works as a slug, repo name, and public brand.

The candidate shortlist was: Capture FoundRy, xMIE Codec, FoldRec, and ReFolDec.

## Decision

The public framework name is **ReFolDec** — the **Re**cursively **Fol**ding Co**dec**.

The name encodes the core mechanic: raw thought is folded (encoded) into structured artifacts; structured artifacts are unfolded (decoded) back into executable primitives. The "Re" prefix captures recursion — the codec can be applied to its own outputs.

The repo slug is `refoldec`. The Notion hub and all external references use `ReFolDec`.

## Consequences

### Positive

- The name is self-documenting: fold + codec + recursive.
- The slug is clean, available, and platform-portable.
- `Capture FoundRy` is retired as a public name; it may persist as an internal working metaphor only.

### Negative

- Existing references to `Capture FoundRy` in notes and chat transcripts must be treated as legacy; do not normalize them into published content.

## References

- `ECOSYSTEM.md` — head-canon document that anchors the name.
- `CHANGELOG.md` — context note: "Name locked: ReFolDec supersedes Capture FoundRy".
