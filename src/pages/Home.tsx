import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CATEGORIAS from '../data/categorias';
import { detectCategoriaFromText } from '../services/intentService';
import SearchHero from '../components/SearchHero';


const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
             ¿Se te cortó la luz o salta la térmica? <br />
            </h1>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
             Encontrá un electricista cerca tuyo para resolverlo hoy mismo.
            </p>

            <SearchHero />
          </div>
        </div>
      </div>


       <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Beneficios</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-lg font-semibold mb-2">🧑‍🔧 Cómo funciona? (3 pasos simples)</h3>
              <p className="text-gray-600 text-center"> 1️⃣ Elegís tu zona <br />
              2️⃣ Seleccionas un electricista cercano <br />
              3️⃣ Lo contactás y resolvés el problema</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="text-lg font-semibold mb-2">Cerca de tu ubicación</h3>
              <p className="text-gray-600">Muestra profesionales cercanos para una respuesta rápida.</p>
            </div>
            <div className="text-center bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl mb-3">💬</div>
              <h3 className="text-lg font-semibold mb-2">Contacto directo y rápido</h3>
              <p className="text-gray-600">Iniciá el chat y resolvé el problema sin trámites.</p>
            </div>
          </div>
        </div>
      </div>
      <p className="font-light text-center">⚠️ La electricidad es peligrosa. <br /> Contactá un profesional calificado para evitar riesgos.</p>
    

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
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mt-12 bg-blue-50 p-8 rounded-lg text-center">
            <h3 className="text-xl font-semibold mb-3">¿Sos profesional? Conseguí más clientes hoy</h3>
            <br />
            <Link to="/register" className="inline-block bg-blue-600 text-white px-9 py-2 rounded-md hover:bg-blue-700">Registrarme como profesional</Link>
          </div>

          {/* Token Plans */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-2 text-center">Elegi el plan que mas se adapte a vos</h3>
            <div className="mt-6 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-lg text-center shadow-xl">
                <div className="text-lg font-semibold">Gratis</div>
                <div className="text-2xl font-bold mt-2">2 tokens</div>
                <div className="text-sm text-gray-600 mt-2">Gratis al crear cuenta</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-xl">
                <div className="text-lg font-semibold">Básico</div>
                <div className="text-2xl font-bold mt-2">20 tokens</div>
                <div className="text-sm text-gray-600 mt-2">Perfecto para empezar</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-xl">
                <div className="text-lg font-semibold">Pro</div>
                <div className="text-2xl font-bold mt-2">50 tokens</div>
                <div className="text-sm text-gray-600 mt-2">Máxima visibilidad</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;