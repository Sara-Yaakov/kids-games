import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FxService } from '../../core/fx.service';
import { praise, shuffle } from '../../core/praise';
import { SoundService } from '../../core/sound.service';
import { GameHud } from '../shared/game-hud';
import { GameOver } from '../shared/game-over';
import { GameSession } from '../shared/game-session';
import { PraiseToast } from '../shared/praise-toast';
import { ANIMALS, Animal } from './animals.data';

const ROUNDS = 3;
const PAIRS_PER_ROUND = 4;
const CARD_COLORS = ['bg-sunny/60', 'bg-sky/50', 'bg-bubblegum/40', 'bg-mint/50'];

@Component({
  selector: 'app-animals',
  imports: [GameHud, GameOver, PraiseToast],
  templateUrl: './animals.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Animals {
  private readonly sound = inject(SoundService);
  private readonly fx = inject(FxService);

  protected readonly session = new GameSession();
  protected readonly total = ROUNDS * PAIRS_PER_ROUND;
  protected readonly colors = CARD_COLORS;

  private rounds: Animal[][] = [];
  protected readonly roundIndex = signal(0);
  protected readonly animals = signal<Animal[]>([]);
  protected readonly names = signal<Animal[]>([]);
  protected readonly matched = signal<ReadonlySet<string>>(new Set());
  protected readonly selectedAnimal = signal<string | null>(null);
  protected readonly selectedName = signal<string | null>(null);
  protected readonly wrongPair = signal<[string, string] | null>(null);
  private missed = new Set<string>();

  protected readonly doneCount = computed(() => this.roundIndex() * PAIRS_PER_ROUND + this.matched().size);

  constructor() {
    this.start();
  }

  protected start() {
    const pool = shuffle(ANIMALS).slice(0, this.total);
    this.rounds = Array.from({ length: ROUNDS }, (_, i) => pool.slice(i * PAIRS_PER_ROUND, (i + 1) * PAIRS_PER_ROUND));
    this.session.reset();
    this.loadRound(0);
  }

  protected pickAnimal(animal: Animal, el: HTMLElement) {
    if (this.matched().has(animal.id)) {
      this.sound.speak(animal.name);
      return;
    }
    this.sound.click();
    this.selectedAnimal.set(animal.id);
    this.tryMatch(el);
  }

  protected pickName(animal: Animal, el: HTMLElement) {
    this.sound.click();
    this.selectedName.set(animal.id);
    this.tryMatch(el);
  }

  private tryMatch(el: HTMLElement) {
    const a = this.selectedAnimal();
    const n = this.selectedName();
    if (!a || !n) return;

    this.selectedAnimal.set(null);
    this.selectedName.set(null);

    if (a !== n) {
      this.missed.add(a).add(n);
      this.session.wrong();
      this.session.say(praise.wrong(), 'bad');
      this.sound.wrong();
      this.wrongPair.set([a, n]);
      setTimeout(() => this.wrongPair.set(null), 500);
      return;
    }

    const animal = this.animals().find((x) => x.id === a)!;
    const { bonus } = this.session.correct(this.missed.has(a));
    this.matched.update((s) => new Set(s).add(a));
    this.sound.correct();
    this.sound.speak(animal.name);
    this.fx.burstAt(el);
    this.session.say(bonus ? praise.streak(this.session.streak()) : praise.correct());
    if (bonus) this.fx.emojiRain(animal.emoji);

    if (this.matched().size === PAIRS_PER_ROUND) setTimeout(() => this.nextRound(), 1400);
  }

  private nextRound() {
    const next = this.roundIndex() + 1;
    if (next >= ROUNDS) {
      this.session.finish();
      return;
    }
    this.sound.whoosh();
    this.loadRound(next);
  }

  private loadRound(index: number) {
    const animals = this.rounds[index];
    this.roundIndex.set(index);
    this.animals.set(animals);
    this.names.set(shuffle(animals));
    this.matched.set(new Set());
    this.missed.clear();
  }

  protected isWrong(id: string) {
    return this.wrongPair()?.includes(id) ?? false;
  }
}
