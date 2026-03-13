Set-Location "C:\Users\chloe\Documents\MDS\No_code\app"
Write-Host "🔍 Vérification complète du projet..." -ForegroundColor Cyan
npx tsx verify-setup.ts
Write-Host "`n✨ Vérification terminée. Appuie sur une touche pour continuer..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

