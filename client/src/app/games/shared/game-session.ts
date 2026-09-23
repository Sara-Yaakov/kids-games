import { computed, signal } from '@angular/core';

export const POINTS = { firstTry: 10, afterMistake: 4, streakBonus: 5, streakEvery: 3 } as const;

/** Score, streak and accuracy bookkeeping shared by all games. */
export class GameSession {
  readonly score = signal(0);
  readonly streak = signal(0);
  readonly correctCount = signal(0);
  readonly mistakes = signal(0);
  readonly finished = signal(false);
  readonly toast = signal<{ message: string; tone: 'good' | 'bad'; key: number }>({ message: '', tone: 'good', key: 0 });

  readonly accuracy = computed(() => {
    const total = this.correctCount() + this.mistakes();
    return total ? Math.round((this.correctCount() / total) * 100) : 0;
  });

  /** Returns the points earned and whether a streak bonus was hit. */
  correct(hadMistake = false): { points: number; bonus: boolean } {
    this.correctCount.update((n) => n + 1);
    this.streak.update((n) => (hadMistake ? 0 : n + 1));
    const bonus = !hadMistake && this.streak() % POINTS.streakEvery === 0;
    const points = (hadMistake ? POINTS.afterMistake : POINTS.firstTry) + (bonus ? POINTS.streakBonus : 0);
    this.score.update((s) => s + points);
    return { points, bonus };
  }

  wrong() {
    this.mistakes.update((n) => n + 1);
    this.streak.set(0);
  }

  say(message: string, tone: 'good' | 'bad' = 'good') {
    this.toast.update(({ key }) => ({ message, tone, key: key + 1 }));
  }

  finish() {
    this.finished.set(true);
  }

  reset() {
    this.score.set(0);
    this.streak.set(0);
    this.correctCount.set(0);
    this.mistakes.set(0);
    this.finished.set(false);
  }
}
