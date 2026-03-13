/**
 * Composant ReservationCard - Carte d'une réservation dans la liste
 */

import { Reservation } from '../../types/reservation';
import { getStatusDot } from '../../utils/statusUtils';
import { formatTime } from '../../utils/dateUtils';

interface ReservationCardProps {
  reservation: Reservation;
  onCheckIn: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
  onCancel: (id: string) => void;
}

export const ReservationCard = ({ reservation, onCheckIn, onEdit, onCancel }: ReservationCardProps) => {
  const canCheckIn = reservation.status === 'CONFIRMED';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* Colonne 1: Heure & Statut */}
        <div className="flex items-center gap-3 min-w-[100px]">
          <span className={`w-3 h-3 rounded-full ${getStatusDot(reservation.status)}`}></span>
          <span className="text-2xl font-bold text-gray-900">{formatTime(reservation.time)}</span>
        </div>

        {/* Colonne 2: Infos Client */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{reservation.guestName}</h3>
          {reservation.notes && (
            <p className="text-sm text-gray-500 mt-1">{reservation.notes}</p>
          )}
        </div>

        {/* Colonne 3: Couverts & Table */}
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold">
            {reservation.covers} pax
          </span>
          {reservation.table && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              T-{reservation.table}
            </span>
          )}
        </div>

        {/* Colonne 4: Actions */}
        <div className="flex gap-2">
          {canCheckIn && (
            <button
              onClick={() => onCheckIn(reservation.id)}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors min-h-[44px]"
              aria-label={`Marquer ${reservation.guestName} comme arrivé`}
            >
              Check-in
            </button>
          )}
          <button
            onClick={() => onEdit(reservation)}
            className="px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors min-h-[44px]"
            aria-label={`Modifier la réservation de ${reservation.guestName}`}
          >
            Modifier
          </button>
          <button
            onClick={() => onCancel(reservation.id)}
            className="px-4 py-3 border border-red-300 hover:bg-red-50 text-red-600 font-semibold rounded-lg transition-colors min-h-[44px]"
            aria-label={`Annuler la réservation de ${reservation.guestName}`}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

