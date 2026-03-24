# 🎤 Nate's Space

A premium personal portal and social-style portfolio. Built with pure HTML5, CSS3, and Vanilla JavaScript—no frameworks, no build steps, just pure performance.

![Version](https://img.shields.io/badge/version-1.2.6-00d4aa)
![No Dependencies](https://img.shields.io/badge/dependencies-0-success)

## ✨ Latest Features

- 🎨 **Glassmorphism Design** - High-end frosted glass panels with animated gradient backgrounds.
- 🌓 **Dynamic Theming** - Seamless Dark/Light mode toggle with `localStorage` persistence.
- 📱 **Mobile Optimized** - Tailored experience for small screens, including smaller UI elements and better image positioning.
- 📸 **Premium Lightbox** - Full-screen image/video viewer with social metadata, navigation, and download support.
- 🎵 **Audio Engine** - Integrated music players (Sidebar, Mobile Bar, Focus Mode) with Apple Music & Spotify links.
- 📐 **Layout Engine** - Swap sidebars or enter "Focus Mode" for an immersive content experience.
- ✨ **Particles & motion** - Background particle canvas and scroll-triggered reveal on feed and panels.
- 📰 **Data-driven feed** - Posts defined in `assets/data.js` and rendered at load.
- 🎚️ **Music** - See **[Music guide](./DOCS/MUSIC_GUIDE.md)** — drop files in `assets/music/`, run `node tools/scan-music.mjs --apply`, open [`music.html`](music.html).

## 🚀 Quick Start

### Local Development
Simply open `index.html` in any modern browser. No build process required!

For a better development experience, use a local server:
```bash
npx serve .
# or
python -m http.server
```

### Deploying to GitHub Pages
1. Push your code to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set the **Source** to your `main` branch and `/root` folder.
4. Your site will be live at `https://[username].github.io/NatesSpace/`.

## 📁 Project Documentation

Detailed information is available in the `DOCS/` directory:
- 🤖 **[Agent onboarding](./DOCS/AGENT_ONBOARDING.md)**: **Read this first** — workflow, triage when things break, links to dated debug logs (`DOCS/debugs/`).
- 📊 **[Summary](./DOCS/SUMMARY.md)**: High-level status and project goals.
- 📜 **[Changelog](./DOCS/CHANGELOG.md)**: Detailed version history.
- 🏗️ **[Architecture](./DOCS/ARCHITECTURE.md)**: Design system, layout logic, and components.
- 📋 **[SBOM](./DOCS/SBOM.md)**: Assets and security audit.
- 📓 **[Scratchpad](./DOCS/SCRATCHPAD.md)**: Active development notes and history.
- 📐 **[Style guide](./DOCS/STYLE_GUIDE.md)**: Conventions for JS/CSS/data and trace tags.
- 🎵 **[Music guide](./DOCS/MUSIC_GUIDE.md)**: Put files in `assets/music/`, run `node tools/scan-music.mjs --apply`, reload.
- 🔥 **[Firebase guide](./DOCS/FIREBASE_GUIDE.md)**: Live feed / Auth / Firestore rules and your **User UID** for owner posting.

## 🛠️ Customization

Customize the look and feel by editing the CSS variables in `styles.css`:
```css
:root {
  --accent-color: #00d4aa;      /* Main Brand Teal */
  --accent-secondary: #00a8cc;  /* Deep Cyan */
  --accent-tertiary: #7b61ff;   /* Digital Purple */
}
```

---
Made with 💜 in the studio
