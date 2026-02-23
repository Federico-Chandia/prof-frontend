import React, { useState, useEffect} from 'react';
import { Oficio } from '../types';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

interface ReservaModalProps {
  oficio: Oficio;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDescripcion?: string; // optional initial description (e.g., from search query)
}

const ReservaModal: React.FC<ReservaModalProps> = ({ oficio, isOpen, onClose, onSuccess, initialDescripcion }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    descripcionTrabajo: '',
    direccion: {
      calle: '',
      barrio: ''
    },
    tipoServicio: 'porHora',
    preferenciaProfesional: 'sin_preferencia' as 'sin_preferencia' | 'prefiero_mujer' | 'prefiero_hombre'
  });

  // Prellenar con la dirección del usuario al abrir el modal
  useEffect(() => {
    if (isOpen && user?.direccion) {
      setFormData(prev => ({ 
        ...prev, 
        direccion: {
          calle: user.direccion.calle || '',
          barrio: user.direccion.barrio || ''
        },
        descripcionTrabajo: initialDescripcion || prev.descripcionTrabajo
      }));
    }
  }, [isOpen, user, initialDescripcion]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const reservaData = {
        oficioId: oficio._id,
        descripcionTrabajo: formData.descripcionTrabajo,
        direccion: formData.direccion,
        tipoServicio: formData.tipoServicio,
        preferenciaProfesional: formData.preferenciaProfesional
      };

      const response = await api.post('/reservas', reservaData);
      const nuevaReserva = response.data.reserva;
      
      // Enviar mensaje automático al profesional
      try {
        await api.post('/messages', {
          reservaId: nuevaReserva._id,
          receptorId: oficio.usuario._id,
          mensaje: formData.descripcionTrabajo,
          tipo: 'texto'
        });
        console.log('Mensaje automático enviado al profesional');
      } catch (msgError) {
        console.error('Error enviando mensaje automático:', msgError);
        // No fallar la reserva si el mensaje falla
      }
      
      // analytics: contactCompleted
      import('../services/analytics').then(({ sendEvent }) => sendEvent('contactCompleted', { profesionalId: oficio._id, tipo: formData.tipoServicio }));

      // Mostrar toast de éxito
      addNotification({
        tipo: 'reserva_aceptada',
        titulo: 'Contacto Iniciado',
        mensaje: `Tu solicitud ha sido enviada a ${oficio.usuario.nombre}. Puedes chatear desde Mis Reservas.`,
        icon: '💬',
        url: '/mis-reservas',
        actions: [
          { action: 'ver', title: 'Ver Reservas' }
        ]
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating reserva:', error);
      setError(error.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Reservar Servicio</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 flex-shrink-0">✕</button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold">{oficio.usuario.nombre}</p>
          <p className="text-sm text-gray-600 capitalize">{oficio.tipoOficio}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Servicio</label>
            <select
              value={formData.tipoServicio}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormData(prev => ({...prev, tipoServicio: newValue}));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="porHora">Obra general (${oficio.tarifas.porHora}/h)</option>
              <option value="visitaTecnica">Visita Técnica (${oficio.tarifas.visitaTecnica})</option>
              <option value="emergencia">Emergencia (${oficio.tarifas.emergencia})</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Descripción del Trabajo</label>
            <textarea
              value={formData.descripcionTrabajo}
              onChange={(e) => {
                const newValue = e.target.value;
                setFormData(prev => ({...prev, descripcionTrabajo: newValue}));
              }}
              placeholder="Describe el trabajo que necesitas..."
              rows={3}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Preferencia de género del profesional */}
          <div>
            <label className="block text-sm font-medium mb-1">Preferencia de profesional (opcional)</label>
            <p className="text-xs text-gray-500 mb-2">
              Para tu comodidad, podés indicar una preferencia
            </p>
            <select
              value={formData.preferenciaProfesional}
              onChange={(e) => {
                const newValue = e.target.value as 'sin_preferencia' | 'prefiero_mujer' | 'prefiero_hombre';
                setFormData(prev => ({...prev, preferenciaProfesional: newValue}));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sin_preferencia">Sin preferencia</option>
              <option value="prefiero_mujer">Prefiero profesional mujer</option>
              <option value="prefiero_hombre">Prefiero profesional hombre</option>
            </select>
          </div>
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm">
            💬 La fecha y hora se coordinarán mediante chat con el profesional
          </div> <br />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.descripcionTrabajo.trim()}
              className="flex-1 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          </div>
          
          {!formData.descripcionTrabajo.trim() && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
              ✏️ Describe el trabajo que necesitas
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReservaModal;