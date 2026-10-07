#!/usr/bin/env node
// Holt alle Inhalte von creative-technologies.de über die öffentliche WordPress-REST-API
// (kein Login nötig) und lädt alle Mediendateien herunter.
// Aufruf:  node scripts/scrape.mjs        (Node 18+, keine Abhängigkeiten)
// Ergebnis: content/raw/{pages,posts,media}.json, content/raw/html/<slug>.html, content/raw/uploads/...
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://www.creative-technologies.de';
const API = SITE + '/wp-json/wp/v2';
const OUT = path.resolve('content/raw');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Eine Seite (Space Game, id 128) gibt beim Rendern HTML/JS direkt aus. Das steht dann vor dem JSON.
// Den Vorspann abtrennen und aufheben: Das Spiel-Demo existiert nur dort, nicht in content.rendered.
async function parseLeaky(text, tag) {
  try { return JSON.parse(text); } catch {}
  for (let i = text.indexOf('['); i >= 0; i = text.indexOf('[', i + 1)) {
    let data;
    try { data = JSON.parse(text.slice(i)); } catch { continue; }
    await writeFile(path.join(OUT, `leak-${tag}.html`), text.slice(0, i));
    console.warn(`! ${tag}: ${i} Byte Ausgabe vor dem JSON, gesichert in leak-${tag}.html`);
    return data;
  }
  throw new Error(`${tag}: Antwort ist kein JSON`);
}

async function fetchAll(type) {
  const out = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`${API}/${type}?per_page=100&page=${page}`);
    if (!res.ok) { if (page === 1) console.warn(`! ${type}: HTTP ${res.status}`); break; }
    out.push(...(await parseLeaky(await res.text(), `${type}-p${page}`)));
    const total = Number(res.headers.get('x-wp-totalpages') || 1);
    console.log(`${type}: Seite ${page}/${total}, ${out.length} Einträge`);
    if (page >= total) break;
    await sleep(300);
  }
  return out;
}

async function download(url) {
  let u;
  try { u = new URL(url, SITE); } catch { return; }
  if (!u.pathname.includes('/wp-content/uploads/')) return;
  const rel = decodeURIComponent(u.pathname.split('/wp-content/uploads/')[1]);
  const file = path.join(OUT, 'uploads', rel);
  try { await access(file); return; } catch {}
  const res = await fetch(u);
  if (!res.ok) { console.warn(`! ${res.status} ${u.href}`); return; }
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  console.log('  ↓ ' + rel);
  await sleep(150);
}

await mkdir(path.join(OUT, 'html'), { recursive: true });
const urls = new Set();
for (const type of ['pages', 'posts', 'media']) {
  const items = await fetchAll(type);
  await writeFile(path.join(OUT, type + '.json'), JSON.stringify(items, null, 2));
  for (const it of items) {
    if (type === 'media') { if (it.source_url) urls.add(it.source_url); continue; }
    const html = it.content?.rendered ?? '';
    const slug = decodeURIComponent(it.slug || String(it.id)).normalize('NFC');
    await writeFile(path.join(OUT, 'html', `${type}-${slug}.html`),
      `<!-- id ${it.id} | ${it.link} | parent ${it.parent ?? 0} | modified ${it.modified} -->\n<h1>${it.title?.rendered ?? ''}</h1>\n${html}`);
    // Bilder und verlinkte Dateien (PDF, ZIP, Audio …) aus dem Inhalt einsammeln
    for (const m of html.matchAll(/(?:src|href)="([^"]*\/wp-content\/uploads\/[^"]+)"/g)) urls.add(m[1]);
    for (const m of html.matchAll(/srcset="([^"]+)"/g))
      for (const part of m[1].split(',')) urls.add(part.trim().split(/\s+/)[0]);
  }
}
// Logo und Header-Bilder der Startseite (liegen im Theme/Slider, nicht im Seiteninhalt)
for (const f of ['2017/06/ctag-logo-horizontal1.png', '2013/12/header2.jpg', '2016/02/CloseUp1_lr.jpg', '2013/12/header1.jpg', '2016/02/face24-1.jpg'])
  urls.add(`${SITE}/wp-content/uploads/${f}`);
// Interaktive Demos: Das CTAG-Plugin „ctag-processing“ gibt sie beim Rendern direkt aus, sie fehlen in content.rendered.
// Darum die fertig gerenderten Seiten und die Skripte des Plugins sichern.
await mkdir(path.join(OUT, 'demos'), { recursive: true });
const pluginJs = new Set();
const pluginImages = new Set();
for (const slug of ['ki-for-space-game', 'flock', 'ants']) {
  const res = await fetch(`${SITE}/${slug}/`);
  if (!res.ok) { console.warn(`! ${res.status} Demo-Seite ${slug}`); continue; }
  const html = await res.text();
  await writeFile(path.join(OUT, 'demos', `${slug}.html`), html);
  for (const m of html.matchAll(/src=['"]([^'"]*\/plugins\/ctag-processing\/[^'"?]+)/g)) pluginJs.add(m[1]);
  // Bilder, die die Processing-Sketches zur Laufzeit laden: loadImage(CTAG_PATH+"Bee up.png")
  for (const m of html.matchAll(/CTAG_PATH\s*\+\s*"([^"]+)"/g)) pluginImages.add(m[1]);
  console.log(`Demo-Seite ${slug} gesichert`);
}
// Sensor.js wird nur im auskommentierten Code geladen, liegt aber im Plugin
pluginJs.add(`${SITE}/wp-content/plugins/ctag-processing/public/js/Sensor.js`);
pluginJs.add(`${SITE}/wp-includes/js/jquery/jquery.min.js`);
await mkdir(path.join(OUT, 'demos', 'images'), { recursive: true });
for (const name of pluginImages) {
  const res = await fetch(`${SITE}/wp-content/plugins/ctag-processing/public/images/${encodeURIComponent(name)}`);
  if (!res.ok) { console.warn(`! ${res.status} Demo-Bild ${name}`); continue; }
  await writeFile(path.join(OUT, 'demos', 'images', name), Buffer.from(await res.arrayBuffer()));
  console.log('  ↓ images/' + name);
}
for (const u of pluginJs) {
  const res = await fetch(u);
  if (!res.ok) { console.warn(`! ${res.status} ${u}`); continue; }
  await writeFile(path.join(OUT, 'demos', path.basename(u)), Buffer.from(await res.arrayBuffer()));
  console.log('  ↓ ' + path.basename(u));
}

console.log(`\n${urls.size} Dateien werden geladen …`);
for (const u of urls) {
  try { await download(u); } catch (e) { console.warn(`! ${e.message} ${u}`); }
}
console.log('\nFertig. Rohdaten liegen in content/raw/.');
