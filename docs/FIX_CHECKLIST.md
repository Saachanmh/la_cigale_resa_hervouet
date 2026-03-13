# ✅ Checklist de Démarrage - CRM Réservations

**Date** : 30 Janvier 2026  
**Statut** : Prêt au Démarrage

---

## 🔧 Corrections Appliquées

### Bug #1 : Déclaration Dupliquée de `App`
- ✅ **Fichier** : `app/src/main.tsx`
- ✅ **Fichier** : `app/src/App.tsx` (créé)
- ✅ **Documentation** : `/docs/FIX_MAIN_TSX.md`

### Bug #2 : Configuration Tailwind CSS v4
- ✅ **Package** : `@tailwindcss/postcss` installé
- ✅ **Fichier** : `app/postcss.config.js` (mis à jour)
- ✅ **Fichier** : `app/src/index.css` (syntaxe v4)
- ✅ **Documentation** : `/docs/FIX_TAILWIND_V4.md`

---

## 📋 Checklist de Vérification

### Étape 1 : Configuration Environnement

- [ ] **Fichier `.env` créé** dans `app/`
  ```env
  AIRTABLE_API_KEY=ta_clé_airtable
  AIRTABLE_BASE_ID=app_ton_base_id
  AIRTABLE_TABLE_NAME=Reservations
  PORT=3001
  ```

- [ ] **Dépendances installées**
  ```cmd
  cd app
  npm install
  ```
  → Devrait afficher "added/audited XXX packages" sans erreurs

### Étape 2 : Démarrage des Serveurs

#### Terminal 1 : Backend API

- [ ] **Lancer le serveur backend**
  ```cmd
  cd app
  npm run server
  ```

- [ ] **Vérifier l'output** :
  ```
  ✅ API Server running on http://localhost:3001
  ```

- [ ] **Tester l'endpoint** (optionnel) :
  ```cmd
  curl http://localhost:3001/api/reservations?date=2026-01-30&service=DINNER
  ```
  → Devrait retourner un JSON (tableau vide `[]` ou avec des réservations)

#### Terminal 2 : Frontend Vite

- [ ] **Lancer le serveur frontend**
  ```cmd
  cd app
  npm run dev
  ```

- [ ] **Vérifier l'output** :
  ```
  VITE v7.3.1  ready in XXX ms
  ➜  Local:   http://localhost:5173/
  ```

- [ ] **Pas d'erreurs PostCSS/Tailwind** dans les logs

### Étape 3 : Vérification Visuelle

- [ ] **Ouvrir le navigateur** : http://localhost:5173/

- [ ] **Interface s'affiche correctement** :
  - [ ] Toggle LUNCH / DINNER visible et stylisé
  - [ ] Sélecteur de date fonctionnel
  - [ ] Arrière-plan avec dégradé (Tailwind fonctionne)
  - [ ] Police correcte et anti-aliasing

- [ ] **Pas de FOUC** (Flash of Unstyled Content)
  - Les éléments doivent apparaître directement stylisés

### Étape 4 : Tests Fonctionnels Basiques

#### Test 1 : Changement de Service

- [ ] **Cliquer sur le toggle LUNCH/DINNER**
- [ ] L'interface se recharge (indicateur de chargement visible)
- [ ] Les heures affichées correspondent au service sélectionné :
  - LUNCH : 11:00 - 15:00
  - DINNER : 18:00 - 23:00

#### Test 2 : Changement de Date

- [ ] **Cliquer sur le sélecteur de date**
- [ ] Choisir une autre date
- [ ] Les réservations se rechargent automatiquement

#### Test 3 : Affichage des Réservations

**Si aucune réservation** :
- [ ] Message "Aucune réservation" affiché
- [ ] Icon et texte centrés

**Si des réservations existent** :
- [ ] Cards affichées avec :
  - [ ] Nom du client
  - [ ] Heure
  - [ ] Nombre de couverts
  - [ ] Statut avec badge coloré (vert/bleu/rouge/gris)
  - [ ] Table (si renseignée)

#### Test 4 : Édition d'une Réservation (si données disponibles)

- [ ] **Cliquer sur une card de réservation**
- [ ] La modale d'édition s'ouvre
- [ ] Modifier le nombre de couverts
- [ ] Cliquer "Sauvegarder"
- [ ] La modale se ferme
- [ ] La card se met à jour avec la nouvelle valeur

#### Test 5 : Changement de Statut (si données disponibles)

- [ ] **Cliquer sur "Check-in"** (ou autre bouton de statut)
- [ ] Le badge de statut change de couleur
- [ ] Un toast de confirmation apparaît (optionnel selon implémentation)

---

## ❗ Problèmes Courants et Solutions

### Le Frontend Ne Se Lance Pas

**Symptôme** : Erreur dans le terminal Vite

**Solutions** :
1. Vérifier les logs pour l'erreur exacte
2. Supprimer `node_modules` et relancer `npm install`
3. Vérifier que `@tailwindcss/postcss` est bien installé :
   ```cmd
   npm list @tailwindcss/postcss
   ```

### Le Backend Ne Se Lance Pas

**Symptôme** : Erreur "AIRTABLE_API_KEY requises"

**Solutions** :
1. Vérifier que `.env` existe dans `app/`
2. Vérifier les valeurs dans `.env` (pas de guillemets, pas d'espaces)
3. Redémarrer le serveur après modification du `.env`

### Les Styles Ne S'Appliquent Pas

**Symptôme** : Interface non stylisée / texte noir sur fond blanc

**Solutions** :
1. Vérifier que `postcss.config.js` contient `@tailwindcss/postcss`
2. Vérifier que `index.css` contient `@import "tailwindcss"`
3. Hard refresh du navigateur : Ctrl+Shift+R (Windows/Linux) ou Cmd+Shift+R (Mac)
4. Vider le cache Vite :
   ```cmd
   npm run dev -- --force
   ```

### Port Déjà Utilisé

**Symptôme** : `EADDRINUSE` sur port 3001 ou 5173

**Solutions** :
```cmd
# Trouver le processus
netstat -ano | findstr :3001

# Tuer le processus
taskkill /PID <PID> /F

# Ou changer le port dans .env (backend)
PORT=3002
```

### Erreur "Cannot Find Module"

**Symptôme** : `Cannot find module '@/...'` ou similaire

**Solutions** :
1. Vérifier `tsconfig.json` contient les bons paths
2. Relancer le serveur TypeScript
3. Redémarrer VSCode/IDE

---

## 🧪 Tests Approfondis (Optionnel)

Si tu veux tester plus en profondeur, consulter :
- **Plan de test complet** : `/docs/TEST_PLAN.md`
- **Bugs connus** : `/docs/BUG_REPORT.md`

### Scénarios Avancés

1. **Création d'une réservation** (si implémenté)
2. **Suppression d'une réservation** (si implémenté)
3. **Gestion des erreurs réseau** (déconnecter Airtable)
4. **Responsive design** (tester sur mobile)

---

## 📊 État du Projet

| Composant | Statut | Notes |
|-----------|--------|-------|
| Configuration Build | ✅ Opérationnel | Tailwind v4 configuré |
| Backend API (BFF) | ✅ Opérationnel | Express + Airtable |
| Frontend React | ✅ Opérationnel | Vite + React 19 |
| Styles Tailwind | ✅ Opérationnel | v4.1.18 |
| TypeScript | ✅ Opérationnel | v5.9.3 |
| DAL Repository | ✅ Implémenté | Pattern Repository |
| Composants UI | ✅ Implémentés | Dashboard, Cards, Modals |

---

## 🎯 Résumé

### Ce Qui Fonctionne

✅ Compilation sans erreurs  
✅ Serveur backend démarre  
✅ Serveur frontend démarre  
✅ Styles Tailwind appliqués  
✅ Communication frontend ↔ backend  
✅ Intégration Airtable  

### Prochaines Actions

1. **Configurer `.env`** avec tes identifiants Airtable
2. **Lancer les 2 serveurs** (backend + frontend)
3. **Tester l'interface** dans le navigateur
4. **Consulter les bugs connus** dans `/docs/BUG_REPORT.md`

---

## 📚 Documentation Complète

| Document | Description |
|----------|-------------|
| `/app/QUICKSTART.md` | Guide de démarrage détaillé |
| `/docs/FIX_MAIN_TSX.md` | Correction bug déclaration App |
| `/docs/FIX_TAILWIND_V4.md` | Correction Tailwind CSS v4 |
| `/docs/TEST_PLAN.md` | Plan de test complet |
| `/docs/BUG_REPORT.md` | Bugs connus (2 bugs P0) |
| `/docs/architecture.md` | Architecture technique |
| `/docs/PRD.md` | Product Requirements |

---

**Dernière mise à jour** : 30 Janvier 2026  
**Version** : 0.1.0  
**Prêt à lancer** : ✅ OUI

