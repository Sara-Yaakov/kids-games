import { GameId } from './models';

export interface GameInfo {
  id: GameId;
  title: string;
  tagline: string;
  emoji: string;
  gradient: string;
}

export const GAMES: GameInfo[] = [
  {
    id: 'animals',
    title: 'ספארי השמות',
    tagline: 'התאימו כל חיה לשם שלה',
    emoji: '🦁',
    gradient: 'from-tangerine to-sunny',
  },
  {
    id: 'instruments',
    title: 'בלונים מוזיקליים',
    tagline: 'פוצצו את הבלון עם הכלי הנכון',
    emoji: '🎸',
    gradient: 'from-bubblegum to-grape',
  },
  {
    id: 'countries',
    title: 'מסע סביב העולם',
    tagline: 'גררו כל מדינה ליבשת שלה',
    emoji: '🌍',
    gradient: 'from-sky to-mint',
  },
];
