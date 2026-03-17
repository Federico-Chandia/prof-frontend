import React, { lazy, Suspense } from 'react';
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

// Lazy load de páginas
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const EmailConfirmed = lazy(() => import('./pages/EmailConfirmed'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Oficios = lazy(() => import('./pages/Oficios'));
const MisTrabajos = lazy(() => import('./pages/MisTrabajos'));
const MiPerfil = lazy(() => import('./pages/MiPerfil'));
const MisReservas = lazy(() => import('./pages/MisReservas'));
const DetalleOficio = lazy(() => import('./pages/DetalleOficio'));
const PerfilCliente = lazy(() => import('./pages/PerfilCliente'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SocketTest = lazy(() => import('./pages/SocketTest'));
const DebugDashboard = lazy(() => import('./pages/DebugDashboard'));
const LandingProfesional = lazy(() => import('./pages/LandingProfesional'));
const SuscripcionExito = lazy(() => import('./pages/SuscripcionExito'));
const SuscripcionError = lazy(() => import('./pages/SuscripcionError'));
const SuscripcionPendiente = lazy(() => import('./pages/SuscripcionPendiente'));
const ComprarSuscripcion = lazy(() => import('./components/ComprarSuscripcion'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
);

// Componente para redirección automática según rol
const RoleBasedRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Mostrar Home mientras carga (sin bloquear con spinner)
  if (loading || !user) {
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
              <Suspense fallback={<LoadingFallback />}>
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
              </Suspense>
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
