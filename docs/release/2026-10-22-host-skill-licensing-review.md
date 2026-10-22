# Host-Skill Provenance and Licensing Review

**Review date:** 2026-10-22  
**Decision:** `host-skill-packages-remain-excluded`  
**Publication boundary:** This review does not broaden the controlled release
tree or authorize publication. The four packages below remain outside that
tree; their working-copy files are retained for local host use.

## Decision

The controlled release boundary in
[`2026-09-01-scope-firewall-clearance.md`](./2026-09-01-scope-firewall-clearance.md)
remains in force. A package may be reconsidered only after its exact source and
author are supportable, applicable redistribution terms and notices are
retained with the package, and any package-specific validation gaps are closed.
No package is cleared for public inclusion by this review.

| Package | Source, author, and license evidence checked | Remaining gap | Disposition |
|---|---|---|---|
| `architecture-decision-records` | The local `SKILL.md` declares Jamie Hill (OverKill Hill P³) as author and `MIT` as its license. The package contains no upstream source URL or license text. | The local header and the Replit commit that added the file do not establish the original work's source or redistribution authority. Search results and third-party mirrors are not treated as primary provenance. | Retired from this controlled public release candidate. Keep excluded unless the owner supplies authoritative source and redistribution evidence. |
| `frontend-design` | The official [Anthropic frontend-design package](https://github.com/anthropics/skills/tree/main/skills/frontend-design) declares its license in `LICENSE.txt`. Its Apache-2.0 text matches the tracked local `license.txt` byte-for-byte after newline/outer-whitespace normalization. | The local instruction body does not exactly match the current or historical upstream versions checked. The exact source revision and upstream author attribution for this local adaptation are not established. The local author field remains an attribution claim, not proof of upstream origin. | Retired from this controlled public release candidate. The local license reference now uses the actual tracked lowercase filename; source attribution must still be resolved before reconsideration. |
| `vercel-react-best-practices` | The [official Vercel Agent Skill](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) establishes the upstream package identity. Local and upstream skill metadata declare MIT, the upstream README declares MIT, and the local package README acknowledges Shu Ding's work at Vercel. | The local instruction body differs from the current upstream version, so its exact source revision is unverified. The repository API reports no detected license and the checked root `LICENSE` URL is absent. A package-ready copy of the license and required notices is not present locally. | Retired from this controlled public release candidate pending exact source attribution and a complete, retained redistribution notice. |
| `web-design-guidelines` | The [official Vercel Agent Skill](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) matches the local instructions; the only local addition is the `license: MIT` metadata line. The upstream Agent Skills README declares MIT. Its [guidelines source](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md) is in a repository whose [LICENSE](https://github.com/vercel-labs/web-interface-guidelines/blob/main/LICENSE) is MIT, copyright Vercel Labs 2025. | The Agent Skills repository has no standalone root `LICENSE` at the checked URL. The package needs a package-level notice that clearly covers both the skill instructions and the separately sourced guidelines. | Retired from this controlled public release candidate pending a complete, retained redistribution notice. |

The package metadata now states `license: MIT` for `web-design-guidelines`,
consistent with the upstream Agent Skills README declaration. This records the
upstream claim; it does not replace the missing package-level notice or clear
the package for release.

## Validation and scope notes

- The corrected `frontend-design` metadata path points to the tracked file
  `.agents/skills/frontend-design/license.txt` on case-sensitive filesystems.
- A local Markdown link and anchor check over
  `.agents/skills/vercel-react-best-practices/AGENTS.md` examined 119 links and
  found zero unresolved relative files or anchors. The three unresolved
  references reported in the September clearance were not reproduced by this
  check. This is a bounded link check, not a review of the guidance content.
- The release-tree boundary remains the 36 project-owned packages identified
  in the September clearance. The four host/third-party packages remain
  excluded and are not counted as cleared by this review.

## Source ledger

Sources were retrieved on 2026-10-22. Primary source repositories are used
where available; a source's public availability is not treated as permission
unless its own license or redistribution declaration supports that conclusion.

| Source | Publisher | Claim supported |
|---|---|---|
| `https://github.com/anthropics/skills/tree/main/skills/frontend-design` | Anthropic | Official package location and current package license reference; the checked local body is not an exact match. |
| `https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/LICENSE.txt` | Anthropic | Apache License 2.0 text; byte-for-byte text match to the local lowercase license file after normalization. |
| `https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices` | Vercel Labs | Official source location, package identity, and upstream MIT declaration. |
| `https://github.com/vercel-labs/agent-skills/blob/main/README.md` | Vercel Labs | The upstream collection's MIT declaration and Vercel/Shu Ding attribution for React Best Practices. |
| `https://api.github.com/repos/vercel-labs/agent-skills` | GitHub API | Repository metadata has no detected license field; this does not override the explicit README and package declarations. |
| `https://raw.githubusercontent.com/vercel-labs/agent-skills/main/LICENSE` | Vercel Labs | Checked for a standalone root license file; the URL returned 404 on the review date. |
| `https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines` | Vercel Labs | Official source location and package identity for the web-guidelines skill. |
| `https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md` | Vercel Labs | Source of the separately fetched guideline content. |
| `https://github.com/vercel-labs/web-interface-guidelines/blob/main/LICENSE` | Vercel Labs | MIT license text and Vercel Labs copyright notice for the guideline repository. |

## Remaining action

Keep the four packages excluded from the controlled release tree. Reopen this
decision only when the source, author, package-level redistribution notice,
and relevant package validation are all documented for the specific package.
