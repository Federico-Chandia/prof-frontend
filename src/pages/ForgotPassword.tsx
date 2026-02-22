import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'code' | 'password'>('phone');
  const [telefono, setTelefono] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password-sms', { telefono });
      setMessage('Código enviado por SMS/WhatsApp');
      setStep('code');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al enviar código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/verify-reset-code', { telefono, codigo });
      setResetToken(response.data.resetToken);
      setMessage('Código verificado. Ingresa tu nueva contraseña');
      setStep('password');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Código inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);

    try {
      await api.post('/auth/reset-password-with-token', { 
        resetToken, 
        password 
      });
      setMessage('Contraseña actualizada exitosamente');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'phone' && 'Ingresa tu teléfono para recibir un código'}
            {step === 'code' && 'Ingresa el código que recibiste'}
            {step === 'password' && 'Ingresa tu nueva contraseña'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            {message}
          </div>
        )}

        {step === 'phone' && (
          <form className="mt-8 space-y-6" onSubmit={handleSendCode}>
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: +54 9 11 1234-5678"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Recibirás un código de 6 dígitos por SMS/WhatsApp
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Código'}
            </button>
            
            <div className="text-center">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Volver al login
              </Link>
            </div>
          </form>
        )}

        {step === 'code' && (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyCode}>
            <div>
              <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
                Código de Verificación
              </label>
              <input
                id="codigo"
                name="codigo"
                type="text"
                required
                maxLength={6}
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-center text-2xl tracking-widest focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || codigo.length !== 6}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar Código'}
            </button>
            
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-sm text-gray-600 hover:text-gray-800"
            >
              ← Volver
            </button>
          </form>
        )}

        {step === 'password' && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;