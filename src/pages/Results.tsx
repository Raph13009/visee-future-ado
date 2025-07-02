
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";

const Results = () => {
  const [isReportReady, setIsReportReady] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    // Simulate report generation
    const timer = setTimeout(() => {
      setIsReportReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleBookCall = () => {
    setShowCalendar(true);
    // In a real implementation, this would integrate with Calendly
    console.log("Opening Calendly integration...");
  };

  const handleDownloadReport = () => {
    // In a real implementation, this would download the actual PDF
    console.log("Downloading personalized report...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Félicitations ! Votre test est terminé
            </h1>
            <p className="text-xl text-gray-600">
              Merci pour votre confiance. Voici les prochaines étapes :
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Report Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center space-x-2">
                  <span>📋</span>
                  <span>Votre rapport personnalisé</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isReportReady ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h3 className="font-semibold text-primary mb-2">
                      Génération en cours...
                    </h3>
                    <p className="text-gray-600">
                      Nos experts analysent vos réponses pour créer votre rapport unique.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Cela prend généralement 2-3 minutes
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-2xl">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">✅</span>
                        <span className="font-semibold text-green-700">Rapport prêt !</span>
                      </div>
                      <p className="text-green-600 text-sm">
                        Votre analyse personnalisée de 8 pages est disponible
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary">Contenu de votre rapport :</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center space-x-2">
                          <span className="text-secondary">▸</span>
                          <span>Vos points forts et talents naturels</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-secondary">▸</span>
                          <span>3 filières d'études recommandées</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-secondary">▸</span>
                          <span>7 métiers qui vous correspondent</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span className="text-secondary">▸</span>
                          <span>Plan d'action pour les 6 prochains mois</span>
                        </li>
                      </ul>
                    </div>

                    <Button 
                      onClick={handleDownloadReport}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-2xl font-medium transition-all hover:scale-105"
                    >
                      Télécharger mon rapport PDF 📄
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coaching Call */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary flex items-center space-x-2">
                  <span>📞</span>
                  <span>Votre appel coaching</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <h3 className="font-semibold text-primary mb-2">
                    30 minutes avec un expert
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Un coach certifié reprendra votre rapport avec vous, répondra à vos questions 
                    et vous aidera à affiner vos choix d'orientation.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-primary">Pendant l'appel :</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-secondary">▸</span>
                      <span>Explication détaillée de vos résultats</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-secondary">▸</span>
                      <span>Conseils personnalisés pour vos études</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-secondary">▸</span>
                      <span>Réponses à toutes vos questions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-secondary">▸</span>
                      <span>Prochaines étapes concrètes</span>
                    </li>
                  </ul>
                </div>

                {!showCalendar ? (
                  <Button 
                    onClick={handleBookCall}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-2xl font-medium transition-all hover:scale-105"
                  >
                    Réserver mon créneau 📅
                  </Button>
                ) : (
                  <div className="bg-gray-100 p-6 rounded-2xl text-center">
                    <div className="text-4xl mb-3">📅</div>
                    <h3 className="font-semibold text-primary mb-2">Calendly Integration</h3>
                    <p className="text-gray-600 text-sm">
                      Ici s'afficherait le widget Calendly pour choisir votre créneau
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCalendar(false)}
                      className="mt-3 rounded-2xl"
                    >
                      Fermer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="mt-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center space-x-2">
                <span>🚀</span>
                <span>Et après ?</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-3xl mb-2">📧</div>
                  <h3 className="font-semibold text-primary mb-1">Email de confirmation</h3>
                  <p className="text-sm text-gray-600">
                    Récapitulatif envoyé à votre adresse email
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-3xl mb-2">💬</div>
                  <h3 className="font-semibold text-primary mb-1">Appel programmé</h3>
                  <p className="text-sm text-gray-600">
                    Rendez-vous avec votre coach dans les 7 jours
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-3xl mb-2">📝</div>
                  <h3 className="font-semibold text-primary mb-1">Résumé d'appel</h3>
                  <p className="text-sm text-gray-600">
                    Notes personnalisées envoyées après l'échange
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <div className="text-center mt-8 p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="font-semibold text-primary mb-2">Une question ?</h3>
            <p className="text-gray-600 mb-4">
              Notre équipe est là pour vous accompagner
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="mailto:hello@orienteo.fr" 
                className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span>📧</span>
                <span>hello@orienteo.fr</span>
              </a>
              <a 
                href="tel:0123456789" 
                className="flex items-center justify-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span>📞</span>
                <span>01 23 45 67 89</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
