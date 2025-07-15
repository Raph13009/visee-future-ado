import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: (email: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onProceedToPayment }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{email?: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {email?: string} = {};
    
    // Seulement valider l'email s'il est renseigné
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await onProceedToPayment(email.trim());
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setEmail('');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">💎</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Accès Premium
          </h2>
          
          {/* Bulle de prix */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-white px-4 py-2 rounded-full text-lg font-bold mb-3 shadow-lg">
            <span>💎</span>
            <span>1,90 €</span>
          </div>
          
          <p className="text-gray-600 text-sm">
            Complétez vos informations pour débloquer votre bilan complet
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Votre email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: jean@example.com"
              className="mt-1"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500"
              disabled={isLoading}
            >
              {isLoading ? '...' : '🔓 Continuer le paiement'}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Paiement sécurisé par Stripe • Vos données sont protégées
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 