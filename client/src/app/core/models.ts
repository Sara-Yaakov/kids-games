export type GameId = 'animals' | 'instruments' | 'countries' | 'opposites';

export interface User {
  id: string;
  username: string;
  scores: Record<GameId, number>;
  total: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LeaderboardEntry {
  username: string;
  total: number;
}
