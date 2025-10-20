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
    <div className="min-h-screen" style={{ background: '#F9F8F4' }}>
      <Header />
      <CgvModal open={showCgvModal} onClose={() => setShowCgvModal(false)} />
      
      {/* Hero Section */}
      <section className="neo-section" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-container">
          <div className="animate-fade-in">
            <h1 className="hero-title text-center mb-3">
              Bilan de compétences
            </h1>
            
            <div className="flex justify-center mb-12">
              <span 
                className="text-xs font-bold px-3 py-1.5 inline-block"
                style={{ 
                  background: 'var(--neo-card-bg)', 
                  border: '2px solid var(--neo-line)',
                  borderRadius: '8px',
                  color: 'var(--neo-ink)',
                  boxShadow: '3px 3px 0 var(--neo-shadow)',
                  letterSpacing: '0.5px'
                }}
              >
                EN LIGNE
              </span>
            </div>
            
            <h2 className="hero-subtitle text-center mb-8">
              Découvrez votre profil, vos forces et les métiers qui vous correspondent.<br />
              Des tests simples et fiables pour choisir vos études, réussir votre reconversion ou faire le point sur votre carrière.
            </h2>
            
            <div className="hero-callout">
              <div className="hero-callout-content">
                <span className="hero-callout-icon">💡</span>
                <span className="font-bold">1 actif sur 3</span> souhaite changer de métier selon France Compétences.<br />
              </div>
            </div>
          </div>
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

      {/* Preview Section */}
      <section className="neo-section" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-container">
          <div className="text-center mb-16">
            <h2 className="neo-heading neo-heading-lg mb-4">
              Exemple de résultats pour un bilan d'orientation scolaire
            </h2>
            <div className="neo-badge inline-flex items-center gap-3 px-6 py-3">
              <span className="text-2xl">📊</span>
              <p className="font-medium">
                <span className="font-bold">Aperçu gratuit</span> de ce que vous obtiendrez - 
                <span style={{ color: 'var(--neo-accent)' }}> rapport complet disponible après le test !</span>
              </p>
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
                
                <div className="space-y-4">
                  <p className="font-bold text-xl text-primary">Des métiers concrets pour toi</p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Pas de théorie : découvre les jobs alignés avec qui tu es vraiment. 
                    Des suggestions précises avec les débouchés et salaires moyens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pause bien-être Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-purple-200 rounded-2xl px-6 py-3 shadow-sm mb-6">
                <span className="text-2xl">🎨</span>
                <h2 className="text-2xl md:text-3xl font-bold text-purple-900">
                  Pause bien-être
                </h2>
              </div>
              <p className="text-lg md:text-xl text-purple-800 max-w-3xl mx-auto leading-relaxed">
                <span className="font-semibold">Prends une vraie pause</span> • 
                <span className="text-purple-700"> Pose ton téléphone</span> • 
                <span className="text-purple-700"> Reconnecte-toi à toi-même</span>
              </p>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Image du livre */}
              <div className="flex-1 lg:max-w-md">
                <div className="relative group">
                  <div className="rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-rotate-1">
                    <img 
                      src="/cover-fr.png" 
                      alt="Cute & Cozy Worlds - Livre de coloriage pour la relaxation"
                      className="w-full h-auto rounded-xl shadow-lg"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    NOUVEAU
                  </div>
                </div>
              </div>

              {/* Contenu textuel */}
              <div className="flex-1 text-center lg:text-left">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-purple-900 mb-4">
                      Cute & Cozy Worlds
                    </h3>
                    <p className="text-lg text-purple-800 leading-relaxed mb-4">
                      <span className="font-semibold">Scientifiquement prouvé :</span> le coloriage réduit le stress de 68%, 
                      améliore la concentration et libère de la <span className="font-semibold text-pink-600">dopamine</span> - 
                      l'hormone du bien-être.
                    </p>
                    <p className="text-purple-700 leading-relaxed">
                      Un moment de <span className="font-semibold">créativité apaisante</span> pour ados, étudiants et adultes. 
                      Parfait pour une <span className="font-semibold">hygiène mentale simple et efficace</span>.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button 
                      onClick={() => window.open('https://www.amazon.fr/dp/B0FHW8CJ92', '_blank')}
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-white/20"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl">🎨</span>
                        <span>Acheter pour 7,99 €</span>
                      </span>
                    </Button>
                    
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                      <span className="text-lg">✨</span>
                      <span>Livraison gratuite Amazon Prime</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm">
                    <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-purple-700 font-medium">
                      🧠 Concentration
                    </span>
                    <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-purple-700 font-medium">
                      😌 Apaisement
                    </span>
                    <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-purple-700 font-medium">
                      🎯 Créativité
                    </span>
                    <span className="bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full text-purple-700 font-medium">
                      📱 Pause digitale
                    </span>
                  </div>
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
