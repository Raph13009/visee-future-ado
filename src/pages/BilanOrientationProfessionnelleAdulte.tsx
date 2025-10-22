import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BilanOrientationProfessionnelleAdulte = () => {
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
              Bilan d'orientation professionnelle adulte : comment faire le point sur sa carrière ?
            </h1>
            <p className="text-lg sm:text-xl mb-12 leading-relaxed" style={{ color: '#6B7280' }}>
              Vous sentez que votre travail ne vous correspond plus ? Vous avez envie de changement mais sans tout recommencer ? 
              Le bilan d'orientation professionnelle est l'outil parfait pour retrouver du sens et clarifier votre avenir.
            </p>

            {/* Hero Image */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/group-working.jpg" 
                  alt="Bilan d'orientation professionnelle adulte - réflexion sur sa carrière"
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%236B8E9E" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23ffffff"%3EBilan orientation professionnelle%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Introduction */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#1A1A1A' }}>
                Vous sentez que votre travail ne vous correspond plus ? Vous avez envie de changement mais sans tout recommencer ? 
                Le <strong>bilan d'orientation professionnelle</strong> est l'outil parfait pour retrouver du sens et clarifier votre avenir, surtout à l'âge adulte.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/seo/woman-working-suit.jpg" 
                    alt="Professionnelle en réflexion sur son orientation"
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3ER%C3%A9flexion professionnelle%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="p-6 rounded-xl" style={{ background: '#D9D2B6', border: '2px solid #1A1A1A', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                  <h3 className="font-bold text-xl mb-4" style={{ color: '#1A1A1A' }}>
                    Pourquoi un bilan d'orientation à l'âge adulte ?
                  </h3>
                  <ul className="space-y-2" style={{ color: '#2C2C2C' }}>
                    <li>• Comprendre vos motivations profondes</li>
                    <li>• Identifier vos talents naturels</li>
                    <li>• Clarifier vos valeurs professionnelles</li>
                    <li>• Trouver la direction qui vous correspond</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ Comprendre le principe du bilan d'orientation professionnelle */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="section-title mb-8">
              Comprendre le principe du bilan d'orientation professionnelle
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <p className="section-text">
                Contrairement au <strong>bilan de compétences</strong>, souvent plus long et encadré, le <strong>bilan d'orientation professionnelle adulte</strong> aide avant tout à comprendre qui vous êtes : vos motivations, vos talents, vos valeurs, et la manière dont vous aimez travailler.
              </p>
              
              <p className="section-text">
                C'est une étape de réflexion — pas un test scolaire. L'objectif ? <strong>Trouver sa voie</strong> qui vous correspond vraiment, que ce soit pour évoluer dans votre métier ou changer totalement de voie.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #1A1A1A', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#1A1A1A' }}>
                    🎯 Bilan d'orientation
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Focus sur vos motivations, talents et valeurs. Plus court, plus accessible.
                  </p>
                </div>
                
                <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #1A1A1A', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#1A1A1A' }}>
                    📋 Bilan de compétences
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Évaluation approfondie de vos compétences techniques. Plus long, plus encadré.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ Pourquoi faire un bilan d'orientation à l'âge adulte ? */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="section-title mb-8">
              Pourquoi faire un bilan d'orientation à l'âge adulte ?
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <p className="section-text">
                Entre 30 et 55 ans, beaucoup de professionnels ressentent un besoin de sens. Les priorités changent : équilibre de vie, fatigue du métier, envie d'impact, <strong>reconversion professionnelle</strong>…
              </p>
              
              <p className="section-text">
                Faire un <strong>bilan d'orientation professionnelle</strong> permet de :
              </p>
              
              <div className="space-y-4 my-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E96A3C' }}>
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Mieux comprendre vos forces naturelles
                    </h3>
                    <p className="text-base" style={{ color: '#6B7280' }}>
                      Identifier ce qui vous vient naturellement et ce qui vous donne de l'énergie au travail.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E96A3C' }}>
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Identifier des métiers compatibles avec votre personnalité
                    </h3>
                    <p className="text-base" style={{ color: '#6B7280' }}>
                      Découvrir des <strong>orientations métier</strong> qui correspondent vraiment à qui vous êtes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E96A3C' }}>
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Vous projeter dans une voie réaliste et motivante
                    </h3>
                    <p className="text-base" style={{ color: '#6B7280' }}>
                      Construire un plan d'action concret pour votre évolution professionnelle.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/seo/man-working-laptop.jpg" 
                  alt="Professionnel en réflexion sur son orientation"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500"%3E%3Crect fill="%236B8E9E" width="800" height="500"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3ER%C3%A9flexion carri%C3%A8re%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Comment se déroule un bon bilan d'orientation ? */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="section-title mb-8">
              Comment se déroule un bon bilan d'orientation ?
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <p className="section-text">
                Un bon accompagnement se fait en plusieurs étapes :
              </p>
              
              <div className="bg-white p-8 rounded-2xl my-8" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#E96A3C' }}>
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>
                        Auto-analyse
                      </h3>
                      <p className="text-base" style={{ color: '#6B7280' }}>
                        Tests, questionnaires, discussions pour mieux vous connaître
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#E96A3C' }}>
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>
                        Exploration
                      </h3>
                      <p className="text-base" style={{ color: '#6B7280' }}>
                        Découverte de secteurs et métiers possibles qui vous correspondent
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#E96A3C' }}>
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>
                        Projection
                      </h3>
                      <p className="text-base" style={{ color: '#6B7280' }}>
                        Création d'un plan d'action concret pour votre évolution
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="section-text">
                Certaines personnes passent par un coach, d'autres préfèrent commencer seules avec un <strong>test d'orientation professionnelle adulte</strong> en ligne. 
                C'est une excellente première étape, simple et rapide.
              </p>
            </div>
          </div>
        </section>

        {/* 6️⃣ Le lien entre orientation et reconversion professionnelle */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="section-title mb-8">
              Le lien entre orientation et reconversion professionnelle
            </h2>
            
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-8">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/seo/group-working-laptop.jpg" 
                    alt="Équipe en reconversion professionnelle"
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EReconversion professionnelle%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 section-content">
                <p className="section-text">
                  Un <strong>bilan d'orientation professionnelle adulte</strong> est souvent la première marche vers une <strong>reconversion professionnelle</strong>. 
                  Il aide à transformer la confusion en clarté : au lieu de tout quitter sur un coup de tête, vous comprenez ce qui vous motive profondément.
                </p>
                <p className="section-text">
                  Il ne s'agit pas seulement de trouver un nouveau métier, mais de construire une vie professionnelle plus alignée.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7️⃣ Faire le point gratuitement avec Avenirea */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="section-title mb-8">
              Faire le point gratuitement avec Avenirea
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <p className="section-text">
                Avant d'investir dans un accompagnement long, vous pouvez commencer avec un <strong>test d'orientation gratuit</strong> sur Avenirea. 
                En quelques minutes, vous découvrez votre profil, vos points forts et des pistes de métiers compatibles.
              </p>
              
              <p className="section-text">
                Un bon moyen de reprendre confiance et de passer à l'action sereinement.
              </p>
              
              <div className="bg-white p-8 rounded-2xl my-8" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <h3 className="font-bold text-xl mb-4" style={{ color: '#1A1A1A' }}>
                  Pourquoi commencer par Avenirea ?
                </h3>
                <ul className="space-y-3" style={{ color: '#2C2C2C' }}>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Test gratuit et accessible en ligne</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Résultats instantanés et personnalisés</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Pistes de métiers concrètes et réalistes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Première étape avant un accompagnement plus poussé</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8️⃣ Section finale - CTA */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <div 
              className="text-center p-12 rounded-2xl"
              style={{
                background: '#D9D2B6',
                border: '3px solid #1A1A1A',
                boxShadow: '8px 8px 0 #1A1A1A'
              }}
            >
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#1A1A1A' }}>
                Prêt à faire le point sur votre orientation ?
              </h2>
              
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
                Faire un <strong>bilan d'orientation professionnelle adulte</strong>, c'est prendre un moment pour soi. 
                Pas pour tout changer du jour au lendemain, mais pour choisir en conscience la prochaine étape de votre vie.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  Faire le test gratuit
                </button>
                
                <button
                  onClick={() => {
                    navigate('/conseils-reconversion-professionnelle');
                    window.scrollTo(0, 0);
                  }}
                  className="px-8 py-4 font-bold text-lg rounded-xl transition-all hover:translate-y-[-2px]"
                  style={{
                    background: '#FFFFFF',
                    color: '#2C2C2C',
                    border: '3px solid #1A1A1A',
                    boxShadow: '6px 6px 0 #1A1A1A'
                  }}
                >
                  Nos conseils reconversion
                </button>
              </div>
              
              <p className="text-sm mt-6" style={{ color: '#6B7280' }}>
                Test gratuit • Résultats instantanés • Adapté aux adultes
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BilanOrientationProfessionnelleAdulte;
