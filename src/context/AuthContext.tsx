import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import api from '../services/api';
import { clearCsrfToken } from '../services/csrf';


interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const getInitialToken = () => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  user: null,
  token: getInitialToken(),
  loading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Reemplazar el useEffect de verificación periódica (líneas 75-96) con esto:

useEffect(() => {
  if (!state.user || !state.token) return;

  const checkTokenVersion = async () => {
    try {
      const response = await api.get('/auth/me');
      const latestUser = response.data.user;
      const currentTokenVersion = state.user?.tokenVersion || 0;
      const latestTokenVersion = latestUser?.tokenVersion || 0;

      if (latestTokenVersion !== currentTokenVersion) {
        console.log('[AuthContext] Token version cambió, actualizando usuario');
        const normalizedUser = {
          ...latestUser,
          id: latestUser.id || latestUser._id || latestUser._id?.toString?.(),
        };
        dispatch({ type: 'UPDATE_USER', payload: normalizedUser });
      }
    } catch (error) {
      console.debug('[AuthContext] Error verificando token version:', error);
    }
  };

  // Ejecutar inmediatamente y luego cada 5 minutos (no 30 segundos)
  checkTokenVersion();
  const interval = setInterval(checkTokenVersion, 300000); // 5 minutos = 300000ms
  
  return () => clearInterval(interval);
}, [state.token]); // Solo depende de token, no de user completo


  // Verificar periódicamente si el rol o datos críticos han cambiado (ej: desde admin)
  useEffect(() => {
    if (!state.user || !state.token) return;

    const checkTokenVersion = async () => {
      try {
        const response = await api.get('/auth/me');
        const latestUser = response.data.user;
        const currentTokenVersion = state.user?.tokenVersion || 0;
        const latestTokenVersion = latestUser?.tokenVersion || 0;

        // Si el tokenVersion cambió, actualizar el usuario
        if (latestTokenVersion !== currentTokenVersion) {
          console.log('[AuthContext] Token version cambió, actualizando usuario');
          const normalizedUser = {
            ...latestUser,
            id: latestUser.id || latestUser._id || latestUser._id?.toString?.(),
          };
          dispatch({ type: 'UPDATE_USER', payload: normalizedUser });
        }
      } catch (error) {
        // Silenciar errores en verificación periódica
        console.debug('[AuthContext] Error verificando token version:', error);
      }
    };

    // Ejecutar verificación cada 30 segundos
    const interval = setInterval(checkTokenVersion, 30000);
    return () => clearInterval(interval);
  }, [state.user, state.token]);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await api.post('/auth/login', { email, password });
      const { user: rawUser, token } = response.data;

      if (!rawUser || !token) {
        throw new Error('Respuesta inválida del servidor');
      }

      const user = {
        ...rawUser,
        id: rawUser.id || rawUser._id || rawUser._id?.toString?.(),
      };

      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
      

    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const message = error.message || error.response?.data?.message || 'Error al iniciar sesión';
      throw new Error(message);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Basic client-side validation
      if (!userData.email || !userData.password || !userData.nombre) {
        throw new Error('Todos los campos obligatorios deben estar completos');
      }
      
      if (userData.password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }
      
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
        throw new Error('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
      }
      
      const response = await api.post('/auth/register', userData);
      const { user: rawUser, token } = response.data;

      if (!rawUser || !token) {
        throw new Error('Respuesta inválida del servidor');
      }

      const user = {
        ...rawUser,
        id: rawUser.id || rawUser._id || rawUser._id?.toString?.(),
      };

      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
      

    } catch (error: any) {
      dispatch({ type: 'SET_LOADING', payload: false });
      const message = error.message || error.response?.data?.message || 'Error al registrarse';
      throw new Error(message);
    }
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearCsrfToken();

    dispatch({ type: 'LOGOUT' });
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    login,
    register,
    logout,
    updateUser,
    loading: state.loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto de autenticación
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { useAuth };