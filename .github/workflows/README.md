# `.github/workflows/` — GitHub Actions (CI)

Automation that runs on **GitHub's servers** when a pull request is opened or code lands on `main`. This is the *remote* half of the build loop — a clean-machine re-run of the same gates Claude Code runs locally.

## What's here

### `ci.yml` — verification
On every PR (and push to `main`), on a fresh Ubuntu machine: `npm ci`, then `typecheck` → `lint` → `test` → `build` → `e2e`. If anything fails, the PR shows a red ❌ and should not be merged.

## Why run the gates again if they passed locally?
- **"Works on my machine" defense.** A clean checkout catches anything that only passed locally because of cached deps, env vars, or uncommitted files.
- **Merge gate.** Auto-deploy fires on merge, so a green CI check is the proof that what's about to deploy is actually sound.
- **Backstop.** If the agent ever commits without properly running local gates, CI catches it. Defense in depth.

## Important boundary: this is CI, not CD
This workflow **only verifies**. It does **not** deploy.
Deployment is handled outside GitHub Actions: **Vercel** (frontend) and **Railway** (backend) deploy automatically on merge from their own dashboards. We deliberately keep deploy out of here so the two systems don't duplicate or fight each other. If you ever want deployment centralized in Actions instead, that's a conscious decision to make later — not the current setup.

## Note on the e2e step
`ci.yml` installs Playwright browsers (`npx playwright install --with-deps`) before running e2e. That step is slow; it's why e2e runs after the cheaper gates — fail fast on the cheap stuff first.
