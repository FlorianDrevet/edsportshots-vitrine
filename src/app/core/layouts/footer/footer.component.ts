import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ContentService } from '../../../shared/services/content.service';
import { CookieConsentService } from '../../../shared/services/cookie-consent.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly consent = inject(CookieConsentService);
  /** Legal pages and cookie page, declared once in app-routing.ts with a footerLabel. */
  readonly legalLinks = inject(Router)
    .config.filter((route) => route.path && route.data?.['footerLabel'])
    .map((route) => ({ path: `/${route.path}`, label: route.data!['footerLabel'] as string }));

  constructor(readonly content: ContentService) {}
}
