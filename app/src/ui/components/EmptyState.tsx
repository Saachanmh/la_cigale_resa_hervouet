/**
 * Composant EmptyState - État vide (aucune réservation)
 */

interface EmptyStateProps {
  onAddReservation: () => void;
}

export const EmptyState = ({ onAddReservation }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg
        className="w-24 h-24 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Aucune réservation pour ce service
      </h3>
      <button
        onClick={onAddReservation}
        className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
      >
        Ajouter une réservation manuelle
      </button>
    </div>
  );
};

