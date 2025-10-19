import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CgvModal from "@/components/checkout/CgvModal";
import UserInfoModal from "@/components/UserInfoModal";
import { supabase } from "@/integrations/supabase/client";

const BilanPublic = () => {
  const navigate = useNavigate();
  const [showCgvModal, setShowCgvModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const testimonials = [
    {
      text: "Un test vraiment accessible qui m'a aidé à mieux comprendre mes options.",
      author: "Marie, 28 ans",
      emoji: "😊"
    },
    {
      text: "Parfait pour faire le point sur ma carrière sans engagement.",
      author: "Thomas, 45 ans",
      emoji: "👨‍💼"
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

  const handleStartTest = () => {
    setShowUserInfoModal(true);
  };

  const handleUserInfoSubmit = async (name: string, email: string) => {
    try {
      // Store in localStorage - the line will be created when test is completed
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('bilanType', 'public'); // Store the type

      console.log('User info stored in localStorage:', { name, email, type: 'public' });

      // Close modal and navigate to test
      setShowUserInfoModal(false);
      navigate('/test-riasec');
    } catch (error) {
      console.error('Error in handleUserInfoSubmit:', error);
      // Still navigate even if there's an error
      setShowUserInfoModal(false);
      navigate('/test-riasec');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F9F8F4' }}>
      <Header />
      <CgvModal open={showCgvModal} onClose={() => setShowCgvModal(false)} />
      <UserInfoModal 
        isOpen={showUserInfoModal} 
        onClose={() => setShowUserInfoModal(false)}
        onContinue={handleUserInfoSubmit}
      />
      
      {/* Hero Section with Background Image */}
      <section className="relative flex items-center justify-center" style={{ height: '50vh', minHeight: '400px', backgroundImage: 'url("/other.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 text-center text-white">
          <div className="animate-fade-in">
            <h1 className="hero-title text-white mb-6">
              Découvrez votre profil professionnel
            </h1>
            
            <h2 className="hero-subtitle text-white text-xl md:text-2xl mb-8">
              Pour tous les profils et tous les projets
            </h2>
            
            <button 
              onClick={handleStartTest}
              className="neo-button text-lg px-10 py-5"
            >
              <span className="flex items-center gap-2">
                <span>Commencer mon test maintenant</span>
                <span className="text-xl">🚀</span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="content-section">
        <div className="neo-container section-content">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title mb-8 text-center">
              Bilan de compétences tous publics
            </h2>
            
            <div className="space-y-6">
              <p className="section-text">
                <strong>Vous souhaitez mieux comprendre votre profil professionnel ?</strong> Notre bilan de compétences tous publics est conçu pour vous aider à identifier vos talents, explorer vos options et prendre des décisions éclairées sur votre avenir professionnel.
              </p>
            </div>

            <div className="mt-12 space-y-12">
              <div>
                <h3 className="section-subtitle mb-4">
                  À qui s'adresse ce bilan ?
                </h3>
                <div className="space-y-4">
                  <p className="section-text">
                    Ce bilan s'adresse à toute personne souhaitant faire le point sur son parcours professionnel. Que vous soyez étudiant, salarié, indépendant, demandeur d'emploi ou en reconversion, notre test vous aide à y voir plus clair sur vos possibilités.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="section-subtitle mb-4">
                  Notre approche
                </h3>
                <div className="space-y-4">
                  <p className="section-text">
                    Notre bilan utilise une méthodologie éprouvée basée sur le modèle RIASEC pour identifier votre profil professionnel. Simple, rapide et accessible, il vous donne une première vision claire de vos orientations professionnelles possibles.
                  </p>
                  <p className="section-text">
                    <strong>Objectif :</strong> vous donner les clés pour mieux comprendre qui vous êtes professionnellement et quelles voies vous correspondent.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="section-subtitle mb-4">
                  Pourquoi faire ce bilan ?
                </h3>
                <div className="space-y-4">
                  <ul className="space-y-3 list-disc list-inside max-w-[640px]">
                    <li className="section-text"><strong>Comprendre votre profil professionnel</strong> et vos modes de fonctionnement.</li>
                    <li className="section-text"><strong>Découvrir des métiers</strong> qui correspondent à votre personnalité.</li>
                    <li className="section-text"><strong>Identifier vos forces</strong> et vos axes de développement.</li>
                    <li className="section-text"><strong>Prendre des décisions éclairées</strong> sur votre avenir professionnel.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="section-subtitle mb-4">
                  Comment ça se passe ?
                </h3>
                <div className="space-y-4">
                  <p className="section-text">
                    C'est simple, rapide et 100 % en ligne.
                  </p>
                  <p className="section-text">
                    Vous répondez à une série de questions sur vos préférences professionnelles, vos intérêts et votre personnalité.
                  </p>
                  <p className="section-text">
                    En moins de 15 minutes, le test analyse vos réponses et vous révèle vos premiers résultats : votre profil RIASEC, vos points forts, et les familles de métiers qui vous correspondent.
                  </p>
                  <p className="section-text">
                    🎯 <strong>Instantanément, vous découvrez votre profil professionnel gratuit</strong> — une première vision claire de ce qui vous correspond.
                  </p>
                  <p className="section-text">
                    Et si vous voulez aller plus loin, vous pouvez débloquer votre profil complet : un rapport détaillé avec des suggestions de métiers, des recommandations de formations, et un plan d'action personnalisé.
                  </p>
                  <p className="section-text">
                    Aucun rendez-vous, aucun formulaire compliqué — juste vous, vos réponses, et une vision claire de vos possibilités professionnelles.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="section-subtitle mb-4">
                  Durée & format
                </h3>
                <div className="space-y-4">
                  <p className="section-text">
                    Un test court, <strong>100% en ligne</strong>, accessible à tout moment. Vous pouvez le faire à votre rythme, depuis votre ordinateur ou votre téléphone.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="section-subtitle mb-4">
                  Ce que vous gagnez
                </h3>
                <div className="space-y-4">
                  <ul className="space-y-3 list-disc list-inside max-w-[640px]">
                    <li className="section-text">Une <strong>meilleure connaissance de vous-même</strong> sur le plan professionnel.</li>
                    <li className="section-text">Des <strong>pistes de métiers concrètes</strong> adaptées à votre profil.</li>
                    <li className="section-text">Une <strong>vision claire</strong> de vos options professionnelles.</li>
                    <li className="section-text">Un <strong>point de départ solide</strong> pour vos décisions de carrière.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="neo-section" style={{ background: 'var(--neo-bg)' }}>
        <div className="neo-container">
          <div className="text-center mb-16">
            <h2 className="neo-heading neo-heading-lg mb-4">
              Ce que tu vas découvrir
            </h2>
            <div className="neo-badge inline-flex items-center gap-3 px-6 py-3">
              <span className="text-2xl">📊</span>
              <p className="font-medium">
                <span className="font-bold">Un test validé</span> par des milliers d'utilisateurs - 
                <span style={{ color: 'var(--neo-accent)' }}> découvre ton profil maintenant !</span>
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
                  <p className="font-bold text-xl" style={{ color: 'var(--neo-accent)' }}>Découvre ton profil unique</p>
                  <p className="neo-text-muted text-lg leading-relaxed">
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
                  <p className="font-bold text-xl" style={{ color: 'var(--neo-accent)' }}>Visualise tes points forts</p>
                  <p className="neo-text-muted text-lg leading-relaxed">
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
                  <p className="font-bold text-xl" style={{ color: 'var(--neo-accent)' }}>Des métiers concrets pour toi</p>
                  <p className="neo-text-muted text-lg leading-relaxed">
                    Pas de théorie : découvre les jobs alignés avec qui tu es vraiment. 
                    Des suggestions précises avec les débouchés et salaires moyens.
                  </p>
                </div>
              </div>
            </div>
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
              Tout ce que vous devez savoir sur notre bilan
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

export default BilanPublic;

