// Astro-Integration: Läuft die Seite unter einem Unterpfad (z. B. GitHub Pages: /ctag-website/), werden nach dem Build
// alle seitenabsoluten Verweise in den HTML-Dateien (href="/…", src="/…", Weiterleitungen) um den Unterpfad ergänzt.
// So bleiben Vorlagen und Markdown-Inhalte bei "/projects/…" – das ist auch die Form für die spätere eigene Domain.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default function rebase(base) {
  const prefix = (base || '/').replace(/\/$/, '');
  return {
    name: 'ctag-rebase',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        if (!prefix) return;
        const root = fileURLToPath(dir);
        const files = (await readdir(root, { recursive: true })).filter((f) => f.endsWith('.html'));
        const fix = (url) => (url.startsWith('//') || url.startsWith(prefix + '/') ? url : prefix + url);
        for (const f of files) {
          const file = path.join(root, f);
          const html = await readFile(file, 'utf8');
          const out = html
            .replace(/\b(href|src|data-src|action)=(["'])(\/[^"']*)\2/g, (m, attr, q, url) => `${attr}=${q}${fix(url)}${q}`)
            .replace(/(http-equiv="refresh" content="0; url=)(\/[^"]*)"/g, (m, pre, url) => `${pre}${fix(url)}"`);
          if (out !== html) await writeFile(file, out);
        }
      },
    },
  };
}
