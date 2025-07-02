
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PricingCardProps {
  totalPrice: number;
}

const PricingCard = ({ totalPrice }: PricingCardProps) => {
  return (
    <Card className="border-0 shadow-lg mb-6 bg-gradient-to-r from-primary/5 to-secondary/5">
      <CardHeader className="pb-4 px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl text-primary flex items-center gap-2">
          🎁 Voici ce que tu vas recevoir
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3 py-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-sm sm:text-base text-gray-700 font-medium">Analyse personnalisée complète</span>
              <p className="text-xs text-gray-500">Basée sur tes réponses au test</p>
            </div>
            <span className="font-medium text-sm sm:text-base text-primary">18€</span>
          </div>
          <div className="flex items-center gap-3 py-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-sm sm:text-base text-gray-700 font-medium">Appel coaching (30min)</span>
              <p className="text-xs text-gray-500">Avec un conseiller expert</p>
            </div>
            <span className="text-sm sm:text-base text-green-600 font-medium">🎁 OFFERT</span>
          </div>
          <div className="flex items-center gap-3 py-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-sm sm:text-base text-gray-700 font-medium">Plan d'action personnalisé</span>
              <p className="text-xs text-gray-500">Étapes concrètes pour ton orientation</p>
            </div>
            <span className="text-sm sm:text-base text-green-600 font-medium">🎁 BONUS</span>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-base sm:text-lg font-semibold text-primary">Total aujourd'hui</span>
                <p className="text-xs text-gray-500">Au lieu de 89€</p>
              </div>
              <div className="text-right">
                <span className="text-gray-400 line-through text-sm">89€</span>
                <span className="text-xl sm:text-2xl font-bold text-primary ml-2">{totalPrice}€</span>
                <div className="text-xs text-green-600 font-medium">Économise {89 - totalPrice}€ ! 💰</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
