# Product Requirements Document (V0) - CRM Réservations Restaurant

## 1. Vision
Fournir à l'équipe en salle une interface de gestion des réservations simple, ultra-rapide et fiable, connectée à Airtable, capable de soutenir le rythme intensif des services (midi et soir).

## 2. Objectifs Business
- **Efficacité Opérationnelle** : Réduire le temps de traitement d'une arrivée ou d'une modification (< 3 clics).
- **Fiabilité** : Assurer la disponibilité des données critiques même en pic de charge.
- **Sobriété** : Interface épurée pour éviter la fatigue cognitive et les erreurs en situation de stress.

## 3. Périmètre Fonctionnel (V0)

### 3.1 Vue Planning (Dashboard)
- Visualisation immédiate des réservations du jour.
- Distinction claire des services (Midi / Soir).
- Indicateurs visuels d'état (Confirmé, Arrivé, Annulé, No-show).

### 3.2 Gestion des Réservations
- **Modification Rapide** : Changement d'heure, nombre de couverts.
- **Statuts** : Workflow simple (En attente -> Confirmé -> Arrivé -> Terminé).
- **Annulation** : Processus rapide avec motif optionnel.

### 3.3 Socle Technique
- Connexion API Airtable (Lecture/Écriture).
- Gestion des erreurs et temps de latence (Feedback utilisateur immédiat).

## 4. Contraintes & Exigences Non-Fonctionnelles
- **Performance** : Chargement initial < 2s. Actions < 500ms.
- **UX/UI** : Boutons larges (target touch > 44px), contraste élevé pour environnements parfois sombres.
- **Device** : Optimisé pour tablette (iPad/Android) et Desktop.

## 5. Métriques de Succès (KPI)
- Temps moyen de check-in client.
- Taux d'erreur de saisie (corrections post-service).
- Satisfaction équipe salle (NPS interne).

