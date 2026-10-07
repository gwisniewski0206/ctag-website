#!/usr/bin/env node
// Überführt die Rohdaten aus content/raw/ (siehe scrape.mjs) in die Inhalte der neuen Seite:
//   src/content/{projects,pages,partners,settings}/   Markdown und JSON
//   public/uploads/                                   nur die Dateien, die wirklich verwendet werden
//   public/demos/<slug>/                              die interaktiven Processing-/JS-Demos
// Aufruf: node scripts/import.mjs   (überschreibt die erzeugten Dateien bei jedem Lauf)
import { readFile, writeFile, mkdir, copyFile, rm, access } from 'node:fs/promises';
import path from 'node:path';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import sharp from 'sharp';

const SITE_HOSTS = /^https?:\/\/(www\.)?creative-technologies\.de/i;
const RAW = path.resolve('content/raw');
const OUT = path.resolve('src/content');
const PUBLIC = path.resolve('public');

const readJson = async (f) => JSON.parse(await readFile(f, 'utf8'));
const exists = (f) => access(f).then(() => true, () => false);
const write = async (f, s) => { await mkdir(path.dirname(f), { recursive: true }); await writeFile(f, s); };

const pages = await readJson(path.join(RAW, 'pages.json'));
const projectList = await readJson('content/projects.json');
const partnerList = await readJson('content/partners.json');
// Nachgepflegte Felder (Kurzfassung, Team, Themen, Titelbild …) – siehe content/project-meta.json
const projectMeta = await readJson('content/project-meta.json');
const byId = new Map(pages.map((p) => [p.id, p]));

// ---------- Adressen ----------

// Pfad einer WP-URL, dekodiert und NFC-normalisiert, immer mit Schrägstrich am Ende
function wpPath(url) {
  const u = new URL(url, 'https://www.creative-technologies.de');
  let p = decodeURIComponent(u.pathname).normalize('NFC');
  if (!p.endsWith('/')) p += '/';
  return p;
}
// ASCII-Slug für neue Adressen: "künstlicher" → "kunstlicher"
const asciiSlug = (s) => decodeURIComponent(s).normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Seiten, die als eigene Seite übernommen werden (neuer Pfad → WP-id). Alles andere außer Projekten fällt weg.
const KEEP_PAGES = {
  'impressum': 40,
  'datenschutzerklarung': 45,
  'makerspace': 457,
  'makerspace/lasercutter-start': 882,
  'makerspace/lasercutter-start/lasercutter-basics-von-der-idee-an-die-wand': 886,
};
// Seiten mit eigenem Template: Inhalt kommt aus settings/ bzw. partners/
const TEMPLATE_PAGES = { 1307: '/', 29: '/projects/', 22: '/partners/', 24: '/contact/' };
// Weggefallene Seiten → Ziel der Umleitung
const DROPPED = { 912: '/makerspace/', 1017: '/makerspace/', 1023: '/makerspace/', 963: '/makerspace/' };

// Projekte in Listenreihenfolge, mit WP-Seite
const projects = projectList.map((entry) => {
  const page = entry.url.includes('?p=')
    ? byId.get(Number(new URL(entry.url).searchParams.get('p')))
    : pages.find((p) => wpPath(p.link) === wpPath(entry.url));
  if (!page) throw new Error(`Keine WP-Seite für ${entry.url}`);
  return { ...entry, page, slug: asciiSlug(page.slug) };
});

// Alte Adresse → neue Adresse, für Links im Text und für die Umleitungen
const newPathOf = new Map();
for (const p of projects) newPathOf.set(wpPath(p.page.link), `/projects/${p.slug}/`);
for (const [np, id] of Object.entries(KEEP_PAGES)) newPathOf.set(wpPath(byId.get(id).link), `/${np}/`);
for (const [id, np] of Object.entries(TEMPLATE_PAGES)) newPathOf.set(wpPath(byId.get(Number(id)).link), np);
for (const [id, np] of Object.entries(DROPPED)) newPathOf.set(wpPath(byId.get(Number(id)).link), np);
const unmapped = pages.filter((p) => !newPathOf.has(wpPath(p.link)));
if (unmapped.length) throw new Error('Nicht zugeordnete Seiten: ' + unmapped.map((p) => p.slug).join(', '));
// ?p=<id> und ?page_id=<id> funktionieren auf der alten Seite für jede Seite; die Startseite leitet sie per Skript um
const byQueryId = Object.fromEntries(pages.map((p) => [p.id, newPathOf.get(wpPath(p.link))]));

// ---------- Dateien aus uploads ----------

const usedUploads = new Set();
// WP-Upload-URL → Pfad unter /uploads/. Nimmt das Original statt der verkleinerten Variante, wenn vorhanden.
async function uploadPath(url) {
  const rel = decodeURIComponent(new URL(url, 'https://www.creative-technologies.de').pathname.split('/wp-content/uploads/')[1]);
  const original = rel.replace(/-\d+x\d+(\.[a-z0-9]+)$/i, '$1');
  for (const cand of [original, rel]) {
    if (await exists(path.join(RAW, 'uploads', cand))) { usedUploads.add(cand); return '/uploads/' + encodeURI(cand); }
  }
  console.warn(`  ! Datei fehlt in content/raw/uploads: ${rel}`);
  return '/uploads/' + encodeURI(rel);
}

// Alle Links und Bildquellen im HTML auf die neue Seite umschreiben
async function rewriteUrls(html) {
  const urls = new Set([...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]));
  const map = new Map();
  for (const raw of urls) {
    const url = raw.replace(/&amp;/g, '&').replace(/&#038;/g, '&');
    if (!SITE_HOSTS.test(url) && !url.startsWith('/')) continue;
    let target;
    if (url.includes('/wp-content/uploads/')) target = await uploadPath(url);
    else {
      const u = new URL(url, 'https://www.creative-technologies.de');
      const q = u.searchParams.get('p') || u.searchParams.get('page_id');
      target = q ? byQueryId[q] : newPathOf.get(wpPath(url));
      if (target && u.hash) target += u.hash;
      if (!target) console.warn(`  ! Interner Link ohne Ziel: ${url}`);
    }
    if (target) map.set(raw, target);
  }
  return html.replace(/(href|src)="([^"]+)"/g, (m, attr, v) => (map.has(v) ? `${attr}="${map.get(v)}"` : m));
}

// ---------- HTML → Markdown ----------

const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', emDelimiter: '*' });
td.use(gfm);
td.keep(['sup', 'sub']);
// Links ohne Text (Icon-Buttons von SiteOrigin) weglassen
td.addRule('emptyLink', {
  filter: (node) => node.nodeName === 'A' && !node.textContent.trim() && !node.querySelector('img'),
  replacement: () => '',
});
// Einbettungen werden vorher durch Platzhalter ersetzt und danach als URL allein in einer Zeile eingesetzt.
// Die Seite macht daraus beim Bauen wieder einen Player (src/lib/embeds.mjs).
let embeds = [];
const EMBED = (i) => `EMBEDTOKEN${i}X`;

function youtubeUrl(src) {
  const m = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})(?:\?(.*))?/);
  if (!m) return null;
  const t = new URLSearchParams(m[2] || '').get('start');
  return `https://www.youtube.com/watch?v=${m[1]}${t ? `&t=${t}` : ''}`;
}

function preprocess(html) {
  embeds = [];
  const token = (url) => `<p>${EMBED(embeds.push(url) - 1)}</p>`;
  return html
    // Eingebettete eigene Seiten (WP-Embed): Zitatblock behalten, iframe weglassen
    .replace(/<iframe[^>]*class="wp-embedded-content"[^>]*>\s*<\/iframe>/g, '')
    .replace(/<iframe[^>]*\ssrc="([^"]+)"[^>]*>[\s\S]*?<\/iframe>/g, (m, src) => token(youtubeUrl(src) || src.replace(/&amp;/g, '&')))
    .replace(/<(audio|video)[^>]*>([\s\S]*?)<\/\1>/g, (m, tag, inner) => {
      const src = (m.match(/\ssrc="([^"]+)"/) || [])[1];
      return src ? token(src.split('?')[0]) : '';
    })
    // Bild in Link auf dasselbe Bild in groß: Link weglassen, Bild bleibt
    .replace(/<a[^>]+href="([^"]+\.(?:jpe?g|png|gif))"[^>]*>\s*(<img[^>]*>)\s*<\/a>/gi, (m, href, img) =>
      img.replace(/\ssrc="[^"]+"/, ` src="${href}"`))
    // Bild in Link auf eine WP-Anhangseite (gibt es auf der neuen Seite nicht): nur das Bild behalten
    .replace(/<a[^>]+href=["']https?:\/\/(?:www\.)?creative-technologies\.de\/(?!wp-content\/)[^"']*["'][^>]*>\s*(<img[^>]*>)\s*<\/a>/gi, (m, img) => {
      const href = m.match(/href=["']([^"']+)["']/)[1];
      return newPathOf.has(wpPath(href)) ? m : img;
    })
    .replace(/\s(?:srcset|sizes)="[^"]*"/g, '')
    // Alte Shortcodes, die als Text stehen geblieben sind
    .replace(/\[icon [^\]]*\]/g, '')
    // SiteOrigin-Widget-Titel sind normale Zwischenüberschriften
    .replace(/<h3 class="widget-title">/g, '<h3>');
}

async function toMarkdown(html) {
  let md = td.turndown(await rewriteUrls(preprocess(html)));
  // Platzhalter nach dem Umschreiben der URLs ersetzen; eingebettete Uploads ebenfalls auf /uploads/ umbiegen
  for (let i = 0; i < embeds.length; i++) {
    let url = embeds[i];
    if (url.includes('/wp-content/uploads/')) url = await uploadPath(url);
    md = md.replace(EMBED(i), url);
  }
  return md.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+$/gm, '').trim() + '\n';
}

const yamlStr = (s) => JSON.stringify(s);
const yamlItem = (x) => typeof x === 'object'
  ? '  - ' + Object.entries(x).map(([k, v]) => `${k}: ${yamlStr(v)}`).join('\n    ')
  : `  - ${yamlStr(x)}`;
const frontmatter = (obj) => '---\n' + Object.entries(obj)
  .filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0))
  .map(([k, v]) => Array.isArray(v) ? `${k}:\n${v.map(yamlItem).join('\n')}` : `${k}: ${typeof v === 'string' ? yamlStr(v) : v}`)
  .join('\n') + '\n---\n\n';

// Links für die Infobox aus dem Beitrag: eigene Code-Repositorys und hochgeladene PDFs.
// Fremde Bibliotheken, auf die nur verwiesen wird, gehören nicht dazu.
const FOREIGN_REPOS = /^(github\.com\/(NVlabs|jordipons|beagleboard|bondagit|felixpalmer|borgestrand)\/)/i;
function linksFromBody(md) {
  const links = [];
  const repos = [...new Set([...md.matchAll(/https?:\/\/(github\.com|gitlab\.[a-z.-]+)\/([\w.-]+)\/([\w.-]+)/g)]
    .map((m) => `${m[1]}/${m[2]}/${m[3].replace(/\.git$/, '')}`))].filter((r) => !FOREIGN_REPOS.test(r));
  for (const r of repos.slice(0, 4)) {
    const [host, , repo] = r.split('/');
    links.push({ label: `Code: ${repo}${host.startsWith('gitlab') ? ' (GitLab)' : ''}`, url: `https://${r}` });
  }
  const pdfs = [...new Set([...md.matchAll(/\]\((\/uploads\/[^)\s]+\.pdf)\)/gi)].map((m) => m[1]))];
  for (const pdf of pdfs.slice(0, 3)) {
    const name = decodeURI(pdf.split('/').pop());
    const kind = /present|defen[cs]e|vortrag/i.test(name) ? 'Präsentation' : /thesis|bachelor|master|bericht|report|projekt/i.test(name) ? 'Bericht' : 'Dokument';
    links.push({ label: `${kind} (PDF)`, url: pdf });
  }
  return links;
}
const decodeEntities = (s) => s.replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&#038;|&amp;/g, '&')
  .replace(/&#8220;|&#8221;/g, '"').replace(/&#8216;|&#8217;/g, '’').replace(/&#8230;/g, '…').replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(Number(n)));
const stripTags = (s) => decodeEntities(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

// Umleitung nötig, wenn die alte Adresse nicht der neuen entspricht
const legacyFor = (page, newPath) => { const old = wpPath(page.link); return old === newPath ? [] : [old]; };

// ---------- Demos ----------

// Die Demos stehen am Anfang des Seiteninhalts der gerenderten Live-Seite, vor dem eigentlichen Text.
const DEMOS = {
  'ki-for-space-game': { scripts: ['jquery.min.js', 'jquery-ui.min.js', 'Entities.js', 'Movement.js', 'Sensor.js', 'ArtificialIntelligence.js'] },
  'flock': { scripts: ['processing.min.js'] },
  'ants': { scripts: ['processing.min.js'] },
};
async function buildDemo(slug) {
  const live = await readFile(path.join(RAW, 'demos', `${slug}.html`), 'utf8');
  const start = live.indexOf('<div class="entry-content">') + '<div class="entry-content">'.length;
  const body = live.slice(start);
  // Ende des Demos: der letzte </script>, auf den noch ein </div> folgt, bevor normaler Text beginnt
  const lastScript = body.lastIndexOf('</script>', body.indexOf('<!-- .entry-content -->'));
  const demoEnd = body.indexOf('</div>', lastScript) + '</div>'.length;
  // Bilder der Sketches liegen neben der Demo unter images/ statt im alten Plugin-Ordner
  const PLUGIN_IMAGES = /https?:\/\/(?:www\.)?creative-technologies\.de\/wp-content\/plugins\/ctag-processing\/public[\\/]images[\\/]/g;
  const demo = body.slice(0, demoEnd).trim().replace(PLUGIN_IMAGES, 'images/');
  const images = [...new Set([...demo.matchAll(/CTAG_PATH\s*\+\s*"([^"]+)"/g)].map((m) => m[1]))];
  const dir = path.join(PUBLIC, 'demos', slug);
  await mkdir(dir, { recursive: true });
  for (const s of DEMOS[slug].scripts) await copyFile(path.join(RAW, 'demos', s), path.join(dir, s));
  if (images.length) await mkdir(path.join(dir, 'images'), { recursive: true });
  for (const img of images) await copyFile(path.join(RAW, 'demos', 'images', img), path.join(dir, 'images', img));
  if (/creative-technologies\.de/.test(demo)) console.warn(`  ! Demo ${slug} verweist noch auf die alte Domain`);
  await write(path.join(dir, 'index.html'), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${slug} – Demo</title>
<style>html,body{margin:0;background:#000;color:#fff;font-family:sans-serif}canvas{display:block;max-width:100%;height:auto}</style>
${DEMOS[slug].scripts.map((s) => `<script src="${s}"></script>`).join('\n')}
</head>
<body>
${demo}
</body>
</html>
`);
  // Breite/Höhe für das iframe auf der Projektseite
  const size = demo.match(/<canvas[^>]*width="(\d+)"[^>]*height="(\d+)"/);
  return { path: `/demos/${slug}/`, width: size ? Number(size[1]) : 800, height: size ? Number(size[2]) : 500, demoLength: demo.length };
}

// ---------- Ausgabe ----------

for (const d of ['projects', 'pages', 'partners', 'settings']) await rm(path.join(OUT, d), { recursive: true, force: true });
await rm(path.join(PUBLIC, 'uploads'), { recursive: true, force: true });
await rm(path.join(PUBLIC, 'demos'), { recursive: true, force: true });

const redirects = [];
for (const p of projects) {
  const meta = projectMeta[p.slug] ?? {};
  const body = await toMarkdown(p.page.content.rendered);
  const fm = {
    title: p.title,
    summary: meta.summary,
    semester: meta.semester,
    year: Number(p.page.date.slice(0, 4)),
    team: meta.team ?? [],
    supervisor: meta.supervisor,
    tags: meta.tags ?? [],
    cover: meta.cover,
    links: meta.links ?? linksFromBody(body),
    order: p.order,
    legacyPaths: legacyFor(p.page, `/projects/${p.slug}/`),
  };
  if (DEMOS[p.page.slug]) {
    const demo = await buildDemo(p.page.slug);
    fm.demo = demo.path;
    console.log(`  Demo ${demo.path} (${demo.width}×${demo.height}, ${demo.demoLength} Zeichen)`);
  }
  await write(path.join(OUT, 'projects', `${p.slug}.md`), frontmatter(fm) + body);
}
console.log(`${projects.length} Projekte`);
const unknownMeta = Object.keys(projectMeta).filter((k) => !k.startsWith('_') && !projects.some((p) => p.slug === k));
if (unknownMeta.length) console.warn('  ! project-meta.json: unbekannte Projekte ' + unknownMeta.join(', '));

for (const [np, id] of Object.entries(KEEP_PAGES)) {
  const page = byId.get(id);
  await write(path.join(OUT, 'pages', `${np}.md`),
    frontmatter({ title: decodeEntities(page.title.rendered), legacyPaths: legacyFor(page, `/${np}/`) }) + await toMarkdown(page.content.rendered));
}
console.log(`${Object.keys(KEEP_PAGES).length} Seiten`);

// Weggefallene Seiten: Umleitungen hängen an der Zielseite
for (const [id, target] of Object.entries(DROPPED)) redirects.push([wpPath(byId.get(Number(id)).link), target]);
const makerspace = path.join(OUT, 'pages', 'makerspace.md');
const ms = await readFile(makerspace, 'utf8');
await writeFile(makerspace, ms.replace('---\n', `---\nlegacyPaths:\n${redirects.filter(([, t]) => t === '/makerspace/').map(([o]) => `  - ${yamlStr(o)}`).join('\n')}\n`));

// Beschriftung unter dem Namen, wo die Domain allein nichts sagt (aus dem Design übernommen)
const PARTNER_LABELS = { 'Google Summer of Code 2016': 'elinux.org · GSoC 2016', 'Hafenmusik – DJ & Producer School': 'facebook.com/HAFENMUSIK' };
for (const [i, p] of partnerList.entries()) {
  const logo = p.logo ? await uploadPath(p.logo) : undefined;
  await write(path.join(OUT, 'partners', `${asciiSlug(p.name)}.json`),
    JSON.stringify({ name: p.name, url: p.url, label: PARTNER_LABELS[p.name], logo, order: i + 1 }, null, 2) + '\n');
}
console.log(`${partnerList.length} Partner`);

// Startseite: Absätze der WP-Startseite in der festen Reihenfolge des Designs
const homeParas = [...byId.get(1307).content.rendered.matchAll(/<(p|h2)>([\s\S]*?)<\/\1>/g)].map((m) => stripTags(m[2]));
if (homeParas.length !== 7) throw new Error(`Startseite: 7 Absätze erwartet, ${homeParas.length} gefunden`);
await write(path.join(OUT, 'settings', 'home.json'), JSON.stringify({
  introEn: homeParas[0],
  introDe: homeParas[1],
  // Kartentitel stammen aus dem Design, nicht aus dem Original
  cards: [
    { title: 'Im Fokus', text: homeParas[2] },
    { title: 'Mitmachen', text: homeParas[3] },
    { title: 'Klanglabor', text: homeParas[4] },
  ],
  highlight: homeParas[5],
  motto: homeParas[6].replace(/^Unser Motto:\s*/, ''),
}, null, 2) + '\n');

const projectsHtml = byId.get(29).content.rendered;
const opp = [...projectsHtml.split(/<h3>Opportunities:<\/h3>/)[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => stripTags(m[1]));
await write(path.join(OUT, 'settings', 'projects.json'), JSON.stringify({
  opportunitiesTitle: 'Opportunities:',
  opportunities: opp.slice(0, -1),
  opportunitiesCta: opp.at(-1),
}, null, 2) + '\n');

// Logo und Header-Fotos der alten Seite mitnehmen, auch wenn das Design sie (noch) nicht zeigt
for (const f of ['2017/06/ctag-logo-horizontal1.png', '2013/12/header1.jpg', '2013/12/header2.jpg', '2016/02/CloseUp1_lr.jpg', '2016/02/face24-1.jpg'])
  usedUploads.add(f);
// Fotos auf höchstens MAX_WIDTH px verkleinern, damit das Repository klein bleibt. GIFs (oft animiert) bleiben unverändert.
const MAX_WIDTH = 2000;
let shrunk = 0;
for (const rel of usedUploads) {
  const src = path.join(RAW, 'uploads', rel);
  const dest = path.join(PUBLIC, 'uploads', rel);
  await mkdir(path.dirname(dest), { recursive: true });
  if (/\.(jpe?g|png)$/i.test(rel)) {
    const img = sharp(src, { failOn: 'none' });
    const { width } = await img.metadata();
    if (width > MAX_WIDTH) {
      const resized = img.rotate().resize({ width: MAX_WIDTH });
      await (/\.png$/i.test(rel) ? resized.png({ compressionLevel: 9 }) : resized.jpeg({ quality: 82, mozjpeg: true })).toFile(dest);
      shrunk++;
      continue;
    }
  }
  await copyFile(src, dest);
}
console.log(`${usedUploads.size} Dateien nach public/uploads/, davon ${shrunk} verkleinert`);

// Liste für ?p=<id> auf der Startseite
await write(path.join(OUT, '..', 'lib', 'legacy-ids.json'), JSON.stringify(byQueryId, null, 2) + '\n');
console.log('Fertig.');
