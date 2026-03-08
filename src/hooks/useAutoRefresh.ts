import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface RefreshData {
  entityType: 'reservas' | 'solicitudes' | 'profesionales' | 'mensajes' | 'suscripciones';
  entityId?: string;
  filter?: any;
}

type DataRefreshCallback = (data: any) => void;

export const useAutoRefresh = () => {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const refreshCallbacksRef = useRef<Map<string, DataRefreshCallback[]>>(new Map());

  useEffect(() => {
    if (!token) return;

    const getSocketUrl = (): string => {
      if (import.meta.env.DEV) return window.location.origin;
      const envUrl = import.meta.env.VITE_SOCKET_URL;
      if (envUrl) return envUrl;
      return window.location.origin;
    };

    const socketUrl = getSocketUrl();
    
    const socket = io(socketUrl, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // Escuchar diferentes eventos de actualización
    socket.on('nuevaReserva', (data: any) => {
      console.log('[useAutoRefresh] Nueva reserva recibida');
      triggerRefresh('reservas');
    });

    socket.on('nuevaSolicitud', (data: any) => {
      console.log('[useAutoRefresh] Nueva solicitud recibida');
      triggerRefresh('solicitudes');
    });

    socket.on('reservaActualizada', (data: any) => {
      console.log('[useAutoRefresh] Reserva actualizada');
      triggerRefresh('reservas');
    });

    socket.on('solicitudActualizada', (data: any) => {
      console.log('[useAutoRefresh] Solicitud actualizada');
      triggerRefresh('solicitudes');
    });

    socket.on('pagoActualizado', (data: any) => {
      console.log('[useAutoRefresh] Pago actualizado');
      triggerRefresh('reservas');
    });

    socket.on('suscripcionActualizada', (data: any) => {
      console.log('[useAutoRefresh] Suscripción actualizada');
      triggerRefresh('suscripciones');
    });

    socket.on('entityUpdated', (data: any) => {
      console.log('[useAutoRefresh] Entidad actualizada:', data.entityType);
      const entityType = data.entityType as RefreshData['entityType'];
      if (['reservas', 'solicitudes', 'profesionales', 'mensajes', 'suscripciones'].includes(entityType)) {
        triggerRefresh(entityType);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const triggerRefresh = useCallback((entityType: string) => {
    const callbacks = refreshCallbacksRef.current.get(entityType) || [];
    callbacks.forEach(callback => {
      try {
        callback({});
      } catch (err) {
        console.error(`[useAutoRefresh] Error ejecutando callback para ${entityType}:`, err);
      }
    });
  }, []);

  const onDataUpdated = useCallback((entityType: RefreshData['entityType'], callback: DataRefreshCallback) => {
    if (!refreshCallbacksRef.current.has(entityType)) {
      refreshCallbacksRef.current.set(entityType, []);
    }
    refreshCallbacksRef.current.get(entityType)?.push(callback);

    // Retornar función para desuscribirse
    return () => {
      const callbacks = refreshCallbacksRef.current.get(entityType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }, []);

  // Función auxiliar para refrescar datos desde una URL
  const refreshDataFromAPI = useCallback(async (url: string) => {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('[useAutoRefresh] Error refrescando datos:', error);
      return null;
    }
  }, []);

  return {
    onDataUpdated,
    refreshDataFromAPI,
    socket: socketRef.current
  };
};

export default useAutoRefresh;
