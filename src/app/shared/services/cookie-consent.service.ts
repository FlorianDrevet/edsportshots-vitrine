import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export const CONSENT_STORAGE_KEY = 'eds-cookie-consent';
/** Bump when the list of trackers changes: every visitor is asked again. */
export const CONSENT_VERSION = 1;
/** CNIL recommends asking again after about six months, whatever the answer was. */
export const CONSENT_MAX_AGE_DAYS = 182;

export interface CookiePreferences {
  googleAnalytics: boolean;
  clarity: boolean;
}

export interface StoredConsent {
  version: number;
  choice: 'accepted' | 'rejected' | 'customized';
  preferences: CookiePreferences;
  /** ISO date of the choice, kept as proof of consent. */
  date: string;
}

const NO_TRACKING: CookiePreferences = { googleAnalytics: false, clarity: false };
const ALL_TRACKING: CookiePreferences = { googleAnalytics: true, clarity: true };

/**
 * Stores the visitor's choice and exposes it as signals. Trackers are only
 * loaded by AnalyticsService once `preferences()` allows them.
 */
@Injectable({ providedIn: 'root' })
export class CookieConsentService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly stored = signal<StoredConsent | null>(null);
  readonly bannerVisible = signal(false);
  readonly panelOpen = signal(false);

  readonly preferences = computed<CookiePreferences>(() => this.stored()?.preferences ?? NO_TRACKING);
  readonly decision = this.stored.asReadonly();
  readonly expiresAt = computed(() => {
    const stored = this.stored();
    if (!stored) return null;
    const date = new Date(stored.date);
    date.setDate(date.getDate() + CONSENT_MAX_AGE_DAYS);
    return date;
  });

  constructor() {
    if (!this.isBrowser) return;

    const stored = this.readStored();
    if (stored) {
      this.stored.set(stored);
    } else {
      this.bannerVisible.set(true);
    }
  }

  acceptAll(): void {
    this.save('accepted', ALL_TRACKING);
  }

  rejectAll(): void {
    this.save('rejected', NO_TRACKING);
  }

  savePreferences(preferences: CookiePreferences): void {
    const choice =
      preferences.googleAnalytics && preferences.clarity
        ? 'accepted'
        : !preferences.googleAnalytics && !preferences.clarity
          ? 'rejected'
          : 'customized';
    this.save(choice, preferences);
  }

  openPanel(): void {
    this.panelOpen.set(true);
  }

  /** Shows the banner again, for the "Gérer les cookies" link. */
  reopen(): void {
    this.panelOpen.set(false);
    this.bannerVisible.set(true);
  }

  private readStored(): StoredConsent | null {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!raw) return null;
      const stored = JSON.parse(raw) as StoredConsent;
      const ageMs = Date.now() - new Date(stored.date).getTime();
      const isValid =
        stored.version === CONSENT_VERSION &&
        typeof stored.preferences?.googleAnalytics === 'boolean' &&
        typeof stored.preferences?.clarity === 'boolean' &&
        ageMs >= 0 &&
        ageMs < CONSENT_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
      if (!isValid) {
        localStorage.removeItem(CONSENT_STORAGE_KEY);
        return null;
      }
      return stored;
    } catch {
      return null;
    }
  }

  private save(choice: StoredConsent['choice'], preferences: CookiePreferences): void {
    const stored: StoredConsent = {
      version: CONSENT_VERSION,
      choice,
      preferences: { ...preferences },
      date: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Storage blocked (private browsing...): the choice still applies for this visit.
    }
    this.stored.set(stored);
    this.bannerVisible.set(false);
    this.panelOpen.set(false);
  }
}
