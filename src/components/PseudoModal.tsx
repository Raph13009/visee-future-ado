import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface PseudoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (pseudo: string) => void;
}

const PseudoModal: React.FC<PseudoModalProps> = ({ isOpen, onClose, onContinue }) => {
  const [pseudo, setPseudo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      // Stocker le pseudo dans localStorage pour l'utiliser lors de l'insertion en base
      localStorage.setItem('userPseudo', pseudo.trim());
      await onContinue(pseudo.trim());
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du pseudo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setPseudo('');
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">👋</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Salut ! Comment tu t'appelles ?
          </h2>
          
          <p className="text-gray-600 text-sm">
            Juste un petit nom ou pseudo pour personnaliser ton expérience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="pseudo" className="text-sm font-semibold text-gray-700">
              Ton prénom ou pseudo
            </Label>
            <Input
              id="pseudo"
              type="text"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              placeholder="Ex: Alex, Marie, Tom..."
              className="mt-1"
              disabled={isLoading}
              maxLength={50}
              autoFocus
            />
          </div>

          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? '...' : '🚀 Commencer le test'}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Tes données restent privées et sécurisées
          </p>
        </div>
      </div>
    </div>
  );
};

export default PseudoModal; 