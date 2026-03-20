/**
 * Prints MY_MUSIC_FILES lines from assets/music — paste into js/music-files.js
 *   node tools/scan-music.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const musicDir = path.join(__dirname, '..', 'assets', 'music');

if (!fs.existsSync(musicDir)) {
    console.error('No folder:', musicDir);
    process.exit(1);
}

const files = fs.readdirSync(musicDir)
    .filter((f) => /\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(f))
    .sort();

console.log('Paste into js/music-files.js → MY_MUSIC_FILES:\n');
console.log('window.MY_MUSIC_FILES = [');
files.forEach((f) => console.log("    '" + f.replace(/'/g, "\\'") + "',"));
console.log('];\n');
