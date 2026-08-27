---
name: GitHub transport in Replit
description: GitHub connector access works through the authenticated API even when the local Git HTTPS remote cannot authenticate.
---

Use the attached GitHub connector for repository reads and writes when the local HTTPS remote rejects credentials. A normal forward-only API commit can preserve the validated tree without force-pushing; verify the branch tip and tree afterward. For large updates, upload blobs individually and submit a compact tree rather than passing a large inline tree payload through the sandbox.

**Why:** The Replit environment may have an authorized connector without exposing its token to the command-line Git credential helper.

**How to apply:** Fetch locally for history inspection, use the connector API for the final commit/ref update when `git push` reports invalid credentials, and compare local and remote tree SHAs before declaring reconciliation complete. Use `force: false` for the ref update and confirm the expected parent immediately before writing.