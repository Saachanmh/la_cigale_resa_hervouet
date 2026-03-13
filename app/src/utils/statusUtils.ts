/**
 * Utilitaires pour les statuts de réservation
 */

import type { ReservationStatus } from '@/types/reservation';

export const getStatusColor = (status: ReservationStatus): string => {
  const colors: Record<ReservationStatus, string> = {
    CONFIRMED: 'bg-status-confirmed text-white',
    ARRIVED: 'bg-status-arrived text-white',
    NO_SHOW: 'bg-status-noshow text-white',
    CANCELLED: 'bg-status-cancelled text-white',
  };
  return colors[status];
};

export const getStatusLabel = (status: ReservationStatus): string => {
  const labels: Record<ReservationStatus, string> = {
    CONFIRMED: 'Confirmé',
    ARRIVED: 'Arrivé',
    NO_SHOW: 'No-show',
    CANCELLED: 'Annulé',
  };
  return labels[status];
};

export const getStatusDot = (status: ReservationStatus): string => {
  const colors: Record<ReservationStatus, string> = {
    CONFIRMED: 'bg-blue-500',
    ARRIVED: 'bg-green-500',
    NO_SHOW: 'bg-red-500',
    CANCELLED: 'bg-gray-400',
  };
  return colors[status];
};

