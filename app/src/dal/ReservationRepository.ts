/**
 * Interface DAL (Data Access Layer)
 * Contrat strict pour isoler la logique métier de l'implémentation Airtable
 */

import { Reservation, ReservationStatus, ReservationUpdate, ServiceType } from '@/types/reservation';

export interface ReservationRepository {
  /**
   * Récupère les réservations pour une date et un service donnés.
   * @returns Promesse d'un tableau trié par heure.
   */
  getReservationsByService(date: string, service: ServiceType): Promise<Reservation[]>;

  /**
   * Change uniquement le statut. Optimisé pour la rapidité.
   * Devrait retourner la réservation mise à jour pour confirmation UI.
   */
  updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation>;

  /**
   * Met à jour les détails opérationnels.
   */
  updateReservationDetails(id: string, updates: ReservationUpdate): Promise<Reservation>;

  /**
   * Création d'une réservation (Walk-ins).
   */
  createReservation(guestName: string, covers: number, time: string, date: string): Promise<Reservation>;

  /**
   * Suppression logique (annulation).
   */
  cancelReservation(id: string): Promise<void>;
}

