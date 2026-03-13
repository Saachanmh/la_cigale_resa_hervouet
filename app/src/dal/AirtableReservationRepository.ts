/**
 * Implémentation Airtable du ReservationRepository
 * Communique avec le BFF (Backend-for-Frontend) via /api
 */

import { ReservationRepository } from './ReservationRepository';
import { Reservation, ReservationStatus, ReservationUpdate, ServiceType, NetworkError, RateLimitError } from '@/types/reservation';

export class AirtableReservationRepository implements ReservationRepository {
  private baseUrl = '/api/reservations';

  private async fetchWithErrorHandling(url: string, options?: RequestInit): Promise<Response> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (response.status === 429) {
        throw new RateLimitError('Trop de requêtes. Veuillez patienter.');
      }

      if (!response.ok) {
        throw new NetworkError(`Erreur HTTP: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (error instanceof RateLimitError || error instanceof NetworkError) {
        throw error;
      }
      throw new NetworkError('Connexion perdue. Vérifiez votre réseau.');
    }
  }

  async getReservationsByService(date: string, service: ServiceType): Promise<Reservation[]> {
    const response = await this.fetchWithErrorHandling(
      `${this.baseUrl}?date=${date}&service=${service}`
    );
    return response.json();
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    const response = await this.fetchWithErrorHandling(
      `${this.baseUrl}/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
    return response.json();
  }

  async updateReservationDetails(id: string, updates: ReservationUpdate): Promise<Reservation> {
    const response = await this.fetchWithErrorHandling(
      `${this.baseUrl}/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
      }
    );
    return response.json();
  }

  async createReservation(guestName: string, covers: number, time: string, date: string): Promise<Reservation> {
    const response = await this.fetchWithErrorHandling(
      this.baseUrl,
      {
        method: 'POST',
        body: JSON.stringify({ guestName, covers, time, date, status: 'CONFIRMED' }),
      }
    );
    return response.json();
  }

  async cancelReservation(id: string): Promise<void> {
    await this.fetchWithErrorHandling(
      `${this.baseUrl}/${id}`,
      {
        method: 'DELETE',
      }
    );
  }
}

// Instance singleton
export const reservationRepository = new AirtableReservationRepository();

