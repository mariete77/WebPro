# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page scrollytelling site for a fictional restaurant ("Lumière"). Stack: **React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + GSAP ScrollTrigger**. There is no router, no backend, no test suite.

## Commands

- `npm run dev` — Vite dev server
- `npm run build` — `tsc -b && vite build` (typecheck then bundle)
- `npm run lint` — ESLint over the repo
- `npm run preview` — serve the built `dist/`

No test runner is configured.

## Architecture

`src/App.tsx` mounts two siblings: `Navbar` (floating pill nav) and `VideoScrollSequence` (the entire experience). All scrollytelling logic lives in **`src/components/VideoScrollSequence.tsx`** — read it before touching anything visual.

### How the scroll sequence works

- The component renders a `<section>` whose height is `scrollHeightVh` (default 760vh). Inside is a `sticky top-0 h-screen` stage with a `<canvas>` covering it.
- A precomputed sequence of WebP frames is loaded on mount (`FRAME_COUNT = 147`). Two sets exist:
  - Desktop (landscape): `public/images/frame_001.webp` …
  - Mobile (portrait): `public/images/mobile/frame_001.webp` …
  The set is chosen once at mount via `matchMedia('(max-width: 767px)')` — resizing the window mid-session does **not** swap sets (intentional, to avoid reloading 147 images).
- A single GSAP `ScrollTrigger` with `scrub: true` maps scroll progress (0..1) to a frame index and redraws the canvas with a "cover" fit. Progress is also stored in React state so the overlay beats re-render.

### The "beats" system

Narrative overlays are declared as a `BEATS: Beat[]` array, each with:
- `at` — scroll progress 0..1 where the beat is centered
- `from` — direction the beat enters from (`'top' | 'bottom' | 'left' | 'right'`); it exits the opposite way
- One of: `words[]+subtitle` (giant staggered hero text), `reviews[]`, `gallery[]`, `menu[]`, or `contact` — each renders a different layout
- For composite beats (reviews/gallery/menu), each sub-element has its own `from` and `atOffset` so children stagger independently around the parent's `at`

Visibility math is centralized in `beatStyle(progress, at, from)`:
- `BEAT_RANGE = 0.12` controls how wide each beat's window is
- `HOLD = 0.42` defines the "reading plateau" (fully visible, no motion) inside that window
- Outside the plateau, a smootherstep curve drives opacity, translate (90px travel), scale, and blur for entry/exit

To add or move content, edit the `BEATS` array — do not duplicate the per-element animation code; reuse `beatStyle`.

### Tailwind v4 setup

There is **no `tailwind.config.js`**. The design tokens live in `src/index.css` inside a `@theme { … }` block: neutral palette, `Readex Pro` font, and a base-4 spacing scale with named extensions (`--spacing-2xl` … `--spacing-7xl`). When adding new design tokens, put them in this `@theme` block so Tailwind picks them up.

The `.hero-title` utility (also in `index.css`) is the convention for the giant lowercase headings — `letter-spacing: -0.04em; line-height: 0.95`.

## Design conventions

`design.md` is the source of truth for the visual system (monochrome, sharp edges everywhere, opacity-based hover, no shadows except modals, generous whitespace, base-4 spacing). `PruebaDesign.md` is the original brief for the hero/navbar pattern — useful as reference for the floating-pill navbar and stat-block layouts.

Two conventions enforced across the codebase:
- **All visible copy is lowercase** (a brand choice, not a CSS hack — write it lowercase in the source).
- **`border-radius: 0` everywhere** except the pill nav and pill buttons, which use `rounded-full` by design.

## Notes

- `AGENTS.md` describes an `agentmemory` MCP integration used by other agent runtimes (opencode). It does **not** apply to Claude Code — ignore unless the user asks about it.
- `andrej-karpathy-skills-main/` is unrelated vendored material; do not modify or document it as part of this project.
- The large binary `Video_unido_2_1.mp4` and `iii.exe` at the repo root are source assets, not deliverables — leave them alone unless asked.
