import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

const PromoModal: React.FC<PromoModalProps> = ({ isOpen, onClose, onUnlock }) => {
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode === 'Trudeau') {
      onUnlock();
      onClose();
      setPromoCode('');
      setError('');
    } else {
      setError('Code promo incorrect. Réessayez !');
    }
  };

  const handleClose = () => {
    onClose();
    setPromoCode('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Code promo découvert !
          </h2>
          <p className="text-gray-600 text-sm">
            Entrez le code secret pour débloquer tous les contenus
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Tapez votre code promo..."
              className="w-full text-center text-lg font-semibold"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              🔓 Débloquer
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 Indice : Pensez au Premier ministre du Canada
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromoModal; 