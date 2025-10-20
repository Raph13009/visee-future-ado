import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ConseilsReconversion = () => {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F5F1E8' }}>
      <Header />
      
      <main className="pt-24 pb-16">
        
        {/* 1️⃣ Hero Section */}
        <section className="py-16 px-6" style={{ background: '#F5F1E8' }}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6" style={{ color: '#1A1A1A' }}>
              Réussir sa reconversion professionnelle : conseils et étapes clés
            </h1>
            
            <p className="text-lg sm:text-xl mb-12 leading-relaxed" style={{ color: '#6B7280' }}>
              Découvrez comment préparer votre changement de carrière, réussir votre réorientation et choisir le bon bilan de compétences.
            </p>

            {/* Hero Image */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/conseils/hero.jpg" 
                  alt="Professionnel réfléchissant à sa reconversion professionnelle"
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%236B8E9E" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23ffffff"%3EReconversion professionnelle%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Pourquoi envisager une reconversion */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Pourquoi de plus en plus d'actifs changent de voie
            </h2>
            
            <div className="flex flex-col md:flex-row items-center gap-12 mb-8">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/conseils/changer-de-voie.jpg" 
                    alt="Changer de voie professionnelle"
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EChanger de voie%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 section-content">
                <p className="section-text">
                  Le besoin de réorientation professionnelle touche aujourd'hui toutes les générations. Envie de sens, fatigue du poste actuel ou simple curiosité de découvrir autre chose — les raisons de changer de métier sont multiples.
                </p>
                <p className="section-text">
                  En France, près d'un actif sur trois déclare vouloir changer de voie. La <strong>reconversion professionnelle</strong> n'est plus un tabou : c'est une étape naturelle pour progresser, se réinventer et retrouver de la motivation au travail.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ Les étapes d'une réorientation réussie */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Comment préparer votre réorientation professionnelle
            </h2>
            
            <div className="section-content mb-8">
              <p className="section-text">
                Une réorientation ne s'improvise pas. Elle commence par une période de réflexion et d'auto-évaluation : quelles compétences avez-vous envie de mobiliser ? Qu'est-ce qui vous motive vraiment ?
              </p>
              <p className="section-text">
                Ensuite vient la phase d'exploration — se renseigner sur les métiers, les formations et les secteurs porteurs. Enfin, il faut établir un plan d'action clair : étapes, délais, financement, accompagnement.
              </p>
            </div>

            {/* 3 étapes visuelles */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 rounded-xl text-center" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                  Faire le point sur soi
                </h3>
                <p className="text-sm text-gray-700">
                  Auto-évaluation et réflexion personnelle
                </p>
              </div>

              <div className="p-6 rounded-xl text-center" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                  Explorer les possibilités
                </h3>
                <p className="text-sm text-gray-700">
                  Recherche de métiers et formations
                </p>
              </div>

              <div className="p-6 rounded-xl text-center" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                  Agir concrètement
                </h3>
                <p className="text-sm text-gray-700">
                  Plan d'action et mise en œuvre
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/conseils/etapes.jpg" 
                  alt="Étapes de la reconversion professionnelle"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500"%3E%3Crect fill="%236B8E9E" width="800" height="500"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EÉtapes de reconversion%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ L'importance d'un bon bilan de compétences */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8">
              Pourquoi un bilan de compétences peut tout changer
            </h2>
            
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/conseils/bilan.jpg" 
                    alt="Bilan de compétences pour reconversion"
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EBilan de comp%C3%A9tences%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 section-content">
                <p className="section-text">
                  Un <strong>bilan de compétences</strong> permet d'analyser ses forces, ses envies et ses possibilités réelles d'évolution. C'est un outil clé pour orienter une <strong>reconversion professionnelle</strong> de manière structurée.
                </p>
                <p className="section-text">
                  Chez Avenirea, nous avons conçu un test rapide, clair et régulièrement mis à jour selon les retours de professionnels, afin de vous offrir une vision précise et actuelle de vos atouts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Nos conseils pratiques */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8 text-center">
              Nos conseils pour réussir votre reconversion
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🌱</span>
                  <div>
                    <p className="font-bold mb-2" style={{ color: '#1A1A1A' }}>
                      Ne cherchez pas la perfection, cherchez la cohérence.
                    </p>
                    <p className="text-sm text-gray-700">
                      Votre nouvelle voie n'a pas besoin d'être parfaite dès le départ.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🔍</span>
                  <div>
                    <p className="font-bold mb-2" style={{ color: '#1A1A1A' }}>
                      Prenez le temps de vous observer, pas de vous juger.
                    </p>
                    <p className="text-sm text-gray-700">
                      L'auto-observation est plus utile que l'auto-critique.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <p className="font-bold mb-2" style={{ color: '#1A1A1A' }}>
                      Fixez des objectifs concrets à court terme.
                    </p>
                    <p className="text-sm text-gray-700">
                      Avancez par petites étapes mesurables et réalistes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💬</span>
                  <div>
                    <p className="font-bold mb-2" style={{ color: '#1A1A1A' }}>
                      Entourez-vous de personnes bienveillantes et ouvertes.
                    </p>
                    <p className="text-sm text-gray-700">
                      Le soutien social est un facteur clé de réussite.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image conseils */}
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/conseils/conseils.jpg" 
                  alt="Conseils pour la reconversion professionnelle"
                  className="w-full h-72 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%236B8E9E" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EConseils pratiques%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 6️⃣ Section finale - Passez à l'action */}
        <section className="py-16 text-center" style={{ background: '#FAFAF8' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
              Vous êtes prêt à passer à l'action ?
            </h2>
            
            <p className="text-lg mb-8" style={{ color: '#6B7280' }}>
              Découvrez votre profil et vos pistes de reconversion dès maintenant.
            </p>
            
            <button
              onClick={() => {
                navigate('/bilan-reconversion-professionnelle');
                window.scrollTo(0, 0);
              }}
              className="px-10 py-4 font-bold text-lg rounded-xl transition-all hover:translate-y-[-2px] mb-6"
              style={{
                background: '#E96A3C',
                color: '#FFFFFF',
                border: '3px solid #1A1A1A',
                boxShadow: '6px 6px 0 #1A1A1A'
              }}
            >
              Faire le test de reconversion
            </button>

            <p className="text-sm" style={{ color: '#6B7280' }}>
              Test rapide, gratuit, et mis à jour selon les tendances de la reconversion professionnelle.
            </p>

            {/* Lien interne SEO */}
            <div className="mt-8 pt-8" style={{ borderTop: '2px solid #E6DCCC' }}>
              <p className="text-sm text-gray-600">
                En savoir plus sur notre{' '}
                <a 
                  href="/bilan-reconversion-professionnelle" 
                  className="font-semibold hover:underline"
                  style={{ color: '#4F8A8B' }}
                >
                  bilan de compétences en ligne
                </a>
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default ConseilsReconversion;

