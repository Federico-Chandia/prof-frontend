import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

interface DisponibilidadToggleProps {
  oficioId?: string;
}

const DisponibilidadToggle: React.FC<DisponibilidadToggleProps> = ({ oficioId }) => {
  const [disponible, setDisponible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (oficioId) {
      fetchDisponibilidad();
    }
  }, [oficioId]);

  const fetchDisponibilidad = async () => {
    try {
      const response = await api.get(`/api/oficios/${oficioId}`);
      setDisponible(response.data.oficio.disponibilidad.inmediata);
    } catch (error) {
      console.error('Error fetching disponibilidad:', error);
    }
  };

  const toggleDisponibilidad = async () => {
    if (!oficioId) {
      showNotification('❌ Error: ID de oficio no válido');
      return;
    }
    
    setLoading(true);
    try {
      await api.put(`/api/oficios/${oficioId}/disponibilidad`, {
        disponible: !disponible
      });
      setDisponible(!disponible);
      
      // Mostrar notificación de éxito
      if (!disponible) {
        showNotification('✅ Ahora estás disponible para nuevos trabajos');
      } else {
        showNotification('⏸️ Te has marcado como no disponible');
      }
    } catch (error: any) {
      console.error('Error updating disponibilidad:', error);
      const errorMessage = error?.response?.data?.message || 'Error al actualizar disponibilidad';
      showNotification(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Disponibilidad', { body: message });
    }
  };

  if (user?.rol !== 'profesional') return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Estado de Disponibilidad</h3>
          <p className="text-sm text-gray-600">
            {disponible ? 'Estás recibiendo nuevas reservas' : 'No estás recibiendo nuevas reservas'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            disponible 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {disponible ? '🟢 Disponible' : '🔴 No Disponible'}
          </span>
          
          <button
            onClick={toggleDisponibilidad}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              disponible ? 'bg-blue-600' : 'bg-gray-200'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                disponible ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
      
      {disponible && (
        <div className="mt-3 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            💡 <strong>Tip:</strong> Mantén tu disponibilidad actualizada para recibir más trabajos
          </p>
        </div>
      )}
    </div>
  );
};

export default DisponibilidadToggle;