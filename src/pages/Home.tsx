import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CATEGORIAS from '../data/categorias';
import { detectCategoriaFromText } from '../services/intentService';
import SearchHero from '../components/SearchHero';
import TokenExplanation from '../components/TokenExplanation';


const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="w-full mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
             ¿Se te cortó la luz o salta la térmica? 
            </h1>
            <p className="text-base sm:text-lg mb-6 sm:mb-8">
             Encontrá un electricista cerca tuyo en minutos.
            </p>

            <SearchHero />
          </div>
        </div>
      </div>


       <div className="py-8 sm:py-12 bg-gray-50">
        <div className="w-full mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-left sm:text-center bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="text-lg font-semibold mb-2">1️⃣ Describís tu problema en el buscador</h3>
              <p className="text-gray-600 text-sm sm:text-base">Selecciona dónde necesitas ayuda</p>
            </div>
            <div className="text-left sm:text-center bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">👷</div>
              <h3 className="text-lg font-semibold mb-2">2️⃣ Elegís un profesional cercano</h3>
              <p className="text-gray-600 text-sm sm:text-base">Mira disponibilidad y reseñas</p>
            </div>
            <div className="text-left sm:text-center bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-lg font-semibold mb-2">3. Contacto directo y rápido</h3>
              <p className="text-gray-600 text-sm sm:text-base">Iniciá el chat y resolvé el problema sin trámites.</p>
            </div>
          </div>
        </div>
      </div>
      <p className="font-light text-center text-xs sm:text-sm py-4 sm:py-6 px-3">⚠️ La electricidad es peligrosa. Contactá un profesional calificado.</p>
    

      {/* Categorías destacadas
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Categorías destacadas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIAS.filter(c => ['plomero', 'electricista', 'gasista', 'cerrajero', 'albanil', 'aire-acondicionado'].includes(c.key)).map((c) => (
              <button
                key={c.key}
                onClick={() => window.location.assign(`/oficios?tipo=${encodeURIComponent(c.key)}`)}
                className="bg-gray-50 p-6 rounded-lg text-center hover:bg-gray-100 transition-colors"
              >
                <div className="text-3xl mb-2">{c.icon}</div>
                <h3 className="font-semibold mb-1">{c.label}</h3>
                <p className="text-sm text-gray-600">Servicios comunes: {c.subcategorias.slice(0,3).map(s => s.label).join(', ')}</p>
              </button>
            ))}
          </div>
        </div>
      </div> */}

      {/* CTA para profesionales */}
      <div className="bg-white py-8 sm:py-12">
        <div className="w-full mx-auto px-3 sm:px-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8 rounded-lg text-center">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">¿Sos profesional?</h3>
            <p className="text-gray-700 mb-6 text-sm sm:text-base">Conseguí más clientes hoy</p>
            <Link to="/register" className="inline-block w-full sm:w-auto bg-blue-600 text-white px-8 py-3 sm:py-2 rounded-lg hover:bg-blue-700 font-semibold transition-colors">Registrarme como profesional</Link>
          </div>
        </div>
      </div>

      {/* Token Explanation */}
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="w-full mx-auto px-3 sm:px-4">
          <TokenExplanation compact={true} />
        </div>
      </div>
    </div>
  );
};

export default Home;