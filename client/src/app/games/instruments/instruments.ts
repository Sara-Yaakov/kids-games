import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FxService } from '../../core/fx.service';
import { praise, shuffle } from '../../core/praise';
import { SoundService } from '../../core/sound.service';
import { GameHud } from '../shared/game-hud';
import { GameOver } from '../shared/game-over';
import { GameSession } from '../shared/game-session';
import { PraiseToast } from '../shared/praise-toast';
import { INSTRUMENTS, Instrument } from './instruments.data';

const ROUNDS = 10;
const BALLOONS = 4;
const EAR_ROUND_EVERY = 3;
const BALLOON_COLORS = ['#ff4fa3', '#3ec5ff', '#ffd23f', '#22e3a0', '#ff8a2b', '#a78bfa'];

interface Round {
  target: Instrument;
  options: Instrument[];
  byEar: boolean;
}

interface Balloon {
  instrument: Instrument;
  color: string;
  delay: number;
}

@Component({
  selector: 'app-instruments',
  imports: [GameHud, GameOver, PraiseToast],
  templateUrl: './instruments.html',
  styleUrl: './instruments.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Instruments {
  private readonly sound = inject(SoundService);
  private readonly fx = inject(FxService);

  protected readonly session = new GameSession();
  protected readonly total = ROUNDS;

  private rounds: Round[] = [];
  protected readonly index = signal(0);
  protected readonly round = computed(() => this.rounds[this.index()]);
  protected readonly balloons = signal<Balloon[]>([]);
  protected readonly popped = signal<string | null>(null);
  protected readonly deflated = signal<ReadonlySet<string>>(new Set());
  private hadMistake = false;

  constructor() {
    this.start();
  }

  protected start() {
    this.rounds = this.buildRounds();
    this.session.reset();
    this.load(0);
  }

  protected announce() {
    const { target, byEar } = this.round();
    if (byEar) this.sound.instrument(target.voice);
    else this.sound.speak(`איפה ה${target.name}?`);
  }

  protected hear(instrument: Instrument) {
    this.sound.instrument(instrument.voice);
  }

  protected pop(balloon: Balloon, el: HTMLElement) {
    const id = balloon.instrument.id;
    if (this.popped() || this.deflated().has(id)) return;
    const { target } = this.round();

    if (id !== target.id) {
      this.hadMistake = true;
      this.deflated.update((s) => new Set(s).add(id));
      this.session.wrong();
      this.session.say(praise.wrong(), 'bad');
      this.sound.wrong();
      return;
    }

    this.popped.set(id);
    this.sound.pop();
    setTimeout(() => this.sound.instrument(target.voice), 150);
    this.fx.burstAt(el);
    const { bonus } = this.session.correct(this.hadMistake);
    this.session.say(bonus ? praise.streak(this.session.streak()) : praise.correct());
    if (bonus) this.fx.emojiRain(target.emoji);

    setTimeout(() => this.next(), 1800);
  }

  private next() {
    const next = this.index() + 1;
    if (next >= ROUNDS) this.session.finish();
    else this.load(next);
  }

  private load(i: number) {
    this.index.set(i);
    this.popped.set(null);
    this.deflated.set(new Set());
    this.hadMistake = false;
    const colors = shuffle(BALLOON_COLORS);
    this.balloons.set(
      this.rounds[i].options.map((instrument, j) => ({ instrument, color: colors[j], delay: j * 0.15 })),
    );
    setTimeout(() => this.announce(), 600);
  }

  private buildRounds(): Round[] {
    const targets = shuffle(INSTRUMENTS);
    const earTargets = shuffle(INSTRUMENTS.filter((x) => x.earFriendly));

    return Array.from({ length: ROUNDS }, (_, i) => {
      const byEar = (i + 1) % EAR_ROUND_EVERY === 0;
      const target = byEar ? earTargets[i % earTargets.length] : targets[i % targets.length];
      // In ear rounds, only offer instruments with a clearly different sound.
      const pool = INSTRUMENTS.filter(
        (x) => x.id !== target.id && x.voice !== target.voice && (!byEar || x.earFriendly),
      );
      const options = shuffle([target, ...shuffle(pool).slice(0, BALLOONS - 1)]);
      return { target, options, byEar };
    });
  }
}
