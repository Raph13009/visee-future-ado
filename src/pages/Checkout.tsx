
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      // Store lead in Supabase
      const leadData = {
        name: formData.name,
        email: formData.email,
        current_filiere: formData.currentFiliere || "Non spécifié",
        key_answers: {} // Empty for checkout form leads
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-8 px-3 sm:px-4">
        <div className="container mx-auto max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
              Obtiens ton coaching personnalisé
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Débloques tes résultats et réserves ton appel avec un coach
            </p>
          </div>

          <Card className="border-0 shadow-lg mb-6">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl text-primary">
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nom complet *
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
                  Adresse email *
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
                  Filière actuelle (optionnel)
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

          <Card className="border-0 shadow-lg mb-6">
            <CardHeader className="pb-4 px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl text-primary">
                Coaching personnalisé
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm sm:text-base text-gray-700">Analyse personnalisée</span>
                  <span className="font-medium text-sm sm:text-base">18€</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm sm:text-base text-gray-700">Appel coaching (30min)</span>
                  <span className="font-medium text-sm sm:text-base">Inclus</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-semibold text-primary">Total</span>
                    <span className="text-xl sm:text-2xl font-bold text-primary">18€</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handlePayment}
            disabled={isProcessing || !formData.name || !formData.email}
            className="w-full bg-primary hover:bg-primary/90 text-white py-3 sm:py-4 rounded-xl font-medium text-sm sm:text-base transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 mb-4"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Traitement en cours...
              </div>
            ) : (
              "Payer et débloquer mon coaching"
            )}
          </Button>

          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Paiement sécurisé • Remboursement sous 14 jours
          </p>
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
