import { Injectable } from '@angular/core';
import siteJson from '../../content/site.json';
import reportagesJson from '../../content/reportages.json';
import { Reportage } from '../models/reportage.model';
import { SiteSettings } from '../models/site-settings.model';
import { Photo } from '../models/photo.model';

export interface BookPhoto extends Photo {
  reportageSlug: string;
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly site: SiteSettings = siteJson as SiteSettings;

  /** Most recent reportage first. */
  readonly reportages: Reportage[] = (reportagesJson as Reportage[])
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  /** Every "inBook" photo across all reportages, most recent reportage first — the single source of truth for /galerie. */
  readonly bookPhotos: BookPhoto[] = this.reportages.flatMap((reportage) =>
    reportage.photos
      .filter((photo) => photo.inBook)
      .map((photo) => ({ ...photo, reportageSlug: reportage.slug })),
  );

  findBySlug(slug: string): Reportage | undefined {
    return this.reportages.find((reportage) => reportage.slug === slug);
  }

  next(slug: string): Reportage | undefined {
    const index = this.reportages.findIndex((reportage) => reportage.slug === slug);
    if (index === -1) return undefined;
    return this.reportages[(index + 1) % this.reportages.length];
  }
}
