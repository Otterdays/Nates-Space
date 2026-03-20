// [TRACE: DOCS/ARCHITECTURE.md] Boot order: playlist DOM → feed → delegated UI affordances.
(function () {
    window.renderPlaylist();

    if (typeof NatesData !== 'undefined') {
        window.renderPosts();
    } else if (typeof console !== 'undefined' && console.warn) {
        console.warn('NatesData not found. Feed empty — add assets/data.js.');
    }

    document.body.addEventListener('click', function (e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        const t = btn.textContent || '';
        if (t.indexOf('Save') !== -1 || t.indexOf('Share') !== -1) return;
        btn.style.transform = 'scale(1.2)';
        setTimeout(function () {
            btn.style.transform = 'scale(1)';
        }, 150);
    });

    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        const t = btn.textContent || '';
        if (t.indexOf('Save') !== -1) {
            window.showToast('Saved to your collection!', '🔖');
        }
        if (t.indexOf('Share') !== -1) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(window.location.href).then(function () {
                    window.showToast('Link copied to clipboard!', '🔗');
                }).catch(function () {
                    window.showToast('Could not copy link', '⚠️');
                });
            } else {
                window.showToast('Could not copy link', '⚠️');
            }
        }
    });
})();
