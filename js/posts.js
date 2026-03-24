// [TRACE: DOCS/ARCHITECTURE.md] Data-driven feed; DOM APIs only (no HTML injection from strings).
(function () {
    var LIKED_STORAGE_KEY = 'natespace_liked_posts_v1';

    function sessionLikedIds() {
        try {
            var raw = sessionStorage.getItem(LIKED_STORAGE_KEY);
            var a = raw ? JSON.parse(raw) : [];
            return Array.isArray(a) ? a : [];
        } catch (e) {
            return [];
        }
    }

    function initVideoPost(article) {
        const video = article.querySelector('video');
        if (!video) return;
        video.removeAttribute('controls');
        const playOverlay = document.createElement('div');
        playOverlay.className = 'video-play-overlay';
        video.parentElement.appendChild(playOverlay);
        video.parentElement.addEventListener('click', function () {
            window.openVideoModal(video);
        });
    }

    window.renderPosts = function renderPosts() {
        const contentArea = document.querySelector('.content-area');
        var data = window.NatesData;
        if (!contentArea || !data || !Array.isArray(data.posts)) return;

        contentArea.querySelectorAll('article.post').forEach(function (el) {
            el.remove();
        });

        data.posts.forEach(function (post) {
            const article = document.createElement('article');
            // NOTE: no scroll-reveal — IO often never adds .visible for re-rendered feed cards (opacity stays 0).
            article.className = 'glass-panel post';

            const header = document.createElement('header');
            header.className = 'post-header';

            const meta = document.createElement('div');
            meta.className = 'post-meta';
            const h2 = document.createElement('h2');
            h2.textContent = post.title;
            const ts = document.createElement('span');
            ts.className = 'timestamp';
            ts.textContent = post.timestamp;
            meta.appendChild(h2);
            meta.appendChild(ts);

            const tag = document.createElement('span');
            const tagClass = post.type === 'video' ? 'video'
                : (post.type === 'photo' ? 'photo' : 'update');
            tag.className = 'tag ' + tagClass;
            tag.textContent = post.type.charAt(0).toUpperCase() + post.type.slice(1);

            header.appendChild(meta);
            header.appendChild(tag);

            const body = document.createElement('div');
            body.className = 'post-content';
            const p = document.createElement('p');
            p.textContent = post.content;
            body.appendChild(p);

            if (post.media) {
                if (post.media.type === 'video') {
                    const wrap = document.createElement('div');
                    wrap.className = 'media-container video-container';
                    const video = document.createElement('video');
                    video.setAttribute('poster', post.media.poster);
                    const source = document.createElement('source');
                    source.src = post.media.src;
                    source.type = 'video/mp4';
                    video.appendChild(source);
                    video.appendChild(document.createTextNode(
                        'Your browser does not support the video tag.'
                    ));
                    wrap.appendChild(video);
                    body.appendChild(wrap);
                } else if (post.media.type === 'image') {
                    const wrap = document.createElement('div');
                    wrap.className = 'media-container';
                    const img = document.createElement('img');
                    img.src = post.media.src;
                    img.alt = post.media.alt || '';
                    wrap.appendChild(img);
                    const overlay = document.createElement('div');
                    overlay.className = 'image-overlay';
                    const views = document.createElement('span');
                    const n = 500 + (post.stats.likes || 0) * 3 + (post.stats.comments || 0) * 2;
                    views.textContent = '👁️ ' + n + ' views';
                    overlay.appendChild(views);
                    wrap.appendChild(overlay);
                    body.appendChild(wrap);
                }
            }

            const footer = document.createElement('footer');
            footer.className = 'post-footer';

            const likeBtn = document.createElement('button');
            likeBtn.type = 'button';
            likeBtn.className = 'action-btn';
            var liveId = post._firebaseDocId;
            if (liveId) {
                article.setAttribute('data-firebase-post-id', liveId);
                var liked = sessionLikedIds().indexOf(liveId) !== -1;
                likeBtn.className = 'action-btn post-like-btn' + (liked ? ' is-liked' : '');
                likeBtn.textContent = (liked ? '♥ ' : '♡ ') + (Number(post.stats.likes) || 0);
                likeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
            } else {
                likeBtn.textContent = '♡ ' + (post.stats.likes | 0);
                likeBtn.classList.add('post-action-static');
                likeBtn.title = 'Likes on live posts only';
            }

            const comBtn = document.createElement('button');
            comBtn.type = 'button';
            comBtn.className = 'action-btn';
            if (liveId) {
                comBtn.classList.add('post-comment-toggle');
                comBtn.textContent = '💬 ' + (Number(post.stats.comments) || 0);
                comBtn.setAttribute('aria-expanded', 'false');
            } else {
                comBtn.textContent = '💬 ' + (Number(post.stats.comments) || 0);
                comBtn.classList.add('post-action-static');
                comBtn.title = 'Comments on live posts only';
            }

            const saveBtn = document.createElement('button');
            saveBtn.type = 'button';
            saveBtn.className = 'action-btn';
            saveBtn.textContent = '🔖 Save';

            const shareBtn = document.createElement('button');
            shareBtn.type = 'button';
            shareBtn.className = 'action-btn';
            shareBtn.textContent = '↗️ Share';

            footer.appendChild(likeBtn);
            footer.appendChild(comBtn);
            footer.appendChild(saveBtn);
            footer.appendChild(shareBtn);

            article.appendChild(header);
            article.appendChild(body);
            article.appendChild(footer);

            if (liveId) {
                const panel = document.createElement('div');
                panel.className = 'post-comments-panel';
                panel.setAttribute('hidden', '');
                const list = document.createElement('ul');
                list.className = 'post-comments-list';
                const form = document.createElement('form');
                form.className = 'post-comment-form';
                const inp = document.createElement('input');
                inp.type = 'text';
                inp.className = 'post-comment-input';
                inp.name = 'commentText';
                inp.maxLength = 500;
                inp.setAttribute('autocomplete', 'off');
                inp.placeholder = 'Add a comment…';
                const send = document.createElement('button');
                send.type = 'submit';
                send.className = 'btn post-comment-send';
                send.textContent = 'Send';
                form.appendChild(inp);
                form.appendChild(send);
                panel.appendChild(list);
                panel.appendChild(form);
                article.appendChild(panel);
            }

            contentArea.appendChild(article);

            if (post.media && post.media.type === 'video') {
                initVideoPost(article);
            }
        });
    };
})();
