import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AccesResultats = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultFound, setResultFound] = useState(false);
  const [resultData, setResultData] = useState<any>(null);
  const [error, setError] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResultFound(false);

    try {
      // Rechercher dans la table riasec_results
      const { data, error: searchError } = await supabase
        .from('riasec_results')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .eq('name', prenom.trim())
        .limit(1);

      if (searchError) {
        console.error('Erreur de recherche:', searchError);
        setError("Une erreur s'est produite. Veuillez réessayer.");
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setResultFound(true);
        setResultData(data[0]);
      } else {
        // Aucun résultat trouvé - afficher la modal de contact
        setShowContactModal(true);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    }

    setLoading(false);
  };

  const handleViewResults = () => {
    if (resultData && resultData.dominant_profile) {
      navigate(`/resultats-riasec?profile=${resultData.dominant_profile}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F5F1E8' }}>
      <Header />
      
      <main className="pt-32 pb-16 px-6">
        <div className="max-w-lg mx-auto">
          
          {/* Card */}
          <div 
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: '#FFFFFF',
              border: '3px solid #1A1A1A',
              boxShadow: '8px 8px 0 rgba(0,0,0,0.1)'
            }}
          >
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black mb-4 text-center" style={{ color: '#1A1A1A' }}>
              Retrouvez vos résultats
            </h1>
            
            {/* Subtitle */}
            <p className="text-center mb-8 text-gray-600 leading-relaxed">
              Entrez simplement votre e-mail et votre prénom pour accéder à votre profil Avenirea.
            </p>

            {!resultFound ? (
              <>
                {/* Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        border: '2px solid #E6DCCC',
                        background: '#F5F1E8'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                      Prénom
                    </label>
                    <Input
                      type="text"
                      value={prenom}
                      onChange={(e) => setPrenom(e.target.value)}
                      placeholder="Votre prénom"
                      className="w-full px-4 py-3 rounded-lg"
                      style={{
                        border: '2px solid #E6DCCC',
                        background: '#F5F1E8'
                      }}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-sm text-red-600 mb-4 text-center">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <Button
                  onClick={handleSearch}
                  disabled={loading || !email || !prenom}
                  className="w-full px-6 py-4 font-bold text-base rounded-xl transition-all hover:translate-y-[-2px]"
                  style={{
                    background: '#6DC9B3',
                    color: '#1A1A1A',
                    border: '3px solid #1A1A1A',
                    boxShadow: '5px 5px 0 #1A1A1A'
                  }}
                >
                  {loading ? 'Recherche...' : 'Afficher mes résultats'}
                </Button>

                {/* Reassurance */}
                <p className="text-xs text-gray-500 text-center mt-6 italic">
                  Vos données sont sécurisées et ne sont utilisées que pour retrouver votre profil.
                </p>
              </>
            ) : (
              <>
                {/* Success Message */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg mb-4" style={{ background: '#E8F5F0', border: '2px solid #6DC9B3' }}>
                    <span className="text-xl">✅</span>
                    <p className="font-semibold" style={{ color: '#1A1A1A' }}>
                      Résultats trouvés — cliquez ci-dessous pour les consulter
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleViewResults}
                  className="w-full px-6 py-4 font-bold text-base rounded-xl transition-all hover:translate-y-[-2px]"
                  style={{
                    background: '#6DC9B3',
                    color: '#1A1A1A',
                    border: '3px solid #1A1A1A',
                    boxShadow: '5px 5px 0 #1A1A1A'
                  }}
                >
                  Voir mes résultats
                </Button>
              </>
            )}
          </div>
          
        </div>
      </main>

      <Footer />

      {/* Modal Contact si aucun résultat */}
      {showContactModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactModal(false)}
          >
            <div 
              className="rounded-2xl p-8 max-w-md w-full"
              style={{
                background: '#FFFFFF',
                border: '3px solid #1A1A1A',
                boxShadow: '8px 8px 0 #1A1A1A'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black mb-4 text-center" style={{ color: '#1A1A1A' }}>
                Résultats introuvables
              </h3>
              
              <p className="text-gray-700 mb-4 leading-relaxed text-center">
                Aucun résultat ne correspond à ces informations. 
                Si vous pensez qu'il s'agit d'une erreur, veuillez nous contacter à :
              </p>
              
              <div className="mb-6 text-center">
                <a 
                  href="mailto:lolatalbon@gmail.com"
                  className="text-lg font-bold inline-block px-4 py-2 rounded-lg"
                  style={{ 
                    color: '#6DC9B3',
                    background: '#E8F5F0',
                    border: '2px solid #6DC9B3'
                  }}
                >
                  lolatalbon@gmail.com
                </a>
              </div>
              
              <p className="text-sm text-gray-600 mb-6 text-center">
                Merci de préciser dans votre email :
              </p>
              
              <ul className="text-sm text-gray-600 mb-6 space-y-2 text-left">
                <li>• L'email que vous pensez avoir utilisé</li>
                <li>• Le prénom que vous avez indiqué</li>
                <li>• La date approximative de votre test</li>
              </ul>
              
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:lolatalbon@gmail.com?subject=Demande d'accès à mes résultats Avenirea&body=Bonjour,%0D%0A%0D%0AJe n'arrive pas à retrouver mes résultats.%0D%0A%0D%0AEmail utilisé : [votre email]%0D%0APrénom utilisé : [votre prénom]%0D%0ADate du test : [date approximative]%0D%0A%0D%0AMerci de votre aide."
                  className="w-full px-6 py-4 font-bold text-base rounded-xl transition-all hover:translate-y-[-2px] text-center"
                  style={{
                    background: '#6DC9B3',
                    color: '#1A1A1A',
                    border: '3px solid #1A1A1A',
                    boxShadow: '5px 5px 0 #1A1A1A',
                    textDecoration: 'none'
                  }}
                >
                  Contacter le support
                </a>
                
                <button
                  onClick={() => setShowContactModal(false)}
                  className="w-full px-6 py-3 font-semibold text-sm rounded-lg transition-all"
                  style={{
                    background: 'transparent',
                    border: '2px solid #E6DCCC',
                    color: '#1A1A1A'
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AccesResultats;

