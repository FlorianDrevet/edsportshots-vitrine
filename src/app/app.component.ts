import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/layouts/footer/footer.component';
import { NavigationComponent } from './core/layouts/navigation/navigation.component';
import { CookieBannerComponent } from './shared/components/cookie-banner/cookie-banner.component';
import { AnalyticsService } from './shared/services/analytics.service';
import { SeoService } from './shared/services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent, CookieBannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'EDSPORTSHOTS';

  constructor(readonly analytics: AnalyticsService, readonly seo: SeoService) {}
}
