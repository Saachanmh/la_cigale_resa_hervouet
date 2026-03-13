# CRM Réservations Restaurant - V0

Application de gestion de réservations pour restaurant connectée à Airtable.

## 🎯 Objectifs

- Interface sobre et rapide pour l'équipe en salle
- Gestion des pics (midi/soir)
- Actions rapides : Check-in, Modification, Annulation
- Architecture sécurisée avec proxy BFF

## 🏗️ Stack Technique

- **Frontend** : React 18 + TypeScript + Vite + Tailwind CSS
- **Backend** : Node.js + Express (Proxy BFF)
- **Data** : Airtable (via API REST)
- **Architecture** : Single Page Application + Data Access Layer (DAL)

### Justifications du Stack

1. **Vite + React** : Rapidité de développement et performance (HMR ultra-rapide)
2. **TypeScript** : Typage strict du contrat DAL et sécurité
3. **Tailwind CSS** : Design system rapide avec composants réutilisables
4. **Express Proxy** : Sécurise la clé API Airtable côté serveur (PAT non exposé)
5. **Architecture DAL** : Isolation de la logique métier, facilite le remplacement d'Airtable plus tard

## 📁 Structure du Projet

```
app/
├── src/
│   ├── types/               # Types TypeScript (Reservation, Status, etc.)
│   │   └── reservation.ts
│   ├── dal/                 # Data Access Layer (interface + implémentation)
│   │   ├── ReservationRepository.ts
│   │   └── AirtableReservationRepository.ts
│   ├── utils/               # Utilitaires (dates, statuts)
│   │   ├── dateUtils.ts
│   │   └── statusUtils.ts
│   ├── ui/                  # Composants UI
│   │   ├── Dashboard.tsx    # Page principale
│   │   └── components/      # Composants réutilisables
│   │       ├── ReservationCard.tsx
│   │       ├── ServiceToggle.tsx
│   │       ├── StatusBadge.tsx
│   │       ├── EditModal.tsx
│   │       ├── Toast.tsx
│   │       ├── LoadingState.tsx
│   │       └── EmptyState.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server.ts                # API Proxy BFF (Express)
├── .env.example             # Template des variables d'environnement
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🚀 Installation & Démarrage

### 1. Prérequis

- Node.js 18+ installé
- Compte Airtable avec une base configurée

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration Airtable

1. Créer une base Airtable avec une table nommée `Reservations` (ou personnaliser dans `.env`)
2. Créer les champs suivants dans Airtable :
   - `Guest Name` (Single line text)
   - `Covers` (Number)
   - `Time` (Single line text, format "HH:mm")
   - `Date` (Date, format ISO "YYYY-MM-DD")
   - `Status` (Single select : CONFIRMED, ARRIVED, NO_SHOW, CANCELLED)
   - `Table` (Single line text, optionnel)
   - `Notes` (Long text, optionnel)

3. Générer un Personal Access Token (PAT) dans Airtable :
   - Account > Developer Hub > Personal Access Tokens
   - Scopes requis : `data.records:read`, `data.records:write`

### 4. Configuration des variables d'environnement

Copier le fichier `.env.example` vers `.env` :

```bash
copy .env.example .env
```

Puis éditer `.env` avec vos vraies valeurs :

```env
AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Reservations
PORT=3001
```

### 5. Lancer l'application

**En développement (2 terminaux)** :

Terminal 1 - Backend (API Proxy) :
```bash
npm run server
```

Terminal 2 - Frontend (Vite) :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🎨 Fonctionnalités Implémentées (V0)

### ✅ Vue Planning
- Sélecteur de date (Aujourd'hui par défaut)
- Toggle Midi / Soir
- Liste des réservations triées par heure
- KPI : Total réservations et couverts

### ✅ Actions CRUD
- **Check-in rapide** : Bouton 1-clic pour marquer "Arrivé"
- **Modification** : Modale pour éditer heure, couverts, table
- **Annulation** : Suppression avec confirmation

### ✅ États UI
- **Loading** : Skeleton loader pendant le chargement
- **Empty** : Message + CTA si aucune réservation
- **Error** : Toast rouge en cas d'erreur réseau
- **Success** : Toast vert pour confirmer les actions

### ✅ Design Touch-First
- Boutons larges (min 44px)
- Contraste élevé
- Police lisible (système par défaut)
- Codes couleurs par statut

## 🔒 Sécurité

- **PAT Airtable** : Jamais exposé côté client (seulement dans le serveur Express)
- **Proxy BFF** : Toutes les requêtes passent par `/api` côté serveur
- **Variables d'environnement** : Gérées via `.env` (non versionné)

## 📊 Contrat DAL (Data Access Layer)

L'interface `ReservationRepository` définit les méthodes :

- `getReservationsByService(date, service)` : Récupère les réservations filtrées
- `updateReservationStatus(id, status)` : Change le statut (Check-in rapide)
- `updateReservationDetails(id, updates)` : Modifie heure/couverts/table
- `createReservation(...)` : Ajoute une réservation manuelle
- `cancelReservation(id)` : Annule (suppression)

## 🧪 Tests & Validation

Pour tester l'application :

1. Ajouter des réservations de test dans Airtable
2. Vérifier que les filtres Midi/Soir fonctionnent (basés sur l'heure)
3. Tester le Check-in, la modification, l'annulation
4. Simuler une erreur réseau (couper le serveur) pour voir le toast d'erreur

## 📝 Prochaines Étapes (V1+)

- [ ] Authentification utilisateurs
- [ ] Mode hors-ligne avec cache local
- [ ] Notifications push pour nouvelles réservations
- [ ] Export CSV du planning
- [ ] Intégration téléphonique/SMS
- [ ] Vue Plan de salle graphique

## 📚 Documentation Projet

Voir le dossier `/docs` à la racine du projet :
- `PRD.md` : Product Requirements Document
- `BACKLOG.md` : User Stories et Épics
- `architecture.md` : Décisions techniques (ADR)
- `design_specs.md` : Spécifications UI/UX
- `RAID.md` : Risques et dépendances
- `TEAM_BRIEFS.md` : Guidelines pour l'équipe

## 🆘 Support

En cas de problème :
1. Vérifier que les variables `.env` sont correctes
2. Vérifier que le serveur Express tourne sur le port 3001
3. Consulter les logs du serveur pour les erreurs Airtable
4. Vérifier que les noms de champs Airtable correspondent au mapping dans `server.ts`

---

**Version** : 0.1.0 (V0 - MVP)  
**Dernière mise à jour** : Janvier 2025

