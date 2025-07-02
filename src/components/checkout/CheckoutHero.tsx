
import { Zap } from "lucide-react";

const CheckoutHero = () => {
  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse">
        <Zap className="w-4 h-4" />
        Offre exclusive • Accès prioritaire ! 🔥
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
        🎯 Débloques ton avenir professionnel
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mb-4">
        Rejoins <strong>+2,847 étudiants</strong> qui ont déjà trouvé leur voie 🚀
      </p>
    </div>
  );
};

export default CheckoutHero;
