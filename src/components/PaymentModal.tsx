import React, { useState } from 'react';
import { Button } from './ui/button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
  price?: number; // Prix en euros
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onProceedToPayment, price = 18 }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = async () => {
    setIsLoading(true);
    
    try {
      await onProceedToPayment();
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="rounded-2xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto p-4 sm:p-6 md:p-8 transform transition-all" style={{ background: '#F9F8F4' }}>
        <div className="text-center mb-4 sm:mb-6">
          <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4">🚀</div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 mb-2 sm:mb-3 leading-tight">
            Débloquez votre profil complet
          </h2>
          
          {/* Prix en évidence */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xl sm:text-2xl font-bold mb-3 sm:mb-4 shadow-lg">
            <span>💎</span>
            <span>{price.toFixed(2)} €</span>
          </div>
        </div>

        {/* Ce que vous obtenez */}
        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-5 md:mb-6">
          <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">✨ Vous obtenez :</h3>
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl flex-shrink-0">✅</span>
              <p className="text-gray-700 text-xs sm:text-sm leading-snug">
                <strong>Votre profil RIASEC complet</strong> avec analyse détaillée
              </p>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl flex-shrink-0">✅</span>
              <p className="text-gray-700 text-xs sm:text-sm leading-snug">
                <strong>Suggestions de métiers personnalisées</strong> qui vous correspondent
              </p>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl flex-shrink-0">✅</span>
              <p className="text-gray-700 text-xs sm:text-sm leading-snug">
                <strong>Recommandations de formations</strong> adaptées à vos objectifs
              </p>
            </div>
            <div className="flex items-start gap-2 sm:gap-3">
              <span className="text-lg sm:text-xl flex-shrink-0">✅</span>
              <p className="text-gray-700 text-xs sm:text-sm leading-snug">
                <strong>Plan d'action personnalisé</strong> pour concrétiser votre orientation
              </p>
            </div>
          </div>
        </div>

        {/* Éléments de réassurance */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center gap-2 mb-1 sm:mb-2">
            <span className="text-lg sm:text-xl">🔒</span>
            <h4 className="font-bold text-gray-900 text-xs sm:text-sm">Paiement 100% sécurisé</h4>
          </div>
          <p className="text-xs text-gray-600 ml-6 sm:ml-7 leading-snug">
            Transaction cryptée par Stripe
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6 text-center">
          <div className="bg-green-50 rounded-lg p-2 sm:p-3">
            <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">⚡</div>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-700 leading-tight">Accès immédiat</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
            <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">💯</div>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-700 leading-tight">Satisfait ou remboursé</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2 sm:p-3">
            <div className="text-xl sm:text-2xl mb-0.5 sm:mb-1">🎯</div>
            <p className="text-[10px] sm:text-xs font-semibold text-gray-700 leading-tight">Résultats garantis</p>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:flex-1 text-sm sm:text-base py-3"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleProceed}
            className="w-full sm:flex-1 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base sm:text-lg py-4 sm:py-5 md:py-6"
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : '🔓 Payer maintenant'}
          </Button>
        </div>

        <p className="text-center text-[10px] sm:text-xs text-gray-500 mt-3 sm:mt-4 leading-tight">
          En continuant, vous acceptez nos conditions générales de vente
        </p>
      </div>
    </div>
  );
};

export default PaymentModal; 