// [TRACE: DOCS/ARCHITECTURE.md] Image lightbox + video modal; gallery metadata from NatesData.images.
(function () {
    const imageModal = document.getElementById('imageModal');
    const closeImageModalBtn = document.getElementById('closeImageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalQuote = document.getElementById('modalQuote');
    const modalTimestamp = document.getElementById('modalTimestamp');
    const modalTag = document.getElementById('modalTag');
    const modalViews = document.getElementById('modalViews');
    const modalLikeCount = document.getElementById('modalLikeCount');
    const modalCommentCount = document.getElementById('modalCommentCount');
    const modalDownloadBtn = document.getElementById('modalDownloadBtn');
    const prevImageBtn = document.getElementById('prevImage');
    const nextImageBtn = document.getElementById('nextImage');

    const videoModal = document.getElementById('videoModal');
    const closeVideoModalBtn = document.getElementById('closeVideoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoModalTitle = document.getElementById('videoModalTitle');
    const videoModalQuote = document.getElementById('videoModalQuote');
    const videoModalTimestamp = document.getElementById('videoModalTimestamp');
    const videoModalLikeCount = document.getElementById('videoModalLikeCount');
    const videoModalCommentCount = document.getElementById('videoModalCommentCount');

    let allImages = [];
    let currentImageIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    function sameAssetUrl(a, b) {
        try {
            return new URL(a, location.href).href === new URL(b, location.href).href;
        } catch {
            return a === b;
        }
    }

    function matchGalleryMeta(img) {
        if (!window.NatesData || !NatesData.images) return null;
        const imgPath = new URL(img.src, location.href).pathname;
        for (let i = 0; i < NatesData.images.length; i++) {
            const d = NatesData.images[i];
            try {
                if (new URL(d.src, location.href).pathname === imgPath) return d;
            } catch {
                if (img.src.indexOf(d.src) !== -1) return d;
            }
        }
        return null;
    }

    function collectImages() {
        allImages = [];

        document.querySelectorAll('.post .media-container img').forEach(function (img) {
            const post = img.closest('.post');
            if (!post) return;
            const titleEl = post.querySelector('.post-meta h2');
            const quoteEl = post.querySelector('.post-content > p');
            const timestampEl = post.querySelector('.timestamp');
            const tagEl = post.querySelector('.tag');
            const viewsEl = post.querySelector('.image-overlay span');
            const likeBtn = post.querySelector('.action-btn:first-child');
            const commentBtn = post.querySelector('.action-btn:nth-child(2)');

            allImages.push({
                src: img.src,
                alt: img.alt,
                title: titleEl ? titleEl.textContent : 'Photo',
                quote: quoteEl ? quoteEl.textContent : '',
                timestamp: timestampEl ? timestampEl.textContent : 'Just now',
                tag: tagEl ? tagEl.textContent : 'Photo',
                views: viewsEl ? viewsEl.textContent : '',
                likes: likeBtn ? likeBtn.textContent.replace('❤️', '').trim() : '0',
                comments: commentBtn ? commentBtn.textContent.replace('💬', '').trim() : '0'
            });
        });

        document.querySelectorAll('.gallery-panel .gallery-item img').forEach(function (img) {
            const entry = matchGalleryMeta(img);
            if (entry) {
                allImages.push({
                    src: img.src,
                    alt: entry.alt || img.alt,
                    title: entry.title,
                    quote: entry.quote,
                    timestamp: entry.timestamp,
                    tag: entry.tag,
                    views: entry.views || '',
                    likes: entry.likes,
                    comments: entry.comments
                });
            } else {
                allImages.push({
                    src: img.src,
                    alt: img.alt,
                    title: 'Studio Gallery',
                    quote: 'Behind the scenes from the studio sessions. The creative space where the magic happens. 🎤✨',
                    timestamp: 'Gallery',
                    tag: 'Gallery',
                    views: '👁️ 820 views',
                    likes: '128',
                    comments: '24'
                });
            }
        });
    }

    function updateNavButtons() {
        if (prevImageBtn) prevImageBtn.disabled = currentImageIndex <= 0;
        if (nextImageBtn) nextImageBtn.disabled = currentImageIndex >= allImages.length - 1;
    }

    function openImageModal(index) {
        if (!imageModal || index < 0 || index >= allImages.length) return;

        currentImageIndex = index;
        const imageData = allImages[index];

        if (modalImage) {
            modalImage.src = imageData.src;
            modalImage.alt = imageData.alt;
        }
        if (modalTitle) modalTitle.textContent = imageData.title;
        if (modalQuote) modalQuote.textContent = imageData.quote;
        if (modalTimestamp) modalTimestamp.textContent = imageData.timestamp;
        if (modalTag) modalTag.textContent = imageData.tag;

        if (modalViews) {
            modalViews.textContent = '';
            const span = document.createElement('span');
            span.textContent = imageData.views || '👁️ View';
            modalViews.appendChild(span);
            modalViews.style.display = imageData.views ? 'block' : 'none';
        }

        if (modalLikeCount) modalLikeCount.textContent = imageData.likes;
        if (modalCommentCount) modalCommentCount.textContent = imageData.comments;

        updateNavButtons();
        imageModal.classList.add('active');
        window.lockBodyScroll();
    }

    function closeImageModal() {
        if (!imageModal) return;
        imageModal.classList.remove('active');
        window.unlockBodyScroll();
    }

    function showPrevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex -= 1;
            openImageModal(currentImageIndex);
        }
    }

    function showNextImage() {
        if (currentImageIndex < allImages.length - 1) {
            currentImageIndex += 1;
            openImageModal(currentImageIndex);
        }
    }

    function handleSwipe() {
        const distance = touchEndX - touchStartX;
        if (Math.abs(distance) > minSwipeDistance) {
            if (distance > 0) showPrevImage();
            else showNextImage();
        }
    }

    window.openVideoModal = function openVideoModal(sourceVideo) {
        const post = sourceVideo.closest('.post');
        if (!post || !videoModal || !modalVideo) return;

        const titleEl = post.querySelector('.post-meta h2');
        const quoteEl = post.querySelector('.post-content > p');
        const timestampEl = post.querySelector('.timestamp');
        const likeBtn = post.querySelector('.action-btn:first-child');
        const commentBtn = post.querySelector('.action-btn:nth-child(2)');
        const sourceEl = sourceVideo.querySelector('source');
        const sourceSrc = sourceEl ? sourceEl.src : '';

        modalVideo.src = sourceSrc;
        videoModalTitle.textContent = titleEl ? titleEl.textContent : 'Video';
        videoModalQuote.textContent = quoteEl ? quoteEl.textContent : '';
        videoModalTimestamp.textContent = timestampEl ? timestampEl.textContent : 'Just now';
        videoModalLikeCount.textContent = likeBtn ? likeBtn.textContent.replace('❤️', '').trim() : '0';
        videoModalCommentCount.textContent = commentBtn ? commentBtn.textContent.replace('💬', '').trim() : '0';

        videoModal.classList.add('active');
        window.lockBodyScroll();
        modalVideo.play().catch(function () { /* autoplay policy */ });
    };

    window.closeVideoModal = function closeVideoModal() {
        if (!videoModal || !modalVideo) return;
        videoModal.classList.remove('active');
        window.unlockBodyScroll();
        modalVideo.pause();
        modalVideo.currentTime = 0;
        modalVideo.src = '';
    };

    document.body.addEventListener('click', function (e) {
        const postImg = e.target.closest('.post .media-container img');
        if (postImg) {
            collectImages();
            const idx = allImages.findIndex(function (item) {
                return sameAssetUrl(item.src, postImg.src);
            });
            if (idx !== -1) openImageModal(idx);
            return;
        }
        const galImg = e.target.closest('.gallery-panel .gallery-item img');
        if (galImg) {
            collectImages();
            const idx = allImages.findIndex(function (item) {
                return sameAssetUrl(item.src, galImg.src);
            });
            if (idx !== -1) openImageModal(idx);
        }
    });

    if (closeImageModalBtn) closeImageModalBtn.addEventListener('click', closeImageModal);
    if (prevImageBtn) prevImageBtn.addEventListener('click', showPrevImage);
    if (nextImageBtn) nextImageBtn.addEventListener('click', showNextImage);

    if (modalDownloadBtn) {
        modalDownloadBtn.addEventListener('click', function () {
            if (!modalImage || !modalImage.src) return;
            const link = document.createElement('a');
            link.href = modalImage.src;
            const filename = modalImage.src.split('/').pop() || ('nate-space-image-' + Date.now() + '.jpg');
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.showToast('Image downloaded successfully!', '⬇️');
        });
    }

    if (imageModal) {
        imageModal.addEventListener('click', function (e) {
            if (e.target === imageModal || e.target.classList.contains('image-modal-image-section')) {
                closeImageModal();
            }
        });
    }

    document.addEventListener('keydown', function (e) {
        if (imageModal && imageModal.classList.contains('active')) {
            if (e.key === 'Escape') closeImageModal();
            else if (e.key === 'ArrowLeft') showPrevImage();
            else if (e.key === 'ArrowRight') showNextImage();
        }
        if (videoModal && videoModal.classList.contains('active') && e.key === 'Escape') {
            window.closeVideoModal();
        }
    });

    if (closeVideoModalBtn) closeVideoModalBtn.addEventListener('click', window.closeVideoModal);

    if (videoModal) {
        videoModal.addEventListener('click', function (e) {
            if (e.target === videoModal || e.target.classList.contains('image-modal-image-section')) {
                window.closeVideoModal();
            }
        });
    }

    if (imageModal) {
        imageModal.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        imageModal.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
})();
