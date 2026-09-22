import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ContentService } from './content.service';
import { CookieConsentService } from './cookie-consent.service';

type Gtag = (...args: unknown[]) => void;
type Clarity = Gtag & { q?: unknown[][] };
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
  clarity?: Clarity;
  [gaDisableFlag: `ga-disable-${string}`]: boolean;
};

/** 13 months, the maximum cookie lifetime accepted by the CNIL for audience measurement. */
export const ANALYTICS_COOKIE_MAX_AGE_SECONDS = 13 * 30 * 24 * 60 * 60;

const DENIED_CONSENT = {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
} as const;

const isGoogleAnalyticsCookie = (name: string) => ['_ga', '_gid', '_gat'].some((prefix) => name.startsWith(prefix));
const isClarityCookie = (name: string) => ['_clck', '_clsk'].includes(name);

/**
 * Loads Google Analytics 4 and Microsoft Clarity only after the visitor has
 * accepted them in the cookie banner. Withdrawing consent removes their
 * first-party cookies and reloads the page without them.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly content = inject(ContentService);
  private readonly consent = inject(CookieConsentService);

  private readonly googleAnalyticsId = this.content.site.analytics?.googleAnalyticsId?.trim() ?? '';
  private readonly clarityProjectId = this.content.site.analytics?.clarityProjectId?.trim() ?? '';

  private googleAnalyticsEnabled = false;
  private clarityEnabled = false;
  private lastTrackedPath: string | null = null;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.trackPageView(event.urlAfterRedirects));

    effect(() => {
      const preferences = this.consent.preferences();
      const googleAnalyticsAllowed = this.hasGoogleAnalyticsId && preferences.googleAnalytics;
      const clarityAllowed = this.hasClarityId && preferences.clarity;

      if ((this.googleAnalyticsEnabled && !googleAnalyticsAllowed) || (this.clarityEnabled && !clarityAllowed)) {
        this.withdrawAndReload(!googleAnalyticsAllowed, !clarityAllowed);
        return;
      }

      if (googleAnalyticsAllowed && !this.googleAnalyticsEnabled) this.enableGoogleAnalytics();
      if (clarityAllowed && !this.clarityEnabled) this.enableClarity();
      // Cookies left over by an earlier visit, before the choice was withdrawn or expired.
      if (!googleAnalyticsAllowed) this.deleteCookies(isGoogleAnalyticsCookie);
      if (!clarityAllowed) this.deleteCookies(isClarityCookie);
    });
  }

  private get hasGoogleAnalyticsId(): boolean {
    return /^G-[A-Z0-9]+$/i.test(this.googleAnalyticsId);
  }

  private get hasClarityId(): boolean {
    return /^[A-Z0-9_-]+$/i.test(this.clarityProjectId);
  }

  private enableGoogleAnalytics(): void {
    const analyticsWindow = this.analyticsWindow;
    this.googleAnalyticsEnabled = true;
    analyticsWindow[`ga-disable-${this.googleAnalyticsId}`] = false;
    analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
    if (!analyticsWindow.gtag) {
      analyticsWindow.gtag = function gtag() {
        // gtag.js expects the real `arguments` object, not an array.
        // eslint-disable-next-line prefer-rest-params
        analyticsWindow.dataLayer?.push(arguments);
      };
      analyticsWindow.gtag('consent', 'default', DENIED_CONSENT);
    }

    analyticsWindow.gtag('consent', 'update', { ...DENIED_CONSENT, analytics_storage: 'granted' });
    analyticsWindow.gtag('js', new Date());
    analyticsWindow.gtag('config', this.googleAnalyticsId, {
      send_page_view: false,
      cookie_expires: ANALYTICS_COOKIE_MAX_AGE_SECONDS,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    if (!this.document.getElementById('google-analytics-script')) {
      const script = this.document.createElement('script');
      script.id = 'google-analytics-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(this.googleAnalyticsId)}`;
      this.document.head.appendChild(script);
    }

    this.lastTrackedPath = null;
    if (this.router.navigated) this.trackPageView(this.router.url);
  }

  private enableClarity(): void {
    const analyticsWindow = this.analyticsWindow;
    this.clarityEnabled = true;
    if (!analyticsWindow.clarity) {
      const clarity: Clarity = (...args: unknown[]) => {
        clarity.q = clarity.q ?? [];
        clarity.q.push(args);
      };
      analyticsWindow.clarity = clarity;
    }

    if (!this.document.getElementById('clarity-script')) {
      const script = this.document.createElement('script');
      script.id = 'clarity-script';
      script.async = true;
      script.src = `https://www.clarity.ms/tag/${encodeURIComponent(this.clarityProjectId)}`;
      this.document.head.appendChild(script);
    }

    analyticsWindow.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
  }

  /**
   * A loaded tracker cannot be unloaded: Clarity even recreates its cookies after
   * consent('false') because it also reads Google consent mode. So once a running
   * tracker is refused, it is silenced, its cookies are removed and the page is
   * reloaded without it.
   */
  private withdrawAndReload(googleAnalytics: boolean, clarity: boolean): void {
    const analyticsWindow = this.analyticsWindow;
    if (googleAnalytics && this.googleAnalyticsEnabled) {
      analyticsWindow[`ga-disable-${this.googleAnalyticsId}`] = true;
    }
    if (clarity && this.clarityEnabled) {
      analyticsWindow.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
      analyticsWindow.clarity?.('consent', false);
    }
    this.googleAnalyticsEnabled = false;
    this.clarityEnabled = false;
    if (googleAnalytics) this.deleteCookies(isGoogleAnalyticsCookie);
    if (clarity) this.deleteCookies(isClarityCookie);
    window.location.reload();
  }

  private trackPageView(url: string): void {
    if (!this.googleAnalyticsEnabled) return;
    const path = url || '/';
    if (path === this.lastTrackedPath) return;
    this.lastTrackedPath = path;

    this.analyticsWindow.gtag?.('event', 'page_view', {
      page_title: this.document.title,
      page_location: `${window.location.origin}${path}`,
      page_path: path,
    });
  }

  private get analyticsWindow(): AnalyticsWindow {
    return window as unknown as AnalyticsWindow;
  }

  /** Expires matching cookies on the current host and on every parent domain. */
  private deleteCookies(matches: (name: string) => boolean): void {
    const names = this.document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) => name && matches(name));
    if (!names.length) return;

    const parts = window.location.hostname.split('.');
    const domainSuffixes = [''];
    for (let i = 0; i < parts.length - 1; i++) domainSuffixes.push(`; domain=.${parts.slice(i).join('.')}`);

    for (const name of names) {
      for (const domain of domainSuffixes) {
        this.document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
      }
    }
  }
}
