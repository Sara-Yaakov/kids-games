import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameInfo, TONES } from '../core/games';
import { SoundService } from '../core/sound.service';

/** Poster-style game card. Extra details go in the projected slot. */
@Component({
  selector: 'app-game-card',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `
    <a
      class="card panel group flex h-full flex-col overflow-hidden bg-card"
      [routerLink]="['/games', game().id]"
      (click)="sound.click()"
    >
      <div class="relative flex h-48 items-center justify-center border-b-[3px] border-ink" [class]="tone().solid">
        <span class="display absolute top-3 right-4 text-5xl opacity-80" [class]="tone().onSolid">{{ game().number }}</span>
        <span class="emoji text-[7rem] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
          {{ game().emoji }}
        </span>
      </div>
      <div class="flex flex-1 flex-col p-5">
        <h3 class="display text-5xl">{{ game().title }}</h3>
        <p class="mt-1 text-lg">{{ game().tagline }}</p>
        <ng-content />
        <span class="mt-auto flex items-center justify-between pt-6 text-lg font-bold" [class]="tone().text">
          לשחק
          <span
            class="grid size-10 place-items-center rounded-full border-[3px] border-ink transition-transform group-hover:-translate-x-1"
            [class]="tone().solid + ' ' + tone().onSolid"
            aria-hidden="true"
            >←</span
          >
        </span>
      </div>
    </a>
  `,
  styles: `
    .card {
      transition:
        translate 0.2s,
        box-shadow 0.2s,
        rotate 0.2s;
    }
    .card:hover {
      translate: 2px -4px;
      rotate: var(--tilt, 1deg);
      box-shadow: var(--shadow-ink-lg);
    }
    :host(:nth-child(even)) {
      --tilt: -1deg;
    }
  `,
})
export class GameCard {
  protected readonly sound = inject(SoundService);
  readonly game = input.required<GameInfo>();
  protected readonly tone = computed(() => TONES[this.game().tone]);
}
