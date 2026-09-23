import { Injectable, effect, signal } from '@angular/core';
import { storage } from './storage';

export type InstrumentVoice =
  | 'piano'
  | 'guitar'
  | 'violin'
  | 'drum'
  | 'darbuka'
  | 'trumpet'
  | 'flute'
  | 'saxophone'
  | 'bell'
  | 'accordion'
  | 'maracas'
  | 'banjo';

const NOTE = { C4: 261.63, E4: 329.63, G4: 392, A4: 440, C5: 523.25, E5: 659.25, G5: 783.99, C6: 1046.5 };

/** All sounds are synthesized live with the Web Audio API, so there are no audio assets to ship. */
@Injectable({ providedIn: 'root' })
export class SoundService {
  readonly muted = signal(storage.get('muted') === '1');

  private ctx?: AudioContext;
  private master?: GainNode;
  private noiseBuffer?: AudioBuffer;

  constructor() {
    effect(() => storage.set('muted', this.muted() ? '1' : '0'));
  }

  toggleMute() {
    this.muted.update((m) => !m);
    if (this.muted()) window.speechSynthesis?.cancel();
  }

  click() {
    this.play((t) => this.tone(880, t, 0.06, 'square', 0.08));
  }

  pop() {
    this.play((t, ac) => {
      const osc = ac.createOscillator();
      const g = this.envelope(t, 0.15, 0.4);
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.12);
      osc.connect(g);
      osc.start(t);
      osc.stop(t + 0.16);
      this.noise(t, 0.08, 0.25, 2000);
    });
  }

  correct() {
    this.play((t) =>
      [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6].forEach((f, i) => this.tone(f, t + i * 0.07, 0.25, 'triangle', 0.25)),
    );
  }

  wrong() {
    this.play((t) => {
      this.tone(220, t, 0.18, 'sawtooth', 0.12);
      this.tone(160, t + 0.16, 0.3, 'sawtooth', 0.12);
    });
  }

  whoosh() {
    this.play((t) => this.noise(t, 0.35, 0.2, 1200, 0.5));
  }

  win() {
    this.play((t) => {
      const melody = [NOTE.C5, NOTE.E5, NOTE.G5, NOTE.C6, NOTE.G5, NOTE.C6];
      const times = [0, 0.12, 0.24, 0.36, 0.52, 0.64];
      melody.forEach((f, i) => {
        this.tone(f, t + times[i], 0.3, 'square', 0.1);
        this.tone(f / 2, t + times[i], 0.3, 'triangle', 0.15);
      });
    });
  }

  /** Reads a Hebrew word aloud if the browser has a Hebrew voice. */
  speak(text: string) {
    if (this.muted() || !('speechSynthesis' in window)) return;
    const voice = speechSynthesis.getVoices().find((v) => v.lang.startsWith('he'));
    if (!voice) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.9;
    u.pitch = 1.2;
    speechSynthesis.speak(u);
  }

  instrument(voice: InstrumentVoice) {
    this.play((t, ac) => {
      switch (voice) {
        case 'piano':
          [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.C5].forEach((f, i) => {
            this.tone(f, t + i * 0.15, 0.9, 'triangle', 0.3);
            this.tone(f * 2, t + i * 0.15, 0.4, 'sine', 0.08);
          });
          break;
        case 'guitar':
          [NOTE.E4 / 2, NOTE.G4 / 2, NOTE.C4, NOTE.E4].forEach((f, i) => this.pluck(f, t + i * 0.06, 1.6, 0.996));
          break;
        case 'banjo':
          [NOTE.G4, NOTE.C5, NOTE.E5, NOTE.G5, NOTE.E5].forEach((f, i) => this.pluck(f, t + i * 0.1, 0.5, 0.985));
          break;
        case 'violin':
          this.bowed(NOTE.A4, t, 1.2, 'sawtooth', 2500);
          break;
        case 'accordion':
          this.bowed(NOTE.C4, t, 1.1, 'sawtooth', 1800, 1.006);
          this.bowed(NOTE.E4, t, 1.1, 'sawtooth', 1800, 1.006);
          break;
        case 'saxophone':
          this.bowed(NOTE.G4 / 2, t, 1, 'square', 1200);
          break;
        case 'trumpet':
          [NOTE.C5, NOTE.C5, NOTE.G5].forEach((f, i) => this.brass(f, t + i * 0.18, i === 2 ? 0.5 : 0.14));
          break;
        case 'flute':
          this.bowed(NOTE.C6 / 1.5, t, 1, 'sine', 5000);
          this.noise(t, 1, 0.03, 3000, 3);
          break;
        case 'bell':
          [1, 2.76, 5.4].forEach((m, i) => this.tone(NOTE.G5 * m, t, 2 - i * 0.5, 'sine', 0.2 / (i + 1)));
          break;
        case 'darbuka':
          [0, 0.3, 0.45].forEach((d, i) => (i ? this.noise(t + d, 0.09, 0.5, 3500, 2) : this.kick(ac, t + d)));
          break;
        case 'drum':
          [0, 0.25, 0.5, 0.62].forEach((d) => this.kick(ac, t + d));
          this.noise(t + 0.25, 0.12, 0.2, 1500);
          break;
        case 'maracas':
          [0, 0.15, 0.3, 0.38, 0.46].forEach((d) => this.noise(t + d, 0.07, 0.3, 6000));
          break;
      }
    });
  }

  private play(fn: (t: number, ac: AudioContext) => void) {
    if (this.muted()) return;
    const ac = this.audio();
    fn(ac.currentTime + 0.01, ac);
  }

  private audio(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.7;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private envelope(t: number, dur: number, peak: number, attack = 0.01): GainNode {
    const g = this.ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(this.master!);
    return g;
  }

  private tone(freq: number, t: number, dur: number, type: OscillatorType, peak: number) {
    const osc = this.ctx!.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.connect(this.envelope(t, dur, peak));
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  private noise(t: number, dur: number, peak: number, freq: number, q = 0.7) {
    const ac = this.ctx!;
    this.noiseBuffer ??= (() => {
      const buf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      return buf;
    })();
    const src = ac.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = q;
    src.connect(filter).connect(this.envelope(t, dur, peak, 0.005));
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  /** Karplus–Strong plucked string. */
  private pluck(freq: number, t: number, dur: number, decay: number) {
    const ac = this.ctx!;
    const period = Math.round(ac.sampleRate / freq);
    const buf = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
    const y = buf.getChannelData(0);
    for (let i = 0; i < y.length; i++) {
      y[i] = i < period ? Math.random() * 2 - 1 : decay * 0.5 * (y[i - period] + (y[i - period - 1] ?? 0));
    }
    const src = ac.createBufferSource();
    src.buffer = buf;
    src.connect(this.envelope(t, dur, 0.35, 0.002));
    src.start(t);
  }

  /** Sustained tone with vibrato: violin, sax, flute, accordion. */
  private bowed(freq: number, t: number, dur: number, type: OscillatorType, cutoff: number, detune = 1) {
    const ac = this.ctx!;
    const osc = ac.createOscillator();
    osc.type = type;
    osc.frequency.value = freq * detune;
    const lfo = ac.createOscillator();
    const lfoGain = ac.createGain();
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = freq * 0.012;
    lfo.connect(lfoGain).connect(osc.frequency);
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    osc.connect(filter).connect(this.envelope(t, dur, 0.18, 0.12));
    [osc, lfo].forEach((n) => {
      n.start(t);
      n.stop(t + dur + 0.05);
    });
  }

  private brass(freq: number, t: number, dur: number) {
    const ac = this.ctx!;
    const osc = ac.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);
    filter.frequency.exponentialRampToValueAtTime(3500, t + 0.05);
    osc.connect(filter).connect(this.envelope(t, dur + 0.1, 0.2, 0.03));
    osc.start(t);
    osc.stop(t + dur + 0.15);
  }

  private kick(ac: AudioContext, t: number) {
    const osc = ac.createOscillator();
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.18);
    osc.connect(this.envelope(t, 0.3, 0.9, 0.002));
    osc.start(t);
    osc.stop(t + 0.32);
  }
}
