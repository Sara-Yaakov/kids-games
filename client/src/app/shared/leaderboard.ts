import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-leaderboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="card-glass mx-auto max-w-xl p-6">
      <h2 class="mb-4 text-center text-3xl font-bold">🏆 היכל התהילה</h2>
      @if (board.hasValue() && board.value().length) {
        <ol class="flex flex-col gap-2">
          @for (row of board.value(); track row.username; let i = $index) {
            <li
              class="flex items-center gap-3 rounded-2xl px-4 py-2 text-xl"
              [class]="row.username === auth.user()?.username ? 'bg-sunny/50 font-bold' : 'bg-grape/5'"
            >
              <span class="emoji w-8 text-center text-2xl">{{ medals[i] ?? i + 1 }}</span>
              <span class="flex-1 truncate">{{ row.username }}</span>
              <span class="font-bold text-grape">{{ row.total }} ⭐</span>
            </li>
          }
        </ol>
      } @else if (board.isLoading()) {
        <p class="text-center text-lg">טוען אלופים... ⏳</p>
      } @else {
        <p class="text-center text-lg">עוד אין אלופים. אולי זה יהיה אתם? 😉</p>
      }
    </section>
  `,
})
export class Leaderboard {
  protected readonly auth = inject(AuthService);
  protected readonly board = rxResource({ stream: () => this.auth.leaderboard() });
  protected readonly medals = ['🥇', '🥈', '🥉'];
}
