/**
 * List assets/music → MY_MUSIC_FILES
 *   node tools/scan-music.mjs           # print only
 *   node tools/scan-music.mjs --apply   # patch js/music-files.js (between markers)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const musicDir = path.join(root, 'assets', 'music');
const musicFilesPath = path.join(root, 'js', 'music-files.js');
const apply = process.argv.includes('--apply');

if (!fs.existsSync(musicDir)) {
    console.error('No folder:', musicDir);
    process.exit(1);
}

const files = fs.readdirSync(musicDir)
    .filter((f) => /\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(f))
    .sort();

const lines = files.map((f) => "    '" + f.replace(/'/g, "\\'") + "',");
const blockInner = 'window.MY_MUSIC_FILES = [\n' + lines.join('\n') + '\n];';
const fullBlock =
    '/* <MY_MUSIC_FILES> */\n' + blockInner + '\n/* </MY_MUSIC_FILES> */';

if (apply) {
    const raw = fs.readFileSync(musicFilesPath, 'utf8');
    const norm = raw.replace(/\r\n/g, '\n');
    const startMark = '/* <MY_MUSIC_FILES> */\n';
    const endMark = '\n/* </MY_MUSIC_FILES> */';
    const startIdx = norm.indexOf(startMark);
    const endIdx = norm.indexOf(endMark);
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        console.error('Missing MY_MUSIC_FILES markers in js/music-files.js');
        process.exit(1);
    }
    const out =
        norm.slice(0, startIdx) + fullBlock + norm.slice(endIdx + endMark.length);
    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(musicFilesPath, out.replace(/\n/g, eol), 'utf8');
    console.log('Updated js/music-files.js —', files.length, 'tracks');
} else {
    console.log('Paste into js/music-files.js → MY_MUSIC_FILES:\n');
    console.log('window.MY_MUSIC_FILES = [');
    lines.forEach((l) => console.log(l));
    console.log('];\n');
    console.log('Or run: node tools/scan-music.mjs --apply');
}
