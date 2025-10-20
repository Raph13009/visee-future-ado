import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (name: string, email: string) => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, onClose, onContinue }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{name?: string; email?: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {name?: string; email?: string} = {};
    
    if (!name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }
    
    if (!email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
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
      await onContinue(name.trim(), email.trim());
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setName('');
    setEmail('');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all" style={{ background: '#F9F8F4' }}>
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🚀</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">
            Commencez votre bilan d'orientation
          </h2>
          
          <p className="text-gray-600 text-sm">
            Entrez vos informations pour démarrer le test
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
              Votre nom <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marie Dupont"
              className="mt-1"
              disabled={isLoading}
              maxLength={100}
              autoFocus
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              Votre email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: marie@exemple.com"
              className="mt-1"
              disabled={isLoading}
              maxLength={100}
            />
            <p className="text-xs text-gray-600 mt-1.5 flex items-start gap-1">
              <span>💡</span>
              <span>Indiquez votre vrai email pour retrouver votre rapport complet à tout moment</span>
            </p>
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
              className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Chargement...' : '🚀 Commencer'}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Vos données restent privées et sécurisées
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;

