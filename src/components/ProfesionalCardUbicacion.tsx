import React from 'react';
import { Link } from 'react-router-dom';
import { OficioConDistancia } from '../hooks/useBusquedaProfesionales';

interface ProfesionalCardUbicacionProps {
  profesional: OficioConDistancia;
  mostrarDistancia?: boolean;
}

const ProfesionalCardUbicacion: React.FC<ProfesionalCardUbicacionProps> = ({ 
  profesional, 
  mostrarDistancia = false 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              {profesional.usuario.nombre}
            </h3>
            <p className="text-blue-600 font-medium text-sm">
              {(profesional.tipoOficio || profesional.profesion)?.charAt(0).toUpperCase() + 
               (profesional.tipoOficio || profesional.profesion)?.slice(1)}
            </p>
          </div>
          {profesional.disponibilidad?.inmediata && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
              Disponible
            </span>
          )}
        </div>
        
        {mostrarDistancia && profesional.distancia && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 text-xs sm:text-sm">
            <span className="text-gray-600">📍 {profesional.distancia.toFixed(1)} km</span>
            {profesional.fastResponder && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Responde rápido
              </span>
            )}
            {profesional.cargoTraslado && profesional.cargoTraslado > 0 && (
              <span className="text-orange-600 font-medium">+${profesional.cargoTraslado} traslado</span>
            )}
          </div>
        )}
        
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {profesional.descripcion}
        </p>
        
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-xs sm:text-sm text-gray-600 ml-1">
              {profesional.rating?.toFixed(1) || '0.0'} ({profesional.totalReviews || 0})
            </span>
          </div>
          <div className="text-right">
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              ${profesional.tarifas?.porHora || 0}
            </span>
            <p className="text-xs text-gray-500">/hora</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {(profesional.zonasTrabajo || []).slice(0, 2).map((zona) => (
            <span
              key={zona}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {zona}
            </span>
          ))}
          {(profesional.zonasTrabajo || []).length > 2 && (
            <span className="text-xs text-gray-500">
              +{profesional.zonasTrabajo.length - 2}
            </span>
          )}
        </div>
        
        <Link
          to={`/oficios/${profesional._id}${window.location.search}`}
          onClick={() => import('../services/analytics').then(({ sendEvent }) => sendEvent('contactStarted', { profesionalId: profesional._id, tipo: profesional.tipoOficio }))}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-center block font-medium text-sm touch-manipulation"
        >
          💬 Contactar
        </Link>
      </div>
    </div>
  );
};

export default ProfesionalCardUbicacion;