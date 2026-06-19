# `.claude/commands/` — slash commands

**Slash commands** are reusable prompts you trigger by typing `/<name>` in Claude Code. They turn a multi-step instruction you'd otherwise retype into a single shortcut, so common workflows stay consistent every time.

## What's here

### `/review` → `review.md`
Runs a fresh-context critique of the current diff before a PR: shows the changes, hands them to the `code-reviewer` subagent, and reports findings by severity. Won't open the PR until blockers are resolved.

### `/new-post` → `new-post.md`
Scaffolds a new blog post: creates `content/blog/<slug>.mdx` with correct frontmatter and a skeleton. Locked to `published: false` so nothing goes live by accident. Usage: `/new-post My Post Title`.

## File format
Each command is a Markdown file. The filename (minus `.md`) is the command name. Optional YAML frontmatter:
```
---
description: <shown in the command list>
argument-hint: <expected args, e.g. "<post title>">
---
<the prompt that runs when the command is invoked>
```
Use `$ARGUMENTS` in the body to capture whatever the user types after the command.

## Adding a command
Drop a new `.md` file here. Keep it focused on one workflow. Good candidates as the project grows: `/new-product` (scaffold a new subdomain product from the harness), `/changelog` (draft release notes from recent commits).
