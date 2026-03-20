// [TRACE: DOCS/ARCHITECTURE.md] EP rows from NatesData.musicCatalog (includeOnEp).
window.renderPlaylist = function renderPlaylist() {
    if (!window.NatesData) return;

    const pl = typeof NatesData.getEpTracks === 'function'
        ? NatesData.getEpTracks()
        : [];
    if (!pl.length) return;
    const artist = pl[0].artist || 'Natee';
    const meta = document.getElementById('focusAlbumMeta');
    if (meta) meta.textContent = pl.length + ' tracks • ' + artist;

    const sidebar = document.getElementById('sidebarTrackList');
    if (sidebar) {
        sidebar.textContent = '';
        pl.forEach(function (t, i) {
            const row = document.createElement('div');
            row.className = 'track' + (i === 0 ? ' active' : '');
            row.dataset.src = t.src;

            const playBtn = document.createElement('button');
            playBtn.className = 'track-play-btn';
            playBtn.textContent = '▶';

            const info = document.createElement('div');
            info.className = 'track-info';
            const titleEl = document.createElement('span');
            titleEl.className = 'track-title';
            titleEl.textContent = t.title;
            const artistEl = document.createElement('span');
            artistEl.className = 'track-artist';
            artistEl.textContent = t.artist;
            info.appendChild(titleEl);
            info.appendChild(artistEl);

            row.appendChild(playBtn);
            row.appendChild(info);
            sidebar.appendChild(row);
        });
    }

    const focus = document.getElementById('focusTrackList');
    if (focus) {
        focus.textContent = '';
        pl.forEach(function (t) {
            const row = document.createElement('div');
            row.className = 'focus-track';
            row.dataset.src = t.src;

            const playBtn = document.createElement('button');
            playBtn.className = 'focus-track-btn';
            playBtn.textContent = '▶';

            const info = document.createElement('div');
            info.className = 'focus-track-info';
            const titleEl = document.createElement('span');
            titleEl.className = 'focus-track-title';
            titleEl.textContent = t.title;
            const artistEl = document.createElement('span');
            artistEl.className = 'focus-track-artist';
            artistEl.textContent = t.artist;
            info.appendChild(titleEl);
            info.appendChild(artistEl);

            row.appendChild(playBtn);
            row.appendChild(info);
            focus.appendChild(row);
        });
    }

    const mobile = document.getElementById('mobileTrackList');
    if (mobile) {
        mobile.textContent = '';
        pl.forEach(function (t, i) {
            const row = document.createElement('div');
            row.className = 'mobile-track-item';
            row.dataset.index = String(i);

            const num = document.createElement('span');
            num.className = 'track-num';
            num.textContent = String(i + 1);

            const info = document.createElement('div');
            info.className = 'track-info';
            const titleEl = document.createElement('span');
            titleEl.className = 'track-title';
            titleEl.textContent = t.title;
            const dur = document.createElement('span');
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
