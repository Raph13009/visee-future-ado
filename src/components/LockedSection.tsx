import React from 'react';

interface LockedSectionProps {
  isUnlocked: boolean;
  children: React.ReactNode;
  lockLabel?: string;
  className?: string;
  onClick?: () => void;
  showOnlyIcon?: boolean; // Nouvelle prop pour afficher uniquement l'icône
}

const LockedSection: React.FC<LockedSectionProps> = ({ 
  isUnlocked, 
  children, 
  lockLabel = "🔒 Inclus dans le bilan complet",
  className = "",
  onClick,
  showOnlyIcon = false
}) => {
  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="opacity-60 pointer-events-none select-none">
        {children}
      </div>
      
      {/* Overlay flou avec contenu cliquable discret */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm bg-white bg-opacity-30 rounded-xl ${onClick ? 'cursor-pointer hover:bg-opacity-40 transition-all duration-300' : 'pointer-events-none'} flex items-center justify-center`}
        onClick={onClick}
      >
        {onClick && !showOnlyIcon && (
          <div className="text-center text-gray-500">
            <div className="mb-2 flex justify-center">
              <img src="/cadenas.png" alt="Cadenas" className="w-8 h-8 opacity-70" />
            </div>
            <div className="text-sm font-medium">Inclus dans le profil complet</div>
            <div className="text-xs text-gray-400 mt-1">💡 Débloque tout pour 1,90 € seulement</div>
          </div>
        )}
        
        {/* Affichage uniquement de l'icône si showOnlyIcon est true */}
        {showOnlyIcon && (
          <div className="flex justify-center">
            <img src="/cadenas.png" alt="Cadenas" className="w-6 h-6 opacity-70" />
          </div>
        )}
      </div>
      
      {/* Badge de verrouillage si on a un label (pour les petites zones) */}
      {lockLabel && !onClick && !showOnlyIcon && (
        <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          {lockLabel}
        </div>
      )}
    </div>
  );
};

export default LockedSection; 