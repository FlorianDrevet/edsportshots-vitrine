import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.updateCanonical(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateCanonical(event.urlAfterRedirects));
  }

  private updateCanonical(url: string): void {
    const path = url.split(/[?#]/)[0] || '/';
    const canonicalUrl = new URL(path, window.location.origin).toString();

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    this.updateMeta('og:url', canonicalUrl);
  }

  private updateMeta(property: string, content: string): void {
    let meta = this.document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
    if (!meta) {
      meta = this.document.createElement('meta');
      meta.setAttribute('property', property);
      this.document.head.appendChild(meta);
    }
    meta.content = content;
  }
}
