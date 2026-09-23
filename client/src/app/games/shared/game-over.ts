import { ChangeDetectionStrategy, Component, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FxService } from '../../core/fx.service';
import { GameId } from '../../core/models';
import { praise } from '../../core/praise';
import { SoundService } from '../../core/sound.service';

type SaveState = 'saving' | 'saved' | 'error';

@Component({
  selector: 'app-game-over',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card-glass mx-auto mt-6 max-w-lg animate-pop-in p-8 text-center">
      <div class="emoji animate-bounce-soft text-8xl">🏆</div>
      <h2 class="mt-2 text-4xl font-bold">{{ headline() }}</h2>

      <div class="my-5 flex justify-center gap-2 text-6xl" [attr.aria-label]="stars() + ' כוכבים מתוך 3'">
        @for (i of [0, 1, 2]; track i) {
          <span
            class="emoji animate-pop-in"
            [class.grayscale]="i >= stars()"
            [class.opacity-30]="i >= stars()"
            [style.animation-delay.ms]="300 + i * 250"
            >⭐</span
          >
        }
      </div>

      <p class="text-2xl">
        צברתם <strong class="text-4xl text-grape">{{ score() }}</strong> נקודות!
      </p>
      <p class="mt-1 text-lg text-ink/60">דיוק: {{ accuracy() }}%</p>

      <p class="mt-3 h-6 text-base font-semibold" aria-live="polite">
        @switch (saveState()) {
          @case ('saving') { שומרים את הנקודות... ⏳ }
          @case ('saved') { <span class="text-emerald-600">הנקודות נשמרו! ✅</span> }
          @case ('error') { <span class="text-berry">לא הצלחנו לשמור הפעם 😕</span> }
        }
      </p>

      <div class="mt-6 flex flex-col gap-3 sm:flex-row">
        <button type="button" class="btn-3d flex-1 border-emerald-700 bg-mint text-ink" (click)="playAgain.emit()">
          🔄 עוד סיבוב!
        </button>
        <a routerLink="/" class="btn-3d flex-1 border-grape bg-white text-grape">🏠 לכל המשחקים</a>
      </div>
    </div>
  `,
})
export class GameOver implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly fx = inject(FxService);
  private readonly sound = inject(SoundService);

  readonly game = input.required<GameId>();
  readonly score = input.required<number>();
  readonly accuracy = input.required<number>();
  readonly playAgain = output();

  protected readonly saveState = signal<SaveState>('saving');
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
