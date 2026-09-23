import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Big floating message ("יששש!") that re-animates whenever `key` changes. */
@Component({
  selector: 'app-praise-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none fixed inset-x-0 top-1/3 z-50 flex justify-center', 'aria-live': 'polite' },
  template: `
    @for (k of [key()]; track k) {
      @if (message()) {
        <div
          class="toast text-outline rounded-3xl px-8 py-4 text-center text-4xl font-bold sm:text-6xl"
          [class]="tone() === 'good' ? 'text-sunny' : 'text-white'"
        >
          {{ message() }}
        </div>
      }
    }
  `,
  styles: `
    .toast {
      animation: toast 1.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      text-shadow: 0 6px 0 rgb(30 17 71 / 0.35);
    }
    @keyframes toast {
      0% { opacity: 0; transform: scale(0.3) rotate(-8deg); }
      25% { opacity: 1; transform: scale(1.1) rotate(3deg); }
      40% { transform: scale(1) rotate(0); }
      80% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-60px) scale(0.9); }
    }
  `,
})
export class PraiseToast {
  readonly message = input('');
  readonly tone = input<'good' | 'bad'>('good');
  readonly key = input(0);
}
