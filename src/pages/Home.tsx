import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CATEGORIAS from '../data/categorias';
import { detectCategoriaFromText } from '../services/intentService';
import SearchHero from '../components/SearchHero';
import Testimonios from '../components/Testimonios';


const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div id="problem-input" className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white">
        <div className="w-full mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
             ¿Se te cortó la luz o salta la térmica? 
            </h1>
            <p  className="text-base sm:text-lg mb-6 sm:mb-8">
             Encontrá un electricista cerca tuyo en minutos.
            </p>

            <SearchHero />
          </div>
        </div>
      </div>


       <div id="como-funciona" className="py-8 sm:py-12 bg-gray-50">
        <div className="w-full mx-auto px-3 sm:px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-left sm:text-center bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 sm:h-40 bg-gray-200 overflow-hidden">
                <img
                  src="https://imgs.search.brave.com/RNUKliIZNpotOTq4SDxMKtZ7U8OKmACPOqdxCZ1rtIY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMjA3/ODg2MTc4NC9lcy9m/b3RvL2NhYmxlYWRv/LWRlZmVjdHVvc28t/Y2FyYm9uaXphZG8t/eS1xdWVtYWRvLWNv/bmNlcHRvLWRlLXBl/bGlncm8tZGUtaW5j/ZW5kaW8tcG9yLWNv/cnRvY2lyY3VpdG8u/anBnP2I9MSZzPTYx/Mng2MTImdz0wJms9/MjAmYz1BNU4zUkhS/aHpXdEZMcVlXVnJT/N29fQzdkdGVQNFpH/bXVFX1RLcnY3NGFB/PQ"
                  alt="Buscar profesional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="text-lg font-semibold mb-2">1️⃣ Describís tu problema</h3>
                <p className="text-gray-600 text-sm sm:text-base">Selecciona dónde necesitas ayuda</p>
              </div>
            </div>
            <div className="text-left sm:text-center bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 sm:h-40 bg-gray-200 overflow-hidden">
                <img
                  src="https://plus.unsplash.com/premium_photo-1661911309991-cc81afcce97d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Elegir profesional"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="text-3xl mb-3">👷</div>
                <h3 className="text-lg font-semibold mb-2">2️⃣ Elegís un profesional cercano</h3>
                <p className="text-gray-600 text-sm sm:text-base">Mira reseñas y disponibilidad</p>
              </div>
            </div>
            <div className="text-left sm:text-center bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 sm:h-40 bg-gray-200 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1564544430321-8d0eb062b11e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHB1bGdhcmVzJTIwaGFjaWElMjBhcnJpYmF8ZW58MHx8MHx8fDA%3D"
                  alt="Chat directo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="text-lg font-semibold mb-2">3. Contacto directo y rápido</h3>
                <p className="text-gray-600 text-sm sm:text-base">Iniciá el chat y resolvé el problema sin trámites.</p>
              </div>
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
      <div className="bg-white py-8 sm:py-12">
        <div className="w-full mx-auto px-3 sm:px-4 max-w-6xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <span className="text-3xl">⚡</span>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Tokens de Profesional</h2>
                <p className="text-amber-600 text-sm">La moneda de la plataforma</p>
              </div>
            </div>
          </div>

          {/* Grid de características */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⚡</span>
                <h3 className="font-bold text-gray-900">Moneda Digital</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Los tokens son créditos digitales que usas para interactuar con clientes en la plataforma.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">👥</span>
                <h3 className="font-bold text-gray-900">Conecta con Clientes</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Gasta tokens para responder solicitudes y acceder a información de clientes.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📈</span>
                <h3 className="font-bold text-gray-900">Suscripciones</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Obtén tokens recurrentes con planes de suscripción mensual a precios especiales.
              </p>
            </div>
          </div>

          {/* Cómo funcionan */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">¿Cómo funcionan los tokens?</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">Recibe una solicitud</h4>
                  <p className="text-gray-700 text-xs">
                    Un cliente te envía una solicitud de trabajo.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">Confirma tu respuesta</h4>
                  <p className="text-gray-700 text-xs">
                    Si decides responder, se usa un token.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">Conecta con el cliente</h4>
                  <p className="text-gray-700 text-xs">
                    Accedes a los datos de contacto y negocias directamente.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">Completa el trabajo</h4>
                  <p className="text-gray-700 text-xs">
                    Realiza el trabajo acordado y recibí tu pago y una reseña.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info importante */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
              <span>🛡️</span> Información importante
            </p>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Los tokens NO son dinero real ni se pueden convertir a efectivo</li>
              <li>• Solo se gastan cuando confirmas que respondes a una solicitud</li>
              <li>• Los tokens no son acumulativos</li>
              <li>• La plataforma renueva tus tokens mensualmente de acuerdo a tu plan</li>
            </ul>
          </div>
        </div>
      </div>


      {/* Sección de Precios Mejorada */}
      <section id="planes" className="py-8 sm:py-16 bg-gray-50">
        <div className="w-full mx-auto px-3 sm:px-4 max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Planes y Precios
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Elige el plan que mejor se adapte a tus necesidades de profesional
            </p>
          </div>

          {/* Cards de planes con imágenes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Plan Gratis */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-32 sm:h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">🆓</span>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Plan Gratis</h3>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">2 Tokens</p>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Incluye:</p>
                <ul className="space-y-2 mb-6 text-xs sm:text-sm text-gray-700">
                  <li>✓ Perfil profesional básico</li>
                  <li>✓ 2 tokens al registrarte</li>
                  <li>✓ Soporte por email</li>
                  <li>✓ Chat con clientes</li>
                </ul>
                <button className="w-full py-2 text-sm font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Empezar
                </button>
              </div>
            </div>

            {/* Plan Básico */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ring-2 ring-blue-500 relative">
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                Más Popular
              </div>
              <div className="h-32 sm:h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">⚡</span>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Plan Profesional</h3>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">20 Tokens</p>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Renovacion Mensual</p>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Incluye:</p>
                <ul className="space-y-2 mb-6 text-xs sm:text-sm text-gray-700">
                  <li>✓ Todo lo del Plan Básico</li>
                  <li>✓ 20 tokens para usar</li>
                  <li>✓ Perfil verificado</li>
                  <li>✓ Soporte prioritario</li>
                </ul>
                <button className="w-full py-2 sm:py-3 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Comprar Ahora
                </button>
              </div>
            </div>

            {/* Plan Pro */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-32 sm:h-40 bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <span className="text-4xl sm:text-5xl">👑</span>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Plan Premium</h3>
                <p className="text-2xl sm:text-3xl font-bold text-amber-600 mb-1">50 Tokens</p>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Renovacion Mensual</p>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">Incluye:</p>
                <ul className="space-y-2 mb-6 text-xs sm:text-sm text-gray-700">
                  <li>✓ Todo lo del Plan Básico</li>
                  <li>✓ 50 tokens para usar</li>
                  <li>✓ Perfil verificado</li>
                  <li>✓ estadisticas avanzadas</li>
                  <li>✓ Soporte 24/7</li>
                </ul>
                <button className="w-full py-2 text-sm font-medium border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                  Comprar Ahora
                </button>
              </div>
            </div>
          </div>

          {/* Suscripción */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 sm:p-8 text-white text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">Suscripción Profesional</h3>
            <p className="text-sm sm:text-base text-blue-100 mb-4">
              Obténe tokens cada mes con planes de suscripción
            </p>
            <p className="text-s text-black-600">Por tiempo limitado:</p> <br />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
              <div className="bg-blue-500 rounded-lg p-4">
                <p className="text-lg font-bold">$5,000/mes</p>
                <p className="text-xs text-blue-100">20 tokens mensuales</p>
              </div>
              <div className="bg-blue-500 rounded-lg p-4">
                <p className="text-lg font-bold">$10,000/mes</p>
                <p className="text-xs text-blue-100">50 tokens mensuales</p>
              </div>
            </div>
            <Link
              to="/suscripcion"
              className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Ver Planes de Suscripción
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;