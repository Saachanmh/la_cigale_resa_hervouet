/**
 * Utilitaires pour la gestion des dates et services
 */

import type { ServiceType } from '@/types/reservation';

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatTime = (time: string): string => {
  return time.substring(0, 5); // "HH:mm"
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const getCurrentService = (): ServiceType => {
  const hour = new Date().getHours();
  return hour < 15 ? 'LUNCH' : 'DINNER';
};

export const getServiceLabel = (service: ServiceType): string => {
  return service === 'LUNCH' ? 'Midi' : 'Soir';
};

export const formatDateDisplay = (date: string): string => {
  const d = new Date(date);
  const today = new Date();

  if (formatDate(d) === formatDate(today)) {
    return "Aujourd'hui";
  }

  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
};

