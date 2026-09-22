import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../shared/services/content.service';
import { buildLegalPages } from './legal-content';
import { LEGAL_PAGE_PATHS, LegalPagePath } from './legal-page-paths';

@Component({
  selector: 'app-legal-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './legal-page.component.html',
})
export class LegalPageComponent {
  readonly content = inject(ContentService);
  private readonly pages = buildLegalPages(this.content.site);

  /** Bound from the route data through withComponentInputBinding(). */
  readonly legalPagePath = input<LegalPagePath>(LEGAL_PAGE_PATHS.mentionsLegales);
  readonly page = computed(() => this.pages[this.legalPagePath()] ?? this.pages[LEGAL_PAGE_PATHS.mentionsLegales]);
}
