# Powershell script to clear Next.js build cache and restart dev server
Write-Host "Cleaning Next.js cache..." -ForegroundColor Cyan
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force
    Write-Host "Cache cleared!" -ForegroundColor Green
} else {
    Write-Host "No cache found, skipping." -ForegroundColor Yellow
}

Write-Host "Starting development server..." -ForegroundColor Cyan
npm run dev
