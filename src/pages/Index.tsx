import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CgvModal from "@/components/checkout/CgvModal";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);
  const [showCgvModal, setShowCgvModal] = useState(false);

  const benefits = [
    {
      icon: "🎯",
      title: "Un test clair et intelligent",
      description: "Conçu spécialement pour les ados, sans jargon compliqué"
    },
    {
      icon: "📋",
      title: "Un rapport personnalisé",
      description: "Agréable à lire, avec des pistes concrètes pour votre avenir"
    },
    {
      icon: "🗣️",
      title: "Un appel humain en français",
      description: "30 minutes avec un vrai coach pour affiner vos options"
    },
    {
      icon: "💰",
      title: "Prix mini, impact maxi",
      description: "18€ seulement pour débloquer votre orientation"
    }
  ];

  const testimonials = [
    {
      text: "Je me sentais perdu, j'ai adoré recevoir un plan concret après l'appel.",
      author: "Lucas, 17 ans",
      emoji: "😊"
    },
    {
      text: "Enfin un truc qui parle à mon fils et l'aide sans prise de tête.",
      author: "Delphine, maman d'Emma",
      emoji: "👩‍👧"
    }
  ];

  const faqs = [
    {
      question: "Combien de temps dure le test ?",
      answer: "Le questionnaire prend environ 10-15 minutes. Vous pouvez le faire à votre rythme et même le mettre en pause si besoin."
    },
    {
      question: "Que contient le rapport personnalisé ?",
      answer: "Votre rapport inclut vos points forts, des suggestions de filières, des métiers qui vous correspondent, et des prochaines étapes concrètes."
    },
    {
      question: "Comment se passe l'appel coaching ?",
      answer: "Un appel de 30 minutes par téléphone ou visio, où le coach reprend votre rapport avec vous et répond à toutes vos questions."
    }
  ];


  return (
    <div className="min-h-screen" style={{ background: '#F5F1E8' }}>
      <Header />
      <CgvModal open={showCgvModal} onClose={() => setShowCgvModal(false)} />
      
      {/* Hero Section - Elegant & Professional */}
      <section className="text-center px-6 pt-24 sm:pt-28 pb-16" style={{ background: '#F5F1E8', color: '#1A1A1A' }}>
        <div className="max-w-4xl mx-auto">
          
          {/* Elegant Badge */}
          <div className="flex justify-center mb-8">
            <span 
              className="inline-block text-xs font-semibold px-4 py-2 rounded-full"
              style={{ 
                background: '#D9D2B6', 
                border: '2px solid #1A1A1A',
                boxShadow: '0 3px 0 rgba(0,0,0,0.1)',
                letterSpacing: '0.5px',
                color: '#2C2C2C'
              }}
            >
              Bilan en ligne certifié
            </span>
          </div>
          
          {/* H1 Title - SEO Optimized */}
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight mb-6 max-w-3xl mx-auto">
            Bilan de compétences et reconversion professionnelle
          </h1>
          
          {/* Refined Subtitle */}
          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
            Clarifiez vos forces, définissez vos objectifs et transformez votre avenir professionnel.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex justify-center gap-4 flex-wrap mb-8">
            <button
              onClick={() => navigate('/bilan-competences-tous-publics')}
              className="px-8 py-4 font-bold text-base rounded-xl transition-all hover:translate-y-[1px] text-white"
              style={{ 
                background: '#E96A3C',
                boxShadow: '0 6px 0 rgba(233, 106, 60, 0.3)'
              }}
              aria-label="Commencer le test de bilan de compétences"
            >
              Commencer le test
            </button>
            
            <button
              onClick={() => {
                document.querySelector('#exemple-rapport')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 font-semibold text-base rounded-xl transition-all"
              style={{ 
                background: 'transparent',
                border: '2px solid #E6DCCC',
                color: '#2C2C2C'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#4F8A8B';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#2C2C2C';
              }}
              aria-label="Voir un exemple de rapport"
            >
              Voir un exemple de rapport
            </button>
          </div>
          
          {/* Inline Reassurance (no box) */}
          <p className="text-sm mt-6" style={{ color: '#9CA3AF' }}>
            1 actif sur 3 souhaite changer de métier selon France Compétences
          </p>
          
        </div>
      </section>

      {/* Bilan Section */}
      <section className="bilan-section">
        <div className="bilan-grid">
          <div className="bilan-card">
            <img 
              src="/scolar.png" 
              alt="Bilan d'orientation scolaire"
              className="bilan-card-image"
            />
            <div className="bilan-card-content">
              <h3 className="bilan-card-title">
                Bilan d'orientation scolaire
              </h3>
              <button 
                className="bilan-button"
                onClick={() => {
                  navigate('/bilan-orientation-scolaire');
                  window.scrollTo(0, 0);
                }}
              >
                EN SAVOIR PLUS
              </button>
            </div>
          </div>

          <div className="bilan-card">
            <img 
              src="/professional.png" 
              alt="Bilan de compétences — reconversion professionnelle"
              className="bilan-card-image"
            />
            <div className="bilan-card-content">
              <h3 className="bilan-card-title">
                Bilan de compétences — reconversion professionnelle
              </h3>
              <button 
                className="bilan-button"
                onClick={() => {
                  navigate('/bilan-reconversion-professionnelle');
                  window.scrollTo(0, 0);
                }}
              >
                EN SAVOIR PLUS
              </button>
            </div>
          </div>

          <div className="bilan-card">
            <img 
              src="/other.png" 
              alt="Bilan de compétences tous publics"
              className="bilan-card-image"
            />
            <div className="bilan-card-content">
              <h3 className="bilan-card-title">
                Bilan de compétences tous publics
              </h3>
              <button 
                className="bilan-button"
                onClick={() => {
                  navigate('/bilan-competences-tous-publics');
                  window.scrollTo(0, 0);
                }}
              >
                EN SAVOIR PLUS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Section - Reconversion, Bilan, Orientation */}
      <section className="py-20" style={{ background: '#F5F1E8' }}>
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: '#1A1A1A', letterSpacing: '-0.02em' }}>
              Trouver sa voie, évoluer, se réinventer.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Que vous cherchiez à changer de métier, à faire un bilan de compétences ou à clarifier votre orientation professionnelle, Avenirea vous accompagne à chaque étape.
            </p>
          </div>

          <div className="space-y-16">
            {/* Bloc 1 - Reconversion professionnelle (Image à gauche) */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0px rgba(0,0,0,0.15)' }}>
                  <img 
                    src="/seo/reconversion.jpg" 
                    alt="Reconversion professionnelle"
                    className="w-full h-64 md:h-80 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EReconversion%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#D4B16A' }}>
                  Reconversion professionnelle : redonner du sens à sa carrière
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                  Changer de métier n'est plus une exception : c'est une évolution naturelle.
                </p>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                  La <strong>reconversion professionnelle</strong> permet de retrouver de la motivation, de transformer ses compétences et de se réaligner avec ses valeurs.
                </p>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  Grâce à nos bilans et à la méthode RIASEC, Avenirea vous aide à identifier vos forces et les secteurs qui vous correspondent vraiment.
                </p>
              </div>
            </div>
            
            {/* Bloc 2 - Bilan de compétences (Image à droite) */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0px rgba(0,0,0,0.15)' }}>
                  <img 
                    src="/seo/bilan.jpg" 
                    alt="Bilan de compétences"
                    className="w-full h-64 md:h-80 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EBilan de comp%C3%A9tences%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#D4B16A' }}>
                  Bilan de compétences : comprendre son potentiel
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                  Le <strong>bilan de compétences</strong> est une étape clé pour prendre du recul et construire un projet professionnel solide.
                </p>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                  Nos tests et accompagnements vous permettent d'évaluer vos aptitudes, vos motivations et vos pistes d'évolution concrètes.
                </p>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  C'est un point de départ essentiel avant toute formation ou changement de voie.
                </p>
              </div>
            </div>

            {/* Bloc 3 - Orientation professionnelle (Image à gauche) */}
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden" style={{ border: '3px solid #1A1A1A', boxShadow: '6px 6px 0px rgba(0,0,0,0.15)' }}>
                  <img 
                    src="/seo/orientation.jpg" 
                    alt="Orientation professionnelle"
                    className="w-full h-64 md:h-80 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%236B8E9E" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EOrientation%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#D4B16A' }}>
                  Orientation professionnelle : faire les bons choix
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                  Pour les étudiants, jeunes actifs ou professionnels en transition, l'<strong>orientation professionnelle</strong> reste un moment décisif.
                </p>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                  Nos bilans d'orientation utilisent des outils reconnus pour clarifier vos choix d'études, de formation ou de carrière.
                </p>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  Avec Avenirea, trouvez la voie qui vous ressemble et prenez confiance en vos décisions.
                </p>
              </div>
            </div>
          </div>

          {/* CTA en bas de section */}
          <div className="text-center mt-16">
            <button
              onClick={() => {
                navigate('/bilan-reconversion-professionnelle');
                window.scrollTo(0, 0);
              }}
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-lg transition-all hover:translate-x-1"
              style={{ 
                background: '#E96A3C', 
                color: '#FFFFFF', 
                border: '3px solid #1A1A1A', 
                boxShadow: '6px 6px 0 #1A1A1A',
                borderRadius: '12px'
              }}
            >
              Découvrir nos bilans
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section id="exemple-rapport" className="neo-section" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-container">
          <div className="text-center mb-16">
            <h2 className="neo-heading neo-heading-lg mb-6">
              Exemple de résultats pour un bilan d'orientation scolaire
            </h2>
            <div className="inline-block px-8 py-4 rounded-xl font-bold text-base" 
                 style={{ 
                   background: '#D9D2B6', 
                   color: '#2C2C2C', 
                   border: '2px solid #1A1A1A', 
                   boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
                 }}>
              <span className="font-bold">Aperçu gratuit</span> de ce que vous obtiendrez - rapport complet disponible après le test !
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto space-y-20">
            {/* Capture 1 - Profil RIASEC - Image à gauche */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Titre mobile uniquement */}
              <div className="lg:hidden w-full text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3">
                  <span className="text-4xl mb-2 sm:mb-0">🧠</span>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800 leading-tight">
                    Le profil RIASEC + Traits de&nbsp;personnalité
                  </h3>
                </div>
              </div>
              
              <div className="flex-1 lg:max-w-lg">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-lg">
                  <img 
                    src="/result1.png" 
                    alt="Profil RIASEC et traits de personnalité"
                    className="w-full h-auto rounded-xl shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                {/* Titre desktop uniquement */}
                <div className="hidden lg:flex items-center justify-start gap-3 mb-6">
                  <span className="text-3xl">🧠</span>
                  <h3 className="font-bold text-2xl text-gray-800">
                    Le profil RIASEC + Traits de personnalité
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <p className="font-bold text-xl text-primary">Découvre ton profil unique</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Une combinaison de traits qui révèle ton potentiel et ta manière de penser. 
                    Fini les tests génériques - obtiens un profil détaillé qui te ressemble vraiment.
                  </p>
                </div>
              </div>
            </div>

            {/* Capture 2 - Compétences - Image à droite */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              {/* Titre mobile uniquement */}
              <div className="lg:hidden w-full text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-3xl">📊</span>
                  <h3 className="font-bold text-xl text-gray-800">
                    Compétences + Reco formations
                  </h3>
                </div>
              </div>
              
              <div className="flex-1 lg:max-w-lg">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-lg">
                  <img 
                    src="/result2.png" 
                    alt="Radar des compétences et recommandations formations"
                    className="w-full h-auto rounded-xl shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                {/* Titre desktop uniquement */}
                <div className="hidden lg:flex items-center justify-start gap-3 mb-6">
                  <span className="text-3xl">📊</span>
                  <h3 className="font-bold text-2xl text-gray-800">
                    Compétences + Reco formations
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <p className="font-bold text-xl text-primary">Visualise tes points forts</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Un radar clair qui met en lumière tes compétences naturelles + des pistes de formation 
                    adaptées à tes talents. Plus de doutes sur tes capacités !
                  </p>
                </div>
              </div>
            </div>

            {/* Capture 3 - Métiers - Image à gauche */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Titre mobile uniquement */}
              <div className="lg:hidden w-full text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <span className="text-3xl">🧑‍💼</span>
                  <h3 className="font-bold text-xl text-gray-800">
                    Métiers qui te correspondent
                  </h3>
                </div>
              </div>
              
              <div className="flex-1 lg:max-w-lg">
                <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-6 shadow-lg">
                  <img 
                    src="/result3.png" 
                    alt="Métiers correspondant au profil"
                    className="w-full h-auto rounded-xl shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex-1 text-center lg:text-left">
                {/* Titre desktop uniquement */}
                <div className="hidden lg:flex items-center justify-start gap-3 mb-6">
                  <span className="text-3xl">🧑‍💼</span>
                  <h3 className="font-bold text-2xl text-gray-800">
                    Métiers qui te correspondent
                  </h3>
                </div>
                
                <div>
                  <p className="font-bold text-xl text-primary mb-4">Des métiers concrets pour toi</p>
                  <p className="text-gray-600 text-lg leading-relaxed mb-16">
                    Pas de théorie : découvre les jobs alignés avec qui tu es vraiment. 
                    Des suggestions précises avec les débouchés et salaires moyens.
                  </p>
                  
                  {/* Titre CTA */}
                  <div className="mb-6 text-center">
                    <h3 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: '#1A1A1A' }}>
                      Fais ton test maintenant
                    </h3>
                    <div className="w-16 h-1 mx-auto" style={{ background: '#E96A3C' }}></div>
                  </div>
                  
                  {/* CTAs Neobrutalism */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        navigate('/bilan-orientation-scolaire');
                        window.scrollTo(0, 0);
                      }}
                      className="flex-1 px-6 py-4 font-bold text-base rounded-xl transition-all hover:translate-x-1"
                      style={{
                        background: '#A1B5D8',
                        color: '#1A1A1A',
                        border: '3px solid #1A1A1A',
                        boxShadow: '6px 6px 0 #1A1A1A'
                      }}
                    >
                      Test orientation scolaire
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/bilan-reconversion-professionnelle');
                        window.scrollTo(0, 0);
                      }}
                      className="flex-1 px-6 py-4 font-bold text-base rounded-xl transition-all hover:translate-x-1"
                      style={{
                        background: '#E8C785',
                        color: '#1A1A1A',
                        border: '3px solid #1A1A1A',
                        boxShadow: '6px 6px 0 #1A1A1A'
                      }}
                    >
                      Test reconversion pro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pause bien-être Section - Neobrutalism Style */}
      <section className="py-16 px-4" style={{ background: 'linear-gradient(to bottom right, #FAF5FF, #FDF4FF)' }}>
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-6 py-3 rounded-xl" style={{ background: '#FFFFFF', border: '3px solid #DDD6FE', boxShadow: '5px 5px 0 rgba(124, 58, 237, 0.15)' }}>
              <h2 className="text-2xl md:text-3xl font-black" style={{ color: '#7C3AED' }}>
                🎨 Pause bien-être
              </h2>
            </div>
            <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#6B21A8' }}>
              <span className="font-semibold">Prends une vraie pause</span> • 
              <span> Pose ton téléphone</span> • 
              <span> Reconnecte-toi à toi-même</span>
            </p>
          </div>

          {/* Content - Mobile First */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Image du livre */}
            <div className="w-full lg:w-1/2 lg:max-w-md">
              <div className="relative">
                <div className="rounded-2xl overflow-hidden p-4" style={{ background: '#FFFFFF', border: '3px solid #DDD6FE', boxShadow: '8px 8px 0 rgba(124, 58, 237, 0.15)' }}>
                  <img 
                    src="/cover-fr.png" 
                    alt="Cute & Cozy Worlds - Livre de coloriage pour la relaxation"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
                <div className="absolute -top-3 -right-3 px-4 py-2 rounded-lg font-black text-xs" style={{ background: '#EC4899', color: '#FFFFFF', border: '2px solid #C026D3', boxShadow: '3px 3px 0 rgba(236, 72, 153, 0.2)' }}>
                  NOUVEAU
                </div>
              </div>
            </div>

            {/* Contenu textuel */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="space-y-6">
                
                <h3 className="text-2xl md:text-3xl font-black mb-4" style={{ color: '#7C3AED' }}>
                  Cute & Cozy Worlds
                </h3>
                
                <p className="text-base md:text-lg leading-relaxed mb-4" style={{ color: '#6B21A8' }}>
                  <span className="font-semibold">Scientifiquement prouvé :</span> le coloriage réduit le stress de 68%, 
                  améliore la concentration et libère de la <span className="font-semibold" style={{ color: '#EC4899' }}>dopamine</span> - 
                  l'hormone du bien-être.
                </p>
                
                <p className="text-base leading-relaxed" style={{ color: '#7C3AED' }}>
                  Un moment de <span className="font-semibold">créativité apaisante</span> pour ados, étudiants et adultes. 
                  Parfait pour une <span className="font-semibold">hygiène mentale simple et efficace</span>.
                </p>

                {/* CTA Button */}
                <div className="mt-6">
                  <button 
                    onClick={() => window.open('https://www.amazon.fr/dp/B0FHW8CJ92', '_blank')}
                    className="px-8 py-4 font-bold text-base md:text-lg rounded-xl transition-all hover:translate-y-[-2px]"
                    style={{ 
                      background: 'linear-gradient(135deg, #EC4899 0%, #7C3AED 100%)',
                      color: '#FFFFFF',
                      border: '3px solid #C026D3',
                      boxShadow: '6px 6px 0 rgba(124, 58, 237, 0.2)'
                    }}
                  >
                    Acheter pour 7,99 €
                  </button>
                  <p className="text-sm mt-3" style={{ color: '#7C3AED' }}>
                    ✨ Livraison gratuite Amazon Prime
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-6">
                  <span className="px-3 py-2 rounded-lg font-semibold text-sm" style={{ background: '#FAF5FF', border: '2px solid #7C3AED', color: '#7C3AED' }}>
                    Concentration
                  </span>
                  <span className="px-3 py-2 rounded-lg font-semibold text-sm" style={{ background: '#FAF5FF', border: '2px solid #7C3AED', color: '#7C3AED' }}>
                    Apaisement
                  </span>
                  <span className="px-3 py-2 rounded-lg font-semibold text-sm" style={{ background: '#FAF5FF', border: '2px solid #7C3AED', color: '#7C3AED' }}>
                    Créativité
                  </span>
                  <span className="px-3 py-2 rounded-lg font-semibold text-sm" style={{ background: '#FAF5FF', border: '2px solid #7C3AED', color: '#7C3AED' }}>
                    Pause digitale
                  </span>
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefices" className="neo-section" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-container">
          <div className="text-center mb-12">
            <h2 className="neo-heading neo-heading-lg mb-4">
              Pourquoi choisir Avenirea ?
            </h2>
            <p className="neo-text-muted text-xl max-w-2xl mx-auto">
              Une approche unique qui combine technologie et accompagnement humain
            </p>
          </div>
          
          <div className="neo-grid neo-grid-4 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="neo-card group cursor-pointer"
                onMouseEnter={() => setHoveredBenefit(index)}
                onMouseLeave={() => setHoveredBenefit(null)}
              >
                <div className="text-center">
                  <div className={`text-4xl mb-4 transition-transform duration-300 ${hoveredBenefit === index ? 'scale-110' : ''}`}>
                    {benefit.icon}
                  </div>
                  <h3 className="neo-heading neo-heading-md mb-2">
                    {benefit.title}
                  </h3>
                  <p className="neo-text-muted text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="temoignages" className="neo-section" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-container">
          <div className="text-center mb-12">
            <h2 className="neo-heading neo-heading-lg mb-4">
              Ils nous font confiance
            </h2>
            <p className="neo-text-muted text-xl">
              Des témoignages authentiques de nos utilisateurs
            </p>
          </div>
          
          <div className="neo-grid neo-grid-2 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="neo-card">
                  <div className="text-3xl mb-4">{testimonial.emoji}</div>
                <blockquote className="neo-text text-lg mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                <cite className="font-medium" style={{ color: 'var(--neo-accent)' }}>
                    {testimonial.author}
                  </cite>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="neo-section" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-container">
          <div className="text-center mb-12">
            <h2 className="neo-heading neo-heading-lg mb-4">
              Questions fréquentes
            </h2>
            <p className="neo-text-muted text-xl">
              Tout ce que vous devez savoir sur Avenirea
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="neo-card"
                >
                  <AccordionTrigger className="px-6 py-4 text-left font-medium hover:no-underline" style={{ color: 'var(--neo-ink)' }}>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 neo-text-muted leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>


      <Footer onOpenCgvModal={() => setShowCgvModal(true)} />
    </div>
  );
};

export default Index;
