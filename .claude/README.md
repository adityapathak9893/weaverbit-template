# `.claude/` — Claude Code control layer

This folder configures how **Claude Code** behaves when building this repo. It is the "harness" that turns Claude Code from a coding assistant into a verified build loop: it writes code, checks itself, reviews itself, and only stops when quality gates pass.

None of this is application code — it never ships to the website. It only governs the agent while developing.

## What's in here

| Path | What it is |
|---|---|
| `settings.json` | Registers the **hooks** — scripts that fire automatically at lifecycle events (after edits, before stopping). This is what makes the gates non-optional. |
| `hooks/` | The actual scripts the hooks run (typecheck/lint after edits; full test/build gate before stopping). See `hooks/README.md`. |
| `agents/` | **Subagents** — specialized helpers with their own context. Currently the `code-reviewer` that critiques diffs with fresh eyes. See `agents/README.md`. |
| `commands/` | **Slash commands** — shortcuts you type in Claude Code (e.g. `/review`, `/new-post`). See `commands/README.md`. |

## How it fits the bigger picture

The three root docs are the *instructions*; this folder is the *enforcement*:
- `CLAUDE.md` tells the agent the rules (advisory — can be ignored).
- `.claude/` **guarantees** the important ones via hooks (deterministic — always run).

That distinction matters: rules in `CLAUDE.md` are "please do this"; hooks in here are "this will happen no matter what."

## Reusing across Weaverbit projects

This whole folder is portable. Copy it into any new `*.weaverbit.com` repo, adjust the npm script names in the hooks if they differ, and the new project inherits the same build discipline. See `CLAUDE.md` §10.

## Dependencies
- The Stop gate needs **`jq`** installed locally (`brew install jq` / `apt-get install jq`). Without it the gate safely no-ops instead of enforcing.
- Hook scripts must stay **executable** (`chmod +x .claude/hooks/*.sh`). Copying between machines can strip this.
