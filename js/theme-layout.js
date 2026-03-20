// [TRACE: DOCS/ARCHITECTURE.md]
(function () {
    const themeToggle = document.getElementById('themeToggle');
    const layoutToggle = document.getElementById('layoutToggle');
    const html = document.documentElement;
    const mainGrid = document.querySelector('.main-grid');
    const heroSection = document.querySelector('.hero-section');

    if (!themeToggle || !mainGrid) return;

    const savedTheme = localStorage.getItem('nateTheme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    const savedLayout = localStorage.getItem('nateLayout') || 'left';
    mainGrid.setAttribute('data-layout', savedLayout);
    if (layoutToggle) updateLayoutIcon(savedLayout);

    themeToggle.addEventListener('click', function () {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('nateTheme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('.icon');
        if (!icon) return;
        if (theme === 'light') {
            icon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
        } else {
            icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
        }
    }

    if (layoutToggle) {
        layoutToggle.addEventListener('click', function () {
            const layouts = ['left', 'right', 'focus'];
            const currentLayout = mainGrid.getAttribute('data-layout') || 'left';
            const currentIndex = layouts.indexOf(currentLayout);
            const nextLayout = layouts[(currentIndex + 1) % layouts.length];
            mainGrid.setAttribute('data-layout', nextLayout);
            localStorage.setItem('nateLayout', nextLayout);
            updateLayoutIcon(nextLayout);
            updateHeroVisibility(nextLayout);
        });
    }

    function updateLayoutIcon(layout) {
        if (!layoutToggle) return;
        const icon = layoutToggle.querySelector('.icon');
        if (!icon) return;
        if (layout === 'left') {
            icon.innerHTML = '<rect x="3" y="3" width="7" height="18" rx="1"></rect><rect x="14" y="3" width="7" height="18" rx="1"></rect>';
        } else if (layout === 'right') {
            icon.innerHTML = '<rect x="3" y="3" width="7" height="18" rx="1"></rect><rect x="14" y="3" width="7" height="18" rx="1" fill="currentColor"></rect>';
        } else {
            icon.innerHTML = '<rect x="6" y="3" width="12" height="18" rx="1"></rect>';
        }
    }

    function updateHeroVisibility(layout) {
        if (heroSection) {
            heroSection.style.display = layout === 'focus' ? 'block' : 'none';
        }
        const focusMusicPlayer = document.getElementById('focusMusicPlayer');
        if (focusMusicPlayer) {
            focusMusicPlayer.classList.toggle('visible', layout === 'focus');
        }
    }

    updateHeroVisibility(savedLayout);
})();
