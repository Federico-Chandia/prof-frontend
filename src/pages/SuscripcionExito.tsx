import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SuscripcionExito: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [detalles, setDetalles] = useState<{
    paymentId?: string;
    status?: string;
  }>({});

  useEffect(() => {
    // Obtener parámetros del webhook de Mercado Pago
    const paymentId = searchParams.get('payment_id');
    const status = searchParams.get('status');

    if (paymentId || status) {
      setDetalles({
        paymentId: paymentId || undefined,
        status: status || 'approved'
      });
    }

    // Auto-redirigir después de 5 segundos
    const timer = setTimeout(() => {
      if (user?.rol === 'profesional') {
        navigate('/mis-trabajos');
      } else {
        navigate('/');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        {/* Icono de éxito */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Mensaje */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Pago Exitoso!
        </h1>
        <p className="text-gray-600 mb-6">
          Tu suscripción ha sido activada correctamente.
        </p>

        {/* Detalles */}
        {detalles.paymentId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600">
              <strong>ID de Transacción:</strong> {detalles.paymentId}
            </p>
            {detalles.status && (
              <p className="text-sm text-gray-600 mt-2">
                <strong>Estado:</strong>{' '}
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                  {detalles.status.toUpperCase()}
                </span>
              </p>
            )}
          </div>
        )}

        {/* Beneficios */}
        <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Ahora tienes acceso a:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Perfil verificado</li>
            <li>✓ Mayor visibilidad en búsquedas</li>
            <li>✓ Estadísticas detalladas</li>
            <li>✓ Soporte prioritario</li>
          </ul>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(user?.rol === 'profesional' ? '/mis-trabajos' : '/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Ir a mi panel
          </button>
          <p className="text-sm text-gray-500">
            Redirigiendo en 5 segundos...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuscripcionExito;
