import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import api from '../services/api';

interface Plan {
  id: string;
  nombre: string;
  precio: number;
  beneficios: string[];
  recomendado?: boolean;
}

const planes: Plan[] = [
  {
    id: 'profesional',
    nombre: 'Plan Profesional',
    precio: 2999,
    beneficios: [
      '✓ Perfil verificado',
      '✓ Prioridad estándar',
      '✓ Estadísticas básicas',
      '✓ Duración: 30 días'
    ]
  },
  {
    id: 'premium',
    nombre: 'Plan Premium',
    precio: 4999,
    beneficios: [
      '✓ Perfil verificado',
      '✓ Prioridad máxima',
      '✓ Estadísticas avanzadas',
      '✓ Soporte prioritario',
      '✓ Duración: 30 días'
    ],
    recomendado: true
  }
];

const ComprarSuscripcion: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [planSeleccionado, setPlanSeleccionado] = useState<string>('premium');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComprar = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.rol !== 'profesional') {
      setError('Solo los profesionales pueden comprar suscripciones');
      return;
    }

    setCargando(true);
    setError(null);

    try {
      // Primero registrar el Payment en el backend para tener trazabilidad
      const response = await api.post('/payments/suscripcion', { plan: planId });
      const data = response.data;

      // Para suscripciones preaprobadas (plans del dashboard de MP) redirigimos
      if (planId === 'profesional' || planId === 'premium') {
        const planUrl = planId === 'profesional'
          ? (import.meta.env.VITE_MP_PROFESIONAL_PLAN_URL || 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=6dbd2e8163e140768b1c16d2b35358bb')
          : (import.meta.env.VITE_MP_PREMIUM_PLAN_URL || 'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2293dd4fe51f416f9ad9d569e63c9bc9');

        // Si el backend devolvió initPoint (por compatibilidad), preferirlo solo para pagos clásicos
        window.location.href = planUrl;
        return;
      }

      // Flujo por defecto: usar initPoint retornado por el backend
      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error('No se recibió el link de pago');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade a Premium
          </h1>
          <p className="text-xl text-gray-600">
            Obtén más visibilidad y herramientas profesionales
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Info del usuario */}
        {user && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-gray-700">
              <strong>Comprador:</strong> {user.nombre} ({user.email})
            </p>
          </div>
        )}

        {/* Planes */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {planes.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg overflow-hidden transition-all ${
                plan.recomendado
                  ? 'ring-2 ring-blue-600 shadow-xl scale-105 md:scale-110'
                  : 'border border-gray-200 shadow-md'
              }`}
            >
              {/* Header del plan */}
              <div className={`p-6 ${plan.recomendado ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}>
                <h2 className="text-2xl font-bold">{plan.nombre}</h2>
                {plan.recomendado && (
                  <div className="mt-2 inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    Más Popular
                  </div>
                )}
              </div>

              {/* Precio */}
              <div className={`px-6 py-8 ${plan.recomendado ? 'bg-blue-50' : 'bg-white'}`}>
                <div className="mb-6">
                  {/* Precios: mostrar precio anterior tachado y precio promocional */}
                  {(() => {
                    const envKey = plan.id === 'profesional'
                      ? import.meta.env.VITE_PROMO_PRICE_PROFESIONAL
                      : import.meta.env.VITE_PROMO_PRICE_PREMIUM;
                    const promo = envKey ? Number(envKey) : undefined;
                    const promoPrice = promo && !Number.isNaN(promo) ? promo : plan.precio;
                    return (
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          <span className="line-through mr-3">${plan.precio.toLocaleString('es-AR')}</span>
                          <span className="text-gray-700">/mes</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-bold text-gray-900">${promoPrice.toLocaleString('es-AR')}</span>
                          <span className="text-sm text-red-600 font-semibold">Por tiempo limitado</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Beneficios */}
                <ul className="space-y-3 mb-8">
                  {plan.beneficios.map((beneficio, idx) => (
                    <li key={idx} className="text-gray-700">
                      {beneficio}
                    </li>
                  ))}
                </ul>

                {/* Botón de compra */}
                <button
                  onClick={() => handleComprar(plan.id)}
                  disabled={cargando}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    plan.recomendado
                      ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-300'
                  } ${cargando ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {cargando ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Procesando...
                    </span>
                  ) : (
                    'Comprar ahora'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h3 className="text-xl font-semibold mb-4">Preguntas frecuentes</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">¿Por qué debo pagar?</h4>
              <p className="text-gray-600">
                Los planes premium te dan más visibilidad, mejor posicionamiento en búsquedas y herramientas profesionales para gestionar tus servicios.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">¿Puedo cancelar en cualquier momento?</h4>
              <p className="text-gray-600">
                Sí, tu suscripción se renueva cada 30 días. Puedes cancelar cuando quieras desde tu perfil.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">¿Qué métodos de pago aceptan?</h4>
              <p className="text-gray-600">
                Aceptamos tarjeta de crédito, débito y transferencia bancaria a través de Mercado Pago.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprarSuscripcion;
