# Backlog Produit (V0)

## Épics
1. **Intégration Airtable**
2. **Visualisation & Planning**
3. **Actions Rapides (CRUD)**

## User Stories (Format Gherkin)

### US-001: Visualisation du Planning du Jour
**En tant que** responsable de salle,
**Je veux** voir la liste des réservations pour le service en cours (Midi ou Soir),
**Afin de** préparer l'accueil des clients.

```gherkin
Scenario: Affichage par défaut
    Given je suis connecté à l'application
    And nous sommes le "2023-10-27" à "12:30"
    When j'ouvre le tableau de bord
    Then je vois la liste des réservations pour le service du "Midi" du jour
    And les réservations sont triées par heure d'arrivée
```

### US-002: Confirmation d'une réservation (Check-in)
**En tant que** hôte d'accueil,
**Je veux** marquer une réservation comme "Arrivée" en un seul geste,
**Afin de** fluidifier l'installation des clients.

```gherkin
Scenario: Check-in client rapide
    Given une réservation au nom de "Dupont" est au statut "Confirmé"
    When je clique sur le bouton "Arrivé" de la ligne "Dupont"
    Then le statut de la réservation passe à "Arrivé" visuellement
    And la mise à jour est envoyée à Airtable
```

### US-003: Modification Rapide (Couverts)
**En tant que** serveur,
**Je veux** changer le nombre de couverts d'une réservation existante,
**Afin de** mettre à jour le plan de salle si le groupe change de taille.

```gherkin
Scenario: Changement du nombre de pax
    Given la réservation "Martin" est prévue pour 4 personnes
    When je sélectionne l'action "Modifier"
    And je change le nombre de couverts à 5
    And je valide
    Then le compteur de couverts affiche 5 sur le planning
    And la capacité totale du service est recalculée
```

### US-004: Annulation de réservation
**En tant que** responsable,
**Je veux** annuler une réservation rapidement,
**Afin de** libérer la table pour d'autres clients (Walk-ins).

```gherkin
Scenario: Annulation simple
    Given la réservation "Durand" est active
    When je clique sur "Annuler"
    And je confirme l'action
    Then la réservation disparaît de la vue active (ou passe en grisé/barré)
    And le statut Airtable passe à "Annulé"
```

### US-005: Gestion des erreurs de connexion
**En tant qu'** utilisateur,
**Je veux** être averti si une action n'a pas pu être sauvegardée,
**Afin de** ne pas perdre d'information.

```gherkin
Scenario: Perte de connexion Airtable
    Given je n'ai plus d'accès internet
    When je tente de modifier une réservation
    Then un message d'erreur "Connexion perdue" apparaît
    And l'action n'est pas validée visuellement (ou marquée comme "à réessayer")
```

