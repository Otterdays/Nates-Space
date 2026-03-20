/**
 * Lists assets/music/* audio files and prints JSON for pasting into NatesData.musicCatalog.
 * Run from repo root: node tools/scan-music.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const musicDir = path.join(root, 'assets', 'music');

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
        includeOnEp: false,
        added: today
    };
});

console.log('// Paste entries into assets/data.js → NatesData.musicCatalog (merge; set includeOnEp / duration).\n');
console.log(JSON.stringify(rows, null, 4));
