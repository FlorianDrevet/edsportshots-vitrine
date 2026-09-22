import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TRACKER_SERVICES } from '../../models/cookie-catalog';
import { CookieConsentService, CookiePreferences } from '../../services/cookie-consent.service';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cookie-banner.component.html',
})
export class CookieBannerComponent {
  readonly consent = inject(CookieConsentService);
  readonly optionalServices = TRACKER_SERVICES.filter((service) => service.key !== null);
  readonly draft = signal<CookiePreferences>({ googleAnalytics: false, clarity: false });

  openPanel(): void {
    this.draft.set({ ...this.consent.preferences() });
    this.consent.openPanel();
  }

  toggle(key: keyof CookiePreferences): void {
    this.draft.update((draft) => ({ ...draft, [key]: !draft[key] }));
  }

  savePreferences(): void {
    this.consent.savePreferences(this.draft());
  }
}
