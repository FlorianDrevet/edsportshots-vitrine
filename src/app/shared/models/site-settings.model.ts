export interface Formule {
  title: string;
  subtitle: string;
  features: string[];
  price: string;
  highlight: boolean;
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
}
