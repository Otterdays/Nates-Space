<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Nate's Space - Changelog

All notable changes to this project will be documented in this file.

## [1.2.5] - 2026-03-23

### Added
- **DOCS/AGENT_ONBOARDING.md** — agent read order, symptom→cause triage, git/doc rules, index of `DOCS/debugs/` logs.
- **DOCS/debugs/debug_2026-03-23_firebase-feed-feed-visibility.md** — chronological incident log (API key typos, Auth enable, authorized domains, rules, invisible `scroll-reveal` posts, composer gating).

### Changed
- **SUMMARY.md** (hosting line + Quick Links), **README.md**, **STYLE_GUIDE.md**, **SCRATCHPAD.md**, **ARCHITECTURE.md** (tree): link onboarding + debug log.

## [1.2.4] - 2026-03-23

### Fixed
- **Feed posts invisible after Firestore merge**: `article.post` used `scroll-reveal` (opacity 0 until `.visible`); IntersectionObserver often did not flip visibility for re-rendered cards — removed reveal from feed posts only (`js/posts.js`). Cache `v=125`.

### Added
- **DOCS/FIREBASE_GUIDE.md** — User UID for `firestore.rules`, authorized domains, config parity, API key notes; linked from SUMMARY and ARCHITECTURE.

### Changed
- **DOCS**: SCRATCHPAD Firebase checklist marked done where verified; open item = paste owner UID + publish rules.

## [1.2.3] - 2026-03-23

### Added
- **Firebase feed (optional)**: Firestore `posts` collection + Google sign-in for owner-only writes; `js/firebase-feed.js` merges live posts with static `assets/data.js`; composer **Share** persists text updates. CDN: Firebase compat 10.14.1.
- **`firestore.rules`** + **`firebase.json`** for `firebase deploy --only firestore:rules`; **`js/firebase-config.example.js`** and committed **`js/firebase-config.js`** (`null` = static-only until filled).

### Changed
- **Composer**: `id` / `name` / `maxlength` on textarea; `type="button"` on composer controls; nav **Sign in** / **Sign out** (`#firebaseAuthBtn`, hidden until Firebase config valid).

## [1.2.2] - 2026-03-20

### Changed
- **Default (dark) theme**: Slightly brighter base (`--bg-primary` #151522, stronger glass/text tokens, softer panel shadow, richer background orbs).
- **Mobile / notched devices**: `viewport-fit=cover`; safe-area padding on feed container, nav, bottom player, expanded player, music dock, and music page shell; `100dvh` on `.app-layout` / `.music-page-body`; light-mode fixes for mobile track list + progress bar + music library rows.

### Technical
- **CSS**: `--bg-elevated`, `--player-gradient-start/end` for theme-aware mobile bar / full-screen player / toasts / image modal sheet; hero overlay tints for light theme.

## [1.2.1] - 2026-03-20

### Added
- **DOCS/MUSIC_GUIDE.md** — step-by-step guide for `assets/music/`, `js/music-files.js`, and `scan-music.mjs --apply` (troubleshooting + tables).

### Changed
- **Documentation**: Linked MUSIC_GUIDE from README, SUMMARY, ARCHITECTURE (structure, components, mermaid, feed pipeline), SBOM, STYLE_GUIDE; corrected stale “musicCatalog / data.js markers” references.

## [1.2.0] - 2026-03-20

### Changed
- **Music**: One list only — `js/music-files.js` with `MY_MUSIC_FILES` (exact filenames in `assets/music/`). Music page does not load `data.js`. Removed `music-catalog-merge.js`, scan markers in `data.js`, and `--write` flow.

### Added
- **Optional** `MY_MUSIC_TITLES`, `MY_EP_FILES`, `MY_MUSIC_ARTIST` in `music-files.js`.

### Removed
- `js/music-catalog-merge.js`.

## [1.1.5] - 2026-03-20

### Fixed
- **Music catalog + `file://`**: Browsers often block loading extra local `.js` files; the scan list now lives inside `assets/data.js` between `AUTOGEN_MUSIC_SCAN` markers (removed `js/music-catalog.generated.js`).
- **`scan-music.mjs --write`**: Handles Windows CRLF when replacing markers.

## [1.1.4] - 2026-03-20

### Added
- **`js/music-catalog.generated.js`**: Auto-built list of every audio file in `assets/music/` (regenerate with `node tools/scan-music.mjs --write`).
- **`js/music-catalog-merge.js`**: Merges scan + `musicTrackOverrides` + `epTrackSrcs` into `getMusicCatalogMerged()` / `getEpTracks()`.

### Changed
- **`assets/data.js`**: Replaced hand-maintained `musicCatalog` with `epTrackSrcs` and `musicTrackOverrides` (paths must match filenames in `assets/music/`).
- **`tools/scan-music.mjs`**: `--write` flag updates the generated catalog; default mode still prints JSON to stdout.

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
