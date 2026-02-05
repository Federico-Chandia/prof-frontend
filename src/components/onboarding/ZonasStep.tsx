import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

const zonasDisponibles = [
  'Centro',
  'Norte',
  'Sur',
  'Este',
  'Oeste',
  'Zona 1',
  'Zona 2',
  'Zona 3',
  'Zona 4',
  'Zona 5',
  'Zona 6',
  'La Plata',
  'Berazategui',
  'Quilmes',
  'Avellaneda',
  'Lanús',
  'San Justo',
  'Ciudadela',
  'Mataderos',
  'Flores'
];

interface ZonasStepProps {
  onNext: (data: any) => void;
  initialData?: string[];
}

const ZonasStep: React.FC<ZonasStepProps> = ({ onNext, initialData = [] }) => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState<string>('');
  const [zonasSeleccionadas, setZonasSeleccionadas] = useState<string[]>(initialData);
  const [error, setError] = useState<string>('');
  const [filtro, setFiltro] = useState<string>('');

  const zonasDisponiblesFiltradasSync = zonasDisponibles.filter(
    z => !zonasSeleccionadas.includes(z) && z.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleAgregarZona = () => {
    if (!zonaSeleccionada) {
      setError('Por favor selecciona una zona');
      return;
    }

    if (zonasSeleccionadas.includes(zonaSeleccionada)) {
      setError('Esta zona ya está seleccionada');
      return;
    }

    setZonasSeleccionadas([...zonasSeleccionadas, zonaSeleccionada]);
    setZonaSeleccionada('');
    setError('');
  };

  const handleEliminarZona = (zona: string) => {
    setZonasSeleccionadas(zonasSeleccionadas.filter(z => z !== zona));
  };

  const handleNext = () => {
    if (zonasSeleccionadas.length === 0) {
      setError('Debes seleccionar al menos una zona de trabajo');
      return;
    }

    onNext({
      zonasTrabajo: zonasSeleccionadas
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¿Dónde trabajas?
        </h2>
        <p className="text-gray-600">
          Selecciona los barrios o zonas donde ofreces tus servicios
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Selector de zonas */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">
            Agregar zona
          </label>

          {/* Buscador */}
          <div className="relative">
            <input
              type="text"
              placeholder="Busca una zona..."
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>

          {/* Dropdown de zonas */}
          <div className="relative">
            <button
              onClick={() => setZonaSeleccionada(zonaSeleccionada ? '' : 'open')}
              className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all"
            >
              {zonaSeleccionada || 'Selecciona una zona'}
            </button>

            {!zonaSeleccionada && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {zonasDisponiblesFiltradasSync.length > 0 ? (
                  zonasDisponiblesFiltradasSync.map(zona => (
                    <button
                      key={zona}
                      onClick={() => setZonaSeleccionada(zona)}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition-all"
                    >
                      {zona}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    No hay zonas disponibles
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botón agregar */}
          <button
            onClick={handleAgregarZona}
            disabled={!zonaSeleccionada}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              zonaSeleccionada
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Plus size={20} />
            Agregar zona
          </button>
        </div>

        {/* Zonas seleccionadas */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Zonas seleccionadas ({zonasSeleccionadas.length})
          </label>

          {zonasSeleccionadas.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-gray-500">
                Aún no has seleccionado ninguna zona
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {zonasSeleccionadas.map(zona => (
                <div
                  key={zona}
                  className="bg-indigo-50 border border-indigo-300 rounded-lg p-3 flex items-center justify-between"
                >
                  <span className="font-medium text-indigo-900">{zona}</span>
                  <button
                    onClick={() => handleEliminarZona(zona)}
                    className="text-indigo-600 hover:text-indigo-900 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-semibold text-blue-900">📍 Consejos de zonas</p>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Selecciona todas las zonas donde puedas llegar fácilmente</li>
          <li>• Los clientes solo te verán en estas áreas</li>
          <li>• Puedes cambiar tus zonas en cualquier momento</li>
          <li>• Cuantas más zonas, más solicitudes podrías recibir</li>
        </ul>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4 mt-8">
        {zonasSeleccionadas.length > 0 && (
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            Completar
          </button>
        )}
      </div>
    </div>
  );
};

export default ZonasStep;
