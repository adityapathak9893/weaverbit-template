# BRAND.md — How Everything Weaverbit Looks and Feels

> This writes down the look-and-feel that every Weaverbit product shares, so it never has to be re-decided. It is owned by Aditya. The actual colors, fonts, and shared building blocks live in the `weaverbit-core` package; this document explains the choices in plain words and is the reason behind them.
>
> Plain rule: if a design decision on any product conflicts with this document, this document wins — unless Aditya changes it here first.
>
> **Version:** 0.1

---

## 1. The feeling we are going for

**Calm, clean, and precise. Quiet confidence.**

Like a well-organized workshop, not a flashy showroom. The look should feel careful and intentional, the kind of thing that makes someone think *"the person who made this is good at their craft"* — without needing decoration to prove it.

This is the anchor. Every other choice below exists to serve this feeling. When in doubt about any design question, ask: *does this feel calm, clean, and precise?* If it adds noise, drop it.

What this feeling is **not**: busy, colorful, trendy, loud, or trying-too-hard. We earn trust by being quiet and exact, not by shouting.

---

## 2. The fonts (the lettering)

Three fonts, each with one clear job:

- **Headings — Space Grotesk.** The big text: titles, the main line on a page. It is clean but has a little character, so it feels crafted and a touch technical without being loud.
- **Body — Inter.** The normal text you actually read: paragraphs, descriptions. It is plain and very easy on the eyes. Its job is to get out of the way.
- **Technical bits — a typewriter-style (monospace) font.** Used only for small labels and technical things (see the signature, §4).

Plain rule: headings are Space Grotesk, everything you read is Inter, and the typewriter font is reserved for the small technical details. Never mix them up.

---

## 3. The colors

Only three colors really matter; everything else follows from them.

- **Background — soft white.** A gentle, warm-ish white, like good paper. Not harsh pure-white.
- **Text — soft near-black.** Very dark, but not pure black (pure black is too harsh on the soft white).
- **Accent — muted teal.** This is the one spot of color. It is used *sparingly*: links, a button, a small highlight, the status dots. It is what makes the look distinctive instead of just another blue site.

Plain rule: the page is mostly soft white and near-black and feels calm. Teal appears only in small, deliberate places. If teal is everywhere, we have done it wrong — the whole point is that it is rare, so it means something when it shows up.

(The exact color values are defined once in `weaverbit-core` so every product uses the identical shades. There is also a dark version of these colors for people who prefer a dark screen; it follows the same idea — soft dark background, soft light text, the same teal adjusted to stay readable.)

---

## 4. The signature (the small detail that makes it ours)

**The typewriter font for small labels and technical bits.**

Across every Weaverbit product, certain small things always appear in the typewriter-style (monospace) font:
- section labels (like a small "PORTFOLIO" or "WRITING" heading)
- web addresses (like `cite.weaverbit.com`)
- dates, status tags (like a small "LIVE" or "UPCOMING")
- code, of course

Everything else uses the normal fonts (§2). This one detail is quiet, but it ties every page together and gently signals "an engineer made this" — which is exactly who we are. It costs nothing and never clutters the page, which is why it fits the calm feeling.

Plain rule: technical and label-like things wear the typewriter font; human-readable content does not.

---

## 4b. Display modes (the same brand, shown five ways)

Every Weaverbit product lets the visitor choose how the page is displayed. **All of these share the exact same brand** — same teal, same fonts, same calm feeling. They only change brightness and contrast. The identity never changes; only the comfort does.

The five:

1. **Light** — soft white background, near-black text. The calm default look.
2. **Dark** — soft dark background, light text, teal adjusted so it stays easy to read. For people who prefer dark screens.
3. **High-contrast** — stronger black-and-white, bolder text. For accessibility (low vision, or anyone who finds the soft look too gentle). Most sites skip this; we don't — it signals a careful builder.
4. **Dim / reading** — a softer, lower-glare, warmer middle ground. Easy on the eyes for long reading; especially good for the blog.
5. **System-auto** — not a separate look, but a setting: it automatically uses Light or Dark based on the visitor's device. **This is the default** — a new visitor gets whatever their device prefers, and can switch to any of the looks above.

Plain rules:
- All five must keep the brand intact — teal stays the accent, fonts stay the same, the feeling stays calm. A mode only changes how bright and how contrasty the page is.
- Every screen must look right and stay readable in **all four looks** (Light, Dark, High-contrast, Dim). Checking this is part of finishing any product.
- High-contrast and Dim are the two that need real care — they must be deliberately designed, not just "Light turned slightly darker." Their exact colors are defined in `weaverbit-core`.
- The set of modes and a small "switch the look" control live in `weaverbit-core`, so every product gets all five automatically. We build this once, not per product.

---

## 5. How products use this

- Every product installs `weaverbit-core` and gets these fonts, colors, and shared pieces automatically. Nobody re-picks fonts or colors per product.
- A product may **extend** this look for its own needs (a product might need an extra color for a chart, say) — but it must never **contradict** the feeling or swap the core choices. Extensions are described in that product's own `DESIGN_GUIDE.md`.
- The result: all Weaverbit products look like a family. Someone who has seen one recognizes the next.

---

## 6. The one test for any design decision

Before adding anything visual, ask the four questions in order:
1. Does it keep the **calm, clean, precise** feeling? (If it adds noise, stop.)
2. Is it using the **right font for the job**? (Heading / body / technical.)
3. Is **teal staying rare**? (Color only where it earns its place.)
4. Does it respect the **typewriter signature**? (Labels and technical bits, nothing more.)
5. Does it still look right and stay readable in **all four display modes**? (Light, Dark, High-contrast, Dim.)

If all four are yes, it fits Weaverbit. If any is no, change it or leave it out.

---

## Changelog
- **0.1 — <date>** — First pass. Four decisions locked: feeling (calm/clean/precise), fonts (Space Grotesk + Inter + monospace), colors (soft white / near-black / muted teal), signature (monospace for labels & technical bits). Five display modes locked: Light, Dark, High-contrast, Dim/reading, System-auto (default). Exact values to be encoded in `weaverbit-core`. Will be revised as real products use it.
