# `.claude/agents/` — subagents

**Subagents** are specialized assistants Claude Code can invoke, each running in its **own separate context**. That separation is the whole point: a fresh context means the reviewer isn't biased by the reasoning that produced the code, so it actually catches problems instead of rationalizing them.

## What's here

### `code-reviewer.md`
A principal-level reviewer invoked on a diff **before a PR is opened**. It reads the change against `CLAUDE.md`, `SYSTEM_DESIGN.md`, and `UI.md`, and reports findings by severity (BLOCKER / MAJOR / MINOR / NIT) across: correctness, security, GDPR/PII, type safety, architecture adherence, design adherence, SEO, tests, and maintainability.
Invoke it via the `/review` slash command, or it runs as the self-review step in the build loop (`CLAUDE.md` §6).

## File format
Each subagent is a Markdown file with YAML frontmatter:
```
---
name: <invocation name>
description: <when Claude should use this subagent>
tools: <comma-separated tools it may use, e.g. Read, Grep, Glob, Bash>
---
<the system prompt that defines the subagent's behavior>
```

## Adding a subagent
Create a new `.md` file here with the frontmatter above and a focused prompt. Keep each subagent **single-purpose** — one job, done well, beats a vague generalist. Give it only the tools it needs.
Ideas as the portfolio grows: a `security-auditor` for pre-release passes, an `a11y-checker`, a `seo-checker`.
