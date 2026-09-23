import { ChangeDetectionStrategy, Component, OnInit, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FxService } from '../../core/fx.service';
import { SoundService } from '../../core/sound.service';

type Mode = 'login' | 'register';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly sound = inject(SoundService);
  private readonly fx = inject(FxService);

  /** Query params: ?mode=register&returnUrl=/games/animals */
  readonly modeParam = input<string>(undefined, { alias: 'mode' });
  readonly returnUrl = input<string>();

  protected readonly tabs: { id: Mode; label: string }[] = [
    { id: 'login', label: 'כניסה' },
    { id: 'register', label: 'משתמש חדש' },
  ];
  protected readonly mode = signal<Mode>('login');
  protected readonly username = signal('');
  protected readonly password = signal('');
  protected readonly error = signal('');
  protected readonly loading = signal(false);
  protected readonly shake = signal(false);

  ngOnInit() {
    if (this.modeParam() === 'register') this.mode.set('register');
  }

  protected setMode(mode: Mode) {
    this.sound.click();
    this.mode.set(mode);
    this.error.set('');
  }

  protected submit() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set('');

    const username = this.username().trim();
    const request =
      this.mode() === 'login'
        ? this.auth.login(username, this.password())
        : this.auth.register(username, this.password());

    request.subscribe({
      next: () => {
        this.sound.win();
        this.fx.fireworks(1500);
        // Only follow in-app paths to avoid open redirects.
        const url = this.returnUrl() ?? '/';
        const target = url.startsWith('/') && !url.startsWith('//') ? url : '/';
        void this.router.navigateByUrl(target);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(err.error?.error ?? 'אין חיבור לשרת, נסו שוב עוד רגע');
        this.sound.wrong();
        this.shake.set(true);
        setTimeout(() => this.shake.set(false), 500);
      },
    });
  }
}
