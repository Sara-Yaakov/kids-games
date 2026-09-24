import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FxService } from '../../core/fx.service';
import { praise, shuffle } from '../../core/praise';
import { SoundService } from '../../core/sound.service';
import { GameHud } from '../shared/game-hud';
import { GameOver } from '../shared/game-over';
import { GameSession } from '../shared/game-session';
import { PraiseToast } from '../shared/praise-toast';
import { LEVELS, Level, Word } from './opposites.data';

const QUESTIONS = 8;
const OPTIONS = 4;
const LEVEL_STYLES = ['bg-teal-soft', 'bg-orange-soft', 'bg-magenta-soft'];

interface Question {
  prompt: Word;
  answer: Word;
  options: Word[];
}

@Component({
  selector: 'app-opposites',
  imports: [GameHud, GameOver, PraiseToast],
  templateUrl: './opposites.html',
  styleUrl: './opposites.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Opposites {
  private readonly sound = inject(SoundService);
  private readonly fx = inject(FxService);

  protected readonly levels = LEVELS;
  protected readonly levelStyles = LEVEL_STYLES;
  protected readonly total = QUESTIONS;
  protected readonly session = new GameSession();

  protected readonly level = signal<Level | null>(null);
  protected readonly questions = signal<Question[]>([]);
  protected readonly index = signal(0);
  protected readonly question = computed(() => this.questions()[this.index()]);
  protected readonly solved = signal(false);
  protected readonly wrong = signal<ReadonlySet<string>>(new Set());

  protected readonly nextLevel = computed(() => {
    const i = LEVELS.findIndex((l) => l.id === this.level()?.id);
    return LEVELS[i + 1] ?? null;
  });

  protected start(level: Level) {
    this.sound.click();
    this.level.set(level);
    this.questions.set(this.buildQuestions(level));
    this.session.reset();
    this.load(0);
  }

  protected choose(word: Word, el: HTMLElement) {
    const q = this.question();
    if (this.solved() || this.wrong().has(word.text)) return;

    if (word.text !== q.answer.text) {
      this.wrong.update((s) => new Set(s).add(word.text));
      this.session.wrong();
      this.session.say(praise.wrong(), 'bad');
      this.sound.wrong();
      return;
    }

    this.solved.set(true);
    this.sound.correct();
    this.sound.speak(`${q.prompt.text}, ${q.answer.text}`);
    this.fx.burstAt(el);
    const { bonus } = this.session.correct(this.wrong().size > 0);
    this.session.say(bonus ? praise.streak(this.session.streak()) : praise.correct());
    if (bonus) this.fx.emojiRain(q.answer.emoji);

    setTimeout(() => this.advance(), 1600);
  }

  private advance() {
    const next = this.index() + 1;
    if (next >= QUESTIONS) this.session.finish();
    else {
      this.sound.whoosh();
      this.load(next);
    }
  }

  private load(i: number) {
    this.index.set(i);
    this.solved.set(false);
    this.wrong.set(new Set());
  }

  /** Random direction per pair; distractors come from other pairs in the same level. */
  private buildQuestions(level: Level): Question[] {
    return shuffle(level.pairs)
      .slice(0, QUESTIONS)
      .map((pair) => {
        const [prompt, answer] = Math.random() < 0.5 ? pair : [pair[1], pair[0]];
        const distractors = shuffle(level.pairs.filter((other) => other !== pair))
          .slice(0, OPTIONS - 1)
          .map((other) => other[Math.round(Math.random())]);
        return { prompt, answer, options: shuffle([answer, ...distractors]) };
      });
  }
}
