Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "       Starting CV Optimeter AI Platform" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Clearing ports 8000 and 3000..." -ForegroundColor Yellow
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "[2/3] Launching FastAPI Backend (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\backend'; python -m uvicorn app.main:app --reload --port 8000"

Write-Host "[3/3] Launching Next.js Frontend (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\frontend'; npm run dev"

Write-Host ""
Write-Host "Waiting 4 seconds for services..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

Write-Host "Opening http://localhost:3000 in your browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "Platform is live!" -ForegroundColor Green
