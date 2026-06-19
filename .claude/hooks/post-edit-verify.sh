#!/usr/bin/env bash
# post-edit-verify.sh
# Fires after every Edit/Write/MultiEdit (PostToolUse).
# Runs the cheap, fast gates — typecheck + lint — and feeds any failure
# back to Claude so it fixes immediately instead of accumulating errors.
#
# PostToolUse cannot undo the edit, but a non-zero exit with stderr text
# is surfaced to Claude as feedback. We keep this FAST (typecheck+lint only);
# the full test/e2e/build suite runs at the Stop gate, not on every keystroke.

set -uo pipefail

cd "$CLAUDE_PROJECT_DIR" || exit 0

# Only act in a real Node project (skip during early scaffolding when
# package.json may not exist yet — don't block the agent bootstrapping).
if [ ! -f package.json ]; then
  exit 0
fi

FAILED=0
OUT=""

# Typecheck (only if the script exists)
if npm run | grep -qE '^[[:space:]]*typecheck'; then
  if ! TC=$(npm run typecheck 2>&1); then
    FAILED=1
    OUT+=$'\n--- typecheck failed ---\n'"$TC"
  fi
fi

# Lint (only if the script exists)
if npm run | grep -qE '^[[:space:]]*lint'; then
  if ! LN=$(npm run lint 2>&1); then
    FAILED=1
    OUT+=$'\n--- lint failed ---\n'"$LN"
  fi
fi

if [ "$FAILED" -ne 0 ]; then
  # stderr is fed back to Claude; exit 2 marks a blocking-style failure
  echo "Post-edit verification failed. Fix before continuing:${OUT}" >&2
  exit 2
fi

exit 0
