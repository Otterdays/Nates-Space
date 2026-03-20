/**
 * Lists assets/music/* and updates the embedded catalog in assets/data.js (between markers).
 *
 *   node tools/scan-music.mjs           # stdout JSON only
 *   node tools/scan-music.mjs --write     # patch assets/data.js (preferred)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const musicDir = path.join(root, 'assets', 'music');
const dataPath = path.join(root, 'assets', 'data.js');

const writeFlag = process.argv.includes('--write');

if (!fs.existsSync(musicDir)) {
    console.error('Missing folder:', musicDir);
    process.exit(1);
}

const files = fs.readdirSync(musicDir).filter((f) =>
    /\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(f)
);
files.sort();

const today = new Date().toISOString().slice(0, 10);

const rows = files.map((f) => {
    const ext = path.extname(f).slice(1).toLowerCase();
    const base = f.replace(/\.[^.]+$/, '');
    return {
        src: 'assets/music/' + f,
        title: base.replace(/[_-]+/g, ' ').trim(),
        artist: 'Natee',
        duration: '',
        format: ext,
        added: today
    };
});

if (writeFlag) {
    const raw = fs.readFileSync(dataPath, 'utf8');
    const dataText = raw.replace(/\r\n/g, '\n');
    const startMark = '/* <AUTOGEN_MUSIC_SCAN> */\n';
    const endMark = '\n/* </AUTOGEN_MUSIC_SCAN> */';
    const startIdx = dataText.indexOf(startMark);
    const endIdx = dataText.indexOf(endMark);
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
        console.error('Could not find AUTOGEN_MUSIC_SCAN markers in assets/data.js');
        process.exit(1);
    }
    const inner =
        'window.__MUSIC_CATALOG_SCAN = ' + JSON.stringify(rows, null, 2) + ';';
    const newBlock = startMark + inner + endMark;
    const out =
        dataText.slice(0, startIdx) + newBlock + dataText.slice(endIdx + endMark.length);
    const eol = raw.includes('\r\n') ? '\r\n' : '\n';
    fs.writeFileSync(dataPath, out.replace(/\n/g, eol), 'utf8');
    console.log('Updated assets/data.js (' + rows.length + ' tracks in __MUSIC_CATALOG_SCAN)');
} else {
    console.log('// Run with --write to patch assets/data.js\n');
    console.log(JSON.stringify(rows, null, 4));
}
