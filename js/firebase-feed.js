// [TRACE: DOCS/ARCHITECTURE.md] Firestore live feed + composer; merges with static NatesData.posts.
(function () {
    var MAX_CONTENT = 2000;
    var MAX_TITLE = 200;

    var staticFeedPosts = (window.NatesData && Array.isArray(window.NatesData.posts))
        ? window.NatesData.posts.slice()
        : [];

    var cfg = window.__FIREBASE_CONFIG__;
    if (!cfg || typeof cfg !== 'object' || !cfg.apiKey) {
        if (typeof console !== 'undefined' && console.info) {
            console.info('Firebase feed: __FIREBASE_CONFIG__ not set; using static posts only.');
        }
        return;
    }

    function formatRelative(date) {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            return 'Just now';
        }
        var s = Math.floor((Date.now() - date.getTime()) / 1000);
        if (s < 45) return 'Just now';
        if (s < 3600) return Math.floor(s / 60) + ' min ago';
        if (s < 86400) return Math.floor(s / 3600) + ' hours ago';
        if (s < 604800) return Math.floor(s / 86400) + ' days ago';
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    function docToPost(doc) {
        var d = doc.data();
        var createdAt = d.createdAt;
        var date = createdAt && createdAt.toDate ? createdAt.toDate() : null;
        return {
            type: d.type || 'update',
            title: typeof d.title === 'string' ? d.title : 'Update',
            timestamp: formatRelative(date),
            content: typeof d.content === 'string' ? d.content : '',
            media: d.media || undefined,
            stats: d.stats && typeof d.stats === 'object'
                ? {
                    likes: Number(d.stats.likes) || 0,
                    comments: Number(d.stats.comments) || 0
                }
                : { likes: 0, comments: 0 }
        };
    }

    function mergeAndRender(fsPosts) {
        if (!window.NatesData) return;
        window.NatesData.posts = fsPosts.concat(staticFeedPosts);
        if (typeof window.renderPosts === 'function') {
            window.renderPosts();
        }
    }

    try {
        firebase.initializeApp(cfg);
    } catch (err) {
        if (typeof console !== 'undefined' && console.error) {
            console.error('Firebase init failed', err);
        }
        if (typeof window.showToast === 'function') {
            window.showToast('Could not initialize feed', '⚠️');
        }
        return;
    }

    var auth = firebase.auth();
    var db = firebase.firestore();
    var authBtn = document.getElementById('firebaseAuthBtn');
    var shareBtn = document.getElementById('composerShareBtn');
    var composerBody = document.getElementById('composerBody');
    var postComposer = document.getElementById('postComposer');

    if (authBtn) {
        authBtn.removeAttribute('hidden');
    }

    function setComposerForUser(user) {
        if (!postComposer) return;
        if (user) {
            postComposer.removeAttribute('hidden');
        } else {
            postComposer.setAttribute('hidden', '');
        }
    }

    function setAuthButtonLabel(user) {
        if (!authBtn) return;
        authBtn.textContent = user ? 'Sign out' : 'Sign in';
        authBtn.setAttribute('title', user ? 'Sign out' : 'Sign in with Google to post');
    }

    auth.onAuthStateChanged(function (user) {
        setAuthButtonLabel(user);
        setComposerForUser(user);
    });

    if (authBtn) {
        authBtn.addEventListener('click', function () {
            if (auth.currentUser) {
                auth.signOut().catch(function (e) {
                    if (typeof console !== 'undefined' && console.error) {
                        console.error('signOut', e);
                    }
                    if (typeof window.showToast === 'function') {
                        window.showToast('Sign out failed', '⚠️');
                    }
                });
                return;
            }
            var provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).catch(function (e) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error('signInWithPopup', e);
                }
                var msg = (e && e.message) ? String(e.message) : 'Sign in failed';
                if (typeof window.showToast === 'function') {
                    window.showToast(msg, '⚠️', 5000);
                }
            });
        });
    }

    db.collection('posts')
        .orderBy('createdAt', 'desc')
        .onSnapshot(
            function (snapshot) {
                var list = [];
                snapshot.forEach(function (doc) {
                    list.push(docToPost(doc));
                });
                mergeAndRender(list);
            },
            function (err) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error('posts snapshot', err);
                }
                if (typeof window.showToast === 'function') {
                    window.showToast('Could not load live posts', '⚠️', 5000);
                }
                mergeAndRender([]);
            }
        );

    function titleFromContent(text) {
        var lines = text.split(/\r?\n/);
        var raw = 'Update';
        for (var i = 0; i < lines.length; i++) {
            var t = lines[i].trim();
            if (t.length > 0) {
                raw = t;
                break;
            }
        }
        if (raw.length > MAX_TITLE) {
            return raw.slice(0, MAX_TITLE - 1) + '…';
        }
        return raw;
    }

    if (shareBtn && composerBody) {
        shareBtn.addEventListener('click', function () {
            if (!auth.currentUser) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Sign in to post', '🔐');
                }
                return;
            }
            var text = (composerBody.value || '').trim();
            if (!text) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Write something first', '✏️');
                }
                return;
            }
            if (text.length > MAX_CONTENT) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Post is too long (max ' + MAX_CONTENT + ')', '⚠️');
                }
                return;
            }

            shareBtn.disabled = true;
            db.collection('posts').add({
                type: 'update',
                title: titleFromContent(text),
                content: text,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                stats: { likes: 0, comments: 0 }
            }).then(function () {
                composerBody.value = '';
                if (typeof window.showToast === 'function') {
                    window.showToast('Posted!', '✨');
                }
            }).catch(function (e) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error('add post', e);
                }
                var msg = (e && e.message) ? String(e.message) : 'Could not post';
                if (typeof window.showToast === 'function') {
                    window.showToast(msg, '⚠️', 5000);
                }
            }).then(function () {
                shareBtn.disabled = false;
            });
        });
    }
})();
