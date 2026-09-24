import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GAMES, TONES } from '../../core/games';
import { SoundService } from '../../core/sound.service';
import { ANIMALS } from '../../games/animals/animals.data';
import { COUNTRIES } from '../../games/countries/countries.data';
import { INSTRUMENTS } from '../../games/instruments/instruments.data';
import { LEVELS } from '../../games/opposites/opposites.data';
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
    { value: ANIMALS.length, label: 'חיות', tone: TONES.orange.text },
    { value: INSTRUMENTS.length, label: 'כלי נגינה', tone: TONES.magenta.text },
    { value: COUNTRIES.length, label: 'מדינות ודגלים', tone: TONES.teal.text },
    { value: LEVELS.reduce((n, l) => n + l.pairs.length, 0), label: 'זוגות הפכים', tone: TONES.ink.text },
  ];

  protected readonly previews: Record<string, string[]> = {
    animals: ['🦒', '🐘', '🦜', '🐙'],
    instruments: ['🎹', '🎻', '🥁', '🎺'],
    countries: ['🇮🇱', '🇯🇵', '🇧🇷', '🇰🇪'],
    opposites: ['🔥', '🧊', '🐘', '🐭'],
  };

  protected readonly steps = [
    { title: 'נרשמים', text: 'בוחרים שם משתמש וסיסמה. זה כל מה שצריך.' },
    { title: 'בוחרים משחק', text: 'כל משחק מלמד נושא אחר: חיות, כלי נגינה, מדינות או הפכים.' },
    {
      title: 'צוברים נקודות',
      text: 'תשובה נכונה בניסיון הראשון שווה 10 נקודות, ושלוש תשובות נכונות ברצף מוסיפות בונוס.',
    },
  ];
}
