// Die gezeichnete Modularsynth auf der Startseite wird lebendig:
// - Patchkabel hängen physikalisch durch, schwingen und lassen sich umstecken (Stecker ziehen) oder in der Mitte anzupfen.
// - Beim Scrollen drehen sich die Potis, Fader fahren, das Oszilloskop läuft und der Sequencer schaltet weiter.
import { onScrollMotion, reducedMotion } from './scroll-motion';

const SVG_NS = 'http://www.w3.org/2000/svg';
const SEGMENTS = 18;
const GRAVITY = 0.45;
const DAMPING = 0.985;
const ITERATIONS = 14;

type Pt = { x: number; y: number; px: number; py: number };
type Jack = { x: number; y: number };
type Cable = {
  outline: SVGPathElement;
  core: SVGPathElement;
  plugs: [SVGCircleElement, SVGCircleElement];
  ends: [Jack, Jack];
  pts: Pt[];
  seg: number;
};

function svgPoint(svg: SVGSVGElement, e: PointerEvent) {
  const m = svg.getScreenCTM()!.inverse();
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m);
  return { x: p.x, y: p.y };
}

// Glatte Kurve durch die Seilpunkte (Mittelpunkte als Stützstellen)
function ropePath(pts: Pt[]) {
  let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    d += ` Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l.x.toFixed(1)} ${l.y.toFixed(1)}`;
}

function initCables(svg: SVGSVGElement) {
  const jacks: Jack[] = [...svg.querySelectorAll<SVGUseElement>('.jack')].map((u) => ({
    x: Number(u.getAttribute('x')), y: Number(u.getAttribute('y')),
  }));
  const nearestJack = (x: number, y: number) =>
    jacks.reduce((best, j) => (Math.hypot(j.x - x, j.y - y) < Math.hypot(best.x - x, best.y - y) ? j : best));

  const cables: Cable[] = [...svg.querySelectorAll<SVGGElement>('.cable')].map((g) => {
    const outline = g.querySelector<SVGPathElement>('.cable-outline')!;
    const core = g.querySelector<SVGPathElement>('.cable-core')!;
    // Länge und Startform aus der gezeichneten Kurve übernehmen, damit es anfangs genau wie im Entwurf aussieht
    const length = outline.getTotalLength();
    const pts: Pt[] = [];
    for (let i = 0; i <= SEGMENTS; i++) {
      const p = outline.getPointAtLength((length * i) / SEGMENTS);
      pts.push({ x: p.x, y: p.y, px: p.x, py: p.y });
    }
    const ends: [Jack, Jack] = [nearestJack(pts[0].x, pts[0].y), nearestJack(pts[SEGMENTS].x, pts[SEGMENTS].y)];
    const plugs = ends.map(() => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('r', '10');
      c.setAttribute('fill', g.dataset.color!);
      c.setAttribute('stroke', '#00305D');
      c.setAttribute('stroke-width', '4');
      c.classList.add('plug');
      g.appendChild(c);
      return c;
    }) as [SVGCircleElement, SVGCircleElement];
    return { outline, core, plugs, ends, pts, seg: length / SEGMENTS };
  });

  const occupied = (j: Jack, except?: { cable: Cable; end: number }) =>
    cables.some((c) => c.ends.some((e, i) => e === j && !(except && except.cable === c && except.end === i)));

  // Ziehen: entweder ein Stecker (Ende) oder ein Punkt in der Mitte des Kabels
  let drag: { cable: Cable; index: number; x: number; y: number; pointer: number } | null = null;

  function step() {
    for (const c of cables) {
      const n = c.pts.length - 1;
      for (let i = 1; i < n; i++) {
        const p = c.pts[i];
        if (drag && drag.cable === c && drag.index === i) continue;
        const vx = (p.x - p.px) * DAMPING;
        const vy = (p.y - p.py) * DAMPING;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + GRAVITY;
      }
      // Enden sitzen in der Buchse oder hängen am Finger
      const pin = (i: number, x: number, y: number) => { const p = c.pts[i]; p.x = p.px = x; p.y = p.py = y; };
      pin(0, c.ends[0].x, c.ends[0].y);
      pin(n, c.ends[1].x, c.ends[1].y);
      if (drag && drag.cable === c) pin(drag.index, drag.x, drag.y);
      for (let k = 0; k < ITERATIONS; k++) {
        for (let i = 0; i < n; i++) {
          const a = c.pts[i], b = c.pts[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.hypot(dx, dy) || 0.001;
          const diff = (dist - c.seg) / dist / 2;
          const aFixed = i === 0 || (drag?.cable === c && drag.index === i);
          const bFixed = i + 1 === n || (drag?.cable === c && drag.index === i + 1);
          if (!aFixed) { a.x += dx * diff * (bFixed ? 2 : 1); a.y += dy * diff * (bFixed ? 2 : 1); }
          if (!bFixed) { b.x -= dx * diff * (aFixed ? 2 : 1); b.y -= dy * diff * (aFixed ? 2 : 1); }
        }
      }
    }
  }

  function draw() {
    for (const c of cables) {
      const d = ropePath(c.pts);
      c.outline.setAttribute('d', d);
      c.core.setAttribute('d', d);
      const n = c.pts.length - 1;
      [0, n].forEach((i, k) => { c.plugs[k].setAttribute('cx', c.pts[i].x.toFixed(1)); c.plugs[k].setAttribute('cy', c.pts[i].y.toFixed(1)); });
    }
  }

  // Simulation nur, solange sich etwas bewegt
  let running = false;
  let calm = 0;
  function loop() {
    step(); draw();
    const energy = cables.reduce((s, c) => s + c.pts.reduce((t, p) => t + Math.abs(p.x - p.px) + Math.abs(p.y - p.py), 0), 0);
    calm = energy < 0.05 && !drag ? calm + 1 : 0;
    if (calm > 30) { running = false; return; }
    requestAnimationFrame(loop);
  }
  function wake() { calm = 0; if (!running) { running = true; requestAnimationFrame(loop); } }

  // Anfangs vom gezeichneten Bogen in die echte Durchhängung fallen lassen
  wake();

  svg.addEventListener('pointerdown', (e) => {
    const p = svgPoint(svg, e);
    const target = e.target as Element;
    let hit: { cable: Cable; index: number } | null = null;
    // Stecker in der Nähe? (großzügiger Radius für Finger)
    let best = target.classList.contains('plug') ? 30 : 20;
    for (const c of cables) {
      [0, c.pts.length - 1].forEach((i) => {
        const dd = Math.hypot(c.pts[i].x - p.x, c.pts[i].y - p.y);
        if (dd < best) { best = dd; hit = { cable: c, index: i }; }
      });
    }
    // Sonst: Kabel in der Mitte greifen
    if (!hit && target.closest('.cable')) {
      const c = cables.find((cc) => cc.outline.parentElement === target.closest('.cable'))!;
      let bi = 1, bd = Infinity;
      c.pts.forEach((q, i) => { const dd = Math.hypot(q.x - p.x, q.y - p.y); if (i > 0 && i < c.pts.length - 1 && dd < bd) { bd = dd; bi = i; } });
      hit = { cable: c, index: bi };
    }
    if (!hit) return;
    e.preventDefault();
    svg.setPointerCapture(e.pointerId);
    drag = { ...(hit as { cable: Cable; index: number }), x: p.x, y: p.y, pointer: e.pointerId };
    if (drag.index === 0 || drag.index === drag.cable.pts.length - 1) {
      // Stecker gezogen: Ende folgt dem Finger
      const end = drag.index === 0 ? 0 : 1;
      drag.cable.ends[end] = { x: p.x, y: p.y };
    }
    svg.classList.add('dragging');
    wake();
  });

  // Auf Touch-Geräten: Ziehen an Kabel/Stecker soll nicht die Seite scrollen, sonst schon
  svg.addEventListener('touchstart', (e) => {
    if ((e.target as Element).closest('.cable')) e.preventDefault();
  }, { passive: false });

  svg.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.pointer) return;
    const p = svgPoint(svg, e);
    drag.x = p.x; drag.y = p.y;
    const n = drag.cable.pts.length - 1;
    if (drag.index === 0 || drag.index === n) drag.cable.ends[drag.index === 0 ? 0 : 1] = { x: p.x, y: p.y };
    wake();
  });

  const release = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.pointer) return;
    const { cable, index } = drag;
    const n = cable.pts.length - 1;
    if (index === 0 || index === n) {
      const end = index === 0 ? 0 : 1;
      // In die nächste freie Buchse stecken
      const free = jacks.filter((j) => !occupied(j, { cable, end }) && j !== cable.ends[1 - end]);
      const target = free.reduce((b, j) => (Math.hypot(j.x - drag!.x, j.y - drag!.y) < Math.hypot(b.x - drag!.x, b.y - drag!.y) ? j : b));
      cable.ends[end] = target;
    }
    drag = null;
    svg.classList.remove('dragging');
    wake();
  };
  svg.addEventListener('pointerup', release);
  svg.addEventListener('pointercancel', release);

  // Beim Scrollen wippen die Kabel ein wenig mit
  if (!reducedMotion) {
    onScrollMotion(svg, (_pos, v) => {
      if (Math.abs(v) < 0.2) return;
      for (const c of cables) {
        const n = c.pts.length - 1;
        c.pts.forEach((p, i) => { if (i > 0 && i < n) p.py += v * 0.06 * Math.sin((i / n) * Math.PI); });
      }
      wake();
    });
  }
}

function initScrollParts(svg: SVGSVGElement) {
  const knobs = [...svg.querySelectorAll<SVGUseElement>('.knob')].map((el, i) => ({
    el, x: el.dataset.x, y: el.dataset.y, s: Number(el.dataset.s), r: Number(el.dataset.r),
    speed: [0.35, -0.5, 0.22, 0.6, -0.3, -0.42][i % 6],
  }));
  const faders = [...svg.querySelectorAll<SVGRectElement>('.fader')].map((el, i) => ({
    el, y0: Number(el.getAttribute('y')), freq: [0.011, 0.007, 0.016][i % 3], phase: i * 1.7,
  }));
  const leds = [...svg.querySelectorAll<SVGCircleElement>('.led')];
  const steps = [...svg.querySelectorAll<SVGRectElement>('.step')];
  const scope = svg.querySelector<SVGPathElement>('.scope')!;
  // Fader-Schiene: y 58–178, Kappe 16 hoch
  const TOP = 60, BOTTOM = 160;

  onScrollMotion(svg, (pos) => {
    for (const k of knobs) {
      const scale = k.s !== 1 ? ` scale(${k.s})` : '';
      k.el.setAttribute('transform', `translate(${k.x} ${k.y})${scale} rotate(${(k.r + pos * k.speed).toFixed(1)})`);
    }
    faders.forEach((f, i) => {
      const mid = (TOP + BOTTOM) / 2, amp = (BOTTOM - TOP) / 2;
      const start = Math.asin(Math.max(-1, Math.min(1, (f.y0 - mid) / amp)));
      const y = mid + amp * Math.sin(start + pos * f.freq);
      f.el.setAttribute('y', y.toFixed(1));
      // LED darunter leuchtet mit der Fader-Höhe
      leds[i]?.setAttribute('opacity', (0.35 + 0.65 * (1 - (y - TOP) / (BOTTOM - TOP))).toFixed(2));
    });
    // Oszilloskop: Sinus im Fenster x 190–278, läuft und ändert die Frequenz leicht
    const freq = 2 * Math.PI / (44 + 10 * Math.sin(pos * 0.004));
    let d = '';
    for (let x = 190; x <= 278; x += 2) {
      const y = 85 - 15 * Math.sin((x - 190) * freq + pos * 0.05);
      d += `${d ? ' L' : 'M'}${x} ${y.toFixed(1)}`;
    }
    scope.setAttribute('d', d);
    // Sequencer: das Lauflicht wandert über die vier Spalten
    const col = Math.floor(pos / 45) % 4;
    steps.forEach((s, i) => {
      const on = i % 4 === col;
      s.setAttribute('stroke', on ? '#FFFFFF' : 'none');
      s.setAttribute('stroke-width', on ? '4' : '0');
    });
  });
}

for (const svg of document.querySelectorAll<SVGSVGElement>('svg[data-synth]')) {
  initCables(svg);
  if (!reducedMotion) initScrollParts(svg);
}
