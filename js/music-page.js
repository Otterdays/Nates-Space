// [TRACE: DOCS/ARCHITECTURE.md] Full-catalog player for music.html (separate from feed audio).
(function () {
    const listEl = document.getElementById('musicLibraryList');
    const searchEl = document.getElementById('musicSearch');
    const countEl = document.getElementById('musicCount');
    const emptyEl = document.getElementById('musicEmptyState');
    const audio = document.getElementById('libraryAudio');
    const dockTitle = document.getElementById('dockTitle');
    const dockArtist = document.getElementById('dockArtist');
    const dockPlay = document.getElementById('dockPlay');
    const dockPrev = document.getElementById('dockPrev');
    const dockNext = document.getElementById('dockNext');
    const dockProgressBar = document.getElementById('dockProgressBar');
    const dockProgressFill = document.getElementById('dockProgressFill');
    const dockCur = document.getElementById('dockCur');
    const dockDur = document.getElementById('dockDur');
    const dockDownload = document.getElementById('dockDownload');

    if (!listEl || !audio || !window.NatesData) return;

    const catalog = Array.isArray(NatesData.musicCatalog) ? NatesData.musicCatalog.slice() : [];
    let filtered = catalog.slice();
    let playingIndex = -1;
    let rowEls = [];

    function formatTime(sec) {
        if (isNaN(sec) || sec < 0) return '0:00';
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return m + ':' + s.toString().padStart(2, '0');
    }

    function fileNameFromSrc(src) {
        if (!src) return '';
        const parts = src.split('/');
        return parts[parts.length - 1] || src;
    }

    function rowMatchesQuery(track, q) {
        if (!q) return true;
        const hay = (
            (track.title || '') + ' ' +
            (track.artist || '') + ' ' +
            (track.format || '') + ' ' +
            (track.src || '') + ' ' +
            (track.notes || '')
        ).toLowerCase();
        return hay.indexOf(q.toLowerCase()) !== -1;
    }

    function setPlayingRow(index) {
        rowEls.forEach(function (row, i) {
            row.classList.toggle('music-row-playing', i === index);
            const btn = row.querySelector('.music-row-play');
            if (btn) btn.textContent = i === index && !audio.paused ? '⏸' : '▶';
        });
    }

    function updateDockPlaySymbol() {
        dockPlay.textContent = audio.paused ? '▶' : '⏸';
        setPlayingRow(playingIndex);
    }

    function playIndex(index) {
        if (index < 0 || index >= filtered.length) return;
        playingIndex = index;
        const t = filtered[index];
        audio.src = t.src;
        dockTitle.textContent = t.title || fileNameFromSrc(t.src);
        dockArtist.textContent = t.artist || '';
        if (dockDownload) {
            dockDownload.href = t.src;
            dockDownload.download = fileNameFromSrc(t.src);
            dockDownload.hidden = false;
        }
        audio.play().catch(function () { updateDockPlaySymbol(); });
        setPlayingRow(playingIndex);
    }

    function togglePlayPause() {
        if (playingIndex < 0 && filtered.length) {
            playIndex(0);
            return;
        }
        if (audio.paused) audio.play().catch(function () {});
        else audio.pause();
    }

    function render() {
        listEl.textContent = '';
        rowEls = [];
        const q = searchEl ? searchEl.value.trim() : '';
        filtered = catalog.filter(function (t) { return rowMatchesQuery(t, q); });

        if (countEl) {
            countEl.textContent = filtered.length + (filtered.length === 1 ? ' track' : ' tracks');
        }
        if (emptyEl) emptyEl.hidden = filtered.length > 0;

        filtered.forEach(function (track, index) {
            const row = document.createElement('div');
            row.className = 'music-library-row';
            row.dataset.index = String(index);

            const playBtn = document.createElement('button');
            playBtn.type = 'button';
            playBtn.className = 'music-row-play';
            playBtn.textContent = '▶';
            playBtn.setAttribute('aria-label', 'Play ' + (track.title || ''));

            const main = document.createElement('div');
            main.className = 'music-row-main';
            const title = document.createElement('span');
            title.className = 'music-row-title';
            title.textContent = track.title || fileNameFromSrc(track.src);
            const meta = document.createElement('span');
            meta.className = 'music-row-meta';
            meta.textContent = track.artist || '—';
            main.appendChild(title);
            main.appendChild(meta);

            const badges = document.createElement('div');
            badges.className = 'music-row-badges';
            if (track.includeOnEp) {
                const ep = document.createElement('span');
                ep.className = 'music-badge music-badge-ep';
                ep.textContent = 'EP';
                badges.appendChild(ep);
            }
            if (track.format) {
                const fmt = document.createElement('span');
                fmt.className = 'music-badge';
                fmt.textContent = track.format.toUpperCase();
                badges.appendChild(fmt);
            }
            if (track.duration) {
                const dur = document.createElement('span');
                dur.className = 'music-row-duration';
                dur.textContent = track.duration;
                badges.appendChild(dur);
            }

            const file = document.createElement('span');
            file.className = 'music-row-file';
            file.textContent = fileNameFromSrc(track.src);

            row.appendChild(playBtn);
            row.appendChild(main);
            row.appendChild(badges);
            row.appendChild(file);
            listEl.appendChild(row);
            rowEls.push(row);

            playBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (playingIndex === index && !audio.paused) {
                    audio.pause();
                } else {
                    playIndex(index);
                }
            });

            row.addEventListener('click', function () {
                if (playingIndex === index && !audio.paused) audio.pause();
                else playIndex(index);
            });
        });

        if (playingIndex >= filtered.length) {
            playingIndex = -1;
            audio.pause();
            audio.src = '';
            dockTitle.textContent = '—';
            dockArtist.textContent = '';
            if (dockDownload) dockDownload.hidden = true;
        }
        setPlayingRow(playingIndex);
        updateDockPlaySymbol();
    }

    if (searchEl) {
        searchEl.addEventListener('input', function () { render(); });
    }

    if (dockPlay) dockPlay.addEventListener('click', togglePlayPause);
    if (dockPrev) {
        dockPrev.addEventListener('click', function () {
            if (!filtered.length) return;
            const next = playingIndex <= 0 ? filtered.length - 1 : playingIndex - 1;
            playIndex(next);
        });
    }
    if (dockNext) {
        dockNext.addEventListener('click', function () {
            if (!filtered.length) return;
            const next = playingIndex < 0 ? 0 : (playingIndex + 1) % filtered.length;
            playIndex(next);
        });
    }

    audio.addEventListener('timeupdate', function () {
        if (!audio.duration) return;
        const pct = (audio.currentTime / audio.duration) * 100;
        if (dockProgressFill) dockProgressFill.style.width = pct + '%';
        if (dockCur) dockCur.textContent = formatTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', function () {
        if (dockDur) dockDur.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('play', updateDockPlaySymbol);
    audio.addEventListener('pause', updateDockPlaySymbol);
    audio.addEventListener('ended', function () {
        if (!filtered.length) return;
        const next = (playingIndex + 1) % filtered.length;
        playIndex(next);
    });

    if (dockProgressBar) {
        dockProgressBar.addEventListener('click', function (e) {
            const rect = dockProgressBar.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            if (audio.duration) audio.currentTime = pct * audio.duration;
        });
    }

    render();
})();
