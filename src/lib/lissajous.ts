// Lissajous-Figur: x = sin(a·t + Phase), y = sin(b·t). Die Potis stellen a und b ein (stufenlos 1–6;
// ganzzahlige Verhältnisse ergeben stehende Figuren, krumme Werte driftende). Die Phase dreht sich langsam und mit dem Scrollen.
import { onScrollMotion, reducedMotion } from './scroll-motion';
import { onDrag, onKeyTurn } from './drag';

const R = 88;
const POINTS = 600;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

for (const root of document.querySelectorAll<HTMLElement>('[data-lissajous]')) {
  const trace = root.querySelector<SVGPathElement>('.liss-trace')!;
  const glow = root.querySelector<SVGPathElement>('.liss-glow')!;
  const ratio = root.querySelector<HTMLOutputElement>('.liss-ratio-value')!;
  const freq = { X: 3, Y: 2 };
  let phase = Math.PI / 4;

  const knobs = [...root.querySelectorAll<SVGSVGElement>('.liss-knob')].map((el) => ({
    el,
    axis: el.dataset.axis as 'X' | 'Y',
    mark: el.querySelector<SVGLineElement>('.liss-knob-mark')!,
    value: root.querySelector<HTMLOutputElement>(`.liss-value[data-axis="${el.dataset.axis}"]`)!,
  }));

  // Nahe an ganzen Zahlen einrasten, damit stehende Figuren leicht zu treffen sind
  const shown = (v: number) => (Math.abs(v - Math.round(v)) < 0.12 ? Math.round(v) : v);
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

  function render() {
    const a = shown(freq.X), b = shown(freq.Y);
    let d = '';
    // Bei ganzzahligen Frequenzen schließt sich die Figur nach 2π; sonst einige Umläufe zeichnen
    const span = Number.isInteger(a) && Number.isInteger(b) ? 2 * Math.PI : 6 * Math.PI;
    for (let i = 0; i <= POINTS; i++) {
      const t = (i / POINTS) * span;
      const x = R * Math.sin(a * t + phase);
      const y = -R * Math.sin(b * t);
      d += `${i ? ' L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    trace.setAttribute('d', d);
    glow.setAttribute('d', d);
    for (const k of knobs) {
      const v = freq[k.axis];
      k.mark.style.transform = `rotate(${(-135 + ((v - 1) / 5) * 270).toFixed(1)}deg)`;
      k.el.setAttribute('aria-valuenow', shown(v).toFixed(1));
      k.value.textContent = Number.isInteger(shown(v)) ? String(shown(v)) : v.toFixed(2);
    }
    if (Number.isInteger(a) && Number.isInteger(b)) {
      const g = gcd(a, b);
      ratio.textContent = `${a / g} : ${b / g}`;
    } else ratio.textContent = '≈ ' + (a / b).toFixed(2);
  }

  for (const k of knobs) {
    onDrag(k.el, (_dx, dy) => { freq[k.axis] = clamp(freq[k.axis] - dy / 60, 1, 6); render(); });
    onKeyTurn(k.el, (s) => { freq[k.axis] = clamp(Math.round(freq[k.axis]) + s, 1, 6); render(); });
  }

  render();
  if (!reducedMotion) {
    // Phase = langsame Eigenbewegung (die Kontaktseite ist kurz, es gibt wenig zu scrollen) + Scrollposition
    let drift = 0, scroll = 0, visible = false;
    const tick = () => {
      if (!visible) return;
      drift += 0.006;
      phase = Math.PI / 4 + drift + scroll * 0.008;
      render();
      requestAnimationFrame(tick);
    };
    new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) requestAnimationFrame(tick); }).observe(root);
    onScrollMotion(root, (pos) => { scroll = pos; });
  }
}
