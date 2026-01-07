@echo off
echo ========================================
echo Installation Complete HotelReserve
echo ========================================
echo.

echo [1/4] Installation Backend...
cd backend
if not exist "package.json" (
    echo [ERREUR] package.json introuvable dans backend/
    pause
    exit /b 1
)
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Echec installation backend
    pause
    exit /b 1
)
echo [OK] Backend installe
cd ..
echo.

echo [2/4] Installation Frontend...
cd frontend
if not exist "package.json" (
    echo [ERREUR] package.json introuvable dans frontend/
    pause
    exit /b 1
)
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Echec installation frontend
    pause
    exit /b 1
)
echo [OK] Frontend installe
cd ..
echo.

echo [3/4] Verification des fichiers .env...
if not exist "backend\.env" (
    echo [ATTENTION] backend/.env manquant
    echo Creez-le avec:
    echo    MONGO_URI=mongodb://localhost:27017/hotelreserve
    echo    JWT_SECRET=votre-secret-key
    echo    PORT=5000
    echo    CLIENT_URL=http://localhost:3000
    echo.
) else (
    echo [OK] backend/.env existe
)

if not exist "frontend\.env" (
    echo [ATTENTION] frontend/.env manquant
    echo Creez-le avec:
    echo    REACT_APP_API_URL=http://localhost:5000/api
    echo.
) else (
    echo [OK] frontend/.env existe
)
echo.

echo [4/4] Peuplement de la base de donnees...
cd backend
if exist "utils\seeder.js" (
    echo Execution du seeder...
    node utils/seeder.js
    echo [OK] Base de donnees peuplee
) else (
    echo [ATTENTION] Seeder introuvable
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
echo 3. Double-cliquer sur START_BACKEND.bat
echo 4. Double-cliquer sur START_FRONTEND.bat
echo.
pause








