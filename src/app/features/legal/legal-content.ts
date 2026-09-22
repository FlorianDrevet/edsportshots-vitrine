import { SiteSettings } from '../../shared/models/site-settings.model';
import { COOKIES_PAGE_PATH, LEGAL_PAGE_PATHS, LegalPagePath } from './legal-page-paths';

export interface LegalLink {
  label: string;
  /** Internal route ("/cookies") or external URL. */
  href: string;
}

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  note?: string;
  links?: LegalLink[];
}

export interface LegalPage {
  title: string;
  eyebrow: string;
  intro: string;
  sections: LegalSection[];
}

const HOST = {
  name: 'Microsoft Ireland Operations Limited (service Microsoft Azure Static Web Apps)',
  address: 'One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, D18 P521, Irlande',
  phone: '+353 1 295 3826',
  url: 'https://azure.microsoft.com/fr-fr/',
};

const CNIL_ADDRESS = 'CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07';

const link = (label: string, href: string): LegalLink => ({ label, href });
const page = (path: LegalPagePath | typeof COOKIES_PAGE_PATH) => `/${path}`;

/** Every legal page, filled from the "legal" block of site.json. */
export function buildLegalPages(site: SiteSettings): Record<LegalPagePath, LegalPage> {
  const legal = site.legal;
  const owner = legal.ownerFullName;
  const brand = site.name;
  const contact = `${site.email} · ${site.phone}`;

  return {
    [LEGAL_PAGE_PATHS.mentionsLegales]: {
      title: 'Mentions légales',
      eyebrow: 'Informations légales',
      intro: `Conformément à l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique (LCEN) et aux articles L111-1 et suivants du Code de la consommation, voici les informations relatives à l’éditeur, à l’hébergeur et aux conditions d’utilisation du site ${legal.siteUrl}.`,
      sections: [
        {
          title: 'Éditeur du site',
          paragraphs: [`Le site ${legal.siteUrl} est édité par ${owner}, photographe, exerçant sous le nom commercial ${brand}.`],
          bullets: [
            `Nom et prénom : ${owner}`,
            `Nom commercial : ${brand}`,
            `Statut : ${legal.legalStatus}`,
            `Numéro SIRET : ${legal.siret}`,
            `Immatriculation : ${legal.registration}`,
            `Adresse : ${legal.postalAddress}`,
            `TVA : ${legal.vatStatement}`,
            `Email : ${site.email}`,
            `Téléphone : ${site.phone}`,
          ],
        },
        {
          title: 'Directeur de la publication',
          paragraphs: [`Le directeur de la publication est ${legal.publicationDirector}, joignable à ${site.email}.`],
        },
        {
          title: 'Hébergeur',
          paragraphs: ['Le site est hébergé par :'],
          bullets: [HOST.name, `Adresse : ${HOST.address}`, `Téléphone : ${HOST.phone}`, `Site web : ${HOST.url}`],
        },
        {
          title: 'Conception et réalisation',
          paragraphs: [
            `Site conçu et développé par ${legal.siteCredit}. Polices de caractères Archivo Black et Space Grotesk, distribuées sous licence SIL Open Font License 1.1 et hébergées sur le site.`,
          ],
          links: [link(legal.siteCredit, legal.siteCreditUrl)],
        },
        {
          title: 'Propriété intellectuelle',
          paragraphs: [
            `L’ensemble des photographies publiées sur ce site sont des œuvres originales de ${owner}, protégées par le Code de la propriété intellectuelle (articles L111-1 et suivants). Il en va de même des textes, du logo ${brand} et de la charte graphique du site.`,
            'Toute reproduction, représentation, adaptation, modification, extraction ou diffusion, totale ou partielle, par quelque procédé que ce soit, sans autorisation écrite préalable est interdite et constitue une contrefaçon sanctionnée par les articles L335-2 et suivants du Code de la propriété intellectuelle (jusqu’à 3 ans d’emprisonnement et 300 000 € d’amende).',
            'Le retrait de la signature ou du filigrane d’une photographie, ainsi que toute altération d’une image, portent en outre atteinte au droit moral de l’auteur (article L121-1), qui est perpétuel et inaliénable.',
            `Les joueurs et leurs proches peuvent partager sur leurs comptes personnels, à titre gratuit et non commercial, les photos sur lesquelles ils apparaissent, à condition de ne pas les modifier et de créditer l’auteur (${site.instagramHandle}). Toute autre utilisation (club, sponsor, presse, usage commercial) nécessite un accord préalable.`,
          ],
          links: [link('Conditions d’utilisation des photos par les clubs', page(LEGAL_PAGE_PATHS.conditionsGenerales))],
        },
        {
          title: 'Droit à l’image des personnes photographiées',
          paragraphs: [
            'Les photographies de ce site représentent des joueurs, arbitres, dirigeants et spectateurs de matchs de football amateur. Toute personne qui se reconnaît sur une photo peut en demander le retrait, gratuitement et sans avoir à se justifier.',
          ],
          links: [link('Droit à l’image et demande de retrait', page(LEGAL_PAGE_PATHS.droitImage))],
        },
        {
          title: 'Données personnelles et cookies',
          paragraphs: [
            'Les traitements de données personnelles réalisés via ce site et les cookies utilisés sont décrits dans la politique de confidentialité et sur la page cookies, où vous pouvez modifier votre choix à tout moment.',
          ],
          links: [
            link('Politique de confidentialité', page(LEGAL_PAGE_PATHS.politiqueConfidentialite)),
            link('Gestion des cookies', page(COOKIES_PAGE_PATH)),
          ],
        },
        {
          title: 'Liens hypertextes',
          paragraphs: [
            `Le site contient des liens vers des services tiers (notamment Instagram). ${owner} n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu ou à leur politique de confidentialité.`,
            'La création d’un lien simple vers la page d’accueil du site est libre. Tout cadrage (framing) ou toute intégration des photos sur un autre site nécessite une autorisation préalable.',
          ],
        },
        {
          title: 'Responsabilité',
          paragraphs: [
            `${owner} s’efforce de fournir des informations exactes et à jour, mais ne peut garantir l’absence d’erreur ou d’omission. Les tarifs et formules présentés sur le site sont indicatifs : seul le devis accepté engage les parties.`,
            'Le site peut être temporairement indisponible pour des raisons de maintenance ou pour des raisons indépendantes de la volonté de l’éditeur.',
          ],
        },
        {
          title: 'Signaler un contenu',
          paragraphs: [
            `Pour signaler un contenu que vous estimez illicite ou qui porte atteinte à vos droits, écrivez à ${site.email} en précisant l’adresse de la page, la photo concernée et le motif de votre demande. Chaque signalement est traité dans les meilleurs délais.`,
          ],
        },
        {
          title: 'Médiation de la consommation',
          paragraphs: [
            'Conformément aux articles L612-1 et suivants du Code de la consommation, tout client consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d’un litige, après avoir adressé une réclamation écrite préalable restée sans réponse satisfaisante.',
          ],
          bullets: [`Médiateur : ${legal.mediator.name}`, `Adresse : ${legal.mediator.address}`, `Site web : ${legal.mediator.url}`],
        },
        {
          title: 'Droit applicable',
          paragraphs: [
            'Les présentes mentions légales sont régies par le droit français. En cas de litige, et à défaut de solution amiable, les tribunaux français seront compétents dans les conditions prévues par la loi.',
          ],
        },
      ],
    },

    [LEGAL_PAGE_PATHS.politiqueConfidentialite]: {
      title: 'Politique de confidentialité',
      eyebrow: 'Données personnelles',
      intro: `Cette politique explique quelles données personnelles sont traitées dans le cadre du site ${legal.siteUrl} et de l’activité de photographe ${brand}, pourquoi, combien de temps, et comment exercer vos droits, conformément au Règlement général sur la protection des données (RGPD, règlement UE 2016/679) et à la loi n° 78-17 du 6 janvier 1978 dite « Informatique et Libertés ».`,
      sections: [
        {
          title: 'Responsable du traitement',
          paragraphs: [
            `Le responsable du traitement est ${owner} (${brand}), ${legal.postalAddress}. Contact : ${contact}.`,
            'Compte tenu de la taille de l’activité, aucun délégué à la protection des données (DPO) n’a été désigné : toutes vos demandes peuvent être adressées directement au contact ci-dessus.',
          ],
        },
        {
          title: 'Demandes de contact et de devis',
          paragraphs: [
            'Le site ne comporte aucun formulaire. Lorsque vous écrivez par email, appelez ou envoyez un message sur Instagram, les données que vous transmettez sont utilisées pour vous répondre et établir un devis.',
          ],
          bullets: [
            'Données : nom, prénom, club, fonction, email, téléphone, informations sur le match (date, lieu, catégorie) et contenu des échanges.',
            'Base légale : mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).',
            'Durée de conservation : 3 ans à compter du dernier contact si aucune prestation n’est commandée.',
          ],
        },
        {
          title: 'Gestion des prestations et facturation',
          bullets: [
            'Données : identité et coordonnées du client ou du représentant du club, devis, factures, historique des paiements, liens de livraison des photos.',
            'Base légale : exécution du contrat (article 6.1.b) et respect des obligations comptables et fiscales (article 6.1.c).',
            'Durée de conservation : durée de la relation commerciale puis 5 ans (prescription civile, article 2224 du Code civil) ; factures et pièces comptables 10 ans (article L123-22 du Code de commerce).',
          ],
        },
        {
          title: 'Photographies des personnes',
          paragraphs: [
            'Une photographie sur laquelle une personne est identifiable constitue une donnée personnelle. Les photos de matchs sont prises lors de rencontres sportives et publiées sur ce site et sur Instagram pour présenter le travail du photographe et rendre compte des matchs.',
          ],
          bullets: [
            'Données : image des joueurs, arbitres, dirigeants et spectateurs ; nom du club, catégorie et date du match. Aucun nom de joueur n’est associé aux photos sur le site.',
            'Base légale : intérêt légitime du photographe à présenter son travail et à couvrir l’actualité sportive locale (article 6.1.f), dans le respect des autorisations recueillies auprès des clubs, des joueurs et, pour les mineurs, de leurs représentants légaux.',
            'Durée de conservation : les photos restent en ligne tant qu’elles illustrent le portfolio et sont retirées sur simple demande. Les fichiers originaux sont archivés pendant la durée de la licence accordée au club, pour permettre de nouvelles livraisons.',
            'Droit d’opposition : vous pouvez à tout moment demander le retrait d’une photo vous représentant, ou représentant votre enfant.',
          ],
          links: [link('Droit à l’image et demande de retrait', page(LEGAL_PAGE_PATHS.droitImage))],
        },
        {
          title: 'Mesure d’audience (Google Analytics 4 et Microsoft Clarity)',
          paragraphs: [
            'Uniquement si vous l’acceptez via le bandeau cookies, des statistiques de fréquentation sont réalisées pour comprendre comment le site est consulté et l’améliorer.',
          ],
          bullets: [
            'Données : identifiant aléatoire de navigateur, pages consultées, durée et source de la visite, clics et défilement, type d’appareil et de navigateur, localisation approximative (pays, ville) déduite de l’adresse IP, qui n’est pas conservée.',
            'Base légale : votre consentement (article 6.1.a du RGPD et article 82 de la loi Informatique et Libertés), retirable à tout moment.',
            'Durée de conservation : cookies 13 mois maximum ; données Google Analytics conservées 14 mois ; enregistrements de sessions Clarity conservés 30 jours et statistiques agrégées 13 mois ; votre choix de cookies est conservé 6 mois.',
          ],
          links: [link('Détail des cookies et modification de votre choix', page(COOKIES_PAGE_PATH))],
        },
        {
          title: 'Journaux techniques d’hébergement',
          bullets: [
            'Données : adresse IP, date et heure, page demandée, navigateur, générées automatiquement lors de toute connexion au site.',
            'Base légale : intérêt légitime à assurer la sécurité et le bon fonctionnement du site (article 6.1.f) et obligations légales de l’hébergeur.',
            'Durée de conservation : 12 mois maximum, selon les règles de l’hébergeur.',
          ],
        },
        {
          title: 'Destinataires des données',
          paragraphs: [
            `Vos données sont destinées exclusivement à ${owner}. Elles ne sont jamais vendues, louées ni cédées à des fins commerciales. Seuls des prestataires techniques y ont accès, pour le strict besoin de leur mission :`,
          ],
          bullets: [
            `Hébergement du site : ${HOST.name}.`,
            'Mesure d’audience (si vous l’acceptez) : Google Ireland Limited / Google LLC (Google Analytics 4) et Microsoft Ireland Operations Limited / Microsoft Corporation (Clarity).',
            `Messagerie électronique : ${legal.emailProvider}.`,
            'Messagerie Instagram : Meta Platforms Ireland Limited, si vous choisissez ce canal (la politique de confidentialité de Meta s’applique alors).',
            'Le cas échéant, l’expert-comptable et les administrations habilitées (administration fiscale, URSSAF) dans le cadre des obligations légales.',
          ],
        },
        {
          title: 'Transferts hors de l’Union européenne',
          paragraphs: [
            'Google LLC et Microsoft Corporation peuvent traiter certaines données aux États-Unis. Ces transferts reposent sur la décision d’adéquation de la Commission européenne du 10 juillet 2023 relative au cadre EU-U.S. Data Privacy Framework, auquel ces sociétés sont certifiées, et sur les clauses contractuelles types adoptées par la Commission européenne.',
          ],
        },
        {
          title: 'Vos droits',
          paragraphs: [
            'Vous disposez des droits suivants sur vos données : droit d’accès (article 15), de rectification (article 16), d’effacement (article 17), de limitation (article 18), de portabilité (article 20), d’opposition (article 21), ainsi que du droit de retirer votre consentement à tout moment, sans que cela remette en cause les traitements déjà réalisés. Vous pouvez également définir des directives relatives au sort de vos données après votre décès (article 85 de la loi Informatique et Libertés).',
            `Pour exercer ces droits, écrivez à ${site.email} ou par courrier à ${legal.postalAddress}. Une réponse vous sera apportée dans un délai d’un mois, prolongeable de deux mois en cas de demande complexe (article 12 du RGPD). Un justificatif d’identité ne pourra être demandé qu’en cas de doute raisonnable sur votre identité.`,
            `Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL : ${CNIL_ADDRESS}, ou en ligne.`,
          ],
          links: [link('Déposer une plainte auprès de la CNIL', 'https://www.cnil.fr/fr/plaintes')],
        },
        {
          title: 'Mineurs',
          paragraphs: [
            'Le site ne collecte volontairement aucune donnée auprès des mineurs. Les demandes concernant un mineur (retrait de photo, accès, effacement) peuvent être faites par le mineur lui-même ou par l’un de ses représentants légaux ; elles sont traitées en priorité.',
          ],
        },
        {
          title: 'Sécurité',
          paragraphs: [
            'Le site est exclusivement servi en HTTPS. Les échanges et fichiers clients sont conservés sur des supports protégés par mot de passe, et l’accès aux comptes des prestataires est sécurisé. Aucune décision automatisée ni profilage n’est réalisé à partir de vos données.',
          ],
        },
        {
          title: 'Modification de cette politique',
          paragraphs: [
            'Cette politique peut évoluer, notamment en cas d’ajout d’un nouvel outil. En cas de changement concernant les cookies, votre consentement vous sera redemandé. La date de dernière mise à jour figure en haut de la page.',
          ],
        },
      ],
    },

    [LEGAL_PAGE_PATHS.conditionsGenerales]: {
      title: 'Conditions générales de vente',
      eyebrow: 'Prestations photo',
      intro: `Les présentes conditions générales de vente (CGV) s’appliquent à toutes les prestations photographiques réalisées par ${owner} (${brand}) pour des clubs, associations, entreprises ou particuliers. Elles sont communiquées à tout client qui en fait la demande (article L441-1 du Code de commerce) et prévalent sur tout autre document, sauf accord écrit contraire figurant sur le devis.`,
      sections: [
        {
          title: '1. Prestations',
          paragraphs: [
            'Les prestations proposées sont décrites sur la page Formules : reportage photo d’un match, portraits d’équipe et suivi d’une saison. Le contenu exact de chaque prestation (nombre de photos, délais, usages autorisés) est précisé sur le devis.',
          ],
        },
        {
          title: '2. Devis et commande',
          paragraphs: [
            `Toute prestation fait l’objet d’un devis gratuit, valable ${legal.quoteValidityDays} jours. La commande est ferme dès réception du devis accepté (signé ou validé par écrit, y compris par email) et, le cas échéant, de l’acompte de ${legal.depositPercent} du montant total.`,
            'L’acceptation du devis emporte acceptation des présentes CGV.',
          ],
        },
        {
          title: '3. Prix',
          paragraphs: [
            `Les prix sont indiqués en euros. ${legal.vatStatement}. Les tarifs affichés sur le site sont des prix de départ à titre indicatif ; seul le prix figurant sur le devis fait foi.`,
            `Le déplacement est inclus dans un rayon de ${site.radiusKm} km autour de ${site.city}. Au-delà, des frais de déplacement de ${legal.mileageRate} sont facturés et mentionnés sur le devis.`,
          ],
        },
        {
          title: '4. Paiement',
          paragraphs: [
            'Le solde est payable à réception de la facture, et au plus tard dans un délai de 30 jours, par virement bancaire ou tout autre moyen indiqué sur la facture. Aucun escompte n’est accordé en cas de paiement anticipé.',
            'Pour les clients professionnels et associations, tout retard de paiement entraîne de plein droit des pénalités de retard égales à trois fois le taux d’intérêt légal, ainsi qu’une indemnité forfaitaire pour frais de recouvrement de 40 € (articles L441-10 et D441-5 du Code de commerce). Pour les consommateurs, les intérêts de retard au taux légal s’appliquent après mise en demeure.',
            'Les fichiers définitifs peuvent n’être livrés qu’après encaissement complet du prix. La licence d’utilisation des photos (article 7) n’est acquise qu’après paiement intégral.',
          ],
        },
        {
          title: '5. Annulation et report',
          bullets: [
            'Match reporté ou annulé par la fédération, le district ou pour intempéries : la prestation est reportée sans frais à une nouvelle date, ou l’acompte est remboursé si aucune date ne convient.',
            'Annulation par le client plus de 7 jours avant la date prévue : l’acompte est remboursé.',
            'Annulation par le client moins de 7 jours avant la date prévue : l’acompte reste acquis au photographe à titre d’indemnité.',
            'Empêchement du photographe (maladie, accident, force majeure) : il propose un report ou, à défaut, rembourse intégralement les sommes versées.',
          ],
        },
        {
          title: '6. Réalisation et livraison',
          paragraphs: [
            'Le photographe dispose d’une liberté artistique dans le choix des cadrages, de la sélection et de la retouche des images. Il intervient dans le respect du règlement du club et des consignes de sécurité du terrain.',
            `Les photos sélectionnées et retouchées sont livrées en haute définition (format JPEG), par galerie en ligne ou lien de téléchargement, dans un délai de ${legal.deliveryDelay} après la prestation, sauf mention contraire sur le devis. Les fichiers bruts (RAW) et les photos non sélectionnées ne sont pas livrés.`,
            'Le client dispose de 30 jours après la livraison pour télécharger et sauvegarder les fichiers. Passé ce délai, la galerie peut être fermée ; le photographe conserve une archive mais ne garantit pas sa disponibilité illimitée.',
          ],
        },
        {
          title: '7. Droits d’auteur et licence d’utilisation',
          paragraphs: [
            `Les photographies sont des œuvres protégées par le Code de la propriété intellectuelle. ${owner} en reste l’unique auteur et titulaire des droits. Conformément à l’article L131-3 de ce code, seuls les droits expressément listés ci-dessous sont concédés au client, après paiement intégral :`,
          ],
          bullets: [
            'Nature : licence non exclusive et non transférable de reproduction et de représentation.',
            'Usages autorisés : communication propre du club ou du client — site internet, réseaux sociaux, newsletters, affiches, programmes de match, supports internes et presse locale relayant l’actualité du club.',
            `Territoire et durée : monde entier, pour une durée de ${legal.licenseDurationYears} ans à compter de la livraison.`,
            `Crédit obligatoire : « © ${brand} » ou « ${site.instagramHandle} » à proximité de chaque photo, ou dans le texte de la publication sur les réseaux sociaux.`,
            'Usages exclus sans accord écrit et rémunération complémentaire : revente ou cession des photos à des tiers, usage par des sponsors ou partenaires, publicité commerciale, produits dérivés vendus (calendriers, goodies…), concours photo, entraînement de modèles d’intelligence artificielle.',
            'Les photos ne doivent pas être modifiées de manière à dénaturer l’œuvre (filtres, montage, recadrage excessif), le droit moral de l’auteur étant inaliénable (article L121-1). Un recadrage aux formats des réseaux sociaux est autorisé.',
          ],
        },
        {
          title: '8. Droit à l’image des personnes photographiées',
          paragraphs: [
            'Le club client garantit avoir informé ses licenciés, et pour les mineurs leurs représentants légaux, de la présence du photographe, et avoir recueilli les autorisations de captation et de diffusion de leur image nécessaires aux usages qu’il fait des photos. Le club reste seul responsable de la diffusion qu’il assure des photos livrées.',
            'Le photographe retire de ses propres supports (site, Instagram) toute photo dont une personne représentée, ou son représentant légal, demande le retrait. Il en informe le club, qui s’engage à faire de même sur ses supports.',
          ],
          links: [link('Droit à l’image', page(LEGAL_PAGE_PATHS.droitImage))],
        },
        {
          title: '9. Droit de rétractation (clients consommateurs)',
          paragraphs: [
            'Lorsque le contrat est conclu à distance (email, téléphone, messagerie) ou hors établissement avec un consommateur, celui-ci dispose d’un délai de 14 jours à compter de la conclusion du contrat pour se rétracter, sans avoir à se justifier ni à payer de pénalité (article L221-18 du Code de la consommation). Ce droit ne s’applique pas aux clubs, associations ou professionnels commandant pour les besoins de leur activité.',
            'Pour l’exercer, le consommateur adresse avant l’expiration du délai une déclaration dénuée d’ambiguïté par email ou courrier, par exemple au moyen du modèle ci-dessous. Les sommes versées sont remboursées dans les 14 jours suivant la réception de la rétractation, par le même moyen de paiement.',
            'Si le consommateur demande expressément que la prestation commence avant la fin du délai de rétractation (par exemple pour un match ayant lieu dans les 14 jours), il reste redevable d’un montant proportionnel au service déjà fourni en cas de rétractation (article L221-25). Il ne peut plus se rétracter une fois la prestation pleinement exécutée, s’il l’a expressément demandé et a reconnu perdre ce droit (article L221-28, 1°).',
          ],
          note: `Modèle de formulaire de rétractation — À l’attention de ${owner}, ${brand}, ${legal.postalAddress}, ${site.email} : « Je vous notifie par la présente ma rétractation du contrat portant sur la prestation de services ci-dessous : [description]. Commandée le : [date]. Nom du consommateur : [nom]. Adresse du consommateur : [adresse]. Date et signature (en cas d’envoi papier). »`,
        },
        {
          title: '10. Garanties légales et réclamations',
          paragraphs: [
            'Pour les consommateurs, les photos livrées sous forme de fichiers numériques bénéficient de la garantie légale de conformité des contenus numériques (articles L224-25-12 et suivants du Code de la consommation) : un fichier défectueux, illisible ou non conforme au devis est remplacé sans frais.',
            `Toute réclamation doit être adressée par écrit à ${site.email}. Les choix artistiques (cadrage, sélection, rendu des couleurs) relèvent de la liberté de création du photographe et ne constituent pas, à eux seuls, un défaut de conformité.`,
          ],
        },
        {
          title: '11. Responsabilité et force majeure',
          paragraphs: [
            'Le photographe est tenu à une obligation de moyens. Il sauvegarde les fichiers sur deux supports distincts dès la fin de la prestation. En cas de perte ou de destruction accidentelle des fichiers avant livraison, sa responsabilité est limitée au remboursement des sommes versées pour la prestation concernée, sauf faute lourde ou dolosive et dans les limites permises par la loi.',
            'Aucune des parties ne pourra être tenue responsable de l’inexécution de ses obligations en cas de force majeure au sens de l’article 1218 du Code civil.',
          ],
        },
        {
          title: '12. Données personnelles',
          paragraphs: ['Les données des clients sont traitées conformément à la politique de confidentialité.'],
          links: [link('Politique de confidentialité', page(LEGAL_PAGE_PATHS.politiqueConfidentialite))],
        },
        {
          title: '13. Médiation et litiges',
          paragraphs: [
            `En cas de litige, les parties recherchent d’abord une solution amiable. Le client consommateur peut recourir gratuitement au médiateur de la consommation : ${legal.mediator.name} — ${legal.mediator.url} — ${legal.mediator.address}, dans un délai d’un an à compter de sa réclamation écrite.`,
            'Les présentes CGV sont soumises au droit français. À défaut d’accord amiable, le litige est porté devant les juridictions compétentes. Pour les clients professionnels et associations, compétence est attribuée au tribunal du ressort du domicile professionnel du photographe.',
          ],
        },
      ],
    },

    [LEGAL_PAGE_PATHS.droitImage]: {
      title: 'Droit à l’image',
      eyebrow: 'Joueurs · parents · clubs',
      intro: `Chaque personne a droit au respect de son image (article 9 du Code civil), et une photo sur laquelle on vous reconnaît est une donnée personnelle au sens du RGPD. Voici comment ${brand} prend en compte ces droits, et comment obtenir le retrait d’une photo.`,
      sections: [
        {
          title: 'Dans quel cadre les photos sont prises',
          paragraphs: [
            'Les photos sont prises lors de matchs et d’événements de football amateur, sur des terrains ouverts au public, à la demande ou avec l’accord du club. Les images d’action saisissent les joueurs dans l’exercice de leur activité sportive, dans le cadre de l’événement.',
            'Les portraits individuels et photos d’équipe sont réalisés avec l’accord des personnes photographiées, dans le cadre d’une séance organisée par le club.',
          ],
        },
        {
          title: 'Mes engagements',
          bullets: [
            'Aucune photo dévalorisante, humiliante ou portant atteinte à la dignité (blessure, geste déplacé, tenue) n’est publiée.',
            'Aucun nom de joueur n’est associé aux photos publiées sur le site ; seuls le club, la catégorie et la date du match sont indiqués.',
            'Aucune photo n’est vendue à des tiers ni utilisée dans une publicité sans l’accord écrit des personnes représentées.',
            'Pour les mineurs, la diffusion s’appuie sur les autorisations recueillies par le club auprès des représentants légaux. Tout refus signalé par un parent est respecté.',
            'Les photos ne sont soumises à aucun outil de reconnaissance faciale.',
          ],
        },
        {
          title: 'Demander le retrait d’une photo',
          paragraphs: [
            `Vous vous reconnaissez, ou vous reconnaissez votre enfant, sur une photo et vous ne souhaitez pas qu’elle soit diffusée ? Écrivez à ${site.email} ou envoyez un message à ${site.instagramHandle}, en indiquant l’adresse de la page ou une capture de la photo.`,
            'La demande est gratuite et n’a pas à être justifiée. La photo est retirée du site et d’Instagram dans les meilleurs délais — en pratique sous 72 heures, et au plus tard dans le délai d’un mois prévu par l’article 12 du RGPD. Les demandes concernant des mineurs sont traitées en priorité.',
            'Le retrait est aussi signalé au club concerné, afin qu’il retire la photo de ses propres supports.',
          ],
        },
        {
          title: 'Pour les clubs',
          paragraphs: [
            'Le club qui commande une prestation doit informer ses licenciés de la présence du photographe et disposer des autorisations de droit à l’image nécessaires aux usages qu’il fait des photos — notamment une autorisation écrite des représentants légaux pour les joueurs mineurs, souvent recueillie avec la licence ou en début de saison.',
            'Il est recommandé de signaler au photographe, avant le match, les joueurs qui ne doivent pas apparaître sur les photos diffusées.',
          ],
          links: [link('Conditions générales de vente', page(LEGAL_PAGE_PATHS.conditionsGenerales))],
        },
        {
          title: 'Vos autres droits',
          paragraphs: [
            'Vous disposez également des droits d’accès, d’effacement et d’opposition prévus par le RGPD, ainsi que du droit d’introduire une réclamation auprès de la CNIL.',
          ],
          links: [link('Politique de confidentialité', page(LEGAL_PAGE_PATHS.politiqueConfidentialite))],
        },
      ],
    },

    [LEGAL_PAGE_PATHS.accessibilite]: {
      title: 'Accessibilité',
      eyebrow: 'Démarche volontaire',
      intro: `${brand} souhaite que son site soit consultable par tous, y compris par les personnes en situation de handicap.`,
      sections: [
        {
          title: 'Cadre légal',
          paragraphs: [
            'En tant que micro-entreprise, l’éditeur n’est pas soumis à l’obligation de déclaration de conformité au RGAA prévue par l’article 47 de la loi n° 2005-102 du 11 février 2005, ni aux exigences d’accessibilité issues de la directive (UE) 2019/882, dont les micro-entreprises prestataires de services sont exemptées. Les efforts décrits ci-dessous relèvent d’une démarche volontaire.',
          ],
        },
        {
          title: 'État actuel',
          paragraphs: [
            'Le site n’a pas fait l’objet d’un audit de conformité RGAA et est donc déclaré non audité. Les bonnes pratiques suivantes sont néanmoins appliquées :',
          ],
          bullets: [
            'Textes alternatifs décrivant les photographies.',
            'Structure de titres hiérarchisée et langue de la page déclarée.',
            'Contrastes élevés entre le texte et le fond.',
            'Navigation possible au clavier, y compris dans le bandeau et la page de gestion des cookies.',
            'Mise en page adaptée aux mobiles et au zoom du navigateur.',
          ],
        },
        {
          title: 'Signaler une difficulté',
          paragraphs: [
            `Si vous ne parvenez pas à accéder à un contenu ou à une fonctionnalité, écrivez à ${site.email} en précisant la page concernée et votre équipement. Une réponse ou une alternative accessible vous sera proposée dans les meilleurs délais.`,
          ],
        },
      ],
    },
  };
}
