import React, { useState } from 'react';
import { X, Zap, ChevronRight } from 'lucide-react';
import TokenExplanation from './TokenExplanation';

interface TokenBalanceCardProps {
  tokens: number;
  onBuyTokens?: () => void;
  showModal?: boolean;
  onCloseModal?: () => void;
}

const TokenBalanceCard: React.FC<TokenBalanceCardProps> = ({
  tokens = 0,
  onBuyTokens,
  showModal = false,
  onCloseModal
}) => {
  const [showExplanation, setShowExplanation] = useState(showModal);

  const getTokenStatus = (amount: number) => {
    if (amount === 0) return { color: 'text-red-600', bgColor: 'bg-red-50', status: 'Sin tokens' };
    if (amount < 5) return { color: 'text-orange-600', bgColor: 'bg-orange-50', status: 'Bajo' };
    if (amount < 10) return { color: 'text-yellow-600', bgColor: 'bg-yellow-50', status: 'Moderado' };
    return { color: 'text-green-600', bgColor: 'bg-green-50', status: 'Bueno' };
  };

  const status = getTokenStatus(tokens);

  return (
    <>
      {/* Card principal */}
      <div className={`rounded-lg p-4 sm:p-6 border border-amber-200 ${status.bgColor} transition-all`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="bg-amber-100 p-2 rounded-lg flex-shrink-0">
              <Zap className="text-amber-600" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Tokens disponibles
              </p>
              <p className={`text-3xl font-bold ${status.color} mt-1`}>
                {tokens}
              </p>
              <p className={`text-xs font-semibold ${status.color} mt-2`}>
                Estado: {status.status}
              </p>
            </div>
          </div>

          {/* Badges de acciones rápidas */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowExplanation(true)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline px-2 py-1 rounded hover:bg-amber-100 transition-all"
            >
              ¿Qué son?
            </button>
            {onBuyTokens && tokens < 5 && (
              <button
                onClick={onBuyTokens}
                className="text-xs font-bold bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-all flex items-center gap-1"
              >
                Comprar
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Info adicional */}
        <div className="mt-4 pt-4 border-t border-amber-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-600">Próxima recarga:</p>
              <p className="font-semibold text-gray-900">En 14 días</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Plan actual:</p>
              <p className="font-semibold text-gray-900">Profesional</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        {tokens < 3 && (
          <div className="mt-4 bg-white bg-opacity-60 rounded p-3 text-xs text-amber-900">
            💡 Se te están acabando los tokens. Recarga pronto para no perder oportunidades.
          </div>
        )}
      </div>

      {/* Modal */}
      {showExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto w-full">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-end">
              <button
                onClick={() => {
                  setShowExplanation(false);
                  onCloseModal?.();
                }}
                className="text-gray-600 hover:text-gray-900 p-1"
              >
                <X size={24} />
              </button>
            </div>
            <TokenExplanation userTokens={tokens} compact={false} onClose={() => {
              setShowExplanation(false);
              onCloseModal?.();
            }} />
          </div>
        </div>
      )}
    </>
  );
};

export default TokenBalanceCard;
