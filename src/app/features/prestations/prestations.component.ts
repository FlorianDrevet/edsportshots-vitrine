import { Component } from '@angular/core';
import { ContentService } from '../../shared/services/content.service';

@Component({
  selector: 'app-prestations',
  standalone: true,
  imports: [],
  templateUrl: './prestations.component.html',
  styleUrl: './prestations.component.scss',
})
export class PrestationsComponent {
  readonly steps = [
    {
      title: 'Tu m’écris',
      text: 'La date, le lieu, la catégorie. Je confirme ma dispo et je t’envoie un devis.',
    },
    {
      title: 'Je viens shooter',
      text: 'J’arrive avant l’échauffement et je reste jusqu’au coup de sifflet final.',
    },
    {
      title: 'Je trie, je retouche',
      text: 'Sélection, retouche et export dans les formats dont le club a besoin.',
    },
    {
      title: 'Tu reçois tout',
      text: 'Les fichiers HD et une galerie à partager aux joueurs.',
    },
  ];

  constructor(readonly content: ContentService) {}

  get mailtoHref(): string {
    const subject = encodeURIComponent('Demande de reportage — EDSPORTSHOTS');
    const body = encodeURIComponent(
      'Bonjour,\n\nVoici les infos pour le match :\n- Club / nom :\n- Date :\n- Lieu :\n- Catégorie :\n- Formule souhaitée :\n\nMerci !',
    );
    return `mailto:${this.content.site.email}?subject=${subject}&body=${body}`;
  }
}
