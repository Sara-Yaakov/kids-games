import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-hud',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card-glass flex flex-wrap items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
      <a routerLink="/" class="btn-3d border-grape/40 bg-white px-3 py-1.5 text-lg" aria-label="חזרה לדף הבית">
        ➜ <span class="hidden sm:inline">הביתה</span>
      </a>

      <h1 class="flex-1 text-2xl font-bold sm:text-3xl">
        <span class="emoji">{{ emoji() }}</span> {{ title() }}
      </h1>

      @if (streak() >= 2) {
        <div class="animate-pop-in rounded-full bg-tangerine px-3 py-1 text-lg font-bold text-white" aria-live="polite">
          🔥 {{ streak() }}
        </div>
      }

      <div class="rounded-full bg-sunny px-4 py-1 text-xl font-bold" aria-live="polite">⭐ {{ score() }}</div>

      <div class="w-full">
        <div class="mb-1 flex justify-between text-sm font-semibold text-ink/60">
          <span>{{ progressLabel() }}</span>
          <span>{{ current() }} / {{ total() }}</span>
        </div>
        <div class="h-4 overflow-hidden rounded-full bg-ink/10">
          <div
            class="h-full rounded-full bg-linear-to-l from-mint via-sky to-grape transition-[width] duration-500"
            [style.width.%]="(current() / total()) * 100"
          ></div>
        </div>
      </div>
    </div>
  `,
})
export class GameHud {
  readonly title = input.required<string>();
  readonly emoji = input.required<string>();
  readonly score = input.required<number>();
  readonly streak = input(0);
  readonly current = input.required<number>();
  readonly total = input.required<number>();
  readonly progressLabel = input('התקדמות');
}
