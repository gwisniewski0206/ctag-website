// Gemeinsames Ziehen für Potis und Fader (Maus, Stift, Finger).
// Potis: senkrecht ziehen wie in Musikprogrammen – hoch = rechts drehen. Fader: Position folgt dem Zeiger.

type Move = (dx: number, dy: number, e: PointerEvent) => void;

// Ruft onMove mit der Bewegung seit dem letzten Ereignis auf (in Bildschirmpixeln).
export function onDrag(el: Element, onMove: Move, onStart?: (e: PointerEvent) => void) {
  let last: { x: number; y: number; id: number } | null = null;
  el.addEventListener('pointerdown', (ev) => {
    const e = ev as PointerEvent;
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    (el as HTMLElement).setPointerCapture?.(e.pointerId);
    last = { x: e.clientX, y: e.clientY, id: e.pointerId };
    document.documentElement.classList.add('is-dragging');
    onStart?.(e);
  });
  el.addEventListener('pointermove', (ev) => {
    const e = ev as PointerEvent;
    if (!last || e.pointerId !== last.id) return;
    onMove(e.clientX - last.x, e.clientY - last.y, e);
    last = { x: e.clientX, y: e.clientY, id: e.pointerId };
  });
  const end = (ev: Event) => {
    if (last && (ev as PointerEvent).pointerId === last.id) {
      last = null;
      document.documentElement.classList.remove('is-dragging');
    }
  };
  el.addEventListener('pointerup', end);
  el.addEventListener('pointercancel', end);
  // Auf Touch-Geräten soll Ziehen am Bedienelement nicht die Seite scrollen
  el.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
}

// Poti per Tastatur: Pfeiltasten drehen (für Bedienung ohne Maus)
export function onKeyTurn(el: Element, turn: (steps: number) => void) {
  el.addEventListener('keydown', (ev) => {
    const e = ev as KeyboardEvent;
    const step = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 5, PageDown: -5 }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    turn(step);
  });
}
