const pick = <T>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

const CORRECT = [
  'יששש! 🎯',
  'בול בפוני! 🎯',
  'מוח של גאון! 🧠',
  'אש! 🔥',
  'פצצה! 💥',
  'סופר-סטאר! ⭐',
  'וואו, מהמם! 🤩',
  'איזה כישרון! 🏆',
  'על הכיפאק! 🙌',
  'מושלם! 💯',
  'טיל! 🚀',
] as const;

const WRONG = [
  'כמעט! נסו שוב 💪',
  'אופס, לא נורא! 😅',
  'חם חם... עוד ניסיון! 🔥',
  'לא הפעם, אבל אתם קרובים! 🤏',
  'טעויות זה חלק מהכיף! 🌈',
] as const;

export const praise = {
  correct: () => pick(CORRECT),
  wrong: () => pick(WRONG),
  streak: (n: number) => `רצף של ${n}! 🔥 בונוס!`,
  final(percent: number) {
    if (percent >= 90) return 'אלופי העולם! 🏆👑';
    if (percent >= 70) return 'מדהים! כמעט מושלם! 🌟';
    if (percent >= 50) return 'יפה מאוד! ממשיכים להתאמן 💪';
    return 'התחלה טובה! בפעם הבאה זה יהיה עוד יותר טוב 🌱';
  },
};

export const shuffle = <T>(list: readonly T[]): T[] => {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
