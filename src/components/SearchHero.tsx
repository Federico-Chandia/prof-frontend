import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CATEGORIAS from '../data/categorias';
import { detectCategoriaFromText } from '../services/intentService';
import LocationZoneModal from './LocationZoneModal';

const SearchHero: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [showZoneModal, setShowZoneModal] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<{ categoriaKey: string; subKey?: string; label: string } | null>(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const text = (query || '').trim();
    if (!text) return;
    const detected = detectCategoriaFromText(text);

    // Show zone modal instead of navigating directly
    setPendingCategory({
      categoriaKey: detected.categoriaKey || '',
      subKey: detected.subKey,
      label: text
    });
    setShowZoneModal(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const openSub = (key: string) => {
    setSelected(key === selected ? null : key);
  };

  const handleSubClick = (categoriaKey: string, subKey: string, label: string) => {
    // Show zone modal instead of navigating directly
    setPendingCategory({ categoriaKey, subKey, label });
    setShowZoneModal(true);
  };

  return (
    <div>
      <LocationZoneModal
        isOpen={showZoneModal}
        categoriaKey={pendingCategory?.categoriaKey}
        subKey={pendingCategory?.subKey}
        categoryLabel={pendingCategory?.label}
        onClose={() => {
          setShowZoneModal(false);
          setPendingCategory(null);
        }}
      />
      <div className="flex">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          id="home-problem-input"
          type="text"
          placeholder='Ingresa tu problema: "no tengo luz", "se quemo un enchufe..."'
          className="w-full px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-800 shadow-sm"
        />
        <button
          id="home-search-button"
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 px-5 rounded-r-md text-white font-semibold"
        >
          🔍 Buscar Electricista
        </button>
      </div>

      {/* Subcategory selector (simple popover) */}
      {selected && (
        <div className="mt-4 bg-white p-4 rounded shadow-sm max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold">¿Qué problema tenés en {CATEGORIAS.find(c => c.key === selected)?.label}?</h4>
            <button onClick={() => setSelected(null)} className="text-sm text-gray-500">Cerrar</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CATEGORIAS.find(c => c.key === selected)?.subcategorias.map((s) => (
              <button
                key={s.key}
                onClick={() => handleSubClick(selected, s.key, s.label)}
                className="py-2 px-3 rounded-md bg-gray-50 hover:bg-gray-100 text-sm text-left"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHero;
