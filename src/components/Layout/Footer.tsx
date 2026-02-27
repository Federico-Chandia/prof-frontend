import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12 sm:mt-16">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Profesionales</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4">
              Conecta con profesionales verificados en tu zona. Rápido, seguro y confiable.
            </p>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Twitter">
                𝕏
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                f
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Instagram">
                📷
              </a>
            </div>
          </div>

          {/* Para Clientes */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-4">Para Clientes</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#problem-input" className="text-gray-400 hover:text-white transition-colors">
                  Buscar Profesional
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="text-gray-400 hover:text-white transition-colors">
                  Cómo Funciona
                </a>
              </li>
              <li>
                <a href="#testimonios" className="text-gray-400 hover:text-white transition-colors">
                  Testimonios
                </a>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
            </ul>
          </div>

          {/* Para Profesionales */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-4">Para Profesionales</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white transition-colors">
                  Registrarse
                </Link>
              </li>
              <li>
                <a href="#planes" className="text-gray-400 hover:text-white transition-colors">
                  Planes y Precios
                </a>
              </li>
              <li>
                <a href="mailto:soporte@profesionales.local" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="/legal/terminos-y-condiciones" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="/legal/politica-de-privacidad" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="/legal/aviso-de-cookies" className="text-gray-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                  Aviso de Cookies
                </a>
              </li>
              <li>
                <a href="mailto:legal@profesionales.local" className="text-gray-400 hover:text-white transition-colors">
                  Reportar Abuso
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Newsletter */}
          <div className="mb-8 max-w-sm">
            <h4 className="text-sm font-semibold text-white mb-3">Suscribite a Novedades</h4>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-3 py-2 text-sm bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Suscribir
              </button>
            </form>
          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500">
            <p>&copy; {currentYear} Profesionales. Todos los derechos reservados.</p>
            <p>Hecho con ❤️ en Argentina</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
