import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { embedsPlugin } from './src/lib/embeds.mjs';
import rebase from './src/lib/rebase.mjs';

// Vorschau auf GitHub Pages: SITE_URL=https://<konto>.github.io BASE_PATH=/ctag-website (setzt der Workflow).
// Mit eigener Domain beide weglassen.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: process.env.SITE_URL || 'https://www.creative-technologies.de',
  base,
  trailingSlash: 'always',
  markdown: {
    processor: satteri({ mdastPlugins: [embedsPlugin] }),
  },
  integrations: [rebase(base)],
});
