#!/usr/bin/env bash
# stop-gate.sh
# Fires when Claude is about to finish responding (Stop event).
# Enforces the Definition of Done (CLAUDE.md §3): the session may not end
# until typecheck, lint, test, e2e, and build all pass.
#
# CRITICAL: Stop hooks fire on EVERY stop. Returning exit 2 forces Claude to
# keep working — without the stop_hook_active guard this creates an infinite
# loop. We read stdin JSON and bail to exit 0 if we're already inside a
# hook-triggered continuation.

set -uo pipefail

INPUT=$(cat)

# jq is required; if absent, don't wedge the session — allow stop with a warning.
if ! command -v jq >/dev/null 2>&1; then
  echo "stop-gate: jq not found; skipping gate (install jq to enforce)." >&2
  exit 0
fi

# Prevent infinite loop: if this stop was itself triggered by a prior block, allow it.
ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
if [ "$ACTIVE" = "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0

# Nothing to gate before the project exists.
if [ ! -f package.json ]; then
  exit 0
fi

run_gate () {
  local script="$1"
  # Skip gracefully if the script isn't defined yet.
  if ! npm run | grep -qE "^[[:space:]]*${script}([[:space:]]|$)"; then
    return 0
  fi
  if ! OUT=$(npm run "$script" 2>&1); then
    echo "--- ${script} failed ---" >&2
    echo "$OUT" >&2
    return 1
  fi
  return 0
}

FAIL=0
for g in typecheck lint test e2e build; do
  if ! run_gate "$g"; then
    FAIL=1
  fi
done

if [ "$FAIL" -ne 0 ]; then
  echo "Definition of Done not met — gates above are red. Keep working; do not stop until all pass." >&2
  exit 2
fi

exit 0
