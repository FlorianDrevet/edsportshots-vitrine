import { Photo } from './photo.model';

export interface Reportage {
  slug: string;
  category: string;
  location: string;
  /** ISO date, e.g. "2026-09-14" */
  date: string;
  clubA: string;
  clubB: string;
  score: { a: number | null; b: number | null };
  deliveredCount: number;
  story: string;
  cover: Photo;
  photos: Photo[];
}
