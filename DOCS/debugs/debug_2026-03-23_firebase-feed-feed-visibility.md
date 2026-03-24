<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Debug log: Firebase feed + invisible posts (2026-03-23)

**Project:** Nate’s Space (`Nates-Space` repo)  
**Environment:** Static site on **Vercel** (`natee.vercel.app`); Firebase project **nateespace**  
**Scope:** Optional Firestore-backed feed, Google Auth, composer **Share**

This document records **what happened, in order**, so agents don’t re-diagnose from zero.

---

## Background (pre-Firebase)

- **Symptom:** “Post” / **Share** on the live site did nothing.
- **Root cause:** Composer was UI-only; feed was rendered from static [`assets/data.js`](../assets/data.js). **Not a Vercel limitation** — no backend existed.
- **Resolution:** Implemented Firestore + Auth (see CHANGELOG **v1.2.3**): [`js/firebase-feed.js`](../../js/firebase-feed.js), [`firestore.rules`](../../firestore.rules), [`js/firebase-config.js`](../../js/firebase-config.js), CDN compat SDK in [`index.html`](../../index.html).

---

## Issue A — `auth/api-key-not-valid`

- **When:** After wiring config; user clicked **Sign in**.
- **Symptom:** Toast / console: invalid API key.
- **Root causes encountered:**
  1. **Typo in `apiKey`:** e.g. `AekIR` or `Aek7R` vs correct segment `AekiR` — single-character mistakes invalidate the key.
  2. **`messagingSenderId` / `appId` mismatch** vs **Firebase Console → Project settings → Your apps** (copy the whole `firebaseConfig` object from the same web app).
- **Resolution:** Paste SDK snippet from Firebase **General** tab; diff character-by-character. In **Google Cloud → APIs & Services → Credentials**, if the Browser key uses **API restrictions**, ensure **Identity Toolkit API** is allowed (or use “Don’t restrict key” for isolation testing).

---

## Issue B — `auth/configuration-not-found`

- **When:** After fixing key typos.
- **Symptom:** Firebase Auth error configuration-not-found on sign-in.
- **Root cause:** **Google** provider (or Auth product) not fully enabled — e.g. **Enable** toggle off on Google in **Authentication → Sign-in method**.
- **Resolution:** Turn **Google** ON, set support email, **Save**.

---

## Issue C — `auth/unauthorized-domain`

- **When:** After enabling Google.
- **Symptom:** OAuth error: domain not authorized.
- **Root cause:** Production hostname (e.g. `natee.vercel.app`) missing from **Authentication → Settings → Authorized domains**.
- **Resolution:** Add exact host (no `https://`, no path). Add `localhost` for local testing. Preview deployments may need their `*.vercel.app` host added too.

---

## Issue D — Firestore rules still “deny all”

- **When:** User pasted default Firestore rules in Console (`allow read, write: if false`).
- **Symptom:** Writes or reads fail; or confusion about why nothing works.
- **Root cause:** Default **production** DB creation leaves deny-all until replaced.
- **Resolution:** Paste contents of repo [`firestore.rules`](../../firestore.rules), replace **`REPLACE_WITH_OWNER_FIREBASE_AUTH_UID`** with the operator’s **Authentication → Users → User UID** (both occurrences), **Publish**.

---

## Issue E — “Posted!” toast but no posts on the page (reload too)

- **When:** Firestore **Data** tab showed documents in **`posts`** with correct fields (`type`, `title`, `content`, `createdAt`, `stats`).
- **Symptom:** UI showed composer and gallery; **no feed cards** (or apparently empty column). Toast **Posted!** appeared.
- **Root cause:** Feed `<article class="post scroll-reveal">` used [`.scroll-reveal { opacity: 0 }`](../../styles.css) until `.visible` was added by `IntersectionObserver`. For **re-rendered** posts (after `renderPosts()` from Firestore `onSnapshot`), the observer often **never** added `.visible`, so cards stayed **fully transparent** while still taking layout space.
- **Resolution (code):** In [`js/posts.js`](../../js/posts.js), removed `scroll-reveal` from feed post articles and stopped observing them — see **CHANGELOG v1.2.4**, cache bump **v=125** on [`index.html`](../../index.html).
- **Verification:** Hard refresh; Firestore posts appear under composer above static seed posts (merge order: Firestore first, then static).

---

## Issue F — Composer visible when not signed in

- **Symptom:** Composer showed for anonymous visitors; only toast on Share.
- **Resolution:** [`js/firebase-feed.js`](../../js/firebase-feed.js) sets `#postComposer` `hidden` until `onAuthStateChanged` reports a user (when Firebase config is valid).

---

## Issue G — Still no feed posts; Firestore writes succeed (“Posted!”)

- **When:** After Issue E (`scroll-reveal`) fix; user still saw empty feed; **Sign in** / **Sign out** irrelevant to read path.
- **Symptom:** No `article.post` nodes (or feed column empty). **`Posted!` toast** still appeared; documents visible in Firestore **Data** tab.
- **Root cause:** [`assets/data.js`](../../assets/data.js) declared `const NatesData = { … }` but **`window.NatesData` was never set**. [`js/posts.js`](../../js/posts.js) `renderPosts()` starts with `if (!contentArea || !window.NatesData || !Array.isArray(NatesData.posts)) return;` — the `!window.NatesData` branch **always exited** before drawing. [`js/app-init.js`](../../js/app-init.js) used `typeof NatesData !== 'undefined'`, which can be true for the global lexical binding, so it **called** `renderPosts()` but nothing rendered.
- **Resolution:** Append `window.NatesData = NatesData;` at end of `assets/data.js` (see trace comment). Ship with cache bump **v=126** on `index.html` assets.
- **Quick check in DevTools:** `!!window.NatesData` must be **true**; `document.querySelectorAll('article.post').length` should be **> 0** after load.

---

## Useful file map (this feature)

| File | Role |
|------|------|
| `js/firebase-config.js` | `window.__FIREBASE_CONFIG__` |
| `js/firebase-feed.js` | Auth UI, `onSnapshot` on `posts`, merge, composer submit |
| `js/posts.js` | `renderPosts()` — DOM for each post |
| `firestore.rules` | Owner UID, field validation on `posts` |
| `index.html` | Script order: data → … → app-init → Firebase SDK → config → firebase-feed |

---

## Issue H — Likes / comments (2026-03-23)

- **Added:** Client `increment` on `posts.stats.likes` / `stats.comments`; subcollection `posts/{id}/comments`; sessionStorage `natespace_liked_posts_v1` for one-like-per-tab; UI panel under live cards only (`_firebaseDocId`).
- **Rules:** Owner OR `stats`-only diff with +1 like XOR +1 comment per update; `comments` public read/create with field caps.
- **Operator:** Republish `firestore.rules` after deploy; create composite index if Console prompts for `comments` query.

---

## If you add a new incident

**Append** a new section below with a heading `## Issue …` or create a new `debug_YYYY-MM-DD_….md` and link it from [AGENT_ONBOARDING.md](../AGENT_ONBOARDING.md).
