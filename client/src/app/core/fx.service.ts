import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

const COLORS = ['#22907e', '#f07014', '#9c1574', '#1d2744', '#fff3e3'];

@Injectable({ providedIn: 'root' })
export class FxService {
  /** Small burst from a screen point (e.g. where the child tapped). */
  burst(x = 0.5, y = 0.5) {
    confetti({
      particleCount: 60,
      spread: 70,
      startVelocity: 35,
      origin: { x, y },
      colors: COLORS,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  }

  burstAt(el: Element) {
    const r = el.getBoundingClientRect();
    this.burst((r.left + r.width / 2) / innerWidth, (r.top + r.height / 2) / innerHeight);
  }

  emojiRain(emoji: string) {
    const shape = confetti.shapeFromText({ text: emoji, scalar: 3 });
    confetti({
      shapes: [shape],
      scalar: 3,
      particleCount: 25,
      spread: 120,
      startVelocity: 30,
      gravity: 0.8,
      origin: { y: 0.3 },
      disableForReducedMotion: true,
    });
  }

  fireworks(durationMs = 4000) {
    const end = Date.now() + durationMs;
    const tick = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: 70,
        startVelocity: 45,
        spread: 360,
        ticks: 80,
        gravity: 0.9,
        colors: COLORS,
        origin: { x: 0.1 + Math.random() * 0.8, y: 0.1 + Math.random() * 0.4 },
        disableForReducedMotion: true,
      });
      setTimeout(tick, 280);
    };
    tick();
  }
}
