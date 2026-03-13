/**
 * Composant Modal - Modale d'édition rapide
 */

import { useState } from 'react';
import { Reservation, ReservationUpdate } from '../../types/reservation';

interface EditModalProps {
  reservation: Reservation;
  onSave: (id: string, updates: ReservationUpdate) => void;
  onClose: () => void;
}

export const EditModal = ({ reservation, onSave, onClose }: EditModalProps) => {
  const [covers, setCovers] = useState(reservation.covers);
  const [time, setTime] = useState(reservation.time);
  const [table, setTable] = useState(reservation.table || '');

  const handleSave = () => {
    onSave(reservation.id, { covers, time, table });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{reservation.guestName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6">
          {/* Heure */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Heure
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
            />
          </div>

          {/* Couverts */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre de couverts
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCovers(Math.max(1, covers - 1))}
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg text-2xl font-bold"
              >
                −
              </button>
              <span className="text-3xl font-bold w-12 text-center">{covers}</span>
              <button
                onClick={() => setCovers(covers + 1)}
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg text-2xl font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Table */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Table
            </label>
            <input
              type="text"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="Ex: 12"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

