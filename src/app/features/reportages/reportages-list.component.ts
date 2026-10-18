import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../shared/services/content.service';

@Component({
  selector: 'app-reportages-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reportages-list.component.html',
  styleUrl: './reportages-list.component.scss',
})
export class ReportagesListComponent {
  constructor(readonly content: ContentService) {}

  displayDate(isoDate: string): string {
    return new Date(`${isoDate}T12:00:00`).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
