import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CoachingCTAProps {
  onDiscover: () => void;
}

const CoachingCTA = ({ onDiscover }: CoachingCTAProps) => {
  return (
    <div className="neo-card mt-12">
      <div className="text-center">
        <div className="mb-6">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="neo-heading neo-heading-lg mb-3">
            Tu veux aller plus loin ?
          </h3>
          <p className="neo-text-muted leading-relaxed max-w-2xl mx-auto text-lg">
            Reçois un plan d'orientation personnalisé + 30 min de coaching individuel, 
            100% adapté à ton profil.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 font-medium" style={{ color: 'var(--neo-accent)' }}>
            <span className="text-xl">✨</span>
            <span>Coaching mené par des experts passionnés</span>
          </div>
          
          <button 
            onClick={onDiscover}
            className="neo-button-secondary text-lg px-10 py-4"
          >
            <span className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🚀</span>
              <span className="hidden sm:inline">Découvrir le coaching</span>
              <span className="sm:hidden">Coaching</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoachingCTA; 