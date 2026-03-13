# Rapport de Bugs - CRM Réservations V0
## Exécution Tests Manuels - 16 Janvier 2026

---

## 🔴 BUGS CRITIQUES (P0 - Bloquants)

### BUG-001 : Bouton "+ Nouvelle" non fonctionnel
**Priorité** : P0 (Bloquant)  
**Sévérité** : Critique  
**User Story** : US-003 (Création de réservation)

**Description** :  
Le bouton "+ Nouvelle" dans le header ne déclenche aucune action. Le formulaire de création n'est pas implémenté.

**Étapes de Reproduction** :
1. Ouvrir l'application (http://localhost:5173)
2. Cliquer sur le bouton "+ Nouvelle" dans le header
3. **Résultat Attendu** : Une modale de création s'ouvre
4. **Résultat Actuel** : Rien ne se passe

**Code Concerné** :
```typescript
// Dashboard.tsx ligne 110
<button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
  + Nouvelle
</button>
// ❌ Pas de onClick défini
```

**Impact** :
- ❌ Impossible de créer une réservation manuelle (Walk-in)
- ❌ Test ST-003 échoue
- ❌ Fonctionnalité critique manquante

**Recommandation** :
Implémenter la modale de création avec formulaire complet (Nom, Couverts, Heure, Date).

---

### BUG-002 : Boutons de navigation date non fonctionnels
**Priorité** : P0 (Bloquant)  
**Sévérité** : Majeure  
**User Story** : US-001 (Visualisation Planning)

**Description** :  
Les boutons ← et → pour naviguer entre les dates ne déclenchent aucune action. Impossible de voir les réservations d'un autre jour.

**Étapes de Reproduction** :
1. Ouvrir l'application
2. Cliquer sur la flèche ← ou →
3. **Résultat Attendu** : La date change et les réservations se rechargent
4. **Résultat Actuel** : Rien ne se passe

**Code Concerné** :
```typescript
// Dashboard.tsx lignes 101-103
<button className="p-2 hover:bg-gray-100 rounded">←</button>
<h1 className="text-xl font-bold">{formatDateDisplay(date)}</h1>
<button className="p-2 hover:bg-gray-100 rounded">→</button>
// ❌ Pas de onClick et setDate non utilisé
```

**Impact** :
- ❌ Impossible de consulter les réservations passées ou futures
- ❌ L'application est limitée à "Aujourd'hui"
- ⚠️ Variable `setDate` déclarée mais jamais utilisée (warning TypeScript)

**Recommandation** :
Implémenter les handlers `handlePreviousDay()` et `handleNextDay()` qui utilisent `setDate()`.

---

## 🟠 BUGS MAJEURS (P1 - Critiques)

### BUG-003 : EmptyState onClick non implémenté
**Priorité** : P1 (Critique)  
**Sévérité** : Moyenne  
**User Story** : US-001

**Description** :  
Le bouton "Ajouter une réservation manuelle" dans l'état vide affiche seulement un `console.log` au lieu d'ouvrir le formulaire.

**Étapes de Reproduction** :
1. Sélectionner un service sans réservations (ou vider la base)
2. Voir l'EmptyState
3. Cliquer sur "Ajouter une réservation manuelle"
4. **Résultat Attendu** : La modale de création s'ouvre
5. **Résultat Actuel** : Message dans la console uniquement

**Code Concerné** :
```typescript
// Dashboard.tsx ligne 136
<EmptyState onAddReservation={() => console.log('Add reservation')} />
// ❌ Placeholder non implémenté
```

**Impact** :
- ⚠️ Mauvaise UX (bouton qui ne fait rien)
- ❌ Test UT-002 échoue partiellement

**Recommandation** :
Lier au même handler que le bouton "+ Nouvelle" une fois implémenté.

---

### BUG-004 : Validation du format Date dans Airtable manquante
**Priorité** : P1 (Critique)  
**Sévérité** : Majeure  
**User Story** : US-001

**Description** :  
Le serveur construit une formule Airtable avec `{Date} = '${date}'` sans valider le format. Si la date n'est pas au format "YYYY-MM-DD", la requête échoue silencieusement ou retourne des résultats incorrects.

**Étapes de Reproduction** :
1. Appeler l'API avec une date mal formatée : `/api/reservations?date=16/01/2026&service=LUNCH`
2. **Résultat Attendu** : Erreur 400 avec message clair
3. **Résultat Actuel** : Probablement erreur 500 ou résultats vides

**Code Concerné** :
```typescript
// server.ts ligne 74
const formula = `AND({Date} = '${date}', ${timeFilter})`;
// ❌ Pas de validation du format date
// ❌ Injection SQL-like possible (sécurité faible)
```

**Impact** :
- ⚠️ Erreurs silencieuses difficiles à déboguer
- 🔒 Risque de sécurité (injection dans la formule)

**Recommandation** :
Ajouter validation du format date côté serveur avec regex `/^\d{4}-\d{2}-\d{2}$/`.

---

### BUG-005 : Mapping Airtable fragile (champs optionnels)
**Priorité** : P1 (Critique)  
**Sévérité** : Moyenne  
**User Story** : US-002, US-005

**Description** :  
Le mapping utilise `|| ''` et `|| 0` pour les champs manquants, mais ne gère pas le cas où `record.fields` est `undefined` ou `null`.

**Étapes de Reproduction** :
1. Dans Airtable, créer une réservation avec des champs manquants
2. Appeler GET /api/reservations
3. **Résultat Attendu** : Les champs manquants ont des valeurs par défaut
4. **Résultat Actuel** : Risque de `Cannot read property 'Guest Name' of undefined`

**Code Concerné** :
```typescript
// server.ts ligne 51
function mapAirtableRecord(record: any): Reservation {
  return {
    guestName: record.fields['Guest Name'] || record.fields['Nom'] || '',
    // ❌ Si record.fields est null/undefined → crash
```

**Impact** :
- ⚠️ L'app crash si données Airtable incomplètes
- ❌ Test ST-002 pourrait échouer avec données réelles

**Recommandation** :
Ajouter vérification : `if (!record.fields) return null;` et filtrer les null côté client.

---

## 🟡 BUGS MINEURS (P2 - Non bloquants)

### BUG-006 : Gestion erreur vague dans handleCheckIn
**Priorité** : P2 (Mineur)  
**Sévérité** : Faible  
**User Story** : US-002

**Description** :  
Le catch dans `handleCheckIn` ne distingue pas le type d'erreur. Message générique même pour une erreur 404 (réservation déjà supprimée).

**Étapes de Reproduction** :
1. Supprimer une réservation directement dans Airtable
2. Tenter de faire un Check-in dans l'app
3. **Résultat Attendu** : "Cette réservation n'existe plus"
4. **Résultat Actuel** : "Impossible de modifier. Réessayer ?"

**Code Concerné** :
```typescript
// Dashboard.tsx ligne 56
} catch (err) {
  showToast('Impossible de modifier. Réessayer ?', 'error');
  // ❌ Pas de distinction entre 404, 500, Network Error
}
```

**Impact** :
- ⚠️ Messages d'erreur peu informatifs
- 🔍 Debug difficile pour l'utilisateur

**Recommandation** :
Vérifier `err instanceof NetworkError` pour afficher un message adapté.

---

### BUG-007 : Variable setDate déclarée mais non utilisée
**Priorité** : P2 (Mineur)  
**Sévérité** : Faible (Warning TypeScript)  
**User Story** : US-001

**Description** :  
Warning TypeScript : `'setDate' is declared but its value is never read`.

**Code Concerné** :
```typescript
// Dashboard.tsx ligne 17
const [date, setDate] = useState(getTodayDate());
// ⚠️ setDate jamais appelé
```

**Impact** :
- ⚠️ Code mort (Dead code)
- 📊 Pollution des warnings de build

**Recommandation** :
Implémenter la navigation de dates (fix de BUG-002).

---

### BUG-008 : Toast ne se ferme pas si on clique rapidement
**Priorité** : P2 (Mineur)  
**Sévérité** : Faible (UX)  
**User Story** : US-005

**Description** :  
Si on déclenche plusieurs actions rapidement (ex: 3 check-ins), les toasts s'empilent mais ne se ferment pas tous après 3 secondes. Le timer est réinitialisé à chaque action.

**Étapes de Reproduction** :
1. Faire 3 check-ins en 1 seconde
2. **Résultat Attendu** : 3 toasts successifs qui se ferment chacun après 3s
3. **Résultat Actuel** : Seul le dernier toast se ferme après 3s

**Code Concerné** :
```typescript
// Dashboard.tsx ligne 84
const showToast = (message: string, type: 'success' | 'error' | 'info') => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
  // ❌ Un seul toast à la fois, pas de queue
};
```

**Impact** :
- ⚠️ UX légèrement dégradée en usage intensif
- 📱 Pas critique pour V0

**Recommandation** :
Implémenter un système de queue de toasts (V1+).

---

## 📊 RÉSUMÉ DES TESTS

### Smoke Tests Executés

| Test ID | Nom | Statut | Blocage |
|---------|-----|--------|---------|
| ST-001 | Chargement Initial | ⚠️ **PARTIAL** | BUG-002 |
| ST-002 | Connexion Airtable | ✅ **PASS** | - |
| ST-003 | Création Réservation | ❌ **FAIL** | BUG-001 |
| ST-004 | Check-in Rapide | ✅ **PASS** | - |
| ST-005 | Modification | ✅ **PASS** | - |
| ST-006 | Annulation | ✅ **PASS** | - |
| ST-007 | Affichage Planning | ✅ **PASS** | - |

### Score Global : 5.5 / 7 (78%)

---

## 🎯 PRIORITÉS DE FIX

### Must-Fix pour V0 (Bloquants)
1. **BUG-001** : Implémenter modale de création
2. **BUG-002** : Implémenter navigation dates

### Should-Fix pour V0 (Critiques)
3. **BUG-003** : Lier EmptyState au formulaire de création
4. **BUG-004** : Valider format date côté serveur
5. **BUG-005** : Sécuriser mapping Airtable

### Nice-to-Fix (V1)
6. BUG-006 : Améliorer gestion erreurs
7. BUG-007 : Nettoyer warnings TypeScript
8. BUG-008 : Queue de toasts

---

## ✅ POINTS FORTS IDENTIFIÉS

✅ Architecture DAL bien implémentée  
✅ Gestion des états Loading/Empty/Error fonctionnelle  
✅ Connexion Airtable stable  
✅ Check-in, Modification, Annulation fonctionnels  
✅ Toggle Service Midi/Soir opérationnel  
✅ Design Touch-first respecté (boutons 44px)  

---

## 📝 RECOMMANDATIONS QA

### Immédiat (Avant Release V0)
1. Implémenter les fonctionnalités manquantes (BUG-001, BUG-002)
2. Ajouter validation des entrées utilisateur
3. Tester avec données Airtable réelles (edge cases)

### Court Terme (V0.1)
4. Ajouter tests unitaires automatisés (Jest + React Testing Library)
5. Implémenter tests E2E (Playwright ou Cypress)
6. Logger les erreurs côté serveur (winston ou pino)

### Moyen Terme (V1)
7. Tests de performance (100+ réservations)
8. Tests d'accessibilité (WCAG AA)
9. Tests cross-browser (Chrome, Safari, Firefox)

---

## 🔒 VÉRIFICATION SÉCURITÉ

### ✅ Points Validés
- PAT Airtable jamais exposé côté client
- Variables `.env` bien séparées
- `.gitignore` configuré correctement

### ⚠️ Points d'Attention
- Validation des entrées utilisateur à renforcer (BUG-004)
- Pas de rate limiting côté serveur Express
- Pas de sanitization des inputs (XSS potentiel en V1)

---

**Rapport généré par** : Agent QA IA  
**Date** : 16 Janvier 2026  
**Version App** : 0.1.0 (V0)  
**Statut Global** : ⚠️ **PARTIAL GO** (Fix critiques requis)

