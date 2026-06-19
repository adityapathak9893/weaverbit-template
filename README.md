# weaverbit-template — the starter folder

> Copy this folder to start any new Weaverbit product. It already contains the rulebook, the folder map, the planning forms, and the safety checks, so every product begins the same correct way.

## What's inside

- **`docs/`** — the fill-in-the-blank planning forms you complete at the start of every product, before any code:
  - `PRODUCT_SPEC.md` — what it is and why (form)
  - `WORKFLOW_DATAFLOW.md` — how it behaves and how data moves (form)
  - `SYSTEM_DESIGN.md` — the technical plan (form)
  - `DESIGN_GUIDE.md` — how this product looks, extending the shared brand (form)
- **`CLAUDE.md`** — the agent's operating manual (the build loop, the rules). Copied in, ready.
- **`.claude/`** — the safety checks: hooks (auto typecheck/lint after edits, full test gate before finishing), the code-reviewer, and the slash commands.
- **`.github/workflows/`** — the second safety net that re-runs the checks on GitHub.
- **`CODE_STANDARDS.md`** — the "boring, readable, handcrafted-quality" code rules. Inherited as-is; not filled in per product (note any product-specific addition at the bottom of the file).
- The reference docs that govern everything: `PROCESS.md` (the rulebook), `STRUCTURE.md` (the folder map), `BRAND.md` (the look-and-feel). These can live here or be linked from a shared place — the point is every product can see them.

## How to start a new product (plain steps)

1. **Copy this folder** into a new repository named after the product (e.g. `weaverbit-web`, `cite`).
2. **Install the brand:** add `weaverbit-core` (the shared look-and-feel package) from GitHub.
3. **Give the brief:** tell the agent, in plain words, what the product is.
4. **The agent fills the four forms** in `docs/` from your brief, and lists any open questions.
5. **You review and approve each form.** This is the gate. Nothing gets coded until you've approved. Correcting a plan here is cheap; correcting built code is expensive — that's the whole point.
6. **The agent builds, one slice at a time**, through the loop in `CLAUDE.md`: write → auto-checks → tests → self-review → open a request for you to merge.
7. **You review each slice and merge it.** You also look at it with your own eyes — no check can tell you if it *looks* right. Then you deploy.
8. **If the process missed something,** note it and improve the rulebook deliberately (PROCESS.md §8). The process gets better by being used.

## The one rule to remember
Plan first, approve the plan, then build in small reviewed pieces. The forms and the checks exist so that what gets built is what you would have built — and so anything else gets caught before it ships.
