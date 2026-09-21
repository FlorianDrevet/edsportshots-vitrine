import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ContentService } from './content.service';

type Gtag = (...args: unknown[]) => void;
type Clarity = Gtag & { q?: unknown[][] };
type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: Gtag;
  clarity?: Clarity;
};

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly content = inject(ContentService);

  private readonly googleAnalyticsId = this.content.site.analytics?.googleAnalyticsId?.trim() ?? '';
  private readonly clarityProjectId = this.content.site.analytics?.clarityProjectId?.trim() ?? '';

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.isGoogleAnalyticsId(this.googleAnalyticsId)) {
      this.initializeGoogleAnalytics(this.googleAnalyticsId);
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => this.trackPageView(event.urlAfterRedirects));
    }

    if (this.isClarityProjectId(this.clarityProjectId)) {
      this.initializeClarity(this.clarityProjectId);
    }
  }

  private initializeGoogleAnalytics(measurementId: string): void {
    const windowWithAnalytics = window as AnalyticsWindow;
    windowWithAnalytics.dataLayer = windowWithAnalytics.dataLayer ?? [];
    windowWithAnalytics.gtag = (...args: unknown[]) => {
      windowWithAnalytics.dataLayer?.push(args);
    };

    windowWithAnalytics.gtag('js', new Date());
    windowWithAnalytics.gtag('config', measurementId, { send_page_view: false });

    if (this.document.getElementById('google-analytics-script')) return;

    const script = this.document.createElement('script');
    script.id = 'google-analytics-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    this.document.head.appendChild(script);
  }

  private initializeClarity(projectId: string): void {
    const windowWithAnalytics = window as AnalyticsWindow;
    const clarity: Clarity = (...args: unknown[]) => {
      clarity.q = clarity.q ?? [];
      clarity.q.push(args);
    };
    windowWithAnalytics.clarity = clarity;

    if (this.document.getElementById('clarity-script')) return;

    const script = this.document.createElement('script');
    script.id = 'clarity-script';
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`;
    this.document.head.appendChild(script);
  }

  private trackPageView(path: string): void {
    const windowWithAnalytics = window as AnalyticsWindow;
    windowWithAnalytics.gtag?.('event', 'page_view', {
      page_title: this.document.title,
      page_location: `${window.location.origin}${path}`,
      page_path: path,
    });
  }

  private isGoogleAnalyticsId(value: string): boolean {
    return /^G-[A-Z0-9]+$/i.test(value);
  }

  private isClarityProjectId(value: string): boolean {
    return /^[A-Z0-9_-]+$/i.test(value);
  }
}
