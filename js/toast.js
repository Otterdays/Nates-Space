// [TRACE: DOCS/ARCHITECTURE.md]
(function () {
    window.showToast = function showToast(message, icon, duration) {
        icon = icon === undefined ? '✨' : icon;
        duration = duration === undefined ? 3000 : duration;
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'toast-icon';
        iconSpan.textContent = icon;

        const msgSpan = document.createElement('span');
        msgSpan.className = 'toast-message';
        msgSpan.textContent = message;

        const progress = document.createElement('div');
        progress.className = 'toast-progress';
        progress.style.animationDuration = duration + 'ms';

        toast.appendChild(iconSpan);
        toast.appendChild(msgSpan);
        toast.appendChild(progress);
        toastContainer.appendChild(toast);

        setTimeout(function () {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', function () {
                toast.remove();
            });
        }, duration);
    };
})();
