import React, { useState, useEffect } from 'react';

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'terminos' | 'privacidad' | 'cookies';
  onAccept?: (accepted: boolean) => void;
}

const LegalDocumentModal: React.FC<LegalDocumentModalProps> = ({
  isOpen,
  onClose,
  documentType,
  onAccept
}) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const docTitles = {
    terminos: 'Términos y Condiciones',
    privacidad: 'Política de Privacidad',
    cookies: 'Política de Cookies'
  };

  const docUrls = {
    terminos: '/api/legal/terminos-condiciones',
    privacidad: '/api/legal/privacidad',
    cookies: '/api/legal/cookies'
  };

  useEffect(() => {
    if (isOpen) {
      fetchDocument();
    }
  }, [isOpen, documentType]);

  const fetchDocument = async () => {
    setLoading(true);
    setAccepted(false);
    setHasScrolledToBottom(false);
    try {
      const response = await fetch(docUrls[documentType]);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        throw new Error('Respuesta vacía del servidor');
      }
      
      const data = JSON.parse(text);
      if (!data.contenido) {
        throw new Error('Contenido no disponible');
      }
      
      setContent(data.contenido);
    } catch (error) {
      console.error('Error fetching legal document:', error);
      setContent(`Error al cargar el documento: ${error instanceof Error ? error.message : 'Intenta nuevamente'}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const div = e.currentTarget;
    const isAtBottom = div.scrollHeight - div.scrollTop <= div.clientHeight + 10;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    setAccepted(true);
    if (onAccept) {
      onAccept(true);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {docTitles[documentType]}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Cerrar</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            onScroll={handleScroll}
            className="bg-gray-50 px-4 py-5 sm:p-6 max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {content}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
            <button
              onClick={handleAccept}
              disabled={!hasScrolledToBottom || loading}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!hasScrolledToBottom ? 'Desplázate hasta el final para aceptar' : 'Aceptar'}
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Rechazar
            </button>
          </div>

          {/* Scroll indicator */}
          {!hasScrolledToBottom && (
            <div className="bg-blue-50 px-4 py-3 text-center text-sm text-blue-800">
              Desplázate hacia abajo para leer el documento completo
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LegalDocumentModal;
