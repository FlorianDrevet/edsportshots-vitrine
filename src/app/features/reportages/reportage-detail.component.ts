import { Component, computed, input, signal } from '@angular/core';
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
  readonly activePhotoIndex = signal<number | null>(null);

  constructor(readonly content: ContentService) {}

  readonly reportage = computed(() => this.content.findBySlug(this.slug()));
  readonly nextReportage = computed(() => this.content.next(this.slug()));
  readonly activePhoto = computed(() => {
    const index = this.activePhotoIndex();
    return index === null ? undefined : this.reportage()?.photos[index];
  });

  private photoTrigger: HTMLButtonElement | null = null;
  private pointerStart: { x: number; y: number } | null = null;
  private previousOverflow: { html: string; body: string } | null = null;

  displayDate(isoDate: string): string {
    return new Date(`${isoDate}T12:00:00`).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  openPhoto(index: number, dialog: HTMLDialogElement, trigger: HTMLButtonElement): void {
    if (dialog.open) return;

    this.photoTrigger = trigger;
    this.activePhotoIndex.set(index);
    this.previousOverflow = {
      html: document.documentElement.style.overflow,
      body: document.body.style.overflow,
    };
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    requestAnimationFrame(() => {
      if (dialog.open) dialog.querySelector<HTMLButtonElement>('[autofocus]')?.focus({ preventScroll: true });
    });
  }

  closePhoto(dialog: HTMLDialogElement): void {
    if (dialog.open) dialog.close();
  }

  onPhotoDialogClosed(): void {
    this.activePhotoIndex.set(null);
    this.pointerStart = null;

    if (this.previousOverflow) {
      document.documentElement.style.overflow = this.previousOverflow.html;
      document.body.style.overflow = this.previousOverflow.body;
      this.previousOverflow = null;
    }

    const trigger = this.photoTrigger;
    this.photoTrigger = null;
    requestAnimationFrame(() => trigger?.focus({ preventScroll: true }));
  }

  onPhotoDialogClick(event: MouseEvent, dialog: HTMLDialogElement): void {
    if (event.target === dialog) this.closePhoto(dialog);
  }

  onPhotoDialogKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.showAdjacentPhoto(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.showAdjacentPhoto(-1);
    }
  }

  navigatePhoto(direction: -1 | 1): void {
    this.showAdjacentPhoto(direction);
  }

  onPhotoPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse') return;
    this.pointerStart = { x: event.clientX, y: event.clientY };
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }

  onPhotoPointerUp(event: PointerEvent): void {
    const start = this.pointerStart;
    this.pointerStart = null;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;

    this.showAdjacentPhoto(deltaX < 0 ? 1 : -1);
  }

  onPhotoPointerCancel(): void {
    this.pointerStart = null;
  }

  downloadName(src: string): string {
    const filename = src.split('/').pop() || 'photo.webp';
    return `edsportshots-${this.slug()}-${filename}`;
  }

  private showAdjacentPhoto(direction: -1 | 1): void {
    const photoCount = this.reportage()?.photos.length ?? 0;
    const index = this.activePhotoIndex();
    if (!photoCount || index === null) return;

    this.activePhotoIndex.set((index + direction + photoCount) % photoCount);
  }
}
