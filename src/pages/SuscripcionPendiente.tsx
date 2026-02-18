import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SuscripcionPendiente: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tiempoEsperado, setTiempoEsperado] = React.useState('24 horas');

  const metodoPago = searchParams.get('payment_method');

  const obtenerTiempoEsperado = (method?: string | null): string => {
    switch (method) {
      case 'debin':
      case 'transfer':
        return '24-48 horas';
      case 'boleto':
        return '2-3 días hábiles';
      default:
        return '24 horas';
    }
  };

  useEffect(() => {
    if (metodoPago) {
      setTiempoEsperado(obtenerTiempoEsperado(metodoPago));
    }

    // Auto-redirigir después de 15 segundos
    const timer = setTimeout(() => {
      navigate('/mis-trabajos');
    }, 15000);

    return () => clearTimeout(timer);
  }, [metodoPago, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
        {/* Icono de pendiente */}
        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-amber-600 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Mensaje */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pago Pendiente
        </h1>
        <p className="text-gray-600 mb-6">
          Tu pago está siendo procesado. Por favor, espera a que se confirme.
        </p>

        {/* Información */}
        <div className="bg-amber-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Detalles:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <strong>Estado:</strong>{' '}
              <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-semibold">
                EN PROCESO
              </span>
            </li>
            {metodoPago && (
              <li>
                <strong>Método de pago:</strong> {metodoPago.toUpperCase()}
              </li>
            )}
            <li>
              <strong>Tiempo estimado:</strong> {tiempoEsperado}
            </li>
          </ul>
        </div>

        {/* Pasos a seguir */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">¿Qué sucede ahora?</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li>
              <strong>1.</strong> Tu pago está en cola para procesar
            </li>
            <li>
              <strong>2.</strong> Recibirás un email cuando se confirme
            </li>
            <li>
              <strong>3.</strong> Tu suscripción se activará automáticamente
            </li>
            <li>
              <strong>4.</strong> Accederás a todos los beneficios premium
            </li>
          </ol>
        </div>

        {/* Botones */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/mis-trabajos')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Ir a mi panel
          </button>
          <p className="text-sm text-gray-500">
            Redirigiendo en 15 segundos...
          </p>
        </div>

        {/* Notas */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Nota:</strong> No cierres esta página hasta que recibas la confirmación. 
            Si no recibes el email en el tiempo estimado, contacta a soporte.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuscripcionPendiente;
