$hub = 'd:\GitHub_Repo\Task-Dashboard'
$siblingRepos = @(
  'd:\GitHub_Repo\Task-Dashboard',
  'd:\GitHub_Repo\BMS',
  'd:\GitHub_Repo\Capsicum',
  'd:\GitHub_Repo\QSR',
  'd:\GitHub_Repo\UG-Farmhouse'
)

Write-Host '===============================================================' -ForegroundColor Cyan
Write-Host '🔄 EXECUTING 3-PACKAGE SAP MULTI-REPO SYNCHRONIZATION' -ForegroundColor Cyan
Write-Host '===============================================================' -ForegroundColor Cyan

# 1. Sync to Task-Dashboard (Canonical Hub)
if (Test-Path $hub) {
    Copy-Item '.agent\patterns\web-deployment-gate.md' ($hub + '\.agent\patterns\web-deployment-gate.md') -Force
    Copy-Item '.agent\workflows\web-deployment-gate.md' ($hub + '\.agent\workflows\web-deployment-gate.md') -Force
    Copy-Item '.agent\workflows\sap-sync.md' ($hub + '\.agent\workflows\sap-sync.md') -Force
    Copy-Item '.agent\skills\web-deployment-gate\SKILL.md' ($hub + '\.agent\skills\web-deployment-gate\SKILL.md') -Force

    Copy-Item 'scripts\verify-deployment.cjs' ($hub + '\scripts\verify-deployment.cjs') -Force
    Copy-Item 'scripts\forensic-audit.cjs' ($hub + '\scripts\forensic-audit.cjs') -Force
    Copy-Item 'scripts\verify-react-deployment.cjs' ($hub + '\scripts\verify-react-deployment.cjs') -Force
    Copy-Item 'scripts\bootstrap-web-app.cjs' ($hub + '\scripts\bootstrap-web-app.cjs') -Force
    Copy-Item 'scripts\triage-requests.cjs' ($hub + '\scripts\triage-requests.cjs') -Force
    Copy-Item '.deploymentrc.json' ($hub + '\.deploymentrc.json') -Force

    if (!(Test-Path ($hub + '\templates\web-spa-shell'))) {
        New-Item -ItemType Directory -Force -Path ($hub + '\templates\web-spa-shell') | Out-Null
    }
    Copy-Item 'templates\web-spa-shell\*' ($hub + '\templates\web-spa-shell\') -Recurse -Force
    Copy-Item 'scripts\triage-requests.cjs' ($hub + '\templates\web-spa-shell\scripts\triage-requests.cjs') -Force

    if (Test-Path ($hub + '\User_Created\Discussion Threads\Council')) {
        Copy-Item 'User_Created\Discussion Threads\Council\260822_arch_council_release_and_refactor_assurance_pipeline.md' ($hub + '\User_Created\Discussion Threads\Council\') -Force
        Copy-Item 'User_Created\Discussion Threads\Council\260822_arch_council_web_app_bootstrap_package.md' ($hub + '\User_Created\Discussion Threads\Council\') -Force
    }

    Write-Host '  ✓ [SYNC] Canonical Hub (Task-Dashboard) fully updated with all 3 packages' -ForegroundColor Green
}

# 2. Sync to sibling web repos
foreach ($repo in $siblingRepos) {
    if (Test-Path $repo) {
        $pDir = $repo + '\.agent\patterns'
        $wDir = $repo + '\.agent\workflows'
        $sDir = $repo + '\.agent\skills\web-deployment-gate'
        $scDir = $repo + '\scripts'

        if (Test-Path $pDir) { Copy-Item '.agent\patterns\web-deployment-gate.md' $pDir -Force }
        if (Test-Path $wDir) { 
            Copy-Item '.agent\workflows\web-deployment-gate.md' $wDir -Force 
            Copy-Item '.agent\workflows\sap-sync.md' $wDir -Force 
        }
        if (Test-Path $sDir) { Copy-Item '.agent\skills\web-deployment-gate\SKILL.md' $sDir -Force }
        if (Test-Path $scDir) {
            Copy-Item 'scripts\verify-deployment.cjs' $scDir -Force
            Copy-Item 'scripts\verify-react-deployment.cjs' $scDir -Force
            Copy-Item 'scripts\forensic-audit.cjs' $scDir -Force
            Copy-Item 'scripts\bootstrap-web-app.cjs' $scDir -Force
            Copy-Item 'scripts\triage-requests.cjs' $scDir -Force
        }
        $rName = Split-Path $repo -Leaf
        Write-Host ('  ✓ [SYNC] Sibling repo ' + $rName + ' synced with 3 Core Packages (Gate, Bootstrap, Triage)') -ForegroundColor Green
    }
}

Write-Host '===============================================================' -ForegroundColor Cyan
Write-Host '✅ SAP SYNCHRONIZATION 100% COMPLETE ACROSS ALL REPOSITORIES' -ForegroundColor Green
Write-Host '===============================================================' -ForegroundColor Cyan
