import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { GAMES } from '../../core/games';
import { GameCard } from '../../shared/game-card';
import { Leaderboard } from '../../shared/leaderboard';

@Component({
  selector: 'app-home',
  imports: [GameCard, Leaderboard],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly auth = inject(AuthService);
  protected readonly games = GAMES;

  protected greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'בוקר טוב';
    if (h < 17) return 'צהריים טובים';
    if (h < 21) return 'ערב טוב';
    return 'לילה טוב';
  }
}
