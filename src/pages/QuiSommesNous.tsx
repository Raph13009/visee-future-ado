import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const QuiSommesNous = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: '#F5F1E8' }}>
      <Header />
      
      <main className="pt-24 pb-16 px-6">
        
        {/* 1️⃣ Hero Section */}
        <section className="text-center py-16 max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6 max-w-4xl mx-auto" style={{ color: '#1A1A1A' }}>
            Avenirea, la plateforme qui réinvente la reconversion professionnelle
          </h1>
          
          <p className="text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed" style={{ color: '#6B7280' }}>
            Nos bilans et tests d'orientation ont été conçus pour offrir des résultats rapides, précis et réellement utiles à chaque étape d'un parcours professionnel.
          </p>

          {/* Hero Image */}
          <div className="max-w-sm md:max-w-md mx-auto mb-12">
            <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)' }}>
              <img 
                src="/about/hero.jpg" 
                alt="Professionnel en réflexion sur son parcours"
                className="w-full h-80 md:h-[500px] object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={600}
                height={800}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="800"%3E%3Crect fill="%236B8E9E" width="600" height="800"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" fill="%23ffffff"%3EProfessionnel en r%C3%A9flexion%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>
        </section>

        {/* 2️⃣ Notre approche */}
        <section className="py-16 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/about/approche.jpg" 
                  alt="Approche moderne de l'orientation professionnelle"
                  className="w-full h-72 object-cover"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={600}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3ENotre approche%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 text-left">
              <h2 className="section-title mb-6">
                Une approche simple, rapide et toujours en évolution
              </h2>
              <p className="section-text mb-4">
                Avenirea n'est pas un centre de formation, ni une agence.
              </p>
              <p className="section-text mb-4">
                C'est une plateforme qui investit constamment dans la recherche et le développement de tests professionnels fiables et accessibles.
              </p>
              <p className="section-text">
                Chaque test est pensé pour offrir une expérience rapide et efficace, réadaptée régulièrement selon les tendances de la <strong>reconversion</strong> et les retours de professionnels du secteur.
              </p>
            </div>
          </div>
        </section>

        {/* 3️⃣ Pourquoi nos bilans fonctionnent */}
        <section className="py-16 max-w-6xl mx-auto">
          <h2 className="section-title mb-12 text-center">
            Des bilans de compétences réinventés
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 - Rapidité */}
            <div className="p-6 rounded-xl text-center" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
                Rapidité
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Des tests courts mais complets, conçus pour donner des résultats concrets en quelques minutes.
              </p>
            </div>

            {/* Card 2 - Fiabilité */}
            <div className="p-6 rounded-xl text-center" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
                Fiabilité
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Des questions inspirées de la méthode RIASEC, continuellement améliorées selon les données recueillies.
              </p>
            </div>

            {/* Card 3 - Évolution */}
            <div className="p-6 rounded-xl text-center" style={{ background: '#FFFFFF', border: '2px solid #E6DCCC', boxShadow: '0 6px 0 rgba(0,0,0,0.08)' }}>
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#1A1A1A' }}>
                Évolution
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Nos bilans sont mis à jour plusieurs fois par an pour suivre les réalités du marché de l'emploi.
              </p>
            </div>
          </div>
        </section>

        {/* 4️⃣ Une mission simple */}
        <section className="py-16 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="w-full md:w-1/2">
              <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 rgba(0,0,0,0.1)' }}>
                <img 
                  src="/about/mission.jpg" 
                  alt="Mission Avenirea - Accompagnement professionnel"
                  className="w-full h-72 object-cover"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={600}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3ENotre mission%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/2 text-left">
              <h2 className="section-title mb-6">
                Redonner confiance à ceux qui cherchent leur voie
              </h2>
              <p className="section-text mb-4">
                Que vous envisagiez une <strong>reconversion professionnelle</strong>, un <strong>bilan de compétences</strong> ou une nouvelle <strong>orientation</strong>,
              </p>
              <p className="section-text mb-4">
                Avenirea a été pensée pour vous aider à prendre les bonnes décisions, sans jargon ni perte de temps.
              </p>
              <p className="section-text">
                Nos outils sont faits pour les personnes qui veulent avancer vite, avec clarté.
              </p>
            </div>
          </div>
        </section>

        {/* 5️⃣ CTA Final */}
        <section className="py-16 text-center" style={{ background: '#FAFAF8' }}>
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#1A1A1A' }}>
              Essayez gratuitement votre test de reconversion professionnelle
            </h2>
            
            <p className="text-lg mb-8" style={{ color: '#6B7280' }}>
              Un test rapide, précis et conçu pour vous donner des pistes concrètes dès maintenant.
            </p>
            
            <button
              onClick={() => {
                navigate('/bilan-reconversion-professionnelle');
                window.scrollTo(0, 0);
              }}
              className="px-10 py-4 font-bold text-lg rounded-xl transition-all hover:translate-y-[-2px]"
              style={{
                background: '#E96A3C',
                color: '#FFFFFF',
                border: '3px solid #1A1A1A',
                boxShadow: '6px 6px 0 #1A1A1A'
              }}
            >
              Découvrir le test
            </button>
          </div>
        </section>

        {/* Section Réseaux Sociaux */}
        <section className="py-12 text-center">
          <div className="max-w-xl mx-auto px-6">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#1A1A1A' }}>
              Suivez-nous
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://www.instagram.com/avenirea/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-base rounded-xl transition-all hover:translate-y-[-2px]"
                style={{
                  background: 'linear-gradient(135deg, #E4405F 0%, #C13584 100%)',
                  color: '#FFFFFF',
                  border: '3px solid #1A1A1A',
                  boxShadow: '5px 5px 0 #1A1A1A',
                  textDecoration: 'none'
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
              
              <a
                href="https://www.tiktok.com/@avenirea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 font-bold text-base rounded-xl transition-all hover:translate-y-[-2px]"
                style={{
                  background: '#000000',
                  color: '#FFFFFF',
                  border: '3px solid #1A1A1A',
                  boxShadow: '5px 5px 0 #1A1A1A',
                  textDecoration: 'none'
                }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default QuiSommesNous;
