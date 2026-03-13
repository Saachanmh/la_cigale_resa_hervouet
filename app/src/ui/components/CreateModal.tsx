/**
 * Composant CreateModal - Modale de création de réservation
 */

import { useState } from 'react';

interface CreateModalProps {
  onSave: (guestName: string, covers: number, time: string) => void;
  onClose: () => void;
  defaultService: 'LUNCH' | 'DINNER';
}

export const CreateModal = ({ onSave, onClose, defaultService }: CreateModalProps) => {
  const [guestName, setGuestName] = useState('');
  const [covers, setCovers] = useState(2);
  const [time, setTime] = useState(defaultService === 'LUNCH' ? '12:00' : '19:30');

  const handleSave = () => {
    if (!guestName.trim()) {
      alert('Le nom du client est requis');
      return;
    }
    onSave(guestName, covers, time);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Nouvelle Réservation</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6">
          {/* Nom du client */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom du client
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Ex: Dupont"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
              autoFocus
            />
          </div>

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
            Créer
          </button>
        </div>
      </div>
    </div>
  );
};

