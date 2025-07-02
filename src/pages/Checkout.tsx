
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Clock, Users, Star, Zap } from "lucide-react";
import Header from "@/components/Header";
import PaymentSuccessModal from "@/components/PaymentSuccessModal";
import { supabase } from "@/integrations/supabase/client";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentFiliere: ""
  });
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsProcessing(true);

    try {
      // Get test answers from localStorage
      const testAnswers = localStorage.getItem('testAnswers');
      const parsedAnswers = testAnswers ? JSON.parse(testAnswers) : {};

      // Store lead in Supabase
      const leadData = {
        name: formData.name,
        email: formData.email,
        current_filiere: formData.currentFiliere || "Non spécifié",
        key_answers: parsedAnswers
      };

      const { error } = await supabase
        .from('leads')
        .insert([leadData]);

      if (error) {
        console.error('Error storing lead:', error);
      } else {
        console.log('Lead stored successfully');
      }

      // Simulate payment processing delay
      setTimeout(() => {
        setIsProcessing(false);
        setShowPaymentSuccess(true);
      }, 2000);
    } catch (error) {
      console.error('Payment simulation error:', error);
      // Still show success for simulation purposes
      setTimeout(() => {
        setIsProcessing(false);
        setShowPaymentSuccess(true);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <Header />
      
      <div className="pt-20 pb-8 px-3 sm:px-4">
        <div className="container mx-auto max-w-lg">
          {/* Hero Section avec urgence */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse">
              <Zap className="w-4 h-4" />
              Offre limitée • Plus que 23 places disponibles ! 🔥
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
              🎯 Débloques ton avenir professionnel
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Rejoins <strong>+2,847 étudiants</strong> qui ont déjà trouvé leur voie 🚀
            </p>
          </div>

          {/* Badges de confiance */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              <Shield className="w-3 h-3 mr-1" />
              Paiement 100% sécurisé
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Garantie satisfait ou remboursé
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
              <Clock className="w-3 h-3 mr-1" />
              Accès immédiat
            </Badge>
          </div>

          {/* Témoignage social proof */}
          <Card className="border-0 shadow-lg mb-6 bg-gradient-to-r from-green-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  ⭐
                </div>
                <div>
                  <p className="text-sm italic text-gray-700 mb-2">
                    "Grâce à ce coaching, j'ai enfin trouvé ma voie ! Le test m'a ouvert les yeux sur mes vrais talents."
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <div className="flex text-yellow-400">
                      <Star className="w-3 h-3" fill="currentColor" />
                      <Star className="w-3 h-3" fill="currentColor" />
                      <Star className="w-3 h-3" fill="currentColor" />
                      <Star className="w-3 h-3" fill="currentColor" />
                      <Star className="w-3 h-3" fill="currentColor" />
                    </div>
                    <span className="ml-1">- Sarah M., Terminale S</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire */}
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl text-primary flex items-center gap-2">
                📋 Tes informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  👤 Nom complet *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1 rounded-xl border-gray-200 focus:border-primary focus:ring-primary text-sm sm:text-base"
                  placeholder="Ton nom et prénom"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  📧 Adresse email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="mt-1 rounded-xl border-gray-200 focus:border-primary focus:ring-primary text-sm sm:text-base"
                  placeholder="ton.email@exemple.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="filiere" className="text-sm font-medium text-gray-700">
                  🎓 Filière actuelle (optionnel)
                </Label>
                <Input
                  id="filiere"
                  type="text"
                  value={formData.currentFiliere}
                  onChange={(e) => handleInputChange("currentFiliere", e.target.value)}
                  className="mt-1 rounded-xl border-gray-200 focus:border-primary focus:ring-primary text-sm sm:text-base"
                  placeholder="Ex: Terminale S, Bac Pro, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Ce que tu vas recevoir */}
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
                  <div>
                    <span className="text-sm sm:text-base text-gray-700 font-medium">Analyse personnalisée complète</span>
                    <p className="text-xs text-gray-500">Basée sur tes réponses au test</p>
                  </div>
                  <span className="ml-auto font-medium text-sm sm:text-base text-primary">18€</span>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base text-gray-700 font-medium">Appel coaching (30min)</span>
                    <p className="text-xs text-gray-500">Avec un conseiller expert</p>
                  </div>
                  <span className="ml-auto text-sm sm:text-base text-green-600 font-medium">🎁 OFFERT</span>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-base text-gray-700 font-medium">Plan d'action personnalisé</span>
                    <p className="text-xs text-gray-500">Étapes concrètes pour ton orientation</p>
                  </div>
                  <span className="ml-auto text-sm sm:text-base text-green-600 font-medium">🎁 BONUS</span>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-base sm:text-lg font-semibold text-primary">Total aujourd'hui</span>
                      <p className="text-xs text-gray-500">Au lieu de 89€</p>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 line-through text-sm">89€</span>
                      <span className="text-xl sm:text-2xl font-bold text-primary ml-2">18€</span>
                      <div className="text-xs text-green-600 font-medium">Économise 71€ ! 💰</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Urgence et rareté */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700 font-medium text-sm mb-2">
              ⏰ Attention : Offre limitée dans le temps !
            </div>
            <p className="text-red-600 text-xs">
              Cette promotion expire dans <strong>23h 45min</strong>. Après, le prix passe à 89€.
            </p>
          </div>

          {/* Bouton de paiement */}
          <Button
            onClick={handlePayment}
            disabled={isProcessing || !formData.name || !formData.email}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 mb-4 shadow-lg"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Traitement sécurisé en cours...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                🚀 Débloquer mon coaching pour 18€
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  -79% 🔥
                </div>
              </div>
            )}
          </Button>

          {/* Garanties */}
          <div className="text-center space-y-2 mb-4">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Paiement sécurisé SSL
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Remboursement 14 jours
              </div>
            </div>
            <p className="text-xs text-gray-400">
              ✨ Rejoins les <strong>2,847 étudiants</strong> qui ont déjà transformé leur avenir
            </p>
          </div>

          {/* Dernière poussée sociale */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700 mb-2">
              <Users className="w-4 h-4" />
              <span className="font-medium">127 personnes</span> ont pris leur coaching cette semaine
            </div>
            <div className="flex justify-center gap-1 text-xs text-green-600">
              {"⭐".repeat(5)} 4.9/5 basé sur 1,432 avis
            </div>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      <PaymentSuccessModal 
        isOpen={showPaymentSuccess}
        onClose={() => setShowPaymentSuccess(false)}
      />
    </div>
  );
};

export default Checkout;
