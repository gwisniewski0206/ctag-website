// Gemeinsamer AudioContext für Synth und Sequencer – mit den nötigen Kniffen für Mobilgeräte:
// - iOS gibt Audio nur innerhalb bestimmter Nutzeraktionen frei (zuverlässig: touchend, click). Deshalb wird bei
//   jeder Berührung im Gerät erneut versucht, den Context zu starten, und ein stummer Puffer abgespielt.
// - iOS schaltet Web Audio stumm, wenn der Klingelschalter auf lautlos steht. Safari ≥ 17 lässt sich mit
//   navigator.audioSession.type = 'playback' umstellen; ältere Versionen über das kurze Abspielen eines
//   (stummen) <audio>-Elements, das die Audio-Sitzung auf "Wiedergabe" schaltet.

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };
type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let htmlUnlocked = false;

export function audio(): AudioContext {
  if (!ctx) {
    const AC = window.AudioContext || (window as WebkitWindow).webkitAudioContext!;
    ctx = new AC({ latencyHint: 'interactive' });
  }
  if (ctx.state !== 'running') void ctx.resume().catch(() => {});
  return ctx;
}

// 0,1 s Stille als WAV (8 kHz, 8 Bit) – für den <audio>-Kniff auf älteren iPhones
function silentWav() {
  const n = 800;
  const bytes = new Uint8Array(44 + n);
  const v = new DataView(bytes.buffer);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVEfmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
  str(36, 'data'); v.setUint32(40, n, true);
  bytes.fill(128, 44);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return 'data:audio/wav;base64,' + btoa(bin);
}

function unlock() {
  try {
    const nav = navigator as AudioSessionNavigator;
    if (nav.audioSession) nav.audioSession.type = 'playback';
  } catch { /* nicht unterstützt */ }
  const c = audio();
  // Stummer Puffer: "berührt" die Audio-Ausgabe innerhalb der Nutzeraktion
  const src = c.createBufferSource();
  src.buffer = c.createBuffer(1, 1, 22050);
  src.connect(c.destination);
  src.start(0);
  if (!htmlUnlocked) {
    htmlUnlocked = true;
    const el = new Audio(silentWav());
    el.setAttribute('playsinline', '');
    void el.play().catch(() => { htmlUnlocked = false; });
  }
}

// Bei jeder Nutzeraktion im Element Audio freigeben (bis es läuft)
export function armAudioUnlock(el: Element) {
  const handler = () => {
    unlock();
    if (ctx?.state === 'running' && htmlUnlocked) {
      for (const type of ['touchend', 'click', 'pointerup', 'keydown']) el.removeEventListener(type, handler, true);
    }
  };
  for (const type of ['touchend', 'click', 'pointerup', 'keydown']) el.addEventListener(type, handler, true);
}
