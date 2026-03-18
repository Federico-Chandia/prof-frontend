import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Reserva } from '../types';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import useAutoRefresh from '../hooks/useAutoRefresh';
import DisponibilidadToggle from '../components/DisponibilidadToggle';
import ChatModalV2 from '../components/ChatModalV2';

const MisTrabajos: React.FC = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTrabajos: 0,
    ingresosMes: 0,
    ratingPromedio: 0
  });
  const [chatOpen, setChatOpen] = useState<{ reservaId: string, otherUser: { id: string, name: string } } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const oficioIdRef = useRef<string | null>(null);
  const [completarModal, setCompletarModal] = useState<{ reserva: Reserva } | null>(null);
  const [notasFinalizacion, setNotasFinalizacion] = useState('');
  const [tokensInitialized, setTokensInitialized] = useState(false);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { onDataUpdated } = useAutoRefresh();

  const fetchEstadisticas = async () => {
    try {
      console.log('[MisTrabajos] Fetchando...');
      setLoading(true);

      // miOficio
      let miOficio = null;
      try {
        const res = await api.get('/oficios/mi-perfil');
        miOficio = res.data.oficio;
        oficioIdRef.current = miOficio?._id || null;
        console.log('[MisTrabajos] Oficio ID:', miOficio?._id);
      } catch (e) {
        console.log('[MisTrabajos] No oficio:', e);
      }

      // Reservas
      let reservasLocal = [];
      try {
        const res = await api.get('/reservas?tipo=profesional');
        reservasLocal = res.data || [];
        setReservas(reservasLocal);
        console.log('[MisTrabajos] Reservas:', reservasLocal.length);
      } catch (e) {
        console.log('[MisTrabajos] Error reservas:', e);
      }

      // Reviews
      let reviews = [];
      if (miOficio?._id) {
        try {
          const res = await api.get(`/reviews/oficio/${miOficio._id}`);
          reviews = res.data.reviews || [];
          console.log('[MisTrabajos] Reviews:', reviews.length);
        } catch (e) {
          console.log('[MisTrabajos] Error reviews:', e);
        }
      }

      // Stats
      const completados = reservasLocal.filter((r: Reserva) => r.estado === 'completada').length;
      const ahora = new Date();
      const ingresos = reservasLocal
        .filter((r: Reserva) => {
          if (r.estado !== 'completada') return false;
          const fecha = new Date(r.fechaHora || r.createdAt);
          if (isNaN(fecha.getTime())) return false;
          return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        })
        .reduce((total, r) => total + (r.costos?.importeReal || 0), 0);

      const rating = reviews.length > 0 
        ? reviews.reduce((sum: number, r: any) => sum + (r.puntuacion || 0), 0) / reviews.length 
        : 0;

      setStats({
        totalTrabajos: completados,
        ingresosMes: Math.round(ingresos),
        ratingPromedio: Math.round(rating * 10) / 10
      });
    } catch (error) {
      console.error('[MisTrabajos] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const inicializarTokens = async () => {
    try {
      const res = await api.post('/tokens/inicializar');
      if (res.data.tokens && user) updateUser({ ...user, tokens: res.data.tokens });
    } catch (e) {
      console.error('Tokens error:', e);
    }
  };

  const handleReservaAction = async (reservaId: string, action: 'aceptar' | 'rechazar' | 'iniciar') => {
    try {
      if (action === 'aceptar') {
        if ((user?.tokens?.disponibles ?? 0) <= 0) return;
        const res = await api.put(`/reservas/${reservaId}/estado`, { estado: 'en_progreso' });
        if (res.data.tokens && user) updateUser({ ...user, tokens: { ...user.tokens, disponibles: res.data.tokens.tokensRestantes } });
      } else if (action === 'rechazar') {
        await api.put(`/reservas/${reservaId}/estado`, { estado: 'cancelada' });
      } else if (action === 'iniciar') {
        await api.put(`/reservas/${reservaId}/estado`, { estado: 'en_progreso' });
      }
      await fetchEstadisticas();
    } catch (e: any) {
      if (e.response?.status === 403) {
        const res = await api.get('/auth/me');
        updateUser(res.data.user);
      }
    }
  };

  const marcarCompletado = async (reservaId: string, notas: string) => {
    try {
      await api.put(`/reservas/${reservaId}/marcar-completado`, { notasFinalizacion: notas });
      await fetchEstadisticas();
      setCompletarModal(null);
      setNotasFinalizacion('');
    } catch (e) {
      console.error('Error completado:', e);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, string> = {
      'orden_generada': 'bg-blue-100 text-blue-800',
      'en_progreso': 'bg-purple-100 text-purple-800',
      'pendiente_confirmacion': 'bg-amber-100 text-amber-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    const labels: Record<string, string> = {
      'orden_generada': 'Orden Generada',
      'en_progreso': 'En Progreso',
      'pendiente_confirmacion': 'Pendiente Confirmación',
      'completada': 'Finalizado',
      'cancelada': 'Cancelado'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badges[estado] || 'bg-gray-100 text-gray-800'}`}>
        {labels[estado] || estado}
      </span>
    );
  };

  const formatFecha = (fecha?: string | number | Date | null) => {
    if (!fecha) return 'No disponible';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return 'No disponible';
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getUbicacionSegura = (reserva: Reserva) => {
    if (reserva.estado === 'completada' || reserva.estado === 'cancelada') {
      return reserva.direccion.barrio;
    }
    return `${reserva.direccion.calle}, ${reserva.direccion.barrio}`;
  };

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetchEstadisticas();

    if (user.rol === 'profesional' && !tokensInitialized && (!user.tokens || user.tokens.disponibles === 0)) {
      inicializarTokens();
      setTokensInitialized(true);
    }
  }, [user, tokensInitialized]);

  useEffect(() => {
    const unsubscribe = onDataUpdated('reservas', () => {
      setTimeout(() => fetchEstadisticas(), 2000);
    });
    return unsubscribe;
  }, [onDataUpdated]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showNotifications && ! (e.target as Element).closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Trabajos</h1>
              <p className="text-gray-600 mt-2">Gestiona reservas e historial</p>
            </div>
            {user?.planActual !== 'premium' && (
              <Link to="/suscripcion" className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md">
                ⭐ Upgrade Premium
              </Link>
            )}
          </div>
        </div>

        {user?.rol === 'profesional' && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src="/Token.svg" alt="Token" className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Tokens</h3>
                  <p className="text-sm text-gray-600">Plan {user.tokens?.plan || 'basico'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{user.tokens?.disponibles || 0}</p>
                {(user.tokens?.disponibles ?? 0) <= 1 && <p className="text-xs text-orange-600">Bajos</p>}
              </div>
            </div>
            {(!user.tokens || user.tokens.disponibles <= 0) && (
              <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                ⚠️ Sin tokens. Renueva para aceptar trabajos.
              </div>
            )}
          </div>
        )}

        {oficioIdRef.current && (
          <div className="mb-6">
            <DisponibilidadToggle oficioId={oficioIdRef.current} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg"><span className="text-2xl">📊</span></div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Trabajos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTrabajos}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg"><span className="text-2xl">💰</span></div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ingresos Mes</p>
                <p className="text-2xl font-bold text-gray-900">${stats.ingresosMes.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg"><span className="text-2xl">⭐</span></div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Rating Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ratingPromedio}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Historial</h2>
          </div>
          {reservas.length === 0 ? (
            <div className="p-8 text-center"><p className="text-gray-500">No trabajos.</p></div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reservas.map(reserva => (
                <div key={reserva._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{reserva.cliente?.nombre || 'Cliente'}</h3>
                        {getEstadoBadge(reserva.estado)}
                      </div>
                      <p className="text-sm text-gray-500 mb-1">Descripción:</p>
                      <p className="text-gray-700 bg-gray-50 p-2 rounded text-sm">{reserva.descripcionTrabajo}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                        <span>📍 {getUbicacionSegura(reserva)}</span>
                        <span>📅 {formatFecha(reserva.fechaHora || reserva.createdAt)}</span>
                      </div>
                    </div>
                    {reserva.estado === 'completada' && reserva.costos?.importeReal && (
                      <div className="text-right">
                        <p className="text-lg font-semibold">${reserva.costos.importeReal.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{reserva.pago?.estado === 'pagado' ? '✅ Pagado' : ''}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    {(reserva.estado === 'orden_generada' || reserva.estado === 'pago_pendiente') && (
                      <>
                        <button
                          onClick={() => handleReservaAction(reserva._id, 'aceptar')}
                          disabled={(user?.tokens?.disponibles ?? 0) <= 0}
                          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                          title={(user?.tokens?.disponibles ?? 0) <= 0 ? 'Sin tokens' : '1 token'}
                        >
                          ✅ Aceptar {(user?.tokens?.disponibles ?? 0) <= 0 ? '(Sin tokens)' : '(1 token)'}
                        </button>
                        <button onClick={() => handleReservaAction(reserva._id, 'rechazar')} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">
                          ❌ Rechazar
                        </button>
                      </>
                    )}
                    {reserva.estado === 'pago_confirmado' && (
                      <button onClick={() => handleReservaAction(reserva._id, 'iniciar')} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                        🚀 Iniciar
                      </button>
                    )}
                    {reserva.estado === 'en_progreso' && (
                      <button onClick={() => setCompletarModal({ reserva })} className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700">
                        ✅ Completado
                      </button>
                    )}
                    {(['pago_confirmado', 'orden_generada', 'en_progreso', 'pendiente_confirmacion'].includes(reserva.estado as any) 
                      && !(reserva.estado === 'orden_generada' && (user?.tokens?.disponibles ?? 0) <= 0)) && (
                      <button
                        onClick={() => setChatOpen({
                          reservaId: reserva._id,
                          otherUser: { id: reserva.cliente?.id || '', name: reserva.cliente?.nombre || 'Cliente' }
                        })}
                        className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50"
                      >
                        💬 Chat
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {chatOpen && (
          <ChatModalV2 reservaId={chatOpen.reservaId} otherUser={chatOpen.otherUser} onClose={() => setChatOpen(null)} />
        )}

        {completarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Completado</h3>
              <p className="text-gray-600 mb-4">Notas:</p>
              <textarea
                value={notasFinalizacion}
                onChange={e => setNotasFinalizacion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
                rows={4}
                placeholder="Descripción del trabajo..."
              />
              <div className="flex gap-3">
                <button
                  onClick={() => marcarCompletado(completarModal.reserva._id, notasFinalizacion)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => {
                    setCompletarModal(null);
                    setNotasFinalizacion('');
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisTrabajos;

