# Guide de démarrage - CRM Réservations

## ⚠️ PROBLÈME IDENTIFIÉ : Clé API Airtable

L'erreur 500 que tu rencontres vient d'une **clé API Airtable invalide**.

### ✅ Ce qui est corrigé :
- Base ID Airtable : maintenant `appN81S2UqL2vxXVH` ✅
- Imports TypeScript : tous corrigés ✅
- Configuration Tailwind : mise à jour ✅

### ❌ Ce qui doit être fait :

**1. Créer une nouvelle clé API Airtable :**
- Va sur https://airtable.com/create/tokens
- Clique sur "Create new token"
- Nom : "CRM Réservations"
- Scopes à sélectionner :
  - `data.records:read`
  - `data.records:write`
- Bases : sélectionne ta base de réservations
- Copie la clé complète (≈60 caractères, commence par `pat`)

**2. Mettre à jour le fichier .env :**
```
AIRTABLE_API_KEY=ta_nouvelle_cle_complete_ici
AIRTABLE_BASE_ID=appN81S2UqL2vxXVH
AIRTABLE_TABLE_NAME=Reservations
PORT=3001
```

## 🚀 Comment démarrer le projet :

### Option A : Scripts PowerShell (recommandé)
1. **Frontend :** Double-clique sur `start-dev.ps1`
2. **Backend :** Double-clique sur `start-backend.ps1`

### Option B : Manuellement
1. Ouvre deux terminaux
2. Dans les deux : `cd C:\Users\chloe\Documents\MDS\No_code\app`
3. Terminal 1 : `npm run dev` (frontend sur http://localhost:5173)
4. Terminal 2 : `npm run server` (backend sur http://localhost:3001)

## 🧪 Test de connectivité :
- Exécute : `npx tsx test-airtable.ts`
- Doit afficher "✅ Connexion réussie!" au lieu de l'erreur 401

## 📋 Champs requis dans ta table Airtable :
- Guest Name (Text)
- Covers (Number)
- Time (Single line text, format HH:MM)
- Date (Date, format YYYY-MM-DD)
- Status (Single select: CONFIRMED, CHECKED_IN, CANCELLED, NO_SHOW)
- Table (Text, optionnel)
- Notes (Long text, optionnel)

## ❓ Si ça ne marche toujours pas :
1. Vérifie que ta table s'appelle exactement "Reservations"
2. Vérifie que les noms des colonnes correspondent
3. Teste d'abord avec `test-airtable.ts` avant le CRM complet
