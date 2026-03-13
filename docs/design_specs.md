# Design Specifications (V0) - CRM Réservations

## 1. Architecture de l'Information (IA)

### Navigation Globale
Application "Simple page" avec une barre de navigation (ou Header) fixe.
- **Header** :
  - **Gauche** : Sélecteur de date (ex: "Aujourd'hui, 27 Oct" avec flèches < >)
  - **Centre** : Toggle "Midi" / "Soir" (Segmented Control)
  - **Droite** : Bouton "Nouvelle Réservation" (+), Menu User (Avatar)

### Structure des Pages
L'application repose principalement sur **une vue unique** (Dashboard) qui s'adapte selon le service sélectionné.

1.  **Dashboard (Page d'accueil)**
    - Liste des réservations triée par heure.
    - Filtres rapides (Tous / En attente / Arrivés).
    - KPI simple (Total couverts / Total réservations).

2.  **Modale Détail / Édition** (Overlay)
    - S'ouvre au clic sur une réservation.
    - Permet l'édition complète.

## 2. Spécifications des Écrans

### A. Vue Liste (Dashboard)
Cette vue est optimisée pour la lecture rapide en mobilité (tablette tenue à une main).

- **Layout** : Liste verticale, cartes pleine largeur.
- **Carte Réservation (Row Component)** :
  - **Colonne 1 (Heure & Statut)** : ex: "12:30" (Gras), Point de couleur (Statut).
  - **Colonne 2 (Infos Client)** : Nom complet (Gras), Icône téléphone (si dispo), Note spéciale (icône info).
  - **Colonne 3 (Couverts & Table)** : Badge "4 pax", Badge "T-12".
  - **Colonne 4 (Actions Rapides)** :
    - Bouton principal : "Check-in" (si statut = Confirmé).
    - Bouton secondaire : "..." (Menu contextuel : Modifier, Annuler, No-show).

### B. Modale "Édition Rapide"
Conçue pour être utilisée avec des "gros doigts" (Touch targets > 44px).

- **Header** : Nom client + "Modifier".
- **Body** :
  - **Heure** : Sélecteur type "Roulette" ou Chips ( 12:00 | 12:15 | 12:30 ...).
  - **Couverts** : Stepper [- 4 +] (Gros boutons).
  - **Table** : Input texte simple (V0).
- **Footer** : Boutons "Annuler" (Gris) et "Sauvegarder" (Couleur Primaire).

## 3. Composants Réutilisables (Design System V0)

### Typographie & Couleurs
- **Police** : Sans-serif lisible (Inter ou Roboto).
- **Couleurs Statuts** :
  - `CONFIRMED` : Bleu (Info à traiter).
  - `ARRIVED` : Vert (Action terminée).
  - `NO_SHOW` : Rouge (Alerte).
  - `CANCELLED` : Gris (Neutre/Désactivé).

### Composants UI
1.  **StatusBadge** : Pillule colorée avec texte majuscule (ex: [ARRIVÉ]).
2.  **ActionButton** :
    - *Primary* : Fond plein, texte blanc.
    - *Secondary* : Contour, texte couleur.
    - *Success* : Vert (pour Check-in).
3.  **ServiceToggle** : Switch "Midi | Soir".

## 4. États de l'Interface (UI States)

### Loading State
- **Squelette (Skeleton Loader)** : Affiche des barres grises animées à la place des lignes de réservation pendant le chargement initial.
- **Spinner discret** : Dans le Header lors d'une action de background (refresh).

### Empty State
- Image SVG simple (ex: assiette vide ou icône calendrier).
- Texte : "Aucune réservation pour ce service."
- CTA : "Ajouter une réservation manuelle".

### Error State
- **Global** : Bannière rouge en haut d'écran ("Connexion perdue. Données locales affichées.").
- **Local (Action échouée)** : Toast/Snackbar rouge ("Impossible de modifier. Réessayer ?").

## 5. Microcopy & Messages

- **Succès Check-in** : "Dupont marqué comme arrivé." (Toast 3s)
- **Confirmation Annulation** : Modale "Êtes-vous sûr ? Cette action est irréversible." (Boutons : "Non, retour" / "Oui, annuler la réservation").
- **Erreur Réseau** : "Oups, problème de connexion. Vérifiez votre réseau."
- **Labels Accessibles (Aria)** : "Marquer Dupont comme arrivé", "Modifier la réservation de Martin".

