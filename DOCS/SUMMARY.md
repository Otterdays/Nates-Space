<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Nate's Space - Project Summary

## What Is This?
A personal portfolio/social-style website for Nate, featuring studio content, music updates, and a glass-ui layout inspired by modern social apps.

## Tech Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (no frameworks)
- **Fonts**: Google Fonts (Outfit, Space Mono)
- **Hosting**: Static (e.g. **Vercel**, GitHub Pages) — no server runtime in repo
- **Build**: None required - just push and deploy.

## Quick Links
- **[AGENT_ONBOARDING.md](./AGENT_ONBOARDING.md)** — **Start here for agents**: read order, triage, links to dated **debug logs** under `DOCS/debugs/`
- [FIREBASE_GUIDE.md](./FIREBASE_GUIDE.md) - **Firebase feed**: UID for rules, Auth domains, config checklist
- [MUSIC_GUIDE.md](./MUSIC_GUIDE.md) - **Add / update tracks** (`assets/music/` + `scan-music.mjs --apply`)
- [CHANGELOG.md](./CHANGELOG.md) - Version history and features
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical structure and design system
- [SBOM.md](./SBOM.md) - Assets and security verification
- [SCRATCHPAD.md](./SCRATCHPAD.md) - Active development notes
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Code and doc conventions
- [My_Thoughts.md](./My_Thoughts.md) - Internal developer reflections

## Current Status
- **Version**: **v1.2.7** (2026-03-23) — Firestore **likes** + **comments** (subcollection, rules, UI); cache `v=127`.
- [AMENDED 2026-03-23]: **v1.2.6** — `window.NatesData` export (Issue G); cache `v=126`.
- [AMENDED 2026-03-23]: **v1.2.5** — AGENT_ONBOARDING + debug log index.
- [AMENDED 2026-03-23]: **v1.2.4** — FIREBASE_GUIDE, `scroll-reveal` feed fix (Issue E), SCRATCHPAD Firebase checklist.
- [AMENDED 2026-03-23]: **v1.2.3** — optional Firebase Firestore live feed + composer (`js/firebase-feed.js`, `firestore.rules`).
- [AMENDED 2026-03-23]: **v1.2.2** (2026-03-20) — brighter default theme + mobile safe-area / light mobile polish
- **Health**: ✅ Stable
- **Next Milestone**: Content Expansion

## Key Features
- 🎨 **Glassmorphism Design**: Animated gradients and frosted glass panels.
- ✨ **Particle background**: Full-viewport canvas layer behind the app shell.
- 🌓 **Dynamic Theming**: Dark/Light mode with persistence.
- 📱 **Mobile Optimized**: Refined layouts for small screens, including a Spotify-style mobile player.
- 🖼️ **Facebook-style Lightbox**: Premium image viewing experience with social metadata; swipe left/right on touch.
- 🎥 **Video Support**: Integrated video posts with custom play overlays.
- 🍎 **Music Integration**: Native Apple Music embeds and social links.
- 🎚️ **Music** (`music.html`): Filenames listed in `js/music-files.js` → plays from `assets/music/`.
- 📰 **Data-driven feed**: Posts rendered from `assets/data.js` via `renderPosts()`; optional merge with Firestore when `js/firebase-config.js` is configured.
- 🔽 **Scroll reveal**: IntersectionObserver animates posts and panels into view.

## Deployment
```bash
git add .
git commit -m "docs: sync architecture and SBOM for v1.1.1"
git push
```
The site is hosted directly via GitHub Pages on the `main` branch.
