# 🚀 Guide de Démarrage - CRM Réservations

## Prérequis

- **Node.js** (v18 ou supérieur) installé
- **npm** (généralement inclus avec Node.js)
- Compte **Airtable** avec une base configurée
- Variables d'environnement configurées

---

## 📋 Étape 1 : Configuration des Variables d'Environnement

### Créer le fichier `.env`

Dans le dossier `app/`, créer un fichier `.env` avec le contenu suivant :

```env
AIRTABLE_API_KEY=votre_clé_api_airtable
AIRTABLE_BASE_ID=votre_base_id_airtable
AIRTABLE_TABLE_NAME=Reservations
PORT=3001
```

### Obtenir vos identifiants Airtable

1. **API Key** : 
   - Aller sur https://airtable.com/account
   - Section "API" → Générer un Personal Access Token (PAT)
   - Permissions requises : `data.records:read`, `data.records:write`

2. **Base ID** : 
   - Ouvrir votre base Airtable
   - URL format : `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - Le Base ID est la partie `appXXXXXXXXXXXXXX`

3. **Table Name** : 
   - Le nom de votre table (par défaut `Reservations`)

### Structure de la table Airtable attendue

| Champ | Type | Description |
|-------|------|-------------|
| `Guest Name` (ou `Nom`) | Single line text | Nom du client |
| `Covers` (ou `Couverts`) | Number | Nombre de couverts |
| `Time` (ou `Heure`) | Single line text | Heure au format "HH:mm" (ex: "19:30") |
| `Date` | Single line text | Date au format "YYYY-MM-DD" (ex: "2026-01-30") |
| `Status` (ou `Statut`) | Single select | Valeurs: CONFIRMED, ARRIVED, NO_SHOW, CANCELLED |
| `Table` | Single line text | Numéro de table (optionnel) |
| `Notes` | Long text | Notes (optionnel) |

---

## 📦 Étape 2 : Installation des Dépendances

Ouvrir un terminal dans le dossier `app/` :

```bash
cd app
npm install
```

Cette commande installe toutes les dépendances listées dans `package.json` :
- React 19.2.3
- Vite 7.3.1
- TypeScript 5.9.3
- Express 5.2.1
- Tailwind CSS 4.1.18
- Et leurs dépendances

---

## 🖥️ Étape 3 : Lancer le Projet

### Option A : Lancer le projet complet (Recommandé)

Vous devez lancer **2 terminaux** en parallèle :

#### Terminal 1 : Backend API (BFF)

```bash
cd app
npm run server
```

Vous devriez voir :
```
✅ API Server running on http://localhost:3001
```

#### Terminal 2 : Frontend React + Vite

```bash
cd app
npm run dev
```

Vous devriez voir :
```
VITE v7.3.1  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Option B : Scripts disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| `npm run dev` | Lance Vite dev server | Frontend en mode développement (port 5173) |
| `npm run server` | Lance `tsx server.ts` | Backend API BFF (port 3001) |
| `npm run build` | Compile TypeScript + Vite build | Prépare l'app pour production |
| `npm run preview` | Lance Vite preview | Prévisualise le build de production |

---

## 🌐 Étape 4 : Accéder à l'Application

Une fois les 2 terminaux lancés :

1. Ouvrir votre navigateur
2. Aller sur **http://localhost:5173/**
3. L'interface CRM devrait s'afficher

### Architecture des ports

- **Frontend (Vite)** : `http://localhost:5173`
- **Backend (BFF)** : `http://localhost:3001`
- **Proxy Vite** : Les appels `/api/*` depuis le frontend sont automatiquement redirigés vers le backend

---

## 🧪 Étape 5 : Vérifier que Tout Fonctionne

### Test 1 : Backend répond

Ouvrir un navigateur ou utiliser `curl` :

```bash
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:3001/api/reservations?date=2026-01-30&service=DINNER"

# Ou avec curl (Git Bash / WSL)
curl "http://localhost:3001/api/reservations?date=2026-01-30&service=DINNER"
```

Vous devriez recevoir un JSON avec les réservations (ou un tableau vide `[]` si aucune).

### Test 2 : Frontend se charge

1. Ouvrir **http://localhost:5173/**
2. Vous devriez voir :
   - Un toggle LUNCH / DINNER
   - Un sélecteur de date (par défaut aujourd'hui)
   - Une liste de réservations (ou un message "Aucune réservation")

### Test 3 : Interaction avec les réservations

Dans l'interface :
1. **Changer le service** (LUNCH ↔ DINNER) → La liste se recharge
2. **Cliquer sur une carte de réservation** → Ouvre une modale d'édition
3. **Modifier les couverts / notes / table** → Cliquer "Sauvegarder"
4. **Changer le statut** via les boutons (Check-in, Annuler, etc.)

---

## ❗ Dépannage Courant

### Erreur : `AIRTABLE_API_KEY et AIRTABLE_BASE_ID requises`

**Cause** : Le fichier `.env` n'existe pas ou les variables sont mal configurées.

**Solution** :
1. Vérifier que `.env` existe dans `app/.env`
2. Vérifier que les valeurs sont correctes (pas de guillemets, pas d'espaces)

### Erreur : `EADDRINUSE` (port déjà utilisé)

**Cause** : Un autre processus utilise le port 3001 ou 5173.

**Solution** :
```bash
# Windows : Tuer le processus sur le port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Ou changer le port dans .env
PORT=3002
```

### Erreur : `Cannot find module '@/...'`

**Cause** : Les alias TypeScript ne sont pas résolus.

**Solution** : Relancer les serveurs après `npm install`.

### Erreur : `fetch failed` ou `Network Error`

**Cause** : Backend non démarré ou clés Airtable invalides.

**Solution** :
1. Vérifier que `npm run server` tourne sans erreur
2. Tester l'endpoint backend directement (voir Test 1)
3. Vérifier les logs du terminal backend

### Frontend affiche "Aucune réservation"

**Cause** : Aucune réservation dans Airtable pour la date/service sélectionnés.

**Solution** : Créer des réservations de test dans Airtable avec :
- `Date` = date du jour (format `2026-01-30`)
- `Time` = heure dans la plage LUNCH (11:00-15:00) ou DINNER (18:00-23:00)
- `Status` = `CONFIRMED`

---

## 🎯 Checklist de Démarrage Rapide

- [ ] Node.js installé (vérifier avec `node -v`)
- [ ] Dossier `app/` contient `package.json`
- [ ] Fichier `app/.env` créé avec les bonnes variables
- [ ] `npm install` exécuté sans erreurs
- [ ] Terminal 1 : `npm run server` → Message "✅ API Server running"
- [ ] Terminal 2 : `npm run dev` → Message "VITE ready"
- [ ] Navigateur sur http://localhost:5173/ affiche l'interface
- [ ] Tester le changement de service (LUNCH/DINNER)
- [ ] Tester l'édition d'une réservation (si données disponibles)

---

## 📚 Ressources Complémentaires

- **Documentation complète** : Voir `/docs/README.md`
- **Plan de test** : `/docs/TEST_PLAN.md`
- **Bugs connus** : `/docs/BUG_REPORT.md`
- **Architecture** : `/docs/architecture.md`

---

## 🆘 Support

En cas de problème :
1. Vérifier les logs des 2 terminaux (backend + frontend)
2. Consulter `/docs/BUG_REPORT.md` pour les bugs connus
3. Vérifier la configuration Airtable (noms de champs, types)

---

**Dernière mise à jour** : 30 Janvier 2026  
**Version** : 0.1.0

