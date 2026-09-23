import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FxService } from '../../core/fx.service';
import { praise, shuffle } from '../../core/praise';
import { SoundService } from '../../core/sound.service';
import { GameHud } from '../shared/game-hud';
import { GameOver } from '../shared/game-over';
import { GameSession } from '../shared/game-session';
import { PraiseToast } from '../shared/praise-toast';
import { CONTINENTS, COUNTRIES, Continent, ContinentId, Country, flag } from './countries.data';

const ROUNDS = 3;
const PER_ROUND = 6;

type Placed = Record<ContinentId, Country[]>;
const emptyPlaced = (): Placed => Object.fromEntries(CONTINENTS.map((c) => [c.id, []])) as unknown as Placed;

@Component({
  selector: 'app-countries',
  imports: [GameHud, GameOver, PraiseToast, CdkDropListGroup, CdkDropList, CdkDrag, CdkDragPlaceholder],
  templateUrl: './countries.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Countries {
  private readonly sound = inject(SoundService);
  private readonly fx = inject(FxService);

  protected readonly session = new GameSession();
  protected readonly continents = CONTINENTS;
  protected readonly flag = flag;
  protected readonly total = ROUNDS * PER_ROUND;

  private rounds: Country[][] = [];
  protected readonly roundIndex = signal(0);
  protected readonly tray = signal<Country[]>([]);
  protected readonly placed = signal<Placed>(emptyPlaced());
  protected readonly selected = signal<Country | null>(null);
  protected readonly wrongZone = signal<ContinentId | null>(null);
  private missed = new Set<string>();

  protected readonly doneCount = computed(() => this.roundIndex() * PER_ROUND + (PER_ROUND - this.tray().length));

  constructor() {
    this.start();
  }

  protected start() {
    const pool = shuffle(COUNTRIES).slice(0, this.total);
    this.rounds = Array.from({ length: ROUNDS }, (_, i) => pool.slice(i * PER_ROUND, (i + 1) * PER_ROUND));
    this.session.reset();
    this.load(0);
  }

  protected dropped(event: CdkDragDrop<ContinentId>) {
    if (event.previousContainer === event.container) return;
    this.place(event.item.data, event.container.data, event.container.element.nativeElement);
  }

  /** Tap-to-select fallback for kids who find dragging hard. */
  protected select(country: Country) {
    this.sound.click();
    this.sound.speak(country.name);
    this.selected.update((s) => (s?.code === country.code ? null : country));
  }

  protected zoneClicked(continent: Continent, el: HTMLElement) {
    const country = this.selected();
    if (country) this.place(country, continent.id, el);
  }

  private place(country: Country, target: ContinentId, el: HTMLElement) {
    this.selected.set(null);

    if (country.continent !== target) {
      this.missed.add(country.code);
      this.session.wrong();
      this.session.say(praise.wrong(), 'bad');
      this.sound.wrong();
      this.wrongZone.set(target);
      setTimeout(() => this.wrongZone.set(null), 500);
      return;
    }

    this.tray.update((t) => t.filter((c) => c.code !== country.code));
    this.placed.update((p) => ({ ...p, [target]: [...p[target], country] }));
    const { bonus } = this.session.correct(this.missed.has(country.code));
    this.sound.correct();
    this.fx.burstAt(el);
    this.session.say(bonus ? praise.streak(this.session.streak()) : praise.correct());
    if (bonus) this.fx.emojiRain(flag(country.code));

    if (!this.tray().length) setTimeout(() => this.next(), 1300);
  }

  private next() {
    const next = this.roundIndex() + 1;
    if (next >= ROUNDS) {
      this.session.finish();
      return;
    }
    this.sound.whoosh();
    this.load(next);
  }

  private load(i: number) {
    this.roundIndex.set(i);
    this.tray.set(this.rounds[i]);
    this.placed.set(emptyPlaced());
    this.missed.clear();
  }
}
