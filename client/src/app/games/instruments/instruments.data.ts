import { InstrumentVoice } from '../../core/sound.service';

export interface Instrument {
  id: string;
  name: string;
  emoji: string;
  voice: InstrumentVoice;
  /** Sounds distinct enough to be guessed by ear alone. */
  earFriendly?: boolean;
}

export const INSTRUMENTS: Instrument[] = [
  { id: 'piano', name: 'פסנתר', emoji: '🎹', voice: 'piano', earFriendly: true },
  { id: 'guitar', name: 'גיטרה', emoji: '🎸', voice: 'guitar', earFriendly: true },
  { id: 'violin', name: 'כינור', emoji: '🎻', voice: 'violin', earFriendly: true },
  { id: 'drum', name: 'תוף', emoji: '🥁', voice: 'drum', earFriendly: true },
  { id: 'trumpet', name: 'חצוצרה', emoji: '🎺', voice: 'trumpet', earFriendly: true },
  { id: 'bell', name: 'פעמון', emoji: '🔔', voice: 'bell', earFriendly: true },
  { id: 'maracas', name: 'מרקס', emoji: '🪇', voice: 'maracas', earFriendly: true },
  { id: 'saxophone', name: 'סקסופון', emoji: '🎷', voice: 'saxophone' },
  { id: 'flute', name: 'חליל', emoji: '🪈', voice: 'flute' },
  { id: 'accordion', name: 'אקורדיון', emoji: '🪗', voice: 'accordion' },
  { id: 'banjo', name: "בנג'ו", emoji: '🪕', voice: 'banjo' },
  { id: 'darbuka', name: 'דרבוקה', emoji: '🪘', voice: 'darbuka' },
];
