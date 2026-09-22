import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TRACKER_SERVICES } from '../../shared/models/cookie-catalog';
import { ContentService } from '../../shared/services/content.service';
import { CONSENT_MAX_AGE_DAYS, CookieConsentService, CookiePreferences } from '../../shared/services/cookie-consent.service';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './cookies.component.html',
})
export class CookiesComponent {
  readonly consent = inject(CookieConsentService);
  readonly content = inject(ContentService);
  readonly services = TRACKER_SERVICES;
  readonly consentMaxAgeMonths = Math.round(CONSENT_MAX_AGE_DAYS / 30);

  readonly draft = signal<CookiePreferences>({ googleAnalytics: false, clarity: false });
  readonly saved = signal(false);
  readonly isDirty = computed(() => {
    const draft = this.draft();
    const current = this.consent.preferences();
    return draft.googleAnalytics !== current.googleAnalytics || draft.clarity !== current.clarity;
  });

  readonly statusLabel = computed(() => {
    const decision = this.consent.decision();
    if (!decision) return 'Aucun choix enregistré : aucun outil de mesure n’est actif.';
    const active = this.services.filter((service) => service.key && decision.preferences[service.key]);
    if (!active.length) return 'Vous avez refusé tous les cookies de mesure d’audience.';
    return `Cookies acceptés : ${active.map((service) => service.name).join(' et ')}.`;
  });

  readonly browserLinks = [
    { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647?hl=fr' },
    { name: 'Firefox', url: 'https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur' },
    { name: 'Safari', url: 'https://support.apple.com/fr-fr/guide/safari/sfri11471/mac' },
    { name: 'Edge', url: 'https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
  ];

  constructor() {
    // Keep the toggles in sync with the stored choice (banner, "Tout accepter"...).
    effect(() => this.draft.set({ ...this.consent.preferences() }));
  }

  toggle(key: keyof CookiePreferences): void {
    this.saved.set(false);
    this.draft.update((draft) => ({ ...draft, [key]: !draft[key] }));
  }

  save(): void {
    this.consent.savePreferences(this.draft());
    this.saved.set(true);
  }

  acceptAll(): void {
    this.consent.acceptAll();
    this.saved.set(true);
  }

  rejectAll(): void {
    this.consent.rejectAll();
    this.saved.set(true);
  }
}
