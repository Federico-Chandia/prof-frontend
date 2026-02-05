import React, { useState } from 'react';
import { Gift, TrendingUp, Zap, Shield, Clock, Users } from 'lucide-react';

interface TokenExplanationProps {
  userTokens?: number;
  onClose?: () => void;
  compact?: boolean;
}

const TokenExplanation: React.FC<TokenExplanationProps> = ({
  userTokens = 0,
  onClose,
  compact = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'planes' | 'como-funcionan'>('overview');

  if (compact) {
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <Zap className="text-amber-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-bold text-amber-900">Tokens: Tu moneda en la plataforma</p>
              <p className="text-sm text-amber-800 mt-1">
                Úsalos para responder solicitudes y conectar con clientes. Aprende más sobre cómo funcionan.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 sm:px-8 py-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-30 p-3 rounded-lg">
              <Zap size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Tokens</h1>
              <p className="text-amber-100">La moneda de la plataforma</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
            >
              ✕
            </button>
          )}
        </div>
        {userTokens > 0 && (
          <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-4">
            <p className="text-sm text-amber-100">Tu saldo actual</p>
            <p className="text-2xl font-bold">{userTokens} tokens</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'overview', label: 'Visión General' },
          { id: 'planes', label: 'Planes de Tokens' },
          { id: 'como-funcionan', label: '¿Cómo Funcionan?' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-4 font-semibold text-center transition-all ${
              activeTab === tab.id
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">¿Qué son los tokens?</h2>

            {/* Grid de características */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="text-amber-600" size={24} />
                  <h3 className="font-bold text-gray-900">Moneda Digital</h3>
                </div>
                <p className="text-gray-700">
                  Los tokens son créditos digitales que usas para interactuar con clientes en la plataforma.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-blue-600" size={24} />
                  <h3 className="font-bold text-gray-900">Conecta con Clientes</h3>
                </div>
                <p className="text-gray-700">
                  Gasta tokens para responder solicitudes y acceder a información de clientes.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="text-green-600" size={24} />
                  <h3 className="font-bold text-gray-900">Suscripciones</h3>
                </div>
                <p className="text-gray-700">
                  Obtén tokens recurrentes con planes de suscripción mensual a precios especiales.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="text-purple-600" size={24} />
                  <h3 className="font-bold text-gray-900">Bonificaciones</h3>
                </div>
                <p className="text-gray-700">
                  Recibe bonos por completar trabajos y mantener buenas calificaciones.
                </p>
              </div>
            </div>

            {/* Info importante */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-blue-900 flex items-center gap-2">
                <Shield size={18} /> Información importante
              </p>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Los tokens NO son dinero real ni se pueden convertir a efectivo</li>
                <li>• Solo se gastan cuando confirmas que respondes a una solicitud</li>
                <li>• Los tokens no utilizados se mantienen en tu cuenta</li>
                <li>• La plataforma nunca expira tus tokens (salvo política especial)</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'planes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Elige tu plan</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Plan Básico */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-amber-500 transition-all">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900">Básico</h3>
                  <p className="text-sm text-gray-600">Prueba la plataforma</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">Por transacción</p>
                    <p className="text-3xl font-bold text-gray-900">Según necesidad</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ Compra tokens cuando los necesites</li>
                    <li>✓ Sin suscripción requerida</li>
                    <li>✓ Precio por unidad estándar</li>
                  </ul>
                </div>
              </div>

              {/* Plan Profesional */}
              <div className="border-2 border-amber-500 rounded-lg overflow-hidden shadow-lg transform scale-105">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                  <p className="text-xs font-bold text-white bg-orange-600 inline-block px-2 py-1 rounded mb-2">
                    MÁS POPULAR
                  </p>
                  <h3 className="font-bold text-lg text-white">Profesional</h3>
                  <p className="text-sm text-amber-100">Mejor relación precio-valor</p>
                </div>
                <div className="p-6 space-y-4 bg-amber-50">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">Mensual</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <p className="text-3xl font-bold text-amber-600">20</p>
                      <p className="text-gray-600">tokens</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">+ bonificaciones mensuales</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ 20 tokens cada mes</li>
                    <li>✓ 2 tokens de bono extra</li>
                    <li>✓ Renovación automática</li>
                    <li>✓ Mejor para profesionales activos</li>
                  </ul>
                  <button className="w-full bg-amber-600 text-white py-2 rounded font-semibold hover:bg-amber-700 transition-all">
                    Seleccionar Plan
                  </button>
                </div>
              </div>

              {/* Plan Premium */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-purple-500 transition-all">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900">Premium</h3>
                  <p className="text-sm text-gray-600">Máxima disponibilidad</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600">Mensual</p>
                    <div className="flex items-baseline justify-center gap-2">
                      <p className="text-3xl font-bold text-purple-600">50</p>
                      <p className="text-gray-600">tokens</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">+ bonificaciones extra</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>✓ 50 tokens cada mes</li>
                    <li>✓ 10 tokens de bono extra</li>
                    <li>✓ Prioridad en búsquedas</li>
                    <li>✓ Para profesionales con alto volumen</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'como-funcionan' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">¿Cómo funcionan los tokens?</h2>

            <div className="space-y-4">
              {/* Paso 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Recibe una solicitud</h3>
                  <p className="text-gray-700">
                    Un cliente te envía una solicitud de trabajo a través de la plataforma.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Confirma tu respuesta</h3>
                  <p className="text-gray-700">
                    Si decides responder, confirmas tu interés. En ese momento se gastan los tokens.
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Conecta con el cliente</h3>
                  <p className="text-gray-700">
                    Accedes a los datos de contacto y negocias directamente con el cliente.
                  </p>
                </div>
              </div>

              {/* Paso 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Completa el trabajo</h3>
                  <p className="text-gray-700">
                    Realiza el trabajo acordado. Gana dinero directamente con el cliente.
                  </p>
                </div>
              </div>
            </div>

            {/* Preguntas frecuentes */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-gray-900 mb-4">Preguntas frecuentes</h3>

              <div className="space-y-3">
                <details className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all">
                  <summary className="font-semibold text-gray-900">
                    ¿Qué pasa si no contacto al cliente después de responder?
                  </summary>
                  <p className="mt-3 text-gray-700 text-sm">
                    Los tokens se gastan cuando confirmas tu respuesta, sin importar si luego contactas al cliente. Por eso es importante responder solo a solicitudes que realmente puedas atender.
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all">
                  <summary className="font-semibold text-gray-900">
                    ¿Puedo recuperar tokens?
                  </summary>
                  <p className="mt-3 text-gray-700 text-sm">
                    Sí, contacta al soporte si hay un error. Los admins pueden revertir transacciones en casos excepcionales.
                  </p>
                </details>

                <details className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-all">
                  <summary className="font-semibold text-gray-900">
                    ¿Hay descuentos para volumen?
                  </summary>
                  <p className="mt-3 text-gray-700 text-sm">
                    Sí, con los planes de suscripción obtienes mejor precio por token. Además, completar trabajos exitosamente te da bonificaciones.
                  </p>
                </details>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenExplanation;
