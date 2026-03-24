// [TRACE: DOCS/FIREBASE_GUIDE.md] Owner-only admin panel for feed moderation.
(function () {
    var OWNER_UID = '7gTTl2LM8mS2jrByUabHlaRgC4J2';
    var PAGE_SIZE = 15;
    var lastDoc = null;
    var hasMore = true;
    var isLoading = false;

    var cfg = window.__FIREBASE_CONFIG__;
    var authBtn = document.getElementById('adminAuthBtn');
    var adminState = document.getElementById('adminUserState');
    var accessNotice = document.getElementById('adminAccessNotice');
    var adminApp = document.getElementById('adminApp');
    var postList = document.getElementById('adminPostList');
    var loadMoreBtn = document.getElementById('adminLoadMoreBtn');
    var reloadBtn = document.getElementById('adminReloadBtn');

    function setState(text) {
        if (adminState) adminState.textContent = text;
    }

    function showAdminUI(allowed) {
        if (!accessNotice || !adminApp) return;
        if (allowed) {
            accessNotice.setAttribute('hidden', '');
            adminApp.removeAttribute('hidden');
            return;
        }
        accessNotice.removeAttribute('hidden');
        adminApp.setAttribute('hidden', '');
    }

    function updateAuthButton(user) {
        if (!authBtn) return;
        authBtn.removeAttribute('hidden');
        authBtn.textContent = user ? 'Sign out' : 'Sign in';
    }

    function formatTime(createdAt) {
        if (!createdAt || !createdAt.toDate) return 'No timestamp';
        var d = createdAt.toDate();
        if (!(d instanceof Date) || isNaN(d.getTime())) return 'No timestamp';
        return d.toLocaleString();
    }

    function readText(value) {
        return typeof value === 'string' && value.trim() ? value.trim() : '(empty)';
    }

    function renderCommentRow(postId, postStats, commentDoc) {
        var data = commentDoc.data() || {};
        var row = document.createElement('div');
        row.className = 'admin-comment-row';

        var body = document.createElement('div');
        body.className = 'admin-comment-body';

        var line1 = document.createElement('p');
        line1.className = 'admin-comment-text';
        line1.textContent = readText(data.text);
        body.appendChild(line1);

        var line2 = document.createElement('p');
        line2.className = 'admin-comment-meta';
        var author = typeof data.authorName === 'string' && data.authorName ? data.authorName : 'Guest';
        line2.textContent = author + ' · ' + formatTime(data.createdAt);
        body.appendChild(line2);

        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn admin-danger-btn';
        delBtn.textContent = 'Delete comment';
        delBtn.addEventListener('click', function () {
            if (!window.confirm('Delete this comment?')) return;
            delBtn.disabled = true;
            var postRef = db.collection('posts').doc(postId);
            var commentRef = postRef.collection('comments').doc(commentDoc.id);
            db.runTransaction(function (tx) {
                return tx.get(postRef).then(function (postSnap) {
                    return tx.get(commentRef).then(function (commentSnap) {
                        if (!commentSnap.exists) return;
                        var stats = (postSnap.data() && postSnap.data().stats) || {};
                        var nextComments = Math.max((Number(stats.comments) || 0) - 1, 0);
                        tx.delete(commentRef);
                        tx.update(postRef, { 'stats.comments': nextComments });
                        postStats.comments = nextComments;
                    });
                });
            }).then(function () {
                row.remove();
            }).catch(function (err) {
                console.error('delete comment', err);
                window.alert('Could not delete comment.');
            }).then(function () {
                delBtn.disabled = false;
            });
        });

        row.appendChild(body);
        row.appendChild(delBtn);
        return row;
    }

    function loadComments(postId, wrap, postStats) {
        wrap.textContent = '';
        var q = db.collection('posts').doc(postId).collection('comments').orderBy('createdAt', 'desc').limit(60);
        q.get().then(function (snap) {
            if (snap.empty) {
                var empty = document.createElement('p');
                empty.className = 'admin-comment-empty';
                empty.textContent = 'No comments.';
                wrap.appendChild(empty);
                return;
            }
            snap.forEach(function (commentDoc) {
                wrap.appendChild(renderCommentRow(postId, postStats, commentDoc));
            });
        }).catch(function (err) {
            console.error('load comments', err);
            var fail = document.createElement('p');
            fail.className = 'admin-comment-empty';
            fail.textContent = 'Could not load comments.';
            wrap.appendChild(fail);
        });
    }

    function deletePost(postId, btn) {
        if (!window.confirm('Delete this post and all its comments?')) return;
        btn.disabled = true;
        var postRef = db.collection('posts').doc(postId);
        postRef.collection('comments').get().then(function (snap) {
            var batch = db.batch();
            snap.forEach(function (commentDoc) {
                batch.delete(commentDoc.ref);
            });
            batch.delete(postRef);
            return batch.commit();
        }).then(function () {
            var card = document.querySelector('[data-admin-post-id="' + postId + '"]');
            if (card) card.remove();
        }).catch(function (err) {
            console.error('delete post', err);
            window.alert('Could not delete post.');
        }).then(function () {
            btn.disabled = false;
        });
    }

    function renderPost(doc) {
        var d = doc.data() || {};
        var stats = d.stats && typeof d.stats === 'object'
            ? { likes: Number(d.stats.likes) || 0, comments: Number(d.stats.comments) || 0 }
            : { likes: 0, comments: 0 };

        var card = document.createElement('article');
        card.className = 'admin-post-card';
        card.setAttribute('data-admin-post-id', doc.id);

        var title = document.createElement('h3');
        title.className = 'admin-post-title';
        title.textContent = readText(d.title);

        var meta = document.createElement('p');
        meta.className = 'admin-post-meta';
        meta.textContent = doc.id + ' · ' + formatTime(d.createdAt);

        var content = document.createElement('p');
        content.className = 'admin-post-content';
        content.textContent = readText(d.content);

        var statsLine = document.createElement('p');
        statsLine.className = 'admin-post-stats';
        statsLine.textContent = 'Likes: ' + stats.likes + ' · Comments: ' + stats.comments;

        var actions = document.createElement('div');
        actions.className = 'admin-post-actions';

        var commentsBtn = document.createElement('button');
        commentsBtn.type = 'button';
        commentsBtn.className = 'btn';
        commentsBtn.textContent = 'Manage comments';

        var delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn admin-danger-btn';
        delBtn.textContent = 'Delete post';
        delBtn.addEventListener('click', function () {
            deletePost(doc.id, delBtn);
        });

        var commentsWrap = document.createElement('div');
        commentsWrap.className = 'admin-comments-wrap';
        commentsWrap.setAttribute('hidden', '');

        commentsBtn.addEventListener('click', function () {
            var hidden = commentsWrap.hasAttribute('hidden');
            if (hidden) {
                commentsWrap.removeAttribute('hidden');
                commentsBtn.textContent = 'Hide comments';
                loadComments(doc.id, commentsWrap, stats);
            } else {
                commentsWrap.setAttribute('hidden', '');
                commentsBtn.textContent = 'Manage comments';
            }
        });

        actions.appendChild(commentsBtn);
        actions.appendChild(delBtn);
        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(content);
        card.appendChild(statsLine);
        card.appendChild(actions);
        card.appendChild(commentsWrap);
        postList.appendChild(card);
    }

    function resetPosts() {
        if (postList) postList.textContent = '';
        lastDoc = null;
        hasMore = true;
        if (loadMoreBtn) loadMoreBtn.setAttribute('hidden', '');
    }

    function loadPosts() {
        if (isLoading || !hasMore || !postList) return;
        isLoading = true;
        if (loadMoreBtn) loadMoreBtn.disabled = true;
        var query = db.collection('posts').orderBy('createdAt', 'desc').limit(PAGE_SIZE);
        if (lastDoc) query = query.startAfter(lastDoc);

        query.get().then(function (snap) {
            if (snap.empty && !lastDoc) {
                var empty = document.createElement('p');
                empty.className = 'admin-comment-empty';
                empty.textContent = 'No live posts yet.';
                postList.appendChild(empty);
                hasMore = false;
                return;
            }
            snap.forEach(renderPost);
            lastDoc = snap.docs[snap.docs.length - 1] || lastDoc;
            hasMore = snap.size === PAGE_SIZE;
            if (loadMoreBtn) {
                if (hasMore) loadMoreBtn.removeAttribute('hidden');
                else loadMoreBtn.setAttribute('hidden', '');
            }
        }).catch(function (err) {
            console.error('load posts', err);
            window.alert('Could not load posts.');
        }).then(function () {
            isLoading = false;
            if (loadMoreBtn) loadMoreBtn.disabled = false;
        });
    }

    if (!cfg || typeof cfg !== 'object' || !cfg.apiKey) {
        setState('Missing firebase config.');
        showAdminUI(false);
        return;
    }

    try {
        firebase.initializeApp(cfg);
    } catch (err) {
        console.error('firebase init', err);
        setState('Firebase failed to initialize.');
        showAdminUI(false);
        return;
    }

    var auth = firebase.auth();
    var db = firebase.firestore();

    if (authBtn) {
        authBtn.addEventListener('click', function () {
            if (auth.currentUser) {
                auth.signOut().catch(function (err) {
                    console.error('signOut', err);
                });
                return;
            }
            var provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).catch(function (err) {
                console.error('signInWithPopup', err);
            });
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadPosts);
    }
    if (reloadBtn) {
        reloadBtn.addEventListener('click', function () {
            resetPosts();
            loadPosts();
        });
    }

    auth.onAuthStateChanged(function (user) {
        updateAuthButton(user);
        if (!user) {
            setState('Signed out.');
            showAdminUI(false);
            resetPosts();
            return;
        }

        var isOwner = user.uid === OWNER_UID;
        setState('Signed in as ' + (user.email || user.uid));
        showAdminUI(isOwner);
        resetPosts();
        if (isOwner) loadPosts();
    });
})();
