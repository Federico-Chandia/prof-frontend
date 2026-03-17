import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) => {
  const { user, loading, token } = useAuth();

  // Si no hay token en absoluto, redirigir de inmediato sin esperar
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  // Hay token pero aún verificando con el backend — renderizar contenido optimistamente
  if (loading) {
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol del usuario
    const roleRedirects: Record<string, string> = {
      'cliente': '/mis-reservas',
      'profesional': '/mis-trabajos',
      'admin': '/admin'
    };
    
    const redirectPath = roleRedirects[user.rol] || '/';
    console.warn(`Usuario con rol '${user.rol}' intentó acceder a ruta restringida. Redirigiendo a: ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;