import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { GAMES } from '../../core/games';
import { SoundService } from '../../core/sound.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly auth = inject(AuthService);
  protected readonly sound = inject(SoundService);
  protected readonly games = GAMES;
  protected readonly leaderboard = rxResource({ stream: () => this.auth.leaderboard() });
  protected readonly medals = ['🥇', '🥈', '🥉'];
}
