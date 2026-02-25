import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const supportEmail = 'Soporte.profesionales@outlook.com';
  const emailSubject = 'Solicitud de Restablecimiento de Contraseña';
  const emailBody = `Hola,\n\nSolicito el restablecimiento de mi contraseña.\n\nNombre de usuario: ${formData.username}\nEmail registrado: ${formData.email}\n\nGracias.`;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-green-600 text-4xl">✉️</div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Solicitud Registrada
            </h2>
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4 text-left">
              <p className="text-sm text-gray-700 mb-3">
                Para restablecer tu contraseña, envía un email a:
              </p>
              <a 
                href={`mailto:${supportEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
                className="block bg-blue-600 text-white text-center px-4 py-3 rounded-md hover:bg-blue-700 font-medium mb-3"
              >
                {supportEmail}
              </a>
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Incluye en tu email:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Nombre de usuario: <span className="font-medium">{formData.username}</span></li>
                  <li>Email registrado: <span className="font-medium">{formData.email}</span></li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Nuestro equipo procesará tu solicitud y te contactará a la brevedad.
            </p>
            <div className="mt-6">
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Volver al login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa tus datos para solicitar el restablecimiento
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Nombre de Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tu nombre de usuario"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Registrado
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-xs text-gray-600">
              📧 Deberás enviar un email a soporte con estos datos para restablecer tu contraseña.
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continuar
          </button>
          
          <div className="text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Volver al login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;