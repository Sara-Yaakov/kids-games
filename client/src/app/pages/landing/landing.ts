import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GAMES, TONES } from '../../core/games';
import { SoundService } from '../../core/sound.service';
import { ANIMALS } from '../../games/animals/animals.data';
import { COUNTRIES } from '../../games/countries/countries.data';
import { INSTRUMENTS } from '../../games/instruments/instruments.data';
import { GameCard } from '../../shared/game-card';
import { Leaderboard } from '../../shared/leaderboard';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, GameCard, Leaderboard],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  protected readonly sound = inject(SoundService);
  protected readonly games = GAMES;

  protected readonly stats = [
    { value: ANIMALS.length, label: 'חיות לזהות', tone: TONES.orange.text },
    { value: INSTRUMENTS.length, label: 'כלי נגינה לשמוע', tone: TONES.magenta.text },
    { value: COUNTRIES.length, label: 'מדינות למפות', tone: TONES.teal.text },
  ];

  protected readonly previews: Record<string, string[]> = {
    animals: ['🦒', '🐘', '🦜', '🐙'],
    instruments: ['🎹', '🎻', '🥁', '🎺'],
    countries: ['🇮🇱', '🇯🇵', '🇧🇷', '🇰🇪'],
  };

  protected readonly steps = [
    { title: 'בוחרים שם גיבור', text: 'שם משתמש וסיסמה, וזהו. בלי מייל ובלי תשלום.' },
    { title: 'משחקים ולומדים', text: 'חיות, כלי נגינה ומדינות, עם צלילים וזיקוקים.' },
    { title: 'צוברים נקודות', text: 'רצף של תשובות נכונות שווה בונוס. מי יגיע לראש הטבלה?' },
  ];
}
