import { GameId } from './models';

export type Tone = 'teal' | 'orange' | 'magenta';

/** Full class strings per tone, so Tailwind can see them. */
export const TONES: Record<Tone, { solid: string; soft: string; text: string; btn: string; onSolid: string }> = {
  teal: { solid: 'bg-teal', soft: 'bg-teal-soft', text: 'text-teal-deep', btn: 'btn-teal', onSolid: 'text-card' },
  orange: { solid: 'bg-orange', soft: 'bg-orange-soft', text: 'text-orange-deep', btn: 'btn-orange', onSolid: 'text-ink' },
  magenta: { solid: 'bg-magenta', soft: 'bg-magenta-soft', text: 'text-magenta', btn: 'btn-magenta', onSolid: 'text-card' },
};

export interface GameInfo {
  id: GameId;
  number: string;
  title: string;
  tagline: string;
  emoji: string;
  tone: Tone;
}

export const GAMES: GameInfo[] = [
  { id: 'animals', number: '01', title: 'ספארי השמות', tagline: 'מתאימים כל חיה לשם שלה', emoji: '🦁', tone: 'orange' },
  {
    id: 'instruments',
    number: '02',
    title: 'בלונים מוזיקליים',
    tagline: 'מזהים כלי נגינה לפי המראה והצליל',
    emoji: '🎸',
    tone: 'magenta',
  },
  { id: 'countries', number: '03', title: 'מסע סביב העולם', tagline: 'מתאימים כל מדינה ליבשת שלה', emoji: '🌍', tone: 'teal' },
];

export const gameById = (id: GameId) => GAMES.find((g) => g.id === id)!;
