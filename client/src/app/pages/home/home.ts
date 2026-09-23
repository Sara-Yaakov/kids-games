import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { GAMES } from '../../core/games';
import { SoundService } from '../../core/sound.service';
import { Leaderboard } from '../../shared/leaderboard';

@Component({
  selector: 'app-home',
  imports: [RouterLink, Leaderboard],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly auth = inject(AuthService);
  protected readonly sound = inject(SoundService);
  protected readonly games = GAMES;
}
