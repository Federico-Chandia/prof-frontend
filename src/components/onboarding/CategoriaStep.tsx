import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import CATEGORIAS from '../../data/categorias';

// convert CATEGORIAS to the previous shape used by this component
const categorias = CATEGORIAS.map(c => ({
  id: c.key,
  nombre: c.label,
  icono: c.icon,
  profesiones: [...c.subcategorias.map(s => s.key), 'otro']
}));

interface CategoriaStepProps {
  onNext: (data: any) => void;
}

const CategoriaStep: React.FC<CategoriaStepProps> = ({ onNext }) => {
  const [selectedCategoria, setSelectedCategoria] = useState<string>('');
  const [selectedProfesion, setSelectedProfesion] = useState<string>('');
  const [customProfesion, setCustomProfesion] = useState<string>('');
  const [error, setError] = useState<string>('');

  const categoriaSeleccionada = categorias.find(c => c.id === selectedCategoria);

  const handleNext = () => {
    if (!selectedCategoria || !selectedProfesion) {
      setError('Por favor selecciona una categoría y profesión');
      return;
    }

    if (selectedProfesion === 'otro' && !customProfesion.trim()) {
      setError('Por favor especifica tu profesión');
      return;
    }

    onNext({
      categoria: selectedCategoria,
      profesion: selectedProfesion,
      profesionPersonalizada: selectedProfesion === 'otro' ? customProfesion : undefined
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ¿Cuál es tu especialidad?
        </h2>
        <p className="text-gray-600">
          Selecciona la categoría que mejor describe tu trabajo
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Grid de categorías */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categorias.map(categoria => (
          <button
            key={categoria.id}
            onClick={() => {
              setSelectedCategoria(categoria.id);
              setSelectedProfesion('');
              setError('');
            }}
            className={`p-4 rounded-lg border-2 transition-all text-center ${
              selectedCategoria === categoria.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 bg-white'
            }`}
          >
            <div className="text-4xl mb-2">{categoria.icono}</div>
            <p className="font-semibold text-sm text-gray-900">
              {categoria.nombre}
            </p>
          </button>
        ))}
      </div>

      {/* Selección de profesión */}
      {categoriaSeleccionada && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Selecciona tu profesión específica
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categoriaSeleccionada.profesiones.map(profesion => (
              <button
                key={profesion}
                onClick={() => {
                  setSelectedProfesion(profesion);
                  setError('');
                }}
                className={`p-3 rounded-lg border-2 transition-all text-left text-sm font-medium ${
                  selectedProfesion === profesion
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                    : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                }`}
              >
                {profesion.charAt(0).toUpperCase() + profesion.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          {selectedProfesion === 'otro' && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Especifica tu profesión"
                value={customProfesion}
                onChange={e => setCustomProfesion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
          )}
        </div>
      )}

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

export default CategoriaStep;
