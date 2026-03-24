<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->

# Firebase (Nateespace) — operator guide

How the optional live feed works and how to finish **owner-only** Firestore rules.

## What’s in the repo

| Item | Role |
|------|------|
| [`js/firebase-config.js`](../js/firebase-config.js) | `window.__FIREBASE_CONFIG__` — must match **Firebase Console → Project settings → Your apps → Web** (same web app). |
| [`js/firebase-feed.js`](../js/firebase-feed.js) | Initializes Firebase, Google sign-in, Firestore `posts` listener, composer **Share**. |
| [`firestore.rules`](../firestore.rules) | Security rules: public read on `posts`; creates/updates/deletes only for the **User UID** you embed in the rules. |
| [`firebase.json`](../firebase.json) | Optional: `firebase deploy --only firestore:rules` |

## Find your User UID (to make yourself “admin” in rules)

Your **User UID** is Firebase’s stable ID for *one* signed-in account. It is **not** your email and **not** your password.

1. **Firebase Console** → **Authentication** → **Users**.
2. Sign in on the live site once (**Sign in** → Google) if the list is empty.
3. Refresh **Users**; open your row.
4. Copy **User UID** (long alphanumeric string).

Put that value in **`firestore.rules`** in **both** places that say `REPLACE_WITH_OWNER_FIREBASE_AUTH_UID` (single-quoted in the rules file).

5. **Firestore** → **Rules** → paste the updated rules (or deploy via CLI) → **Publish**.

If the UID in the rules does not match the account you use to sign in, writes will fail with **permission-denied**.

## Console checklist (reference)

- **Authentication** → **Sign-in method** → **Google** enabled + support email set.
- **Authentication** → **Settings** → **Authorized domains** includes your real host (e.g. `natee.vercel.app`) and `localhost` for local tests.
- **Firestore** database created; **Rules** published after you set your UID.
- **Project settings** → web app `firebaseConfig` matches `js/firebase-config.js` exactly (one wrong character in `apiKey` or `appId` breaks Auth).

## Google Cloud API key (if sign-in fails)

Browser key restrictions: ensure **Identity Toolkit API** is allowed if you use “Restrict key.” Mismatched or typo’d `apiKey` / `appId` / `messagingSenderId` vs Console causes `auth/api-key-not-valid` or `auth/configuration-not-found`.

## Composer visibility

When Firebase config is valid, the post composer is **hidden** until you are signed in; after sign-in it appears.

## Related

- **Agents / incidents:** [AGENT_ONBOARDING.md](./AGENT_ONBOARDING.md) — triage table; [debugs/debug_2026-03-23_firebase-feed-feed-visibility.md](./debugs/debug_2026-03-23_firebase-feed-feed-visibility.md) — what broke and when (2026-03-23).
- Active notes: [SCRATCHPAD.md](./SCRATCHPAD.md)  
- Feed rendering: [ARCHITECTURE.md](./ARCHITECTURE.md) (feed pipeline + `firebase-feed.js`)
