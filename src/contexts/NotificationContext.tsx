import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
    if (!token || !user) return;

    const syncNotificationsFromBackend = async () => {
      try {
        console.log('[NotificationContext] Sincronizando notificaciones desde BD');
        const response = await api.get('/notifications?limit=100');
        if (response.data?.data?.notifications) {
          const backendNotifications = response.data.data.notifications.map((n: any) => ({
            id: n._id,
            tipo: n.tipo,
            titulo: n.titulo,
            mensaje: n.mensaje,
            leida: n.leida,
            fechaCreacion: n.fecha || n.createdAt,
            reservaId: n.referencia?.reservaId,
            chatId: n.referencia?.mensajeId,
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
  }, [token, user]);

  // Conectar Socket.IO para recibir notificaciones en tiempo real
  useEffect(() => {
    // En desarrollo, usar ruta relativa para que funcione el proxy de Vite
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
      transports: ['websocket', 'polling'] // Permitir fallback a polling
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[notifications] socket conectado', socket.id);
    });

    socket.on('notify', (payload: any) => {
      try {
        // Usar type de la notificación desde el backend
        const tipo = payload.data?.tipo || 'otro';
        const nueva = {
          tipo,
          titulo: payload.title || 'Notificación',
          mensaje: payload.body || '',
          reservaId: payload.data?.reference?.reservaId?.toString?.() || undefined,
          chatId: payload.data?.reference?.mensajeId?.toString?.() || undefined,
          url: payload.url || undefined,
          icon: payload.icon || undefined,
          actions: payload.actions || undefined
        } as Omit<Notification, 'id' | 'fechaCreacion' | 'leida'>;
        const created = addNotification(nueva);

        // Mostrar notificación del navegador si está permitido
        if (browserNotifications.permission === 'granted') {
          const notif = browserNotifications.showNotification(created.titulo, {
            body: created.mensaje,
            icon: created.icon || '/favicon.ico',
            tag: created.id,
            data: { url: created.url },
            actions: created.actions as NotificationAction[] | undefined
          });

          try {
            if (notif) {
              notif.onclick = (ev: any) => {
                // Marcar como leída en la UI y navegar
                markAsRead(created.id);
                if (created.url) {
                  try { window.focus(); } catch (e) {}
                  try { window.location.href = created.url; } catch (e) { console.warn(e); }
                }
                try { notif.close(); } catch (e) {}
              };
              notif.onclose = () => {
                // No eliminar la notificación de la lista: persistirla
              };
            }
          } catch (err) {
            console.warn('Error attaching notification handlers', err);
          }
        }

        // Guardar en BD para persistencia
        try {
          api.post('/notifications', { notification: nueva }).catch(e => console.debug('Error guardando notificación:', e));
        } catch (err) {
          console.debug('[NotificationContext] Error guardando notificación en BD:', err);
        }
      } catch (err) {
        console.warn('Error procesando notify:', err);
      }
    });

    socket.on('unreadCount', (data: any) => {
      // Opcional: podríamos sincronizar con backend si queremos
      console.log('[notifications] unreadCount', data);
    });

    socket.on('disconnect', (reason: any) => {
      console.log('[notifications] socket desconectado', reason);
      socketRef.current = null;
    });

    return () => {
      try { socket.disconnect(); } catch (e) {}
      socketRef.current = null;
    };
  }, [token]);

  const unreadCount = notifications.filter(n => !n.leida).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'fechaCreacion' | 'leida'>) => {
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
    // Actualizar en BD sin bloquear
    api.patch(`/notifications/${id}/read`).catch(e => console.debug('Error marcando como leída:', e));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, leida: true }))
    );
    // Actualizar en BD sin bloquear
    api.patch('/notifications/read-all').catch(e => console.debug('Error marcando todas como leídas:', e));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    // Eliminar en BD sin bloquear
    api.delete(`/notifications/${id}`).catch(e => console.debug('Error eliminando notificación:', e));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    // Eliminar todas en BD sin bloquear
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
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};