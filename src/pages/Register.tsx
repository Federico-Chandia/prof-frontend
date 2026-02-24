import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    rol: 'cliente' as 'cliente' | 'profesional',
    direccion: {
      calle: '',
      barrio: '',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
    },
    genero: 'prefiero_no_decir' as 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir',
    preferenciaCliente: 'sin_preferencia' as 'sin_preferencia' | 'solo_mujeres' | 'solo_hombres',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados para aceptación de términos legales
  const [legalAcceptance, setLegalAcceptance] = useState({
    terminos: false,
    privacidad: false,
    cookies: false,
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  // Cargar aceptaciones de localStorage al montar el componente
  useEffect(() => {
    const savedAcceptance = localStorage.getItem('legalAcceptance');
    if (savedAcceptance) {
      try {
        const parsed = JSON.parse(savedAcceptance);
        setLegalAcceptance(prev => ({
          terminos: prev.terminos || parsed.terminos || false,
          privacidad: prev.privacidad || parsed.privacidad || false,
          cookies: prev.cookies || parsed.cookies || false,
        }));
      } catch (error) {
        console.error('Error parsing legal acceptance from localStorage:', error);
      }
    }

    // Escuchar mensajes desde pestaña abierta
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'LEGAL_DOCUMENT_ACCEPTED') {
        const docType = event.data.docType;
        setLegalAcceptance(prev => {
          const updated = { ...prev, [docType]: true };
          // Guardar en localStorage
          localStorage.setItem('legalAcceptance', JSON.stringify(updated));
          return updated;
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('direccion.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        direccion: {
          ...formData.direccion,
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateAddress = () => {
    if (!formData.direccion.calle.trim()) {
      return 'La dirección es requerida';
    }
    if (formData.direccion.calle.length < 5) {
      return 'La dirección debe tener al menos 5 caracteres';
    }
    if (!formData.direccion.barrio.trim()) {
      return 'El barrio es requerido';
    }
    return null;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = () => {
    if (formData.password !== formData.confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return null;
  };

  const validateLegalAcceptance = () => {
    if (!legalAcceptance.terminos) {
      return 'Debes aceptar los Términos y Condiciones';
    }
    if (!legalAcceptance.privacidad) {
      return 'Debes aceptar la Política de Privacidad';
    }
    if (!legalAcceptance.cookies) {
      return 'Debes aceptar la Política de Cookies';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(formData.email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const addressError = validateAddress();
    if (addressError) {
      setError(addressError);
      return;
    }

    const legalError = validateLegalAcceptance();
    if (legalError) {
      setError(legalError);
      return;
    }
    
    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const registerData = {
        ...dataToSend,
        aceptacionLegal: {
          terminosCondiciones: {
            aceptado: legalAcceptance.terminos,
            fechaAceptacion: new Date().toISOString(),
            version: '1.0'
          },
          politicaPrivacidad: {
            aceptado: legalAcceptance.privacidad,
            fechaAceptacion: new Date().toISOString(),
            version: '1.0'
          },
          politicaCookies: {
            aceptado: legalAcceptance.cookies,
            fechaAceptacion: new Date().toISOString(),
            version: '1.0'
          }
        }
      };

      await register(registerData);
      
      // Verificar si hay un redirect en la URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect');
      
      if (formData.rol === 'profesional') {
        navigate('/mi-perfil?onboarding=true');
      } else if (redirectTo) {
        // Si hay redirect, ir ahí
        navigate(decodeURIComponent(redirectTo));
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      let errorMessage = 'Error al crear la cuenta';
      
      if (err?.response?.data?.errors) {
        // Errores de validación
        errorMessage = err.response.data.errors.map((e: any) => e.msg).join(', ');
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  formData.email && !validateEmail(formData.email) ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formData.email && !validateEmail(formData.email) && (
                <p className="mt-1 text-xs text-red-600">Email inválido</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula y un número
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center mt-1"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden</p>
              )}
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                Tipo de Usuario
              </label>
              <select
                id="rol"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cliente">Cliente (busco servicios)</option>
                <option value="profesional">Profesional (ofrezco servicios)</option>
              </select>
            </div>

            <div>
              <label htmlFor="direccion.calle" className="block text-sm font-medium text-gray-700">
                Dirección *
              </label>
              <input
                id="direccion.calle"
                name="direccion.calle"
                type="text"
                required
                placeholder="Ej: Av. Corrientes 1234"
                value={formData.direccion.calle}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="direccion.barrio" className="block text-sm font-medium text-gray-700">
                  Localidad *
                </label>
                <input
                  id="direccion.barrio"
                  name="direccion.barrio"
                  type="text"
                  required
                  placeholder="Ej: Palermo"
                  value={formData.direccion.barrio}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="direccion.provincia" className="block text-sm font-medium text-gray-700">
                  Provincia
                </label>
                <select
                  id="direccion.provincia"
                  name="direccion.provincia"
                  value={formData.direccion.provincia}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Buenos Aires">Buenos Aires</option>
                  <option value="CABA">CABA</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Santa Fe">Santa Fe</option>
                  <option value="Mendoza">Mendoza</option>
                  <option value="Tucumán">Tucumán</option>
                  <option value="Entre Ríos">Entre Ríos</option>
                  <option value="Salta">Salta</option>
                  <option value="Misiones">Misiones</option>
                  <option value="Chaco">Chaco</option>
                  <option value="Corrientes">Corrientes</option>
                  <option value="Santiago del Estero">Santiago del Estero</option>
                  <option value="San Juan">San Juan</option>
                  <option value="Jujuy">Jujuy</option>
                  <option value="Río Negro">Río Negro</option>
                  <option value="Neuquén">Neuquén</option>
                  <option value="Formosa">Formosa</option>
                  <option value="Chubut">Chubut</option>
                  <option value="San Luis">San Luis</option>
                  <option value="Catamarca">Catamarca</option>
                  <option value="La Rioja">La Rioja</option>
                  <option value="La Pampa">La Pampa</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Tierra del Fuego">Tierra del Fuego</option>
                </select>
              </div>
            </div>

            {/* Preferencias de género (opcional) */}
            <div className="border-t pt-4 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Preferencias de comodidad (opcional)
                </p>
                <p className="text-xs text-blue-700">
                  {formData.rol === 'profesional' 
                    ? 'Algunos clientes pueden tener preferencias de género por comodidad personal. Esto no afecta tu visibilidad ni oportunidades: si un cliente prefiere otro perfil, simplemente no te aparecerá esa solicitud específica, pero seguís visible para todos los demás.'
                    : 'Sabemos que recibir a alguien en tu casa requiere confianza. Por eso, opcionalmente podés indicar si tenés preferencia sobre el género del profesional. Esto no afecta quién puede trabajar en nuestra plataforma, solo quién te aparece como opción disponible.'}
                </p>
              </div>

              <div>
                <label htmlFor="genero" className="block text-sm font-medium text-gray-700">
                  Tu género (opcional)
                </label>
                <select
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="prefiero_no_decir">Prefiero no decir</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              {formData.rol === 'profesional' && (
                <div>
                  <label htmlFor="preferenciaCliente" className="block text-sm font-medium text-gray-700">
                    ¿Deseas indicar alguna preferencia sobre tus clientes? (opcional)
                  </label>
                  <select
                    id="preferenciaCliente"
                    name="preferenciaCliente"
                    value={formData.preferenciaCliente}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="sin_preferencia">Sin preferencia</option>
                    <option value="solo_mujeres">Solo acepto clientes mujeres</option>
                    <option value="solo_hombres">Solo acepto clientes hombres</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Sección de Aceptación de Términos Legales */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Documentos Legales
            </h3>
            <p className="text-xs text-gray-600">
              Conforme a la Ley 25.326 de Protección de Datos Personales y legislación vigente de Buenos Aires, Argentina
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="terminos"
                  type="checkbox"
                  checked={legalAcceptance.terminos}
                  onChange={(e) => {
                    setLegalAcceptance({ ...legalAcceptance, terminos: e.target.checked });
                  }}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="terminos" className="ml-3 text-sm text-gray-700">
                  Acepto los{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
                      const url = apiUrl.replace('/api', '') + '/api/legal/view/terminos-condiciones';
                      window.open(url, '_blank', 'width=900,height=700,scrollbars=yes');
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500 underline"
                  >
                    Términos y Condiciones
                  </button>
                  {legalAcceptance.terminos && (
                    <span className="text-green-600 font-medium"> ✓ Aceptado</span>
                  )}
                </label>
              </div>

              {/* Política de Privacidad */}
              <div className="flex items-start">
                <input
                  id="privacidad"
                  type="checkbox"
                  checked={legalAcceptance.privacidad}
                  onChange={(e) => {
                    setLegalAcceptance({ ...legalAcceptance, privacidad: e.target.checked });
                  }}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="privacidad" className="ml-3 text-sm text-gray-700">
                  Acepto la{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
                      const url = apiUrl.replace('/api', '') + '/api/legal/view/privacidad';
                      window.open(url, '_blank', 'width=900,height=700,scrollbars=yes');
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500 underline"
                  >
                    Política de Privacidad
                  </button>
                  {legalAcceptance.privacidad && (
                    <span className="text-green-600 font-medium"> ✓ Aceptado</span>
                  )}
                </label>
              </div>

              {/* Política de Cookies */}
              <div className="flex items-start">
                <input
                  id="cookies"
                  type="checkbox"
                  checked={legalAcceptance.cookies}
                  onChange={(e) => {
                    setLegalAcceptance({ ...legalAcceptance, cookies: e.target.checked });
                  }}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="cookies" className="ml-3 text-sm text-gray-700">
                  Acepto la{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
                      const url = apiUrl.replace('/api', '') + '/api/legal/view/cookies';
                      window.open(url, '_blank', 'width=900,height=700,scrollbars=yes');
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500 underline"
                  >
                    Política de Cookies
                  </button>
                  {legalAcceptance.cookies && (
                    <span className="text-green-600 font-medium"> ✓ Aceptado</span>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;