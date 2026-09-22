export interface Formule {
  title: string;
  subtitle: string;
  features: string[];
  price: string;
  highlight: boolean;
}

export interface AnalyticsSettings {
  /** GA4 measurement ID, for example G-XXXXXXXXXX. */
  googleAnalyticsId: string;
  /** Microsoft Clarity project ID. */
  clarityProjectId: string;
}

/** Everything the legal pages (mentions légales, CGV, confidentialité...) need about the business. */
export interface LegalSettings {
  siteUrl: string;
  ownerFullName: string;
  legalStatus: string;
  siret: string;
  registration: string;
  postalAddress: string;
  vatStatement: string;
  publicationDirector: string;
  mediator: { name: string; url: string; address: string };
  quoteValidityDays: number;
  depositPercent: string;
  deliveryDelay: string;
  mileageRate: string;
  licenseDurationYears: number;
  emailProvider: string;
  lastUpdated: string;
  siteCredit: string;
  siteCreditUrl: string;
}

export interface SiteSettings {
  name: string;
  tagline: string;
  photographerFirstName: string;
  email: string;
  phone: string;
  city: string;
  radiusKm: number;
  instagramHandle: string;
  instagramUrl: string;
  heroPhoto: { src: string; alt: string };
  bio: string[];
  stats: { value: string; label: string }[];
  portrait: { src: string; alt: string } | null;
  formules: Formule[];
  copyright: string;
  analytics?: AnalyticsSettings;
  legal: LegalSettings;
}
