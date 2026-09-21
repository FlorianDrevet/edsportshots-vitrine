export interface Photo {
  src: string;
  alt: string;
  /** Tags used by "Le book" filters, e.g. category ('u18-d1', 'u18-d2') and type ('action', 'portrait'). */
  tags: string[];
  /** Only photos with inBook: true show up on the /galerie page. */
  inBook: boolean;
}
