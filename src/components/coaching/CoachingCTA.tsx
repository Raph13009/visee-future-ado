import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CoachingCTAProps {
  onDiscover: () => void;
}

const CoachingCTA = ({ onDiscover }: CoachingCTAProps) => {
  return (
    <div className="mt-12 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-8 border border-orange-100">
      <div className="text-center">
        <div className="mb-6">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Tu veux aller plus loin ?
          </h3>
          <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto text-lg">
            Reçois un plan d'orientation personnalisé + 30 min de coaching individuel, 
            100% adapté à ton profil.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-orange-700 font-medium">
            <span className="text-xl">✨</span>
            <span>Coaching mené par des experts passionnés</span>
          </div>
          
          <Button 
            onClick={onDiscover}
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-10 py-4 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <span>Découvrir le coaching</span>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoachingCTA; 