<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Nate's Space - Project Summary

## What Is This?
A personal portfolio/social-style website for Nate, featuring studio content, music updates, and a glass-ui layout inspired by modern social apps.

## Tech Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (no frameworks)
- **Fonts**: Google Fonts (Outfit, Space Mono)
- **Hosting**: GitHub Pages (static)
- **Build**: None required - just push and deploy.

## Quick Links
- [CHANGELOG.md](./CHANGELOG.md) - Version history and features
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical structure and design system
- [SBOM.md](./SBOM.md) - Assets and security verification
- [SCRATCHPAD.md](./SCRATCHPAD.md) - Active development notes
- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Code and doc conventions
- [My_Thoughts.md](./My_Thoughts.md) - Internal developer reflections

## Current Status
- **Version**: **v1.2.0** (2026-03-20) — music = `js/music-files.js` only
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
- 📰 **Data-driven feed**: Posts rendered from `assets/data.js` via `renderPosts()`.
- 🔽 **Scroll reveal**: IntersectionObserver animates posts and panels into view.

## Deployment
```bash
git add .
git commit -m "docs: sync architecture and SBOM for v1.1.1"
git push
```
The site is hosted directly via GitHub Pages on the `main` branch.
