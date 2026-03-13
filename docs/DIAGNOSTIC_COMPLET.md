# 🔍 Diagnostic Complet - CRM Réservations

**Date** : 30 Janvier 2026  
**Agent** : Développeur Fullstack IA  
**Statut** : En cours de correction

---

## 🐛 Problèmes Identifiés et Corrigés

### 1. ✅ Fichiers avec Composants Multiples (RÉSOLU)

**Problème** : Plusieurs fichiers contenaient plusieurs composants concaténés au lieu d'un seul composant par fichier.

**Fichiers affectés** :
- `ReservationCard.tsx` contenait aussi `StatusBadge`
- `EditModal.tsx` contenait aussi `LoadingState`
- `statusUtils.ts` contenait aussi les fonctions de `dateUtils`

**Impact** : Pas d'erreur de compilation mais mauvaise organisation du code et possibles conflits d'imports.

**Correction** :
- ✅ Séparation de `StatusBadge` dans son propre fichier
- ✅ Séparation de `LoadingState` déjà dans son fichier
- ✅ Nettoyage de `statusUtils.ts` pour retirer les fonctions date

---

### 2. ⚠️ Fichier .env Manquant (CRITIQUE)

**Problème** : Le fichier `.env` n'existe pas dans le dossier `app/`.

**Impact** : **Erreurs 500** sur toutes les requêtes API car le serveur backend ne peut pas se connecter à Airtable.

**Symptômes** :
- Backend démarre mais crash immédiatement avec : `❌ Variables AIRTABLE_API_KEY et AIRTABLE_BASE_ID requises`
- Frontend charge mais affiche "Erreur lors du chargement des réservations"
- Toutes les requêtes `/api/*` retournent 500

**Solution** :
```bash
# Créer le fichier app/.env avec le contenu suivant :
AIRTABLE_API_KEY=votre_clé_api
AIRTABLE_BASE_ID=votre_base_id
AIRTABLE_TABLE_NAME=Reservations
PORT=3001
```

**Comment obtenir les identifiants Airtable** :
1. **API Key** : https://airtable.com/account → Créer un Personal Access Token (PAT)
   - Permissions : `data.records:read`, `data.records:write`
2. **Base ID** : URL de votre base → `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. **Table Name** : Nom de votre table (par défaut `Reservations`)

---

### 3. ⚠️ Classes Tailwind Personnalisées Non Définies

**Problème** : Les classes CSS personnalisées pour les statuts ne sont pas définies.

**Classes manquantes dans `index.css`** :
- `bg-status-confirmed`
- `bg-status-arrived`
- `bg-status-noshow`
- `bg-status-cancelled`

**Impact** : Les badges de statut n'ont pas de couleur (fond transparent).

**Correction à appliquer** : Ajouter les classes dans `index.css`

---

### 4. 🔍 Problèmes Potentiels Identifiés

#### 4.1 Navigation de Date Non Fonctionnelle

**Fichier** : `Dashboard.tsx` lignes 100-103

```tsx
<button className="p-2 hover:bg-gray-100 rounded">←</button>
<h1 className="text-xl font-bold">{formatDateDisplay(date)}</h1>
<button className="p-2 hover:bg-gray-100 rounded">→</button>
```

**Problème** : Les boutons ← et → n'ont pas de gestionnaires `onClick`.

**Impact** : Impossible de naviguer entre les dates.

#### 4.2 Bouton "Nouvelle Réservation" Non Fonctionnel

**Fichier** : `Dashboard.tsx` ligne 108

```tsx
<button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
  + Nouvelle
</button>
```

**Problème** : Pas de gestionnaire `onClick`.

**Impact** : Le bouton ne fait rien.

#### 4.3 Sélecteur de Date Non Présent

**Problème** : Le header affiche la date mais il n'y a pas d'input type="date" pour la changer.

**Impact** : On peut uniquement utiliser les flèches ← → (qui ne fonctionnent pas).

#### 4.4 Fonction `onCancel` dans Dashboard

**Fichier** : `Dashboard.tsx` ligne 81

```tsx
const handleCancel = async (id: string) => {
  if (!confirm('Êtes-vous sûr ? Cette action est irréversible.')) return;

  try {
    await reservationRepository.cancelReservation(id);
    setReservations(reservations.filter(r => r.id !== id));
    showToast('Réservation annulée.', 'success');
  } catch (err) {
    showToast('Impossible d\'annuler. Réessayer ?', 'error');
  }
};
```

**Problème** : `cancelReservation` supprime la réservation (`DELETE`) mais le message dit "annulée" (devrait être `PATCH` avec status `CANCELLED`).

**Ambiguïté** : Est-ce qu'on veut supprimer ou changer le statut ?

---

## 🔧 Corrections à Appliquer

### Priorité P0 (Bloquant)

1. **Créer le fichier `.env`** avec les vraies clés Airtable
2. **Ajouter les classes CSS de statuts** dans `index.css`

### Priorité P1 (Important)

3. **Implémenter la navigation de date** (boutons ← →)
4. **Ajouter un sélecteur de date** dans le header
5. **Implémenter le bouton "Nouvelle Réservation"**

### Priorité P2 (Nice to have)

6. **Clarifier l'action "Annuler"** : supprimer ou changer statut ?
7. **Ajouter des tests d'erreur** pour les cas réseau

---

## ✅ État Actuel des Fichiers

| Fichier | Statut | Erreurs |
|---------|--------|---------|
| `App.tsx` | ✅ OK | Aucune |
| `main.tsx` | ✅ OK | Aucune |
| `Dashboard.tsx` | ⚠️ Fonctionnel | 4 fonctionnalités manquantes |
| `ReservationCard.tsx` | ✅ OK | Aucune |
| `EditModal.tsx` | ✅ OK | Aucune |
| `ServiceToggle.tsx` | ✅ OK | Aucune |
| `EmptyState.tsx` | ✅ OK | Aucune |
| `LoadingState.tsx` | ✅ OK | Aucune |
| `Toast.tsx` | ✅ OK | Aucune |
| `StatusBadge.tsx` | ✅ OK | Aucune |
| `AirtableReservationRepository.ts` | ✅ OK | Aucune |
| `dateUtils.ts` | ✅ OK | Aucune |
| `statusUtils.ts` | ✅ OK | Aucune |
| `server.ts` | ⚠️ Ne démarre pas | `.env` manquant |
| `postcss.config.js` | ✅ OK | Corrigé v4 |
| `index.css` | ⚠️ Partiel | Classes statuts manquantes |

---

## 🧪 Plan de Test

### Test 1 : Backend démarre

```bash
cd app
npm run server
```

**Résultat attendu** : `✅ API Server running on http://localhost:3001`

**Si échec** : Vérifier que `.env` existe et contient les bonnes clés.

### Test 2 : Frontend démarre

```bash
cd app
npm run dev
```

**Résultat attendu** : `VITE v7.3.1 ready`

**Si échec** : Vérifier les erreurs Tailwind/PostCSS.

### Test 3 : Charger des réservations

1. Ouvrir http://localhost:5173/
2. Vérifier que la date du jour s'affiche
3. Vérifier que le service (LUNCH/DINNER) est correct
4. Vérifier que les réservations s'affichent (ou "Aucune réservation")

**Si erreur 500** : Vérifier les logs du terminal backend.

### Test 4 : Changer de service

1. Cliquer sur le toggle LUNCH ↔ DINNER
2. Vérifier que les réservations se rechargent
3. Vérifier que les heures correspondent au service

### Test 5 : Éditer une réservation

1. Cliquer sur "Modifier" sur une card
2. Changer les couverts, l'heure ou la table
3. Cliquer "Sauvegarder"
4. Vérifier que la card se met à jour

### Test 6 : Check-in

1. Cliquer sur "Check-in" sur une réservation CONFIRMED
2. Vérifier que le bouton disparaît (statut → ARRIVED)
3. Vérifier que le point de statut devient vert

---

## 📊 Résumé

### ✅ Fonctionnel
- Compilation TypeScript
- Structure des composants React
- Communication frontend ↔ backend (si `.env` configuré)
- Affichage des réservations
- Édition des réservations
- Changement de statut (Check-in)
- Toggle LUNCH/DINNER
- Styles Tailwind (partiels)

### ⚠️ À Corriger (P0)
- Fichier `.env` manquant → **Erreurs 500**
- Classes CSS de statuts manquantes → Badges sans couleur

### ⚠️ À Implémenter (P1)
- Navigation de date (← →)
- Sélecteur de date
- Bouton "Nouvelle Réservation"

---

## 🚀 Actions Immédiates

1. **Créer `.env`** :
   ```bash
   cd app
   # Copier .env.example vers .env et remplir les valeurs
   ```

2. **Ajouter les classes CSS de statuts** :
   ```css
   /* Dans app/src/index.css */
   @layer components {
     .bg-status-confirmed { background-color: #3b82f6; }
     .bg-status-arrived { background-color: #10b981; }
     .bg-status-noshow { background-color: #ef4444; }
     .bg-status-cancelled { background-color: #6b7280; }
   }
   ```

3. **Relancer les serveurs** :
   ```bash
   # Terminal 1
   npm run server
   
   # Terminal 2
   npm run dev
   ```

4. **Tester l'application** selon le plan de test ci-dessus

---

**Diagnostic effectué par** : Agent Développeur Fullstack IA  
**Prochaine action** : Application des corrections P0

