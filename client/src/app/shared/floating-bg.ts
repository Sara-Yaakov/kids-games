import { ChangeDetectionStrategy, Component } from '@angular/core';

const ITEMS = ['🦁', '🎸', '🌍', '⭐', '🐘', '🎺', '🗺️', '🦒', '🥁', '🌈', '🐬', '🎹', '🚀', '🦋'];

@Component({
  selector: 'app-floating-bg',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pointer-events-none fixed inset-0 -z-10 overflow-hidden', 'aria-hidden': 'true' },
  template: `
    <div class="absolute -top-32 -right-32 size-96 rounded-full bg-sunny/40 blur-3xl"></div>
    <div class="absolute bottom-0 -left-40 size-[28rem] rounded-full bg-sky/40 blur-3xl"></div>
    <div class="absolute top-1/3 left-1/3 size-80 rounded-full bg-mint/30 blur-3xl"></div>
    @for (item of items; track $index) {
      <span
        class="emoji absolute animate-float opacity-25"
        [style.top.%]="item.top"
        [style.left.%]="item.left"
        [style.font-size.rem]="item.size"
        [style.animation-delay.s]="item.delay"
        >{{ item.emoji }}</span
      >
    }
  `,
})
export class FloatingBg {
  protected readonly items = ITEMS.map((emoji, i) => ({
    emoji,
    top: (i * 37) % 95,
    left: (i * 53 + 7) % 95,
    size: 2 + ((i * 7) % 4),
    delay: -(i * 0.7),
  }));
}
