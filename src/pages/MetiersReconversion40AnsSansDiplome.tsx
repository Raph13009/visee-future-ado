import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const MetiersReconversion40AnsSansDiplome = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F5F1E8' }}>
      <Header />
      
      <main className="pt-24 pb-16">
        
        {/* Bouton Retour */}
        <div className="max-w-4xl mx-auto px-6 mb-4">
          <button
            onClick={() => {
              navigate('/ressources');
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-sm rounded-lg transition-all hover:translate-x-[-2px]"
            style={{
              background: '#FFFFFF',
              color: '#2C2C2C',
              border: '2px solid #1A1A1A',
              boxShadow: '3px 3px 0 #1A1A1A'
            }}
          >
            <span>←</span>
            <span>Retour</span>
          </button>
        </div>
        
        {/* 1️⃣ Hero Section */}
        <section className="py-8 px-6" style={{ background: '#F5F1E8' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6" style={{ color: '#1A1A1A' }}>
              5 métiers pour une reconversion à 40 ans sans diplôme
            </h1>
            
            <p className="text-lg sm:text-xl mb-12 leading-relaxed" style={{ color: '#6B7280' }}>
              À 40 ans, beaucoup ressentent le besoin de changer de vie professionnelle. Découvrez 5 pistes réalistes pour entamer votre reconversion dès aujourd'hui.
            </p>

            {/* Hero Image */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/worker-aged-40.jpg" 
                  alt="Professionnel de 40 ans en reconversion"
                  className="w-full h-80 object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={1200}
                  height={600}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%236B8E9E" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23ffffff"%3EReconversion sans dipl%C3%B4me%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Introduction */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Introduction
            </h2>
            
            <div className="section-content mb-8">
              <p className="section-text">
                À 40 ans, beaucoup ressentent le besoin de changer de vie professionnelle. Fatigue, perte de sens, envie de liberté… mais une question revient toujours : "Est-ce encore possible sans diplôme ?"
              </p>
              <p className="section-text">
                La réponse est <strong>oui</strong> : de nombreux métiers valorisent l'expérience, la motivation et les soft skills plutôt que les études. Voici 5 pistes réalistes pour entamer votre <strong>reconversion</strong> dès aujourd'hui.
              </p>
            </div>
          </div>
        </section>

        {/* 3️⃣ Métier 1 - Assistant indépendant */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 mb-8">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/seo/man-working-laptop.jpg" 
                    alt="Assistant indépendant en télétravail"
                    className="w-full h-72 object-cover"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EAssistant ind%C3%A9pendant%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 section-content">
                <h2 className="section-title">
                  1. Assistant indépendant / Freelance administratif
                </h2>
                
                <p className="section-text">
                  Vous êtes organisé(e) et à l'aise avec les outils numériques ? De plus en plus d'entreprises recherchent des assistants freelance pour gérer mails, agendas et factures.
                </p>
                
                <div className="section-text">
                  <p className="mb-3"><strong>Formation courte possible</strong> (quelques semaines)</p>
                  <p className="mb-3"><strong>Fort potentiel d'indépendance</strong> et de télétravail</p>
                  <p className="mb-3"><strong>Idéal si vous aimez</strong> l'autonomie et la rigueur</p>
                </div>
                
                <p className="section-text">
                  <strong>Conseil Avenirea</strong> : commencez sur des plateformes comme Malt ou BeFreelancr pour bâtir votre premier portefeuille client.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ Métier 2 - Technicien de maintenance */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-8">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/seo/man-working-electricity.jpg" 
                    alt="Technicien de maintenance et bricolage"
                    className="w-full h-72 object-cover"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3ETechnicien de maintenance%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 section-content">
                <h2 className="section-title">
                  2. Technicien de maintenance ou agent polyvalent
                </h2>
                
                <p className="section-text">
                  Les métiers manuels restent parmi les plus demandés en France. Bricolage, entretien, petits travaux : votre savoir-faire a de la valeur.
                </p>
                
                <div className="section-text">
                  <p className="mb-3"><strong>Recrutement fréquent</strong> sans diplôme</p>
                  <p className="mb-3"><strong>Possibilités d'évolution</strong> (chef d'équipe, auto-entrepreneur)</p>
                  <p className="mb-3"><strong>Formations gratuites</strong> via Pôle Emploi ou GRETA</p>
                </div>
                
                <p className="section-text">
                  <strong>Astuce</strong> : démarrez avec quelques missions locales, puis créez un statut micro-entrepreneur pour tester votre activité.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Métier 3 - Conseiller en insertion */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">
              3. Conseiller en insertion ou coach emploi junior
            </h2>
            
            <div className="section-content mb-8">
              <p className="section-text">
                Si vous aimez aider les autres à trouver leur voie, ce métier offre du sens. Les structures d'accompagnement (missions locales, associations, organismes privés) recrutent souvent sur la base de l'expérience humaine plutôt que du diplôme.
              </p>
              
              <div className="section-text">
                <p className="mb-3"><strong>Écoute, empathie, motivation</strong> requises</p>
                <p className="mb-3"><strong>Évolution possible</strong> vers le bilan de compétences</p>
              </div>
              
              <p className="section-text">
                <strong>Conseil Avenirea</strong> : testez votre profil sur notre bilan d'orientation professionnelle adulte avant de vous lancer.
              </p>
            </div>
          </div>
        </section>

        {/* 6️⃣ Métier 4 - Vendeur-conseil */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">
              4. Vendeur-conseil / Commercial terrain
            </h2>
            
            <div className="section-content mb-8">
              <p className="section-text">
                Certains ont le contact facile et savent convaincre : c'est un atout rare. La vente reste un secteur ouvert à tous les profils motivés.
              </p>
              
              <div className="section-text">
                <p className="mb-3"><strong>Salaire évolutif</strong> + primes</p>
                <p className="mb-3"><strong>Recrutement massif</strong> dans la distribution, l'automobile, le service</p>
                <p className="mb-3"><strong>Formations en interne</strong> dans la plupart des entreprises</p>
              </div>
              
              <p className="section-text">
                <strong>Astuce</strong> : si vous aimez le contact humain, la reconversion vers la vente peut être un tremplin rapide.
              </p>
            </div>
          </div>
        </section>

        {/* 7️⃣ Métier 5 - Auxiliaire de vie */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12 mb-8">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/seo/woman-working-haircut.jpg" 
                    alt="Auxiliaire de vie et aide à la personne"
                    className="w-full h-72 object-cover"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EAuxiliaire de vie%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 section-content">
                <h2 className="section-title">
                  5. Auxiliaire de vie / Aide à la personne
                </h2>
                
                <p className="section-text">
                  Un secteur en pleine tension, avec un vrai sens humain. Les besoins explosent chez les personnes âgées et les structures d'accueil.
                </p>
                
                <div className="section-text">
                  <p className="mb-3"><strong>Diplôme pas obligatoire</strong> au départ</p>
                  <p className="mb-3"><strong>Nombreux débouchés</strong> et stabilité assurée</p>
                  <p className="mb-3"><strong>Évolution possible</strong> vers aide-soignant(e)</p>
                </div>
                
                <p className="section-text">
                  <strong>Conseil Avenirea</strong> : renseignez-vous sur les formations financées par le CPF (jusqu'à 100 % prises en charge).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8️⃣ Conclusion */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Conclusion
            </h2>
            
            <div className="section-content mb-8">
              <p className="section-text">
                La reconversion à 40 ans sans diplôme, c'est avant tout une question de volonté et de clarté. L'important n'est pas de repartir à zéro, mais de capitaliser sur ce que vous savez déjà faire.
              </p>
              <p className="section-text">
                Et pour identifier vos points forts et les métiers qui vous correspondent vraiment, faites le <strong>test d'orientation Avenirea</strong> — rapide, gratuit et conçu pour les adultes en quête de sens.
              </p>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  navigate('/bilan-reconversion-professionnelle');
                  window.scrollTo(0, 0);
                }}
                className="px-8 py-4 font-bold text-lg rounded-xl transition-all hover:translate-y-[-2px]"
                style={{
                  background: '#E96A3C',
                  color: '#FFFFFF',
                  border: '3px solid #1A1A1A',
                  boxShadow: '6px 6px 0 #1A1A1A'
                }}
              >
                Faire mon bilan d'orientation
              </button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default MetiersReconversion40AnsSansDiplome;

