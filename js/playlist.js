// [TRACE: DOCS/ARCHITECTURE.md] EP UI from js/music-files.js
window.renderPlaylist = function renderPlaylist() {
    var pl = typeof window.getEpMusicRows === 'function' ? window.getEpMusicRows() : [];
    if (!pl.length) return;

    var artist = pl[0].artist || 'Natee';
    var meta = document.getElementById('focusAlbumMeta');
    if (meta) meta.textContent = pl.length + ' tracks • ' + artist;

    var sidebar = document.getElementById('sidebarTrackList');
    if (sidebar) {
        sidebar.textContent = '';
        pl.forEach(function (t, i) {
            var row = document.createElement('div');
            row.className = 'track' + (i === 0 ? ' active' : '');
            row.dataset.src = t.src;

            var playBtn = document.createElement('button');
            playBtn.className = 'track-play-btn';
            playBtn.textContent = '▶';

            var info = document.createElement('div');
            info.className = 'track-info';
            var titleEl = document.createElement('span');
            titleEl.className = 'track-title';
            titleEl.textContent = t.title;
            var artistEl = document.createElement('span');
            artistEl.className = 'track-artist';
            artistEl.textContent = t.artist;
            info.appendChild(titleEl);
            info.appendChild(artistEl);

            row.appendChild(playBtn);
            row.appendChild(info);
            sidebar.appendChild(row);
        });
    }

    var focus = document.getElementById('focusTrackList');
    if (focus) {
        focus.textContent = '';
        pl.forEach(function (t) {
            var row = document.createElement('div');
            row.className = 'focus-track';
            row.dataset.src = t.src;

            var playBtn = document.createElement('button');
            playBtn.className = 'focus-track-btn';
            playBtn.textContent = '▶';

            var info = document.createElement('div');
            info.className = 'focus-track-info';
            var titleEl = document.createElement('span');
            titleEl.className = 'focus-track-title';
            titleEl.textContent = t.title;
            var artistEl = document.createElement('span');
            artistEl.className = 'focus-track-artist';
            artistEl.textContent = t.artist;
            info.appendChild(titleEl);
            info.appendChild(artistEl);

            row.appendChild(playBtn);
            row.appendChild(info);
            focus.appendChild(row);
        });
    }

    var mobile = document.getElementById('mobileTrackList');
    if (mobile) {
        mobile.textContent = '';
        pl.forEach(function (t, i) {
            var row = document.createElement('div');
            row.className = 'mobile-track-item';
            row.dataset.index = String(i);

            var num = document.createElement('span');
            num.className = 'track-num';
            num.textContent = String(i + 1);

            var info = document.createElement('div');
            info.className = 'track-info';
            var titleEl = document.createElement('span');
            titleEl.className = 'track-title';
            titleEl.textContent = t.title;
            var dur = document.createElement('span');
            dur.className = 'track-duration';
            dur.textContent = t.duration || '';
            info.appendChild(titleEl);
            info.appendChild(dur);

            row.appendChild(num);
            row.appendChild(info);
            mobile.appendChild(row);
        });
    }
};
