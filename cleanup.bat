@echo off
echo Nettoyage des processus Node.js...
echo.

:: Tuer tous les processus Node.js
taskkill /F /IM node.exe >nul 2>&1

:: Attendre 2 secondes
timeout /t 2 /nobreak >nul

:: Vérifier si des processus existent encore
tasklist | findstr node.exe >nul
if %errorlevel% equ 0 (
    echo Attention: Des processus Node.js sont encore actifs
) else (
    echo Tous les processus Node.js ont été terminés
)

echo.
echo Nettoyage du port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Fermeture du processus PID %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Nettoyage terminé!
pause
