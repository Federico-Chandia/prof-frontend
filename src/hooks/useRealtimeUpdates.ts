import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

interface RealtimeUpdate {
  entityType: string;
  entityId: string;
  evento: string;
  timestamp: Date;
  [key: string]: any;
}

type UpdateCallback = (data: RealtimeUpdate) => void;

export const useRealtimeUpdates = (onUpdate: UpdateCallback) => {
  const { token } = useAuth();
  const socketRef = useRef<Socket | null>(null);

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

    socket.on('connect', () => {
      console.log('[useRealtimeUpdates] Conectado a actualizaciones en tiempo real');
    });

    // Escuchar actualizaciones de entidades
    socket.on('entityUpdated', (data: RealtimeUpdate) => {
      console.log('[useRealtimeUpdates] Actualización recibida:', data);
      onUpdate(data);
    });

    socket.on('disconnect', () => {
      console.log('[useRealtimeUpdates] Desconectado de actualizaciones');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, onUpdate]);

  const subscribeToEntity = useCallback((entityType: string, entityId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('subscribeToUpdates', { entityType, entityId });
    }
  }, []);

  const unsubscribeFromEntity = useCallback((entityType: string, entityId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('unsubscribeFromUpdates', { entityType, entityId });
    }
  }, []);

  return {
    subscribeToEntity,
    unsubscribeFromEntity,
    socket: socketRef.current
  };
};

export default useRealtimeUpdates;
