// Astro-Integration: erzeugt nach dem Build kleine Vorschaubilder für die Projektkacheln.
// Jedes Titelbild /uploads/… bekommt /thumbs/….webp (640 px breit). Im Entwicklungsmodus zeigen die Kacheln das Original.
import { readdir, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const thumbPath = (cover) => '/thumbs/' + cover.replace(/^\/uploads\//, '').replace(/\.[a-z0-9]+$/i, '.webp');

export default function thumbs() {
  return {
    name: 'ctag-thumbs',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const projectDir = path.resolve('src/content/projects');
        let n = 0;
        for (const f of await readdir(projectDir)) {
          const m = (await readFile(path.join(projectDir, f), 'utf8')).match(/^cover:\s*"?([^"\n]+)"?$/m);
          if (!m) continue;
          const cover = m[1].trim();
          const src = path.resolve('public', decodeURI(cover).replace(/^\//, ''));
          const dest = path.join(out, decodeURI(thumbPath(cover)).replace(/^\//, ''));
          await mkdir(path.dirname(dest), { recursive: true });
          await sharp(src, { failOn: 'none' }).rotate().resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78 }).toFile(dest);
          n++;
        }
        logger.info(`${n} Vorschaubilder erzeugt`);
      },
    },
  };
}
