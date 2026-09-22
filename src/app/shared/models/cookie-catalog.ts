import { CookiePreferences } from '../services/cookie-consent.service';

export interface TrackerCookie {
  name: string;
  purpose: string;
  duration: string;
  domain: string;
}

export interface TrackerService {
  /** Key in CookiePreferences, or null for strictly necessary storage (no consent needed). */
  key: keyof CookiePreferences | null;
  name: string;
  provider: string;
  summary: string;
  privacyUrl: string;
  cookies: TrackerCookie[];
}

/**
 * Every cookie or local storage entry the site can create. Keep in sync with
 * AnalyticsService and bump CONSENT_VERSION when a tracker is added.
 */
export const TRACKER_SERVICES: TrackerService[] = [
  {
    key: null,
    name: 'Mémorisation de votre choix',
    provider: 'EDSPORTSHOTS (ce site)',
    summary:
      'Retient vos préférences de cookies pour ne pas vous redemander à chaque page. Stocké uniquement dans votre navigateur, jamais transmis.',
    privacyUrl: '/politique-de-confidentialite',
    cookies: [
      {
        name: 'eds-cookie-consent',
        purpose: 'Stockage local : vos choix (acceptation ou refus), leur date et la version de la politique',
        duration: '6 mois',
        domain: 'www.edsportshots.com',
      },
    ],
  },
  {
    key: 'googleAnalytics',
    name: 'Google Analytics 4',
    provider: 'Google Ireland Limited / Google LLC',
    summary:
      "Statistiques de fréquentation : nombre de visites, pages consultées, durée, type d'appareil, pays approximatif. Adresse IP non conservée, signaux publicitaires et Google Signals désactivés.",
    privacyUrl: 'https://policies.google.com/privacy?hl=fr',
    cookies: [
      {
        name: '_ga',
        purpose: 'Distingue les visiteurs par un identifiant aléatoire',
        duration: '13 mois',
        domain: '.edsportshots.com',
      },
      {
        name: '_ga_<identifiant>',
        purpose: "Conserve l'état de la session de mesure",
        duration: '13 mois',
        domain: '.edsportshots.com',
      },
    ],
  },
  {
    key: 'clarity',
    name: 'Microsoft Clarity',
    provider: 'Microsoft Ireland Operations Limited / Microsoft Corporation',
    summary:
      "Analyse du comportement de navigation : clics, défilement, cartes de chaleur et relecture anonymisée des sessions (mouvements de souris, pages parcourues). Aucun texte saisi n'est enregistré.",
    privacyUrl: 'https://privacy.microsoft.com/fr-fr/privacystatement',
    cookies: [
      {
        name: '_clck',
        purpose: 'Identifiant Clarity du visiteur et préférences',
        duration: '1 an',
        domain: '.edsportshots.com',
      },
      {
        name: '_clsk',
        purpose: 'Regroupe les pages vues en une seule session',
        duration: '1 jour',
        domain: '.edsportshots.com',
      },
      {
        name: 'CLID',
        purpose: 'Identifie la première visite sur un site utilisant Clarity',
        duration: '1 an',
        domain: 'www.clarity.ms',
      },
      {
        name: 'MUID',
        purpose: 'Identifiant de navigateur partagé entre les domaines Microsoft',
        duration: '1 an',
        domain: '.clarity.ms',
      },
      {
        name: 'MR',
        purpose: "Indique s'il faut renouveler l'identifiant MUID",
        duration: '7 jours',
        domain: '.c.clarity.ms',
      },
      {
        name: 'ANONCHK',
        purpose: "Vérifie que l'identifiant n'est pas transmis à la régie publicitaire (toujours à 0)",
        duration: '10 minutes',
        domain: '.c.clarity.ms',
      },
      {
        name: 'SM',
        purpose: "Synchronise l'identifiant MUID entre les domaines Microsoft",
        duration: 'Session',
        domain: '.c.clarity.ms',
      },
    ],
  },
];
