import React from 'react';
import { Link } from 'react-router-dom';

const LandingProfesional: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Conseguí clientes reales cerca de tu zona</h1>
          <p className="text-gray-700 mb-6">Te damos clientes verificados que necesitan trabajos de hogar: plomería y electricidad. Pagás solo por contactos cuando quieras más.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-semibold">Gratis</div>
              <div className="text-2xl font-bold mt-2">3 contactos</div>
              <div className="text-sm text-gray-600 mt-2">Recibí 3 contactos de prueba al crear tu cuenta</div>
            </div>
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="font-semibold">Plan único</div>
              <div className="text-2xl font-bold mt-2">$5.000 / mes</div>
              <div className="text-sm text-gray-600 mt-2">Contactos ilimitados y prioridad en búsquedas</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-semibold">O tokens</div>
              <div className="text-2xl font-bold mt-2">Pack: 20 tokens</div>
              <div className="text-sm text-gray-600 mt-2">Compra packs si preferís pagar por contacto</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Registrarme como profesional</Link>
            <a href="mailto:ventas@arregalo.com?subject=Quiero ser profesional" className="text-gray-700 underline">Contactar ventas</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingProfesional;