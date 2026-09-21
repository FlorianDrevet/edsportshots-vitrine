import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'galerie',
    loadComponent: () => import('./features/galerie/galerie.component').then((m) => m.GalerieComponent),
  },
  {
    path: 'reportages',
    loadComponent: () =>
      import('./features/reportages/reportages-list.component').then((m) => m.ReportagesListComponent),
  },
  {
    path: 'reportages/:slug',
    loadComponent: () =>
      import('./features/reportages/reportage-detail.component').then((m) => m.ReportageDetailComponent),
  },
  {
    path: 'prestations',
    loadComponent: () =>
      import('./features/prestations/prestations.component').then((m) => m.PrestationsComponent),
  },
  { path: '**', redirectTo: '' },
];
