import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../shared/services/content.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  readonly tickerItems = ['Football', 'Loire 42', 'Matchs', 'Portraits', 'Catégories jeunes'];
  readonly tickerRepeats = [0, 1, 2];

  constructor(readonly content: ContentService) {}

  get bookPreview() {
    return this.content.bookPhotos.slice(0, 4);
  }

  get latestReportages() {
    return this.content.reportages.slice(0, 2);
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
