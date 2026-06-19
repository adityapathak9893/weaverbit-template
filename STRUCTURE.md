# STRUCTURE.md — Folder Structure Standard

> Part of the Weaverbit process (see `PROCESS.md`). Defines the folder structure **every** product follows. Authored and owned by Aditya. Agents do not deviate; if a product genuinely needs a structure this doc doesn't cover, the agent STOPS and asks rather than inventing one.
>
> **Model:** a shared **spine** (identical in every product) + per-archetype **extensions** (the parts that legitimately differ between a content site, an app, and a service).
> **Version:** 0.1

---

## 1. Organizing principle (the one rule that governs everything)

**Hybrid, feature-first.** Code is grouped by the *feature* it belongs to, not by its technical *kind*. A feature owns its components, hooks, logic, and types, colocated in one folder. Generic, cross-feature code lives in a small shared layer.

**Why feature-first:** to understand or change a feature, you open one folder and it's all there. Adding or removing a feature is adding or removing a folder. This survives growth and keeps PR diffs coherent (one feature = one folder = a reviewable unit), which is what makes line-by-line human review practical.

### 1.1 The graduation rule — HARD RULE

> Code starts inside the feature that needs it. It **graduates** to a shared location (`lib/`, `components/ui/`) **only when a second feature actually imports it** — not when it *might* be shared, not preemptively.

- Premature sharing is a defect (it couples features through speculative abstractions). So is leaving genuinely-shared code duplicated across features once a second consumer exists.
- **Enforcement:** the `code-reviewer` flags (a) anything placed in `lib/` or `components/ui/` that has only one consumer (should live in that feature), and (b) the same logic duplicated in two features (should now graduate). This is not guidance; it is checked on every PR.

---

## 2. The spine — identical in EVERY product

These exist in every Weaverbit repo, in these exact locations, regardless of app type:

```
<product>/
├── PRODUCT_SPEC.md            # planning docs (PROCESS.md §3) live at root
├── WORKFLOW_DATAFLOW.md
├── SYSTEM_DESIGN.md
├── DESIGN_GUIDE.md
├── CODE_STANDARDS.md
├── CLAUDE.md                  # harness — identical across products
├── .claude/                   # hooks, agents, commands
├── .github/workflows/         # CI (verification only)
├── .env.example               # documents required env vars; never real secrets
├── .gitignore
├── README.md                  # what this product is, how to run, pointers to docs
├── tsconfig.json / config     # baseline config, same conventions everywhere
├── tests/                     # unit + integration (vitest)
├── e2e/                       # end-to-end (Playwright)
├── public/                    # static assets
└── src/
    ├── features/              # ← feature-first: the bulk of product code
    ├── components/ui/          # generic, feature-agnostic primitives (thin — most come from weaverbit-core)
    ├── lib/                   # shared utilities & clients (db, analytics wrapper, helpers) — NO business logic
    ├── styles/                # global styles / token wiring
    └── types/                 # ONLY truly global types; feature-specific types live in their feature
```

**Spine rules (all products):**
- **Brand always comes from `weaverbit-core`** (fonts, design tokens, mono-voice, shared primitives). Never redefined locally. A product may *extend* the brand in `DESIGN_GUIDE.md`, never contradict it.
- **`lib/` holds no business logic** — only cross-cutting utilities and external-service clients. Business logic belongs to a feature.
- **`types/` is for global types only.** A type used by one feature lives in that feature.
- **Planning docs at root**, always findable in the same place.
- **Tests mirror the code** they cover; `tests/` for unit/integration, `e2e/` for Playwright.

---

## 3. Anatomy of a feature

Every folder under `src/features/<feature>/` is self-contained:

```
src/features/<feature>/
├── components/        # UI specific to this feature
├── hooks/             # React hooks specific to this feature (if any)
├── lib/               # logic/helpers specific to this feature
├── types.ts           # this feature's types
├── index.ts           # the feature's PUBLIC API — what other code may import
└── README.md          # only if the feature has a non-obvious convention (PROCESS.md / CLAUDE.md §11)
```

**Feature rules:**
- **Import across features goes through `index.ts` only.** A feature's internal files are private; other code imports from `features/x` (the barrel), never deep-reaching into `features/x/lib/internal-thing`. This keeps features swappable and the public surface explicit.
- **Features should not import each other circularly.** If two features need each other, the shared piece probably graduates to `lib/` (see §1.1).
- A feature is a *cohesive slice of product capability* (e.g. `blog`, `portfolio`, `feedback`, `document-upload`, `qa-chat`) — not a single component and not the whole app.

---

## 4. Per-archetype extensions

The spine is fixed; the parts below differ by app type. The archetype is declared in the product's `SYSTEM_DESIGN.md`.

### 4.1 Content site (e.g. weaverbit.com) — Next.js App Router
```
src/
├── app/                       # ROUTES ONLY — thin; pages import from features and wire them
│   ├── (marketing)/           # route groups for related pages
│   ├── blog/
│   └── api/<endpoint>/route.ts
├── features/                  # portfolio, blog, feedback, …
content/                       # MDX content (e.g. content/blog/*.mdx) at root, not in src
```
- `app/` is wiring only: a route file composes feature components and fetches data; it contains no business logic.
- Content (MDX) lives in a top-level `content/` directory, version-controlled.

### 4.2 Interactive app (e.g. Cite) — Next.js or Vite
```
src/
├── app/ or routes/            # routes/pages — thin
├── features/                  # the product's capabilities, feature-first
├── lib/                       # api client, auth client, etc.
```
- Same spine, same feature-first rule. The difference is more interactive features and client-side state; state management (if any) lives inside the feature that owns it, graduating to `lib/` only if cross-feature.

### 4.3 Service / API (future) — Node/Express or similar
```
src/
├── routes/ or handlers/       # HTTP layer — thin, validates input, calls features
├── features/                  # domain logic grouped by capability
├── lib/                       # db client, shared infra
```
- Same principle: HTTP handlers are thin; domain logic is feature-grouped; `lib/` is infra/clients only.

**The invariant across all archetypes:** routing/entry layer is thin → features hold the capability → `lib/` holds shared infra → brand comes from `weaverbit-core`. If a new archetype appears, it extends this spine; it does not replace it. Adding an archetype is a deliberate revision to this doc (PROCESS.md §8).

---

## 5. Naming conventions (all products)

- **Folders:** `kebab-case` (`document-upload`, not `documentUpload`).
- **React components:** `PascalCase` files (`ProductCard.tsx`), one component per file as default.
- **Hooks:** `useThing.ts`, camelCase.
- **Utilities/lib:** `kebab-case.ts` or `camelCase.ts` — pick one per repo and stay consistent (template sets the default).
- **Types:** `PascalCase` type names; feature types in the feature's `types.ts`.
- **Barrels:** every feature has an `index.ts` public API; avoid barrel files elsewhere (they hurt tree-shaking and hide dependencies).
- **Tests:** `<name>.test.ts(x)` colocated under `tests/` mirroring source path; e2e specs in `e2e/` named by flow.

---

## 6. Enforcement summary (what the code-reviewer checks)

- Feature-first respected: product code lives in `features/`, not scattered by type. (flag violations)
- Graduation rule (§1.1): nothing in `lib/`/`components/ui/` with a single consumer; no duplicated logic across features that should graduate. (flag)
- `lib/` contains no business logic. (flag)
- Cross-feature imports go through the feature's `index.ts`, no deep imports. (flag)
- Brand imported from `weaverbit-core`, not redefined locally. (flag)
- Naming conventions (§5) followed. (flag)
- Spine present and in the right places (§2). (flag)

Green gates are necessary, not sufficient — Aditya's review is the final structural judgment (PROCESS.md §5).

---

## Changelog
- **0.1 — <date>** — First pass. Hybrid feature-first, graduation rule (hard), shared spine + per-archetype extensions, naming, reviewer enforcement. To be revised as real products (starting with the weaverbit.com rebuild) exercise it.
