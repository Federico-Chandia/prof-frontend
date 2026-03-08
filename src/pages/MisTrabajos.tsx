import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Reserva } from '../types';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
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
  const [chatOpen, setChatOpen] = useState<{reservaId: string, otherUser: {id: string, name: string}} | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const oficioIdRef = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [completarModal, setCompletarModal] = useState<{reserva: Reserva} | null>(null);
  const [notasFinalizacion, setNotasFinalizacion] = useState('');
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (!user || !user.id) {
      console.log('[MisTrabajos] User no disponible');
      setLoading(false);
      return;
    }

    console.log('[MisTrabajos] Iniciando carga');
    
    const initializeComponent = async () => {
      setLoading(true);
      try {
        console.log('[MisTrabajos] Obteniendo oficios...');
        const oficiosResponse = await api.get('/oficios');
        const miOficio = oficiosResponse.data?.oficios?.find((o: any) => o.usuario?.id === user.id);
        
        if (miOficio) {
          console.log('[MisTrabajos] Oficio encontrado');
          oficioIdRef.current = miOficio._id;
          await fetchReservasAndStats(miOficio._id);
        } else {
          console.log('[MisTrabajos] Sin oficio, cargando sin stats de reviews');
          oficioIdRef.current = null;
          await fetchReservasAndStats(null);
        }
      } catch (error: any) {
        console.error('[MisTrabajos] Error:', error.message);
        oficioIdRef.current = null;
        await fetchReservasAndStats(null);
      }
    };

    initializeComponent();
    
    if (user?.rol === 'profesional' && (!user.tokens || user.tokens.disponibles === 0)) {
      inicializarTokens();
    }
  }, [user]);
  
  // Socket.IO para actualizaciones en tiempo real
  useEffect(() => {
    const { token } = useAuth.getState?.() || {};
    if (!token || !user) return;

    const socketUrl = import.meta.env.DEV ? window.location.origin : (import.meta.env.VITE_SOCKET_URL || window.location.origin);
    
    const socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[MisTrabajos] Socket conectado');
    });

    // Escuchar eventos de reservas
    socket.on('reservaActualizada', () => {
      console.log('[MisTrabajos] Reserva actualizada, recargando...');
      fetchReservasAndStats(oficioIdRef.current);
    });

    socket.on('nuevaReserva', () => {
      console.log('[MisTrabajos] Nueva reserva, recargando...');
      fetchReservasAndStats(oficioIdRef.current);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);
  
  const inicializarTokens = async () => {
    try {
      const response = await api.post('/tokens/inicializar');
      if (response.data.tokens && user) {
        const updatedUser = { ...user, tokens: response.data.tokens };
        updateUser(updatedUser);
      }
    } catch (error) {
      console.error('Error al inicializar tokens:', error);
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notifications-dropdown')) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const fetchReservasAndStats = async (fetchedOficioId: string | null) => {
    try {
      console.log('[MisTrabajos] Fetchando reservas...');
      
      const timeoutId = setTimeout(() => {
        console.error('[MisTrabajos] TIMEOUT después de 15s');
        setLoading(false);
      }, 15000);

      try {
        console.log('[MisTrabajos] GET /reservas?tipo=profesional...');
        const response = await api.get('/reservas?tipo=profesional');
        const reservasData = response.data;
        
        console.log('[MisTrabajos] Response recibido:', {
          status: response.status,
          type: typeof reservasData,
          isArray: Array.isArray(reservasData),
          length: Array.isArray(reservasData) ? reservasData.length : 'N/A',
          data: reservasData
        });
        
        const reservasArray = Array.isArray(reservasData) ? reservasData : [];
        console.log('[MisTrabajos] Reservas obtenidas:', reservasArray.length);
        
        setReservas(reservasArray);
        
        await recalcularEstadisticas(reservasArray, fetchedOficioId);
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error: any) {
      console.error('[MisTrabajos] Error fetch:', error.message);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const recalcularEstadisticas = async (reservasArray: Reserva[], fetchedOficioId: string | null) => {
    try {
      const trabajosCompletados = reservasArray.filter(r => r.estado === 'completada').length;
      const ahora = new Date();
      const ingresosMes = reservasArray
        .filter(r => {
          if (r.estado !== 'completada') return false;
          const fecha = new Date(r.fechaHora || r.createdAt || r.updatedAt);
          if (isNaN(fecha.getTime())) return false;
          return fecha.getMonth() === ahora.getMonth() && 
                 fecha.getFullYear() === ahora.getFullYear();
        })
        .reduce((total, r) => total + (r.costos?.importeReal || r.costos?.subtotal || 0), 0);

      let ratingPromedio = 0;
      if (fetchedOficioId) {
        try {
          const reviewsRes = await api.get(`/api/reviews/oficio/${fetchedOficioId}`);
          const reviews = reviewsRes.data.reviews || [];
          ratingPromedio = reviews.length > 0 
            ? reviews.reduce((sum, r) => sum + (r.puntuacion || 0), 0) / reviews.length 
            : 0;
        } catch (err) {
          console.log('[MisTrabajos] Error obteniendo reviews:', err);
        }
      }
      
      setStats({
        totalTrabajos: trabajosCompletados,
        ingresosMes: Math.round(ingresosMes),
        ratingPromedio: Math.round(ratingPromedio * 10) / 10
      });
    } catch (error) {
      console.error('[MisTrabajos] Error recalculando estadísticas:', error);
      setStats({ totalTrabajos: 0, ingresosMes: 0, ratingPromedio: 0 });
    }
  };

  const handleReservaAction = async (reservaId: string, action: 'aceptar' | 'rechazar' | 'iniciar') => {
    try {
      if (action === 'aceptar') {
        // Verificar tokens antes de aceptar
        if (user?.tokens && user.tokens.disponibles <= 0) {
          return;
        }
        
        // Para aceptar, cambiar estado y consumir token
        const response = await api.put(`/reservas/${reservaId}/estado`, {
          estado: 'en_progreso'
        });
        
        // Actualizar tokens desde la respuesta del backend
        if (response.data.tokens && user) {
          const updatedUser = { ...user, tokens: { ...user.tokens, disponibles: response.data.tokens.tokensRestantes } };
          updateUser(updatedUser);
        }
      } else if (action === 'rechazar') {
        await api.put(`/reservas/${reservaId}/estado`, {
          estado: 'cancelada'
        });
      } else if (action === 'iniciar') {
        await api.put(`/reservas/${reservaId}/estado`, {
          estado: 'en_progreso'
        });
      }
      
      // Actualizar la lista de reservas y estadísticas
      await fetchReservasAndStats(oficioIdRef.current);
    } catch (error: any) {
      // Manejo específico de errores de tokens
      if (error?.message?.includes('tokens') || error?.response?.status === 403) {
        // Refrescar información del usuario para sincronizar tokens
        try {
          const userResponse = await api.get('/auth/me');
          updateUser(userResponse.data.user);
        } catch (refreshError) {
          console.error('Error al refrescar usuario');
        }
      }
    }
  };

  const marcarCompletado = async (reservaId: string, notas: string) => {
    try {
      await api.put(`/reservas/${reservaId}/marcar-completado`, {
        notasFinalizacion: notas
      });
      
      await fetchReservasAndStats(oficioIdRef.current);
      setCompletarModal(null);
      setNotasFinalizacion('');
    } catch (error) {
      console.error('Error marcando como completado:', error);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const badges = {
      'orden_generada': 'bg-blue-100 text-blue-800',
      'en_progreso': 'bg-purple-100 text-purple-800',
      'pendiente_confirmacion': 'bg-amber-100 text-amber-800',
      'completada': 'bg-green-100 text-green-800',
      'cancelada': 'bg-red-100 text-red-800'
    };
    
    const labels = {
      'orden_generada': 'Orden Generada',
      'en_progreso': 'En Progreso',
      'pendiente_confirmacion': 'Esperando Confirmación',
      'completada': 'Finalizado',
      'cancelada': 'Cancelado'
    };

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badges[estado as keyof typeof badges]}`}>
        {labels[estado as keyof typeof labels]}
      </span>
    );
  };

  const formatFecha = (fecha?: string | number | Date | null) => {
    if (fecha === null || fecha === undefined) return 'Fecha no disponible';

    let d: Date;
    if (fecha instanceof Date) {
      d = fecha;
    } else if (typeof fecha === 'number') {
      d = new Date(fecha);
    } else {
      d = new Date(String(fecha));
      if (isNaN(d.getTime())) {
        // intentos adicionales (e.g. /Date(123456789)/)
        const m = String(fecha).match(/-?\d+/);
        if (m) d = new Date(Number(m[0]));
      }
    }

    if (!d || isNaN(d.getTime())) return 'Fecha no disponible';

    try {
      return d.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (err) {
      return d.toISOString().split('T')[0];
    }
  };

  const getUbicacionSegura = (reserva: Reserva) => {
    // Para trabajos finalizados y cancelados, solo mostrar barrio
    if (reserva.estado === 'completada' || reserva.estado === 'cancelada') {
      return reserva.direccion.barrio;
    }
    // Para trabajos activos, mostrar dirección completa
    return `${reserva.direccion.calle}, ${reserva.direccion.barrio}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">              
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mis Trabajos</h1>
                <p className="text-gray-600 mt-2">Gestiona tus reservas y revisa tu historial</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap">
              {/* Botón Comprar Suscripción */}
              {user?.planActual !== 'premium' && (
                <Link
                  to="/suscripcion"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-md whitespace-nowrap"
                >
                  ⭐ Upgrade Premium
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Información de Tokens */}
        {user?.rol === 'profesional' && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                <img src="/Token.svg" alt="Token" className="w-6 h-6 mr-3 inline-block" />
                <div>
                  <h3 className="font-semibold text-gray-900">Tokens Disponibles</h3>
                  <p className="text-sm text-gray-600">Plan {user.tokens?.plan || 'basico'} - Cada trabajo aceptado consume 1 token</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{user.tokens?.disponibles || 0}</p>
                {(user.tokens?.disponibles ) <= 1 && (
                  <p className="text-xs text-orange-600 font-medium">Tokens bajos</p>
                )}
              </div>
            </div>
            {(!user.tokens || user.tokens.disponibles <= 0) && (
              <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-700">
                ⚠️ Sin tokens disponibles. No podrás aceptar nuevos trabajos hasta renovar tu plan.
              </div>
            )}
          </div>
        )}

        {/* Toggle de Disponibilidad */}
        {oficioIdRef.current && (
          <div className="mb-6">
            <DisponibilidadToggle oficioId={oficioIdRef.current} />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Trabajos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTrabajos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ingresos del Mes</p>
                <p className="text-2xl font-bold text-gray-900">${stats.ingresosMes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Rating Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ratingPromedio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Trabajos */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Historial de Trabajos</h2>
          </div>
          
          {reservas.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No tienes trabajos registrados aún.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reservas.map((reserva) => (
                <div key={reserva._id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {reserva.cliente?.nombre || 'Cliente no disponible'}
                        </h3>
                        {getEstadoBadge(reserva.estado)}
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-1">Descripción del trabajo:</p>
                        <p className="text-gray-700 bg-gray-50 p-2 rounded text-sm">{reserva.descripcionTrabajo}</p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📍 {getUbicacionSegura(reserva)}</span>
                        <span>📅 {formatFecha(reserva.fechaHora || reserva.createdAt)}</span>
                      </div>

                      {/* Mostrar solicitud de corrección si existe */}
                      {reserva.solicitudCorreccion?.activa && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                          <p className="text-sm text-yellow-800">
                            <strong>Correcciones solicitadas:</strong> {reserva.solicitudCorreccion.descripcion}
                          </p>
                        </div>
                      )}

                      {/* Mostrar estado de confirmación */}
                      {reserva.estado === 'pendiente_confirmacion' && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            ✅ Trabajo marcado como completado. Esperando confirmación del cliente.
                          </p>
                          {reserva.confirmacion?.timeoutAutoConfirmacion && (
                            <p className="text-xs text-blue-600 mt-1">
                              Auto-confirmación: {new Date(reserva.confirmacion.timeoutAutoConfirmacion).toLocaleDateString('es-AR')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {reserva.estado === 'completada' && reserva.costos.importeReal && (
                        <>
                          <p className="text-lg font-semibold text-gray-900">
                            ${reserva.costos.importeReal.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {reserva.pago.estado === 'pagado' ? '✅ Pagado' : ''}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {(reserva.estado === 'orden_generada' || reserva.estado === 'pago_pendiente') && (
                      <>
                        <button 
                          onClick={() => handleReservaAction(reserva._id, 'aceptar')}
                          disabled={user?.tokens && user.tokens.disponibles <= 0}
                          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={user?.tokens && user.tokens.disponibles <= 0 ? 'Sin tokens disponibles' : 'Aceptar trabajo (consume 1 token)'}
                        >
                          ✅ Aceptar {user?.tokens && user.tokens.disponibles <= 0 ? '(Sin tokens)' : '(1 token)'}
                        </button>
                        <button 
                          onClick={() => handleReservaAction(reserva._id, 'rechazar')}
                          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                        >
                          ❌ Rechazar
                        </button>
                      </>
                    )}
                    
                    {reserva.estado === 'pago_confirmado' && (
                      <button 
                        onClick={() => handleReservaAction(reserva._id, 'iniciar')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                      >
                        🚀 Iniciar Trabajo
                      </button>
                    )}
                    
                    {reserva.estado === 'en_progreso' && (
                      <button 
                        onClick={() => setCompletarModal({reserva})}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700"
                      >
                        ✅ Marcar Completado
                      </button>
                    )}
                    
                    {['pago_confirmado', 'orden_generada', 'en_progreso', 'pendiente_confirmacion'].includes(reserva.estado) && (
                      <button 
                        onClick={() => setChatOpen({
                          reservaId: reserva._id,
                          otherUser: { id: reserva.cliente?._id || '', name: reserva.cliente?.nombre || 'Cliente' }
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
        
        {/* Chat Modal */}
        {chatOpen && (
          <ChatModalV2
            reservaId={chatOpen.reservaId}
            otherUser={chatOpen.otherUser}
            onClose={() => setChatOpen(null)}
          />
        )}

        {/* Modal de Completar Trabajo */}
        {completarModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Marcar Trabajo como Completado</h3>
              <p className="text-gray-600 mb-4">
                Agrega notas sobre el trabajo realizado (opcional):
              </p>
              <textarea
                value={notasFinalizacion}
                onChange={(e) => setNotasFinalizacion(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
                rows={4}
                placeholder="Describe el trabajo realizado, materiales utilizados, etc..."
              />
              <p className="text-sm text-gray-500 mb-4">
                El cliente recibirá una notificación para confirmar que el trabajo está completado satisfactoriamente.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => marcarCompletado(completarModal.reserva._id, notasFinalizacion)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
                >
                  Marcar Completado
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