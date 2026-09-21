import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../shared/services/content.service';

interface Chip {
  id: string;
  label: string;
}

@Component({
  selector: 'app-galerie',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './galerie.component.html',
  styleUrl: './galerie.component.scss',
})
export class GalerieComponent {
  private readonly chipDefs: Chip[] = [
    { id: 'all', label: 'Tout' },
    { id: 'u18-d1', label: 'U18 D1' },
    { id: 'u18-d2', label: 'U18 D2' },
    { id: 'action', label: 'Action' },
    { id: 'portrait', label: 'Portraits' },
  ];

  readonly filter = signal('all');

  constructor(readonly content: ContentService) {}

  readonly filteredPhotos = computed(() => {
    const filter = this.filter();
    if (filter === 'all') return this.content.bookPhotos;
    return this.content.bookPhotos.filter((photo) => photo.tags.includes(filter));
  });

  count(id: string): number {
    if (id === 'all') return this.content.bookPhotos.length;
    return this.content.bookPhotos.filter((photo) => photo.tags.includes(id)).length;
  }

  get chips() {
    return this.chipDefs.map((chip) => ({ ...chip, count: this.count(chip.id) }));
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
