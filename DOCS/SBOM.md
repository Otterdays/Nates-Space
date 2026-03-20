<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Nate's Space - Security Bill of Materials (SBOM)

## Overview
This project is built using a **zero npm dependency** philosophy for the production site. It is a static pure HTML/CSS/JS application.

### Production JavaScript (2026-03-20)
All site logic ships as ordered IIFE scripts under `js/` (see `DOCS/ARCHITECTURE.md` — “JavaScript modules”). No minifier or bundler in repo; behavior depends on load order in `index.html`.

## External Resources (Trusted CDNs)

| Resource | Type | Provider | Domain | Last Verified |
|----------|------|----------|--------|---------------|
| Outfit Font | Typography | Google Fonts | fonts.googleapis.com | 2026-03-20 |
| Space Mono Font | Typography | Google Fonts | fonts.googleapis.com | 2026-03-20 |

## Local Media Assets

### Images
| File | Type | Purpose |
|------|------|---------|
| `assets/IMG_20260112_193737.jpg` | JPG | Primary Avatar / Profile Image |
| `assets/IMG_20260112_194122.jpg` | JPG | Gallery Image #1 / Video Poster |
| `assets/IMG_20260112_194124.jpg` | JPG | Gallery Image #2 / Hero Background |
| `assets/IMG_20260112_194126.jpg` | JPG | Gallery Image #3 |

### Video
| File | Type | Purpose |
|------|------|---------|
| `assets/VID_20260112_193751.mp4` | MP4 | Studio Recording Feed Post |

### Audio (The EP)
| File | Type | Track Name |
|------|------|------------|
| `assets/music/Akward Moments Natee V2 (M).mp3` | MP3 | Awkward Moments |
| `assets/music/Natee 730 PM V1 (M).m4a` | M4A | 7:30 PM |
| `assets/music/Dark Spaces Natee  V2.m4a` | M4A | Dark Spaces |

## Development Tools
- `tools/convert.js`: CommonJS; uses npm package `heic-convert` (dev-only) to transcode HEIC images to JPG. Not deployed to production.
- `tools/convert.mjs`: ESM equivalent of the above.
- `tools/convert_audio.bat`: Local FFmpeg-style workflow for producing M4A under `assets/music/`; not part of the static bundle.
- `tools/scan-music.mjs`: Node ESM; `node tools/scan-music.mjs --apply` patches the `MY_MUSIC_FILES` block in `js/music-files.js`. Without flags, prints pasteable lines. **User guide:** [MUSIC_GUIDE.md](./MUSIC_GUIDE.md).

### Optional dev dependency (not shipped to Pages)
| Package | Scope | Notes |
|---------|--------|------|
| `heic-convert` | `tools/convert.js`, `tools/convert.mjs` | Install with `npm install heic-convert` only if running converters; keep out of production path. |

## Repository hygiene
- Root `.gitignore` excludes `node_modules/`, `*.wav`, `*.exe`, `.DS_Store` — large audio masters may stay local while M4A/MP3 ship for the player.

## Security Audit
- **Attack Surface**: Extremely minimal. No server-side processing, no database, no active sessions.
- **Privacy**: No external trackers (Google Analytics, etc.) are implemented.
- **Data Persistence**: `localStorage` keys `nateTheme` and `nateLayout` store UI preferences only.
- **Dependencies**: 0 production dependencies.

## Audit Status
✅ **Clean** - No production npm dependencies (2026-03-20). Dev tools optional; audit `heic-convert` when installing.
