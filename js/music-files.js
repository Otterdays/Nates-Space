/**
 * YOUR MUSIC — list matches files in assets/music/
 * Guide: DOCS/MUSIC_GUIDE.md  |  Refresh: node tools/scan-music.mjs --apply
 */
/* <MY_MUSIC_FILES> */
window.MY_MUSIC_FILES = [
    'Akward Moments Natee V2 (M).mp3',
    'Dark Spaces Natee  V2.m4a',
    'Natee 730 PM V1 (M).m4a',
];
/* </MY_MUSIC_FILES> */

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
