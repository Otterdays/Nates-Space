// [TRACE: DOCS/ARCHITECTURE.md]
(function () {
    const revealElements = document.querySelectorAll('.post, .gallery-panel, .friends-panel');

    window.revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                window.revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function (el) {
        el.classList.add('scroll-reveal');
        window.revealObserver.observe(el);
    });
})();
