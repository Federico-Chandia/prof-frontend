import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const EmailConfirmed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === '1';

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {success ? (
          <>
            {/* Success State */}
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <svg
                  className="w-12 h-12 text-green-600"
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
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Correo Confirmado!
            </h1>
            <p className="text-gray-600 mb-6">
              Tu dirección de correo electrónico ha sido verificada correctamente. Ya puedes acceder a tu cuenta.
            </p>

            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Ir al Login
              </Link>
              <Link
                to="/"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Volver al Inicio
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Si tienes problemas para acceder, contacta a nuestro equipo de soporte.
            </p>
          </>
        ) : (
          <>
            {/* Error State */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 rounded-full p-4">
                <svg
                  className="w-12 h-12 text-red-600"
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
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Error en la Confirmación
            </h1>
            <p className="text-gray-600 mb-6">
              El enlace de confirmación es inválido o ha expirado. Por favor, intenta registrarte nuevamente o contacta a nuestro equipo de soporte.
            </p>

            <div className="space-y-3">
              <Link
                to="/register"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Registrarse Nuevamente
              </Link>
              <Link
                to="/"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Volver al Inicio
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              <strong>Posibles razones:</strong>
              <br />
              - El enlace ha expirado (válido por 24 horas)
              <br />
              - El token es inválido
              <br />
              - Ya fue confirmado anteriormente
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmed;
