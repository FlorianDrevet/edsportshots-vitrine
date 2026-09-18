[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SubscriptionId,

    [Parameter(Mandatory = $true)]
    [string]$ResourceGroup,

    [Parameter(Mandatory = $true)]
    [string]$Repository,

    [string]$Location = "westeurope",

    [ValidateSet("tribune", "chrono", "both")]
    [string]$Only = "both",

    [switch]$DeployNow
)

$ErrorActionPreference = "Stop"

function Invoke-AzJson {
    param([string[]]$Arguments)
    $raw = & az @Arguments --output json
    if ($LASTEXITCODE -ne 0) {
        throw "La commande Azure a échoué : az $($Arguments -join ' ')"
    }
    return ($raw | ConvertFrom-Json)
}

function Invoke-AzText {
    param([string[]]$Arguments)
    $raw = & az @Arguments --output tsv
    if ($LASTEXITCODE -ne 0) {
        throw "La commande Azure a échoué : az $($Arguments -join ' ')"
    }
    return ($raw | Out-String).Trim()
}

function Ensure-Command {
    param([string]$Name)
    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "Commande introuvable : $Name"
    }
}

Ensure-Command "az"
Ensure-Command "gh"

$account = Invoke-AzJson @("account", "show")
if ($account.id -ne $SubscriptionId) {
    & az account set --subscription $SubscriptionId
    if ($LASTEXITCODE -ne 0) {
        throw "Impossible de sélectionner la souscription $SubscriptionId"
    }
}

$null = Invoke-AzJson @("group", "create", "--name", $ResourceGroup, "--location", $Location)

$definitions = @(
    [pscustomobject]@{
        Key = "tribune"
        AppName = "swa-edsportshots-tribune"
        SecretName = "AZURE_STATIC_WEB_APPS_API_TOKEN_TRIBUNE"
        Branch = "design-tribune"
        Workflow = "deploy-tribune.yml"
    },
    [pscustomobject]@{
        Key = "chrono"
        AppName = "swa-edsportshots-chrono"
        SecretName = "AZURE_STATIC_WEB_APPS_API_TOKEN_CHRONO"
        Branch = "design-chrono"
        Workflow = "deploy-chrono.yml"
    }
)

if ($Only -ne "both") {
    $definitions = $definitions | Where-Object { $_.Key -eq $Only }
}

$results = @()
foreach ($definition in $definitions) {
    $existing = & az staticwebapp show --name $definition.AppName --resource-group $ResourceGroup --output json 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace(($existing | Out-String))) {
        Write-Host "Création de $($definition.AppName) en SKU Free..." -ForegroundColor Cyan
        $null = Invoke-AzJson @(
            "staticwebapp", "create",
            "--name", $definition.AppName,
            "--resource-group", $ResourceGroup,
            "--location", $Location,
            "--sku", "Free"
        )
    } else {
        Write-Host "$($definition.AppName) existe déjà, réutilisation." -ForegroundColor Yellow
    }

    $token = Invoke-AzText @(
        "staticwebapp", "secrets", "list",
        "--name", $definition.AppName,
        "--resource-group", $ResourceGroup,
        "--query", "properties.apiKey"
    )
    if ([string]::IsNullOrWhiteSpace($token)) {
        throw "Azure n'a pas retourné de token de déploiement pour $($definition.AppName)"
    }

    Write-Host "Configuration du secret GitHub $($definition.SecretName)..." -ForegroundColor Cyan
    $token | & gh secret set $definition.SecretName --repo $Repository
    if ($LASTEXITCODE -ne 0) {
        throw "Impossible de configurer le secret GitHub $($definition.SecretName)"
    }

    $hostname = Invoke-AzText @(
        "staticwebapp", "show",
        "--name", $definition.AppName,
        "--resource-group", $ResourceGroup,
        "--query", "defaultHostname"
    )
    $results += [pscustomobject]@{
        Variant = $definition.Key
        Branch = $definition.Branch
        Url = "https://$hostname"
        Workflow = ".github/workflows/$($definition.Workflow)"
    }

    if ($DeployNow) {
        Write-Host "Déclenchement du workflow $($definition.Workflow)..." -ForegroundColor Cyan
        & gh workflow run $definition.Workflow --repo $Repository --ref $definition.Branch
        if ($LASTEXITCODE -ne 0) {
            throw "Impossible de déclencher le workflow $($definition.Workflow)"
        }
    }
}

Write-Host ""
Write-Host "Static Web Apps prêtes :" -ForegroundColor Green
$results | Format-Table -AutoSize

if ($DeployNow) {
    Write-Host "Les workflows GitHub sont lancés. Suivi : gh run list --repo $Repository" -ForegroundColor Green
} else {
    Write-Host "Pour déployer après vérification : relancer avec -DeployNow, ou pousser la branche concernée." -ForegroundColor Green
}

