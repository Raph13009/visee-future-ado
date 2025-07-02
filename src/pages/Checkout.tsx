
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

const Checkout = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/results');
    }, 2000);
  };

  const isFormValid = () => {
    return formData.email && formData.firstName && formData.lastName && formData.phone;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Finaliser votre commande
            </h1>
            <p className="text-xl text-gray-600">
              Plus qu'une étape pour recevoir votre rapport personnalisé !
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="border-0 shadow-lg h-fit">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Ce que vous recevez</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-2xl">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold text-primary">Rapport d'orientation personnalisé</h3>
                    <p className="text-sm text-gray-600">Document PDF détaillé avec vos résultats et recommandations</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-2xl">
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold text-primary">Appel coaching de 30 minutes</h3>
                    <p className="text-sm text-gray-600">Échange personnalisé avec un coach certifié pour affiner vos pistes</p>
                  </div>
                </div>

                <div className="border-t pt-4 mt-6">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span className="text-primary">Total</span>
                    <span className="text-secondary">15 €</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Sans engagement • Paiement sécurisé</p>
                </div>

                <div className="bg-accent/20 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">💝</span>
                    <span className="font-semibold text-primary">Garantie satisfaction</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pas satisfait ? Nous vous remboursons intégralement dans les 7 jours.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Vos informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      placeholder="Votre prénom"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="rounded-2xl border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Votre nom"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="rounded-2xl border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="rounded-2xl border-gray-200"
                  />
                  <p className="text-xs text-gray-500">
                    Nous vous enverrons votre rapport à cette adresse
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="rounded-2xl border-gray-200"
                  />
                  <p className="text-xs text-gray-500">
                    Pour programmer votre appel coaching
                  </p>
                </div>

                <div className="border-t pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-2xl">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <p className="font-medium text-primary">Paiement 100% sécurisé</p>
                        <p className="text-sm text-gray-600">Cryptage SSL • Données protégées</p>
                      </div>
                    </div>

                    <Button
                      onClick={handlePayment}
                      disabled={!isFormValid() || isProcessing}
                      className="w-full bg-secondary hover:bg-secondary/90 text-white py-4 text-lg rounded-2xl font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Traitement en cours...</span>
                        </div>
                      ) : (
                        "Payer 15€ et recevoir mon rapport 🚀"
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      En validant, vous acceptez nos{" "}
                      <a href="#" className="text-primary hover:underline">conditions générales</a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
