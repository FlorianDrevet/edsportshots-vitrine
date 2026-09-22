import { Routes } from '@angular/router';
import { COOKIES_PAGE_PATH, LEGAL_PAGE_PATHS } from './features/legal/legal-page-paths';

const loadLegalPage = () => import('./features/legal/legal-page.component').then((m) => m.LegalPageComponent);

export const routes: Routes = [
  {
    path: '',
    title: 'EDSPORTSHOTS — Photographe de foot, Loire (42)',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'galerie',
    title: 'Le book — EDSPORTSHOTS',
    loadComponent: () => import('./features/galerie/galerie.component').then((m) => m.GalerieComponent),
  },
  {
    path: 'reportages',
    title: 'Reportages — EDSPORTSHOTS',
    loadComponent: () =>
      import('./features/reportages/reportages-list.component').then((m) => m.ReportagesListComponent),
  },
  {
    path: 'reportages/:slug',
    title: 'Reportage — EDSPORTSHOTS',
    loadComponent: () =>
      import('./features/reportages/reportage-detail.component').then((m) => m.ReportageDetailComponent),
  },
  {
    path: 'prestations',
    title: 'Formules — EDSPORTSHOTS',
    loadComponent: () =>
      import('./features/prestations/prestations.component').then((m) => m.PrestationsComponent),
  },
  {
    path: LEGAL_PAGE_PATHS.mentionsLegales,
    title: 'Mentions légales — EDSPORTSHOTS',
    loadComponent: loadLegalPage,
    data: { legalPagePath: LEGAL_PAGE_PATHS.mentionsLegales, footerLabel: 'Mentions légales' },
  },
  {
    path: LEGAL_PAGE_PATHS.politiqueConfidentialite,
    title: 'Politique de confidentialité — EDSPORTSHOTS',
    loadComponent: loadLegalPage,
    data: { legalPagePath: LEGAL_PAGE_PATHS.politiqueConfidentialite, footerLabel: 'Confidentialité' },
  },
  {
    path: COOKIES_PAGE_PATH,
    title: 'Cookies — EDSPORTSHOTS',
    loadComponent: () => import('./features/cookies/cookies.component').then((m) => m.CookiesComponent),
    data: { footerLabel: 'Cookies' },
  },
  {
    path: LEGAL_PAGE_PATHS.conditionsGenerales,
    title: 'Conditions générales de vente — EDSPORTSHOTS',
    loadComponent: loadLegalPage,
    data: { legalPagePath: LEGAL_PAGE_PATHS.conditionsGenerales, footerLabel: 'CGV' },
  },
  {
    path: LEGAL_PAGE_PATHS.droitImage,
    title: 'Droit à l’image — EDSPORTSHOTS',
    loadComponent: loadLegalPage,
    data: { legalPagePath: LEGAL_PAGE_PATHS.droitImage, footerLabel: 'Droit à l’image' },
  },
  {
    path: LEGAL_PAGE_PATHS.accessibilite,
    title: 'Accessibilité — EDSPORTSHOTS',
    loadComponent: loadLegalPage,
    data: { legalPagePath: LEGAL_PAGE_PATHS.accessibilite, footerLabel: 'Accessibilité : non audité' },
  },
  { path: '**', redirectTo: '' },
];
