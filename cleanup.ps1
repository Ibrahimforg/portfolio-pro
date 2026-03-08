# Script PowerShell de Nettoyage Rapide
Write-Host "🧹 Nettoyage des processus Node.js..." -ForegroundColor Cyan

# Tuer tous les processus Node.js
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Processus Node.js trouvés: $($nodeProcesses.Count)" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "  - PID: $($_.Id)" -ForegroundColor Gray
        $_.Kill() | Out-Null
    }
    Write-Host "✅ Processus Node.js terminés" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Aucun processus Node.js trouvé" -ForegroundColor Blue
}

# Nettoyer le port 3000
Write-Host "`n🔍 Vérification du port 3000..." -ForegroundColor Cyan
$port3000 = netstat -ano | Select-String ":3000"
if ($port3000) {
    Write-Host "Port 3000 occupé, nettoyage..." -ForegroundColor Yellow
    $port3000 | ForEach-Object {
        if ($_ -match '(\d+)$') {
            $processId = $matches[1]
            Write-Host "  - Fermeture du PID: $processId" -ForegroundColor Gray
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "✅ Port 3000 libéré" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Port 3000 déjà libre" -ForegroundColor Blue
}

Write-Host "`n🚀 Nettoyage terminé! Prêt à lancer le serveur." -ForegroundColor Green
Start-Sleep -Seconds 2
