import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Brand mark: one shape per game (circle, quarter, triangle) plus an ink square. */
@Component({
  selector: 'app-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', class: 'inline-block' },
  template: `
    <svg viewBox="0 0 64 64" [style.width.px]="size()" [style.height.px]="size()">
      <circle cx="21" cy="22" r="12" fill="var(--color-teal)" stroke="var(--color-ink)" stroke-width="3" />
      <path
        d="M34 10h20v20a20 20 0 0 1-20-20z"
        fill="var(--color-orange)"
        stroke="var(--color-ink)"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <path
        d="M12 54l14-20 14 20z"
        fill="var(--color-magenta)"
        stroke="var(--color-ink)"
        stroke-width="3"
        stroke-linejoin="round"
      />
      <rect x="42" y="38" width="14" height="14" rx="2" fill="var(--color-ink)" />
    </svg>
  `,
})
export class Logo {
  readonly size = input(44);
}
