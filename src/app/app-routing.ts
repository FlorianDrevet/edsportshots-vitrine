import { Routes } from '@angular/router';

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
  { path: '**', redirectTo: '' },
];
