<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Nate's Space - Changelog

All notable changes to this project will be documented in this file.

## [1.1.3] - 2026-03-20

### Added
- **`music.html`**: Full music library page with search, track list from `NatesData.musicCatalog`, fixed bottom player (play/pause, prev/next, scrub, download link).
- **`tools/scan-music.mjs`**: Dev helper — `node tools/scan-music.mjs` prints JSON stubs for new files in `assets/music/`.

### Changed
- **Data model**: `musicCatalog` replaces standalone `playlist`; EP sidebar / focus / mobile players use `NatesData.getEpTracks()` (entries with `includeOnEp: true`).
- **Navigation**: Feed ↔ Music links in the top nav on `index.html` and `music.html`.
- **`theme-layout.js`**: Theme toggle works on pages without `.main-grid` (e.g. music page).

## [1.1.2] - 2026-03-20

### Changed
- **JavaScript architecture**: Replaced monolithic `script.js` with ordered modules under `js/` (`overlay-utils`, `toast`, `theme-layout`, `particles`, `scroll-reveal`, `playlist`, `audio`, `modals`, `lightbox`, `posts`, `app-init`). No bundler; load order is explicit in `index.html`.
- **Data model**: `NatesData.playlist` is the single source for sidebar, focus, and mobile EP rows; `NatesData.images` supplies stable gallery lightbox metadata (`views`, likes, comments).
- **Feed markup**: Removed duplicate static `article.post` blocks from `index.html`; the feed is rendered only from `NatesData.posts` (still requires `assets/data.js`).

### Fixed
- **Lightbox**: Delegated clicks on `.post .media-container img` and gallery images so data-rendered posts open the image modal.
- **Action buttons**: Delegated “pulse” feedback for `.action-btn` so dynamically rendered posts behave like static markup.
- **Audio**: Consolidated `timeupdate` / `loadedmetadata` / `play` / `pause` handlers; removed `playTrack` monkey-patch; playlist UI sync uses track index from `NatesData.playlist`.

### Security / hygiene
- **XSS hardening**: Post cards and toasts use `textContent` / `createElement` instead of string `innerHTML` for user-facing copy; modal view line uses a created `span` instead of HTML interpolation.

## [1.1.1] - 2026-03-20

### Changed
- **Documentation**: Refreshed `ARCHITECTURE.md` (actual tree, data-driven feed, particles, scroll reveal, cache `?v=110`, swipe lightbox).
- **Documentation**: Expanded `SBOM.md` (dev tools under `tools/`, optional `heic-convert`, `.gitignore` / `localStorage` keys).
- **Documentation**: Added `STYLE_GUIDE.md`; linked from `SUMMARY.md` and `README.md`.
- **Documentation**: Reconciled `SCRATCHPAD.md` (stale “immediate” items marked done).

### Fixed
- **Changelog accuracy** [AMENDED]: v1.1.0 listed “Dark Spaces” as WAV in players; the site references **M4A** (`assets/music/Dark Spaces Natee  V2.m4a`). WAV may exist locally for encoding but is gitignored.

---

## [1.1.0] - 2026-01-14

### Added
- **Animated Brand Logo**: Added a gradient "shine" animation to the "NATE'S SPACE" logo in the navigation bar.
- **Mobile UI Refinements**:
  - Reduced size of "Creative Circle" bubbles and "Studio Gallery" thumbnails on mobile for better space utilization.
  - Adjusted `object-position` for post preview images to highlight the top-center (artist/focus area) on portrait screens.
  - Implemented automatic layout adjustments for the image lightbox on mobile (stacked view).
- **Content**:
  - Added new EP track: **"Dark Spaces"** to all music players (M4A: `assets/music/Dark Spaces Natee  V2.m4a`).

### Fixed
- **Mobile Video Player**: Centered the video play button overlay across all mobile aspect ratios.
- **Image Lightbox**: Adjusted the details/comments section to be a scrollable "bottom sheet" on mobile, preventing it from pushing the main image off-screen.
- **Asset Caching**: Incremented asset query strings to force cache refreshes on live deployments. [AMENDED 2026-03-20]: Was `?v=110` on `styles.css` / `script.js`. [AMENDED 2026-03-20 again]: **v1.1.2** uses `?v=111` on `styles.css` and each `js/*.js` (monolithic `script.js` removed).

---

## [1.0.0] - 2026-01-12

### Added
- Initial release of Nate's Space - a pure HTML/CSS/JS personal portfolio site.
- **Profile Card** with avatar image, status indicator, bio, and action buttons.
- **Studio Gallery** with 4 images in a 2x2 grid.
- **Creative Circle** friends section with 6 connections.
- **Post Composer** (UI only) for sharing updates.
- **Feed Posts** (Video, Photo, Update types) with dynamic glassmorphism styling.
- **Theme Toggle** - Dark/Light mode with localStorage persistence.
- **Layout Toggle** - Left sidebar, Right sidebar, Focus mode (desktop only).
- **Image Lightbox (Facebook-style)**:
  - Two-column desktop layout (Image Left / Details Right).
  - Keyboard navigation and dynamic metadata injection.
- **Apple Music Integration**: Embedded tracks via a dedicated modal player.

### Technical
- Pure HTML5, CSS3, JavaScript (no frameworks).
- Google Fonts: Outfit & Space Mono.
- CSS custom properties for theming.
- SVG icons inline.
