import { Component, OnDestroy, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../shared/services/content.service';

/** Décalages fixes des tirages de la rafale (même tirage que la maquette). */
const BURST_OFFSETS: { r: number; ox: number; oy: number }[] = [
  { r: 1.23, ox: 0.12, oy: 0.848 }, { r: -1.25, ox: 0.016, oy: 0.175 }, { r: 0.86, ox: 0.024, oy: 0.26 },
  { r: -1.71, ox: -0.812, oy: -0.393 }, { r: 0.73, ox: 0.619, oy: 0.387 }, { r: -0.66, ox: 0.964, oy: 0.93 },
  { r: 1.52, ox: 0.231, oy: -0.685 }, { r: -0.62, ox: 0.057, oy: -0.881 }, { r: 0.87, ox: -0.516, oy: -0.94 },
  { r: -1.25, ox: -0.119, oy: 0.685 }, { r: 1.33, ox: 0.281, oy: -0.0 }, { r: -1.53, ox: -0.085, oy: -0.444 },
  { r: 2.0, ox: 0.991, oy: 0.68 }, { r: -1.59, ox: -0.369, oy: -0.541 }, { r: 1.0, ox: -0.86, oy: 0.533 },
  { r: -1.16, ox: 0.693, oy: -0.227 }, { r: 1.94, ox: 0.695, oy: -0.999 }, { r: -0.89, ox: 0.821, oy: -0.06 },
  { r: 1.97, ox: -0.205, oy: -0.854 }, { r: -1.48, ox: 0.557, oy: -0.46 }, { r: 0.72, ox: -0.335, oy: 0.928 },
  { r: -1.66, ox: -0.764, oy: -0.507 }, { r: 0.74, ox: -0.88, oy: 0.594 }, { r: -0.85, ox: 0.119, oy: -0.105 },
  { r: 0.87, ox: 0.464, oy: -0.738 },
];

const BURST_GOAL = 5;
const DELTA = 0.18;
const ENTER = 0.16;
const GOAL_HOLD = 0.7;
const LAST_HOLD = 1.2;
const STILL_IN = 0.6;
const FIRST_BASE = 1.7;
const REPLAY_BASE = 0.15;
const INTRO_MS = 1600;

const FRAME_T = BURST_OFFSETS.map((_, i) => i * DELTA + (i > BURST_GOAL ? GOAL_HOLD : 0));
const STILL_AT = FRAME_T[FRAME_T.length - 1] + ENTER + LAST_HOLD;
const CYCLE_LENGTH = STILL_AT + STILL_IN + 0.1;
const GOAL_AT = FRAME_T[BURST_GOAL] + ENTER;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  readonly tickerItems = ['Football', 'Loire 42', 'Matchs', 'Portraits', 'Catégories jeunes'];
  readonly tickerRepeats = [0, 1, 2];
  readonly dots = Array.from({ length: 12 }, (_, i) => i);

  readonly intro = signal(true);
  readonly run = signal(0);
  readonly burstDone = signal(false);

  readonly cycles = computed(() => [this.run()]);
  readonly base = computed(() => (this.run() === 0 ? FIRST_BASE : REPLAY_BASE));

  readonly frames = computed(() => {
    const base = this.base();
    return BURST_OFFSETS.map((p, i) => ({
      i,
      src: `images/burst/burst-${String(i + 1).padStart(2, '0')}.jpg`,
      ox: p.ox.toString(),
      oy: p.oy.toString(),
      r: `${p.r}deg`,
      delay: `${(base + FRAME_T[i]).toFixed(2)}s`,
    }));
  });

  readonly stillDelay = computed(() => `${(this.base() + STILL_AT).toFixed(2)}s`);
  readonly goalDelay = computed(() => `${(this.base() + GOAL_AT).toFixed(2)}s`);
  readonly cycleBase = computed(() => `${this.base().toFixed(2)}s`);
  readonly cycleLength = `${CYCLE_LENGTH.toFixed(2)}s`;

  private doneTimer?: ReturnType<typeof setTimeout>;
  private introTimer?: ReturnType<typeof setTimeout>;

  constructor(readonly content: ContentService) {
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      this.intro.set(false);
      this.burstDone.set(true);
      return;
    }
    this.introTimer = setTimeout(() => this.intro.set(false), INTRO_MS);
    this.scheduleDone(FIRST_BASE);
  }

  get bookPreview() {
    return this.content.reportages
      .flatMap((reportage) => {
        const photo = reportage.photos.find((candidate) => candidate.inBook);
        return photo
          ? [{ ...photo, reportageSlug: reportage.slug, reportageCategory: reportage.category }]
          : [];
      })
      .slice(0, 4);
  }

  get latestReportages() {
    return this.content.reportages.slice(0, 2);
  }

  replay(): void {
    this.burstDone.set(false);
    this.run.update((value) => value + 1);
    this.scheduleDone(REPLAY_BASE);
  }

  ngOnDestroy(): void {
    clearTimeout(this.doneTimer);
    clearTimeout(this.introTimer);
  }

  private scheduleDone(base: number): void {
    clearTimeout(this.doneTimer);
    this.doneTimer = setTimeout(() => this.burstDone.set(true), (base + CYCLE_LENGTH) * 1000);
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  displayDate(isoDate: string): string {
    return new Date(`${isoDate}T12:00:00`).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
