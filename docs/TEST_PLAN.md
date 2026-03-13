# Test Plan - CRM Réservations V0

## 1. Objectifs des Tests

- Valider les fonctionnalités critiques (CRUD Réservations)
- Vérifier la connexion Airtable via le DAL
- Tester les états UI (Loading, Empty, Error)
- Valider l'expérience utilisateur (Touch-first, Responsive)

---

## 2. Périmètre des Tests

### ✅ In Scope (V0)
- Smoke Tests (Fonctionnalités critiques)
- Tests d'intégration (API ↔ Airtable)
- Tests UI (Composants, États)
- Tests de validation (Formulaires)

### ❌ Out of Scope (V1+)
- Tests de performance (Load testing)
- Tests de sécurité (Penetration testing)
- Tests multi-utilisateurs (Conflits d'édition)
- Tests hors-ligne

---

## 3. Environnement de Test

### Prérequis
- Node.js 18+ installé
- Base Airtable configurée avec données de test
- Variables `.env` définies
- Serveur backend (port 3001) et frontend (port 5173) lancés

### Données de Test Requises
Créer dans Airtable (table "Reservations") :

| Guest Name | Covers | Time | Date | Status | Table | Notes |
|------------|--------|------|------|--------|-------|-------|
| Test Dupont | 4 | 12:00 | Aujourd'hui | CONFIRMED | 5 | Test smoke |
| Test Martin | 2 | 12:30 | Aujourd'hui | CONFIRMED | 8 | |
| Test Durand | 6 | 13:00 | Aujourd'hui | ARRIVED | 12 | Déjà arrivé |
| Test Petit | 3 | 19:00 | Aujourd'hui | CONFIRMED | 3 | Service soir |

---

## 4. Smoke Tests (Tests Critiques)

### ST-001 : Chargement Initial de l'Application
**Priorité** : P0 (Bloquant)

```gherkin
Scenario: L'application se charge correctement
  Given les serveurs backend et frontend sont lancés
  When j'ouvre http://localhost:5173
  Then la page se charge en moins de 2 secondes
  And je vois le header avec sélecteur date et toggle service
  And je vois la liste des réservations ou l'état vide
```

**Critères d'Acceptation** :
- ✅ Pas d'erreur console
- ✅ Header visible avec tous les éléments
- ✅ Chargement < 2s (requis PRD)

---

### ST-002 : Connexion API Airtable
**Priorité** : P0 (Bloquant)

```gherkin
Scenario: Les réservations sont récupérées depuis Airtable
  Given j'ai des réservations dans Airtable pour aujourd'hui
  When j'ouvre l'application
  Then je vois la liste des réservations affichées
  And les données correspondent à celles dans Airtable
  And les réservations sont triées par heure croissante
```

**Critères d'Acceptation** :
- ✅ Appel GET /api/reservations réussit (status 200)
- ✅ Données mappées correctement (Guest Name, Covers, Time, etc.)
- ✅ Tri par heure appliqué

---

### ST-003 : Création d'une Réservation
**Priorité** : P1 (Critique)

```gherkin
Scenario: Créer une nouvelle réservation manuelle
  Given je suis sur le dashboard
  When je clique sur le bouton "+ Nouvelle"
  And je remplis le formulaire :
    | Nom     | Test Nouveau |
    | Couverts| 5            |
    | Heure   | 14:00        |
  And je clique sur "Sauvegarder"
  Then la réservation apparaît dans la liste
  And un toast de succès s'affiche
  And la réservation est créée dans Airtable
```

**Critères d'Acceptation** :
- ✅ POST /api/reservations réussit
- ✅ Réservation visible immédiatement (Optimistic UI)
- ✅ Synchronisation Airtable validée

---

### ST-004 : Check-in Rapide (Changement Statut)
**Priorité** : P0 (Bloquant)

```gherkin
Scenario: Marquer un client comme arrivé
  Given une réservation "Test Dupont" au statut CONFIRMED
  When je clique sur le bouton "Check-in"
  Then le statut passe à ARRIVED
  And le badge devient vert
  And un toast "Test Dupont marqué comme arrivé" s'affiche
  And le statut est mis à jour dans Airtable
```

**Critères d'Acceptation** :
- ✅ PATCH /api/reservations/:id/status réussit
- ✅ Badge couleur change (bleu → vert)
- ✅ Bouton "Check-in" disparaît

---

### ST-005 : Modification d'une Réservation
**Priorité** : P1 (Critique)

```gherkin
Scenario: Modifier le nombre de couverts et l'heure
  Given une réservation "Test Martin" pour 2 personnes à 12:30
  When je clique sur "Modifier"
  And je change les couverts à 4
  And je change l'heure à 13:00
  And je clique sur "Sauvegarder"
  Then la carte affiche "4 pax" et "13:00"
  And un toast de succès s'affiche
  And les modifications sont dans Airtable
```

**Critères d'Acceptation** :
- ✅ PATCH /api/reservations/:id réussit
- ✅ Stepper +/- fonctionne
- ✅ Input time valide

---

### ST-006 : Annulation d'une Réservation
**Priorité** : P1 (Critique)

```gherkin
Scenario: Annuler une réservation
  Given une réservation "Test Martin" active
  When je clique sur "Annuler"
  And je confirme dans la popup
  Then la réservation disparaît de la liste
  And un toast "Réservation annulée" s'affiche
  And la réservation est supprimée d'Airtable
```

**Critères d'Acceptation** :
- ✅ DELETE /api/reservations/:id réussit
- ✅ Confirmation native s'affiche
- ✅ Suppression immédiate de l'UI

---

### ST-007 : Affichage du Planning par Service
**Priorité** : P0 (Bloquant)

```gherkin
Scenario: Filtrer les réservations par service Midi
  Given j'ai des réservations pour Midi (12:00-14:00) et Soir (19:00-22:00)
  When je sélectionne "Midi" dans le toggle
  Then je vois uniquement les réservations entre 11:00 et 15:00
  And le total couverts correspond aux réservations du Midi

Scenario: Filtrer les réservations par service Soir
  When je sélectionne "Soir" dans le toggle
  Then je vois uniquement les réservations entre 18:00 et 23:00
  And le total couverts correspond aux réservations du Soir
```

**Critères d'Acceptation** :
- ✅ Filtre appliqué côté serveur (querystring `service=LUNCH|DINNER`)
- ✅ KPI recalculés correctement

---

## 5. Tests d'États UI

### UT-001 : État Loading
```gherkin
Scenario: Skeleton loader pendant le chargement
  Given l'API met 1 seconde à répondre
  When j'ouvre l'application
  Then je vois des barres grises animées (skeleton)
  And aucune donnée n'est affichée avant la réponse
```

---

### UT-002 : État Empty
```gherkin
Scenario: Aucune réservation pour le service
  Given il n'y a pas de réservation pour le service Midi
  When je sélectionne "Midi"
  Then je vois l'icône calendrier
  And le message "Aucune réservation pour ce service"
  And un bouton "Ajouter une réservation manuelle"
```

---

### UT-003 : État Error
```gherkin
Scenario: Erreur réseau lors du chargement
  Given le serveur backend est arrêté
  When j'ouvre l'application
  Then je vois une bannière rouge
  And le message "Connexion perdue. Vérifiez votre réseau."
```

---

## 6. Tests de Validation

### VT-001 : Validation Formulaire Édition
```gherkin
Scenario: Empêcher la saisie de valeurs invalides
  Given je modifie une réservation
  When je tente de réduire les couverts à 0
  Then le stepper bloque à 1 (minimum)
```

---

## 7. Tests de Régression (Post-Fix)

### RT-001 : Vérifier que le fix n'a pas cassé d'autres fonctionnalités
- [ ] Re-exécuter tous les smoke tests après chaque correction de bug
- [ ] Valider les user stories US-001 à US-005

---

## 8. Checklist QA Pré-Release

### Configuration
- [ ] Variables `.env` ne contiennent pas de secrets en dur
- [ ] `.env.example` à jour
- [ ] `.gitignore` exclut `.env`

### Fonctionnel
- [ ] Tous les smoke tests (ST-001 à ST-007) passent
- [ ] États UI (Loading, Empty, Error) fonctionnels
- [ ] Pas d'erreur console en mode normal

### Performance
- [ ] Chargement initial < 2s
- [ ] Actions (Check-in, Edit) < 500ms ressenti

### Sécurité
- [ ] PAT Airtable jamais visible dans le code client
- [ ] Headers CORS configurés correctement

### UX
- [ ] Boutons taille min 44px (Touch-friendly)
- [ ] Contraste respecté (WCAG AA)
- [ ] Toasts affichés 3 secondes

---

## 9. Rapport de Bugs (Section dynamique)

*À compléter après exécution des tests manuels*

---

## 10. Métriques de Qualité

### Objectifs V0
- **Couverture Smoke Tests** : 7/7 (100%)
- **Bugs Critiques (P0)** : 0
- **Bugs Majeurs (P1)** : Max 2 acceptés pour V0

### Critères de Sortie (Go/No-Go)
✅ **GO** si :
- Tous les smoke tests P0 passent
- Aucun bug bloquant
- Documentation à jour

❌ **NO-GO** si :
- Un smoke test P0 échoue
- Bug bloquant affectant le CRUD
- Secrets exposés côté client

---

**Responsable QA** : Agent QA IA  
**Date de création** : 16 Janvier 2026  
**Version** : 1.0 (V0)

