import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GAMES } from '../../core/games';
import { SoundService } from '../../core/sound.service';
import { ANIMALS } from '../../games/animals/animals.data';
import { COUNTRIES } from '../../games/countries/countries.data';
import { INSTRUMENTS } from '../../games/instruments/instruments.data';
import { Leaderboard } from '../../shared/leaderboard';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, Leaderboard],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Landing {
  protected readonly sound = inject(SoundService);
  protected readonly games = GAMES;

  protected readonly stats = [
    { value: ANIMALS.length, label: 'חיות', emoji: '🐾' },
    { value: INSTRUMENTS.length, label: 'כלי נגינה', emoji: '🎵' },
    { value: COUNTRIES.length, label: 'מדינות', emoji: '🚩' },
  ];

  protected readonly previews: Record<string, string[]> = {
    animals: ANIMALS.slice(0, 5).map((a) => a.emoji),
    instruments: INSTRUMENTS.slice(0, 5).map((i) => i.emoji),
    countries: ['🇮🇱', '🇯🇵', '🇧🇷', '🇫🇷', '🇦🇺'],
  };

  protected readonly steps = [
    { emoji: '😎', title: 'בוחרים שם גיבור', text: 'שם משתמש וסיסמה, וזהו. בלי מייל ובלי תשלום.' },
    { emoji: '🎮', title: 'משחקים ולומדים', text: 'חיות, כלי נגינה ומדינות, עם צלילים וזיקוקים.' },
    { emoji: '🏆', title: 'צוברים נקודות', text: 'רצפים שווים בונוס. מי יגיע לראש היכל התהילה?' },
  ];

  protected readonly orbit = ['🦁', '🎸', '🌍', '🦒', '🥁', '🗺️'];
}
