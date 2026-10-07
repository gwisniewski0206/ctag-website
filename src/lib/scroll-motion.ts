// Gemeinsamer Antrieb für alle Scroll-Effekte.
// "pos" folgt der Scrollposition mit etwas Trägheit, damit Potis und Wellen nach dem Scrollen sanft auslaufen.
// Läuft nur, solange sich etwas bewegt; bei "Bewegung reduzieren" im Betriebssystem bleibt alles stehen.

type Listener = (pos: number, velocity: number) => void;

const listeners = new Set<Listener>();
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let pos = window.scrollY;
let last = pos;
let running = false;

function frame() {
  const target = window.scrollY;
  pos += (target - pos) * 0.12;
  const velocity = pos - last;
  last = pos;
  for (const fn of listeners) fn(pos, velocity);
  if (Math.abs(target - pos) > 0.05) requestAnimationFrame(frame);
  else running = false;
}

function kick() {
  if (running || reducedMotion) return;
  running = true;
  requestAnimationFrame(frame);
}

window.addEventListener('scroll', kick, { passive: true });

// Ruft fn bei jeder Bewegung auf, aber nur solange el sichtbar ist. Einmal sofort mit der aktuellen Position.
export function onScrollMotion(el: Element, fn: Listener) {
  let visible = false;
  const wrapped: Listener = (p, v) => { if (visible) fn(p, v); };
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(el);
  listeners.add(wrapped);
  fn(pos, 0);
}
