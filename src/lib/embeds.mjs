// Ein Link allein in einer Zeile wird eingebettet:
//   YouTube, Google Docs  → Platzhalter; der Inhalt lädt erst nach einem Klick (keine Daten an Google ohne Zustimmung)
//   .wav .mp3 .ogg        → Audioplayer
//   .mp4 .mov .webm       → Videoplayer
// So können Redakteure im CMS einfach die Adresse in eine eigene Zeile einfügen.
import { defineMdastPlugin } from 'satteri';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function youtubeId(url) {
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  return m && m[1];
}

function consent(src, label, host, link) {
  return `<div class="embed embed-consent" data-src="${esc(src)}">
<button type="button" class="embed-load">${label}</button>
<p>Beim Laden werden Daten an ${host} übertragen. <a href="${esc(link)}">Direkt bei ${host} öffnen</a></p>
</div>`;
}

export function embedHtml(url) {
  const id = youtubeId(url);
  if (id) {
    const t = new URL(url.replace(/^\/\//, 'https://'), 'https://x').searchParams.get('t');
    return consent(`https://www.youtube-nocookie.com/embed/${id}?autoplay=1${t ? `&start=${parseInt(t, 10)}` : ''}`,
      'Video laden', 'YouTube', url);
  }
  if (/^https?:\/\/docs\.google\.com\//.test(url)) return consent(url.replace(/^http:/, 'https:'), 'Dokument laden', 'Google', url);
  const ext = (url.split('?')[0].match(/\.([a-z0-9]+)$/i) || [])[1]?.toLowerCase();
  if (['wav', 'mp3', 'ogg', 'm4a'].includes(ext)) return `<audio class="embed" controls preload="none" src="${esc(url)}"></audio>`;
  if (['mp4', 'mov', 'webm'].includes(ext)) return `<video class="embed" controls preload="metadata" src="${esc(url)}"></video>`;
  return null;
}

// Plugin für Sätteri, den Markdown-Prozessor von Astro
export const embedsPlugin = defineMdastPlugin({
  name: 'ctag-embeds',
  paragraph(node, ctx) {
    const kids = node.children;
    if (kids.length !== 1) return;
    const only = kids[0];
    let url = null;
    if (only.type === 'link' && only.children.length === 1 && only.children[0].value === only.url) url = only.url;
    else if (only.type === 'text' && /^(https?:\/\/|\/uploads\/)\S+$/.test(only.value.trim())) url = only.value.trim();
    const html = url && embedHtml(url);
    if (html) ctx.replaceNode(node, { type: 'html', value: html });
  },
});
