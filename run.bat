@echo off
title CV Optimeter AI - Startup Launcher
echo ===================================================
echo        Starting CV Optimeter AI Platform
echo ===================================================
echo.
echo [1/3] Clearing ports 8000 and 3000...
powershell -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue" >nul 2>&1
powershell -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue" >nul 2>&1

echo [2/3] Starting FastAPI Backend Service (Port 8000)...
start "CV Optimeter - FastAPI Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --port 8000"

echo [3/3] Starting Next.js Frontend Web App (Port 3000)...
start "CV Optimeter - Next.js Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Waiting 4 seconds for servers to initialize...
timeout /t 4 >nul
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000

echo.
echo ===================================================
echo  CV Optimeter AI is running! Enjoy!
echo ===================================================
