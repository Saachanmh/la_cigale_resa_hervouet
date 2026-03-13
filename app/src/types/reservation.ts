/**
 * Types de données pour le CRM Réservations
 * Basé sur le contrat DAL défini dans docs/architecture.md
 */

export type ReservationStatus = 'CONFIRMED' | 'ARRIVED' | 'NO_SHOW' | 'CANCELLED';

export type ServiceType = 'LUNCH' | 'DINNER';

export interface Reservation {
  id: string;
  guestName: string;
  firstName?: string; // Prénom séparé
  lastName?: string;  // Nom séparé
  covers: number;
  time: string; // Format "HH:mm"
  date: string; // Format "YYYY-MM-DD"
  status: ReservationStatus;
  table?: string;
  notes?: string;
  allergies?: string; // Allergies spécifiques
  dietaryRequirements?: string; // Régimes alimentaires
  additionalInfo?: string; // Informations complémentaires
}

export interface ReservationUpdate {
  covers?: number;
  time?: string;
  table?: string;
  notes?: string;
  allergies?: string;
  dietaryRequirements?: string;
  additionalInfo?: string;
}

// Erreurs typées pour le DAL
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RateLimitError';
  }
}

