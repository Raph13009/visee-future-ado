import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TestOrientationProfessionnelleAdulte = () => {
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
              Test orientation professionnelle adulte : retrouvez votre voie
            </h1>
            <p className="text-lg sm:text-xl mb-12 leading-relaxed" style={{ color: '#6B7280' }}>
              Comment savoir si vous êtes encore fait pour votre métier actuel ? Découvrez comment un test d'orientation professionnelle peut vous aider à clarifier vos envies et vos compétences.
            </p>

            {/* Hero Image */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/seo/orientation.jpg" 
                  alt="Test orientation professionnelle adulte - retrouvez votre voie"
                  className="w-full h-80 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="600"%3E%3Crect fill="%236B8E9E" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23ffffff"%3ETest orientation professionnelle%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ Introduction - Le défi de l'orientation à l'âge adulte */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <p className="text-lg leading-relaxed mb-6" style={{ color: '#1A1A1A' }}>
                À 35, 40 ou 50 ans, la question de l'<strong>orientation professionnelle</strong> se pose différemment qu'à 20 ans. 
                Vous avez de l'expérience, des compétences, mais aussi des doutes : "Suis-je encore à ma place ?" 
                "Y a-t-il un <strong>métier reconversion</strong> qui me correspondrait mieux ?"
              </p>
              <p className="text-lg leading-relaxed" style={{ color: '#1A1A1A' }}>
                C'est là qu'un <strong>test orientation professionnelle adulte</strong> devient précieux. 
                Contrairement aux tests classiques, il prend en compte votre parcours, vos acquis et vos aspirations d'adulte.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/seo/bilan.jpg" 
                    alt="Bilan de compétences pour adultes"
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EBilan de comp%C3%A9tences%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="p-6 rounded-xl" style={{ background: '#D9D2B6', border: '2px solid #1A1A1A', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
                  <h3 className="font-bold text-xl mb-4" style={{ color: '#1A1A1A' }}>
                    Pourquoi un test d'orientation à l'âge adulte ?
                  </h3>
                  <ul className="space-y-2" style={{ color: '#2C2C2C' }}>
                    <li>• Prend en compte votre expérience professionnelle</li>
                    <li>• Identifie vos compétences transférables</li>
                    <li>• Évalue vos motivations profondes</li>
                    <li>• Propose des pistes réalistes et concrètes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ Qu'est-ce qu'un test d'orientation professionnelle ? */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="section-title mb-8">
              Qu'est-ce qu'un test d'orientation professionnelle ?
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <p className="section-text">
                Un <strong>test pour savoir son orientation professionnelle</strong> est un outil d'évaluation qui analyse vos :
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #1A1A1A', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#1A1A1A' }}>
                    🎯 Intérêts professionnels
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Quels domaines vous passionnent vraiment ? Quelles activités vous donnent de l'énergie ?
                  </p>
                </div>
                
                <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #1A1A1A', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#1A1A1A' }}>
                    💪 Compétences et talents
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Quelles sont vos forces naturelles ? Quelles compétences pouvez-vous valoriser ?
                  </p>
                </div>
                
                <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #1A1A1A', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#1A1A1A' }}>
                    🌟 Valeurs au travail
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Qu'est-ce qui compte vraiment pour vous ? Autonomie, sécurité, créativité, impact social ?
                  </p>
                </div>
                
                <div className="p-6 rounded-xl" style={{ background: '#FFFFFF', border: '2px solid #1A1A1A', boxShadow: '0 4px 0 rgba(0,0,0,0.1)' }}>
                  <h3 className="font-bold text-lg mb-3" style={{ color: '#1A1A1A' }}>
                    🚀 Potentiel d'évolution
                  </h3>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    Vers quels métiers pouvez-vous évoluer ? Quelles formations vous correspondent ?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ Pourquoi les adultes ont besoin d'un test d'orientation ? */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="section-title mb-8">
              Pourquoi les adultes ont besoin d'un test d'orientation ?
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <p className="section-text">
                Contrairement aux jeunes diplômés, les adultes en questionnement professionnel font face à des défis spécifiques :
              </p>
              
              <div className="space-y-6 my-8">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E96A3C' }}>
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Perte de sens au travail
                    </h3>
                    <p className="text-base" style={{ color: '#6B7280' }}>
                      Après des années dans le même secteur, vous vous demandez si votre travail a encore du sens. 
                      Un <strong>test orientation professionnelle</strong> vous aide à identifier des métiers plus alignés avec vos valeurs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E96A3C' }}>
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Burnout et fatigue professionnelle
                    </h3>
                    <p className="text-base" style={{ color: '#6B7280' }}>
                      Le stress chronique peut masquer vos vrais intérêts. Un test vous aide à faire le point 
                      et à envisager une <strong>reconversion professionnelle</strong> adaptée à votre profil.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#E96A3C' }}>
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1A1A1A' }}>
                      Évolution du marché du travail
                    </h3>
                    <p className="text-base" style={{ color: '#6B7280' }}>
                      De nouveaux métiers émergent, d'autres disparaissent. Un test d'orientation vous aide 
                      à identifier les secteurs porteurs et les compétences à développer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/seo/reconversion.jpg" 
                  alt="Reconversion professionnelle adulte"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500"%3E%3Crect fill="%236B8E9E" width="800" height="500"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EReconversion professionnelle%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Comment interpréter les résultats ? */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="section-title mb-8">
              Comment interpréter les résultats de votre test d'orientation ?
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <p className="section-text">
                Un bon <strong>test orientation professionnelle adulte</strong> ne se contente pas de vous dire "vous êtes fait pour tel métier". 
                Il vous donne des pistes concrètes et des étapes pour avancer.
              </p>
              
              <div className="bg-white p-8 rounded-2xl my-8" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <h3 className="font-bold text-xl mb-6" style={{ color: '#1A1A1A' }}>
                  Les 4 étapes après votre test :
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#E96A3C' }}>
                      <span className="text-white font-bold text-xs">1</span>
                    </div>
                    <p className="text-base" style={{ color: '#2C2C2C' }}>
                      <strong>Analyser votre profil</strong> : Comprendre vos forces, vos motivations et vos zones d'amélioration
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#E96A3C' }}>
                      <span className="text-white font-bold text-xs">2</span>
                    </div>
                    <p className="text-base" style={{ color: '#2C2C2C' }}>
                      <strong>Identifier les métiers correspondants</strong> : Découvrir 3-5 pistes professionnelles qui vous correspondent
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#E96A3C' }}>
                      <span className="text-white font-bold text-xs">3</span>
                    </div>
                    <p className="text-base" style={{ color: '#2C2C2C' }}>
                      <strong>Faire un bilan de compétences</strong> : Évaluer ce que vous savez déjà et ce qu'il vous reste à apprendre
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#E96A3C' }}>
                      <span className="text-white font-bold text-xs">4</span>
                    </div>
                    <p className="text-base" style={{ color: '#2C2C2C' }}>
                      <strong>Définir un plan d'action</strong> : Établir les étapes concrètes pour votre transition professionnelle
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6️⃣ Pourquoi choisir Avenirea pour votre test d'orientation ? */}
        <section className="content-section">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="section-title mb-8">
              Pourquoi choisir Avenirea pour votre test d'orientation ?
            </h2>
            
            <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-8">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                  <img 
                    src="/worker-aged-40.jpg" 
                    alt="Test orientation professionnelle Avenirea"
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3ETest Avenirea%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 section-content">
                <p className="section-text">
                  Chez Avenirea, nous avons conçu un <strong>test orientation professionnelle</strong> spécialement adapté aux adultes :
                </p>
                
                <ul className="space-y-3 my-6" style={{ color: '#2C2C2C' }}>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Prend en compte votre expérience professionnelle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Résultats personnalisés et détaillés</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Pistes de métiers réalistes et accessibles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span>Accompagnement personnalisé possible</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 7️⃣ Section finale - CTA */}
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
                Prêt à découvrir votre orientation professionnelle ?
              </h2>
              
              <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
                Faites notre test d'orientation professionnelle et découvrez les métiers qui vous correspondent vraiment. 
                Test rapide, gratuit, et adapté aux adultes en questionnement.
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
                  Faire le test maintenant
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

export default TestOrientationProfessionnelleAdulte;
