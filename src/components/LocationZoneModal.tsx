import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LocationZoneModalProps {
  isOpen: boolean;
  categoriaKey?: string;
  subKey?: string;
  categoryLabel?: string;
  onClose: () => void;
}

const LocationZoneModal: React.FC<LocationZoneModalProps> = ({
  isOpen,
  categoriaKey,
  subKey,
  categoryLabel,
  onClose
}) => {
  const [zone, setZone] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const zonaTrimmed = zone.trim();
    if (!zonaTrimmed) {
      alert('Por favor ingresá tu barrio o ciudad');
      return;
    }

    const params = new URLSearchParams();
    if (categoriaKey) params.append('tipo', categoriaKey);
    if (subKey) params.append('sub', subKey);
    params.append('zona', zonaTrimmed);
    if (categoryLabel) params.append('q', categoryLabel);

    // Log analytics
    import('../services/analytics').then(({ sendEvent }) => 
      sendEvent('locationEntered', { zona: zonaTrimmed, categoria: categoriaKey })
    );

    navigate(`/oficios?${params.toString()}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">¿En qué zona estás?</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl flex-shrink-0"
          >
            ✕
          </button>
        </div>

        <p className="text-xs sm:text-sm text-gray-600 mb-4">
          Para mostrarte con los profesionales más cercanos
        </p>

        <input
          type="text"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ej: Caballito, La Plata"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-base text-gray-800 mb-4"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-orange-500 hover:bg-orange-600 px-5 py-3 rounded-md text-white font-semibold transition-colors"
        >
          🔵 Ver profesionales
        </button>

        <button
          onClick={onClose}
          className="w-full mt-2 bg-gray-100 hover:bg-gray-200 px-5 py-2 rounded-md text-gray-700 font-semibold transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default LocationZoneModal;
