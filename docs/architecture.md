# Architecture Technique (V0) - CRM Réservations

## 1. Vue d'Ensemble
L'architecture est conçue pour être **légère** (rapidité de développement V0) mais **robuste** (usage intensif en service). Le cœur du système repose sur une Single Page Application (SPA) communiquant avec Airtable.

### Diagramme Logique Simplifié
`[Client Tablette/Desktop] <---> [Couche DAL / Proxy] <---> [API Airtable]`

---

## 2. Analyses et Décisions Techniques (ADR)

### ADR 01 : Stratégie d'Authentification Airtable (PAT vs OAuth)
Pour connecter l'application à la base de données Airtable, deux options s'offrent à nous.

#### Option A : Personal Access Token (PAT)
Un token généré manuellement lié à un compte "Service" ou "Admin".
- **Avantages** : Extrêmement simple à mettre en place (pas de flow de redirection). Idéal pour une V0 interne où tous les utilisateurs partagent les mêmes droits d'accès à la base.
- **Inconvénients** : Si le token fuite, il faut le révoquer manuellement. Granularité des permissions moins fine qu'OAuth (bien que les Scopes existent sur les PAT récents).
- **Contexte Projet** : Notre client est *un* restaurant (tenant unique).
- **Recommandation V0** : **PAT (Personal Access Token)**. Pour la rapidité de mise en œuvre et parce que nous opérons dans un contexte de confiance (équipe interne).

#### Option B : OAuth 2.0
Flux standard autorisant l'application à agir au nom d'un utilisateur Airtable spécifique.
- **Avantages** : Plus sécurisé, pas de partage de clés longue durée. Permet de savoir "qui" a fait l'action dans Airtable (via `lastModifiedBy`).
- **Inconvénients** : Complexité d'implémentation (gestion des tokens, refresh tokens via backend). Overkill pour une V0 mono-client.

---

### ADR 02 : Modèle de Communication (Direct vs Proxy)
Comment l'application cliente discute-t-elle avec Airtable ?

#### Option A : Appels Directs (Client-side)
Le navigateur appelle directement `api.airtable.com`.
- **Avantages** : Pas d'infrastructure backend à gérer. Latence réseau minimale (un saut de moins).
- **Critique** : Expose potentiellement le PAT dans le code client (même minifié). Difficile de gérer le Rate Limiting global (5 req/s) partagé entre tous les utilisateurs.
- **Risque Sécurité** : Élevé. Tout utilisateur curieux peut récupérer le token et lire toute la base.

#### Option B : Proxy Serverless (Middleware)
Une couche intermédiaire (ex: Next.js API Routes, Cloudflare Workers, AWS Lambda).
- **Avantages** : 
    1. **Sécurité** : Le PAT reste sur le serveur, invisible pour le client.
    2. **Contrôle** : Possibilité de cacher les réponses (réduire appels Airtable) et de gérer une queue globale pour respecter le Rate Limit.
    3. **Transformation** : Formater les données brutes d'Airtable avant qu'elles n'arrivent au front (DTOs propres).
- **Inconvénients** : Ajoute une brique d'infrastructure.

#### Décision Architecte
=> **Option Hybride / Proxy Léger**.
Pour une V0 professionnelle, nous ne pouvons pas risquer d'exposer la clé API (R3 RAID) ni de bloquer le service à cause du Rate Limit (R2 RAID).
Nous utiliserons un **Backend-for-Frontend (BFF)** léger (type Next.js API Routes ou Vercel Functions).

---

## 3. Stratégie de Gestion des Secrets

Pour sécuriser l'accès à Airtable (notre base de données), nous appliquerons la stratégie suivante :

1.  **Pas de secrets dans le code client** : Aucune variable préfixée par `NEXT_PUBLIC_` ou `VITE_` ne contiendra de clés sensibles.
2.  **Infrastructure** :
    *   **Local** : Utilisation de `.env.local` (non versionné).
    *   **Production** : Injection via le gestionnaire de secrets de la plateforme d'hébergement (ex: Vercel Environment Variables).
3.  **Variables requises** :
    *   `AIRTABLE_API_KEY` (PAT) : Accès serveur uniquement.
    *   `AIRTABLE_BASE_ID` : ID de la base.
    *   `AIRTABLE_TABLE_RESERVATIONS` : ID de la table.

---

## 4. Contrat DAL (Data Access Layer)

Afin d'isoler la logique métier de l'implémentation Airtable, nous définissons une interface stricte `ReservationRepository`.

### Entités (Types Logiques)

```typescript
type ReservationStatus = 'CONFIRMED' | 'ARRIVED' | 'NO_SHOW' | 'CANCELLED';

interface Reservation {
  id: string;          // ID interne Airtable
  guestName: string;
  covers: number;      // Nombre de couverts
  time: string;        // Format ISO ou "HH:mm"
  status: ReservationStatus;
  table?: string;      // Optionnel
  notes?: string;
}
```

### Méthodes CRUD (Signatures)

#### 1. Récupération (Read)
Besoin : Afficher le planning filtré pour réduire la payload.
```typescript
/**
 * Récupère les réservations pour une date et un service donnés.
 * @returns Promesse d'un tableau trié par heure.
 */
function getReservationsByService(date: string, service: 'LUNCH' | 'DINNER'): Promise<Reservation[]>;
```

#### 2. Mise à jour de Statut (Update partiel)
Besoin : Action rapide "Arrivé" ou "Annulé".
```typescript
/**
 * Change uniquement le statut. Optimisé pour la rapidité.
 * Devrait retourner la réservation mise à jour pour confirmation UI.
 */
function updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation>;
```

#### 3. Modification Détails (Update complet)
Besoin : Corriger heure ou couverts.
```typescript
/**
 * Met à jour les détails opérationnels.
 */
function updateReservationDetails(id: string, updates: { covers?: number; time?: string }): Promise<Reservation>;
```

#### 4. Création (Create) - *Optionnel V0*
Besoin : Walk-ins (clients de passage).
```typescript
function createWalkInReservation(guestName: string, covers: number, time: string): Promise<Reservation>;
```

### Gestion des Erreurs DAL
Le DAL doit attraper les erreurs Airtable (ex: 429 Too Many Requests, 503) et renvoyer des erreurs typées pour l'UI :
- `NetworkError` : Pour déclencher le mode dégradé / retry.
- `RateLimitError` : Pour afficher un toast "Veuillez patienter un instant".

