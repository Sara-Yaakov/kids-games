import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TONES, Tone } from '../../core/games';

@Component({
  selector: 'app-game-hud',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="panel overflow-hidden bg-card">
      <div class="flex items-center gap-3 px-4 py-3 sm:gap-5 sm:px-5">
        <a routerLink="/" class="btn btn-paper size-11 shrink-0 p-0 text-xl" aria-label="חזרה לדף הבית">→</a>

        <div class="flex min-w-0 flex-1 items-center gap-3">
          <span
            class="emoji hidden size-12 shrink-0 sm:grid place-items-center rounded-full border-[3px] border-ink text-3xl"
            [class]="classes().solid"
            aria-hidden="true"
            >{{ emoji() }}</span
          >
          <div class="min-w-0">
            <h1 class="display truncate text-3xl sm:text-5xl">{{ title() }}</h1>
            <p class="text-sm font-semibold">{{ progressLabel() }}</p>
          </div>
        </div>

        @if (streak() >= 2) {
          <span class="sticker animate-pop-in bg-orange text-base" aria-live="polite">רצף {{ streak() }}</span>
        }

        <div class="flex shrink-0 items-center gap-1.5 rounded-xl border-[3px] border-ink bg-orange px-2.5 py-0.5" aria-live="polite">
          <span class="emoji text-2xl" aria-hidden="true">⭐</span>
          <span class="display text-4xl">{{ score() }}</span>
          <span class="sr-only">נקודות</span>
        </div>
      </div>

      <!-- Segmented progress: one block per question -->
      <div
        class="flex border-t-[3px] border-ink"
        role="progressbar"
        [attr.aria-valuenow]="current()"
        [attr.aria-valuemax]="total()"
        aria-label="התקדמות"
      >
        @for (i of segments(); track i) {
          <span
            class="h-3.5 flex-1 border-ink transition-colors duration-300 not-last:border-e-2"
            [class]="i < current() ? classes().solid : 'bg-paper-deep'"
          ></span>
        }
      </div>
    </div>
  `,
})
export class GameHud {
  readonly title = input.required<string>();
  readonly emoji = input.required<string>();
  readonly tone = input.required<Tone>();
  readonly score = input.required<number>();
  readonly streak = input(0);
  readonly current = input.required<number>();
  readonly total = input.required<number>();
  readonly progressLabel = input('');

  protected readonly classes = computed(() => TONES[this.tone()]);
  protected readonly segments = computed(() => Array.from({ length: this.total() }, (_, i) => i));
}
