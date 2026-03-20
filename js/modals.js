// [TRACE: DOCS/ARCHITECTURE.md] Follow / Apple Music overlays.
(function () {
    const socialModal = document.getElementById('socialModal');
    const closeModalBtn = document.getElementById('closeModal');
    const followBtns = document.querySelectorAll('.follow-btn');
    const appleMusicModal = document.getElementById('appleMusicModal');
    const closeAppleModalBtn = document.getElementById('closeAppleModal');
    const appleMusicToggles = document.querySelectorAll('.apple-toggle');

    function openSocialModal() {
        if (!socialModal) return;
        socialModal.classList.add('active');
        window.lockBodyScroll();
    }

    function closeSocialModal() {
        if (!socialModal) return;
        socialModal.classList.remove('active');
        window.unlockBodyScroll();
    }

    function openAppleModal() {
        if (!appleMusicModal) return;
        appleMusicModal.classList.add('active');
        window.lockBodyScroll();
    }

    function closeAppleModal() {
        if (!appleMusicModal) return;
        appleMusicModal.classList.remove('active');
        window.unlockBodyScroll();
    }

    followBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            openSocialModal();
        });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeSocialModal);

    appleMusicToggles.forEach(function (btn) {
        btn.addEventListener('click', openAppleModal);
    });

    if (closeAppleModalBtn) closeAppleModalBtn.addEventListener('click', closeAppleModal);

    window.addEventListener('click', function (e) {
        if (e.target === socialModal) closeSocialModal();
        if (e.target === appleMusicModal) closeAppleModal();
    });
})();
