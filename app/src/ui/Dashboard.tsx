/**
 * Dashboard principal - Vue Liste avec filtres et actions CRUD
 */

import { useState, useEffect } from 'react';
import { Reservation, ReservationUpdate, ServiceType, NetworkError, RateLimitError } from '../types/reservation';
import { reservationRepository } from '../dal/AirtableReservationRepository';
import { getTodayDate, getCurrentService, formatDateDisplay } from '../utils/dateUtils';
import { ServiceToggle } from './components/ServiceToggle';
import { ReservationCard } from './components/ReservationCard';
import { LoadingState } from './components/LoadingState';
import { EmptyState } from './components/EmptyState';
import { EditModal } from './components/EditModal';
import { CreateModal } from './components/CreateModal';
import { Toast } from './components/Toast';

export const Dashboard = () => {
  const [date, setDate] = useState(getTodayDate());
  const [service, setService] = useState<ServiceType>(getCurrentService());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Chargement initial
  useEffect(() => {
    loadReservations();
  }, [date, service]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reservationRepository.getReservationsByService(date, service);
      setReservations(data);
    } catch (err) {
      if (err instanceof RateLimitError) {
        setError('Trop de requêtes. Veuillez patienter un instant.');
      } else if (err instanceof NetworkError) {
        setError('Connexion perdue. Vérifiez votre réseau.');
      } else {
        setError('Erreur lors du chargement des réservations.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id: string) => {
    try {
      const updated = await reservationRepository.updateReservationStatus(id, 'ARRIVED');
      setReservations(reservations.map(r => r.id === id ? updated : r));
      const reservation = reservations.find(r => r.id === id);
      showToast(`${reservation?.guestName} marqué comme arrivé.`, 'success');
    } catch (err) {
      showToast('Impossible de modifier. Réessayer ?', 'error');
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
  };

  const handleSaveEdit = async (id: string, updates: ReservationUpdate) => {
    try {
      const updated = await reservationRepository.updateReservationDetails(id, updates);
      setReservations(reservations.map(r => r.id === id ? updated : r));
      showToast('Réservation mise à jour.', 'success');
    } catch (err) {
      showToast('Impossible de modifier. Réessayer ?', 'error');
    }
  };

  const handleCreateReservation = async (guestName: string, covers: number, time: string) => {
    try {
      const newReservation = await reservationRepository.createReservation(guestName, covers, time, date);
      setReservations([...reservations, newReservation].sort((a, b) => a.time.localeCompare(b.time)));
      setShowCreateModal(false);
      showToast('Réservation créée.', 'success');
    } catch (err) {
      showToast('Impossible de créer la réservation.', 'error');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Êtes-vous sûr ? Cette action est irréversible.')) return;

    try {
      await reservationRepository.cancelReservation(id);
      setReservations(reservations.filter(r => r.id !== id));
      showToast('Réservation annulée.', 'success');
    } catch (err) {
      showToast('Impossible d\'annuler. Réessayer ?', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePreviousDay = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 1);
    setDate(formatDate(d));
  };

  const handleNextDay = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 1);
    setDate(formatDate(d));
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const totalCovers = reservations.reduce((sum, r) => sum + r.covers, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Date */}
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreviousDay}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                aria-label="Jour précédent"
              >
                ←
              </button>
              <div className="flex flex-col items-center">
                <h1 className="text-xl font-bold">{formatDateDisplay(date)}</h1>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="text-sm text-gray-500 border-none outline-none cursor-pointer"
                />
              </div>
              <button
                onClick={handleNextDay}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                aria-label="Jour suivant"
              >
                →
              </button>
            </div>

            {/* Service Toggle */}
            <ServiceToggle service={service} onChange={setService} />

            {/* Actions */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              + Nouvelle
            </button>
          </div>
        </div>
      </header>

      {/* KPI */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-4">
          <div className="bg-white rounded-lg px-6 py-3 shadow-sm">
            <span className="text-sm text-gray-500">Réservations</span>
            <span className="ml-3 text-2xl font-bold">{reservations.length}</span>
          </div>
          <div className="bg-white rounded-lg px-6 py-3 shadow-sm">
            <span className="text-sm text-gray-500">Couverts</span>
            <span className="ml-3 text-2xl font-bold">{totalCovers}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <LoadingState />
        ) : reservations.length === 0 ? (
          <EmptyState onAddReservation={() => setShowCreateModal(true)} />
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCheckIn={handleCheckIn}
                onEdit={handleEdit}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {editingReservation && (
        <EditModal
          reservation={editingReservation}
          onSave={handleSaveEdit}
          onClose={() => setEditingReservation(null)}
        />
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateModal
          onSave={handleCreateReservation}
          onClose={() => setShowCreateModal(false)}
          defaultService={service}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

