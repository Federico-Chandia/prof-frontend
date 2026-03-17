import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Notification, NotificationContextType } from '../types/notification';
import { useAuth } from '../context/AuthContext';
import { useNotifications as useBrowserNotifications } from '../hooks/useNotifications';
import api from '../services/api';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const { token, user } = useAuth();
  const browserNotifications = useBrowserNotifications();

  // Sincronizar notificaciones desde BD al iniciar sesión
  useEffect(() => {
    if (!token) return;

    const syncNotificationsFromBackend = async () => {
      try {
        console.log('[NotificationContext] Sincronizando notificaciones desde BD');
        const response = await api.get('/notifications?limit=100');
        if (response.data?.data?.notifications) {
          const backendNotifications = response.data.data.notifications.map((n: any) => ({
            id: n._id.toString(),  // Asegurar que sea string
            tipo: n.tipo,
            titulo: n.titulo,
            mensaje: n.mensaje,
            leida: n.leida,
            fechaCreacion: n.fecha || n.createdAt,
            reservaId: n.referencia?.reservaId?.toString?.(),
            chatId: n.referencia?.mensajeId?.toString?.(),
            url: n.url,
            icon: n.icono,
          } as Notification));
          
          setNotifications(backendNotifications);
          console.log('[NotificationContext] Notificaciones sincronizadas:', backendNotifications.length);
        }
      } catch (err) {
        console.warn('[NotificationContext] Error sincronizando notificaciones:', err);
      }
    };

    syncNotificationsFromBackend();
  }, [token]);

  // Conectar Socket.IO para recibir notificaciones en tiempo real
  useEffect(() => {
    const getSocketUrl = (): string => {
      if (import.meta.env.DEV) return window.location.origin;
      const envUrl = import.meta.env.VITE_SOCKET_URL;
      if (envUrl) return envUrl;
      return window.location.origin;
    };

    const socketUrl = getSocketUrl();
    
    if (!token) return;

    console.log('[NotificationContext] Conectando Socket.IO a:', socketUrl);

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
      console.log('[notifications] socket conectado', socket.id);
    });

    // ✅ FIX: Escuchar 'notify' (evento del backend)
    socket.on('notify', (payload: any) => {
      try {
        console.log('[notifications] Recibida notificación:', payload);
        
        const newNotification: Notification = {
          id: payload.id,  // ✅ Usar ID del backend
          tipo: payload.data?.tipo || payload.tipo || 'otro',
          titulo: payload.title || payload.titulo || 'Notificación',
          mensaje: payload.body || payload.mensaje || '',
          leida: false,
          fechaCreacion: payload.timestamp || new Date().toISOString(),
          reservaId: payload.data?.reference?.reservaId?.toString?.() || payload.data?.referencia?.reservaId?.toString?.(),
          chatId: payload.data?.reference?.mensajeId?.toString?.() || payload.data?.referencia?.mensajeId?.toString?.(),
          url: payload.url,
          icon: payload.icon || payload.icono,
        };

        // Agregar a la lista
        setNotifications(prev => [newNotification, ...prev]);

        // Mostrar notificación del navegador si está permitido
        if (browserNotifications.permission === 'granted') {
          const notif = browserNotifications.showNotification(newNotification.titulo, {
            body: newNotification.mensaje,
            icon: newNotification.icon || '/favicon.ico',
            tag: newNotification.id,
            data: { url: newNotification.url },
          });

          if (notif) {
            notif.onclick = () => {
              markAsRead(newNotification.id);
              if (newNotification.url) {
                window.focus();
                window.location.href = newNotification.url;
              }
              notif.close();
            };
          }
        }

        // ❌ ELIMINADO: No guardar en BD, ya viene guardada del backend
      } catch (err) {
        console.error('Error procesando new_notification:', err);
      }
    });

    socket.on('disconnect', (reason: any) => {
      console.log('[notifications] socket desconectado', reason);
      socketRef.current = null;
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const unreadCount = notifications.filter(n => !n.leida).length;

  const fetchNotifications = useCallback(async () => {
    try {
      console.log('[NotificationContext] Fetching notifications...');
      const response = await api.get('/notifications?limit=50');
      if (response.data?.data?.notifications) {
        const fetchedNotifications = response.data.data.notifications
          .map((n: any) => ({
            id: n._id.toString(),
            tipo: n.tipo,
            titulo: n.titulo,
            mensaje: n.mensaje,
            leida: n.leida,
            fechaCreacion: n.fecha || n.createdAt,
            reservaId: n.referencia?.reservaId?.toString?.(),
            chatId: n.referencia?.mensajeId?.toString?.(),
            url: n.url,
            icon: n.icono,
          } as Notification))
          .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
        setNotifications(fetchedNotifications);
        console.log('[NotificationContext] Fetched', fetchedNotifications.length, 'notifications');
      }
    } catch (err) {
      console.warn('[NotificationContext] Fetch notifications failed:', err);
    }
  }, []);


  const addNotification = (notificationData: Omit<Notification, 'id' | 'fechaCreacion' | 'leida'>) => {
    // Esta función solo se usa para notificaciones locales (no del backend)
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      fechaCreacion: new Date().toISOString(),
      leida: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
    api.patch(`/notifications/${id}/read`).catch(e => console.debug('Error marcando como leída:', e));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, leida: true }))
    );
    api.patch('/notifications/read-all').catch(e => console.debug('Error marcando todas como leídas:', e));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    api.delete(`/notifications/${id}`).catch(e => console.debug('Error eliminando notificación:', e));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    api.delete('/notifications').catch(e => console.debug('Error eliminando todas las notificaciones:', e));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      removeNotification,
      clearAllNotifications,
      fetchNotifications
    }}>

      {children}
    </NotificationContext.Provider>
  );
};