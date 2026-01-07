@echo off
echo ========================================
echo Demarrage du Frontend HotelReserve
echo ========================================
echo.

cd frontend

if not exist "package.json" (
    echo [ERREUR] package.json introuvable!
    echo Assurez-vous d'etre dans le dossier CMS\frontend
    pause
    exit /b 1
)

echo [OK] Dossier frontend trouve
echo.

if not exist "node_modules" (
    echo [INSTALLATION] Installation des dependances...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERREUR] Echec de l'installation
        pause
        exit /b 1
    )
    echo [OK] Dependances installees
    echo.
)

if not exist ".env" (
    echo [ATTENTION] Fichier .env manquant!
    echo Creez frontend/.env avec:
    echo    REACT_APP_API_URL=http://localhost:5000/api
    echo.
)

echo [DEMARRAGE] Application React...
echo.
npm start

pause








