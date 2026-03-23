<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Nate's Space - Scratchpad

## Session: 2026-03-23 (Firebase-backed feed)

### Firebase setup checklist (operator)
- [ ] Create Firebase project; enable **Firestore** + **Authentication** (Google provider).
- [ ] Add **Authorized domains**: `localhost`, your Vercel host (e.g. `natee.vercel.app`).
- [ ] Copy `js/firebase-config.example.js` → fill values in `js/firebase-config.js` (or keep `null` for static-only builds).
- [ ] In `firestore.rules`, replace `REPLACE_WITH_OWNER_FIREBASE_AUTH_UID` with your Auth **User UID**; deploy: `firebase deploy --only firestore:rules` or paste rules in Console.
- [ ] Confirm first post from site as signed-in owner; confirm unsigned / wrong user cannot `create` (rules).

### Last actions
- [x] Added `firestore.rules`, `firebase.json`, `js/firebase-config*.js`, `js/firebase-feed.js`; wired `index.html` (composer + nav auth + script order); `styles.css` `.nav-auth-btn`; cache `v=123`.

---

## Current Session: 2026-03-20 (theme + mobile polish)

### Last actions
- [x] Brighter default dark theme in `styles.css` (new surface vars); mobile safe-area + `viewport-fit=cover` on `index.html` / `music.html`; music dock + light-mode mobile/list tweaks; cache `v=122`.

---

## Session: 2026-03-20 (MUSIC_GUIDE + doc sweep)

### Last actions
- [x] Added **DOCS/MUSIC_GUIDE.md**; linked from README, SUMMARY, ARCHITECTURE, SBOM, STYLE_GUIDE; fixed stale music references in ARCHITECTURE; version **v1.2.1**.

---

## Session: 2026-03-20 (Generated music catalog)

### Last actions
- [x] `music-catalog.generated.js` from `assets/music/` via `scan-music.mjs --write`; `music-catalog-merge.js` + `epTrackSrcs` / `musicTrackOverrides` in `data.js`.

---

## Session: 2026-03-20 (Music library page)

### Last actions
- [x] Added `music.html` + `js/music-page.js` (full-catalog player, search, dock UI).
- [x] `NatesData.musicCatalog` + `getEpTracks()`; `playlist.js` / `audio.js` updated; `theme-layout.js` works without `.main-grid`.
- [x] `tools/scan-music.mjs`, nav links Feed/Music, styles, docs + cache `v=112`.

---

## Session: 2026-03-20 (Refactor execution)

### Last actions
- [x] Split `script.js` into `js/*.js` with explicit load order; removed monolith.
- [x] `NatesData.playlist` + `renderPlaylist()` for sidebar / focus / mobile EP UI; `NatesData.images` drives gallery lightbox metadata.
- [x] Delegated lightbox + `.action-btn` interactions; consolidated audio element listeners; posts via `createElement` + `textContent`.
- [x] Cache bump `?v=111` on CSS + JS; `CHANGELOG` / `ARCHITECTURE` / `SUMMARY` / `README` version **v1.1.2**.

---

## Session: 2026-03-20 (Documentation sync)

### Last actions
- [x] Walked repo (`index.html`, `script.js`, `assets/data.js`, `tools/`) and aligned DOCS with actual behavior.
- [x] Added `DOCS/STYLE_GUIDE.md`; added preservation headers across DOCS; bumped summary/changelog to **v1.1.1** for doc release.
- [x] Corrected architecture (data-driven feed, particles, scroll reveal, `?v=110`, `tools/` layout) and SBOM (dev tools, `localStorage` keys, `.gitignore`).

### Next (optional)
- [ ] Content expansion / new posts in `assets/data.js` when ready.

---

## Session: 2026-01-14 (Refinements & "Wow" Factor)

### Todo List 📝
### Completed Tasks ✅
- [x] **Organize Tools**: Moved `convert.js` and `convert.mjs` to `tools/`.
- [x] **Hero Redesign**:
  - [x] Make hero image bigger and integrated into background (immersive).
  - [x] Remove box constraints for a cleaner look.
- [x] **Visual Polish**:
  - [x] **Particle Background**: Add canvas-based particle system ("Space" theme).
  - [x] **Scroll Reveal**: Add fade-in animation for scroll virtualization effect.
- [x] **Mobile QoL**:
  - [x] **Swipe Gestures**: Add touch support (left/right swipe) for the Lightbox.
- [x] **Data Architecture**:
  - [x] **Post Data**: Moved hardcoded HTML posts to `assets/data.js`.
  - [x] **Dynamic Rendering**: Implemented JS logic to render posts from data.

### Completed Tasks ✅
- [x] **Minimized UI Elements**: Made creative circle bubbles and studio gallery thumbnails smaller on mobile for a cleaner look.
- [x] **Visual Polish**: Implemented a smooth color wave/shine animation for the "NATE'S SPACE" logo.
- [x] **Video UI Fixes**: 
  - [x] Centered the video play button overlay on mobile devices.
  - [x] Fixed minimum container heights for videos on small screens.
- [x] **Image Modal Optimization**:
  - [x] Optimized the Facebook-style lightbox for mobile (stacked layout).
  - [x] Capped details section height on mobile to maximize image viewability.
  - [x] Hidden non-essential elements (labels/comments) on mobile modal view.
- [x] **Post Preview Enhancements**: Adjusted `object-position` to `center 35%` on mobile to show the best parts of tracks/photos.
- [x] **Content Update**: Added "Dark Spaces" (WAV) to the EP player (Sidebar, Focus, and Mobile).
- [x] **Cache Control**: Bumped asset versions to `v=100` to ensure mobile refreshes correctly.
- [x] **Git Housekeeping**:
  - [x] Cleared large files (`*.exe`, `*.wav`) from commit history to fix push errors.
  - [x] Added `.gitignore` rules for large binary files.
  - [x] Successfully pushed pending changes to main.

### Immediate Tasks 🛠️
[AMENDED 2026-03-20]: Completed in-tree — hero/immersive header, `#particleCanvas` particle system, `IntersectionObserver` scroll reveal, and `assets/data.js` feed are implemented; see `DOCS/ARCHITECTURE.md`.
- [x] Implement Hero Redesign.
- [x] Add Particle Background logic.
- [x] Implement Scroll Reveal.

---

## Session History
(Previous history compacted)
