# RAID Log (Risques, Hypothèses, Problèmes, Dépendances)

## Risques (Risks)
- **R1 - Latence API Airtable** : Les temps de réponse de l'API Airtable peuvent varier et ralentir l'interface en plein service.
    - *Mitigation* : Mise en cache locale, "Optimistic UI" (mise à jour visuelle avant confirmation serveur).
- **R2 - Rate Limiting** : Airtable impose une limite de 5 requêtes/seconde.
    - *Mitigation* : Queue de requêtes côté backend ou client, regroupement des appels si possible.
- **R3 - Conflits d'édition** : Deux serveurs modifient la même réservation simultanément.
    - *Mitigation* : Accepter la dernière modification (Last Write Wins) pour la V0.

## Hypothèses (Assumptions)
- **A1** : L'équipe de salle dispose d'une connexion internet stable (Wifi/4G) dans le restaurant.
- **A2** : La structure la base Airtable (noms des champs, tables) est figée pour la V0.
- **A3** : L'authentification se fera via une clé API commune ou un système simple pour la V0 (pas de gestion complexe de rôles).

## Problèmes (Issues)
- **I1** : Pas de mode "Hors-ligne" complet prévu pour la V0 (dépendance forte au réseau).

## Dépendances (Dependencies)
- **D1** : Accès au compte Airtable du client et documentation de la structure de la base (Schema).
- **D2** : Choix de la stack technique (Frontend) par l'équipe de dev.

