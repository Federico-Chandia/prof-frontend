import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EmailConfirmed from './pages/EmailConfirmed';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Oficios from './pages/Oficios';
import MisTrabajos from './pages/MisTrabajos';
import MiPerfil from './pages/MiPerfil';
import MisReservas from './pages/MisReservas';
import DetalleOficio from './pages/DetalleOficio';
import PerfilCliente from './pages/PerfilCliente';
import AdminDashboard from './pages/AdminDashboard';
import SocketTest from './pages/SocketTest';
import DebugDashboard from './pages/DebugDashboard';
import LandingProfesional from './pages/LandingProfesional';
import SuscripcionExito from './pages/SuscripcionExito';
import SuscripcionError from './pages/SuscripcionError';
import SuscripcionPendiente from './pages/SuscripcionPendiente';
import ComprarSuscripcion from './components/ComprarSuscripcion';

// Componente para redirección automática según rol
const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Home />;
  }
  
  // Redirigir según el rol
  if (user.rol === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  if (user.rol === 'profesional') {
    return <Navigate to="/mis-trabajos" replace />;
  }
  
  if (user.rol === 'cliente') {
    return <Navigate to="/mis-reservas" replace />;
  }
  
  return <Home />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gray-50">
            <Header />
            <ToastContainer />
            <main className="pb-4 md:pb-0">
              <Routes>
              {/* Ruta principal con redirección automática */}
              <Route path="/" element={<RoleBasedRedirect />} />
              
              {/* DEBUG: Socket Test */}
              <Route path="/socket-test" element={<SocketTest />} />
              <Route path="/debug" element={<DebugDashboard />} />
              
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/email-confirmed" element={<EmailConfirmed />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              {/* Rutas de suscripción */}
              <Route path="/suscripcion" element={<ComprarSuscripcion />} />
              <Route path="/suscripcion/exito" element={<SuscripcionExito />} />
              <Route path="/suscripcion/error" element={<SuscripcionError />} />
              <Route path="/suscripcion/pendiente" element={<SuscripcionPendiente />} />
              
              {/* Landing para profesionales y alias */}
              <Route path="/landing/profesionales" element={<LandingProfesional />} />
              <Route path="/profesionales" element={<Navigate to="/landing/profesionales" replace />} />
              
              {/* Rutas públicas para búsqueda */}
              <Route path="/oficios" element={<Oficios />} />
              <Route path="/oficios/:id" element={<DetalleOficio />} />
              {/* Rutas protegidas para clientes */}
              <Route 
                path="/mis-reservas" 
                element={
                  <ProtectedRoute allowedRoles={['cliente']}>
                    <MisReservas />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute allowedRoles={['cliente']}>
                    <PerfilCliente />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas para profesionales */}
              <Route 
                path="/mis-trabajos" 
                element={
                  <ProtectedRoute allowedRoles={['profesional']}>
                    <MisTrabajos />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/mi-perfil" 
                element={
                  <ProtectedRoute allowedRoles={['profesional']}>
                    <MiPerfil />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas para administradores */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              </Routes>
            </main>
            <Footer />
          </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
