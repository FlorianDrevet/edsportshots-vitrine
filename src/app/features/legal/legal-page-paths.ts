export const LEGAL_PAGE_PATHS = {
  mentionsLegales: 'mentions-legales',
  politiqueConfidentialite: 'politique-de-confidentialite',
  conditionsGenerales: 'conditions-generales-de-vente',
  droitImage: 'droit-a-l-image',
  accessibilite: 'accessibilite',
} as const;

export type LegalPagePath = (typeof LEGAL_PAGE_PATHS)[keyof typeof LEGAL_PAGE_PATHS];

/** Route of the cookie management page, listed with the legal pages in the footer. */
export const COOKIES_PAGE_PATH = 'cookies';
