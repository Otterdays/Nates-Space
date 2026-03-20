<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Debug / verification — 2026-03-20

## Scope
Documentation sync against repository state (no runtime code changes).

## Verified
- `index.html`: `#particleCanvas`, `styles.css?v=110`, `script.js?v=110`, script order `assets/data.js` → `script.js`.
- `script.js`: `renderPosts()`, `NatesData`, particle loop, `revealObserver`, lightbox swipe handlers, EP track paths.
- `assets/data.js`: `images` + `posts` consumed by gallery and feed.
- Root: `.gitignore`, `.nojekyll` present; converters live under `tools/`.

## Notes
- Workspace listing may omit large `assets/*` binaries; paths still referenced in HTML/JS and documented in `SBOM.md`.
