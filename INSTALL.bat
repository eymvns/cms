@echo off
REM Script d'installation automatique pour Windows
REM Usage: INSTALL.bat

echo.
echo ========================================
echo Installation de HotelReserve/VOIMA
echo ========================================
echo.

REM Vérifier Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Node.js n'est pas installe!
    echo Telechargez-le depuis: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js trouve
node --version
echo [OK] npm trouve
npm --version
echo.

REM Installation Backend
echo [INSTALLATION] Backend...
cd backend

if not exist "package.json" (
    echo [ERREUR] package.json introuvable dans backend/
    pause
    exit /b 1
)

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Erreur lors de l'installation backend
    pause
    exit /b 1
)

echo [OK] Backend installe!
echo.

REM Vérifier .env backend
if not exist ".env" (
    echo [ATTENTION] Fichier .env manquant dans backend/
    echo Creez-le avec:
    echo    PORT=5000
    echo    MONGO_URI=mongodb://localhost:27017/hotelreserve
    echo    JWT_SECRET=votre-secret-key
    echo    CLIENT_URL=http://localhost:3000
    echo.
) else (
    echo [OK] Fichier .env trouve dans backend/
)

cd ..

REM Installation Frontend
echo [INSTALLATION] Frontend...
cd frontend

if not exist "package.json" (
    echo [ERREUR] package.json introuvable dans frontend/
    pause
    exit /b 1
)

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Erreur lors de l'installation frontend
    pause
    exit /b 1
)

echo [OK] Frontend installe!
echo.

REM Vérifier .env frontend
if not exist ".env" (
    echo [ATTENTION] Fichier .env manquant dans frontend/
    echo Creez-le avec:
    echo    REACT_APP_API_URL=http://localhost:5000/api
    echo.
) else (
    echo [OK] Fichier .env trouve dans frontend/
)

cd ..

echo.
echo ========================================
echo Installation terminee!
echo ========================================
echo.
echo Prochaines etapes:
echo 1. Creez les fichiers .env si manquants
echo 2. Demarrer MongoDB
echo 3. Terminal 1: cd backend ^&^& node utils/seeder.js ^&^& npm start
echo 4. Terminal 2: cd frontend ^&^& npm start
echo.
echo Lisez INSTALLATION_GUIDE.md pour plus de details
echo.
pause








