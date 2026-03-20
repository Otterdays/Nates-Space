<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Music on Nate’s Space — Simple Guide

This site is **static** (HTML + JS on GitHub Pages). The browser **cannot** read the contents of `assets/music/` by itself. You tell the site which files exist by maintaining a small list in **`js/music-files.js`**.

---

## Quick path (do this every time you add or remove tracks)

1. **Copy** your audio file into **`assets/music/`**  
   Supported extensions: `.mp3`, `.m4a`, `.aac`, `.wav`, `.ogg`, `.flac`

2. From the **project root** (the folder that contains `index.html`), run:

   ```bash
   node tools/scan-music.mjs --apply
   ```

   That updates **only** the block between `/* <MY_MUSIC_FILES> */` and `/* </MY_MUSIC_FILES> */` in `js/music-files.js` so it matches the folder.

3. **Reload** the site with a **hard refresh** so the browser doesn’t use an old cached script:  
   **Windows:** `Ctrl + F5`  
   **Mac:** `Cmd + Shift + R`

4. **Commit and push** (if you use GitHub Pages):

   ```bash
   git add js/music-files.js
   git commit -m "chore: update music list"
   git push
   ```

---

## What each knob does (all in `js/music-files.js`)

| Item | Purpose |
|------|--------|
| **`MY_MUSIC_FILES`** | Exact filenames in `assets/music/` (spelling, spaces, and extension must match). Auto-filled by `scan-music.mjs --apply`. **Do not hand-edit inside the markers** unless you know the name is correct. |
| **`MY_MUSIC_TITLES`** | Optional map: `filename → display title` for the UI. If you skip a file, the title is guessed from the filename. |
| **`MY_MUSIC_ARTIST`** | Shown next to each track (e.g. `Natee`). |
| **`MY_EP_FILES`** | Optional. If **empty** `[]`, the **feed** sidebar, focus-mode player, and mobile EP bar use **all** files in `MY_MUSIC_FILES`. If you set it to a **subset** of filenames, only those appear on the feed EP UI (music library page still lists **everything** in `MY_MUSIC_FILES`). |

---

## Where your music shows up

| Place | What it uses |
|-------|----------------|
| **`music.html`** | Full list from `getAllMusicRows()` → every entry in `MY_MUSIC_FILES`. Has its own bottom player (`#libraryAudio`). |
| **Feed** (`index.html`) | Sidebar + focus + mobile players use `getEpMusicRows()` → `MY_EP_FILES` if non-empty, otherwise all of `MY_MUSIC_FILES`. |
| **Audio URLs** | Always `assets/music/<filename>` (relative to site root). |

---

## Tools command reference

| Command | What it does |
|---------|----------------|
| `node tools/scan-music.mjs` | Prints a `MY_MUSIC_FILES` block to the terminal (copy/paste if you prefer not to use `--apply`). |
| `node tools/scan-music.mjs --apply` | Rewrites the marked block in `js/music-files.js` from the current `assets/music/` folder. |

Requires **Node.js** on your machine (any recent LTS is fine). No `npm install` is needed for this script.

---

## Troubleshooting

| Problem | Things to try |
|---------|----------------|
| **0 tracks** on Music page | Run `--apply`, then hard refresh. Confirm filenames in `MY_MUSIC_FILES` exactly match files in `assets/music/`. |
| **Track won’t play** | Check the file name for typos; check browser console (F12) for 404 on `assets/music/...`. |
| **Old list after changing files** | Hard refresh; bump `?v=` on script tags in `music.html` / `index.html` if you deploy and CDN caches aggressively. |
| **Opened HTML as `file:///`** | Prefer a local server (`npx serve .`) for consistent behavior; `music.html` only needs `music-files.js` + theme + particles + `music-page.js` (no `data.js`). |

---

## Files to know

- **`assets/music/`** — audio binaries (keep repo size in mind; large files may be gitignored).
- **`js/music-files.js`** — the list + titles + artist + optional EP subset.
- **`js/music-page.js`** — Music library page UI and dock player.
- **`js/playlist.js`** + **`js/audio.js`** — feed EP players.

---

## Related docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — load order and module roles  
- [SBOM.md](./SBOM.md) — dev tools including `scan-music.mjs`  
- [CHANGELOG.md](./CHANGELOG.md) — when the music model changed (e.g. v1.2.0)

---

*Last updated: 2026-03-20 — guide added for `MY_MUSIC_FILES` + `scan-music.mjs --apply` workflow.*
