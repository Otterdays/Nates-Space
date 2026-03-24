<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Agent onboarding & issue runbook

**Purpose:** Orient coding agents (and humans) before changing this repo. When something fails in production or locally, use the **reading order** and **triage** sections first; use **dated debug logs** for “we already hit this.”

## Read before you edit code

Do this in order (project rules align with this):

1. **[SUMMARY.md](./SUMMARY.md)** — what the site is, version line, quick links.
2. **[SBOM.md](./SBOM.md)** — shipped scripts, CDN deps, assets (no npm for the live site).
3. **[SCRATCHPAD.md](./SCRATCHPAD.md)** — latest session, open checklist items, recent actions.
4. **[STYLE_GUIDE.md](./STYLE_GUIDE.md)** — trace tags, naming, doc update rules, JS load order reminder.

Then branch by task:

| Task | Read next |
|------|-----------|
| Feed, composer, Firebase | [ARCHITECTURE.md](./ARCHITECTURE.md) (feed pipeline), [FIREBASE_GUIDE.md](./FIREBASE_GUIDE.md), [js/firebase-feed.js](../js/firebase-feed.js), [js/posts.js](../js/posts.js) |
| Music / EP / library | [MUSIC_GUIDE.md](./MUSIC_GUIDE.md), [js/music-files.js](../js/music-files.js) |
| Layout / theme / modals | [ARCHITECTURE.md](./ARCHITECTURE.md), [js/theme-layout.js](../js/theme-layout.js) |

## Repo facts (don’t assume a bundler)

- **No `package.json` for the deployed site.** Vanilla JS, ordered `<script>` tags in [`index.html`](../index.html) / [`music.html`](../music.html).
- **Cache busting:** bump the same `?v=` on **every** script + `styles.css` when shipping behavior or CSS changes (see STYLE_GUIDE).
- **Data:** [`assets/data.js`](../assets/data.js) holds `NatesData` (gallery + static seed posts). Music filenames live in [`js/music-files.js`](../js/music-files.js).
- **Optional Firebase:** [`js/firebase-config.js`](../js/firebase-config.js) (`null` = Firebase off). Live feed merges Firestore `posts` with static seed in [`js/firebase-feed.js`](../js/firebase-feed.js). Rules: [`firestore.rules`](../firestore.rules).

## Documentation rules (critical)

- Every file under `DOCS/` keeps the **preservation header** at the top. **Never delete or replace whole sections of history** — append, amend with `[AMENDED YYYY-MM-DD]:`, or add new dated subsections.
- **Status docs** (SCRATCHPAD, SBOM, CHANGELOG): update as part of substantive work.
- **Content docs** (README, ARCHITECTURE, STYLE_GUIDE): only change when the task requires it; prefer append/amend notes over rewrites.

## When something breaks — triage order

### 1. Confirm what the user is running

- **URL:** Production is often **Vercel** (e.g. `*.vercel.app`); README still mentions GitHub Pages — both are static hosting; behavior is the same unless CDN caches old `?v=`.
- **Hard refresh** or open `/js/<file>.js?v=…` and verify the deployed file matches git (stale `firebase-config.js` is a common cause).

### 2. Browser DevTools

- **Console:** Firebase Auth/Firestore errors are usually explicit (`auth/unauthorized-domain`, `permission-denied`, `api-key-not-valid`).
- **Network:** failed `firestore.googleapis.com` or `identitytoolkit` requests → config, rules, or API enablement.

### 3. Symptom → likely cause (quick map)

| Symptom | Likely cause | Where to fix |
|--------|----------------|--------------|
| Share / post does nothing; no Firebase | Static-only: `firebase-config.js` is `null` or missing apiKey | Config file + deploy |
| `auth/api-key-not-valid` | Typo in `apiKey`; or `appId` / `messagingSenderId` mismatch vs Firebase Console | Copy web config exactly from **Project settings → Your apps** |
| `auth/configuration-not-found` | Google sign-in (or Auth) not enabled in Firebase Console | Authentication → Sign-in method → Google ON |
| `auth/unauthorized-domain` | Host not allowlisted | Authentication → Settings → **Authorized domains** |
| Posted toast but **no posts on page**; data exists in Firestore | **CSS:** feed cards used `scroll-reveal` without `.visible` after re-render (fixed v1.2.4+). Or snapshot error (check console). | [debugs/debug_2026-03-23_firebase-feed-feed-visibility.md](./debugs/debug_2026-03-23_firebase-feed-feed-visibility.md) |
| `permission-denied` on write | `firestore.rules` UID placeholder or wrong user | [FIREBASE_GUIDE.md](./FIREBASE_GUIDE.md) — User UID |
| Composer always visible when logged out | Old deploy before composer gating | [`js/firebase-feed.js`](../js/firebase-feed.js) + `postComposer` `hidden` |
| Music list wrong / missing tracks | `music-files.js` out of sync with `assets/music/` | [MUSIC_GUIDE.md](./MUSIC_GUIDE.md) — `scan-music.mjs --apply` |

### 4. Dated incident logs (exact timelines)

New issues: add a file under **`DOCS/debugs/`** named `debug_YYYY-MM-DD_short-topic.md` (one incident or one theme per file is fine). **Append** to this section when you add a file:

| Date | Log | Topic |
|------|-----|--------|
| 2026-03-23 | [debugs/debug_2026-03-23_firebase-feed-feed-visibility.md](./debugs/debug_2026-03-23_firebase-feed-feed-visibility.md) | Firebase rollout, Auth, API keys, rules, invisible feed posts (`scroll-reveal`) |
| 2026-03-20 | [debugs/debug_2026-03-20_docs_verification.md](./debugs/debug_2026-03-20_docs_verification.md) | Docs verification pass |
| 2026-01-14 | [debugs/2026-01-14_check.md](./debugs/2026-01-14_check.md) | Earlier check |

## Git & commits (project convention)

- Format: `type(scope): description` — `feat | fix | docs | refactor | chore | test`.
- Prefer small commits; don’t commit broken `main`.

## After you fix something

1. **CHANGELOG.md** — append a versioned or dated note under “Fixed” / “Changed” / “Added” as appropriate.
2. **SCRATCHPAD.md** — short session note + what’s left.
3. **New or recurring bug** — add **`DOCS/debugs/debug_YYYY-MM-DD_….md`** with: environment, symptoms, what was ruled out, root cause, code/doc changes, verification steps.

## Related entry points

- [FIREBASE_GUIDE.md](./FIREBASE_GUIDE.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [CHANGELOG.md](./CHANGELOG.md)
