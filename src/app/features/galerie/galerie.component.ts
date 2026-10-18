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
  private readonly typeChips: Chip[] = [
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
    const categories = new Map<string, string>();
    for (const photo of this.content.bookPhotos) {
      const categoryId = photo.tags[0];
      if (categoryId && !categories.has(categoryId)) {
        categories.set(categoryId, photo.reportageCategory);
      }
    }

    const definitions = [
      { id: 'all', label: 'Tout' },
      ...Array.from(categories, ([id, label]) => ({ id, label })),
      ...this.typeChips,
    ];
    return definitions.map((chip) => ({ ...chip, count: this.count(chip.id) }));
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}
