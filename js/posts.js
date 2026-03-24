// [TRACE: DOCS/ARCHITECTURE.md] Data-driven feed; DOM APIs only (no HTML injection from strings).
(function () {
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
        if (!contentArea || !window.NatesData || !Array.isArray(NatesData.posts)) return;

        contentArea.querySelectorAll('article.post').forEach(function (el) {
            el.remove();
        });

        NatesData.posts.forEach(function (post) {
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
            likeBtn.className = 'action-btn';
            likeBtn.textContent = '❤️ ' + post.stats.likes;

            const comBtn = document.createElement('button');
            comBtn.className = 'action-btn';
            comBtn.textContent = '💬 ' + post.stats.comments;

            const saveBtn = document.createElement('button');
            saveBtn.className = 'action-btn';
            saveBtn.textContent = '🔖 Save';

            const shareBtn = document.createElement('button');
            shareBtn.className = 'action-btn';
            shareBtn.textContent = '↗️ Share';

            footer.appendChild(likeBtn);
            footer.appendChild(comBtn);
            footer.appendChild(saveBtn);
            footer.appendChild(shareBtn);

            article.appendChild(header);
            article.appendChild(body);
            article.appendChild(footer);
            contentArea.appendChild(article);

            if (post.media && post.media.type === 'video') {
                initVideoPost(article);
            }
        });
    };
})();
