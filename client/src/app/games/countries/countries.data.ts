export type ContinentId = 'europe' | 'asia' | 'africa' | 'northAmerica' | 'southAmerica' | 'oceania';

export interface Continent {
  id: ContinentId;
  name: string;
  emoji: string;
  color: string;
}

export interface Country {
  code: string;
  name: string;
  continent: ContinentId;
}

export const CONTINENTS: Continent[] = [
  { id: 'europe', name: 'אירופה', emoji: '🏰', color: 'bg-sky' },
  { id: 'asia', name: 'אסיה', emoji: '🏯', color: 'bg-bubblegum' },
  { id: 'africa', name: 'אפריקה', emoji: '🦁', color: 'bg-tangerine' },
  { id: 'northAmerica', name: 'צפון אמריקה', emoji: '🗽', color: 'bg-grape' },
  { id: 'southAmerica', name: 'דרום אמריקה', emoji: '🦜', color: 'bg-mint' },
  { id: 'oceania', name: 'אוקיאניה', emoji: '🦘', color: 'bg-sunny' },
];

const c = (continent: ContinentId, list: [code: string, name: string][]): Country[] =>
  list.map(([code, name]) => ({ code, name, continent }));

export const COUNTRIES: Country[] = [
  ...c('europe', [
    ['FR', 'צרפת'],
    ['IT', 'איטליה'],
    ['ES', 'ספרד'],
    ['DE', 'גרמניה'],
    ['GB', 'בריטניה'],
    ['GR', 'יוון'],
    ['NL', 'הולנד'],
    ['SE', 'שוודיה'],
    ['PT', 'פורטוגל'],
    ['CH', 'שווייץ'],
    ['NO', 'נורווגיה'],
    ['PL', 'פולין'],
  ]),
  ...c('asia', [
    ['JP', 'יפן'],
    ['CN', 'סין'],
    ['IN', 'הודו'],
    ['KR', 'קוריאה הדרומית'],
    ['TH', 'תאילנד'],
    ['IL', 'ישראל'],
    ['VN', 'וייטנאם'],
    ['ID', 'אינדונזיה'],
    ['PH', 'הפיליפינים'],
    ['MN', 'מונגוליה'],
  ]),
  ...c('africa', [
    ['EG', 'מצרים'],
    ['KE', 'קניה'],
    ['NG', 'ניגריה'],
    ['ZA', 'דרום אפריקה'],
    ['MA', 'מרוקו'],
    ['ET', 'אתיופיה'],
    ['GH', 'גאנה'],
    ['TZ', 'טנזניה'],
  ]),
  ...c('northAmerica', [
    ['US', 'ארצות הברית'],
    ['CA', 'קנדה'],
    ['MX', 'מקסיקו'],
    ['CU', 'קובה'],
    ['JM', "ג'מייקה"],
    ['PA', 'פנמה'],
  ]),
  ...c('southAmerica', [
    ['BR', 'ברזיל'],
    ['AR', 'ארגנטינה'],
    ['CL', "צ'ילה"],
    ['PE', 'פרו'],
    ['CO', 'קולומביה'],
    ['UY', 'אורוגוואי'],
  ]),
  ...c('oceania', [
    ['AU', 'אוסטרליה'],
    ['NZ', 'ניו זילנד'],
    ['FJ', "פיג'י"],
    ['PG', 'פפואה גינאה החדשה'],
    ['WS', 'סמואה'],
  ]),
];

/** "IL" → 🇮🇱 via regional indicator symbols. */
export const flag = (code: string) =>
  String.fromCodePoint(...[...code].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
