import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../shared/services/content.service';

@Component({
  selector: 'app-reportage-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reportage-detail.component.html',
  styleUrl: './reportage-detail.component.scss',
})
export class ReportageDetailComponent {
  readonly slug = input.required<string>();

  constructor(readonly content: ContentService) {}

  readonly reportage = computed(() => this.content.findBySlug(this.slug()));
  readonly nextReportage = computed(() => this.content.next(this.slug()));
}
