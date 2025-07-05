import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

const Results = () => {
  const [isReportReady, setIsReportReady] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [insertionLog, setInsertionLog] = useState<string>("");
  const [inserting, setInserting] = useState(false);

  useEffect(() => {
    // Envoi automatique des données du test à Supabase
    if (!hasSent) {
      const sendResults = async () => {
        console.log('🚀 [RESULTS] Début de sendResults');
        try {
          // Récupère les réponses du test
          const testAnswers = localStorage.getItem('testAnswers');
          console.log('📝 [RESULTS] testAnswers from localStorage:', testAnswers);
          const parsedAnswers = testAnswers ? JSON.parse(testAnswers) : {};
          console.log('📝 [RESULTS] parsedAnswers:', parsedAnswers);

          // Récupère les infos utilisateur si dispo (depuis checkout)
          const checkoutData = localStorage.getItem('checkoutData');
          console.log('👤 [RESULTS] checkoutData from localStorage:', checkoutData);
          let userData = { name: '', email: '', currentFiliere: '' };
          if (checkoutData) {
            try {
              userData = JSON.parse(checkoutData);
              console.log('👤 [RESULTS] parsed userData:', userData);
            } catch (parseError) {
              console.error('❌ [RESULTS] Erreur parsing checkoutData:', parseError);
            }
          }

          // Envoie dans Supabase
          const leadData = {
            name: userData.name || "Non renseigné",
            email: userData.email || "Non renseigné",
            current_filiere: userData.currentFiliere || "Non spécifié",
            key_answers: parsedAnswers,
            created_at: new Date().toISOString(),
            payment: null, // ou "" si la colonne n'accepte pas null
            include_monthly_coaching: false,
            total_price: 0
          };
          console.log('📊 [RESULTS] leadData à envoyer:', leadData);
          console.log('🔗 [RESULTS] Tentative d\'insertion dans Supabase...');
          
          const { data, error } = await supabase.from('leads').insert([leadData]);
          
          if (error) {
            console.error('❌ [RESULTS] Erreur Supabase:', error);
            console.error('❌ [RESULTS] Détails de l\'erreur:', {
              message: error.message,
              details: error.details,
              hint: error.hint,
              code: error.code
            });
          } else {
            console.log('✅ [RESULTS] Données insérées avec succès:', data);
          }
          
          setHasSent(true);
        } catch (error) {
          console.error('❌ [RESULTS] Erreur générale dans sendResults:', error);
          // Ne bloque pas l'affichage
          setHasSent(true);
        }
      };
      sendResults();
    }
  }, [hasSent]);

  useEffect(() => {
    // Simulate report generation
    const timer = setTimeout(() => {
      setIsReportReady(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Nouvelle fonction pour forcer l'insertion et afficher les logs dans la page
  const handleTestInsert = async () => {
    setInserting(true);
    setInsertionLog('⏳ Tentative d\'insertion...');
    try {
      const testAnswers = localStorage.getItem('testAnswers');
      setInsertionLog(prev => prev + `\n📝 testAnswers from localStorage: ${testAnswers}`);
      let parsedAnswers = {};
      try {
        parsedAnswers = testAnswers ? JSON.parse(testAnswers) : {};
        setInsertionLog(prev => prev + `\n📝 parsedAnswers: ${JSON.stringify(parsedAnswers)}`);
      } catch (err) {
        setInsertionLog(prev => prev + `\n❌ Erreur parsing testAnswers: ${err}`);
      }
      const checkoutData = localStorage.getItem('checkoutData');
      setInsertionLog(prev => prev + `\n👤 checkoutData from localStorage: ${checkoutData}`);
      let userData = { name: '', email: '', currentFiliere: '' };
      try {
        if (checkoutData) {
          userData = JSON.parse(checkoutData);
          setInsertionLog(prev => prev + `\n👤 parsed userData: ${JSON.stringify(userData)}`);
        }
      } catch (err) {
        setInsertionLog(prev => prev + `\n❌ Erreur parsing checkoutData: ${err}`);
      }
      const leadData = {
        name: userData.name || "Non renseigné",
        email: userData.email || "Non renseigné",
        current_filiere: userData.currentFiliere || "Non spécifié",
        key_answers: parsedAnswers,
        created_at: new Date().toISOString(),
        payment: null,
        include_monthly_coaching: false,
        total_price: 0
      };
      setInsertionLog(prev => prev + `\n📊 leadData à envoyer: ${JSON.stringify(leadData)}`);
      const { data, error } = await supabase.from('leads').insert([leadData]);
      if (error) {
        setInsertionLog(prev => prev + `\n❌ Erreur Supabase: ${JSON.stringify(error)}`);
        setInsertionLog(prev => prev + `\n❌ Détails: ${JSON.stringify({ message: error.message, details: error.details, hint: error.hint, code: error.code })}`);
      } else {
        setInsertionLog(prev => prev + `\n✅ Données insérées avec succès: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setInsertionLog(prev => prev + `\n❌ Erreur générale: ${err}`);
    }
    setInserting(false);
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
                        Votre analyse personnalisée sera envoyée par email
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
                    Un coach certifié vous contactera dans les prochains jours pour reprendre votre rapport avec vous et vous aider à affiner vos choix d'orientation.
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

                <div className="bg-gray-100 p-6 rounded-2xl text-center">
                  <div className="text-4xl mb-3">📅</div>
                  <h3 className="font-semibold text-primary mb-2">Rendez-vous programmé</h3>
                  <p className="text-gray-600 text-sm">
                    Vous serez contacté dans les 7 jours pour programmer votre appel coaching
                  </p>
                </div>
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
                  <div className="text-3xl mb-2">📄</div>
                  <h3 className="font-semibold text-primary mb-1">Rapport PDF</h3>
                  <p className="text-sm text-gray-600">
                    Votre analyse complète envoyée par email
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <div className="text-3xl mb-2">💬</div>
                  <h3 className="font-semibold text-primary mb-1">Appel coaching</h3>
                  <p className="text-sm text-gray-600">
                    Rendez-vous programmé dans les 7 jours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;
