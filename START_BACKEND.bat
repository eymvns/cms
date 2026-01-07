@echo off
echo ========================================
echo Demarrage du Backend HotelReserve
echo ========================================
echo.

cd backend

if not exist "package.json" (
    echo [ERREUR] package.json introuvable!
    echo Assurez-vous d'etre dans le dossier CMS\backend
    pause
    exit /b 1
)

echo [OK] Dossier backend trouve
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
    echo Creez backend/.env avec:
    echo    MONGO_URI=mongodb://localhost:27017/hotelreserve
    echo    JWT_SECRET=votre-secret-key
    echo    PORT=5000
    echo    CLIENT_URL=http://localhost:3000
    echo.
    pause
)

echo [DEMARRAGE] Serveur backend...
echo.
npm start

pause








