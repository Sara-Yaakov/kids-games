import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../core/auth.service';

const PODIUM = ['bg-orange text-ink', 'bg-teal text-card', 'bg-magenta text-card'];

@Component({
  selector: 'app-leaderboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="panel mx-auto max-w-2xl overflow-hidden bg-card">
      <header class="flex items-center justify-between border-b-[3px] border-ink bg-ink px-6 py-4 text-paper">
        <h2 class="display text-5xl">היכל התהילה</h2>
        <span class="emoji text-4xl" aria-hidden="true">🏆</span>
      </header>

      @if (board.hasValue() && board.value().length) {
        <ol class="divide-y-2 divide-dashed divide-ink/30">
          @for (row of board.value(); track row.username; let i = $index) {
            <li class="flex items-center gap-4 px-6 py-3" [class.bg-orange-soft]="row.username === auth.user()?.username">
              <span
                class="display grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-ink text-3xl"
                [class]="podium[i] ?? 'bg-card'"
                >{{ i + 1 }}</span
              >
              <span class="flex-1 truncate text-xl font-semibold">
                {{ row.username }}
                @if (row.username === auth.user()?.username) {
                  <span class="sticker ms-2 bg-card text-xs">זה אני</span>
                }
              </span>
              <span class="display text-4xl">{{ row.total }}</span>
            </li>
          }
        </ol>
      } @else if (board.isLoading()) {
        <p class="px-6 py-8 text-center text-lg">טוענים את האלופים...</p>
      } @else {
        <p class="px-6 py-8 text-center text-lg">הטבלה עוד ריקה. המקום הראשון מחכה לכם.</p>
      }
    </section>
  `,
})
export class Leaderboard {
  protected readonly auth = inject(AuthService);
  protected readonly board = rxResource({ stream: () => this.auth.leaderboard() });
  protected readonly podium = PODIUM;
}
