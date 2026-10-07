// Die drei Wellen (Sinus, Sägezahn, Rechteck) laufen beim Scrollen unterschiedlich schnell und verändern ihre Form:
// Sinus → Frequenz schwankt, Sägezahn → wird zum Dreieck und zurück, Rechteck → Pulsbreite (PWM).
import { onScrollMotion, reducedMotion } from './scroll-motion';

const X0 = 10, X1 = 360;
const frac = (v: number) => v - Math.floor(v);

function path(f: (x: number) => number, step: number) {
  let d = '';
  for (let x = X0; x <= X1 + 0.01; x += step) d += `${d ? ' L' : 'M'}${x.toFixed(1)} ${f(x).toFixed(1)}`;
  return d;
}

if (!reducedMotion) {
  document.querySelectorAll<SVGSVGElement>('svg[data-waves]').forEach((svg, n) => {
    const sine = svg.querySelector<SVGPathElement>('.wave-sine')!;
    const saw = svg.querySelector<SVGPathElement>('.wave-saw')!;
    const square = svg.querySelector<SVGPathElement>('.wave-square')!;
    const seed = n * 1.3;   // mehrere Grafiken auf einer Seite laufen nicht im Gleichschritt

    onScrollMotion(svg, (pos) => {
      // Sinus: Periode um 100 (wie gezeichnet), Frequenz schwankt langsam
      const sinePeriod = 100 * (1 + 0.3 * Math.sin(pos * 0.004 + seed));
      const sinePhase = pos * 0.02;
      sine.setAttribute('d', path((x) => 40 - 25 * Math.sin(((x - X0) / sinePeriod) * 2 * Math.PI - sinePhase), 3));

      // Sägezahn ↔ Dreieck: "rise" = Anteil der Periode, in dem die Welle steigt (1 = Sägezahn, 0.5 = Dreieck)
      const rise = 0.75 + 0.25 * Math.cos(pos * 0.006 + seed);
      const sawPhase = pos * -0.011;
      saw.setAttribute('d', path((x) => {
        const t = frac((x - X0) / 50 + sawPhase);
        const v = t < rise ? t / rise : 1 - (t - rise) / (1 - rise);
        return 110 - 40 * v;
      }, 1));

      // Rechteck mit Pulsbreitenmodulation
      const duty = 0.5 + 0.3 * Math.sin(pos * 0.008 + seed);
      const sqPhase = pos * 0.016;
      square.setAttribute('d', path((x) => (frac((x - X0) / 50 + sqPhase) < duty ? 140 : 170), 1));
    });
  });
}
