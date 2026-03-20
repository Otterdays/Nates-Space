// [TRACE: DOCS/ARCHITECTURE.md] Shared body scroll lock for stacked modals.
(function () {
    let depth = 0;

    window.lockBodyScroll = function lockBodyScroll() {
        depth += 1;
        document.body.style.overflow = 'hidden';
    };

    window.unlockBodyScroll = function unlockBodyScroll() {
        depth = Math.max(0, depth - 1);
        if (depth === 0) document.body.style.overflow = '';
    };
})();
