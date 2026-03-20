// [TRACE: DOCS/ARCHITECTURE.md] One audio element; sidebar / mobile / focus stay in sync.
(function () {
    const audioPlayer = document.getElementById('audioPlayer');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeIcon = document.querySelector('.volume-icon');
    const mobilePlayerBar = document.getElementById('mobilePlayerBar');
    const mobilePlayerExpanded = document.getElementById('mobilePlayerExpanded');
    const mobilePlayBtn = document.getElementById('mobilePlayBtn');
    const expandedPlayBtn = document.getElementById('expandedPlayBtn');
    const collapseBtn = document.getElementById('collapseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const mobileProgressBar = document.getElementById('mobileProgressBar');
    const mobileProgressFill = document.getElementById('mobileProgressFill');
    const focusProgressBar = document.querySelector('.focus-progress-bar');
    const focusProgressFill = document.querySelector('.focus-progress-fill');
    const focusCurrentTimeEl = document.querySelector('.focus-current-time');
    const focusDurationEl = document.querySelector('.focus-duration');
    const heroPlayAllBtn = document.getElementById('heroPlayAllBtn');

    if (!audioPlayer) return;

    window.currentTrack = null;
    window.isPlaying = false;

    function getSidebarTracks() {
        return document.querySelectorAll('#sidebarTrackList .track');
    }

    window.formatTime = function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + secs.toString().padStart(2, '0');
    };

    function updateVolumeIcon(volume) {
        if (!volumeIcon) return;
        if (volume === 0) volumeIcon.textContent = '🔇';
        else if (volume < 0.5) volumeIcon.textContent = '🔉';
        else volumeIcon.textContent = '🔊';
    }

    function updateMobilePlayButtons(symbol) {
        if (mobilePlayBtn) mobilePlayBtn.textContent = symbol;
        if (expandedPlayBtn) expandedPlayBtn.textContent = symbol;
    }

    function updateMobilePlayerUI(trackName) {
        const barName = document.querySelector('.mobile-track-name');
        const expName = document.querySelector('.expanded-track-name');
        if (barName) barName.textContent = trackName;
        if (expName) expName.textContent = trackName;

        const ep = NatesData && typeof NatesData.getEpTracks === 'function'
            ? NatesData.getEpTracks()
            : [];
        const idx = ep.length
            ? ep.findIndex(function (t) { return t.title === trackName; })
            : -1;
        document.querySelectorAll('#mobileTrackList .mobile-track-item').forEach(function (item, i) {
            item.classList.toggle('active', i === idx);
        });
    }

    function updateFocusPlayerUI(activeIndex) {
        document.querySelectorAll('#focusTrackList .focus-track').forEach(function (track, i) {
            track.classList.toggle('active', i === activeIndex);
            track.classList.toggle('playing', i === activeIndex && window.isPlaying);
            const btn = track.querySelector('.focus-track-btn');
            if (btn) btn.textContent = (i === activeIndex && window.isPlaying) ? '⏸' : '▶';
        });
    }

    function updateHeroPlayButton(playing) {
        if (heroPlayAllBtn) {
            heroPlayAllBtn.textContent = playing ? '⏸ Pause All' : '▶ Play All';
        }
    }

    function syncProgressUI() {
        if (!audioPlayer.duration) return;
        const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        const t = window.formatTime(audioPlayer.currentTime);

        if (progressFill) progressFill.style.width = pct + '%';
        if (currentTimeEl) currentTimeEl.textContent = t;

        if (mobileProgressFill) mobileProgressFill.style.width = pct + '%';
        const mct = document.querySelector('.mobile-current-time');
        if (mct) mct.textContent = t;

        if (focusProgressFill && focusCurrentTimeEl) {
            focusProgressFill.style.width = pct + '%';
            focusCurrentTimeEl.textContent = t;
        }
    }

    function syncDurationUI() {
        const d = window.formatTime(audioPlayer.duration);
        if (durationEl) durationEl.textContent = d;
        const md = document.querySelector('.mobile-duration');
        if (md) md.textContent = d;
        if (focusDurationEl) focusDurationEl.textContent = d;
    }

    window.playTrack = function playTrack(trackElement) {
        const tracks = getSidebarTracks();
        const src = trackElement.dataset.src;
        const trackIndex = Array.prototype.indexOf.call(tracks, trackElement);

        if (window.currentTrack === trackElement && window.isPlaying) {
            audioPlayer.pause();
            window.isPlaying = false;
            trackElement.classList.remove('playing');
            const b = trackElement.querySelector('.track-play-btn');
            if (b) b.textContent = '▶';
            return;
        }

        tracks.forEach(function (t) {
            t.classList.remove('playing', 'active');
            const btn = t.querySelector('.track-play-btn');
            if (btn) btn.textContent = '▶';
        });

        trackElement.classList.add('active', 'playing');
        const playBtn = trackElement.querySelector('.track-play-btn');
        if (playBtn) playBtn.textContent = '⏸';
        window.currentTrack = trackElement;

        audioPlayer.src = src;
        audioPlayer.play();
        window.isPlaying = true;

        const epList = NatesData && typeof NatesData.getEpTracks === 'function'
            ? NatesData.getEpTracks()
            : [];
        if (trackIndex >= 0 && epList[trackIndex]) {
            updateMobilePlayerUI(epList[trackIndex].title);
            updateMobilePlayButtons('⏸');
        }
        updateFocusPlayerUI(trackIndex);
    };

    audioPlayer.volume = 0.8;

    audioPlayer.addEventListener('timeupdate', syncProgressUI);

    audioPlayer.addEventListener('loadedmetadata', syncDurationUI);

    audioPlayer.addEventListener('ended', function () {
        const trackArray = Array.from(getSidebarTracks());
        if (trackArray.length === 0) return;
        const currentIndex = trackArray.indexOf(window.currentTrack);
        const nextIndex = (currentIndex + 1) % trackArray.length;

        if (nextIndex !== 0) {
            window.playTrack(trackArray[nextIndex]);
        } else if (window.currentTrack) {
            window.isPlaying = false;
            window.currentTrack.classList.remove('playing');
            const btn = window.currentTrack.querySelector('.track-play-btn');
            if (btn) btn.textContent = '▶';
            if (progressFill) progressFill.style.width = '0%';
            if (currentTimeEl) currentTimeEl.textContent = '0:00';
        }
    });

    if (progressBar) {
        progressBar.addEventListener('click', function (e) {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', function (e) {
            const volume = e.target.value / 100;
            audioPlayer.volume = volume;
            updateVolumeIcon(volume);
        });
    }

    if (volumeIcon) {
        volumeIcon.addEventListener('click', function () {
            if (audioPlayer.volume > 0) {
                audioPlayer.dataset.prevVolume = audioPlayer.volume;
                audioPlayer.volume = 0;
                if (volumeSlider) volumeSlider.value = 0;
                updateVolumeIcon(0);
            } else {
                const prevVol = parseFloat(audioPlayer.dataset.prevVolume) || 0.8;
                audioPlayer.volume = prevVol;
                if (volumeSlider) volumeSlider.value = prevVol * 100;
                updateVolumeIcon(prevVol);
            }
        });
    }

    if (mobilePlayerBar) {
        mobilePlayerBar.addEventListener('click', function (e) {
            if (!e.target.closest('.mobile-play-btn')) {
                mobilePlayerExpanded.classList.add('active');
            }
        });
    }

    if (collapseBtn && mobilePlayerExpanded) {
        collapseBtn.addEventListener('click', function () {
            mobilePlayerExpanded.classList.remove('active');
        });
    }

    function toggleMobilePlay() {
        const tracks = getSidebarTracks();
        if (!window.currentTrack && tracks.length > 0) {
            window.playTrack(tracks[0]);
        } else if (window.isPlaying) {
            audioPlayer.pause();
            window.isPlaying = false;
            updateMobilePlayButtons('▶');
            if (window.currentTrack) {
                window.currentTrack.classList.remove('playing');
                const b = window.currentTrack.querySelector('.track-play-btn');
                if (b) b.textContent = '▶';
            }
        } else {
            audioPlayer.play();
            window.isPlaying = true;
            updateMobilePlayButtons('⏸');
            if (window.currentTrack) {
                window.currentTrack.classList.add('playing');
                const b = window.currentTrack.querySelector('.track-play-btn');
                if (b) b.textContent = '⏸';
            }
        }
    }

    if (mobilePlayBtn) {
        mobilePlayBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMobilePlay();
        });
    }
    if (expandedPlayBtn) {
        expandedPlayBtn.addEventListener('click', function () {
            toggleMobilePlay();
        });
    }

    if (mobileProgressBar) {
        mobileProgressBar.addEventListener('click', function (e) {
            const rect = mobileProgressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            const trackArray = Array.from(getSidebarTracks());
            const currentIndex = trackArray.indexOf(window.currentTrack);
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : trackArray.length - 1;
            if (trackArray[prevIndex]) window.playTrack(trackArray[prevIndex]);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            const trackArray = Array.from(getSidebarTracks());
            const currentIndex = trackArray.indexOf(window.currentTrack);
            const nextIndex = (currentIndex + 1) % trackArray.length;
            if (trackArray[nextIndex]) window.playTrack(trackArray[nextIndex]);
        });
    }

    const sidebarTrackList = document.getElementById('sidebarTrackList');
    if (sidebarTrackList) {
        sidebarTrackList.addEventListener('click', function (e) {
            const row = e.target.closest('.track');
            if (row) window.playTrack(row);
        });
    }

    const focusTrackList = document.getElementById('focusTrackList');
    if (focusTrackList) {
        focusTrackList.addEventListener('click', function (e) {
            const row = e.target.closest('.focus-track');
            if (!row) return;
            const idx = Array.prototype.indexOf.call(focusTrackList.children, row);
            const st = getSidebarTracks()[idx];
            if (st) window.playTrack(st);
        });
    }

    const mobileTrackList = document.getElementById('mobileTrackList');
    if (mobileTrackList) {
        mobileTrackList.addEventListener('click', function (e) {
            const row = e.target.closest('.mobile-track-item');
            if (!row) return;
            const idx = parseInt(row.dataset.index, 10);
            const st = getSidebarTracks()[idx];
            if (st) window.playTrack(st);
        });
    }

    audioPlayer.addEventListener('play', function () {
        updateMobilePlayButtons('⏸');
        const idx = Array.prototype.indexOf.call(getSidebarTracks(), window.currentTrack);
        if (idx >= 0) updateFocusPlayerUI(idx);
        updateHeroPlayButton(true);
    });

    audioPlayer.addEventListener('pause', function () {
        updateMobilePlayButtons('▶');
        document.querySelectorAll('#focusTrackList .focus-track').forEach(function (track) {
            track.classList.remove('playing');
            const btn = track.querySelector('.focus-track-btn');
            if (btn) btn.textContent = '▶';
        });
        updateHeroPlayButton(false);
    });

    if (focusProgressBar) {
        focusProgressBar.addEventListener('click', function (e) {
            const rect = focusProgressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;
        });
    }

    if (heroPlayAllBtn) {
        heroPlayAllBtn.addEventListener('click', function () {
            const tracks = getSidebarTracks();
            if (window.isPlaying) {
                audioPlayer.pause();
            } else if (window.currentTrack) {
                audioPlayer.play();
            } else if (tracks.length > 0) {
                window.playTrack(tracks[0]);
            }
        });
    }
})();
