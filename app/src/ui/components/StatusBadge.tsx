/**
 * Composant StatusBadge - Affiche le statut d'une réservation
 */

import { ReservationStatus } from '../../types/reservation';
import { getStatusColor, getStatusLabel } from '../../utils/statusUtils';

interface StatusBadgeProps {
  status: ReservationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
};

