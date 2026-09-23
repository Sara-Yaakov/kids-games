import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Rubber-stamp message ("יששש!") that re-animates whenever `key` changes. */
@Component({
  selector: 'app-praise-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none fixed inset-x-0 top-1/3 z-50 flex justify-center px-4', 'aria-live': 'polite' },
  template: `
    @for (k of [key()]; track k) {
      @if (message()) {
        <div
          class="stamp display rounded-2xl border-[3px] border-ink px-8 pt-3 pb-2 text-center text-6xl shadow-ink-lg sm:text-7xl"
          [class]="tone() === 'good' ? 'bg-teal text-card' : 'bg-card text-magenta'"
        >
          {{ message() }}
        </div>
      }
    }
  `,
  styles: `
    .stamp {
      animation: stamp 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes stamp {
      0% { opacity: 0; transform: scale(1.8) rotate(-12deg); }
      18% { opacity: 1; transform: scale(1) rotate(-4deg); }
      80% { opacity: 1; transform: scale(1) rotate(-4deg); }
      100% { opacity: 0; transform: translateY(-30px) rotate(-4deg); }
    }
  `,
})
export class PraiseToast {
  readonly message = input('');
  readonly tone = input<'good' | 'bad'>('good');
  readonly key = input(0);
}
