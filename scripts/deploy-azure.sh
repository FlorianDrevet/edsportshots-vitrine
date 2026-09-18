#!/usr/bin/env bash
set -euo pipefail

SUBSCRIPTION_ID=""
RESOURCE_GROUP="rg-edsportshots-demo"
REPOSITORY="FlorianDrevet/edsportshots-vitrine"
LOCATION="westeurope"
ONLY="both"
DEPLOY_NOW="false"

usage() {
  cat <<'EOF'
Usage: ./scripts/deploy-azure.sh --subscription <id> [--resource-group <name>] [--repository <owner/repo>] [--location <azure-region>] [--only tribune|chrono|both] [--deploy-now]
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --subscription) SUBSCRIPTION_ID="$2"; shift 2 ;;
    --resource-group) RESOURCE_GROUP="$2"; shift 2 ;;
    --repository) REPOSITORY="$2"; shift 2 ;;
    --location) LOCATION="$2"; shift 2 ;;
    --only) ONLY="$2"; shift 2 ;;
    --deploy-now) DEPLOY_NOW="true"; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Option inconnue : $1" >&2; usage; exit 1 ;;
  esac
done

if [[ -z "$SUBSCRIPTION_ID" ]]; then
  echo "--subscription est obligatoire" >&2
  usage
  exit 1
fi

az account set --subscription "$SUBSCRIPTION_ID"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION" >/dev/null

create_one() {
  local key="$1" app="$2" branch="$3" secret="$4" workflow="$5"
  if ! az staticwebapp show --name "$app" --resource-group "$RESOURCE_GROUP" >/dev/null 2>&1; then
    az staticwebapp create --name "$app" --resource-group "$RESOURCE_GROUP" --location "$LOCATION" --sku Free >/dev/null
  fi
  az staticwebapp secrets list --name "$app" --resource-group "$RESOURCE_GROUP" --query properties.apiKey -o tsv \
    | gh secret set "$secret" --repo "$REPOSITORY"
  local host
  host="$(az staticwebapp show --name "$app" --resource-group "$RESOURCE_GROUP" --query defaultHostname -o tsv)"
  echo "$key : https://$host (branche $branch)"
  if [[ "$DEPLOY_NOW" == "true" ]]; then
    gh workflow run "$workflow" --repo "$REPOSITORY" --ref "$branch"
  fi
}

case "$ONLY" in
  tribune) create_one tribune swa-edsportshots-tribune design-tribune AZURE_STATIC_WEB_APPS_API_TOKEN_TRIBUNE deploy-tribune.yml ;;
  chrono) create_one chrono swa-edsportshots-chrono design-chrono AZURE_STATIC_WEB_APPS_API_TOKEN_CHRONO deploy-chrono.yml ;;
  both)
    create_one tribune swa-edsportshots-tribune design-tribune AZURE_STATIC_WEB_APPS_API_TOKEN_TRIBUNE deploy-tribune.yml
    create_one chrono swa-edsportshots-chrono design-chrono AZURE_STATIC_WEB_APPS_API_TOKEN_CHRONO deploy-chrono.yml
    ;;
  *) echo "--only doit être tribune, chrono ou both" >&2; exit 1 ;;
esac

