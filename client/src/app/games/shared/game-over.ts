import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FxService } from '../../core/fx.service';
import { TONES, gameById } from '../../core/games';
import { GameId } from '../../core/models';
import { praise } from '../../core/praise';
import { SoundService } from '../../core/sound.service';

type SaveState = 'saving' | 'saved' | 'error';

/** Earned "stars" are the three brand shapes. */
const SHAPES = [
  { d: 'M32 6a26 26 0 1 1 0 52a26 26 0 1 1 0-52z', fill: 'var(--color-teal)' },
  { d: 'M6 6h52v52A52 52 0 0 1 6 6z', fill: 'var(--color-orange)' },
  { d: 'M32 6l27 52H5z', fill: 'var(--color-magenta)' },
];

@Component({
  selector: 'app-game-over',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="panel mx-auto mt-8 max-w-xl animate-pop-in overflow-hidden bg-card text-center">
      <div class="border-b-[3px] border-ink px-6 pt-8 pb-6" [class]="tone().solid + ' ' + tone().onSolid">
        <span class="sticker bg-card text-ink">סוף המשחק</span>
        <h2 class="display mt-4 text-6xl sm:text-7xl">{{ headline() }}</h2>
      </div>

      <div class="px-6 py-8">
        <div class="flex justify-center gap-5" role="img" [attr.aria-label]="stars() + ' כוכבים מתוך 3'">
          @for (s of shapes; track $index) {
            <svg viewBox="0 0 64 64" class="size-16 animate-pop-in sm:size-20" [style.animation-delay.ms]="250 + $index * 220">
              <path
                [attr.d]="s.d"
                [attr.fill]="$index < stars() ? s.fill : 'var(--color-paper-deep)'"
                stroke="var(--color-ink)"
                stroke-width="3.5"
                stroke-linejoin="round"
                [attr.stroke-dasharray]="$index < stars() ? null : '6 5'"
              />
            </svg>
          }
        </div>

        <div class="mt-8 flex items-center justify-center gap-10">
          <div>
            <div class="display text-8xl">{{ score() }}</div>
            <div class="font-semibold">נקודות</div>
          </div>
          <div class="h-16 border-e-[3px] border-dashed border-ink/40"></div>
          <div>
            <div class="display text-8xl">{{ accuracy() }}%</div>
            <div class="font-semibold">דיוק</div>
          </div>
        </div>

        <p class="mt-6 h-6 text-sm font-semibold" aria-live="polite">
          @switch (saveState()) {
            @case ('saving') { שומרים את הנקודות... }
            @case ('saved') { <span class="text-teal-deep">✓ הנקודות נשמרו</span> }
            @case ('error') { <span class="text-magenta">לא הצלחנו לשמור הפעם</span> }
          }
        </p>

        @if (nextLabel()) {
          <button type="button" class="btn mt-6 w-full py-4 text-xl" [class]="tone().btn" (click)="next.emit()">
            {{ nextLabel() }} <span aria-hidden="true">←</span>
          </button>
        }
        <div class="flex flex-col gap-3 sm:flex-row" [class]="nextLabel() ? 'mt-3' : 'mt-6'">
          <button
            type="button"
            class="btn flex-1 py-4 text-xl"
            [class]="nextLabel() ? 'btn-paper' : tone().btn"
            (click)="playAgain.emit()"
          >
            עוד סיבוב
          </button>
          <a routerLink="/" class="btn btn-paper flex-1 py-4 text-xl">לכל המשחקים</a>
        </div>
      </div>
    </section>
  `,
})
export class GameOver implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly fx = inject(FxService);
  private readonly sound = inject(SoundService);

  readonly game = input.required<GameId>();
  readonly score = input.required<number>();
  readonly accuracy = input.required<number>();
  /** When set, shows a primary button for games with levels. */
  readonly nextLabel = input('');
  readonly playAgain = output();
  readonly next = output();

  protected readonly shapes = SHAPES;
  protected readonly saveState = signal<SaveState>('saving');
  protected readonly tone = computed(() => TONES[gameById(this.game()).tone]);
  protected readonly stars = computed(() => (this.accuracy() >= 90 ? 3 : this.accuracy() >= 65 ? 2 : 1));
  protected readonly headline = computed(() => praise.final(this.accuracy()));

  ngOnInit() {
    this.sound.win();
    this.fx.fireworks(this.stars() === 3 ? 5000 : 2500);

    this.auth.addScore(this.game(), this.score()).subscribe({
      next: () => this.saveState.set('saved'),
      error: () => this.saveState.set('error'),
    });
  }
}
