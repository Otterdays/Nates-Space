/**
 * YOUR MUSIC — edit this file only.
 * 1. Put audio files in assets/music/
 * 2. Add each exact filename to MY_MUSIC_FILES below (copy from folder)
 *
 * Optional: MY_MUSIC_TITLES = pretty names. MY_EP_FILES = subset for sidebar EP (omit = same as all).
 */
window.MY_MUSIC_FILES = [
    'Akward Moments Natee V2 (M).mp3',
    'Natee 730 PM V1 (M).m4a',
    'Dark Spaces Natee  V2.m4a'
];

window.MY_MUSIC_ARTIST = 'Natee';

window.MY_MUSIC_TITLES = {
    'Akward Moments Natee V2 (M).mp3': 'Awkward Moments',
    'Natee 730 PM V1 (M).m4a': '7:30 PM',
    'Dark Spaces Natee  V2.m4a': 'Dark Spaces'
};

/** Omit or leave empty to use MY_MUSIC_FILES for the feed sidebar EP */
window.MY_EP_FILES = [];

(function () {
    function extOf(filename) {
        var m = filename.match(/\.([^.]+)$/);
        return m ? m[1].toLowerCase() : '';
    }

    function titleFor(filename) {
        var map = window.MY_MUSIC_TITLES || {};
        if (map[filename]) return map[filename];
        return filename.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim();
    }

    window.rowFromMusicFile = function rowFromMusicFile(filename) {
        return {
            src: 'assets/music/' + filename,
            title: titleFor(filename),
            artist: window.MY_MUSIC_ARTIST || 'Artist',
            duration: '',
            format: extOf(filename)
        };
    };

    window.getAllMusicRows = function getAllMusicRows() {
        return (window.MY_MUSIC_FILES || []).map(window.rowFromMusicFile);
    };

    window.getEpMusicRows = function getEpMusicRows() {
        var ep = window.MY_EP_FILES;
        var names = ep && ep.length ? ep : window.MY_MUSIC_FILES || [];
        return names.map(window.rowFromMusicFile);
    };
})();
