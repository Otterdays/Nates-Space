// Nate's Space Data Source
//
// Music: drop files under assets/music/ then add a row to musicCatalog (or run
// node tools/scan-music.mjs and paste). includeOnEp: true = show in sidebar / focus / mobile EP UI.

const NatesData = {
    /**
     * Full library (music.html). EP players use entries where includeOnEp === true.
     * Optional: format, added (ISO date string), notes.
     */
    musicCatalog: [
        {
            src: 'assets/music/Akward Moments Natee V2 (M).mp3',
            title: 'Awkward Moments',
            artist: 'Natee',
            duration: '3:24',
            format: 'mp3',
            includeOnEp: true,
            added: '2026-01-12'
        },
        {
            src: 'assets/music/Natee 730 PM V1 (M).m4a',
            title: '7:30 PM',
            artist: 'Natee',
            duration: '2:48',
            format: 'm4a',
            includeOnEp: true,
            added: '2026-01-12'
        },
        {
            src: 'assets/music/Dark Spaces Natee  V2.m4a',
            title: 'Dark Spaces',
            artist: 'Natee',
            duration: '3:43',
            format: 'm4a',
            includeOnEp: true,
            added: '2026-01-14'
        }
    ],

    /** Studio gallery lightbox metadata (matched to DOM imgs by asset path). */
    images: [
        {
            id: 'img1',
            src: 'assets/IMG_20260112_193737.jpg',
            alt: 'Nate Profile',
            title: "Nate's Space",
            quote: "Mood: 🎤 Recording",
            timestamp: "Profile",
            tag: "Profile",
            views: '👁️ 2.1k views',
            likes: "420",
            comments: "69"
        },
        {
            id: 'img2',
            src: 'assets/IMG_20260112_194122.jpg',
            alt: 'Studio shot 1',
            title: 'Studio Vibes Today',
            quote: 'The setup is looking right. Got the gear ready, got the ideas flowing. Time to create something special. 🎧',
            timestamp: '3 hours ago',
            tag: 'Photo',
            views: '👁️ 1.8k views',
            likes: '287',
            comments: '42'
        },
        {
            id: 'img3',
            src: 'assets/IMG_20260112_194124.jpg',
            alt: 'Studio shot 2',
            title: 'Late Night Session',
            quote: "When the creative block finally breaks and the ideas start flowing... there's no better feeling. Been in here for 6 hours straight. No complaints. 💯",
            timestamp: 'Yesterday',
            tag: 'Photo',
            views: '👁️ 956 views',
            likes: '156',
            comments: '28'
        },
        {
            id: 'img4',
            src: 'assets/IMG_20260112_194126.jpg',
            alt: 'Studio shot 3',
            title: 'Behind the Scenes',
            quote: "The real magic happens when nobody's watching. Just me, the mic, and the vision. Let's get it. 🔥",
            timestamp: '2 days ago',
            tag: 'Photo',
            views: '👁️ 3.2k views',
            likes: '445',
            comments: '67'
        }
    ],
    posts: [
        {
            type: 'video',
            title: 'Recording Session 🔥',
            timestamp: 'Just now',
            content: "In the studio laying down some new tracks. The energy is unmatched right now. Can't wait for y'all to hear this one! 🎤🔊",
            media: {
                type: 'video',
                src: 'assets/VID_20260112_193751.mp4',
                poster: 'assets/IMG_20260112_194122.jpg'
            },
            stats: { likes: 342, comments: 56 }
        },
        {
            type: 'update',
            title: 'Off to the Engineer! 📤',
            timestamp: 'Just now',
            content: "Just sent the new track off to the engineer for mixing and mastering. Can't wait to hear how it sounds when it comes back polished! The wait is always the hardest part but it's gonna be worth it. Stay tuned fam! 🔥🎚️",
            stats: { likes: 89, comments: 12 }
        },
        {
            type: 'photo',
            title: 'Studio Vibes Today',
            timestamp: '3 hours ago',
            content: "The setup is looking right. Got the gear ready, got the ideas flowing. Time to create something special. 🎧",
            media: {
                type: 'image',
                src: 'assets/IMG_20260112_194124.jpg',
                alt: 'Studio setup'
            },
            stats: { likes: 287, comments: 42 }
        },
        {
            type: 'update',
            title: 'Late Night Session',
            timestamp: 'Yesterday',
            content: "When the creative block finally breaks and the ideas start flowing... there's no better feeling. Been in here for 6 hours straight. No complaints. 💯",
            stats: { likes: 156, comments: 28 }
        },
        {
            type: 'photo',
            title: 'Behind the Scenes',
            timestamp: '2 days ago',
            content: "The real magic happens when nobody's watching. Just me, the mic, and the vision. Let's get it. 🔥",
            media: {
                type: 'image',
                src: 'assets/IMG_20260112_194126.jpg',
                alt: 'Behind the scenes'
            },
            stats: { likes: 445, comments: 67 }
        }
    ]
};

/** @returns {Array<{src:string,title:string,artist:string,duration?:string,includeOnEp?:boolean}>} */
NatesData.getEpTracks = function getEpTracks() {
    if (!this.musicCatalog || !this.musicCatalog.length) return [];
    return this.musicCatalog.filter(function (t) {
        return t.includeOnEp === true;
    });
};
