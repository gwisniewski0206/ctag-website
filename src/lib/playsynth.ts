// Mini-Synth auf der Partnerseite. Signalweg je Note: Oszillator → Tiefpassfilter → VCA (Hüllkurve) → Lautstärke → Ausgang.
// Ein gemeinsamer LFO bewegt die Filterfrequenz aller Stimmen. Polyfon (bis 8 Stimmen), Web Audio, keine Audiodateien.
// Beim Scrollen wird nach und nach ein neuer Patch gewürfelt.
import { onDrag, onKeyTurn } from './drag';
import { onScrollMotion, reducedMotion } from './scroll-motion';
import { audio, armAudioUnlock } from './audio';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const expMap = (v: number, lo: number, hi: number) => lo * Math.pow(hi / lo, v);   // 0…1 → logarithmisch lo…hi
const midiToHz = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

// Computertastatur wie in Musikprogrammen: untere Reihe weiße, obere Reihe schwarze Tasten
const KEYMAP: Record<string, number> = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, z: 8, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15 };

type Voice = { osc: OscillatorNode; filter: BiquadFilterNode; vca: GainNode };

for (const root of document.querySelectorAll<HTMLElement>('[data-playsynth]')) {
  armAudioUnlock(root);
  const scopeLine = root.querySelector<SVGPathElement>('.psy-scope-line')!;
  const keyEls = new Map([...root.querySelectorAll<HTMLButtonElement>('.key')].map((k) => [Number(k.dataset.note), k]));
  const base = Math.min(...keyEls.keys());

  // Patch: alle Regler 0…1 außer Oktave
  const p = { wave: 'sawtooth' as OscillatorType, octave: 0, cutoff: 0.55, resonance: 0.3, attack: 0.1, release: 0.35, volume: 0.6, lfoRate: 0.3, lfoDepth: 0.2, arpRate: 0.45, arpOct: 1 };
  const cutoffHz = () => expMap(p.cutoff, 80, 12000);
  const q = () => 0.5 + p.resonance * 18;
  const attackSec = () => expMap(p.attack, 0.003, 1.5);
  const releaseSec = () => expMap(p.release, 0.03, 3);

  // ---- Bedienelemente ----
  const controls: Record<string, { get: () => number; set: (v: number) => void }> = {};
  for (const el of root.querySelectorAll<SVGSVGElement>('.ctl-knob')) {
    const key = el.dataset.param as keyof typeof p;
    const min = Number(el.dataset.min), max = Number(el.dataset.max);
    const mark = el.querySelector<SVGLineElement>('.ctl-knob-mark')!;
    const stepped = key === 'octave' || key === 'arpOct';
    let raw = Number(el.dataset.value);
    const set = (v: number) => {
      raw = clamp(v, min, max);
      const value = stepped ? Math.round(raw) : raw;
      (p as Record<string, unknown>)[key] = value;
      mark.style.transform = `rotate(${(-135 + ((value - min) / (max - min)) * 270).toFixed(1)}deg)`;
      el.setAttribute('aria-valuenow', String(Math.round(value * 100) / 100));
      applyLive();
      if (stepped && !scopeRunning) drawIdealSpectrum();
    };
    controls[key] = { get: () => raw, set };
    onDrag(el, (_dx, dy) => set(raw - (dy / 160) * (max - min)));
    onKeyTurn(el, (s) => set(stepped ? Math.round(raw) + s : raw + s * 0.05 * (max - min)));
  }
  const waveButtons = [...root.querySelectorAll<HTMLButtonElement>('.psy-wave')];
  function selectWave(btn: HTMLButtonElement) {
    waveButtons.forEach((b) => b.setAttribute('aria-checked', String(b === btn)));
    p.wave = btn.dataset.wave as OscillatorType;
    applyLive();
    if (!scopeRunning) drawIdealScope();
  }
  for (const btn of waveButtons) btn.addEventListener('click', () => selectWave(btn));

  // ---- Klang ----
  let ctx: AudioContext | null = null;
  let master: GainNode, analyser: AnalyserNode, lfo: OscillatorNode, lfoAmount: GainNode;
  const voices = new Map<number, Voice>();

  function setupAudio() {
    ctx = audio();
    master = ctx.createGain();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 4096;            // feine Auflösung auch bei tiefen Frequenzen
    analyser.smoothingTimeConstant = 0.6;
    master.connect(analyser).connect(ctx.destination);
    lfo = ctx.createOscillator();
    lfoAmount = ctx.createGain();   // Tiefe in Cent, wirkt auf filter.detune
    lfo.connect(lfoAmount);
    lfo.start();
    applyLive();
  }

  // Patch-Änderungen wirken sofort, auch auf klingende Noten
  function applyLive() {
    if (!ctx) return;
    const t = ctx.currentTime;
    master.gain.setTargetAtTime(p.volume * 0.5, t, 0.02);
    lfo.frequency.setTargetAtTime(expMap(p.lfoRate, 0.1, 14), t, 0.02);
    lfoAmount.gain.setTargetAtTime(p.lfoDepth * 3600, t, 0.02);
    for (const v of voices.values()) {
      v.osc.type = p.wave;
      v.filter.frequency.setTargetAtTime(cutoffHz(), t, 0.02);
      v.filter.Q.setTargetAtTime(q(), t, 0.02);
    }
  }

  // Stimme ein/aus = nur Klang. Tasten-Markierung und Arpeggiator stecken in press()/release().
  function voiceOn(note: number) {
    if (!ctx) setupAudio();
    audio();   // startet den Context bei Bedarf neu (iOS); nicht warten, sonst kann eine Note hängen bleiben
    if (voices.has(note)) return;
    if (voices.size >= 8) voiceOff(voices.keys().next().value!);
    const t = ctx!.currentTime;
    const osc = ctx!.createOscillator();
    osc.type = p.wave;
    osc.frequency.value = midiToHz(note + 12 * p.octave);
    const filter = ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoffHz();
    filter.Q.value = q();
    lfoAmount.connect(filter.detune);
    const vca = ctx!.createGain();
    vca.gain.setValueAtTime(0, t);
    vca.gain.linearRampToValueAtTime(0.7, t + attackSec());
    osc.connect(filter).connect(vca).connect(master);
    osc.start(t);
    voices.set(note, { osc, filter, vca });
    startScope();
  }

  function voiceOff(note: number) {
    const v = voices.get(note);
    if (!v || !ctx) return;
    voices.delete(note);
    const t = ctx.currentTime;
    v.vca.gain.cancelScheduledValues(t);
    v.vca.gain.setValueAtTime(v.vca.gain.value, t);
    v.vca.gain.linearRampToValueAtTime(0, t + releaseSec());
    v.osc.stop(t + releaseSec() + 0.05);
    v.osc.onended = () => { lfoAmount.disconnect(v.filter.detune); v.vca.disconnect(); };
  }

  // ---- Arpeggiator: spielt die gehaltenen Tasten nacheinander, über 1–3 Oktaven ----
  const arp = { on: false, mode: 'up' as 'up' | 'down' | 'updown' | 'random' };
  const held = new Set<number>();
  let arpTimer = 0, arpIndex = -1, arpDir = 1;
  let arpCurrent: number | null = null;
  const arpToggle = root.querySelector<HTMLButtonElement>('.psy-arp-toggle')!;
  const arpModeBtn = root.querySelector<HTMLButtonElement>('.psy-arp-mode')!;
  const MODES = [
    { id: 'up', label: '↑ Hoch' }, { id: 'down', label: '↓ Runter' },
    { id: 'updown', label: '↕ Hoch-runter' }, { id: 'random', label: '? Zufall' },
  ] as const;

  const arpSequence = () => {
    const notes = [...held].sort((a, b) => a - b);
    const seq: number[] = [];
    for (let o = 0; o < p.arpOct; o++) for (const n of notes) seq.push(n + 12 * o);
    return seq;
  };
  const unmarkArp = (n: number) => keyEls.get(n)?.classList.remove('arp');
  function arpStep() {
    const seq = arpSequence();
    if (!seq.length) { stopArp(); return; }
    const len = seq.length;
    if (arp.mode === 'up') arpIndex = (arpIndex + 1) % len;
    else if (arp.mode === 'down') arpIndex = (arpIndex - 1 + len) % len;
    else if (arp.mode === 'random') arpIndex = Math.floor(Math.random() * len);
    else if (len === 1) arpIndex = 0;
    else {
      if (arpIndex + arpDir >= len || arpIndex + arpDir < 0) arpDir = -arpDir;
      arpIndex = clamp(arpIndex + arpDir, 0, len - 1);
    }
    if (arpCurrent !== null) { voiceOff(arpCurrent); unmarkArp(arpCurrent); }
    const note = seq[arpIndex];
    voiceOn(note);
    keyEls.get(note)?.classList.add('arp');
    arpCurrent = note;
    const interval = 1000 / expMap(p.arpRate, 2, 16);   // 2–16 Noten pro Sekunde
    // Gate 60 %: Note klingt kurz an, dann Pause bis zum nächsten Schritt
    window.setTimeout(() => {
      if (arpCurrent === note) { voiceOff(note); unmarkArp(note); arpCurrent = null; }
    }, interval * 0.6);
    arpTimer = window.setTimeout(arpStep, interval);
  }
  function startArp() {
    if (arpTimer) return;
    arpIndex = arp.mode === 'down' ? 0 : -1;
    arpDir = 1;
    arpStep();
  }
  function stopArp() {
    clearTimeout(arpTimer);
    arpTimer = 0;
    if (arpCurrent !== null) { voiceOff(arpCurrent); unmarkArp(arpCurrent); arpCurrent = null; }
  }

  // Hold (Latch): gehaltene Noten laufen nach dem Loslassen weiter; ein neuer Anschlag, nachdem alle Tasten
  // losgelassen sind, ersetzt den Akkord. Wirkt nur mit eingeschaltetem Arpeggiator.
  let hold = false;
  const down = new Set<number>();   // Tasten, die gerade wirklich gedrückt sind
  const arpHoldBtn = root.querySelector<HTMLButtonElement>('.psy-arp-hold')!;
  const unmark = (n: number) => keyEls.get(n)?.classList.remove('on');

  function press(note: number) {
    if (arp.on && hold && down.size === 0) { held.forEach(unmark); held.clear(); }
    down.add(note);
    keyEls.get(note)?.classList.add('on');
    if (arp.on) { held.add(note); startArp(); }
    else voiceOn(note);
  }
  function release(note: number) {
    down.delete(note);
    if (arp.on) {
      if (hold) return;
      unmark(note);
      held.delete(note);
      if (!held.size) stopArp();
    } else { unmark(note); voiceOff(note); }
  }
  function releaseAll() {
    down.clear();
    held.forEach(unmark);
    held.clear();
    for (const n of [...voices.keys()]) { unmark(n); voiceOff(n); }
    stopArp();
  }

  arpToggle.addEventListener('click', () => {
    releaseAll();
    arp.on = !arp.on;
    arpToggle.setAttribute('aria-pressed', String(arp.on));
    arpToggle.textContent = arp.on ? 'An' : 'Aus';
  });
  arpHoldBtn.addEventListener('click', () => {
    hold = !hold;
    arpHoldBtn.setAttribute('aria-pressed', String(hold));
    if (!hold) {
      // Nur losgelassene Noten beenden, gedrückte spielen weiter
      for (const n of [...held]) if (!down.has(n)) { unmark(n); held.delete(n); }
      if (!held.size) stopArp();
    }
  });
  arpModeBtn.addEventListener('click', () => {
    const i = (MODES.findIndex((m) => m.id === arp.mode) + 1) % MODES.length;
    arp.mode = MODES[i].id;
    arpModeBtn.textContent = MODES[i].label;
  });

  // ---- Klaviatur: Maus/Finger, mit Gleiten über die Tasten ----
  const pressed = new Map<number, number>();   // pointerId → Note
  const keysBox = root.querySelector<HTMLElement>('.psy-keys')!;
  const noteAt = (x: number, y: number) => {
    const el = document.elementFromPoint(x, y) as HTMLElement | null;
    return el?.classList.contains('key') && keysBox.contains(el) ? Number(el.dataset.note) : null;
  };
  keysBox.addEventListener('pointerdown', (e) => {
    const n = noteAt(e.clientX, e.clientY);
    if (n === null) return;
    e.preventDefault();
    keysBox.setPointerCapture(e.pointerId);
    pressed.set(e.pointerId, n);
    press(n);
  });
  keysBox.addEventListener('pointermove', (e) => {
    if (!pressed.has(e.pointerId)) return;
    const n = noteAt(e.clientX, e.clientY);
    const was = pressed.get(e.pointerId)!;
    if (n === null || n === was) return;
    release(was);
    pressed.set(e.pointerId, n);
    press(n);
  });
  const lift = (e: PointerEvent) => {
    const n = pressed.get(e.pointerId);
    if (n === undefined) return;
    pressed.delete(e.pointerId);
    release(n);
  };
  keysBox.addEventListener('pointerup', lift);
  keysBox.addEventListener('pointercancel', lift);
  // Tastatur-Bedienung der Tasten (Fokus + Leertaste/Enter)
  for (const [note, el] of keyEls) {
    el.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); press(note); } });
    el.addEventListener('keyup', (e) => { if (e.key === ' ' || e.key === 'Enter') release(note); });
  }

  // ---- Computertastatur, nur solange der Synth zu sehen ist ----
  let visible = false;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (!visible) releaseAll(); }).observe(root);
  const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));
  window.addEventListener('keydown', (e) => {
    const off = KEYMAP[e.key.toLowerCase()];
    if (!visible || off === undefined || e.repeat || e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return;
    press(base + off);
  });
  window.addEventListener('keyup', (e) => {
    const off = KEYMAP[e.key.toLowerCase()];
    if (off !== undefined) release(base + off);
  });
  window.addEventListener('blur', releaseAll);

  // ---- Oszilloskop: echtes Ausgangssignal, im Ruhezustand die gewählte Wellenform ----
  // ---- Spektrum: 24 Bänder, logarithmisch von 40 Hz bis 16 kHz ----
  const specBars = [...root.querySelectorAll<SVGRectElement>('.psy-spec-bar')];
  const F_LO = 40, F_HI = 16000;
  const bandOf = (f: number) => Math.floor((Math.log(f / F_LO) / Math.log(F_HI / F_LO)) * specBars.length);
  function drawSpectrum(levels: number[]) {
    specBars.forEach((bar, i) => {
      const h = Math.round(clamp(levels[i] ?? 0, 0, 1) * 58);
      bar.setAttribute('y', String(62 - h));
      bar.setAttribute('height', String(h));
    });
  }
  // Ruhezustand: Obertöne der gewählten Wellenform auf A3 (220 Hz)
  function drawIdealSpectrum() {
    const levels = new Array(specBars.length).fill(0);
    const f0 = 220 * Math.pow(2, p.octave);
    for (let n = 1; f0 * n < F_HI; n++) {
      let a = 0;
      if (p.wave === 'sine') a = n === 1 ? 1 : 0;
      else if (p.wave === 'sawtooth') a = 1 / n;
      else if (p.wave === 'square') a = n % 2 ? 1 / n : 0;
      else a = n % 2 ? 1 / (n * n) : 0;
      if (!a) continue;
      const b = bandOf(f0 * n);
      if (b >= 0 && b < levels.length) levels[b] = Math.max(levels[b], clamp((20 * Math.log10(a) + 48) / 48, 0, 1));
    }
    drawSpectrum(levels);
  }
  // Live: höchster Pegel je Band aus der FFT des Analysers
  let fbuf: Float32Array | null = null;
  function drawLiveSpectrum() {
    if (!fbuf) fbuf = new Float32Array(analyser.frequencyBinCount);
    analyser.getFloatFrequencyData(fbuf);
    const binHz = ctx!.sampleRate / analyser.fftSize;
    const levels = new Array(specBars.length).fill(0);
    for (let i = 1; i < fbuf.length; i++) {
      const b = bandOf(i * binHz);
      if (b < 0 || b >= levels.length) continue;
      levels[b] = Math.max(levels[b], clamp((fbuf[i] + 95) / 75, 0, 1));
    }
    drawSpectrum(levels);
  }

  function drawIdealScope() {
    drawIdealSpectrum();
    const shape = (t: number) => {
      const f = t - Math.floor(t);
      if (p.wave === 'sine') return Math.sin(t * 2 * Math.PI);
      if (p.wave === 'square') return f < 0.5 ? 1 : -1;
      if (p.wave === 'triangle') return 1 - 4 * Math.abs(f - 0.5);
      return 2 * f - 1;
    };
    let d = '';
    for (let i = 0; i <= 120; i++) d += `${i ? ' L' : 'M'}${i} ${(32 - 22 * shape(i / 40 + 0.25)).toFixed(1)}`;
    scopeLine.setAttribute('d', d);
  }
  let scopeRunning = false;
  let quiet = 0;
  const buf = new Float32Array(1024);
  function scopeFrame() {
    drawLiveSpectrum();
    analyser.getFloatTimeDomainData(buf);
    // An einer steigenden Nullstelle beginnen, damit das Bild steht
    let start = 0;
    for (let i = 1; i < 400; i++) if (buf[i - 1] < 0 && buf[i] >= 0) { start = i; break; }
    let d = '', peak = 0;
    for (let i = 0; i <= 120; i++) {
      const v = buf[start + i * 4] ?? 0;
      peak = Math.max(peak, Math.abs(v));
      d += `${i ? ' L' : 'M'}${i} ${clamp(32 - v * 70, 2, 62).toFixed(1)}`;
    }
    scopeLine.setAttribute('d', d);
    quiet = peak < 0.002 && voices.size === 0 ? quiet + 1 : 0;
    if (quiet > 20) { scopeRunning = false; drawIdealScope(); return; }
    requestAnimationFrame(scopeFrame);
  }
  function startScope() { if (!scopeRunning) { scopeRunning = true; quiet = 0; requestAnimationFrame(scopeFrame); } }

  drawIdealScope();

  // ---- Scrollen würfelt einen neuen Patch ----
  // Die Regler gleiten mit der Scrollgeschwindigkeit zu zufälligen Zielwerten; etwa alle 500 px wird neu gewürfelt,
  // manchmal auch die Wellenform. Lautstärke bleibt, wie sie ist. Selbst Eingestelltes ist einfach der neue Ausgangspunkt.
  if (!reducedMotion) {
    const RANGES: Record<string, [number, number]> = {
      octave: [-1, 0.4], cutoff: [0.25, 0.9], resonance: [0, 0.7], attack: [0, 0.45],
      release: [0.1, 0.7], lfoRate: [0, 0.85], lfoDepth: [0, 0.55],
    };
    const roll = () => Object.fromEntries(Object.entries(RANGES).map(([k, [lo, hi]]) => [k, lo + Math.random() * (hi - lo)]));
    let targets = roll();
    let travelled = 0;
    onScrollMotion(root, (_pos, v) => {
      const speed = Math.abs(v);
      if (speed < 0.05) return;
      travelled += speed;
      if (travelled > 500) {
        travelled = 0;
        targets = roll();
        if (Math.random() < 0.5) selectWave(waveButtons[Math.floor(Math.random() * waveButtons.length)]);
      }
      const step = Math.min(1, speed * 0.012);
      for (const [k, target] of Object.entries(targets)) {
        const c = controls[k];
        if (c) c.set(c.get() + (target - c.get()) * step);
      }
    });
  }
}
