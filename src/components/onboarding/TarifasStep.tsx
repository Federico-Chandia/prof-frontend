import React, { useState } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

interface TarifasData {
  porHora: number;
  visitaTecnica: number;
  emergencia: number;
  desplazamiento: number;
  kmGratuitos: number;
}

interface TarifasStepProps {
  onNext: (data: any) => void;
  initialData?: TarifasData;
}

const TarifasStep: React.FC<TarifasStepProps> = ({ onNext, initialData }) => {
  const [tarifas, setTarifas] = useState<TarifasData>(
    initialData || {
      porHora: 0,
      visitaTecnica: 0,
      emergencia: 0,
      desplazamiento: 0,
      kmGratuitos: 5
    }
  );
  const [radioCobertura, setRadioCobertura] = useState(20);
  const [error, setError] = useState<string>('');
  const [showHelp, setShowHelp] = useState<string>('');

  const handleChange = (field: keyof TarifasData, value: number) => {
    setTarifas({ ...tarifas, [field]: value });
  };

  const handleNext = () => {
    if (tarifas.porHora <= 0) {
      setError('La tarifa por hora es requerida y debe ser mayor a $0');
      return;
    }

    onNext({
      tarifas,
      radioCobertura
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configura tus tarifas
        </h2>
        <p className="text-gray-600">
          Define tus precios. Puedes cambiarlos en cualquier momento
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Tarifa por Hora */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="block text-lg font-semibold text-gray-900">
              Tarifa por hora
            </label>
            <button
              onMouseEnter={() => setShowHelp('porHora')}
              onMouseLeave={() => setShowHelp('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={18} />
            </button>
          </div>
          {showHelp === 'porHora' && (
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              Es el precio que cobras por cada hora de trabajo
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-indigo-600">$</span>
            <input
              type="number"
              min="0"
              step="100"
              value={tarifas.porHora}
              onChange={e => handleChange('porHora', parseFloat(e.target.value))}
              placeholder="500"
              className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            <span className="text-gray-600">por hora</span>
          </div>
        </div>

        {/* Visita Técnica */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="block text-lg font-semibold text-gray-900">
              Visita técnica (opcional)
            </label>
            <button
              onMouseEnter={() => setShowHelp('visitaTecnica')}
              onMouseLeave={() => setShowHelp('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={18} />
            </button>
          </div>
          {showHelp === 'visitaTecnica' && (
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              Precio por visita de diagnóstico o evaluación inicial
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-indigo-600">$</span>
            <input
              type="number"
              min="0"
              step="100"
              value={tarifas.visitaTecnica}
              onChange={e => handleChange('visitaTecnica', parseFloat(e.target.value))}
              placeholder="300"
              className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            <span className="text-gray-600">por visita</span>
          </div>
        </div>

        {/* Tarifa de Emergencia */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="block text-lg font-semibold text-gray-900">
              Tarifa de emergencia (opcional)
            </label>
            <button
              onMouseEnter={() => setShowHelp('emergencia')}
              onMouseLeave={() => setShowHelp('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={18} />
            </button>
          </div>
          {showHelp === 'emergencia' && (
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              Recargo por atender fuera de horario o urgencias
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-indigo-600">$</span>
            <input
              type="number"
              min="0"
              step="100"
              value={tarifas.emergencia}
              onChange={e => handleChange('emergencia', parseFloat(e.target.value))}
              placeholder="1000"
              className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            <span className="text-gray-600">recargo</span>
          </div>
        </div>

        {/* Desplazamiento */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="block text-lg font-semibold text-gray-900">
              Tarifa de desplazamiento (opcional)
            </label>
            <button
              onMouseEnter={() => setShowHelp('desplazamiento')}
              onMouseLeave={() => setShowHelp('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={18} />
            </button>
          </div>
          {showHelp === 'desplazamiento' && (
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              Precio por kilómetro que recorres desde tu ubicación
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold text-indigo-600">$</span>
            <input
              type="number"
              min="0"
              step="10"
              value={tarifas.desplazamiento}
              onChange={e => handleChange('desplazamiento', parseFloat(e.target.value))}
              placeholder="50"
              className="flex-1 px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
            <span className="text-gray-600">por km</span>
          </div>
        </div>

        {/* KM Gratuitos */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="block text-lg font-semibold text-gray-900">
              Kilómetros sin cargo
            </label>
            <button
              onMouseEnter={() => setShowHelp('kmGratuitos')}
              onMouseLeave={() => setShowHelp('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={18} />
            </button>
          </div>
          {showHelp === 'kmGratuitos' && (
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              Distancia incluida en el precio (sin cargo adicional)
            </p>
          )}
          <input
            type="number"
            min="0"
            step="1"
            value={tarifas.kmGratuitos}
            onChange={e => handleChange('kmGratuitos', parseFloat(e.target.value))}
            placeholder="5"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>

        {/* Radio de Cobertura */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <label className="block text-lg font-semibold text-gray-900">
              Radio de cobertura máximo
            </label>
            <button
              onMouseEnter={() => setShowHelp('radioCobertura')}
              onMouseLeave={() => setShowHelp('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle size={18} />
            </button>
          </div>
          {showHelp === 'radioCobertura' && (
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              Distancia máxima desde tu ubicación donde aceptas trabajos
            </p>
          )}
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={radioCobertura}
              onChange={e => setRadioCobertura(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-bold text-indigo-600 min-w-fit">
              {radioCobertura} km
            </span>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold text-indigo-900">📊 Resumen de tarifas</p>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• Tarifa por hora: ${tarifas.porHora || '-'}</li>
          {tarifas.visitaTecnica > 0 && <li>• Visita técnica: ${tarifas.visitaTecnica}</li>}
          {tarifas.emergencia > 0 && <li>• Emergencia: +${tarifas.emergencia}</li>}
          {tarifas.desplazamiento > 0 && <li>• Desplazamiento: ${tarifas.desplazamiento}/km</li>}
          <li>• Cobertura: hasta {radioCobertura} km</li>
        </ul>
      </div>

      {/* Botón siguiente */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default TarifasStep;
