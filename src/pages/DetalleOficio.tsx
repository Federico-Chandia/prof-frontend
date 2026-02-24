import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Oficio } from '../types';
import ReservaModal from '../components/ReservaModal';
import { useAuth } from '../context/AuthContext';

const DetalleOficio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qParam = searchParams.get('q') || '';
  const { user } = useAuth();
  const [oficio, setOficio] = useState<Oficio | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReservaModal, setShowReservaModal] = useState(false);
  const initialDescripcion = qParam ? `Hola, tengo un problema: "${qParam}". Estoy en ${user?.direccion?.barrio || '[zona]'}. ¿Podés ayudarme?` : `Hola, tengo un problema de ${oficio?.tipoOficio || 'este servicio'} en mi casa. Estoy en ${user?.direccion?.barrio || '[zona]'}.
¿Podés ayudarme?`;

  useEffect(() => {
    if (id) {
      fetchOficio(id);
    }
  }, [id]);

  const fetchOficio = async (oficioId: string) => {
    try {
      const response = await api.get(`/oficios/${oficioId}`);
      setOficio(response.data.oficio);
    } catch (error) {
      console.error('Error fetching oficio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservarClick = () => {
    if (!user) {
      const currentUrl = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }
    setShowReservaModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!oficio) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oficio no encontrado</h2>
          <p className="text-gray-600">El profesional que buscas no existe o no está disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              {oficio.usuario.avatar ? (
                <img src={oficio.usuario.avatar} alt={oficio.usuario.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                  👤
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{oficio.usuario.nombre}</h1>
              <p className="text-xl text-blue-600 capitalize mb-2">{oficio.tipoOficio}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>⭐ {oficio.rating} ({oficio.totalReviews} reseñas)</span>
                <span>🔧 {oficio.trabajosCompletados} trabajos completados</span>
                <span>📅 {oficio.experiencia} años de experiencia</span>
              </div>
            </div>
            
            <div className="flex-shrink-0">
              <button
                onClick={handleReservarClick}
                className="w-full sm:w-auto bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 whitespace-nowrap"
              >
                {user ? 'Reservar Servicio' : 'Iniciar Sesión para Contactar'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Descripción</h2>
                <p className="text-gray-700">{oficio.descripcion}</p>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Tarifas aproximadas</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">${oficio.tarifas.porHora}</p>
                    <p className="text-sm text-gray-600">Obra general</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">${oficio.tarifas.visitaTecnica}</p>
                    <p className="text-sm text-gray-600">Visita Técnica</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-red-600">${oficio.tarifas.emergencia}</p>
                    <p className="text-sm text-gray-600">Emergencia</p>
                    
                  </div>
                </div>
              </div>
              
              {oficio.fotos && oficio.fotos.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {oficio.fotos.map((foto, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img src={foto} alt={`Trabajo ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {oficio.ultimasReviews && oficio.ultimasReviews.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Últimas Reseñas</h2>
                  <div className="space-y-4">
                    {oficio.ultimasReviews.map((review) => (
                      <div key={review._id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{review.cliente?.nombre || 'Cliente'}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`${i < review.puntuacion ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        {review.comentario && (
                          <p className="text-gray-600 text-sm">{review.comentario}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold mb-4">Zonas de Trabajo</h3>
                <div className="space-y-1">
                  {oficio.zonasTrabajo.map((zona, index) => (
                    <p key={index} className="text-sm text-gray-600">📍 {zona}</p>
                  ))}
                </div>
              </div>
              
             
            </div>
          </div>
        </div>
      </div>
      
      {oficio && user && (
        <ReservaModal
          oficio={oficio}
          isOpen={showReservaModal}
          initialDescripcion={qParam ? initialDescripcion : undefined}
          onClose={() => setShowReservaModal(false)}
          onSuccess={() => {
            setTimeout(() => {
              navigate('/mis-reservas');
            }, 1500);
          }}
        />
      )}
    </div>
  );
};

export default DetalleOficio;