import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, tap } from 'rxjs';
import { AuthResponse, GameId, LeaderboardEntry, User } from './models';
import { storage } from './storage';

const TOKEN_KEY = 'token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  readonly token = signal(storage.get(TOKEN_KEY));
  readonly user = signal<User | null>(null);
  readonly isLoggedIn = computed(() => !!this.token());

  register(username: string, password: string) {
    return this.http.post<AuthResponse>('/api/auth/register', { username, password }).pipe(tap((r) => this.setSession(r)));
  }

  login(username: string, password: string) {
    return this.http.post<AuthResponse>('/api/auth/login', { username, password }).pipe(tap((r) => this.setSession(r)));
  }

  /** Restores the user on page load; drops a stale token. */
  async restore() {
    if (!this.token()) return;
    try {
      this.user.set(await firstValueFrom(this.http.get<User>('/api/me')));
    } catch {
      this.logout();
    }
  }

  addScore(game: GameId, points: number): Observable<User> {
    return this.http.post<User>('/api/scores', { game, points }).pipe(tap((u) => this.user.set(u)));
  }

  leaderboard() {
    return this.http.get<LeaderboardEntry[]>('/api/leaderboard');
  }

  logout() {
    storage.remove(TOKEN_KEY);
    this.token.set(null);
    this.user.set(null);
    void this.router.navigate(['/login']);
  }

  private setSession({ token, user }: AuthResponse) {
    storage.set(TOKEN_KEY, token);
    this.token.set(token);
    this.user.set(user);
  }
}
