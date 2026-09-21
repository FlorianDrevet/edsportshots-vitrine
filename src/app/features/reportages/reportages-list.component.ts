import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../shared/services/content.service';

const MONTHS_FR = [
  'Janv.', 'Févr.', 'Mars', 'Avr.', 'Mai', 'Juin',
  'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.',
];

@Component({
  selector: 'app-reportages-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reportages-list.component.html',
  styleUrl: './reportages-list.component.scss',
})
export class ReportagesListComponent {
  constructor(readonly content: ContentService) {}

  monthYear(isoDate: string): string {
    const date = new Date(isoDate);
    return `${MONTHS_FR[date.getMonth()]} ${date.getFullYear()}`;
  }
}
