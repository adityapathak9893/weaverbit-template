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

# Resolve the repo root from this script's own location rather than trusting the
# environment. Why: with `set -u`, an unset CLAUDE_PROJECT_DIR aborts the script with
# "unbound variable" and exit 1 — a NON-blocking code, so the gate disappears silently
# and the agent is never told. A hook that quietly does nothing is worse than no hook.
# BASH_SOURCE also survives git-bash on Windows, where the env var was the failure.
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"

cd "$PROJECT_DIR" || {
  echo "hook: cannot cd to project root ($PROJECT_DIR)" >&2
  exit 2
}

# Only act in a real Node project (skip during early scaffolding when
# package.json may not exist yet — don't block the agent bootstrapping).
if [ ! -f package.json ]; then
  exit 0
fi

FAILED=0
OUT=""

# Is a script defined? `npm pkg get` prints the value, or `{}` when the key is missing.
# Why not `npm run | grep -q`: grep exits on first match and closes the pipe, so npm dies
# on EPIPE and prints "npm error ..." on every single check — noise on a passing run.
has_script () {
  [ "$(npm pkg get "scripts.$1" 2>/dev/null)" != "{}" ]
}

if has_script typecheck; then
  if ! TC=$(npm run typecheck 2>&1); then
    FAILED=1
    OUT+=$'\n--- typecheck failed ---\n'"$TC"
  fi
fi

if has_script lint; then
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
