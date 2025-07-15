import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const CoachingSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optionnel : redirection automatique après 5 secondes
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header hideTestCTA={true} />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                {/* Animation de succès */}
                <div className="relative">
                  <div className="text-6xl mb-4 animate-bounce">🎉</div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-green-200 rounded-full opacity-30 animate-ping"></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h1 className="text-3xl font-black text-gray-900">
                    Parfait ! Ta réservation est confirmée
                  </h1>
                  
                  <p className="text-lg text-gray-600 max-w-md mx-auto">
                    Tu vas recevoir un email dans les prochaines 24h avec tous les détails 
                    de ton coaching et les instructions pour finaliser ton paiement.
                  </p>
                </div>

                {/* Informations importantes */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    📧 Prochaines étapes
                  </h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">1.</span>
                      <span>Vérification de ton email de réservation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">2.</span>
                      <span>Confirmation du créneau de coaching</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">3.</span>
                      <span>Réception du lien de visioconférence</span>
                    </li>
                  </ul>
                </div>

                {/* Contact */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-orange-800 text-sm">
                    <strong>Une question ?</strong> Réponds simplement à l'email de confirmation que tu vas recevoir.
                  </p>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="flex-1"
                  >
                    Retour à l'accueil
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/test-riasec')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Faire le test RIASEC
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoachingSuccess; 