# EDSPORTSHOTS — site vitrine

Deux directions visuelles basées sur la maquette fournie :

- `design-tribune` — direction A, éditoriale et chaleureuse.
- `design-chrono` — direction C, sombre, rythmée et orientée scoreboard.

Chaque branche contient une page statique complète et son workflow GitHub Actions. Les deux sites sont volontairement sans framework : ils peuvent être servis directement par Azure Static Web Apps avec le plan **Free**.

## Démonstration locale

Depuis la branche choisie :

```powershell
py -m http.server 8080
```

Puis ouvrir <http://localhost:8080>.

## Démonstration en ligne

- [Direction Tribune](https://black-moss-0e0f38a03.4.azurestaticapps.net)
- [Direction Chrono](https://witty-sand-05b31c403.1.azurestaticapps.net)

## Déploiement Azure

Prérequis :

- Azure CLI (`az`) connecté à la souscription cible ;
- GitHub CLI (`gh`) connecté au dépôt ;
- un dépôt GitHub contenant les branches `design-tribune` et `design-chrono`.

Le script crée deux ressources Azure Static Web Apps en **Free**, configure les secrets GitHub de déploiement et peut lancer les workflows :

```powershell
./scripts/deploy-azure.ps1 `
  -SubscriptionId "fc4fa56f-e4e7-41e9-8a0d-559fcd27b827" `
  -ResourceGroup "rg-edsportshots-demo" `
  -Repository "FlorianDrevet/edsportshots-vitrine" `
  -Location "westeurope" `
  -DeployNow
```

Pour une seule direction, ajouter `-Only tribune` ou `-Only chrono`. Le script ne supprime aucune ressource existante : il crée ou réutilise les noms attendus et s'arrête si une action destructrice serait nécessaire.

Une version Bash équivalente se trouve dans `scripts/deploy-azure.sh`.

## Personnalisation avant mise en ligne

Les coordonnées de contact affichées dans les maquettes sont des valeurs de démonstration. Remplacer l'adresse e-mail, le téléphone, le lien Instagram et les textes éditoriaux dans `index.html` de chaque branche avant la mise en ligne définitive.

## Nommage Azure

Le script utilise par défaut :

- `swa-edsportshots-tribune` → branche `design-tribune` ;
- `swa-edsportshots-chrono` → branche `design-chrono`.

Les URL finales sont affichées par le script et restent consultables avec `az staticwebapp show`.
