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
            _firebaseDocId: doc.id,
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

    var commentUnsubs = {};

    function tearDownCommentListeners() {
        Object.keys(commentUnsubs).forEach(function (k) {
            if (typeof commentUnsubs[k] === 'function') {
                commentUnsubs[k]();
            }
            delete commentUnsubs[k];
        });
    }

    function mergeAndRender(fsPosts) {
        if (!window.NatesData) return;
        tearDownCommentListeners();
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
    var LIKED_KEY = 'natespace_liked_posts_v1';
    var MAX_COMMENT = 500;

    function getLikedIds() {
        try {
            var raw = sessionStorage.getItem(LIKED_KEY);
            var a = raw ? JSON.parse(raw) : [];
            return Array.isArray(a) ? a : [];
        } catch (e) {
            return [];
        }
    }

    function markLiked(postId) {
        var a = getLikedIds();
        if (a.indexOf(postId) === -1) {
            a.push(postId);
            try {
                sessionStorage.setItem(LIKED_KEY, JSON.stringify(a));
            } catch (err) {
                if (typeof console !== 'undefined' && console.warn) {
                    console.warn('sessionStorage liked', err);
                }
            }
        }
    }

    function isLiked(postId) {
        return getLikedIds().indexOf(postId) !== -1;
    }

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

    var contentAreaEl = document.querySelector('.content-area');
    if (contentAreaEl) {
        contentAreaEl.addEventListener('click', function (e) {
            var likeBtn = e.target.closest('.post-like-btn');
            if (likeBtn) {
                e.preventDefault();
                var article = likeBtn.closest('article.post');
                if (!article) return;
                var postId = article.getAttribute('data-firebase-post-id');
                if (!postId) return;
                if (isLiked(postId)) {
                    if (typeof window.showToast === 'function') {
                        window.showToast('You already liked this', '♥');
                    }
                    return;
                }
                likeBtn.disabled = true;
                db.collection('posts').doc(postId).update({
                    'stats.likes': firebase.firestore.FieldValue.increment(1)
                }).then(function () {
                    markLiked(postId);
                    if (typeof window.showToast === 'function') {
                        window.showToast('Thanks!', '♥');
                    }
                }).catch(function (err) {
                    if (typeof console !== 'undefined' && console.error) {
                        console.error('like', err);
                    }
                    if (typeof window.showToast === 'function') {
                        window.showToast('Could not like', '⚠️');
                    }
                }).then(function () {
                    likeBtn.disabled = false;
                });
                return;
            }

            var comToggle = e.target.closest('.post-comment-toggle');
            if (comToggle) {
                e.preventDefault();
                var art = comToggle.closest('article.post');
                if (!art) return;
                var pid = art.getAttribute('data-firebase-post-id');
                if (!pid) return;
                var panel = art.querySelector('.post-comments-panel');
                if (!panel) return;
                var list = panel.querySelector('.post-comments-list');
                var open = panel.hasAttribute('hidden') || panel.hidden;
                if (open) {
                    panel.removeAttribute('hidden');
                    panel.hidden = false;
                    comToggle.setAttribute('aria-expanded', 'true');
                    if (!commentUnsubs[pid] && list) {
                        var q = db.collection('posts').doc(pid).collection('comments')
                            .orderBy('createdAt', 'desc')
                            .limit(40);
                        commentUnsubs[pid] = q.onSnapshot(
                            function (snap) {
                                while (list.firstChild) {
                                    list.removeChild(list.firstChild);
                                }
                                if (snap.empty) {
                                    var emptyLi = document.createElement('li');
                                    emptyLi.className = 'post-comments-empty';
                                    emptyLi.textContent = 'No comments yet — say something nice.';
                                    list.appendChild(emptyLi);
                                    return;
                                }
                                snap.forEach(function (cdoc) {
                                    var c = cdoc.data();
                                    var li = document.createElement('li');
                                    li.className = 'post-comment-item';
                                    var meta = document.createElement('div');
                                    meta.className = 'post-comment-meta';
                                    var who = document.createElement('span');
                                    who.className = 'post-comment-author';
                                    who.textContent = typeof c.authorName === 'string' ? c.authorName : 'Guest';
                                    var when = document.createElement('span');
                                    when.className = 'post-comment-time';
                                    var ts = c.createdAt && c.createdAt.toDate ? c.createdAt.toDate() : null;
                                    when.textContent = formatRelative(ts);
                                    meta.appendChild(who);
                                    meta.appendChild(when);
                                    var body = document.createElement('p');
                                    body.className = 'post-comment-text';
                                    body.textContent = typeof c.text === 'string' ? c.text : '';
                                    li.appendChild(meta);
                                    li.appendChild(body);
                                    list.appendChild(li);
                                });
                            },
                            function (err) {
                                if (typeof console !== 'undefined' && console.error) {
                                    console.error('comments', err);
                                }
                                if (typeof window.showToast === 'function') {
                                    window.showToast('Could not load comments', '⚠️');
                                }
                            }
                        );
                    }
                } else {
                    panel.setAttribute('hidden', '');
                    panel.hidden = true;
                    comToggle.setAttribute('aria-expanded', 'false');
                    if (commentUnsubs[pid]) {
                        commentUnsubs[pid]();
                        delete commentUnsubs[pid];
                    }
                }
                return;
            }
        });

        contentAreaEl.addEventListener('submit', function (e) {
            var form = e.target.closest('.post-comment-form');
            if (!form) return;
            e.preventDefault();
            var article = form.closest('article.post');
            if (!article) return;
            var postId = article.getAttribute('data-firebase-post-id');
            if (!postId) return;
            var input = form.querySelector('.post-comment-input');
            if (!input) return;
            var text = (input.value || '').trim();
            if (!text) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Write a comment first', '💬');
                }
                return;
            }
            if (text.length > MAX_COMMENT) {
                if (typeof window.showToast === 'function') {
                    window.showToast('Comment too long', '⚠️');
                }
                return;
            }
            var submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            var postRef = db.collection('posts').doc(postId);
            var commentRef = postRef.collection('comments').doc();
            var authorName = 'Guest';
            if (auth.currentUser) {
                authorName = auth.currentUser.displayName || auth.currentUser.email || 'Fan';
            }
            var batch = db.batch();
            batch.set(commentRef, {
                text: text,
                authorName: authorName,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            batch.update(postRef, {
                'stats.comments': firebase.firestore.FieldValue.increment(1)
            });
            batch.commit().then(function () {
                input.value = '';
                if (typeof window.showToast === 'function') {
                    window.showToast('Comment added', '✨');
                }
            }).catch(function (err) {
                if (typeof console !== 'undefined' && console.error) {
                    console.error('comment', err);
                }
                if (typeof window.showToast === 'function') {
                    window.showToast('Could not comment', '⚠️');
                }
            }).then(function () {
                if (submitBtn) submitBtn.disabled = false;
            });
        });
    }

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
