@echo off
cd /d C:\Users\chloe\Documents\MDS\No_code\app
echo Nettoyage du projet...
rmdir /s /q node_modules
del package-lock.json
echo Installation des dépendances...
npm install
echo Tentative de démarrage...
npm run dev
pause

