// Nate's Space Data Source
//
// Music: folder listing is embedded below (between markers) so file:// works.
// Refresh: from repo root run  node tools/scan-music.mjs --write
// EP order + pretty titles: epTrackSrcs + musicTrackOverrides in NatesData.

/* <AUTOGEN_MUSIC_SCAN> */
window.__MUSIC_CATALOG_SCAN = [
  {
    "src": "assets/music/Akward Moments Natee V2 (M).mp3",
    "title": "Akward Moments Natee V2 (M)",
    "artist": "Natee",
    "duration": "",
    "format": "mp3",
    "added": "2026-03-20"
  },
  {
    "src": "assets/music/Dark Spaces Natee  V2.m4a",
    "title": "Dark Spaces Natee  V2",
    "artist": "Natee",
    "duration": "",
    "format": "m4a",
    "added": "2026-03-20"
  },
  {
    "src": "assets/music/Natee 730 PM V1 (M).m4a",
    "title": "Natee 730 PM V1 (M)",
    "artist": "Natee",
    "duration": "",
    "format": "m4a",
    "added": "2026-03-20"
  }
];
/* </AUTOGEN_MUSIC_SCAN> */

const NatesData = {
    /**
     * Which files appear in sidebar / focus / mobile EP — `src` must match generated catalog exactly.
     */
    epTrackSrcs: [
        'assets/music/Akward Moments Natee V2 (M).mp3',
        'assets/music/Natee 730 PM V1 (M).m4a',
        'assets/music/Dark Spaces Natee  V2.m4a'
    ],

    /**
     * Optional display metadata keyed by exact `src` from the generated catalog.
     */
    musicTrackOverrides: {
        'assets/music/Akward Moments Natee V2 (M).mp3': {
            title: 'Awkward Moments',
            duration: '3:24'
        },
        'assets/music/Natee 730 PM V1 (M).m4a': {
            title: '7:30 PM',
            duration: '2:48'
        },
        'assets/music/Dark Spaces Natee  V2.m4a': {
            title: 'Dark Spaces',
            duration: '3:43'
        }
    },

    /** Legacy fallback if music-catalog.generated.js is missing or empty (normally unused). */
    musicCatalog: [],

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
