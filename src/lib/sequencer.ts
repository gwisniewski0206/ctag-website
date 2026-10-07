// Step-Sequencer auf der Projektübersicht.
// Ohne Play folgt das Lauflicht der Scrollposition. Mit Play läuft es im Takt (120 BPM, Sechzehntel)
// und spielt Kick, Snare, Hat und Clap – erzeugt mit der Web Audio API, ohne Audiodateien.
import { onScrollMotion, reducedMotion } from './scroll-motion';
import { audio, armAudioUnlock } from './audio';

const BPM = 120;
const STEP_SEC = 60 / BPM / 4;

for (const root of document.querySelectorAll<HTMLElement>('[data-sequencer]')) {
  armAudioUnlock(root);
  const pads = [...root.querySelectorAll<HTMLButtonElement>('.seq-pad')];
  const leds = [...root.querySelectorAll<HTMLElement>('.seq-led')];
  const play = root.querySelector<HTMLButtonElement>('.seq-play')!;
  const playLabel = play.querySelector('span')!;
  const playIcon = play.querySelector('.seq-play-icon')!;
  const isOn = (row: number, step: number) => pads[row * 16 + step].getAttribute('aria-pressed') === 'true';

  // Zustand (vor dem ersten Aufruf von onScrollMotion anlegen, der sofort ausgelöst wird)
  let current = -1;
  let playing = false;
  let timer = 0;
  let nextTime = 0;
  let nextStep = 0;
  let ctx: AudioContext | null = null;
  let out: GainNode;
  let noise: AudioBuffer;
  let voices: ((t: number) => void)[] = [];
  function show(step: number) {
    if (step === current) return;
    current = step;
    pads.forEach((p) => p.classList.toggle('now', Number(p.dataset.step) === step));
    leds.forEach((l) => l.classList.toggle('now', Number(l.dataset.step) === step));
  }

  for (const pad of pads) {
    pad.addEventListener('click', () => {
      const on = pad.getAttribute('aria-pressed') !== 'true';
      pad.setAttribute('aria-pressed', String(on));
      // Beim Einschalten kurz anspielen, wenn der Ton schon an ist
      if (on && ctx) voices[Number(pad.dataset.row)](ctx.currentTime);
    });
  }

  // Lauflicht folgt dem Scrollen, solange nicht gespielt wird
  if (!reducedMotion) onScrollMotion(root, (pos) => { if (!playing) show(Math.floor(pos / 28) % 16); });


  function setupAudio() {
    ctx = audio();
    out = ctx.createGain();
    out.gain.value = 0.6;
    out.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

    const env = (t: number, peak: number, decay: number) => {
      const g = ctx!.createGain();
      g.gain.setValueAtTime(peak, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + decay);
      g.connect(out);
      return g;
    };
    const noiseBurst = (t: number, type: BiquadFilterType, freq: number, peak: number, decay: number) => {
      const src = ctx!.createBufferSource();
      src.buffer = noise;
      const f = ctx!.createBiquadFilter();
      f.type = type; f.frequency.value = freq;
      src.connect(f).connect(env(t, peak, decay));
      src.start(t); src.stop(t + decay + 0.02);
    };

    voices = [
      // Kick: Sinus mit schnell fallender Tonhöhe
      (t) => {
        const o = ctx!.createOscillator();
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
        o.connect(env(t, 1, 0.35));
        o.start(t); o.stop(t + 0.4);
      },
      // Snare: Rauschen plus kurzer Ton
      (t) => {
        noiseBurst(t, 'highpass', 1200, 0.5, 0.18);
        const o = ctx!.createOscillator();
        o.type = 'triangle'; o.frequency.value = 185;
        o.connect(env(t, 0.35, 0.08));
        o.start(t); o.stop(t + 0.1);
      },
      // Hi-Hat: kurzes, hohes Rauschen
      (t) => noiseBurst(t, 'highpass', 7500, 0.22, 0.045),
      // Clap: drei schnelle Rausch-Stöße
      (t) => { for (const dt of [0, 0.012, 0.024]) noiseBurst(t + dt, 'bandpass', 1500, 0.45, dt === 0.024 ? 0.16 : 0.01); },
    ];
  }

  // ---- Klang ----
  // Vorausplanender Takt (Standardverfahren für Web Audio): alle 25 ms die nächsten 100 ms einplanen
  function schedule() {
    while (nextTime < ctx!.currentTime + 0.1) {
      const step = nextStep, at = nextTime;
      for (let row = 0; row < 4; row++) if (isOn(row, step)) voices[row](at);
      setTimeout(() => { if (playing) show(step); }, Math.max(0, (at - ctx!.currentTime) * 1000));
      nextTime += STEP_SEC;
      nextStep = (nextStep + 1) % 16;
    }
  }

  play.addEventListener('click', async () => {
    if (!ctx) setupAudio();
    audio();   // startet den Context bei Bedarf neu (iOS)
    playing = !playing;
    play.setAttribute('aria-pressed', String(playing));
    playLabel.textContent = playing ? 'Stop' : 'Play';
    playIcon.setAttribute('d', playing ? 'M4 3 H14 V15 H4 Z' : 'M4 2 L16 9 L4 16 Z');
    if (playing) {
      nextStep = Math.max(0, current);
      nextTime = ctx!.currentTime + 0.05;
      schedule();
      timer = window.setInterval(schedule, 25);
    } else {
      clearInterval(timer);
    }
  });
}
