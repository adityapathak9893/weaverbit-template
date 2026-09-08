/**
 * Guards the harness invariants whose breakage is INVISIBLE at runtime.
 *
 * Every defect asserted here shipped in a Weaverbit repo and went unnoticed, because each
 * one fails non-blocking: a hook that exits 126 (lost exec bit), or 1 (unbound variable), or
 * 0 (dependency missing) is either swallowed or read as "all gates green". There is no red
 * output to notice — the gate simply stops existing. A test is the only thing that can see
 * the difference between "enforced" and "silently absent".
 *
 * See CLAUDE.md §9, and the exit-code contract in each hook script's own header.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Resolved from vitest's cwd, not import.meta.url: a product that switches this config to
// `jsdom` (vitest.config.ts says how, and weaverbit-core did) no longer gets a file: URL there.
const root = process.cwd();
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

interface HookCommand {
  type: string;
  command: string;
}
interface HookMatcher {
  matcher?: string;
  hooks: HookCommand[];
}
const settings = JSON.parse(read('.claude/settings.json')) as {
  hooks: Record<string, HookMatcher[]>;
};

/** Every `command` string across every lifecycle event in settings.json. */
const hookCommands = Object.values(settings.hooks)
  .flat()
  .flatMap((entry) => entry.hooks)
  .map((hook) => hook.command);

describe('hook scripts are committed executable', () => {
  // The exec bit must be in the INDEX, not just on disk: git is what a fresh clone and CI
  // get. Committed 100644, the hook is invoked and dies with exit 126 — non-blocking, so
  // the failure never reaches the agent. Restore with:
  //   git update-index --chmod=+x .claude/hooks/*.sh
  const entries = execFileSync('git', ['ls-files', '-s', '.claude/hooks/'], {
    cwd: root,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .map((line) => {
      const [mode, , , path] = line.split(/\s+/);
      return { mode, path: path ?? '' };
    })
    .filter((entry) => entry.path.endsWith('.sh'));

  it('finds the hook scripts at all', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  for (const entry of entries) {
    it(`${entry.path} is mode 100755 in git`, () => {
      expect(entry.mode, `${entry.path} is committed non-executable`).toBe('100755');
    });
  }
});

describe('settings.json wiring points at real scripts', () => {
  it('registers both lifecycle events', () => {
    expect(Object.keys(settings.hooks).sort()).toEqual(['PostToolUse', 'Stop']);
  });

  for (const command of hookCommands) {
    // The path inside the quotes, with the ${CLAUDE_PROJECT_DIR:-.} prefix stripped.
    const scriptPath = command.match(/\$\{CLAUDE_PROJECT_DIR:-\.\}\/([^"]+)/)?.[1];

    it(`resolves the script in: ${command}`, () => {
      expect(scriptPath, `no \${CLAUDE_PROJECT_DIR:-.}-relative path in: ${command}`).toBeTruthy();
      expect(existsSync(resolve(root, scriptPath as string))).toBe(true);
    });

    it(`invokes through bash, with a default for an unset project dir: ${command}`, () => {
      // `bash "..."` ignores the exec bit outright; `:-.` keeps `set -u` from aborting the
      // script with exit 1 before it can resolve its own location.
      expect(command.startsWith('bash "')).toBe(true);
      expect(command).toContain('${CLAUDE_PROJECT_DIR:-.}');
    });
  }
});

describe('hook scripts fail closed', () => {
  const scripts = ['.claude/hooks/post-edit-verify.sh', '.claude/hooks/stop-gate.sh'];

  for (const script of scripts) {
    const source = read(script);

    it(`${script} does not silently swallow a broken toolchain`, () => {
      // The original bug: `node ... 2>/dev/null` treated "node missing" and "package.json
      // unparseable" as "script not defined", skipping every gate and exiting 0.
      expect(source).toContain('command -v node');
      expect(source).not.toMatch(/scripts\?\.\[.*2>\/dev\/null/);
    });

    it(`${script} only ever blocks with exit 2`, () => {
      // Any other non-zero status is non-blocking and never reaches the agent, so a
      // "failure" exit that isn't 2 is indistinguishable from success.
      const exits = [...source.matchAll(/^\s*exit (\d+)/gm)].map((m) => m[1]);
      expect(exits.length).toBeGreaterThan(0);
      expect(exits.every((code) => code === '0' || code === '2')).toBe(true);
    });
  }
});
