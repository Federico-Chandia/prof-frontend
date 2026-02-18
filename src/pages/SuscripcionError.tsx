import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SuscripcionError: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mostrarDetalles, setMostrarDetalles] = React.useState(false);
  
  const errorCode = searchParams.get('error_code');
  const description = searchParams.get('description');

  const obtenerMensajeError = (code?: string | null): string => {
    switch (code) {
      case 'action_rejected':
        return 'Transacción rechazada por el usuario';
      case 'not_paid':
        return 'El pago no se completó';
      case 'invalid_card':
        return 'Tarjeta inválida o expirada';
      case 'insufficient_funds':
        return 'Fondos insuficientes';
      case 'cancelled':
        return 'Pago cancelado';
      default:
        return 'Hubo un error al procesar tu pago';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        {/* Icono de error */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Mensaje */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pago No Completado
        </h1>
        <p className="text-gray-600 mb-6">
          {obtenerMensajeError(errorCode)}
        </p>

        {/* Detalles del error (opcional) */}
        {(errorCode || description) && (
          <div className="mb-6">
            <button
              onClick={() => setMostrarDetalles(!mostrarDetalles)}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              {mostrarDetalles ? 'Ocultar' : 'Ver'} detalles técnicos
            </button>
            {mostrarDetalles && (
              <div className="bg-gray-50 rounded-lg p-3 mt-3 text-left text-xs text-gray-600">
                {errorCode && <p><strong>Código:</strong> {errorCode}</p>}
                {description && <p><strong>Descripción:</strong> {decodeURIComponent(description)}</p>}
              </div>
            )}
          </div>
        )}

        {/* Sugerencias */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">¿Qué puedo hacer?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Intenta con otra tarjeta o método de pago</li>
            <li>• Verifica que tu tarjeta sea válida y no esté vencida</li>
            <li>• Contacta a tu banco para autorizar el pago</li>
            <li>• Intenta nuevamente en unos minutos</li>
          </ul>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/suscripcion')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Intentar Nuevamente
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-200 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>

        {/* Soporte */}
        <p className="text-sm text-gray-500 mt-6">
          ¿Necesitas ayuda?{' '}
          <a
            href="mailto:soporte@profesionales.com"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Contacta a soporte
          </a>
        </p>
      </div>
    </div>
  );
};

export default SuscripcionError;
