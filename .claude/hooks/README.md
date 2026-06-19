# `.claude/hooks/` — automated quality gates

Shell scripts that Claude Code runs **automatically** at lifecycle events (configured in `../settings.json`). They are the enforcement muscle of the build loop — they run whether or not the agent "remembers" to check its work.

## The scripts

### `post-edit-verify.sh` — fires after every file edit
Event: `PostToolUse` (matcher `Edit|Write|MultiEdit`).
Runs the **fast** gates only: `typecheck` + `lint`. If either fails, the error is fed straight back to Claude so it fixes the problem immediately instead of letting errors pile up.
Deliberately cheap — it runs on every single edit, so it must be fast. The heavy suite runs at the Stop gate, not here.

### `stop-gate.sh` — fires when Claude tries to finish
Event: `Stop`.
Runs the **full** Definition of Done: `typecheck`, `lint`, `test`, `e2e`, `build`. If any fails, it forces Claude to keep working (exit code 2) instead of ending with broken code.
Includes a `stop_hook_active` guard that prevents an infinite loop (a Stop hook that always blocks would trap the agent forever).

## Exit-code contract (how hooks talk to Claude Code)
- **exit 0** → success, the agent proceeds.
- **exit 2** → blocking failure; `stderr` text is fed back to Claude. On `PostToolUse` it flags the problem; on `Stop` it forces the agent to continue working.
- other non-zero → non-blocking warning; execution continues.

## Design choice you should know
Gates are **split across two hooks on purpose**: fast feedback (typecheck+lint) on every edit, full enforcement (the whole suite) only before stopping. Running the full suite on every keystroke would make the loop crawl and waste tokens. If you ever want the heavy suite to run more aggressively, move those gates into `post-edit-verify.sh`.

## Both scripts fail safe
If `package.json` or a given npm script doesn't exist yet (e.g. during first scaffolding), the scripts **skip gracefully** rather than block the agent. The gates "switch on" automatically as the project gains its `typecheck`/`lint`/`test`/`e2e`/`build` scripts — so make sure those scripts actually get defined, or the gates stay dormant.

## Requirements
- `jq` installed (used by `stop-gate.sh` to read the event JSON and prevent loops).
- Scripts must be executable: `chmod +x *.sh`.
