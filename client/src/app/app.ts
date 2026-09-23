import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { SoundService } from './core/sound.service';
import { FloatingBg } from './shared/floating-bg';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FloatingBg],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly sound = inject(SoundService);
}
