import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Clock, User, Target } from "lucide-react";

interface CoachingPresentationProps {
  onBook: (price: 18 | 67) => void;
  onBack: () => void;
}

const CoachingPresentation = ({ onBook, onBack }: CoachingPresentationProps) => {
  const [selectedPrice, setSelectedPrice] = useState<18 | 67 | null>(18);

  const handleBooking = () => {
    if (selectedPrice) {
      onBook(selectedPrice);
    }
  };

  const handlePriceSelect = (price: 18 | 67) => {
    setSelectedPrice(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← Retour
        </Button>

        {/* Header section - full width */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            30 minutes de coaching d'orientation
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-700 font-medium mb-8">
            100% personnalisé
          </h2>
        </div>

        {/* Content section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Features */}
          <div className="space-y-8 lg:flex lg:flex-col lg:justify-center">
            <div className="flex items-start gap-4 lg:items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <User className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  Mené par des experts passionnés
                </h3>
                <p className="text-gray-600">
                  Professionnels spécialisés dans l'orientation des jeunes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 lg:items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Target className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  Objectif concret
                </h3>
                <p className="text-gray-600">
                  Clarifier ta voie, débloquer tes choix, construire un plan simple et efficace
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 lg:items-center">
              <div className="bg-orange-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  Format adapté
                </h3>
                <p className="text-gray-600">
                  30 minutes en visioconférence, au moment qui te convient
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center mb-6">Choisis ton accompagnement</h3>
            
            {/* Single session */}
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedPrice === 18 
                  ? 'border-2 border-orange-500 shadow-lg scale-105' 
                  : 'border-2 border-orange-200 hover:border-orange-300'
              }`}
              onClick={() => handlePriceSelect(18)}
            >
              <CardContent className="p-6 text-center">
                <h4 className="font-bold text-xl mb-2">Séance unique</h4>
                <div className="text-4xl font-black text-orange-600 mb-3">18€</div>
                <p className="text-gray-600 mb-4">
                  Parfait pour clarifier tes idées
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>30 min de coaching</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Plan d'action personnalisé</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly package */}
            <Card 
              className={`cursor-pointer transition-all duration-300 relative ${
                selectedPrice === 67 
                  ? 'border-2 border-orange-500 shadow-lg scale-105' 
                  : 'border-2 border-orange-400 hover:border-orange-500'
              }`}
              onClick={() => handlePriceSelect(67)}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  POPULAIRE
                </span>
              </div>
              <CardContent className="p-6 text-center">
                <h4 className="font-bold text-xl mb-2">Suivi 1 mois</h4>
                <div className="text-4xl font-black text-orange-600 mb-3">67€</div>
                <p className="text-gray-600 mb-4">
                  Accompagnement complet sur 4 semaines
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>4 séances de 30 min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Suivi personnalisé</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Plan d'action détaillé</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center">
          <Button 
            onClick={handleBooking}
            disabled={!selectedPrice}
            size="lg"
            className={`px-12 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
              selectedPrice 
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <span>Réserver maintenant</span>
            </span>
          </Button>
          
          <p className="text-gray-500 text-sm mt-4">
            {selectedPrice ? `${selectedPrice}€ • ` : ''}Paiement sécurisé • Confirmation sous 24h
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoachingPresentation; 