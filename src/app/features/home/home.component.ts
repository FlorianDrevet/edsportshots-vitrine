import { Component, OnDestroy, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../shared/services/content.service';

/**
 * Tirages de la rafale, dans l'ordre de la maquette : n° de fichier, décalage
 * (unités de la maquette desktop, en px) et rotation de chaque tirage dans la pile.
 */
const BURST_FRAMES: { file: number; tx: number; ty: number; r: number }[] = [
  { file: 1, tx: 1.0, ty: 5.1, r: 1.23 }, { file: 3, tx: 0.1, ty: 1.0, r: -1.25 },
  { file: 5, tx: 0.2, ty: 1.6, r: 0.86 }, { file: 7, tx: -6.5, ty: -2.4, r: -1.71 },
  { file: 9, tx: 5.0, ty: 2.3, r: 0.73 }, { file: 11, tx: 7.7, ty: 5.6, r: -0.66 },
  { file: 15, tx: 1.8, ty: -4.1, r: 1.52 }, { file: 17, tx: 0.5, ty: -5.3, r: -0.62 },
  { file: 19, tx: -4.1, ty: -5.6, r: 0.87 }, { file: 27, tx: -1.0, ty: 4.1, r: -1.25 },
  { file: 31, tx: 2.2, ty: 0.0, r: 1.33 }, { file: 35, tx: -0.7, ty: -2.7, r: -1.53 },
  { file: 39, tx: 7.9, ty: 4.1, r: 2.0 }, { file: 43, tx: -3.0, ty: -3.2, r: -1.59 },
  { file: 47, tx: -6.9, ty: 3.2, r: 1.0 }, { file: 51, tx: 5.5, ty: -1.4, r: -1.16 },
  { file: 55, tx: 5.6, ty: -6.0, r: 1.94 }, { file: 59, tx: 6.6, ty: -0.4, r: -0.89 },
  { file: 63, tx: -1.6, ty: -5.1, r: 1.97 }, { file: 66, tx: 4.5, ty: -2.8, r: -1.48 },
  { file: 68, tx: -2.7, ty: 5.6, r: 0.72 }, { file: 70, tx: -6.1, ty: -3.0, r: -1.66 },
  { file: 72, tx: -7.0, ty: 3.6, r: 0.74 }, { file: 74, tx: 0.9, ty: -0.6, r: -0.85 },
  { file: 76, tx: 3.7, ty: -4.4, r: 0.87 },
];

/** Chronologie de la maquette (cycle de 7,08 s). */
const BURST_GOAL = 5; // le ballon est au fond : pause « But ! » après ce tirage
const DELTA = 0.18; // écart entre deux tirages
const ENTER = 0.16; // durée de glissement d'un tirage
const GOAL_HOLD = 0.7;
const LAST_HOLD = 1.2;

const FRAME_T = BURST_FRAMES.map((_, i) => i * DELTA + (i > BURST_GOAL ? GOAL_HOLD : 0));
const STILL_AT = FRAME_T[FRAME_T.length - 1] + ENTER + LAST_HOLD; // 6,38 s
const GOAL_AT = FRAME_T[BURST_GOAL] + ENTER; // 1,06 s

/** Écran « coup d'envoi » : le rideau remonte à 1,2 s pendant 0,65 s. */
const INTRO_SHIFT = 1.2;
const INTRO_MS = 1900;
/** Début de la rafale : après l'intro (maquette), sans intro, ou au clic sur « Rejouer ». */
const BASE_WITH_INTRO = 1.7;
const BASE_NO_INTRO = BASE_WITH_INTRO - INTRO_SHIFT;
const REPLAY_BASE = 0.15;

/** L'intro ne se joue qu'à l'arrivée sur le site, pas à chaque retour sur l'accueil. */
let introPlayed = false;

interface IntroScene {
  w: number;
  h: number;
  cx: number;
  cy: number;
  r: number;
  circ: string;
  mobile: boolean;
  dots: { x: number; y: number; delay: string }[];
}

function buildIntro(): IntroScene {
  const w = Math.max(320, Math.round(window.innerWidth));
  const h = Math.max(480, Math.round(window.innerHeight));
  const mobile = w < 768;
  const step = mobile ? 26 : 40;
  const cx = w / 2;
  const cy = h / 2;
  const max = Math.hypot(cx, cy);
  const dots: IntroScene['dots'] = [];
  for (let y = step / 2; y < h; y += step) {
    for (let x = step / 2; x < w; x += step) {
      dots.push({ x, y, delay: `${(0.05 + (Math.hypot(x - cx, y - cy) / max) * 0.7).toFixed(3)}s` });
    }
  }
  const r = mobile ? 92 : 150;
  return { w, h, cx, cy, r, circ: (2 * Math.PI * r).toFixed(1), mobile, dots };
}

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

  readonly reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly intro = signal<IntroScene | null>(null);
  /** Décalage des entrées du titre : elles suivent le rideau de l'intro. */
  readonly textShift: string;

  private readonly run = signal(0);
  private readonly base = signal(BASE_NO_INTRO);
  readonly cycles = computed(() => [this.run()]);
  readonly burstDelay = computed(() => `${this.base()}s`);

  readonly frames = BURST_FRAMES.map((f, i) => ({
    i,
    src: `images/burst/burst-${String(i + 1).padStart(2, '0')}.jpg`,
    name: `IMG_${String(f.file).padStart(5, '0')}`,
    count: `${String(i + 1).padStart(2, '0')}/${BURST_FRAMES.length}`,
    tx: f.tx.toString(),
    ty: f.ty.toString(),
    r: `${f.r}deg`,
    at: `${FRAME_T[i].toFixed(2)}s`,
  }));
  readonly goalAt = `${GOAL_AT.toFixed(2)}s`;
  readonly stillAt = `${STILL_AT.toFixed(2)}s`;

  private introTimer?: ReturnType<typeof setTimeout>;

  constructor(readonly content: ContentService) {
    const playIntro = !this.reduced && !introPlayed && typeof window !== 'undefined';
    introPlayed = true;
    this.textShift = playIntro ? `${INTRO_SHIFT}s` : '0s';
    if (playIntro) {
      this.base.set(BASE_WITH_INTRO);
      this.intro.set(buildIntro());
      this.introTimer = setTimeout(() => this.intro.set(null), INTRO_MS);
    }
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
    this.base.set(REPLAY_BASE);
    this.run.update((value) => value + 1);
  }

  ngOnDestroy(): void {
    clearTimeout(this.introTimer);
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
