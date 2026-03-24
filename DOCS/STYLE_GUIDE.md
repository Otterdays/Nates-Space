<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Nate's Space — Style Guide

Conventions for this repo (vanilla HTML/CSS/JS). Prefer matching existing patterns over introducing new ones.

## Trace tags (optional)

Link non-obvious logic to docs when helpful:

```text
// [TRACE: DOCS/ARCHITECTURE.md]
```

Use sparingly; types and clear names beat comments.

## JavaScript (`script.js`)

- **Naming**: `camelCase` for variables and functions; `PascalCase` only if matching global data (`NatesData`).
- **Globals**: `assets/data.js` defines `NatesData` before `script.js` loads; avoid polluting `window` beyond that pattern.
- **Async / I/O**: Use `async/await` where async exists; at user-action boundaries (e.g. clipboard, `video.play()`), handle failures — log or user-visible feedback, do not swallow errors silently.
- **DOM**: Query once where practical; reuse listeners when re-rendering (e.g. re-observe scroll-reveal after `renderPosts()`).

## Data (`assets/data.js`)

- **Shape**: Keep gallery metadata and `posts` array structure aligned with `renderPosts()` in `script.js`.
- **Paths**: Media paths are relative to site root (e.g. `assets/...`).

## HTML (`index.html`)

- Semantic sections; keep cache-bust query on `styles.css` and `script.js` in sync when shipping asset changes (currently `?v=110`).
- **Order**: `assets/data.js` before `script.js`.

## CSS (`styles.css`)

- **Naming**: `kebab-case` classes matching existing BEM-like blocks (e.g. `.glass-panel`, `.hero-section`).
- **Theming**: Use `data-theme` on `<html>` and CSS custom properties already defined under `:root` / `[data-theme="light"]`.

## Tools (`tools/`)

- **HEIC → JPG**: `convert.js` (CommonJS) and `convert.mjs` (ESM) use npm package `heic-convert` — dev-only, not loaded by the live site.
- **Audio**: `convert_audio.bat` references paths under `assets/music/`; large sources may be gitignored per root `.gitignore`.

## JavaScript modules (`js/`) [AMENDED 2026-03-20]

- **Layout**: Ordered IIFE files under `js/`; no bundler. Load sequence is defined in `index.html` (see `DOCS/ARCHITECTURE.md`).
- **Intentional `window` usage**: `renderPlaylist`, `renderPosts`, `playTrack`, `formatTime`, `showToast`, `lockBodyScroll` / `unlockBodyScroll`, `openVideoModal` / `closeVideoModal`, `revealObserver`, `currentTrack`, `isPlaying`.
- **Cache bust**: When shipping, bump the same `?v=` on `styles.css` and **every** `js/*.js` reference together.

The section **JavaScript (`script.js`)** above still describes naming and discipline; read “the bundle” as the combined `js/*.js` surface, not a single file.

**Music [2026-03-20]:** Full workflow, tables, and troubleshooting → **[MUSIC_GUIDE.md](./MUSIC_GUIDE.md)**. In code: `js/music-files.js` (`MY_MUSIC_FILES` between markers, optional `MY_MUSIC_TITLES` / `MY_EP_FILES`); refresh list with `node tools/scan-music.mjs --apply`.

**Firebase [2026-03-23]:** Operator setup (User UID in `firestore.rules`, Auth domains, config) → **[FIREBASE_GUIDE.md](./FIREBASE_GUIDE.md)**. In code: `js/firebase-config.js`, `js/firebase-feed.js`; trace tags may reference SCRATCHPAD / ARCHITECTURE.

## Documentation (`DOCS/`)

- **Workflow**: See user/project rules — update `SCRATCHPAD.md` and `SBOM.md` when changing assets or dependencies.
- **Commits**: Conventional Commits, e.g. `docs(scope): description`.
