# EDSPORTSHOTS — site vitrine

Site vitrine du photographe de football amateur **Evan D.** (EDSPORTSHOTS, Loire 42) : book de photos, reportages de match, formules et contact.

Construit en Angular 19 (composants standalone, zoneless) + Tailwind CSS 3, déployé automatiquement sur **Azure Static Web Apps** à chaque push sur `main`.

## Stack

- Angular 19 — composants standalone, `provideExperimentalZonelessChangeDetection`, signaux pour l'état d'interface (filtre du book, menu mobile)
- Tailwind CSS 3 pour les styles, avec la palette et les polices du site définies dans `tailwind.config.js`
- Polices Google Fonts : `Archivo Black` (titres) + `Space Grotesk` (texte)
- Aucun backend : le contenu vient de fichiers JSON importés à la compilation, le contact se fait par `mailto:`/`tel:`

## Développer en local

```bash
npm install
npm start
```

Le site est servi sur http://localhost:4200 avec rechargement à chaud.

```bash
npm run build
```

Construit la version de production dans `dist/edsportshots/browser`.

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/azure-static-web-apps-black-moss-0e0f38a03.yml` :
1. installation des dépendances (`npm ci`)
2. build de production (`npm run build`)
3. upload du contenu de `dist/edsportshots/browser` vers l'Azure Static Web App existante (`black-moss-0e0f38a03`)

Rien à faire manuellement : un `git push` sur `main` suffit à mettre le site en ligne. Les pull requests ouvrent un environnement de prévisualisation temporaire, fermé automatiquement à la fusion.

Le fichier `public/staticwebapp.config.json` indique à Azure de rediriger toute URL inconnue (ex. `/reportages/un-match`) vers `index.html`, pour que le routage Angular fonctionne aussi au rechargement direct d'une page.

## Structure du contenu

Tout le texte et toutes les photos du site viennent de deux fichiers, sans avoir besoin de toucher au code :

- `src/app/content/site.json` — informations générales : email, téléphone, bio, statistiques, formules tarifaires, portrait.
- `src/app/content/reportages.json` — la liste des matchs couverts (un reportage = un objet dans ce tableau).

Les photos elles-mêmes vivent dans `public/images/`, servies telles quelles par le site.

### Ajouter un reportage (un nouveau match) et ses photos

1. **Choisis un identifiant court** pour le match, sans espace ni accent, par exemple `u18-d1-mon-club-2026-10`. C'est le `slug` : il sert dans l'URL du reportage (`/reportages/u18-d1-mon-club-2026-10`) et comme nom de dossier pour les photos.

2. **Dépose les photos** dans un nouveau dossier `public/images/reportages/<ton-slug>/`, par exemple :
   ```
   public/images/reportages/u18-d1-mon-club-2026-10/01-cover.jpg
   public/images/reportages/u18-d1-mon-club-2026-10/02-duel.jpg
   public/images/reportages/u18-d1-mon-club-2026-10/03-portrait.jpg
   ```
   Formats JPEG/WebP, plutôt en format vertical (portrait), pas besoin de les redimensionner précisément — le site les recadre automatiquement.

3. **Ajoute une entrée** dans `src/app/content/reportages.json`, en copiant le modèle ci-dessous (place-la en premier dans le tableau si c'est le match le plus récent — le tri se fait ensuite tout seul par date) :

   ```json
   {
     "slug": "u18-d1-mon-club-2026-10",
     "category": "U18 D1",
     "location": "Nom de la ville (42)",
     "date": "2026-10-05",
     "clubA": "Mon Club",
     "clubB": "Club adverse",
     "score": { "a": 2, "b": 2 },
     "deliveredCount": 40,
     "story": "Deux ou trois phrases sur ce match : le contexte, ce qui s'est joué, le moment que tu attendais.",
     "cover": {
       "src": "images/reportages/u18-d1-mon-club-2026-10/01-cover.jpg",
       "alt": "Description courte de la photo pour l'accessibilité",
       "tags": ["u18-d1", "action"],
       "inBook": true
     },
     "photos": [
       {
         "src": "images/reportages/u18-d1-mon-club-2026-10/01-cover.jpg",
         "alt": "Description courte de la photo",
         "tags": ["u18-d1", "action"],
         "inBook": true
       },
       {
         "src": "images/reportages/u18-d1-mon-club-2026-10/02-duel.jpg",
         "alt": "Description courte de la photo",
         "tags": ["u18-d1", "action"],
         "inBook": true
       }
     ]
   }
   ```

   Explication des champs :
   - `category` : la catégorie affichée (`U18 D1`, `U18 D2`, `Seniors`...). Utilise aussi la même valeur en minuscule-avec-tirets dans `tags` (ex. `"u18-d1"`) pour que le filtre de la page "Le book" fonctionne.
   - `score` : mets `null` à la place d'un nombre si tu ne veux pas afficher de score.
   - `deliveredCount` : le nombre de photos livrées au club (peut être différent du nombre de photos affichées sur le site).
   - `tags` de chaque photo : le premier tag est la catégorie (`u18-d1`/`u18-d2`/...), le second le type (`action` ou `portrait`) — ce sont eux qui alimentent les filtres de la page "Le book".
   - `inBook` : mets `false` sur une photo si tu veux qu'elle apparaisse uniquement dans la page du reportage, mais pas dans "Le book".

4. **Commit et push** : `git add`, `git commit`, `git push`. Le site se reconstruit et se redéploie automatiquement en quelques minutes.

### Modifier les infos générales, la bio, les tarifs

Tout se passe dans `src/app/content/site.json` :
- `email`, `phone` : utilisés dans les boutons de contact (`mailto:`/`tel:`) — à mettre à jour avant la mise en ligne définitive.
- `city`, `radiusKm` : affichés dans le texte "Déplacement inclus dans un rayon de..." de la page Formules.
- `bio`, `stats` : les paragraphes et les chiffres de la section "À propos" de l'accueil.
- `portrait` : chemin vers la photo de profil affichée sur l'accueil. Mets `null` pour revenir à l'encart "Ton portrait ici".
- `formules` : les 3 cartes tarifaires (accueil et page Formules) — `highlight: true` sur une seule formule pour la mettre en avant.

Les textes entre crochets, par exemple `[TARIF]` ou `[N]`, sont des espaces à remplir volontairement laissés en évidence — remplace-les par les vraies valeurs avant de partager le site.

## Design

Palette et typographie fixées dans `tailwind.config.js` (couleurs `bg`, `surface`, `text`, `accent`...) et `src/scss/_colors.scss` / `_typography.scss`. L'identité visuelle (fond sombre, accent citron `#D8FF3E`, typo `Archivo Black` / `Space Grotesk`) est volontairement figée : ce n'est pas un thème à changer à la volée, mais l'identité du site.
