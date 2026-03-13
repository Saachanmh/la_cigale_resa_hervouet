/**
 * Composant ServiceToggle - Toggle Midi/Soir
 */

import { ServiceType } from '../../types/reservation';
import { getServiceLabel } from '../../utils/dateUtils';

interface ServiceToggleProps {
  service: ServiceType;
  onChange: (service: ServiceType) => void;
}

export const ServiceToggle = ({ service, onChange }: ServiceToggleProps) => {
  const services: ServiceType[] = ['LUNCH', 'DINNER'];

  return (
    <div className="inline-flex rounded-lg bg-gray-200 p-1">
      {services.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-6 py-2 rounded-md font-semibold transition-colors ${
            service === s
              ? 'bg-white text-blue-600 shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {getServiceLabel(s)}
        </button>
      ))}
    </div>
  );
};

